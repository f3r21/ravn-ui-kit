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
