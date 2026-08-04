import { cn } from '../../utils/cn';
import { Tag } from '../tag/tag';
import { Avatar } from '../avatar/avatar';

export interface TaskCardProps {
  /** Task title, shown in the header row and truncated to a single line. */
  title: string;
  /** Story point estimate shown in a badge next to the title. Omitted entirely when `undefined`. */
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

/** Kanban-style task summary card showing title, points, due date, tags, assignee, and activity counters. */
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
    normal: 'bg-neutral-1/10 text-neutral-1 border-neutral-2',
    warning: 'bg-warning-1/10 text-warning-5 border-warning-2',
    overdue: 'bg-danger-1/10 text-danger-5 border-danger-2',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex flex-col gap-4 p-4 bg-neutral-4 text-neutral-1 rounded-lg border border-neutral-3/30 shadow-xs hover:border-neutral-2 transition-all cursor-pointer select-none',
        className
      )}
    >
      {/* Title & Points Row */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-sans font-semibold text-lg text-neutral-1 truncate">
          {title}
        </h3>
        {points !== undefined ? (
          <span className="text-sm font-bold text-neutral-1 bg-neutral-3/50 px-2 py-0.5 rounded-md">
            {points} Pts
          </span>
        ) : null}
      </div>

      {/* Tags Row */}
      {tags.length > 0 || dueDateText ? (
        <div className="flex flex-wrap items-center gap-2">
          {dueDateText ? (
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border font-sans',
                urgencyVariants[dueDateUrgency]
              )}
            >
              ⏱ {dueDateText}
            </span>
          ) : null}
          {tags.map((t, idx) => (
            <Tag key={idx} variant={t.variant || 'neutral'}>
              {t.label}
            </Tag>
          ))}
        </div>
      ) : null}

      {/* Footer Row: Assignee & Reaction Counters */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-3/20">
        <div className="flex items-center gap-2">
          <Avatar src={assigneeAvatar} name={assigneeName} size="sm" />
          {assigneeName ? (
            <span className="text-xs font-medium text-neutral-2 truncate max-w-[120px]">
              {assigneeName}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-2">
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
