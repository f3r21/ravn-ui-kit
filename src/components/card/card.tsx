import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card content. */
  children: React.ReactNode;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        'p-5 bg-neutral-1 border border-neutral-2 rounded-lg shadow-xs transition-shadow hover:shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}
