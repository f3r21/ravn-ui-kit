import { cn } from '../../utils/cn';
import { Avatar } from '../avatar/avatar';

export interface UserRowProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Ref to the root element (#11). Typed to the common `HTMLElement` base rather than
   * `HTMLButtonElement`/`HTMLDivElement` specifically — this row is polymorphic between the
   * two depending on whether `onPress` is given, the same shape `Card`'s `as` prop is.
   */
  ref?: React.Ref<HTMLElement>;
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
  /**
   * Called when the row is clicked. When provided, the row renders as a `<button>` instead
   * of a `<div>`.
   *
   * Named `onPress` (#14), matching `Button`'s React Aria vocabulary rather than `onClick`.
   * This renders as a real `<button>` whenever it's provided, so the rename carries no
   * behaviour gap.
   */
  onPress?: () => void;
}

/**
 * UserRow
 *
 * Figma: "User" COMPONENT inside the "Avatar" frame.
 * - Layout: Avatar (left) + name + role (stacked, right)
 * - Used in the Assignee Modal (no ApplicationSidebar footer exists in the
 *   ground truth — see the Chunk 9 note in `application-sidebar.tsx`)
 * - Background: transparent
 */
export function UserRow({
  name,
  role,
  avatarSrc,
  size = 'md',
  isOnline = false,
  className,
  onPress,
  ref,
  ...rest
}: UserRowProps) {
  // Name text is fixed (SF Pro Display 15px/24px regular, tracking 0.75px) per the
  // Figma "User" component — the only avatar+name typography spec in the ground
  // truth, unaffected by the avatar size variant. Role has no Figma spec; sizes
  // below are scaled by eye to pair with each avatar size.
  const roleTextSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  // Cast to a single concrete tag for the same reason `Card` does — see that file's
  // comment. `'button'`, not `'div'`, because `type` (passed below) only exists on a
  // button — casting the other way would make TypeScript reject it even though the
  // runtime element is a real `<button>` whenever `type` is actually set.
  const Wrapper = (onPress ? 'button' : 'div') as 'button';

  return (
    <Wrapper
      {...rest}
      type={onPress ? 'button' : undefined}
      onClick={onPress}
      ref={ref as React.Ref<HTMLButtonElement>}
      className={cn(
        // padding: 4px 16px, gap: 8px -- matches Figma "User" component (Avatar frame, 239x56)
        'flex items-center gap-2 px-4 py-1 min-w-0',
        onPress &&
          'cursor-pointer hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 rounded-sm',
        className,
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
        <span className="font-sans font-normal text-body-m text-main truncate">{name}</span>
        {/* The role is `--color-muted-on-dark`, not `--color-muted`. A UserRow does not know
            its own surface — `AssigneeModal` renders a list of them on `surface-overlay`,
            where neutral-2 measures 3.73:1, and four of the kit's contrast violations were
            exactly this role text. transparent-light-65 composites against whatever is
            behind it and clears AA on all three dark surfaces (5.12 / 5.96 / 6.55:1). */}
        {role ? (
          <span
            className={cn(
              'font-sans text-muted-on-dark truncate leading-tight',
              roleTextSizes[size],
            )}
          >
            {role}
          </span>
        ) : null}
      </div>
    </Wrapper>
  );
}
