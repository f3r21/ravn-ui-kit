// jsdom does not implement the CSS Object Model's `CSS.escape`, which
// react-aria's collection-selection internals (useSelectableCollection, used
// by Tabs/useTabList and any future collection-based component) rely on to
// build `[data-key="..."]` selectors. Polyfill it per the CSSOM spec so those
// hooks don't crash under jsdom.
// https://drafts.csswg.org/cssom/#the-css.escape()-method
if (typeof globalThis.CSS === 'undefined') {
  // @ts-expect-error -- minimal polyfill, not the full CSSOM interface
  globalThis.CSS = {};
}
if (typeof globalThis.CSS.escape !== 'function') {
  globalThis.CSS.escape = (value: string): string => String(value).replace(
    /[^a-zA-Z0-9_-]/g,
    (char) => `\\${char}`
  );
}
