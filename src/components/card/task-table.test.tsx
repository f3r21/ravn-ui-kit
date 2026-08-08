import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import {
  TaskTable,
  TaskTableRow,
  DueDateCell,
  EstimationCell,
  DEFAULT_COLUMNS,
  resolveColumns,
  type TaskTableRowProps,
  type TaskTableColumn,
} from './task-table';
import type { HeadingLevel } from '../../types/heading-level';
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

/**
 * #95. `TaskCard` gained an actions slot in #9 for a per-task overflow menu; `TaskTableRow`
 * never got the equivalent, so a list view built on it loses Edit/Delete entirely — a
 * functional regression rather than a styling one, which is why the consumer could not migrate
 * its list half.
 */
describe('TaskTableRow actions slot (#95)', () => {
  const rowWith = (props: Partial<TaskTableRowProps>) => (
    <table>
      <tbody>
        <TaskTableRow index={1} title="Fix auth bug" {...props} />
      </tbody>
    </table>
  );

  it('renders a control passed into the slot', () => {
    render(
      rowWith({
        actions: (
          <button type="button" aria-label="Task options for Fix auth bug">
            ⋯
          </button>
        ),
      }),
    );
    expect(screen.getByRole('button', { name: 'Task options for Fix auth bug' })).toBeDefined();
  });

  /**
   * The control. A slot that always renders its wrapper passes the case above and adds a stray
   * tab stop to every row of a long table — invisible to a reader, obvious to anyone tabbing.
   */
  it('control: a row with no actions renders no extra button', () => {
    render(rowWith({}));
    expect(screen.queryByRole('button')).toBeNull();
  });

  /**
   * The assertion the issue says will not get written unless it is asked for, and it is the one
   * that catches a missing `stopPropagation`. Driven with real user input rather than
   * `element.click()`, which under-reports React Aria press handling.
   */
  it('using the slot does not open the row', async () => {
    const onClick = vi.fn();
    const onAction = vi.fn();
    const user = userEvent.setup();
    render(
      rowWith({
        onClick,
        actions: (
          <button type="button" aria-label="Task options for Fix auth bug" onClick={onAction}>
            ⋯
          </button>
        ),
      }),
    );

    await user.click(screen.getByRole('button', { name: 'Task options for Fix auth bug' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('and the same holds from the keyboard, where activation synthesises a click', async () => {
    const onClick = vi.fn();
    const onAction = vi.fn();
    const user = userEvent.setup();
    render(
      rowWith({
        onClick,
        actions: (
          <button type="button" aria-label="Task options for Fix auth bug" onClick={onAction}>
            ⋯
          </button>
        ),
      }),
    );

    screen.getByRole('button', { name: 'Task options for Fix auth bug' }).focus();
    await user.keyboard('{Enter}');
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('control: the row still opens when the row itself is clicked', async () => {
    // Otherwise "onClick did not fire" would pass on a row whose onClick never fires at all.
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(rowWith({ onClick, actions: <button type="button">⋯</button> }));

    await user.click(screen.getByText('Fix auth bug'));
    expect(onClick).toHaveBeenCalled();
  });
});

/**
 * #95's second half. The group header was a hardcoded `<h3>`, so a consumer running
 * `<h1>` page → `<h2>` status got `h1 → h3` — a skipped level axe reports as `heading-order`,
 * with no prop to reach it.
 */
describe('TaskTable group heading level (#95)', () => {
  // `HeadingLevel` deliberately excludes 1 — a kit component cannot know it owns the page's
  // single top-level heading. Typing the helper as the real union keeps that true here too.
  const groups = (headingLevel?: HeadingLevel) => [
    {
      title: 'To Do (01)',
      headingLevel,
      rows: [{ index: 1, title: 'Fix auth bug', headingLevel: 4 as const }],
    },
  ];

  it('defaults to h3, so existing callers are unchanged', () => {
    render(<TaskTable groups={groups()} />);
    expect(screen.getByRole('heading', { name: 'To Do (01)' }).tagName).toBe('H3');
  });

  it('takes a caller-supplied level', () => {
    render(<TaskTable groups={groups(2)} />);
    expect(screen.getByRole('heading', { name: 'To Do (01)' }).tagName).toBe('H2');
  });

  /**
   * Asserted as the whole outline rather than one level, because a skipped level is a relation
   * between headings — querying `h2` alone cannot see that the row beneath it is an `h4`.
   */
  it('nests with the rows, producing a strictly increasing outline', () => {
    render(<TaskTable groups={groups(3)} />);

    const levels = screen.getAllByRole('heading').map((h) => Number(h.tagName.slice(1)));

    expect(levels).toEqual([3, 4]);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  it('control: the probe catches a skip, so the case above is not vacuous', () => {
    // Group h2 with rows at h4 is exactly the defect — one level skipped.
    render(
      <TaskTable
        groups={[
          {
            title: 'To Do (01)',
            headingLevel: 2,
            rows: [{ index: 1, title: 'Fix auth bug', headingLevel: 4 as const }],
          },
        ]}
      />,
    );

    const levels = screen.getAllByRole('heading').map((h) => Number(h.tagName.slice(1)));
    expect(levels).toEqual([2, 4]);
    expect(levels[1] - levels[0]).toBeGreaterThan(1);
  });
});

/** #94 — the cell and the card share the rule while keeping their own words. */
describe('points wording (#94)', () => {
  it('the cell pluralises, including zero', () => {
    const { rerender } = render(<EstimationCell points={1} />);
    expect(screen.getByText('1 Point')).toBeDefined();

    rerender(<EstimationCell points={0} />);
    expect(screen.getByText('0 Points')).toBeDefined();
  });

  it('the card and the cell disagree on the word and agree on the rule', () => {
    // Deliberate: each wording carries its own Figma citation, neither re-derivable. What must
    // not drift is where the singular breaks.
    const card = render(<TaskCard title="T" points={1} />);
    expect(card.getByText('1 Pt')).toBeDefined();
    card.unmount();

    render(<EstimationCell points={1} />);
    expect(screen.getByText('1 Point')).toBeDefined();
  });

  it('a row forwards its formatter to the cell', () => {
    render(
      <table>
        <tbody>
          <TaskTableRow
            index={1}
            title="Fix auth bug"
            estimationPoints={1}
            formatPoints={(n) => `${n} punto`}
          />
        </tbody>
      </table>,
    );
    expect(screen.getByText('1 punto')).toBeDefined();
  });
});

/**
 * #111. `TaskCard` announced "Unassigned" for a task with no assignee — `Avatar` is
 * unconditional there and carries the state via `fallbackLabel` (#47). `TaskTableRow` rendered
 * the whole cell conditionally, so the same task announced **nothing**: an empty cell with no
 * indication in the accessibility tree that the column was even about an assignee.
 *
 * The design settles the direction rather than symmetry doing it: both `Task Assign Name Cell`
 * instances in `Task Column02.md` carry an Avatar, and no export anywhere draws an unassigned
 * state — so there is no basis for an empty cell.
 */
describe('the unassigned state is announced in a row, not only on a card (#111)', () => {
  const row = (props: Partial<TaskTableRowProps>) => (
    <table>
      <tbody>
        <TaskTableRow index={1} title="Fix auth bug" {...props} />
      </tbody>
    </table>
  );

  it('announces the fallback when there is no assignee', () => {
    render(row({}));
    expect(screen.getByRole('img', { name: 'Unassigned' })).toBeDefined();
  });

  /**
   * The control. A fix that renders the fallback unconditionally passes the case above and is
   * wrong — the row would announce "Unassigned" for a task that has an assignee.
   */
  it('control: a row with an assignee announces the person, not the fallback', () => {
    render(row({ assigneeName: 'Jerome Bell' }));

    expect(screen.getByRole('img', { name: 'Jerome Bell' })).toBeDefined();
    expect(screen.queryByRole('img', { name: 'Unassigned' })).toBeNull();
  });

  it('leaves textContent alone for the assigned case, so name queries keep working', () => {
    render(row({ assigneeName: 'Jerome Bell' }));
    expect(screen.getByText('Jerome Bell')).toBeDefined();
  });

  it('does not repeat the fallback as visible text', () => {
    // `Avatar` already carries it. A second copy in the name span would announce it twice.
    render(row({}));
    expect(screen.queryByText('Unassigned')).toBeNull();
  });

  it('takes a caller-supplied label', () => {
    render(row({ unassignedLabel: 'Nobody yet' }));
    expect(screen.getByRole('img', { name: 'Nobody yet' })).toBeDefined();
  });

  /**
   * The assertion that catches future drift, and the one whose absence let this arise: the card
   * and the row are compared **against each other** for the same input, rather than each being
   * pinned to the literal 'Unassigned' separately. Two separate literal pins pass happily after
   * one component changes and the other does not.
   */
  it('the card and the row announce the same thing for the same absent assignee', () => {
    const card = render(<TaskCard title="Fix auth bug" />);
    const cardName = card.getByRole('img').getAttribute('aria-label');
    card.unmount();

    render(row({}));
    const rowName = screen.getByRole('img').getAttribute('aria-label');

    expect(rowName).toBe(cardName);
    // Control: the probe reads a real name rather than agreeing on null for both.
    expect(cardName).toBe('Unassigned');
  });
});

/** #90 — the last two blocks of hardcoded English in this file. */
describe('visible copy is overridable (#90)', () => {
  it('the details link defaults to "Details" and takes an override', () => {
    const { rerender } = render(
      <table>
        <tbody>
          <TaskTableRow index={1} title="T" onViewDetails={vi.fn()} />
        </tbody>
      </table>,
    );
    expect(screen.getByRole('button', { name: 'Details' })).toBeDefined();

    rerender(
      <table>
        <tbody>
          <TaskTableRow index={1} title="T" onViewDetails={vi.fn()} detailsLabel="Detalles" />
        </tbody>
      </table>,
    );
    expect(screen.getByRole('button', { name: 'Detalles' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Details' })).toBeNull();
  });

  it('the column headers default to English', () => {
    render(<TaskTable groups={[{ title: 'To Do', rows: [] }]} />);
    for (const h of ['# Task Name', 'Task Tags', 'Estimate', 'Task Assign Name', 'Due Date']) {
      expect(screen.getByText(h)).toBeDefined();
    }
  });

  it('takes a partial columnLabels override and merges the rest', () => {
    render(
      <TaskTable
        groups={[{ title: 'To Do', rows: [] }]}
        columnLabels={{ name: '# Tarea', dueDate: 'Vencimiento' }}
      />,
    );

    expect(screen.getByText('# Tarea')).toBeDefined();
    expect(screen.getByText('Vencimiento')).toBeDefined();
    // Untouched keys keep their defaults.
    expect(screen.getByText('Task Tags')).toBeDefined();
    expect(screen.queryByText('# Task Name')).toBeNull();
  });

  it('control: the column order is not overridable, only the words', () => {
    // #97 is the issue for a consumer-defined column set. This deliberately is not it.
    render(<TaskTable groups={[{ title: 'To Do', rows: [] }]} columnLabels={{ name: 'A' }} />);
    const headers = [...document.querySelectorAll('div')]
      .map((d) => d.textContent)
      .filter((t) => t === 'A');
    expect(headers.length).toBeGreaterThan(0);
  });
});

/**
 * #97. The column schema was frozen in two module constants, so a consumer could not add a
 * Status column, drop Estimation, reorder any of it, or set a width. `columns` is the fix, and
 * it is **additive** — omitted, the table renders exactly what it always did.
 *
 * The interesting assertions are not "the prop works". They are the two properties that
 * override paths destroy: that the four renderers still agree, and that the width invariant
 * survived becoming settable.
 */
describe('consumer-defined columns (#97)', () => {
  const row: TaskTableRowProps = {
    index: 1,
    title: 'Fix auth bug',
    estimationPoints: 4,
    assigneeName: 'Jerome Bell',
    dueDate: 'Tomorrow',
  };
  const table = (columns?: readonly TaskTableColumn[]) =>
    render(<TaskTable groups={[{ title: 'To Do', rows: [row] }]} columns={columns} />);

  /**
   * The invariant that used to be emergent. 500 + 168 + 140 + 168 + 132 = 1108, the spec's
   * "Task Table Row" width — a property of two constants that nothing asserted. `width` being
   * settable is exactly what kills that kind of property, so it is pinned here rather than
   * left to be rediscovered when it drifts.
   */
  it('the default column set still sums to the spec 1108px', () => {
    const total = resolveColumns(undefined, undefined).reduce((n, c) => n + c.width, 0);
    expect(total).toBe(1108);
  });

  it('the default set is what renders when `columns` is omitted', () => {
    table();
    for (const label of ['# Task Name', 'Task Tags', 'Estimate', 'Task Assign Name', 'Due Date']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it('reorders', () => {
    table([{ key: 'dueDate' }, { key: 'name' }]);
    const headers = [...document.querySelectorAll('div')]
      .map((d) => d.textContent)
      .filter((t) => t === 'Due Date' || t === '# Task Name');
    expect(headers[0]).toBe('Due Date');
  });

  /**
   * The agreement claim, and the reason it is asserted through the DOM rather than through the
   * resolver. Dropping a column has to remove it from the header, the `<colgroup>` and every
   * body row **together** — those are four renderers that used to agree only because they read
   * the same two constants.
   */
  it('dropping a column removes it from the header, the colgroup and the rows together', () => {
    const { container } = table([{ key: 'name' }, { key: 'dueDate' }]);

    expect(screen.queryByText('Estimate')).toBeNull();
    expect(screen.queryByText('4 Points')).toBeNull();
    expect(container.querySelectorAll('colgroup col')).toHaveLength(2);
    expect(container.querySelectorAll('tbody tr:last-child td')).toHaveLength(2);
  });

  /**
   * Control for the case above: with the column present, every one of those four probes returns
   * the opposite answer. Without this, "the estimate is gone" would be equally consistent with
   * a query that never matched anything.
   */
  it('control: with Estimation present, all four probes find it', () => {
    const { container } = table([{ key: 'name' }, { key: 'estimation' }, { key: 'dueDate' }]);

    expect(screen.getAllByText('Estimate').length).toBeGreaterThan(0);
    expect(screen.getByText('4 Points')).toBeDefined();
    expect(container.querySelectorAll('colgroup col')).toHaveLength(3);
    expect(container.querySelectorAll('tbody tr:last-child td')).toHaveLength(3);
  });

  it('the skeleton follows the same column set', () => {
    const { container } = render(
      <TaskTable groups={[]} isLoading columns={[{ key: 'name' }, { key: 'dueDate' }]} />,
    );
    // Every skeleton row, not just the first — the loading state renders five.
    for (const tr of container.querySelectorAll('tbody tr')) {
      expect(tr.querySelectorAll('td')).toHaveLength(2);
    }
  });

  it('a custom column renders its own cell from the row data', () => {
    table([
      { key: 'name' },
      {
        key: 'status',
        label: 'Status',
        width: 120,
        renderCell: (r) => <span>{r.title === 'Fix auth bug' ? 'Blocked' : 'Open'}</span>,
      },
    ]);
    expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
    expect(screen.getByText('Blocked')).toBeDefined();
  });

  it('a custom width changes the rendered width, and the total with it', () => {
    const resolved = resolveColumns([{ key: 'name', width: 200 }, { key: 'dueDate' }], undefined);
    expect(resolved[0].width).toBe(200);
    expect(resolved.reduce((n, c) => n + c.width, 0)).toBe(332);
  });

  /**
   * Precedence, stated in the JSDoc and pinned here because two ways to set one string is how an
   * API rots. `columns[].label` wins; `columnLabels` still reaches a column that sets no label.
   */
  it('columns[].label beats columnLabels, and columnLabels still reaches the rest', () => {
    render(
      <TaskTable
        groups={[{ title: 'To Do', rows: [row] }]}
        columnLabels={{ name: 'FROM LABELS', dueDate: 'ALSO FROM LABELS' }}
        columns={[{ key: 'name', label: 'FROM COLUMNS' }, { key: 'dueDate' }]}
      />,
    );
    expect(screen.getAllByText('FROM COLUMNS').length).toBeGreaterThan(0);
    expect(screen.queryByText('FROM LABELS')).toBeNull();
    expect(screen.getAllByText('ALSO FROM LABELS').length).toBeGreaterThan(0);
  });

  /**
   * `DEFAULT_COLUMNS` carries keys only. Baking labels into it looks tidier and silently breaks
   * `columnLabels`, because `resolveColumns` falls back with `??` and a label on the column
   * always wins. That is not hypothetical — it is what the first version of this did, and #90's
   * existing tests caught it.
   */
  it('DEFAULT_COLUMNS carries keys only, so columnLabels can still be reached', () => {
    expect(DEFAULT_COLUMNS.every((c) => !('label' in c) && !('width' in c))).toBe(true);
  });

  it('the first column carries the left border wherever it is', () => {
    const { container } = table([{ key: 'dueDate' }, { key: 'name' }]);
    const cells = container.querySelectorAll('tbody tr:last-child td');
    expect(cells[0].className).toContain('border-l');
    expect(cells[1].className).not.toContain('border-l');
  });
});
