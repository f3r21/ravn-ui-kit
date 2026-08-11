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
 * One chip in a card's or a table row's tag list.
 *
 * Shared by `TaskCard.tags` and `TagCell.labels` so the two renderers cannot drift on what a
 * tag *is* — the same reason `DUE_DATE_URGENCY_COLOR` and `DUE_DATE_URGENCY_LABEL` are shared.
 */
export interface TaskTag {
  /** The chip's text. Rendered verbatim — see `className` for why it is never transformed. */
  label: string;
  /**
   * Which accent colour the chip is painted in.
   *
   * Named `accent` (#14), matching `Tag.accent` and every other `AccentColor`-typed prop.
   * @default 'neutral'
   */
  accent?: AccentColor;
  /**
   * Extra classes for this one chip, merged last so they override the defaults (#102).
   *
   * The reason this exists: `TaskCard` and `TagCell` render their chips `uppercase`, matching
   * how the design draws them, and before this there was no channel to say otherwise — a
   * consumer's only routes were to bake caps into `label` or to aim a Tailwind arbitrary
   * variant at the kit's internal DOM, and both are worse than the gap. Pass
   * `className: 'normal-case'` to opt out; `cn()` is `twMerge`, so the later class wins.
   */
  className?: string;
}

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

/**
 * Shared mapping from due-date urgency onto the text that states it, announced to assistive
 * tech beside the date. The counterpart to `DUE_DATE_URGENCY_COLOR` above, and paired with it
 * for the same reason: `TaskCard` and `DueDateCell` must not drift on what "overdue" *says*
 * any more than on what it looks like.
 *
 * **This exists because the colour was the whole signal** (#92). Both renderers took an
 * urgency and rendered it as `text-primary-2` / a red `Tag` fill and nothing else, so the
 * state reached neither a screen-reader user nor a colour-blind sighted one — WCAG 2.2 1.4.1.
 * The date text is not a substitute: `'Yesterday'` reads as past to a human, but
 * `'20 July, 2026'` requires already knowing today's date, which is the inference an
 * accessible name exists to remove.
 *
 * `normal` is deliberately **empty, and that is load-bearing rather than a placeholder.**
 * "Not urgent" is the absence of a state, so announcing it would add noise to every ordinary
 * task on the board — and an empty string is what makes "announce nothing when there is
 * nothing to announce" structural instead of a condition each renderer re-implements. A
 * consumer can silence `soon`/`overdue` the same way, by passing `''`.
 *
 * `soon` is included even though #92 is written about `overdue`: yellow-versus-neutral is
 * exactly as much a colour-only signal as red-versus-neutral, so fixing only the red half
 * would leave 1.4.1 failing for the other one.
 *
 * English by default and overridable per renderer — a hardcoded string here would rebuild
 * #13's defect in a new place. See `TaskCard.dueDateUrgencyLabel` / `DueDateCell.urgencyLabel`.
 */
export const DUE_DATE_URGENCY_LABEL: Record<DueDateUrgency, string> = {
  normal: '',
  soon: 'due soon',
  overdue: 'overdue',
};

/**
 * The consuming app's task lifecycle, as a domain concept the kit renders directly — the same
 * shape as `DueDateUrgency` above: a status vocabulary the kit does not otherwise model, carried
 * here because a Task-domain component (`TaskTableRow.accent`, ravn-ui-kit#141) needs to
 * render it and the app should not have to reinvent the mapping.
 *
 * Matches the consuming app's own generated `Status` enum
 * (`ravn-task-management-challenge/src/graphql/generated/graphql.ts`) exactly — the same five
 * values — so `task.status` passes straight through with no translation layer of the app's own.
 * `priority` is deliberately absent: it does not exist as an app field (checked the GraphQL
 * schema, the task fragment and the task form — zero hits repo-wide for `priority`), so there is
 * nothing else to key this mapping on.
 */
export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

/**
 * Shared mapping from a task's status onto the accent palette, so a consumer rendering
 * `TaskTableRow.accent` does not have to invent one — every row defaulted to the same
 * green stripe before this existed (ravn-ui-kit#141).
 *
 * **Not spec-verified, and the design vault says more than merely "unverified" here.** The
 * mockup this component is built from (`Mockups/Task Default View/My Task Mockup.md`) draws the
 * indicator stripe in three different colours *within a single status group* — `To Do`'s five
 * sample rows read red/green/yellow/green/red — which rules out a status→colour reading of the
 * source design rather than just lacking one. This mapping is an engineering decision in the
 * same category `DUE_DATE_URGENCY_COLOR` already is: some deterministic mapping beats every row
 * rendering identically, chosen to bridge `StatusTone`'s "what a state means" reading onto
 * `AccentColor`:
 *
 * | Status                | `StatusTone` reading          | `AccentColor` |
 * | ---------------------- | ------------------------------ | -------------- |
 * | `BACKLOG`, `TODO`      | not started / queued           | `neutral`      |
 * | `IN_PROGRESS`          | warning: active, not settled   | `yellow`       |
 * | `DONE`                 | success                        | `green`        |
 * | `CANCELLED`            | danger: negative terminal      | `red`          |
 *
 * `blue` is unused, matching `TaskTableRow`'s own `indicatorColorMap` doc comment — no accent
 * sample in the mockup ever draws it.
 */
export const TASK_STATUS_INDICATOR_COLOR: Record<TaskStatus, AccentColor> = {
  BACKLOG: 'neutral',
  TODO: 'neutral',
  IN_PROGRESS: 'yellow',
  DONE: 'green',
  CANCELLED: 'red',
};

/**
 * Turns a task's status into the accent colour its `TaskTableRow.accent` stripe should
 * render. A thin wrapper over `TASK_STATUS_INDICATOR_COLOR` so a consumer imports one name
 * rather than indexing a `Record` directly.
 */
export function statusToIndicatorColor(status: TaskStatus): AccentColor {
  return TASK_STATUS_INDICATOR_COLOR[status];
}
