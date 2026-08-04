import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useModal } from './modal';
import { AssigneeModal } from './assignee-modal';
import { Button } from '../button/button';

const ASSIGNEES = [
  { id: '1', name: 'Jerome Bell', role: 'Frontend Developer' },
  { id: '2', name: 'Jane Doe', role: 'Designer' },
  { id: '3', name: 'Fernando Ramirez', role: 'Fullstack Engineer' },
];

const meta: Meta<typeof AssigneeModal> = {
  title: 'Components/Modal/Assignee',
  component: AssigneeModal,
  tags: ['autodocs'],
  args: {
    assignees: ASSIGNEES,
    onConfirm: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const { isOpen, open, close } = useModal();
    return (
      <div className="bg-neutral-5 p-8 min-h-48 flex items-center justify-center">
        <Button onPress={open}>Open Assignee modal</Button>
        <AssigneeModal
          assignees={args.assignees ?? ASSIGNEES}
          selectedIds={args.selectedIds}
          onConfirm={args.onConfirm}
          isOpen={isOpen}
          onClose={close}
        />
      </div>
    );
  },
};

export const WithPreselection: Story = {
  ...Default,
  args: {
    ...Default.args,
    selectedIds: ['2'],
  },
};
