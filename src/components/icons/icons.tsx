/**
 * The kit's icon vocabulary.
 *
 * ## Why this exists
 *
 * Icon *slots* (`SidebarItemProps.icon`, `TagProps.icon`, `TaskMetaBadge.icon`, ...) are
 * typed `React.ReactNode`, which pushed the entire glyph vocabulary onto the consumer:
 * the kit shipped zero icons while baking ad-hoc `<svg>` literals into eleven of its own
 * components, and the consuming app maintained a seventeenth-of-its-own set in parallel.
 * The two drifted — the kit's local `AlarmIcon` was a hand-drawn clock, the app's is the
 * design's actual `alarm-line` glyph — so the same concept rendered differently depending
 * on which side of the package boundary you were on. A design system that owns the slots
 * has to own the glyphs too.
 *
 * ## Provenance
 *
 * Three tiers, and every icon below says which one it is. Do not blur them.
 *
 * 1. **Figma-exported** — the `d` attribute is the design's own SVG export, verbatim. The
 *    consuming app keeps those raw exports in `src/ui/icons/assets/*.svg` for byte-level
 *    comparison; the path data here was carried across unchanged.
 * 2. **Reconstructed from Figma layout metrics** — no path export exists, but the design
 *    file records the glyph's box, stroke width and percentage insets, so the geometry is
 *    derived rather than guessed. The comment shows the numbers it was derived from.
 * 3. **No Figma source** — an engineering addition for a control the design never drew.
 *    Stated plainly, with why it exists anyway.
 *
 * Where a glyph resolves to a named `remix-icons` component in the Figma file, that name
 * is recorded. (The design is built on remix-icons — the per-component CSS exports in the
 * Figma files name several of them outright, which is where these names come from.)
 *
 * ## Two things change on the way in from Figma, both deliberate
 *
 * - The baked `fill` becomes `currentColor`, so colour comes from the token layer instead
 *   of being frozen at export time. The design ships the alarm glyph twice, once white and
 *   once red, purely because a fill cannot be overridden; here that is one icon and a text
 *   colour.
 * - Nothing else. In particular the artboard is **not** normalised to a square viewBox.
 *   Most of these glyphs are non-square (`0 0 18 4`, `0 0 20.506 19.253`, ...) and are
 *   kept exactly as the design draws them, because `preserveAspectRatio` defaults to
 *   `xMidYMid meet`: a caller setting `size-6` gets the glyph scaled to fit a 24x24 box
 *   with its own aspect ratio and padding intact, which is what the design intends. Each
 *   icon's comment records the box the design places it in.
 *
 *   Normalising every viewBox to a square was considered and rejected: it would make
 *   `size-*` optically uniform across the set, but it also silently rescales every glyph
 *   at every existing call site, which turns a mechanical import swap into a visual diff
 *   nobody asked for. Uniformity is not worth re-tuning sizes across two repos.
 *
 * ## Sizing
 *
 * The caller's job, via `className` — `size-4`, `size-6`, and so on. No `size` prop: these
 * are plain `<svg>` elements and Tailwind's sizing utilities already express every case,
 * so a prop would be a second, weaker way to say the same thing. Icons carry no intrinsic
 * dimensions, so an unsized icon inherits the SVG default of 300x150 — always size them.
 *
 * ## Accessibility
 *
 * Decorative by default: every icon renders `aria-hidden="true"` unless it is given an
 * accessible name. Pass `aria-label` (or `aria-labelledby`) and the icon promotes itself
 * to `role="img"` and drops the `aria-hidden`, because an icon that has been named is by
 * definition not decorative. Both can still be overridden explicitly — caller-supplied
 * props are spread last and win.
 *
 * ## One component per icon, not `<Icon name="..." />`
 *
 * A name-indexed component needs a lookup map holding every glyph, which is a single
 * module-level object every consumer imports whole — no bundler can tree-shake an unused
 * icon out of it. One export per icon keeps each glyph independently shakeable, gives the
 * consumer real autocomplete and a compile error on a typo rather than a blank render,
 * and matches how the kit's icon slots are already typed (`React.ReactNode`, i.e. you pass
 * `<PlusIcon />`, not a string).
 */
