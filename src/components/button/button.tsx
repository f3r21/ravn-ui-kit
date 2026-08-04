import { useRef } from 'react';
import { useButton, type AriaButtonProps } from 'react-aria';
import { cn } from '../../utils/cn';

export interface ButtonProps extends AriaButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  isLoading = false,
  isDisabled,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps, isPressed } = useButton(
    { ...props, isDisabled: isDisabled || isLoading },
    ref
  );

  const baseStyles =
    'inline-flex items-center justify-center font-sans font-semibold rounded-md transition-all focus-visible:outline-2 focus-visible:outline-primary-4 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary:
      'bg-primary-4 text-neutral-1 hover:bg-primary-3 active:scale-[0.98]',
    secondary:
      'bg-neutral-1 text-neutral-4 border border-neutral-2 hover:bg-neutral-1 active:scale-[0.98]',
    ghost:
      'bg-transparent text-neutral-3 hover:bg-transparent-light-10',
    danger:
      'bg-danger-5 text-neutral-1 hover:bg-danger-6 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5',
  };

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isPressed && 'scale-[0.98]',
        className
      )}
    >
      {isLoading ? (
        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : null}
      {props.children}
    </button>
  );
}
