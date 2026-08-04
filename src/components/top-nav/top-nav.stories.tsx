import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { TopNav } from './top-nav';

const meta: Meta<typeof TopNav> = {
  title: 'Layout/TopNav',
  component: TopNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  // neutral-5 app-shell surface, matching `Dashboard Mockup.md` (Sidebar +
  // TopNav both sit on the neutral-5 background, flush against the sidebar).
  decorators: [withSurface('neutral-5')],
  args: {
    onSearchChange: fn(),
    onSearchSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Property 1=Default — a single trailing icon + avatar, no search value. */
export const Default: Story = {
  args: {
    searchPlaceholder: 'Search tasks, projects...',
    userName: 'Jerome Bell',
  },
};

export const Playground: Story = {
  args: {
    searchPlaceholder: 'Search...',
  },
};

/**
 * Property 1=Selected — Frame 648 grows from 88px (1 icon + avatar) to 136px
 * (2 icons + avatar) once there's a value to clear.
 */
export const WithSearchValue: Story = {
  args: {
    searchValue: 'Fix auth bug',
    userName: 'Jerome Bell',
  },
};

export const NoUser: Story = {
  args: {
    searchPlaceholder: 'Search...',
  },
};
