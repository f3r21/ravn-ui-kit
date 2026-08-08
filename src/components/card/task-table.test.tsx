import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TaskTable, TaskTableRow, type TaskTableRowProps } from './task-table';

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
