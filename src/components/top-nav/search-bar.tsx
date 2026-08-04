import { useRef, useState } from 'react';
import { useTextField } from 'react-aria';
import { cn } from '../../utils/cn';

export interface SearchBarProps {
  /**
   * Placeholder text shown in the input.
   * @default 'Search...'
   */
  placeholder?: string;
  /** Controlled value. */
  value?: string;
  /** Called on every keystroke. */
  onChange?: (value: string) => void;
  /** Called when user submits (Enter). */
  onSubmit?: (value: string) => void;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * SearchBar
 *
 * Figma: "Frame 649" inside the "Search Bar" component (Top Navigation Bar00/01.md,
 * confirmed against the in-context instance in `Dashboard Mockup.md`). This is only
 * the icon+input portion — Frame 649 has a fixed `width: 171px` (24px icon + 24px
 * gap + 123px text) with no fill/padding of its own, so it renders transparently
 * and is meant to be composed inside a container that supplies the neutral-4
 * background (see `TopNav`, which wraps this plus the trailing icon/avatar slot
 * to match the full "Search Bar" component).
 * - Icon: 24x24, neutral-2
 * - Text: Desktop/Body/M/regular — SF Pro Display 15px/24px, letter-spacing 0.75px, neutral-2
 */
export function SearchBar({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onSubmit,
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const ref = useRef<HTMLInputElement>(null);

  const { inputProps } = useTextField(
    {
      value,
      onChange: (v) => {
        if (!isControlled) setInternalValue(v);
        onChange?.(v);
      },
      onKeyDown: (e) => {
        if (e.key === 'Enter') onSubmit?.(value);
      },
      'aria-label': 'Search',
      placeholder,
    },
    ref
  );

  return (
    <div className={cn('inline-flex items-center gap-6 min-w-0', className)}>
      {/* Search icon */}
      <svg
        className="w-6 h-6 text-neutral-2 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" strokeLinecap="round" />
      </svg>

      <input
        {...inputProps}
        ref={ref}
        className="flex-1 bg-transparent text-[15px] leading-6 tracking-wider text-neutral-1 placeholder:text-neutral-2 outline-none font-sans min-w-0"
      />
    </div>
  );
}
