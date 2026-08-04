import { cn } from '../../utils/cn';
import { SidebarItem, type SidebarItemProps } from './sidebar-item';

export interface ApplicationSidebarProps {
  /** Logo / brand element shown at the top */
  logo?: React.ReactNode;
  /** Navigation items to render */
  items: SidebarItemProps[];
  /** Optional footer content (e.g. user profile) */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * ApplicationSidebar
 *
 * Full-width sidebar container matching the Figma "ApplicationSidebar" frame.
 * - Background: neutral-5 (#222528)
 * - Width: 260px (fixed, per Figma)
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
        'flex flex-col w-[260px] h-full bg-neutral-5 select-none shrink-0',
        className
      )}
    >
      {/* Logo / Branding */}
      {logo ? (
        <div className="flex items-center px-6 pt-8 pb-6 shrink-0">
          {logo}
        </div>
      ) : null}

      {/* Navigation Items */}
      <div className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto">
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
