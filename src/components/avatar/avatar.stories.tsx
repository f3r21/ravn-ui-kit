import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    name: 'Jerome Bell',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'Fernando Ramirez', size: 'md' },
};

export const Playground: Story = {
  args: { name: 'Jane Doe', size: 'md' },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Avatar key={s} {...args} size={s} />
      ))}
    </div>
  ),
};

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
