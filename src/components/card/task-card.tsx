import { cn } from '../../utils/cn';
import { Tag } from '../tag/tag';
import { Avatar } from '../avatar/avatar';
import { ProjectInfo } from './project-info';
import { Reactions, type Reaction } from './reactions';

const AlarmIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l3 2" />
    <path d="M5 3 2 6M22 6l-3-3" />
  </svg>
);

export interface TaskCardProps {
  /** Task title, shown in the header row and truncated to a single line. */
  title: string;
  /**
   * Story point estimate. Omitted entirely when `undefined`.
   * Rendered as plain text in the due-date row (Figma "Timer" auto-layout has no
   * pill/background behind the "N Pts" text — see Cards01.md L340-359).
   */
  points?: number;
  /** Due date label rendered inside the due-date Tag (e.g. `'3 DAYS'`). The Tag is hidden when not provided. */
  dueDateText?: string;
  /**
   * Color treatment applied to the due date Tag, reflecting how urgent the due date is.
   * Maps onto the real `Tag` variant palette (Chunk 3) rather than one-off warning/danger
   * classes — no warning/overdue instance of this due-date "Tag" appears anywhere in
   * Cards00.md/Cards01.md, so this mapping isn't spec-verified, only spec-consistent.
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
   * Reaction counters rendered in the footer (Figma "Frame 653"), via `Reactions`.
   * Hidden entirely when empty.
   * @default []
   */
  reactions?: Reaction[];
  /** Called with the emoji of the reaction pill that was clicked. */
  onReactionToggle?: (emoji: string) => void;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
  /** Called when the card is clicked. */
  onClick?: () => void;
}

const urgencyVariantMap = {
  normal: 'neutral',
  warning: 'tertiary',
  overdue: 'primary',
} as const;

/**
 * Kanban-style task summary card showing title, points, due date, tags, assignee, and reactions.
 *
 * Figma: "Task Card" COMPONENT (Cards00.md / Cards01.md), consistent across the IOS/Android/Desktop
 * variants. Anatomy is 4 stacked rows: "Project Info" (title + trailing icon, via the `ProjectInfo`
 * component), "Timer" (points text + due-date `Tag`), "Tags" (colored variant tags), "Reactions"
 * (avatar + `Reactions` counters).
 */
export function TaskCard({
  title,
  points,
  dueDateText,
  dueDateUrgency = 'normal',
  tags = [],
  assigneeName,
  assigneeAvatar,
  reactions = [],
  onReactionToggle,
  className,
  onClick,
}: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        // radius-sm (8px) matches Figma's "Task Card" border-radius exactly (Cards01.md L246);
        // rounded-lg here previously resolved to this project's --radius-lg (24px), far too round.
        // No border is ever rendered on the card in the export, so the resting border is transparent
        // (kept as a real border utility, not removed, so the hover reveal below still works).
        'flex flex-col gap-4 p-4 bg-neutral-4 text-neutral-1 rounded-sm border border-transparent shadow-xs hover:border-neutral-2 transition-all cursor-pointer select-none outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2',
        className
      )}
    >
      {/* Title Row (Figma "Project Info" auto-layout, Cards01.md L249-317) — same real component
          as the standalone `ProjectInfo`, reused here rather than duplicated. Figma also shows a
          trailing chevron/expand "Icon Placeholder" next to the title with no corresponding prop —
          flagged rather than guessed at, not implemented. */}
      <ProjectInfo title={title} />

      {/* Timer Row: Points & Due Date (Figma "Timer" auto-layout, Cards01.md L319-437 — points is
          plain text sharing this row with the due-date "Tag", not a badge in the title row). */}
      {points !== undefined || dueDateText ? (
        <div className="flex items-center justify-between gap-2">
          {points !== undefined ? (
            // Desktop/Body/M/bold: SF Pro Display, 15px/24px, weight 600, letter-spacing 0.75px
            // (tracking-wider, exact at this size). Was previously `text-sm font-bold` (14px/700).
            <span className="text-[15px] leading-6 font-semibold tracking-wider text-neutral-1 font-sans">
              {points} Pts
            </span>
          ) : null}
          {dueDateText ? (
            // The due-date pill IS a real "Tag" instance per spec (padding 4px 16px, gap 8px,
            // radius 4px, alarm-line icon, Desktop/Body/M/bold) — reusing `Tag` directly instead
            // of a bespoke span gets typography/spacing/color right for free.
            <Tag variant={urgencyVariantMap[dueDateUrgency]} icon={<AlarmIcon />}>
              {dueDateText}
            </Tag>
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

        {/* Figma's "Frame 653" (gap 16px) also shows a leading icon-only reaction slot with no
            count ever rendered (`display: none` on its text layer) ahead of the 2 count+icon
            widgets below — left unimplemented since it has no legible glyph or contradiction-free
            interpretation, consistent with not inventing unlabeled functionality. */}
        {reactions.length > 0 ? (
          <Reactions reactions={reactions} onToggle={onReactionToggle} />
        ) : null}
      </div>
    </div>
  );
}
