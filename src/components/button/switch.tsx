import { useRef } from 'react';
import { useToggleButton } from 'react-aria';
import { useToggleState } from 'react-stately';
import { cn } from '../../utils/cn';

export interface SwitchProps {
  /** Visible label next to the switch */
  label?: string;
  /** Controlled checked state */
  isSelected?: boolean;
  /** Default state (uncontrolled) */
  defaultSelected?: boolean;
  /** Called when the switch is toggled */
  onChange?: (isSelected: boolean) => void;
  /** Disable interaction */
  isDisabled?: boolean;
  className?: string;
}

/**
 * Switch (Toggle Button)
 *
 * Matches the Figma "Button, Switch Button" component.
 * Uses react-aria useToggleButton + react-stately useToggleState
 * for full accessibility (role="switch", aria-checked).
 *
 * ON  → bg-primary-4 (#DA584B), thumb slides right
 * OFF → bg-neutral-3 (#393D41), thumb stays left
 */
export function Switch({
  label,
  isSelected,
  defaultSelected = false,
  onChange,
  isDisabled = false,
  className,
}: SwitchProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const state = useToggleState({
    isSelected,
    defaultSelected,
    onChange,
  });

  const { buttonProps } = useToggleButton(
    {
      isSelected: state.isSelected,
      isDisabled,
      'aria-label': label ?? 'Toggle',
    },
    state,
    ref
  );

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer select-none',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <button
        {...buttonProps}
        ref={ref}
        type="button"
        role="switch"
        aria-checked={state.isSelected}
        disabled={isDisabled}
        className={cn(
          'relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-primary-4 shrink-0',
          state.isSelected ? 'bg-primary-4' : 'bg-neutral-3'
        )}
      >
        {/* Thumb */}
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-neutral-1 shadow-sm transition-transform duration-200',
            state.isSelected ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
      {label ? (
        <span className="text-sm font-semibold text-neutral-1 font-sans">
          {label}
        </span>
      ) : null}
    </label>
  );
}
