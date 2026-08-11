import { act, createRef } from 'react';
import { useListState, Item } from 'react-stately';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ListBox } from './list-box';

interface DemoItem {
  id: string;
  label: string;
  isDisabled?: boolean;
}

const ITEMS: DemoItem[] = [
  { id: 'a', label: 'Option A' },
  { id: 'b', label: 'Option B' },
  { id: 'c', label: 'Option C', isDisabled: true },
];

function Harness({
  selectionMode = 'single' as 'single' | 'multiple',
  onSelectionChange,
  listRef,
}: {
  selectionMode?: 'single' | 'multiple';
  onSelectionChange?: (keys: Set<string>) => void;
  listRef?: React.Ref<HTMLUListElement>;
}) {
  const state = useListState<DemoItem>({
    items: ITEMS,
    selectionMode,
    disabledKeys: ITEMS.filter((item) => item.isDisabled).map((item) => item.id),
    onSelectionChange: onSelectionChange
      ? (keys) => onSelectionChange(keys === 'all' ? new Set() : (keys as Set<string>))
      : undefined,
    children: (item) => (
      <Item key={item.id} textValue={item.label}>
        {item.label}
      </Item>
    ),
  });

  return <ListBox aria-label="Demo options" state={state} ref={listRef} />;
}

describe('ListBox Component', () => {
  it('renders role="listbox" with role="option" children and correct aria-selected wiring', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const listbox = screen.getByRole('listbox', { name: 'Demo options' });
    expect(listbox).toBeDefined();
    const optionA = screen.getByRole('option', { name: 'Option A' });
    expect(optionA.getAttribute('aria-selected')).toBe('false');

    await user.click(optionA);
    expect(optionA.getAttribute('aria-selected')).toBe('true');
  });

  it('calls onSelectionChange with the selected key when an option is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onSelectionChange={handleChange} />);
    await user.click(screen.getByRole('option', { name: 'Option B' }));
    expect([...handleChange.mock.calls[0][0]]).toEqual(['b']);
  });

  it('moves focus with ArrowDown/ArrowUp between options', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const optionA = screen.getByRole('option', { name: 'Option A' });
    const optionB = screen.getByRole('option', { name: 'Option B' });

    act(() => optionA.focus());
    expect(optionA).toBe(document.activeElement);

    await user.keyboard('{ArrowDown}');
    expect(optionB).toBe(document.activeElement);

    await user.keyboard('{ArrowUp}');
    expect(optionA).toBe(document.activeElement);
  });

  it('selects the focused option with Enter/Space', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onSelectionChange={handleChange} />);
    act(() => screen.getByRole('option', { name: 'Option A' }).focus());
    await user.keyboard('{Enter}');
    expect([...handleChange.mock.calls[0][0]]).toEqual(['a']);
  });

  it('does not select a disabled option on click', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onSelectionChange={handleChange} />);
    const optionC = screen.getByRole('option', { name: 'Option C' });
    expect(optionC.getAttribute('aria-disabled')).toBe('true');
    await user.click(optionC);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('supports multiple selection with selectionBehavior toggle, keeping prior selections', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness selectionMode="multiple" onSelectionChange={handleChange} />);
    await user.click(screen.getByRole('option', { name: 'Option A' }));
    await user.click(screen.getByRole('option', { name: 'Option B' }));
    const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
    expect(new Set(lastCall)).toEqual(new Set(['a', 'b']));
  });

  it('forwards a ref to the root ul (#11)', () => {
    const ref = createRef<HTMLUListElement>();
    render(<Harness listRef={ref} />);
    expect(ref.current).toBe(screen.getByRole('listbox'));
  });
});
