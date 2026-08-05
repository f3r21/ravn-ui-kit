/**
 * The kit's shared colour vocabularies.
 *
 * ## The problem this fixes
 *
 * Four small colour-ish string unions had grown up independently, and two of them used
 * the *same words* for different things:
 *
 * | Component(s)                                   | Union                                                     |
 * | ---------------------------------------------- | --------------------------------------------------------- |
 * | `Button` / `TextButton`                        | `'primary' \| 'secondary'`                                 |
 * | `Tag` / `TaskCard.tags` / `TaskTableRow.tags`  | `'primary' \| 'secondary' \| 'tertiary' \| 'neutral' \| 'blue'` |
 * | `Badge`                                        | `'neutral' \| 'success' \| 'warning' \| 'danger'`          |
 * | due-date urgency                               | `'normal' \| 'warning' \| 'overdue'`                       |
 *
 * `variant="primary"` on a `Button` meant *this is the primary action* (and happens to
 * be red). `variant="primary"` on a `Tag` meant *this chip is red*. Nothing in either
 * name said which system you were in, so moving between them meant relearning. The tag
 * union was internally inconsistent too — `primary`/`secondary`/`tertiary` are rank
 * words sitting next to `blue`, which is a colour — and `warning` meant two unrelated
 * things depending on whether you were on a `Badge` or a due date.
 *
 * ## The fix, and what deliberately did *not* change
 *
 * These are genuinely three different axes, so collapsing them into one union would
 * have been wrong. Instead each axis gets one named, exported, documented type, and no
 * word is reused across two of them:
 *
 * - `AccentColor` — "which of the palette's accent colours is this", named the way the
 *   design names it.
 * - `StatusTone` — "what does this state mean", on the design's separate status ramp.
 * - `DueDateUrgency` — the one domain-specific status the kit models directly.
 *
 * `Button`/`TextButton`'s `variant` is **not** in this file on purpose. It is Figma's
 * own "Property 1" on the "Button" COMPONENT_SET (Primary/Secondary), an action-
 * hierarchy axis whose colour is a consequence rather than the point. Folding it in
 * here would recreate exactly the collision this file exists to remove.
 */

/**
 * A categorical accent colour: which of the palette's accent hues a chip, tag or
 * indicator is painted in, with no meaning attached to the choice.
 *
 * Named by colour rather than by ramp position because that is how the design itself
 * names them — Figma's "Tag" COMPONENT_SET carries a `Type` property whose values are
 * literally `General`/`Green`/`Blue`/`Yellow`/`Red` (Tags00.md, Tags01.md). The kit
 * previously renamed those to `neutral`/`secondary`/`blue`/`tertiary`/`primary`, which
 * both obscured the source and collided with `Button`'s hierarchy words. The consuming
 * app independently arrived at the same colour-named vocabulary for its own `Tag`
 * (`'green' | 'amber' | 'blue' | 'red' | 'neutral'`), which is corroboration rather
 * than coincidence.
 *
 * Each value maps to a verified ramp token, confirmed against `Tags01.md`:
 *
 * | Value     | Figma `Type` | Token         | Hex       |
 * | --------- | ------------ | ------------- | --------- |
 * | `neutral` | General      | `neutral-2`   | `#94979A` |
 * | `red`     | Red          | `primary-4`   | `#DA584B` |
 * | `green`   | Green        | `secondary-4` | `#70B252` |
 * | `yellow`  | Yellow       | `tertiary-4`  | `#E5B454` |
 * | `blue`    | Blue         | `blue`        | `#2F61BF` |
 *
 * Note `red` is `primary-4`, **not** the `danger` ramp — those are two different reds
 * (`#DA584B` vs `#E82F39`) and the design uses the former for tags. Anything conveying
 * an error state wants `StatusTone`, not this.
 */
export type AccentColor = 'neutral' | 'red' | 'green' | 'yellow' | 'blue';

/**
 * A semantic status: what a state *means*, rather than which colour it is.
 *
 * Deliberately kept separate from `AccentColor`, because it resolves to a different set
 * of ramps entirely — the design's palette carries `Success`/`Warning`/`Danger` ramps
 * alongside, and distinct from, `Primary`/`Secondary`/`Tertiary` (see
 * `UI Guidelines/Design. Colors.md`). `success-4` (`#80DA5B`) is not `secondary-4`
 * (`#70B252`), and `danger-5` (`#E82F39`) is not `primary-4` (`#DA584B`). Merging the
 * two vocabularies would have quietly repainted every status surface with brand hues.
 */
export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger';

/**
 * How close a task's due date is, as a domain concept the kit renders directly.
 *
 * `soon` was previously called `warning`, which collided with `StatusTone`'s `warning`
 * while meaning something unrelated and resolving to a different ramp. `soon` also
 * matches the consuming app's own `DueDateTone` (`'overdue' | 'soon' | 'normal'`),
 * so the two sides no longer need a translation table for this concept.
 *
 * Renders through `AccentColor`: `normal` → `neutral`, `soon` → `yellow`,
 * `overdue` → `red`.
 */
export type DueDateUrgency = 'normal' | 'soon' | 'overdue';

/**
 * Shared mapping from due-date urgency onto the accent palette, so the card, the table
 * cell and the table row cannot drift from each other on what "overdue" looks like.
 *
 * Not spec-verified: no warning/overdue instance of the due-date `Tag` appears anywhere
 * in `Cards00.md`/`Cards01.md`, so this is spec-*consistent* (it reuses the real `Tag`
 * palette rather than inventing one-off colours) rather than spec-confirmed.
 */
export const DUE_DATE_URGENCY_COLOR: Record<DueDateUrgency, AccentColor> = {
  normal: 'neutral',
  soon: 'yellow',
  overdue: 'red',
};
