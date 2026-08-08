import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { AssigneeModal } from './assignee-modal';

const ASSIGNEES = [
  { id: '1', name: 'Jerome Bell' },
  { id: '2', name: 'Jane Doe' },
  { id: '3', name: 'Fernando Ramirez' },
];

const meta: Meta<typeof AssigneeModal> = {
  title: 'Components/Modal/Assignee',
  component: AssigneeModal,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  args: {
    assignees: ASSIGNEES,
    onSelect: fn(),
    onClose: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithRoles: Story = {
  args: {
    assignees: [
      { id: '1', name: 'Jerome Bell', role: 'Frontend Developer' },
      { id: '2', name: 'Jane Doe', role: 'Designer' },
      { id: '3', name: 'Fernando Ramirez', role: 'Fullstack Engineer' },
    ],
  },
};
