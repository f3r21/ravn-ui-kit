import { useId } from 'react';
import { cn } from '../../utils/cn';
import { formatPointsShort, type PointsFormatter } from '../../utils/format-points';
import type { HeadingLevel } from '../../types/heading-level';
import { Tag } from '../tag/tag';
import { Avatar } from '../avatar/avatar';
import { Card } from './card';
import { ProjectInfo } from './project-info';
import { TaskMetaBadges, type TaskMetaBadge } from './task-meta-badges';
import { DueDateUrgencyState } from './due-date-urgency-state';
import { AlarmIcon } from '../icons/icons';
import {
  DUE_DATE_URGENCY_COLOR,
  type DueDateUrgency,
  type TaskTag,
} from '../../types/color-variants';

export interface TaskCardProps {
  /** Task title, shown in the header row and truncated to a single line. */
  title: string;
  /**
   * Story point estimate. Omitted entirely when `undefined`.
   * Rendered as plain text in the due-date row (Figma "Timer" auto-layout has no
   * pill/background behind the "N Pts" text — see Cards01.md L340-359).
   */
  points?: number;
  /**
   * How `points` is written. Defaults to `formatPointsShort` — `"1 Pt"` / `"4 Pts"`.
   *
   * This card used to render `` `${points} Pts` `` with no singular at all, so `points={1}`
   * produced **"1 Pts"** while the table cell beside it said "1 Point" (#94). The two still use
   * different words — each is cited to its own Figma frame and neither could be re-derived —
   * but they now share the rule that decides singular from plural, so they cannot drift again.
   *
   * Pass your own to translate it, or to match a table you render alongside.
   */
  formatPoints?: PointsFormatter;
  /** Due date label rendered inside the due-date Tag (e.g. `'3 DAYS'`). The Tag is hidden when not provided. */
  dueDateText?: string;
  /**
   * How urgent the due date is, driving the due-date Tag's colour via the shared
   * `DUE_DATE_URGENCY_COLOR` map so the card, the table cell and the table row cannot
   * disagree about what "overdue" looks like.
   * @default 'normal'
   */
  dueDateUrgency?: DueDateUrgency;
  /**
   * What each urgency *says*, announced to assistive tech beside the date. Merged over the
   * shared `DUE_DATE_URGENCY_LABEL` defaults, so passing `{ overdue: 'past due' }` changes
   * that one and leaves the rest.
   *
   * The colour used to be the whole signal (#92) — WCAG 2.2 1.4.1, failing for a
   * screen-reader user and a colour-blind sighted user alike. The state is now rendered as
   * an `sr-only` node inside the Tag, after the date: "Yesterday, overdue".
   *
   * **The visible text is untouched.** `dueDateText` stays exactly what you passed — this
   * adds a spoken state, it does not rewrite the pill. A *visible* affix would serve
   * colour-blind sighted users too, and is deliberately not done here: no Figma export draws
   * one, and inventing a design value is forbidden by this repo's first rule.
   *
   * Pass `''` for an urgency to announce nothing for it. `normal` is already `''`, because
   * "not urgent" is the absence of a state rather than a state worth repeating on every card.
   * @default DUE_DATE_URGENCY_LABEL — `''` / `'due soon'` / `'overdue'`
   */
  dueDateUrgencyLabel?: Partial<Record<DueDateUrgency, string>>;
  /**
   * Labeled tags rendered below the title/due date row. Each tag's `accent` defaults to
   * `'neutral'` when omitted.
   *
   * **Rendered `uppercase`, and the label string is never touched** (#102). The design draws
   * these chips in caps; applying that as a class rather than transforming `label` is the
   * whole point, because the two differ for a screen reader — it spells out a string that is
   * literally capitalised, and reads a CSS-uppercased one normally. So a consumer keeps
   * storing "iOS app", queries it in tests as "iOS app", and it renders "IOS APP".
   *
   * Per-tag `className` overrides it: `{ label: 'iOS app', className: 'normal-case' }`.
   * @default []
   */
  tags?: TaskTag[];
  /** Name of the assignee, shown next to the avatar and used by `Avatar` as the initials fallback. */
  assigneeName?: string;
  /** Avatar image URL for the assignee, forwarded to `Avatar`. */
  assigneeAvatar?: string;
  /**
   * Metadata badges (e.g. attachment/subtask/comment counts) rendered in the footer (Figma
   * "Frame 653"), via `TaskMetaBadges`. Hidden entirely when empty. Read-only — see
   * `TaskMetaBadges`'s doc comment for why this is no longer a toggleable emoji-reaction row.
   * @default []
   */
  metaBadges?: TaskMetaBadge[];
  /**
   * Controls rendered at the end of the header row, beside the title — in practice a
   * per-card overflow menu (Edit / Delete). Name it for the task it belongs to
   * (`"Task options for Fix auth bug"`), because a page of cards otherwise offers a
   * screen-reader user a list of identical "options" buttons.
   *
   * This is a slot of its own rather than `ProjectInfo`'s `icon`: that one is specified as
   * a decorative 24×24 glyph and renders into a fixed `w-6 h-6` box, so a real control
   * passed through it has nowhere to put padding or a focus ring.
   */
  actions?: React.ReactNode;
  /**
   * Decorative 24×24 glyph forwarded to `ProjectInfo`'s own `icon` slot, at the end of the
   * title row (#15).
   *
   * Figma's "Project Info" instance inside a Task Card does include this slot; the card
   * simply never passed one through, so the kit shipped the slot and blocked it. The glyph
   * in the export is an unnamed placeholder, which is why nothing is wired up by default —
   * picking one would be inventing a design value.
   *
   * **Not the place for a control.** It renders into a fixed `w-6 h-6` box specified for a
   * glyph, so a button here has nowhere to put padding or a focus ring — use `actions`,
   * which sits beside the title row for exactly that reason. When both are given they
   * render together: `icon` inside the title row, `actions` after it.
   */
  icon?: React.ReactNode;
  /**
   * Which `<h*>` the card title renders as, forwarded to `ProjectInfo`. Set it one level
   * below whatever heading introduces the column the card sits in.
   * @default 3
   */
  headingLevel?: HeadingLevel;
  /**
   * `id` for the card's title heading, which the card's own `<article aria-labelledby>`
   * points at. Generated when omitted; pass one only if something else must reference the
   * same heading.
   */
  titleId?: string;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
  /**
   * Called when the card is opened. Providing it renders the title as a real `<button>`
   * (the keyboard and screen-reader path — click, Enter or Space) and additionally makes
   * the whole card surface clickable for a pointer user. Fires once either way.
   *
   * Named `onPress` (#14), matching `Button`'s React Aria vocabulary rather than `onClick`.
   * **The name change is not yet a behaviour change**: this is still wired to a native
   * `onClick` internally rather than react-aria's `usePress`, so real touch/pen/drag-
   * cancellation parity with `Button` is not here yet. Keyboard access is unaffected either
   * way — it has always come from the real `<button>` `ProjectInfo` renders for the title,
   * not from this handler. Tracked as its own follow-up: #147.
   */
  onPress?: () => void;
}

