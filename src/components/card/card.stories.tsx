import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-2">
        <h4 className="font-bold text-neutral-1 text-base">Título de la Tarjeta</h4>
        <p className="text-xs text-neutral-2">Contenido explicativo de la tarjeta dentro de la interfaz.</p>
      </div>
    ),
  },
};
