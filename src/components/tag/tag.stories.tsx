import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tag } from './tag';
import { withSurface } from '../../../.storybook/decorators';

const CheckIcon = () => (
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
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const meta: Meta<typeof Tag> = {
  title: 'Primitives/Tag',
  component: Tag,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-4')],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'red', 'green', 'yellow', 'blue'],
    },
  },
  args: {
    children: 'Label',
    onRemove: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'neutral', onRemove: undefined },
};

export const Playground: Story = {
  args: { children: 'New Tag', onRemove: undefined },
};

/** Style=Solid × Type=General/Green/Blue/Yellow/Red (Tags00/01.md). */
export const SolidVariants: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {(['neutral', 'green', 'blue', 'yellow', 'red'] as const).map((v) => (
        <Tag key={v} {...args} variant={v}>
          {v}
        </Tag>
      ))}
    </div>
  ),
  args: { onRemove: undefined },
};

/** Style=Outline × Type=General/Green/Blue/Yellow/Red (Tags00/01.md). */
export const OutlineVariants: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {(['neutral', 'green', 'blue', 'yellow', 'red'] as const).map((v) => (
        <Tag key={v} {...args} variant={v} outline>
          {v}
        </Tag>
      ))}
    </div>
  ),
  args: { onRemove: undefined },
};

/** Icon=Left slot, Style=Solid (Tags00/01.md). */
export const WithIcon: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {(['neutral', 'green', 'blue', 'yellow', 'red'] as const).map((v) => (
        <Tag key={v} {...args} variant={v} icon={<CheckIcon />}>
          {v}
        </Tag>
      ))}
    </div>
  ),
  args: { onRemove: undefined },
};

export const Removable: Story = {
  args: { children: 'REACT 19', variant: 'red' },
};

/**
 * Every variant, both styles, on all three dark surfaces a tag can land on.
 *
 * The chip is a **blend**, so the same fill measures differently on each surface and the
 * tightest case is `surface-overlay` — a tag inside a modal or a popover. No story
 * rendered one there directly before this, so the only overlay coverage an axe pass got
 * was incidental, via `Modal/Label`. This story exists to give the audit a target.
 *
 * Each band paints its own surface, so the meta-level `withSurface('neutral-4')` still
 * wraps all three and does not affect what any chip is measured against. There is no way
 * to opt out of it — Storybook *composes* story and meta decorators rather than letting
 * the story replace them, so a `decorators: []` here would be a no-op that reads as if it
 * did something.
 */
export const OnEverySurface: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div>
      {(
        [
          ['bg-surface-overlay', 'surface-overlay — modal card, popover (the tightest)'],
          ['bg-surface-panel', 'surface-panel — cards, columns, sidebar'],
          ['bg-surface-shell', 'surface-shell — the app shell'],
        ] as const
      ).map(([surface, label]) => (
        <div key={surface} className={`${surface} p-6 flex flex-col gap-3`}>
          <p className="text-xs text-muted-on-dark font-sans">{label}</p>
          {([false, true] as const).map((outline) => (
            <div key={String(outline)} className="flex gap-3">
              {(['neutral', 'green', 'blue', 'yellow', 'red'] as const).map((v) => (
                <Tag key={v} {...args} variant={v} outline={outline}>
                  {v}
                </Tag>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
  args: { onRemove: undefined },
};
