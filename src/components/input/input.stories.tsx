import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
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
    label: 'Nombre de la Tarea',
    placeholder: 'Ej. Diseñar prototipo...',
  },
};

export const Playground: Story = {
  args: {
    label: 'Label',
    placeholder: 'Type here...',
  },
};

export const Error: Story = {
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
