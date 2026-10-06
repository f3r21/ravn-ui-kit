---
name: decisions
description: 'Settled design decisions not to re-open: the 833px desktop floor, WCAG AA over Figma, and the axe allowlist.'
paths:
  - 'src/**/*.tsx'
  - 'src/styles/**'
  - '.storybook/**'
---

# Decisions already made, do not re-open

**The kit is desktop-only and its floor is 833px.** `ApplicationSidebar` is a rigid
`w-[232px] shrink-0` and nothing in `src/` carries a responsive variant or a media query. 833 is
exact rather than approximate: on story `layout-appshell--dashboard`,
`document.documentElement.scrollWidth` reads 833 at every narrower viewport, so 832 overflows and
833 does not. Below the floor the shell scrolls, it does not shrink. Re-measure by reading that
property on the story's `iframe.html` at a few widths, which is how the number was checked
against this branch's own Storybook build.

**Quote that number**, because a consumer deciding whether to adopt `AppShell` needs it. Do not
replace it with a claim that no floor has been measured: a session that then measured 833
correctly would assume it had erred and discard the finding. The number does not re-open the
decision. The kit stays desktop-only, the derivation is on the Decisions page, and the consuming
app keeps its own shell permanently.

**WCAG AA wins over Figma fidelity where they conflict**, and the deviation is documented in a
comment with its measured ratio. `src/styles/contrast.test.ts` pins those ratios so a regression
fails the suite.

**`.storybook/a11y-allowlist.ts` is the only source for which axe findings are accepted**, and it
is keyed to story times rule, never to a count. `color-contrast` is accepted on the stories
rendering `TextButton variant="primary"` and on the hand-rolled trigger in
`floating-popover.stories.tsx` that reproduces the same pairing, because no palette colour clears
4.5:1 on `primary-4` and inventing a darker red is forbidden. **Not every entry in that file is a
failure**: the `incomplete` entries are `SidebarItem`'s active label on a gradient, which axe
cannot measure and which clears AA when measured by hand. `aria-prohibited-attr` is no longer
listed: #19 fixed it on 2026-08-07. Read the file rather than a count from here, and quote it
verbatim rather than re-deriving a figure from prose that summarised it.

**Gaps the consumer hits get fixed here**, not worked around in the app. This repo is the fix
site, which is the whole point of it existing separately.
