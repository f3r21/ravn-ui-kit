import { cn } from '../../utils/cn';
import { Tag, type TagProps } from '../tag/tag';
import { Popover, type PopoverProps } from '../popover/popover';

/**
 * One selectable label option in `LabelModal`'s list.
 *
 * Named `TaskLabel`, not `Label` (#14) — a bare `Label` exported into the kit's root
 * namespace was a near-certain collision with a consumer's own `Label` (a form-field label
 * is an extremely common thing to name that), and generic enough to say nothing about what
 * it actually is.
 */
export interface TaskLabel {
  /** Unique identifier, echoed back in `onAction`. */
  id: string;
  /** Label text shown on the tag pill. */
  text: string;
  /** Color accent applied to the tag pill, matching `Tag`'s own accent palette. */
  accent?: TagProps['accent'];
}

export interface LabelModalProps extends Pick<PopoverProps, 'ref'> {
  /** Full list of selectable labels shown as rows. */
  labels: TaskLabel[];
  /**
   * Called with the label of the row the user clicked.
   *
   * Named `onAction` (#14) — this fires once and closes the choice, the same one-shot-pick
   * shape `Menu.onAction` already models in this kit, not a persistent `Selection` state.
   */
  onAction: (label: TaskLabel) => void;
  /** Called when the popover should close without a selection — Escape or an outside click. */
  onClose: () => void;
  /** Ref to the trigger button that opens this popover — see `Popover`'s `triggerRef`. */
  triggerRef?: PopoverProps['triggerRef'];
  /**
   * A region that does not count as "outside" for dismissal — forwarded to `Popover` (#82).
   * Needed when this sits among sibling triggers, e.g. `AddTaskModal`'s chip row.
   */
  dismissExemptRef?: PopoverProps['dismissExemptRef'];
  /**
   * The popover's heading — rendered visibly **and** used as the surface's accessible name.
   * One prop drives both for the reason spelled out on `AssigneeModal.label`: two props
   * would let the announced name drift from the visible one, which is a WCAG 2.5.3 failure.
   * @default 'Label'
   */
  label?: string;
  /** Additional class names, merged last via `cn()` so they can override defaults (e.g. absolute positioning). */
  className?: string;
}

/**
 * LabelModal
 *
 * Live Figma access (Chunk 25, fileKey `ZUAB3jXFyKFktoAzvN7h1T`) confirmed `AddTaskModal`'s
 * "Tags" row has a 3rd real trigger between Assignee and Due date -- text "Label", icon
 * `remix-icons/fill/finance/price-tag-3-fill` -- previously documented as one of "two remaining
 * ground-truth chip slots... with no legible glyph or contradiction-free semantic." That was
 * wrong: there's exactly one missing trigger, and both its text and icon are fully legible.
 *
 * Only the trigger button itself (icon, text, position) is Figma-confirmed. No popover anatomy
 * for it exists anywhere in the export -- unlike Estimate/Assignee/Due date, whose popovers were
 * separately captured as their own components. This popover's shell, list layout, and selection
 * behavior are therefore an engineering-only addition, modeled on the real `AssigneeModal` shell
 * for visual consistency with its siblings -- same "kept because genuinely useful and doesn't
 * contradict spec" bar as `Skeleton`/`Datepicker`'s native input. Built on the shared `Popover`
 * primitive (see that file's doc comment) for real Escape/outside-click dismissal and focus
 * management, previously missing entirely, same as its `AssigneeModal`/`EstimateModal` siblings.
 */
export function LabelModal({
  labels,
  onAction,
  onClose,
  triggerRef,
  dismissExemptRef,
  label = 'Label',
  className,
  ref,
}: LabelModalProps) {
  return (
    <Popover
      isOpen
      onClose={onClose}
      ref={ref}
      triggerRef={triggerRef}
      dismissExemptRef={dismissExemptRef}
      aria-label={label}
      className={cn(
        'flex flex-col w-[160px] py-2 bg-surface-overlay border border-subtle rounded-sm',
        className,
      )}
    >
      <div className="flex items-center h-8 px-4">
        {/* `--color-muted-on-dark`, not `--color-muted`: this popover is `surface-overlay`,
            where neutral-2 measures 3.73:1. Same call as FIELD_DESCRIPTION_CLASS. */}
        <span className="text-body-xl font-semibold text-muted-on-dark font-sans truncate">
          {label}
        </span>
      </div>
      {labels.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => onAction(l)}
          className="flex items-center w-full px-4 py-1.5 hover:bg-neutral-2/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2"
        >
          <Tag accent={l.accent ?? 'neutral'}>{l.text}</Tag>
        </button>
      ))}
    </Popover>
  );
}
