import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SidebarItem } from './sidebar-item';

/**
 * #11. No dedicated test file existed for `SidebarItem` before this — it was only exercised
 * indirectly through `application-sidebar.test.tsx`. Added because the issue names this
 * component explicitly as one of the four the ref/rest-spread fix must prove itself against.
 */
describe('SidebarItem ref and rest-spread (#11)', () => {
  it('forwards a ref to the root button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<SidebarItem label="Dashboard" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('spreads unrecognised props onto the root button', () => {
    render(<SidebarItem label="Dashboard" data-testid="dashboard-item" />);
    expect(screen.getByTestId('dashboard-item')).toBeDefined();
  });
});
