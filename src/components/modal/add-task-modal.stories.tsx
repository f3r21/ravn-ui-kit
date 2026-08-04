import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useModal } from './modal';
import { AddTaskModal } from './add-task-modal';
import { Button } from '../button/button';

const meta: Meta<typeof AddTaskModal> = {
  title: 'Components/Modal/AddTask',
  component: AddTaskModal,
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const { isOpen, open, close } = useModal();
    return (
      <div className="bg-neutral-5 p-8 min-h-48 flex items-center justify-center">
        <Button onPress={open}>Open Add Task modal</Button>
        <AddTaskModal {...args} isOpen={isOpen} onClose={close} />
      </div>
    );
  },
};
