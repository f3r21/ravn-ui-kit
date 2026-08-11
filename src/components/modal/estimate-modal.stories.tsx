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
    onAction: fn(),
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

/**
 * Every control live. `formatPoints` is the interesting one: `points === 1` is English's
 * pluralisation rule and not every language's, which is why this is a formatter rather than a
 * string (#94).
 */
export const Playground: Story = {
  args: {
    value: 4,
    label: 'Estimate this task',
    formatPoints: (points) => `${points} pt${points === 1 ? '' : 's'}`,
  },
};
