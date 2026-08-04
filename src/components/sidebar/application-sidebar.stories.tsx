import type { Meta, StoryObj } from '@storybook/react';
import { ApplicationSidebar } from './application-sidebar';

const meta: Meta<typeof ApplicationSidebar> = {
  title: 'UI/ApplicationSidebar',
  component: ApplicationSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const navItems = [
  { label: 'DASHBOARD', isActive: false },
  { label: 'MY TASKS', isActive: true, badgeCount: 5 },
  { label: 'PROJECTS', isActive: false, badgeCount: 12 },
  { label: 'TEAM', isActive: false },
  { label: 'SETTINGS', isActive: false },
];

export const Default: Story = {
  args: {
    logo: (
      <span className="font-bold text-xl text-neutral-1 font-sans tracking-tight">
        RAVN
      </span>
    ),
    items: navItems,
  },
  decorators: [
    (Story) => (
      <div className="flex h-screen bg-neutral-5">
        <Story />
        <div className="flex-1 p-8 bg-neutral-5 text-neutral-2 font-sans text-sm">
          ← Área de contenido principal
        </div>
      </div>
    ),
  ],
};
