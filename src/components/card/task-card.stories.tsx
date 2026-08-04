import type { Meta, StoryObj } from '@storybook/react';
import { TaskCard } from './task-card';

const meta: Meta<typeof TaskCard> = {
  title: 'UI/TaskCard',
  component: TaskCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Working (03) - RAVN Challenge',
    points: 3,
    dueDateText: '3 DÍAS',
    dueDateUrgency: 'warning',
    tags: [
      { label: 'BACKEND', variant: 'secondary' },
      { label: 'HIGH', variant: 'tertiary' },
    ],
    assigneeName: 'Jerome Bell',
    commentsCount: 5,
    attachmentsCount: 2,
  },
};

export const Overdue: Story = {
  args: {
    title: 'Fix Critical GraphQL Bug',
    points: 5,
    dueDateText: 'VENCIDO',
    dueDateUrgency: 'overdue',
    tags: [{ label: 'BUG', variant: 'primary' }],
    assigneeName: 'Fernando Ramírez',
    commentsCount: 12,
  },
};
