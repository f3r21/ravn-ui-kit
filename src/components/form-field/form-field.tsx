import { useField, type AriaFieldProps } from 'react-aria';
import { cn } from '../../utils/cn';

/**
 * The kit's shared form-field surface.
 *
 * **No Figma source for the error/description/required states.** The design file draws
 * labelled fields but no invalid state, no helper text and no required marker anywhere.
 * This exists because only `Input` and `Datepicker` accepted an `error` at all —
 * `Select`, `MultiSelect` and `LabelCheckbox` had no way to report one, so a consuming
 * form could validate a field it could not then mark. Everything below is an engineering
 * addition built to WAI-ARIA's field pattern rather than to a mockup.
 */

/**
 * The required marker.
 *
 * `aria-hidden` on purpose: react-aria already sets `aria-required` on the control
 * itself, so announcing the asterisk too would say "required" twice. It is decoration
 * over a fact the accessibility tree already carries.
 *
 * `--color-danger-text` rather than the `--color-danger` alias — see `FIELD_ERROR_CLASS`.
 */
export function RequiredIndicator() {
  return (
    <span aria-hidden="true" className="text-danger-text ml-0.5">
      *
    </span>
  );
}

/**
 * Styling for a *visible* field label.
 *
 * Most fields should not use it. The design draws **no field labels at all** — not in the
 * Add/Edit Task modal, not on the search bar, nowhere across 100 export files. A field's
 * own text carries its meaning: the placeholder in the empty state, the value in the
 * filled one. So `isLabelVisible` defaults to `false` on every control and the label
 * renders `sr-only`, which keeps the accessible name without inventing visual chrome.
 *
 * When a consumer does opt in, this is the design's real spec for a small label on a dark
 * surface — the sidebar's `PROJECTS` header (`Dashboard Mockup.md:237-254`): 15px / 600 /
 * 0.75px tracking, which is exactly `--text-body-m`.
 *
 * **The colour is a deliberate deviation, and the ratio is why.** That header's own colour
 * is `#94979A` (`neutral-2`), but it sits on `#2C2F33`, where it measures 4.58:1. On the
 * `#393D41` modal card — where a task form actually lives — the same pairing is
 * **3.73:1**, under AA. `#FFFFFF` is the only other colour the design ever puts on a dark
 * surface, and it clears AA on all three: 11.60:1 on overlay, 13.45:1 on panel, 15.40:1
 * on shell.
 *
 * This was `text-field-label font-semibold text-neutral-3 uppercase`, which was invented
 * twice over: `#393D41` measured **1.41:1** on the shell — the design uses it as a
 * background 55 times and as a border 283 times, and as text zero times — at 12px, a size
 * that appears exactly once in the design system, on an iOS type specimen.
 */
export const FIELD_LABEL_CLASS = 'text-body-m font-semibold text-main font-sans';

/**
 * What a hidden label renders as.
 *
 * `sr-only`, never `hidden`/`display:none`: those take the label out of the accessibility
 * tree along with the pixels, which would strip the field's accessible name — the exact
 * thing the label exists for.
 */
export const FIELD_LABEL_HIDDEN_CLASS = 'sr-only';

/** Picks the label class for a control's `isLabelVisible`. */
export function fieldLabelClass(isLabelVisible: boolean | undefined): string {
  return isLabelVisible ? FIELD_LABEL_CLASS : FIELD_LABEL_HIDDEN_CLASS;
}

/**
 * Shared helper-text styling.
 *
 * `--color-muted-on-dark`, not the plain `--color-muted` this used to be. Description
 * text renders *outside* the control, on whatever container the field sits in, and that
 * container is not knowable from here — a form field is as likely to be inside a modal as
 * on the shell. `neutral-2` clears AA on the shell (5.25:1) and on a panel (4.58:1) but
 * only manages **3.73:1** on `surface-overlay`, which is precisely the modal card case.
 *
 * `transparent-light-65` composites against whatever is behind it, so it clears AA on all
 * three (6.55 / 6.27 / 5.11:1) without the component having to know its own surface.
 */
export const FIELD_DESCRIPTION_CLASS = 'text-xs text-muted-on-dark font-sans';

/**
 * Shared error-message styling.
 *
 * `--color-danger-text` (`danger-3`, `#FFA19E`), not the `--color-danger` alias
 * (`danger-5`, `#E82F39`) which is now documented as a border colour. The
 * design has no error state anywhere — no red text, no invalid border, nothing — so the
 * ramp step is a free choice constrained only by contrast, and `danger-5` fails on every
 * surface the kit uses: 3.59:1 on the shell, 3.14:1 on a panel, 2.55:1 on an overlay.
 *
 * `danger-3` is the only step clearing AA everywhere a form can sit: **5.65:1** on
 * `#393D41`, **6.94:1** on `#2C2F33`, **7.95:1** on `#222528`. `danger-4` (`#FF7875`) is
 * the more conventional-looking error red and was rejected for measuring 4.27:1 on the
 * modal card — passing on two surfaces out of three is how the original defect happened.
 *
 * The invalid *border* on each control stays `danger-5`. A border is a non-text boundary
 * needing 3:1 under 1.4.11, measured against the colours it is *adjacent to* — and it
 * separates the field's white interior from the container, clearing 4.29:1 against that
 * interior. It does **not** clear 3:1 against a `surface-overlay` container (2.55:1), so
 * the argument rests on the interior side; `contrast.test.ts` asserts exactly that and
 * nothing broader.
 */
