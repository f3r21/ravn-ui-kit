import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SidebarItem } from './sidebar-item';

const meta: Meta<typeof SidebarItem> = {
  title: 'Layout/SidebarItem',
  component: SidebarItem,
  tags: ['autodocs'],
  argTypes: {
    isActive: { control: 'boolean' },
  },
  args: {
    onClick: fn(),
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

export const Playground: Story = {
  args: {
    label: 'Sidebar Item',
  },
};

export const Active: Story = {
  args: {
    label: 'DASHBOARD',
    isActive: true,
    badgeCount: 3,
  },
};
