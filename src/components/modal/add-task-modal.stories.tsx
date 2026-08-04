import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { useModal } from './modal';
import { AddTaskModal } from './add-task-modal';
import { TextButton } from '../button/text-button';

const ASSIGNEES = [
  { id: '1', name: 'Jerome Bell' },
  { id: '2', name: 'Jane Doe' },
  { id: '3', name: 'Fernando Ramirez' },
];

const meta: Meta<typeof AddTaskModal> = {
  title: 'Components/Modal/AddTask',
  component: AddTaskModal,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  args: {
    assignees: ASSIGNEES,
    onSubmit: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const { isOpen, open, close } = useModal(true);
    return (
      <div className="flex flex-col items-start gap-4">
        <TextButton onPress={open}>Open Add Task widget</TextButton>
        <AddTaskModal
          assignees={args.assignees ?? ASSIGNEES}
          onSubmit={args.onSubmit}
          isOpen={isOpen}
          onClose={close}
        />
      </div>
    );
  },
};
