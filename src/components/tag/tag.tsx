import { cn } from '../../utils/cn';

export interface TagProps {
  /**
   * Visual color style of the tag.
   * @default 'neutral'
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
  /** Tag label content. */
  children: React.ReactNode;
  /** Called when the remove (×) button is pressed. When provided, a remove button is rendered. */
  onRemove?: () => void;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/** Compact labeled pill, optionally removable via a trailing "×" button. */
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
        // padding: 4px 16px, gap: 8px, border-radius: 4px -- matches Figma "Tag" component exactly
        // (Style=Solid/Outline, all Type variants, Tags00/Tags01). 4px doesn't match any --radius-*
        // token (smallest is --radius-sm at 8px) but is exactly Tailwind's own unmodified default
        // `rounded` step, used directly rather than inventing a new named token.
        'inline-flex items-center gap-2 px-4 py-1 text-xs font-semibold rounded border tracking-wide uppercase font-sans select-none',
        variants[variant],
        className
      )}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove tag"
          className="hover:opacity-75 focus:outline-none cursor-pointer"
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
