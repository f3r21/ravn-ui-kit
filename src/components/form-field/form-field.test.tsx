import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Item } from 'react-stately';
import { FormField } from './form-field';
import { Input } from '../input/input';
import { Datepicker } from '../datepicker/datepicker';
import { Select } from '../select/select';
import { MultiSelect } from '../select/multi-select';
import { LabelCheckbox } from '../tag/label-checkbox';

/** Resolves what a control's `aria-describedby` actually points at. */
function describedByText(el: Element): string {
  const ids = (el.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
  return ids
    .map((id) => document.getElementById(id)?.textContent ?? '')
    .join(' ')
    .trim();
}

const OPTIONS = [
  { id: 'todo', label: 'To do' },
  { id: 'done', label: 'Done' },
];

/**
 * Every control that can carry an error, rendered by a factory so the same contract can be
 * asserted across all of them. Before this work only `Input` and `Datepicker` were in this
 * list — `Select`, `MultiSelect` and `LabelCheckbox` had no error surface at all, which is
 * what blocked the consuming app's form validation from migrating.
 */
type ControlProps = { error?: string; description?: string; isRequired?: boolean };
type ControlCase = [string, (props: ControlProps) => React.ReactElement, () => HTMLElement];

const CONTROLS: ControlCase[] = [
  ['Input', (p) => <Input label="Title" {...p} />, () => screen.getByRole('textbox')],
  [
    'Datepicker',
    (p) => <Datepicker label="Due date" {...p} />,
    // `<input type="date">` maps to no ARIA role at all, so it cannot be reached by role
    // the way the others can — the label is the query.
    () => screen.getByLabelText(/Due date/),
  ],
  [
    'Select',
    (p) => (
      <Select label="Status" placeholder="Pick one" items={OPTIONS} {...p}>
        {(item: (typeof OPTIONS)[number]) => <Item key={item.id}>{item.label}</Item>}
      </Select>
    ),
    () => screen.getByRole('button'),
  ],
  [
    'MultiSelect',
    (p) => (
      <MultiSelect label="Tags" placeholder="Pick some" items={OPTIONS} {...p}>
        {(item: (typeof OPTIONS)[number]) => <Item key={item.id}>{item.label}</Item>}
      </MultiSelect>
    ),
    () => screen.getByRole('button'),
  ],
  [
    'LabelCheckbox',
    (p) => <LabelCheckbox {...p}>Accept</LabelCheckbox>,
    () => screen.getByRole('checkbox'),
  ],
];

describe.each(CONTROLS)('%s', (_name, renderControl, getControl) => {
  it('reports an error through real aria wiring, not just coloured text', () => {
    render(renderControl({ error: 'This field is required' }));
    const control = getControl();

    // The message has to be *associated*, not merely nearby — otherwise a screen-reader
    // user reaches the field and is told nothing about why it is being rejected.
    // `aria-describedby` is global, so every control here can carry it; `aria-invalid`
    // cannot (see the per-control block below).
    expect(describedByText(control)).toContain('This field is required');
  });

  it('associates helper text the same way', () => {
    render(renderControl({ description: 'We will remind you' }));
    const control = getControl();

    expect(describedByText(control)).toContain('We will remind you');
  });

  it('shows the error instead of the helper text when both are given', () => {
    // Stacking them shifts the layout at the exact moment the user is reading what went
    // wrong, and the helper text has usually just been superseded anyway.
    render(renderControl({ description: 'We will remind you', error: 'Pick a date' }));

    expect(screen.getByText('Pick a date')).not.toBeNull();
    expect(screen.queryByText('We will remind you')).toBeNull();
  });
});

/**
 * `aria-invalid` and `aria-required` are not global — they are supported only on certain
 * roles. Asserting them uniformly across every control would have pushed us into emitting
 * invalid ARIA on the `role="button"` triggers, which is a defect rather than a feature
 * (the same class of bug this kit already fixed on `SegmentedControl`). So each control is
 * checked against what its role legitimately supports.
 */
describe('validation state, per what each role actually supports', () => {
  it('Input marks itself invalid and required', () => {
    render(<Input label="Title" isRequired error="Required" />);
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  it('LabelCheckbox marks itself invalid and required', () => {
    render(
      <LabelCheckbox isRequired error="Required">
        Accept
      </LabelCheckbox>,
    );
    const box = screen.getByRole('checkbox');
    expect(box.getAttribute('aria-invalid')).toBe('true');
    expect(box.getAttribute('aria-required')).toBe('true');
  });

  it('Select emits no unsupported ARIA, and pins its known required-state limitation', () => {
    const { container } = render(
      <Select label="Status" placeholder="Pick one" isRequired error="Required" items={OPTIONS}>
        {(item: (typeof OPTIONS)[number]) => <Item key={item.id}>{item.label}</Item>}
      </Select>,
    );

    // role="button" supports neither attribute, so emitting them would be invalid ARIA.
    const trigger = screen.getByRole('button');
    expect(trigger.hasAttribute('aria-invalid')).toBe(false);
    expect(trigger.hasAttribute('aria-required')).toBe(false);
    // The error itself is still associated, which is what a user actually needs.
    expect(describedByText(trigger)).toContain('Required');

    // Pinned as a known gap rather than a desired outcome: this react-aria version has no
    // `isRequired` on `HiddenSelectProps`, so the native <select> a form would submit is
    // never marked required, and nothing else carries it either. If a react-aria upgrade
    // starts setting it, this assertion fails — and the limitation note in select.tsx
    // should be deleted at the same time.
    const native = container.querySelector('select');
    expect(native).not.toBeNull();
    expect(native!.required).toBe(false);
  });

  it('MultiSelect emits no unsupported ARIA on its trigger', () => {
    render(
      <MultiSelect label="Tags" placeholder="Pick some" error="Required" items={OPTIONS}>
        {(item: (typeof OPTIONS)[number]) => <Item key={item.id}>{item.label}</Item>}
      </MultiSelect>,
    );
    const trigger = screen.getByRole('button');
    expect(trigger.hasAttribute('aria-invalid')).toBe(false);
    expect(trigger.hasAttribute('aria-required')).toBe(false);
    // It still says what is wrong, which is the part that matters to a user.
    expect(describedByText(trigger)).toContain('Required');
  });
});

describe('FormField', () => {
  it('wires a control the kit does not own', () => {
    render(
      <FormField label="Sprint" description="Which sprint this belongs to" isRequired>
        {(fieldProps) => <input {...fieldProps} />}
      </FormField>,
    );

    const input = screen.getByRole('textbox', { name: /Sprint/ });
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(describedByText(input)).toContain('Which sprint this belongs to');
  });

  it('marks the wrapped control invalid and associates the error', () => {
    render(
      <FormField label="Sprint" error="Choose a sprint">
        {(fieldProps) => <input {...fieldProps} />}
      </FormField>,
    );

    const input = screen.getByRole('textbox', { name: /Sprint/ });
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(describedByText(input)).toContain('Choose a sprint');
  });

  it('renders the required indicator without announcing it twice', () => {
    render(
      <FormField label="Sprint" isRequired>
        {(fieldProps) => <input {...fieldProps} />}
      </FormField>,
    );

    // react-aria already carries "required" in the accessibility tree via aria-required;
    // the asterisk is decoration on top of that, so it must stay hidden from it.
    const star = screen.getByText('*');
    expect(star.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByRole('textbox').getAttribute('aria-required')).toBe('true');
  });
});
