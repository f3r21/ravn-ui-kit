import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppShell } from './app-shell';

const ITEMS = [{ label: 'DASHBOARD' }, { label: 'MY TASKS' }];

describe('AppShell', () => {
  it('builds the kit sidebar and top nav from configuration, as it always did', () => {
    render(
      <AppShell sidebarItems={ITEMS}>
        <p>Main content</p>
      </AppShell>,
    );

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeDefined();
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeDefined();
    expect(screen.getByText('Main content')).toBeDefined();
  });

  it('renders the top bar row only when given one', () => {
    const { rerender } = render(
      <AppShell sidebarItems={ITEMS}>
        <p>Main content</p>
      </AppShell>,
    );
    expect(screen.queryByText('Switcher')).toBeNull();

    rerender(
      <AppShell sidebarItems={ITEMS} topBar={<span>Switcher</span>}>
        <p>Main content</p>
      </AppShell>,
    );
    expect(screen.getByText('Switcher')).toBeDefined();
  });

  /**
   * #15. `sidebarItems` was required and `topNavProps` forwarded `TopNav`'s whole API as one
   * prop, so `AppShell` was unusable with any navigation that was not this kit's — the shell
   * a consumer most wants to adopt was the one most welded to the kit's own parts.
   */
  describe('escape hatches (#15)', () => {
    it('takes a sidebar that is not the kit’s, and does not also render the kit’s', () => {
      render(
        <AppShell sidebar={<nav aria-label="Product navigation">Custom</nav>}>
          <p>Main content</p>
        </AppShell>,
      );

      expect(screen.getByRole('navigation', { name: 'Product navigation' })).toBeDefined();
      expect(screen.queryByRole('navigation', { name: 'Main navigation' })).toBeNull();
    });

    it('takes a top nav that is not the kit’s', () => {
      render(
        <AppShell sidebarItems={ITEMS} topNav={<header>Custom bar</header>}>
          <p>Main content</p>
        </AppShell>,
      );

      expect(screen.getByText('Custom bar')).toBeDefined();
      expect(screen.queryByRole('searchbox')).toBeNull();
    });

    it('lets the slot win when both it and the configuration are given', () => {
      // Rendering both would put two navigation landmarks in the shell; silently dropping the
      // slot would ignore what the caller explicitly asked for. The slot wins.
      render(
        <AppShell sidebarItems={ITEMS} sidebar={<nav aria-label="Product navigation">C</nav>}>
          <p>Main content</p>
        </AppShell>,
      );

      expect(screen.getAllByRole('navigation')).toHaveLength(1);
      expect(screen.getByRole('navigation', { name: 'Product navigation' })).toBeDefined();
    });

    /**
     * `null` and `undefined` have to mean different things here, and `??` is what separates
     * them — `sidebar || <default/>` would render the kit's sidebar for a caller who asked
     * for none, which is the bug this case exists to catch.
     */
    it('distinguishes "no sidebar" from "not supplied"', () => {
      const { rerender } = render(
        <AppShell sidebar={null}>
          <p>Main content</p>
        </AppShell>,
      );
      expect(screen.queryByRole('navigation')).toBeNull();

      rerender(
        <AppShell sidebarItems={ITEMS}>
          <p>Main content</p>
        </AppShell>,
      );
      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeDefined();
    });

    it('distinguishes "no top nav" from "not supplied"', () => {
      const { rerender } = render(
        <AppShell sidebarItems={ITEMS} topNav={null}>
          <p>Main content</p>
        </AppShell>,
      );
      expect(screen.queryByRole('searchbox')).toBeNull();

      rerender(
        <AppShell sidebarItems={ITEMS}>
          <p>Main content</p>
        </AppShell>,
      );
      expect(screen.getByRole('searchbox', { name: 'Search' })).toBeDefined();
    });

    it('renders no sidebar when neither the slot nor the items are given', () => {
      // `sidebarItems` became optional, so this is newly reachable. An empty
      // `ApplicationSidebar` — a named landmark containing nothing — would be worse than none.
      render(
        <AppShell>
          <p>Main content</p>
        </AppShell>,
      );
      expect(screen.queryByRole('navigation')).toBeNull();
      expect(screen.getByText('Main content')).toBeDefined();
    });
  });

  it('forwards a ref and spreads unrecognised props onto the root element (#11)', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AppShell sidebarItems={ITEMS} ref={ref} data-testid="shell">
        <p>Main content</p>
      </AppShell>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId('shell')).toBe(ref.current);
  });
});
