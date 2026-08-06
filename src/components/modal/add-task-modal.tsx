import React from 'react';
import { cn } from '../../utils/cn';
import { TextButton } from '../button/text-button';
import { Tag } from '../tag/tag';
import { Avatar } from '../avatar/avatar';
import { DatePickerMenu } from '../datepicker/datepicker-menu';
import { EstimateModal } from './estimate-modal';
import { AssigneeModal, type Assignee } from './assignee-modal';
import { LabelModal, type Label } from './label-modal';
import { AssigneeIcon, CalendarIcon, LabelIcon, PointsIcon } from '../icons/icons';

export interface AddTaskModalProps {
  /** Whether the widget is currently mounted. */
  isOpen: boolean;
  /** Called when the widget should close without submitting (Cancel button). */
  onClose: () => void;
  /** People selectable in the assignee trigger's popover. */
  assignees?: Assignee[];
  /** Labels selectable in the label trigger's popover — see `LabelModal`. */
  labels?: Label[];
  /** Called with the form values when the user submits a valid (non-empty title) task. */
  onSubmit?: (data: {
    title: string;
    dueDate?: Date;
    points?: number;
    assignee?: Assignee;
    label?: Label;
  }) => void;
  /**
   * Pre-fills the title field (edit flow — reopening on an existing task). Uncontrolled:
   * read when the widget opens, then owned by the field until it closes and reopens.
   * @default ''
   */
  defaultTitle?: string;
  /** Pre-fills the due-date trigger (edit flow). Uncontrolled, same as `defaultTitle`. */
  defaultDueDate?: Date;
  /** Pre-fills the estimate trigger (edit flow). Uncontrolled, same as `defaultTitle`. */
  defaultPoints?: number;
  /** Pre-fills the assignee trigger (edit flow). Uncontrolled, same as `defaultTitle`. */
  defaultAssignee?: Assignee;
  /** Pre-fills the label trigger (edit flow). Uncontrolled, same as `defaultTitle`. */
  defaultLabel?: Label;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * AddTaskModal
 *
 * Figma: "Add Task Modal" COMPONENT (`Mockups/Dashboard Add Task/Add Task Modal00-06.md`,
 * cross-checked against the in-context instance in `Components/Task Column01.md`). This is an
 * inline widget (578×184, neutral-3 bg, 8px radius) composited directly into a Task Column, not
 * a centered dialog — no backdrop, no header/close button, so unlike the other modals in this
 * folder it does not use the shared `Modal` shell. Anatomy: a borderless title input (Desktop/
 * Body/XL/bold, 20px, neutral-2 placeholder) and a "Tags" row of 4 trigger chips (Estimate/
 * Assignee/Label/Due date, in that order), and a Cancel/Create Task button pair. Live Figma
 * access (Chunk 25) confirmed the row has exactly one previously-unimplemented trigger — "Label"
 * (icon `remix-icons/fill/finance/price-tag-3-fill`), sitting between Assignee and Due date —
 * correcting the earlier claim of "two remaining ground-truth chip slots... with no legible
 * glyph." Only the trigger's icon/text/position are Figma-confirmed; its popover (`LabelModal`)
 * has no captured anatomy and is an engineering-only addition — see that component's own doc
 * comment.
 *
 * Row 2's unfilled trigger chips render as the real muted "Tag" component (`bg: rgba(148,151,154,.1)`
 * = neutral-2/10%, exactly `Tag`'s solid/neutral style) — confirmed by pixel match. Once a value is
 * picked, the spec drops that background entirely (plain icon+text on the modal's own neutral-3
 * surface); the primary Create button's disabled color (title empty) is `primary-2`, its enabled
 * color is `primary-4` — already exactly `TextButton`'s existing disabled/enabled primary styling
 * (Chunk 4), so `isDisabled={!title.trim()}` reproduces the empty-vs-typed contrast for free.
 *
 * `Mockups/Dashboard Edit Task/Add  Task Modal00.md` (note: source filename has a double
 * space) reuses this exact same "Add Task Modal" component (identical 578×184/neutral-3/8px
 * anatomy) reopened with the Estimate ("0 Points") and Assignee ("Jerome Bell") triggers
 * already filled — confirming Edit is this same widget pre-populated, not a distinct
 * component. `defaultTitle`/`defaultDueDate`/`defaultPoints`/`defaultAssignee`/`defaultLabel`
 * (all optional, defaulting to the prior blank-create behavior) seed the internal state for
 * that reuse — re-read every time the widget is reopened, not only on first mount, because
 * `isOpen` gates rendering below the hooks and therefore never unmounts the state.
 *
 * They were `initial*` until 0.4.0. The kit's prefix for an uncontrolled seed is `default*`
 * everywhere else (`defaultValue`, `defaultSelected`, `defaultSelectedKey`, `defaultOpen`),
 * following React Aria, and one component spelling it differently is a reason to check the
 * source rather than trust the pattern. The semantics are the `default*` ones: read at open,
 * then owned by the field — this widget's open is its mount, since a closed one renders
 * nothing.
 */
export function AddTaskModal({
  isOpen,
  onClose,
  assignees = [],
  labels = [],
  onSubmit,
  defaultTitle = '',
  defaultDueDate,
  defaultPoints,
  defaultAssignee,
  defaultLabel,
  className,
}: AddTaskModalProps) {
  const [title, setTitle] = React.useState(defaultTitle);
  const [dueDate, setDueDate] = React.useState<Date | undefined>(defaultDueDate);
  const [points, setPoints] = React.useState<number | undefined>(defaultPoints);
  const [assignee, setAssignee] = React.useState<Assignee | undefined>(defaultAssignee);
  const [label, setLabel] = React.useState<Label | undefined>(defaultLabel);

  const [openPopover, setOpenPopover] = React.useState<
    'estimate' | 'assignee' | 'label' | 'date' | null
  >(null);
  const togglePopover = (name: 'estimate' | 'assignee' | 'label' | 'date') =>
    setOpenPopover((prev) => (prev === name ? null : name));
  const closePopover = () => setOpenPopover(null);

  const estimateTriggerRef = React.useRef<HTMLButtonElement>(null);
  const assigneeTriggerRef = React.useRef<HTMLButtonElement>(null);
  const labelTriggerRef = React.useRef<HTMLButtonElement>(null);
  const dateTriggerRef = React.useRef<HTMLButtonElement>(null);

  // Puts the fields back to what the props say. `useState` above only reads them on the very
  // first render, and the `isOpen` gate below is a render guard rather than an unmount — the
  // component keeps its state across a close/open cycle — so without this, reopening for a
  // *different* task showed the previous one's values, or nothing at all.
  const seedFromProps = () => {
    setTitle(defaultTitle);
    setDueDate(defaultDueDate);
    setPoints(defaultPoints);
    setAssignee(defaultAssignee);
    setLabel(defaultLabel);
    setOpenPopover(null);
  };

  // Re-seed on the closed -> open edge, during render rather than in an effect: React discards
  // this pass and re-renders with the new state before committing, so the first frame the user
  // sees is already correct. An effect would paint the stale values first.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [wasOpen, setWasOpen] = React.useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) seedFromProps();
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit?.({ title: title.trim(), dueDate, points, assignee, label });
    // Returns to the props' values rather than blanking the form. For the create flow those
    // are empty, so this is the clear it always was; for the edit flow it is the task as it
    // was opened, which is the only defensible reading of "reset" there.
    seedFromProps();
    onClose();
  };

