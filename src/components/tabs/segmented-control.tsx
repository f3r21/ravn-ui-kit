import React from 'react';
import { cn } from '../../utils/cn';

export interface SegmentedControlOption {
  /** Unique identifier for the option, used to match against `value`/`defaultValue` and reported by `onChange`. */
  id: string;
  /** Text label displayed for the option. */
  label: string;
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
}

export interface SegmentedControlProps {
  /** The list of segments rendered as selectable options, in display order. */
  options: SegmentedControlOption[];
  /** Selected option `id` for controlled usage. When provided, the component no longer manages its own selection state. */
  value?: string;
  /** Initial selected option `id` for uncontrolled usage. Falls back to the first option's `id` when omitted. */
  defaultValue?: string;
  /** Called with the newly selected option's `id` whenever the user picks a segment. */
  onChange?: (value: string) => void;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * SegmentedControl
 *
 * Figma: "Segmented Control" COMPONENT inside "Button, Switch Button" frame.
 * - Container: bg-neutral-3, border-radius: 8px, padding: 4px
 * - Active segment: bg-neutral-4 pill, text neutral-1
 * - Inactive: text neutral-2
 */
export function SegmentedControl({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  className,
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? options[0]?.id ?? ''
  );
  const isControlled = controlledValue !== undefined;
  const selected = isControlled ? controlledValue : internalValue;

  const handleSelect = (id: string) => {
    if (!isControlled) setInternalValue(id);
    onChange?.(id);
  };

  return (
    <div
      role="group"
      aria-label="Vista"
      className={cn(
        'inline-flex items-center gap-1 p-1 bg-neutral-3 rounded-lg',
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleSelect(opt.id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md transition-all cursor-pointer font-sans select-none',
              isSelected
                ? 'bg-neutral-4 text-neutral-1 shadow-sm'
                : 'text-neutral-2 hover:text-neutral-1'
            )}
          >
            {opt.icon ? (
              <span className="text-base leading-none">{opt.icon}</span>
            ) : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
