import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from './empty-state';
import { TaskListView } from '../card/task-list-view';
import { TaskTable } from '../card/task-table';

describe('EmptyState', () => {
  it('is a findable, named group rather than three loose strings', () => {
    render(<EmptyState title="No tasks yet" />);

    const group = screen.getByRole('group', { name: 'No results' });
    expect(group).not.toBeNull();
    expect(group.textContent).toContain('No tasks yet');
  });

  it('takes a caller-supplied name, for when two can be on screen at once', () => {
    render(<EmptyState title="Nothing here" label="No matching tasks" />);
    expect(screen.getByRole('group', { name: 'No matching tasks' })).not.toBeNull();
  });

  it('is not a live region', () => {
    // A live region announces *changes* to its contents; this mounts with its text
    // already inside, so role="status" here would announce nothing at all. Pinned so
    // nobody "improves" it back — see the component's doc comment.
    const { container } = render(<EmptyState title="No tasks yet" />);
    const group = container.querySelector('[role="group"]')!;

    expect(group.getAttribute('role')).toBe('group');
    expect(group.hasAttribute('aria-live')).toBe(false);
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders the description only when given one', () => {
    const { rerender } = render(<EmptyState title="Empty" />);
    expect(screen.queryByText('Try clearing a filter.')).toBeNull();

    rerender(<EmptyState title="Empty" description="Try clearing a filter." />);
    expect(screen.getByText('Try clearing a filter.')).not.toBeNull();
  });

  it('renders an icon slot only when given one', () => {
    const { container, rerender } = render(<EmptyState title="Empty" />);
    expect(container.querySelector('svg')).toBeNull();

    rerender(<EmptyState title="Empty" icon={<svg data-glyph="true" />} />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  /**
   * #11. `[&>svg]:w-full [&>svg]:h-full` used to sit on the icon frame, at (0,2,0)
   * specificity — it outranked a consumer's own `size-*` utility (0,1,0), so the class was
   * present but never won the cascade. This suite runs on jsdom with no stylesheet, so it
   * cannot observe the cascade directly; what it pins is that the losing class is gone.
   */
  it('does not carry a class that would outrank a consumer icon size', () => {
    const { container } = render(
      <EmptyState title="Empty" icon={<svg data-testid="glyph" className="size-6" />} />,
    );
    const frame = container.querySelector('svg')?.parentElement;
    expect(frame?.className).not.toContain('[&>svg]:w-full');
    expect(frame?.className).not.toContain('[&>svg]:h-full');
    expect([...screen.getByTestId('glyph').classList]).toContain('size-6');
  });

  it('renders a working action slot', async () => {
    const onPress = vi.fn();
    const user = userEvent.setup();
    render(
      <EmptyState
        title="Empty"
        action={
          <button type="button" onClick={onPress}>
            Create task
          </button>
        }
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Create task' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('forwards a ref and spreads unrecognised props onto the root element (#11)', () => {
    const ref = createRef<HTMLDivElement>();
    render(<EmptyState title="Empty" ref={ref} data-testid="empty" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId('empty')).toBeDefined();
  });
});

describe('the kit call sites that used to hardcode a string', () => {
  it('TaskListView renders an EmptyState, with an overridable headline', () => {
    const { rerender } = render(<TaskListView title="Working" tasks={[]} />);
    expect(screen.getByRole('group').textContent).toContain('No tasks in this view');

    rerender(<TaskListView title="Working" tasks={[]} emptyTitle="This sprint is clear" />);
    expect(screen.getByRole('group').textContent).toContain('This sprint is clear');
  });

  it('TaskTable renders an EmptyState, with an overridable headline', () => {
    const { rerender } = render(<TaskTable groups={[]} />);
    expect(screen.getByRole('group').textContent).toContain('No tasks yet');

    rerender(<TaskTable groups={[]} emptyTitle="Nothing to show" />);
    expect(screen.getByRole('group').textContent).toContain('Nothing to show');
  });

  it('shows the empty state only when there is nothing to show', () => {
    render(<TaskListView title="Working" tasks={[{ title: 'A real task' }]} />);

    expect(screen.queryByRole('group')).toBeNull();
    expect(screen.getByText('A real task')).not.toBeNull();
  });

  it('shows skeletons rather than an empty state while loading', () => {
    // An empty array plus isLoading means "not arrived yet", not "nothing exists" —
    // reporting "No tasks yet" during the first fetch would be a lie.
    render(<TaskListView title="Working" tasks={[]} isLoading />);
    expect(screen.queryByRole('group')).toBeNull();
  });
});
