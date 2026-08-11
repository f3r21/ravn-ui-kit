import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

const Icon = () => <svg aria-hidden />;

describe('Button Component', () => {
  it('renders with its accessible name', () => {
    render(
      <Button aria-label="Add">
        <Icon />
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Add' })).toBeDefined();
  });

  it('triggers onPress event handler when clicked', async () => {
    const handlePress = vi.fn();
    const user = userEvent.setup();

    render(
      <Button aria-label="Submit" onPress={handlePress}>
        <Icon />
      </Button>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('disables button when isDisabled prop is true', () => {
    render(
      <Button aria-label="Disabled" isDisabled>
        <Icon />
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it('carries radio semantics onto the element, which useButton alone does not', () => {
    // These are applied after `{...buttonProps}` on purpose. `useButton` returns only the
    // props it knows about, and `role`/`aria-checked` are not among them — routed through
    // it, both land as `null` and `ViewSwitcher`'s radiogroup silently has no radios in it.
    render(
      <Button aria-label="Board view" role="radio" aria-checked>
        <Icon />
      </Button>,
    );
    const radio = screen.getByRole('radio', { name: 'Board view' });
    expect(radio.getAttribute('aria-checked')).toBe('true');
  });

  it('yields tabIndex -1 via excludeFromTabOrder, the only lever useButton leaves open', () => {
    // `useButton` hardcodes tabIndex={0}, so a roving tabindex cannot be built by passing
    // `tabIndex` — it is ignored. This is what a radiogroup's unselected option relies on.
    const { rerender } = render(
      <Button aria-label="Roving">
        <Icon />
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Roving' }).getAttribute('tabindex')).toBe('0');

    rerender(
      <Button aria-label="Roving" excludeFromTabOrder>
        <Icon />
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Roving' }).getAttribute('tabindex')).toBe('-1');
  });

  it('stays a plain button with no checked state when no role is given', () => {
    render(
      <Button aria-label="Plain" isSelected>
        <Icon />
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Plain' });
    expect(button.getAttribute('role')).toBeNull();
    // `isSelected` is visual only — it must not leak into the accessibility tree.
    expect(button.getAttribute('aria-checked')).toBeNull();
  });

  it('keeps the 24px frame but does not stretch the glyph to fill it', () => {
    // #46. Figma's "Icon Placeholder" is inset 20% of the 40px button — 24px, identical on
    // every variant — while "Vector" inside it is 14px on Primary, 18px on Secondary, and
    // 18×16 on one ViewSwitcher glyph. `[&>svg]:w-full [&>svg]:h-full` collapsed all three
    // to 24px and stretched the non-square one.
    //
    // Asserting the frame exists is NOT enough — it existed on the broken code too. What
    // has teeth is the absence of the stretch utilities: restore either one and this fails.
    // jsdom applies no stylesheet, so the rendered pixel sizes are proved in a browser
    // against the built Storybook instead; see the PR body.
    const { container } = render(
      <Button aria-label="Add">
        <svg data-testid="glyph" className="size-3.5" />
      </Button>,
    );
    const frame = container.querySelector('span');

    expect(frame?.className).toContain('w-6');
    expect(frame?.className).toContain('h-6');
    expect(frame?.className).not.toContain('[&>svg]:w-full');
    expect(frame?.className).not.toContain('[&>svg]:h-full');
  });

  it('passes a consumer’s size class through to the glyph element', () => {
    // NOT the guard for #46, despite reading like one — do not delete the assertion above as
    // redundant to this. The class was always *on* the element; what the bug took away was the
    // CASCADE, because `[&>svg]:w-full` compiles to a descendant selector at (0,2,0) and a
    // plain `.size-3.5` is (0,1,0). This suite runs on jsdom with no stylesheet imported, so
    // there is no cascade here to observe and this assertion passes unchanged against the
    // broken button.
    //
    // What actually proves the fix: the `not.toContain('[&>svg]:w-full')` assertion above,
    // which fails the moment the stretch returns, and a real browser against the built
    // Storybook — `primitives-button--states` reads frame 24px / glyph 14px on primary and
    // 18px on secondary. See the PR body.
    //
    // This case earns its place only by pinning that the child is rendered untouched, i.e.
    // that no future refactor starts rewriting the consumer's className.
    render(
      <Button aria-label="Add">
        <svg data-testid="glyph" className="size-3.5" />
      </Button>,
    );
    expect([...screen.getByTestId('glyph').classList]).toContain('size-3.5');
  });

  /**
   * #11. `useButton` already needs its own internal ref, so this proves `useObjectRef`
   * actually merges it with a caller's rather than silently dropping one or the other.
   */
  it('forwards a ref to the root button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button aria-label="Add" ref={ref}>
        <Icon />
      </Button>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
