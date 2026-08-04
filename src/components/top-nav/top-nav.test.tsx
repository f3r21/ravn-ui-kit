import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TopNav } from './top-nav';

describe('TopNav Component', () => {
  it('calls onSearchChange as the user types', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(<TopNav onSearchChange={onSearchChange} />);
    await user.type(screen.getByRole('textbox', { name: 'Search' }), 'auth');
    expect(onSearchChange).toHaveBeenLastCalledWith('auth');
  });

  it('shows the clear-search icon only once there is a value, matching Frame 648 going 88px -> 136px', async () => {
    const user = userEvent.setup();
    render(<TopNav />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();

    await user.type(screen.getByRole('textbox', { name: 'Search' }), 'auth');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeDefined();
  });

  it('clears the search value when the clear-search icon is clicked', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(<TopNav onSearchChange={onSearchChange} />);
    const input = screen.getByRole('textbox', { name: 'Search' });
    await user.type(input, 'auth');

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect((input as HTMLInputElement).value).toBe('');
    expect(onSearchChange).toHaveBeenLastCalledWith('');
  });

  it('only renders the avatar when a user is provided', () => {
    const { rerender } = render(<TopNav />);
    expect(screen.queryByText('JB')).toBeNull();

    rerender(<TopNav userName="Jerome Bell" />);
    expect(screen.getByText('JB')).toBeDefined();
  });
});
