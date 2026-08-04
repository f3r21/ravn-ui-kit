import { useState, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { SearchBar } from './search-bar';
import { Avatar } from '../avatar/avatar';

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export interface TopNavProps {
  /** Controlled search value. */
  searchValue?: string;
  /** Placeholder text shown in the search input. */
  searchPlaceholder?: string;
  /** Called on every search keystroke. */
  onSearchChange?: (value: string) => void;
  /** Called when the search is submitted (Enter). */
  onSearchSubmit?: (value: string) => void;
  /** Trailing 24x24 icon (Figma "Icon Placeholder", `currentColor`). Defaults to a bell/notifications glyph. */
  icon?: ReactNode;
  /** Logged-in user's name (used for avatar initials/alt text). */
  userName?: string;
  /** Logged-in user's avatar image URL. */
  userAvatar?: string;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * TopNav
 *
 * Figma: "Search Bar" COMPONENT_SET (Top Navigation Bar00/01.md), confirmed against
 * the real in-context instance in `Dashboard Mockup.md` (`left: 296px` — flush against
 * the 232px sidebar — `right: 36px`, `top: 32px`, height 64px). This is the full bar:
 * neutral-4 background, 16px radius (`--radius-md`), 12px/24px padding, containing the
 * `SearchBar` icon+input on the left (Frame 649) and a trailing icon/avatar slot on the
 * right (Frame 648).
 *
 * Property 1=Default vs Property 1=Selected differ structurally: Frame 648 is 88px wide
 * (1 icon + avatar) in Default and 136px (2 icons + avatar) in Selected — the extra
 * 24px+gap exactly accounts for one more icon. The only real desktop mockup instance
 * (`Dashboard Mockup.md`) always renders Default, and the Selected variant's second icon
 * has no legible glyph or label in the export, so its purpose isn't specified — reusing it
 * as a clear-search affordance (shown once there's a value to clear) is the most
 * conservative reading that both matches the structural 88px->136px delta and doesn't
 * invent unrelated functionality. No `title` prop: no title/heading layer exists anywhere
 * in the real component (the "Navigation"/"SidebarItem" text layers a few hundred px above
 * it belong to the isolated doc frame's own header, not the Top Nav bar itself).
 */
export function TopNav({
  searchValue: controlledSearchValue,
  searchPlaceholder,
  onSearchChange,
  onSearchSubmit,
  icon,
  userName,
  userAvatar,
  className,
}: TopNavProps) {
  const [internalSearchValue, setInternalSearchValue] = useState('');
  const isControlled = controlledSearchValue !== undefined;
  const searchValue = isControlled ? controlledSearchValue : internalSearchValue;

  const handleSearchChange = (v: string) => {
    if (!isControlled) setInternalSearchValue(v);
    onSearchChange?.(v);
  };

  const clearSearch = () => {
    if (!isControlled) setInternalSearchValue('');
    onSearchChange?.('');
  };

  return (
    <header
      className={cn(
        'flex items-center justify-between gap-6 px-6 py-3 bg-neutral-4 rounded-md',
        className
      )}
    >
      <SearchBar
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={handleSearchChange}
        onSubmit={onSearchSubmit}
        className="flex-1"
      />

      <div className="flex items-center gap-6 shrink-0">
        <span className="w-6 h-6 text-neutral-2 shrink-0 [&>svg]:w-full [&>svg]:h-full">
          {icon ?? <BellIcon />}
        </span>

        {searchValue ? (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="w-6 h-6 shrink-0 text-neutral-2 hover:text-neutral-1 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-xs [&>svg]:w-full [&>svg]:h-full"
          >
            <CloseIcon />
          </button>
        ) : null}

        {userName || userAvatar ? <Avatar src={userAvatar} name={userName} size="md" /> : null}
      </div>
    </header>
  );
}
