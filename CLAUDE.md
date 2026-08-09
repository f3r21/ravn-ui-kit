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
runs both, and the Storybook build catches story and MDX errors the unit tests cannot — _errors_
only, though. It is silent on whether a page renders correctly, which is how #21's pipe tables
published as raw `|` characters and built green for this repo's whole history. Render the page.

`.claude/commands/start-issue.md` and `finish-issue.md` are the rituals either side of a piece of
work, and they carry the rules this repo has already paid for once: what its checks structurally
cannot see, how to prove a new check has teeth, and how not to hand off into a deadlock. Read
them there rather than restating them here.

**`/start-issue` cuts the branch for you, and refuses when it cannot do so safely.** It derives
the base (`origin/dev` if the repo has one, else the repo's default — `main` here, `dev` in the
app), then **stops** if the branch you are standing on has an open PR, rather than extending work
a reviewer is already looking at. Issue branches are named `<type>/<issue>-<slug>`, so branch →
issue is `^[a-z]+/([0-9]+)-`; the number is optional, because `int/` branches and `main` answer to
no issue and branches cut before #40 do not have one. Branches are cut `--no-track`, so an
unpushed branch still reads as unpushed rather than inheriting an upstream it never earned. The
reasoning, and the `switch -C` variant that looks idempotent while silently orphaning commits, are
in `.claude/commands/start-issue.md`.

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

- **The kit is desktop-only, and its floor is 833px.** `ApplicationSidebar` is a rigid
  `w-[232px] shrink-0` (`application-sidebar.tsx:48`) and nothing in `src/` carries a responsive
  variant or a media query. 833 is exact rather than approximate: on story
  `layout-appshell--dashboard`, `document.documentElement.scrollWidth` reads 833 at every
  narrower viewport — 832 overflows, 833 does not. Below the floor the shell scrolls; it does not
  shrink. Re-measure by reading that property on the story's `iframe.html` at a few widths, which
  is how the number above was checked against this branch's own Storybook build.
  **Quote it** — a consumer deciding whether to adopt `AppShell` needs it. An earlier version of
  this line said no floor had ever been measured and forbade quoting one, which is worse than
  merely wrong: a session that measured 833 correctly would have assumed it had erred and thrown
  the finding away. The number does not re-open the decision — the kit stays desktop-only, the
  derivation is on the **Decisions** page, and the consuming app keeps its own shell permanently.
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
build — so `dist/` has to exist in the repo. A `permissions.deny` entry of `Read(./dist/**)` in
`.claude/settings.json` keeps it out of context: 104 KB of minified JS and 122 KB of rolled-up
types, never worth reading. Change the source and rebuild.

