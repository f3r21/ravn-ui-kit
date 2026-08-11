import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton Component', () => {
  it('guards its pulse behind prefers-reduced-motion', () => {
    // #45. Both assertions are needed and the second is the load-bearing one.
    //
    // These read `classList` — a list of class *tokens* — rather than the `className`
    // string, and that is the whole point. `motion-safe:animate-pulse` CONTAINS the
    // substring `animate-pulse`, so a string-based `expect(className).toContain(...)` and
    // its negation cannot tell the guarded class from the unguarded one: the negative
    // assertion would fail against the fix and the positive would pass against the bug.
    // Tokenised, `animate-pulse` and `motion-safe:animate-pulse` are simply different
    // classes, so reverting the guard turns the second assertion red.
    //
    // This is the same class of defect as the CSS canary that generated the class names it
    // grepped for and therefore could never fail.
    const { container } = render(<Skeleton />);
    const tokens = [...(container.firstChild as HTMLElement).classList];

    expect(tokens).toContain('motion-safe:animate-pulse');
    expect(tokens).not.toContain('animate-pulse');
  });

  it('is hidden from assistive technology — it stands in for content, it is not content', () => {
    const { container } = render(<Skeleton />);
    expect((container.firstChild as HTMLElement).getAttribute('aria-hidden')).toBe('true');
  });

  it('merges consumer classes last so size and shape can be overridden', () => {
    const { container } = render(<Skeleton className="h-6 w-3/4" />);
    const tokens = [...(container.firstChild as HTMLElement).classList];

    expect(tokens).toContain('h-6');
    expect(tokens).toContain('w-3/4');
    // The guard survives a consumer className — it is not something a caller opts into.
    expect(tokens).toContain('motion-safe:animate-pulse');
  });

  it('forwards a ref and spreads unrecognised props onto the root element (#11)', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Skeleton ref={ref} data-testid="skeleton" />);
    expect(ref.current).toBe(container.firstChild);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute('data-testid')).toBe('skeleton');
  });
});
