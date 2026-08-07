import { render, screen, fireEvent } from '@testing-library/react';
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

/**
 * #64. An `alertdialog` exists to interrupt with a consequence, so the body text is the entire
 * reason for choosing the role — and `useDialog` returns three things, of which `contentProps`
 * was dropped. React Aria generates an id, points `aria-describedby` at it, then discards it in
 * a layout effect (`useSlotId`) because nothing carried it. Role announced, reason not.
 *
 * The naive version of this test passes on the broken code: the body text IS rendered and
 * `getByText` finds it. What was missing is the *wiring*, so these resolve `aria-describedby`
 * rather than asking whether the words are on screen. Same shape as #45's `animate-pulse`
 * substring — the visible thing is right and the connection is not.
 *
 * This repo has no jest-dom, so there is no `toHaveAccessibleDescription`; resolving the id by
 * hand is the equivalent and is more explicit about what is being claimed.
 */
describe('Modal accessible description (#64)', () => {
  const describedText = (el: HTMLElement) => {
    const id = el.getAttribute('aria-describedby');
    return id ? document.getElementById(id)?.textContent : undefined;
  };

  it('describes an alertdialog by its body content', () => {
    render(
      <Modal title="Delete task" isOpen role="alertdialog" onClose={vi.fn()}>
        <p>This cannot be undone.</p>
      </Modal>,
    );

    const dialog = screen.getByRole('alertdialog');
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    expect(describedText(dialog)).toMatch(/cannot be undone/i);
  });

  /**
   * The positive control for the assertion above. Without it, "the description is missing" and
   * "my way of reading the description is wrong" are indistinguishable — which is exactly how
   * #54's two greps returned 0 against a bundle that contained what they sought.
   *
   * `role="dialog"` is the case where React Aria deliberately does NOT generate a description,
   * so the same probe must come back empty here. A probe that returns text for both roles is
   * measuring nothing.
   */
  it('control: a plain dialog has no generated description, so the probe discriminates', () => {
    render(
      <Modal title="Edit task" isOpen onClose={vi.fn()}>
        <p>This cannot be undone.</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-describedby')).toBeNull();
    // The words are on screen either way — which is why asserting on them proves nothing.
    expect(screen.getByText('This cannot be undone.')).toBeDefined();
  });

  it('lets a consumer block dismissal while an operation is in flight', () => {
    // `isDismissable` was hardcoded true, so a consumer could not stop Escape or a backdrop
    // click mid-delete. Gating `onClose` is not equivalent: it still fires.
    const onClose = vi.fn();
    render(
      <Modal title="Delete task" isOpen isDismissable={false} onClose={onClose}>
        <p>Deleting…</p>
      </Modal>,
    );

    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('control: the same Escape does close it when dismissable, which is the default', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal title="Delete task" isOpen onClose={onClose}>
        <p>Deleting…</p>
      </Modal>,
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
