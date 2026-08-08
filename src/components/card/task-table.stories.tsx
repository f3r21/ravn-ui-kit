import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TaskTable } from './task-table';
import { Item } from 'react-stately';
import { Menu } from '../menu/menu';
import { MenuDotsIcon } from '../icons/icons';
import { withSurface } from '../../../.storybook/decorators';

const meta: Meta<typeof TaskTable> = {
  title: 'Layout/TaskTable',
  component: TaskTable,
  tags: ['autodocs'],
  // The table sits on the app shell; its cells carry their own panel fill, but the empty
  // state and the group headers do not, and on Storybook's light default canvas they
  // rendered white-on-white. Same fix as `Input`/`Datepicker` took earlier.
  decorators: [withSurface('neutral-5')],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groups: [
      {
        title: 'To Do (05)',
        rows: [
          {
            index: 1,
            title: 'Create wireframe',
            indicatorColor: 'red',
            estimationPoints: 4,
            assigneeName: 'Amelia Nellson',
            dueDate: 'Yesterday',
            dueDateUrgency: 'overdue',
          },
          {
            index: 2,
            title: 'Slack Logo Design',
            indicatorColor: 'green',
            reactions: [
              { emoji: '💬', count: 3 },
              { emoji: '🔗', count: 5 },
            ],
            tags: [
              { label: 'IOS APP', variant: 'green' },
              { label: '+2', variant: 'neutral' },
            ],
            estimationPoints: 2,
            assigneeName: 'Jonah Doe',
            dueDate: 'Today',
            dueDateUrgency: 'soon',
            onViewDetails: fn(),
          },
          {
            index: 3,
            title: 'Dashboard Design',
            indicatorColor: 'yellow',
            reactions: [{ emoji: '🔗', count: 5 }],
            estimationPoints: 8,
            assigneeName: 'Jason Joe',
            dueDate: '6 July, 2020',
          },
          {
            index: 4,
            title: 'Create wireframe',
            indicatorColor: 'green',
            estimationPoints: 4,
            assigneeName: 'Martina Strand',
            dueDate: '6 July, 2020',
          },
          {
            index: 5,
            title: 'Micromax Logo Design',
            indicatorColor: 'red',
            estimationPoints: 4,
            assigneeName: 'Macky Nielsen',
            dueDate: '6 July, 2020',
          },
        ],
      },
      {
        title: 'In Progress',
        rows: [
          {
            index: 1,
            title: 'Dashboard Design',
            assigneeName: 'Amelia Nellson',
            dueDate: '6 July, 2020',
          },
          {
            index: 2,
            title: 'Extramark Logo Design',
            assigneeName: 'Jonah Doe',
            dueDate: '6 July, 2020',
          },
        ],
      },
    ],
  },
};

export const Playground: Story = {
  args: {
    groups: [
      {
        title: 'Reviews (01)',
        rows: [
          {
            index: 1,
            title: 'Write onboarding docs',
            estimationPoints: 1,
            assigneeName: 'Fernando Ramirez',
            dueDate: 'Aug 20',
            tags: [{ label: 'DOCS', variant: 'neutral' }],
          },
        ],
      },
    ],
  },
};

/**
 * Rows with an `onClick`. The title becomes a real `<button>` — tab to it and press Enter or
 * Space — and the rest of the row stays clickable for a pointer user. The row's own controls
 * (select checkbox, "Details") do not open the task.
 */
export const ClickableRows: Story = {
  args: {
    groups: [
      {
        title: 'To Do (02)',
        rows: [
          {
            index: 1,
            title: 'Create wireframe',
            estimationPoints: 4,
            assigneeName: 'Amelia Nellson',
            dueDate: '6 July, 2020',
            onClick: fn(),
            onSelectedChange: fn(),
          },
          {
            index: 2,
            title: 'Slack Logo Design',
            estimationPoints: 2,
            assigneeName: 'Jonah Doe',
            dueDate: '6 July, 2020',
            onClick: fn(),
            onViewDetails: fn(),
          },
        ],
      },
    ],
  },
};

export const Empty: Story = {
  args: { groups: [] },
};

export const Loading: Story = {
  args: { groups: [], isLoading: true },
};

/**
 * #95. A per-row overflow menu, which is what a list view needs and what `TaskTableRow` had no
 * slot for — the consuming app could migrate its board onto `TaskCard` and not its list view,
 * because moving would have deleted Edit and Delete.
 *
 * The group header takes `headingLevel: 2` and the rows `3`, so the outline nests rather than
 * skipping — the other half of #95, and not fixable from outside before this.
 *
 * Open a menu and the row behind it does not open: the slot is one of the row's own controls.
 */
export const RowActions: Story = {
  args: {
    groups: [
      {
        title: 'To Do (02)',
        headingLevel: 2,
        rows: [
          {
            index: 1,
            title: 'Create wireframe',
            headingLevel: 3,
            assigneeName: 'Amelia Nellson',
            dueDate: '6 July, 2020',
            onClick: fn(),
            actions: (
              <Menu<{ id: string; label: string }>
                label="Task options for Create wireframe"
                triggerContent={<MenuDotsIcon className="size-5" />}
                triggerClassName="w-8 h-8 rounded-sm inline-flex items-center justify-center text-main hover:bg-neutral-3 focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
                items={[
                  { id: 'edit', label: 'Edit' },
                  { id: 'delete', label: 'Delete' },
                ]}
                onAction={fn()}
              >
                {(item) => (
                  <Item key={item.id} textValue={item.label}>
                    {item.label}
                  </Item>
                )}
              </Menu>
            ),
          },
          {
            index: 2,
            title: 'Slack Logo Design',
            headingLevel: 3,
            assigneeName: 'Jonah Doe',
            dueDate: '6 July, 2020',
            onClick: fn(),
          },
        ],
      },
    ],
  },
};

/**
 * A consumer-defined column set — **one added, one removed, one reordered** — which is what
 * proves `columns` is real rather than decorative (#97).
 *
 * `Status` is a custom column: the kit draws no such cell, so it supplies its own `label`,
 * `width` and `renderCell`. `renderCell` receives the row's own typed props, which is what
 * keeps this additive — `TaskTableRowProps` stays field-by-field rather than becoming a
 * generic bag, so nothing existing breaks.
 *
 * Estimation is dropped, and Due Date moves ahead of the tags. The header, the `colgroup`,
 * every body row and the loading skeleton all follow, because all four read `resolveColumns`.
 *
 * **The 1108px total is gone here, on purpose.** These four widths sum to **840** — 420 + 120 +
 * 132 + 168, and the rendered story's `min-width` reads `840px`. The table's minimum follows
 * the columns rather than a constant, so a consumer who drops a column is not made to scroll
 * for space it no longer occupies.
 */
export const CustomColumns: Story = {
  args: {
    ...Default.args,
    columns: [
      { key: 'name', width: 420 },
      {
        key: 'status',
        label: 'Status',
        width: 120,
        renderCell: (row) => (
          <span className="text-body-m font-normal text-main font-sans">
            {row.dueDateUrgency === 'overdue' ? 'Blocked' : 'On track'}
          </span>
        ),
      },
      { key: 'dueDate' },
      { key: 'tags' },
    ],
  },
};
