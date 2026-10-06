---
name: dist-and-release
description: dist/ is committed and generated; the freshness check, the Release workflow, and the tag history that explains its shape.
paths:
  - 'dist/**'
  - 'package.json'
  - 'CHANGELOG.md'
  - '.github/workflows/release.yml'
  - '.github/workflows/tag-check.yml'
---

# `dist/` is committed, generated, and never hand-edited

The app consumes this package as a git dependency pinned to a tag, and a git install runs no
build, so `dist/` has to exist in the repo. A `permissions.deny` entry of `Read(./dist/**)` keeps
it out of context, since it is minified JS and rolled-up types and never worth reading. Change
the source and rebuild.

CI fails when it is stale (`Check committed dist/ is fresh`, straight after the build step). That
check is `git add --intent-to-add dist/ && git diff HEAD --exit-code dist/`, and both halves are
load-bearing in opposite directions. `--intent-to-add` is what lets it see a newly emitted file,
which a bare diff cannot. It is also what used to blind it to a deleted one (#33), because
`--intent-to-add` on a directory stages the deletion, after which an unstaged diff compares
worktree to index and finds them agreeing. `git diff HEAD` sees both:

```bash
rm dist/ui-kit.css && git add --intent-to-add dist/ && git diff --exit-code dist/   # exits 0
rm dist/ui-kit.css && git add --intent-to-add dist/ && git diff HEAD --exit-code dist/   # exits 1
```

`.gitattributes` marks `dist/**` as `-diff`, so a failure prints "Binary files differ" rather
than a huge patch. The exit code is still non-zero, so do not fix that by removing the attribute.

## Tagging is a workflow, and the checklist is what it verifies

Run the Release workflow (`.github/workflows/release.yml`, `workflow_dispatch`, on `main`) with
the version. It checks three facts and only then creates the annotated tag and the GitHub
release:

1. `npm run gate` green
2. `npm run build` run, and the committed `dist/` reproducing from source
3. `CHANGELOG.md`'s `[Unreleased]` moved into a dated version section matching `package.json`

It **verifies** the version bump rather than performing it, since a bump is a change to a tracked
file and belongs in a reviewed PR, so a release attempted without one is refused rather than
silently wrong.

`v0.5.0` is why this is a workflow rather than a list. It was tagged with `package.json` still
reading `0.4.0` and `[Unreleased]` never rolled, because a checklist is steps a person performs
under release pressure in the order they remember them. The check that would have caught it
already existed, in the app's `ui-kit-smoke.test.tsx`, and was not run, which is why a second
thing to remember would not have fixed it either.

**That tag no longer exists and nothing recorded its removal** (#100). It was pushed, and #54
recorded the decision to keep it, quoting: _"`v0.5.0` stays in place. A published tag is never
moved or deleted; this issue is the record."_ It was deleted anyway, by nobody recorded, and the
events API window has expired, so who and why are not recoverable. Re-derive:

```bash
gh api 'repos/f3r21/ravn-ui-kit/contents/package.json?ref=v0.5.0'   # 404
gh api 'repos/f3r21/ravn-ui-kit/contents/package.json?ref=v0.4.0'   # 200, the control
git ls-remote --tags origin | awk '{print $2}' | sed 's|refs/tags/||' | grep -v '\^{}' | sort -V
```

This does not weaken the no-moving-tags rule. It is the one case of that rule being broken, and
the cost is concrete: #54's re-derivation commands no longer run, so an issue written to be the
record of a defect can no longer show it.

**`v0.5.1` has a tag but no GitHub release**, visible in the same commands. It predates the
Release workflow's first run, so it was cut by hand when a matching release was not yet
automatic. The app pins tags rather than releases, so nothing consuming this package is affected.
It is recorded because the two lists disagreeing is otherwise a puzzle.

**Do not cut tags by hand, and moving or deleting one is now refused by the server.** Ruleset
`20572278`, "Published v* tags are never moved or deleted", is active on `refs/tags/v*` with
`update` and `deletion` rules, which is what #59 asked for. Re-derive with
`gh api repos/f3r21/ravn-ui-kit/rulesets -q '.[] | "\(.name) \(.target)"'`. This file said the
repo had none until 2026-09-09, a figure carried forward from `CLAUDE.md` without re-deriving it.
Creating a tag by hand is still possible. If you do,
`.github/workflows/tag-check.yml` fires on the tag push and re-checks facts 1 and 3; a tag it
fails is not a release, so do not pin it.

**Who cuts which tag: the workflow does, on `main`.** Nobody cuts one by hand, including the
reviewer who merges the PR. A tag points at a commit, so a release tag must not be cut on an
integration branch: a squash merge orphans that commit, leaving the version reachable only via
the tag and `git describe` on `main` broken permanently. The workflow refuses any ref but `main`,
so that case cannot be reached through the supported path.

Which removes the old escape hatch, and that is a consequence rather than an oversight: a lane
can no longer cut a prerelease at its branch tip for a downstream consumer that needs the work
before it merges. The workflow will still cut `v0.6.0-rc.1`, putting no constraint on the
version's shape, but only on `main`. If something downstream needs unmerged work, install it from
the branch (`github:f3r21/ravn-ui-kit#<branch>`) rather than tagging it. A tag is a promise about
`main`.

## Changelog

Every PR appends its entry under `## [Unreleased]`. `.gitattributes` sets `merge=union` on that
file, so parallel branches append cleanly instead of conflicting. Check the merged result reads
sensibly rather than assuming.
