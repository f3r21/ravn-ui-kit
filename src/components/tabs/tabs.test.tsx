import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Tabs } from './tabs';

const ITEMS = [
  { id: 'a', label: 'Tab A' },
  { id: 'b', label: 'Tab B' },
];

describe('Tabs Component', () => {
  it('renders tablist/tab/tabpanel roles with correct aria wiring', () => {
    render(
      <Tabs
        items={ITEMS}
        defaultSelectedKey="a"
        panels={{ a: <p>Panel A</p>, b: <p>Panel B</p> }}
      />,
    );
    expect(screen.getByRole('tablist')).toBeDefined();
    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    const panel = screen.getByRole('tabpanel');
    expect(tabA.getAttribute('aria-selected')).toBe('true');
    expect(tabA.getAttribute('aria-controls')).toBe(panel.id);
  });

  it('switches the selected tab and panel content on click (uncontrolled)', async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        items={ITEMS}
        defaultSelectedKey="a"
        panels={{ a: <p>Panel A</p>, b: <p>Panel B</p> }}
      />,
    );
    await user.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(screen.getByRole('tab', { name: 'Tab B' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tab', { name: 'Tab A' }).getAttribute('aria-selected')).toBe('false');
    expect(screen.getByText('Panel B')).toBeDefined();
  });

  it('calls onSelectionChange when a tab is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Tabs items={ITEMS} defaultSelectedKey="a" onSelectionChange={handleChange} />);
    await user.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(handleChange).toHaveBeenCalledWith('b');
  });

  it('respects a controlled selectedKey and does not change it internally', async () => {
    const user = userEvent.setup();
    render(<Tabs items={ITEMS} selectedKey="a" />);
    await user.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(screen.getByRole('tab', { name: 'Tab A' }).getAttribute('aria-selected')).toBe('true');
  });

  it('moves selection with ArrowRight/ArrowLeft, wrapping at the ends', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Tabs items={ITEMS} defaultSelectedKey="a" onSelectionChange={handleChange} />);

    await user.click(screen.getByRole('tab', { name: 'Tab A' }));
    await user.keyboard('{ArrowRight}');
    expect(handleChange).toHaveBeenLastCalledWith('b');
    expect(screen.getByRole('tab', { name: 'Tab B' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tab', { name: 'Tab B' })).toBe(document.activeElement);

    await user.keyboard('{ArrowRight}');
    expect(handleChange).toHaveBeenLastCalledWith('a');
    expect(screen.getByRole('tab', { name: 'Tab A' }).getAttribute('aria-selected')).toBe('true');
  });

  it('only the selected tab is tabbable (roving tabindex)', () => {
    render(<Tabs items={ITEMS} defaultSelectedKey="b" />);
    expect(screen.getByRole('tab', { name: 'Tab A' }).getAttribute('tabindex')).toBe('-1');
    expect(screen.getByRole('tab', { name: 'Tab B' }).getAttribute('tabindex')).toBe('0');
  });
});
