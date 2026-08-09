import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { useModalState } from './modal';
import { AddTaskModal } from './add-task-modal';
import { TextButton } from '../button/text-button';

const ASSIGNEES = [
  { id: '1', name: 'Jerome Bell' },
  { id: '2', name: 'Jane Doe' },
  { id: '3', name: 'Fernando Ramirez' },
];

const LABELS = [
  { id: '1', text: 'Bug', variant: 'red' as const },
  { id: '2', text: 'Feature', variant: 'green' as const },
  { id: '3', text: 'Urgent', variant: 'yellow' as const },
  { id: '4', text: 'Docs', variant: 'neutral' as const },
];

const meta: Meta<typeof AddTaskModal> = {
  title: 'Components/Modal/AddTask',
  component: AddTaskModal,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  args: {
    assignees: ASSIGNEES,
    labels: LABELS,
    onSubmit: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const { isOpen, open, close } = useModalState(true);
    return (
      <div className="flex flex-col items-start gap-4">
        <TextButton onPress={open}>Open Add Task widget</TextButton>
        <AddTaskModal
          assignees={args.assignees ?? ASSIGNEES}
          labels={args.labels ?? LABELS}
          onSubmit={args.onSubmit}
          isOpen={isOpen}
          onClose={close}
        />
      </div>
    );
  },
};

/**
 * `Mockups/Dashboard Edit Task/Add  Task Modal00.md` reopens this exact same
 * widget pre-filled (Estimate "0 Points", Assignee "Jerome Bell" already
 * set) rather than showing a distinct edit component.
 */
export const Edit: Story = {
  render: (args) => {
    const { isOpen, open, close } = useModalState(true);
    return (
      <div className="flex flex-col items-start gap-4">
        <TextButton onPress={open}>Reopen for editing</TextButton>
        <AddTaskModal
          assignees={args.assignees ?? ASSIGNEES}
          labels={args.labels ?? LABELS}
          onSubmit={args.onSubmit}
          isOpen={isOpen}
          onClose={close}
          defaultTitle="Fix critical GraphQL bug"
          defaultPoints={0}
          defaultAssignee={ASSIGNEES[0]}
          defaultLabel={LABELS[0]}
        />
      </div>
    );
  },
};

/**
 * Every control live, including the two #90 added: `copy` for the visible strings, and
 * `formatDueDate` — which is the one that fixed a *wrong* output rather than an untranslated
 * one, since the default wrote the US date order for everybody.
 */
export const Playground: Story = {
  args: {
    defaultTitle: 'Design the empty state',
    defaultPoints: 4,
    copy: { submit: 'Add task' },
    formatDueDate: (d) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`,
  },
  render: Default.render,
};
