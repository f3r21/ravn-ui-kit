import { cn } from '../../utils/cn';
import { Avatar } from '../avatar/avatar';
import { Tag } from '../tag/tag';
import { Skeleton } from '../skeleton/skeleton';

// Column widths straight off "Task Table Row" / "Table Header Cell" (Task Column02.md) and
// the in-context "Table View" instance (Mockups/Task Default View/My Task Mockup.md): Task Name
// 500 | Task Tags 168 | Estimation 140 | Task Assign Name 168 | Due Date 132 -- sums to the
// spec's 1108px row width exactly. The header row's own per-cell widths (159/141 for the last
// two columns) are Figma auto-layout hug-width noise from that instance's specific label text
// ("Task Assign Name" / "Due Date") -- using the body-cell widths for both keeps header and
// body columns pixel-aligned, which a real table requires.
const COLUMN_WIDTHS = {
  name: 500,
  tags: 168,
  estimation: 140,
  assignee: 168,
  dueDate: 132,
} as const;

const CaretIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
    <rect x="4" y="4" width="16" height="16" rx="3" />
  </svg>
);

// Desktop/Body/M/regular: SF Pro Display, 15px/24px, weight 400, letter-spacing 0.75px
// (tracking-wider, exact at this size per the Chunk 2/3 convention) -- shared by every cell's
// text content across the whole table (body cells and header cells alike).
const CELL_TEXT = 'text-[15px] leading-6 font-normal tracking-wider text-neutral-1 font-sans';

// Every body/header cell in "Task Table Row" and "Table Header Cell" shares this exact chrome:
// neutral.4 fill, 1px neutral.3 border, fixed 56px height. Cells sit flush against each other
// (0 gap in the Figma auto-layout), so only `border-r` is applied per cell (plus `border-l` on
// the row's first cell) to avoid doubling the shared vertical edges -- top/bottom edges already
// coincide exactly between cells so they need no special handling.
const CELL_BASE = 'flex items-center h-14 shrink-0 bg-neutral-4 border-y border-r border-neutral-3';

export interface DueDateCellProps {
  /** Due date text to display (already formatted, e.g. `"6 July, 2020"`). */
  date: string;
  /**
   * Color treatment conveying how urgent the due date is.
   * @default 'normal'
   */
  urgency?: 'normal' | 'warning' | 'overdue';
}

/** Renders a task's due date with color-coded urgency. Figma "Due Date Cell" (Task Column02.md). */
export function DueDateCell({ date, urgency = 'normal' }: DueDateCellProps) {
  const styles = {
    normal: 'text-neutral-1',
    warning: 'text-tertiary-4',
    overdue: 'text-primary-4',
  };
  return <span className={cn(CELL_TEXT, styles[urgency])}>{date}</span>;
}

export interface AssigneeNameCellProps {
  /** Assignee's full name, shown next to the avatar and used for initials fallback. */
  name: string;
  /** Avatar image URL. Falls back to initials derived from `name` when omitted. */
  avatarSrc?: string;
}

/**
 * Renders an assignee's 32px avatar and name together in a table cell.
 * Figma "Task Assign Name Cell" (Task Column02.md): Avatar (32x32, matches `Avatar` `size="sm"`)
 * + name text, Desktop/Body/M/regular, neutral.1.
 */
export function AssigneeNameCell({ name, avatarSrc }: AssigneeNameCellProps) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <Avatar src={avatarSrc} name={name} size="sm" />
      <span className={cn(CELL_TEXT, 'truncate')}>{name}</span>
    </div>
  );
}

export interface EstimationCellProps {
  /** Numeric estimation (story points) rendered as `"N Points"` / `"1 Point"`. */
  points: number;
}

/**
 * Renders a task's estimation as plain text -- Figma's "Estimation Cell" (Task Column02.md,
 * "3 Days" sample text; the real in-context "Task Default View" mockup renders it as
 * "N Points") is plain Desktop/Body/M/regular text directly in the cell, no badge/pill chrome.
 */
export function EstimationCell({ points }: EstimationCellProps) {
  return (
    <span className={cn(CELL_TEXT, 'tabular-nums')}>
      {points} {points === 1 ? 'Point' : 'Points'}
    </span>
  );
}

