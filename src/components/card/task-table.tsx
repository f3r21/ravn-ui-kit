import { cn } from '../../utils/cn';
import { Avatar } from '../avatar/avatar';
import { Tag } from '../tag/tag';
import { Skeleton } from '../skeleton/skeleton';
import { ChevronDownIcon, ChevronRightIcon } from '../icons/icons';
import type { AccentColor, DueDateUrgency, TaskTag } from '../../types/color-variants';
import type { HeadingLevel } from '../../types/heading-level';
import { EmptyState } from '../empty-state/empty-state';
import { formatPointsLong, type PointsFormatter } from '../../utils/format-points';
import { DueDateUrgencyState } from './due-date-urgency-state';

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
// (The duplication between the two checkbox implementations is real and known; the fix is
// sharing one control, which is a bigger change than an icon swap and is not this.)
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
  /**
   * What each urgency *says*, announced to assistive tech beside the date. Merged over the
   * shared `DUE_DATE_URGENCY_LABEL` defaults.
   *
   * The colour was the whole signal (#92) — WCAG 2.2 1.4.1. Named `urgencyLabel` here and
   * `dueDateUrgencyLabel` on `TaskCard` to match each component's own prop vocabulary; both
   * read the same defaults, so the two renderers cannot disagree about what "overdue" says
   * any more than `DUE_DATE_URGENCY_COLOR` lets them disagree about how it looks.
   *
   * Pass `''` for an urgency to announce nothing for it; `normal` is already `''`.
   * @default DUE_DATE_URGENCY_LABEL — `''` / `'due soon'` / `'overdue'`
   */
  urgencyLabel?: Partial<Record<DueDateUrgency, string>>;
}

/** Renders a task's due date with color-coded urgency. Figma "Due Date Cell" (Task Column02.md). */
export function DueDateCell({ date, urgency = 'normal', urgencyLabel }: DueDateCellProps) {
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
  return (
    <span className={cn(CELL_TEXT, styles[urgency])}>
      {date}
      {/* The state the colour above was carrying alone (#92). Inside the same span as the
          date so it is announced as one phrase — "6 July, 2020, overdue" — rather than as a
          loose fragment after it. */}
      <DueDateUrgencyState urgency={urgency} labels={urgencyLabel} />
    </span>
  );
}

export interface AssigneeNameCellProps {
  /**
   * Assignee's full name, shown next to the avatar and used for initials fallback.
   *
   * Optional as of #111. Omitted, the cell still renders its `Avatar`, which carries the
   * unassigned state — the same thing `TaskCard` has done since #47, and which this cell used
   * to skip by not rendering at all.
   */
  name?: string;
  /** Avatar image URL. Falls back to initials derived from `name` when omitted. */
  avatarSrc?: string;
  /**
   * Accessible name for the avatar when there is no assignee (#111), forwarded to
   * `Avatar.fallbackLabel`.
   *
   * `TaskCard` announced "Unassigned" for this state and a table row announced **nothing** — an
   * empty cell with no indication in the accessibility tree that the column was even about an
   * assignee. A consumer could not fix it: passing `assigneeName: 'Unassigned'` puts a false
   * name into the data, and the row then reads as assigned to a person called Unassigned.
   * @default 'Unassigned'
   */
  unassignedLabel?: string;
}

/**
 * Renders an assignee's 32px avatar and name together in a table cell.
 * Figma "Task Assign Name Cell" (Task Column02.md): Avatar (32x32, matches `Avatar` `size="sm"`)
 * + name text, Desktop/Body/M/regular, neutral.1.
 */
export function AssigneeNameCell({
  name,
  avatarSrc,
  unassignedLabel = 'Unassigned',
}: AssigneeNameCellProps) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      {/* The `Avatar` is unconditional, exactly as `TaskCard` renders it — and the design draws
          it that way: both `Task Assign Name Cell` instances in `Task Column02.md` carry an
          Avatar, and no export anywhere draws an unassigned state, so there is no basis for an
          empty cell. `Avatar` owns the no-person case via `fallbackLabel` (#47); this cell used
          to sidestep that by not rendering at all. */}
      <Avatar src={avatarSrc} name={name} fallbackLabel={unassignedLabel} size="sm" />
      {/* The name text stays conditional. There is no person to name, and repeating the
          fallback here would announce it twice — `Avatar` already carries it. */}
      {name ? <span className={cn(CELL_TEXT, 'truncate')}>{name}</span> : null}
    </div>
  );
}

