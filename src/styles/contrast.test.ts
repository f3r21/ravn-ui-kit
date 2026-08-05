import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Contrast guard for the token layer.
 *
 * This pins a *decision*, not a rendering. Every pairing below is one the kit's
 * components actually make, and the ratios are computed from `tokens.css` itself —
 * so changing a hex there fails here, rather than shipping and being found by
 * someone running axe months later. That is exactly how the nine failures this
 * file was written for got in.
 *
 * It deliberately runs in jsdom without touching the DOM. jsdom applies no real
 * CSS, so an `axe` colour-contrast pass there reports nothing at all — the
 * rendering half of this is a separate axe-over-Storybook job in CI, which is the
 * only thing that can catch composited alpha (a 10%-tint chip over a white
 * trigger). Arithmetic here, pixels there; neither alone is enough.
 *
 * WCAG 2.1: 4.5:1 for normal text (1.4.3), 3:1 for large text and for non-text UI
 * boundaries like borders and focus rings (1.4.11). Nothing in this kit qualifies
 * as large — the biggest UI text is `--text-body-m` at 15px — so text is 4.5
 * throughout.
 */

// From `process.cwd()` (the repo root under Vitest) rather than `import.meta.url`:
// the jsdom environment does not give this module a `file:` URL, so
// `fileURLToPath` throws on it.
const TOKENS_CSS = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8');

/**
 * `--color-foo: #abc123;`, `--color-foo: var(--color-bar);`, `rgba(...)`.
 *
 * Comments are stripped first: this file's own prose mentions plenty of token
 * names, and a declaration is only a declaration outside a comment. Values are
 * whitespace-collapsed because Prettier wraps long `var()` calls across lines.
 */
export function readTokens(css: string): Map<string, string> {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = new Map<string, string>();
  for (const [, name, value] of withoutComments.matchAll(/(--color-[\w-]+):\s*([^;]+);/g)) {
    out.set(name, value.replace(/\s+/g, ' ').trim());
  }
  return out;
}

const TOKENS = readTokens(TOKENS_CSS);

/** Follows `var(--x)` chains to a literal colour. */
function resolve(name: string, seen = new Set<string>()): string {
  if (seen.has(name)) throw new Error(`Circular token reference at ${name}`);
  seen.add(name);
  const value = TOKENS.get(name);
  if (!value) throw new Error(`Unknown token ${name}`);
  const alias = /^var\(\s*(--color-[\w-]+)\s*\)$/.exec(value);
  return alias ? resolve(alias[1], seen) : value;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function parseColor(value: string): Rgb {
  const hex = /^#([0-9a-f]{6})$/i.exec(value);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const rgba = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)$/i.exec(
    value,
  );
  if (rgba) {
    return {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: rgba[4] === undefined ? 1 : Number(rgba[4]),
    };
  }
  throw new Error(`Cannot parse colour: ${value}`);
}

/** Flattens a translucent foreground onto an opaque background. */
function composite(fg: Rgb, bg: Rgb): Rgb {
  if (fg.a === 1) return fg;
  return {
    r: fg.a * fg.r + (1 - fg.a) * bg.r,
    g: fg.a * fg.g + (1 - fg.a) * bg.g,
    b: fg.a * fg.b + (1 - fg.a) * bg.b,
    a: 1,
  };
}

function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * WCAG contrast ratio, compositing the foreground onto the background first.
 *
 * The background may be a token name or an already-composited colour from `tint()`.
 * The kit's chips are a 10%-alpha fill, so what their text actually sits on is a blend
 * rather than a token — measuring against the bare token underneath would report a
 * ratio nothing on screen has.
 */
