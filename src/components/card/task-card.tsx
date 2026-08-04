import { cn } from '../../utils/cn';
import { Tag } from '../tag/tag';
import { Avatar } from '../avatar/avatar';

export interface TaskCardProps {
  /** Task title, shown in the header row and truncated to a single line. */
  title: string;
  /**
   * Story point estimate. Omitted entirely when `undefined`.
   * Rendered as plain text in the due-date row (Figma "Timer" auto-layout has no
   * pill/background behind the "N Pts" text — see Cards01.md L340-359).
   */
  points?: number;
  /** Due date label rendered inside the urgency badge (e.g. `'3 DAYS'`). The badge is hidden when not provided. */
  dueDateText?: string;
  /**
   * Color treatment applied to the due date badge, reflecting how urgent the due date is.
   * @default 'normal'
   */
  dueDateUrgency?: 'normal' | 'warning' | 'overdue';
  /**
   * Labeled tags rendered below the title/due date row. Each tag's `variant` defaults to `'neutral'` when omitted.
   * @default []
   */
  tags?: { label: string; variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral' }[];
  /** Name of the assignee, shown next to the avatar and used by `Avatar` as the initials fallback. */
  assigneeName?: string;
  /** Avatar image URL for the assignee, forwarded to `Avatar`. */
  assigneeAvatar?: string;
  /**
   * Number of comments shown in the footer counter. The counter is hidden when `0`.
   * @default 0
   */
  commentsCount?: number;
  /**
   * Number of attachments shown in the footer counter. The counter is hidden when `0`.
   * @default 0
   */
  attachmentsCount?: number;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
  /** Called when the card is clicked. */
  onClick?: () => void;
}

/**
 * Kanban-style task summary card showing title, points, due date, tags, assignee, and activity counters.
 *
 * Figma: "Task Card" COMPONENT (Cards00.md / Cards01.md), consistent across the IOS/Android/Desktop
 * variants. Anatomy is 4 stacked rows: "Project Info" (title + trailing icon), "Timer" (points text +
 * due-date "Tag"), "Tags" (colored variant tags), "Reactions" (avatar + activity counters).
 */
export function TaskCard({
  title,
  points,
  dueDateText,
  dueDateUrgency = 'normal',
  tags = [],
  assigneeName,
  assigneeAvatar,
  commentsCount = 0,
  attachmentsCount = 0,
  className,
  onClick,
}: TaskCardProps) {
  const urgencyVariants = {
    // "Tag" bg matches rgba(148, 151, 154, 0.1) == neutral-2/10 (Cards01.md L380); no border is
    // ever rendered on this pill in the export, so the border color is transparent rather than
    // dropping the shared `border` utility (kept for the warning/overdue variants below).
    normal: 'bg-neutral-2/10 text-neutral-1 border-transparent',
    // No warning/overdue instance of this due-date "Tag" appears in Cards00.md/Cards01.md, so these
    // combinations are left as-is per the confirmed-token note — not verified against real evidence here.
    warning: 'bg-warning-1/10 text-warning-5 border-warning-2',
    overdue: 'bg-danger-1/10 text-danger-5 border-danger-2',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        // radius-sm (8px) matches Figma's "Task Card" border-radius exactly (Cards01.md L246);
        // rounded-lg here previously resolved to this project's --radius-lg (24px), far too round.
        // No border is ever rendered on the card in the export, so the resting border is transparent
        // (kept as a real border utility, not removed, so the hover reveal below still works).
        'flex flex-col gap-4 p-4 bg-neutral-4 text-neutral-1 rounded-sm border border-transparent shadow-xs hover:border-neutral-2 transition-all cursor-pointer select-none',
        className
      )}
    >
      {/* Title Row (Figma "Project Info" auto-layout, Cards01.md L249-317). Figma also shows a
          trailing chevron/expand "Icon Placeholder" next to the title with no corresponding prop —
          flagged rather than guessed at, not implemented. */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-sans font-semibold text-lg text-neutral-1 truncate">
          {title}
        </h3>
      </div>

      {/* Timer Row: Points & Due Date (Figma "Timer" auto-layout, Cards01.md L319-437 — points is
          plain text sharing this row with the due-date "Tag", not a badge in the title row). */}
      {points !== undefined || dueDateText ? (
        <div className="flex items-center justify-between gap-2">
          {points !== undefined ? (
            <span className="font-sans text-sm font-bold text-neutral-1">
              {points} Pts
            </span>
          ) : null}
          {dueDateText ? (
            <span
              className={cn(
                // gap-2/px-4 match Figma's Tag padding (4px 16px) and gap (8px) exactly (Cards01.md
                // L373-374). border-radius is a real 4px, same as tag.tsx's pill -- Tailwind's own
                // unmodified default `rounded` step, not a project token.
                'inline-flex items-center gap-2 px-4 py-1 text-xs font-semibold rounded border font-sans',
                urgencyVariants[dueDateUrgency]
              )}
            >
              ⏱ {dueDateText}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Tags Row (Figma "Tags" auto-layout, Cards01.md L439-550 — separate row from Timer above). */}
      {tags.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((t, idx) => (
            <Tag key={idx} variant={t.variant || 'neutral'}>
              {t.label}
            </Tag>
          ))}
        </div>
      ) : null}

      {/* Footer Row: Assignee & Reaction Counters (Figma "Reactions" auto-layout, Cards01.md
          L552-833 — no top divider/border is ever rendered above this row). */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar src={assigneeAvatar} name={assigneeName} size="sm" />
          {assigneeName ? (
            <span className="font-sans text-xs font-medium text-neutral-2 truncate max-w-[120px]">
              {assigneeName}
            </span>
          ) : null}
        </div>

        {/* gap-4 matches Figma's "Frame 653" gap (16px, Cards01.md L614); counter text/icon is
            neutral-1 (white) in every captured instance, not neutral-2. Figma shows 3 icon+count
            "Reactions" widgets here (vs. 2 supported counters below) with unlabeled icon glyphs --
            flagged as ambiguous, not adding an invented third counter. */}
        <div className="flex items-center gap-4 text-xs font-sans text-neutral-1">
          {commentsCount > 0 ? (
            <span className="flex items-center gap-1">
              💬 {commentsCount}
            </span>
          ) : null}
          {attachmentsCount > 0 ? (
            <span className="flex items-center gap-1">
              📎 {attachmentsCount}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
