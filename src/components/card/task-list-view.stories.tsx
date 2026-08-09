import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskListView } from './task-list-view';
import { EmptyState } from '../empty-state/empty-state';
import { withSurface } from '../../../.storybook/decorators';

const sampleTasks = [
  {
    title: 'Set up project',
    points: 3,
    dueDateText: '2 DAYS',
    dueDateUrgency: 'soon' as const,
    tags: [{ label: 'FRONTEND', variant: 'green' as const }],
    assigneeName: 'Jerome Bell',
  },
  {
    title: 'Fix auth bug',
    points: 8,
    dueDateText: 'OVERDUE',
    dueDateUrgency: 'overdue' as const,
    tags: [{ label: 'BUG', variant: 'red' as const }],
    assigneeName: 'Jane Doe',
  },
];

const meta: Meta<typeof TaskListView> = {
  title: 'Layout/TaskListView',
  component: TaskListView,
  tags: ['autodocs'],
  // A board column lives on the app shell. Without this the column header and the empty
  // state rendered white-on-white against Storybook's light default canvas — 1.06:1, and
  // ten of the kit's 131 contrast violations. The component is fine; the canvas was
  // standing in for a surface this kit does not have.
  decorators: [withSurface('neutral-5')],
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Working (03)',
    tasks: sampleTasks,
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Working (03)',
    tasks: sampleTasks,
  },
};

/**
 * Every control live, including the ones the stories above do not reach: `headingLevel` for the
 * page outline, `label` — the list's own accessible name, which matters when a board shows more
 * than one column — and the three `empty*` props.
 */
export const Playground: Story = {
  args: {
    title: 'In Review (02)',
    headingLevel: 2,
    label: 'Tasks in review',
    tasks: sampleTasks.slice(0, 2),
    emptyTitle: 'Nothing in review',
    emptyDescription: 'Move a task here when it is ready for a second pair of eyes.',
  },
};

export const Empty: Story = {
  args: { title: 'Backlog (0)', tasks: [] },
};

export const Loading: Story = {
  args: { title: 'Working (03)', tasks: [], isLoading: true },
};

/**
 * Figma's `Frame 654` (`Mockups/Dashboard Default View/Dashboard Mockup.md`)
 * lays out 3 `Task List View` instances side by side, `flex-direction: row`,
 * `gap: 32px` — this is the real "board" layout; there is no separate
 * per-column background/border/radius component wrapping each list.
 */
export const Board: Story = {
  render: () => (
    <div className="flex flex-row items-start gap-8">
      <TaskListView title="Working (03)" tasks={sampleTasks} className="w-[348px]" />
      <TaskListView title="In review (01)" tasks={[sampleTasks[0]]} className="w-[348px]" />
      <TaskListView title="Done (14)" tasks={[]} className="w-[348px]" />
    </div>
  ),
};

/**
 * The same board, wired for assistive technology: each column is a named `region` a screen
 * reader can jump between, and `headingLevel={2}` puts the column titles one level above the
 * card titles inside them. Without it both are `h3` and a heading list reads as a flat run of
 * columns and cards with nothing distinguishing one from the other.
 *
 * Both are opt-in — there is no Figma basis for a landmark, and three unnamed `<section>`s
 * would be worse than none.
 */
export const BoardWithLandmarks: Story = {
  render: () => (
    <div className="flex flex-row items-start gap-8">
      <TaskListView
        title="Working (03)"
        label="Working"
        headingLevel={2}
        tasks={sampleTasks}
        className="w-[348px]"
      />
      <TaskListView
        title="In review (01)"
        label="In review"
        headingLevel={2}
        tasks={[sampleTasks[0]]}
        className="w-[348px]"
      />
      <TaskListView
        title="Done (14)"
        label="Done"
        headingLevel={2}
        tasks={[]}
        className="w-[348px]"
      />
    </div>
  ),
};

/**
 * #15. `emptyTitle`/`emptyDescription`/`emptyAction` flatten three of `EmptyState`'s five,
 * which left `icon` and `label` unreachable from here. `label` is the one that matters: a
 * board of three columns renders three empty states, and without it a screen-reader user gets
 * three groups all called "No results".
 *
 * The `empty` slot takes a whole `EmptyState`, so every prop is the consumer's.
 */
export const ComposedEmptyState: Story = {
  args: {
    title: 'Working (00)',
    tasks: [],
    empty: (
      <EmptyState
        title="Nothing in Working"
        description="Drag a task here, or create one."
        label="No tasks in Working"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 10h18" />
          </svg>
        }
      />
    ),
  },
};