/**
 * Kanban-style task summary card showing title, points, due date, tags, assignee, and reactions.
 *
 * Figma: "Task Card" COMPONENT (Cards00.md / Cards01.md), consistent across the IOS/Android/Desktop
 * variants. Anatomy is 4 stacked rows: "Project Info" (title + trailing icon, via the `ProjectInfo`
 * component), "Timer" (points text + due-date `Tag`), "Tags" (colored variant tags), "Reactions"
 * (avatar + `TaskMetaBadges`, formerly named `Reactions` — see that component's doc comment).
 */
export function TaskCard({
  title,
  points,
  formatPoints = formatPointsShort,
  dueDateText,
  dueDateUrgency = 'normal',
  dueDateUrgencyLabel,
  tags = [],
  assigneeName,
  assigneeAvatar,
  metaBadges = [],
  actions,
  icon,
  headingLevel = 3,
  titleId,
  className,
  onPress,
}: TaskCardProps) {
  const generatedTitleId = useId();
  const headingId = titleId ?? generatedTitleId;

  return (
    // The whole card stays clickable for a pointer user, but it is deliberately no longer an
    // ARIA button. `role="button"` + `tabIndex={0}` here made the card one control whose
    // accessible name was its entire text content ("Fix bug 5 Pts OVERDUE BUG Fernando Ramirez
    // 12 comments"), and put every interactive child it may hold — a removable `Tag`, a future
    // footer action — inside a button, which is invalid. The keyboard and screen-reader
    // affordance is now the title button `ProjectInfo` renders below, named by the task title;
    // this handler is the redundant pointer target beside it, which is what the two rules
    // suppressed here exist to catch when it is the *only* thing on offer. Same treatment as
    // `TaskTableRow`, which had no keyboard path at all.
    //
    //
    // It is an `<article>` rather than a `<div>`, and that is additive to the decision
    // above rather than a reversal of it: an article is a landmark-like container, not a
    // control, so it names the card for a screen reader's article navigation without
    // making it one focusable thing whose name is its whole text content. `aria-labelledby`
    // points at the title heading `ProjectInfo` renders, which is why that component gained
    // a `titleId`.
    //
    // The chrome now comes from `Card` rather than being restated here (#98). It was
    // `p-4 bg-surface-panel rounded-sm border-transparent shadow-xs hover:border-subtle` —
    // the same string `Card` now carries, which is the point: two card surfaces that could
    // drift apart independently was #15's actual complaint, and a component cannot drift from
    // a constant it reads. `card.test.tsx` asserts the two compute the same background and
    // radius, so a change to one that does not reach the other fails.
    //
    // radius-sm (8px) matches Figma's "Task Card" border-radius exactly (Cards01.md L246);
    // `rounded-lg` here previously resolved to this project's --radius-lg (24px), far too
    // round. That evidence is what settled #98 in this direction rather than the other.
    //
    // No `focus-visible:outline-*` anywhere here: the card is not focusable, so those
    // utilities could never match. The ring lives on the title button that replaced them.
    //
    // The `jsx-a11y/click-events-have-key-events` and `no-noninteractive-element-interactions`
    // disables that used to sit here are **gone, and their absence is not a fix.** jsx-a11y
    // only lints JSX host elements, so once this became `<Card>` the rules stopped applying —
    // eslint flagged the directives as unused, which is the only reason this is visible at all.
    // The `onClick`-on-a-non-interactive-element question did not go away; it moved inside
    // `Card`, where the element is a dynamic `<Component>` and jsx-a11y cannot see it either.
    // What actually answers it is unchanged and is the reason the disables were acceptable
    // before: the keyboard and screen-reader path is the title `<button>` `ProjectInfo`
    // renders, and this handler is the redundant pointer target beside it.
    <Card
      as="article"
      isInteractive
      aria-labelledby={headingId}
      onClick={onPress}
      className={cn(onPress && 'cursor-pointer', className)}
    >
      {/* Title Row (Figma "Project Info" auto-layout, Cards01.md L249-317) — same real component
          as the standalone `ProjectInfo`, reused here rather than duplicated. Figma's "Project
          Info" instance here does include a trailing Icon Placeholder slot — confirmed via a
          full-file Figma check (Chunk 24) that this is the exact same slot `ProjectInfo` already
          exposes via its own `icon` prop; TaskCard just doesn't pass one through. The glyph itself
          remains a generic, unnamed placeholder in the export (not a real "Arrow Chevron
          Back/Forward" icon — those exist elsewhere in the file with distinct component IDs), so
          the earlier "chevron/expand" description was a guess and has been corrected; still not
          wired up, since there's no real icon identity to wire in without inventing one.

          `onTitleClick` is what makes a clickable card reachable without a pointer — see the
          container's comment above for why the affordance moved here.

          `actions` sits beside it rather than inside `ProjectInfo`'s `icon` slot: that slot is
          a fixed 24×24 box specified for a decorative glyph, which would clip a real control's
          padding and focus ring. */}
      {actions ? (
        <div className="flex items-start gap-2">
          <ProjectInfo
            title={title}
            icon={icon}
            onTitleClick={onPress}
            headingLevel={headingLevel}
            titleId={headingId}
            className="flex-1 min-w-0"
          />
          {/* Stops a click on the menu trigger from also opening the card behind it. */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        </div>
      ) : (
        <ProjectInfo
          title={title}
          icon={icon}
          onTitleClick={onPress}
          headingLevel={headingLevel}
          titleId={headingId}
        />
      )}

      {/* Timer Row: Points & Due Date (Figma "Timer" auto-layout, Cards01.md L319-437 — points is
          plain text sharing this row with the due-date "Tag", not a badge in the title row). */}
      {points !== undefined || dueDateText ? (
        <div className="flex items-center justify-between gap-2">
          {points !== undefined ? (
            // Desktop/Body/M/bold: SF Pro Display, 15px/24px, weight 600, letter-spacing 0.75px
            // (tracking-wider, exact at this size). Was previously `text-sm font-bold` (14px/700).
            <span className="text-body-m font-semibold text-main font-sans">
              {formatPoints(points)}
            </span>
          ) : null}
          {dueDateText ? (
            // The due-date pill IS a real "Tag" instance per spec (padding 4px 16px, gap 8px,
            // radius 4px, alarm-line icon, Desktop/Body/M/bold) — reusing `Tag` directly instead
            // of a bespoke span gets typography/spacing/color right for free.
            <Tag
              accent={DUE_DATE_URGENCY_COLOR[dueDateUrgency]}
              icon={<AlarmIcon className="size-6" />}
            >
              {dueDateText}
              {/* The state the colour was carrying alone (#92). Inside the Tag rather than
                  beside it so it lands in the same reading order as the date it qualifies,
                  and `sr-only` rather than visible because no Figma export draws an affix —
                  see `dueDateUrgencyLabel`. The leading ", " is punctuation for speech
                  pacing and belongs to the rendering; the label itself is the consumer's,
                  announced verbatim. Empty label renders nothing at all, which is what keeps
                  `normal` silent structurally rather than by a condition written twice. */}
              <DueDateUrgencyState urgency={dueDateUrgency} labels={dueDateUrgencyLabel} />
            </Tag>
          ) : null}
        </div>
      ) : null}

      {/* Tags Row (Figma "Tags" auto-layout, Cards01.md L439-550 — separate row from Timer above). */}
      {tags.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((t, idx) => (
            // `uppercase` as a class, never `t.label.toUpperCase()` (#102). A screen reader
            // spells out a string that is literally capitalised and reads a CSS-uppercased one
            // normally, so transforming the string would trade an accessibility property for a
            // visual one. `t.className` is merged last, and `cn()` is `twMerge`, so
            // `normal-case` from a consumer wins.
            <Tag key={idx} accent={t.accent || 'neutral'} className={cn('uppercase', t.className)}>
              {t.label}
            </Tag>
          ))}
        </div>
      ) : null}

      {/* Footer Row: Assignee & Metadata Badges (Figma "Reactions" auto-layout, Cards01.md
          L552-833 — no top divider/border is ever rendered above this row). */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar src={assigneeAvatar} name={assigneeName} size="sm" />
          {assigneeName ? (
            <span className="font-sans text-xs font-medium text-muted truncate max-w-[120px]">
              {assigneeName}
            </span>
          ) : null}
        </div>

        {/* Figma's "Frame 653" (gap 16px) shows a leading icon-only badge (no count) ahead of 2
            count+icon widgets — resolved in Chunk 26 by redesigning `Reactions` into the
            read-only `TaskMetaBadges` (see its doc comment): `count` is optional, so the
            icon-only leading slot is just a badge with `count` omitted, not a special case. */}
        {metaBadges.length > 0 ? <TaskMetaBadges badges={metaBadges} /> : null}
      </div>
    </Card>
  );
}
