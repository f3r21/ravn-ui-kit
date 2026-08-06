Start work on a GitHub issue. Takes the issue number as an argument.

**There is a sibling file, and it is deliberately different.**
`ravn-task-management-challenge` has its own `start-issue.md`. That repo rebases onto `dev` and
its required check is `Typecheck, lint, format, test, build`; here it is `main` and **`CI`**. Do
not sync the two — each repo edits only its own copy.

Run these in order, in **this worktree only** — never in the primary checkout:

```bash
git fetch origin --prune
git status --porcelain                     # must be clean before rebasing
git rebase origin/main                     # or the integration branch you are on
git log --oneline HEAD@{1}..HEAD           # what landed while you were away
git diff --name-only HEAD@{1}..HEAD        # re-read ONLY these files
npm run gate                               # prove the tree is green BEFORE you touch it
```

That last step matters: if the gate is already red, the failure is not yours, and you need to
know that before you start attributing it to your own change.

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
