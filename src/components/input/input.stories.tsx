import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Nombre de la Tarea',
    placeholder: 'Ej. Diseñar prototipo...',
  },
};

export const WithError: Story = {
  args: {
    label: 'Correo Electrónico',
    placeholder: 'usuario@ravn.co',
    error: 'El correo ingresado no es válido.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Campo Deshabilitado',
    value: 'Valor no editable',
    isDisabled: true,
  },
};
