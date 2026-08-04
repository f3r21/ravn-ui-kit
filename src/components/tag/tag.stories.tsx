import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './tag';

const meta: Meta<typeof Tag> = {
  title: 'UI/Tag',
  component: Tag,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'FRONTEND',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'BACKEND',
    variant: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    children: 'HIGH PRIORITY',
    variant: 'tertiary',
  },
};

export const Removable: Story = {
  args: {
    children: 'REACT 19',
    variant: 'primary',
    onRemove: () => alert('Tag removido'),
  },
};
