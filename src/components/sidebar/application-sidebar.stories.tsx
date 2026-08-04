import type { Meta, StoryObj } from '@storybook/react';
import { ApplicationSidebar } from './application-sidebar';
import { withSurface } from '../../../.storybook/decorators';

const navItems = [
  { label: 'DASHBOARD', isActive: false },
  { label: 'MY TASKS', isActive: true, badgeCount: 5 },
  { label: 'PROJECTS', isActive: false, badgeCount: 12 },
  { label: 'TEAM', isActive: false },
  { label: 'SETTINGS', isActive: false },
];

const meta: Meta<typeof ApplicationSidebar> = {
  title: 'Layout/ApplicationSidebar',
  component: ApplicationSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withSurface('neutral-5', 'flex h-screen p-0')],
  args: {
    items: navItems,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logo: (
      <span className="font-bold text-xl text-neutral-1 font-sans tracking-tight">
        RAVN
      </span>
    ),
    items: navItems,
  },
  render: (args) => (
    <>
      <ApplicationSidebar logo={args.logo} items={args.items ?? navItems} />
      <div className="flex-1 p-8 bg-neutral-5 text-neutral-2 font-sans text-sm">
        ← Main content area
      </div>
    </>
  ),
};

export const Playground: Story = {
  args: {
    items: navItems,
  },
};
