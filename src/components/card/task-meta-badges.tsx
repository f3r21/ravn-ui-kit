import { cn } from '../../utils/cn';

interface TaskMetaBadgeBase {
  /** Icon rendered before the count. Should use `currentColor` so it inherits the badge's text color. */
  icon: React.ReactNode;
  /** Count value shown next to the icon. Omitted entirely for an icon-only badge (e.g. a plain attachment indicator). */
  count?: number;
}

/** A badge that is announced. The ordinary case. */
export interface TaskMetaBadgeLabelled extends TaskMetaBadgeBase {
  /**
   * What this badge means, announced to screen readers and used as its React key.
   *
   * **It must include the count** — "3 comments", not "comments". The visible count and icon
   * are `aria-hidden`, so this string is the entire accessible content of the badge; a label
   * without the number announces that there are comments but not how many.
   */
  label: string;
  /** Absent or `false` here — see `TaskMetaBadgeDecorative` for the other arm. */
  decorative?: false;
}

/**
 * A badge that is drawn and **not** announced (#93).
 *
 * For a counter the design draws but the data cannot support. The consuming app's card footer
 * renders attachment / subtask / comment counts its API has no fields for; announcing invented
 * numbers is worse than silence, so it had marked them `aria-hidden` — and when #19 gave every
 * badge a real `sr-only` label, that silence disappeared and the app deleted the counters
 * rather than have a screen reader read fiction aloud.
 *
 * **#9 closed this requirement as already met**, on the grounds that `aria-label` on a role-less
 * `<span>` is prohibited and therefore dropped. That was true when written; #19's correct fix
 * removed the accidental silence it rested on. This restores the capability as a property of
 * the markup rather than a coincidence of what is missing.
 *
 * `label` is `never` rather than merely optional, so **"decorative and labelled" does not
 * compile** — that combination asks for the badge to be announced and hidden at once. Same
 * habit as `Record<DueDateUrgency, …>`: make the bad state untypable rather than discourage it
 * in prose.
 *
 * Use it sparingly. A count a sighted user can read and a screen-reader user cannot is a real
 * asymmetry; it is right only when the alternative is announcing something untrue.
 */
export interface TaskMetaBadgeDecorative extends TaskMetaBadgeBase {
  /** Marks the badge decorative: no accessible name, and hidden from assistive tech entirely. */
  decorative: true;
  /** Not available on a decorative badge — a silent badge with a label is a contradiction. */
  label?: never;
}

/** One badge in the row: announced (`label`) or decorative (`decorative: true`), never both. */
export type TaskMetaBadge = TaskMetaBadgeLabelled | TaskMetaBadgeDecorative;

export interface TaskMetaBadgesProps extends React.ComponentPropsWithRef<'div'> {
  /** Ordered list of metadata badges to render (e.g. attachment/subtask/comment counts). */
  badges: TaskMetaBadge[];
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * TaskMetaBadges
 *
 * Formerly `Reactions` — renamed after live Figma access (Chunk 24/25, fileKey
 * `ZUAB3jXFyKFktoAzvN7h1T`) confirmed the real "Reactions" COMPONENT inside "Task Card" doesn't
 * render emoji at all: its instances use named icons `remix-icons/line/editor/attachment-2`,
 * `remix-icons/line/editor/node-tree`, and `remix-icons/line/communication/chat-3-line` — real
 * task metadata (attachments/subtasks/comments), not user-togglable emoji reactions. A full-file
 * structural check also confirmed the component has no variant set at all (a single static
 * COMPONENT, not a COMPONENT_SET), and none of its 505 instances across the entire file ever
 * carries a fill/border override, so there's no active/pressed state in spec either.
 *
 * Redesigned as a read-only row of icon+count badges: `isActive`/`onToggle` are gone (attachments,
 * subtasks, and comments aren't things a user toggles), and `emoji: string` became
 * `icon: React.ReactNode` (a real icon slot, matching the icon-prop convention already used by
 * `Tag`/`AddTaskModal`'s triggers), since the real content is icon components, not emoji
 * characters. `count` is optional — the real leading slot in "Frame 653" renders icon-only, no
 * count ever shown next to it (previously left unimplemented as an "un-glyphed slot"; now just a
 * badge with `count` omitted). Every real captured instance renders as plain white text+icon with
 * no fill, border, or radius (Cards00.md L595-875, Cards01.md L552-833) — preserved exactly.
 */
export function TaskMetaBadges({ badges, className, ref, ...rest }: TaskMetaBadgesProps) {
  return (
    // gap-4 matches Figma's "Frame 653" gap (16px, Cards01.md L614 / Cards00.md L657).
    <div {...rest} ref={ref} className={cn('flex flex-wrap items-center gap-4', className)}>
      {badges.map((b, i) => (
        <span
          // Labelled badges keep their label as the key, as before. A decorative badge has none
          // by construction, so it falls back to its position — the row is static per render
          // and order-stable, so nothing reorders.
          key={b.decorative ? `decorative-${i}` : b.label}
          // `aria-hidden` on the whole badge rather than relying on the children already
          // carrying it. Without the `sr-only` node a decorative badge would *happen* to be
          // silent, which is exactly the accidental silence #9 built on and #19 removed — this
          // makes it a property of the markup instead of a coincidence.
          aria-hidden={b.decorative || undefined}
          className="inline-flex items-center gap-1 text-body-m font-normal font-sans text-main"
        >
          {/* The badge's accessible name is real text, hidden visually — not an `aria-label`
              on the wrapper. A `<span>` with no explicit role is `generic`, and `aria-label`
              is *prohibited* there, so it was dropped; with both children `aria-hidden` there
              was nothing left to fall back on and the badge announced nothing at all. axe
              reported it as `aria-prohibited-attr` across four stories.

              `sr-only` is the house pattern rather than a new invention — `FormField`,
              `Input` and `DatePicker` all keep an accessible name this way. Giving the
              wrapper `role="img"` would also have permitted a name, but this keeps the
              announced text and the visible content as one thing, so they cannot drift. */}
          {b.decorative ? null : <span className="sr-only">{b.label}</span>}
          {b.count !== undefined ? (
            <span className="tabular-nums" aria-hidden>
              {b.count}
            </span>
          ) : null}
          <span className="w-6 h-6 shrink-0" aria-hidden>
            {b.icon}
          </span>
        </span>
      ))}
    </div>
  );
}
