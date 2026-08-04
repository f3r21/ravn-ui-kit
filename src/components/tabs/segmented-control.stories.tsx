import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from './segmented-control';

const meta: Meta<typeof SegmentedControl> = {
  title: 'UI/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [
      { id: 'board', label: 'Board' },
      { id: 'list', label: 'List' },
      { id: 'table', label: 'Table' },
    ],
    defaultValue: 'board',
  },
  decorators: [(Story) => <div className="bg-neutral-5 p-6"><Story /></div>],
};
