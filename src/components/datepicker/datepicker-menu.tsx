import { useState } from 'react';
import { cn } from '../../utils/cn';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export interface DatePickerMenuProps {
  /**
   * Currently selected date. Passing this makes the component controlled;
   * pair it with `onChange` to update the selection.
   */
  value?: Date;
  /** Initial selected date when the component is uncontrolled. */
  defaultValue?: Date;
  /** Called with the newly selected date when the user clicks a day. */
  onChange?: (date: Date) => void;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * DatePickerMenu
 *
 * Figma: "DatePicker / Menu" COMPONENT inside "Datepicker" frame.
 * - Background: neutral-5 (#222528), border: 1px solid neutral-2 (#94979A), border-radius: 4px
 * - Header: month/year navigation with prev/next arrows; label is SF Pro Text Semibold 14px, text-neutral-1
 * - Day grid: 7 columns (Sun–Sat); each day cell ("DatePicker / Menu Item") is 24x24 with border-radius: 2px
 *   (a near-square corner, not a circle) and font-weight 400 (regular) in every observed instance
 * - Selected day: bg-primary-4 (#DA584B), text neutral-1, rounded-xs -- NOTE: this specific export has no
 *   distinct "selected" (filled) day-cell instance to verify against; only "today" (bordered) and plain/muted
 *   states are present, so this line is unconfirmed against Datepicker.md and should be double-checked
 *   against a live "Selected" variant if one exists in Figma.
 * - Today: border 1px solid primary-4 (#DA584B), text-neutral-1, font-normal (NOT text-primary-4/font-bold)
 * - Other month days: text-neutral-2 (muted, solid #94979A -- Figma shows no opacity reduction)
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

  // Build day grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month overflow
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      date: new Date(viewYear, viewMonth - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(viewYear, viewMonth, d), isCurrentMonth: true });
  }

  // Next month overflow (fill to complete last row)
  let next = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(viewYear, viewMonth + 1, next++), isCurrentMonth: false });
  }

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div
      className={cn(
        // bg-neutral-5, border-neutral-2, rounded (4px) and w-[280px] match Figma
        // "DatePicker / Menu": background #222528, border 1px solid #94979A,
        // border-radius: 4px, width: 280px.
        'flex flex-col gap-4 p-4 bg-neutral-5 rounded shadow-lg border border-neutral-2 w-[280px] select-none',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Mes anterior"
          // text-neutral-1 matches Figma "Icon / Outlined / Left" vector fill: #FFFFFF
          className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-1 hover:bg-neutral-3 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* font-semibold matches Figma "Dec 2020" label: font-weight 600 (Semibold/14px | 22px) */}
        <span className="font-sans font-semibold text-sm text-neutral-1">
          {MONTHS[viewMonth]} {viewYear}
        </span>

        <button
          type="button"
          onClick={nextMonth}
          aria-label="Mes siguiente"
          // text-neutral-1 matches Figma "Icon / Outlined / Right" vector fill: #FFFFFF
          className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-1 hover:bg-neutral-3 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-0">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-neutral-2 uppercase tracking-wider py-1">
            {d}
          </div>
        ))}

        {/* Day cells */}
        {cells.map(({ date, isCurrentMonth }, idx) => {
          const isSelected = selected ? isSameDay(date, selected) : false;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => select(date)}
              aria-label={date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
              aria-pressed={isSelected}
              className={cn(
                // w-6 h-6 (24px) and rounded-xs (2px) match Figma "DatePicker / Menu Item":
                // width/height: 24px, border-radius: 2px -- a near-square cell, not a circle.
                'flex items-center justify-center w-6 h-6 mx-auto rounded-xs text-sm font-sans transition-all cursor-pointer',
                isSelected
                  ? 'bg-primary-4 text-neutral-1'
                  : isToday
                  ? // matches Figma "today" instance: border 1px solid primary-4 (#DA584B),
                    // text-neutral-1 (#FFFFFF), font-normal -- not text-primary-4/font-bold
                    'border border-primary-4 text-neutral-1 hover:bg-neutral-3'
                  : isCurrentMonth
                  ? 'text-neutral-1 hover:bg-neutral-3'
                  : // text-neutral-2 (solid #94979A) matches Figma; no opacity reduction observed
                    'text-neutral-2 hover:bg-neutral-3/50'
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
