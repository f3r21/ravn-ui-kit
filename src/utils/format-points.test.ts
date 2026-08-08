import { describe, it, expect } from 'vitest';
import { formatPointsShort, formatPointsLong } from './format-points';

/**
 * #94. `TaskCard` rendered `` `${points} Pts` `` with no singular, so `points={1}` produced
 * **"1 Pts"** while the table cell beside it said "1 Point" — the same datum, two spellings, one
 * of them ungrammatical.
 *
 * These test the rule. The component tests check that each component reads it.
 */
describe('points formatters', () => {
  describe('formatPointsShort — the card', () => {
    it('has a singular, which is the bug this issue is named for', () => {
      expect(formatPointsShort(1)).toBe('1 Pt');
      expect(formatPointsShort(1)).not.toBe('1 Pts');
    });

    it('control: the plural still pluralises', () => {
      // Without this, a fix that hardcoded the singular would pass the case above.
      expect(formatPointsShort(4)).toBe('4 Pts');
    });

    it('treats zero as plural, which is English’s rule and not a fallthrough', () => {
      // Asserted rather than left to fall out of a `=== 1` check by luck.
      expect(formatPointsShort(0)).toBe('0 Pts');
    });
  });

  describe('formatPointsLong — the table and the estimate menu', () => {
    it('pluralises, as it already did', () => {
      expect(formatPointsLong(1)).toBe('1 Point');
      expect(formatPointsLong(4)).toBe('4 Points');
      expect(formatPointsLong(0)).toBe('0 Points');
    });
  });

  /**
   * The two **words** differ deliberately — the card's `"Pts"` cites `Cards01.md L340-359`, the
   * cell's `"Points"` cites `Task Column02.md`, and neither could be re-derived (the design
   * exports are untracked here and the Figma API returns `403 Invalid token`). Unifying them
   * would override a citation on no evidence.
   *
   * What must agree is the **rule**. Asserted as agreement between the two formatters rather
   * than as two separate literal pins: two literals pass happily after one is changed and the
   * other is not, which is exactly how the card and the cell drifted apart in the first place.
   */
  it('the two wordings differ, but they break singular at the same place', () => {
    const singularAt = (f: (n: number) => string) =>
      [0, 1, 2, 4].filter((n) => !f(n).endsWith('s'));

    expect(singularAt(formatPointsShort)).toEqual([1]);
    expect(singularAt(formatPointsLong)).toEqual([1]);
    expect(singularAt(formatPointsShort)).toEqual(singularAt(formatPointsLong));

    // Control: the probe can tell them apart, so the agreement above is not vacuous.
    expect(formatPointsShort(4)).not.toBe(formatPointsLong(4));
  });
});
