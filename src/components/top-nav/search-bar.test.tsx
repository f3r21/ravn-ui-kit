import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './search-bar';

describe('SearchBar Component', () => {
  it('renders with the fixed accessible name and default placeholder', () => {
    render(<SearchBar />);
    const input = screen.getByRole('textbox', { name: 'Search' });
    expect(input.getAttribute('placeholder')).toBe('Search...');
  });

  it('respects a custom placeholder', () => {
    render(<SearchBar placeholder="Find a task..." />);
    expect(screen.getByRole('textbox', { name: 'Search' }).getAttribute('placeholder')).toBe(
      'Find a task...'
    );
  });

  it('updates its own value and calls onChange on every keystroke when uncontrolled', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onChange={handleChange} />);
    const input = screen.getByRole('textbox', { name: 'Search' }) as HTMLInputElement;
    await user.type(input, 'abc');

    expect(input.value).toBe('abc');
    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(handleChange).toHaveBeenLastCalledWith('abc');
  });

  it('calls onSubmit with the current value when Enter is pressed', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSubmit={handleSubmit} />);
    const input = screen.getByRole('textbox', { name: 'Search' });
    await user.type(input, 'abc{Enter}');

    expect(handleSubmit).toHaveBeenCalledWith('abc');
  });

  it('does not mutate its displayed value when controlled, even though onChange still fires', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar value="abc" onChange={handleChange} />);
    const input = screen.getByRole('textbox', { name: 'Search' }) as HTMLInputElement;
    await user.type(input, 'd');

    expect(handleChange).toHaveBeenCalledWith('abcd');
    expect(input.value).toBe('abc');
  });
});
