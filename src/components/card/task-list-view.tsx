import { cn } from '../../utils/cn';
import { ProjectInfo } from './project-info';
import { TaskCard, type TaskCardProps } from './task-card';
import { Skeleton } from '../skeleton/skeleton';

export interface TaskListViewProps {
  /** Project/section title, rendered via `ProjectInfo` (e.g. `"Working (03)"`). */
  title: string;
  /** Optional trailing 24×24 icon forwarded to `ProjectInfo`. */
  icon?: React.ReactNode;
  /** Tasks rendered as a vertical stack below the header, each spread onto a `TaskCard`. Renders an empty-state message when the array is empty. */
  tasks: TaskCardProps[];
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
  className,
}: TaskListViewProps) {
  return (
    <div className={cn('flex flex-col gap-4 w-full', className)}>
      <ProjectInfo title={title} icon={icon} />
      {isLoading ? (
        <>
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </>
      ) : tasks.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-muted font-sans text-sm">
          No tasks in this view.
        </div>
      ) : (
        tasks.map((task, idx) => <TaskCard key={idx} {...task} className="w-full" />)
      )}
    </div>
  );
}
