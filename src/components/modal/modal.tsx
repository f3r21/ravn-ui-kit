import React, { useRef } from 'react';
import { useDialog, useOverlay, FocusScope } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import { cn } from '../../utils/cn';

// ─── Shared Modal Shell ───────────────────────────────────────────

export interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Width class — defaults to max-w-md */
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
      <FocusScope contain restoreFocus autoFocus>
        <div
          {...overlayProps}
          ref={overlayRef}
          className={cn('w-full', width)}
        >
          <div
            {...dialogProps}
            ref={dialogRef}
            className="flex flex-col bg-neutral-4 rounded-2xl shadow-2xl border border-neutral-3/30 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-3/30">
              <h2
                {...titleProps}
                className="font-sans font-bold text-base text-neutral-1"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar modal"
                className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-2 hover:bg-neutral-3 hover:text-neutral-1 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
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
