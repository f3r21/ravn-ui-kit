import { cn } from '../../utils/cn';

export interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  isActive?: boolean;
  badgeCount?: number;
  onClick?: () => void;
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
        'relative w-full flex items-center justify-between px-4 py-3.5 rounded-md font-sans text-sm font-semibold transition-all cursor-pointer select-none overflow-hidden',
        isActive
          ? 'text-primary-4 bg-gradient-to-r from-transparent to-red-500/10'
          : 'text-neutral-2 hover:text-primary-4 hover:bg-neutral-4/50',
        className
      )}
    >
      <div className="flex items-center gap-3.5">
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

        {/* 4px Right indicator bar for active state matching Figma */}
        {isActive ? (
          <span className="absolute right-0 top-0 bottom-0 w-1 bg-primary-4 rounded-r-sm" />
        ) : null}
      </div>
    </button>
  );
}
