import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TaskCard } from './task-card';
import { Item } from 'react-stately';
import { MenuDotsIcon, AlarmIcon } from '../icons/icons';
import { Menu } from '../menu/menu';

const CommentIcon = () => (
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
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const AttachmentIcon = () => (
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
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const meta: Meta<typeof TaskCard> = {
  title: 'Components/TaskCard',
  component: TaskCard,
  tags: ['autodocs'],
  argTypes: {
    dueDateUrgency: {
      control: 'select',
      options: ['normal', 'soon', 'overdue'],
    },
  },
  args: {
    onPress: fn(),
    title: 'Working (03) - RAVN Challenge',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Working (03) - RAVN Challenge',
    points: 3,
    dueDateText: '3 DAYS',
    dueDateUrgency: 'soon',
    tags: [
      { label: 'BACKEND', accent: 'green' },
      { label: 'HIGH', accent: 'yellow' },
    ],
    assigneeName: 'Jerome Bell',
    metaBadges: [
      { icon: <CommentIcon />, count: 5, label: '5 comments' },
      { icon: <AttachmentIcon />, count: 2, label: '2 attachments' },
    ],
  },
};

export const Playground: Story = {
  args: {
    title: 'Working (03) - RAVN Challenge',
    points: 3,
    dueDateText: '3 DAYS',
    dueDateUrgency: 'soon',
  },
};

/**
 * The `actions` slot holds a per-card control — in practice an overflow menu. Name it for the
 * task it belongs to, because a board of cards otherwise offers a screen-reader user a list of
 * identical "options" buttons. Activating it does not open the card behind it.
 *
 * The card is an `<article>` labelled by its own title heading, so it is reachable by article
 * navigation without being one big control named by every string it renders.
 */
export const WithActions: Story = {
  args: {
    title: 'Fix Critical GraphQL Bug',
    points: 5,
    dueDateText: '3 DAYS',
    dueDateUrgency: 'soon',
    tags: [{ label: 'BUG', accent: 'red' }],
    assigneeName: 'Fernando Ramirez',
    onPress: fn(),
    actions: (
      <button
        type="button"
        aria-label="Task options for Fix Critical GraphQL Bug"
        className="flex items-center justify-center w-6 h-6 rounded-xs text-muted hover:text-main cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
      >
        <MenuDotsIcon className="size-6" />
      </button>
    ),
  },
};

export const Overdue: Story = {
  args: {
    title: 'Fix Critical GraphQL Bug',
    points: 5,
    dueDateText: 'OVERDUE',
    dueDateUrgency: 'overdue',
    tags: [{ label: 'BUG', accent: 'red' }],
    assigneeName: 'Fernando Ramirez',
    metaBadges: [{ icon: <CommentIcon />, count: 12, label: '12 comments' }],
  },
};

/**
 * #15. The kit declared `MenuDotsIcon` as *"Overflow / 'more actions' affordance — opens a
 * task card's options menu"*, `ProjectInfo` exposed an `icon` slot, and `TaskCard` forwarded
 * nothing — it shipped the slot and blocked it.
 *
 * Both slots at once, because they are different jobs: `icon` is the decorative 24×24 glyph
 * Figma's own "Project Info" instance draws inside the title row, and `actions` is the real
 * control beside it. A `Menu` in `icon` would be clipped by that fixed box.
 */
export const WithIconAndMenu: Story = {
  args: {
    title: 'Fix Critical GraphQL Bug',
    points: 5,
    dueDateText: 'OVERDUE',
    dueDateUrgency: 'overdue',
    assigneeName: 'Fernando Ramirez',
    icon: <AlarmIcon className="size-6" />,
    actions: (
      <Menu<{ id: string; label: string }>
        label="Task options for Fix Critical GraphQL Bug"
        triggerContent={<MenuDotsIcon className="size-5" />}
        triggerClassName="w-8 h-8 rounded-sm inline-flex items-center justify-center text-main hover:bg-neutral-4 focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
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

/**
 * #102. Every other story here passes labels that are already capitalised (`'BUG'`,
 * `'BACKEND'`), which cannot show whether the caps come from the component or from the string
 * — so this one passes natural case deliberately.
 *
 * `Design system` and `iOS app` render as `DESIGN SYSTEM` and `IOS APP`, while the third chip
 * opts out via `className: 'normal-case'`. The DOM text is unchanged in all three: inspect
 * with `document.querySelector('article').textContent` and you get the strings as passed,
 * which is what a screen reader announces and what a consumer's tests query.
 */
export const TagCasing: Story = {
  args: {
    title: 'Fix Critical GraphQL Bug',
    tags: [
      { label: 'Design system', accent: 'green' },
      { label: 'iOS app', accent: 'blue' },
      { label: 'left as typed', accent: 'neutral', className: 'normal-case' },
    ],
    assigneeName: 'Fernando Ramirez',
  },
};
