import { useRef } from 'react';
import { useButton, type AriaButtonProps } from 'react-aria';
import { cn } from '../../utils/cn';

export interface TextButtonProps extends AriaButtonProps {
  /** Button label / content. */
  children: React.ReactNode;
  /**
   * Controls font size and gap between content.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * TextButton
 *
 * Figma: "Text Button" COMPONENT_SET inside "Button, Switch Button" frame.
 * - No background, no border
 * - Text: primary-4 (#DA584B) with underline on hover
 * - Used for secondary actions like "View all", "Cancel", "Forgot password"
 */
export function TextButton({
  size = 'md',
  className,
  ...props
}: TextButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps, isPressed } = useButton(props, ref);

  const sizes = {
    sm: 'text-xs gap-1',
    md: 'text-sm gap-1.5',
    lg: 'text-base gap-2',
  };

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={cn(
        'inline-flex items-center font-sans font-semibold text-primary-4 transition-all cursor-pointer outline-none focus-visible:underline disabled:opacity-50 disabled:pointer-events-none hover:underline underline-offset-2',
        sizes[size],
        isPressed && 'opacity-75',
        className
      )}
    >
      {props.children}
    </button>
  );
}
