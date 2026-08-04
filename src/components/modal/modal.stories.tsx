import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Modal, useModal } from './modal';
import { TextButton } from '../button/text-button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal/Base',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
  },
  args: {
    onClose: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const { isOpen, open, close } = useModal();
    return (
      <div className="bg-neutral-5 p-8 min-h-48 flex items-center justify-center">
        <TextButton onPress={open}>Open modal</TextButton>
        <Modal
          title={args.title ?? 'Modal title'}
          width={args.width}
          isOpen={isOpen}
          onClose={close}
        >
          <p className="text-sm text-neutral-2 font-sans">
            This is the shared dialog shell — every other modal in the library
            (AddTask, Assignee, Estimate) composes this component.
          </p>
        </Modal>
      </div>
    );
  },
  args: {
    title: 'Modal title',
  },
};

export const WideVariant: Story = {
  ...Default,
  args: {
    ...Default.args,
    title: 'Wide modal',
    width: 'max-w-lg',
  },
};
