import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Which components may paint the white field surface, keyed to component × surface.
 *
 * **This exists because nothing could have caught `Datepicker` when it was written.** #130's
 * defect was a component borrowing `Input`'s light-field surface without checking whether it *is*
 * a light field — `Select` had the same defect and was corrected, and `Datepicker` was written
 * from the same wrong premise and nobody swept for siblings. `contrast.test.ts` cannot catch this
 * class: it verifies legibility *given* a surface and never whether the surface is right, so
 * `Select` and `Datepicker` passed it the entire time they were white fields on a dark board.
 *
 * So this asserts membership rather than contrast. A new `bg-surface-neutral` fails until someone
 * adds an entry — which makes it a decision with a reason attached, in the shape
 * `.storybook/a11y-allowlist.ts` already uses for accepted axe findings.
 *
 * It deliberately does **not** try to decide whether a surface is correct. No check can: "is this
 * a light field?" is a design question. What it can do is make the answer explicit once, and make
 * the next copy visible.
 */

/** Component file -> why it is allowed to paint `bg-surface-neutral`. */
const ALLOWED: Record<string, string> = {
  'src/components/input/input.tsx':
    'Genuinely a light field. The premise the other entries were copied from, and the only one it holds for.',
  'src/components/badge/badge.tsx':
    "Badge's `neutral` variant. Its other three fills are success-1/warning-1/danger-1, all near-white, " +
    'so the whole component is a light-pill system rather than a borrowed field — and the design ships ' +
    'no Badge export at all to check it against. Tracked separately; not a copy of Input.',
};

const SURFACE = 'bg-surface-neutral';

function componentFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) componentFiles(p, out);
    else if (/\.tsx$/.test(p) && !/\.(test|stories)\.tsx$/.test(p)) out.push(p);
  }
  return out;
}

/** Lines that actually paint the surface, excluding comment lines that merely discuss it. */
function paintsSurface(file: string): boolean {
  return readFileSync(file, 'utf8')
    .split('\n')
    .some((line) => line.includes(SURFACE) && !/^\s*(\/\/|\*|\/\*)/.test(line));
}

describe('the white field surface is an allowlist, not a default', () => {
  const files = componentFiles('src/components');

  it('finds the component files at all', () => {
    // Control. Every assertion below is over `files`, so an empty list passes all of them
    // vacuously — the failure mode this repo has been burned by more than once.
    expect(files.length).toBeGreaterThan(30);
  });

  it('control: the probe can see the surface where it is present', () => {
    // Without this, `paintsSurface` returning false for everything would report perfect
    // compliance. Asserts the allowlist is not merely a list of files that happen to pass.
    const painters = files.filter(paintsSurface);
    expect(painters.length).toBeGreaterThan(0);
  });

  it('control: it does not count a comment that merely mentions the surface', () => {
    // `card.tsx` documents that it *used to* render this surface. A line-based probe that
    // counted prose would report Card as a painter and demand an allowlist entry for a
    // component that moved off it in `6bc133f` — the exact stale-list defect #130 is about.
    expect(readFileSync('src/components/card/card.tsx', 'utf8')).toContain(SURFACE);
    expect(paintsSurface('src/components/card/card.tsx')).toBe(false);
  });

  it('no component paints it without an allowlist entry', () => {
    const unlisted = files.filter((f) => paintsSurface(f) && !(f in ALLOWED));
    expect(unlisted).toEqual([]);
  });

  it('every allowlist entry is still a painter — no stale entries', () => {
    // The other direction, and the one a list like this always drifts in: an entry outliving
    // the code it excused. `Select`, `MultiSelect`, `Card` and `Datepicker` have each left this
    // surface, and a prose list in `contrast.test.ts` recorded none of the four departures.
    const stale = Object.keys(ALLOWED).filter((f) => !paintsSurface(f));
    expect(stale).toEqual([]);
  });
});
