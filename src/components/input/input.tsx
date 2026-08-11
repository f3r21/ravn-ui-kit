import { useTextField, useObjectRef, type AriaTextFieldProps } from 'react-aria';
import { cn } from '../../utils/cn';
import { fieldLabelClass, FieldMessages, RequiredIndicator } from '../form-field/form-field';

export interface InputProps extends AriaTextFieldProps {
  /**
   * Ref to the root `<input>` (#11). Merged with the internal ref `useTextField` needs via
   * `useObjectRef`, the same pattern `Datepicker` uses.
   */
  ref?: React.Ref<HTMLInputElement>;
  /** Label text. Rendered `sr-only` unless `isLabelVisible`. When omitted, no label. */
  label?: string;
  /**
   * Renders the label visibly above the input instead of `sr-only`.
   *
   * Defaults to `false` — the design draws no field labels; see `FIELD_LABEL_CLASS`.
   * The label still names the input for assistive tech either way.
   * @default false
   */
  isLabelVisible?: boolean;
  /**
   * Error message rendered below the input. When set, also switches the
   * input to its error visual state (danger border/outline).
   */
  error?: string;
  /** Helper text rendered below the input. Hidden while `error` is set. */
  description?: string;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

export function Input({
  label,
  isLabelVisible = false,
  error,
  description,
  className,
  ref: forwardedRef,
  ...props
}: InputProps) {
  const ref = useObjectRef(forwardedRef);
  const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(
    { ...props, label, description, isInvalid: !!error, errorMessage: error },
    ref,
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label ? (
        <label {...labelProps} className={fieldLabelClass(isLabelVisible)}>
          {label}
          {props.isRequired ? <RequiredIndicator /> : null}
        </label>
      ) : null}
      <input
        {...inputProps}
        ref={ref}
        className={cn(
          'h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md placeholder:text-muted-on-light transition-colors focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral',
          error && 'border-danger-5 focus-visible:outline-danger-text',
          className,
        )}
      />
      <FieldMessages
        description={description}
        error={error}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
      />
    </div>
  );
}
