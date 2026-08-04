import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { SegmentedControl } from './segmented-control';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Primitives/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  args: {
    options: [
      { id: 'board', label: 'Board' },
      { id: 'list', label: 'List' },
      { id: 'table', label: 'Table' },
    ],
    onChange: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 'board',
  },
};

export const Playground: Story = {
  args: {
    defaultValue: 'board',
  },
};
