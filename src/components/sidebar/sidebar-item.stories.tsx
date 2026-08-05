import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SidebarItem } from './sidebar-item';
import { withSurface } from '../../../.storybook/decorators';

const PlaceholderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" />
  </svg>
);

const meta: Meta<typeof SidebarItem> = {
  title: 'Layout/SidebarItem',
  component: SidebarItem,
  tags: ['autodocs'],
  // `neutral-4`, not `neutral-5`: an item only ever renders inside `ApplicationSidebar`,
  // whose own fill is `bg-surface-panel`. On the light default canvas the label measured
  // 2.76:1 and its hover state 3.60:1 — three of the kit's 131 violations, none of them
  // reachable in a real consumer.
  decorators: [withSurface('neutral-4')],
  argTypes: {
    isActive: { control: 'boolean' },
  },
  args: {
    onClick: fn(),
    icon: <PlaceholderIcon />,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'PROJECTS',
    isActive: false,
    badgeCount: 12,
  },
};

export const Hover: Story = {
  args: {
    label: 'PROJECTS',
    isActive: false,
  },
  parameters: { pseudo: { hover: true } },
};

export const Selected: Story = {
  args: {
    label: 'DASHBOARD',
    isActive: true,
    badgeCount: 3,
  },
};

export const Playground: Story = {
  args: {
    label: 'Sidebar Item',
  },
};
