import type { Meta, StoryObj } from '@storybook/react';
import { Reactions } from './reactions';

const meta: Meta<typeof Reactions> = {
  title: 'UI/Reactions',
  component: Reactions,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    reactions: [
      { emoji: '👍', count: 4, isActive: true },
      { emoji: '🎉', count: 2 },
      { emoji: '🔥', count: 7 },
    ],
  },
  decorators: [(Story) => <div className="bg-neutral-4 p-4 rounded-lg"><Story /></div>],
};
