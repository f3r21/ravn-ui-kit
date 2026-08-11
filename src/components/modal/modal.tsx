import React, { useRef } from 'react';
import { useDialog, useModalOverlay, FocusScope } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import { cn } from '../../utils/cn';
import { CloseIcon } from '../icons/icons';

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
   * Additional class names, merged last via `cn()` so they can override defaults — including
   * the dialog's default `max-w-md` width.
   *
   * Replaces `width?: string` (#14) — that prop was typed as a raw string standing in for "a
   * Tailwind max-width class," so `width="400px"` typechecked and silently did nothing.
   * **This kit's own callers never passed it**, but the consuming app has two real ones —
   * `task-form-dialog.tsx:158` and `delete-task-dialog.tsx:96`, both `width="max-w-[578px]"`
   * — caught in review, not by the original claim, which said "no caller, kit or app" and
   * was wrong about the app half. Pass `className="max-w-[578px]"` in their place; behavior
   * is unchanged, only the prop name is. Tracked as an app-side follow-up alongside this
   * PR's other renamed props.
   */
  className?: string;
  /**
   * ARIA role for the dialog. Use `'alertdialog'` for a destructive-action
   * confirmation (e.g. a delete confirmation) — it tells assistive tech
   * this dialog demands an immediate response, distinct from an ordinary
   * `'dialog'`.
   * @default 'dialog'
   */
  role?: 'dialog' | 'alertdialog';
  /**
   * Whether Escape and a click on the backdrop close the modal. Set `false` while an operation
   * is in flight — a delete that is already running should not be dismissable half-way through.
   *
   * Gating `onClose` yourself is **not** equivalent: Escape, the backdrop and the close button
   * all still fire it, so the caller has to defend every path instead of one.
   * @default true
   */
  isDismissable?: boolean;
  /**
   * Accessible name for the header's close button.
   *
   * Unlike the kit's other name overrides this one is not about collisions — a modal is
   * modal, so only one is ever in the accessibility tree. It exists because the string was
   * English and unreachable, which made the shell untranslatable for a consumer whose app
   * is not. `title` above is already the consumer's; this is the last string in the shell
   * that was not.
   * @default 'Close modal'
   */
  closeLabel?: string;
}

/**
 * Modal shell used by all modal variants.
 * Uses react-aria's useModalOverlay (composed of useOverlay + usePreventScroll +
 * aria-hide) so that, while open, body scroll is locked and everything outside
 * the dialog is `inert`/`aria-hidden` to assistive tech — not just visually
 * obscured behind the backdrop.
 */
export function Modal({
  title,
  isOpen,
  onClose,
  children,
  className,
  role = 'dialog',
  isDismissable = true,
  closeLabel = 'Close modal',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // useModalOverlay takes a react-stately OverlayTriggerState rather than a
  // bare isOpen/onClose pair; this mirrors this (controlled) Modal's props
  // into that shape instead of changing Modal's public API.
  const triggerState = useOverlayTriggerState({
    isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });

  // One prop drives two react-aria options on purpose. `isDismissable` governs the *backdrop*
  // click only; Escape is a separate switch (`isKeyboardDismissDisabled`), so passing
  // `isDismissable` through alone leaves Escape closing a modal the consumer asked to pin —
  // which is precisely the case this exists for, a delete already in flight. Caught by the test
  // below rather than by reading the types, since both spellings typecheck.
  const { modalProps, underlayProps } = useModalOverlay(
    { isDismissable, isKeyboardDismissDisabled: !isDismissable },
    triggerState,
    overlayRef,
  );
  // `contentProps` is the third thing `useDialog` returns and dropping it is not cosmetic (#64).
  // For `role="alertdialog"` React Aria generates an id, points `aria-describedby` at it, and
  // then discards the id in a layout effect (`useSlotId`) when nothing carries it — so the role
  // is announced and the body text that is the entire reason for choosing that role is not.
  const { dialogProps, titleProps, contentProps } = useDialog({ role }, dialogRef);

  if (!isOpen) return null;

  return (
    <div
      {...underlayProps}
      className="fixed inset-0 z-overlay flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      {/* eslint-disable-next-line jsx-a11y/no-autofocus -- react-aria's FocusScope
          `autoFocus` is the WAI-ARIA dialog focus-management pattern (move focus
          into the dialog on open, restore it on close), not the raw DOM
          autofocus anti-pattern this rule targets. */}
      <FocusScope contain restoreFocus autoFocus>
        <div {...modalProps} ref={overlayRef} className={cn('w-full max-w-md', className)}>
          <div
            {...dialogProps}
            ref={dialogRef}
            className="flex flex-col bg-surface-overlay rounded-sm border border-subtle overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-4">
              <h2 {...titleProps} className="font-sans font-bold text-base text-main">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                className="flex items-center justify-center w-8 h-8 rounded-md text-muted hover:bg-neutral-4 hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Body. `contentProps` belongs here rather than on the dialog: it carries the id
                `aria-describedby` points at, so it has to wrap the content that IS the
                description — not the header, and not the whole dialog including its own title. */}
            <div {...contentProps} className="px-4 py-4">
              {children}
            </div>
          </div>
        </div>
      </FocusScope>
    </div>
  );
}

// ─── useModalState hook ───────────────────────────────────────────

/**
 * Convenience hook for uncontrolled modal open/close state.
 * Named `useModalState` (not `useModal`) to avoid shadowing react-aria's own
 * `useModal` hook now that `useModalOverlay` (which composes it) is used above.
 */
export function useModalState(defaultOpen = false) {
  const state = useOverlayTriggerState({ defaultOpen });
  return {
    isOpen: state.isOpen,
    open: state.open,
    close: state.close,
    toggle: state.toggle,
  };
}
