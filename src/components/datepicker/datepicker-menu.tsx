import { useState } from 'react';
import { cn } from '../../utils/cn';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const ChevronLeftIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const ChevronDoubleLeftIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m18 18-6-6 6-6M12 18l-6-6 6-6" />
  </svg>
);

const ChevronDoubleRightIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m6 18 6-6-6-6M12 18l6-6-6-6" />
  </svg>
);

export interface DatePickerMenuProps {
  /**
   * Currently selected date. Passing this makes the component controlled;
   * pair it with `onChange` to update the selection.
   */
  value?: Date;
  /** Initial selected date when the component is uncontrolled. */
  defaultValue?: Date;
  /** Called with the newly selected date when the user clicks a day or the "Today" footer action. */
  onChange?: (date: Date) => void;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * DatePickerMenu
 *
 * Figma: "DatePicker / Menu" component (Components/Datepicker.md), confirmed as the real desktop
 * component via 3 real in-context instances (Mockups/Task Add Task/Add Task Modal05.md,
 * Mockups/Dashboard Add Task/Add Task Modal05.md, Mockups/Dashboard Edit Task/Add Task Modal06.md)
 * -- all pixel-identical to the isolated doc export. `Date Picker.md`'s 320x472 DM-Sans "hero"
 * variant only ever appears in the mobile-Android mockup tree (out of scope) and never in any
 * desktop screen, confirming the existing `typography.mdx` note that it doesn't back a shipped
 * component -- this file is the real target.
 *
 * - 280px wide, bg-neutral-5, border-neutral-2, rounded-4 (4px), shadow-elevation (3-layer)
 * - Header: 4 nav icons (double-chevron = year, single chevron = month) flanking a centered
 *   "Month YYYY" label (SF Pro Text Semibold 14px/22px) -- the prior implementation only had
 *   month nav; year nav (DoubleLeft/DoubleRight) was missing entirely
 * - Weekday row (Sun-Sat) + a fixed 6-week grid (spec's Content frame is a fixed 226px for
 *   8px/12px padding + 7 rows @ 30px, i.e. always 6 week-rows regardless of month length)
 * - Day cells: 24x24, rounded-2 (2px), SF Pro Text Regular 14px/22px; neutral-1 for the viewed
 *   month, neutral-2 for lead/trail days from adjacent months
 * - The single real highlighted-cell instance in spec is a 1px solid primary-4 border,
 *   rounded-2 -- no filled/bg-primary-4 cell instance exists anywhere in the export. The prior
 *   implementation had two competing unverified treatments (bg-primary-4 "selected" + bordered
 *   "today"); resolved to the one verified treatment (border only) applied to the selected date.
 * - Two full-width 1px neutral-2 dividers (header/content, content/footer) were missing entirely.
 * - Footer: centered text-only button, primary-4, SF Pro Text Regular 14px/22px, with a
 *   permanently-hidden ("display: none") search icon slot. Its label renders as the literal
 *   layer name "Button" in all 3 real instances (never customized), so the exact wording is
 *   unverified -- interpreted as the standard "jump to today" action, the most conservative
 *   fit for a lone accent-colored footer button in a due-date picker (same class of judgment
 *   call as Chunk 10's Frame 648 clear-search interpretation).
 */
export function DatePickerMenu({
  value: controlledValue,
  defaultValue,
  onChange,
  className,
}: DatePickerMenuProps) {
  const today = new Date();

  const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const selected = isControlled ? controlledValue : internalValue;

  const [viewYear, setViewYear] = useState(
    (selected ?? today).getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    (selected ?? today).getMonth()
  );

  const select = (date: Date) => {
    if (!isControlled) setInternalValue(date);
    onChange?.(date);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const prevYear = () => setViewYear(y => y - 1);
  const nextYear = () => setViewYear(y => y + 1);

  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    select(today);
  };

  // Build a fixed 6-week (42-cell) day grid, matching the spec's fixed 226px Content height.
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      date: new Date(viewYear, viewMonth - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(viewYear, viewMonth, d), isCurrentMonth: true });
  }

  let next = 1;
  while (cells.length < 42) {
    cells.push({ date: new Date(viewYear, viewMonth + 1, next++), isCurrentMonth: false });
  }

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div
      className={cn(
        'flex flex-col w-[280px] bg-neutral-5 border border-neutral-2 rounded-4 shadow-elevation select-none',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-[9px] h-10">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevYear}
            aria-label="Previous year"
            className="flex items-center justify-center w-4 h-4 text-neutral-1 hover:text-primary-4 transition-colors cursor-pointer"
          >
            <ChevronDoubleLeftIcon />
          </button>
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Previous month"
            className="flex items-center justify-center w-4 h-4 text-neutral-1 hover:text-primary-4 transition-colors cursor-pointer"
          >
            <ChevronLeftIcon />
          </button>
        </div>

        <span className="font-sans font-semibold text-sm leading-[22px] text-neutral-1">
          {MONTHS[viewMonth]} {viewYear}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="flex items-center justify-center w-4 h-4 text-neutral-1 hover:text-primary-4 transition-colors cursor-pointer"
          >
            <ChevronRightIcon />
          </button>
          <button
            type="button"
            onClick={nextYear}
            aria-label="Next year"
            className="flex items-center justify-center w-4 h-4 text-neutral-1 hover:text-primary-4 transition-colors cursor-pointer"
          >
            <ChevronDoubleRightIcon />
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-neutral-2" />

      {/* Content */}
      <div className="flex flex-col px-3 py-2">
        <div className="grid grid-cols-7">
          {DAYS.map(d => (
            <span key={d} className="text-center text-sm leading-[22px] font-normal text-neutral-1 font-sans">
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map(({ date, isCurrentMonth }, idx) => {
            const isSelected = selected ? isSameDay(date, selected) : false;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => select(date)}
                aria-label={date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                aria-pressed={isSelected}
                className={cn(
                  'flex items-center justify-center w-6 h-6 mx-auto my-[3px] rounded-2 text-sm leading-[22px] font-normal font-sans transition-colors cursor-pointer',
                  isSelected
                    ? 'border border-primary-4 text-neutral-1'
                    : isCurrentMonth
                    ? 'text-neutral-1 hover:bg-neutral-3'
                    : 'text-neutral-2 hover:bg-neutral-3/50'
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px w-full bg-neutral-2" />

      {/* Footer */}
      <div className="flex items-center justify-center py-[9px] h-10">
        <button
          type="button"
          onClick={goToday}
          className="text-sm leading-[22px] font-normal font-sans text-primary-4 hover:opacity-80 transition-opacity cursor-pointer"
        >
          Today
        </button>
      </div>
    </div>
  );
}
