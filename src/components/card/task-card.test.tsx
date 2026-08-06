import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TaskCard } from './task-card';

describe('TaskCard Component keyboard accessibility', () => {
  it('exposes the title as a real button, not the whole card as an ARIA one', () => {
    render(<TaskCard title="Test Task" onClick={vi.fn()} />);
    const opener = screen.getByRole('button', { name: 'Test Task' });

    // A native <button>, so focus, Enter and Space come from the platform rather than
    // from a hand-rolled role/tabIndex/onKeyDown trio on the container. The container
    // used to be the button, which named itself from the card's entire text content and
    // would nest any interactive child inside a button.
    expect(opener.tagName).toBe('BUTTON');
    expect(opener.getAttribute('role')).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('does not render an opener when onClick is not provided', () => {
    render(<TaskCard title="Test Task" />);
    expect(screen.queryByRole('button')).toBeNull();
    // The title is still there, just as static text under its heading.
    expect(screen.getByRole('heading', { name: 'Test Task' })).toBeDefined();
  });

  it('calls onClick when the card surface is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onClick={handleClick} assigneeName="Jerome Bell" />);
    await user.click(screen.getByText('Jerome Bell'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick exactly once when the title button itself is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onClick={handleClick} />);
    await user.click(screen.getByRole('button', { name: 'Test Task' }));

    // Both the button and the card surface below it are wired to `onClick`; the button
    // stops the click from bubbling so the task opens once, not twice.
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('reaches the opener by tabbing and fires it with Enter', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onClick={handleClick} />);
    await user.tab();

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Test Task' }));

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('fires the opener with Space', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onClick={handleClick} />);
    await user.tab();
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
