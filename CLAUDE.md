# CLAUDE.md — `@ravn/ui-kit`

A React design system built from a Figma export. Consumed by one app,
`ravn-task-management-challenge`. Read `CONTRIBUTING.md` before writing a component — it holds
the semver policy, the Storybook title taxonomy, the story recipe and the JSDoc mandate. This
file is the short version of what changes how you work.

## The gate

`npm run gate` = `typecheck && lint && format:check && coverage`. CI's required check is named
**`CI`**. Coverage thresholds in `vitest.config.ts` are a **ratchet** — raise them when you add
tests, never lower them to go green.

If you touch anything that ships, also run `npm run build` and `npm run build:storybook`. CI
runs both, and the Storybook build catches story and MDX errors the unit tests cannot.

## Rules that are not negotiable

- **React Aria _hooks_ only** — `react-aria` / `react-stately`. Never `react-aria-components`.
- **Never invent or approximate a design value.** Every colour, radius, shadow and z-index comes
  from `src/styles/tokens.css`. If Figma has no value for something, say so in a comment rather
  than eyeballing one. There are two existing violations, both self-flagged in `user-row.tsx`.
- **Every exported prop carries JSDoc.** Storybook's autodocs is the published API reference and
  the README points consumers at it. Current compliance is 99.2%; do not lower it.
- **Zero `any`, zero `React.FC`, zero non-null assertions** in public paths.
- **Never add `outline-none` in front of a focus ring.** In Tailwind v4 it compiles to
  `--tw-outline-style: none`, which makes `outline-2` resolve to `outline-style: none` and paint
  nothing. `outline-hidden` sets the same variable, so it is not the fix either. This shipped
  broken across 21 components once. Leave it off.

## Decisions already made — do not re-open

- **The kit is desktop-only.** Measured 833px floor, `ApplicationSidebar` rigid at 232px. The
  consuming app keeps its own shell permanently.
- **WCAG AA wins over Figma fidelity where they conflict**, and the deviation is documented in a
  comment with its measured ratio. `src/styles/contrast.test.ts` pins those ratios so a
  regression fails the suite.
- **16 axe contrast violations are accepted**, all `TextButton variant="primary"` — no palette
  colour clears 4.5:1 on `primary-4` and inventing a darker red is forbidden by the rule above.
- **Gaps the consumer hits get fixed here**, not worked around in the app. This repo is the fix
  site; that is the whole point of it existing separately.

## `dist/` is committed, generated, and never hand-edited

The app consumes this package as a git dependency pinned to a tag, so `dist/` has to exist in
the repo. It is in `.claudeignore` — 180 KB of minified JS and 119 KB of rolled-up types, never
worth reading. Change the source and rebuild.

**Tagging is a checklist, not a command.** Before `git tag`:

1. `npm run gate` green
2. `npm run build` run, and the resulting `dist/` **committed**
3. `CHANGELOG.md`'s `[Unreleased]` moved into a dated version section matching `package.json`

Skipping step 2 tags a version whose `dist/` is stale. Nothing in either repo's CI catches
that — it surfaces on the app's deploy, in front of whoever is reading it.

## Changelog

Every PR appends its entry under `## [Unreleased]`. `.gitattributes` sets `merge=union` on that
file, so parallel branches append cleanly instead of conflicting — but check the merged result
reads sensibly rather than assuming.

## The barrel is deliberate

`src/index.ts` is a flat barrel. A published package needs one public entry, so this is the
intended exception to the no-barrel-files convention the consuming app follows.