// `ComponentPropsWithRef`, not the plain `SVGProps` this used to be (#11) — React 19 makes
// `ref` an ordinary prop, so a type that omits it silently drops any ref a caller passes.
// Every icon forwards `IconProps` straight through to `Icon`, which spreads it onto the
// real `<svg>`, so this one change is what makes all 21 icons ref-able at once.
export type IconProps = React.ComponentPropsWithRef<'svg'>;

/**
 * Shared `<svg>` shell: applies the decorative-by-default accessibility rule described
 * above, then spreads caller props last so any of it can be overridden at the call site.
 */
function Icon({ children, ...props }: IconProps) {
  const isNamed = props['aria-label'] != null || props['aria-labelledby'] != null;

  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...(isNamed ? { role: 'img' } : { 'aria-hidden': true })}
      {...props}
    >
      {children}
    </svg>
  );
}

// ─── Figma-exported glyphs ────────────────────────────────────────────────────
// Path data is the design's own SVG export, verbatim, with `fill` swapped for
// `currentColor`. Tier 1.

/**
 * Overflow / "more actions" affordance — opens a task card's options menu.
 *
 * Figma: 18x4 glyph in a 24x24 box. Tier 1 (verbatim export).
 */
export function MenuDotsIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 18 4" {...props}>
      <path
        d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM16 0C14.9 0 14 0.9 14 2C14 3.1 14.9 4 16 4C17.1 4 18 3.1 18 2C18 0.9 17.1 0 16 0ZM9 0C7.9 0 7 0.9 7 2C7 3.1 7.9 4 9 4C10.1 4 11 3.1 11 2C11 0.9 10.1 0 9 0Z"
        fill="currentColor"
      />
    </Icon>
  );
}

/**
 * The clock on a due-date badge.
 *
 * Figma: `remix-icons/line/system/alarm-line`, 20.506x19.253 glyph in a 24x24 box — by far
 * the most-referenced icon in the design file. Tier 1 (verbatim export).
 */
export function AlarmIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 20.506 19.253" {...props}>
      <path
        d="M10.253 19.253C9.0711 19.253 7.90078 19.0202 6.80885 18.5679C5.71692 18.1156 4.72477 17.4527 3.88904 16.617C3.05331 15.7812 2.39038 14.7891 1.93808 13.6972C1.48579 12.6052 1.253 11.4349 1.253 10.253C1.253 9.0711 1.48579 7.90078 1.93808 6.80885C2.39038 5.71692 3.05331 4.72477 3.88904 3.88904C4.72477 3.05331 5.71692 2.39038 6.80885 1.93808C7.90078 1.48579 9.0711 1.253 10.253 1.253C12.6399 1.253 14.9291 2.20121 16.617 3.88904C18.3048 5.57687 19.253 7.86605 19.253 10.253C19.253 12.6399 18.3048 14.9291 16.617 16.617C14.9291 18.3048 12.6399 19.253 10.253 19.253V19.253ZM10.253 17.253C11.1723 17.253 12.0825 17.0719 12.9318 16.7202C13.7811 16.3684 14.5527 15.8528 15.2027 15.2027C15.8528 14.5527 16.3684 13.7811 16.7202 12.9318C17.0719 12.0825 17.253 11.1723 17.253 10.253C17.253 9.33375 17.0719 8.42349 16.7202 7.57422C16.3684 6.72494 15.8528 5.95326 15.2027 5.30325C14.5527 4.65324 13.7811 4.13763 12.9318 3.78584C12.0825 3.43406 11.1723 3.253 10.253 3.253C8.39648 3.253 6.61601 3.9905 5.30325 5.30325C3.9905 6.61601 3.253 8.39648 3.253 10.253C3.253 12.1095 3.9905 13.89 5.30325 15.2027C6.61601 16.5155 8.39648 17.253 10.253 17.253V17.253ZM11.253 10.253H14.253V12.253H9.253V5.253H11.253V10.253ZM0 3.535L3.535 0L4.95 1.414L1.413 4.95L0 3.535ZM16.97 0L20.506 3.535L19.092 4.95L15.556 1.414L16.971 0H16.97Z"
        fill="currentColor"
      />
    </Icon>
  );
}

