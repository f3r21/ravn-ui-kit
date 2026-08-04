import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TaskCard } from './task-card';

const meta: Meta<typeof TaskCard> = {
  title: 'Components/TaskCard',
  component: TaskCard,
  tags: ['autodocs'],
  argTypes: {
    dueDateUrgency: {
      control: 'select',
      options: ['normal', 'warning', 'overdue'],
    },
  },
  args: {
    onClick: fn(),
    onReactionToggle: fn(),
    title: 'Working (03) - RAVN Challenge',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Working (03) - RAVN Challenge',
    points: 3,
    dueDateText: '3 DAYS',
    dueDateUrgency: 'warning',
    tags: [
      { label: 'BACKEND', variant: 'secondary' },
      { label: 'HIGH', variant: 'tertiary' },
    ],
    assigneeName: 'Jerome Bell',
    reactions: [
      { emoji: '💬', count: 5 },
      { emoji: '📎', count: 2 },
    ],
  },
};

export const Playground: Story = {
  args: {
    title: 'Working (03) - RAVN Challenge',
    points: 3,
    dueDateText: '3 DAYS',
    dueDateUrgency: 'warning',
  },
};

export const Overdue: Story = {
  args: {
    title: 'Fix Critical GraphQL Bug',
    points: 5,
    dueDateText: 'OVERDUE',
    dueDateUrgency: 'overdue',
    tags: [{ label: 'BUG', variant: 'primary' }],
    assigneeName: 'Fernando Ramirez',
    reactions: [{ emoji: '💬', count: 12 }],
  },
};
