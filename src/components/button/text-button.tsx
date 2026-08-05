import { useRef } from 'react';
import { useButton, type AriaButtonProps } from 'react-aria';
import { cn } from '../../utils/cn';

export interface TextButtonProps extends AriaButtonProps {
  /**
   * Figma "Type": Primary is a solid primary-4 fill by default. Secondary
   * starts fully transparent and only gains a fill on hover/selected.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
  /** Figma "State=Selected" — a persisted toggle state, distinct from hover/press. */
  isSelected?: boolean;
  /** Button label / content. */
  children: React.ReactNode;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * TextButton
 *
 * Figma: "Text Button" COMPONENT_SET inside "Button, Switch Button" frame
 * (Button, Switch Button01.md). Despite the name, this is a solid-fill pill
 * (State=Default/Disable/Hover/Selected × Type=Primary/Secondary), not an
 * underline/link style. Desktop/Body/M/regular: SF Pro Display, 15px/24px,
 * weight 400, letter-spacing 0.75px (tracking-wider). Padding 8px on all
 * sides, border-radius 8px (--radius-sm).
 *
 * Note: the spec's Type=Primary "Disable" state (bg primary-2) is literally
 * identical to its "Hover" state — not a transcription error, both frames
 * use the same #EBA59E swatch.
 */
export function TextButton({
  variant = 'primary',
  isSelected = false,
  className,
  isDisabled,
  ...props
}: TextButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton({ ...props, isDisabled }, ref);

  const variants = {
    primary: cn(
      'text-main',
      isDisabled ? 'bg-primary-2' : isSelected ? 'bg-primary-3' : 'bg-primary-4 hover:bg-primary-2',
    ),
    secondary: isDisabled
      ? 'bg-transparent text-muted'
      : isSelected
        ? 'bg-neutral-3 text-main'
        : // `hover:text-neutral-5` alongside the hover fill: white on a solid `neutral-2`
          // is 2.94:1, so the label has to move with the background. Invisible to a
          // static-story axe pass, which is why it went unrecorded.
          'bg-transparent text-main hover:bg-neutral-2 hover:text-neutral-5',
  };

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center p-2 text-body-m font-normal rounded-sm transition-colors cursor-pointer font-sans select-none focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:pointer-events-none',
        variants[variant],
        className,
      )}
    >
      {props.children}
    </button>
  );
}
