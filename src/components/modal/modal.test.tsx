import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Modal } from './modal';

describe('Modal Component', () => {
  it('renders nothing when isOpen is false', () => {
    render(
      <Modal title="Test" isOpen={false} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders the dialog with an accessible name matching the title', () => {
    render(
      <Modal title="Add Task" isOpen onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: 'Add Task' })).toBeDefined();
  });

  it('defaults to role="dialog"', () => {
    render(
      <Modal title="Test" isOpen onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeDefined();
  });

  it('renders role="alertdialog" when requested, for destructive confirmations', () => {
    render(
      <Modal title="Delete task" isOpen onClose={vi.fn()} role="alertdialog">
        <p>This can’t be undone.</p>
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('alertdialog', { name: 'Delete task' })).toBeDefined();
  });

  it('moves focus inside the dialog when opened', () => {
    render(
      <Modal title="Test" isOpen onClose={vi.fn()}>
        <button>Inside</button>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('calls onClose when Escape is pressed', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal title="Test" isOpen onClose={handleClose}>
        <p>Content</p>
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the backdrop but not when clicking inside the dialog', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Modal title="Test" isOpen onClose={handleClose}>
        <button>Inside</button>
      </Modal>,
    );

    await user.click(screen.getByRole('button', { name: 'Inside' }));
    expect(handleClose).not.toHaveBeenCalled();

    const backdrop = container.firstElementChild as HTMLElement;
    await user.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('keeps focus within the dialog when tabbing', async () => {
    const user = userEvent.setup();
    render(
      <Modal title="Test" isOpen onClose={vi.fn()}>
        <button>First</button>
        <button>Second</button>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    await user.tab();
    await user.tab();
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('hides background content from assistive tech while open', () => {
    render(
      <>
        <button>Outside</button>
        <Modal title="Test" isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      </>,
    );
    const outside = screen.getByText('Outside');
    expect(outside.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByRole('dialog').getAttribute('aria-hidden')).toBeNull();
  });

  it('locks body scroll while open and restores it on close', () => {
    const { rerender } = render(
      <Modal title="Test" isOpen={false} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    );
    expect(document.documentElement.style.overflow).not.toBe('hidden');

    rerender(
      <Modal title="Test" isOpen onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    );
    expect(document.documentElement.style.overflow).toBe('hidden');

    rerender(
      <Modal title="Test" isOpen={false} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    );
    expect(document.documentElement.style.overflow).not.toBe('hidden');
  });
});
