import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { DatePickerMenu } from './datepicker-menu';

describe('DatePickerMenu Component', () => {
  it('selects a day and reports the correct date via onChange', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<DatePickerMenu defaultValue={new Date(2026, 7, 1)} onChange={handleChange} />);

    const dayButton = screen.getByText('15').closest('button')!;
    await user.click(dayButton);

    expect(handleChange).toHaveBeenCalledTimes(1);
    const calledWith = handleChange.mock.calls[0][0] as Date;
    expect(calledWith.getDate()).toBe(15);
    expect(calledWith.getMonth()).toBe(7);
  });

  it('marks only the newly selected day as pressed', async () => {
    const user = userEvent.setup();
    render(<DatePickerMenu defaultValue={new Date(2026, 7, 15)} />);

    const day15 = screen.getByText('15').closest('button')!;
    expect(day15.getAttribute('aria-pressed')).toBe('true');

    const day20 = screen.getByText('20').closest('button')!;
    await user.click(day20);

    expect(day20.getAttribute('aria-pressed')).toBe('true');
    expect(day15.getAttribute('aria-pressed')).toBe('false');
  });

  it('navigates to the previous and next month', async () => {
    const user = userEvent.setup();
    render(<DatePickerMenu defaultValue={new Date(2026, 7, 15)} />);

    expect(screen.getByText('August 2026')).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByText('July 2026')).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Next month' }));
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('September 2026')).toBeDefined();
  });

  it('navigates to the previous and next year', async () => {
    const user = userEvent.setup();
    render(<DatePickerMenu defaultValue={new Date(2026, 7, 15)} />);

    await user.click(screen.getByRole('button', { name: 'Previous year' }));
    expect(screen.getByText('August 2025')).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Next year' }));
    await user.click(screen.getByRole('button', { name: 'Next year' }));
    expect(screen.getByText('August 2027')).toBeDefined();
  });

  it('does not change the displayed selection internally when controlled', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<DatePickerMenu value={new Date(2026, 7, 15)} onChange={handleChange} />);

    const day20 = screen.getByText('20').closest('button')!;
    await user.click(day20);

    expect(handleChange).toHaveBeenCalledTimes(1);
    const day15 = screen.getByText('15').closest('button')!;
    expect(day15.getAttribute('aria-pressed')).toBe('true');
    expect(day20.getAttribute('aria-pressed')).toBe('false');
  });

  it('jumps to today and reports it via onChange when the footer action is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<DatePickerMenu defaultValue={new Date(2020, 0, 1)} onChange={handleChange} />);

    expect(screen.getByText('January 2020')).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Today' }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    const today = new Date();
    const calledWith = handleChange.mock.calls[0][0] as Date;
    expect(calledWith.getDate()).toBe(today.getDate());
    expect(calledWith.getMonth()).toBe(today.getMonth());
    expect(calledWith.getFullYear()).toBe(today.getFullYear());
  });
});
