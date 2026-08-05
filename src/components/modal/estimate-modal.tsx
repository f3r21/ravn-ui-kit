import { cn } from '../../utils/cn';
import { Popover, type PopoverProps } from '../popover/popover';
import { PointsIcon } from '../icons/icons';

// Figma "Estimate Modal" (Task Column01.md L1800-2231) shows exactly 5 rows, all sharing the
// literal placeholder text "0 Points" but with 5 distinct widths (57/54/56/57/57px) — read as 5
// story-point values rather than one value repeated 5 times. Width 54 (shortest) is singular
// ("1 Point"); the other 4 (~56-57px, all plural) match the classic Fibonacci-style scale.
const POINT_OPTIONS = [1, 2, 3, 5, 8];

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
export function EstimateModal({
  value,
  onSelect,
  onClose,
  triggerRef,
  className,
}: EstimateModalProps) {
  return (
    <Popover
      isOpen
      onClose={onClose}
      triggerRef={triggerRef}
      aria-label="Estimate"
      className={cn(
        'flex flex-col w-[122px] py-2 bg-surface-overlay border border-subtle rounded-sm',
        className,
      )}
    >
      <div className="flex items-center h-8 px-4">
        {/* `--color-muted-on-dark`, not `--color-muted`: this popover is `surface-overlay`,
            where neutral-2 measures 3.73:1. Same call as FIELD_DESCRIPTION_CLASS. */}
        <span className="text-body-xl font-semibold text-muted-on-dark font-sans whitespace-nowrap">
          Estimate
        </span>
      </div>
      {POINT_OPTIONS.map((points) => (
        <button
          key={points}
          type="button"
          onClick={() => onSelect(points)}
          aria-pressed={value === points}
          className={cn(
            'flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2',
            // `text-neutral-5` wherever the row's fill is a solid `neutral-2`: white on
            // that fill is 2.94:1, and it applies to the hover state as much as the
            // selected one. Only the selected case was visible to axe — a static story
            // has no hover.
            value === points
              ? 'bg-neutral-2 text-neutral-5'
              : 'hover:bg-neutral-2 hover:text-neutral-5',
          )}
        >
          <span className="w-6 h-6 shrink-0">
            <PointsIcon className="size-6" />
          </span>
          <span className="whitespace-nowrap">
            {points} Point{points !== 1 ? 's' : ''}
          </span>
        </button>
      ))}
    </Popover>
  );
}
