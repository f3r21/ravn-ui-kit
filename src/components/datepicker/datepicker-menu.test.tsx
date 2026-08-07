import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { DatePickerMenu } from './datepicker-menu';

/** Finds the (non-disabled, i.e. current-month) day cell button with the given day number. */
function getDayButton(name: string): HTMLElement {
  const match = screen
    .getAllByRole('button')
    .find((el) => el.textContent === name && el.getAttribute('aria-disabled') !== 'true');
  if (!match) throw new Error(`No enabled day button found with text "${name}"`);
  return match;
}

function isCellSelected(dayButton: HTMLElement): boolean {
  return dayButton.closest('[role="gridcell"]')?.getAttribute('aria-selected') === 'true';
}

describe('DatePickerMenu Component', () => {
  it('selects a day and reports the correct date via onChange', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DatePickerMenu
        defaultValue={new Date(2026, 7, 1)}
        onChange={handleChange}
        onClose={vi.fn()}
      />,
    );

    await user.click(getDayButton('15'));

    expect(handleChange).toHaveBeenCalledTimes(1);
    const calledWith = handleChange.mock.calls[0][0] as Date;
    expect(calledWith.getDate()).toBe(15);
    expect(calledWith.getMonth()).toBe(7);
  });

  it('marks only the newly selected day as selected', async () => {
    const user = userEvent.setup();
    render(<DatePickerMenu defaultValue={new Date(2026, 7, 15)} onClose={vi.fn()} />);

    const day15 = getDayButton('15');
    expect(isCellSelected(day15)).toBe(true);

    const day20 = getDayButton('20');
    await user.click(day20);

    expect(isCellSelected(day20)).toBe(true);
    expect(isCellSelected(day15)).toBe(false);
  });

  it('navigates to the previous and next month', async () => {
    const user = userEvent.setup();
    render(<DatePickerMenu defaultValue={new Date(2026, 7, 15)} onClose={vi.fn()} />);

    expect(screen.getByText('August 2026', { selector: 'span' })).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByText('July 2026', { selector: 'span' })).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Next month' }));
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('September 2026', { selector: 'span' })).toBeDefined();
  });

  it('navigates to the previous and next year', async () => {
    const user = userEvent.setup();
    render(<DatePickerMenu defaultValue={new Date(2026, 7, 15)} onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Previous year' }));
    expect(screen.getByText('August 2025', { selector: 'span' })).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Next year' }));
    await user.click(screen.getByRole('button', { name: 'Next year' }));
    expect(screen.getByText('August 2027', { selector: 'span' })).toBeDefined();
  });

  it('does not change the displayed selection internally when controlled', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DatePickerMenu value={new Date(2026, 7, 15)} onChange={handleChange} onClose={vi.fn()} />,
    );

    const day20 = getDayButton('20');
    await user.click(day20);

    expect(handleChange).toHaveBeenCalledTimes(1);
    const day15 = getDayButton('15');
    expect(isCellSelected(day15)).toBe(true);
    expect(isCellSelected(day20)).toBe(false);
  });

  it('jumps to today and reports it via onChange when the footer action is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DatePickerMenu
        defaultValue={new Date(2020, 0, 1)}
        onChange={handleChange}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('January 2020', { selector: 'span' })).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Today' }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    const today = new Date();
    const calledWith = handleChange.mock.calls[0][0] as Date;
    expect(calledWith.getDate()).toBe(today.getDate());
    expect(calledWith.getMonth()).toBe(today.getMonth());
    expect(calledWith.getFullYear()).toBe(today.getFullYear());
  });

  it('lead/trail days from adjacent months are disabled, not selectable', async () => {
    render(<DatePickerMenu defaultValue={new Date(2026, 7, 15)} onClose={vi.fn()} />);
    // August 2026's grid includes trailing July days (Aug 1 2026 is a Saturday).
    const outsideMonthCell = screen
      .getAllByRole('button')
      .find((el) => el.getAttribute('aria-disabled') === 'true');
    expect(outsideMonthCell).toBeDefined();
    expect(outsideMonthCell?.getAttribute('tabindex')).toBeNull();
  });

  it('the day grid has proper grid/gridcell roles', () => {
    render(<DatePickerMenu defaultValue={new Date(2026, 7, 15)} onClose={vi.fn()} />);
    expect(screen.getByRole('grid')).toBeDefined();
    expect(screen.getAllByRole('gridcell').length).toBeGreaterThan(0);
  });

  it('calls onClose when Escape is pressed', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(<DatePickerMenu defaultValue={new Date(2026, 7, 15)} onClose={handleClose} />);
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  describe('timeZone', () => {
    // One absolute instant, read in two zones on either side of the date line. This is
    // deliberately independent of the machine's own zone — the old code read the Date's
    // *local* wall-clock fields, so it would answer with one day for both of these, and
    // whichever of the two assertions does not match the runner's zone goes red. That is
    // the point: a timezone test pinned to the runner's own zone proves nothing.
    const instant = new Date('2026-03-15T00:00:00Z');

    it('reads a date in the zone it is given, not the machine’s', () => {
      const { unmount } = render(
        <DatePickerMenu value={instant} timeZone="UTC" onClose={vi.fn()} />,
      );
      expect(isCellSelected(getDayButton('15'))).toBe(true);
      unmount();

      // UTC-11: the same instant is still 14 March there.
      render(<DatePickerMenu value={instant} timeZone="Pacific/Niue" onClose={vi.fn()} />);
      expect(isCellSelected(getDayButton('14'))).toBe(true);
    });

    it('writes back an instant that lands on the clicked day in that zone', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <DatePickerMenu value={instant} timeZone="UTC" onChange={handleChange} onClose={vi.fn()} />,
      );

      await user.click(getDayButton('20'));

      const result = handleChange.mock.calls[0][0] as Date;
      // Asserted in UTC, because UTC is what was asked for. `getDate()` would read the
      // runner's zone and pass or fail by accident.
      expect(result.toISOString().slice(0, 10)).toBe('2026-03-20');
    });
  });
});
