import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TaskTable } from './task-table';
import { withSurface } from '../../../.storybook/decorators';

const meta: Meta<typeof TaskTable> = {
  title: 'Layout/TaskTable',
  component: TaskTable,
  tags: ['autodocs'],
  // The table sits on the app shell; its cells carry their own panel fill, but the empty
  // state and the group headers do not, and on Storybook's light default canvas they
  // rendered white-on-white. Same fix as `Input`/`Datepicker` took earlier.
  decorators: [withSurface('neutral-5')],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groups: [
      {
        title: 'To Do (05)',
        rows: [
          {
            index: 1,
            title: 'Create wireframe',
            indicatorColor: 'red',
            estimationPoints: 4,
            assigneeName: 'Amelia Nellson',
            dueDate: 'Yesterday',
            dueDateUrgency: 'overdue',
          },
          {
            index: 2,
            title: 'Slack Logo Design',
            indicatorColor: 'green',
            reactions: [
              { emoji: '💬', count: 3 },
              { emoji: '🔗', count: 5 },
            ],
            tags: [
              { label: 'IOS APP', variant: 'green' },
              { label: '+2', variant: 'neutral' },
            ],
            estimationPoints: 2,
            assigneeName: 'Jonah Doe',
            dueDate: 'Today',
            dueDateUrgency: 'soon',
            onViewDetails: fn(),
          },
          {
            index: 3,
            title: 'Dashboard Design',
            indicatorColor: 'yellow',
            reactions: [{ emoji: '🔗', count: 5 }],
            estimationPoints: 8,
            assigneeName: 'Jason Joe',
            dueDate: '6 July, 2020',
          },
          {
            index: 4,
            title: 'Create wireframe',
            indicatorColor: 'green',
            estimationPoints: 4,
            assigneeName: 'Martina Strand',
            dueDate: '6 July, 2020',
          },
          {
            index: 5,
            title: 'Micromax Logo Design',
            indicatorColor: 'red',
            estimationPoints: 4,
            assigneeName: 'Macky Nielsen',
            dueDate: '6 July, 2020',
          },
        ],
      },
      {
        title: 'In Progress',
        rows: [
          {
            index: 1,
            title: 'Dashboard Design',
            assigneeName: 'Amelia Nellson',
            dueDate: '6 July, 2020',
          },
          {
            index: 2,
            title: 'Extramark Logo Design',
            assigneeName: 'Jonah Doe',
            dueDate: '6 July, 2020',
          },
        ],
      },
    ],
  },
};

export const Playground: Story = {
  args: {
    groups: [
      {
        title: 'Reviews (01)',
        rows: [
          {
            index: 1,
            title: 'Write onboarding docs',
            estimationPoints: 1,
            assigneeName: 'Fernando Ramirez',
            dueDate: 'Aug 20',
            tags: [{ label: 'DOCS', variant: 'neutral' }],
          },
        ],
      },
    ],
  },
};

export const Empty: Story = {
  args: { groups: [] },
};

export const Loading: Story = {
  args: { groups: [], isLoading: true },
};
