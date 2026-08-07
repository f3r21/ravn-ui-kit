import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { check, section } from './release-checks.mjs';

// `process.cwd()`, not `import.meta.url` — the suite runs in the jsdom environment where
// `import.meta.url` is an http:// URL and `fileURLToPath` throws. Same note as
// `hooks.test.mjs:24`, and this file rediscovered it the hard way.
const ROOT = process.cwd();
const SCRIPT = join(ROOT, 'scripts', 'release-checks.mjs');

/** A changelog that satisfies every check, as the baseline each case breaks exactly one of. */
const GOOD_CHANGELOG = `# Changelog

## [Unreleased]

## [0.5.1] — 2026-08-07

### Fixed

- Something worth reading in a tag message.

## [0.5.0] — 2026-08-06

### Added

- Older entry that must not leak into the 0.5.1 section.
`;

const GOOD_PKG = { version: '0.5.1' };

function run(version, { pkg = GOOD_PKG, changelog = GOOD_CHANGELOG } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'release-checks-'));
  try {
    writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg));
    writeFileSync(join(dir, 'CHANGELOG.md'), changelog);
    // `stdio: 'pipe'` on all three streams is load-bearing, not tidiness. `execFileSync`
    // forwards the child's stderr to the parent's on a non-zero exit unless it is captured —
    // and this script's failure output is `::error::…`, which GitHub Actions parses as a
    // workflow command. Left uncaptured, a *passing* `npm run gate` in CI renders six red
    // error annotations from these deliberately-failing fixtures. A green run that looks
    // broken is the same class of defect as the red run that looked green (#53).
    const opts = { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] };
    try {
      const stdout = execFileSync('node', [SCRIPT, version, dir], opts);
      return { code: 0, stdout, stderr: '' };
    } catch (e) {
      return { code: e.status, stdout: e.stdout ?? '', stderr: e.stderr ?? '' };
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('release-checks', () => {
  it('passes on a correct release and prints the section as the tag message', () => {
    const { code, stdout } = run('0.5.1');
    expect(code).toBe(0);
    expect(stdout).toContain('Something worth reading in a tag message.');
    // The section must stop at the next heading — otherwise every tag message would carry the
    // entire changelog, growing by one release each time and burying the part that matters.
    expect(stdout).not.toContain('Older entry');
    expect(stdout).not.toContain('## [0.5.0]');
  });

  it('accepts the tag spelling as well as the bare version', () => {
    expect(run('v0.5.1').code).toBe(0);
  });

  /**
   * The issue's requirement, and the reason these are three cases rather than one: each check
   * has to fail on its own. Three checks that only ever fail together are one check wearing a
   * costume — the suite would pass identically if two of them were deleted.
   *
   * Each case below breaks exactly one precondition, leaving the other two satisfied, and
   * asserts on the message naming that one.
   */
  describe('each check discriminates independently', () => {
    it('catches an unbumped package.json, and says so', () => {
      const { code, stderr } = run('0.5.1', { pkg: { version: '0.4.0' } });
      expect(code).toBe(1);
      expect(stderr).toContain('package.json version');
      expect(stderr).toContain('0.4.0');
      // The other two were fine, so they must not be reported.
      expect(stderr).not.toContain('CHANGELOG section');
      expect(stderr).not.toContain('[Unreleased] empty');
    });

    it('catches a changelog with no section for the version, and says so', () => {
      const changelog = GOOD_CHANGELOG.replace(
        '## [0.5.1] — 2026-08-07',
        '## [0.4.9] — 2026-08-01',
      );
      const { code, stderr } = run('0.5.1', { changelog });
      expect(code).toBe(1);
      expect(stderr).toContain('CHANGELOG section');
      expect(stderr).not.toContain('package.json version');
      expect(stderr).not.toContain('[Unreleased] empty');
    });

    it('catches an [Unreleased] that was never rolled, and says so', () => {
      const changelog = GOOD_CHANGELOG.replace(
        '## [Unreleased]\n',
        '## [Unreleased]\n\n### Added\n\n- Shipped but undocumented in the tag.\n',
      );
      const { code, stderr } = run('0.5.1', { changelog });
      expect(code).toBe(1);
      expect(stderr).toContain('[Unreleased] empty');
      expect(stderr).not.toContain('package.json version');
      expect(stderr).not.toContain('CHANGELOG section');
    });
  });

  /**
   * A positive control for the assertions above. Every `not.toContain` in this file is a
   * negative result, and a negative result proves nothing unless the same probe can return
   * positive on the same corpus — otherwise "absent" and "a pattern that could never match" are
   * indistinguishable. This is the `dist/`-staleness misreading of #54 in miniature: two greps
   * returned 0 against a bundle that contained what they were looking for.
   */
  it('the phrases those cases assert are ABSENT can be present — control', () => {
    const { stderr } = run('0.5.1', {
      pkg: { version: '0.0.1' },
      changelog: '# Changelog\n\n## [Unreleased]\n\n- Still here.\n',
    });
    expect(stderr).toContain('package.json version');
    expect(stderr).toContain('CHANGELOG section');
    expect(stderr).toContain('[Unreleased] empty');
  });

  it('reports usage rather than crashing when given no version', () => {
    const { code, stderr } = run('');
    expect(code).toBe(2);
    expect(stderr).toContain('usage');
  });

  describe('section()', () => {
    it('returns null for a heading that is not there, and empty string for one that is', () => {
      expect(section(GOOD_CHANGELOG, '9.9.9')).toBeNull();
      expect(section(GOOD_CHANGELOG, 'Unreleased')).toBe('');
    });

    it('does not match a version that is a prefix of another', () => {
      // `[0.5.1]` must not be found by looking for `0.5`, which a substring match would do.
      expect(section(GOOD_CHANGELOG, '0.5')).toBeNull();
    });
  });

  it('finds a real section for the shipped version in this repo’s own CHANGELOG', () => {
    // Fixtures prove the logic; this proves the logic matches the file it will be pointed at.
    // If someone reformats a changelog heading, the release job would otherwise break at
    // release time — the worst possible moment to find out.
    //
    // It asserts the parse, NOT the full release precondition. `[Unreleased]` being empty is a
    // release-time condition: between releases it is *supposed* to have content, so asserting
    // `check(...).ok` here would go red on the next PR that adds an entry — including the one
    // adding this file. A test that fails for doing the right thing gets deleted, and takes the
    // heading-format guard with it.
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');

    const notes = section(changelog, pkg.version);
    expect(notes, `no "## [${pkg.version}]" heading in CHANGELOG.md`).not.toBeNull();
    expect(notes.length).toBeGreaterThan(0);

    // And the version check, which is true at every point in the cycle rather than only at one.
    expect(check(pkg.version, { pkg, changelog }).results[0]).toMatchObject({
      name: 'package.json version',
      ok: true,
    });
  });
});
