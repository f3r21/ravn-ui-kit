import { useRef } from 'react';
import { useCheckbox } from 'react-aria';
import { useToggleState } from 'react-stately';
import { cn } from '../../utils/cn';

export interface LabelCheckboxProps {
  /** Label content rendered next to the checkbox. */
  children: React.ReactNode;
  /** Controlled selected state. Omit to let the component manage its own state via `defaultSelected`. */
  isSelected?: boolean;
  /**
   * Initial selected state for uncontrolled usage.
   * @default false
   */
  defaultSelected?: boolean;
  /** Called with the next selected state whenever the checkbox is toggled. */
  onChange?: (isSelected: boolean) => void;
  /**
   * Disables interaction and applies a dimmed, non-interactive style.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Renders the indeterminate ("mixed") visual state, overriding the checkmark
   * regardless of `isSelected`.
   * @default false
   */
  isIndeterminate?: boolean;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * LabelCheckbox
 *
 * Figma: "Label Checkbox" COMPONENT_SET inside "Tags" frame (Tags01.md,
 * Add Task Modal04/05.md). Structurally identical to the Tag "Icon=Left"
 * chip - a 24x24 icon slot + a Desktop/Body/M/regular label, 4px padding
 * 16px, gap 8px, radius 4px, no fill/border. The ground-truth export gives
 * Property 1=Default and Property 1=Selected byte-for-byte identical style
 * values (no distinguishing color), so the checked/unchecked distinction is
 * carried entirely by the icon glyph (empty box vs. checked box), exactly
 * like the two vector states a real checkbox input would render.
 * Uses react-aria useCheckbox for full accessibility.
 */
export function LabelCheckbox({
  children,
  isSelected,
  defaultSelected = false,
  onChange,
  isDisabled = false,
  isIndeterminate = false,
  className,
}: LabelCheckboxProps) {
  const state = useToggleState({
    isSelected,
    defaultSelected,
    onChange,
  });
  const ref = useRef<HTMLInputElement>(null);
  const { inputProps, labelProps } = useCheckbox(
    {
      isSelected: state.isSelected,
      isIndeterminate,
      isDisabled,
      'aria-label': typeof children === 'string' ? children : 'Checkbox',
    },
    state,
    ref,
  );

  return (
    <label
      {...labelProps}
      className={cn(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Label Checkbox" component exactly
        // (Property 1=Default/Selected, Tags01.md / Add Task Modal04/05.md).
        'inline-flex items-center gap-2 px-4 py-1 rounded cursor-pointer select-none group has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-4 has-[:focus-visible]:outline-offset-2',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <input {...inputProps} ref={ref} className="sr-only" />
      <svg
        className="w-6 h-6 shrink-0 text-main"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        <rect x="4" y="4" width="16" height="16" rx="3" />
        {state.isSelected && !isIndeterminate ? (
          <path
            d="M8 12.5 11 15.5 16 9.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : isIndeterminate ? (
          <path d="M8 12h8" strokeWidth={2} strokeLinecap="round" />
        ) : null}
      </svg>
      {/* Desktop/Body/M/regular -- SF Pro Display, 15px/24px, letter-spacing 0.75px (tracking-wider) */}
      <span className="text-body-m font-normal font-sans text-main">{children}</span>
    </label>
  );
}
