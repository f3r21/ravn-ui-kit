import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AddTaskModal } from './add-task-modal';

describe('AddTaskModal Component', () => {
  it('wires aria-haspopup/aria-expanded on every trigger button, collapsed by default', () => {
    render(<AddTaskModal isOpen onClose={vi.fn()} />);
    for (const name of ['Estimate', 'Assignee', 'Label', 'Due date']) {
      const trigger = screen.getByRole('button', { name });
      expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    }
  });

  it('opens the Estimate popover on click and reflects it via aria-expanded', async () => {
    const user = userEvent.setup();
    render(<AddTaskModal isOpen onClose={vi.fn()} />);
    const trigger = screen.getByRole('button', { name: 'Estimate' });

    await user.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('dialog', { name: 'Estimate' })).toBeDefined();
  });

  it('closes the open popover when Escape is pressed, without closing the widget itself', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(<AddTaskModal isOpen onClose={handleClose} />);

    await user.click(screen.getByRole('button', { name: 'Estimate' }));
    expect(screen.getByRole('dialog', { name: 'Estimate' })).toBeDefined();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: 'Estimate' })).toBeNull();
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('closes the open popover on an outside click', async () => {
    const user = userEvent.setup();
    render(<AddTaskModal isOpen onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Assignee' }));
    expect(screen.getByRole('dialog', { name: 'Assignee' })).toBeDefined();

    await user.click(screen.getByPlaceholderText('Task name'));

    expect(screen.queryByRole('dialog', { name: 'Assignee' })).toBeNull();
  });

  it('re-clicking an open trigger closes its popover instead of leaving it open', async () => {
    const user = userEvent.setup();
    render(<AddTaskModal isOpen onClose={vi.fn()} />);
    const trigger = screen.getByRole('button', { name: 'Label' });

    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Label' })).toBeDefined();

    await user.click(trigger);
    expect(screen.queryByRole('dialog', { name: 'Label' })).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('only one popover is open at a time', async () => {
    const user = userEvent.setup();
    render(<AddTaskModal isOpen onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Estimate' }));
    expect(screen.getByRole('dialog', { name: 'Estimate' })).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Assignee' }));
    expect(screen.queryByRole('dialog', { name: 'Estimate' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Assignee' })).toBeDefined();
  });

  it('paints a focus ring on the task-name input rather than suppressing one', () => {
    // Regression pin for the outline-none bug class: in Tailwind v4 `outline-none`
    // compiles to `outline-style: none`, cancelling any `focus-visible:outline-*` beside
    // it and suppressing a consuming app's own base :focus-visible rule too. This input
    // carried `outline-none` alone, so it had no focus affordance whatsoever. jsdom
    // cannot evaluate :focus-visible, so the ring itself was confirmed by browser
    // screenshot; what is pinned here is the class pairing. See button.tsx's doc comment.
    render(<AddTaskModal isOpen onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText('Task name');

    expect(input.className).not.toContain('outline-none');
    expect(input.className).toContain('focus-visible:outline-2');
    expect(input.className).toContain('focus-visible:outline-primary-4');
  });
});
