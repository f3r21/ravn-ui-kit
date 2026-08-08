import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { EstimateModal } from './estimate-modal';

const meta: Meta<typeof EstimateModal> = {
  title: 'Components/Modal/Estimate',
  component: EstimateModal,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  args: {
    onSelect: fn(),
    onClose: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithSelection: Story = {
  args: {
    value: 5,
  },
};
