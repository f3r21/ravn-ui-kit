import { useRef } from 'react';
import { useTextField, type AriaTextFieldProps } from 'react-aria';
import { cn } from '../../utils/cn';
import { FIELD_LABEL_CLASS, FieldMessages, RequiredIndicator } from '../form-field/form-field';

export interface DatepickerProps extends AriaTextFieldProps {
  /** Label text rendered above the input. When omitted, no label is shown. */
  label?: string;
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

export function Datepicker({ label, error, description, className, ...props }: DatepickerProps) {
  const ref = useRef<HTMLInputElement>(null);
  const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(
    { ...props, label, description, type: 'date', isInvalid: !!error, errorMessage: error },
    ref,
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label ? (
        <label {...labelProps} className={FIELD_LABEL_CLASS}>
          {label}
          {props.isRequired ? <RequiredIndicator /> : null}
        </label>
      ) : null}
      <input
        {...inputProps}
        ref={ref}
        type="date"
        className={cn(
          'h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral font-sans cursor-pointer',
          error && 'border-danger-5 focus-visible:outline-danger-5',
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
