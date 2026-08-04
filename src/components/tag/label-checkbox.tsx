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
 * Figma: "Label Checkbox" COMPONENT_SET inside "Tags" frame.
 * Checkbox input with an inline label — used in filter dropdowns and forms.
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
    ref
  );

  return (
    <label
      {...labelProps}
      className={cn(
        'inline-flex items-center gap-2.5 cursor-pointer select-none group',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <input {...inputProps} ref={ref} className="sr-only" />
        <div
          className={cn(
            'w-4 h-4 rounded border-2 transition-all',
            state.isSelected || isIndeterminate
              ? 'bg-primary-4 border-primary-4'
              : 'bg-transparent border-neutral-2 group-hover:border-neutral-1'
          )}
        >
          {state.isSelected && !isIndeterminate ? (
            <svg className="w-full h-full text-neutral-1 p-[1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : isIndeterminate ? (
            <svg className="w-full h-full text-neutral-1 p-[2px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden>
              <path d="M5 12h14" />
            </svg>
          ) : null}
        </div>
      </div>
      <span className="text-sm font-sans font-medium text-neutral-1 leading-tight">
        {children}
      </span>
    </label>
  );
}
