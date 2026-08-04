import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useModal } from './modal';
import { EstimateModal } from './estimate-modal';
import { Button } from '../button/button';

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
        <Button onPress={open}>Open Estimate modal</Button>
        <EstimateModal {...args} isOpen={isOpen} onClose={close} />
      </div>
    );
  },
  args: {
    currentPoints: 3,
  },
};