export const FIELD_ERROR_CLASS = 'text-xs text-danger-text font-sans';

export interface FieldMessagesProps {
  /** Helper text. Hidden automatically while `error` is set, so the two never stack. */
  description?: string;
  /** Error message. Its presence is what puts the field in its invalid state. */
  error?: string;
  /** Props from a react-aria field hook's `descriptionProps`. */
  descriptionProps?: React.HTMLAttributes<HTMLElement>;
  /** Props from a react-aria field hook's `errorMessageProps`. */
  errorMessageProps?: React.HTMLAttributes<HTMLElement>;
}

/**
 * Renders whichever of description/error applies, with the aria wiring a field hook
 * produced. Shared so every control reports errors the same way rather than each
 * inventing its own markup.
 *
 * Only one shows at a time, and the error wins. Stacking them pushes the layout around
 * at the exact moment the user is trying to read what went wrong, and the helper text
 * has usually just been superseded by the error anyway.
 */
export function FieldMessages({
  description,
  error,
  descriptionProps,
  errorMessageProps,
}: FieldMessagesProps) {
  if (error) {
    return (
      <span {...errorMessageProps} className={FIELD_ERROR_CLASS}>
        {error}
      </span>
    );
  }
  if (description) {
    return (
      <span {...descriptionProps} className={FIELD_DESCRIPTION_CLASS}>
        {description}
      </span>
    );
  }
  return null;
}

export interface FormFieldProps extends Omit<AriaFieldProps, 'errorMessage'> {
  /** Label text. Rendered `sr-only` unless `isLabelVisible`. */
  label?: string;
  /**
   * Renders the label visibly above the control instead of `sr-only`.
   *
   * Defaults to `false` because the design draws no field labels — see
   * `FIELD_LABEL_CLASS`. The label is always present for assistive tech either way; this
   * only decides whether it is painted.
   * @default false
   */
  isLabelVisible?: boolean;
  /** Helper text rendered below the control. Hidden while `error` is set. */
  description?: string;
  /** Error message rendered below the control, and what marks the field invalid. */
  error?: string;
  /**
   * Marks the field required — renders the shared indicator next to the label and sets
   * `aria-required` on the control via the props handed to `children`.
   * @default false
   */
  isRequired?: boolean;
  /**
   * The control. Receives the aria props to spread onto it — at minimum `id` and
   * `aria-describedby`, so the description and error are actually associated rather than
   * merely adjacent.
   */
  children: (fieldProps: React.HTMLAttributes<HTMLElement>) => React.ReactNode;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * Wraps an arbitrary control in the kit's label / required / description / error surface.
 *
 * For `Input`, `Select`, `MultiSelect`, `Datepicker` and `LabelCheckbox` you do not need
 * this — each accepts `label`/`description`/`error`/`isRequired` directly and renders the
 * same surface internally, which keeps the common case a flat prop list rather than a
 * nested render prop. Reach for `FormField` when wrapping something the kit does not
 * own: a third-party control, a composite of several inputs, or a custom widget that
 * still owes the user a label and an error.
 *
 * Built on react-aria's `useField`, so the ids and `aria-describedby` wiring come from
 * the same implementation the field hooks use rather than a parallel hand-rolled one.
 */
export function FormField({
  label,
  isLabelVisible = false,
  description,
  error,
  isRequired = false,
  children,
  className,
  ...props
}: FormFieldProps) {
  // `useField` has no `isRequired` of its own — it only builds label/description/error
  // associations. The `aria-required` it would otherwise emit is applied to the control
  // below instead, which is where it belongs anyway.
  const { labelProps, fieldProps, descriptionProps, errorMessageProps } = useField({
    ...props,
    label,
    description,
    errorMessage: error,
    isInvalid: !!error,
  });

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? (
        <label {...labelProps} className={fieldLabelClass(isLabelVisible)}>
          {label}
          {isRequired ? <RequiredIndicator /> : null}
        </label>
      ) : null}

      {children({
        ...fieldProps,
        ...(isRequired ? { 'aria-required': true } : {}),
        ...(error ? { 'aria-invalid': true } : {}),
      })}

      <FieldMessages
        description={description}
        error={error}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
      />
    </div>
  );
}
