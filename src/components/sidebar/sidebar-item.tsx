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
  /**
   * Called when the item is clicked.
   *
   * Named `onPress` (#14), matching `Button`'s React Aria vocabulary rather than `onClick`.
   * This renders as a real `<button>` regardless, so the rename carries no behaviour gap —
   * unlike `TaskCard`/`TaskTableRow`, there is no non-button wrapper for it to leave behind.
   */
  onPress?: () => void;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

export function SidebarItem({
  icon,
  label,
  isActive = false,
  badgeCount,
  onPress,
  className,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative w-full h-14 flex items-center gap-4 pl-4 font-sans text-body-m font-semibold transition-colors cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2',
        // `-text`, not the bare `text-interactive`, on both the active and the hover
        // label: an item's label is text, and primary-4 as text clears 4.5:1 nowhere
        // (2.86 / 3.51 / 4.02). The sidebar is `surface-panel`, so the active item was
        // 3.51:1. `primary-2` measures 6.67:1 there, and 6.02:1 at the far end of the
        // gradient where the label sits on a 10% primary-4 wash — both clear. The wash
        // itself is unchanged: it is decoration, not a boundary, and the label carries
        // the state.
        isActive
          ? 'text-interactive-text bg-gradient-to-r from-transparent to-primary-4/10'
          : 'text-muted hover:text-interactive-text',
        className,
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
            // The active badge was `bg-primary-4 text-main` — white on the brand red at
            // **3.83:1**, the same failing pairing as the primary CTA but on text the
            // CTA's documented exemption does not cover. axe files it under `incomplete`
            // rather than `violations` (messageKey `shortTextContent`: a two-digit count
            // might be decorative), which is why a violations-only sweep never saw it.
            //
            // Unlike the CTA there is nothing to preserve: `badgeCount` has no
            // ground-truth basis at all — no export shows a count on this component, as
            // the doc comment above says — so it is an opt-in addition rather than
            // something Figma draws. And no label colour rescues `primary-4`; the fill had
            // to move. `interactive-text` with `neutral-5` clears **7.63:1** and keeps the
            // badge in the same accent family as the active label beside it.
            isActive ? 'bg-interactive-text text-neutral-5' : 'bg-neutral-3 text-main',
          )}
        >
          {badgeCount}
        </span>
      ) : null}

      <span
        className={cn(
          'w-1 h-full shrink-0 bg-primary-4 transition-opacity',
          isActive ? 'opacity-100' : 'opacity-0',
        )}
      />
    </button>
  );
}
