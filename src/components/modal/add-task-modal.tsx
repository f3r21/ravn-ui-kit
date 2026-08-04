import React from 'react';
import { Modal } from './modal';
import { Input } from '../input/input';
import { Button } from '../button/button';
import { TextButton } from '../button/text-button';
import { Tag } from '../tag/tag';
import { DatePickerMenu } from '../datepicker/datepicker-menu';

export interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { title: string; description?: string; dueDate?: Date }) => void;
}

/**
 * AddTaskModal
 *
 * Figma: "Add Task Modal" COMPONENT inside "Task Column" frame.
 */
export function AddTaskModal({ isOpen, onClose, onSubmit }: AddTaskModalProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState<Date | undefined>();
  const [showCalendar, setShowCalendar] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit?.({ title: title.trim(), description: description.trim() || undefined, dueDate });
    setTitle('');
    setDescription('');
    setDueDate(undefined);
    onClose();
  };

  return (
    <Modal title="Add Task" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Task name"
          placeholder="Enter task title..."
          value={title}
          onChange={setTitle}
        />
        <Input
          label="Description"
          placeholder="Add a description..."
          value={description}
          onChange={setDescription}
        />

        {/* Due date */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-neutral-3 uppercase tracking-wider font-sans">
            Due date
          </span>
          <button
            type="button"
            onClick={() => setShowCalendar(v => !v)}
            className="h-10 px-3 text-sm text-left bg-neutral-1 text-neutral-5 border border-neutral-2 rounded-md font-sans hover:border-neutral-3 transition-colors cursor-pointer"
          >
            {dueDate ? dueDate.toLocaleDateString('es-MX') : 'Select a date...'}
          </button>
          {showCalendar ? (
            <DatePickerMenu
              value={dueDate}
              onChange={(d) => { setDueDate(d); setShowCalendar(false); }}
              className="mt-1"
            />
          ) : null}
        </div>

        {/* Tags preview */}
        <div className="flex gap-2 flex-wrap">
          <Tag variant="secondary">BACKEND</Tag>
          <Tag variant="tertiary">HIGH</Tag>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-3/30">
          <TextButton onPress={onClose}>Cancel</TextButton>
          <Button variant="primary" type="submit" isDisabled={!title.trim()}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
