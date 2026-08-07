import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TopNav } from './top-nav';

describe('TopNav Component', () => {
  it('calls onSearchChange as the user types', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(<TopNav onSearchChange={onSearchChange} />);
    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'auth');
    expect(onSearchChange).toHaveBeenLastCalledWith('auth');
  });

  it('shows the clear-search icon only once there is a value, matching Frame 648 going 88px -> 136px', async () => {
    const user = userEvent.setup();
    render(<TopNav />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'auth');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeDefined();
  });

  it('clears the search value when the clear-search icon is clicked', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(<TopNav onSearchChange={onSearchChange} />);
    const input = screen.getByRole('searchbox', { name: 'Search' });
    await user.type(input, 'auth');

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect((input as HTMLInputElement).value).toBe('');
    expect(onSearchChange).toHaveBeenLastCalledWith('');
  });

  it('leaves the notifications bell decorative when it has nothing to do', () => {
    // A button that does nothing is its own defect, so the non-interactive span stays the
    // default and existing consumers are unchanged.
    render(<TopNav />);
    expect(screen.queryByRole('button', { name: 'Notifications' })).toBeNull();
  });

  it('turns the notifications bell into a real, named button when given a handler', async () => {
    // It was a bare <span>: not focusable, not activatable, no accessible name — the only
    // notifications affordance in the shell, absent from the accessibility tree entirely.
    const user = userEvent.setup();
    const onNotificationsClick = vi.fn();
    render(<TopNav onNotificationsClick={onNotificationsClick} />);

    const bell = screen.getByRole('button', { name: 'Notifications' });
    await user.click(bell);
    expect(onNotificationsClick).toHaveBeenCalledTimes(1);
  });

  it('activates the bell from the keyboard, and paints a ring while doing it', async () => {
    const user = userEvent.setup();
    const onNotificationsClick = vi.fn();
    render(<TopNav onNotificationsClick={onNotificationsClick} />);

    const bell = screen.getByRole('button', { name: 'Notifications' });
    bell.focus();
    expect(bell).toBe(document.activeElement);
    await user.keyboard('{Enter}');
    expect(onNotificationsClick).toHaveBeenCalledTimes(1);

    expect(bell.className).not.toContain('outline-none');
    expect(bell.className).toContain('focus-visible:outline-2');
  });

  it('lets the bell carry an unread count in its name', () => {
    render(<TopNav onNotificationsClick={vi.fn()} notificationsLabel="Notifications, 3 unread" />);
    expect(screen.getByRole('button', { name: 'Notifications, 3 unread' })).toBeDefined();
  });

  it('forwards a search label through to the input', () => {
    render(<TopNav searchLabel="Search tasks" />);
    expect(screen.getByRole('searchbox', { name: 'Search tasks' })).toBeDefined();
  });

  it('only renders the avatar when a user is provided', () => {
    const { rerender } = render(<TopNav />);
    expect(screen.queryByText('JB')).toBeNull();

    rerender(<TopNav userName="Jerome Bell" />);
    expect(screen.getByText('JB')).toBeDefined();
  });
});