CI now fails when it is stale (`Check committed dist/ is fresh`, straight after the build
step). That check is `git add --intent-to-add dist/ && git diff HEAD --exit-code dist/`, and both
halves are load-bearing in opposite directions. `--intent-to-add` is what lets it see a _newly
emitted_ file, which a bare diff cannot. It is also what used to blind it to a _deleted_ one
(#33): `--intent-to-add` on a directory **stages** the deletion, after which an unstaged diff
compares worktree to index and finds them agreeing. `git diff HEAD` sees both —
`rm dist/ui-kit.css && git add --intent-to-add dist/ && git diff --exit-code dist/` exits 0 where
the `HEAD` form exits 1.
`.gitattributes` marks `dist/**` as `-diff`, so a failure prints "Binary files differ" rather
than a 100 KB patch; the exit code is still non-zero, so do not "fix" that by removing the
attribute.

**Tagging is a command now, and the checklist is what it verifies.** Run the **Release** workflow
(`.github/workflows/release.yml`, `workflow_dispatch`, on `main`) with the version. It checks all
three facts below and only then creates the annotated tag and the GitHub release:

1. `npm run gate` green
2. `npm run build` run, and the committed `dist/` reproducing from source
3. `CHANGELOG.md`'s `[Unreleased]` moved into a dated version section matching `package.json`

It **verifies** the version bump rather than performing it — a bump is a change to a tracked file
and belongs in a reviewed PR — so a release attempted without one is refused rather than
silently wrong.

`v0.5.0` is why this is a workflow rather than a list. It was tagged with `package.json` still
reading `0.4.0` and `[Unreleased]` never rolled, because a checklist is steps a person performs
under release pressure in the order they remember them. The check that would have caught it
already existed — the app's `ui-kit-smoke.test.tsx`, whose comment names this gap verbatim — and
was not run, which is why a _second_ thing to remember would not have fixed it either.

**That tag no longer exists, and nothing recorded its removal** (#100). It was pushed — #54 read
it over the API and quoted `"version": "0.4.0"` from it — and #54's comment records the decision
to keep it: _"`v0.5.0` stays in place. A published tag is never moved or deleted; this issue is
the record."_ It was deleted anyway, after 2026-08-07T19:03Z, by nobody recorded; the events API
window has expired, so who and why are not recoverable. Re-derive:

```bash
gh api 'repos/f3r21/ravn-ui-kit/contents/package.json?ref=v0.5.0'   # 404
gh api 'repos/f3r21/ravn-ui-kit/contents/package.json?ref=v0.4.0'   # 200 — control
git ls-remote --tags origin | awk '{print $2}' | sed 's|refs/tags/||' | grep -v '\^{}' | sort -V
```

**This does not weaken the no-moving-tags rule** — it is the one case of that rule being broken,
and the cost is concrete: #54's re-derivation commands no longer run, so an issue written to be
the record of a defect can no longer show it. `release.yml`'s duplicate-tag check used to cite
`v0.5.0` as proof of the norm and now explains this instead.

**`v0.5.1` has a tag but no GitHub release** — visible in the same commands. It predates the
Release workflow's first run (2026-08-07T21:16Z), so it was cut by hand when a matching release
was not yet automatic. The app pins **tags**, not releases, so nothing consuming this package is
affected; it is recorded here because the two lists disagreeing is otherwise a puzzle.

Do not cut tags by hand. That still works — this repo has no tag protection
(`gh api repos/f3r21/ravn-ui-kit/rulesets -q length` → 0, where the app returns 1, so the query
works) and #59 is what would close it. If you do anyway, `.github/workflows/tag-check.yml` fires
on the tag push and re-checks facts 1 and 3; a tag it fails is **not a release**, so do not pin
it. It deliberately does not fire for tags the Release workflow cut, since those were checked
before the tag existed.

**Who cuts which tag: the workflow does, on `main`.** Nobody cuts one by hand, including the
reviewer who merges the PR — that used to be the rule and it is not any more.

A tag points at a commit, so a release tag must not be cut on an integration branch: a squash
merge orphans that commit, leaving the version reachable only via the tag and `git describe` on
`main` broken permanently. That hazard is now **structural rather than remembered** — the Release
workflow refuses any ref but `main` (`release.yml`, "Refuse to release from anything but main"),
so the orphaning case cannot be reached through the supported path.

Which removes the old escape hatch, and that is a real consequence rather than an oversight: a
lane can no longer cut a **prerelease at its branch tip** for a downstream consumer that needs
the work before it merges. The workflow will still cut `v0.6.0-rc.1` — it puts no constraint on
the version's shape — but only on `main`, with `package.json` and `CHANGELOG.md` already
agreeing. If something downstream needs unmerged work, install it from the branch
(`github:f3r21/ravn-ui-kit#<branch>`) rather than tagging it; a tag is a promise about `main`.

Tags are annotated with a matching GitHub release, both created by the workflow from the
changelog section for that version.

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

## Every figure carries the command that re-derives it

A number in an issue, a commit message, a PR body or this file is written once and read by
sessions that cannot check it. So ship the command beside it, on the same line, after an em-dash
or an arrow:

```markdown
- 527 tests, 33 files — `out=$(npm run gate 2>&1); rc=$?; echo "$out" | grep -E 'Test Files|Tests  '`
- `grep -rn "forwardRef" src/ | grep -vE ':[0-9]+: *(//|\*)'` → 0 hits
```

**Both lines above are examples of the format, not current figures** — the test count moves every
time the suite does, and quoting it here would make this file a second source competing with the
gate. Run the command; do not read the number.

**The second example acquired a comment filter, and the reason is the point.** It used to read
`grep -rn "forwardRef" src/` → 0 hits. That command now returns **2** — because
`view-switcher.tsx:68-69` carries a comment explaining that no component forwards a ref, and
**quotes the grep and its result.** Writing the zero down created a non-zero.

The substance never changed: with comment lines excluded the answer is still 0, and the control is
that the same exclusion leaves `useState` at 24 rather than blinding the probe. But by this file's
own rule, a command returning something other than its figure is **worse than no command, because
the number then looks checked** — so the command had to change, not the claim.

**The filter is line-anchored on purpose.** The obvious spelling, `grep -v ': *//'`, also
matches every URL scheme — at `origin/main` it drops **6 lines of real code**, including
`avatar.stories.tsx`'s `xmlns="http://www.w3.org/2000/svg"`. The figure is unaffected today
because no `forwardRef` hit sits on a URL line, but installing that as this file's exemplar of a
correctly-scoped command would be the defect the section warns about. `:[0-9]+:` anchors to the
`grep -n` line prefix, and `\*` additionally catches block-comment continuation lines the simpler
form misses — narrower where it should be, wider where it should be.

**It is narrower, not clean, and the honest thing is to say where it still fails.** Because the
pattern is unanchored it also drops a _code_ line whose own content carries `:<digits>: //` —
`const s = "port:12: //x"` is code and this filter discards it. In this repo that is currently
theoretical. Both readings are at `0708a83`, and both drift — re-run rather than quoting them:

```bash
git grep -n '' -- 'src/**' | cut -d: -f3- | grep -cE ':[0-9]+: *//'    # 0  ← the residual class
git grep -n '' -- 'src/**' | cut -d: -f3- | grep -cE '^[[:space:]]*//'  # 997 ← control: it reads
```

A fully content-anchored spelling exists — `… | cut -d: -f3- | grep -vE '^[[:space:]]*(//|\*)'` —
and no content shape defeats it. It is **not** the exemplar here, for two reasons worth more than
the class it closes: it discards the `path:line` prefix, so the figure can no longer be followed
to the hits it counts, and `cut -d: -f3-` reintroduces an assumption about colons in filenames
that the unanchored form does not make. Trading a named limit for an unnamed one is not progress.

**Naming the limit beside the figure is this section's own prescription**, not a concession to
laziness: _prefer a spelling that can fail, and if only a silent one exists, say so beside the
figure._ A residual class measured at 0, with the control that proves the measurement reads, is
what that instruction asks for.

**This is self-contamination** (volume III §D1, §F): a probe that searches text can find the prose
describing it. Any figure quoted inside the code it measures will do this eventually.

A lane meeting a bare number decides whether to trust it. A lane meeting a number and its command
runs the command. `file.tsx:48` citations and `#23` references need nothing — everything else
does.

**A figure sourced through a pipe is not sourced** (#61). That first line used to read
`npm run gate 2>&1 | grep -E 'Test Files|Tests  '`, which cannot tell a passing gate from a
failing one — a pipeline's `$?` is the _last_ command's status, so it reports `grep`'s. Command
substitution avoids the problem entirely, which is why the exemplar above uses it. If you must
pipe, the exit status has to be echoed, and the spelling is shell-specific — lanes run **zsh**,
where the bash form silently prints an empty string, which looks like provenance and is not:

```bash
npm run gate 2>&1 | grep -E 'Tests  ' ; echo "exit=${PIPESTATUS[0]}"   # bash
npm run gate 2>&1 | grep -E 'Tests  ' ; echo "exit=$pipestatus[1]"     # zsh
```

Demonstrate it with a grep that **matches**, which is the real case — a failing gate still prints
its summary table, so the grep succeeds and hides the failure. The obvious demonstration is the
wrong one and reports "no problem":

```zsh
( exit 1 ) | grep -E 'x'                         ; echo $?              # 1 — but only because
                                                                        # grep found nothing
( echo 'Tests  595'; exit 1 ) | grep -E 'Tests  '; echo $?              # 0 — the hazard
( echo 'Tests  595'; exit 1 ) | grep -E 'Tests  '; echo $pipestatus[1]  # 1 — the truth
( echo 'Tests  595'; exit 0 ) | grep -E 'Tests  '; echo $pipestatus[1]  # 0 — control: it is
                                                                        # not simply always 1
```

This is not pedantry about one line. `npm run coverage` prints its percentage table **identically
whether the thresholds passed or the run failed**, so a piped reading of it says "green" on a red
run. Measured: three consecutive runs on `main`, where run 1 exited 1 with percentages
byte-identical to the two that exited 0 — five tests had hit the 5000ms timeout under load
(#63).

**Never re-derive a figure from prose that quotes it, including prose you wrote earlier in the
same session.** Go back to the enforced source. A single paragraph about the a11y allowlist took
four revisions this way, each fixing the last and introducing a fresh arithmetic error, and what
ended it was quoting `.storybook/a11y-allowlist.ts` verbatim.

`node scripts/figure-audit.mjs <file>` counts how many figures in a body carry their command. It
is a proxy — a regex cannot tell a claim from a mention — but it is a stable one, which is what a
ratchet needs. Run it on a body before posting:

```bash
gh issue view 23 --json body -q .body | node scripts/figure-audit.mjs -
```

The measured baseline it exists to move, across the six issues #23 sampled (app #35, #41, #43;
kit #11, #16, #20): **1 of 86 substantive figures carried a command, 1.2%.** The one that did is
kit #11's `grep -rn "forwardRef" src/`.

Do not sweep old issues to fix this. It applies to what you touch from now on.

## Changelog

Every PR appends its entry under `## [Unreleased]`. `.gitattributes` sets `merge=union` on that
file, so parallel branches append cleanly instead of conflicting — but check the merged result
reads sensibly rather than assuming.

## The barrel is deliberate

`src/index.ts` is a flat barrel. A published package needs one public entry, so this is the
intended exception to the no-barrel-files convention the consuming app follows.
