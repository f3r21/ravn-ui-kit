#!/usr/bin/env node
/**
 * Release preconditions, and the tag message.
 *
 *   node scripts/release-checks.mjs <version> [rootDir]
 *
 * Exits 0 and prints the `CHANGELOG.md` section for <version> on stdout — that text becomes the
 * annotated tag's message. Exits 1 and prints a `::error::` naming exactly which fact failed.
 *
 * This lives in a script rather than inline in the workflow YAML for the reason `CLAUDE.md`
 * records about the Claude Code hooks: an integration point nobody can run is an integration
 * point nobody notices is inert. `scripts/release-checks.test.mjs` drives every branch here,
 * Vitest collects it, so it runs inside `npm run gate`.
 *
 * What it deliberately does NOT do is bump `package.json`. A version bump is a change to a
 * tracked file and belongs in a reviewed PR — which is where `v0.5.1`'s came from. Leaving it
 * outside means a release can be attempted without it, and that is precisely what check 1
 * catches, so the omission fails safe rather than silently.
 *
 * The tag message comes from the changelog rather than a `workflow_dispatch` input on purpose.
 * An input is typed by hand at release time, which is the same hand path under the same pressure
 * that produced `v0.5.0`. Reading the changelog makes the tag message a derived artifact of a
 * file that was reviewed, and it points the incentive the right way: reasoning worth putting in
 * a tag is reasoning a consumer should find in the changelog.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** A `## [x.y.z]` heading, with or without a trailing date. `## [Unreleased]` matches too. */
const HEADING = /^## \[([^\]]+)\]/;

/**
 * Returns the body of the `## [name]` section — every line after the heading up to the next
 * `## ` heading or EOF — or `null` when there is no such heading.
 */
export function section(changelog, name) {
  const lines = changelog.split('\n');
  const start = lines.findIndex((l) => {
    const m = HEADING.exec(l);
    return m !== null && m[1] === name;
  });
  if (start === -1) return null;

  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => l.startsWith('## '));
  return (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();
}

/**
 * Version names with more than one `## [name]` heading.
 *
 * **This is the check that catches a truncated release body** (#74, finding 4). `section()`
 * above finds the *first* matching heading and reads to the next `## ` — so with two
 * `## [0.6.0]` headings, "the next heading" is the second one and the extracted notes are the
 * first block alone. A union merge produced exactly that on a rebase, and with an empty
 * `[Unreleased]` the whole release passed and would have published two lines in place of the
 * real section. Same class of failure as `v0.5.0`'s empty body, reached with the guard green.
 *
 * `[Unreleased]` is included rather than exempted: two of those is the same parsing hazard.
 */
export function duplicateHeadings(changelog) {
  const seen = new Set();
  const dupes = new Set();
  for (const line of changelog.split('\n')) {
    const m = HEADING.exec(line);
    if (!m) continue;
    if (seen.has(m[1])) dupes.add(m[1]);
    seen.add(m[1]);
  }
  return [...dupes];
}

/**
 * Top-level entries that appear verbatim more than once inside one section, as
 * `{ section, entry, count }` (#74, finding 3). Nothing else notices: `check()` tests a section
 * for content, never for repetition, so a doubled entry extracts, passes, and publishes twice.
 *
 * **Exact text, not the `(#N)` reference**, and the corpus is why. Counting references would
 * report `#9` ten times in `[0.5.1]` and `#95` twice in `[Unreleased]` — all legitimate, each a
 * distinct bullet about the same issue. Only an identical repeated line is evidence of a merge
 * having duplicated something rather than of an issue being discussed twice.
 *
 * Top-level `- ` only. Continuation lines and nested bullets repeat legitimately across
 * entries ("**Minor** — additive and optional." is not a defect the second time).
 */
export function duplicateEntries(changelog) {
  const out = [];
  let current = null;
  let seen = new Map();
  const flush = () => {
    for (const [entry, count] of seen) if (count > 1) out.push({ section: current, entry, count });
  };
  for (const line of changelog.split('\n')) {
    const m = HEADING.exec(line);
    if (m) {
      if (current !== null) flush();
      current = m[1];
      seen = new Map();
      continue;
    }
    if (current === null) continue;
    if (/^- /.test(line)) seen.set(line.trim(), (seen.get(line.trim()) ?? 0) + 1);
  }
  if (current !== null) flush();
  return out;
}

