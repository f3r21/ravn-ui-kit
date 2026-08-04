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
 * - Text: primary-4 (#DA584B) with underline on hover
 * - Used for secondary actions like "View all", "Cancel", "Forgot password"
 *
 * @remarks
 * FLAGGED, NOT APPLIED: the real "Text Button" frame in the Figma export
 * (Button, Switch Button01.md) actually contains solid-fill pill states
 * (State=Default/Hover/Selected/Disable x Type=Primary/Secondary, all
 * ~62x40px with 8px padding and primary-4/primary-2/primary-3/neutral-2/
 * neutral-3 backgrounds) -- not the underline/no-background link style
 * this component implements. Only "Type=Secondary, State=Default/Disable"
 * happen to have no fill. This looks like a Figma naming collision (the
 * frame is literally named "Text Button" but visually matches a solid
 * Button variant instead), so it was NOT used to change this component's
 * styling -- left as-is pending a human decision on whether this data
 * should instead inform Button's "secondary" variant. See segmented-control
 * and button.tsx summary notes for the same ambiguity.
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
