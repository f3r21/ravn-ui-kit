Finish an issue and hand it off. Takes the issue number as an argument.

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
