import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from './segmented-control';

const OPTIONS = [
  { id: 'board', label: 'Board' },
  { id: 'list', label: 'List' },
  { id: 'table', label: 'Table' },
];

describe('SegmentedControl Component', () => {
  it('renders a radiogroup containing radio options with correct aria-checked wiring', () => {
    render(<SegmentedControl options={OPTIONS} defaultValue="board" />);
    expect(screen.getByRole('radiogroup')).toBeDefined();
    expect(screen.getByRole('radio', { name: 'Board' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: 'List' }).getAttribute('aria-checked')).toBe('false');
    expect(screen.getByRole('radio', { name: 'Table' }).getAttribute('aria-checked')).toBe('false');
  });

  it('selects an option on click (uncontrolled) and calls onChange', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<SegmentedControl options={OPTIONS} defaultValue="board" onChange={handleChange} />);
    await user.click(screen.getByRole('radio', { name: 'List' }));
    expect(handleChange).toHaveBeenCalledWith('list');
    expect(screen.getByRole('radio', { name: 'List' }).getAttribute('aria-checked')).toBe('true');
  });

  it('respects a controlled value and does not change it internally', async () => {
    const user = userEvent.setup();
    render(<SegmentedControl options={OPTIONS} value="board" onChange={vi.fn()} />);
    await user.click(screen.getByRole('radio', { name: 'List' }));
    expect(screen.getByRole('radio', { name: 'Board' }).getAttribute('aria-checked')).toBe('true');
  });

  it('only the selected option is tabbable (roving tabindex)', () => {
    render(<SegmentedControl options={OPTIONS} defaultValue="list" />);
    expect(screen.getByRole('radio', { name: 'Board' }).getAttribute('tabindex')).toBe('-1');
    expect(screen.getByRole('radio', { name: 'List' }).getAttribute('tabindex')).toBe('0');
    expect(screen.getByRole('radio', { name: 'Table' }).getAttribute('tabindex')).toBe('-1');
  });

  it('moves selection and focus with ArrowRight/ArrowLeft, wrapping at the ends', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<SegmentedControl options={OPTIONS} defaultValue="board" onChange={handleChange} />);

    screen.getByRole('radio', { name: 'Board' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(handleChange).toHaveBeenLastCalledWith('list');
    expect(screen.getByRole('radio', { name: 'List' })).toBe(document.activeElement);

    await user.keyboard('{ArrowLeft}');
    expect(handleChange).toHaveBeenLastCalledWith('board');
    expect(screen.getByRole('radio', { name: 'Board' })).toBe(document.activeElement);

    await user.keyboard('{ArrowLeft}');
    expect(handleChange).toHaveBeenLastCalledWith('table');
    expect(screen.getByRole('radio', { name: 'Table' })).toBe(document.activeElement);
  });

  it('moves selection to the first/last option with Home/End', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<SegmentedControl options={OPTIONS} defaultValue="list" onChange={handleChange} />);

    screen.getByRole('radio', { name: 'List' }).focus();
    await user.keyboard('{End}');
    expect(handleChange).toHaveBeenLastCalledWith('table');
    expect(screen.getByRole('radio', { name: 'Table' })).toBe(document.activeElement);

    await user.keyboard('{Home}');
    expect(handleChange).toHaveBeenLastCalledWith('board');
    expect(screen.getByRole('radio', { name: 'Board' })).toBe(document.activeElement);
  });

  it('names the group "View" by default, and lets a consumer override it', () => {
    // The name was hardcoded, which is right for a view switcher and wrong for every other
    // use of a segmented control. The default is unchanged so existing callers are not.
    const { rerender } = render(<SegmentedControl options={OPTIONS} />);
    expect(screen.getByRole('radiogroup', { name: 'View' })).toBeDefined();

    rerender(<SegmentedControl options={OPTIONS} label="Density" />);
    expect(screen.getByRole('radiogroup', { name: 'Density' })).toBeDefined();
  });
});
