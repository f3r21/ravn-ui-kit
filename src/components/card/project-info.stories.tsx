import type { Meta, StoryObj } from '@storybook/react';
import { ProjectInfo } from './project-info';

const meta: Meta<typeof ProjectInfo> = {
  title: 'UI/ProjectInfo',
  component: ProjectInfo,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

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
