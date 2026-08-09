import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * The repo's Node floor, and the mechanism that makes it fail rather than warn.
 *
 * #132's finding was not that the floor was wrong — it was that **nothing could tell a satisfied
 * floor from an unsatisfied one.** `npm warn EBADENGINE` is advisory: npm prints it, installs
 * anyway and exits 0, so `npm run gate` is green on a Node the dependencies refuse. Measured on
 * #133's run: CI at v22.23.1 emitted zero warnings, a local v22.17.0 emitted ten, and both exited
 * 0 with byte-identical results. That is the same family as an inert hook — a thing that does
 * nothing exits exactly like a thing that works.
 *
 * So the cases below do not assert a version number. They assert that the mechanism **can fail**,
 * which is the only property that distinguishes this from the state it replaces.
 */

// Each case shells out to a real `npm install`, three times over. Measured at roughly a second
// apiece, against a suite default of 5000ms that #63 already recorded five tests hitting under
// parallel load — so this gets an explicit allowance rather than sitting just under the default.
const TIMEOUT = 60_000;

/**
 * A throwaway package with the given `engines`, installed with or without `engine-strict`.
 *
 * **`npm_config_engine_strict` is stripped from the child's environment, and that is load-bearing.**
 * npm exports every config key as `npm_config_*` to the processes it spawns, and env beats a
 * project `.npmrc` in npm's precedence order. So once this repo's own `.npmrc` turned the setting
 * on, it reached the temp package through `npm run gate` → vitest → this `execFileSync` — and the
 * off-arm below measured **1** where a bare shell measures 0. That failure is what found this: the
 * case is a control, so a wrong answer there reads as "engine-strict changes nothing" rather than
 * as a leak. Deleting the key is what makes each arm test the `.npmrc` it was given.
 */
function installWith({ engines, engineStrict }) {
  const dir = mkdtempSync(join(tmpdir(), 'kit-engines-'));
  const env = { ...process.env };
  delete env.npm_config_engine_strict;
  try {
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({ name: 't', version: '1.0.0', engines }),
    );
    writeFileSync(join(dir, '.npmrc'), `engine-strict=${engineStrict}\n`);
    try {
      execFileSync('npm', ['install', '--package-lock-only'], { cwd: dir, stdio: 'pipe', env });
      return 0;
    } catch (e) {
      return e.status ?? 1;
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('the Node floor is declared rather than inherited', () => {
  it('.nvmrc pins a full version, not a floating major', () => {
    // `22` resolves to whatever 22.x a runner happens to have cached, so which Node CI uses is
    // decided by the cache rather than by this repo. Three consecutive green runs resolved
    // v22.23.1 — that was luck holding, not a guarantee.
    expect(readFileSync('.nvmrc', 'utf8').trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('.npmrc turns EBADENGINE from a warning into a failure', () => {
    expect(readFileSync('.npmrc', 'utf8')).toMatch(/^engine-strict=true$/m);
  });

  it('package.json declares no engines, deliberately', () => {
    // Not an oversight, and pinned here so it is not "fixed" without reading #132.
    //
    // `engine-strict` already enforces every dependency's own `engines`, derived from the
    // installed tree. A hand-written `engines.node` beside it is a SECOND source for the same
    // fact, and the two drift the moment a dependency raises its floor — which is exactly what
    // jsdom 30 does in #133. This repo's whole convention is that a figure with no command
    // behind it goes stale; a version range with no derivation behind it is the same defect.
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.engines).toBeUndefined();
  });
});

describe('engine-strict actually fails — the property that distinguishes it from a warning', () => {
  it(
    'fails an install when the running Node cannot satisfy the declared floor',
    { timeout: TIMEOUT },
    () => {
      expect(installWith({ engines: { node: '>=99.0.0' }, engineStrict: true })).not.toBe(0);
    },
  );

  it('control: passes when the floor is satisfiable', { timeout: TIMEOUT }, () => {
    // Without this, the case above passes just as well against an npm that fails every install,
    // or against a broken temp directory — neither of which is engine-strict working.
    expect(installWith({ engines: { node: '>=18.0.0' }, engineStrict: true })).toBe(0);
  });

  it(
    'control: the same impossible floor exits 0 with engine-strict off',
    { timeout: TIMEOUT },
    () => {
      // The defect itself, reproduced. This is what every install in this repo did before `.npmrc`
      // existed, and it is why the warning could not be relied on: identical inputs, exit 0.
      expect(installWith({ engines: { node: '>=99.0.0' }, engineStrict: false })).toBe(0);
    },
  );
});
