import { cn } from '../../utils/cn';
import type { HeadingLevel } from '../../types/heading-level';
import { ProjectInfo } from './project-info';
import { TaskCard, type TaskCardProps } from './task-card';
import { Skeleton } from '../skeleton/skeleton';
import { EmptyState } from '../empty-state/empty-state';

export interface TaskListViewProps {
  /** Project/section title, rendered via `ProjectInfo` (e.g. `"Working (03)"`). */
  title: string;
  /**
   * Which `<h*>` the column title renders as, forwarded to `ProjectInfo`. A board is
   * usually `2` here so the `TaskCard`s below can keep the default `3` and nest under it —
   * both were level 3 before, which made the header indistinguishable from its own cards.
   * @default 3
   */
  headingLevel?: HeadingLevel;
  /**
   * Renders the column as a labelled `<section>` landmark instead of a plain `<div>`, so a
   * screen-reader user can jump between columns of a board rather than scrolling through
   * every card.
   *
   * Opt-in, and this is the decision #9 asked for rather than a default: there is no Figma
   * basis for a landmark, a board of three columns emits three of them, and a consumer that
   * already wraps this in its own `<section>` would get two nested landmarks with different
   * names. Pass the column's own name (`"Working"`); omitted, the markup is unchanged.
   */
  label?: string;
  /** Optional trailing 24×24 icon forwarded to `ProjectInfo`. */
  icon?: React.ReactNode;
  /** Tasks rendered as a vertical stack below the header, each spread onto a `TaskCard`. Renders an `EmptyState` when the array is empty. */
  tasks: TaskCardProps[];
  /**
   * Headline shown when `tasks` is empty. Overridable because the kit cannot know the
   * consumer's language or domain — it previously hardcoded this English string.
   * @default 'No tasks in this view'
   */
  emptyTitle?: string;
  /** Optional second line on the empty state, explaining why the view is empty. */
  emptyDescription?: string;
  /** Optional way out of the empty state (e.g. a "Create task" button), rendered below the text. */
  emptyAction?: React.ReactNode;
  /**
   * Replaces the whole empty state, rather than configuring the one this renders (#15).
   *
   * The three `empty*` props above flatten exactly three of `EmptyState`'s five, which left
   * its `icon` and `label` unreachable from here — and `label` is the one that matters,
   * because two empty states on one screen otherwise present a screen-reader user with two
   * identically-named groups. Pass an `EmptyState` of your own and every prop is yours:
   *
   * ```tsx
   * <TaskListView title="Working" tasks={[]} empty={<EmptyState title="All clear" label="No working tasks" icon={<InboxIcon />} />} />
   * ```
   *
   * **Additive on purpose.** Replacing the flattened props would be a breaking change for
   * every existing caller, and they are a genuinely convenient shorthand for the common
   * case — so they stay, and this wins when both are given. Same slot on `TaskTable`.
   */
  empty?: React.ReactNode;
  /**
   * Renders 3 skeleton task-card placeholders instead of `tasks` while data is in flight.
   * No ground-truth basis (static exports have no loading state) — an engineering-only
   * addition, same precedent as `Skeleton` itself.
   * @default false
   */
  isLoading?: boolean;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

function TaskCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 bg-surface-panel rounded-sm border border-transparent">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * TaskListView
 *
 * Figma: "Task List View" COMPONENT (`Task Column03.md`; confirmed in-context
 * in `Mockups/Dashboard Default View/Dashboard Mockup.md`'s "Frame 654", which
 * lays out 3 Task List View instances in a row, `gap: 32px` — that row is the
 * real "board" layout, not a separately-chromed "TaskColumn" component; see
 * the removal note on `--radius-20` in `theme.css`). Each instance is just a
 * `ProjectInfo` header (order 0) followed by a stack of `TaskCard`s (order 1+),
 * `flex-direction: column`, `gap: 16px` — no background, border, radius, count
 * badge, or "add task" affordance on the frame itself in any real instance
 * across the isolated doc export or the in-context dashboard mockup.
 */
export function TaskListView({
  title,
  icon,
  tasks,
  isLoading = false,
  emptyTitle = 'No tasks in this view',
  emptyDescription,
  emptyAction,
  empty,
  headingLevel = 3,
  label,
  className,
}: TaskListViewProps) {
  // `<section>` is only a landmark once it has an accessible name — an unnamed one is a
  // plain generic container, so there is no point rendering it without `label`.
  const Root = label ? 'section' : 'div';

  return (
    <Root aria-label={label} className={cn('flex flex-col gap-4 w-full', className)}>
      <ProjectInfo title={title} icon={icon} headingLevel={headingLevel} />
      {isLoading ? (
        <>
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </>
      ) : tasks.length === 0 ? (
        (empty ?? (
          <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
        ))
      ) : (
        tasks.map((task, idx) => <TaskCard key={idx} {...task} className="w-full" />)
      )}
    </Root>
  );
}
