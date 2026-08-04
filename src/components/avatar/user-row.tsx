import { cn } from '../../utils/cn';
import { Avatar } from '../avatar/avatar';

export interface UserRowProps {
  /** Full name of the user */
  name: string;
  /** Job title or role (e.g. "Frontend Developer") */
  role?: string;
  /** Avatar image URL */
  avatarSrc?: string;
  /**
   * Size variant — matches Avatar sizes
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether to show a status dot (online indicator)
   * @default false
   */
  isOnline?: boolean;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
  /** Called when the row is clicked. When provided, the row renders as a `<button>` instead of a `<div>`. */
  onClick?: () => void;
}

/**
 * UserRow
 *
 * Figma: "User" COMPONENT inside the "Avatar" frame.
 * - Layout: Avatar (left) + name + role (stacked, right)
 * - Used in the ApplicationSidebar footer and in Assignee Modal
 * - Background: transparent
 */
export function UserRow({
  name,
  role,
  avatarSrc,
  size = 'md',
  isOnline = false,
  className,
  onClick,
}: UserRowProps) {
  const textSizes = {
    sm: { name: 'text-xs', role: 'text-[10px]' },
    md: { name: 'text-sm', role: 'text-xs' },
    lg: { name: 'text-base', role: 'text-sm' },
  };

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 min-w-0',
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
    >
      {/* Avatar with optional online indicator */}
      <div className="relative shrink-0">
        <Avatar src={avatarSrc} name={name} size={size} />
        {isOnline ? (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary-4 border-2 border-neutral-5" />
        ) : null}
      </div>

      {/* Name + Role */}
      <div className="flex flex-col min-w-0">
        <span
          className={cn(
            'font-sans font-semibold text-neutral-1 truncate leading-tight',
            textSizes[size].name
          )}
        >
          {name}
        </span>
        {role ? (
          <span
            className={cn(
              'font-sans text-neutral-2 truncate leading-tight',
              textSizes[size].role
            )}
          >
            {role}
          </span>
        ) : null}
      </div>
    </Wrapper>
  );
}