/**
 * Attachment count — first of the three counters in a task card's footer.
 *
 * Figma: `remix-icons/line/editor/attachment-2`, 11.7382x12.6733 glyph in a 16x16 box.
 * Tier 1 (verbatim export).
 */
export function AttachmentIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 11.7382 12.6733" {...props}>
      <path
        d="M7.96691 3.76371L4.19624 7.53504C4.13256 7.59654 4.08178 7.6701 4.04684 7.75144C4.0119 7.83277 3.99351 7.92025 3.99274 8.00877C3.99197 8.09729 4.00884 8.18508 4.04236 8.26701C4.07588 8.34894 4.12538 8.42337 4.18798 8.48597C4.25057 8.54856 4.325 8.59807 4.40694 8.63159C4.48887 8.66511 4.57665 8.68198 4.66517 8.68121C4.75369 8.68044 4.84117 8.66205 4.92251 8.62711C5.00384 8.59217 5.07741 8.54138 5.13891 8.47771L8.91024 4.70704C9.28534 4.33194 9.49607 3.82318 9.49607 3.29271C9.49607 2.76223 9.28534 2.25348 8.91024 1.87837C8.53513 1.50327 8.02638 1.29254 7.49591 1.29254C6.96543 1.29254 6.45668 1.50327 6.08157 1.87837L2.31024 5.64971C1.99429 5.95779 1.74266 6.32555 1.56994 6.73164C1.39723 7.13773 1.30687 7.57407 1.3041 8.01536C1.30134 8.45664 1.38622 8.89409 1.55384 9.30231C1.72145 9.71054 1.96845 10.0814 2.28052 10.3934C2.59258 10.7055 2.96349 10.9524 3.37174 11.12C3.77999 11.2875 4.21744 11.3723 4.65873 11.3695C5.10001 11.3667 5.53634 11.2763 5.94241 11.1035C6.34848 10.9307 6.7162 10.679 7.02424 10.363L10.7956 6.59237L11.7382 7.53504L7.96691 11.3064C7.53354 11.7397 7.01907 12.0835 6.45285 12.318C5.88664 12.5526 5.27977 12.6733 4.66691 12.6733C4.05404 12.6733 3.44717 12.5526 2.88096 12.318C2.31474 12.0835 1.80027 11.7397 1.3669 11.3064C0.933543 10.873 0.589781 10.3585 0.355247 9.79232C0.120713 9.22611 -4.56621e-09 8.61924 0 8.00637C4.56621e-09 7.39351 0.120713 6.78664 0.355247 6.22043C0.589781 5.65421 0.933543 5.13973 1.3669 4.70637L5.13891 0.935706C5.76758 0.328513 6.60959 -0.00746872 7.48358 0.000126009C8.35757 0.00772074 9.19361 0.358284 9.81163 0.976311C10.4297 1.59434 10.7802 2.43038 10.7878 3.30437C10.7954 4.17836 10.4594 5.02037 9.85224 5.64904L6.08157 9.42171C5.8958 9.60744 5.67525 9.75476 5.43254 9.85526C5.18983 9.95576 4.9297 10.0075 4.667 10.0074C4.40431 10.0074 4.14419 9.95564 3.9015 9.85508C3.65881 9.75452 3.4383 9.60715 3.25257 9.42137C3.06684 9.2356 2.91952 9.01506 2.81901 8.77234C2.71851 8.52963 2.6668 8.2695 2.66683 8.0068C2.66686 7.74411 2.71864 7.48399 2.81919 7.2413C2.91975 6.99861 3.06713 6.77811 3.2529 6.59237L7.02424 2.82104L7.96691 3.76371Z"
        fill="currentColor"
      />
    </Icon>
  );
}

/**
 * Subtask count — second counter in a task card's footer.
 *
 * Figma: `remix-icons/line/editor/node-tree`, 12x13.3333 glyph in a 16x16 box.
 * Tier 1 (verbatim export).
 */