  const handleCancel = () => {
    seedFromProps();
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex flex-col items-end gap-6 w-[578px] p-4 bg-surface-overlay rounded-sm',
        className,
      )}
    >
      <input
        // This widget only mounts in response to an explicit user "add task"
        // action (Chunk 13: borderless inline widget, no dialog wrapper), so
        // moving focus to the title field immediately is the same intentional
        // open-focus pattern as Modal's FocusScope autoFocus above, not the
        // anti-pattern this rule targets.
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task name"
        aria-label="Task name"
        // `placeholder:text-muted-on-dark`, not `placeholder:text-muted`: this modal is
        // `surface-overlay`, where neutral-2 is 3.73:1. axe never flagged it because the
        // story renders the field with a value — a placeholder only exists while empty,
        // which is a general blind spot in a static-story audit and the reason the token
        // test carries this rather than the browser pass.
        className="w-full bg-transparent text-body-xl font-semibold text-main placeholder:text-muted-on-dark font-sans rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
      />

      <div className="flex items-center gap-4 w-full">
        {/* Estimate trigger */}
        <div className="relative">
          {points === undefined ? (
            <button
              ref={estimateTriggerRef}
              type="button"
              onClick={() => togglePopover('estimate')}
              aria-haspopup="dialog"
              aria-expanded={openPopover === 'estimate'}
              className="cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
            >
              <Tag icon={<PointsIcon className="size-6" />}>Estimate</Tag>
            </button>
          ) : (
            <button
              ref={estimateTriggerRef}
              type="button"
              onClick={() => togglePopover('estimate')}
              aria-haspopup="dialog"
              aria-expanded={openPopover === 'estimate'}
              // `hover:text-neutral-5` with the hover fill — white on a solid neutral-2
              // is 2.94:1, and a static story never shows a hover for axe to catch.
              className="flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 hover:text-neutral-5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
            >
              <span className="w-6 h-6 shrink-0">
                <PointsIcon className="size-6" />
              </span>
              {points} Point{points !== 1 ? 's' : ''}
            </button>
          )}
          {openPopover === 'estimate' ? (
            <EstimateModal
              value={points}
              onSelect={(p) => {
                setPoints(p);
                setOpenPopover(null);
              }}
              onClose={closePopover}
              triggerRef={estimateTriggerRef}
              className="absolute top-full left-0 mt-1 z-nested"
            />
          ) : null}
        </div>

        {/* Assignee trigger */}
        <div className="relative">
          {!assignee ? (
            <button
              ref={assigneeTriggerRef}
              type="button"
              onClick={() => togglePopover('assignee')}
              aria-haspopup="dialog"
              aria-expanded={openPopover === 'assignee'}
              className="cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
            >
              <Tag icon={<AssigneeIcon className="size-6" />}>Assignee</Tag>
            </button>
          ) : (
            <button
              ref={assigneeTriggerRef}
              type="button"
              onClick={() => togglePopover('assignee')}
              aria-haspopup="dialog"
              aria-expanded={openPopover === 'assignee'}
              // Same as the estimate trigger above: the label moves with the hover fill.
              className="flex items-center gap-2 h-8 px-2 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 hover:text-neutral-5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
            >
              <Avatar src={assignee.avatarSrc} name={assignee.name} size="sm" />
              {assignee.name}
            </button>
          )}
          {openPopover === 'assignee' ? (
            <AssigneeModal
              assignees={assignees}
              onSelect={(a) => {
                setAssignee(a);
                setOpenPopover(null);
              }}
              onClose={closePopover}
              triggerRef={assigneeTriggerRef}
              className="absolute top-full left-0 mt-1 z-nested"
            />
          ) : null}
        </div>

        {/* Label trigger */}
        <div className="relative">
          {!label ? (
            <button
              ref={labelTriggerRef}
              type="button"
              onClick={() => togglePopover('label')}
              aria-haspopup="dialog"
              aria-expanded={openPopover === 'label'}
              className="cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
            >
              <Tag icon={<LabelIcon className="size-6" />}>Label</Tag>
            </button>
          ) : (
            <button
              ref={labelTriggerRef}
              type="button"
              onClick={() => togglePopover('label')}
              aria-haspopup="dialog"
              aria-expanded={openPopover === 'label'}
              className="cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
            >
              <Tag variant={label.variant ?? 'neutral'}>{label.text}</Tag>
            </button>
          )}
          {openPopover === 'label' ? (
            <LabelModal
              labels={labels}
              onSelect={(l) => {
                setLabel(l);
                setOpenPopover(null);
              }}
              onClose={closePopover}
              triggerRef={labelTriggerRef}
              className="absolute top-full left-0 mt-1 z-nested"
            />
          ) : null}
        </div>

        {/* Due date trigger */}
        <div className="relative">
          <button
            ref={dateTriggerRef}
            type="button"
            onClick={() => togglePopover('date')}
            aria-haspopup="dialog"
            aria-expanded={openPopover === 'date'}
            className="cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
          >
            <Tag icon={<CalendarIcon className="size-6" />}>
              {dueDate ? dueDate.toLocaleDateString('en-US') : 'Due date'}
            </Tag>
          </button>
          {openPopover === 'date' ? (
            <DatePickerMenu
              value={dueDate}
              onChange={(d) => {
                setDueDate(d);
                setOpenPopover(null);
              }}
              onClose={closePopover}
              triggerRef={dateTriggerRef}
              className="absolute top-full left-0 mt-1 z-nested"
            />
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <TextButton variant="secondary" onPress={handleCancel}>
          Cancel
        </TextButton>
        <TextButton variant="primary" type="submit" isDisabled={!title.trim()}>
          Create Task
        </TextButton>
      </div>
    </form>
  );
}
