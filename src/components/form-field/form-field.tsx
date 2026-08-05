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
 */
export function RequiredIndicator() {
  return (
    <span aria-hidden="true" className="text-danger ml-0.5">
      *
    </span>
  );
}

/**
 * Shared label styling, so every field's label matches whatever renders it.
 *
 * **Known contrast defect, pre-existing and deliberately not repainted here.**
 * `text-neutral-3` is `#393D41`, a dark grey. Against the dark app shell (`#222528`) that
 * is a contrast ratio of **1.4:1** — effectively invisible, and far under WCAG AA's 4.5:1.
 * It is legible only on a light surface.
 *
 * The kit has never actually decided which surface form fields live on, which is the root
 * cause: `Input` and `Datepicker`'s stories render on Storybook's default light canvas
 * (where this label is fine), while `Select`'s story uses the dark `neutral-5` decorator
 * (where it is not) — and `Select` has carried this same class the whole time. So this is
 * not a regression introduced by extracting the constant; extracting it is what made the
 * inconsistency visible in one place.
 *
 * Not fixed in this pass on purpose. `#393D41` appears in the Figma exports only as a
 * *background* colour, never as label text, so there is no ground-truth label-on-dark
 * value to switch to, and picking one would be inventing a style — which
 * `CONTRIBUTING.md` explicitly says to flag rather than guess. Recorded in
 * `MIGRATION_GAPS.md` as a Section 2-shaped finding with the measured ratios.
 */
export const FIELD_LABEL_CLASS =
  'text-field-label font-semibold text-neutral-3 uppercase font-sans';

/** Shared helper-text styling. */
export const FIELD_DESCRIPTION_CLASS = 'text-xs text-muted font-sans';

/**
 * Shared error-message styling.
 *
 * Same caveat as the label above, less severe: `text-danger` (`#E82F39`) on the dark
 * shell measures **3.59:1**, under AA's 4.5:1 for text this size. `Input` already used
 * exactly this pairing before the shared surface existed, so it is pre-existing rather
 * than new — but it now applies to four more controls, which is worth saying out loud.
 * Recorded alongside the label finding in `MIGRATION_GAPS.md`.
 */
export const FIELD_ERROR_CLASS = 'text-xs text-danger font-sans';

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
  /** Label text rendered above the control. */
  label?: string;
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
        <label {...labelProps} className={FIELD_LABEL_CLASS}>
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
