import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Datepicker } from './datepicker';

const meta: Meta<typeof Datepicker> = {
  title: 'Components/DatePicker/Field',
  component: Datepicker,
  tags: ['autodocs'],
  argTypes: {
    isDisabled: { control: 'boolean' },
  },
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Fecha de Vencimiento',
  },
};

export const Playground: Story = {
  args: {
    label: 'Date',
  },
};

export const Error: Story = {
  args: {
    label: 'Fecha Requerida',
    error: 'La fecha no puede ser en el pasado.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Fecha Deshabilitada',
    isDisabled: true,
  },
};
