import { cn } from '../../utils/cn';
import { UserRow } from '../avatar/user-row';
import { Popover, type PopoverProps } from '../popover/popover';

export interface Assignee {
  /** Unique identifier, echoed back in `onAction`. */
  id: string;
  /** Display name shown in the row. */
  name: string;
  /** Optional secondary text (job title/role) — no ground-truth "User" row instance shows one; kept as a non-contradicted, opt-in field forwarded to `UserRow`. */
  role?: string;
  /** Optional avatar image URL; falls back to initials when omitted. */
  avatarSrc?: string;
}

export interface AssigneeModalProps {
  /** Full list of assignable people shown as rows. */
  assignees: Assignee[];
  /**
   * Called with the assignee of the row the user clicked.
   *
   * Named `onAction` (#14) — this fires once and closes the choice, the same one-shot-pick
   * shape `Menu.onAction` already models in this kit, not a persistent `Selection` state
   * (`Tabs`'s `onSelectionChange` shape), which is why it takes `Menu`'s vocabulary.
   */
  onAction: (assignee: Assignee) => void;
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
   *
   * One prop drives both on purpose. They were two copies of the same hardcoded `'Assignee'`,
   * and splitting them into two props would let a consumer set an accessible name that
   * disagrees with the visible one, which is the WCAG 2.5.3 (Label in Name) failure this
   * component currently avoids only by accident. Overriding it translates the header and the
   * announced name together.
   * @default 'Assignee'
   */
  label?: string;
  /** Additional class names, merged last via `cn()` so they can override defaults (e.g. absolute positioning). */
  className?: string;
}

/**
 * AssigneeModal
 *
 * Figma: "Assignee Modal" COMPONENT inside "Task Column" frame (Task Column01.md L762-1386).
 * A small anchored popover (239×432 for the full 7-row export, height scales with the list here),
 * neutral-3 bg, 1px neutral-2 border, 8px radius — not a centered dialog, so unlike the shared
 * `Modal` shell this has no backdrop/close chrome: the parent conditionally mounts it, same
 * convention as `DatePickerMenu`. Built on the shared `Popover` primitive (see that file's doc
 * comment) for real Escape/outside-click dismissal and focus management, previously missing
 * entirely. Anatomy is a decorative header label (Figma's "Input text" placeholder style,
 * Desktop/Body/XL/bold, neutral-2) followed by one 56px-tall "User" row (Avatar + name, reusing
 * `UserRow`) per assignee, no selection checkmark and no footer — clicking a row is the assign
 * action (every real "User" row instance renders identically, with no highlighted/selected
 * variant anywhere in the export).
 */
export function AssigneeModal({
  assignees,
  onAction,
  onClose,
  triggerRef,
  dismissExemptRef,
  label = 'Assignee',
  className,
}: AssigneeModalProps) {
  return (
    <Popover
      isOpen
      onClose={onClose}
      triggerRef={triggerRef}
      dismissExemptRef={dismissExemptRef}
      aria-label={label}
      className={cn(
        'flex flex-col w-[239px] pt-2 bg-surface-overlay border border-subtle rounded-sm',
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
      {assignees.map((a) => (
        <button
          key={a.id}
          type="button"
          onClick={() => onAction(a)}
          className="flex items-center w-full h-14 hover:bg-neutral-2/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2"
        >
          <UserRow name={a.name} role={a.role} avatarSrc={a.avatarSrc} size="sm" />
        </button>
      ))}
    </Popover>
  );
}
