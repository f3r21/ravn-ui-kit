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
   * `Tag`'s five accent chips.
   *
   * Figma paints label and fill from one swatch — `bg-X/10 text-X` — which is
   * structurally incapable of clearing AA, because a 10% tint of a colour is never far
   * from that colour. Red and green were 27 of the 131 violations an axe pass reported.
   *
   * What settles the shape of the fix is that no *fill* rescues them: `primary-4` as text
   * clears 4.5:1 against nothing in this palette (best case 4.02:1, on the shell). So the
   * fills stay exactly as drawn and the labels step up their own ramps.
   *
   * Each chip is measured on its own composite, not against the bare surface — that is
   * what `tint()` is for, and it is the whole reason the jsdom half of this file could
   * not see these before.
   */
  describe('Tag', () => {
    const VARIANTS = [
      // variant, Figma's fill, the label/border colour after this pass
      ['neutral', '--color-neutral-2', '--color-main'],
      ['red', '--color-primary-4', '--color-primary-2'],
      ['green', '--color-secondary-4', '--color-secondary-2'],
      ['yellow', '--color-tertiary-4', '--color-tertiary-4'],
      ['blue', '--color-blue', '--color-main'],
    ] as const;

    for (const [variant, fill, label] of VARIANTS) {
      for (const surface of DARK_SURFACES) {
        it(`${variant} solid: the label clears AA on its own tint over ${surface}`, () => {
          expect(contrastRatio(label, tint(fill, 0.1, surface))).toBeGreaterThanOrEqual(AA_TEXT);
        });

        // Outline has a transparent fill, so its label sits on the surface directly.
        it(`${variant} outline: the label clears AA on ${surface}`, () => {
          expect(contrastRatio(label, surface)).toBeGreaterThanOrEqual(AA_TEXT);
        });
      }
    }

    /**
     * The outline border is a non-text boundary — 3:1 under 1.4.11 — and unlike a field's
     * border it has only one adjacent colour, because the fill it encloses is transparent.
     */
    for (const [variant, , border] of VARIANTS.filter(([v]) => v !== 'blue')) {
      for (const surface of DARK_SURFACES) {
        it(`${variant} outline: the border clears 3:1 on ${surface}`, () => {
          expect(contrastRatio(border, surface)).toBeGreaterThanOrEqual(AA_NON_TEXT);
        });
      }
    }

    /**
     * Blue's border is the one thing this pass could not fix, recorded here as the
     * current state so it cannot be mistaken for passing.
     *
     * `--color-blue` is a standalone accent with no ramp — `tokens.css` says so, and it
     * exists for `Tag`'s Blue type alone — so there is no lighter step to move a border
     * to, and CONTRIBUTING.md's first design value rules out inventing one. A white
     * border would clear it, but would make the outline blue tag indistinguishable from
     * the neutral one, which trades a boundary nobody can see for a variant nobody can
     * tell apart. The *label* is white and does clear AA; only the border is short.
     */
    for (const surface of DARK_SURFACES) {
      it(`blue outline: the border does NOT clear 3:1 on ${surface} — known, no lighter blue exists`, () => {
        expect(contrastRatio('--color-blue', surface)).toBeLessThan(AA_NON_TEXT);
      });
    }
  });

  /**
   * `Badge`'s four status pills — the same defect as `Tag`, on light fills instead of
   * dark tints, and the only group the audit's ranked table missed. It missed them
   * because `Badge` renders in few stories, not because they were close: `success-4` on
   * `success-1` measured 1.69:1, the worst pairing in the kit after `Tag`'s blue.
   *
   * Warning and danger needed nothing invented — their ramps already carry a step 6 for
   * exactly this. Success does not, and there is no other dark green in the palette, so
   * it borrows the `neutral` variant's label and lets its fill carry the status.
   */
  describe('Badge', () => {
    const VARIANTS = [
      ['neutral', '--color-surface-neutral', '--color-neutral-4'],
      ['success', '--color-success-1', '--color-neutral-4'],
      ['warning', '--color-warning-1', '--color-warning-6'],
      ['danger', '--color-danger-1', '--color-danger-6'],
    ] as const;

    for (const [variant, fill, label] of VARIANTS) {
      it(`${variant}'s label clears AA on its own fill`, () => {
        expect(contrastRatio(label, fill)).toBeGreaterThanOrEqual(AA_TEXT);
      });
    }

    /**
     * The step-2 borders are **not** asserted at 3:1, and that is deliberate rather than
     * an omission. `success-2` measures 1.14:1 against the fill it encloses and 1.17:1
     * against a white page; warning and danger are the same story. 1.4.11 asks for 3:1 on
     * boundaries *required to identify* a control, and a badge is identified by its own
     * text — the hairline is decoration. Raising it would repaint four components to fix
     * nothing a user relies on.
     */
    it('the step-2 borders are decoration, not an identifying boundary — recorded, not fixed', () => {
      for (const [border, fill] of [
        ['--color-success-2', '--color-success-1'],
        ['--color-warning-2', '--color-warning-1'],
        ['--color-danger-2', '--color-danger-1'],
      ] as const) {
        expect(contrastRatio(border, fill)).toBeLessThan(AA_NON_TEXT);
      }
    });

    it('the success ramp has no dark step, which is why success borrows neutral’s label', () => {
      // If a `success-5`/`success-6` ever lands, this fails and the fallback can go.
      expect(TOKENS.has('--color-success-5')).toBe(false);
      expect(TOKENS.has('--color-success-6')).toBe(false);
      // The nearest green in the whole palette, and it is nowhere near.
      expect(contrastRatio('--color-secondary-4', '--color-success-1')).toBeLessThan(AA_TEXT);
    });
  });

  /**
   * The solid `neutral-2` pill — `SegmentedControl`'s active segment, `EstimateModal`'s
   * selected row, and the hover fill on `TextButton` secondary and both `AddTaskModal`
   * triggers.
   *
   * Note this is `bg-neutral-2`, **not** the `bg-neutral-2/10` chip measured above. Full
   * strength, it is a mid grey, and the white label the design specifies sits on it at
   * 2.94:1. Only two of the five sites were ever visible to axe: the other three are
   * hover states, and a static story has no hover. Arithmetic catches what pixels cannot,
   * which is the same division of labour as the placeholder case.
   */
  describe('the solid neutral-2 pill', () => {
    it('--color-neutral-5 (the label) clears AA on it', () => {
      expect(contrastRatio('--color-neutral-5', '--color-neutral-2')).toBeGreaterThanOrEqual(
        AA_TEXT,
      );
    });

    it('--color-main does not — 2.94:1, which is what the design drew', () => {
      expect(contrastRatio('--color-main', '--color-neutral-2')).toBeCloseTo(2.94, 2);
    });
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
   * A focus ring is different from a field border, and this is where the arithmetic
   * disagreed with a comment written before it. Every ring in the kit is
   * `outline-offset-2`, so it is drawn *clear of* the control, on the container — it has
   * only one adjacent colour, and the "passes against the interior" argument above does
   * not apply to it.
   *
   * All 39 rings are `--color-interactive-text` (`primary-2`) as of this pass. They were
   * `--color-interactive` (`primary-4`), which clears 3:1 on the shell (4.02:1) and on a
   * panel (3.51:1) but measures **2.86:1 on `surface-overlay`** — a modal or a popover,
   * which is exactly where a form is most likely to be and where losing the indicator
   * costs the most. That failure was recorded here as the current state for one release
   * because recolouring every ring is a visual change; it is now fixed, and nothing was
   * traded for it, because the design file draws no focus state anywhere. The ring was an
   * engineering addition from the start.
   */
  describe('focus rings', () => {
    for (const surface of DARK_SURFACES) {
      it(`--color-interactive-text clears 3:1 on ${surface}`, () => {
        expect(contrastRatio('--color-interactive-text', surface)).toBeGreaterThanOrEqual(
          AA_NON_TEXT,
        );
      });
    }

    it('primary-4, the colour they used to be, still fails on an overlay — 2.86:1', () => {
      expect(contrastRatio('--color-interactive', '--color-surface-overlay')).toBeLessThan(
        AA_NON_TEXT,
      );
    });

    /**
     * The cost of the swap, recorded rather than discovered later. `primary-2` on white is
     * **2.02:1** — worse than the `primary-4` it replaced (3.83:1) — so a consumer placing
     * a kit control on a light container has to override the ring.
     *
     * No kit surface is light, which is what makes the trade correct here: `Input` and
     * `Datepicker` have white *interiors*, but `outline-offset-2` draws the ring clear of
     * the field, on the dark container outside it. `Card` and `Badge` are the kit's only
     * light surfaces and neither is focusable nor contains a focusable of its own.
     */
    it('are specified for the kit’s dark containers — a consumer on white must override', () => {
      expect(contrastRatio('--color-interactive-text', '--color-surface-neutral')).toBeLessThan(
        AA_NON_TEXT,
      );
    });
  });

  /**
   * The design's own primary button, which fails AA and is kept anyway.
   *
   * Asserted as the *current state* — the same treatment the focus ring had for one
   * release — so it cannot be mistaken for passing. This is the one place in the kit
   * where the design has a definite opinion that fails, rather than being silent: white
   * on `primary-4` is what Figma draws for `TextButton variant="primary"`, 14 of the 131
   * violations.
   *
   * Everything else in this pass had somewhere to go. This does not. No label colour
   * fixes it (the darkest thing in the palette, `neutral-5`, reaches 4.02:1), and no fill
   * in the ramp fixes it (`primary-4` is already its darkest step). The only fix is a
   * darker red the design does not contain, and inventing one is what CONTRIBUTING.md's
   * first design value forbids.
   *
   * The icon `Button`'s `variant="primary"` shares the fill and is fine: an icon is
   * non-text, so 1.4.11's 3:1 applies and 3.83:1 clears it. That distinction is the whole
   * reason this is scoped to `TextButton`.
   */
  describe('the primary CTA — known, deliberate, not fixed', () => {
    it('white on primary-4 does NOT clear AA as text — 3.83:1', () => {
      expect(contrastRatio('--color-main', '--color-primary-4')).toBeCloseTo(3.83, 2);
      expect(contrastRatio('--color-main', '--color-primary-4')).toBeLessThan(AA_TEXT);
    });

    it('but it does clear 3:1, which is what the icon Button needs', () => {
      expect(contrastRatio('--color-main', '--color-primary-4')).toBeGreaterThanOrEqual(
        AA_NON_TEXT,
      );
    });

    it('the selected and disabled fills are worse, not better — 2.83 / 2.02:1', () => {
      expect(contrastRatio('--color-main', '--color-primary-3')).toBeCloseTo(2.83, 2);
      expect(contrastRatio('--color-main', '--color-primary-2')).toBeCloseTo(2.02, 2);
    });

    it('no colour in the palette rescues the label either — neutral-5 is the darkest, at 4.02:1', () => {
      for (const label of ['--color-neutral-5', '--color-neutral-4', '--color-neutral-3']) {
        expect(contrastRatio(label, '--color-primary-4')).toBeLessThan(AA_TEXT);
      }
      expect(contrastRatio('--color-neutral-5', '--color-primary-4')).toBeCloseTo(4.02, 2);
    });

    /**
     * `Button variant="secondary" isSelected` is the same shape of call at 1.4.11's
     * threshold: Figma specifies a `primary-4` border and a `primary-4` icon, both
     * non-text, and both measure 2.86:1 on `surface-overlay` — an icon button inside a
     * modal. It passes on the other two surfaces (3.51 / 4.02:1).
     *
     * Left as drawn for the same reason as the button above, and recorded here rather
     * than fixed. It is *not* the same as the focus ring, which moved in this pass: the
     * ring has no Figma source at all, so recolouring it cost nothing. This state is
     * specified.
     */
    it('Button’s selected secondary border and icon fail 3:1 on an overlay only — 2.86:1', () => {
      expect(contrastRatio('--color-interactive', '--color-surface-overlay')).toBeCloseTo(2.86, 2);
      expect(contrastRatio('--color-interactive', '--color-surface-panel')).toBeGreaterThanOrEqual(
        AA_NON_TEXT,
      );
      expect(contrastRatio('--color-interactive', '--color-surface-shell')).toBeGreaterThanOrEqual(
        AA_NON_TEXT,
      );
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

    /**
     * The reason `--color-muted-on-dark` exists, asserted rather than only described in
     * `tokens.css`. It is the pairing that took eight more of the 131: the Assignee,
     * Estimate and Label popovers' headers, and `UserRow`'s role text inside them. Note it
     * *passes* on the other two surfaces, which is what makes it easy to ship — a
     * component built and reviewed on a panel is fine until it is dropped into a modal.
     */
    it('muted is fine on a panel and the shell, and fails on an overlay — 3.73:1', () => {
      expect(contrastRatio('--color-muted', '--color-surface-panel')).toBeGreaterThanOrEqual(
        AA_TEXT,
      );
      expect(contrastRatio('--color-muted', '--color-surface-shell')).toBeGreaterThanOrEqual(
        AA_TEXT,
      );
      expect(contrastRatio('--color-muted', '--color-surface-overlay')).toBeCloseTo(3.73, 2);
    });

    it('primary-4 on primary-1 was the kit’s biggest single defect — 2.61:1, 46 renders', () => {
      expect(contrastRatio('--color-interactive', '--color-primary-1')).toBeCloseTo(2.61, 2);
    });

    /**
     * Figma's own `bg-X/10 text-X` for `Tag`. Kept as an assertion because it is the
     * argument for the deviation above: if one of these ever starts passing, the palette
     * moved and the label should move back to the swatch the design draws.
     */
    it('a 10% tint is never far enough from its own colour to be text on', () => {
      for (const [fill, surfaces] of [
        ['--color-primary-4', DARK_SURFACES],
        ['--color-secondary-4', ['--color-surface-overlay', '--color-surface-panel']],
        ['--color-blue', DARK_SURFACES],
      ] as const) {
        for (const surface of surfaces) {
          expect(contrastRatio(fill, tint(fill, 0.1, surface))).toBeLessThan(AA_TEXT);
        }
      }
      // Green is the near miss that makes the case for computing rather than eyeballing:
      // on a panel it is 4.44:1, short of AA by 0.06.
      expect(
        contrastRatio(
          '--color-secondary-4',
          tint('--color-secondary-4', 0.1, '--color-surface-panel'),
        ),
      ).toBeCloseTo(4.44, 2);
    });

    it('the status ramps’ own step-4/5 labels on their step-1 fills — 1.69 / 2.34 / 3.90:1', () => {
      expect(contrastRatio('--color-success-4', '--color-success-1')).toBeCloseTo(1.69, 2);
      expect(contrastRatio('--color-warning-5', '--color-warning-1')).toBeCloseTo(2.34, 2);
      expect(contrastRatio('--color-danger', '--color-danger-1')).toBeCloseTo(3.9, 2);
    });

    it('no fill rescues a primary-4 label — it clears 4.5:1 against nothing here', () => {
      const everySurface = [
        ...DARK_SURFACES,
        '--color-surface-neutral',
        '--color-primary-1',
        '--color-neutral-3',
      ];
      for (const surface of everySurface) {
        expect(contrastRatio('--color-interactive', surface)).toBeLessThan(AA_TEXT);
      }
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
