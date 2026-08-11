import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FieldMessages } from './form-field';

/**
 * #11. No dedicated test file existed for `FieldMessages` before this — it was only
 * exercised indirectly through the controls that compose it (`Input`, `Datepicker`, ...).
 */
describe('FieldMessages ref and rest-spread (#11)', () => {
  it('forwards a ref and spreads unrecognised props onto the error branch', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<FieldMessages error="Required" ref={ref} data-testid="message" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId('message')).toBe(ref.current);
  });

  it('forwards a ref and spreads unrecognised props onto the description branch', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<FieldMessages description="Helper text" ref={ref} data-testid="message" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId('message')).toBe(ref.current);
  });
});
