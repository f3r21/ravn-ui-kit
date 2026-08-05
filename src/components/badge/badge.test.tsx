import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './badge';
import type { StatusTone } from '../../types/color-variants';

/**
 * The label colour each status tone must reach for.
 *
 * Pinned because three of the four are a deliberate deviation from the obvious choice.
 * Painting a status ramp's own step-4/5 on its step-1 fill — which is what this component
 * did — measures 1.69:1 for success, 2.34:1 for warning and 3.90:1 for danger, none of
 * them AA. Warning and danger step to the dark rung their ramps already carry; success has
 * none, so it borrows the `neutral` variant's label and lets its fill carry the status.
 *
 * The ratios live in `src/styles/contrast.test.ts`, computed from `tokens.css`. This pins
 * only that the component reaches for the right token, so a refactor cannot quietly put
 * the same-hue label back.
 */
const EXPECTED_LABEL: Record<StatusTone, string> = {
  neutral: 'text-neutral-4',
  success: 'text-neutral-4',
  warning: 'text-warning-6',
  danger: 'text-danger-6',
};

/** The fills are the design's and must not move — only the labels did. */
const EXPECTED_FILL: Record<StatusTone, string> = {
  neutral: 'bg-surface-neutral',
  success: 'bg-success-1',
  warning: 'bg-warning-1',
  danger: 'bg-danger-1',
};

describe('Badge', () => {
  describe.each(Object.keys(EXPECTED_LABEL) as StatusTone[])('variant="%s"', (variant) => {
    it('keeps the design’s fill', () => {
      render(<Badge variant={variant}>Status</Badge>);
      expect(screen.getByText('Status').className).toContain(EXPECTED_FILL[variant]);
    });

    it('labels in the contrast-checked colour', () => {
      render(<Badge variant={variant}>Status</Badge>);
      expect(screen.getByText('Status').className).toContain(EXPECTED_LABEL[variant]);
    });
  });

  it('defaults to neutral', () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText('Status').className).toContain(EXPECTED_FILL.neutral);
  });

  it('merges a consumer’s className last so it can override', () => {
    render(<Badge className="bg-blue">Status</Badge>);
    expect(screen.getByText('Status').className).toContain('bg-blue');
  });
});
