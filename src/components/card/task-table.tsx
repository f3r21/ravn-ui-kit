import { cn } from '../../utils/cn';
import { Avatar } from '../avatar/avatar';
import { Tag } from '../tag/tag';
import { Skeleton } from '../skeleton/skeleton';
import { ChevronDownIcon, ChevronRightIcon } from '../icons/icons';
import type { AccentColor, DueDateUrgency } from '../../types/color-variants';
import { EmptyState } from '../empty-state/empty-state';

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

// The empty rounded square behind a row-select checkbox. Deliberately *not* part of the
// kit's icon set: it is this control's own chrome rather than a glyph from the design's
// vocabulary, it has no Figma identity of its own, and `LabelCheckbox` draws the same box
// with a check inside it depending on state — so it is a checkbox rendering, not an icon.
// (That duplication between the two checkbox implementations is real, and tracked in
// `MIGRATION_GAPS.md` Section 3; sharing one control is a bigger change than an icon swap.)
// Named for what it draws — it was previously called `CheckIcon`, which described a
// checkmark this has never contained.
const CheckboxBoxIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden
  >
    <rect x="4" y="4" width="16" height="16" rx="3" />
  </svg>
);

// Desktop/Body/M/regular: SF Pro Display, 15px/24px, weight 400, letter-spacing 0.75px
// (tracking-wider, exact at this size per the Chunk 2/3 convention) -- shared by every cell's
// text content across the whole table (body cells and header cells alike).
const CELL_TEXT = 'text-body-m font-normal text-main font-sans';

// Every body/header cell in "Task Table Row" and "Table Header Cell" shares this exact chrome:
// neutral.4 fill, 1px neutral.3 border, fixed 56px height. Cells sit flush against each other
// (0 gap in the Figma auto-layout), so only `border-r` is applied per cell (plus `border-l` on
// the row's first cell) to avoid doubling the shared vertical edges -- top/bottom edges already
// coincide exactly between cells so they need no special handling.
//
// Deliberately does NOT include `flex`/`items-center` -- an explicit `display` value on a <td>
// makes it stop participating in the table's layout algorithm (it "unboxes" from the table and
// renders as a plain block box instead), which breaks the fixed-width column layout entirely.
// Each cell's flex/gap/centering lives on an inner wrapping <div> instead (see TaskTableRow /
// TaskTableRowSkeleton below), the same pattern the group-header cell already used correctly.
const CELL_BASE = 'h-14 shrink-0 bg-surface-panel border-y border-r border-neutral-3';

export interface DueDateCellProps {
  /** Due date text to display (already formatted, e.g. `"6 July, 2020"`). */
  date: string;
  /**
   * Color treatment conveying how urgent the due date is.
   * @default 'normal'
   */
  urgency?: DueDateUrgency;
}

