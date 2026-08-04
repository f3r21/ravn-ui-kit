import type { Meta, StoryObj } from '@storybook/react';
import { SidebarItem } from './sidebar-item';

const meta: Meta<typeof SidebarItem> = {
  title: 'UI/SidebarItem',
  component: SidebarItem,
  tags: ['autodocs'],
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

export const Active: Story = {
  args: {
    label: 'DASHBOARD',
    isActive: true,
    badgeCount: 3,
  },
};
