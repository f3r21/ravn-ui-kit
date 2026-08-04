import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'success', 'warning', 'danger'],
    },
  },
  args: {
    children: 'Draft',
    variant: 'neutral',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'neutral', children: 'Draft' },
};

export const Playground: Story = {
  args: { children: 'Badge' },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {(['neutral', 'success', 'warning', 'danger'] as const).map((v) => (
        <Badge key={v} {...args} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
};

export const Neutral: Story = {
  args: {
    children: 'Draft',
    variant: 'neutral',
  },
};

export const Success: Story = {
  args: {
    children: 'Completed',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'In Progress',
    variant: 'warning',
  },
};

export const Danger: Story = {
  args: {
    children: 'Blocked',
    variant: 'danger',
  },
};
