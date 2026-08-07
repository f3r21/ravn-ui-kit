import { describe, it, expect } from 'vitest';
import { auditText, isBlindPipe } from './figure-audit.mjs';

/**
 * `figure-audit.mjs` scores every issue and PR body in this repo and had no test at all — the
 * same shape as the Claude Code hooks `CLAUDE.md` records, which were installed, running and
 * completely inert. A scorer nobody can run is a scorer nobody notices has drifted, and this one
 * had: it taught `npm run gate 2>&1 | tail -6` as its exemplar and credited it (#53).
 */
describe('figure-audit', () => {
  describe('blind provenance (#53)', () => {
    it('refuses to credit a verification piped without an exit-status echo', () => {
      const r = auditText('- 284 tests, 97.63% statements — `npm run gate 2>&1 | tail -6`\n');
      expect(r.substantive).toBeGreaterThan(0);
      expect(r.blind).toBe(r.substantive);
      expect(r.sourced).toBe(0);
    });

    it.each([
      ['zsh', '`npm run gate 2>&1 | tail -6 ; echo "exit=$pipestatus[1]"`'],
      ['bash', '`npm run gate 2>&1 | tail -6 ; echo "exit=${PIPESTATUS[0]}"`'],
      ['command substitution', '`out=$(npm run gate 2>&1); rc=$?; echo "$out" | tail -6`'],
    ])('credits the same figure when the status survives — %s', (_name, cmd) => {
      const r = auditText(`- 284 tests, 97.63% statements — ${cmd}\n`);
      expect(r.blind).toBe(0);
      expect(r.sourced).toBe(r.substantive);
    });

    /**
     * The rule is narrow on purpose, and this is the case that keeps it honest. The hazard is
     * not "a pipe" — it is a pipe that discards a status the figure depends on. Here the figure
     * IS the output and `grep`'s status carries no claim, so crediting it is correct.
     *
     * Without this case the obvious over-broad implementation ("any piped command is blind")
     * passes every other test in this file.
     */
    it('still credits a pipe whose exit status carries no claim', () => {
      const r = auditText('- 0 hits — `grep -rn "forwardRef" src/ | wc -l`\n');
      expect(r.blind).toBe(0);
      expect(r.sourced).toBe(r.substantive);
    });

    it('leaves an unpiped verification alone', () => {
      const r = auditText('- 595 tests — `npm run gate`\n');
      expect(r.blind).toBe(0);
      expect(r.sourced).toBe(r.substantive);
    });

    /**
     * #71. The verification must be UPSTREAM of the pipe, not merely present in the string.
     * Here the gate's status is already resolved at the `$(...)` boundary and the later pipe
     * masks nothing — flagging it penalises the practice this tool exists to encourage, which
     * is the failure mode that drives people back to bare numbers.
     *
     * Found by running the detector over the existing corpus, not by re-reading the code: the
     * sabotage tested the rule, and only the corpus tested the implementation of the rule.
     */
    it('does not flag a pipe that is downstream of a command substitution', () => {
      const r = auditText(
        `- 595 tests, 38 files — \`out=$(npm run gate 2>&1); echo "$out" | grep 'Tests  '\`\n`,
      );
      expect(r.blind).toBe(0);
      expect(r.sourced).toBe(r.substantive);
    });
  });

  describe('isBlindPipe', () => {
    it.each([
      ['`npm run gate 2>&1 | tail -6`', true],
      ['`npm run coverage | head -3`', true],
      ['`npx vitest run --coverage 2>&1 | grep Tests`', true],
      ['`npm run gate 2>&1 | tail -6 ; echo $pipestatus[1]`', false],
      ['`grep -c foo src/x.ts`', false],
      ['`git show v0.5.1:package.json | grep version`', false],
      ['`npm run gate`', false],
      // #71: verification upstream of the pipe, vs. resolved before it.
      ['`out=$(npm run gate 2>&1); echo "$out" | grep Tests`', false],
      ['`out=$(npm run gate 2>&1); rc=$?; echo "$out" | tail -6`', false],
      // Still blind — the substitution is present but the verification is NOT inside it.
      ['`echo $(date) ; npm run gate 2>&1 | tail -6`', true],
    ])('%s -> %s', (text, expected) => {
      expect(isBlindPipe(text)).toBe(expected);
    });
  });

  /**
   * Positive control for the negative assertions above. Every `expect(...).toBe(0)` here is a
   * negative result, and a negative result cannot distinguish "correctly not flagged" from "the
   * detector never fires". This proves the same detector fires on the same corpus.
   */
  it('control: the detector does fire, so the zeroes above mean something', () => {
    expect(isBlindPipe('`npm run gate 2>&1 | tail -6`')).toBe(true);
  });

  describe('counting, unchanged by #53', () => {
    it('does not count an ordered-list marker as a figure', () => {
      expect(auditText('1. Run the gate\n').substantive).toBe(0);
    });

    it('counts file:line pointers separately rather than as figures', () => {
      const r = auditText('See `task-card.tsx:78` for the reasoning.\n');
      expect(r.fileLines).toBe(1);
      expect(r.substantive).toBe(0);
    });

    it('ignores numbers inside fenced blocks', () => {
      expect(auditText('```\n42 tests\n```\n').substantive).toBe(0);
    });

    it('requires adjacency, not mere co-occurrence', () => {
      // A command mentioned in the same sentence says nothing about where a number came from.
      const r = auditText('It must run inside `npm run gate`, and 42 of them do.\n');
      expect(r.sourced).toBe(0);
    });
  });
});
