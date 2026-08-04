import React from 'react';
import { Modal } from './modal';
import { Button } from '../button/button';
import { TextButton } from '../button/text-button';
import { cn } from '../../utils/cn';

// Figma shows: 0, 1, 2, 3, 5, 8, 13, 21 (Fibonacci sequence)
const POINT_OPTIONS = [0, 1, 2, 3, 5, 8, 13, 21];

export interface EstimatePointsProps {
  /** Currently selected point value, if any. */
  selected?: number;
  /** Called with the newly selected point value when the user picks a pill. */
  onChange?: (points: number) => void;
  className?: string;
}

/**
 * EstimatePoints
 *
 * Figma: "Estimate Points" COMPONENT_SET inside "Task Column" frame.
 * Fibonacci point selector pill group used inside EstimateModal.
 */
export function EstimatePoints({ selected, onChange, className }: EstimatePointsProps) {
  return (
    <div
      role="group"
      aria-label="Puntos de estimación"
      className={cn('flex flex-wrap gap-2', className)}
    >
      {POINT_OPTIONS.map(pts => {
        const isSelected = selected === pts;
        return (
          <button
            key={pts}
            type="button"
            onClick={() => onChange?.(pts)}
            aria-pressed={isSelected}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold font-sans transition-all cursor-pointer select-none',
              isSelected
                ? 'bg-primary-4 text-neutral-1 scale-110'
                : 'bg-neutral-3 text-neutral-2 hover:bg-neutral-3/80 hover:text-neutral-1'
            )}
          >
            {pts}
          </button>
        );
      })}
    </div>
  );
}

// ─── EstimateModal ────────────────────────────────────────────────

export interface EstimateModalProps {
  /** Whether the modal is currently open. */
  isOpen: boolean;
  /** Called when the modal should close without confirming. */
  onClose: () => void;
  /**
   * Point value to pre-select when opened.
   * @default 0
   */
  currentPoints?: number;
  /** Called with the confirmed point value. */
  onConfirm?: (points: number) => void;
}

/**
 * EstimateModal
 *
 * Figma: "Estimate Modal" COMPONENT inside "Task Column" frame.
 * Shows EstimatePoints selector in a modal for the user to pick story points.
 */
export function EstimateModal({ isOpen, onClose, currentPoints, onConfirm }: EstimateModalProps) {
  const [points, setPoints] = React.useState<number>(currentPoints ?? 0);

  const handleConfirm = () => {
    onConfirm?.(points);
    onClose();
  };

  return (
    <Modal title="Estimate" isOpen={isOpen} onClose={onClose} width="max-w-sm">
      <div className="flex flex-col gap-5">
        <p className="text-sm text-neutral-2 font-sans">
          Select story points for this task using the Fibonacci scale.
        </p>
        <EstimatePoints selected={points} onChange={setPoints} />
        <div className="flex items-center justify-end gap-6 pt-2">
          <TextButton onPress={onClose}>Cancel</TextButton>
          <Button variant="primary" onPress={handleConfirm}>
            Set {points} point{points !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
