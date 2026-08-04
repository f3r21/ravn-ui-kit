import type { Meta, StoryObj } from '@storybook/react';
import { TopNav } from './top-nav';

const meta: Meta<typeof TopNav> = {
  title: 'UI/TopNav',
  component: TopNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Dashboard',
    showSearch: true,
    userName: 'Jerome Bell',
  },
  decorators: [(Story) => <div className="bg-neutral-5 min-h-screen"><Story /></div>],
};

export const NoSearch: Story = {
  args: {
    title: 'My Tasks',
    showSearch: false,
    userName: 'Fernando Ramirez',
  },
  decorators: [(Story) => <div className="bg-neutral-5 min-h-screen"><Story /></div>],
};
