import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { entrySections, misplacedEntries, headBranch } from './changelog-placement.mjs';

const ROOT = process.cwd();
const SCRIPT = join(ROOT, 'scripts', 'changelog-placement.mjs');

/**
 * A changelog *after* a release has been rolled — `[Unreleased]` empty, a dated section below
 * it. This is the state a branch rebases onto, and the state in which `merge=union` relocates.
 */
const ROLLED = `# Changelog

## [Unreleased]

## [0.6.0] — 2026-08-08

### Fixed

- **An entry that really did ship in 0.6.0** (#92).
`;

/** The branch's entry, correctly under `[Unreleased]`. */
const CORRECT = `# Changelog

## [Unreleased]

### Fixed

- **The branch's own entry** (#102).

## [0.6.0] — 2026-08-08

### Fixed

- **An entry that really did ship in 0.6.0** (#92).
`;

/** And the corruption: the same entry, relocated into the released section. */
const RELOCATED = `# Changelog

## [Unreleased]

## [0.6.0] — 2026-08-08

### Fixed

- **The branch's own entry** (#102).
- **An entry that really did ship in 0.6.0** (#92).
`;

const ADDED = ["- **The branch's own entry** (#102)."];

describe('changelog placement (#107)', () => {
  /**
   * The failing case first. #74's two checks **pass** on `RELOCATED` — the heading is unique and
   * no entry repeats — so this is precisely the gap they leave, and the one that started #74.
   */
  it('fails when an added entry landed in a released section', () => {
    const { misplaced } = misplacedEntries(ADDED, RELOCATED);

    expect(misplaced).toHaveLength(1);
    expect(misplaced[0].section).toBe('0.6.0');
    expect(misplaced[0].entry).toContain('#102');
  });

  /**
   * The control. Without it, "misplaced is empty" is indistinguishable from a probe that returns
   * empty for everything — the vacuous-pass shape this whole issue is about.
   */
  it('control: the same probe passes when the entry is where it belongs', () => {
    expect(misplacedEntries(ADDED, CORRECT).misplaced).toEqual([]);
  });

  it('says nothing about entries the branch did not add', () => {
    // The 0.6.0 entry sits in a released section and that is correct — it is not in the diff.
    expect(misplacedEntries([], RELOCATED).misplaced).toEqual([]);
    expect(
      misplacedEntries(ADDED, RELOCATED)
        .misplaced.map((m) => m.entry)
        .join(),
    ).not.toContain('#92');
  });

  it('reports an added entry that is not in the head file, rather than ignoring it', () => {
    // The diff and the file disagreeing is not a pass. Silently returning "nothing misplaced"
    // would be the same failure as an unresolvable base ref.
    const { unlocatable } = misplacedEntries(['- **Never written to the file** (#999).'], CORRECT);
    expect(unlocatable).toHaveLength(1);
  });

  describe('what counts as an entry', () => {
    it('ignores continuation lines and nested bullets', () => {
      // "**Minor** — additive." is not a defect the second time, and an indented bullet belongs
      // to the entry above it.
      const sections = entrySections(`## [Unreleased]

- **A real entry** (#1).
  Some continuation prose.
  - a nested bullet
`);
      expect([...sections.keys()]).toEqual(['- **A real entry** (#1).']);
    });

    it('ignores anything before the first heading', () => {
      expect(entrySections('- stray bullet above every heading\n').size).toBe(0);
    });
  });

  /**
   * `headBranch` exists because `git rev-parse --abbrev-ref HEAD` answers the wrong question in
   * the only environment that matters. These pin the three inputs it has to tell apart.
   */
  describe('headBranch', () => {
    it('prefers GITHUB_HEAD_REF, which is the head branch on a pull_request event', () => {
      expect(headBranch({ GITHUB_HEAD_REF: 'release/0.7.0' }, ROOT)).toBe('release/0.7.0');
    });

    it('falls back to the local branch when GITHUB_HEAD_REF is absent', () => {
      // Whatever branch the suite is running on — the assertion is that it is a real name and
      // not the literal `HEAD`, which is the value that made the exemption inert.
      const local = headBranch({}, ROOT);
      expect(local).not.toBe('HEAD');
      expect(typeof local).toBe('string');
    });

    it('treats an empty GITHUB_HEAD_REF as absent rather than as a branch named ""', () => {
      // `push`-event workflows set it to the empty string rather than leaving it unset, and
      // `''.startsWith('release/')` is false — so this would look correct while skipping the
      // fallback entirely.
      expect(headBranch({ GITHUB_HEAD_REF: '' }, ROOT)).toBe(headBranch({}, ROOT));
    });
  });
});

/**
 * End-to-end in a throwaway repo. The two behaviours below cannot be reached through the pure
 * functions and both are load-bearing: one is the exemption, the other is the reason the check
 * is not decorative.
 */