export interface EstimationCellProps {
  /** Numeric estimation (story points) rendered as `"N Points"` / `"1 Point"`. */
  points: number;
  /**
   * How `points` is written. Defaults to `formatPointsLong` — `"1 Point"` / `"4 Points"`.
   *
   * This cell already pluralised correctly; `TaskCard` did not, and rendered "1 Pts" (#94).
   * Both now read the rule from one place. The **words** still differ deliberately — the
   * card's `"Pts"` cites `Cards01.md L340-359` and this cell's `"Points"` cites
   * `Task Column02.md`, and neither could be re-derived against Figma, so unifying them would
   * override a citation on no evidence.
   */
  formatPoints?: PointsFormatter;
}

/**
 * Renders a task's estimation as plain text -- Figma's "Estimation Cell" (Task Column02.md,
 * "3 Days" sample text; the real in-context "Task Default View" mockup renders it as
 * "N Points") is plain Desktop/Body/M/regular text directly in the cell, no badge/pill chrome.
 */
export function EstimationCell({ points, formatPoints = formatPointsLong }: EstimationCellProps) {
  return <span className={cn(CELL_TEXT, 'tabular-nums')}>{formatPoints(points)}</span>;
}

export interface TagCellProps {
  /**
   * Tags to render, each with its own label text and optional color variant (defaults to
   * `'neutral'` per tag).
   *
   * **Rendered `uppercase`, with the label string untouched** (#102) — identical treatment and
   * identical reasoning to `TaskCard.tags`, and shared deliberately: the card and the table
   * render the same chips, so they must not disagree about their casing any more than about
   * their colour. Per-tag `className` overrides it.
   */
  labels: TaskTag[];
}

