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
  /**
   * Icon content, rendered centred inside the 24×24 "Icon Placeholder" frame. Should use
   * `currentColor` so it inherits the button's icon colour.
   *
   * **Size the glyph yourself** — the frame is 24px, the glyph inside it is not (#46). Figma
   * draws `size-3.5` (14px) for `variant="primary"` and `size-[18px]` for `secondary`; one
   * `ViewSwitcher` glyph is 18×16, non-square. This used to force `w-full h-full` onto the
   * child, which collapsed all three to 24×24 and stretched the non-square one.
   */
  children: React.ReactNode;
  /** Required — icon-only buttons need an accessible name. */
  'aria-label': string;
  /**
   * ARIA role, for a button that is one option inside a composite widget — currently only
   * `'radio'`, for a button sitting in a `role="radiogroup"` (see `ViewSwitcher`). Omit for
   * an ordinary button, which is almost always what you want.
   *
   * This and `aria-checked` are applied *after* `useButton`'s props rather than passed
   * through them, because `useButton` returns only the props it knows about and these two
   * are not among them — passed in, both arrive on the element as `null`. Re-derive by
   * rendering `<Button aria-label="p" role="radio" aria-checked />` and reading
   * `el.getAttribute('role')`; `button.test.tsx` pins it.
   *
   * The roving tabindex a radiogroup also needs does *not* go here: `useButton` owns
   * `tabIndex` and hardcodes `0`, so use `excludeFromTabOrder` (already on
   * `AriaButtonProps`) to get `-1` on the unselected option.
   */
  role?: 'radio';
  /**
   * Selected state for `role="radio"`. Has no effect without a `role` — a plain button has
   * no checked state, and `isSelected` is the visual-only prop for that case.
   */
  'aria-checked'?: boolean;
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
 * **The ring's colour is `--color-interactive-text` (`primary-2`), not the brand
 * `primary-4`, and this is the one place in the kit where that swap is not about text.**
 * Every ring here is `outline-offset-2`, so it is drawn *clear of* the control, on the
 * container — it has exactly one adjacent colour, and 1.4.11 wants 3:1 against it.
 * `primary-4` manages 4.02:1 on the shell and 3.51:1 on a panel but only **2.86:1** on
 * `surface-overlay`, which is a modal or a popover: precisely where a form is most likely
 * to be, and where losing the focus indicator costs the most. `primary-2` clears all
 * three at 5.43 / 6.67 / 7.63:1.
 *
 * Nothing was traded for it. The design file draws **no focus state anywhere** — the ring
 * is an engineering addition to begin with, so unlike the primary fill below there was no
 * Figma pairing to deviate from. The caveat worth knowing: `primary-2` measures 2.02:1 on
 * white, so a consumer placing a kit control on a light container must override it. No
 * kit surface is light — `Input` and `Datepicker`'s white interiors are *inside* the
 * field, and `outline-offset-2` puts the ring on the dark container outside them.
 *
 * The focus ring below is `focus-visible:outline-2 focus-visible:outline-interactive-text
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
  role,
  'aria-checked': ariaChecked,
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
      // After the spread, deliberately: `useButton` does not carry these and would drop them.
      role={role}
      aria-checked={ariaChecked}
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center w-10 h-10 rounded-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        className,
      )}
    >
      {/* Figma's "Icon Placeholder": inset 20% of the 40px button, i.e. exactly 24px, and
          identical across every variant. The glyph inside it is NOT — "Vector" is inset
          20.83% of this frame on Primary (14px), 12.5% on Secondary (18px), and 12.5%/16.67%
          on one ViewSwitcher glyph (18×16, non-square). `[&>svg]:w-full [&>svg]:h-full` here
          flattened all three to 24px and distorted the non-square one, and it beat a
          consumer's own `size-*` class on specificity — a descendant selector outranks a
          plain utility, so passing `className="size-3.5"` had no effect at all. The frame
          stays; the glyph sizes itself. */}
      <span className="w-6 h-6 shrink-0 flex items-center justify-center">{children}</span>
    </button>
  );
}
