#!/usr/bin/env bash
#
# Provision a lane worktree that cannot start subtly broken.
#
#   scripts/new-lane.sh <lane-name> [branch]
#
# Setting three worktrees up by hand surfaced four silent failures, each found
# only by hitting it (#24). None of them fail loudly: the lane starts, looks
# fine, and is missing something it needs. That is what this script exists to
# stop — not to save typing.
#
# What is NOT here, and why, because both were checked rather than assumed:
#
#   - MCP servers. `enabledMcpjsonServers` is set at USER scope in
#     ~/.claude/settings.json, so every worktree inherits it and no per-worktree
#     write is needed. Verified before writing this:
#       node -e "console.log(require(process.env.HOME+'/.claude/settings.json').enabledMcpjsonServers)"
#       -> [ 'context7', 'eslint', 'graphql', 'playwright' ]
#     The checklist still PRINTS the servers `.mcp.json` declares, because that
#     file is tracked and a lane losing Playwright is how accessibility work
#     stops being verifiable.
#
#   - A hand-written permission allowlist. The script copies the primary
#     checkout's `.claude/settings.local.json` instead. That file accumulates
#     approvals a human granted over time; regenerating a guess at it would
#     throw that away and drift from whatever the human actually approved.
#
# The one step people skip is the gate, and it is the one that matters most: a
# lane starting on a red tree misattributes the failure to its own first change.

set -euo pipefail

readonly BASE_BRANCH='main' # This repo integrates on main. The app's copy uses dev.

die() {
  printf 'new-lane: %s\n' "$1" >&2
  exit 1
}

[ $# -ge 1 ] || die "usage: scripts/new-lane.sh <lane-name> [branch]"

readonly LANE="$1"
readonly BRANCH="${2:-int/$LANE}"

case "$LANE" in
*/* | '' | .*) die "lane name must be a single path segment, got '$LANE'" ;;
esac

# Resolve the MAIN checkout rather than trusting the working directory. Running
# this from an existing worktree and reaching for a relative `../wt/<lane>` is
# the obvious spelling and it is wrong: from /…/wt/kit-1, `..` is already the
# worktree root, so the new lane lands in /…/wt/wt/<lane>. `--git-common-dir`
# points at the main checkout's .git from anywhere in the repo, worktree or not.
GIT_COMMON_DIR=$(git rev-parse --path-format=absolute --git-common-dir) ||
  die 'not inside a git repository'
readonly MAIN_CHECKOUT="${GIT_COMMON_DIR%/.git}"
# Split from the declaration on purpose: `readonly x="$(cmd)"` masks cmd's exit
# status, so a failing `dirname` would sail past `set -e` (shellcheck SC2155).
WORKTREE_ROOT="$(dirname "$MAIN_CHECKOUT")/wt"
readonly WORKTREE_ROOT
readonly TARGET="$WORKTREE_ROOT/$LANE"

# A worktree nested inside the repo gets collected by Vitest, ESLint and
# Prettier at once, and its tests resolve the `@`-alias to the OUTER src — two
# copies of every module in one graph, and roughly twenty phantom failures
# belonging to neither checkout. `.git/info/exclude` hides such a directory from
# git but not from a test runner, so the only reliable fix is to never create it
# there.
case "$TARGET/" in
"$MAIN_CHECKOUT"/*) die "refusing to nest a worktree inside the repo: $TARGET" ;;
esac

[ -e "$TARGET" ] && die "already exists: $TARGET"

step() { printf '\n=== %s\n' "$1"; }

step "fetch"
git -C "$MAIN_CHECKOUT" fetch origin --prune

step "worktree add $BRANCH -> $TARGET"
mkdir -p "$WORKTREE_ROOT"
git -C "$MAIN_CHECKOUT" worktree add -b "$BRANCH" "$TARGET" "origin/$BASE_BRANCH"

step "npm ci"
# `npm ci` rather than `npm install`: a lane must run the locked tree, and ci is
# the only one that guarantees it.
(cd "$TARGET" && npm ci)

step "corvus sync (skills)"
# `.claude/skills/` is gitignored per-skill, so `git worktree add` brings none of
# it and three lanes once started with zero skills. `.corvusrc` is tracked and
# already lists them; this only stops the restore being forgotten.
if command -v corvus >/dev/null 2>&1; then
  (cd "$TARGET" && corvus sync)
else
  printf 'corvus not on PATH — skills NOT restored; install it, then run "corvus sync" in the worktree\n' >&2
fi

step "local, gitignored files the worktree cannot inherit"
# Both are gitignored, so a worktree starts without them. settings.local.json is
# the accumulated permission approvals; the .env glob is a no-op in this repo
# today — it has no .env and no MCP server that wants one — and is here so a
# future one is not silently dropped.
for rel in .claude/settings.local.json .env .env.local; do
  if [ -f "$MAIN_CHECKOUT/$rel" ]; then
    mkdir -p "$(dirname "$TARGET/$rel")"
    cp "$MAIN_CHECKOUT/$rel" "$TARGET/$rel"
    printf 'copied %s\n' "$rel"
  else
    printf 'skipped %s (absent in %s)\n' "$rel" "$MAIN_CHECKOUT"
  fi
done

step "gate"
# The step a human skips, and the one that matters most.
gate_status=0
(cd "$TARGET" && npm run gate) || gate_status=$?

# ---------------------------------------------------------------------------
# Checklist. Every line is a value read back from the provisioned worktree, not
# a restatement of what the script tried to do — the failures this exists to
# catch all look like success from the inside.
# ---------------------------------------------------------------------------
skills_expected=$(sed -n 's/^skills=//p' "$TARGET/.corvusrc" 2>/dev/null | tr ',' '\n' | grep -c . || true)
skills_present=$(find "$TARGET/.claude/skills" -mindepth 1 -maxdepth 1 2>/dev/null | wc -l | tr -d ' ')
mcp_servers=$(node -e "
  const fs = require('node:fs');
  try {
    const j = JSON.parse(fs.readFileSync('$TARGET/.mcp.json', 'utf8'));
    process.stdout.write(Object.keys(j.mcpServers ?? {}).join(', ') || '(none)');
  } catch { process.stdout.write('(no .mcp.json)'); }
")

printf '\n'
printf '================ lane ready ================\n'
printf 'path      %s\n' "$TARGET"
printf 'branch    %s (from origin/%s)\n' "$BRANCH" "$BASE_BRANCH"
printf 'skills    %s present / %s declared in .corvusrc\n' "$skills_present" "$skills_expected"
printf 'mcp       %s\n' "$mcp_servers"
printf 'settings  %s\n' "$([ -f "$TARGET/.claude/settings.local.json" ] && echo 'settings.local.json copied' || echo 'settings.local.json MISSING')"
printf 'gate      exit %s%s\n' "$gate_status" "$([ "$gate_status" -eq 0 ] && echo '' || echo '   <-- RED BEFORE YOU TOUCHED ANYTHING')"
printf '===========================================\n'

if [ "$skills_present" != "$skills_expected" ]; then
  printf '\nWARNING: skills %s != %s declared. Run "corvus sync" in the worktree.\n' \
    "$skills_present" "$skills_expected" >&2
fi

if [ "$gate_status" -ne 0 ]; then
  printf '\nThe gate is red on a clean checkout of origin/%s. That failure is not yours —\n' "$BASE_BRANCH"
  printf 'find out who broke it before attributing it to your first change.\n' >&2
fi

exit "$gate_status"
