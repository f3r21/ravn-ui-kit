import { cn } from '../../utils/cn';
import type { StatusTone } from '../../types/color-variants';

export interface BadgeProps {
  /**
   * What the badge's state *means*, on the design's status ramps.
   *
   * Deliberately a different vocabulary from `Tag`'s `AccentColor`: these resolve to the
   * palette's `Success`/`Warning`/`Danger` ramps, which are separate from and not equal to
   * `Secondary`/`Tertiary`/`Primary` (`success-4` `#80DA5B` is not `secondary-4` `#70B252`;
   * `danger-5` `#E82F39` is not `primary-4` `#DA584B`). Reach for `Tag` when the colour is
   * a category with no meaning attached, and `Badge` when it is a status.
   * @default 'neutral'
   */
  variant?: StatusTone;
  /** Badge label / content. */
  children: React.ReactNode;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  // Same shape of problem as `Tag`, and the same resolution: the pale step-1 fill and the
  // saturated same-hue label were never far enough apart to read. Measured on the fill
  // each label actually sits on, `success-4` was **1.69:1**, `warning-5` **2.34:1** and
  // `danger-5` **3.90:1** — six more of the 131 contrast violations, and the only group
  // not in the audit's ranked table, because `Badge` renders in few stories rather than
  // because it was any closer to passing. Fills and borders are untouched.
  //
  // Warning and danger need no invention: their ramps already carry a dark step for
  // exactly this, and `tokens.css` has had both all along — `warning-6` clears 6.10:1 and
  // `danger-6` 7.04:1 on their own fills.
  //
  // Success has no step 6. Its ramp stops at 4 (`#80DA5B`) and there is no other dark
  // green in the palette — `secondary-4`, the closest, manages 2.50:1 on `success-1`. So
  // its label falls back to `neutral-4`, the same colour the `neutral` variant already
  // uses (13.09:1), and the green fill carries the status on its own. That is a palette
  // gap rather than a component decision, and it is recorded as one in
  // `MIGRATION_GAPS.md`: the honest fix is a `success-6` from the design.
  const variants: Record<StatusTone, string> = {
    neutral: 'bg-surface-neutral text-neutral-4 border-subtle',
    success: 'bg-success-1 text-neutral-4 border-success-2',
    warning: 'bg-warning-1 text-warning-6 border-warning-2',
    danger: 'bg-danger-1 text-danger-6 border-danger-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border font-sans',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
