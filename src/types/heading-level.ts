/**
 * Which `<h*>` element a component renders its title as.
 *
 * Heading level is a property of the *document* a component is dropped into, not of the
 * component — a card's title is an `<h3>` under an `<h2>` section and an `<h4>` under an
 * `<h3>` one, and only the consumer knows which. Components here hardcoded `<h3>`, so a
 * board rendering column headers and card titles emitted both at level 3 and
 * `getAllByRole('heading', { level: 3 })` returned the header interleaved with its own
 * cards.
 *
 * `1` is deliberately absent: a design-system component cannot know it owns the page's
 * single top-level heading, and a kit that can emit `<h1>` invites two of them.
 */
export type HeadingLevel = 2 | 3 | 4 | 5 | 6;
