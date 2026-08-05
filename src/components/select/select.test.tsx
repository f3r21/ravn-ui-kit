import { act } from 'react';
import { Item } from 'react-stately';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Select } from './select';

interface DemoItem {
  id: string;
  label: string;
  isDisabled?: boolean;
}

const ITEMS: DemoItem[] = [
  { id: 'todo', label: 'To do' },
  { id: 'done', label: 'Done' },
  { id: 'archived', label: 'Archived', isDisabled: true },
];

function renderSelect(props: Partial<React.ComponentProps<typeof Select<DemoItem>>> = {}) {
  render(
    <Select<DemoItem>
      label="Status"
      placeholder="Select status"
      items={ITEMS}
      disabledKeys={ITEMS.filter((item) => item.isDisabled).map((item) => item.id)}
      {...props}
    >
      {(item) => (
        <Item key={item.id} textValue={item.label}>
          {item.label}
        </Item>
      )}
    </Select>
  );
  // The trigger is the only `<button>` on the page (options render as
  // `role="option"`), and its accessible name is composed from the value
  // span and the label span in DOM order ("<value> <label>") — matching on
  // that exact string would make every test brittle to that ordering, so
  // tests below query the single button directly instead.
  return screen.getByRole('button');
}

describe('Select Component', () => {
  it('renders a labeled trigger button showing the placeholder when nothing is selected', () => {
    const trigger = renderSelect();
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.textContent).toContain('Select status');
  });

  it('renders a hidden native <select> mirroring the state, for forms/autofill', () => {
    renderSelect({ name: 'status' });
    const hiddenSelect = document.querySelector('select[name="status"]');
    expect(hiddenSelect).not.toBeNull();
  });

  it('opens the listbox on click and shows all options', async () => {
    const user = userEvent.setup();
    const trigger = renderSelect();
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeDefined();
    expect(screen.getByRole('option', { name: 'To do' })).toBeDefined();
    expect(screen.getByRole('option', { name: 'Done' })).toBeDefined();
  });

  it('selects an option on click, updates the trigger value, and closes the popover', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const trigger = renderSelect({ onSelectionChange: handleChange });
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Done' }));

    expect(handleChange).toHaveBeenCalledWith('done');
    expect(trigger.textContent).toContain('Done');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('moves selection with arrow keys and confirms with Enter', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const trigger = renderSelect({ onSelectionChange: handleChange });
    act(() => trigger.focus());
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeDefined();

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenLastCalledWith('done');
  });

  it('closes on Escape without changing the selection', async () => {
    const user = userEvent.setup();
    const trigger = renderSelect({ defaultSelectedKey: 'todo' });
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeDefined();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(trigger.textContent).toContain('To do');
  });

  it('does not open when isDisabled', async () => {
    const user = userEvent.setup();
    const trigger = renderSelect({ isDisabled: true });
    await user.click(trigger);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('does not let a disabled option be selected', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const trigger = renderSelect({ onSelectionChange: handleChange });
    await user.click(trigger);
    const archived = screen.getByRole('option', { name: 'Archived' });
    expect(archived.getAttribute('aria-disabled')).toBe('true');
    await user.click(archived);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
