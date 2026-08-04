import { cn } from '../../utils/cn';
import { Badge } from '../badge/badge';

export interface ProjectInfoProps {
  /** Project name. */
  name: string;
  /** Short description or subtitle. */
  description?: string;
  /**
   * Status of the project. Drives the badge label/color via `statusMap`.
   * @default 'active'
   */
  status?: 'active' | 'on-hold' | 'completed';
  /**
   * Total tasks count. The progress bar/row is hidden entirely when this is `0`.
   * @default 0
   */
  totalTasks?: number;
  /**
   * Completed tasks count, used together with `totalTasks` to compute progress.
   * @default 0
   */
  completedTasks?: number;
  /**
   * Color accent for the left border stripe and progress bar fill.
   * @default 'primary'
   */
  accentColor?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
  /** Called when the card is clicked. When provided, the card also gets pointer/hover affordances. */
  onClick?: () => void;
}

const accentBorder = {
  primary: 'border-l-primary-4',
  secondary: 'border-l-secondary-4',
  tertiary: 'border-l-tertiary-4',
  neutral: 'border-l-neutral-2',
};

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  active: { label: 'Active', variant: 'success' },
  'on-hold': { label: 'On Hold', variant: 'warning' },
  completed: { label: 'Completed', variant: 'neutral' },
};

/**
 * ProjectInfo
 *
 * Figma: "Project Info" COMPONENT inside "Task Column" frame.
 * Header card showing project name, status badge, and task progress bar.
 */
export function ProjectInfo({
  name,
  description,
  status = 'active',
  totalTasks = 0,
  completedTasks = 0,
  accentColor = 'primary',
  className,
  onClick,
}: ProjectInfoProps) {
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const { label, variant } = statusMap[status];

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex flex-col gap-3 p-4 bg-neutral-4 rounded-xl border-l-4 border border-neutral-3/30',
        accentBorder[accentColor],
        onClick && 'cursor-pointer hover:border-neutral-2 transition-colors',
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h3 className="font-sans font-bold text-base text-neutral-1 truncate">{name}</h3>
          {description ? (
            <p className="text-xs text-neutral-2 font-sans line-clamp-2">{description}</p>
          ) : null}
        </div>
        <Badge variant={variant} className="shrink-0">{label}</Badge>
      </div>

      {/* Progress */}
      {totalTasks > 0 ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-sans text-neutral-2">
            <span>{completedTasks}/{totalTasks} tasks</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-3 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                accentColor === 'primary' ? 'bg-primary-4' :
                accentColor === 'secondary' ? 'bg-secondary-4' :
                accentColor === 'tertiary' ? 'bg-tertiary-4' : 'bg-neutral-2'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