/**
 * Every precondition, as data rather than as control flow, so a caller can report which one
 * failed rather than only that something did. `ok: false` entries carry the reason.
 */
export function check(version, { pkg, changelog }) {
  const results = [];

  results.push(
    pkg.version === version
      ? { name: 'package.json version', ok: true }
      : {
          name: 'package.json version',
          ok: false,
          reason: `package.json is ${pkg.version}, not ${version}. Bump it in a reviewed PR first — this job will not edit tracked files.`,
        },
  );

  const notes = section(changelog, version);
  results.push(
    notes
      ? { name: 'CHANGELOG section', ok: true }
      : {
          name: 'CHANGELOG section',
          ok: false,
          reason:
            notes === null
              ? `CHANGELOG.md has no "## [${version}]" heading. Roll [Unreleased] into a dated section for this version.`
              : `CHANGELOG.md's "## [${version}]" section is empty.`,
        },
  );

  // `[Unreleased]` left populated means the section for this version is not the whole story —
  // something shipped in the tag that the tag does not document. Absent is fine: it just means
  // nobody has started the next one.
  const unreleased = section(changelog, 'Unreleased');
  results.push(
    !unreleased
      ? { name: 'CHANGELOG [Unreleased] empty', ok: true }
      : {
          name: 'CHANGELOG [Unreleased] empty',
          ok: false,
          reason: `CHANGELOG.md's [Unreleased] still has content, so ${version} would ship changes it does not document. Move them into the [${version}] section.`,
        },
  );

  // The two structural checks below are about the file rather than about this version, and
  // they run at release time because that is where the consequence lands — a duplicate heading
  // silently truncates the published body. They also run on every commit via
  // `release-checks.test.mjs`, which is where they will actually catch a bad merge: at release
  // time the damage is already in `main`.
  const dupeHeadings = duplicateHeadings(changelog);
  results.push(
    dupeHeadings.length === 0
      ? { name: 'CHANGELOG headings unique', ok: true }
      : {
          name: 'CHANGELOG headings unique',
          ok: false,
          reason: `CHANGELOG.md has more than one heading for: ${dupeHeadings.join(', ')}. The section reader stops at the next "## ", so a duplicate heading truncates the release notes to the first block. Merge them into one section.`,
        },
  );

  const dupeEntries = duplicateEntries(changelog);
  results.push(
    dupeEntries.length === 0
      ? { name: 'CHANGELOG entries unique', ok: true }
      : {
          name: 'CHANGELOG entries unique',
          ok: false,
          reason: `CHANGELOG.md repeats an entry verbatim inside one section: ${dupeEntries
            .map((d) => `[${d.section}] ×${d.count} — ${d.entry.slice(0, 60)}`)
            .join('; ')}. A union merge duplicates rather than conflicts; delete the copy.`,
        },
  );

  return { ok: results.every((r) => r.ok), results, notes: notes ?? '' };
}

function main(argv) {
  const [version, rootDir = process.cwd()] = argv;
  if (!version) {
    process.stderr.write('usage: release-checks.mjs <version> [rootDir]\n');
    return 2;
  }
  // Accepts `0.5.1` or `v0.5.1`; the tag carries the `v`, package.json does not.
  const bare = version.replace(/^v/, '');

  const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
  const changelog = readFileSync(join(rootDir, 'CHANGELOG.md'), 'utf8');

  const { ok, results, notes } = check(bare, { pkg, changelog });

  for (const r of results) {
    if (!r.ok) process.stderr.write(`::error::${r.name}: ${r.reason}\n`);
  }
  if (!ok) return 1;

  process.stdout.write(notes);
  return 0;
}

// Only run when invoked directly, so the test can import `check`/`section` without side effects.
if (process.argv[1] && process.argv[1].endsWith('release-checks.mjs')) {
  process.exit(main(process.argv.slice(2)));
}