export interface TagCellProps {
  /** Tags to render, each with its own label text and optional color variant (defaults to `'neutral'` per tag). */
  labels: { label: string; variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'blue' }[];
}

/** Renders a wrapping list of `Tag` pills for a task row. Figma "Task Tag Cell" (Task Column02.md). */
export function TagCell({ labels }: TagCellProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {labels.map((t, i) => (
        <Tag key={i} variant={t.variant ?? 'neutral'}>{t.label}</Tag>
      ))}
    </div>
  );
}

export interface TaskTableReaction {
  /** Emoji/glyph shown next to the count, also used as its React key. */
  emoji: string;
  /** Count value shown before the glyph. */
  count: number;
}

// ── TaskTableRow ──────────────────────────────────────────────────

export interface TaskTableRowProps {
  /**
   * Row index shown before the title (Figma's "01"/"02" sample text), zero-padded to 2 digits.
   * Restarts per status group, matching the real "Task Default View" mockup ("To Do (05)"'s
   * rows read 01-05, "In Progress"'s restart at 01).
   */
  index: number;
  /** Task title shown in the Task Name column, truncated to a single line. */
  title: string;
  /**
   * Color of the "Line 1" status/priority stripe flush against the row's left edge. Reuses the
   * same 3 hues already verified for `Tag` (`primary`/`secondary`/`tertiary`) -- the only 3 that
   * appear across the row samples in the real "Task Default View" mockup. No spec evidence ties
   * this color to due-date urgency or any other field, so it's a plain, independent prop.
   * @default 'secondary'
   */
  indicatorColor?: 'primary' | 'secondary' | 'tertiary';
  /**
   * Reaction counters (e.g. comment count, subtask count) rendered after the title, via a plain
   * `count`+`emoji` pair -- read-only, not the clickable/toggleable footer reactions `Reactions`
   * renders on `TaskCard`. Figma's 3rd "Details"-style slot in this same row (Task Column02.md)
   * has no legible glyph/count content in the export, so it's left unimplemented, consistent
   * with Chunk 11's precedent for TaskCard's un-glyphed 3rd reaction slot.
   * @default []
   */
  reactions?: TaskTableReaction[];
  /**
   * Shows a checkbox before the row index. Figma's "Task Name Cell" renders this icon slot at
   * `opacity: 0` in "Property 1=Default" and fully opaque in "Property 1=Hover" -- an evidenced
   * hover-reveal, reproduced here via `group-hover`. Stays visible once `isSelected` so a
   * checked row doesn't hide its own checkmark when the pointer moves away.
   * @default false
   */
  isSelected?: boolean;
  /** Called with the row's next selected state when the checkbox is toggled. */
  onSelectedChange?: (isSelected: boolean) => void;
  /**
   * Tags rendered in the Task Tags column.
   * @default []
   */
  tags?: { label: string; variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'blue' }[];
  /** Estimation points. Column renders empty when omitted. */
  estimationPoints?: number;
  /** Assignee's full name. Column renders empty when omitted. */
  assigneeName?: string;
  /** Assignee's avatar image URL, passed through to `AssigneeNameCell`. */
  assigneeAvatar?: string;
  /** Due date text (already formatted). Column renders empty when omitted. */
  dueDate?: string;
  /**
   * Color treatment conveying how urgent `dueDate` is.
   * @default 'normal'
   */
  dueDateUrgency?: 'normal' | 'warning' | 'overdue';
  /** Called when the row is clicked. */
  onClick?: () => void;
}

const indicatorColorMap = {
  primary: 'bg-primary-4',
  secondary: 'bg-secondary-4',
  tertiary: 'bg-tertiary-4',
} as const;

/**
 * TaskTableRow
 *
 * Figma: "Task Table Row" (Task Column02.md; in-context inside "Task Table" in
 * Mockups/Task Default View/My Task Mockup.md). A row of 5 individually boxed cells --
 * own neutral.4 fill + 1px neutral.3 border each -- not a single flat row with one shared
 * border, resolving the structural mismatch this chunk was flagged to fix. Must be rendered
 * inside a `<table><tbody>` (see `TaskTable`) so the cell borders collapse into hairlines.
 */
