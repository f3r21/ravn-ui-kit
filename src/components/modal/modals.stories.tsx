import type { Meta, StoryObj } from '@storybook/react';
import { useModal } from './modal';
import { AddTaskModal } from './add-task-modal';
import { AssigneeModal } from './assignee-modal';
import { EstimateModal } from './estimate-modal';
import { Button } from '../button/button';

const meta: Meta = {
  title: 'UI/Modals',
  tags: ['autodocs'],
};
export default meta;

export const AddTask: StoryObj = {
  render: () => {
    const { isOpen, open, close } = useModal();
    return (
      <div className="bg-neutral-5 p-8 min-h-48 flex items-center justify-center">
        <Button onPress={open}>Open Add Task Modal</Button>
        <AddTaskModal isOpen={isOpen} onClose={close} onSubmit={console.log} />
      </div>
    );
  },
};

export const Assignee: StoryObj = {
  render: () => {
    const { isOpen, open, close } = useModal();
    return (
      <div className="bg-neutral-5 p-8 min-h-48 flex items-center justify-center">
        <Button onPress={open}>Open Assignee Modal</Button>
        <AssigneeModal
          isOpen={isOpen}
          onClose={close}
          assignees={[
            { id: '1', name: 'Jerome Bell', role: 'Frontend Developer' },
            { id: '2', name: 'Jane Doe', role: 'Designer' },
            { id: '3', name: 'Fernando Ramirez', role: 'Fullstack Engineer' },
          ]}
          onConfirm={console.log}
        />
      </div>
    );
  },
};

export const Estimate: StoryObj = {
  render: () => {
    const { isOpen, open, close } = useModal();
    return (
      <div className="bg-neutral-5 p-8 min-h-48 flex items-center justify-center">
        <Button onPress={open}>Open Estimate Modal</Button>
        <EstimateModal isOpen={isOpen} onClose={close} currentPoints={3} onConfirm={console.log} />
      </div>
    );
  },
};
