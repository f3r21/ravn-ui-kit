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
 * What is shared here is the **pluralisation rule**, not the words. The two wordings each carry
 * their own Figma citation — the card's `"N Pts"` to `Cards01.md L340-359`, the cell's
 * `"N Points"` to `Task Column02.md` — and I could not re-derive either: the design exports are
 * untracked in this repo and the Figma API returns `403 Invalid token`. Unifying them would
 * override one of those citations on no evidence, so they stay different **deliberately** and
 * the rule that decides singular-vs-plural lives in one place where it cannot drift again.
 *
 * That is the same move `DUE_DATE_URGENCY_COLOR` makes: share the thing that must agree, keep
 * the thing the design distinguishes.
 *
 * ## `Pt` is the one invented token here, and it is small
 *
 * `"Pts"` is attested; `"Pt"` is not — no export shows a card with a single point. It is the
 * English singular of an attested abbreviation rather than a new design value (no colour,
 * radius, shadow or spacing is being guessed), and the alternative is shipping `"1 Pts"`.
 * Flagged rather than hidden: if a design source ever says otherwise, this is the line to change.
 */
export type PointsFormatter = (points: number) => string;

/** `"1 Pt"` / `"4 Pts"` — the card's abbreviation, per `Cards01.md L340-359`. */
export const formatPointsShort: PointsFormatter = (points) =>
  `${points} ${points === 1 ? 'Pt' : 'Pts'}`;

/** `"1 Point"` / `"4 Points"` — the table and the estimate menu, per `Task Column02.md`. */
export const formatPointsLong: PointsFormatter = (points) =>
  `${points} ${points === 1 ? 'Point' : 'Points'}`;
