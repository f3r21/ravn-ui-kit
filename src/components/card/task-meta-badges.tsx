import { cn } from '../../utils/cn';

export interface TaskMetaBadge {
  /** Icon rendered before the count. Should use `currentColor` so it inherits the badge's text color. */
  icon: React.ReactNode;
  /** Count value shown next to the icon. Omitted entirely for an icon-only badge (e.g. a plain attachment indicator). */
  count?: number;
  /**
   * What this badge means, announced to screen readers and used as its React key.
   *
   * **It must include the count** — "3 comments", not "comments". The visible count and icon
   * are `aria-hidden`, so this string is the entire accessible content of the badge; a label
   * without the number announces that there are comments but not how many.
   */
  label: string;
}

export interface TaskMetaBadgesProps {
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
export function TaskMetaBadges({ badges, className }: TaskMetaBadgesProps) {
  return (
    // gap-4 matches Figma's "Frame 653" gap (16px, Cards01.md L614 / Cards00.md L657).
    <div className={cn('flex flex-wrap items-center gap-4', className)}>
      {badges.map((b) => (
        <span
          key={b.label}
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
          <span className="sr-only">{b.label}</span>
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
