import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'success', 'warning', 'danger'],
    },
  },
  args: {
    children: 'Draft',
    tone: 'neutral',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { tone: 'neutral', children: 'Draft' },
};

export const Playground: Story = {
  args: { children: 'Badge' },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {(['neutral', 'success', 'warning', 'danger'] as const).map((v) => (
        <Badge key={v} {...args} tone={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
};

export const Neutral: Story = {
  args: {
    children: 'Draft',
    tone: 'neutral',
  },
};

export const Success: Story = {
  args: {
    children: 'Completed',
    tone: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'In Progress',
    tone: 'warning',
  },
};

export const Danger: Story = {
  args: {
    children: 'Blocked',
    tone: 'danger',
  },
};
