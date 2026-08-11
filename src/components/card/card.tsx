import { cn } from '../../utils/cn';

/**
 * The card surface, shared by everything in the kit that draws one (#98).
 *
 * `Card` used to render `p-5 bg-surface-neutral rounded-lg` — **a white card**, measured at
 * `rgb(255, 255, 255)` with a 24px radius by reading computed style on its own story. That was
 * scaffolding from `f0b1445` ("initialize repo, snapshot pre-refactor baseline"), predating the
 * Figma work, and it survived because nothing rendered it: the consuming app imports
 * `TextButton`, `CloseIcon`, `Menu`, `Modal`, `MultiSelect` and `Select`, and `Card` appeared
 * only in its own stories and `introduction.mdx`.
 *
 * Nothing in the exports backs those values either. The only `border-radius: 24px` in the card
 * files sits on an element filled `#DA584B` — a red chip, not a card. `TaskCard`'s values are
 * the ones with provenance: `Cards01.md L246` pins `background: #2C2F33` and
 * `border-radius: 8px`, and its comment already records that `rounded-lg` was wrong here once.
 *
 * So the two surfaces were not two legitimate designs — one was the design and one was a
 * placeholder. This is that placeholder replaced, which is #98's option (1). The kit is
 * dark-only and every other surface in it is neutral-4 or neutral-5; a white card was the one
 * surface it does not have.
 */
const CARD_SURFACE =
  'bg-surface-panel text-main rounded-sm border border-transparent shadow-xs transition-all';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Card content. Compose it with `Card.Header`, `Card.Body` and `Card.Footer`. */
  children: React.ReactNode;
  /**
   * The element to render. `article` when the card is a self-contained item a screen reader
   * should be able to navigate to — which is what `TaskCard` is, and why it needs this.
   * @default 'div'
   */
  as?: 'div' | 'article' | 'section' | 'li';
  /**
   * Ref to the root element (#11). Typed to the common `HTMLElement` base rather than
   * whichever of `div`/`article`/`section`/`li` `as` resolves to — `Card` is polymorphic,
   * so there is no single element type to narrow it to without a generic the four call
   * sites in this kit have no need for.
   */
  ref?: React.Ref<HTMLElement>;
  /**
   * Reveals a border on hover, for a card that is clickable as a whole.
   * @default false
   */
  isInteractive?: boolean;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * The kit's card surface: panel fill, 8px radius, 16px padding.
 *
 * `TaskCard` renders through this rather than restating it, which is #15's actual complaint —
 * two card surfaces that could drift apart independently. They now cannot: there is one
 * `CARD_SURFACE`, and a test asserts the two components compute the same background and radius.
 */
export function Card({ children, as, isInteractive = false, className, ref, ...props }: CardProps) {
  // Cast to a single concrete tag rather than left as the `'div' | 'article' | ...` union
  // `as` declares: JSX resolves a tag-name union's props by intersecting every member's
  // attribute set, which for `ref` means requiring one value assignable to
  // `RefObject<HTMLDivElement> & RefObject<HTMLArticleElement> & RefObject<HTMLLIElement>`
  // simultaneously — stricter than any of the four tags actually need, since none of them
  // differ in anything this component or a caller reads off the ref. The cast is a
  // type-level fiction only; the runtime value is still whatever `as` actually holds, and
  // `Component` below renders that value, not the literal string `'div'`.
  const Component = (as ?? 'div') as 'div';
  return (
    <Component
      {...props}
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(
        CARD_SURFACE,
        'flex flex-col gap-4 p-4',
        // No border is ever drawn on the card in the export, so the resting border is
        // transparent — kept as a real border utility rather than removed, so the hover
        // reveal has something to change rather than shifting the layout by 1px.
        isInteractive && 'hover:border-subtle select-none',
        className,
      )}
    >
      {children}
    </Component>
  );
}

/**
 * The card's top row. A plain layout slot — it carries the rhythm, not a heading: a card's
 * heading level depends on the page it sits in, so it stays the caller's to choose (the same
 * reason `ProjectInfo` and `TaskTableGroup` take a `headingLevel`).
 */
export function CardHeader({
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<'div'>) {
  return (
    <div {...props} ref={ref} className={cn('flex items-center gap-2', className)}>
      {children}
    </div>
  );
}

/** The card's main content, taking the remaining height. */
export function CardBody({
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<'div'>) {
  return (
    <div {...props} ref={ref} className={cn('flex flex-col gap-4 flex-1 min-w-0', className)}>
      {children}
    </div>
  );
}

/**
 * The card's bottom row. `mt-auto` so a footer sits at the bottom of a card that has been given
 * a height, rather than floating directly under short content.
 */
export function CardFooter({
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<'div'>) {
  return (
    <div {...props} ref={ref} className={cn('flex items-center gap-2 mt-auto', className)}>
      {children}
    </div>
  );
}

// Attached as statics so a consumer composes `Card.Header` rather than importing four names,
// and exported individually as well so they can be imported directly and referenced in types.
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
