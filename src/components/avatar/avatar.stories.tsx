import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const InitialsSmall: Story = {
  args: {
    name: 'Fernando Ramirez',
    size: 'sm',
  },
};

export const InitialsMedium: Story = {
  args: {
    name: 'Jerome Bell',
    size: 'md',
  },
};

export const InitialsLarge: Story = {
  args: {
    name: 'Jane Doe',
    size: 'lg',
  },
};
