import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Tag } from './tag';

const meta: Meta<typeof Tag> = {
  title: 'Primitives/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'neutral'],
    },
  },
  args: {
    children: 'FRONTEND',
    onRemove: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'neutral', onRemove: undefined },
};

export const Playground: Story = {
  args: { children: 'New Tag' },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {(['primary', 'secondary', 'tertiary', 'neutral'] as const).map((v) => (
        <Tag key={v} {...args} variant={v}>
          {v}
        </Tag>
      ))}
    </div>
  ),
};

export const Removable: Story = {
  args: { children: 'REACT 19', variant: 'primary' },
};
