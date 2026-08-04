import { cn } from '../../utils/cn';

export interface BadgeProps {
  /**
   * Visual style of the badge.
   * @default 'neutral'
   */
  variant?: 'neutral' | 'success' | 'warning' | 'danger';
  /** Badge label / content. */
  children: React.ReactNode;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  const variants = {
    neutral: 'bg-neutral-1 text-neutral-4 border-neutral-2',
    success: 'bg-success-1 text-success-4 border-success-2',
    warning: 'bg-warning-1 text-warning-5 border-warning-2',
    danger: 'bg-danger-1 text-danger-5 border-danger-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border font-sans',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
