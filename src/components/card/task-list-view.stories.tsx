import type { Meta, StoryObj } from '@storybook/react';
import { TaskListView } from './task-list-view';

const sampleTasks = [
  {
    title: 'Set up project',
    points: 3,
    dueDateText: '2 DAYS',
    dueDateUrgency: 'warning' as const,
    tags: [{ label: 'FRONTEND', variant: 'secondary' as const }],
    assigneeName: 'Jerome Bell',
  },
  {
    title: 'Fix auth bug',
    points: 8,
    dueDateText: 'OVERDUE',
    dueDateUrgency: 'overdue' as const,
    tags: [{ label: 'BUG', variant: 'primary' as const }],
    assigneeName: 'Jane Doe',
  },
];

const meta: Meta<typeof TaskListView> = {
  title: 'Layout/TaskListView',
  component: TaskListView,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Working (03)',
    tasks: sampleTasks,
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Working (03)',
    tasks: sampleTasks,
  },
};

export const Playground: Story = {
  args: {
    title: 'Working (03)',
    tasks: sampleTasks,
  },
};

export const Empty: Story = {
  args: { title: 'Backlog (0)', tasks: [] },
};

export const Loading: Story = {
  args: { title: 'Working (03)', tasks: [], isLoading: true },
};

/**
 * Figma's `Frame 654` (`Mockups/Dashboard Default View/Dashboard Mockup.md`)
 * lays out 3 `Task List View` instances side by side, `flex-direction: row`,
 * `gap: 32px` — this is the real "board" layout; there is no separate
 * per-column background/border/radius component wrapping each list.
 */
export const Board: Story = {
  render: () => (
    <div className="flex flex-row items-start gap-8">
      <TaskListView title="Working (03)" tasks={sampleTasks} className="w-[348px]" />
      <TaskListView title="In review (01)" tasks={[sampleTasks[0]]} className="w-[348px]" />
      <TaskListView title="Done (14)" tasks={[]} className="w-[348px]" />
    </div>
  ),
};
