import type { Meta, StoryObj } from '@storybook/react';
import { TaskColumn } from './task-column';

const meta: Meta<typeof TaskColumn> = {
  title: 'UI/TaskColumn',
  component: TaskColumn,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTasks = [
  {
    title: 'Set up project scaffolding',
    points: 3,
    dueDateText: '2 DÍAS',
    dueDateUrgency: 'warning' as const,
    tags: [{ label: 'FRONTEND', variant: 'secondary' as const }],
    assigneeName: 'Jerome Bell',
    commentsCount: 3,
  },
  {
    title: 'Design system token mapping',
    points: 5,
    tags: [{ label: 'DESIGN', variant: 'tertiary' as const }],
    assigneeName: 'Jane Doe',
    attachmentsCount: 2,
  },
];

export const ToDo: Story = {
  args: {
    title: 'To Do',
    count: 8,
    accentColor: 'neutral',
    tasks: sampleTasks,
    onAddTask: () => alert('Nueva tarea'),
  },
};

export const InProgress: Story = {
  args: {
    title: 'In Progress',
    count: 3,
    accentColor: 'tertiary',
    tasks: [sampleTasks[0]],
    onAddTask: () => alert('Nueva tarea'),
  },
};

export const Done: Story = {
  args: {
    title: 'Done',
    count: 14,
    accentColor: 'secondary',
    tasks: [],
    onAddTask: () => alert('Nueva tarea'),
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
        dueDateText: 'VENCIDO',
        dueDateUrgency: 'overdue' as const,
        tags: [{ label: 'BUG', variant: 'primary' as const }],
        assigneeName: 'Fernando Ramirez',
        commentsCount: 12,
      },
    ],
  },
};