/** Renders a task's due date with color-coded urgency. Figma "Due Date Cell" (Task Column02.md). */
export function DueDateCell({ date, urgency = 'normal' }: DueDateCellProps) {
  // Same three urgency levels as the due-date Tag, expressed as text colour instead of a
  // chip. Kept in step with DUE_DATE_URGENCY_COLOR by hand rather than derived from it —
  // the Tag maps to a fill+text pair, this is text alone, so there is no shared class to
  // share. `Record<DueDateUrgency, string>` is what makes adding a fourth level a compile
  // error here rather than a silently unstyled cell.
  const styles: Record<DueDateUrgency, string> = {
    normal: 'text-main',
    soon: 'text-tertiary-4',
    // `primary-2`, not the `primary-4` this was. A cell renders on `surface-panel`, where
    // primary-4 as text measures 3.51:1 — under AA, and five of the kit's 131 contrast
    // violations. primary-4 clears 4.5:1 on nothing in this palette, so there was no
    // surface-side fix; primary-2 is 6.67:1 here.
    //
    // Still a raw ramp class rather than the `text-interactive-text` alias: this is a
    // status/urgency signal, not an interactive affordance, and the alias would
    // misrepresent its role even though it resolves to the same value. It stays in step
    // with the `Tag` version of the same signal, whose red label is now primary-2 too —
    // `DUE_DATE_URGENCY_COLOR` keeps the mapping shared, but the colours are applied to
    // different properties so there is no class to share.
    overdue: 'text-primary-2',
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
  labels: { label: string; variant?: AccentColor }[];
}

/** Renders a wrapping list of `Tag` pills for a task row. Figma "Task Tag Cell" (Task Column02.md). */
export function TagCell({ labels }: TagCellProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {labels.map((t, i) => (
        <Tag key={i} variant={t.variant ?? 'neutral'}>
          {t.label}
        </Tag>
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
   * Color of the "Line 1" status/priority stripe flush against the row's left edge. Takes the
   * shared `AccentColor` vocabulary, though only `red`/`green`/`yellow` actually appear across
   * the row samples in the real "Task Default View" mockup -- `neutral` and `blue` are
   * available for consistency with `Tag`, not because the spec shows them. No spec evidence
   * ties this color to due-date urgency or any other field, so it's a plain, independent prop.
   * @default 'green'
   */
  indicatorColor?: AccentColor;
  /**
   * Reaction counters (e.g. comment count, subtask count) rendered after the title, via a plain
   * `count`+`emoji` pair -- read-only, not the clickable/toggleable footer reactions `Reactions`
   * renders on `TaskCard`. Figma's 3rd slot in this same row is a separate "Details" link, not
   * another count widget -- see `onViewDetails` below.
   * @default []
   */
  reactions?: TaskTableReaction[];
  /**
   * Called when the row's trailing "Details" link is clicked; renders a "Details" label with a
   * right-chevron icon when provided, hidden otherwise. Confirmed via live Figma access (Chunk 25,
   * fileKey `ZUAB3jXFyKFktoAzvN7h1T`) that this row's 3rd slot -- previously documented as having
   * "no legible glyph/count content" -- is in fact literal text "Details" paired with
   * `remix-icons/line/system/arrow-right-s-line`, not another reaction-style count.
   */
  onViewDetails?: () => void;
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
  tags?: { label: string; variant?: AccentColor }[];
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
  dueDateUrgency?: DueDateUrgency;
  /** Called when the row is clicked. */
  onClick?: () => void;
}

// Fill-only counterpart to `Tag`'s fill+text pairs, on the same tokens.
const indicatorColorMap: Record<AccentColor, string> = {
  neutral: 'bg-neutral-2',
  red: 'bg-primary-4',
  green: 'bg-secondary-4',
  yellow: 'bg-tertiary-4',
  blue: 'bg-blue',
};

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
  indicatorColor = 'green',
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
  onViewDetails,
}: TaskTableRowProps) {
  return (
    <tr onClick={onClick} className={cn('group', onClick && 'cursor-pointer')}>
      {/* Task Name Cell: padding 4px 16px 4px 0px -- the left edge is 0 so the accent stripe
          sits flush against it. */}
      <td className={cn(CELL_BASE, 'pl-0 pr-4 border-l')} style={{ width: COLUMN_WIDTHS.name }}>
        <div className="flex items-center gap-2 h-full">
          <span className={cn('w-1 h-full shrink-0', indicatorColorMap[indicatorColor])} />
          <label className="w-6 h-6 shrink-0 flex items-center justify-center cursor-pointer rounded-xs has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-interactive-text has-[:focus-visible]:outline-offset-1">
            <input
              type="checkbox"
              className="sr-only"
              checked={isSelected}
              onChange={(e) => onSelectedChange?.(e.target.checked)}
              aria-label={`Select ${title}`}
            />
            <CheckboxBoxIcon
              className={cn(
                'w-6 h-6 text-main transition-opacity',
                isSelected
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
              )}
            />
          </label>
          <span className={cn(CELL_TEXT, 'shrink-0 tabular-nums')}>
            {String(index).padStart(2, '0')}
          </span>
          <span className={cn(CELL_TEXT, 'flex-1 min-w-0 truncate')}>{title}</span>
          {reactions.map((r) => (
            <span
              key={r.emoji}
              className={cn(CELL_TEXT, 'inline-flex items-center gap-1 shrink-0')}
            >
              <span className="tabular-nums">{r.count}</span>
              <span>{r.emoji}</span>
            </span>
          ))}
          {onViewDetails ? (
            <button
              type="button"
              onClick={onViewDetails}
              className={cn(
                CELL_TEXT,
                // `hover:text-interactive-text`, not `hover:text-interactive`: this is a
                // text label, and hovering it used to drop it to 3.51:1 on the panel it
                // sits on. A hover state is invisible to a static-story axe pass, so this
                // one was found by reading rather than by measuring.
                'inline-flex items-center gap-1 shrink-0 hover:text-interactive-text transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs',
              )}
            >
              <span>Details</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </td>

      {/* Task Tag Cell */}
      <td className={cn(CELL_BASE, 'pl-2 pr-4')} style={{ width: COLUMN_WIDTHS.tags }}>
        <div className="flex items-center gap-2 h-full">
          {tags.length > 0 ? <TagCell labels={tags} /> : null}
        </div>
      </td>

      {/* Estimation Cell */}
      <td className={cn(CELL_BASE, 'pl-2 pr-4')} style={{ width: COLUMN_WIDTHS.estimation }}>
        <div className="flex items-center gap-2 h-full">
          {estimationPoints !== undefined ? <EstimationCell points={estimationPoints} /> : null}
        </div>
      </td>

      {/* Task Assign Name Cell */}
      <td className={cn(CELL_BASE, 'pl-2 pr-4')} style={{ width: COLUMN_WIDTHS.assignee }}>
        <div className="flex items-center gap-2 h-full">
          {assigneeName ? (
            <AssigneeNameCell name={assigneeName} avatarSrc={assigneeAvatar} />
          ) : null}
        </div>
      </td>

      {/* Due Date Cell */}
      <td className={cn(CELL_BASE, 'pl-2 pr-4')} style={{ width: COLUMN_WIDTHS.dueDate }}>
        <div className="flex items-center gap-2 h-full">
          {dueDate ? <DueDateCell date={dueDate} urgency={dueDateUrgency} /> : null}
        </div>
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
  /**
   * Headline shown when `groups` is empty. Overridable because the kit cannot know the
   * consumer's language or domain — it previously hardcoded this English string.
   * @default 'No tasks yet'
   */
  emptyTitle?: string;
  /** Optional second line on the empty state, explaining why the table is empty. */
  emptyDescription?: string;
  /** Optional way out of the empty state (e.g. a "Create task" button), rendered below the text. */
  emptyAction?: React.ReactNode;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

function TaskTableRowSkeleton() {
  return (
    <tr>
      <td className={cn(CELL_BASE, 'pl-4 pr-4 border-l')} style={{ width: COLUMN_WIDTHS.name }}>
        <div className="flex items-center gap-2 h-full">
          <Skeleton className="h-4 w-full" />
        </div>
      </td>
      <td className={cn(CELL_BASE, 'pl-4 pr-4')} style={{ width: COLUMN_WIDTHS.tags }}>
        <div className="flex items-center gap-2 h-full">
          <Skeleton className="h-6 w-16 rounded" />
        </div>
      </td>
      <td className={cn(CELL_BASE, 'pl-4 pr-4')} style={{ width: COLUMN_WIDTHS.estimation }}>
        <div className="flex items-center gap-2 h-full">
          <Skeleton className="h-4 w-16" />
        </div>
      </td>
      <td className={cn(CELL_BASE, 'pl-4 pr-4')} style={{ width: COLUMN_WIDTHS.assignee }}>
        <div className="flex items-center gap-2 h-full">
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <Skeleton className="h-4 w-20" />
        </div>
      </td>
      <td className={cn(CELL_BASE, 'pl-4 pr-4')} style={{ width: COLUMN_WIDTHS.dueDate }}>
        <div className="flex items-center gap-2 h-full">
          <Skeleton className="h-4 w-20" />
        </div>
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
export function TaskTable({
  groups,
  isLoading = false,
  emptyTitle = 'No tasks yet',
  emptyDescription,
  emptyAction,
  className,
}: TaskTableProps) {
  return (
    <div
      className={cn(
        'w-full overflow-x-auto',
        '[scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-3 [&::-webkit-scrollbar-thumb]:rounded-full',
        className,
      )}
    >
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
                i === headerCells.length - 1 && 'rounded-r-4',
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
          <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
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
                    <div className="flex items-center gap-2 h-14 px-4 bg-surface-panel rounded-t-4">
                      <ChevronDownIcon className="w-6 h-6 shrink-0 text-muted" />
                      <h3 className="flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans">
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
