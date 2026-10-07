/* ---------- Core: config, helpers, events, storage ---------- */
var VERSION = '2.0.0';
var w = typeof window !== 'undefined' ? window : null;
var d = typeof document !== 'undefined' ? document : null;
var cfg = {
  autoInit: true,                 // init on DOMContentLoaded
  observe: true,                  // MutationObserver: init markup added later (Vue, Electron, AJAX)
  sprite: true,                   // inject the SVG icon sprite (#aui-i-*)
  highlight: true,                // lazy-load highlight.js for <pre><code class="language-*">
  highlightUrl: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js',
  highlightLanguageUrl: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/{lang}.min.js',
  sheetBreakpoint: 640,           // menus & modals become bottom sheets at or below this width
  toastPosition: 'bottom-right',
  toastTimeout: 4500,
  commandHotkey: 'mod+k',
  storagePrefix: 'aui-'
};
if (w && w.ArmsysUIConfig) for (var ck in w.ArmsysUIConfig) cfg[ck] = w.ArmsysUIConfig[ck];

var AP = Array.prototype;
function toArr(list) { return AP.slice.call(list || []); }
function $(sel, root) { try { return (root || d).querySelector(sel); } catch (e) { return null; } }
function $$(sel, root) { try { return toArr((root || d).querySelectorAll(sel)); } catch (e) { return []; } }
/* Query including the root element itself */
function $$self(sel, root) { var out = $$(sel, root); if (root && root.nodeType === 1 && root.matches && root.matches(sel)) out.unshift(root); return out; }
function find(ref, from) {
  if (!ref) return null;
  if (ref.nodeType) return ref;
  if (typeof ref !== 'string') return null;
  var id = ref.charAt(0) === '#' ? ref.slice(1) : ref;
  var el = /^[\w-]+$/.test(id) ? d.getElementById(id) : null;
  return el || $(ref, from);
}
function on(el, type, fn, opts) { el.addEventListener(type, fn, opts || false); return function () { el.removeEventListener(type, fn, opts || false); }; }
function emit(el, name, detail, cancelable) {
  var ev;
  try { ev = new CustomEvent('aui:' + name, { bubbles: true, cancelable: !!cancelable, detail: detail || {} }); }
  catch (e) { ev = d.createEvent('CustomEvent'); ev.initCustomEvent('aui:' + name, true, !!cancelable, detail || {}); }
  return (el || d).dispatchEvent(ev);
}
function fire(el, type) { var ev; try { ev = new Event(type, { bubbles: true }); } catch (e) { ev = d.createEvent('Event'); ev.initEvent(type, true, false); } el.dispatchEvent(ev); }
function store(key, val) {
  try {
    if (arguments.length === 1) return w.localStorage.getItem(cfg.storagePrefix + key);
    if (val == null) w.localStorage.removeItem(cfg.storagePrefix + key); else w.localStorage.setItem(cfg.storagePrefix + key, val);
  } catch (e) { return null; }
}
function isSheetViewport() { return !!(w && w.matchMedia && w.matchMedia('(max-width: ' + cfg.sheetBreakpoint + 'px)').matches); }
function reducedMotion() { return !!(w && w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches); }
var uidN = 0;
function uid(p) { return (p || 'aui') + '-' + (++uidN).toString(36) + Math.random().toString(36).slice(2, 6); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function attr(el, name, def) { var v = el.getAttribute(name); return v == null ? def : v; }
function isTrue(v) { return v === '' || v === 'true' || v === '1' || v === true; }
function scopeRoot(near) {
  var r = (near && near.closest && near.closest('.aui')) || $('body.aui') || $('.aui[data-aui-root]');
  if (r) return r;
  r = d.createElement('div');
  r.className = 'aui aui--transparent';
  r.setAttribute('data-aui-root', '');
  var themed = $('.aui[data-aui-theme]');
  if (themed) r.setAttribute('data-aui-theme', themed.getAttribute('data-aui-theme'));
  d.body.appendChild(r);
  return r;
}
/* Run after the element's CSS animation ends (or a timeout fallback) */
function afterAnimation(el, fn, max) {
  var done = false;
  function finish() { if (done) return; done = true; el.removeEventListener('animationend', handler); fn(); }
  function handler(e) { if (e.target === el) finish(); }
  var name = w.getComputedStyle(el).animationName;
  if (!name || name === 'none' || reducedMotion()) { finish(); return; }
  el.addEventListener('animationend', handler);
  setTimeout(finish, max || 400);
}
/* Scroll lock with scrollbar compensation (nested-safe) */
var lockCount = 0;
function lockScroll() {
  if (lockCount++ > 0) return;
  var de = d.documentElement, sw = w.innerWidth - de.clientWidth;
  de.classList.add('aui-scroll-locked');
  if (sw > 0) de.style.paddingRight = sw + 'px';
}
function unlockScroll() {
  if (lockCount === 0) return;
  if (--lockCount > 0) return;
  d.documentElement.classList.remove('aui-scroll-locked');
  d.documentElement.style.paddingRight = '';
}
