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

Then read the issue — **the whole body and every comment**:

```bash
gh issue view <n> --comments        # NOT `gh issue view <n>`, and never piped through `head`
```

`gh issue view <n>` prints the body and a comment _count_, not the comments. A correction or a
second requirement often lives there, and reading only the body means shipping half the issue —
which has happened here. Do not truncate the output; the part you cut is the part you will miss.

The issue is your complete briefing — it is written for someone with no prior context, which is
what you are.

**This ritual, not clearing context, is what fixes staleness.** Clearing a session does not
update your worktree; rebasing does. If another lane merged something that touches your files,
the diff above is how you find out.

Finally, `/rename` this session to `<lane>/#<issue>` so it can be found and `--resume`d later —
particularly for a post-review round, where you want the context you already have rather than a
cold start.
