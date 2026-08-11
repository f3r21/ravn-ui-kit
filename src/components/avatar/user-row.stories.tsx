import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { UserRow } from './user-row';
import { withSurface } from '../../../.storybook/decorators';

const meta: Meta<typeof UserRow> = {
  title: 'Components/UserRow',
  component: UserRow,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isOnline: { control: 'boolean' },
  },
  args: {
    name: 'Jerome Bell',
    onPress: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Jerome Bell',
    role: 'Frontend Developer',
    size: 'md',
  },
  decorators: [withSurface('neutral-5', 'w-64')],
};

export const Playground: Story = {
  args: {
    name: 'Jerome Bell',
    role: 'Frontend Developer',
    size: 'md',
    isOnline: false,
  },
  decorators: [withSurface('neutral-5', 'w-64')],
};

export const Online: Story = {
  args: {
    name: 'Fernando Ramirez',
    role: 'Fullstack Engineer',
    isOnline: true,
    size: 'md',
  },
  decorators: [withSurface('neutral-5', 'w-64')],
};

export const Small: Story = {
  args: {
    name: 'Jane Doe',
    role: 'Designer',
    size: 'sm',
  },
  decorators: [withSurface('neutral-4', 'p-4 w-56')],
};
