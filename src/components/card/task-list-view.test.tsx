import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskListView } from './task-list-view';

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
