import { useRef } from 'react';
import { useTextField, type AriaTextFieldProps } from 'react-aria';
import { cn } from '../../utils/cn';

export interface InputProps extends AriaTextFieldProps {
  /** Label text rendered above the input. When omitted, no label is shown. */
  label?: string;
  /**
   * Error message rendered below the input. When set, also switches the
   * input to its error visual state (danger border/outline).
   */
  error?: string;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const { labelProps, inputProps, errorMessageProps } = useTextField(
    { ...props, label, isInvalid: !!error, errorMessage: error },
    ref,
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label ? (
        <label
          {...labelProps}
          className="text-field-label font-semibold text-neutral-3 uppercase font-sans"
        >
          {label}
        </label>
      ) : null}
      <input
        {...inputProps}
        ref={ref}
        className={cn(
          'h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md placeholder:text-muted transition-colors focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral',
          error && 'border-danger-5 focus-visible:outline-danger-5',
          className,
        )}
      />
      {error ? (
        <span {...errorMessageProps} className="text-xs text-danger font-sans">
          {error}
        </span>
      ) : null}
    </div>
  );
}
