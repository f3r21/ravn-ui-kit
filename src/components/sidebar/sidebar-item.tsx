import { cn } from '../../utils/cn';

/**
 * @remarks
 * Source: `SideBarItem00/01.md`, the "Sidebar Tab" component
 * (States=Default/Hover/Selected block in `01.md`, the isolated,
 * unambiguous component definition — `00.md`'s in-context instances use
 * mixed Android/iOS text styles for the same layers, which is Figma
 * mobile-breakpoint noise, out of scope per the master-plan mobile note).
 *
 * Real anatomy: fixed 56px-tall row, `padding: 0 0 0 16px` (no right/vertical
 * padding — content is vertically centered by the fixed height), `gap: 16px`,
 * Icon Placeholder (24×24) then label (`flex-grow: 1`) then a 4px-wide,
 * full-height "Rectangle 33" indicator bar flush against the row's right
 * edge. Label is Desktop/Body/M/bold: SF Pro Display, 15px/24px, weight 600,
 * letter-spacing 0.75px (`tracking-wider`, the Chunk 2/3 convention).
 *
 * State matrix (colors only — icon/label always share one color):
 * - Default: `neutral.2` (#94979A), no background, indicator `opacity: 0`.
 * - Hover: `primary.4` (#DA584B), still **no background** (the Hover export
 *   has no `background` line at all — only Selected does), indicator stays
 *   `opacity: 0`.
 * - Selected: `primary.4`, `linear-gradient(90deg, transparent, primary.4
 *   @ 10%)` background, indicator visible (`opacity: 1`).
 *
 * The indicator is kept mounted across all states with only its opacity
 * toggled (matching the spec, which always includes the Rectangle 33 layer)
 * rather than conditionally rendered, so it can transition in/out.
 *
 * `badgeCount` has no ground-truth basis (no export shows a count/dot on
 * this component) but is kept as a non-contradicted, opt-in addition, same
 * treatment earlier chunks gave unspecced extras.
 *
 * Neither export contains an instance, frame, or anatomy for
 * `SidebarItemWithOptions` itself — no kebab-menu, extra icon-button, or
 * distinguishing padding/layout shows up anywhere, only one caption
 * sentence naming it as a sibling of this abstract class. So that variant
 * remains unimplemented, gated on real anatomy data not yet provided.
 */
export interface SidebarItemProps {
  /** Optional icon rendered before the label (Figma "Icon Placeholder", 24×24). Should use `currentColor` so it inherits the row's state color. */
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
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative w-full h-14 flex items-center gap-4 pl-4 font-sans text-[15px] leading-6 font-semibold tracking-wider transition-colors cursor-pointer select-none',
        isActive
          ? 'text-primary-4 bg-gradient-to-r from-transparent to-primary-4/10'
          : 'text-neutral-2 hover:text-primary-4',
        className
      )}
    >
      {icon ? (
        <span className="flex items-center justify-center w-6 h-6 shrink-0">{icon}</span>
      ) : null}

      <span className="flex-1 truncate">{label}</span>

      {badgeCount !== undefined ? (
        <span
          className={cn(
            'px-2 py-0.5 text-xs font-bold rounded-full shrink-0',
            isActive
              ? 'bg-primary-4 text-neutral-1'
              : 'bg-neutral-3 text-neutral-1'
          )}
        >
          {badgeCount}
        </span>
      ) : null}

      <span
        className={cn(
          'w-1 h-full shrink-0 bg-primary-4 transition-opacity',
          isActive ? 'opacity-100' : 'opacity-0'
        )}
      />
    </button>
  );
}
