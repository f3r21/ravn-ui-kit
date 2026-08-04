import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TaskCard } from './task-card';

describe('TaskCard Component keyboard accessibility', () => {
  it('exposes role="button" and tabIndex={0} when onClick is provided', () => {
    render(<TaskCard title="Test Task" onClick={vi.fn()} />);
    const card = screen.getByRole('button', { name: /test task/i });
    expect(card.getAttribute('tabindex')).toBe('0');
  });

  it('does not expose role="button" or tabIndex when onClick is not provided', () => {
    render(<TaskCard title="Test Task" />);
    expect(screen.queryByRole('button', { name: /test task/i })).toBeNull();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onClick={handleClick} />);
    await user.click(screen.getByRole('button', { name: /test task/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter is pressed while focused', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onClick={handleClick} />);
    screen.getByRole('button', { name: /test task/i }).focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space is pressed while focused', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onClick={handleClick} />);
    screen.getByRole('button', { name: /test task/i }).focus();
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
