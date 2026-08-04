import { cn } from '../../utils/cn';

export interface TagProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

export function Tag({
  variant = 'neutral',
  children,
  onRemove,
  className,
}: TagProps) {
  const variants = {
    neutral: 'bg-neutral-1 text-neutral-4 border-neutral-2',
    primary: 'bg-primary-1 text-primary-4 border-primary-2',
    secondary: 'bg-secondary-1 text-secondary-4 border-secondary-2',
    tertiary: 'bg-tertiary-1 text-tertiary-4 border-tertiary-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border tracking-wide uppercase font-sans select-none',
        variants[variant],
        className
      )}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Eliminar tag"
          className="hover:opacity-75 focus:outline-none cursor-pointer"
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
