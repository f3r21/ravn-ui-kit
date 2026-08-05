import type { Meta, StoryObj } from '@storybook/react';
import { withSurface } from '../../../.storybook/decorators';
import {
  AlarmIcon,
  AssigneeIcon,
  AttachmentIcon,
  BellIcon,
  CalendarIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CommentIcon,
  GridViewIcon,
  type IconProps,
  LabelIcon,
  ListViewIcon,
  LogoMark,
  MenuDotsIcon,
  PlusIcon,
  PointsIcon,
  SearchIcon,
  SubtaskIcon,
} from './icons';

/**
 * `component` is `PlusIcon` rather than an "Icons" wrapper because there is no wrapper to
 * introspect — this is a set of sibling components, not one component with a `name` prop
 * (see the module doc comment for why). Every glyph shares the same `IconProps`, so the
 * autodocs prop table generated from one of them describes all of them.
 */
const meta: Meta<typeof PlusIcon> = {
  title: 'Primitives/Icons',
  component: PlusIcon,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  args: {
    className: 'size-6',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const FIGMA_EXPORTED: [string, (p: IconProps) => React.ReactElement][] = [
  ['MenuDotsIcon', MenuDotsIcon],
  ['AlarmIcon', AlarmIcon],
  ['AttachmentIcon', AttachmentIcon],
  ['SubtaskIcon', SubtaskIcon],
  ['CommentIcon', CommentIcon],
  ['GridViewIcon', GridViewIcon],
  ['ListViewIcon', ListViewIcon],
  ['PlusIcon', PlusIcon],
  ['SearchIcon', SearchIcon],
  ['BellIcon', BellIcon],
  ['PointsIcon', PointsIcon],
  ['AssigneeIcon', AssigneeIcon],
  ['LabelIcon', LabelIcon],
  ['CalendarIcon', CalendarIcon],
  ['LogoMark', LogoMark],
];

const RECONSTRUCTED: [string, (p: IconProps) => React.ReactElement][] = [
  ['ChevronLeftIcon', ChevronLeftIcon],
  ['ChevronRightIcon', ChevronRightIcon],
];

const NO_FIGMA_SOURCE: [string, (p: IconProps) => React.ReactElement][] = [
  ['ChevronDownIcon', ChevronDownIcon],
  ['ChevronDoubleLeftIcon', ChevronDoubleLeftIcon],
  ['ChevronDoubleRightIcon', ChevronDoubleRightIcon],
  ['CloseIcon', CloseIcon],
];

function Grid({ items }: { items: [string, (p: IconProps) => React.ReactElement][] }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4 list-none p-0 m-0">
      {items.map(([name, Glyph]) => (
        <li
          key={name}
          className="flex flex-col items-center gap-2 p-4 rounded-sm bg-surface-panel text-main"
        >
          <Glyph className="size-6" />
          <code className="text-xs text-muted text-center break-all font-sans">{name}</code>
        </li>
      ))}
    </ul>
  );
}

function Section({
  title,
  blurb,
  items,
}: {
  title: string;
  blurb: string;
  items: [string, (p: IconProps) => React.ReactElement][];
}) {
  return (
    <section className="mb-8">
      <h3 className="text-main text-body-m font-semibold mb-1">{title}</h3>
      <p className="text-muted text-xs mb-4 max-w-prose">{blurb}</p>
      <Grid items={items} />
    </section>
  );
}

/**
 * The whole set, grouped by how well-evidenced each glyph's shape is. The grouping is the
 * point: a design system that cannot say where a glyph came from will eventually ship one
 * nobody can defend.
 */
export const AllIcons: Story = {
  render: () => (
    <div>
      <Section
        title="Figma-exported"
        blurb="Path data is the design's own SVG export, verbatim, with the baked fill swapped for currentColor. Where the design names a remix-icons component, the icon's doc comment records it."
        items={FIGMA_EXPORTED}
      />
      <Section
        title="Reconstructed from Figma layout metrics"
        blurb="No path export exists, but the design file records the box, stroke width and percentage insets — so the geometry is derived from real numbers rather than guessed. Each icon's comment shows the derivation."
        items={RECONSTRUCTED}
      />
      <Section
        title="No Figma source"
        blurb="Engineering additions for controls the design never drew — a dismissible dialog, a combobox disclosure, year-at-a-time date navigation. Drawn to the same 24x24 / 2px-stroke system so the family stays coherent."
        items={NO_FIGMA_SOURCE}
      />
    </div>
  ),
};

/**
 * Icons carry no intrinsic size — they scale to whatever the caller sets, and non-square
 * glyphs keep their aspect ratio inside the box rather than stretching to fill it.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6 text-main">
      {(['size-3', 'size-4', 'size-6', 'size-8', 'size-12'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <AlarmIcon className={size} />
          <code className="text-xs text-muted font-sans">{size}</code>
        </div>
      ))}
    </div>
  ),
};

/**
 * Colour comes from the text colour, never from the glyph. The design ships the alarm
 * icon twice — once white, once red — purely because a baked fill cannot be overridden;
 * here that is one icon and a `text-*` class.
 */
export const Colour: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(['text-main', 'text-muted', 'text-danger', 'text-primary-4'] as const).map((tone) => (
        <div key={tone} className={`flex flex-col items-center gap-2 ${tone}`}>
          <AlarmIcon className="size-8" />
          <code className="text-xs font-sans">{tone}</code>
        </div>
      ))}
    </div>
  ),
};

/**
 * Decorative by default, named on request.
 *
 * The first icon below is `aria-hidden` and invisible to assistive technology — correct,
 * because the button's own text already names it. The second has no text beside it, so it
 * is given `aria-label`, which promotes it to `role="img"` and drops the `aria-hidden`
 * automatically. Run the a11y addon on this story: both buttons must come out named.
 */
export const Accessibility: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-surface-panel text-main"
      >
        <PlusIcon className="size-4" />
        Add task
      </button>

      <button
        type="button"
        aria-label="Notifications"
        className="inline-flex items-center justify-center size-10 rounded-sm bg-surface-panel text-main"
      >
        <BellIcon className="size-6" />
      </button>

      <div className="flex items-center gap-2 text-main">
        <LogoMark className="size-10" aria-label="Ravn" />
        <span className="text-xs text-muted font-sans">
          LogoMark is meaningful, so it takes a name
        </span>
      </div>
    </div>
  ),
};

/** Every prop live, on a single glyph. */
export const Playground: Story = {
  args: {
    className: 'size-12',
  },
  render: (args) => (
    <div className="text-main">
      <AlarmIcon {...args} />
    </div>
  ),
};
