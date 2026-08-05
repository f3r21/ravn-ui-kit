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
      'Find a task...',
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

  it('paints a focus ring rather than suppressing one', () => {
    // Regression pin for the outline-none bug class. jsdom cannot evaluate
    // :focus-visible, so the real proof is a browser screenshot — what is asserted here
    // is the pairing that broke before: in Tailwind v4 `outline-none` compiles to
    // `outline-style: none`, which cancels `focus-visible:outline-2` entirely (and also
    // suppresses a consuming app's own `@layer base :focus-visible` rule). This input
    // previously had `outline-none` and no focus affordance at all. See button.tsx's doc
    // comment for the full mechanics.
    render(<SearchBar />);
    const input = screen.getByRole('textbox', { name: 'Search' });

    expect(input.className).not.toContain('outline-none');
    expect(input.className).toContain('focus-visible:outline-2');
    expect(input.className).toContain('focus-visible:outline-primary-4');
  });
});
