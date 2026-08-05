import { useRef } from 'react';
import { useButton, type AriaButtonProps } from 'react-aria';
import { cn } from '../../utils/cn';

export interface ButtonProps extends AriaButtonProps {
  /**
   * Figma "Property 1": Primary is a single documented state (solid fill,
   * no selected/unselected toggle). Secondary is icon-only chrome that
   * toggles via `isSelected`.
   * @default 'secondary'
   */
  variant?: 'primary' | 'secondary';
  /**
   * Figma "State=Selected/Unselected" — only meaningful for `variant="secondary"`;
   * `variant="primary"` has no selected/unselected state in the source.
   * @default false
   */
  isSelected?: boolean;
  /** 24×24 icon content. Should use `currentColor` so it inherits the button's icon color. */
  children: React.ReactNode;
  /** Required — icon-only buttons need an accessible name. */
  'aria-label': string;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * Button (icon button)
 *
 * Figma: "Button" COMPONENT_SET inside "Button, Switch Button" frame
 * (Button, Switch Button01.md). Fixed 40×40px, border-radius 8px (--radius-sm).
 * - Property 1=Primary, State=Normal: bg primary-4, white icon, no border.
 * - Property 1=Secondary, State=Selected: transparent bg, 1px primary-4
 *   border, primary-4 icon.
 * - Property 1=Secondary, State=Unselected: transparent bg, no border,
 *   white icon.
 *
 * The focus ring below is `focus-visible:outline-2 focus-visible:outline-primary-4
 * focus-visible:outline-offset-2` with **no `outline-none`** in front of it, and
 * that omission is deliberate — every focusable component in this kit follows the
 * same rule. In Tailwind v4 `outline-none` compiles to
 * `--tw-outline-style: none; outline-style: none`, and `outline-2` compiles to
 * `outline-style: var(--tw-outline-style); outline-width: 2px`. So pairing them
 * makes the ring resolve to `outline-style: none` and never paint — the width and
 * colour are computed but draw nothing. (This is a v3→v4 behaviour change:
 * v3's `outline-none` meant "transparent 2px ring", which is now `outline-hidden`
 * and sets the same variable, so it is not the fix either.) Left off, the
 * `@property --tw-outline-style` initial value of `solid` applies and the ring
 * renders. Do not "tidy up" by adding `outline-none` back.
 *
 * This was shipped broken across 21 components and found only when the consuming
 * app migrated its task-card menu onto this kit's `Menu` and lost the visible
 * focus indicator on the sole entry point to Edit/Delete — a utility-layer
 * `outline-none` also outranks a consumer's own `@layer base :focus-visible`
 * rule, so it suppressed the app's global ring too.
 */
export function Button({
  variant = 'secondary',
  isSelected = false,
  children,
  className,
  isDisabled,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton({ ...props, isDisabled }, ref);

  const variants = {
    primary: 'bg-primary-4 text-main border border-transparent',
    secondary: isSelected
      ? 'bg-transparent text-interactive border border-primary-4'
      : 'bg-transparent text-main border border-transparent',
  };

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center w-10 h-10 rounded-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        className
      )}
    >
      <span className="w-6 h-6 shrink-0 [&>svg]:w-full [&>svg]:h-full">{children}</span>
    </button>
  );
}
