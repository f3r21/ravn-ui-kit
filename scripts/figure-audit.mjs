#!/usr/bin/env node
//
// Counts how many figures in a GitHub issue or PR body carry the command that
// re-derives them (#23).
//
// This script exists because #23's own headline number has to obey #23's rule.
// "2 of 130" is useless to the next person without the thing that produced it,
// and a ratio quoted from prose is exactly the failure mode being fixed — so the
// rule is applied to the metric that measures the rule.
//
// It is a proxy, not a judge. "Is this a claim?" is a reading question and this
// is a regex; the counts below are reproducible rather than authoritative, which
// is the property that matters for a ratchet. What it must never do is drift:
// the same input has to give the same answer months from now.
//
// Usage:
//   node scripts/figure-audit.mjs <file>...
//   gh issue view 23 --json body -q .body | node scripts/figure-audit.mjs -

import { readFileSync } from 'node:fs';

// Fenced blocks are stripped first. A number inside a command is part of the
// evidence, not a claim being made — counting `tail -6` as an unsourced figure
// would penalise exactly the behaviour this is meant to reward.
const FENCE = /```[\s\S]*?```/g;

// `card.tsx:13`, `select.tsx:66,72` — a pointer to a location, not a quantity.
// #23 counts these separately because they are trivially checkable by opening
// the file, so they neither need a command nor say anything about rigour.
const FILE_LINE = /[A-Za-z0-9_./-]+\.[A-Za-z]+:\d+(?:,\d+)*/g;

// `#23`, `v0.4.0`, `React 19` in a version position, dates. Not quantities.
const ISSUE_REF = /#\d+/g;
const ISO_DATE = /\d{4}-\d{2}-\d{2}/g;
const SEMVER = /v?\d+\.\d+\.\d+(?:-[\w.]+)?/g;

// What is left: a bare quantity, optionally a percentage or a decimal.
const FIGURE = /\d[\d,]*(?:\.\d+)?%?/g;

// An ordered-list marker is not a figure. Dropping this cost a factor of ten on
// the first run: `## Verification` sections are numbered lists whose items
// routinely mention `npm run gate`, so every "1." and "2." was counted as a
// figure *and* credited as sourced by the gate reference sitting beside it.
const LIST_ORDINAL = /^\s*\d+\.\s/;

const COMMAND = String.raw`\`[^\`]*\b(?:grep|rg|npm|npx|node|git|gh|wc|ls|find|jq|curl|sed|awk|tsc|vitest|eslint|prettier|cat|diff|du|stat)\b[^\`]*\``;

// Adjacency, not co-occurrence. A figure is sourced when a command sits on the
// same line *joined to it* by an em-dash or an arrow — the two shapes #23 gives:
//
//   - 284 tests, 97.63% statements — `npm run gate 2>&1 | tail -6`
//   - `grep -rn "forwardRef" src/` → **0 hits**
//
// Merely mentioning a command in the same sentence is not sourcing. "It must run
// inside `npm run gate`" tells a reader nothing about where a number came from,
// and counting it did exactly what this issue exists to stop: inflated a rigour
// metric with prose that happens to contain backticks.
const SOURCED = new RegExp(`(?:[—–]|->|→)\\s*${COMMAND}|${COMMAND}\\s*(?:[—–]|->|→)`);

function auditText(raw) {
  const body = raw.replace(FENCE, '');
  let fileLines = 0;
  let sourced = 0;
  let substantive = 0;
  const unsourcedSamples = [];

  for (const line of body.split('\n')) {
    fileLines += (line.match(FILE_LINE) ?? []).length;

    // Order matters: remove every non-quantity shape before counting digits, or
    // `card.tsx:13` contributes a "13" and `#23` contributes a "23".
    const stripped = line
      .replace(LIST_ORDINAL, ' ')
      .replace(FILE_LINE, ' ')
      .replace(ISO_DATE, ' ')
      .replace(SEMVER, ' ')
      .replace(ISSUE_REF, ' ');

    const figures = stripped.match(FIGURE) ?? [];
    if (figures.length === 0) continue;

    substantive += figures.length;
    if (SOURCED.test(line)) {
      sourced += figures.length;
    } else if (unsourcedSamples.length < 3) {
      unsourcedSamples.push(`${figures.slice(0, 4).join(', ')}  ::  ${line.trim().slice(0, 72)}`);
    }
  }

  return { substantive, sourced, fileLines, total: substantive + fileLines, unsourcedSamples };
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('usage: node scripts/figure-audit.mjs <file>... | -');
  process.exit(2);
}

const totals = { substantive: 0, sourced: 0, fileLines: 0, total: 0 };

for (const arg of args) {
  const raw = readFileSync(arg === '-' ? 0 : arg, 'utf8');
  const r = auditText(raw);
  for (const k of Object.keys(totals)) totals[k] += r[k];
  const pct = r.substantive === 0 ? '—' : `${((r.sourced / r.substantive) * 100).toFixed(1)}%`;
  console.log(
    `${arg.padEnd(28)} substantive=${String(r.substantive).padStart(3)} sourced=${String(r.sourced).padStart(3)} (${pct.padStart(6)})  file:line=${String(r.fileLines).padStart(3)}  all=${String(r.total).padStart(3)}`,
  );
  for (const s of r.unsourcedSamples) console.log(`    unsourced: ${s}`);
}

if (args.length > 1) {
  const pct = ((totals.sourced / totals.substantive) * 100).toFixed(1);
  console.log('-'.repeat(96));
  console.log(
    `${'TOTAL'.padEnd(28)} substantive=${String(totals.substantive).padStart(3)} sourced=${String(totals.sourced).padStart(3)} (${String(pct).padStart(5)}%)  file:line=${String(totals.fileLines).padStart(3)}  all=${String(totals.total).padStart(3)}`,
  );
}
