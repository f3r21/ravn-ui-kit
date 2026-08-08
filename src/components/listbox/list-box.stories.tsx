import type { Meta, StoryObj } from '@storybook/react-vite';
import { useListState, Item } from 'react-stately';
import { withSurface } from '../../../.storybook/decorators';
import { ListBox } from './list-box';

interface DemoItem {
  id: string;
  label: string;
  isDisabled?: boolean;
}

const items: DemoItem[] = [
  { id: 'board', label: 'Board' },
  { id: 'list', label: 'List' },
  { id: 'table', label: 'Table' },
  { id: 'timeline', label: 'Timeline', isDisabled: true },
];

function ListBoxDemo({ selectionMode = 'single' }: { selectionMode?: 'single' | 'multiple' }) {
  const state = useListState<DemoItem>({
    items,
    selectionMode,
    disabledKeys: items.filter((item) => item.isDisabled).map((item) => item.id),
    children: (item) => (
      <Item key={item.id} textValue={item.label}>
        {item.label}
      </Item>
    ),
  });

  return <ListBox aria-label="Views" state={state} />;
}

const meta: Meta<typeof ListBox> = {
  title: 'Primitives/ListBox',
  component: ListBox,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-4', 'rounded-xl overflow-hidden inline-block')],
  argTypes: {
    // `state` is a react-stately object built by a hook (useListState/
    // useSelectState), not a value Storybook's controls can meaningfully
    // edit — the demo wrapper below builds it instead.
    state: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ListBoxDemo />,
};

export const MultipleSelection: Story = {
  render: () => <ListBoxDemo selectionMode="multiple" />,
};
