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
 *
 * ## The primary variant does not meet WCAG AA, deliberately
 *
 * `text-main` on `bg-primary-4` measures **3.83:1**, under 1.4.3's 4.5:1 for normal text.
 * `isSelected`'s `bg-primary-3` is worse at **2.83:1**, and the disabled/hover
 * `bg-primary-2` worse again at 2.02:1. Fourteen of the 131 contrast violations an axe
 * pass over the built Storybook reports are this button.
 *
 * It is left as drawn, and that is a different call from the ones `Tag`, `Badge` and
 * `Avatar` took in the same pass. Those all had somewhere to go. This does not:
 *
 * - **No label colour fixes it.** The best dark option in the whole palette is
 *   `neutral-5` at 4.02:1, still short. Only near-black would clear it, and the palette
 *   has no black — `neutral-5` (#222528) is the darkest thing in it.
 * - **No fill in the ramp fixes it either.** `primary-4` is the ramp's darkest step;
 *   1, 2 and 3 are all lighter and measure worse against white.
 * - So the only fix is a **new, darker red that Figma does not contain**. Continuing the
 *   ramp's own arithmetic (-9/-39/-42 per step) lands on `#D13323`, which would clear
 *   4.99:1 — and CONTRIBUTING.md's first design value is that no value is invented or
 *   approximated. Changing it would also either leave two different reds side by side
 *   (this button next to an icon `Button`, a focus ring, `Tag`'s red) or repaint
 *   `--color-primary-4` itself, which is every brand surface in both repos.
 *
 * This is the one case in this kit where the design has a definite opinion that fails AA,
 * as opposed to being silent. The error-colour precedent does not transfer: the design
 * draws no error state at all, so that ramp step was a free choice constrained only by
 * contrast. Here it is the brand's own CTA.
 *
 * `contrast.test.ts` asserts the current state so it cannot be mistaken for passing, and
 * `MIGRATION_GAPS.md` tracks it as the open item it is. The **icon** `Button`'s
 * `variant="primary"` uses the same fill and is *not* affected: an icon is non-text, so
 * 1.4.11's 3:1 applies to it and 3.83:1 clears that.
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
