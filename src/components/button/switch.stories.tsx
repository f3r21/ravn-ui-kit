import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Switch } from './switch';

const meta: Meta<typeof Switch> = {
  title: 'Primitives/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    isSelected: { control: 'boolean' },
    defaultSelected: { control: 'boolean' },
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
    label: 'Notificaciones',
    defaultSelected: false,
  },
};

export const Playground: Story = {
  args: {
    label: 'Notificaciones',
    defaultSelected: false,
    isDisabled: false,
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
