import { cn } from '../../utils/cn';
import { SidebarItem, type SidebarItemProps } from './sidebar-item';

export interface ApplicationSidebarProps {
  /** Logo / brand element shown at the top */
  logo?: React.ReactNode;
  /** Navigation items to render */
  items: SidebarItemProps[];
  /** Optional footer content (e.g. user profile) */
  footer?: React.ReactNode;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * ApplicationSidebar
 *
 * Full-width sidebar container matching the Figma "Sidebar" component
 * (ApplicationSidebar01.md).
 * - Background: neutral-4 (#2C2F33)
 * - Width: 232px (fixed, per Figma)
 * - Border-radius: 24px (radius-lg)
 * - Stacks SidebarItem list with a logo at top and an optional footer
 */
export function ApplicationSidebar({
  logo,
  items,
  footer,
  className,
}: ApplicationSidebarProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className={cn(
        // 232px matches the Figma "Sidebar" frame (ApplicationSidebar01.md); rounded-lg = 24px border-radius on that same frame.
        'flex flex-col w-[232px] h-full bg-neutral-4 rounded-lg select-none shrink-0',
        className
      )}
    >
      {/* Logo / Branding -- horizontally centered per Figma ("Ravn / Logomark", left: calc(50% - 20px), top: 12px) */}
      {logo ? (
        <div className="flex items-center justify-center px-6 pt-3 pb-6 shrink-0">
          {logo}
        </div>
      ) : null}

      {/* Navigation Items -- gap: 8px (gap-2) and 0 horizontal padding per Figma "Sidebar Tab List" (each SidebarItem carries its own inset) */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {items.map((item, idx) => (
          <SidebarItem key={idx} {...item} />
        ))}
      </div>

      {/* Footer (e.g. user profile row) */}
      {footer ? (
        <div className="px-4 py-5 border-t border-neutral-3/30 shrink-0">
          {footer}
        </div>
      ) : null}
    </nav>
  );
}
