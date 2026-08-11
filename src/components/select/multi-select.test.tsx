import { createRef, useState } from 'react';
import { Item, type Selection } from 'react-stately';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MultiSelect } from './multi-select';

interface DemoItem {
  id: string;
  label: string;
  isDisabled?: boolean;
}

const ITEMS: DemoItem[] = [
  { id: 'bug', label: 'Bug' },
  { id: 'feature', label: 'Feature' },
  { id: 'wontfix', label: 'Won’t fix', isDisabled: true },
];

function Harness({
  onSelectionChange,
  isDisabled,
  triggerRef,
}: {
  onSelectionChange?: (keys: Selection) => void;
  isDisabled?: boolean;
  triggerRef?: React.Ref<HTMLButtonElement>;
}) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  return (
    <MultiSelect<DemoItem>
      label="Labels"
      placeholder="Select labels"
      items={ITEMS}
      disabledKeys={ITEMS.filter((item) => item.isDisabled).map((item) => item.id)}
      selectedKeys={selectedKeys}
      isDisabled={isDisabled}
      ref={triggerRef}
      onSelectionChange={(keys) => {
        setSelectedKeys(keys);
        onSelectionChange?.(keys);
      }}
    >
      {(item) => (
        <Item key={item.id} textValue={item.label}>
          {item.label}
        </Item>
      )}
    </MultiSelect>
  );
}

describe('MultiSelect Component', () => {
  it('renders a labeled trigger showing the placeholder when nothing is selected', () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Labels' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.textContent).toContain('Select labels');
  });

  it('opens the option list on click', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Labels' }));
    expect(screen.getByRole('listbox', { name: 'Labels' })).toBeDefined();
    expect(screen.getByRole('option', { name: 'Bug' })).toBeDefined();
  });

  it('toggles multiple items on and keeps the popover open between picks', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onSelectionChange={handleChange} />);
    const trigger = screen.getByRole('button', { name: 'Labels' });
    await user.click(trigger);

    await user.click(screen.getByRole('option', { name: 'Bug' }));
    expect(screen.getByRole('listbox')).toBeDefined();

    await user.click(screen.getByRole('option', { name: 'Feature' }));
    expect(screen.getByRole('listbox')).toBeDefined();

    const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
    expect(new Set(lastCall)).toEqual(new Set(['bug', 'feature']));
  });

  it('renders the selection as the trigger value, comma-separated', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Labels' }));
    await user.click(screen.getByRole('option', { name: 'Bug' }));

    // `{ hidden: true }`: while the popover is open, the trigger (like
    // everything else outside the popover) is `aria-hidden` — the same
    // modal-like behavior `FloatingPopover` gives every consumer — so it's
    // intentionally absent from the default accessible-only query.
    const trigger = screen.getByRole('button', { name: 'Labels', hidden: true });
    expect(trigger.textContent).toContain('Bug');

    await user.click(screen.getByRole('option', { name: 'Feature' }));
    // One value, comma-separated, the way `Select` shows its single one — not nested
    // `Tag` chips, which is what this rendered before the trigger became the design's
    // own 32px chip and a chip inside a chip stopped making sense.
    expect(screen.getByRole('button', { name: 'Labels', hidden: true }).textContent).toContain(
      'Bug, Feature',
    );
  });

  /** Same pin, and the same reasoning, as `Select`'s. */
  it('paints the trigger on the design chip rather than a light field', () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Labels' });
    expect(trigger.className).toContain('bg-neutral-2/10');
    expect(trigger.className).not.toContain('bg-surface-neutral');
  });

  it('toggling a selected item again removes it', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onSelectionChange={handleChange} />);
    await user.click(screen.getByRole('button', { name: 'Labels' }));
    const bug = screen.getByRole('option', { name: 'Bug' });
    await user.click(bug);
    expect(bug.getAttribute('aria-selected')).toBe('true');

    await user.click(bug);
    expect(bug.getAttribute('aria-selected')).toBe('false');
    const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
    expect(new Set(lastCall).size).toBe(0);
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Labels' }));
    expect(screen.getByRole('listbox')).toBeDefined();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('does not open when isDisabled', async () => {
    const user = userEvent.setup();
    render(<Harness isDisabled />);
    await user.click(screen.getByRole('button', { name: 'Labels' }));
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('does not let a disabled option be selected', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onSelectionChange={handleChange} />);
    await user.click(screen.getByRole('button', { name: 'Labels' }));
    const wontfix = screen.getByRole('option', { name: 'Won’t fix' });
    expect(wontfix.getAttribute('aria-disabled')).toBe('true');
    await user.click(wontfix);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('forwards a ref to the trigger button (#11)', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Harness triggerRef={ref} />);
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Labels' }));
  });
});