export function contrastRatio(fgToken: string, bg: string | Rgb): number {
  const bgRgb = typeof bg === 'string' ? parseColor(resolve(bg)) : bg;
  const fg = composite(parseColor(resolve(fgToken)), bgRgb);
  const [light, dark] = [relativeLuminance(fg), relativeLuminance(bgRgb)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

/**
 * The colour a `bg-<token>/<alpha>` fill actually paints over `bg`.
 *
 * Nests, because the kit does: a `MultiSelect` trigger is a 10% tint and the `Tag` chips
 * inside it are another 10% tint over that.
 */
export function tint(fgToken: string, alpha: number, bg: string | Rgb): Rgb {
  const bgRgb = typeof bg === 'string' ? parseColor(resolve(bg)) : bg;
  return composite({ ...parseColor(resolve(fgToken)), a: alpha }, bgRgb);
}

/** The three dark surfaces a form can sit on. Any text role must clear all three. */
const DARK_SURFACES = [
  '--color-surface-overlay', // #393D41 — modal card, popover. The tightest of the three.
  '--color-surface-panel', // #2C2F33 — cards, columns, sidebar
  '--color-surface-shell', // #222528 — the app shell
] as const;

const AA_TEXT = 4.5;
const AA_NON_TEXT = 3;

describe('token contrast', () => {
  describe('text on the dark surfaces', () => {
    const TEXT_ROLES = [
      '--color-main', // body/value text
      '--color-muted-on-dark', // descriptions, and any secondary text of unknown surface
      '--color-danger-text', // error messages, required marker
      '--color-interactive-text', // selected option, "Today"
    ];

    for (const role of TEXT_ROLES) {
      for (const surface of DARK_SURFACES) {
        it(`${role} on ${surface} clears AA`, () => {
          expect(contrastRatio(role, surface)).toBeGreaterThanOrEqual(AA_TEXT);
        });
      }
    }
  });

  describe('text on the light field surface', () => {
    // `--color-surface-neutral` is white — the inside of Input, Datepicker, Card and
    // Badge's neutral variant. Not Select or MultiSelect any more: their triggers are
    // the design's dark chip, measured in the block below.
    it('--color-neutral-5 (the value) clears AA', () => {
      expect(contrastRatio('--color-neutral-5', '--color-surface-neutral')).toBeGreaterThanOrEqual(
        AA_TEXT,
      );
    });

    it('--color-muted-on-light (the placeholder) clears AA', () => {
      expect(
        contrastRatio('--color-muted-on-light', '--color-surface-neutral'),
      ).toBeGreaterThanOrEqual(AA_TEXT);
    });
  });

  /**
   * `Avatar`'s initials, on the `primary-1` tint.
   *
   * This is the only light surface in the kit that is not white, and it was the single
   * largest defect in the palette: 46 of the 131 contrast violations an axe pass over the
   * built Storybook reported came from one `bg-primary-1 text-primary-4` class, at
   * 2.61:1, because an avatar appears in nearly every composed story.
   *
   * It also had no defence. The design draws no initials state at all — every exported
   * Avatar frame is image-filled — so unlike the primary button below, there was no Figma
   * pairing to deviate from. `neutral-5` is what the kit already puts on a light surface.
   */
  describe('text on the accent tint', () => {
    it('--color-neutral-5 (the initials) clears AA on --color-primary-1', () => {
      expect(contrastRatio('--color-neutral-5', '--color-primary-1')).toBeGreaterThanOrEqual(
        AA_TEXT,
      );
    });
  });

  /**
   * The chip surface: `bg-neutral-2/10`, the design's own `rgba(148, 151, 154, 0.1)`.
   *
   * `Tag` has always been this, and `Select`/`MultiSelect`'s triggers now are too. It is
   * the one surface in the kit that no token names, because it is a *blend* — the same
   * fill measures differently on each of the three dark surfaces it can land on, so
   * every ratio here has to be computed against the composite rather than looked up.
   * That is what `tint()` exists for, and it is exactly the case the jsdom half of this
   * file was previously blind to.
   */
  describe('text on the chip surface', () => {
    const chipOn = (surface: string) => tint('--color-neutral-2', 0.1, surface);

    for (const surface of DARK_SURFACES) {
      it(`--color-main (the value) clears AA on a chip over ${surface}`, () => {
        expect(contrastRatio('--color-main', chipOn(surface))).toBeGreaterThanOrEqual(AA_TEXT);
      });

      it(`--color-muted-on-dark (the placeholder) clears AA on a chip over ${surface}`, () => {
        expect(contrastRatio('--color-muted-on-dark', chipOn(surface))).toBeGreaterThanOrEqual(
          AA_TEXT,
        );
      });

      // MultiSelect renders its selection as `Tag` chips *inside* the trigger chip, so
      // its labels sit on a 10% tint of a 10% tint. Two composites deep is still the
      // shallowest thing on screen that a bare-token assertion would get wrong.
      it(`--color-main clears AA on a Tag nested in a trigger over ${surface}`, () => {
        const nested = tint('--color-neutral-2', 0.1, chipOn(surface));
        expect(contrastRatio('--color-main', nested)).toBeGreaterThanOrEqual(AA_TEXT);
      });
    }

    /**
     * The invalid ring, which is `--color-danger-text` on these two controls and
     * `--color-danger` everywhere else — the one place the kit deliberately disagrees
     * with itself, so it is pinned rather than left to a comment.
     *
     * `FIELD_ERROR_CLASS` justifies `danger-5` as an invalid *border* on the strength of
     * the white field interior it separates from the container. A chip has no white
     * interior, so that argument does not transfer, and both of the ring's adjacent
     * colours are dark. `danger-3` is the step that clears 3:1 on both of them.
     */
    for (const surface of DARK_SURFACES) {
      it(`--color-danger-text as the invalid ring clears 3:1 on both sides over ${surface}`, () => {
        expect(contrastRatio('--color-danger-text', chipOn(surface))).toBeGreaterThanOrEqual(
          AA_NON_TEXT,
        );
        expect(contrastRatio('--color-danger-text', surface)).toBeGreaterThanOrEqual(AA_NON_TEXT);
      });
    }
  });

  /**
   * 1.4.11 asks for 3:1 against *adjacent* colours. A field's border has two — the white
   * interior and the dark container — and is perceivable if it clears 3:1 against either.
   * Neither border clears it against both, and they fail on opposite sides: `subtle`
   * (2.94:1 on white) is carried by the container, `danger` (2.55:1 on an overlay) is
   * carried by the interior. So the assertion is "at least one side", which is what the
   * success criterion actually requires — not "every side", which nothing here meets.
   *
   * This covers `Input`, `Datepicker`, `Card`, `Badge` and `FloatingPopover` — every
   * bordered surface left. `Select` and `MultiSelect` are no longer among them: their
   * triggers are the design's chip, which has no border at all, and their invalid ring
   * is measured in "text on the chip surface" above precisely because the
   * white-interior half of the argument below is not available to it.
   */
  describe('field borders are perceivable against at least one adjacent surface', () => {
    for (const border of ['--color-subtle', '--color-danger']) {
      for (const container of DARK_SURFACES) {
        it(`${border} on a field over ${container}`, () => {
          const best = Math.max(
            contrastRatio(border, '--color-surface-neutral'),
            contrastRatio(border, container),
          );
          expect(best).toBeGreaterThanOrEqual(AA_NON_TEXT);
        });
      }
    }
  });

  /**
   * A focus ring is different, and this is where the arithmetic disagreed with the
   * comment I had written. Every ring in the kit is `outline-offset-2`, so it is drawn
   * *clear of* the field, on the container — it has only one adjacent colour, and the
   * "passes against the interior" argument above does not apply to it.
   *
   * `--color-interactive` (primary-4) clears 3:1 on the shell and on a panel but
   * measures **2.86:1 on `surface-overlay`** — a form inside a modal or a popover. That
   * is a real, previously unrecorded failure; it is asserted here as the current state
   * rather than silently expected to pass, because fixing it means recolouring every
   * focus ring in the kit (23 sites) and that is a visual decision, not a bug fix.
   * Tracked in `MIGRATION_GAPS.md`.
   */
  describe('focus rings', () => {
    it('clear 3:1 on the shell and on panels', () => {
      expect(contrastRatio('--color-interactive', '--color-surface-shell')).toBeGreaterThanOrEqual(
        AA_NON_TEXT,
      );
      expect(contrastRatio('--color-interactive', '--color-surface-panel')).toBeGreaterThanOrEqual(
        AA_NON_TEXT,
      );
    });

    it('do NOT clear 3:1 on an overlay — known, tracked, not yet fixed', () => {
      expect(contrastRatio('--color-interactive', '--color-surface-overlay')).toBeLessThan(
        AA_NON_TEXT,
      );
      // The colour that would fix it, when someone decides to take the visual change.
      expect(
        contrastRatio('--color-interactive-text', '--color-surface-overlay'),
      ).toBeGreaterThanOrEqual(AA_NON_TEXT);
    });
  });

  /**
   * The nine failures this file was written for, plus the two the chip surface added,
   * pinned as the *reason* each role exists rather than as bare numbers. If one of these
   * starts passing, the palette changed and the role it justifies may no longer be
   * needed.
   */
  describe('the pairings that were wrong, and still would be', () => {
    it('neutral-3 as label text is invisible on the shell — 1.41:1', () => {
      expect(contrastRatio('--color-neutral-3', '--color-surface-shell')).toBeLessThan(2);
    });

    it('danger-5 as error text fails on every dark surface', () => {
      for (const surface of DARK_SURFACES) {
        expect(contrastRatio('--color-danger', surface)).toBeLessThan(AA_TEXT);
      }
    });

    it('danger-4 fails on the modal card, which is why danger-3 is the error colour', () => {
      expect(contrastRatio('--color-danger-4', '--color-surface-overlay')).toBeLessThan(AA_TEXT);
    });

    it('primary-4 as text fails on every dark surface', () => {
      for (const surface of DARK_SURFACES) {
        expect(contrastRatio('--color-interactive', surface)).toBeLessThan(AA_TEXT);
      }
    });

    it('primary-3 fails on the popover, which is why primary-2 is the accent text', () => {
      expect(contrastRatio('--color-primary-3', '--color-surface-overlay')).toBeLessThan(AA_TEXT);
    });

    it('muted as a placeholder is unreadable inside a light field — 2.94:1', () => {
      expect(contrastRatio('--color-muted', '--color-surface-neutral')).toBeLessThan(AA_TEXT);
    });

    it('primary-4 on primary-1 was the kit’s biggest single defect — 2.61:1, 46 renders', () => {
      expect(contrastRatio('--color-interactive', '--color-primary-1')).toBeCloseTo(2.61, 2);
    });

    /**
     * Two more the chip surface adds. Both look safe and are not, and both are the
     * obvious first guess — which is how the white trigger got here in the first place.
     */
    it('muted as a chip placeholder fails on every dark surface — 3.24 / 3.93 / 4.49:1', () => {
      for (const surface of DARK_SURFACES) {
        expect(
          contrastRatio('--color-muted', tint('--color-neutral-2', 0.1, surface)),
        ).toBeLessThan(AA_TEXT);
      }
      // The shell case misses by 0.01, which is the whole argument for computing these
      // rather than eyeballing them.
      expect(
        contrastRatio('--color-muted', tint('--color-neutral-2', 0.1, '--color-surface-shell')),
      ).toBeCloseTo(4.49, 2);
    });

    it('danger-5 as the invalid ring on a chip fails on BOTH sides over an overlay', () => {
      const chip = tint('--color-neutral-2', 0.1, '--color-surface-overlay');
      expect(contrastRatio('--color-danger', chip)).toBeLessThan(AA_NON_TEXT);
      expect(contrastRatio('--color-danger', '--color-surface-overlay')).toBeLessThan(AA_NON_TEXT);
    });
  });

  /**
   * The helpers get their own tests because this file's authority rests on them. A
   * silently-wrong parser would make every assertion above pass for the wrong reason,
   * which is the failure mode a contrast guard can least afford.
   */
  describe('the parser', () => {
    it('reads hex, rgb and rgba, defaulting alpha to opaque', () => {
      expect(parseColor('#ffffff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
      expect(parseColor('#393d41')).toEqual({ r: 57, g: 61, b: 65, a: 1 });
      expect(parseColor('rgb(20, 20, 43)')).toEqual({ r: 20, g: 20, b: 43, a: 1 });
      expect(parseColor('rgba(20, 20, 43, 0.65)')).toEqual({ r: 20, g: 20, b: 43, a: 0.65 });
    });

    it('rejects a colour it cannot read rather than guessing one', () => {
      expect(() => parseColor('hsl(210 11% 24%)')).toThrow(/Cannot parse colour/);
    });

    it('ignores declarations inside comments', () => {
      const tokens = readTokens('/* --color-fake: #000000; */ --color-real: #ffffff;');
      expect(tokens.has('--color-fake')).toBe(false);
      expect(tokens.get('--color-real')).toBe('#ffffff');
    });

    it('collapses the whitespace Prettier introduces into wrapped var() calls', () => {
      const tokens = readTokens('--color-a: var(\n    --color-b\n  );');
      expect(tokens.get('--color-a')).toBe('var( --color-b )');
    });

    it('refuses an unknown token instead of treating it as black', () => {
      expect(() => contrastRatio('--color-does-not-exist', '--color-main')).toThrow(
        /Unknown token/,
      );
    });
  });

  describe('the maths itself', () => {
    it('is symmetric and bounded by black-on-white', () => {
      expect(contrastRatio('--color-neutral-1', '--color-neutral-5')).toBeCloseTo(
        contrastRatio('--color-neutral-5', '--color-neutral-1'),
        10,
      );
      expect(contrastRatio('--color-neutral-1', '--color-neutral-1')).toBeCloseTo(1, 10);
    });

    it('composites alpha before measuring', () => {
      // transparent-dark-65 is rgba(20,20,43,.65); flattened on white it is a mid
      // grey, so it must measure well above the same colour treated as opaque.
      expect(contrastRatio('--color-muted-on-light', '--color-surface-neutral')).toBeLessThan(
        contrastRatio('--color-transparent-dark-95', '--color-surface-neutral'),
      );
    });

    it('reproduces the ratio Phase 1 measured in a browser', () => {
      // axe reported 1.4:1 for the old label colour. Agreement to two decimals is
      // the check that this file's arithmetic matches a real browser's.
      expect(contrastRatio('--color-neutral-3', '--color-surface-shell')).toBeCloseTo(1.41, 2);
    });
  });
});
