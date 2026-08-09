#!/usr/bin/env node
/**
 * Which of the kit's props the sole consumer actually passes.
 *
 * Collects every identifier imported from `@ravn/ui-kit`, then walks every JSX element using one
 * and records the attribute names on it. Syntax-only — it needs no type checker and no installed
 * dependency tree, so it runs against a bare checkout of the app without building anything.
 *
 * **Its figures are not reproducible from this repo alone**, and that is a stated limit rather
 * than an oversight: the answer depends on which checkout of the app you point it at, so a
 * figure derived from it has to name the app ref it was read at. `main` and `int/app-code`
 * agreed at the time of writing; nothing keeps them agreeing.
 *
 * A prop this reports as unused is unused *by this consumer today*. That is evidence about the
 * app, not a verdict on the prop — see the issue this script was written for.
 *
 * Usage: node scripts/consumer-prop-usage.mjs <path-to-app-checkout> [--json]
 */
import ts from 'typescript';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage']);
const PACKAGE = '@ravn/ui-kit';

function sourceFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) sourceFiles(p, out);
    else if (/\.tsx?$/.test(p)) out.push(p);
  }
  return out;
}

/** local JSX identifier -> the kit's own exported name, for `import { Foo as Bar }`. */
function kitImports(sf) {
  const aliasToKit = new Map();
  sf.forEachChild((node) => {
    if (!ts.isImportDeclaration(node)) return;
    if (!ts.isStringLiteral(node.moduleSpecifier)) return;
    if (node.moduleSpecifier.text !== PACKAGE) return;
    const named = node.importClause?.namedBindings;
    if (named && ts.isNamedImports(named))
      for (const el of named.elements)
        aliasToKit.set(el.name.text, (el.propertyName ?? el.name).text);
  });
  return aliasToKit;
}

/** @returns {Array<{name: string, props: string[]}>} */
export function analyze(appRoot) {
  /** kit export name (or `Name.Sub`) -> Set of prop names passed to it */
  const usage = new Map();

  for (const file of sourceFiles(join(appRoot, 'src'))) {
    const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    const aliasToKit = kitImports(sf);
    if (aliasToKit.size === 0) continue;
    // An imported-but-never-rendered name still counts as imported, with no props.
    for (const kitName of aliasToKit.values())
      if (!usage.has(kitName)) usage.set(kitName, new Set());

    const visit = (node) => {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        // `<Menu.Item>` — the root identifier is what was imported; record the pair under `Menu.Item`.
        const tag = node.tagName;
        const rootName = ts.isIdentifier(tag)
          ? tag.text
          : ts.isPropertyAccessExpression(tag) && ts.isIdentifier(tag.expression)
            ? tag.expression.text
            : null;
        if (rootName && aliasToKit.has(rootName)) {
          const kitName = aliasToKit.get(rootName);
          const key = ts.isIdentifier(tag) ? kitName : `${kitName}.${tag.name.text}`;
          if (!usage.has(key)) usage.set(key, new Set());
          for (const attr of node.attributes.properties) {
            if (ts.isJsxAttribute(attr) && ts.isIdentifier(attr.name))
              usage.get(key).add(attr.name.text);
            else if (ts.isJsxSpreadAttribute(attr)) usage.get(key).add('…spread');
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }

  return [...usage.entries()]
    .map(([name, props]) => ({ name, props: [...props].sort() }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/* c8 ignore start — CLI shell; `analyze()` above is what the tests drive. */
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const app = process.argv[2];
  if (!app) {
    console.error('usage: node scripts/consumer-prop-usage.mjs <path-to-app-checkout> [--json]');
    process.exit(2);
  }
  const rows = analyze(app);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    for (const r of rows) console.log(`${r.name.padEnd(24)} ${r.props.join(' ') || '(none)'}`);
    console.log('');
    console.log(
      `kit exports imported by the app:  ${rows.filter((r) => !r.name.includes('.')).length}`,
    );
    console.log(
      `distinct (component, prop) pairs: ${rows.reduce((n, r) => n + r.props.length, 0)}`,
    );
  }
}
/* c8 ignore stop */
