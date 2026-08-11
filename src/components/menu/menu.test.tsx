import { act, createRef } from 'react';
import { Item } from 'react-stately';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Menu } from './menu';

interface DemoItem {
  id: string;
  label: string;
  isDisabled?: boolean;
}

const ITEMS: DemoItem[] = [
  { id: 'edit', label: 'Edit' },
  { id: 'move', label: 'Move' },
  { id: 'archive', label: 'Archive', isDisabled: true },
  { id: 'zap', label: 'Zap' },
];

function renderMenu(props: Partial<React.ComponentProps<typeof Menu<DemoItem>>> = {}) {
  render(
    <Menu<DemoItem>
      label="Task options"
      triggerContent={<span aria-hidden>⋯</span>}
      items={ITEMS}
      disabledKeys={ITEMS.filter((item) => item.isDisabled).map((item) => item.id)}
      {...props}
    >
      {(item) => <Item key={item.id}>{item.label}</Item>}
    </Menu>,
  );
  return screen.getByRole('button', { name: 'Task options' });
}

describe('Menu Component', () => {
  it('renders a labeled trigger button with aria-haspopup wiring', () => {
    const trigger = renderMenu();
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens the menu on click and shows all items', async () => {
    const user = userEvent.setup();
    const trigger = renderMenu();
    await user.click(trigger);
    expect(screen.getByRole('menu')).toBeDefined();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeDefined();
    expect(screen.getByRole('menuitem', { name: 'Move' })).toBeDefined();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it.each(['{Enter}', ' ', '{ArrowDown}'])('opens the menu with keyboard key %s', async (key) => {
    const user = userEvent.setup();
    const trigger = renderMenu();
    act(() => trigger.focus());
    await user.keyboard(key);
    expect(screen.getByRole('menu')).toBeDefined();
  });

  it('moves focus with ArrowDown/ArrowUp between items', async () => {
    const user = userEvent.setup();
    const trigger = renderMenu();
    act(() => trigger.focus());
    await user.keyboard('{ArrowDown}');
    const edit = screen.getByRole('menuitem', { name: 'Edit' });
    const move = screen.getByRole('menuitem', { name: 'Move' });
    expect(edit).toBe(document.activeElement);

    await user.keyboard('{ArrowDown}');
    expect(move).toBe(document.activeElement);

    await user.keyboard('{ArrowUp}');
    expect(edit).toBe(document.activeElement);
  });

  it('jumps focus to an item via typeahead', async () => {
    const user = userEvent.setup();
    const trigger = renderMenu();
    act(() => trigger.focus());
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBe(document.activeElement);

    await user.keyboard('z');
    expect(screen.getByRole('menuitem', { name: 'Zap' })).toBe(document.activeElement);
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const trigger = renderMenu();
    await user.click(trigger);
    expect(screen.getByRole('menu')).toBeDefined();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    // `FocusScope`'s `restoreFocus` moves focus back via `requestAnimationFrame`
    // (a Safari-focus-event-ordering workaround), so it lands one tick after
    // the popover unmounts rather than synchronously with it.
    await waitFor(() => expect(trigger).toBe(document.activeElement));
  });

  it('calls onAction with the activated item key and closes the menu', async () => {
    const handleAction = vi.fn();
    const user = userEvent.setup();
    const trigger = renderMenu({ onAction: handleAction });
    await user.click(trigger);
    await user.click(screen.getByRole('menuitem', { name: 'Move' }));

    expect(handleAction).toHaveBeenCalledWith('move', ITEMS[1]);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('does not fire onAction for a disabled item', async () => {
    const handleAction = vi.fn();
    const user = userEvent.setup();
    const trigger = renderMenu({ onAction: handleAction });
    await user.click(trigger);
    const archived = screen.getByRole('menuitem', { name: 'Archive' });
    expect(archived.getAttribute('aria-disabled')).toBe('true');
    await user.click(archived);
    expect(handleAction).not.toHaveBeenCalled();
  });

  it('does not open when isDisabled', async () => {
    const user = userEvent.setup();
    const trigger = renderMenu({ isDisabled: true });
    await user.click(trigger);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('forwards a ref to the trigger button (#11)', () => {
    const ref = createRef<HTMLButtonElement>();
    const trigger = renderMenu({ ref });
    expect(ref.current).toBe(trigger);
  });
});
