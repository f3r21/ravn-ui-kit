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
  the README points consumers at it. Nothing in this repo computes a compliance percentage, so
  do not quote one — the rule is _every_ prop, and the check is the rendered prop table.
- **Zero `any`, zero `React.FC`, zero non-null assertions** in public paths.
- **Never add `outline-none` in front of a focus ring.** In Tailwind v4 it compiles to
  `--tw-outline-style: none`, which makes `outline-2` resolve to `outline-style: none` and paint
  nothing. `outline-hidden` sets the same variable, so it is not the fix either. This shipped
  broken across 21 components once. Leave it off.

## Decisions already made — do not re-open

- **The kit is desktop-only.** `ApplicationSidebar` is a rigid `w-[232px] shrink-0`
  (`application-sidebar.tsx:48`) and nothing in `src/` carries a responsive variant or a media
  query. No breakpoint floor has ever been measured, so do not quote one — the derivation that
  exists is on the **Decisions** page. The consuming app keeps its own shell permanently.
- **WCAG AA wins over Figma fidelity where they conflict**, and the deviation is documented in a
  comment with its measured ratio. `src/styles/contrast.test.ts` pins those ratios so a
  regression fails the suite.
- **`.storybook/a11y-allowlist.ts` is the only source for which axe findings are accepted**, and
  it is keyed to story × rule, not to a count. `color-contrast` is accepted on 14 stories: 12
  rendering `TextButton variant="primary"` (`text-main` on `primary-4`, 3.83:1) and 2 rendering
  a hand-rolled trigger in `floating-popover.stories.tsx` that reproduces the same pairing. No
  palette colour clears 4.5:1 on `primary-4` and inventing a darker red is forbidden by the rule
  above. Not every entry in that file is accepted — `aria-prohibited-attr` on four stories is
  open debt (#19).
- **Gaps the consumer hits get fixed here**, not worked around in the app. This repo is the fix
  site; that is the whole point of it existing separately.

## `dist/` is committed, generated, and never hand-edited

The app consumes this package as a git dependency pinned to a tag, and a git install runs no
build — so `dist/` has to exist in the repo. It is denied to `Read` in `.claude/settings.json`:
104 KB of minified JS and 122 KB of rolled-up types, never worth reading. Change the source and
rebuild.

CI now fails when it is stale (`Check committed dist/ is fresh`, straight after the build
step). That check is `git add --intent-to-add dist/ && git diff --exit-code dist/` — the
`--intent-to-add` half is what lets it see a _newly emitted_ file, which a bare diff cannot.
`.gitattributes` marks `dist/**` as `-diff`, so a failure prints "Binary files differ" rather
than a 100 KB patch; the exit code is still non-zero, so do not "fix" that by removing the
attribute.

**Tagging is a checklist, not a command.** Before `git tag`:

1. `npm run gate` green
2. `npm run build` run, and the resulting `dist/` **committed**
3. `CHANGELOG.md`'s `[Unreleased]` moved into a dated version section matching `package.json`

Skipping step 2 tags a version whose `dist/` is stale. CI catches it on a pull request now,
but a tag is cut by hand at a commit and nothing checks that — it would surface on the app's
deploy, in front of whoever is reading it.

**Who cuts which tag.** A tag points at a commit, so a release tag must not be cut on an
integration branch: a squash merge orphans that commit, leaving the version reachable only via
the tag and `git describe` on `main` broken permanently. So a lane cuts a **prerelease**
(`vX.Y.Z-rc.N`) at its branch tip when something downstream needs to install the work before it
merges, and says in the release notes that it came from unmerged history. **The reviewer who
merges the PR cuts the real `vX.Y.Z` on the merge commit** and the downstream consumer re-pins
to it. Both are annotated tags with a matching GitHub release.

## The Claude Code hooks are tested, because they were inert

`.claude/hooks/` holds two scripts and `scripts/hooks.test.mjs` proves they work. Vitest
collects it, so it runs inside `npm run gate` — the point of it existing. All three integration
points 7514d38 copied in were inert: the safety hook read `$1`, both formatter hooks
interpolated a `$FILE_PATH`, and `.claudeignore` is not a file Claude Code reads at all. A hook
that does nothing exits 0 exactly like one that works, so nothing caught it. Two of the test's
cases exist only to pin the removed shapes — a command on argv must still deny, a path on argv
or in `$FILE_PATH` must leave the file untouched — so a revert to the broken input source goes
red instead of quiet.

Hook input is **JSON on stdin**, never argv and never an environment variable. Denying is
`permissionDecision: "deny"` on stdout; a non-zero exit that is not exactly `2` prints the
refusal and then runs the command anyway. `node` parses the payload, not `jq` — `npm install`
never provides `jq`, and a parser missing on one machine is the same silent no-op again.

**`.claudeignore` is gone; `permissions.deny` in `.claude/settings.json` replaces it.** That is
a real control rather than a decorative one, and it costs accordingly: a `Read()` rule also
covers Edit/Write/Glob/Grep and the shell's readers, so `node_modules/**` is genuinely
unreadable — reaching for React Aria's own source means an override in the untracked
`settings.local.json`.

**Known false positive:** the safety hook matches the command line as text, so a
`gh issue comment` whose body _quotes_ `rm -rf /` or `git push --force` is denied. Use
`--body-file`. A false deny rather than a false allow is the right direction for this, and it
is a chosen behaviour rather than one to rediscover.

## Changelog

Every PR appends its entry under `## [Unreleased]`. `.gitattributes` sets `merge=union` on that
file, so parallel branches append cleanly instead of conflicting — but check the merged result
reads sensibly rather than assuming.

## The barrel is deliberate

`src/index.ts` is a flat barrel. A published package needs one public entry, so this is the
intended exception to the no-barrel-files convention the consuming app follows.
