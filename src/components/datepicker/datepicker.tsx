import { useTextField, useObjectRef, type AriaTextFieldProps } from 'react-aria';
import { cn } from '../../utils/cn';
import { fieldLabelClass, FieldMessages, RequiredIndicator } from '../form-field/form-field';

export interface DatepickerProps extends AriaTextFieldProps {
  /**
   * Ref to the root `<input>` (#11). Merged with the internal ref `useTextField` needs via
   * `useObjectRef`, the same pattern the icon `Button` uses.
   */
  ref?: React.Ref<HTMLInputElement>;
  /** Label text. Rendered `sr-only` unless `isLabelVisible`. When omitted, no label. */
  label?: string;
  /**
   * Renders the label visibly above the input instead of `sr-only`.
   *
   * Defaults to `false` — the design draws no field labels; see `FIELD_LABEL_CLASS`.
   * The label still names the input for assistive tech either way.
   * @default false
   */
  isLabelVisible?: boolean;
  /**
   * Error message rendered below the input. When set, also switches the
   * input to its error visual state (danger border/outline).
   */
  error?: string;
  /** Helper text rendered below the input. Hidden while `error` is set. */
  description?: string;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

export function Datepicker({
  label,
  isLabelVisible = false,
  error,
  description,
  className,
  ref: forwardedRef,
  ...props
}: DatepickerProps) {
  const ref = useObjectRef(forwardedRef);
  const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(
    { ...props, label, description, type: 'date', isInvalid: !!error, errorMessage: error },
    ref,
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label ? (
        <label {...labelProps} className={fieldLabelClass(isLabelVisible)}>
          {label}
          {props.isRequired ? <RequiredIndicator /> : null}
        </label>
      ) : null}
      <input
        {...inputProps}
        ref={ref}
        type="date"
        className={cn(
          // The design's chip, not a light field — the same correction `Select` took, for the
          // same reason and from the same source. `Add Task Modal00.md:78-140` draws the modal's
          // four pickers as the `Tag` atom on the dark card: `rgba(148, 151, 154, 0.1)` (neutral-2
          // at 10%), 32px tall, 4px/16px padding, and a 24×24 `/* Vector */` glyph filled
          // `#FFFFFF`. `Datepicker.md` carries no white surface at all — its only four `#FFFFFF`
          // blocks are `/* Vector */` glyphs, and its surfaces are `#222528` and `#2C2F33`.
          //
          // **`[color-scheme:dark]` is load-bearing and is not a browser workaround.** This is a
          // native `<input type="date">`, so the calendar-picker glyph is drawn by the user agent,
          // not by this file, and the UA picks its colour from `color-scheme`. Measured in Chrome
          // on the app shell: on this chip with `color-scheme` unset the glyph renders near-black
          // and is effectively invisible; with `color-scheme: dark` it renders white. White-on-dark
          // is what the export above specifies, so this property is how a native control is made to
          // draw the design rather than a trick to rescue a recolour.
          //
          // Nothing in this repo could have caught the invisible-glyph state: the glyph is UA-drawn
          // and has no token, so `contrast.test.ts` cannot measure it even in principle. The white
          // field surface was the only reason it was legible before.
          // `self-start` sizes the chip to its content instead of letting it stretch. The wrapper
          // is `flex flex-col w-full`, so without it a flex item fills the column — measured at
          // **1390px** on the story, against `Select`'s content-sized **151px** for the same chip
          // classes. A 32px-tall band spanning the form is neither the old white field nor the
          // design's chip. An explicit width still wins, so a caller passing one is unaffected.
          //
          // **Content-sized is a deliberate deviation from the export's literal `width: 128px`,
          // not an omission — do not "correct" it to `w-32`.** That value was transcribed from
          // Figma, where the font was present; this kit ships none of `--font-sans`'s three
          // families, so on a Linux runner the same string renders wider and a fixed box clips
          // it. That is #20, and it has already cost this repo once: `EstimateModal`'s header
          // measured 86.5px on macOS and 105.5px on CI against an 88px box. A date value is
          // locale-formatted on top of that — `dd/mm/yyyy` and `mm/dd/yyyy` differ, and a
          // long-form locale differs more. Sizing to content is what makes the box follow the
          // text instead of the text overflowing the box.
          'self-start inline-flex items-center h-8 px-4 rounded-4 bg-neutral-2/10 text-body-m font-semibold text-main [color-scheme:dark] font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          // A `ring`, not a `border`, and `danger-text` rather than `danger-5` — both for the
          // reasons `select.tsx` sets out at length. `danger-5`'s invalid border survived 1.4.11
          // only on the strength of the white interior it separated from the container; this
          // control no longer has one, and `danger-5` measures 2.55:1 on `surface-overlay`.
          error && 'ring-1 ring-danger-text focus-visible:outline-danger-text',
          className,
        )}
      />
      <FieldMessages
        description={description}
        error={error}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
      />
    </div>
  );
}
