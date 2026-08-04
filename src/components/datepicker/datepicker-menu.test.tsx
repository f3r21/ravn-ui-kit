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

    expect(screen.getByText('Agosto 2026')).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Mes anterior' }));
    expect(screen.getByText('Julio 2026')).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    await user.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    expect(screen.getByText('Septiembre 2026')).toBeDefined();
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
});
