import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardBody, CardFooter } from './card';
import { TaskCard } from './task-card';

/**
 * `Card` had no test file at all before #98 — `ls src/components/card/` — which is part of how
 * it shipped rendering a white card in a dark-only kit for the repo's whole history.
 */
describe('Card (#98)', () => {
  it('renders its children', () => {
    render(<Card>content</Card>);
    expect(screen.getByText('content')).toBeDefined();
  });

  it('is a div by default and takes another element when asked', () => {
    const { container, rerender } = render(<Card>x</Card>);
    expect(container.firstElementChild?.tagName).toBe('DIV');
    rerender(<Card as="article">x</Card>);
    expect(container.firstElementChild?.tagName).toBe('ARTICLE');
  });

  it('forwards arbitrary attributes, so aria-labelledby reaches the element', () => {
    const { container } = render(
      <Card as="article" aria-labelledby="t">
        x
      </Card>,
    );
    expect(container.firstElementChild?.getAttribute('aria-labelledby')).toBe('t');
  });

  it('reveals a hover border only when interactive', () => {
    const { container, rerender } = render(<Card>x</Card>);
    expect(container.firstElementChild?.className).not.toContain('hover:border-subtle');
    rerender(<Card isInteractive>x</Card>);
    expect(container.firstElementChild?.className).toContain('hover:border-subtle');
  });

  it('merges className last, so a consumer can override', () => {
    const { container } = render(<Card className="p-0">x</Card>);
    expect(container.firstElementChild?.className).toContain('p-0');
  });

  /**
   * #11. The ref is typed to the common `HTMLElement` base and internally cast through a
   * single concrete tag to satisfy TypeScript's polymorphic-`as` checking (see the comment
   * on `Card`'s render) — this proves that cast is a type-level fiction only: the ref still
   * attaches to whichever real element `as` renders, `article` included, not always a div.
   */
  it('forwards a ref to whichever element `as` renders', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Card as="article" ref={ref}>
        x
      </Card>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('ARTICLE');
  });

  describe('sub-components', () => {
    it('are available as statics and as named exports', () => {
      expect(Card.Header).toBe(CardHeader);
      expect(Card.Body).toBe(CardBody);
      expect(Card.Footer).toBe(CardFooter);
    });

    it('compose into one card', () => {
      render(
        <Card>
          <Card.Header>head</Card.Header>
          <Card.Body>body</Card.Body>
          <Card.Footer>foot</Card.Footer>
        </Card>,
      );
      for (const t of ['head', 'body', 'foot']) expect(screen.getByText(t)).toBeDefined();
    });

    /**
     * The header is a layout slot and deliberately not a heading — a card's heading level
     * depends on the page it sits in, which is why `ProjectInfo` and `TaskTableGroup` both take
     * a `headingLevel` instead of picking one. A `<h3>` baked in here would be unfixable from
     * outside and would break the outline of every page that nests cards under a heading.
     */
    it('the header is not a heading', () => {
      render(
        <Card>
          <Card.Header>head</Card.Header>
        </Card>,
      );
      expect(screen.queryByRole('heading')).toBeNull();
    });

    it('forward a ref and spread rest props on each sub-component (#11)', () => {
      const headerRef = createRef<HTMLDivElement>();
      const bodyRef = createRef<HTMLDivElement>();
      const footerRef = createRef<HTMLDivElement>();
      render(
        <Card>
          <Card.Header ref={headerRef} data-testid="header">
            head
          </Card.Header>
          <Card.Body ref={bodyRef} data-testid="body">
            body
          </Card.Body>
          <Card.Footer ref={footerRef} data-testid="footer">
            foot
          </Card.Footer>
        </Card>,
      );
      expect(headerRef.current).toBeInstanceOf(HTMLDivElement);
      expect(bodyRef.current).toBeInstanceOf(HTMLDivElement);
      expect(footerRef.current).toBeInstanceOf(HTMLDivElement);
      expect(screen.getByTestId('header')).toBeDefined();
      expect(screen.getByTestId('body')).toBeDefined();
      expect(screen.getByTestId('footer')).toBeDefined();
    });
  });
});

/**
 * The point of #98, and the assertion that makes #15's complaint unrepeatable.
 *
 * `TaskCard` restated `Card`'s chrome instead of using it, so the two surfaces could drift
 * apart with nothing to notice. They are compared **against each other**, not each pinned to a
 * literal — two separate literal pins pass happily after one component changes and the other
 * does not, which is exactly how the card and the table row disagreed in #111.
 */
describe('TaskCard and Card cannot drift apart (#98)', () => {
  const surfaceOf = (el: Element | null) => {
    const cls = el?.className ?? '';
    return {
      surface: /bg-surface-panel/.test(cls),
      radius: /rounded-sm/.test(cls),
      padding: /(^|\s)p-4(\s|$)/.test(cls),
    };
  };

  it('render the same surface, radius and padding', () => {
    const card = render(<Card>x</Card>);
    const cardChrome = surfaceOf(card.container.firstElementChild);
    card.unmount();

    const task = render(<TaskCard title="Fix auth bug" />);
    const taskChrome = surfaceOf(task.container.firstElementChild);

    expect(taskChrome).toEqual(cardChrome);
    // Control: the probe reads real classes rather than agreeing on three falses.
    expect(cardChrome).toEqual({ surface: true, radius: true, padding: true });
  });

  it('TaskCard still renders an article named by its title heading', () => {
    // The composition must not have cost the semantics #47 and #15 established.
    const { container } = render(<TaskCard title="Fix auth bug" />);
    const article = container.querySelector('article');
    expect(article).not.toBeNull();
    const labelledBy = article?.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy as string)?.textContent).toContain('Fix auth bug');
  });

  /**
   * The regression this replaces. `Card` rendered `bg-surface-neutral` — `#ffffff` — in a
   * dark-only kit, and nothing caught it because nothing rendered `Card`.
   */
  it('Card no longer renders the white scaffold surface', () => {
    const { container } = render(<Card>x</Card>);
    const cls = container.firstElementChild?.className ?? '';
    expect(cls).not.toContain('bg-surface-neutral');
    expect(cls).not.toContain('rounded-lg');
  });
});
