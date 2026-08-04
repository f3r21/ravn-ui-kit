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
  const sizes = {
    sm: 'w-7 h-7 text-xs font-semibold',
    md: 'w-9 h-9 text-sm font-semibold',
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
          alt={name || 'Avatar de usuario'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
