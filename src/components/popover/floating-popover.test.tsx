import { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useButton } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import { FloatingPopover } from './floating-popover';

function Harness({ onOpenChange }: { onOpenChange?: (isOpen: boolean) => void }) {
  const state = useOverlayTriggerState({ onOpenChange });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton({ onPress: () => state.toggle() }, triggerRef);

  return (
    <div>
      <button type="button">Outside</button>
      <button {...buttonProps} ref={triggerRef} type="button">
        Trigger
      </button>
      {state.isOpen ? (
        <FloatingPopover state={state} triggerRef={triggerRef} placement="bottom start">
          {/* eslint-disable-next-line jsx-a11y/no-autofocus -- stands in for
              a composing component's own autoFocus (e.g. ListBox's), which
              is what moves focus inside the popover in real usage so
              Escape/blur dismissal (bound via keydown/focus-within on the
              popover surface) has something inside to bubble through. */}
          <button type="button" autoFocus>
            Option
          </button>
        </FloatingPopover>
      ) : null}
    </div>
  );
}

describe('FloatingPopover Component', () => {
  it('renders nothing until the trigger opens it', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.queryByRole('button', { name: 'Option' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    expect(screen.getByRole('button', { name: 'Option' })).toBeDefined();
  });

  it('closes on Escape', async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onOpenChange={handleOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    expect(screen.getByRole('button', { name: 'Option' })).toBeDefined();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('button', { name: 'Option' })).toBeNull();
    expect(handleOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('closes on an outside click', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    expect(screen.getByRole('button', { name: 'Option' })).toBeDefined();

    // Queried by text, not role: while the popover is open, everything
    // outside it (this button included) is `aria-hidden` from assistive
    // tech — the same modal-like behavior a native `<select>` popup has —
    // so it's intentionally absent from the accessibility tree `getByRole`
    // reads, even though it's still a real, clickable DOM node.
    await user.click(screen.getByText('Outside'));
    expect(screen.queryByRole('button', { name: 'Option' })).toBeNull();
  });

  it('does not close when clicking inside the popover', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    await user.click(screen.getByRole('button', { name: 'Option' }));
    expect(screen.getByRole('button', { name: 'Option' })).toBeDefined();
  });

  it("is portalled outside the trigger's DOM subtree", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    const option = screen.getByRole('button', { name: 'Option' });
    expect(container.contains(option)).toBe(false);
  });
});
