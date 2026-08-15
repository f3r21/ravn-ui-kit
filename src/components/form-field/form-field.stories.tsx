import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Item } from 'react-stately';
import { withSurface } from '../../../.storybook/decorators';
import { FormField } from './form-field';
import { Input } from '../input/input';
import { Datepicker } from '../datepicker/datepicker';
import { Select } from '../select/select';
import { MultiSelect } from '../select/multi-select';
import { LabelCheckbox } from '../tag/label-checkbox';

const meta: Meta<typeof FormField> = {
  title: 'Primitives/FormField',
  component: FormField,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  argTypes: {
    isLabelVisible: { control: 'boolean' },
    isRequired: { control: 'boolean' },
  },
  args: {
    label: 'Sprint',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS = [
  { id: 'todo', label: 'To do' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'done', label: 'Done' },
];

const INPUT_CLASS =
  'h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md font-sans';

/**
 * Wrapping a control the kit does not own. The children render prop receives the aria
 * props to spread — `id`, `aria-describedby`, and `aria-required`/`aria-invalid` where
 * they apply — so the description and error are genuinely associated with the control
 * rather than merely sitting next to it.
 */
export const Default: Story = {
  args: {
    description: 'Which sprint this task belongs to.',
  },
  render: (args) => (
    <div className="w-80">
      <FormField {...args}>
        {(fieldProps) => <input {...fieldProps} className={INPUT_CLASS} />}
      </FormField>
    </div>
  ),
};

export const Required: Story = {
  args: { isRequired: true, description: 'Which sprint this task belongs to.' },
  render: Default.render,
};

/** The error replaces the helper text rather than stacking under it. */
export const WithError: Story = {
  args: {
    isRequired: true,
    description: 'Which sprint this task belongs to.',
    error: 'Choose a sprint before saving.',
  },
  render: Default.render,
};

/**
 * The whole point of the shared surface: every field the kit owns reports an error the
 * same way, with the same markup and the same aria wiring.
 *
 * Before this, only `Input` and `Datepicker` accepted an `error` at all — `Select`,
 * `MultiSelect` and `LabelCheckbox` had no way to report one, so a consuming form could
 * reject a field it then could not mark. Run the a11y addon here: every control below
 * must come out `aria-invalid` with its message associated.
 */
export const EveryControlInvalid: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Input label="Title" isRequired error="Give the task a title." />
      <Datepicker label="Due date" isRequired error="Pick a date in the future." />
      <Select
        label="Status"
        placeholder="Pick one"
        isRequired
        error="Choose a status."
        items={OPTIONS}
        onSelectionChange={fn()}
      >
        {(item: (typeof OPTIONS)[number]) => <Item key={item.id}>{item.label}</Item>}
      </Select>
      <MultiSelect
        label="Tags"
        placeholder="Pick some"
        error="Pick at least one tag."
        items={OPTIONS}
      >
        {(item: (typeof OPTIONS)[number]) => <Item key={item.id}>{item.label}</Item>}
      </MultiSelect>
      <LabelCheckbox isRequired error="You must accept to continue.">
        Accept the terms
      </LabelCheckbox>
    </div>
  ),
};

/** The same five controls in their resting state, with helper text instead of errors. */
export const EveryControlWithHelperText: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Input label="Title" description="A short summary of the work." />
      <Datepicker label="Due date" description="When this should be finished." />
      <Select
        label="Status"
        placeholder="Pick one"
        description="Where the task sits right now."
        items={OPTIONS}
        onSelectionChange={fn()}
      >
        {(item: (typeof OPTIONS)[number]) => <Item key={item.id}>{item.label}</Item>}
      </Select>
      <MultiSelect
        label="Tags"
        placeholder="Pick some"
        description="Used for filtering the board."
        items={OPTIONS}
      >
        {(item: (typeof OPTIONS)[number]) => <Item key={item.id}>{item.label}</Item>}
      </MultiSelect>
      <LabelCheckbox description="You can change this later.">Accept the terms</LabelCheckbox>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    label: 'Sprint',
    description: 'Which sprint this task belongs to.',
    error: '',
    isRequired: false,
  },
  render: Default.render,
};
