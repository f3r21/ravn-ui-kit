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
  const variants: Record<StatusTone, string> = {
    neutral: 'bg-surface-neutral text-neutral-4 border-subtle',
    success: 'bg-success-1 text-success-4 border-success-2',
    warning: 'bg-warning-1 text-warning-5 border-warning-2',
    danger: 'bg-danger-1 text-danger border-danger-2',
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
