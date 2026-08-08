import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { EmptyState } from './empty-state';
import { TextButton } from '../button/text-button';
import { GridViewIcon } from '../icons/icons';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  args: {
    title: 'No tasks yet',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The second line earns its place when the *reason* is not obvious from the headline. */
export const WithDescription: Story = {
  args: {
    title: 'No tasks match these filters',
    description: 'Try clearing a filter, or widening the date range.',
  },
};

/** A glyph is optional, and tinted `text-muted` so it frames the text rather than competing with it. */
export const WithIcon: Story = {
  args: {
    title: 'No tasks yet',
    description: 'Tasks you create will show up here.',
    icon: <GridViewIcon />,
  },
};

/**
 * The most useful shape: an empty state that offers a way *out* of itself. Without the
 * action slot the component just reports a dead end.
 */
export const WithAction: Story = {
  args: {
    title: 'No tasks yet',
    description: 'Tasks you create will show up here.',
    icon: <GridViewIcon />,
    action: (
      <TextButton variant="primary" onPress={fn()}>
        Create the first task
      </TextButton>
    ),
  },
};

/**
 * Every empty state is a named `group`, so a screen-reader user can find and step into
 * it rather than meeting three loose strings. Override `label` whenever two can appear at
 * once — two identically-named groups are two things assistive tech cannot tell apart.
 *
 * It is deliberately **not** a live region: a live region announces *changes* to its
 * contents, and this mounts with its text already inside, so `role="status"` here would
 * announce nothing. Run the a11y addon on this story.
 */
export const TwoOnScreenAtOnce: Story = {
  render: () => (
    <div className="flex gap-6">
      <EmptyState
        className="flex-1"
        label="No tasks in To Do"
        title="No tasks in To Do"
        description="Nothing waiting to be picked up."
      />
      <EmptyState
        className="flex-1"
        label="No tasks in In Progress"
        title="No tasks in In Progress"
        description="Nothing being worked on right now."
      />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    title: 'No tasks yet',
    description: 'Tasks you create will show up here.',
    label: 'No results',
  },
};