export function SubtaskIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 12 13.3333" {...props}>
      <path
        d="M4.66667 0C5.03467 0 5.33333 0.298667 5.33333 0.666667V3.33333C5.33333 3.70133 5.03467 4 4.66667 4H3.33333V5.33333H6.66667V4.66667C6.66667 4.29867 6.96533 4 7.33333 4H11.3333C11.7013 4 12 4.29867 12 4.66667V7.33333C12 7.70133 11.7013 8 11.3333 8H7.33333C6.96533 8 6.66667 7.70133 6.66667 7.33333V6.66667H3.33333V10.6667H6.66667V10C6.66667 9.632 6.96533 9.33333 7.33333 9.33333H11.3333C11.7013 9.33333 12 9.632 12 10V12.6667C12 13.0347 11.7013 13.3333 11.3333 13.3333H7.33333C6.96533 13.3333 6.66667 13.0347 6.66667 12.6667V12H2.66667C2.29867 12 2 11.7013 2 11.3333V4H0.666667C0.298667 4 0 3.70133 0 3.33333V0.666667C0 0.298667 0.298667 0 0.666667 0H4.66667ZM10.6667 10.6667H8V12H10.6667V10.6667ZM10.6667 5.33333H8V6.66667H10.6667V5.33333ZM4 1.33333H1.33333V2.66667H4V1.33333Z"
        fill="currentColor"
      />
    </Icon>
  );
}

/**
 * Comment count — third counter in a task card's footer.
 *
 * Figma: `remix-icons/line/communication/chat-3-line`, 13.3333x13.3333 glyph in a 16x16
 * box. Tier 1 (verbatim export).
 */
export function CommentIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 13.3333 13.3333" {...props}>
      <path
        d="M3.52734 12.5493L7.52433e-06 13.3333L0.784008 9.806C0.267695 8.84025 -0.00164123 7.76176 7.52433e-06 6.66667C7.52433e-06 2.98467 2.98467 0 6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333C5.57158 13.335 4.49309 13.0656 3.52734 12.5493V12.5493ZM3.72067 11.1407L4.15601 11.374C4.92837 11.7868 5.79094 12.0018 6.66667 12C7.72151 12 8.75265 11.6872 9.62971 11.1012C10.5068 10.5151 11.1904 9.68218 11.594 8.70764C11.9977 7.73311 12.1033 6.66075 11.8975 5.62618C11.6917 4.59162 11.1838 3.64131 10.4379 2.89543C9.69203 2.14955 8.74172 1.6416 7.70716 1.43581C6.67259 1.23002 5.60024 1.33564 4.6257 1.73931C3.65116 2.14298 2.8182 2.82656 2.23217 3.70363C1.64614 4.58069 1.33334 5.61183 1.33334 6.66667C1.33334 7.556 1.55001 8.412 1.96001 9.17733L2.19267 9.61267L1.75601 11.5773L3.72067 11.1407V11.1407Z"
        fill="currentColor"
      />
    </Icon>
  );
}

/**
 * Grid/board view — the sidebar's "dashboard" tab, and the grid option in the view switcher.
 *
 * Figma: `remix-icons/line/system/function-line`, 18x18 glyph in a 24x24 box (the export
 * records the vector inset at 12.5% on all four sides, which is exactly 18/24).
 * Tier 1 (verbatim export).
 */
export function GridViewIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 18 18" {...props}>
      <path
        d="M0 0H8V8H0V0ZM0 10H8V18H0V10ZM10 0H18V8H10V0ZM10 10H18V18H10V10ZM12 2V6H16V2H12ZM12 12V16H16V12H12ZM2 2V6H6V2H2ZM2 12V16H6V12H2Z"
        fill="currentColor"
      />
    </Icon>
  );
}

/**
 * List view — the sidebar's "my task" tab, and the list option in the view switcher.
 *
 * Figma: 18x16 glyph in a 24x24 box. Tier 1 (verbatim export).
 *
 * Note the design's own sidebar puts `remix-icons/line/business/briefcase-4-line` (a 20x20
 * glyph) on the second sidebar tab rather than this one — see `ApplicationSidebar01.md`.
 * This icon is the one the design uses for the *list* option of the view switcher, and the
 * consuming app reuses it for the sidebar tab as well. Recorded here rather than silently
 * reconciled: swapping the sidebar tab to a briefcase is a design decision, not an icon-set
 * one, and nothing in this kit is blocked on it.
 */
