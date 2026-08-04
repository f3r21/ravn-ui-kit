import { cn } from '../../utils/cn';

/**
 * @remarks
 * Figma (`SideBarItem00`/`SideBarItem01` exports) shows the abstract
 * "SidebarItem" master component — captioned "This master component is
 * meant to be an abstract class. The SidebarItem and the
 * SidebarItemWIthOptions should inherit from this class." — with three
 * states: Normal, Hover, Selected. Those three map to this component's
 * default / hover / `isActive` states respectively, and have now been
 * cross-checked against the real exported CSS and reference screenshots
 * (colors, the 4px indicator bar, gap, and corner radius).
 *
 * Neither export actually contains an instance, frame, or anatomy for
 * `SidebarItemWithOptions` itself — no kebab-menu, extra icon-button, or
 * distinguishing padding/layout shows up anywhere in either file, only that
 * one caption sentence naming it. So the variant is still not implementable
 * from available data and remains unimplemented, gated on real anatomy data
 * that has not been provided yet.
 */
export interface SidebarItemProps {
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
  /** Text label displayed for the item. */
  label: string;
  /**
   * Whether the item is styled as the current/active selection.
   * @default false
   */
  isActive?: boolean;
  /** Optional numeric badge rendered at the end of the item (e.g. unread count). */
  badgeCount?: number;
  /** Called when the item is clicked. */
  onClick?: () => void;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

export function SidebarItem({
  icon,
  label,
  isActive = false,
  badgeCount,
  onClick,
  className,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative w-full flex items-center justify-between px-4 py-3.5 font-sans text-sm font-semibold transition-all cursor-pointer select-none overflow-hidden',
        isActive
          ? 'text-primary-4 bg-gradient-to-r from-transparent to-primary-4/10'
          : 'text-neutral-2 hover:text-primary-4 hover:bg-neutral-4/50',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {icon ? <span className="text-lg shrink-0">{icon}</span> : null}
        <span className="truncate tracking-wide">{label}</span>
      </div>

      <div className="flex items-center gap-2">
        {badgeCount !== undefined ? (
          <span
            className={cn(
              'px-2 py-0.5 text-xs font-bold rounded-full',
              isActive
                ? 'bg-primary-4 text-neutral-1'
                : 'bg-neutral-3 text-neutral-1'
            )}
          >
            {badgeCount}
          </span>
        ) : null}

        {/* 4px Right indicator bar for active state matching Figma (sharp corners, no radius) */}
        {isActive ? (
          <span className="absolute right-0 top-0 bottom-0 w-1 bg-primary-4" />
        ) : null}
      </div>
    </button>
  );
}
