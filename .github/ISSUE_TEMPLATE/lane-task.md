---
name: Lane task
about: A unit of work handed to a lane session that starts with no context
title: ''
labels: ''
assignees: ''
---

<!--
This issue is somebody's entire briefing. They start cold, with no memory of the
session that wrote it, and they will act on every number in it.

That is why the Figures section below is not optional. A lane meeting a bare
number has to decide whether to trust it; a lane meeting a number AND its command
runs the command, which turns a judgement call into a two-second check.
-->

## The problem

<!-- What is wrong, in terms someone who has never seen this code can act on.
     Lead with the consequence, not the diagnosis. -->

## Figures

<!--
REQUIRED. Every number this issue asserts, with the command that re-derives it.
One per line, command in backticks after an em-dash or an arrow:

- 527 tests, 33 files — `npm run gate 2>&1 | grep -E 'Test Files|Tests  '`
- 40 component files — `find src/components -name '*.tsx' ! -name '*.test.tsx' ! -name '*.stories.tsx' | wc -l`
- `grep -rn "forwardRef" src/` → 0 hits

Every one of those three was run before being written here. Note what is *not* an
example: anything reading `dist/`. `.claude/settings.json` denies `Read(./dist/**)`,
so a command pointed there cannot be run by a session in this repo at all.

If this issue asserts no numbers, delete the examples and write exactly:

  No figures in this issue.

Do not write a number here you have not just run the command for. A command that
does not reproduce its figure is worse than no command: it converts "unverified"
into "verified", which is the one direction a reader cannot recover from.

Numbers that need no command: `file.tsx:48` line citations (open the file) and
issue references (`#23`). Everything else needs one.
-->

## The work

<!-- What to build. Where a choice is genuinely open, say so and say what decides
     it — a lane that guesses will guess differently from the next lane. -->

## Verification

<!--
Say how to CHECK the work, and give the command for anything you are asking to be
measured. The asymmetry to avoid: "report the before/after bundle size" puts the
whole burden of deriving a number on the implementer while this issue's own
numbers sit unsourced. If you want a figure back, ship the command that produces
it.
-->

1. `npm run gate` green, zero failures.
2. `npm run build` and `npm run build:storybook` if anything that ships changed.
3. <!-- The check specific to this issue, with its command. -->
