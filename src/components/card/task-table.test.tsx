import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TaskTable } from './task-table';

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
});
