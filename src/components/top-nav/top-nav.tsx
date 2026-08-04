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
 * Confirmed via live Figma access (node 82:2742, fileKey ZUAB3jXFyKFktoAzvN7h1T) after
 * shipping with an unverified guess: Property 1=Default vs Property 1=Selected differ
 * structurally — Frame 648 is 88px wide (bell icon + avatar) in Default, 136px (close icon +
 * bell icon + avatar) in Selected. Selected's search input also renders a bare text-cursor
 * glyph in place of the "Search" placeholder, i.e. Selected is the *focused* state. The extra
 * icon in Selected is a literal close/X glyph — confirming the clear-search interpretation
 * this component already shipped with. One real correction from the live check: the close
 * icon is the FIRST child of the trailing group in Selected, not appended after the bell
 * icon as previously implemented — order is close (when shown), then bell, then avatar.
 * Not yet re-verified: whether the real trigger is strictly "focused" vs this component's
 * "has a non-empty value" (Selected's cursor glyph doesn't prove which) — kept the
 * value-based trigger since showing a clear button with nothing to clear is the weaker UX
 * default, but this is a values-based judgment call, not a confirmed fact. No `title` prop:
 * no title/heading layer exists anywhere in the real component.
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
        'flex items-center justify-between gap-6 px-6 py-3 bg-surface-panel rounded-md',
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
        {searchValue ? (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="w-6 h-6 shrink-0 text-muted hover:text-main transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-xs [&>svg]:w-full [&>svg]:h-full"
          >
            <CloseIcon />
          </button>
        ) : null}

        <span className="w-6 h-6 text-muted shrink-0 [&>svg]:w-full [&>svg]:h-full">
          {icon ?? <BellIcon />}
        </span>

        {userName || userAvatar ? <Avatar src={userAvatar} name={userName} size="md" /> : null}
      </div>
    </header>
  );
}
