#!/usr/bin/env node
/**
 * Measures the kit's public prop surface with the TypeScript type checker.
 *
 * Every other way of counting this is a regex over interface bodies, and a regex cannot see that
 * `ButtonProps extends AriaButtonProps` brings 38 more props with it. The checker can, and the
 * distinction is the whole point of the instrument: a prop the kit **declares** is one it owns,
 * decided on, and could remove; a prop it **inherits** from React Aria arrives whether anyone
 * decided anything or not. Counting them together answers no question worth asking.
 *
 * Icons are reported separately for the same reason. Every icon takes
 * `React.SVGProps<SVGSVGElement>` and so inherits 488 props apiece — real, but it is one decision
 * taken once, and folding 20 copies of it into a total drowns the 307 the kit actually declares.
 *
 * Usage:
 *   node scripts/prop-surface.mjs                 # totals
 *   node scripts/prop-surface.mjs --by-component  # per-component breakdown, then totals
 *   node scripts/prop-surface.mjs --props         # component<TAB>prop<TAB>declaring file
 *   node scripts/prop-surface.mjs --json          # everything, machine-readable
 */
import ts from 'typescript';
import { resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

/** A file under `src/components/icons/` — see the note above on why these are split out. */
export const isIconFile = (file) => file.includes('icons/icons.tsx');

/**
 * @param {string} root absolute path to a checkout of this repo
 * @returns {{totals: object, components: Array}}
 */
export function measure(root = process.cwd()) {
  const entry = resolve(root, 'src/index.ts');
  const configPath = ts.findConfigFile(root, ts.sys.fileExists, 'tsconfig.json');
  if (!configPath) throw new Error(`no tsconfig.json at or above ${root}`);
  const parsed = ts.parseJsonConfigFileContent(
    ts.readConfigFile(configPath, ts.sys.readFile).config,
    ts.sys,
    root,
  );

  const program = ts.createProgram([entry], { ...parsed.options, noEmit: true });
  const checker = program.getTypeChecker();
  const entrySource = program.getSourceFile(entry);
  if (!entrySource) throw new Error(`could not load ${entry}`);
  const moduleSymbol = checker.getSymbolAtLocation(entrySource);
  if (!moduleSymbol) throw new Error('src/index.ts is not a module');

  /** PascalCase, callable, and the call signature returns something JSX-shaped. */
  const isComponent = (sym) => {
    if (!/^[A-Z]/.test(sym.getName())) return false;
    const decl = sym.valueDeclaration ?? sym.declarations?.[0];
    if (!decl) return false;
    const sigs = checker.getTypeOfSymbolAtLocation(sym, decl).getCallSignatures();
    if (sigs.length === 0) return false;
    return /Element|ReactNode|ReactElement|JSX/.test(
      checker.typeToString(checker.getReturnTypeOfSignature(sigs[0])),
    );
  };

  const propsTypeOf = (sym) => {
    const decl = sym.valueDeclaration ?? sym.declarations[0];
    const sig = checker.getTypeOfSymbolAtLocation(sym, decl).getCallSignatures()[0];
    const param = sig?.getParameters()?.[0];
    if (!param) return null;
    return checker.getTypeOfSymbolAtLocation(param, param.valueDeclaration ?? decl);
  };

  /** Where a prop is declared is who owns it. This one line is the instrument. */
  const originOf = (propSym) => {
    const d = propSym.declarations?.[0];
    if (!d) return 'unknown';
    const f = d.getSourceFile().fileName;
    if (f.includes('node_modules')) return 'inherited';
    return f.startsWith(root) ? 'declared' : 'unknown';
  };

  const components = [];
  for (const sym of checker.getExportsOfModule(moduleSymbol)) {
    if (!isComponent(sym)) continue;
    const propsType = propsTypeOf(sym);
    const props = (propsType ? checker.getPropertiesOfType(propsType) : []).map((p) => {
      const d = p.declarations?.[0];
      return {
        name: p.getName(),
        origin: originOf(p),
        from: d ? relative(root, d.getSourceFile().fileName) : null,
      };
    });
    const declFile = (sym.valueDeclaration ?? sym.declarations[0]).getSourceFile().fileName;
    components.push({
      name: sym.getName(),
      file: relative(root, declFile),
      declared: props.filter((p) => p.origin === 'declared'),
      inherited: props.filter((p) => p.origin === 'inherited'),
      total: props.length,
      props,
    });
  }
  components.sort((a, b) => a.name.localeCompare(b.name));

  const sum = (list, key) => list.reduce((n, c) => n + c[key].length, 0);
  const icons = components.filter((c) => isIconFile(c.file));
  const rest = components.filter((c) => !isIconFile(c.file));

  return {
    totals: {
      components: rest.length,
      declaredProps: sum(rest, 'declared'),
      inheritedProps: sum(rest, 'inherited'),
      iconComponents: icons.length,
      iconDeclaredProps: sum(icons, 'declared'),
      iconInheritedProps: sum(icons, 'inherited'),
    },
    components,
  };
}

/* c8 ignore start — CLI shell; `measure()` above is what the tests drive. */
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const args = process.argv.slice(2);
  const { totals, components } = measure();

  if (args.includes('--json')) {
    console.log(JSON.stringify({ totals, components }, null, 2));
  } else if (args.includes('--props')) {
    for (const c of components)
      for (const p of c.declared) console.log(`${c.name}\t${p.name}\t${p.from}`);
  } else {
    if (args.includes('--by-component')) {
      for (const c of components)
        console.log(
          `${String(c.declared.length).padStart(3)} declared  ` +
            `${String(c.inherited.length).padStart(4)} inherited  ${c.name}  (${c.file})`,
        );
      console.log('');
    }
    console.log(`components (excluding icons):      ${totals.components}`);
    console.log(`  props they declare in src/:      ${totals.declaredProps}`);
    console.log(`  props they inherit:              ${totals.inheritedProps}`);
    console.log(`icon components:                   ${totals.iconComponents}`);
    console.log(`  props they declare in src/:      ${totals.iconDeclaredProps}`);
    console.log(`  props they inherit (SVGProps):   ${totals.iconInheritedProps}`);
  }
}
/* c8 ignore stop */
