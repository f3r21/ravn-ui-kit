import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    name: 'Jerome Bell',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'Fernando Ramirez', size: 'md' },
};

export const Playground: Story = {
  args: { name: 'Jane Doe', size: 'md' },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Avatar key={s} {...args} size={s} />
      ))}
    </div>
  ),
};

export const InitialsSmall: Story = {
  args: {
    name: 'Fernando Ramirez',
    size: 'sm',
  },
};

export const InitialsMedium: Story = {
  args: {
    name: 'Jerome Bell',
    size: 'md',
  },
};

export const InitialsLarge: Story = {
  args: {
    name: 'Jane Doe',
    size: 'lg',
  },
};

/**
 * No `name` — an unassigned task, which the consuming API returns as a genuine state
 * (`Task.assignee` is nullable). The visible fallback is still `?`; what changed in #47 is that
 * it now has an accessible name instead of being a `<div>` holding a question mark with no role.
 * Override `fallbackLabel` for a non-English consumer.
 */
export const Unassigned: Story = {
  args: { size: 'md' },
};

/**
 * With an image, the name is on the wrapper and the `<img>` is `alt=""` — so a screen reader
 * announces "Grace Stone", not "image, Grace Stone", and announces it once rather than twice.
 */
export const WithImage: Story = {
  args: {
    name: 'Grace Stone',
    // A data URI rather than a remote portrait: no other story in this kit fetches over the
    // network, and CI's axe pass runs against the built Storybook — a story that needs the
    // internet fails for a reason that has nothing to do with the component.
    src:
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">' +
          '<rect width="48" height="48" fill="#6b7f9e"/>' +
          '<circle cx="24" cy="18" r="8" fill="#dfe5ee"/>' +
          '<path d="M6 48c0-11 8-18 18-18s18 7 18 18z" fill="#dfe5ee"/>' +
          '</svg>',
      ),
    size: 'lg',
  },
};
