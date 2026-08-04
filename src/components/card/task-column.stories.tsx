import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TaskColumn } from './task-column';

const meta: Meta<typeof TaskColumn> = {
  title: 'Layout/TaskColumn',
  component: TaskColumn,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    accentColor: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'neutral'],
    },
  },
  args: {
    onAddTask: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTasks = [
  {
    title: 'Set up project scaffolding',
    points: 3,
    dueDateText: '2 DAYS',
    dueDateUrgency: 'warning' as const,
    tags: [{ label: 'FRONTEND', variant: 'secondary' as const }],
    assigneeName: 'Jerome Bell',
    reactions: [{ emoji: '💬', count: 3 }],
  },
  {
    title: 'Design system token mapping',
    points: 5,
    tags: [{ label: 'DESIGN', variant: 'tertiary' as const }],
    assigneeName: 'Jane Doe',
    reactions: [{ emoji: '📎', count: 2 }],
  },
];

export const Default: Story = {
  args: {
    title: 'To Do',
    count: 8,
    accentColor: 'neutral',
    tasks: sampleTasks,
  },
};

export const Playground: Story = {
  args: {
    title: 'To Do',
    count: sampleTasks.length,
    tasks: sampleTasks,
  },
};

export const ToDo: Story = {
  args: {
    title: 'To Do',
    count: 8,
    accentColor: 'neutral',
    tasks: sampleTasks,
  },
};

export const InProgress: Story = {
  args: {
    title: 'In Progress',
    count: 3,
    accentColor: 'tertiary',
    tasks: [sampleTasks[0]],
  },
};

export const Done: Story = {
  args: {
    title: 'Done',
    count: 14,
    accentColor: 'secondary',
    tasks: [],
  },
};

export const Blocked: Story = {
  args: {
    title: 'Blocked',
    count: 1,
    accentColor: 'primary',
    tasks: [
      {
        title: 'Fix critical auth bug',
        points: 8,
        dueDateText: 'OVERDUE',
        dueDateUrgency: 'overdue' as const,
        tags: [{ label: 'BUG', variant: 'primary' as const }],
        assigneeName: 'Fernando Ramirez',
        reactions: [{ emoji: '💬', count: 12 }],
      },
    ],
    onAddTask: undefined,
  },
};
