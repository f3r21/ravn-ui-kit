import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { TopNav } from './top-nav';

const meta: Meta<typeof TopNav> = {
  title: 'Layout/TopNav',
  component: TopNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [withSurface('neutral-5')],
  argTypes: {
    showSearch: { control: 'boolean' },
  },
  args: {
    onSearch: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Dashboard',
    showSearch: true,
    userName: 'Jerome Bell',
  },
};

export const Playground: Story = {
  args: {
    title: 'Playground',
  },
};

export const NoSearch: Story = {
  args: {
    title: 'My Tasks',
    showSearch: false,
    userName: 'Fernando Ramirez',
  },
};
