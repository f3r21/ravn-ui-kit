/**
 * Accepted axe findings, keyed by **story id** and then by **axe rule id**.
 *
 * This is the ratchet `.storybook/test-runner.ts` enforces over all 145 stories. It is
 * keyed this narrowly on purpose: a bare count or a global threshold lets a brand-new
 * violation hide inside the budget the moment an old one is fixed. Here, a rule firing on
 * a story that does not list it fails the build, and a rule listed for a story that no
 * longer reports it *also* fails the build — so the list can only be paid down, never
 * quietly padded.
 *
 * ## Every entry needs a written reason
 *
 * "It was already like that" is not one. An entry says either *this is a deviation the kit
 * has decided to keep, and here is the measurement* or *this is open debt, and here is the
 * issue that closes it*. Adding an entry is a design decision; removing one is just work.
 *
 * ## `incomplete` is ratcheted too, not only `violations`
 *
 * axe files a finding under `incomplete` when it cannot decide — and this kit has already
 * been bitten by exactly that: a `Card` story shipped a pure-white heading on a white
 * surface (1.00:1, invisible) and axe filed it under `incomplete`/`equalRatio`, because it
 * cannot tell invisible text from deliberately hidden decorative text. A
 * violations-only sweep is structurally blind to the worst pairing there is. See the
 * `Fixed` entry for it in `CHANGELOG.md`.
 *
 * ## What this list is measured against
 *
 * `npm run test:a11y:ci`, over the built Storybook, Chromium. The numbers in the comments
 * below are node counts from that run and were identical across four consecutive runs;
 * they are informational — the assertion is on rule ids only, so adding a second failing
 * element of an already-accepted kind will not fail the build. That is deliberate (a story
 * gaining another `TextButton` is normal work, not new debt), and it is the one hole in
 * this ratchet worth knowing about.
 *
 * ## This list has to hold on every machine, so it is not where an environment gap goes
 *
 * It is written on macOS and enforced on an Ubuntu runner, and those two do not render
 * identically. Because the ratchet is bidirectional, a finding that appears in only one of
 * them cannot be recorded here at all: list it and local runs fail with `GONE`, omit it and
 * CI fails with `NEW`. No entry satisfies both. That is the intended outcome — it forces
 * the divergence to be removed rather than described.
 *
 * The one that has actually happened: `--font-sans` starts with `'SF Pro Display'`, which
 * no Linux runner has, so CI renders every label in the fallback — DejaVu Sans, which is
 * appreciably wider. In `EstimateModal` that pushed a nowrap header 0.5px past its
 * fixed-width popover, and axe will not compute contrast for text whose background box does
 * not contain it, so it filed `color-contrast` under `incomplete`
 * (`elmPartiallyObscured`). It read as a colour finding and was a layout bug;
 * `estimate-modal.tsx` carries the measurements and the fix.
 *
 * So before adding an entry: a finding that only CI sees is a geometry difference until
 * proven otherwise, and the fixed pixel widths (`w-[122px]`, `w-[160px]`, `w-[239px]`,
 * `w-[280px]`, `w-[578px]`) are where it will land. Confirm the finding reproduces in both
 * places before deciding it is a colour you have to accept.
 *
 * ## Known limitation
 *
 * Nothing detects an entry whose story id no longer exists — a renamed or deleted story
 * leaves its line behind, inert. Grep the id before trusting an entry that looks stale.
 */

export interface A11yAllowlistEntry {
  /** axe rule ids this story is permitted to report under `violations`. */
  readonly violations?: readonly string[];
  /** axe rule ids this story is permitted to report under `incomplete`. */
  readonly incomplete?: readonly string[];
}

/**
 * `color-contrast` on `TextButton variant="primary"` — 14 nodes across 12 stories.
 *
 * `text-main` (#FFFFFF) on `bg-primary-4` (#DA584B) measures **3.83:1**, and `isSelected`'s
 * `bg-primary-3` (#E27D73) **2.83:1**, against 1.4.3's 4.5:1. This is the kit's one
 * documented, accepted WCAG AA failure and it has nowhere to go: no label colour in the
 * palette clears `primary-4` (`neutral-5`, the darkest, reaches 4.02:1) and `primary-4` is
 * already its ramp's darkest step. The only fix is a red Figma does not contain, and
 * inventing a design value is what `CONTRIBUTING.md`'s first rule forbids. `text-button.tsx`
 * carries the full argument; `src/styles/contrast.test.ts` pins the ratios so the failure
 * cannot be mistaken for passing.
 *
 * Most of these are not `TextButton`'s own stories — they are the trigger buttons other
 * components' stories use to open a modal, a toast or a popover. That is why fixing
 * `TextButton` would clear twelve entries at once.
 */
const TEXT_BUTTON_PRIMARY_CONTRAST: A11yAllowlistEntry = { violations: ['color-contrast'] };

