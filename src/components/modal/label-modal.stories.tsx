import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { LabelModal } from './label-modal';

const LABELS = [
  { id: '1', text: 'Bug', accent: 'red' as const },
  { id: '2', text: 'Feature', accent: 'green' as const },
  { id: '3', text: 'Urgent', accent: 'yellow' as const },
  { id: '4', text: 'Docs', accent: 'neutral' as const },
];

const meta: Meta<typeof LabelModal> = {
  title: 'Components/Modal/Label',
  component: LabelModal,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  args: {
    labels: LABELS,
    onAction: fn(),
    onClose: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

/**
 * Every control live, including `label` — the popover's own accessible name, which a page
 * holding more than one of these needs in order to tell them apart.
 */
export const Playground: Story = {
  args: {
    label: 'Choose a label for this task',
  },
};
