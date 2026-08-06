Finish an issue and hand it off. Takes the issue number as an argument.

**There is a sibling file, and it is deliberately different.**
`ravn-task-management-challenge` has its own `finish-issue.md`. Its required check is
`Typecheck, lint, format, test, build` and the preview to look at is a Vercel URL. Here the check
is **`CI`**, the preview is **Storybook on GitHub Pages**, and two things have no counterpart
there at all: `npm run build` plus `npm run build:storybook` with `dist/` **committed**, and the
release checklist in `CLAUDE.md`. Do not sync the two — each repo edits only its own copy.

0. **Re-read the comments before anything else** — you last read them at claim time, and the
   correction channel this project runs on is comments on the issue:

   ```bash
   gh issue view <n> --comments
   ```

   An amendment posted while you worked lands here, at your own checkpoint, rather than after
   your PR is open and a reviewer has to say it again. This turns "the amendment must reach the
   lane immediately" into "it must reach the lane by its next checkpoint", which is a far easier
   problem — and it is the reason a working lane rarely needs interrupting.

1. `npm run gate` — green, zero failures. Then `npm run build` and `npm run build:storybook` if
   anything that ships changed.
2. Commit with conventional commits, one concern each, `Closes #<n>` in the final one.
3. Push to the lane's integration branch.
4. Post the handoff comment on the issue. **Use this shape exactly** — the next session reads
   the "Now true that wasn't" line and nothing else survives the boundary:

```markdown
### HANDOFF

- **Merged as:** <sha>
- **Touched:** <files, one line>
- **Decided:** <decision → reason, one line each. Omit if none.>
- **Now true that wasn't:** <new export / new script / changed contract. Other lanes read this.>
- **Deliberately not done:** <scope cut → follow-up issue # if opened>
- **Next session should know:** <one sentence, or "nothing beyond the diff">
```

5. If this PR changed **how anyone else builds, tests or merges** — CI, the gate, the dependency
   contract, branch protection — update `CLAUDE.md` or `CONTRIBUTING.md` **in the same PR**.
   Otherwise that knowledge lives only in an issue two of three lanes will never read.

Then stop. Do not merge; the reviewer does that.

## Do not hand off into a deadlock

- Before waiting on a condition, name **who can satisfy it**. If the answer is the party waiting
  on you, that is a deadlock — act, and say what is unresolved.
- **A PR you want merged is not a draft.** Mark it ready at handoff, or name explicitly who lifts
  it. #17 stopped for exactly this: the reviewer is structurally unable to merge a draft and
  nobody had ever said whose job it was.
- When you add a `blocked_by` edge, confirm the blocker is **closable**. #8 pointed at issues that
  could never close, which made it unstartable while looking merely blocked. An issue that can
  never close is not a dependency, it is a stop.
- Changes the reviewer is blocking on go to the branch under review; net-new work goes to a
  follow-up issue.

## A check that cannot fail is not a check

- **Prove a new check has teeth by sabotage, on a real runner.** Break what it protects, watch
  `CI` go red, record the **failing run URL** in the PR body, restore. A check nobody has ever
  seen fail is a claim, not a guard.
- **A red check is not automatically your defect** — the inverse of the rule above, and the same
  point: a check's colour is not its verdict. Read which step failed before you read your diff. If
  **no named step executed**, it is infrastructure: re-run once with
  `gh run rerun <id> --failed`, and only investigate if it fails the same way twice. A failure
  _inside_ a step you can name is yours until proven otherwise.

  ```bash
  gh run view <id> --json jobs -q '.jobs[] | "\(.name): \(.conclusion)", (.steps[] | "  \(.number). \(.name) → \(.conclusion)")'
  ```

  Two infrastructure shapes turned up on one day: `Set up job` failing with "Failed to resolve
  action download info", and — run `31119698609` here — **zero steps recorded** with the job
  `cancelled`, because a runner that is never acquired logs none. In that second shape the command
  prints the job line and nothing else. That silence is the diagnosis, not a broken command.

- **State what the check structurally cannot see.** For this repo that list is specific:
  - `jsdom` computes no styles and evaluates no media queries. `outline-none` shipped broken
    across 21 components — in Tailwind v4 it compiles to `--tw-outline-style: none`, so
    `outline-2` painted nothing — and every test passed, because no unit test could ever have
    seen it.
  - `axe` cannot see a focus ring that is **absent** rather than wrong.
  - `vitest` never renders MDX.
  - `npm run build:storybook` catches story and MDX **errors** — and nothing about whether a page
    renders _correctly_. #21's pipe tables published as raw `|` characters and built green for the
    repo's entire history; the first attempted fix also built green while changing nothing at all.
    A rendered page is verified by rendering it and inspecting the DOM, never by a green build.
  - The `dist/` freshness guard is blind to deletions — #33, still open. A guard with a known
    blind spot nobody has written down is this same failure one level up.

## Figures come from the enforced source

- **Derive every figure from the file CI actually enforces, never from prose that summarises it**
  — including prose you wrote earlier in the same session. A single paragraph about the a11y
  allowlist took four revisions, each fixing the last and adding a fresh arithmetic error, because
  each was derived from the previous one. What ended it was quoting
  `.storybook/a11y-allowlist.ts` verbatim.
- Ship the command next to the number, so the next reader re-derives it in one paste.
- #23 covers the wider figure-verification work; reference it rather than restating it here.

## Subagent scoping

- Capability questions are answered **against documentation**, not by probing the runtime.
- Investigation never extends to the harness's own tracking, permission or session machinery.
- A finding obtained that way is **discarded**, not merely re-sourced. One already was.

## Before you reach for `git tag`

You are probably about to cut the wrong tag. `CLAUDE.md`'s checklist is the authority; the part
that bites here is **a lane cuts only prereleases** (`vX.Y.Z-rc.N`), and the reviewer who merges
the PR cuts the real `vX.Y.Z` on the merge commit. A tag points at a commit, so a release tag cut
on an integration branch is orphaned by the squash merge — the version stays reachable only via
the tag, and `git describe` on `main` is broken permanently. Read the checklist there before
tagging anything.
