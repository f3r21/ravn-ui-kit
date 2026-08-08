/**
 * How a story-point estimate is written.
 *
 * ## Why this is shared, and why the two wordings still differ
 *
 * `TaskCard` and `EstimationCell` render the same datum and disagreed about it (#94): the card
 * said `"N Pts"` with **no singular at all**, so `points={1}` rendered **"1 Pts"**, while the
 * cell already said `"1 Point"`. The same task read two different ways on one screen, and one
 * of them was ungrammatical.
 *
 * What is shared here is the **pluralisation rule**, not the words, and the corpus supports
 * keeping them apart. The exports are **not** in this repo but they are reachable, one level up
 * at `RAVN/Coding Challenge/UI-Kit/` — which is why they read as untracked from a lane
 * worktree. The Figma API's `403` was never the only route to the question, and an earlier
 * version of this comment treated it as though it were.
 *
 * Counted in `Components/`:
 *
 *     Cards00.md          Pts=2  Points=0
 *     Cards01.md          Pts=1  Points=0    :340 is `3 Pts`, the card's cited line
 *     Task Column01.md    Pts=0  Points=19   <- the cell's real support
 *     Task Column02.md    Pts=0  Points=0    <- cited previously; contains NEITHER
 *     Task Column03.md    Pts=3  Points=0
 *     controls: ZZNOTPRESENT -> 0, background -> 14
 *
 * **No file in `Components/` mixes the two**, so this is contrary evidence rather than absence
 * of evidence: unifying them would contradict the corpus, not merely lack support for it.
 *
 * **The mockups do mix, and that is not hidden here.** Six files tree-wide carry both, all of
 * them full-screen mockups and none in `Components/`. In the one traced, the `Pts` sits under a
 * `Timer` layer — the card's own points text — and the `Points` under an `Icon Placeholder`
 * with no Timer, which reads as an estimate *chip* nested inside the card frame rather than the
 * card's own text. **That attribution is inference.** These exports are CSS dumps: they attest
 * strings within frames, not component boundaries. So the split is well supported at component
 * level and ambiguous at screen level, and if anyone establishes that a card itself renders
 * "Points", this file is where to unify.
 *
 * That is the same move `DUE_DATE_URGENCY_COLOR` makes: share the thing that must agree, keep
 * the thing the design distinguishes.
 *
 * ## **Both** singulars are invented, not only `Pt`
 *
 * `grep -rinE '\b1 (Pts?|Points?)\b'` over the whole export tree returns **0**, so `"1 Point"`
 * is exactly as unattested as `"1 Pt"` — the design never shows a single point anywhere.
 * Flagging only the abbreviation would read as *"the long form is sourced"*, and it is not.
 *
 * Both are the English singular of an attested plural rather than new design values — no
 * colour, radius, shadow or spacing is being guessed — and the alternative is shipping `"1 Pts"`.
 *
 * The plurals are the opposite case, and `formatPointsLong(0)` is the strongest of them:
 * **`"0 Points"` is the best-attested string in the corpus**, 13 occurrences in `Components/`
 * and 105 tree-wide. That case was written from English's rule and lands on the most-supported
 * value in the design — design conformance, not a defensive test.
 */
export type PointsFormatter = (points: number) => string;

/** `"1 Pt"` / `"4 Pts"` — the card's abbreviation, per `Cards01.md L340-359`. */
export const formatPointsShort: PointsFormatter = (points) =>
  `${points} ${points === 1 ? 'Pt' : 'Pts'}`;

/** `"1 Point"` / `"4 Points"` — the table and the estimate menu, per `Task Column01.md` (19x). */
export const formatPointsLong: PointsFormatter = (points) =>
  `${points} ${points === 1 ? 'Point' : 'Points'}`;
