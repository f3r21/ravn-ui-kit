import React, { useRef } from 'react';
import { useOverlay, DismissButton, FocusScope } from 'react-aria';

export interface PopoverProps {
  /** Whether the popover is currently open. When `false`, nothing is rendered. */
  isOpen: boolean;
  /** Called when the popover should close — Escape, an outside click, or a `DismissButton`. */
  onClose: () => void;
  /**
   * Ref to the element that toggles this popover open/closed. Clicking it is
   * excluded from "outside interaction" so a toggle-button trigger doesn't
   * immediately reopen the popover it just closed (react-aria's outside-click
   * handling runs in the click event's capture phase, before the trigger's
   * own `onClick` fires).
   */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /**
   * ARIA role for the popover surface. `'dialog'` fits every current consumer:
   * `DatePickerMenu` (a calendar grid — `role="grid"` — inside a dialog
   * popover, the same composition a native date input's popup uses) and the
   * `Assignee`/`Estimate`/`Label` pick-one-option lists, none of which
   * implement full `listbox`/`option` semantics (roving tabindex,
   * `aria-selected`) yet — that's the bigger `ListBox`/`Select` family
   * tracked separately in `MIGRATION_GAPS.md` Section 4, out of scope here.
   * `'dialog'` is the honest role for "a floating region with interactive
   * content and no listbox wiring," not a placeholder for one.
   * @default 'dialog'
   */
  role?: 'dialog';
  /** Accessible name for the popover surface, read by screen readers on open. */
  'aria-label'?: string;
  children: React.ReactNode;
  /** Additional class names controlling the popover surface's position/size/appearance. */
  className?: string;
}

/**
 * Popover
 *
 * The shared floating-surface shell behind `DatePickerMenu`, `AssigneeModal`,
 * `EstimateModal`, and `LabelModal` — previously each was an independent
 * plain `<div>` with no `useOverlay`, `FocusScope`, dismissal, or role at all
 * (see `MIGRATION_GAPS.md` Section 2). Those four all anchor to a trigger via
 * plain CSS (`absolute` positioning inside a `relative` wrapper, set by the
 * caller's `className`), not a portal — so this primitive is built on
 * react-aria's `useOverlay` + `DismissButton` + `FocusScope` directly rather
 * than `usePopover` (which adds portalling via `Overlay` and floating-ui-style
 * anchored positioning neither this kit nor its current consumer needs yet;
 * see `ravn-task-management-challenge/src/ui/select/popover.tsx` for what
 * that heavier version looks like when a future headless `Select`/`ListBox`
 * family — Section 4 — needs real anchor positioning and viewport clipping
 * escape).
 *
 * Non-modal by design: `FocusScope` here moves focus in on open and restores
 * it on close, but does not `contain` — Tab can move past the popover to the
 * next element on the page, same as a native `<select>` dropdown. The two
 * `DismissButton`s are visually-hidden bookend controls so an assistive-tech
 * user tabbing (or swiping, on a screen reader) past either end of the
 * content has an explicit way to close the popover, rather than needing to
 * know Escape or find the trigger again.
 */
export function Popover({
  isOpen,
  onClose,
  triggerRef,
  role = 'dialog',
  children,
  className,
  ...ariaProps
}: PopoverProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const { overlayProps } = useOverlay(
    {
      isOpen,
      onClose,
      isDismissable: true,
      shouldCloseOnInteractOutside: (element) => !triggerRef?.current?.contains(element),
    },
    overlayRef
  );

  if (!isOpen) return null;

  // react-aria's FocusScope `autoFocus` is the WAI-ARIA popup focus-management
  // pattern (move focus into the popover on open, restore it on close), not
  // the raw DOM autofocus anti-pattern this rule targets. Same justification
  // as Modal.
  return (
    // eslint-disable-next-line jsx-a11y/no-autofocus
    <FocusScope restoreFocus autoFocus>
      <div
        {...overlayProps}
        {...ariaProps}
        ref={overlayRef}
        role={role}
        className={className}
      >
        <DismissButton onDismiss={onClose} />
        {children}
        <DismissButton onDismiss={onClose} />
      </div>
    </FocusScope>
  );
}
