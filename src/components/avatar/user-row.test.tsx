import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UserRow } from './user-row';

/**
 * #11. No dedicated test file existed for `UserRow` before this — it was only exercised
 * indirectly through `assignee-modal.test.tsx`.
 */
describe('UserRow ref and rest-spread (#11)', () => {
  it('forwards a ref to the root div when no onPress is given', () => {
    const ref = createRef<HTMLElement>();
    render(<UserRow name="Jerome Bell" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('forwards a ref to the root button when onPress is given', () => {
    const ref = createRef<HTMLElement>();
    render(<UserRow name="Jerome Bell" onPress={() => {}} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('spreads unrecognised props onto the root element', () => {
    render(<UserRow name="Jerome Bell" data-testid="user-row" />);
    expect(screen.getByTestId('user-row')).toBeDefined();
  });
});
