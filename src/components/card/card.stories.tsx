import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './card';
import { TaskCard } from './task-card';
import { TextButton } from '../button/text-button';
import { withSurface } from '../../../.storybook/decorators';

/**
 * The kit's card surface: panel fill, 8px radius, 16px padding — the values `Cards01.md L246`
 * pins for "Task Card", which `TaskCard` now takes from here rather than restating (#98).
 *
 * It previously rendered `bg-surface-neutral rounded-lg` — a **white** card, measured at
 * `rgb(255, 255, 255)` with a 24px radius — which was scaffolding from the initial commit that
 * survived because nothing rendered it. See the component's doc comment for the evidence.
 */
const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  // The card carries its own panel fill, so on Storybook's light default canvas it was a dark
  // box floating on white. Same treatment as `TaskCard` and `TaskTable` take.
  decorators: [withSurface('neutral-5')],
  argTypes: {
    as: { control: 'select', options: ['div', 'article', 'section', 'li'] },
    isInteractive: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h4 className="text-body-l font-semibold text-main font-sans">Card title</h4>
        <p className="text-body-m text-muted font-sans">
          Explanatory card content within the interface.
        </p>
      </>
    ),
  },
};

/**
 * `Card.Header`, `Card.Body` and `Card.Footer` carry the internal rhythm so a consumer building
 * something that is not a `TaskCard` composes it rather than re-inventing the spacing (#98).
 *
 * **The header is not a heading.** A card's heading level depends on the page it sits in, so it
 * stays the caller's to choose — the same reason `ProjectInfo` and `TaskTableGroup` take a
 * `headingLevel` rather than picking one.
 */
export const Composed: Story = {
  args: {
    className: 'w-80',
    children: (
      <>
        <Card.Header>
          <h4 className="text-body-l font-semibold text-main font-sans flex-1">Sprint 12</h4>
        </Card.Header>
        <Card.Body>
          <p className="text-body-m text-muted font-sans">
            Eight tasks remaining, two blocked on review.
          </p>
        </Card.Body>
        <Card.Footer>
          <TextButton variant="secondary">View board</TextButton>
        </Card.Footer>
      </>
    ),
  },
};

/**
 * The comparison #98 asks for, and the thing that makes its answer legible rather than buried in
 * a diff: a composed `Card` beside a `TaskCard`.
 *
 * They are the **same surface** now — `TaskCard` renders through `Card` — so there is nothing
 * left that can drift. `card.test.tsx` compares the two against each other rather than pinning
 * each to a literal, because two separate literal pins pass happily after one changes and the
 * other does not.
 */
export const BesideATaskCard: Story = {
  render: () => (
    <div className="flex items-start gap-4">
      <Card className="w-72">
        <Card.Header>
          <h4 className="text-body-l font-semibold text-main font-sans flex-1">A plain Card</h4>
        </Card.Header>
        <Card.Body>
          <p className="text-body-m text-muted font-sans">Same fill, same radius, same padding.</p>
        </Card.Body>
      </Card>
      <TaskCard
        title="Fix auth bug"
        points={4}
        dueDateText="3 DAYS"
        tags={[{ label: 'BUG', accent: 'red' }]}
        assigneeName="Fernando Ramirez"
        className="w-72"
      />
    </div>
  ),
};

/** `isInteractive` reveals a border on hover, for a card that is clickable as a whole. */
export const Interactive: Story = {
  args: {
    isInteractive: true,
    className: 'w-80 cursor-pointer',
    children: <p className="text-body-m text-main font-sans">Hover me — the border appears.</p>,
  },
};

/**
 * Every control live. `as` switches the rendered element — `article` is what `TaskCard` uses so
 * a screen reader can navigate to the card — and `isInteractive` reveals the hover border for a
 * card that is clickable as a whole.
 */
export const Playground: Story = {
  args: {
    as: 'section',
    isInteractive: true,
    className: 'w-80',
    children: (
      <>
        <Card.Header>
          <h4 className="text-body-l font-semibold text-main font-sans flex-1">Editable card</h4>
        </Card.Header>
        <Card.Body>
          <p className="text-body-m text-muted font-sans">Change `as` and `isInteractive` above.</p>
        </Card.Body>
      </>
    ),
  },
};
