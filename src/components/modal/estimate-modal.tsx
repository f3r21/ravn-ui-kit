import { cn } from '../../utils/cn';
import { Popover, type PopoverProps } from '../popover/popover';

// Figma "Estimate Modal" (Task Column01.md L1800-2231) shows exactly 5 rows, all sharing the
// literal placeholder text "0 Points" but with 5 distinct widths (57/54/56/57/57px) — read as 5
// story-point values rather than one value repeated 5 times. Width 54 (shortest) is singular
// ("1 Point"); the other 4 (~56-57px, all plural) match the classic Fibonacci-style scale.
const POINT_OPTIONS = [1, 2, 3, 5, 8];

const PointsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden>
    <path d="M6 21V4a1 1 0 0 1 1-1h10.5a1 1 0 0 1 .8 1.6L15 9l3.3 4.4a1 1 0 0 1-.8 1.6H7" />
  </svg>
);

export interface EstimateModalProps {
  /** Currently selected point value, if any — highlights the matching row. */
  value?: number;
  /** Called with the point value of the row the user clicked. */
  onSelect: (points: number) => void;
  /** Called when the popover should close without a selection — Escape or an outside click. */
  onClose: () => void;
  /** Ref to the trigger button that opens this popover — see `Popover`'s `triggerRef`. */
  triggerRef?: PopoverProps['triggerRef'];
  /** Additional class names, merged last via `cn()` so they can override defaults (e.g. absolute positioning). */
  className?: string;
}

/**
 * EstimateModal
 *
 * Figma: "Estimate Modal" COMPONENT inside "Task Column" frame (Task Column01.md L1800-2231).
 * A small anchored popover (122×208, neutral-3 bg, 1px neutral-2 border, 8px radius) — not a
 * centered dialog, so unlike the shared `Modal` shell this has no backdrop/close chrome: the
 * parent conditionally mounts it, same convention as `DatePickerMenu`. Built on the shared
 * `Popover` primitive (see that file's doc comment) for real Escape/outside-click dismissal and
 * focus management, previously missing entirely. Anatomy is a decorative header label (Figma's
 * "Input text" placeholder style, Desktop/Body/XL/bold, neutral-2) followed by 5 point-value rows
 * (icon + label, 4px/16px padding, 4px radius, no background by default) with no footer —
 * clicking a row is the confirm action.
 */
export function EstimateModal({ value, onSelect, onClose, triggerRef, className }: EstimateModalProps) {
  return (
    <Popover
      isOpen
      onClose={onClose}
      triggerRef={triggerRef}
      aria-label="Estimate"
      className={cn(
        'flex flex-col w-[122px] py-2 bg-surface-overlay border border-subtle rounded-sm',
        className
      )}
    >
      <div className="flex items-center h-8 px-4">
        <span className="text-body-xl font-semibold text-muted font-sans whitespace-nowrap">
          Estimate
        </span>
      </div>
      {POINT_OPTIONS.map(points => (
        <button
          key={points}
          type="button"
          onClick={() => onSelect(points)}
          aria-pressed={value === points}
          className={cn(
            'flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2',
            value === points ? 'bg-neutral-2' : 'hover:bg-neutral-2'
          )}
        >
          <span className="w-6 h-6 shrink-0">
            <PointsIcon />
          </span>
          <span className="whitespace-nowrap">
            {points} Point{points !== 1 ? 's' : ''}
          </span>
        </button>
      ))}
    </Popover>
  );
}
