import { cn } from '../../utils/cn';
import { TaskCard, type TaskCardProps } from '../card/task-card';

export interface TaskColumnProps {
  /** Column title, e.g. "To Do", "In Progress", "Done" */
  title: string;
  /** Total count of tasks — shown as a badge next to the title */
  count?: number;
  /** Accent color for the top border stripe. Defaults to neutral. */
  accentColor?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
  /** List of task cards to render in the column */
  tasks?: TaskCardProps[];
  /** Optional callback when user clicks "Add task" */
  onAddTask?: () => void;
  className?: string;
}

const accentMap = {
  primary: 'bg-primary-4',
  secondary: 'bg-secondary-4',
  tertiary: 'bg-tertiary-4',
  neutral: 'bg-neutral-3',
};

/**
 * TaskColumn
 *
 * Kanban board column matching the Figma "Task Column" frame.
 * - Background: neutral-4 (#2C2F33)
 * - Border-radius: 12px
 * - 4px colored top stripe (accent)
 * - Header: column title + task count badge
 * - Body: scrollable list of TaskCards
 * - Footer: "Add task" button
 */
export function TaskColumn({
  title,
  count,
  accentColor = 'neutral',
  tasks = [],
  onAddTask,
  className,
}: TaskColumnProps) {
  return (
    <div
      className={cn(
        'flex flex-col w-72 min-w-[18rem] bg-neutral-4 rounded-xl overflow-hidden shrink-0',
        className
      )}
    >
      {/* Top accent stripe */}
      <div className={cn('h-1 w-full', accentMap[accentColor])} />

      {/* Column Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
        <h2 className="font-sans font-bold text-sm text-neutral-1 uppercase tracking-wider truncate">
          {title}
        </h2>
        {count !== undefined ? (
          <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-neutral-3 text-neutral-1 shrink-0">
            {count}
          </span>
        ) : null}
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-3 px-3 pb-3 flex-1 overflow-y-auto max-h-[calc(100vh-16rem)]">
        {tasks.map((task, idx) => (
          <TaskCard key={idx} {...task} />
        ))}
      </div>

      {/* Add Task Footer */}
      {onAddTask ? (
        <div className="px-3 pb-4 shrink-0">
          <button
            type="button"
            onClick={onAddTask}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-neutral-2 border border-dashed border-neutral-3 rounded-lg hover:border-primary-4 hover:text-primary-4 transition-colors cursor-pointer font-sans"
          >
            <span className="text-base leading-none">+</span>
            Agregar tarea
          </button>
        </div>
      ) : null}
    </div>
  );
}