export function TaskTableRow({
  index,
  title,
  indicatorColor = 'secondary',
  reactions = [],
  isSelected = false,
  onSelectedChange,
  tags = [],
  estimationPoints,
  assigneeName,
  assigneeAvatar,
  dueDate,
  dueDateUrgency = 'normal',
  onClick,
}: TaskTableRowProps) {
  return (
    <tr onClick={onClick} className={cn('group', onClick && 'cursor-pointer')}>
      {/* Task Name Cell: padding 4px 16px 4px 0px -- the left edge is 0 so the accent stripe
          sits flush against it. */}
      <td className={cn(CELL_BASE, 'gap-2 pl-0 pr-4 border-l')} style={{ width: COLUMN_WIDTHS.name }}>
        <span className={cn('w-1 h-full shrink-0', indicatorColorMap[indicatorColor])} />
        <label className="w-6 h-6 shrink-0 flex items-center justify-center cursor-pointer rounded-xs has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-4 has-[:focus-visible]:outline-offset-1">
          <input
            type="checkbox"
            className="sr-only"
            checked={isSelected}
            onChange={(e) => onSelectedChange?.(e.target.checked)}
            aria-label={`Select ${title}`}
          />
          <CheckIcon
            className={cn(
              'w-6 h-6 text-neutral-1 transition-opacity',
              isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
            )}
          />
        </label>
        <span className={cn(CELL_TEXT, 'shrink-0 tabular-nums')}>{String(index).padStart(2, '0')}</span>
        <span className={cn(CELL_TEXT, 'flex-1 min-w-0 truncate')}>{title}</span>
        {reactions.map((r) => (
          <span key={r.emoji} className={cn(CELL_TEXT, 'inline-flex items-center gap-1 shrink-0')}>
            <span className="tabular-nums">{r.count}</span>
            <span>{r.emoji}</span>
          </span>
        ))}
      </td>

      {/* Task Tag Cell */}
      <td className={cn(CELL_BASE, 'gap-2 pl-2 pr-4')} style={{ width: COLUMN_WIDTHS.tags }}>
        {tags.length > 0 ? <TagCell labels={tags} /> : null}
      </td>

      {/* Estimation Cell */}
      <td className={cn(CELL_BASE, 'gap-2 pl-2 pr-4')} style={{ width: COLUMN_WIDTHS.estimation }}>
        {estimationPoints !== undefined ? <EstimationCell points={estimationPoints} /> : null}
      </td>

      {/* Task Assign Name Cell */}
      <td className={cn(CELL_BASE, 'gap-2 pl-2 pr-4')} style={{ width: COLUMN_WIDTHS.assignee }}>
        {assigneeName ? <AssigneeNameCell name={assigneeName} avatarSrc={assigneeAvatar} /> : null}
      </td>

      {/* Due Date Cell */}
      <td className={cn(CELL_BASE, 'gap-2 pl-2 pr-4')} style={{ width: COLUMN_WIDTHS.dueDate }}>
        {dueDate ? <DueDateCell date={dueDate} urgency={dueDateUrgency} /> : null}
      </td>
    </tr>
  );
}

// ── TaskTable (header + grouped rows) ─────────────────────────────

export interface TaskTableGroup {
  /** Group/status title, e.g. `"To Do (05)"`. Figma "Task Cell" -- Desktop/Body/L/bold. */
  title: string;
  /** Rows belonging to this group. */
  rows: TaskTableRowProps[];
  /**
   * Trailing action icons for this group's header (Figma shows an "add"/"more" icon pair,
   * `display: none` in most captured groups and visible in exactly one -- no legible glyph or
   * contradiction-free trigger condition, so left as a spec-free opt-in slot rather than a
   * fabricated always-on pair).
   */
  actions?: React.ReactNode;
}