/** Renders a wrapping list of `Tag` pills for a task row. Figma "Task Tag Cell" (Task Column02.md). */
export function TagCell({ labels }: TagCellProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {labels.map((t, i) => (
        // Same class, same reason, same override as `TaskCard` — see `TaskTag.className`.
        <Tag key={i} variant={t.variant ?? 'neutral'} className={cn('uppercase', t.className)}>
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
   * Whether the row renders its select checkbox at all. The checkbox is `sr-only` and
   * merely `opacity-0` until hover, so it was always in the accessibility tree even for a
   * consumer with no bulk-selection feature — one extra checkbox per row, announced,
   * tabbable, and doing nothing. There was no way to omit it.
   * @default true
   */
  isSelectable?: boolean;
  /**
   * The trailing link's visible text (#90). Ignored unless `onViewDetails` is set.
   * @default 'Details'
   */
  detailsLabel?: string;
  /**
   * Accessible name for the row's select checkbox. Ignored unless `isSelectable`.
   *
   * The default interpolates the row's own `title`, so within one table the checkboxes are
   * already distinct. What it cannot survive is **two tables on one page** — a "To Do" and
   * a "Done" table that both contain "Design the empty state" produce two checkboxes with
   * one name, and the word "Select" is English regardless. Qualify it with whatever
   * distinguishes the tables: `` `Select ${title} in To Do` ``.
   * @default Select ${title}
   */
  selectLabel?: string;
  /**
   * Renders the row's title inside an `<h*>` of this level, giving list view the per-task
   * heading navigation a board of `TaskCard`s has. Omitted, the title stays a plain
   * `<button>`/`<span>` exactly as before — a heading in every row of a long table is real
   * noise for a screen reader that already navigates the table as a grid, so this is opt-in
   * rather than a default. Named to match `ProjectInfo`'s prop of the same name.
   */
  headingLevel?: HeadingLevel;
  /**
   * Tags rendered in the Task Tags column, forwarded to `TagCell` — rendered `uppercase` with
   * the label string untouched (#102). See `TaskTag.className` to opt out per chip.
   * @default []
   */
  tags?: TaskTag[];
  /** Estimation points. Column renders empty when omitted. */
  estimationPoints?: number;
  /** How `estimationPoints` is written, forwarded to `EstimationCell` (#94). */
  formatPoints?: PointsFormatter;
  /**
   * Assignee's full name. When omitted the cell still renders, showing the unassigned avatar —
   * it used to render nothing at all, so an unassigned row was silent to assistive tech (#111).
   */
  assigneeName?: string;
  /**
   * Accessible name for the unassigned state, forwarded to `AssigneeNameCell` and on to
   * `Avatar.fallbackLabel`. Matches `TaskCard`'s behaviour, which has announced this since #47.
   * @default 'Unassigned'
   */
  unassignedLabel?: string;
  /** Assignee's avatar image URL, passed through to `AssigneeNameCell`. */
  assigneeAvatar?: string;
  /** Due date text (already formatted). Column renders empty when omitted. */
  dueDate?: string;
  /**
   * Color treatment conveying how urgent `dueDate` is.
   * @default 'normal'
   */
  dueDateUrgency?: DueDateUrgency;
  /**
   * What each urgency *says*, forwarded to this row's `DueDateCell` — see
   * `DueDateCell.urgencyLabel`. Without it a row states its urgency in colour only (#92).
   * @default DUE_DATE_URGENCY_LABEL — `''` / `'due soon'` / `'overdue'`
   */
  dueDateUrgencyLabel?: Partial<Record<DueDateUrgency, string>>;
  /**
   * Controls rendered at the end of the Task Name cell — in practice a per-row overflow menu
   * (Edit / Delete), which is what `TaskCard.actions` already exists for (#95). Without it a
   * list view built on this component simply loses those actions.
   *
   * Name it for the task it belongs to (`"Task options for Fix auth bug"`), because a table of
   * rows otherwise offers a screen-reader user a list of identical "options" buttons.
   *
   * **A click here does not open the row.** Like the select checkbox and the "Details" link, it
   * is one of the row's own controls, so `onClick` does not fire — including from the keyboard,
   * where activating a control synthesises a click that would otherwise bubble.
   *
   * It lands in the Task Name cell rather than a sixth column on purpose: the five column widths
   * sum to the spec's 1108px row, and adding a column would break that invariant and the
   * `colgroup` with it. A consumer-defined column set is #97.
   */
  actions?: React.ReactNode;
  /**
   * Which columns this row draws, and in what order (#97).
   *
   * Rendering a row directly is rare — `TaskTable` passes its own resolved list down, so a
   * consumer using `TaskTable.columns` never sets this. It exists because `TaskTableRow` is
   * exported, and a row that ignored the table's column set would produce cells that do not
   * line up with the header above them.
   * @default DEFAULT_COLUMNS
   */
  columns?: readonly TaskTableColumn[];
  /**
   * Column header text, used only to resolve `columns` when this row is rendered directly.
   * Ignored for anything a row draws, since a row draws no headers.
   */
  columnLabels?: Partial<TaskTableColumnLabels>;
  /**
   * Called when the row is opened. Providing it renders the task title as a real `<button>`
   * (the keyboard and screen-reader path — click, Enter or Space) and additionally makes the
   * whole row clickable for a pointer user. Fires once either way, and not at all when the
   * row's own controls — the select checkbox, the "Details" link — are used.
   */
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
  isSelectable = true,
  selectLabel,
  detailsLabel = 'Details',
  headingLevel,
  tags = [],
  estimationPoints,
  formatPoints,
  assigneeName,
  assigneeAvatar,
  unassignedLabel,
  dueDate,
  dueDateUrgency = 'normal',
  dueDateUrgencyLabel,
  actions,
  columns,
  columnLabels,
  onClick,
  onViewDetails,
}: TaskTableRowProps) {
  // The row reads the same resolver the header, the colgroup and the skeleton read. That shared
  // resolution is what replaces the shared constants they all used to read directly (#97).
  const resolved = resolveColumns(columns, columnLabels);

  // The row's own props, rebuilt for `TaskTableCustomColumn.renderCell`. Explicit rather than a
  // rest-capture because every field above is destructured with its default applied, and a
  // custom cell should see the same values the built-in cells do.
  const rowProps: TaskTableRowProps = {
    index,
    title,
    indicatorColor,
    reactions,
    isSelected,
    onSelectedChange,
    isSelectable,
    selectLabel,
    detailsLabel,
    headingLevel,
    tags,
    estimationPoints,
    formatPoints,
    assigneeName,
    assigneeAvatar,
    unassignedLabel,
    dueDate,
    dueDateUrgency,
    dueDateUrgencyLabel,
    actions,
    onClick,
    onViewDetails,
  };
  // A click on one of the row's own controls is not a click on the row. Without this, ticking
  // the select checkbox or following the "Details" link also fired `onClick` and opened the
  // task — including from the keyboard, where activating a control synthesises a click that
  // bubbles just the same.
  const stopRowOpen = (e: React.MouseEvent) => e.stopPropagation();

  const TitleHeading = headingLevel ? (`h${headingLevel}` as const) : null;
  // Sizing lives on whichever element is outermost, so the two shapes do not both claim it.
  const titleSizing = TitleHeading ? 'inline-block max-w-full align-bottom' : 'flex-1 min-w-0';

  const titleControl = onClick ? (
    <button
      type="button"
      onClick={(e) => {
        stopRowOpen(e);
        onClick();
      }}
      className={cn(
        CELL_TEXT,
        titleSizing,
        'truncate text-left cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1',
      )}
    >
      {title}
    </button>
  ) : (
    <span className={cn(CELL_TEXT, titleSizing, 'truncate')}>{title}</span>
  );

  /**
   * The five cell bodies, keyed. Split out of the `<tr>` so the row can render whichever
   * columns it was given, in whatever order — the `<td>` chrome is written once below and
   * the body is looked up, rather than five `<td>`s hardcoding a sequence (#97).
   */
  const cellBody: Record<TaskTableColumnKey, React.ReactNode> = {
    name: (
      <div className="flex items-center gap-2 h-full">
        <span className={cn('w-1 h-full shrink-0', indicatorColorMap[indicatorColor])} />
        {/* `has-[:focus-visible]:outline-solid` is load-bearing — see `LabelCheckbox`
            for the full reasoning. The row-select checkbox is `sr-only`, so its ring is
            drawn on this label via `:has()`, and under that variant `outline-2` alone
            leaves `outline-style` unresolved: the ring computed a width and a colour and
            painted nothing. Verified by counting pixels in a real browser, 0 -> 291. */}
        {/* The handler below is a propagation guard, not an activation path — what a
            keyboard operates here is the real `<input type="checkbox">` this label wraps,
            which is exactly what the two suppressed rules exist to require. */}
        {isSelectable ? (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          <label
            onClick={stopRowOpen}
            className="w-6 h-6 shrink-0 flex items-center justify-center cursor-pointer rounded-xs has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-interactive-text has-[:focus-visible]:outline-offset-1"
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={isSelected}
              onChange={(e) => onSelectedChange?.(e.target.checked)}
              aria-label={selectLabel ?? `Select ${title}`}
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
        ) : null}
        <span className={cn(CELL_TEXT, 'shrink-0 tabular-nums')}>
          {String(index).padStart(2, '0')}
        </span>
        {/* The row's opener. A real `<button>` rather than a `role`/`tabIndex`/`onKeyDown`
            trio on some wrapper: its accessible name is the task title, and focus, Enter
            and Space come from the platform. It carries `truncate` itself so a long title
            still clips at the column edge. */}
        {/* Under a `headingLevel`, the sizing moves to the heading and the control keeps
            only `max-w-full truncate` — same reason as `ProjectInfo`: `truncate` sets
            `overflow: hidden`, and a focus ring is painted outside the box, so a
            truncating ancestor would clip the ring away on all four sides. */}
        {TitleHeading ? (
          <TitleHeading className={cn(CELL_TEXT, 'flex-1 min-w-0')}>{titleControl}</TitleHeading>
        ) : (
          titleControl
        )}
        {reactions.map((r) => (
          <span key={r.emoji} className={cn(CELL_TEXT, 'inline-flex items-center gap-1 shrink-0')}>
            <span className="tabular-nums">{r.count}</span>
            <span>{r.emoji}</span>
          </span>
        ))}
        {onViewDetails ? (
          <button
            type="button"
            onClick={(e) => {
              stopRowOpen(e);
              onViewDetails();
            }}
            className={cn(
              CELL_TEXT,
              // `hover:text-interactive-text`, not `hover:text-interactive`: this is a
              // text label, and hovering it used to drop it to 3.51:1 on the panel it
              // sits on. A hover state is invisible to a static-story axe pass, so this
              // one was found by reading rather than by measuring.
              'inline-flex items-center gap-1 shrink-0 hover:text-interactive-text transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs',
            )}
          >
            <span>{detailsLabel}</span>
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        ) : null}
        {/* Same propagation guard as the checkbox and the "Details" link above: a click on
            one of the row's own controls is not a click on the row. Without it, opening the
            menu also opens the task behind it. The wrapper is a plain `<div>` carrying only
            the guard — whatever the consumer passes owns its own focus ring and padding. */}
        {actions ? (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div className="shrink-0" onClick={stopRowOpen}>
            {actions}
          </div>
        ) : null}
      </div>
    ),
    tags: (
      <div className="flex items-center gap-2 h-full">
        {tags.length > 0 ? <TagCell labels={tags} /> : null}
      </div>
    ),
    estimation: (
      <div className="flex items-center gap-2 h-full">
        {estimationPoints !== undefined ? (
          <EstimationCell points={estimationPoints} formatPoints={formatPoints} />
        ) : null}
      </div>
    ),
    assignee: (
      <div className="flex items-center gap-2 h-full">
        {/* Unconditional (#111). The card renders its `Avatar` whether or not there is an
            assignee, and this cell did not — so the same task announced "Unassigned" on a
            board and nothing at all in a table. */}
        <AssigneeNameCell
          name={assigneeName}
          avatarSrc={assigneeAvatar}
          unassignedLabel={unassignedLabel}
        />
      </div>
    ),
    dueDate: (
      <div className="flex items-center gap-2 h-full">
        {dueDate ? (
          <DueDateCell date={dueDate} urgency={dueDateUrgency} urgencyLabel={dueDateUrgencyLabel} />
        ) : null}
      </div>
    ),
  };

  return (
    // The row-wide handler is a pointer convenience only. A `<tr>` cannot be the control
    // itself — giving it `role="button"` would strip its `row` role and break the table it
    // has to live in — so the keyboard and screen-reader affordance is the title button in
    // the Task Name cell below, exactly as `TaskCard` now does it. Before that button
    // existed this handler was the only way to open a task from the table, and it was
    // unreachable without a pointer: no `role`, no `tabIndex`, no `onKeyDown`.
    <tr onClick={onClick} className={cn('group', onClick && 'cursor-pointer')}>
      {resolved.map((col, i) => (
        <td
          key={col.key}
          className={cn(
            CELL_BASE,
            // Task Name's left padding is 0 so the accent stripe sits flush against the edge
            // (Figma: padding 4px 16px 4px 0px); every other cell takes pl-2.
            col.key === 'name' ? 'pl-0 pr-4' : 'pl-2 pr-4',
            // `border-l` belongs to whichever column is FIRST, not to `name`. Those were the
            // same thing while the order was fixed, and a consumer who reorders is exactly the
            // case where they stop being.
            i === 0 && 'border-l',
          )}
          style={{ width: col.width }}
        >
          {col.renderCell ? col.renderCell(rowProps) : cellBody[col.key as TaskTableColumnKey]}
        </td>
      ))}
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
   * Which `<h*>` this group's header renders as (#95). It was hardcoded `<h3>`, with no way
   * past it — so a consumer whose page runs `<h1>` page → `<h2>` status got `h1 → h3`, a
   * skipped level that axe reports as `heading-order` and that no prop could fix.
   *
   * Per group rather than per table, matching where `title` and `actions` already live, and so
   * it composes with `TaskTableRow.headingLevel` — set this one level above the rows' so the
   * outline nests instead of colliding.
   * @default 3
   */
  headingLevel?: HeadingLevel;
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
  /**
   * Replaces the whole empty state, rather than configuring the one this renders (#15).
   *
   * The three `empty*` props above flatten three of `EmptyState`'s five, leaving its `icon`
   * and `label` unreachable — and `label` matters, because a page holding both this and a
   * `TaskListView` otherwise presents a screen-reader user with two groups called "No
   * results". Pass an `EmptyState` of your own and every prop is yours.
   *
   * **Additive on purpose.** Replacing the flattened props would break every existing
   * caller, and they are a fine shorthand for the common case — so they stay, and this wins
   * when both are given. Identical slot on `TaskListView`.
   */
  empty?: React.ReactNode;
  /**
   * The column headers, merged over the English defaults (#90). They were a module-level
   * constant with no way past them, so a consumer could not translate the one row of this
   * component that is pure prose.
   *
   * **`columns` (#97) does not replace this.** Setting a header's words is the common case and
   * should not require restating the column set to do it. When both are given, `columns[].label`
   * wins — the precedence is stated on `resolveColumns` rather than left to be discovered.
   * @default { name: '# Task Name', tags: 'Task Tags', estimation: 'Estimate', assignee: 'Task Assign Name', dueDate: 'Due Date' }
   */
  columnLabels?: Partial<TaskTableColumnLabels>;
  /**
   * Which columns the table draws, in what order, at what width (#97).
   *
   * Additive: omitted, the table renders `DEFAULT_COLUMNS` exactly as before. The `key` set is
   * closed — a column selects one of the five cells this component knows how to draw, so this
   * reorders and omits rather than letting a consumer define arbitrary cells. Rendering
   * something the kit has no cell for is `TaskTableGroup.actions` or a component of your own,
   * not a sixth column here.
   *
   * **Supplying a `width` opts out of the 1108px total**, and that is the trade this prop
   * makes. The five default widths sum to the spec's "Task Table Row" width, which
   * `src/styles/decisions.mdx` quotes and which `min-w-[1108px]` used to hardcode — that
   * minimum is now computed from whatever columns are in play, so a narrower set no longer
   * forces a scrollbar for space it does not use. The default set still sums to 1108, and a
   * test pins it: the invariant stopped being emergent and became asserted, because an
   * override path is exactly what kills a property nobody checks.
   *
   * Omitting a column removes its cell from every row, the header and the `colgroup` together
   * — all four read `resolveColumns`, so they cannot disagree.
   * @default DEFAULT_COLUMNS
   */
  columns?: readonly TaskTableColumn[];
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

function TaskTableRowSkeleton({ columns }: { columns: ResolvedTaskTableColumn[] }) {
  // The fourth renderer, and the one most likely to be forgotten — a skeleton nobody looks at
  // closely can hold a stale column set for a long time. It reads the same resolved list as the
  // header, the colgroup and the real row, so it cannot (#97).
  const placeholder: Record<TaskTableColumnKey, React.ReactNode> = {
    name: <Skeleton className="h-4 w-full" />,
    tags: <Skeleton className="h-6 w-16 rounded" />,
    estimation: <Skeleton className="h-4 w-16" />,
    assignee: (
      <>
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <Skeleton className="h-4 w-20" />
      </>
    ),
    dueDate: <Skeleton className="h-4 w-20" />,
  };

  return (
    <tr>
      {columns.map((col, i) => (
        <td
          key={col.key}
          className={cn(CELL_BASE, 'pl-4 pr-4', i === 0 && 'border-l')}
          style={{ width: col.width }}
        >
          <div className="flex items-center gap-2 h-full">
            {/* A custom column has no bespoke placeholder — a generic bar is right, and is
                better than an empty cell that reads as a rendering bug while loading. */}
            {placeholder[col.key as TaskTableColumnKey] ?? <Skeleton className="h-4 w-16" />}
          </div>
        </td>
      ))}
    </tr>
  );
}

/**
 * A group header's `<h*>`. Split out only so the level is a value rather than a literal tag —
 * the class list is unchanged from the `<h3>` this replaced, so the typography is identical at
 * every level and the heading carries semantics rather than size.
 */
function GroupHeading({ level, children }: { level: HeadingLevel; children: React.ReactNode }) {
  const Tag = `h${level}` as const;
  return (
    <Tag className="flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans">
      {children}
    </Tag>
  );
}

/** The column headers this table draws, per `Task Column02.md`'s "Table Header Cell". */
export interface TaskTableColumnLabels {
  /** The first column, which also carries the row index. */
  name: string;
  /** The tag-chips column. */
  tags: string;
  /** The story-points column. */
  estimation: string;
  /** The assignee column. */
  assignee: string;
  /** The due-date column. */
  dueDate: string;
}

const DEFAULT_COLUMN_LABELS: TaskTableColumnLabels = {
  name: '# Task Name',
  tags: 'Task Tags',
  estimation: 'Estimate',
  assignee: 'Task Assign Name',
  dueDate: 'Due Date',
};

const COLUMN_ORDER = ['name', 'tags', 'estimation', 'assignee', 'dueDate'] as const;

/** Which of the five cells a column draws. Closed on purpose — see `TaskTableProps.columns`. */
export type TaskTableColumnKey = (typeof COLUMN_ORDER)[number];

/** One of the five cells this component knows how to draw. */
export interface TaskTableBuiltInColumn {
  /** Which of the five cells this column draws. */
  key: TaskTableColumnKey;
  /**
   * Header text. Falls back to `columnLabels[key]`, then to the default.
   * @default DEFAULT_COLUMN_LABELS[key]
   */
  label?: string;
  /**
   * Width in pixels. **Supplying one opts out of the 1108px total** — see
   * `TaskTableProps.columns`.
   * @default COLUMN_WIDTHS[key]
   */
  width?: number;
}

/**
 * A column the kit does not know about — the Status column #97 names in its first sentence.
 *
 * `label` and `width` are **required** here and optional on a built-in, and that asymmetry is
 * the point: there is no default for a column this component never drew. A width is what keeps
 * the header, the `colgroup` and the body cells aligned, and guessing one would misalign the
 * table rather than fail.
 *
 * `renderCell` receives the row's own props, so a custom column reads the same typed row data
 * as every other cell. That is what keeps this **additive**: `TaskTableRowProps` stays typed
 * field-by-field and does not become a generic bag, so nothing existing breaks.
 */
export interface TaskTableCustomColumn {
  /** Identifier for this column. Must not collide with a built-in key. */
  key: string;
  /** Header text. Required — the kit has no name for a column it did not draw. */
  label: string;
  /** Width in pixels. Required, for the same reason. */
  width: number;
  /** Draws the cell for one row. */
  renderCell: (row: TaskTableRowProps) => React.ReactNode;
}

/** One column in `TaskTableProps.columns` (#97). */
export type TaskTableColumn = TaskTableBuiltInColumn | TaskTableCustomColumn;

function isCustom(col: TaskTableColumn): col is TaskTableCustomColumn {
  return 'renderCell' in col;
}

/**
 * The five columns as the design draws them, in order.
 *
 * Deliberately carries **only keys**. Baking `label` and `width` in here looks tidier and
 * silently breaks `columnLabels`: `resolveColumns` falls back with `??`, so a label present on
 * the column always wins and the `columnLabels` argument can never be reached. #90's existing
 * tests caught exactly that — the defaults belong in the resolver, where the fallback chain
 * can see them.
 */
export const DEFAULT_COLUMNS: readonly TaskTableColumn[] = COLUMN_ORDER.map((key) => ({ key }));

/** A column with every fallback applied — what the four renderers actually iterate. */
export interface ResolvedTaskTableColumn {
  key: string;
  label: string;
  width: number;
  /** Present only for a custom column; built-ins are drawn from the keyed cell bodies. */
  renderCell?: (row: TaskTableRowProps) => React.ReactNode;
}

/**
 * The one place a column list becomes concrete, and the reason the four renderers cannot drift.
 *
 * The header row, the `<colgroup>`, `TaskTableRow` and `TaskTableRowSkeleton` must agree on
 * which columns exist, in what order, at what width. Before `columns` they agreed because all
 * four read `COLUMN_WIDTHS` and `COLUMN_ORDER` directly — agreement by shared constant, which
 * an override path destroys. It is replaced by agreement through shared *resolution*: all four
 * iterate the output of this function. Teaching the table a new column is one entry in
 * `COLUMN_ORDER` plus one cell body in each of the two row renderers, and the header and
 * colgroup follow for free — rather than four edits a reviewer has to notice are missing.
 *
 * **Label precedence is `columns[].label` → `columnLabels[key]` → the default**, stated here
 * because two ways to set one string is how an API rots. `columnLabels` (#90) predates this and
 * keeps working: translating headers should not require restating the column set.
 */
export function resolveColumns(
  columns: readonly TaskTableColumn[] | undefined,
  columnLabels: Partial<TaskTableColumnLabels> | undefined,
): ResolvedTaskTableColumn[] {
  return (columns ?? DEFAULT_COLUMNS).map((col) =>
    isCustom(col)
      ? { key: col.key, label: col.label, width: col.width, renderCell: col.renderCell }
      : {
          key: col.key,
          label: col.label ?? columnLabels?.[col.key] ?? DEFAULT_COLUMN_LABELS[col.key],
          width: col.width ?? COLUMN_WIDTHS[col.key],
        },
  );
}

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
  empty,
  columnLabels,
  columns,
  className,
}: TaskTableProps) {
  // Resolved once, here, and handed to all four renderers below — the header row, the
  // `<colgroup>`, `TaskTableRow` and `TaskTableRowSkeleton`. They used to agree because they
  // each read `COLUMN_WIDTHS` and `COLUMN_ORDER`; now they agree because they read this (#97).
  const resolved = resolveColumns(columns, columnLabels);

  // Was `min-w-[1108px]`, the sum of the five default widths. Computed now, because a consumer
  // who drops a column should not be forced to scroll for space it no longer occupies. The
  // default set still comes out at 1108 and a test pins that.
  const minWidth = resolved.reduce((sum, col) => sum + col.width, 0);

  return (
    <div
      className={cn(
        'w-full overflow-x-auto',
        '[scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-3 [&::-webkit-scrollbar-thumb]:rounded-full',
        className,
      )}
    >
      <div className="flex flex-col gap-4" style={{ minWidth }}>
        {/* Shared column header row */}
        <div className="flex">
          {resolved.map(({ key, label, width }, i) => (
            <div
              key={key}
              className={cn(
                CELL_BASE,
                'px-4',
                i === 0 && 'border-l rounded-l-4',
                i === resolved.length - 1 && 'rounded-r-4',
              )}
              style={{ width }}
            >
              <span className={CELL_TEXT}>{label}</span>
            </div>
          ))}
        </div>

        {isLoading ? (
          <table className="border-collapse table-fixed">
            <colgroup>
              {resolved.map(({ key, width }) => (
                <col key={key} style={{ width }} />
              ))}
            </colgroup>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TaskTableRowSkeleton key={i} columns={resolved} />
              ))}
            </tbody>
          </table>
        ) : groups.length === 0 ? (
          (empty ?? (
            <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
          ))
        ) : (
          groups.map((group, gi) => (
            <table key={gi} className="border-collapse table-fixed">
              <colgroup>
                {resolved.map(({ key, width }) => (
                  <col key={key} style={{ width }} />
                ))}
              </colgroup>
              <tbody>
                <tr>
                  <td colSpan={resolved.length} className="p-0 border border-neutral-3">
                    <div className="flex items-center gap-2 h-14 px-4 bg-surface-panel rounded-t-4">
                      <ChevronDownIcon className="w-6 h-6 shrink-0 text-muted" />
                      <GroupHeading level={group.headingLevel ?? 3}>{group.title}</GroupHeading>
                      {group.actions}
                    </div>
                  </td>
                </tr>
                {group.rows.map((row, ri) => (
                  // The table's column set wins over anything on the row: a row inside a
                  // table that disagreed with its own header is not a configuration worth
                  // supporting, and spreading `row` first would allow exactly that. Both go
                  // through `resolveColumns`, so the row cannot resolve them differently.
                  <TaskTableRow key={ri} {...row} columns={columns} columnLabels={columnLabels} />
                ))}
              </tbody>
            </table>
          ))
        )}
      </div>
    </div>
  );
}
