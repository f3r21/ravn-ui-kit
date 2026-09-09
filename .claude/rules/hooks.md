---
name: hooks
description: The Claude Code hooks are tested because they were inert; JSON on stdin, exit 2 to deny, and one known false positive.
paths:
  - '.claude/hooks/**'
  - 'scripts/hooks.test.mjs'
---

# The Claude Code hooks are tested, because they were inert

`.claude/hooks/` holds two scripts and `scripts/hooks.test.mjs` proves they work. Vitest collects
it, so it runs inside `npm run gate`, which is the point of it existing.

All three integration points the original commit copied in were inert: the safety hook read `$1`,
both formatter hooks interpolated a `$FILE_PATH`, and `.claudeignore` is not a file Claude Code
reads at all. A hook that does nothing exits 0 exactly like one that works, so nothing caught it.
Two of the test's cases exist only to pin the removed shapes, so a revert to the broken input
source goes red instead of quiet: a command on argv must still deny, and a path on argv or in
`$FILE_PATH` must leave the file untouched.

**Hook input is JSON on stdin**, never argv and never an environment variable. Denying is
`permissionDecision: "deny"` on stdout; a non-zero exit that is not exactly 2 prints the refusal
and then runs the command anyway. `node` parses the payload, not `jq`, because `npm install`
never provides `jq` and a parser missing on one machine is the same silent no-op again.

**`.claudeignore` is gone and `permissions.deny` in `.claude/settings.json` replaces it.** That
is a real control rather than a decorative one and it costs accordingly: a `Read()` rule also
covers the shell's readers, so `node_modules/**` is genuinely unreadable, and reaching for React
Aria's own source means an override in the untracked `settings.local.json`.

**Known false positive:** the safety hook matches the command line as text, so a
`gh issue comment` whose body quotes `rm -rf /` or `git push --force` is denied. Use
`--body-file`. A false deny rather than a false allow is the right direction here, and it is a
chosen behaviour rather than one to rediscover.
