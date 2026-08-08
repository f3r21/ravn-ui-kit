import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TaskTable, TaskTableRow, DueDateCell, type TaskTableRowProps } from './task-table';
import { TaskCard } from './task-card';
import { EmptyState } from '../empty-state/empty-state';

describe('TaskTable Component', () => {
  it('renders each group header and its rows', () => {
    render(
      <TaskTable
        groups={[
          {
            title: 'To Do (02)',
            rows: [
              { index: 1, title: 'Create wireframe' },
              { index: 2, title: 'Slack Logo Design' },
            ],
          },
          { title: 'In Progress', rows: [{ index: 1, title: 'Dashboard Design' }] },
        ]}
      />,
    );
    expect(screen.getByText('To Do (02)')).toBeDefined();
    expect(screen.getByText('In Progress')).toBeDefined();
    expect(screen.getByText('Create wireframe')).toBeDefined();
    expect(screen.getByText('Slack Logo Design')).toBeDefined();
    expect(screen.getByText('Dashboard Design')).toBeDefined();
    expect(screen.getAllByText('01')).toHaveLength(2);
    expect(screen.getByText('02')).toBeDefined();
  });

  it('toggles the row checkbox and calls onSelectedChange', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <TaskTable
        groups={[
          { title: 'To Do', rows: [{ index: 1, title: 'Create wireframe', onSelectedChange }] },
        ]}
      />,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Select Create wireframe' }));
    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });

  it('omits empty columns instead of rendering a placeholder dash', () => {
    render(
      <TaskTable groups={[{ title: 'To Do', rows: [{ index: 1, title: 'Create wireframe' }] }]} />,
    );
    expect(screen.queryByText('—')).toBeNull();
  });

  describe('opening a task from the table', () => {
    const renderRow = (row: Partial<TaskTableRowProps> = {}) =>
      render(
        <TaskTable
          groups={[{ title: 'To Do', rows: [{ index: 1, title: 'Create wireframe', ...row }] }]}
        />,
      );

    it('renders no opener when the row is not clickable', () => {
      renderRow();
      expect(screen.queryByRole('button', { name: 'Create wireframe' })).toBeNull();
    });

    /**
     * The defect this pins: the row's only affordance used to be `onClick` on the `<tr>`,
     * with no `role`, `tabIndex` or `onKeyDown` anywhere — so a keyboard or screen-reader
     * user could not open a task from the table at all. Driven with the keyboard on
     * purpose: `element.click()` passes against the broken version and reports nothing.
     */
    it('reaches the opener by tabbing and fires it with Enter', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      renderRow({ onClick });

      await user.tab(); // the row-select checkbox
      await user.tab(); // the title, which is the opener

      const opener = screen.getByRole('button', { name: 'Create wireframe' });
      expect(document.activeElement).toBe(opener);
      expect(opener.tagName).toBe('BUTTON');

      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('fires the opener with Space', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      renderRow({ onClick });

      screen.getByRole('button', { name: 'Create wireframe' }).focus();
      await user.keyboard(' ');

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('opens once, not twice, when the opener is clicked with a pointer', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      renderRow({ onClick });

      await user.click(screen.getByRole('button', { name: 'Create wireframe' }));

      // The row itself is still clickable for a pointer user, so the opener has to stop the
      // click from bubbling into that handler as well.
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('still opens from a click anywhere else in the row', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      renderRow({ onClick, assigneeName: 'Jonah Doe' });

      await user.click(screen.getByText('Jonah Doe'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not open the task when the row-select checkbox is used', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const onSelectedChange = vi.fn();
      renderRow({ onClick, onSelectedChange });

      await user.click(screen.getByRole('checkbox', { name: 'Select Create wireframe' }));

      expect(onSelectedChange).toHaveBeenCalledWith(true);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not open the task when the Details link is used', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const onViewDetails = vi.fn();
      renderRow({ onClick, onViewDetails });

      await user.click(screen.getByRole('button', { name: 'Details' }));

      expect(onViewDetails).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  /**
   * The row-select checkbox's focus ring, which did not paint at all until `outline-solid`
   * was added — see `LabelCheckbox`'s equivalent test for the full reasoning. The input is
   * `sr-only`, so the ring is drawn on the wrapping label via `:has()`, and under that
   * variant `outline-2` alone leaves `outline-style` unresolved. Verified by pixel count
   * in a real browser: zero before, 291 after.
   */
  it('gives the row-select checkbox a ring that actually paints', () => {
    render(
      <TaskTable
        groups={[
          {
            title: 'To Do',
            rows: [{ index: 1, title: 'Create wireframe', onSelectedChange: vi.fn() }],
          },
        ]}
      />,
    );
    const label = screen
      .getByRole('checkbox', { name: 'Select Create wireframe' })
      .closest('label')!;
    expect(label.className).toContain('has-[:focus-visible]:outline-solid');
    expect(label.className).toContain('has-[:focus-visible]:outline-interactive-text');
    expect(label.className).not.toContain('outline-none');
  });

  it('omits the select checkbox entirely when the row is not selectable', () => {
    // The checkbox is `sr-only` and only visually `opacity-0`, so it was always in the
    // accessibility tree — one extra tabbable, announced checkbox per row for a consumer
    // with no bulk-selection feature, and no way to turn it off.
    const { rerender } = render(
      <table>
        <tbody>
          <TaskTableRow index={1} title="Fix auth bug" />
        </tbody>
      </table>,
    );
    expect(screen.getByRole('checkbox', { name: 'Select Fix auth bug' })).toBeDefined();

    rerender(
      <table>
        <tbody>
          <TaskTableRow index={1} title="Fix auth bug" isSelectable={false} />
        </tbody>
      </table>,
    );
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('leaves the title unwrapped by default and wraps it in a heading on request', () => {
    // Opt-in: a heading in every row of a long table is noise for a reader already
    // navigating it as a grid, so the default must stay exactly as it was.
    const { rerender } = render(
      <table>
        <tbody>
          <TaskTableRow index={1} title="Fix auth bug" />
        </tbody>
      </table>,
    );
    expect(screen.queryByRole('heading')).toBeNull();

    rerender(
      <table>
        <tbody>
          <TaskTableRow index={1} title="Fix auth bug" headingLevel={4} />
        </tbody>
      </table>,
    );
    expect(screen.getByRole('heading', { level: 4, name: 'Fix auth bug' }).tagName).toBe('H4');
  });

  it('keeps the title operable as a button inside its heading', () => {
    // The heading must wrap the control, not replace it — otherwise the opt-in silently
    // costs the row its keyboard path.
    const onClick = vi.fn();
    render(
      <table>
        <tbody>
          <TaskTableRow index={1} title="Fix auth bug" headingLevel={3} onClick={onClick} />
        </tbody>
      </table>,
    );

    const button = screen.getByRole('button', { name: 'Fix auth bug' });
    expect(button.closest('h3')).not.toBeNull();
    expect(button.className).toContain('focus-visible:outline-2');
    expect(button.className).not.toContain('outline-none');
  });

  /**
   * #13. The default interpolates the row's `title`, so within one table the checkboxes
   * are already distinct — what it cannot survive is two tables on one page holding a task
   * of the same name, which is what this renders.
   */
  it('lets two same-named rows in different tables carry distinct checkbox names', async () => {
    const onToDo = vi.fn();
    const user = userEvent.setup();
    render(
      <>
        <table>
          <tbody>
            <TaskTableRow
              index={1}
              title="Fix auth bug"
              selectLabel="Select Fix auth bug in To Do"
              onSelectedChange={onToDo}
            />
          </tbody>
        </table>
        <table>
          <tbody>
            <TaskTableRow
              index={1}
              title="Fix auth bug"
              selectLabel="Select Fix auth bug in Done"
            />
          </tbody>
        </table>
      </>,
    );

    // The default name is now claimed by neither row, so it cannot be ambiguous.
    expect(screen.queryByRole('checkbox', { name: 'Select Fix auth bug' })).toBeNull();
    expect(screen.getByRole('checkbox', { name: 'Select Fix auth bug in Done' })).toBeDefined();

    await user.click(screen.getByRole('checkbox', { name: 'Select Fix auth bug in To Do' }));
    expect(onToDo).toHaveBeenCalledWith(true);
  });
});

/**
 * #92, the table half. `DueDateCell` rendered `styles.overdue = 'text-primary-2'` and nothing
 * else, so the urgency existed only as a colour — the same defect as `TaskCard`'s red `Tag`,
 * and it has to be fixed in step with it rather than separately.
 */
describe('due-date urgency is not conveyed by colour alone (#92)', () => {
  it('states that an overdue date is overdue', () => {
    render(<DueDateCell date="20 July, 2026" urgency="overdue" />);
    expect(screen.getByText(/20 July, 2026/).textContent).toContain('overdue');
  });

  it('control: says nothing when the date is not urgent', () => {
    const { container } = render(<DueDateCell date="20 July, 2026" urgency="normal" />);
    expect(screen.getByText(/20 July, 2026/).textContent).not.toContain('overdue');
    expect(container.querySelector('.sr-only')).toBeNull();
  });

  it('keeps the colour treatment it always had', () => {
    // The state is additive. If a refactor ever traded the colour for the text, a
    // colour-blind sighted user would gain nothing and a sighted user would lose the cue.
    render(<DueDateCell date="20 July, 2026" urgency="overdue" />);
    expect(screen.getByText(/20 July, 2026/).className).toContain('text-primary-2');
  });

  it('reaches a row through TaskTableRow, which is the only way a table renders one', () => {
    render(
      <table>
        <tbody>
          <TaskTableRow
            index={1}
            title="Fix auth bug"
            dueDate="20 July, 2026"
            dueDateUrgency="overdue"
          />
        </tbody>
      </table>,
    );
    expect(screen.getByText(/20 July, 2026/).textContent).toContain('overdue');
  });

  it('forwards a caller-supplied string through the row', () => {
    render(
      <table>
        <tbody>
          <TaskTableRow
            index={1}
            title="Fix auth bug"
            dueDate="20 July, 2026"
            dueDateUrgency="overdue"
            dueDateUrgencyLabel={{ overdue: 'past due' }}
          />
        </tbody>
      </table>,
    );
    const cell = screen.getByText(/20 July, 2026/).textContent ?? '';
    expect(cell).toContain('past due');
    expect(cell).not.toContain('overdue');
  });
});

/**
 * The requirement #92 states as "TaskCard and DueDateCell should agree, the same way
 * `DUE_DATE_URGENCY_COLOR` already makes their colours agree."
 *
 * Asserted as agreement between the two renderers rather than each against a hardcoded
 * literal — two tests that each pin `'overdue'` separately pass just as happily after one
 * component's default is changed and the other's is not, which is the drift this is for.
 */
describe('TaskCard and DueDateCell say the same thing for the same urgency (#92)', () => {
  it.each(['normal', 'soon', 'overdue'] as const)('agree on %s', (urgency) => {
    const card = render(
      <TaskCard title="Fix auth bug" dueDateText="20 July, 2026" dueDateUrgency={urgency} />,
    );
    const cardState = card.container.querySelector('.sr-only')?.textContent ?? '';
    card.unmount();

    const cell = render(<DueDateCell date="20 July, 2026" urgency={urgency} />);
    const cellState = cell.container.querySelector('.sr-only')?.textContent ?? '';

    expect(cardState).toBe(cellState);
  });

  it('control: the probe can tell them apart, so agreement above is not vacuous', () => {
    // If the reader returned '' for everything, every case above would pass regardless.
    const overdue = render(<DueDateCell date="20 July, 2026" urgency="overdue" />);
    expect(overdue.container.querySelector('.sr-only')?.textContent).toBe(', overdue');
    overdue.unmount();

    const soon = render(<DueDateCell date="20 July, 2026" urgency="soon" />);
    expect(soon.container.querySelector('.sr-only')?.textContent).toBe(', due soon');
  });
});

/** #15, the table half — identical slot and identical reasoning to `TaskListView`'s. */
describe('TaskTable empty slot (#15)', () => {
  it('takes a whole EmptyState, reaching props the flattened trio cannot', () => {
    render(
      <TaskTable groups={[]} empty={<EmptyState title="All clear" label="No tasks here" />} />,
    );

    expect(screen.getByRole('group', { name: 'No tasks here' })).toBeDefined();
    expect(screen.getByText('All clear')).toBeDefined();
  });

  it('lets the slot win over the flattened props', () => {
    render(
      <TaskTable
        groups={[]}
        emptyTitle="Configured"
        empty={<EmptyState title="Composed" label="Composed" />}
      />,
    );

    expect(screen.getByText('Composed')).toBeDefined();
    expect(screen.queryByText('Configured')).toBeNull();
  });

  it('control: the flattened props still work when no slot is given', () => {
    render(<TaskTable groups={[]} emptyTitle="Configured" />);
    expect(screen.getByText('Configured')).toBeDefined();
  });
});
