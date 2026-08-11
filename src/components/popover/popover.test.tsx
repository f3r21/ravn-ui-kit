import React, { createRef, useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Popover } from './popover';

function TestHarness({ onClose }: { onClose: () => void }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <div>
      <button ref={triggerRef} type="button">
        Trigger
      </button>
      <Popover isOpen onClose={onClose} triggerRef={triggerRef} aria-label="Options">
        <button type="button">Option</button>
      </Popover>
    </div>
  );
}

describe('Popover Component', () => {
  it('renders nothing when isOpen is false', () => {
    render(
      <Popover isOpen={false} onClose={vi.fn()} aria-label="Options">
        <button type="button">Option</button>
      </Popover>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders with role="dialog" by default and moves focus inside on open', () => {
    render(
      <Popover isOpen onClose={vi.fn()} aria-label="Options">
        <button type="button">Option</button>
      </Popover>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Options' });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('calls onClose when Escape is pressed', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Popover isOpen onClose={handleClose} aria-label="Options">
        <button type="button">Option</button>
      </Popover>,
    );
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on an outside click', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Outside</button>
        <Popover isOpen onClose={handleClose} aria-label="Options">
          <button type="button">Option</button>
        </Popover>
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the popover', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Popover isOpen onClose={handleClose} aria-label="Options">
        <button type="button">Option</button>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Option' }));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('excludes the trigger from outside-click dismissal, so re-clicking it does not fire onClose', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(<TestHarness onClose={handleClose} />);
    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('does not trap focus — Tab can move past the popover', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Popover isOpen onClose={vi.fn()} aria-label="Options">
          <button type="button">Option</button>
        </Popover>
        <button type="button">After</button>
      </div>,
    );
    // Focus starts inside the popover (autoFocus lands on "Option"); the
    // DismissButton bookends are tabIndex={-1} (screen-reader virtual-cursor
    // stops, not real Tab stops), so a single Tab reaches "After" directly —
    // proof this isn't a focus-trapping FocusScope like Modal's.
    expect(screen.getByRole('button', { name: 'Option' })).toBe(document.activeElement);
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toBe(document.activeElement);
  });

  it('forwards a ref to the popover surface and spreads unrecognised props (#11)', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover isOpen onClose={vi.fn()} aria-label="Options" ref={ref} data-testid="popover">
        <button type="button">Option</button>
      </Popover>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId('popover')).toBe(ref.current);
  });
});

/**
 * #82. Outside-click handling runs in the capture phase and CONSUMES the click, so a region
 * declared exempt is the difference between a sibling trigger receiving its own click and the
 * user having to click twice. `AddTaskModal`'s four chips are the case this exists for.
 */
describe('Popover dismissExemptRef (#82)', () => {
  function Harness({ exempt }: { exempt: boolean }) {
    const rowRef = React.useRef<HTMLDivElement>(null);
    return (
      <div>
        <div ref={rowRef} data-testid="row">
          <button type="button">sibling</button>
        </div>
        <button type="button" data-testid="far">
          far away
        </button>
        <Popover
          isOpen
          onClose={onCloseSpy}
          aria-label="Test"
          dismissExemptRef={exempt ? rowRef : undefined}
        >
          <p>content</p>
        </Popover>
      </div>
    );
  }
  let onCloseSpy: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    onCloseSpy = vi.fn();
  });

  it('does not dismiss when the interaction is inside the exempt region', async () => {
    const user = userEvent.setup();
    render(<Harness exempt />);
    await user.click(screen.getByText('sibling'));
    expect(onCloseSpy).not.toHaveBeenCalled();
  });

  /**
   * The control, and it is doing real work: without it, "never dismisses at all" passes the case
   * above. A popover that cannot be dismissed is a worse bug than the one being fixed.
   */
  it('control: still dismisses when the interaction is genuinely outside', async () => {
    const user = userEvent.setup();
    render(<Harness exempt />);
    await user.click(screen.getByTestId('far'));
    expect(onCloseSpy).toHaveBeenCalled();
  });

  it('control: without the prop, the same sibling click dismisses', async () => {
    const user = userEvent.setup();
    render(<Harness exempt={false} />);
    await user.click(screen.getByText('sibling'));
    expect(onCloseSpy).toHaveBeenCalled();
  });
});
