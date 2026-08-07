Start work on a GitHub issue. Takes the issue number as an argument.

**There is a sibling file, and it is deliberately different.**
`ravn-task-management-challenge` has its own `start-issue.md`. That repo rebases onto `dev` and
its required check is `Typecheck, lint, format, test, build`; here it is `main` and **`CI`**. Do
not sync the two — each repo edits only its own copy.

Run these in order, in **this worktree only** — never in the primary checkout, which other
sessions have open and which `git worktree list` will name for you:

```bash
git fetch origin --prune
git status --porcelain                     # must be clean before anything below

BASE=$(git rev-parse --verify --quiet origin/dev >/dev/null && echo dev \
       || gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
HERE=$(git branch --show-current)          # empty on a detached HEAD — see below
gh pr list --head "${HERE:?detached HEAD: check out a branch first}" \
           --state open --json number,isDraft     # anything but `[]` → STOP, do not continue

git switch -c <type>/<n>-<slug> --no-track "origin/$BASE"   # new issue…
git switch <type>/<n>-<slug>                                # …or this, if it already exists

git rebase "origin/$BASE"                  # no-op on a branch just cut; catch-up on one that existed
git log --oneline HEAD@{1}..HEAD           # what landed while you were away
git diff --name-only HEAD@{1}..HEAD        # re-read ONLY these files
npm run gate                               # prove the tree is green BEFORE you touch it
```

That last step matters: if the gate is already red, the failure is not yours, and you need to
know that before you start attributing it to your own change.

**Create the branch; nothing else does.** This ritual used to rebase whatever happened to be
checked out, and judgement covered the gap every time. The failure it invites: a lane finishes on
a branch whose PR is open and reviewed, is handed the next issue, and commits it there — the
reviewer's PR silently grows unrelated work, and repeat it twice more and three issues share one
PR. Four rules, in the order the commands above apply them:

- **The base is derived, never assumed:** `origin/dev` if this repo has one, otherwise the repo's
  own default branch. This repo has no `dev` (`gh api repos/f3r21/ravn-ui-kit/branches/dev` → 404)
  and its default is `main`, so it resolves to `main` here and to `dev` in the app. The probe is
  what makes the same line correct in both, so do not "simplify" it to `origin/main` — that is
  the hardcoding this rule exists to prevent, and it would silently base every app lane on the
  promotion branch.

- **An open PR on the branch you are standing on stops the ritual.** Not a warning — stop, and say
  which PR. Whether the next issue belongs in a PR already under review is the reviewer's call,
  and the lane is the one party that cannot make it. Draft counts: a draft still ends up as one PR
  carrying two issues. Note `git branch --show-current` prints _nothing_ on a detached HEAD, and
  `gh pr list --head ''` then matches every open PR in the repo rather than none — so without the
  `${HERE:?}` guard the check would "refuse" for a reason unrelated to your branch.

- **Re-running for an issue already in progress switches; it never re-cuts.** If the branch
  exists, locally or on `origin`, `git switch` onto it and carry on. `git switch -C … "origin/$BASE"`
  is the version that looks idempotent and is not: it moves the ref back to the base and orphans
  every commit already on the branch. If git refuses the switch because the branch is checked out
  in another worktree, that refusal is the right answer — another lane holds it, and the fix is a
  conversation, not a flag.

- **Name it `<type>/<issue>-<slug>`** — e.g. `docs/40-start-issue-creates-the-branch` — so that
  branch → issue is `^[a-z]+/([0-9]+)-` rather than something only the lane that cut it knows.

`--no-track` is not tidiness. Without it, cutting from a remote-tracking ref sets the new branch's
upstream to `origin/$BASE`, so `git rev-list --count @{u}..HEAD` answers `0` on a branch that has
never been pushed anywhere. `lane-status.py` reads exactly that command and separates "never
pushed" from "nothing to push" **only** by whether it answers at all — an upstream it did not earn
turns "branch has no upstream" into a silent `0 unpushed`, which is the alarm that exists to catch
work about to die with a worktree. Switching onto a branch that already exists on `origin` is the
opposite case and correctly does track it: it has been pushed.

**The naming rule is a change here, not a description of practice.** Of this repo's branches,
**none** currently match it:

```bash
git for-each-ref --format='%(refname:short)' refs/heads | grep -cE '^[a-z]+/[0-9]+-'   # 0 of 10
```

The `<type>/` prefix survives because every branch here already has one and `int/` in particular
carries meaning (`int/foundation-kit` is an integration branch, not an issue). The number goes
_after_ the prefix so listings still group by kind. The cost is that the number must stay
**optional** — integration branches and `main` answer to no issue — so `lane-status.py` or any
future selector reads "no match" as "not an issue branch", never as an error. Branches already cut
keep their names; the mapping starts working from here on, not retroactively.

**Re-take every reading at the moment you use it.** The diff above is this habit applied to
code; it holds for numbers too. A figure read several tool calls ago is stale — re-run the
command rather than recalling the number. And a claim confirmed by whoever made it is not
confirmed: confirmation needs a command whose output would differ if the claim were false.

This applies to the issue text as much as to the tree. An issue written days ago will say things
like "#22, still open" that stopped being true; check the state of anything it cites before you
build on it.

Then read the issue — **the whole body and every comment**. That is **one** command:

```bash
gh issue view <n> --json body,comments -q '.body, (.comments[] | "--- \(.author.login)\n\(.body)")'
```

Use this form rather than two separate reads. Two commands work but can be half-followed; one
cannot. Never pipe it through `head` — the part you truncate is the part you will miss.

Neither of the human-readable views is a superset of the other, which is why the single command
exists:

```bash
gh issue view 22 | wc -c                          # 3800  — body, no comments
gh issue view 22 --comments | wc -c               # 8029  — comments, no body
gh issue view 22 --comments | grep -c 'blocks nothing'   # 0 — a body phrase, gone
```

So `--comments` **suppresses** the body, the labels and the dependency fields; it is an addition
to the read, never a replacement for it. `gh issue view <n>` on its own is still worth running for
the title, labels and blocked-by — just never rely on it alone. Reading only the body is how #22
shipped half an issue here: a comment carrying two further requirements went unread, and only one
of them shipped, by coincidence.

**The body is your briefing; the comments amend it.** Where a comment contradicts the body, the
comment is newer and wins. `gh` prints no per-comment timestamp, so their only ordering signal is
position — oldest first, newest last.

The issue is your complete briefing — it is written for someone with no prior context, which is
what you are.

**This ritual, not clearing context, is what fixes staleness.** Clearing a session does not
update your worktree; rebasing does. If another lane merged something that touches your files,
the diff above is how you find out.

Finally, `/rename` this session to `<lane>/#<issue>` so it can be found and `--resume`d later —
particularly for a post-review round, where you want the context you already have rather than a
cold start.
