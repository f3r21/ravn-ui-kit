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

  describe('reuse across close/open cycles', () => {
    const titleField = () => screen.getByPlaceholderText('Task name') as HTMLInputElement;

    /**
     * The defect this pins. `isOpen` gates rendering *below* the hooks, so the widget keeps
     * its state while closed, and Cancel used to blank the title rather than restore it —
     * reopening on a different task showed an empty field. A consumer cannot fix this with
     * a `key`, because nothing tells it the widget is holding stale state.
     */
    it('shows the new props when reopened for a different task', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <AddTaskModal isOpen onClose={vi.fn()} defaultTitle="Fix the GraphQL bug" />,
      );
      expect(titleField().value).toBe('Fix the GraphQL bug');

      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      rerender(<AddTaskModal isOpen={false} onClose={vi.fn()} defaultTitle="Write the docs" />);
      rerender(<AddTaskModal isOpen onClose={vi.fn()} defaultTitle="Write the docs" />);

      expect(titleField().value).toBe('Write the docs');
    });

    it('discards what the user typed when it is reopened on the same task', async () => {
      const user = userEvent.setup();
      const props = { onClose: vi.fn(), defaultTitle: 'Fix the GraphQL bug' };
      const { rerender } = render(<AddTaskModal isOpen {...props} />);

      await user.type(titleField(), ' — actually something else');
      rerender(<AddTaskModal isOpen={false} {...props} />);
      rerender(<AddTaskModal isOpen {...props} />);

      expect(titleField().value).toBe('Fix the GraphQL bug');
    });

    it('re-seeds the trigger chips too, not just the title', () => {
      const jerome = { id: '1', name: 'Jerome Bell' };
      const jane = { id: '2', name: 'Jane Doe' };
      const props = { onClose: vi.fn(), assignees: [jerome, jane] };
      const { rerender } = render(
        <AddTaskModal isOpen {...props} defaultPoints={3} defaultAssignee={jerome} />,
      );
      expect(screen.getByRole('button', { name: /3 Points/ })).toBeDefined();

      rerender(<AddTaskModal isOpen={false} {...props} defaultPoints={8} defaultAssignee={jane} />);
      rerender(<AddTaskModal isOpen {...props} defaultPoints={8} defaultAssignee={jane} />);

      expect(screen.getByRole('button', { name: /8 Points/ })).toBeDefined();
      expect(screen.getByRole('button', { name: /Jane Doe/ })).toBeDefined();
    });

    it('leaves an open widget alone when its props change under it', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<AddTaskModal isOpen onClose={vi.fn()} defaultTitle="First" />);

      await user.clear(titleField());
      await user.type(titleField(), 'Half-written');
      rerender(<AddTaskModal isOpen onClose={vi.fn()} defaultTitle="Second" />);

      // Re-seeding is bound to the closed -> open edge, not to the props themselves: a
      // parent re-render must not throw away what the user is in the middle of typing.
      expect(titleField().value).toBe('Half-written');
    });
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
    expect(input.className).toContain('focus-visible:outline-interactive-text');
  });
});

/**
 * #82. Each chip's popover closes only ITSELF, and clicking outside the chip row still
 * dismisses. Both halves matter: the fix exempts the whole row from outside-dismiss so a
 * sibling chip receives its own click, and the risk of that fix is a popover that can no
 * longer be dismissed at all.
 */
describe('closing a chip popover from outside the row (#82)', () => {
  it.each([['Estimate'], ['Assignee'], ['Label'], ['Due date']])(
    '%s dismisses when the click lands outside the chip row',
    async (chip) => {
      const user = userEvent.setup();
      render(<AddTaskModal isOpen onClose={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: chip }));
      expect(screen.getByRole('dialog')).toBeDefined();

      // The title input is outside the row, so this is a genuine outside interaction.
      await user.click(screen.getByPlaceholderText('Task name'));
      expect(screen.queryByRole('dialog')).toBeNull();
    },
  );
});
