import React from 'react';
import { Modal } from './modal';
import { UserRow } from '../avatar/user-row';
import { Button } from '../button/button';
import { TextButton } from '../button/text-button';
import { cn } from '../../utils/cn';

export interface Assignee {
  /** Unique identifier, echoed back in `onConfirm`/`selectedIds`. */
  id: string;
  /** Display name shown in the row. */
  name: string;
  /** Optional secondary text (job title/role) shown under the name. */
  role?: string;
  /** Optional avatar image URL; falls back to initials when omitted. */
  avatarSrc?: string;
}

export interface AssigneeModalProps {
  /** Whether the modal is currently open. */
  isOpen: boolean;
  /** Called when the modal should close without confirming. */
  onClose: () => void;
  /** Full list of assignable people shown as selectable rows. */
  assignees: Assignee[];
  /** Controlled set of selected assignee ids. Omit for uncontrolled internal state. */
  selectedIds?: string[];
  /** Called with the final selected ids when the user confirms. */
  onConfirm?: (selectedIds: string[]) => void;
}

/**
 * AssigneeModal
 *
 * Figma: "Assignee Modal" COMPONENT_SET inside "Task Column" frame.
 */
export function AssigneeModal({
  isOpen,
  onClose,
  assignees,
  selectedIds: controlledIds,
  onConfirm,
}: AssigneeModalProps) {
  const [internalIds, setInternalIds] = React.useState<string[]>(controlledIds ?? []);
  const isControlled = controlledIds !== undefined;
  const selected = isControlled ? controlledIds : internalIds;

  const toggle = (id: string) => {
    if (isControlled) return;
    setInternalIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onConfirm?.(selected);
    onClose();
  };

  return (
    <Modal title="Assign to" isOpen={isOpen} onClose={onClose} width="max-w-sm">
      <div className="flex flex-col gap-2">
        {assignees.map(a => {
          const isSelected = selected.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => toggle(a.id)}
              className={cn(
                'flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors cursor-pointer',
                isSelected
                  ? 'bg-primary-4/15 border border-primary-4/40'
                  : 'hover:bg-neutral-3/50 border border-transparent'
              )}
            >
              <UserRow name={a.name} role={a.role} avatarSrc={a.avatarSrc} size="sm" />
              {isSelected ? (
                <svg className="w-4 h-4 text-primary-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-neutral-3/30">
        <TextButton onPress={onClose}>Cancel</TextButton>
        <Button variant="primary" onPress={handleConfirm}>
          Confirm ({selected.length})
        </Button>
      </div>
    </Modal>
  );
}
