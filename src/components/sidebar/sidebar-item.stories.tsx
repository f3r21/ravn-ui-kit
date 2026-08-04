import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SidebarItem } from './sidebar-item';

const PlaceholderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" />
  </svg>
);

const meta: Meta<typeof SidebarItem> = {
  title: 'Layout/SidebarItem',
  component: SidebarItem,
  tags: ['autodocs'],
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