export function ListViewIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 18 16" {...props}>
      <path d="M0 0H18V2H0V0ZM0 7H18V9H0V7ZM0 14H18V16H0V14Z" fill="currentColor" />
    </Icon>
  );
}

/**
 * Add / create.
 *
 * Figma: 14x14 glyph inside the 40x40 create button. Tier 1 (verbatim export).
 */
export function PlusIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 14 14" {...props}>
      <path d="M6 6V0H8V6H14V8H8V14H6V8H0V6H6Z" fill="currentColor" />
    </Icon>
  );
}

/**
 * Search — sits at the left of the search bar.
 *
 * Figma: 20.314x20.314 glyph in a 24x24 box. Tier 1 (verbatim export).
 */
export function SearchIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 20.314 20.314" {...props}>
      <path
        d="M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2941 12.5699 16.0029 10.8204 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16C10.8204 16.0029 12.5699 15.2941 13.875 14.025L14.025 13.875V13.875Z"
        fill="currentColor"
      />
    </Icon>
  );
}

/**
 * Notifications bell — sits at the right of the top navigation bar.
 *
 * Figma: 20x21 glyph in a 24x24 box. Tier 1 (verbatim export).
 */
export function BellIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 20 21" {...props}>
      <path
        d="M18 15H20V17H0V15H2V8C2 5.87827 2.84285 3.84344 4.34315 2.34315C5.84344 0.842855 7.87827 0 10 0C12.1217 0 14.1566 0.842855 15.6569 2.34315C17.1571 3.84344 18 5.87827 18 8V15ZM16 15V8C16 6.4087 15.3679 4.88258 14.2426 3.75736C13.1174 2.63214 11.5913 2 10 2C8.4087 2 6.88258 2.63214 5.75736 3.75736C4.63214 4.88258 4 6.4087 4 8V15H16ZM7 19H13V21H7V19Z"
        fill="currentColor"
      />
    </Icon>
  );
}

/**
 * Estimate / story points — marks the points control in the task modal and the filter bar.
 *
 * Figma: 20x18 glyph in a 24x24 box. Tier 1 (verbatim export).
 */
export function PointsIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 20 18" {...props}>
      <path
        d="M1 0H19C19.2652 0 19.5196 0.105357 19.7071 0.292893C19.8946 0.48043 20 0.734784 20 1V17C20 17.2652 19.8946 17.5196 19.7071 17.7071C19.5196 17.8946 19.2652 18 19 18H1C0.734784 18 0.48043 17.8946 0.292893 17.7071C0.105357 17.5196 0 17.2652 0 17V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0V0ZM7 8V6H5V8H3V10H5V12H7V10H9V8H7ZM11 8V10H17V8H11Z"
        fill="currentColor"
      />
    </Icon>
  );
}

/**
 * Assignee — marks a person control (assignee in the modal, owner in the filters).
 *
 * Figma: 16x21 glyph in a 24x24 box. Tier 1 (verbatim export).
 */
export function AssigneeIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 16 21" {...props}>
      <path
        d="M16 21H0V19C0 17.6739 0.526784 16.4021 1.46447 15.4645C2.40215 14.5268 3.67392 14 5 14H11C12.3261 14 13.5979 14.5268 14.5355 15.4645C15.4732 16.4021 16 17.6739 16 19V21ZM8 12C7.21207 12 6.43185 11.8448 5.7039 11.5433C4.97595 11.2417 4.31451 10.7998 3.75736 10.2426C3.20021 9.68549 2.75825 9.02405 2.45672 8.2961C2.15519 7.56815 2 6.78793 2 6C2 5.21207 2.15519 4.43185 2.45672 3.7039C2.75825 2.97595 3.20021 2.31451 3.75736 1.75736C4.31451 1.20021 4.97595 0.758251 5.7039 0.456723C6.43185 0.155195 7.21207 -1.17411e-08 8 0C9.5913 2.37122e-08 11.1174 0.632141 12.2426 1.75736C13.3679 2.88258 14 4.4087 14 6C14 7.5913 13.3679 9.11742 12.2426 10.2426C11.1174 11.3679 9.5913 12 8 12V12Z"
        fill="currentColor"
      />
    </Icon>
  );
}

