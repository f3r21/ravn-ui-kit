import React from 'react';
import { cn } from '../../utils/cn';
import { TextButton } from '../button/text-button';
import { Tag } from '../tag/tag';
import { Avatar } from '../avatar/avatar';
import { DatePickerMenu } from '../datepicker/datepicker-menu';
import { EstimateModal } from './estimate-modal';
import { AssigneeModal, type Assignee } from './assignee-modal';
import { LabelModal, type Label } from './label-modal';

const PointsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden>
    <path d="M6 21V4a1 1 0 0 1 1-1h10.5a1 1 0 0 1 .8 1.6L15 9l3.3 4.4a1 1 0 0 1-.8 1.6H7" />
  </svg>
);

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

// remix-icons/fill/finance/price-tag-3-fill — the real icon for the Label trigger below.
const PriceTagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden>
    <path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l7.17-7.17a2 2 0 0 0 0-2.82z" />
    <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

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
  onSubmit?: (data: { title: string; dueDate?: Date; points?: number; assignee?: Assignee; label?: Label }) => void;
  /** Pre-fills the title field (edit flow — reopening on an existing task). */
  initialTitle?: string;
  /** Pre-fills the due-date trigger (edit flow). */
  initialDueDate?: Date;
  /** Pre-fills the estimate trigger (edit flow). */
  initialPoints?: number;
  /** Pre-fills the assignee trigger (edit flow). */
  initialAssignee?: Assignee;
  /** Pre-fills the label trigger (edit flow). */
  initialLabel?: Label;
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
 * component. `initialTitle`/`initialDueDate`/`initialPoints`/`initialAssignee` (all optional,
 * defaulting to the prior blank-create behavior) seed the internal state for that reuse.
 */
export function AddTaskModal({
  isOpen,
  onClose,
  assignees = [],
  labels = [],
  onSubmit,
  initialTitle = '',
  initialDueDate,
  initialPoints,
  initialAssignee,
  initialLabel,
  className,
}: AddTaskModalProps) {
  const [title, setTitle] = React.useState(initialTitle);
  const [dueDate, setDueDate] = React.useState<Date | undefined>(initialDueDate);
  const [points, setPoints] = React.useState<number | undefined>(initialPoints);
  const [assignee, setAssignee] = React.useState<Assignee | undefined>(initialAssignee);
  const [label, setLabel] = React.useState<Label | undefined>(initialLabel);

  const [openPopover, setOpenPopover] = React.useState<'estimate' | 'assignee' | 'label' | 'date' | null>(null);
  const togglePopover = (name: 'estimate' | 'assignee' | 'label' | 'date') =>
    setOpenPopover(prev => (prev === name ? null : name));
  const closePopover = () => setOpenPopover(null);

  const estimateTriggerRef = React.useRef<HTMLButtonElement>(null);
  const assigneeTriggerRef = React.useRef<HTMLButtonElement>(null);
  const labelTriggerRef = React.useRef<HTMLButtonElement>(null);
  const dateTriggerRef = React.useRef<HTMLButtonElement>(null);

  if (!isOpen) return null;

  const reset = () => {
    setTitle('');
    setDueDate(undefined);
    setPoints(undefined);
    setAssignee(undefined);
    setLabel(undefined);
    setOpenPopover(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit?.({ title: title.trim(), dueDate, points, assignee, label });
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex flex-col items-end gap-6 w-[578px] p-4 bg-surface-overlay rounded-sm',
        className
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
        onChange={e => setTitle(e.target.value)}
        placeholder="Task name"
        aria-label="Task name"
        className="w-full bg-transparent text-body-xl font-semibold text-main placeholder:text-muted font-sans outline-none"
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
              className="cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
            >
              <Tag icon={<PointsIcon />}>Estimate</Tag>
            </button>
          ) : (
            <button
              ref={estimateTriggerRef}
              type="button"
              onClick={() => togglePopover('estimate')}
              aria-haspopup="dialog"
              aria-expanded={openPopover === 'estimate'}
              className="flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
            >
              <span className="w-6 h-6 shrink-0"><PointsIcon /></span>
              {points} Point{points !== 1 ? 's' : ''}
            </button>
          )}
          {openPopover === 'estimate' ? (
            <EstimateModal
              value={points}
              onSelect={p => { setPoints(p); setOpenPopover(null); }}
              onClose={closePopover}
              triggerRef={estimateTriggerRef}
              className="absolute top-full left-0 mt-1 z-10"
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
              className="cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
            >
              <Tag icon={<PersonIcon />}>Assignee</Tag>
            </button>
          ) : (
            <button
              ref={assigneeTriggerRef}
              type="button"
              onClick={() => togglePopover('assignee')}
              aria-haspopup="dialog"
              aria-expanded={openPopover === 'assignee'}
              className="flex items-center gap-2 h-8 px-2 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
            >
              <Avatar src={assignee.avatarSrc} name={assignee.name} size="sm" />
              {assignee.name}
            </button>
          )}
          {openPopover === 'assignee' ? (
            <AssigneeModal
              assignees={assignees}
              onSelect={a => { setAssignee(a); setOpenPopover(null); }}
              onClose={closePopover}
              triggerRef={assigneeTriggerRef}
              className="absolute top-full left-0 mt-1 z-10"
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
              className="cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
            >
              <Tag icon={<PriceTagIcon />}>Label</Tag>
            </button>
          ) : (
            <button
              ref={labelTriggerRef}
              type="button"
              onClick={() => togglePopover('label')}
              aria-haspopup="dialog"
              aria-expanded={openPopover === 'label'}
              className="cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
            >
              <Tag variant={label.variant ?? 'neutral'}>{label.text}</Tag>
            </button>
          )}
          {openPopover === 'label' ? (
            <LabelModal
              labels={labels}
              onSelect={l => { setLabel(l); setOpenPopover(null); }}
              onClose={closePopover}
              triggerRef={labelTriggerRef}
              className="absolute top-full left-0 mt-1 z-10"
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
            className="cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
          >
            <Tag icon={<CalendarIcon />}>
              {dueDate ? dueDate.toLocaleDateString('en-US') : 'Due date'}
            </Tag>
          </button>
          {openPopover === 'date' ? (
            <DatePickerMenu
              value={dueDate}
              onChange={d => { setDueDate(d); setOpenPopover(null); }}
              onClose={closePopover}
              triggerRef={dateTriggerRef}
              className="absolute top-full left-0 mt-1 z-10"
            />
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <TextButton variant="secondary" onPress={handleCancel}>Cancel</TextButton>
        <TextButton variant="primary" type="submit" isDisabled={!title.trim()}>
          Create Task
        </TextButton>
      </div>
    </form>
  );
}
