import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { withSurface } from '../../../.storybook/decorators';
import { ViewSwitcher } from './view-switcher';

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ListIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

const meta: Meta<typeof ViewSwitcher> = {
  title: 'Layout/ViewSwitcher',
  component: ViewSwitcher,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-4')],
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

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState<'left' | 'right'>(args.value ?? 'right');
    return (
      <ViewSwitcher
        leftIcon={<GridIcon />}
        rightIcon={<ListIcon />}
        leftLabel="Board view"
        rightLabel="List view"
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
  args: { value: 'right' },
};
