import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TaskCard } from './task-card';
import { Tag } from '../tag/tag';
import { TagCell } from './task-table';

describe('TaskCard Component keyboard accessibility', () => {
  it('exposes the title as a real button, not the whole card as an ARIA one', () => {
    render(<TaskCard title="Test Task" onPress={vi.fn()} />);
    const opener = screen.getByRole('button', { name: 'Test Task' });

    // A native <button>, so focus, Enter and Space come from the platform rather than
    // from a hand-rolled role/tabIndex/onKeyDown trio on the container. The container
    // used to be the button, which named itself from the card's entire text content and
    // would nest any interactive child inside a button.
    expect(opener.tagName).toBe('BUTTON');
    expect(opener.getAttribute('role')).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('does not render an opener when onPress is not provided', () => {
    render(<TaskCard title="Test Task" />);
    expect(screen.queryByRole('button')).toBeNull();
    // The title is still there, just as static text under its heading.
    expect(screen.getByRole('heading', { name: 'Test Task' })).toBeDefined();
  });

  it('calls onPress when the card surface is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onPress={handleClick} assigneeName="Jerome Bell" />);
    await user.click(screen.getByText('Jerome Bell'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onPress exactly once when the title button itself is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onPress={handleClick} />);
    await user.click(screen.getByRole('button', { name: 'Test Task' }));

    // Both the button and the card surface below it are wired to `onPress`; the button
    // stops the click from bubbling so the task opens once, not twice.
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('reaches the opener by tabbing and fires it with Enter', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onPress={handleClick} />);
    await user.tab();

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Test Task' }));

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('fires the opener with Space', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onPress={handleClick} />);
    await user.tab();
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is an article named by its own title heading', () => {
    // It was a <div> with no role and therefore no accessible name at all. An <article> is
    // a container, not a control, so this does NOT reinstate the `role="button"` that was
    // deliberately removed — see the comment at the top of task-card.tsx's render.
    render(<TaskCard title="Fix auth bug" />);

    const article = screen.getByRole('article', { name: 'Fix auth bug' });
    const heading = screen.getByRole('heading', { name: 'Fix auth bug' });
    expect(article.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(heading.id).toBeTruthy();
  });

  it('names the card by the title alone, not by every string it renders', () => {
    // The regression this guards: an accessible name computed by concatenation read
    // "Fix auth bug 5 Pts OVERDUE BUG Fernando Ramirez".
    render(
      <TaskCard
        title="Fix auth bug"
        points={5}
        dueDateText="OVERDUE"
        tags={[{ label: 'BUG' }]}
        assigneeName="Fernando Ramirez"
      />,
    );

    // An exact-name match would throw if the name had absorbed the rest of the card.
    const article = screen.getByRole('article', { name: 'Fix auth bug' });
    expect(article.getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('renders an actions slot in the header row', () => {
    render(
      <TaskCard
        title="Fix auth bug"
        actions={<button type="button">Task options for Fix auth bug</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Task options for Fix auth bug' })).toBeDefined();
  });

  it('does not open the card when a control in the actions slot is used', async () => {
    // A menu trigger sitting on a clickable card must not also open the card behind it.
    const onPress = vi.fn();
    const onOptions = vi.fn();
    const user = userEvent.setup();
    render(
      <TaskCard
        title="Fix auth bug"
        onPress={onPress}
        actions={
          <button type="button" onClick={onOptions}>
            Task options
          </button>
        }
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Task options' }));
    expect(onOptions).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('forwards headingLevel so cards nest under their column header', () => {
    render(<TaskCard title="Fix auth bug" headingLevel={4} />);
    expect(screen.getByRole('heading', { level: 4, name: 'Fix auth bug' })).toBeDefined();
  });
});

/**
 * #92. Both due-date renderers conveyed urgency by colour alone — a red `Tag` fill on the
 * card, `text-primary-2` in the table cell — so "overdue" reached neither a screen-reader
 * user nor a colour-blind sighted one. WCAG 2.2 1.4.1.
 *
 * The date text is not a substitute and that is the trap worth naming: `'Yesterday'` reads as
 * past to a human, so a test written against that string would look like it proved something.
 * `'20 July, 2026'` is the real case — it requires already knowing today's date, which is the
 * inference an accessible name exists to remove. These use a bare date for that reason.
 */
describe('due-date urgency is not conveyed by colour alone (#92)', () => {
  it('states that an overdue task is overdue', () => {
    render(<TaskCard title="Fix auth bug" dueDateText="20 July, 2026" dueDateUrgency="overdue" />);

    expect(screen.getByRole('article').textContent).toContain('overdue');
    // The visible date is untouched — this adds a spoken state, it does not rewrite the pill.
    expect(screen.getByText(/20 July, 2026/)).toBeDefined();
  });

  /**
   * The contradicting half, and the reason it is not optional: a fix that unconditionally
   * appends a string passes the case above and is wrong. Without this, "announces the state"
   * and "announces a state regardless" are indistinguishable.
   */
  it('control: says nothing when the task is not urgent', () => {
    render(<TaskCard title="Fix auth bug" dueDateText="20 July, 2026" dueDateUrgency="normal" />);

    const text = screen.getByRole('article').textContent ?? '';
    expect(text).toContain('20 July, 2026');
    expect(text).not.toContain('overdue');
    expect(text).not.toContain('due soon');
  });

  it('defaults to the non-urgent case, so an unspecified due date announces no state', () => {
    render(<TaskCard title="Fix auth bug" dueDateText="20 July, 2026" />);
    expect(screen.getByRole('article').textContent).not.toMatch(/overdue|due soon/);
  });

  it('states the soon case too — yellow is as much a colour-only signal as red', () => {
    render(<TaskCard title="Fix auth bug" dueDateText="20 July, 2026" dueDateUrgency="soon" />);
    expect(screen.getByRole('article').textContent).toContain('due soon');
  });

  it('takes a caller-supplied string, so the kit is not hardcoding English', () => {
    // The same rule #13 settled: a fix for "consumers cannot override our strings" must not
    // ship a string consumers cannot override.
    render(
      <TaskCard
        title="Fix auth bug"
        dueDateText="20 July, 2026"
        dueDateUrgency="overdue"
        dueDateUrgencyLabel={{ overdue: 'past due' }}
      />,
    );

    const text = screen.getByRole('article').textContent ?? '';
    expect(text).toContain('past due');
    expect(text).not.toContain('overdue');
  });

  it('merges over the defaults rather than replacing them', () => {
    // Overriding `overdue` alone must leave `soon` saying what it said.
    render(
      <TaskCard
        title="Fix auth bug"
        dueDateText="20 July, 2026"
        dueDateUrgency="soon"
        dueDateUrgencyLabel={{ overdue: 'past due' }}
      />,
    );
    expect(screen.getByRole('article').textContent).toContain('due soon');
  });

  it('lets a consumer silence an urgency with an empty string', () => {
    render(
      <TaskCard
        title="Fix auth bug"
        dueDateText="20 July, 2026"
        dueDateUrgency="overdue"
        dueDateUrgencyLabel={{ overdue: '' }}
      />,
    );
    expect(screen.getByRole('article').textContent).not.toContain('overdue');
  });

  it('renders no state node at all when there is nothing to say', () => {
    // Not merely an empty string in the DOM: an empty `sr-only` span is a node a future
    // refactor can accidentally start filling. Asserted structurally.
    const { container } = render(
      <TaskCard title="Fix auth bug" dueDateText="20 July, 2026" dueDateUrgency="normal" />,
    );
    expect(container.querySelector('.sr-only')).toBeNull();
  });

  it('keeps the state out of the card’s accessible name', () => {
    // The card is named by its heading via `aria-labelledby`, so the state must not leak into
    // the name the way the concatenation bug above once did.
    render(<TaskCard title="Fix auth bug" dueDateText="20 July, 2026" dueDateUrgency="overdue" />);
    expect(screen.getByRole('article', { name: 'Fix auth bug' })).toBeDefined();
  });
});

/**
 * #15. The kit declared `MenuDotsIcon` as the task-card overflow affordance and `ProjectInfo`
 * exposed an `icon` slot, and `TaskCard` never forwarded one — it shipped the slot and blocked
 * it. `actions` covers the *control* case; this is the decorative glyph the Figma instance
 * actually draws.
 */
describe('TaskCard icon slot (#15)', () => {
  it('forwards a decorative glyph into the title row', () => {
    const { container } = render(
      <TaskCard title="Fix auth bug" icon={<svg data-glyph="true" />} />,
    );
    expect(container.querySelector('[data-glyph]')).not.toBeNull();
  });

  it('renders no glyph when none is given', () => {
    const { container } = render(<TaskCard title="Fix auth bug" />);
    expect(container.querySelector('[data-glyph]')).toBeNull();
  });

  it('renders the glyph and a real control together, since they are different slots', () => {
    const { container } = render(
      <TaskCard
        title="Fix auth bug"
        icon={<svg data-glyph="true" />}
        actions={<button type="button">Task options for Fix auth bug</button>}
      />,
    );

    expect(container.querySelector('[data-glyph]')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Task options for Fix auth bug' })).toBeDefined();
  });

  it('keeps the glyph out of the card’s accessible name', () => {
    render(<TaskCard title="Fix auth bug" icon={<svg data-glyph="true" />} />);
    expect(screen.getByRole('article', { name: 'Fix auth bug' })).toBeDefined();
  });
});

/**
 * #102. The board lost its tag caps when it migrated onto `TaskCard`: the design draws these
 * chips in caps, `Tag` applies no `text-transform`, and `tags` had no styling channel — so a
 * consumer storing "iOS app" rendered "iOS app" with no supported way to say otherwise.
 *
 * **jsdom cannot discriminate this defect**, which is the trap worth naming. The test
 * environment loads no Tailwind, so `getComputedStyle(el).textTransform` answers `none` for a
 * correct build and a broken one alike — a test written that way passes either way. What jsdom
 * *can* see is the class, so that is what these assert; the rendered pixels are verified in a
 * real browser and recorded in the PR body.
 */
describe('tag chips are cased by CSS, not by mutating the label (#102)', () => {
  it('applies uppercase to the chip', () => {
    render(<TaskCard title="Fix auth bug" tags={[{ label: 'iOS app' }]} />);
    expect(screen.getByText('iOS app').className).toContain('uppercase');
  });

  /**
   * The control, and the reason the fix is a class rather than `label.toUpperCase()`. A screen
   * reader spells out a string that is literally capitalised and reads a CSS-uppercased one
   * normally — so mutating the string would pass a "renders caps" check and trade an
   * accessibility property for a visual one. The consumer's own tests query natural case too.
   */
  it('control: the label string is untouched, so it is not announced letter by letter', () => {
    render(<TaskCard title="Fix auth bug" tags={[{ label: 'iOS app' }]} />);

    expect(screen.getByText('iOS app')).toBeDefined();
    expect(screen.queryByText('IOS APP')).toBeNull();
    expect(screen.getByRole('article').textContent).toContain('iOS app');
  });

  it('lets a consumer opt out per chip, because twMerge makes the later class win', () => {
    render(
      <TaskCard title="Fix auth bug" tags={[{ label: 'iOS app', className: 'normal-case' }]} />,
    );

    const chip = screen.getByText('iOS app').className;
    expect(chip).toContain('normal-case');
    expect(chip).not.toContain('uppercase');
  });

  it('leaves standalone Tag alone — the casing belongs to the card, not the chip', () => {
    // Otherwise every existing `Tag` consumer silently gains caps.
    render(<Tag>iOS app</Tag>);
    expect(screen.getByText('iOS app').className).not.toContain('uppercase');
  });
});

/**
 * The card and the table render the same chips, so they must not disagree about casing any
 * more than about colour. Asserted against each other rather than each against `'uppercase'` —
 * two separate literal pins pass happily after one renderer changes and the other does not.
 */
describe('TaskCard and TagCell case their chips identically (#102)', () => {
  it('agree, for the same label', () => {
    // Both sides queried identically — a comparison between two different probes tests the
    // probes as much as the components.
    const card = render(<TaskCard title="Fix auth bug" tags={[{ label: 'iOS app' }]} />);
    const cardHasCaps = /(^|\s)uppercase(\s|$)/.test(card.getByText('iOS app').className);
    card.unmount();

    const cell = render(<TagCell labels={[{ label: 'iOS app' }]} />);
    const cellChip = cell.getByText('iOS app').className;
    const cellHasCaps = /(^|\s)uppercase(\s|$)/.test(cellChip);

    expect(cardHasCaps).toBe(cellHasCaps);
    // Control: the probe reports true here rather than agreeing on false for both.
    expect(cellHasCaps).toBe(true);
  });
});

/** #94 — the card reads the shared rule, so `points={1}` is no longer "1 Pts". */
describe('points wording (#94)', () => {
  it('renders a singular point correctly', () => {
    render(<TaskCard title="Fix auth bug" points={1} />);
    expect(screen.getByText('1 Pt')).toBeDefined();
    expect(screen.queryByText('1 Pts')).toBeNull();
  });

  it('control: the plural still renders', () => {
    render(<TaskCard title="Fix auth bug" points={4} />);
    expect(screen.getByText('4 Pts')).toBeDefined();
  });

  it('takes a caller-supplied formatter, so the wording is not baked in', () => {
    render(<TaskCard title="Fix auth bug" points={1} formatPoints={(n) => `${n} punto`} />);
    expect(screen.getByText('1 punto')).toBeDefined();
  });
});