export interface TaskTableProps {
  /** Status groups rendered top to bottom, each its own bordered box per Figma's "Task Table". */
  groups: TaskTableGroup[];
  /**
   * Renders the header row plus 5 skeleton rows instead of `groups` while data is in
   * flight. No ground-truth basis (static exports have no loading state) — an
   * engineering-only addition, same precedent as `Skeleton` itself.
   * @default false
   */
  isLoading?: boolean;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

function TaskTableRowSkeleton() {
  return (
    <tr>
      <td className={cn(CELL_BASE, 'gap-2 pl-4 pr-4 border-l')} style={{ width: COLUMN_WIDTHS.name }}>
        <Skeleton className="h-4 w-full" />
      </td>
      <td className={cn(CELL_BASE, 'gap-2 pl-4 pr-4')} style={{ width: COLUMN_WIDTHS.tags }}>
        <Skeleton className="h-6 w-16 rounded" />
      </td>
      <td className={cn(CELL_BASE, 'gap-2 pl-4 pr-4')} style={{ width: COLUMN_WIDTHS.estimation }}>
        <Skeleton className="h-4 w-16" />
      </td>
      <td className={cn(CELL_BASE, 'gap-2 pl-4 pr-4')} style={{ width: COLUMN_WIDTHS.assignee }}>
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <Skeleton className="h-4 w-20" />
        </div>
      </td>
      <td className={cn(CELL_BASE, 'gap-2 pl-4 pr-4')} style={{ width: COLUMN_WIDTHS.dueDate }}>
        <Skeleton className="h-4 w-20" />
      </td>
    </tr>
  );
}

const headerCells: { key: keyof typeof COLUMN_WIDTHS; label: string }[] = [
  { key: 'name', label: '# Task Name' },
  { key: 'tags', label: 'Task Tags' },
  { key: 'estimation', label: 'Estimate' },
  { key: 'assignee', label: 'Task Assign Name' },
  { key: 'dueDate', label: 'Due Date' },
];

/**
 * TaskTable
 *
 * Figma: "Table View" (Mockups/Task Default View/My Task Mockup.md) -- a shared column-header
 * row ("Frame 657") followed by one bordered "Task Table" box per status group (each starting
 * with a "Task Cell" group header, e.g. "To Do (05)"), stacked with a 16px gap. Column widths:
 * Task Name 500 | Task Tags 168 | Estimate 140 | Task Assign Name 168 | Due Date 132 (1108px
 * total). Each group renders as its own `<table>` with `border-collapse` so the individually
 * bordered cells in `TaskTableRow` merge into single hairlines instead of doubling, resolving
 * the boxed-grid-vs-flat-row mismatch this chunk was flagged to fix.
 */
export function TaskTable({ groups, isLoading = false, className }: TaskTableProps) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="flex flex-col gap-4 min-w-[1108px]">
        {/* Shared column header row */}
        <div className="flex">
          {headerCells.map(({ key, label }, i) => (
            <div
              key={key}
              className={cn(
                CELL_BASE,
                'px-4',
                i === 0 && 'border-l rounded-l-4',
                i === headerCells.length - 1 && 'rounded-r-4'
              )}
              style={{ width: COLUMN_WIDTHS[key] }}
            >
              <span className={CELL_TEXT}>{label}</span>
            </div>
          ))}
        </div>

        {isLoading ? (
          <table className="border-collapse table-fixed">
            <colgroup>
              {headerCells.map(({ key }) => (
                <col key={key} style={{ width: COLUMN_WIDTHS[key] }} />
              ))}
            </colgroup>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TaskTableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        ) : groups.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-neutral-2 font-sans text-sm">
            No tasks yet.
          </div>
        ) : (
          groups.map((group, gi) => (
            <table key={gi} className="border-collapse table-fixed">
              <colgroup>
                {headerCells.map(({ key }) => (
                  <col key={key} style={{ width: COLUMN_WIDTHS[key] }} />
                ))}
              </colgroup>
              <tbody>
                <tr>
                  <td colSpan={headerCells.length} className="p-0 border border-neutral-3">
                    <div className="flex items-center gap-2 h-14 px-4 bg-neutral-4 rounded-t-4">
                      <CaretIcon className="w-6 h-6 shrink-0 text-neutral-2" />
                      <h3 className="flex-1 min-w-0 truncate text-[18px] leading-8 font-semibold tracking-[0.75px] text-neutral-1 font-sans">
                        {group.title}
                      </h3>
                      {group.actions}
                    </div>
                  </td>
                </tr>
                {group.rows.map((row, ri) => (
                  <TaskTableRow key={ri} {...row} />
                ))}
              </tbody>
            </table>
          ))
        )}
      </div>
    </div>
  );
}
