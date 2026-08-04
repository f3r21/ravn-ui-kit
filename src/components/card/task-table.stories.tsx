import type { Meta, StoryObj } from '@storybook/react';
import { TaskTable } from './task-table';

const meta: Meta<typeof TaskTable> = {
  title: 'UI/TaskTable',
  component: TaskTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rows: [
      { title: 'Set up project scaffolding', assigneeName: 'Jerome Bell', dueDate: 'Aug 10', estimationPoints: 3, tags: [{ label: 'FRONTEND', variant: 'secondary' }] },
      { title: 'Fix critical auth bug', assigneeName: 'Jane Doe', dueDate: 'Aug 5', dueDateUrgency: 'overdue', estimationPoints: 8, tags: [{ label: 'BUG', variant: 'primary' }] },
      { title: 'Design token mapping', dueDate: 'Aug 15', dueDateUrgency: 'warning', estimationPoints: 5, tags: [{ label: 'DESIGN', variant: 'tertiary' }] },
    ],
  },
};
