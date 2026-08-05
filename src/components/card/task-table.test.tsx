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
});
