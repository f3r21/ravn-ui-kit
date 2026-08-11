import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskListView } from './task-list-view';
import { EmptyState } from '../empty-state/empty-state';

const tasks = [{ title: 'Fix auth bug' }, { title: 'Ship the board' }];

describe('TaskListView Component', () => {
  it('is a plain container by default — no unnamed landmark', () => {
    // A `<section>` is only a landmark once it has an accessible name, and a board of three
    // columns would otherwise emit three anonymous ones. Opt-in, not default.
    const { container } = render(<TaskListView title="Working (02)" tasks={tasks} />);
    expect(screen.queryByRole('region')).toBeNull();
    expect((container.firstChild as HTMLElement).tagName).toBe('DIV');
  });

  it('becomes a named region when given a label', () => {
    const { container } = render(
      <TaskListView title="Working (02)" label="Working" tasks={tasks} />,
    );
    expect(screen.getByRole('region', { name: 'Working' })).toBeDefined();
    expect((container.firstChild as HTMLElement).tagName).toBe('SECTION');
  });

  it('nests its cards under its own header rather than beside them', () => {
    // Both were level 3, so `getAllByRole('heading', { level: 3 })` returned the column
    // header interleaved with its own cards and neither could be told from the other.
    render(<TaskListView title="Working (02)" headingLevel={2} tasks={tasks} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Working (02)' })).toBeDefined();
    const cardTitles = screen.getAllByRole('heading', { level: 3 });
    expect(cardTitles.map((h) => h.textContent)).toEqual(['Fix auth bug', 'Ship the board']);
  });

  it('still renders the empty state when there are no tasks', () => {
    render(<TaskListView title="Working (00)" tasks={[]} emptyTitle="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeDefined();
  });
});

/**
 * #15. `emptyTitle`/`emptyDescription`/`emptyAction` flatten three of `EmptyState`'s five,
 * which left `icon` and `label` unreachable — and `label` is the one that matters, since two
 * empty states on one screen otherwise present two identically-named groups.
 */
describe('TaskListView empty slot (#15)', () => {
  it('takes a whole EmptyState, reaching props the flattened trio cannot', () => {
    render(
      <TaskListView
        title="Working"
        tasks={[]}
        empty={<EmptyState title="All clear" label="No working tasks" />}
      />,
    );

    expect(screen.getByRole('group', { name: 'No working tasks' })).toBeDefined();
    expect(screen.getByText('All clear')).toBeDefined();
  });

  it('lets the slot win over the flattened props', () => {
    render(
      <TaskListView
        title="Working"
        tasks={[]}
        emptyTitle="Configured"
        empty={<EmptyState title="Composed" label="Composed" />}
      />,
    );

    expect(screen.getByText('Composed')).toBeDefined();
    expect(screen.queryByText('Configured')).toBeNull();
  });

  it('control: the flattened props still work when no slot is given', () => {
    // Additive, not a replacement — every existing caller is unchanged.
    render(<TaskListView title="Working" tasks={[]} emptyTitle="Configured" />);
    expect(screen.getByText('Configured')).toBeDefined();
  });

  it('shows neither when there are tasks to show', () => {
    render(
      <TaskListView
        title="Working"
        tasks={[{ title: 'A real task' }]}
        empty={<EmptyState title="Composed" />}
      />,
    );
    expect(screen.queryByText('Composed')).toBeNull();
    expect(screen.getByText('A real task')).toBeDefined();
  });

  it('forwards a ref and spreads unrecognised props onto the root element (#11)', () => {
    const ref = createRef<HTMLElement>();
    render(<TaskListView title="Working" tasks={tasks} ref={ref} data-testid="list-view" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId('list-view')).toBe(ref.current);
  });
});