/**
 * Label / tag — marks a tag control in the task modal and the filter bar.
 *
 * Figma: `remix-icons/fill/finance/price-tag-3-fill`, 20.7988x20.7998 glyph in a 24x24 box.
 * Tier 1 (verbatim export).
 */
export function LabelIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 20.7988 20.7998" {...props}>
      <path
        d="M9.48579 0L19.3848 1.415L20.7988 11.315L11.6068 20.507C11.4193 20.6945 11.165 20.7998 10.8998 20.7998C10.6346 20.7998 10.3803 20.6945 10.1928 20.507L0.292786 10.607C0.105315 10.4195 0 10.1652 0 9.9C0 9.63484 0.105315 9.38053 0.292786 9.193L9.48579 0ZM12.3138 8.486C12.4995 8.67169 12.7201 8.81897 12.9627 8.91944C13.2054 9.01991 13.4655 9.0716 13.7281 9.07155C13.9908 9.07151 14.2509 9.01973 14.4935 8.91917C14.7361 8.81862 14.9566 8.67126 15.1423 8.4855C15.328 8.29975 15.4753 8.07923 15.5757 7.83656C15.6762 7.59388 15.7279 7.3338 15.7278 7.07115C15.7278 6.8085 15.676 6.54843 15.5755 6.30579C15.4749 6.06315 15.3275 5.84269 15.1418 5.657C14.956 5.47131 14.7355 5.32403 14.4928 5.22356C14.2502 5.12309 13.9901 5.0714 13.7274 5.07145C13.197 5.07154 12.6883 5.28235 12.3133 5.6575C11.9383 6.03265 11.7276 6.54141 11.7277 7.07185C11.7278 7.6023 11.9386 8.11098 12.3138 8.486Z"
        fill="currentColor"
      />
    </Icon>
  );
}

/**
 * Calendar — marks a date control in the task modal and the filter bar.
 *
 * Figma: 20x20 glyph in a 24x24 box. Tier 1 (verbatim export).
 */
export function CalendarIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 20 20" {...props}>
      <path
        d="M7 0V2H13V0H15V2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H1C0.734784 20 0.48043 19.8946 0.292893 19.7071C0.105357 19.5196 0 19.2652 0 19V3C0 2.73478 0.105357 2.48043 0.292893 2.29289C0.48043 2.10536 0.734784 2 1 2H5V0H7ZM18 9H2V18H18V9ZM13.036 10.136L14.45 11.55L9.5 16.5L5.964 12.964L7.38 11.55L9.501 13.672L13.037 10.136H13.036ZM5 4H2V7H18V4H15V5H13V4H7V5H5V4Z"
        fill="currentColor"
      />
    </Icon>
  );
}

/**
 * The RAVN logomark.
 *
 * Figma: 40x40 in the design. Tier 1 (verbatim export), with one mechanical change:
 * Figma exports it as two separate vectors positioned by percentage inset, and those
 * insets are resolved here into one square artboard — the wordmark occupies
 * x 0-39.62 / y 2-38, and the dot an 11x11 box at x 3.5 / y 27.
 *
 * Unlike every other icon here this one is usually *meaningful* rather than decorative,
 * so it is normally given a name: `<LogoMark aria-label="Ravn" />`.
 */
export function LogoMark(props: IconProps) {
  return (
    <Icon viewBox="0 0 40 40" {...props}>
      <g transform="translate(0 2)">
        <path
          d="M30.4218 24.5565C35.7216 23.1082 39.6183 18.2592 39.6183 12.5C39.6183 5.71624 34.214 0.194797 27.477 0.00660328V0H8.06627H0L6.69512 8.33114H8.06627V8.33334H27.181C29.4535 8.36636 31.2857 10.2186 31.2857 12.4989C31.2857 14.8002 29.4204 16.6656 27.1194 16.6656H24.0811H13.3913L28.9285 36H39.6172L30.4218 24.5565Z"
          fill="currentColor"
        />
      </g>
      <g transform="translate(3.5 27)">
        <path
          d="M5.5 11C8.53757 11 11 8.53757 11 5.5C11 2.46243 8.53757 0 5.5 0C2.46243 0 0 2.46243 0 5.5C0 8.53757 2.46243 11 5.5 11Z"
          fill="currentColor"
        />
      </g>
    </Icon>
  );
}

