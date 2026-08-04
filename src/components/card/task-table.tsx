import { cn } from '../../utils/cn';
import { Avatar } from '../avatar/avatar';
import { Tag } from '../tag/tag';

// ── Cell sub-components ───────────────────────────────────────────

export interface DueDateCellProps {
  date: string;
  urgency?: 'normal' | 'warning' | 'overdue';
}

export function DueDateCell({ date, urgency = 'normal' }: DueDateCellProps) {
  const styles = {
    normal: 'text-neutral-2',
    warning: 'text-tertiary-4',
    overdue: 'text-danger-4',
  };
  return (
    <span className={cn('text-sm font-sans font-medium tabular-nums', styles[urgency])}>
      {date}
    </span>
  );
}

export interface AssigneeNameCellProps {
  name: string;
  avatarSrc?: string;
}

export function AssigneeNameCell({ name, avatarSrc }: AssigneeNameCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar src={avatarSrc} name={name} size="sm" />
      <span className="text-sm font-sans text-neutral-1 truncate">{name}</span>
    </div>
  );
}

export interface EstimationCellProps {
  points: number;
}

export function EstimationCell({ points }: EstimationCellProps) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-6 rounded-md bg-neutral-3 text-xs font-bold text-neutral-1 font-sans tabular-nums">
      {points}
    </span>
  );
}

export interface TagCellProps {
  labels: { label: string; variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral' }[];
}

export function TagCell({ labels }: TagCellProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {labels.map((t, i) => (
        <Tag key={i} variant={t.variant ?? 'neutral'}>{t.label}</Tag>
      ))}
    </div>
  );
}

export interface TableHeaderCellProps {
  children: React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export function TableHeaderCell({ children, sortable, className }: TableHeaderCellProps) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 py-3 text-left text-xs font-bold text-neutral-2 uppercase tracking-wider font-sans select-none',
        sortable && 'cursor-pointer hover:text-neutral-1 transition-colors',
        className
      )}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable ? (
          <svg className="w-3 h-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path d="m7 15 5 5 5-5M7 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </div>
    </th>
  );
}

// ── TaskTableRow ──────────────────────────────────────────────────

export interface TaskTableRowProps {
  title: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  dueDate?: string;
  dueDateUrgency?: 'normal' | 'warning' | 'overdue';
  estimationPoints?: number;
  tags?: { label: string; variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral' }[];
  status?: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * TaskTableRow
 *
 * Figma: "Task Table Row" COMPONENT inside "Task Column" frame.
 * One row of the table view of the task management board.
 */
export function TaskTableRow({
  title,
  assigneeName,
  assigneeAvatar,
  dueDate,
  dueDateUrgency = 'normal',
  estimationPoints,
  tags = [],
  isSelected = false,
  onClick,
  className,
}: TaskTableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-b border-neutral-3/30 transition-colors cursor-pointer group',
        isSelected ? 'bg-primary-4/10' : 'hover:bg-neutral-3/20',
        className
      )}
    >
      {/* Title */}
      <td className="px-4 py-3">
        <span className="text-sm font-semibold text-neutral-1 font-sans group-hover:text-primary-4 transition-colors">
          {title}
        </span>
      </td>

      {/* Assignee */}
      <td className="px-4 py-3">
        {assigneeName ? (
          <AssigneeNameCell name={assigneeName} avatarSrc={assigneeAvatar} />
        ) : (
          <span className="text-sm text-neutral-2 font-sans">—</span>
        )}
      </td>

      {/* Due Date */}
      <td className="px-4 py-3">
        {dueDate ? (
          <DueDateCell date={dueDate} urgency={dueDateUrgency} />
        ) : (
          <span className="text-sm text-neutral-2 font-sans">—</span>
        )}
      </td>

      {/* Estimation */}
      <td className="px-4 py-3">
        {estimationPoints !== undefined ? (
          <EstimationCell points={estimationPoints} />
        ) : (
          <span className="text-sm text-neutral-2 font-sans">—</span>
        )}
      </td>

      {/* Tags */}
      <td className="px-4 py-3">
        {tags.length > 0 ? <TagCell labels={tags} /> : null}
      </td>
    </tr>
  );
}

// ── TaskTable (full table wrapper) ────────────────────────────────

export interface TaskTableProps {
  rows: TaskTableRowProps[];
  className?: string;
}

/**
 * TaskTable
 * Full table view wrapping TaskTableRows with a styled header.
 */
export function TaskTable({ rows, className }: TaskTableProps) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl bg-neutral-4 border border-neutral-3/30', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-3/50 bg-neutral-5/50">
            <TableHeaderCell sortable>Task</TableHeaderCell>
            <TableHeaderCell>Assignee</TableHeaderCell>
            <TableHeaderCell sortable>Due Date</TableHeaderCell>
            <TableHeaderCell sortable>Points</TableHeaderCell>
            <TableHeaderCell>Tags</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <TaskTableRow key={idx} {...row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
