import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { withSurface } from '../../../.storybook/decorators';
import { ViewSwitcher } from './view-switcher';

const GridIcon = () => (
  <svg
    className="size-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ListIcon = () => (
  <svg
    className="size-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

const meta: Meta<typeof ViewSwitcher> = {
  title: 'Layout/ViewSwitcher',
  component: ViewSwitcher,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-4')],
  argTypes: {
    value: { control: 'select', options: ['left', 'right'] },
  },
  args: {
    leftIcon: <GridIcon />,
    rightIcon: <ListIcon />,
    leftLabel: 'Board view',
    rightLabel: 'List view',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftSelected: Story = {
  args: { value: 'left' },
};

export const RightSelected: Story = {
  args: { value: 'right' },
};

/**
 * The group carries its own accessible name, announced before the selected option. It
 * defaults to "View"; give it something specific when a page holds more than one switcher.
 */
export const CustomGroupLabel: Story = {
  args: { value: 'left', label: 'Task layout' },
};

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState<'left' | 'right'>(args.value ?? 'right');
    return (
      // The icons and labels come from the meta's `args`, so listing them here as well
      // only produced four props the spread immediately overwrote. Storybook 10's arg
      // typing is what surfaced that (TS2783); the rendering is unchanged.
      <ViewSwitcher {...args} value={value} onChange={setValue} />
    );
  },
  args: { value: 'right' },
};
