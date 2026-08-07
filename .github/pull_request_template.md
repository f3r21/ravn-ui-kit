<!--
This repo merges through PRs only — `main` requires one, and requires the `CI`
check to pass. Approvals are deliberately NOT required: there is one account and
GitHub forbids approving your own PR, so a required approval would deadlock the
repo. Review happens as a comment-only review from a separate session, and the
link on the "Second-session review" line below is what records that it happened.
-->

## What changed

<!-- The change itself, in the terms a consumer would notice. Name the components
     or config touched. If nothing user-facing changed, say so explicitly. -->

## Why

<!-- The problem this solves, not a restatement of the diff. Link the issue.
     If a design value deviates from Figma, state the measured ratio and the rule
     that forced it (see CLAUDE.md). If something was deliberately NOT done, say
     what and why here — a reviewer with none of your context cannot tell an
     omission from a decision. -->

Closes #

## Figures

<!-- Every number this PR asserts, with the command that re-derives it — same line,
     after an em-dash or an arrow. See CLAUDE.md. If this PR asserts no numbers,
     write exactly "No figures in this PR."

     - 527 tests, 33 files — `npm run gate 2>&1 | grep -E 'Test Files|Tests  '`

     `node scripts/figure-audit.mjs` counts how many of yours carry one. Do not
     write a number you have not just run the command for: a command that does not
     reproduce its figure is worse than no command. -->

## How it was verified

<!-- Commands actually run, with their result. Not "should be fine". -->

- [ ] `npm run gate` (typecheck, lint, format:check, coverage) — green
- [ ] `npm run build` — only if this PR touches anything that ships
- [ ] `npm run build:storybook` — catches story and MDX errors the unit tests cannot
- [ ] Coverage thresholds in `vitest.config.ts` raised, or unchanged — never lowered
- [ ] `CHANGELOG.md` entry appended under `## [Unreleased]`
- [ ] `dist/` rebuilt and committed, if source that ships changed

<!-- Anything else: a Storybook story to open, a screenshot, an axe run, a measured
     contrast ratio. -->

<!-- Paste the `gh pr review --comment` permalink under the heading below, once a separate
     session has read this PR. Leave the heading in place even when the review is pending, so
     its absence is visible rather than silent.

     This guidance sits ABOVE the heading on purpose (#79). Under it, the section is never
     empty — the comment itself is a non-blank line — so any check for "has this been
     reviewed?" reads a template as a review. That is not hypothetical: an orchestrator's
     review-line probe was validated against four kit PRs and then passed an unreviewed app PR,
     because the app's template guaranteed a non-blank line beneath that heading on every PR
     forever. Two populations, one instrument.

     It has not fired here only because lanes strip these comments when writing a body — so the
     correctness rested on a habit rather than on the document, and leaving the comment in is
     what a template comment invites rather than a mistake. -->

## Second-session review:
