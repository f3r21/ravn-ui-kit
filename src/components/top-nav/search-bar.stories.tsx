import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { SearchBar } from './search-bar';

const meta: Meta<typeof SearchBar> = {
  title: 'Layout/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  // Frame 649 has no fill of its own in Figma — it's always composited on the
  // neutral-4 "Search Bar" surface it lives inside (see `TopNav`).
  decorators: [withSurface('neutral-4')],
  args: {
    onChange: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Search tasks, projects...' },
};

export const Playground: Story = {
  args: {},
};

export const WithValue: Story = {
  args: { value: 'Fix auth bug', placeholder: 'Search...' },
};
