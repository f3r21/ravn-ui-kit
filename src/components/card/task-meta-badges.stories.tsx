import type { Meta, StoryObj } from '@storybook/react';
import { withSurface } from '../../../.storybook/decorators';
import { TaskMetaBadges } from './task-meta-badges';

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

const SubtaskIcon = () => (
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
    <circle cx="6" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="12" r="2" />
    <path d="M6 8v8M8 6h4a4 4 0 0 1 4 4v0M8 18h4a4 4 0 0 0 4-4v0" />
  </svg>
);

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

const meta: Meta<typeof TaskMetaBadges> = {
  title: 'Components/TaskMetaBadges',
  component: TaskMetaBadges,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-4')],
  args: {
    badges: [
      { icon: <AttachmentIcon />, label: 'Has attachments' },
      { icon: <SubtaskIcon />, count: 2, label: '2 subtasks' },
      { icon: <CommentIcon />, count: 7, label: '7 comments' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CountsOnly: Story = {
  args: {
    badges: [
      { icon: <SubtaskIcon />, count: 2, label: '2 subtasks' },
      { icon: <CommentIcon />, count: 12, label: '12 comments' },
    ],
  },
};
