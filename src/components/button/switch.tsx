import { useRef } from 'react';
import { useToggleButton } from 'react-aria';
import { useToggleState } from 'react-stately';
import { cn } from '../../utils/cn';

export interface SwitchProps {
  /** Visible label rendered next to the switch. */
  label?: string;
  /** Controlled checked state. Omit and use `defaultSelected` for uncontrolled usage. */
  isSelected?: boolean;
  /**
   * Initial checked state when the switch is uncontrolled (no `isSelected` passed).
   * @default false
   */
  defaultSelected?: boolean;
  /** Called with the new checked state whenever the switch is toggled. */
  onChange?: (isSelected: boolean) => void;
  /**
   * Disables interaction and applies the disabled visual style.
   * @default false
   */
  isDisabled?: boolean;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
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
 *
 * @remarks
 * NOT VERIFIED against real Figma data. Re-confirmed in Chunk 5: grepped
 * the entire ground-truth `UI-Kit` export (not just the assigned "Button,
 * Switch Button00/01.md" files) for "toggle"/"thumb"/"track" -- no hits.
 * Every "Switch button" layer in the real export is a two-option pill
 * selector (see `SegmentedControl`), not a boolean track+thumb toggle.
 * There is no literal switch/thumb/track CSS anywhere in the ground truth
 * to cross-check these on/off colors or the 44x24px track / 20x20px thumb
 * sizing against. Left unchanged since nothing contradicts it and it's a
 * reasonable standalone pattern; flagging for a human to confirm against
 * the correct Figma frame if one exists elsewhere outside this export.
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
          'relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 shrink-0',
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
