import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApplicationSidebar } from './application-sidebar';

const ITEMS = [
  { label: 'DASHBOARD' },
  { label: 'MY TASKS', isActive: true, badgeCount: 5 },
  { label: 'PROJECTS' },
];

describe('ApplicationSidebar', () => {
  it('is a navigation landmark with a default name', () => {
    render(<ApplicationSidebar items={ITEMS} />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeDefined();
  });

  it('takes a caller-supplied landmark name', () => {
    render(<ApplicationSidebar items={ITEMS} label="Project navigation" />);

    expect(screen.getByRole('navigation', { name: 'Project navigation' })).toBeDefined();
    expect(screen.queryByRole('navigation', { name: 'Main navigation' })).toBeNull();
  });

  /**
   * The reason the prop exists (#13). A screen reader offers landmarks as a list, so two
   * `nav`s sharing one name are two entries that list cannot tell apart — and the kit's
   * sidebar was hardcoded to "Main navigation", which a consuming app that renders its own
   * nav alongside this one had no way past.
   *
   * Queried by accessible name rather than by count: `getAllByRole('navigation')` would
   * return two landmarks whether or not they are distinguishable, which is the exact
   * failure this is meant to catch.
   */
  it('lets two sidebars on one page carry names a screen reader can tell apart', () => {
    render(
      <>
        <ApplicationSidebar items={ITEMS} label="Product navigation" />
        <ApplicationSidebar items={[{ label: 'BILLING' }]} label="Account navigation" />
      </>,
    );

    const product = screen.getByRole('navigation', { name: 'Product navigation' });
    const account = screen.getByRole('navigation', { name: 'Account navigation' });

    expect(product).not.toBe(account);
    expect(product.textContent).toContain('DASHBOARD');
    expect(account.textContent).toContain('BILLING');
  });

  it('renders one item per entry, and marks the active one as the current page', () => {
    render(<ApplicationSidebar items={ITEMS} />);

    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getByRole('button', { current: 'page' }).textContent).toContain('MY TASKS');
  });

  it('renders the logo slot only when given one', () => {
    const { rerender } = render(<ApplicationSidebar items={ITEMS} />);
    expect(screen.queryByTestId('logo')).toBeNull();

    rerender(<ApplicationSidebar items={ITEMS} logo={<span data-testid="logo">Ravn</span>} />);
    expect(screen.getByTestId('logo')).toBeDefined();
  });

  it('forwards a click on an item to that item’s handler', async () => {
    const onPress = vi.fn();
    const user = userEvent.setup();
    render(<ApplicationSidebar items={[{ label: 'DASHBOARD', onPress }]} />);

    await user.click(screen.getByRole('button', { name: 'DASHBOARD' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
