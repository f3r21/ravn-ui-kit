import { cn } from '../../utils/cn';
import { SearchBar } from './search-bar';
import { Avatar } from '../avatar/avatar';

export interface TopNavProps {
  /** Title shown in the left area (page/section name) */
  title?: string;
  /** Whether to show the search bar */
  showSearch?: boolean;
  /** Logged-in user's name (used for avatar initials) */
  userName?: string;
  /** Logged-in user's avatar image URL */
  userAvatar?: string;
  /** Called when search value changes */
  onSearch?: (value: string) => void;
  /** Actions/buttons to render on the right side */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * TopNav (Top Navigation Bar)
 *
 * Figma: "Top Nav" COMPONENT inside "Top Navigation Bar" frame.
 * - Background: neutral-4 (#2C2F33)
 * - Height: 72px
 * - Left: page title
 * - Center: SearchBar
 * - Right: action buttons + user avatar
 * - Border-bottom: 1px solid neutral-3
 */
export function TopNav({
  title,
  showSearch = true,
  userName,
  userAvatar,
  onSearch,
  actions,
  className,
}: TopNavProps) {
  return (
    <header
      className={cn(
        'flex items-center gap-4 h-[72px] px-6 bg-neutral-4 border-b border-neutral-3/50 shrink-0',
        className
      )}
    >
      {/* Left: Title */}
      {title ? (
        <h1 className="font-sans font-bold text-lg text-neutral-1 truncate shrink-0 mr-2">
          {title}
        </h1>
      ) : null}

      {/* Center: Search */}
      {showSearch ? (
        <div className="flex-1 max-w-xs">
          <SearchBar
            placeholder="Search tasks, projects..."
            onChange={onSearch}
            className="w-full"
          />
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Right: Actions + User */}
      <div className="flex items-center gap-3 shrink-0 ml-auto">
        {actions}
        {(userName || userAvatar) ? (
          <Avatar src={userAvatar} name={userName} size="md" />
        ) : null}
      </div>
    </header>
  );
}
