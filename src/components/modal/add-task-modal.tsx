import React from 'react';
import { cn } from '../../utils/cn';
import { TextButton } from '../button/text-button';
import { Tag } from '../tag/tag';
import { Avatar } from '../avatar/avatar';
import { DatePickerMenu } from '../datepicker/datepicker-menu';
import { EstimateModal } from './estimate-modal';
import { AssigneeModal, type Assignee } from './assignee-modal';

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

export interface AddTaskModalProps {
  /** Whether the widget is currently mounted. */
  isOpen: boolean;
  /** Called when the widget should close without submitting (Cancel button). */
  onClose: () => void;
  /** People selectable in the assignee trigger's popover. */
  assignees?: Assignee[];
  /** Called with the form values when the user submits a valid (non-empty title) task. */
  onSubmit?: (data: { title: string; dueDate?: Date; points?: number; assignee?: Assignee }) => void;
  /** Pre-fills the title field (edit flow — reopening on an existing task). */
  initialTitle?: string;
  /** Pre-fills the due-date trigger (edit flow). */
  initialDueDate?: Date;
  /** Pre-fills the estimate trigger (edit flow). */
  initialPoints?: number;
  /** Pre-fills the assignee trigger (edit flow). */
  initialAssignee?: Assignee;
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
 * Body/XL/bold, 20px, neutral-2 placeholder), a "Tags" row of trigger chips (Estimate/Assignee/
 * Due date), and a Cancel/Create Task button pair. The two remaining ground-truth chip slots in
 * that row (fixed ~40px/~65px label widths, never shown filled in any of the 7 export snapshots)
 * have no legible glyph or contradiction-free semantic — left unimplemented rather than guessed
 * at, consistent with the Chunk 11 "Reactions" 3rd-slot precedent.
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
  onSubmit,
  initialTitle = '',
  initialDueDate,
  initialPoints,
  initialAssignee,
  className,
}: AddTaskModalProps) {
  const [title, setTitle] = React.useState(initialTitle);
  const [dueDate, setDueDate] = React.useState<Date | undefined>(initialDueDate);
  const [points, setPoints] = React.useState<number | undefined>(initialPoints);
  const [assignee, setAssignee] = React.useState<Assignee | undefined>(initialAssignee);

  const [openPopover, setOpenPopover] = React.useState<'estimate' | 'assignee' | 'date' | null>(null);
  const togglePopover = (name: 'estimate' | 'assignee' | 'date') =>
    setOpenPopover(prev => (prev === name ? null : name));

  if (!isOpen) return null;

  const reset = () => {
    setTitle('');
    setDueDate(undefined);
    setPoints(undefined);
    setAssignee(undefined);
    setOpenPopover(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit?.({ title: title.trim(), dueDate, points, assignee });
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
        'flex flex-col items-end gap-6 w-[578px] p-4 bg-neutral-3 rounded-sm',
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
        className="w-full bg-transparent text-body-xl font-semibold text-neutral-1 placeholder:text-neutral-2 font-sans outline-none"
      />

      <div className="flex items-center gap-4 w-full">
        {/* Estimate trigger */}
        <div className="relative">
          {points === undefined ? (
            <button
              type="button"
              onClick={() => togglePopover('estimate')}
              className="cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
            >
              <Tag icon={<PointsIcon />}>Estimate</Tag>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => togglePopover('estimate')}
              className="flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-neutral-1 font-sans hover:bg-neutral-2 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
            >
              <span className="w-6 h-6 shrink-0"><PointsIcon /></span>
              {points} Point{points !== 1 ? 's' : ''}
            </button>
          )}
          {openPopover === 'estimate' ? (
            <EstimateModal
              value={points}
              onSelect={p => { setPoints(p); setOpenPopover(null); }}
              className="absolute top-full left-0 mt-1 z-10"
            />
          ) : null}
        </div>

        {/* Assignee trigger */}
        <div className="relative">
          {!assignee ? (
            <button
              type="button"
              onClick={() => togglePopover('assignee')}
              className="cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
            >
              <Tag icon={<PersonIcon />}>Assignee</Tag>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => togglePopover('assignee')}
              className="flex items-center gap-2 h-8 px-2 rounded-xs text-body-m font-normal text-neutral-1 font-sans hover:bg-neutral-2 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
            >
              <Avatar src={assignee.avatarSrc} name={assignee.name} size="sm" />
              {assignee.name}
            </button>
          )}
          {openPopover === 'assignee' ? (
            <AssigneeModal
              assignees={assignees}
              onSelect={a => { setAssignee(a); setOpenPopover(null); }}
              className="absolute top-full left-0 mt-1 z-10"
            />
          ) : null}
        </div>

        {/* Due date trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => togglePopover('date')}
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
