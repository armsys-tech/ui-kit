#!/usr/bin/env node
/* Armsys UI build — zero required dependencies.
 *   node scripts/build.mjs          concatenate src/ → dist/ (+ minify if esbuild is installed)
 *   node scripts/build.mjs --check  fail if dist/ is out of date (CI)
 * Consumers never need this: dist/ is committed and served by npm/jsDelivr. */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const V = pkg.version;
const read = (p) => readFileSync(join(root, p), 'utf8').replace(/\r\n/g, '\n').trimEnd() + '\n';

export const CSS_ORDER = [
  'tokens/tokens.css',
  'base/base.css', 'base/prose.css',
  'components/button.css', 'components/forms.css', 'components/menu.css', 'components/overlay.css',
  'components/navigation.css', 'components/data.css', 'components/table.css', 'components/feedback.css', 'components/code.css',
  'layouts/frame.css', 'layouts/site.css', 'layouts/docs.css', 'layouts/app.css', 'layouts/auth.css',
  'layouts/pricing.css', 'layouts/data-pages.css', 'layouts/desktop.css',
  'base/utilities.css'
];
export const JS_ORDER = ['00-core.js', '10-icons.js', '20-overlay.js', '30-floating.js', '31-menus.js', '40-forms.js', '50-ui.js', '60-code.js', '90-init.js'];

const banner = (kind) => `/*!
 * Armsys UI ${V} — Framework-independent design system by Armsys Technology
 * ${kind}
 * MIT License · https://github.com/armsys-tech/ui-kit
 */\n`;

function buildCss() {
  const body = CSS_ORDER.map((f) => read('src/' + f)).join('\n');
  return banner('Usage: <link rel="stylesheet" href="armsys-ui.css"> + <body class="aui"> (or any <div class="aui">)\n * Generated from src/ by scripts/build.mjs — edit the sources, not this file.') + '\n' + body;
}
function jsBody() {
  return JS_ORDER.map((f) => read('src/js/' + f)).join('\n').replace(/var VERSION = '[^']*';/, `var VERSION = '${V}';`).split('\n').map((l) => (l ? '  ' + l : l)).join('\n');
}
function buildJs() {
  return banner('Dependency-free behaviours via data attributes. Load once (defer). Exposes window.ArmsysUI.\n * Generated from src/js by scripts/build.mjs — edit the sources, not this file.') +
`(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else if (root && !root.ArmsysUI) root.ArmsysUI = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  if (typeof window !== 'undefined' && window.ArmsysUI && window.ArmsysUI.version) return window.ArmsysUI;
${jsBody()}
  return ArmsysUI;
});
`;
}
function buildEsm() {
  return banner('ES module build: import ArmsysUI from "@armsys-tech/ui"; (auto-initialises in the browser, SSR-safe)') +
`const ArmsysUI = (function () {
  'use strict';
  if (typeof window !== 'undefined' && window.ArmsysUI && window.ArmsysUI.version) return window.ArmsysUI;
${jsBody()}
  return ArmsysUI;
})();
export default ArmsysUI;
export { ArmsysUI };
export const { init, openModal, closeModal, confirm, prompt, alert, toast, setTheme, getTheme, openCommand, openDropdown, closeDropdown, closeAll, selectTab, copy, refreshSelect, highlight, addIcons, icon, position } = ArmsysUI;
`;
}

/* Conservative CSS minifier (used only when esbuild is unavailable) */
function minifyCssLite(css) {
  let out = '', i = 0, q = null;
  while (i < css.length) {
    const c = css[i];
    if (q) { out += c; if (c === '\\') { out += css[i + 1]; i += 2; continue; } if (c === q) q = null; i++; continue; }
    if (c === '"' || c === "'") { q = c; out += c; i++; continue; }
    if (c === '/' && css[i + 1] === '*') { const e = css.indexOf('*/', i + 2); if (css[i + 2] === '!') out += css.slice(i, e + 2) + '\n'; i = e + 2; continue; }
    out += c; i++;
  }
  return out.replace(/\s+/g, ' ').replace(/\s*([{};])\s*/g, '$1').replace(/;}/g, '}').trim() + '\n';
}

/* Verify that every aui-* class referenced by the AI catalogue and the HTML exists in the CSS */
function verifyClasses(css) {
  const defined = new Set([...css.matchAll(/\.(aui-[a-z0-9-]+)/g)].map((m) => m[1]));
  const tones = new Set(['accent', 'success', 'info', 'warning', 'danger', 'purple', 'pink', 'orange', 'yellow', 'teal', 'neutral']);
  const sources = ['ai/components.json', 'index.html'];
  for (const dir of ['examples', 'ai/recipes', 'integrations']) { try { for (const f of readdirSync(join(root, dir))) if (/\.(html|md)$/.test(f)) sources.push(dir + '/' + f); } catch {} }
  const missing = new Map();
  for (const src of sources) {
    const text = read(src);
    const re = src.endsWith('.json') ? /(?<![\w-]|data-|--)aui-[a-z0-9-]*[a-z0-9]/g : /class="([^"]*)"/g;
    const names = src.endsWith('.json') ? [...text.matchAll(re)].map((m) => m[0]) : [...text.matchAll(re)].flatMap((m) => m[1].split(/\s+/)).filter((c) => c.startsWith('aui-'));
    for (const c of names) {
      if (defined.has(c) || c.startsWith('aui-i-') || tones.has(c.split('--').pop())) continue;
      if (!missing.has(c)) missing.set(c, new Set());
      missing.get(c).add(src);
    }
  }
  for (const [c, files] of missing) console.warn(`unknown class ${c} in ${[...files].join(', ')}`);
  return missing.size;
}

