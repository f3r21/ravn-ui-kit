import { useOverlay, useObjectRef, DismissButton, FocusScope } from 'react-aria';

export interface PopoverProps extends React.ComponentPropsWithRef<'div'> {
  /** Whether the popover is currently open. When `false`, nothing is rendered. */
  isOpen: boolean;
  /** Called when the popover should close — Escape, an outside click, or a `DismissButton`. */
  onClose: () => void;
  /**
   * Ref to the element that toggles this popover open/closed. Clicking it is excluded from
   * "outside interaction" so a toggle-button trigger doesn't immediately reopen the popover it
   * just closed.
   *
   * **The general rule, because this is where people look and the narrow version cost an hour
   * (#82):** react-aria's outside-click handling is a **capture-phase** listener that calls
   * `stopPropagation()` — `useInteractOutside.mjs:54`, `useOverlay.mjs:49`. So a click that
   * dismisses this popover is *consumed*: it never reaches whatever was clicked. Any control
   * that both dismisses an open popover and is meant to do something itself has to be exempted,
   * or its own handler simply never runs and the user has to click twice.
   *
   * `triggerRef` exempts one such control. `dismissExemptRef` below exempts a region of them.
   */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /**
   * A region that does not count as "outside" for dismissal, beyond `triggerRef` itself — for a
   * group of sibling triggers that share one popover slot (#82).
   *
   * The reason is the same one `triggerRef` exists for, one step wider. Outside-click handling
   * runs in the capture phase and **consumes the click**, so with only the popover's own trigger
   * exempt, clicking a *sibling* trigger dismisses the open popover and that click never reaches
   * the sibling. The user sees the first click do nothing and has to click again.
   *
   * Exempting the whole group makes switching purely state-driven: the sibling's `onClick` runs,
   * selects itself, and the previously-open popover unmounts because its `isOpen` went false.
   * Clicking genuinely outside the group still dismisses normally.
   */
  dismissExemptRef?: React.RefObject<HTMLElement | null>;
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
 * plain `<div>` with no `useOverlay`, `FocusScope`, dismissal, or role at
 * all. Those four all anchor to a trigger via plain CSS (`absolute`
 * positioning inside a `relative` wrapper, set by the caller's `className`),
 * not a portal — so this primitive is built on
 * react-aria's `useOverlay` + `DismissButton` + `FocusScope` directly rather
 * than `usePopover` (which adds portalling via `Overlay` and floating-ui-style
 * anchored positioning these four don't need). The heavier `usePopover`-based
 * version, for consumers that *do* need real anchor positioning and escape
 * from a clipping ancestor, is this kit's own `FloatingPopover` — see
 * `./floating-popover.tsx` for why the two are separate primitives rather
 * than one component behind an `isPortalled` flag.
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
  dismissExemptRef,
  children,
  className,
  ref: forwardedRef,
  ...ariaProps
}: PopoverProps) {
  // Merged with the external ref via `useObjectRef` (#11) — `useOverlay` needs this same
  // node for its own positioning/dismissal logic, the same pattern `Button` and `Modal` use.
  const overlayRef = useObjectRef(forwardedRef);

  const { overlayProps } = useOverlay(
    {
      isOpen,
      onClose,
      isDismissable: true,
      shouldCloseOnInteractOutside: (element) =>
        !triggerRef?.current?.contains(element) && !dismissExemptRef?.current?.contains(element),
    },
    overlayRef,
  );

  if (!isOpen) return null;

  // react-aria's FocusScope `autoFocus` is the WAI-ARIA popup focus-management
  // pattern (move focus into the popover on open, restore it on close), not
  // the raw DOM autofocus anti-pattern this rule targets. Same justification
  // as Modal.
  return (
    // eslint-disable-next-line jsx-a11y/no-autofocus
    <FocusScope restoreFocus autoFocus>
      {/* Always `'dialog'` (#14 removed the prop — a single-member union cannot vary, so it
          was never a real prop). Fits every current consumer: `DatePickerMenu` (a calendar
          grid — `role="grid"` — inside a dialog popover, the same composition a native date
          input's popup uses) and the `Assignee`/`Estimate`/`Label` pick-one-option lists,
          none of which implement full `listbox`/`option` semantics (roving tabindex,
          `aria-selected`) yet — that is the `ListBox`/`Select`/`MultiSelect` family, which
          exists in this kit and is out of scope for this shell. `'dialog'` is the honest role
          for "a floating region with interactive content and no listbox wiring," not a
          placeholder for one. */}
      <div {...overlayProps} {...ariaProps} ref={overlayRef} role="dialog" className={className}>
        <DismissButton onDismiss={onClose} />
        {children}
        <DismissButton onDismiss={onClose} />
      </div>
    </FocusScope>
  );
}
