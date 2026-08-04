import type { Meta, StoryObj } from '@storybook/react';
import { TaskListView } from './task-list-view';

const meta: Meta<typeof TaskListView> = {
  title: 'UI/TaskListView',
  component: TaskListView,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tasks: [
      { title: 'Set up project', points: 3, dueDateText: '2 DÍAS', dueDateUrgency: 'warning', tags: [{ label: 'FRONTEND', variant: 'secondary' }], assigneeName: 'Jerome Bell' },
      { title: 'Fix auth bug', points: 8, dueDateText: 'VENCIDO', dueDateUrgency: 'overdue', tags: [{ label: 'BUG', variant: 'primary' }], assigneeName: 'Jane Doe' },
    ],
  },
};

export const Empty: Story = {
  args: { tasks: [] },
};