export const A11Y_ALLOWLIST: Readonly<Record<string, A11yAllowlistEntry>> = {
  // --- `TextButton variant="primary"`, per the note above ------------------------------
  'primitives-textbutton--default': TEXT_BUTTON_PRIMARY_CONTRAST, // 1 node, primary-4
  'primitives-textbutton--playground': TEXT_BUTTON_PRIMARY_CONTRAST, // 1 node, primary-4
  'primitives-textbutton--selected': TEXT_BUTTON_PRIMARY_CONTRAST, // 1 node, primary-3 @ 2.83:1
  'primitives-textbutton--state-matrix': TEXT_BUTTON_PRIMARY_CONTRAST, // 2 nodes, primary-4 + primary-3
  'components-emptystate--with-action': TEXT_BUTTON_PRIMARY_CONTRAST, // 1 node — the story's action slot
  'components-modal-base--default': TEXT_BUTTON_PRIMARY_CONTRAST, // 1 node — the story's "Open modal"
  'components-modal-base--wide-variant': TEXT_BUTTON_PRIMARY_CONTRAST, // 1 node — ditto
  'components-modal-base--alert-dialog': TEXT_BUTTON_PRIMARY_CONTRAST, // 1 node — the story's "Delete task"
  'components-modal-addtask--default': TEXT_BUTTON_PRIMARY_CONTRAST, // 1 node — the story's trigger
  // 2 nodes: the story's trigger, plus `AddTaskModal`'s own submit. The submit is exempt in
  // `--default` only because an empty title disables it, and axe skips disabled controls.
  'components-modal-addtask--edit': TEXT_BUTTON_PRIMARY_CONTRAST,
  'components-toast--stays-until-dismissed': TEXT_BUTTON_PRIMARY_CONTRAST, // 1 node — the story's trigger
  'components-toast--over-an-open-modal': TEXT_BUTTON_PRIMARY_CONTRAST, // 1 node — ditto

  // --- `color-contrast` on a story-local button, not on a kit component ----------------
  // 2 nodes. `floating-popover.stories.tsx` hand-rolls its trigger as a bare `<button
  // className="bg-primary-4 text-main">` rather than using `TextButton`, so it reproduces
  // the same 3.83:1 pairing on markup the kit does not ship. Accepted on the same grounds
  // as the entries above — the palette has no darker red — but note that this one is
  // fixable independently of `TextButton`, by making the story use a passing variant.
  'primitives-floatingpopover--default': { violations: ['color-contrast'] },
  'primitives-floatingpopover--escapes-overflow-hidden-ancestor': {
    violations: ['color-contrast'],
  },

  // --- CLOSED: `aria-prohibited-attr` on `TaskMetaBadges` and `TaskCard` ----------------
  // 8 nodes across 4 stories, plus 3 on the two `TaskCard` stories that render badges.
  // **Fixed in #19 and the entries are gone** — this block is kept as a record of why,
  // because both halves are easy to reintroduce.
  //
  // The defect: each badge was `<span aria-label={label}>` with both children `aria-hidden`.
  // A `<span>` with no role is `generic`, `aria-label` is prohibited there and dropped, so
  // the badge contributed nothing to the accessibility tree — not the label, and not the
  // count or icon either. The fix is a real `sr-only` text node; do not "simplify" it back
  // to an attribute.
  //
  // The `TaskCard` half is the subtler one. Those two stories used to pass, and the reason
  // is worth keeping: the card carried `role="button"`, whose descendants are presentational
  // children in ARIA, so axe stopped evaluating roles inside it and never reached the
  // badges. Removing that role did not introduce a finding, it stopped one being masked.
  //
  // An earlier version of this comment said the counts "are silent to a screen reader
  // today". That stopped being true when #19 landed and the prose was not updated —
  // corrected in #93, which is the issue that noticed, because #9 had closed a separate
  // requirement on exactly that silence being permanent.

  // --- `incomplete` — `SidebarItem`'s selected gradient --------------------------------
  // 5 nodes across 5 stories, all one element: the active item's label, which sits on
  // `bg-gradient-to-r from-transparent to-primary-4/10`. axe reports `bgGradient` — it
  // cannot compute a ratio against a gradient at all, so this is "unmeasurable by axe",
  // not "unmeasured". It has been measured: `text-interactive-text` (`primary-2`) is
  // 6.67:1 on the bare panel and 6.02:1 at the far end of the wash, both clearing AA, and
  // `sidebar-item.tsx` records the arithmetic at the call site.
  //
  // This is the case that justifies ratcheting `incomplete` rather than ignoring it: five
  // entries that a human has resolved, pinned so that a sixth one nobody has looked at
  // fails the build.
  'layout-sidebaritem--selected': { incomplete: ['color-contrast'] },
  'layout-applicationsidebar--default': { incomplete: ['color-contrast'] },
  'layout-applicationsidebar--playground': { incomplete: ['color-contrast'] },
  'layout-appshell--dashboard': { incomplete: ['color-contrast'] },
  'layout-appshell--task-default-view': { incomplete: ['color-contrast'] },
};
