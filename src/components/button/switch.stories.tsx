import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
  args: {
    label: 'Notificaciones',
    defaultSelected: false,
  },
};

export const On: Story = {
  args: {
    label: 'Modo oscuro',
    defaultSelected: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Opción deshabilitada',
    defaultSelected: false,
    isDisabled: true,
  },
};

export const NoLabel: Story = {
  args: {
    defaultSelected: true,
  },
};
