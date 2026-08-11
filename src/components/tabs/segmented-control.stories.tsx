import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { SegmentedControl } from './segmented-control';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Primitives/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  args: {
    options: [
      { id: 'board', label: 'Board' },
      { id: 'list', label: 'List' },
      { id: 'table', label: 'Table' },
    ],
    onChange: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 'board',
  },
};

/**
 * Every control live. `label` names the group for assistive tech — give it something specific
 * when a page holds more than one switcher — and `defaultValue` seeds the uncontrolled case
 * while `value` drives the controlled one.
 */
export const Playground: Story = {
  args: {
    defaultValue: 'list',
    label: 'Task layout',
    // `w-72`, not `w-64` (#20): no consumer constrains this component's width today — this
    // number exists only to demonstrate that `className` is honoured — but `w-64` (256px)
    // clipped "Board"/"List"/"Table" by 8px under a DejaVu Sans fallback, which would have
    // made this story itself the next macOS-only-passing example. `w-72` carries slack
    // under both fonts without pretending to be a real design value.
    className: 'w-72',
  },
};

/**
 * The group's accessible name. It defaults to "View", which was hardcoded before this prop
 * existed — right for a view switcher, wrong for every other use of a segmented control.
 */
export const CustomGroupLabel: Story = {
  args: {
    defaultValue: 'board',
    label: 'Density',
  },
};

/**
 * Drives the hand-rolled keyboard handling directly (#16) — this component does not wrap a
 * react-aria hook (see the component's own doc comment for why), so nothing else in this repo
 * exercises `handleKeyDown`'s roving tabindex. Clicking "List" selects it and calls `onChange`;
 * ArrowRight from there wraps to "Board" (modular arithmetic, not a hardcoded last index) and
 * moves focus there without a click, matching the WAI-ARIA radiogroup pattern the component's
 * own comment cites.
 */
export const KeyboardNavigation: Story = {
  args: {
    defaultValue: 'board',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const list = canvas.getByRole('radio', { name: 'List' });
    await userEvent.click(list);
    expect(list).toHaveAttribute('aria-checked', 'true');
    expect(args.onChange).toHaveBeenCalledWith('list');

    await userEvent.keyboard('{ArrowRight}');
    const table = canvas.getByRole('radio', { name: 'Table' });
    expect(table).toHaveAttribute('aria-checked', 'true');
    expect(table).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    const board = canvas.getByRole('radio', { name: 'Board' });
    expect(board).toHaveAttribute('aria-checked', 'true');
    expect(board).toHaveFocus();
  },
};
