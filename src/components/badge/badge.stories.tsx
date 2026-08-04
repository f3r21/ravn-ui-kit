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
    children: 'Borrador',
    variant: 'neutral',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'neutral', children: 'Borrador' },
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
    children: 'Borrador',
    variant: 'neutral',
  },
};

export const Success: Story = {
  args: {
    children: 'Completado',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'En Progreso',
    variant: 'warning',
  },
};

export const Danger: Story = {
  args: {
    children: 'Bloqueado',
    variant: 'danger',
  },
};
