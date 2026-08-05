import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TaskCard } from './task-card';

const CommentIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
    aria-hidden
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const AttachmentIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
    aria-hidden
  >
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

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
    metaBadges: [
      { icon: <CommentIcon />, count: 5, label: '5 comments' },
      { icon: <AttachmentIcon />, count: 2, label: '2 attachments' },
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
    metaBadges: [{ icon: <CommentIcon />, count: 12, label: '12 comments' }],
  },
};
