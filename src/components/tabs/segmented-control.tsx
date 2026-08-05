import React, { useRef } from 'react';
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
 * Figma: "Segmented Control" COMPONENT inside "Button, Switch Button00/01.md" frame.
 * - Container: bg-neutral-4, padding: 4px, border-radius: 10px, now via the
 *   `--radius-10` token (`rounded-10`) added in Chunk 1 -- previously an
 *   arbitrary-value class before that token existed.
 * - Segments: 0 gap between them, height 32px, padding 4px 24px, radius 8px
 *   (`rounded-sm`, which Chunk 1 redefined to 8px).
 * - Active segment: bg-neutral-2 pill + Drop Shadow Small (`shadow-small`
 *   token, Chunk 1). Text: IOS/Subheadline/S.regular -- 13px/13px,
 *   letter-spacing 1px, weight 400 -- rendered via the shared `--font-sans`
 *   token per the Chunk 1 "no separate SF Pro Text token" precedent.
 * - Inactive: same 13px/regular/neutral-1 label -- Figma shows identical
 *   (white) label color for both states, distinguishing selection purely via
 *   the pill background fill, not a text-color change. Spec also carries a
 *   `filter: drop-shadow` on the inactive pill, but that's a Figma effect on
 *   an otherwise-transparent shape with no visible box -- applying our
 *   `shadow-small` (a `box-shadow`, which always renders behind the full
 *   element box) there would draw a visible phantom rectangle that doesn't
 *   exist in the reference; intentionally omitted.
 *
 * Accessibility: this renders `role="radio"` pill `<button>`s, so per WAI-ARIA
 * they must be contained by `role="radiogroup"` (not `role="group"`, the
 * previous — invalid — wrapper role). Navigation is hand-implemented (roving
 * tabindex + arrow keys) rather than via react-aria's `useRadio`/`useRadioGroup`:
 * those hooks return `inputProps` for a real `<input type="radio">` element
 * (native radio inputs are how they get keyboard/arrow-key behavior for free),
 * which doesn't fit this component's single-`<button>`-per-segment pill shape
 * without swapping in a hidden-native-input + `<label>` structure — a
 * disruptive rewrite of the visual design for a control this small. The
 * arrow-key/roving-tabindex behavior below follows the same WAI-ARIA APG
 * radiogroup pattern those hooks implement (selection follows focus, one
 * tab stop for the whole group).
 */
export function SegmentedControl({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  className,
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? options[0]?.id ?? '');
  const isControlled = controlledValue !== undefined;
  const selected = isControlled ? controlledValue : internalValue;
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleSelect = (id: string) => {
    if (!isControlled) setInternalValue(id);
    onChange?.(id);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = options.findIndex((opt) => opt.id === selected);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % options.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + options.length) % options.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = options.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextOption = options[nextIndex];
    handleSelect(nextOption.id);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="View"
      className={cn('inline-flex items-center gap-0 p-1 bg-surface-panel rounded-10', className)}
    >
      {options.map((opt, index) => {
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => handleSelect(opt.id)}
            onKeyDown={handleKeyDown}
            className={cn(
              'inline-flex items-center justify-center gap-2 h-8 px-6 py-1 text-control-label font-normal rounded-sm transition-all cursor-pointer font-sans select-none text-main focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2',
              // The active label is `neutral-5`, not the white Figma draws. That is the
              // one deviation in this component and the ratio is why: white on the
              // `neutral-2` pill measures 2.94:1. The pill's fill is untouched — this is
              // the same trade `Tag` and `Badge` take, keeping the design's fill and
              // moving the label, and `neutral-5` on `neutral-2` clears 5.25:1.
              //
              // It does cost the spec's "identical label colour in both states,
              // selection carried by the fill alone" (see the doc comment above). The
              // fill still carries it; the label now agrees with it rather than being
              // the only thing at 2.94:1.
              isSelected ? 'bg-neutral-2 text-neutral-5 shadow-small' : '',
            )}
          >
            {opt.icon ? <span className="text-base leading-none">{opt.icon}</span> : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
