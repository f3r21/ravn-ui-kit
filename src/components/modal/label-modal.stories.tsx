import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { LabelModal } from './label-modal';

const LABELS = [
  { id: '1', text: 'Bug', variant: 'primary' as const },
  { id: '2', text: 'Feature', variant: 'secondary' as const },
  { id: '3', text: 'Urgent', variant: 'tertiary' as const },
  { id: '4', text: 'Docs', variant: 'neutral' as const },
];

const meta: Meta<typeof LabelModal> = {
  title: 'Components/Modal/Label',
  component: LabelModal,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  args: {
    labels: LABELS,
    onSelect: fn(),
    onClose: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
