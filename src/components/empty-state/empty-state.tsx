import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  /** The headline — what is missing, in the user's terms. Required: an empty state with no text is just a gap. */
  title: string;
  /** Optional second line explaining why it is empty or what would fill it. */
  description?: string;
  /**
   * Optional glyph rendered above the title, at 48×48. Should use `currentColor` so it
   * picks up the muted tint rather than fighting it.
   */
  icon?: React.ReactNode;
  /** A way out of the empty state — clearing a filter, creating the first task. Rendered below the text. */
  action?: React.ReactNode;
  /**
   * Names the region for assistive technology, so it is findable rather than three loose
   * strings. Override it whenever more than one empty state can be on screen at once —
   * two identically-named groups are two things a screen-reader user cannot tell apart.
   * @default 'No results'
   */
  label?: string;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * What fills the space where content would be.
 *
 * **No Figma source.** The design file draws no empty state for any surface — every
 * mockup shows populated boards, tables and lists. It exists anyway because the kit
 * shipped two hardcoded English strings for exactly this ("No tasks in this view." in
 * `TaskListView`, "No tasks yet." in `TaskTable`), which a consumer could neither
 * translate, restyle, nor attach a "create the first task" action to. Ported from the
 * consuming app's own `EmptyState`, which had already worked the semantics out.
 *
 * **Deliberately not a live region.** It used to carry `role="status"` in the app, on
 * the reasoning that it appears in response to something the user just did — but a live
 * region announces *changes* to its contents, and this mounts with its text already
 * inside, so it announced nothing at all. The fix is a region that outlives the states
 * and swaps its text (the consuming board has one that reports "no tasks to show"); do
 * not re-add `role="status"` here expecting it to work. It stays a labelled `group` so
 * it is still something a screen-reader user can find and step into.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  label = 'No results',
  className,
}: EmptyStateProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'flex flex-col items-center gap-2 rounded-sm border border-dashed border-subtle/20',
        'px-6 py-10 text-center font-sans',
        className,
      )}
    >
      {icon ? (
        <span className="flex items-center justify-center w-12 h-12 shrink-0 text-muted [&>svg]:w-full [&>svg]:h-full">
          {icon}
        </span>
      ) : null}
      <p className="text-body-m font-semibold text-main">{title}</p>
      {description ? <p className="text-body-m text-muted">{description}</p> : null}
      {action}
    </div>
  );
}
