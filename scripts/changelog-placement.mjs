#!/usr/bin/env node
/**
 * Every changelog entry a branch *adds* must land in `[Unreleased]`.
 *
 *   node scripts/changelog-placement.mjs <baseRef> [rootDir]
 *
 * Exits 0 when every added entry is in `[Unreleased]`. Exits 1 and prints a `::error::` naming
 * each misplaced entry and the section it landed in.
 *
 * ## Why this is a diff check and not a file check
 *
 * #74 shipped two checks over `CHANGELOG.md` itself — unique headings, no verbatim-repeated
 * entries — and neither catches the case that started it. `.gitattributes` sets `merge=union`
 * on that file, so rebasing a branch whose entry sits under `## [Unreleased]` onto a `main`
 * where that section has just been rolled into a release **relocates the entry into the released
 * section**. No conflict, no warning.
 *
 * The result is well-formed: the entry is unique, in exactly one section, and renders correctly.
 * Whether it *belongs* there is a fact about which commits are in the tag, which the file does
 * not contain. **The diff does contain it** — a branch that adds an entry is a branch whose work
 * is not released yet, so the entry belongs in `[Unreleased]` and nowhere else.
 *
 * It fired twice on one branch in a single afternoon (#103), and the second time it defeated a
 * commit whose entire purpose was fixing the first. That is why this is a check rather than care.
 *
 * ## The exemption, and why it is the branch name
 *
 * A release PR relocates `[Unreleased]` into a dated section on purpose. That is the one
 * legitimate instance of exactly the diff shape this refuses.
 *
 * The exemption keys on the **head branch being `release/*`**, deliberately, and not on the
 * shape of the diff. "Skip when it looks like a release" would exempt precisely the corruption
 * this exists to catch, because a union merge produces the same shape. A branch name is
 * something a merge cannot fabricate.
 *
 * ## This check is worthless without `fetch-depth: 0`
 *
 * `actions/checkout` defaults to a depth-1 clone, where the base ref does not exist. A diff
 * against a ref that is not there is empty, and an empty diff passes — **silently, on every
 * PR**. `ci.yml` sets `fetch-depth: 0` for this reason and the two must not be separated;
 * `resolveAddedEntries` below refuses rather than returning nothing when the base is missing,
 * so the failure is loud if they ever are.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** A `## [name]` heading, with or without a trailing date. */
const HEADING = /^## \[([^\]]+)\]/;

/** A top-level changelog entry. Continuation lines and nested bullets are not entries. */
const ENTRY = /^- \S/;

/**
 * Maps every top-level entry in `changelog` to the section it sits in.
 * Later duplicates win, which is harmless here — #74's `duplicateEntries` refuses those.
 */
export function entrySections(changelog) {
  const sections = new Map();
  let current = null;
  for (const line of changelog.split('\n')) {
    const m = HEADING.exec(line);
    if (m) {
      current = m[1];
      continue;
    }
    if (current === null) continue;
    if (ENTRY.test(line)) sections.set(line.trim(), current);
  }
  return sections;
}

/**
 * Added entries that did not land in `[Unreleased]`.
 *
 * `unlocatable` is reported rather than ignored: an added line that cannot be found in the head
 * file means the two inputs disagree, and silently returning "nothing misplaced" for that is the
 * vacuous-pass this whole check exists to avoid.
 */
export function misplacedEntries(addedEntries, changelog) {
  const sections = entrySections(changelog);
  const misplaced = [];
  const unlocatable = [];

  for (const raw of addedEntries) {
    const entry = raw.trim();
    if (!ENTRY.test(entry)) continue;
    const section = sections.get(entry);
    if (section === undefined) unlocatable.push(entry);
    else if (section !== 'Unreleased') misplaced.push({ entry, section });
  }
  return { misplaced, unlocatable };
}

/**
 * The added lines in `CHANGELOG.md` between `baseRef` and `HEAD`.
 *
 * Throws when `baseRef` cannot be resolved. That is the shallow-clone case, and returning an
 * empty list there would make every PR pass.
 */
export function resolveAddedEntries(baseRef, rootDir) {
  const git = (args) => execFileSync('git', args, { cwd: rootDir, encoding: 'utf8' });

  try {
    git(['rev-parse', '--verify', '--quiet', `${baseRef}^{commit}`]);
  } catch {
    throw new Error(
      `cannot resolve base ref "${baseRef}". In CI this means the checkout is shallow — ` +
        `set fetch-depth: 0. An unresolvable base yields an empty diff, which would pass ` +
        `every pull request silently.`,
    );
  }

  const diff = git(['diff', '--unified=0', `${baseRef}...HEAD`, '--', 'CHANGELOG.md']);
  return diff
    .split('\n')
    .filter((l) => l.startsWith('+') && !l.startsWith('+++'))
    .map((l) => l.slice(1));
}

function main(argv) {
  const [baseRef, rootDir = process.cwd()] = argv;
  if (!baseRef) {
    process.stderr.write('usage: changelog-placement.mjs <baseRef> [rootDir]\n');
    return 2;
  }

  const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    cwd: rootDir,
    encoding: 'utf8',
  }).trim();

  if (branch.startsWith('release/')) {
    process.stdout.write(`skipped: ${branch} is a release branch, which relocates by design\n`);
    return 0;
  }

  let added;
  try {
    added = resolveAddedEntries(baseRef, rootDir);
  } catch (e) {
    process.stderr.write(`::error::changelog placement: ${e.message}\n`);
    return 1;
  }

  const changelog = readFileSync(join(rootDir, 'CHANGELOG.md'), 'utf8');
  const { misplaced, unlocatable } = misplacedEntries(added, changelog);

  for (const { entry, section } of misplaced) {
    process.stderr.write(
      `::error::changelog placement: this branch adds an entry that landed in [${section}], ` +
        `not [Unreleased] — ${entry.slice(0, 80)}. A merge=union rebase relocates entries ` +
        `without conflicting; move it back to [Unreleased].\n`,
    );
  }
  for (const entry of unlocatable) {
    process.stderr.write(
      `::error::changelog placement: an added entry is not present in the head CHANGELOG.md — ` +
        `${entry.slice(0, 80)}. The diff and the file disagree; do not ignore this.\n`,
    );
  }

  if (misplaced.length || unlocatable.length) return 1;

  // Count entries, not raw diff lines. `added` holds every added line — headings, blank lines,
  // continuation prose — and reporting that as "N added entries" would be a figure the tool
  // itself gets wrong, which is a poor advertisement for a check about accuracy.
  const entries = added.filter((l) => ENTRY.test(l.trim())).length;
  process.stdout.write(`ok: ${entries} added entr${entries === 1 ? 'y' : 'ies'} in [Unreleased]\n`);
  return 0;
}

// Only run when invoked directly, so tests can import the pure functions. Note the guard is on
// this exact filename: a renamed copy will not run `main()` and will exit 0 printing nothing,
// which is the vacuous-pass shape recorded on #107. Do not copy this file to test it.
if (process.argv[1] && process.argv[1].endsWith('changelog-placement.mjs')) {
  process.exit(main(process.argv.slice(2)));
}
