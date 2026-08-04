import { cn } from '../../utils/cn';
import { Avatar } from '../avatar/avatar';
import { Tag } from '../tag/tag';

// ── Cell sub-components ───────────────────────────────────────────

export interface DueDateCellProps {
  /** Due date text to display (already formatted, e.g. `"Aug 10"`). */
  date: string;
  /**
   * Color treatment conveying how urgent the due date is.
   * @default 'normal'
   */
  urgency?: 'normal' | 'warning' | 'overdue';
}

/**
 * Renders a task's due date with color-coded urgency.
 *
 * Figma "Due Date Cell" (Task Column02.md) shows the default-state date text
 * ("6 July, 2020") in neutral.1 (#FFFFFF), not neutral.2 -- fixed below.
 * No warning/overdue-state sample exists in the assigned Figma exports, so
 * `warning` (text-tertiary-4) and `overdue` (text-danger-4) are left as-is;
 * `tertiary-4` is a brand accent color rather than one of the dedicated
 * `--color-warning-*` tokens, which reads as a semantic mismatch, but there is
 * no real Figma evidence to confirm the correct replacement value -- flagging
 * for human decision rather than guessing.
 */
export function DueDateCell({ date, urgency = 'normal' }: DueDateCellProps) {
  const styles = {
    normal: 'text-neutral-1',
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
  /** Assignee's full name, shown next to the avatar and used for initials fallback. */
  name: string;
  /** Avatar image URL. Falls back to initials derived from `name` when omitted. */
  avatarSrc?: string;
}

/**
 * Renders an assignee's avatar and name together in a table cell.
 *
 * Figma "Task Assign Name Cell" (Task Column02.md) confirms the name text
 * color as neutral.1 (#FFFFFF) -- already correct here, no change needed.
 */
export function AssigneeNameCell({ name, avatarSrc }: AssigneeNameCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar src={avatarSrc} name={name} size="sm" />
      <span className="text-sm font-sans text-neutral-1 truncate">{name}</span>
    </div>
  );
}

export interface EstimationCellProps {
  /** Numeric estimation (e.g. story points) shown inside the badge. */
  points: number;
}

/**
 * Renders a task's estimation points as a small numeric badge.
 *
 * Figma "Estimation Cell" (Task Column02.md) confirms the text color as
 * neutral.1 (#FFFFFF) -- already correct here. Note the Figma sample renders
 * plain text like "3 Days" directly in the cell (no badge chrome), which is
 * a structural/content difference (days vs. points, no badge) from this
 * component -- flagged for human review, not changed since it exceeds a
 * color/spacing fidelity fix and no note authorizes reworking the prop shape.
 */
export function EstimationCell({ points }: EstimationCellProps) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-6 rounded-md bg-neutral-3 text-xs font-bold text-neutral-1 font-sans tabular-nums">
      {points}
    </span>
  );
}

export interface TagCellProps {
  /** Tags to render, each with its own label text and optional color variant (defaults to `'neutral'` per tag). */
  labels: { label: string; variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral' }[];
}

/** Renders a wrapping list of `Tag` pills for a task row. */
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
  /** Header label content. */
  children: React.ReactNode;
  /** Shows a sort indicator icon and a pointer cursor to hint the column is sortable. */
  sortable?: boolean;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * Table `<th>` cell with optional sort-indicator affordance.
 *
 * Figma "Table Header Cell" (Task Column02.md, "# Task Name" instance) shows
 * the label text in neutral.1 (#FFFFFF), not neutral.2 -- fixed below. The
 * uppercase/small/bold treatment and per-cell background+border+radius seen
 * in that same Figma frame are a larger structural difference from this
 * flat-table implementation and are intentionally not replicated here (out
 * of scope for a color/spacing fidelity pass) -- flagged for human review.
 */
export function TableHeaderCell({ children, sortable, className }: TableHeaderCellProps) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 py-3 text-left text-xs font-bold text-neutral-1 uppercase tracking-wider font-sans select-none',
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
  /** Task title shown in the first column. */
  title: string;
  /** Assignee's full name. Renders an em dash placeholder in the Assignee column when omitted. */
  assigneeName?: string;
  /** Assignee's avatar image URL, passed through to `AssigneeNameCell`. */
  assigneeAvatar?: string;
  /** Due date text (already formatted). Renders an em dash placeholder in the Due Date column when omitted. */
  dueDate?: string;
  /**
   * Color treatment conveying how urgent `dueDate` is.
   * @default 'normal'
   */
  dueDateUrgency?: 'normal' | 'warning' | 'overdue';
  /** Estimation points. Renders an em dash placeholder in the Points column when omitted. */
  estimationPoints?: number;
  /**
   * Tags to render in the Tags column.
   * @default []
   */
  tags?: { label: string; variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral' }[];
  /** Task status. Reserved for future use; not currently rendered by `TaskTableRow`. */
  status?: string;
  /**
   * Highlights the row with the primary tint to indicate it is selected.
   * @default false
   */
  isSelected?: boolean;
  /** Called when the row is clicked. */
  onClick?: () => void;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * TaskTableRow
 *
 * Figma: "Task Table Row" COMPONENT inside "Task Column" frame.
 * One row of the table view of the task management board.
 *
 * STRUCTURAL NOTE (flagged, not changed): the Figma "Task Table Row" shows
 * each cell (Task Name Cell, Task Tag Cell, Estimation Cell, Task Assign
 * Name Cell, Due Date Cell) individually boxed -- own neutral.4 (#2C2F33)
 * background, 1px neutral.3 (#393D41) border, and its own border-radius
 * (mostly 0px, 4px on the header row) -- rather than a flat row with a single
 * bottom border and hover background as implemented here. This is a real
 * structural difference beyond a color/spacing tweak, so it was not
 * replicated; a human should decide whether to redesign the row as a
 * per-cell "boxed grid" to match Figma.
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
  /** Row data rendered as `TaskTableRow`s in table body order. */
  rows: TaskTableRowProps[];
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * TaskTable
 * Full table view wrapping TaskTableRows with a styled header.
 *
 * NOTE: no Figma layer for an outer "Task Table" wrapper was found in the
 * assigned exports (Task Column00-03.md) to confirm/deny this wrapper's
 * `rounded-xl` (40px). Individual cells there use 0px (body cells) or 4px
 * (header cell), which is a different visual system (per-cell boxed grid,
 * see TaskTableRow note below) rather than a single outer radius -- leaving
 * `rounded-xl` as-is since there is no direct Figma evidence to change it.
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
