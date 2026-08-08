import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import type { Decorator } from '@storybook/react';
import { Item } from 'react-stately';
import { TaskTableRow } from './task-table';
import { Menu } from '../menu/menu';
import { MenuDotsIcon } from '../icons/icons';
import { withSurface } from '../../../.storybook/decorators';

/**
 * `TaskTableRow` renders a `<tr>`, so a story that mounts it bare produces invalid DOM — the
 * browser hoists the row out of its container and the cell borders never collapse.
 *
 * The `<colgroup>` is not decoration either. `TaskTable` sets `table-fixed` and gives each
 * column an explicit width; without them the row lays itself out on content and every cell sits
 * at the wrong size, which would make this page a misleading picture of the component. The five
 * widths sum to 1108px, which is `TaskTable`'s own `min-w-[1108px]` — see `src/styles/
 * decisions.mdx:83`. They are duplicated here rather than exported because `COLUMN_WIDTHS` is
 * module-private and #97 may replace the whole notion of a fixed column set.
 */
const COLUMN_WIDTHS = [500, 168, 140, 168, 132];

const inTable: Decorator = (Story) => (
  <table className="border-collapse table-fixed">
    <colgroup>
      {COLUMN_WIDTHS.map((w) => (
        <col key={w} style={{ width: w }} />
      ))}
    </colgroup>
    <tbody>
      <Story />
    </tbody>
  </table>
);

/**
 * One row of `TaskTable`'s list view.
 *
 * A row is only ever constructed through `TaskTable`'s `groups[].rows`, which is typed
 * `TaskTableRowProps[]` — so every prop below is part of `TaskTable`'s public surface even
 * though the component is rarely rendered directly. This page exists because that was not true
 * of the published API reference: `task-table.stories.tsx` registers `component: TaskTable`
 * only, so autodocs documented `TaskTableProps` and nothing else, and the JSDoc written for
 * these props reached no reader (#91).
 */
const meta: Meta<typeof TaskTableRow> = {
  title: 'Layout/TaskTableRow',
  component: TaskTableRow,
  tags: ['autodocs'],
  decorators: [inTable, withSurface('neutral-5')],
  parameters: { layout: 'fullscreen' },
  args: {
    index: 1,
    title: 'Create wireframe',
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

/** The row as `TaskTable` renders it with only the two required props. */
export const Default: Story = {};

/**
 * Every column populated. The five cells are Task Name, Task Tags, Estimate, Task Assign Name
 * and Due Date, in that order.
 */
export const Populated: Story = {
  args: {
    indicatorColor: 'red',
    tags: [{ label: 'Design', variant: 'blue' }],
    estimationPoints: 4,
    assigneeName: 'Amelia Nellson',
    dueDate: 'Yesterday',
    dueDateUrgency: 'overdue',
  },
};

/**
 * With no `assigneeName`, the cell still renders and `Avatar` carries the state — the row
 * announces "Unassigned" rather than presenting an empty cell (#111). `unassignedLabel`
 * changes what it says.
 */
export const Unassigned: Story = {
  args: { estimationPoints: 4, dueDate: 'Tomorrow' },
};

/**
 * `reactions` are read-only counters after the title, and `onViewDetails` renders the trailing
 * "Details" link. They are different things occupying nearby space — see the prop table.
 */
export const ReactionsAndDetails: Story = {
  args: {
    reactions: [
      { emoji: '💬', count: 3 },
      { emoji: '🔗', count: 5 },
    ],
    onViewDetails: fn(),
  },
};

/**
 * The select checkbox is `sr-only` and only `opacity-0` until hover, so it is in the
 * accessibility tree either way. `isSelectable={false}` is how a consumer with no bulk-selection
 * feature omits it entirely; `selectLabel` names it.
 */
export const Selectable: Story = {
  args: {
    isSelected: true,
    selectLabel: 'Select Create wireframe in To Do',
    onSelectedChange: fn(),
  },
};

/**
 * `actions` lands in the Task Name cell rather than a sixth column, because the five column
 * widths sum to the row's fixed 1108px (#95).
 */
export const WithActions: Story = {
  args: {
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
};

/** Controls for every prop. */
export const Playground: Story = {
  args: {
    indicatorColor: 'green',
    estimationPoints: 2,
    assigneeName: 'Jerome Bell',
    dueDate: 'In 3 days',
  },
};
