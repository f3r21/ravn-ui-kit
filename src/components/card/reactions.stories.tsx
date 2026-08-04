import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { Reactions } from './reactions';

const meta: Meta<typeof Reactions> = {
  title: 'Components/Reactions',
  component: Reactions,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-4')],
  args: {
    reactions: [
      { emoji: '👍', count: 4, isActive: true },
      { emoji: '🎉', count: 2 },
      { emoji: '🔥', count: 7 },
    ],
    onToggle: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Playground: Story = {
  args: {
    reactions: [
      { emoji: '👍', count: 4, isActive: true },
      { emoji: '🎉', count: 2 },
    ],
  },
};
