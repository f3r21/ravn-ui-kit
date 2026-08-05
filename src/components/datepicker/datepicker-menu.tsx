import { useRef } from 'react';
import {
  CalendarDate,
  createCalendar,
  getLocalTimeZone,
  isSameMonth,
  today,
} from '@internationalized/date';
import { useButton, useCalendar, useCalendarCell, useCalendarGrid } from 'react-aria';
import { useCalendarState, type CalendarState } from 'react-stately';
import { cn } from '../../utils/cn';
import { Popover, type PopoverProps } from '../popover/popover';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../icons/icons';

function toCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function toNativeDate(date: CalendarDate): Date {
  return date.toDate(getLocalTimeZone());
}

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
  /** Called when the popover should close without a selection — Escape or an outside click. */
  onClose: () => void;
  /** Ref to the trigger button that opens this popover — see `Popover`'s `triggerRef`. */
  triggerRef?: PopoverProps['triggerRef'];
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * DatePickerMenu
 *
 * Deliberately has **no `error`/`description`/`isRequired` surface**, unlike `Input`,
 * `Datepicker`, `Select`, `MultiSelect` and `LabelCheckbox`. It is a floating calendar
 * panel with no label and no trigger of its own — the consumer owns the trigger and
 * passes a `triggerRef`. A validation message rendered inside this popover would sit in a
 * surface that disappears the moment the user dismisses it, and would be announced from a
 * `role="dialog"` rather than from the field it belongs to. The error belongs on whatever
 * field owns the trigger; wrap that in `FormField` (or use `Datepicker`, which is the
 * text-input variant and takes `error` directly).
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
 *   permanently-hidden ("display: none") search icon slot. Confirmed via direct Figma
 *   inspection (Dev Mode "Content" field, not just the layer's name -- the static CSS export
 *   only captured the layer name "Button" and couldn't distinguish it from actual rendered
 *   text) that the button's real content is literally "Today", matching the "jump to today"
 *   behavior already implemented -- this was a correct guess, now a confirmed fact.
 *
 * Accessibility: built on the shared `Popover` primitive (see that file's doc comment) plus
 * react-stately's `useCalendarState` + react-aria's `useCalendar`/`useCalendarGrid`/
 * `useCalendarCell` for the day grid — previously a fully hand-rolled 42-individually-tabbed-
 * button grid with no `role="grid"`/`role="gridcell"` and no arrow-key navigation. The month-nav
 * chevrons use `useCalendar`'s `prevButtonProps`/`nextButtonProps`; the year-nav chevrons (which
 * react-aria's calendar hooks have no built-in equivalent for) call
 * `state.focusPreviousSection(true)`/`focusNextSection(true)` directly, the same "jump by the
 * next larger unit" primitive `Shift+PageUp`/`Shift+PageDown` use internally.
 *
 * One deliberate behavior change from adopting real calendar semantics: lead/trail days from
 * adjacent months (`isOutsideMonth`) are now non-interactive (not focusable, not selectable) —
 * react-aria's `useCalendarCell` treats `isOutsideMonth` cells as disabled by design, matching
 * how most calendar widgets treat context-only adjacent-month days. Previously every one of the
 * 42 cells was independently clickable/selectable regardless of month; that was never confirmed
 * against Figma (only the dimmed *styling* of those cells is spec'd), so trading it for
 * correct, standard grid semantics is a net accessibility improvement, not a regression against
 * verified spec.
 */
export function DatePickerMenu({
  value: controlledValue,
  defaultValue,
  onChange,
  onClose,
  triggerRef,
  className,
}: DatePickerMenuProps) {
  const valueProps =
    controlledValue !== undefined
      ? { value: toCalendarDate(controlledValue) }
      : { defaultValue: defaultValue ? toCalendarDate(defaultValue) : null };

  const state = useCalendarState({
    ...valueProps,
    onChange: (date: CalendarDate) => onChange?.(toNativeDate(date)),
    createCalendar,
    // Hardcoded, matching the prior implementation's hardcoded English
    // MONTHS/DAYS arrays — no `I18nProvider`/locale story exists in this kit
    // yet, so introducing locale-dependent formatting here would be an
    // unverified behavior change, not a fix.
    locale: 'en-US',
    firstDayOfWeek: 'sun',
    weeksInMonth: 6,
  });

  const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    { 'aria-label': 'Date picker' },
    state,
  );

  const prevMonthRef = useRef<HTMLButtonElement>(null);
  const nextMonthRef = useRef<HTMLButtonElement>(null);
  const { buttonProps: prevMonthProps } = useButton(prevButtonProps, prevMonthRef);
  const { buttonProps: nextMonthProps } = useButton(nextButtonProps, nextMonthRef);

  const goToday = () => {
    const todayDate = today(getLocalTimeZone());
    state.setFocusedDate(todayDate);
    state.selectDate(todayDate);
  };

  return (
    <Popover
      isOpen
      onClose={onClose}
      triggerRef={triggerRef}
      aria-label="Date picker"
      className={cn(
        'flex flex-col w-[280px] bg-surface-shell border border-subtle rounded-4 shadow-elevation select-none',
        className,
      )}
    >
      <div {...calendarProps} className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-[9px] h-10">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => state.focusPreviousSection(true)}
              aria-label="Previous year"
              className="flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs"
            >
              <ChevronDoubleLeftIcon className="w-4 h-4" />
            </button>
            <button
              {...prevMonthProps}
              ref={prevMonthRef}
              aria-label="Previous month"
              className="flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
          </div>

          <span className="font-sans font-semibold text-body-sm text-main">
            {state.visibleRange.start
              .toDate(getLocalTimeZone())
              .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>

          <div className="flex items-center gap-1">
            <button
              {...nextMonthProps}
              ref={nextMonthRef}
              aria-label="Next month"
              className="flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => state.focusNextSection(true)}
              aria-label="Next year"
              className="flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs"
            >
              <ChevronDoubleRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-neutral-2" />

        {/* Content */}
        <CalendarGrid state={state} />
      </div>

      <div className="h-px w-full bg-neutral-2" />

      {/* Footer */}
      <div className="flex items-center justify-center py-[9px] h-10">
        <button
          type="button"
          onClick={goToday}
          className="text-body-sm font-normal font-sans text-interactive-text hover:opacity-80 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-xs"
        >
          Today
        </button>
      </div>
    </Popover>
  );
}

function CalendarGrid({ state }: { state: CalendarState }) {
  const { gridProps, headerProps, weekDays, weeksInMonth } = useCalendarGrid(
    { weekdayStyle: 'short' },
    state,
  );
  const currentMonth = state.visibleRange.start;

  return (
    <div {...gridProps} className="flex flex-col px-3 py-2">
      <div {...headerProps} className="grid grid-cols-7">
        {weekDays.map((day, i) => (
          <span key={i} className="text-center text-body-sm font-normal text-main font-sans">
            {day}
          </span>
        ))}
      </div>

      {Array.from({ length: weeksInMonth }, (_, weekIndex) => (
        <div key={weekIndex} role="row" className="grid grid-cols-7">
          {state
            .getDatesInWeek(weekIndex)
            .map((date, i) =>
              date ? (
                <CalendarCell
                  key={date.toString()}
                  state={state}
                  date={date}
                  currentMonth={currentMonth}
                />
              ) : (
                <div key={i} role="gridcell" aria-hidden="true" />
              ),
            )}
        </div>
      ))}
    </div>
  );
}

function CalendarCell({
  state,
  date,
  currentMonth,
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isOutsideMonth = !isSameMonth(date, currentMonth);
  const { cellProps, buttonProps, isSelected, isDisabled, formattedDate } = useCalendarCell(
    { date, isOutsideMonth },
    state,
    ref,
  );

  return (
    <div {...cellProps} className="flex items-center justify-center my-[3px]">
      <div
        {...buttonProps}
        ref={ref}
        className={cn(
          'flex items-center justify-center w-6 h-6 rounded-2 text-body-sm font-normal font-sans transition-colors focus-visible:outline-2 focus-visible:outline-primary-4',
          isDisabled
            ? 'text-muted cursor-default'
            : isSelected
              ? 'border border-primary-4 text-main cursor-pointer'
              : 'text-main hover:bg-neutral-3 cursor-pointer',
        )}
      >
        {formattedDate}
      </div>
    </div>
  );
}