/* ai/tokens.json is generated from src/tokens/tokens.css */
function buildTokens() {
  const css = read('src/tokens/tokens.css');
  const block = (sel) => { const i = css.indexOf(sel + ' {'); if (i < 0) return ''; return css.slice(i, css.indexOf('\n}', i)); };
  const parse = (txt) => { const out = {}; for (const m of txt.matchAll(/(--aui-[\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim(); return out; };
  const dark = block('.aui'), light = parse(block('.aui[data-aui-theme="light"]'));
  const groups = {}; let group = 'misc';
  for (const line of dark.split('\n')) {
    const g = line.match(/\/\*\s*-+\s*(.+?)\s*-+\s*\*\//); if (g) { group = g[1].replace(/\s*\(.*\)/, '').replace(/[^\w]+(\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, (c) => c.toLowerCase()); continue; }
    for (const m of line.matchAll(/(--aui-[\w-]+):\s*([^;]+);/g)) { (groups[group] ||= {})[m[1]] = light[m[1]] ? { dark: m[2].trim(), light: light[m[1]] } : m[2].trim(); }
  }
  const accents = {}; for (const m of css.matchAll(/data-aui-accent="(\w+)"\]\s*\{([^}]*)\}/g)) accents[m[1]] = parse(m[2]);
  return JSON.stringify({ schemaVersion: 2, version: V, scope: '.aui', prefix: '--aui-', source: 'src/tokens/tokens.css',
    themes: { attribute: 'data-aui-theme', values: ['dark (default)', 'light', 'system (resolved by JS)'] },
    accentPresets: { attribute: 'data-aui-accent', values: accents },
    density: { classes: ['aui--dense', 'aui--comfortable'] },
    usage: 'Prefer component classes. When custom CSS is unavoidable, use these tokens — never hard-coded colours, radii or spacing.',
    groups }, null, 2) + '\n';
}

/* ai/icons.json is generated from the sprite in src/js/10-icons.js */
function buildIcons() {
  const src = read('src/js/10-icons.js');
  const names = [...src.matchAll(/^\s*'([\w-]+)':\s*'/gm)].map((m) => m[1]);
  const brand = ['google', 'github', 'microsoft', 'apple', 'discord', 'logo'];
  return JSON.stringify({ schemaVersion: 2, version: V, usage: '<svg class="aui-icon"><use href="#aui-i-NAME"/></svg>', sizes: 'aui-icon--2xs|xs|sm|lg|xl|2xl', brandAndFilled: brand.filter((n) => names.includes(n)), names, extend: 'ArmsysUI.addIcons({ name: \'<path d="…"/>\' }) — 24×24 viewBox, stroke icons' }, null, 2) + '\n';
}

/* llms-full.txt — one-file context for AI assistants, generated from the catalogues */
function buildLlmsFull(tokensJson, iconsJson) {
  const comps = JSON.parse(read('ai/components.json'));
  const js = JSON.parse(read('ai/javascript.json'));
  const pats = JSON.parse(read('ai/patterns.json'));
  const tokens = JSON.parse(tokensJson), icons = JSON.parse(iconsJson);
  const L = [];
  L.push(`# Armsys UI ${V} — complete reference for AI assistants`, '', '> Generated by scripts/build.mjs from AI_GUIDE.md, ai/*.json and ai/recipes/*.md. Use only what is listed here.', '');
  L.push(read('AI_GUIDE.md').replace(/^# .*\n/, '## Rules (AI_GUIDE.md)\n'), '');
  L.push('## Design tokens', '', 'Scope `.aui`. Themes via `data-aui-theme="dark|light|system"`; accents via `data-aui-accent="' + Object.keys(tokens.accentPresets.values).join('|') + '"`; density `aui--dense` / `aui--comfortable`.', '');
  for (const [g, vals] of Object.entries(tokens.groups)) {
    L.push(`### ${g}`, '');
    for (const [k, v] of Object.entries(vals)) L.push(`- \`${k}\`: ${typeof v === 'string' ? v : `${v.dark} (light: ${v.light})`}`);
    L.push('');
  }
  L.push('## Components', '', comps.toneModifiers, '');
  const cats = {};
  for (const [name, c] of Object.entries(comps.components)) (cats[c.category] ||= []).push([name, c]);
  for (const [cat, list] of Object.entries(cats)) {
    L.push(`### Category: ${cat}`, '');
    for (const [name, c] of list) {
      L.push(`#### ${name} — \`${c.base}\``, '');
      if (c.alsoApplies) L.push(`Also applies to: ${c.alsoApplies.join(', ')}`);
      if (c.generated) L.push(`Generated DOM: ${c.generated}`);
      if (c.modifiers) for (const [k, v] of Object.entries(c.modifiers)) L.push(`- ${k}: ${v.join(', ')}`);
      if (c.elements) L.push(`- elements: ${c.elements.join(', ')}`);
      if (c.related) L.push(`- related: ${c.related.join(', ')}`);
      if (c.dataAttributes) L.push(`- data attributes: ${c.dataAttributes.join('; ')}`);
      if (c.events) L.push(`- events: ${c.events.join(', ')}`);
      if (c.js) L.push(`- JS: ${c.js.join('; ')}`);
      if (c.rules) for (const r of c.rules) L.push(`- rule: ${r}`);
      if (c.markup) { L.push('', '```html'); for (const m of c.markup) L.push(m); L.push('```'); }
      L.push(`Source: ${c.file}`, '');
    }
  }
  L.push('## JavaScript', '', js.lifecycle, '', '### Config (`window.ArmsysUIConfig`)', '');
  for (const [k, v] of Object.entries(js.config.options)) L.push(`- \`${k}\`: ${v}`);
  L.push('', '### Data attributes', '');
  for (const [k, v] of Object.entries(js.dataAttributes)) L.push(`- \`${k}\` — ${v}`);
  L.push('', '### API (`window.ArmsysUI` / `import ArmsysUI from "@armsys-tech/ui"`)', '');
  for (const [k, v] of Object.entries(js.api)) L.push(`- \`${k}\` — ${v}`);
  L.push('', '### Events (bubble from the element)', '', js.events.map((e) => '`' + e + '`').join(', '), '');
  L.push('## Page patterns', '', pats.frameRule, '');
  for (const [k, p] of Object.entries(pats.patterns)) L.push(`- **${k}** (${p.surface}): ${(p.useFor || []).join(', ')} → ${p.example || (p.examples || []).join(', ')}${p.shell ? ' · shell: ' + p.shell : ''}${p.recipe ? ' · recipe: ' + p.recipe : ''}`);
  L.push('');
  for (const f of readdirSync(join(root, 'ai/recipes')).sort()) L.push(read('ai/recipes/' + f).replace(/^# /, '## '), '');
  L.push('## Icons', '', icons.usage, '', icons.names.join(', '), '');
  return L.join('\n');
}

async function main() {
  const check = process.argv.includes('--check');
  const files = {
    'dist/armsys-ui.css': buildCss(),
    'dist/armsys-ui.js': buildJs(),
    'dist/armsys-ui.mjs': buildEsm(),
    'dist/armsys-ui.d.ts': read('src/types/armsys-ui.d.ts'),
    'ai/tokens.json': buildTokens(),
    'ai/icons.json': buildIcons()
  };
  files['llms-full.txt'] = buildLlmsFull(files['ai/tokens.json'], files['ai/icons.json']);
  let esbuild = null;
  try { esbuild = await import('esbuild'); } catch { /* optional */ }
  if (esbuild) {
    files['dist/armsys-ui.min.css'] = (await esbuild.transform(files['dist/armsys-ui.css'], { loader: 'css', minify: true, legalComments: 'inline', target: ['chrome111', 'safari16.4', 'firefox128'] })).code;
    files['dist/armsys-ui.min.js'] = (await esbuild.transform(files['dist/armsys-ui.js'], { loader: 'js', minify: true, legalComments: 'inline', target: 'es2017' })).code;
  } else if (!check) {
    files['dist/armsys-ui.min.css'] = minifyCssLite(files['dist/armsys-ui.css']);
    if (!existsSync(join(root, 'dist/armsys-ui.min.js'))) files['dist/armsys-ui.min.js'] = files['dist/armsys-ui.js'];
    console.warn('esbuild not installed — CSS minified conservatively, JS min left as-is. Run `npm i -D esbuild` for full minification.');
  } else {
    console.warn('esbuild not installed — skipping minified files in --check.');
  }
  mkdirSync(join(root, 'dist'), { recursive: true });
  let stale = 0;
  for (const [p, content] of Object.entries(files)) {
    const abs = join(root, p);
    const prev = existsSync(abs) ? readFileSync(abs, 'utf8').replace(/\r\n/g, '\n') : ''; // ignore Windows CRLF checkouts
    if (prev === content) continue;
    if (check) { console.error('out of date: ' + p); stale++; continue; }
    writeFileSync(abs, content);
    console.log(`wrote ${p} (${(content.length / 1024).toFixed(1)} KB)`);
  }
  const unknown = verifyClasses(files['dist/armsys-ui.css']);
  if (check && (stale || unknown)) process.exit(1);
}
main();
