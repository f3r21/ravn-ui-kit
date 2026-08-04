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
 * - Container: bg-neutral-4, padding: 4px, border-radius: 10px (matches no
 *   existing --radius-* step, so rendered as an arbitrary-value class,
 *   same convention as application-sidebar.tsx's w-[232px]).
 * - Segments: 0 gap between them, height 32px, padding 4px 24px, rounded-sm.
 * - Active segment: bg-neutral-2 pill, text neutral-1.
 * - Inactive: text neutral-1 too -- Figma shows identical (white) label
 *   color for both states, distinguishing selection purely via the pill
 *   background fill, not a text-color change.
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
      aria-label="View"
      className={cn(
        'inline-flex items-center gap-0 p-1 bg-neutral-4 rounded-[10px]',
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
              'inline-flex items-center justify-center gap-2 h-8 px-6 py-1 text-sm font-semibold rounded-sm transition-all cursor-pointer font-sans select-none text-neutral-1',
              isSelected ? 'bg-neutral-2 shadow-sm' : ''
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
