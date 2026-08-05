import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tag } from './tag';
import { TaskCard } from '../card/task-card';
import { DUE_DATE_URGENCY_COLOR, type AccentColor } from '../../types/color-variants';

/**
 * The token each accent colour must resolve to, straight off `Tags01.md`. Pinned as
 * classes rather than trusted to review: the whole point of the rename from
 * `primary`/`secondary`/`tertiary` to `red`/`green`/`yellow` was that the old names hid
 * which ramp they meant, and a rename that quietly repainted a chip would be worse than
 * the confusion it replaced.
 *
 * Note `red` is `primary-4` (#DA584B), NOT the danger ramp (#E82F39) — the design uses
 * the former for tags, and the consuming app currently gets this wrong.
 */
const EXPECTED_SOLID: Record<AccentColor, string> = {
  neutral: 'bg-neutral-2/10',
  red: 'bg-primary-4/10',
  green: 'bg-secondary-4/10',
  yellow: 'bg-tertiary-4/10',
  blue: 'bg-blue/10',
};

describe('Tag', () => {
  describe.each(Object.entries(EXPECTED_SOLID) as [AccentColor, string][])(
    'variant="%s"',
    (variant, expectedFill) => {
      it('paints the accent colour the design specifies', () => {
        render(<Tag variant={variant}>Label</Tag>);
        expect(screen.getByText('Label').className).toContain(expectedFill);
      });

      it('swaps fill for a border in the outline style', () => {
        render(
          <Tag variant={variant} outline>
            Label
          </Tag>,
        );
        const cls = screen.getByText('Label').className;
        expect(cls).toContain('border');
        expect(cls).not.toContain(expectedFill);
      });
    },
  );

  it('defaults to neutral', () => {
    render(<Tag>Label</Tag>);
    expect(screen.getByText('Label').className).toContain('bg-neutral-2/10');
  });

  it('renders a leading icon when given one', () => {
    render(<Tag icon={<svg data-glyph />}>Label</Tag>);
    expect(screen.getByText('Label').querySelector('svg')).not.toBeNull();
  });

  it('renders no remove button unless onRemove is supplied', () => {
    render(<Tag>Label</Tag>);
    expect(screen.queryByRole('button', { name: 'Remove tag' })).toBeNull();
  });

  it('fires onRemove when the remove button is pressed', async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(<Tag onRemove={onRemove}>Label</Tag>);

    await user.click(screen.getByRole('button', { name: 'Remove tag' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

describe('due-date urgency', () => {
  it('maps each level onto an accent colour', () => {
    // Pinned so the card, the table cell and the table row cannot drift apart on what
    // "overdue" looks like — they all read this one map.
    expect(DUE_DATE_URGENCY_COLOR).toEqual({
      normal: 'neutral',
      soon: 'yellow',
      overdue: 'red',
    });
  });

  it.each([
    ['normal', 'bg-neutral-2/10'],
    ['soon', 'bg-tertiary-4/10'],
    ['overdue', 'bg-primary-4/10'],
  ] as const)('renders a %s due date through the shared map', (urgency, expectedFill) => {
    render(<TaskCard title="Task" dueDateText="3 DAYS" dueDateUrgency={urgency} />);
    expect(screen.getByText('3 DAYS').className).toContain(expectedFill);
  });
});
