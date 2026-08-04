import { cn } from '../../utils/cn';

export interface AvatarProps {
  /** Image URL to render. Falls back to initials derived from `name` when omitted. */
  src?: string;
  /** Full name used for the fallback initials and the image `alt` text. */
  name?: string;
  /**
   * Controls the avatar's width, height, and initials font size.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/** Circular user avatar that shows an image, or initials derived from `name` when no `src` is provided. */
export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  // Sizes match the Figma "Avatar" component variants (Property 1=Default/Variant2/Variant3):
  // 32px / 40px / 48px. Initials font-size per variant has no dedicated Figma spec (exported
  // examples are all image-filled), so existing text sizes are kept as-is.
  const sizes = {
    sm: 'w-8 h-8 text-xs font-semibold',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-bold',
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-1 text-primary-4 border border-neutral-2 select-none shrink-0',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
