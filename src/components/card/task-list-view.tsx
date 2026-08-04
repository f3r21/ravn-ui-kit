import { cn } from '../../utils/cn';
import { TaskCard, type TaskCardProps } from './task-card';

export interface TaskListViewProps {
  /** Tasks rendered as a vertical stack, each spread onto a `TaskCard`. Renders an empty-state message when the array is empty. */
  tasks: TaskCardProps[];
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * TaskListView
 *
 * Figma: "Task List View" COMPONENT inside "Task Column" frame.
 * Vertical stack of TaskCards — alternative to the Kanban board view.
 * Used when the user switches to "List" mode via SegmentedControl/Tabs.
 *
 * Gap confirmed via Figma "Task List View" frame (Task Column03.md): the
 * frame declares `gap: 16px` (was previously shipped as gap-3 / 12px).
 */
export function TaskListView({ tasks, className }: TaskListViewProps) {
  return (
    <div className={cn('flex flex-col gap-4 w-full', className)}>
      {tasks.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-neutral-2 font-sans text-sm">
          No hay tareas en esta vista.
        </div>
      ) : (
        tasks.map((task, idx) => (
          <TaskCard key={idx} {...task} className="w-full" />
        ))
      )}
    </div>
  );
}
