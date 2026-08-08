import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { Item } from 'react-stately';
import { TopNav } from './top-nav';
import { Menu } from '../menu/menu';
import { Avatar } from '../avatar/avatar';

const meta: Meta<typeof TopNav> = {
  title: 'Layout/TopNav',
  component: TopNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  // neutral-5 app-shell surface, matching `Dashboard Mockup.md` (Sidebar +
  // TopNav both sit on the neutral-5 background, flush against the sidebar).
  decorators: [withSurface('neutral-5')],
  args: {
    onSearchChange: fn(),
    onSearchSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Property 1=Default — a single trailing icon + avatar, no search value. */
export const Default: Story = {
  args: {
    searchPlaceholder: 'Search tasks, projects...',
    userName: 'Jerome Bell',
  },
};

export const Playground: Story = {
  args: {
    searchPlaceholder: 'Search...',
  },
};

/**
 * Property 1=Selected — Frame 648 grows from 88px (1 icon + avatar) to 136px
 * (2 icons + avatar) once there's a value to clear.
 */
export const WithSearchValue: Story = {
  args: {
    searchValue: 'Fix auth bug',
    userName: 'Jerome Bell',
  },
};

export const NoUser: Story = {
  args: {
    searchPlaceholder: 'Search...',
  },
};

/**
 * Given `onNotificationsClick`, the bell becomes a real button — focusable, activatable and
 * named. Without it the icon stays decorative, which is what every story above renders.
 * Tab to it to see the focus ring; the name carries the unread count, since a bare bell tells
 * a screen-reader user nothing about whether it is worth opening.
 */
export const InteractiveNotifications: Story = {
  args: {
    searchPlaceholder: 'Search tasks, projects...',
    searchLabel: 'Search tasks',
    userName: 'Jerome Bell',
    onNotificationsClick: fn(),
    notificationsLabel: 'Notifications, 3 unread',
  },
};

/**
 * #15. The user area was `userName`/`userAvatar` rendering a bare `Avatar` — but a user
 * avatar in a top nav is an account menu in almost every real application, and the kit ships
 * `Menu` while this component had no way to accept one.
 *
 * `userSlot` takes the real thing. It is not wrapped in a fixed-size box, so the trigger has
 * room for its own padding and focus ring — which the 24×24 `icon` slot does not.
 */
export const WithAccountMenu: Story = {
  args: {
    userSlot: (
      <Menu<{ id: string; label: string }>
        label="Account menu for Jerome Bell"
        triggerContent={<Avatar name="Jerome Bell" size="md" />}
        triggerClassName="rounded-full focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
        items={[
          { id: 'profile', label: 'Profile' },
          { id: 'settings', label: 'Settings' },
          { id: 'signout', label: 'Sign out' },
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
    actions: (
      <button
        type="button"
        aria-label="Help"
        className="w-6 h-6 shrink-0 text-muted hover:text-main transition-colors cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
      >
        ?
      </button>
    ),
  },
};
