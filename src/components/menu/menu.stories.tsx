import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';
import { Item } from 'react-stately';
import { withSurface } from '../../../.storybook/decorators';
import { Menu, type MenuProps } from './menu';

interface ActionOption {
  id: string;
  label: string;
  isDisabled?: boolean;
}

const ACTIONS: ActionOption[] = [
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'archive', label: 'Archive', isDisabled: true },
  { id: 'delete', label: 'Delete' },
];

const DotsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <circle cx="12" cy="5" r="1.75" />
    <circle cx="12" cy="12" r="1.75" />
    <circle cx="12" cy="19" r="1.75" />
  </svg>
);

const meta: Meta<typeof Menu<ActionOption>> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  argTypes: {
    items: { control: false },
    children: { control: false },
  },
  args: {
    label: 'Task options',
    triggerContent: <DotsIcon />,
    triggerClassName:
      'w-10 h-10 rounded-sm inline-flex items-center justify-center text-main hover:bg-neutral-4',
    items: ACTIONS,
    disabledKeys: ACTIONS.filter((item) => item.isDisabled).map((item) => item.id),
    children: (item: ActionOption) => (
      <Item key={item.id} textValue={item.label}>
        {item.label}
      </Item>
    ),
    onAction: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Every control live. `label` is the trigger's accessible name — a page of these otherwise
 * offers a screen-reader user a list of identical "options" buttons — and `isDisabled` and
 * `triggerClassName` are the other two props the component declares.
 */
export const Playground: Story = {
  args: {
    label: 'Task options for Create wireframe',
    isDisabled: false,
    triggerClassName: 'w-8 h-8 rounded-sm inline-flex items-center justify-center text-main',
  },
};

/**
 * Drives the actual open → pick → close cycle (#16), rather than asserting only that a menu
 * renders. Also confirms the disabled item is truly inert: `Archive` never fires `onAction`
 * and the menu stays open through the attempted click, which is `aria-disabled`'s contract,
 * not merely a visual dimming.
 *
 * Queries the menu via `screen`, not `within(canvasElement)`: `Menu` composes the portalled
 * `FloatingPopover`, so the open menu renders as a sibling of `document.body`, outside the
 * canvas root entirely — the same reason `FloatingPopover`'s own story exists to prove escape
 * from a clipping ancestor.
 */
export const OpensPicksAndCloses: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Task options' });

    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu');
    expect(menu).toBeInTheDocument();

    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Archive' }));
    expect(args.onAction).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Duplicate' }));
    // `onAction`'s own contract (`AriaMenuProps<T>['onAction']`, untouched by this kit) is
    // one argument, a `Key` — but the real call, caught here rather than assumed, also
    // carries the full item node as a second argument. `expect.anything()` pins that a
    // second argument exists without pinning its exact shape to a react-aria implementation
    // detail one version bump could change either way.
    expect(args.onAction).toHaveBeenCalledWith('duplicate', expect.anything());
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  },
};

/**
 * Proves the trigger sitting inside a small `overflow: hidden` container
 * (standing in for a task card in a scrolling board column) doesn't clip the
 * open menu — the same reason `Select`/`MultiSelect` compose the portalled
 * `FloatingPopover` rather than the Section 2 `Popover`.
 */
export const InsideOverflowHiddenContainer: Story = {
  render: (args) => (
    <div className="w-40 h-24 overflow-hidden border border-dashed border-neutral-2 p-4 flex justify-end">
      <Menu {...(args as MenuProps<ActionOption>)} />
    </div>
  ),
};
