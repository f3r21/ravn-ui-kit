import { cn } from '../../utils/cn';

export interface TagProps {
  /**
   * Color type of the tag.
   * @default 'neutral'
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'blue';
  /**
   * Renders the "Style=Outline" variant (border, transparent fill) instead of
   * the default "Style=Solid" (10%-alpha fill, no border).
   * @default false
   */
  outline?: boolean;
  /**
   * Optional leading icon (Figma "Icon=Left" slot, 24×24px). Should use
   * `currentColor` for its fill/stroke so it inherits the tag's variant color.
   */
  icon?: React.ReactNode;
  /** Tag label content. */
  children: React.ReactNode;
  /** Called when the remove (×) button is pressed. When provided, a remove button is rendered. */
  onRemove?: () => void;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/** Compact labeled pill (Style=Solid/Outline × Icon=None/Left × Type=General/Green/Blue/Yellow/Red), optionally removable via a trailing "×" button. */
export function Tag({
  variant = 'neutral',
  outline = false,
  icon,
  children,
  onRemove,
  className,
}: TagProps) {
  // Style=Solid: 10%-alpha fill, no border. Style=Outline: 1px border, transparent
  // fill. "general" (neutral) is the only type where the fill tint (neutral.2)
  // and the foreground (neutral.1/white) diverge from the same swatch - matches
  // Tags00/01.md exactly.
  const styles = {
    neutral: {
      solid: 'bg-neutral-2/10 text-main',
      outline: 'border border-neutral-1 text-main',
    },
    // text-primary-4 kept raw here, not aliased to `text-interactive` — this is Tag's own
    // categorical "primary" color variant (parallel to secondary/tertiary/blue), not an
    // interactive affordance; aliasing it would wrongly imply every primary-colored tag is
    // interactive.
    primary: {
      solid: 'bg-primary-4/10 text-primary-4',
      outline: 'border border-primary-4 text-primary-4',
    },
    secondary: {
      solid: 'bg-secondary-4/10 text-secondary-4',
      outline: 'border border-secondary-4 text-secondary-4',
    },
    tertiary: {
      solid: 'bg-tertiary-4/10 text-tertiary-4',
      outline: 'border border-tertiary-4 text-tertiary-4',
    },
    blue: {
      solid: 'bg-blue/10 text-blue',
      outline: 'border border-blue text-blue',
    },
  };

  return (
    <span
      className={cn(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Tag" component exactly (Style=Solid/Outline,
        // all Type variants, Tags00/01.md). Typography: Desktop/Body/M/bold - SF Pro
        // Display, 15px/24px, letter-spacing 0.75px (tracking-wider @ 15px), weight 600.
        'inline-flex items-center gap-2 px-4 py-1 text-body-m font-semibold rounded font-sans select-none',
        outline ? styles[variant].outline : styles[variant].solid,
        className
      )}
    >
      {icon ? (
        <span className="flex items-center justify-center w-6 h-6 shrink-0">{icon}</span>
      ) : null}
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove tag"
          className="hover:opacity-75 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs"
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
