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
 * Figma: "Search Bar" COMPONENT_SET inside "Top Navigation Bar" frame.
 * - Background: neutral-4 (#2C2F33), border-radius: 16px
 * - Left: search icon (magnifier)
 * - Right: clear button (×) when value is non-empty
 * - font: SF Pro Display 15px/24px, letter-spacing 0.75px, text color: neutral-2
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
      'aria-label': 'Buscar',
      placeholder,
    },
    ref
  );

  const clear = () => {
    if (!isControlled) setInternalValue('');
    onChange?.('');
    ref.current?.focus();
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center gap-6 h-12 px-6 bg-neutral-4 rounded-md border border-transparent transition-colors focus-within:border-neutral-2',
        className
      )}
    >
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

      {/* Clear button */}
      {value ? (
        <button
          type="button"
          onClick={clear}
          aria-label="Limpiar búsqueda"
          className="shrink-0 text-neutral-2 hover:text-neutral-1 transition-colors cursor-pointer"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
