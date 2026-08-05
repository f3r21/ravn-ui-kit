import { useRef } from 'react';
import { useCheckbox, useField } from 'react-aria';
import { useToggleState } from 'react-stately';
import { cn } from '../../utils/cn';
import { FieldMessages, RequiredIndicator } from '../form-field/form-field';

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
  /**
   * Error message rendered below the checkbox. When set, also marks the control invalid
   * to assistive tech and tints the box — previously this control had no way to report a
   * validation failure at all, so a form could reject it without being able to say so.
   */
  error?: string;
  /** Helper text rendered below the checkbox. Hidden while `error` is set. */
  description?: string;
  /**
   * Marks the checkbox required — renders the shared indicator after the label and sets
   * `aria-required`.
   * @default false
   */
  isRequired?: boolean;
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
  error,
  description,
  isRequired = false,
  className,
}: LabelCheckboxProps) {
  const state = useToggleState({
    isSelected,
    defaultSelected,
    onChange,
  });
  const ref = useRef<HTMLInputElement>(null);
  // useCheckbox has no description/error association of its own, so useField supplies
  // the ids and the aria-describedby that ties the input to the messages below.
  const { fieldProps, descriptionProps, errorMessageProps } = useField({
    description,
    errorMessage: error,
    isInvalid: !!error,
  });

  const { inputProps, labelProps } = useCheckbox(
    {
      isSelected: state.isSelected,
      isIndeterminate,
      isDisabled,
      isRequired,
      isInvalid: !!error,
      'aria-label': typeof children === 'string' ? children : 'Checkbox',
    },
    state,
    ref,
  );

  const control = (
    <label
      {...labelProps}
      className={cn(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Label Checkbox" component exactly
        // (Property 1=Default/Selected, Tags01.md / Add Task Modal04/05.md).
        // `has-[:focus-visible]:outline-solid` is load-bearing, not decoration. The real
        // checkbox is `sr-only`, so the ring has to be drawn on this label via `:has()` —
        // and under the `has-` variant, `outline-2`'s `outline-style:
        // var(--tw-outline-style)` does not resolve to `solid` the way it does under
        // `focus-visible:`. The width and the colour compute, and nothing paints: this
        // control had **no visible focus indicator at all**, a 2.4.7 failure rather than a
        // contrast one. Verified at the pixel level in a real browser — zero ring pixels
        // before, 1604 after — and `getComputedStyle` was no help, reporting a colour for
        // an outline that was never drawn. Same trap as the `outline-none` bug this kit
        // already paid for once; see `button.tsx`. Do not drop `outline-solid` as redundant.
        'inline-flex items-center gap-2 px-4 py-1 rounded cursor-pointer select-none group has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-interactive-text has-[:focus-visible]:outline-offset-2',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <input
        {...inputProps}
        ref={ref}
        aria-describedby={fieldProps['aria-describedby']}
        className="sr-only"
      />
      {/* Drawn inline rather than pulled from the kit's icon set on purpose: the box, the
          check and the indeterminate dash are three renderings of one control's state, not
          a glyph from the design's vocabulary, and splitting them into icons would scatter
          that state across three components. `TaskTable`'s row-select box makes the same
          call for the same reason — the duplication between the two is real and tracked in
          `MIGRATION_GAPS.md` Section 3, but sharing one checkbox control is the fix, not
          sharing one icon. */}
      <svg
        className={cn('w-6 h-6 shrink-0', error ? 'text-danger' : 'text-main')}
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
      <span className="text-body-m font-normal font-sans text-main">
        {children}
        {isRequired ? <RequiredIndicator /> : null}
      </span>
    </label>
  );

  // The messages sit outside the <label> on purpose: anything inside it becomes part of
  // the checkbox's own accessible name, so an error message nested there would be read
  // as though it were the label.
  if (!error && !description) return control;

  return (
    <div className="inline-flex flex-col gap-1">
      {control}
      <span className="px-4">
        <FieldMessages
          description={description}
          error={error}
          descriptionProps={descriptionProps}
          errorMessageProps={errorMessageProps}
        />
      </span>
    </div>
  );
}
