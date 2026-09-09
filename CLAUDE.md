# CLAUDE.md, `@ravn/ui-kit`

A React design system built from a Figma export, consumed by one app,
`ravn-task-management-challenge`. Public on GitHub. Read `CONTRIBUTING.md` before writing a
component: it holds the semver policy, the Storybook title taxonomy, the story recipe and the
JSDoc mandate.

## The gate

`npm run gate` = `typecheck && lint && format:check && coverage`. CI's required check is named
**`CI`**. Coverage thresholds in `vitest.config.ts` are a **ratchet**, so raise them when you add
tests and never lower them to go green.

If you touch anything that ships, also run `npm run build` and `npm run build:storybook`. CI runs
both, and the Storybook build catches story and MDX errors the unit tests cannot. Errors only,
though: it is silent on whether a page renders correctly, which is how #21's pipe tables published
as raw `|` characters and built green for this repo's whole history. **Render the page.**

## Rules that are not negotiable

- **React Aria hooks only**, `react-aria` and `react-stately`. Never `react-aria-components`.
- **Never invent or approximate a design value.** Every colour, radius, shadow and z-index comes
  from `src/styles/tokens.css`. If Figma has no value, say so in a comment rather than eyeballing
  one. Two existing violations are self-flagged in `user-row.tsx`.
- **Every exported prop carries JSDoc.** Storybook's autodocs is the published API reference.
  Nothing here computes a compliance percentage, so do not quote one: the rule is every prop and
  the check is the rendered prop table.
- **Zero `any`, zero `React.FC`, zero non-null assertions** in public paths.
- **Never add `outline-none` in front of a focus ring.** In Tailwind v4 it compiles to
  `--tw-outline-style: none`, which makes `outline-2` resolve to `outline-style: none` and paint
  nothing. `outline-hidden` sets the same variable, so it is not the fix either. This shipped
  broken across 21 components once.
- **A gap the consumer hits gets fixed here**, never worked around in the app.

`src/index.ts` is a flat barrel, and that is deliberate: a published package needs one public
entry, so it is the intended exception to the no-barrel convention the consuming app follows.

## Where the detail is

`.claude/rules/` is path-scoped, so each file loads when you touch what it governs.
`.claude/commands/start-issue.md` and `finish-issue.md` are the rituals either side of a piece of
work and carry the rules this repo has already paid for once: what its checks structurally cannot
see, how to prove a new check has teeth, and how not to hand off into a deadlock.
