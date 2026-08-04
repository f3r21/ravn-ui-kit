import React, { useRef } from 'react';
import { useDialog, useOverlay, FocusScope } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import { cn } from '../../utils/cn';

// ─── Shared Modal Shell ───────────────────────────────────────────

export interface ModalProps {
  /** Dialog heading, rendered in the header and programmatically associated via `aria-labelledby`. */
  title: string;
  /** Whether the modal is currently open. When `false`, nothing is rendered. */
  isOpen: boolean;
  /** Called when the modal should close — backdrop click, Escape key, or the header close button. */
  onClose: () => void;
  /** Modal body content. */
  children: React.ReactNode;
  /**
   * Tailwind max-width class controlling the dialog's width.
   * @default 'max-w-md'
   */
  width?: string;
}

/**
 * Modal shell used by all modal variants.
 * Uses react-aria useDialog + useOverlay for accessibility.
 */
export function Modal({ title, isOpen, onClose, children, width = 'max-w-md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const { overlayProps, underlayProps } = useOverlay(
    { isOpen, onClose, isDismissable: true },
    overlayRef
  );
  const { dialogProps, titleProps } = useDialog({}, dialogRef);

  if (!isOpen) return null;

  return (
    <div
      {...underlayProps}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      {/* eslint-disable-next-line jsx-a11y/no-autofocus -- react-aria's FocusScope
          `autoFocus` is the WAI-ARIA dialog focus-management pattern (move focus
          into the dialog on open, restore it on close), not the raw DOM
          autofocus anti-pattern this rule targets. */}
      <FocusScope contain restoreFocus autoFocus>
        <div
          {...overlayProps}
          ref={overlayRef}
          className={cn('w-full', width)}
        >
          <div
            {...dialogProps}
            ref={dialogRef}
            className="flex flex-col bg-neutral-3 rounded-sm border border-neutral-2 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-4">
              <h2
                {...titleProps}
                className="font-sans font-bold text-base text-neutral-1"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-2 hover:bg-neutral-4 hover:text-neutral-1 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-4">
              {children}
            </div>
          </div>
        </div>
      </FocusScope>
    </div>
  );
}

// ─── useModal hook ────────────────────────────────────────────────

/** Convenience hook for uncontrolled modal open/close state */
export function useModal(defaultOpen = false) {
  const state = useOverlayTriggerState({ defaultOpen });
  return {
    isOpen: state.isOpen,
    open: state.open,
    close: state.close,
    toggle: state.toggle,
  };
}
