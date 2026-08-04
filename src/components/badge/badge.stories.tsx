import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

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
