import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
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

/**
 * The group's accessible name. It defaults to "View", which was hardcoded before this prop
 * existed — right for a view switcher, wrong for every other use of a segmented control.
 */
export const CustomGroupLabel: Story = {
  args: {
    defaultValue: 'board',
    label: 'Density',
  },
};
