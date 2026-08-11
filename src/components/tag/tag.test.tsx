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

/**
 * The label colour, pinned for the opposite reason to the fills above.
 *
 * These are *not* all Figma's. The design draws label and fill from one swatch, which
 * cannot clear AA — red measured 2.61:1 on its own tint, green 3.66:1, blue 1.77:1 —
 * so red and green step up their ramps and blue, which has no ramp at all, goes white.
 * Yellow and neutral are unchanged because they already cleared it.
 *
 * The ratios themselves live in `src/styles/contrast.test.ts`, which computes them from
 * `tokens.css`. This pins only that the component reaches for the right token, so a
 * refactor cannot quietly put the design's swatch back and re-fail the audit.
 */
const EXPECTED_LABEL: Record<AccentColor, string> = {
  neutral: 'text-main',
  red: 'text-primary-2',
  green: 'text-secondary-2',
  yellow: 'text-tertiary-4',
  blue: 'text-main',
};

describe('Tag', () => {
  describe.each(Object.entries(EXPECTED_SOLID) as [AccentColor, string][])(
    'accent="%s"',
    (accent, expectedFill) => {
      it('paints the accent colour the design specifies', () => {
        render(<Tag accent={accent}>Label</Tag>);
        expect(screen.getByText('Label').className).toContain(expectedFill);
      });

      it('swaps fill for a border in the outline appearance', () => {
        render(
          <Tag accent={accent} appearance="outline">
            Label
          </Tag>,
        );
        const cls = screen.getByText('Label').className;
        expect(cls).toContain('border');
        expect(cls).not.toContain(expectedFill);
      });

      it('labels in the contrast-checked colour, in both appearances', () => {
        const { rerender } = render(<Tag accent={accent}>Label</Tag>);
        expect(screen.getByText('Label').className).toContain(EXPECTED_LABEL[accent]);

        rerender(
          <Tag accent={accent} appearance="outline">
            Label
          </Tag>,
        );
        expect(screen.getByText('Label').className).toContain(EXPECTED_LABEL[accent]);
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

  it('names the remove button per tag, so a row of chips is not five identical buttons', () => {
    render(
      <>
        <Tag onRemove={vi.fn()} removeLabel="Remove Design">
          Design
        </Tag>
        <Tag onRemove={vi.fn()} removeLabel="Remove Backend">
          Backend
        </Tag>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Remove Design' })).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Remove Backend' })).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Remove tag' })).toBeNull();
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