describe('changelog placement CLI (#107)', () => {
  function repo(build) {
    const dir = mkdtempSync(join(tmpdir(), 'changelog-placement-'));
    const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' });
    git('init', '-q', '-b', 'main');
    git('config', 'user.email', 'test@example.com');
    git('config', 'user.name', 'test');
    writeFileSync(join(dir, 'CHANGELOG.md'), ROLLED);
    git('add', '-A');
    git('commit', '-qm', 'base');
    build({ dir, git });
    return dir;
  }

  /**
   * `env` overrides matter here rather than being a convenience. CI runs this with
   * `GITHUB_HEAD_REF` set and a detached HEAD, and the inherited environment of a local test run
   * has neither — so a case that does not set them is not testing what production does.
   *
   * `GITHUB_HEAD_REF: ''` is passed explicitly by default so these cases stay deterministic if
   * the suite itself is ever run inside a GitHub Action, where the real variable would otherwise
   * leak in and quietly exempt everything.
   */
  function run(dir, baseRef, env = {}) {
    try {
      const stdout = execFileSync('node', [SCRIPT, baseRef, dir], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, GITHUB_HEAD_REF: '', ...env },
      });
      return { code: 0, stdout, stderr: '' };
    } catch (e) {
      return { code: e.status, stdout: e.stdout ?? '', stderr: e.stderr ?? '' };
    }
  }

  it('fails a branch that relocated its entry into a released section', () => {
    const dir = repo(({ dir, git }) => {
      git('switch', '-qc', 'fix/102-something');
      writeFileSync(join(dir, 'CHANGELOG.md'), RELOCATED);
      git('commit', '-qam', 'changelog');
    });
    try {
      const { code, stderr } = run(dir, 'main');
      expect(code).toBe(1);
      expect(stderr).toContain('landed in [0.6.0]');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('control: the same branch passes when the entry is under [Unreleased]', () => {
    const dir = repo(({ dir, git }) => {
      git('switch', '-qc', 'fix/102-something');
      writeFileSync(join(dir, 'CHANGELOG.md'), CORRECT);
      git('commit', '-qam', 'changelog');
    });
    try {
      expect(run(dir, 'main').code).toBe(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  /**
   * The exemption keys on the **branch name**, not the diff. A release PR relocates
   * `[Unreleased]` into a dated section on purpose — the one legitimate instance of the shape
   * this refuses. Keying on the shape would exempt the corruption along with it.
   */
  it('exempts a release branch, which relocates by design', () => {
    const dir = repo(({ dir, git }) => {
      git('switch', '-qc', 'release/0.7.0');
      writeFileSync(join(dir, 'CHANGELOG.md'), RELOCATED);
      git('commit', '-qam', 'roll');
    });
    try {
      const { code, stdout } = run(dir, 'main');
      expect(code).toBe(0);
      expect(stdout).toContain('release branch');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  /**
   * ## The condition CI actually presents, which the case above does not
   *
   * `actions/checkout` on a `pull_request` event checks out the **merge commit in detached
   * HEAD**. `git rev-parse --abbrev-ref HEAD` returns the literal `HEAD` there, and
   * `'HEAD'.startsWith('release/')` is false — so the exemption above passed in this suite while
   * being **inert in CI**, the only place it runs. It was green because `git switch -qc
   * release/0.7.0` gave it a named branch that production never has.
   *
   * These three cases are the repair, and all three detach first.
   */
  describe('under a detached HEAD, which is what CI checks out', () => {
    const releaseRepo = () =>
      repo(({ dir, git }) => {
        git('switch', '-qc', 'release/0.7.0');
        writeFileSync(join(dir, 'CHANGELOG.md'), RELOCATED);
        git('commit', '-qam', 'roll');
        git('checkout', '-q', '--detach');
      });

    it('exempts a release branch when GITHUB_HEAD_REF names one', () => {
      const dir = releaseRepo();
      try {
        const { code, stdout } = run(dir, 'main', { GITHUB_HEAD_REF: 'release/0.7.0' });
        expect(code).toBe(0);
        expect(stdout).toContain('release branch');
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });

    /**
     * The regression pin. Without `GITHUB_HEAD_REF` there is no branch name to read, and the old
     * code silently answered `HEAD` — which is not a release, so it fell through to checking.
     * That is the behaviour kept, but it must be kept *deliberately*: the check runs, and says
     * why. A future edit that "fixes" this by skipping when the branch is unknown turns the
     * check off for every detached checkout, so this asserts it does not skip.
     */
    it('does not skip when the branch cannot be identified — it checks, and says so', () => {
      const dir = releaseRepo();
      try {
        const { code, stdout, stderr } = run(dir, 'main');
        expect(stdout).toContain('head branch unknown');
        expect(code).toBe(1);
        expect(stderr).toContain('landed in [0.6.0]');
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });

    /**
     * Control: the exemption is not "anything in `GITHUB_HEAD_REF` passes". A non-release head
     * ref on the identical tree still fails, so the case above is testing the name and not the
     * mere presence of the variable.
     */
    it('control: a non-release GITHUB_HEAD_REF on the same tree still fails', () => {
      const dir = releaseRepo();
      try {
        const { code, stderr } = run(dir, 'main', { GITHUB_HEAD_REF: 'fix/102-something' });
        expect(code).toBe(1);
        expect(stderr).toContain('landed in [0.6.0]');
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });
  });

  /**
   * The reason `ci.yml` must set `fetch-depth: 0`, asserted rather than left to a comment.
   *
   * An unresolvable base yields an empty diff, and an empty diff has nothing misplaced in it —
   * so without this refusal the check would **pass silently on every pull request**, which is
   * the exact class it exists to stop shipping.
   */
  it('refuses an unresolvable base ref instead of passing on an empty diff', () => {
    const dir = repo(({ dir, git }) => {
      git('switch', '-qc', 'fix/102-something');
      writeFileSync(join(dir, 'CHANGELOG.md'), RELOCATED);
      git('commit', '-qam', 'changelog');
    });
    try {
      const { code, stderr } = run(dir, 'origin/main');
      expect(code).toBe(1);
      expect(stderr).toContain('shallow');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('reports usage rather than crashing when given no base ref', () => {
    const { code, stderr } = run(ROOT, '');
    expect(code).toBe(2);
    expect(stderr).toContain('usage');
  });
});
