import type { Meta, StoryObj } from '@storybook/react';
import { TaskListView } from './task-list-view';

const sampleTasks = [
  {
    title: 'Set up project',
    points: 3,
    dueDateText: '2 DÍAS',
    dueDateUrgency: 'warning' as const,
    tags: [{ label: 'FRONTEND', variant: 'secondary' as const }],
    assigneeName: 'Jerome Bell',
  },
  {
    title: 'Fix auth bug',
    points: 8,
    dueDateText: 'VENCIDO',
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
    tasks: sampleTasks,
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tasks: sampleTasks,
  },
};

export const Playground: Story = {
  args: {
    tasks: sampleTasks,
  },
};

export const Empty: Story = {
  args: { tasks: [] },
};
