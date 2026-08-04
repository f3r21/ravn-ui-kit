import type { Meta, StoryObj } from '@storybook/react';
import { Datepicker } from './datepicker';

const meta: Meta<typeof Datepicker> = {
  title: 'UI/Datepicker',
  component: Datepicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Fecha de Vencimiento',
  },
};

export const WithError: Story = {
  args: {
    label: 'Fecha Requerida',
    error: 'La fecha no puede ser en el pasado.',
  },
};
