import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useModal } from './modal';
import { EstimateModal } from './estimate-modal';
import { TextButton } from '../button/text-button';

const meta: Meta<typeof EstimateModal> = {
  title: 'Components/Modal/Estimate',
  component: EstimateModal,
  tags: ['autodocs'],
  args: {
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
        <TextButton onPress={open}>Open Estimate modal</TextButton>
        <EstimateModal {...args} isOpen={isOpen} onClose={close} />
      </div>
    );
  },
  args: {
    currentPoints: 3,
  },
};
