import { cn } from '../../utils/cn';
import type { AccentColor } from '../../types/color-variants';

export interface TagProps {
  /**
   * Which accent colour the chip is painted in — Figma's `Type` property
   * (General/Green/Blue/Yellow/Red) by its own names. Carries no meaning of its own;
   * for a chip that says what a state *means*, use `Badge` and its `StatusTone`.
   *
   * Named `accent` (#14) — every `AccentColor`-typed prop in the kit shares this name now,
   * so a consumer reading `TaskTableRow.accent` or `TaskTag.accent` already knows this one.
   * @default 'neutral'
   */
  accent?: AccentColor;
  /**
   * `'outline'` renders the "Style=Outline" variant (border, transparent fill) instead of
   * the default `'solid'` (10%-alpha fill, no border) — Figma's own `Style` property.
   *
   * Was a boolean (#14) — a two-value axis crammed into `true`/`false` can never grow a
   * third style. Named `appearance`, not `style`: kit#11 lands in this same release and
   * adds rest-spread to every component, and a prop literally named `style` would collide
   * with the native DOM `style: CSSProperties` attribute the moment rest-spread reaches
   * this element — kit#129's suggested name didn't account for that.
   * @default 'solid'
   */
  appearance?: 'solid' | 'outline';
  /**
   * Optional leading icon (Figma "Icon=Left" slot, 24×24px). Should use
   * `currentColor` for its fill/stroke so it inherits the tag's accent color.
   */
  icon?: React.ReactNode;
  /** Tag label content. */
  children: React.ReactNode;
  /** Called when the remove (×) button is pressed. When provided, a remove button is rendered. */
  onRemove?: () => void;
  /**
   * Accessible name for the remove (×) button. Ignored unless `onRemove` is set.
   *
   * Override it whenever more than one removable tag can be on screen — a filter bar of
   * five chips otherwise offers five buttons a screen-reader user cannot tell apart, every
   * one of them called "Remove tag". Name what is being removed: `` `Remove ${text}` ``.
   * The glyph itself stays "×"; this names it, it does not relabel it.
   * @default 'Remove tag'
   */
  removeLabel?: string;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/** Compact labeled pill (Style=Solid/Outline × Icon=None/Left × Type=General/Green/Blue/Yellow/Red), optionally removable via a trailing "×" button. */
export function Tag({
  accent = 'neutral',
  appearance = 'solid',
  icon,
  children,
  onRemove,
  removeLabel = 'Remove tag',
  className,
}: TagProps) {
  // Style=Solid: 10%-alpha fill, no border. Style=Outline: 1px border, transparent
  // fill. "general" (neutral) is the only type where the fill tint (neutral.2)
  // and the foreground (neutral.1/white) diverge from the same swatch - matches
  // Tags00/01.md exactly.
  // Keyed by AccentColor. The **fill** each colour resolves to is Figma's, verified in
  // Tags01.md — note `red` is primary-4 (#DA584B), not the danger ramp's #E82F39.
  //
  // The **label** is a deliberate deviation on two of the five, and the ratios are why.
  //
  // Figma paints label and fill from the same swatch: `bg-X/10 text-X`. A 10% tint of a
  // colour is never far from that colour, so the pattern is structurally incapable of
  // clearing AA, and it did not: red measured 2.61 / 3.17 / 3.61:1 over
  // overlay/panel/shell and green 3.66 / 4.44 / 5.08 (missing on two surfaces out of
  // three). Together they were 27 of the 131 contrast violations an axe pass over the
  // built Storybook reported.
  //
  // No choice of *fill* rescues them, which is what settles it: `primary-4` as text
  // cannot clear 4.5:1 against anything in this palette — its best case anywhere is
  // 4.02:1, on the shell. Only the label can move. So the fill stays exactly as drawn
  // and the label steps up its own ramp to the first rung that clears AA on all three
  // dark surfaces, which is step 2 for both:
  //
  //   red     text-primary-2     4.98 / 6.02 / 6.86   (was 2.61 / 3.17 / 3.61)
  //   green   text-secondary-2   5.50 / 6.67 / 7.64   (was 3.66 / 4.44 / 5.08)
  //
  // `yellow` is left alone: `tertiary-4` already clears AA on the tint (4.73 / 5.74 /
  // 6.58), and deviating further than the measurement forces would be repainting the
  // design for its own sake.
  //
  // `blue` is the one the palette cannot serve. `--color-blue` (#2F61BF) is a standalone
  // accent with no ramp — there is no lighter blue to step to — and on its own tint it
  // measures 1.77 / 2.14 / 2.43:1, the worst pairing in the kit. Its label is `text-main`
  // (10.38 / 12.53 / 14.25:1) and the blue tint alone carries the variant. Inventing a
  // `blue-2` was considered and rejected: CONTRIBUTING.md's first design value is that no
  // value is invented or approximated.
  //
  // Outline takes the same colour for border and label, so the two styles stay in step.
  // The one exception is again blue: its border stays `--color-blue` because a white
  // border would make the outline blue tag indistinguishable from the neutral one. That
  // border does not clear 1.4.11's 3:1 against any surface (1.87 / 2.29 / 2.63) and
  // `contrast.test.ts` records it as the known limit rather than letting it read as
  // passing.
  const styles: Record<AccentColor, { solid: string; outline: string }> = {
    neutral: {
      solid: 'bg-neutral-2/10 text-main',
      outline: 'border border-neutral-1 text-main',
    },
    // text-primary-2 kept raw here, not aliased to `text-interactive-text` — this is Tag's
    // own categorical red, not an interactive affordance; aliasing it would wrongly imply
    // every red tag is interactive.
    red: {
      solid: 'bg-primary-4/10 text-primary-2',
      outline: 'border border-primary-2 text-primary-2',
    },
    green: {
      solid: 'bg-secondary-4/10 text-secondary-2',
      outline: 'border border-secondary-2 text-secondary-2',
    },
    yellow: {
      solid: 'bg-tertiary-4/10 text-tertiary-4',
      outline: 'border border-tertiary-4 text-tertiary-4',
    },
    blue: {
      solid: 'bg-blue/10 text-main',
      outline: 'border border-blue text-main',
    },
  };

  return (
    <span
      className={cn(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Tag" component exactly (Style=Solid/Outline,
        // all Type variants, Tags00/01.md). Typography: Desktop/Body/M/bold - SF Pro
        // Display, 15px/24px, letter-spacing 0.75px (tracking-wider @ 15px), weight 600.
        'inline-flex items-center gap-2 px-4 py-1 text-body-m font-semibold rounded font-sans select-none',
        appearance === 'outline' ? styles[accent].outline : styles[accent].solid,
        className,
      )}
    >
      {icon ? (
        <span className="flex items-center justify-center w-6 h-6 shrink-0">{icon}</span>
      ) : null}
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          // The hover cue darkens the glyph's background instead of dimming the glyph.
          // `hover:opacity-75` composited the "×" at 75% over its own chip and pushed it
          // under AA — yellow measured 3.39 / 3.97 / 4.43:1 over overlay / panel / shell,
          // failing on all three, and red and green failed on the tighter ones. The Tag
          // pass measured every label at full strength and never composited the hover.
          //
          // Every variant's label is now light-on-dark, so a darkening wash moves all five
          // the right way rather than the wrong one: 5.93 / 6.63 / 7.17:1 for yellow, and
          // no variant below 5.93 on any surface.
          className="hover:bg-neutral-5/40 cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs"
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
