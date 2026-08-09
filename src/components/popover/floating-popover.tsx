import { useRef } from 'react';
import { DismissButton, FocusScope, Overlay, usePopover, type AriaPopoverProps } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';
import { cn } from '../../utils/cn';

export interface FloatingPopoverProps extends Omit<AriaPopoverProps, 'popoverRef'> {
  /**
   * react-stately overlay-trigger state driving open/close (from
   * `useSelectState`/`useOverlayTriggerState`) — `usePopover` reads/closes
   * through this rather than a bare `isOpen`/`onClose` pair.
   */
  state: OverlayTriggerState;
  children: React.ReactNode;
  /** Ref to the popover element. Provide only if a caller needs to measure/observe it directly. */
  popoverRef?: React.RefObject<HTMLDivElement | null>;
  /** Additional class names applied to the popover surface, merged last via `cn()`. */
  className?: string;
}

/**
 * FloatingPopover
 *
 * A second, deliberately separate popover primitive from `./popover.tsx`'s
 * `Popover` — not a mode flag on it. `Popover` is explicitly non-portalled
 * and CSS-anchored (`absolute` inside a `relative` wrapper), which is the
 * right shape for the
 * modal-shaped popovers it serves (`AssigneeModal`/`EstimateModal`/
 * `LabelModal`/`DatePickerMenu`) but the wrong shape for a dropdown: those
 * anchor inside layout contexts (a filter bar, a table cell) that routinely
 * clip `overflow: hidden`, and CSS `absolute` positioning can't escape that
 * ancestor no matter how the z-index is tuned. `Select`/`MultiSelect` need
 * real anchored-floating positioning that survives being clipped —
 * react-aria's `usePopover` + `Overlay` (portal to `document.body`, flip when
 * there's no room, track the trigger's position) — which is a different
 * enough contract (portalled vs. not, position-tracking vs. not) that
 * overloading `Popover` with an `isPortalled` flag would leave every consumer
 * of that component branching on a mode instead of picking the primitive
 * that already matches their layout.
 *
 * The two `DismissButton`s are visually-hidden bookend controls giving
 * assistive-tech users an explicit way to close the popover from either end
 * of its content, matching `Popover`'s reasoning.
 *
 * Wrapped in `FocusScope restoreFocus` (no `autoFocus` here, unlike
 * `Popover`'s — initial focus placement is left to whichever composing
 * component renders inside, e.g. `ListBox`/`MenuList`'s own `autoFocus`)
 * so closing returns focus to the trigger that opened it, matching
 * `Popover`'s same restoration for the non-portalled family. Without it,
 * closing removes the focused option/item from the DOM and the browser
 * drops focus to `<body>` instead.
 *

 * Escape is handled here in the capture phase rather than left to
 * `usePopover`'s own dismissal for two reasons found by driving this in a
 * real browser rather than trusting jsdom: `ListBox` binds Escape for its
 * own purposes (clearing selection) and stops the event there, so a
 * bubble-phase handler on this element never sees it and the popover stays
 * open; and because this popover is portalled to the end of `<body>`, React
 * still replays the event up the *component* tree, so an Escape that did get
 * through would also reach whatever dialog rendered the trigger and close
 * both layers at once. Capturing before the list gets the event, then
 * stopping propagation after closing, makes Escape dismiss exactly the
 * topmost layer.
 */
export function FloatingPopover({
  state,
  children,
  popoverRef,
  className,
  ...props
}: FloatingPopoverProps) {
  const fallbackRef = useRef<HTMLDivElement>(null);
  const ref = popoverRef ?? fallbackRef;

  const { popoverProps, underlayProps } = usePopover({ ...props, popoverRef: ref }, state);

  return (
    <Overlay>
      <div {...underlayProps} className="fixed inset-0" />
      <FocusScope restoreFocus>
        <div
          {...popoverProps}
          ref={ref}
          onKeyDownCapture={(event) => {
            if (event.key === 'Escape') {
              event.stopPropagation();
              state.close();
            }
          }}
          className={cn(
            'z-popover bg-surface-overlay rounded-sm border border-subtle shadow-xl',
            className,
          )}
        >
          <DismissButton onDismiss={() => state.close()} />
          {children}
          <DismissButton onDismiss={() => state.close()} />
        </div>
      </FocusScope>
    </Overlay>
  );
}