// ─── Reconstructed from Figma layout metrics ──────────────────────────────────
// No path export exists for these, but the design file records the box, the stroke
// width and the glyph's percentage insets, so the geometry is derived rather than
// invented. Tier 2.

/**
 * Chevron pointing left — the date picker's "previous month" control.
 *
 * Figma: "Arrow Chevron Back" in `Date Picker.md` — a 24x24 box containing a vector inset
 * left 33.33% / right 37.65% / top 20.83% / bottom 21.14%, stroked `2px solid #FFFFFF`.
 * That resolves to a ~7x14 chevron at 2px. Tier 2 (reconstructed): the size and stroke
 * are the design's, but the exact path points are derived from those insets, and the glyph
 * is centred in its box — Figma's own Back and Forward instances each sit about a pixel
 * off-centre in opposite directions, which is instance-placement noise rather than
 * something a design system should reproduce.
 */
export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15.5 5-7 7 7 7" />
    </Icon>
  );
}

/**
 * Chevron pointing right — the date picker's "next month" control, and the trailing glyph
 * on a task table row's "Details" link.
 *
 * Figma: "Arrow Chevron Forward" in `Date Picker.md`, mirroring `ChevronLeftIcon`'s
 * metrics. The task-table "Details" link resolves to `remix-icons/line/system/
 * arrow-right-s-line`, named in that file's own export; no verbatim path export exists for
 * either, and one stroked chevron serves both. Tier 2 (reconstructed) — see
 * `ChevronLeftIcon` for the derivation.
 */
export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m8.5 5 7 7-7 7" />
    </Icon>
  );
}

// ─── No Figma source ──────────────────────────────────────────────────────────
// Engineering additions for controls the design never drew. Tier 3.

/**
 * Chevron pointing down — indicates a control opens a menu (`Select`, `MultiSelect`, and a
 * task table's group headers).
 *
 * Tier 3: no Figma source. The design file has no disclosure/expand glyph anywhere, but
 * `Select`/`MultiSelect` are themselves kit-built components with no Figma counterpart
 * (see their doc comments), and a collapsed combobox with no affordance reads as static
 * text. Drawn to the same 24x24 / 2px-stroke system as the chevrons above so the family
 * stays visually coherent.
 */
export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m5 8.5 7 7 7-7" />
    </Icon>
  );
}

/**
 * Double chevron pointing left — the date picker's "previous year" control.
 *
 * Tier 3: no Figma source. The design's date picker only draws month navigation, but
 * stepping a year at a time through single-month arrows is twelve clicks, so the kit's
 * `DatePickerMenu` adds year controls. Drawn as two of `ChevronLeftIcon`'s strokes so it
 * reads as "the same arrow, twice".
 */
export function ChevronDoubleLeftIcon(props: IconProps) {
  return (
    <Icon
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m18 5-7 7 7 7M12 5l-7 7 7 7" />
    </Icon>
  );
}

/**
 * Double chevron pointing right — the date picker's "next year" control.
 *
 * Tier 3: no Figma source. See `ChevronDoubleLeftIcon`.
 */
export function ChevronDoubleRightIcon(props: IconProps) {
  return (
    <Icon
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 5 7 7-7 7M12 5l7 7-7 7" />
    </Icon>
  );
}

/**
 * Close / dismiss — `Modal`'s close button, `TopNav`'s clear-search button, and a toast's
 * dismiss control.
 *
 * Tier 3: no Figma source. The design draws no close affordance on any of its modals, but
 * a dialog a user cannot dismiss by pointer is not shippable. Path data is carried over
 * verbatim from the consuming app, where the same glyph was hand-authored for the same
 * reason — the two sets agreeing matters more than either one's origin here.
 */
export function CloseIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 14 14" {...props}>
      <path
        d="M7 5.586 12.293.293l1.414 1.414L8.414 7l5.293 5.293-1.414 1.414L7 8.414l-5.293 5.293-1.414-1.414L5.586 7 .293 1.707 1.707.293 7 5.586Z"
        fill="currentColor"
      />
    </Icon>
  );
}
