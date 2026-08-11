import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { ProjectInfo } from './project-info';

const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
    aria-hidden
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const meta: Meta<typeof ProjectInfo> = {
  title: 'Components/ProjectInfo',
  component: ProjectInfo,
  tags: ['autodocs'],
  argTypes: {
    headingLevel: { control: 'select', options: [2, 3, 4, 5, 6] },
  },
  decorators: [withSurface('neutral-4')],
  args: {
    title: 'Working (03) - RAVN Challenge',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    icon: <ChevronIcon />,
  },
};

export const LongTitle: Story = {
  args: {
    title: 'A much longer task title that truncates once it runs out of room',
    icon: <ChevronIcon />,
  },
};

/**
 * Every control live: the title, the heading level the outline needs, and the trailing icon
 * slot. `onTitleClick` turns the title into a real `<button>` — toggle it in the controls panel
 * and the accessible role changes with it.
 */
export const Playground: Story = {
  args: {
    title: 'Design the empty state',
    headingLevel: 2,
    icon: <ChevronIcon />,
    onTitleClick: fn(),
  },
};
