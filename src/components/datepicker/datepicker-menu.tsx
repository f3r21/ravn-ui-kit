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
 * - Background: neutral-4 (#2C2F33), border-radius: 12px
 * - Header: month/year navigation with prev/next arrows
 * - Day grid: 7 columns (Sun–Sat)
 * - Selected day: bg-primary-4 (#DA584B), text neutral-1, rounded-full
 * - Today: text-primary-4, font-bold
 * - Other month days: text-neutral-2/50 (muted)
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
        'flex flex-col gap-4 p-4 bg-neutral-4 rounded-xl shadow-lg border border-neutral-3/30 w-72 select-none',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Mes anterior"
          className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-2 hover:bg-neutral-3 hover:text-neutral-1 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <span className="font-sans font-bold text-sm text-neutral-1">
          {MONTHS[viewMonth]} {viewYear}
        </span>

        <button
          type="button"
          onClick={nextMonth}
          aria-label="Mes siguiente"
          className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-2 hover:bg-neutral-3 hover:text-neutral-1 transition-colors cursor-pointer"
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
                'flex items-center justify-center w-9 h-9 mx-auto rounded-full text-sm font-sans transition-all cursor-pointer',
                isSelected
                  ? 'bg-primary-4 text-neutral-1 font-bold'
                  : isToday
                  ? 'text-primary-4 font-bold hover:bg-neutral-3'
                  : isCurrentMonth
                  ? 'text-neutral-1 hover:bg-neutral-3'
                  : 'text-neutral-2/40 hover:bg-neutral-3/50'
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
