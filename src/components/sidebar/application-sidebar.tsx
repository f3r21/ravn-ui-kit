import { cn } from '../../utils/cn';
import { SidebarItem, type SidebarItemProps } from './sidebar-item';

export interface ApplicationSidebarProps extends React.ComponentPropsWithRef<'nav'> {
  /** Logo / brand element shown at the top */
  logo?: React.ReactNode;
  /** Navigation items to render */
  items: SidebarItemProps[];
  /**
   * Accessible name for the `<nav>` landmark.
   *
   * Override it whenever a second navigation landmark can be on the page — the consuming
   * app's own product nav, a secondary sidebar, or simply two of these. A screen reader
   * offers landmarks as a list, and two entries both called "Main navigation" are two
   * things that list cannot tell apart. Same reason `ToastProvider.label` exists, and the
   * same reason `EmptyState.label` does.
   * @default 'Main navigation'
   */
  label?: string;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * ApplicationSidebar
 *
 * @remarks
 * Source: `ApplicationSidebar00/01.md`, cross-checked against the real
 * in-context "Sidebar" layer in `Mockups/Dashboard Default View/Dashboard
 * Mockup.md` (the only ground-truth signal that resolves which of the two
 * component-doc exports is the real desktop size).
 *
 * `01.md`'s "Sidebar" (232×836, `neutral.4` #2C2F33, `border-radius: 24px`,
 * logo top:12px, "Sidebar Tab List" starting at top:96px) matches the
 * Dashboard Mockup's Sidebar layer property-for-property (same width,
 * height, radius, and offsets). `00.md`'s "Sidebar" (310×844, no
 * border-radius, logo top:36px, tab list top:120px) never appears in any
 * real desktop screen — its only other occurrences are `SideBarItem00.md`
 * (already flagged in Chunk 8 as Android/iOS mobile-breakpoint noise) and
 * `Mockups/Mobile/Android/.../Sidebar.md`. So 310px is the mobile-Android
 * sidebar width, not a second real desktop variant — no `size` prop here,
 * matching the single-size precedent Chunk 8 set for the mobile-vs-desktop
 * split on SidebarItem's source files.
 *
 * No export — the isolated component doc, the in-context Dashboard Mockup,
 * or any other mockup file — shows a footer/user-profile row anywhere
 * inside the Sidebar's bounds; the only Avatar near this layout belongs to
 * the Top Nav bar (Chunk 10's scope), not the sidebar. A previously-added
 * `footer` prop had zero ground-truth basis and zero real consumers in this
 * codebase — removed as fabricated, same treatment Chunk 4 gave Button's
 * unfounded `size`/`isLoading` props.
 */
export function ApplicationSidebar({
  logo,
  items,
  label = 'Main navigation',
  className,
  ref,
  ...rest
}: ApplicationSidebarProps) {
  return (
    <nav
      {...rest}
      ref={ref}
      aria-label={label}
      className={cn(
        // 232px / rounded-lg (24px) matches the real "Sidebar" layer (ApplicationSidebar01.md + Dashboard Mockup.md).
        'flex flex-col w-[232px] h-full bg-surface-panel rounded-lg select-none shrink-0',
        className,
      )}
    >
      {/* Logo -- horizontally centered, top:12px, per Figma ("Ravn / Logomark", left: calc(50% - 20px), top: 12px).
          Fixed h-24 (96px) so the tab list below always starts at the spec's top:96 offset regardless of the
          supplied logo's intrinsic size. */}
      {logo ? <div className="flex justify-center pt-3 h-24 shrink-0">{logo}</div> : null}

      {/* Navigation Items -- gap: 8px (gap-2) and 0 horizontal padding per Figma "Sidebar Tab List" (each SidebarItem carries its own inset) */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {items.map((item, idx) => (
          <SidebarItem key={idx} {...item} />
        ))}
      </div>
    </nav>
  );
}
