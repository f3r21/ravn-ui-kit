import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ProjectInfo } from './project-info';

const meta: Meta<typeof ProjectInfo> = {
  title: 'Components/ProjectInfo',
  component: ProjectInfo,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['active', 'on-hold', 'completed'],
    },
    accentColor: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'neutral'],
    },
  },
  args: {
    name: 'RAVN Task Management Challenge',
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    description: 'Build a task management dashboard with React 19 and TypeScript.',
    status: 'active',
    totalTasks: 24,
    completedTasks: 9,
    accentColor: 'primary',
  },
};

export const Playground: Story = {
  args: {
    name: 'Project Name',
    status: 'active',
    totalTasks: 10,
    completedTasks: 4,
    accentColor: 'primary',
  },
};

export const Active: Story = {
  args: {
    name: 'RAVN Task Management Challenge',
    description: 'Build a task management dashboard with React 19 and TypeScript.',
    status: 'active',
    totalTasks: 24,
    completedTasks: 9,
    accentColor: 'primary',
  },
};

export const OnHold: Story = {
  args: {
    name: 'Mobile App Redesign',
    status: 'on-hold',
    totalTasks: 12,
    completedTasks: 3,
    accentColor: 'tertiary',
  },
};

export const Completed: Story = {
  args: {
    name: 'API Integration Sprint',
    status: 'completed',
    totalTasks: 8,
    completedTasks: 8,
    accentColor: 'secondary',
  },
};
