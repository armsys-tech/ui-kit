/*!
 * Armsys UI 2.0.1 — Framework-independent design system by Armsys Technology
 * Dependency-free behaviours via data attributes. Load once (defer). Exposes window.ArmsysUI.
 * Generated from src/js by scripts/build.mjs — edit the sources, not this file.
 * MIT License · https://github.com/armsys-tech/ui-kit
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else if (root && !root.ArmsysUI) root.ArmsysUI = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  if (typeof window !== 'undefined' && window.ArmsysUI && window.ArmsysUI.version) return window.ArmsysUI;
  /* ---------- Core: config, helpers, events, storage ---------- */
  var VERSION = '2.0.1';
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

  /* ---------- Icon sprite: <svg class="aui-icon"><use href="#aui-i-search"/></svg> ---------- */
  var ICONS = {
    'logo': '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M12 2.5 3 21h4.3l1.6-3.6h6.2l1.6 3.6H21L12 2.5Zm0 7.1 1.9 4.4h-3.8L12 9.6Z"/>',
    'search': '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'minus': '<path d="M5 12h14"/>',
    'check': '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    'x': '<path d="M18 6 6 18M6 6l12 12"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-up': '<path d="m6 15 6-6 6 6"/>',
    'chevron-right': '<path d="m9 6 6 6-6 6"/>',
    'chevron-left': '<path d="m15 6-6 6 6 6"/>',
    'chevrons-up-down': '<path d="m8 9 4-4 4 4M8 15l4 4 4-4"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
    'copy': '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 5H6a1 1 0 0 0-1 1v9"/>',
    'menu': '<path d="M4 7h16M4 12h16M4 17h16"/>',
    'home': '<path d="m4 11 8-7 8 7"/><path d="M6 9.5V20h12V9.5"/>',
    'grid': '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    'activity': '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    'server': '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
    'database': '<ellipse cx="12" cy="5.5" rx="8" ry="2.5"/><path d="M4 5.5v13c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-13"/><path d="M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5"/>',
    'users': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.2 2.4 3.6 5.2"/>',
    'user': '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.2-6 8-6s7 2 8 6"/>',
    'bell': '<path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/>',
    'settings': '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    'sliders': '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    'filter': '<path d="M4 5h16l-6 7.5V19l-4 1.5v-8z"/>',
    'download': '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    'upload': '<path d="M12 16V5M7 10l5-5 5 5M5 20h14"/>',
    'more': '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
    'more-v': '<circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/>',
    'lock': '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    'zap': '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
    'shield': '<path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    'code': '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    'book': '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H20v14H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3"/>',
    'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>',
    'terminal': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>',
    'alert': '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4M12 17h.01"/>',
    'info': '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    'x-circle': '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    'lightbulb': '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    'trash': '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    'edit': '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    'refresh': '<path d="M20 11a8 8 0 0 0-14.3-4.3L4 8.5M4 4v4.5h4.5M4 13a8 8 0 0 0 14.3 4.3l1.7-1.8M20 20v-4.5h-4.5"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'calendar': '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    'key': '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3"/>',
    'layers': '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    'cpu': '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    'mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    'star': '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    'logout': '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11"/>',
    'cloud': '<path d="M7 18h10a4 4 0 0 0 .6-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18z"/>',
    'box': '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    'chart': '<path d="M5 20v-7M11 20V5M17 20v-10M3 20h18"/>',
    'trophy': '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9.5 17h5"/>',
    'link': '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    'hash': '<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>',
    'play': '<path d="M7 4.5v15L19 12z"/>',
    'pause': '<path d="M8 5v14M16 5v14"/>',
    'eye': '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    'branch': '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 3-10.5 6"/>',
    'moon': '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    'sidebar': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    'building': '<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18M8 8h3M8 12h3M8 16h3"/>',
    'plug': '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
    'radio': '<circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8"/>',
    'file': '<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5"/>',
    'help': '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>',
    'workflow': '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M6.5 10v4a3 3 0 0 0 3 3H14"/>',
    'webhook': '<circle cx="6" cy="17" r="2.5"/><circle cx="18" cy="17" r="2.5"/><circle cx="12" cy="6" r="2.5"/><path d="M8.5 17h7M10.8 8.2 7.3 14.8M13.2 8.2l3.5 6.6"/>',
    'eye-off': '<path d="M3 3l18 18M10.6 5.1A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6C3.9 8.3 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    'external': '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
    'arrow-down': '<path d="M12 5v14M18 13l-6 6-6-6"/>',
    'chevrons-left': '<path d="m11 7-5 5 5 5M18 7l-5 5 5 5"/>',
    'chevrons-right': '<path d="m13 7 5 5-5 5M6 7l5 5-5 5"/>',
    'command': '<path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z"/>',
    'enter': '<path d="M20 5v7a3 3 0 0 1-3 3H5M9 11l-4 4 4 4"/>',
    'log-in': '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4"/>',
    'user-plus': '<circle cx="10" cy="8" r="4"/><path d="M2.5 21c1-4 4-6 7.5-6s5 .8 6.4 2.4M19 14v6M16 17h6"/>',
    'mail-check': '<path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8"/><path d="m3 7 9 6 9-6M16 19l2 2 4-4"/>',
    'shield-check': '<path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    'fingerprint': '<path d="M12 11v3c0 2.5-.6 4.6-1.6 6.5M7.5 6.5A6 6 0 0 1 18 10v2c0 2-.2 3.8-.7 5.4M6 12v-2a6 6 0 0 1 .3-1.9M9 21c.9-2 1.4-4.3 1.4-7v-3a1.6 1.6 0 1 1 3.2 0v1M14.8 21c.3-.8.6-1.7.8-2.6M3 9a9.5 9.5 0 0 1 3.6-5.2A9.4 9.4 0 0 1 21 9"/>',
    'smartphone': '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18h2"/>',
    'monitor': '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    'image': '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    'paperclip': '<path d="m20 11.5-8.2 8.2a5 5 0 0 1-7.1-7.1l8.5-8.5a3.4 3.4 0 0 1 4.8 4.8l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4L15 7"/>',
    'send': '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
    'save': '<path d="M5 4h11l4 4v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
    'folder': '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    'tag': '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
    'sparkles': '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8zM5 3l.6 1.4L7 5l-1.4.6L5 7l-.6-1.4L3 5l1.4-.6z"/>',
    'inbox': '<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5.5 5h13L21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"/>',
    'credit-card': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/>',
    'pie-chart': '<path d="M21 12a9 9 0 1 1-9-9v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
    'trending-up': '<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>',
    'trending-down': '<path d="m3 7 6 6 4-4 8 8M15 17h6v-6"/>',
    'package': '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9M8 5.2l8 4.6"/>',
    'rocket': '<path d="M5 15c-1.5 1.3-2 4-2 6 2 0 4.7-.5 6-2M9 15l-3-3c1-4 4-8 10-9 0 0 1 1 .9 3.5-.2 3.2-2.2 6.5-7.9 8.5z"/><circle cx="14.5" cy="9.5" r="1.5"/>',
    'wifi': '<path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01"/>',
    'panel-left': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 10l-2 2 2 2"/>',
    'list': '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    'columns': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
    'loader': '<path d="M12 3v3M12 18v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M3 12h3M18 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/>',
    'circle': '<circle cx="12" cy="12" r="9"/>',
    'minimize': '<path d="M5 12h14"/>',
    'square': '<rect x="5" y="5" width="14" height="14" rx="1"/>',
    'map-pin': '<path d="M12 21s7-6.1 7-12a7 7 0 0 0-14 0c0 5.9 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    'phone': '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    'message': '<path d="M4 5h16v11H8l-4 4z"/>',
    'heart': '<path d="M12 20s-7.5-4.4-9.2-9.4A5 5 0 0 1 12 6.2a5 5 0 0 1 9.2 4.4C19.5 15.6 12 20 12 20z"/>',
    'bookmark': '<path d="M6 3h12v18l-6-4-6 4z"/>',
    'share': '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/>',
    'git-commit': '<circle cx="12" cy="12" r="3.5"/><path d="M3 12h5.5M15.5 12H21"/>',
    'bug': '<rect x="7" y="7" width="10" height="13" rx="5"/><path d="M12 11v9M7 13H3M21 13h-4M8 8 5.5 5.5M16 8l2.5-2.5M7.5 17.5 5 20M16.5 17.5 19 20M9.5 7a2.5 2.5 0 0 1 5 0"/>',
    'gauge': '<path d="M4.9 18a9 9 0 1 1 14.2 0"/><path d="m12 13 4-5"/><circle cx="12" cy="13" r="1.5"/>',
    'dollar': '<path d="M12 2.5v19M17 6.5H9.8a3 3 0 0 0 0 6h4.4a3 3 0 0 1 0 6H6.5"/>',
    'globe-lock': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>',
    'github': '<path fill="currentColor" stroke="none" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/>',
    'google': '<path fill="#4285F4" stroke="none" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" stroke="none" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" stroke="none" d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93z"/><path fill="#EA4335" stroke="none" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>',
    'microsoft': '<path fill="#F25022" stroke="none" d="M2 2h9.5v9.5H2z"/><path fill="#7FBA00" stroke="none" d="M12.5 2H22v9.5h-9.5z"/><path fill="#00A4EF" stroke="none" d="M2 12.5h9.5V22H2z"/><path fill="#FFB900" stroke="none" d="M12.5 12.5H22V22h-9.5z"/>',
    'apple': '<path fill="currentColor" stroke="none" d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.86-.76-1.47.02-2.83.86-3.59 2.17-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.24 2.73 2.2 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.83-1.23 1.18-2.42 1.2-2.48-.03-.01-2.29-.88-2.3-3.5ZM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22Z"/>',
    'discord': '<path fill="currentColor" stroke="none" d="M19.6 5.2A17.6 17.6 0 0 0 15.3 4l-.5 1.1a16.4 16.4 0 0 0-5.6 0L8.7 4a17.5 17.5 0 0 0-4.3 1.3C1.7 9.3 1 13.3 1.3 17.2a17.7 17.7 0 0 0 5.4 2.7l1.1-1.8a11.5 11.5 0 0 1-1.8-.9l.4-.3a12.6 12.6 0 0 0 11.2 0l.4.3c-.6.4-1.2.7-1.8.9l1.1 1.8a17.6 17.6 0 0 0 5.4-2.7c.4-4.5-.7-8.5-3.1-12ZM8.6 14.9c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Zm6.8 0c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Z"/>'
  };
  function sprite() {
    if (!cfg.sprite || $('#aui-sprite')) return;
    var s = '';
    for (var k in ICONS) s += '<symbol id="aui-i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>';
    d.body.insertAdjacentHTML('afterbegin', '<svg id="aui-sprite" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">' + s + '</svg>');
  }
  function icon(name, cls) { return '<svg class="aui-icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#aui-i-' + name + '"/></svg>'; }
  function addIcons(map) { for (var k in map) { ICONS[k] = map[k]; var sym = d && d.getElementById('aui-i-' + k); if (sym) sym.innerHTML = map[k]; else if (d && $('#aui-sprite')) $('#aui-sprite').insertAdjacentHTML('beforeend', '<symbol id="aui-i-' + k + '" viewBox="0 0 24 24">' + map[k] + '</symbol>'); } }

  /* ---------- Modal · drawer · bottom sheet · command palette (native <dialog>) ---------- */
  var OVERLAY_SEL = 'dialog.aui-modal, dialog.aui-drawer, dialog.aui-sheet, dialog.aui-command';
  var openStack = [];

  function prepareOverlay(el) {
    if (el._auiPrepared) return;
    el._auiPrepared = true;
    /* Mobile sheet presentation needs a drag handle — add it if the author did not */
    if (el.classList.contains('aui-modal') && !el.classList.contains('aui-modal--no-sheet') && !$(':scope > .aui-modal-handle', el)) {
      var h = d.createElement('div'); h.className = 'aui-modal-handle'; h.setAttribute('aria-hidden', 'true');
      el.insertBefore(h, el.firstChild);
    }
    if (el.classList.contains('aui-sheet') && !$(':scope > .aui-sheet-handle', el)) {
      var sh = d.createElement('div'); sh.className = 'aui-sheet-handle'; sh.setAttribute('aria-hidden', 'true');
      el.insertBefore(sh, el.firstChild);
    }
  }
  function openModal(ref, opts) {
    var el = find(ref); if (!el) return null;
    opts = opts || {};
    if (el.open && !el.classList.contains('is-closing')) return el;
    if (!emit(el, 'open', opts, true)) return el;
    prepareOverlay(el);
    el.classList.remove('is-closing');
    el._auiReturn = opts.returnFocus || d.activeElement;
    if (typeof el.showModal === 'function') { try { el.showModal(); } catch (e) { el.setAttribute('open', ''); } }
    else el.setAttribute('open', '');
    if (openStack.indexOf(el) < 0) { openStack.push(el); lockScroll(); }
    var f = $('[autofocus]', el) || (el.classList.contains('aui-command') && $('input', el));
    if (f) setTimeout(function () { f.focus(); }, 30);
    emit(el, 'opened', opts);
    return el;
  }
  function finishClose(el, value) {
    el.classList.remove('is-closing', 'is-dragging');
    el.style.transform = ''; el.style.transition = '';
    if (el.open) { if (typeof el.close === 'function') el.close(value == null ? '' : String(value)); else el.removeAttribute('open'); }
    var i = openStack.indexOf(el);
    if (i > -1) { openStack.splice(i, 1); unlockScroll(); }
    var r = el._auiReturn; el._auiReturn = null;
    if (r && r.focus && d.contains(r)) { try { r.focus({ preventScroll: true }); } catch (e) { r.focus(); } }
    emit(el, 'closed', { value: value });
    if (el._auiResolve) { var res = el._auiResolve; el._auiResolve = null; res(value); }
    if (el.hasAttribute('data-aui-temp')) setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 0);
  }
  function closeModal(ref, value) {
    var el = ref ? find(ref) : openStack[openStack.length - 1];
    if (!el || !el.open || el.classList.contains('is-closing')) return;
    if (!emit(el, 'close', { value: value }, true)) return;
    el.classList.add('is-closing');
    afterAnimation(el, function () { finishClose(el, value); }, 420);
  }
  function isSheetMode(el) {
    return el.classList.contains('aui-sheet') || (el.classList.contains('aui-modal') && !el.classList.contains('aui-modal--no-sheet') && isSheetViewport());
  }
  /* Native Escape → animated close (unless data-aui-static) */
  function onDialogCancel(e) {
    var el = e.target;
    if (!el.matches || !el.matches(OVERLAY_SEL)) return;
    e.preventDefault();
    if (!el.hasAttribute('data-aui-static')) closeModal(el, 'cancel');
  }
  /* A dialog closed by <form method="dialog"> or code → keep stack consistent */
  function onDialogClose(e) {
    var el = e.target;
    if (!el.matches || !el.matches(OVERLAY_SEL)) return;
    var i = openStack.indexOf(el);
    if (i > -1) { openStack.splice(i, 1); unlockScroll(); emit(el, 'closed', { value: el.returnValue }); if (el._auiResolve) { var r = el._auiResolve; el._auiResolve = null; r(el.returnValue); } }
  }
  function backdropClick(e) {
    var el = e.target;
    if (!el.matches || !el.matches(OVERLAY_SEL) || el.hasAttribute('data-aui-static')) return false;
    var r = el.getBoundingClientRect();
    var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside || (e.clientX === 0 && e.clientY === 0 && e.detail === 0)) { closeModal(el, 'backdrop'); return true; }
    return false;
  }

  /* Drag-to-dismiss for bottom sheets (Flutter-style) */
  var drag = null;
  function onDragStart(e) {
    var handle = e.target.closest && e.target.closest('.aui-sheet-handle, .aui-modal-handle, .aui-sheet > .aui-modal-header, .aui-modal > .aui-modal-header, .aui-menu.is-sheet');
    if (!handle) return;
    var el = handle.closest('dialog, .aui-menu.is-sheet');
    if (!el) return;
    if (el.tagName === 'DIALOG' && !isSheetMode(el)) return;
    if (handle.classList.contains('aui-menu') && handle.scrollTop > 0) return;
    if (e.target.closest('button, a, input, select, textarea, .aui-menu-item') && !e.target.closest('.aui-sheet-handle, .aui-modal-handle')) return;
    drag = { el: el, y: e.clientY, t: Date.now(), dy: 0, id: e.pointerId };
    el.classList.add('is-dragging');
  }
  function onDragMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dy = Math.max(0, e.clientY - drag.y);
    if (drag.dy > 2) { drag.el.style.transition = 'none'; drag.el.style.transform = 'translateY(' + drag.dy + 'px)'; }
  }
  function onDragEnd(e) {
    if (!drag || (e.pointerId != null && e.pointerId !== drag.id)) return;
    var g = drag; drag = null;
    var el = g.el, h = el.offsetHeight, v = g.dy / Math.max(1, Date.now() - g.t);
    el.classList.remove('is-dragging');
    if (g.dy > Math.min(140, h * .3) || (v > .6 && g.dy > 24)) {
      el.style.transition = 'transform 200ms cubic-bezier(.4,0,1,1)';
      el.style.transform = 'translateY(' + h + 'px)';
      setTimeout(function () {
        if (el.tagName === 'DIALOG') finishClose(el, 'drag');
        else { var dd = el._auiOwner || el.closest('[data-aui-dropdown]'); if (dd) closeDropdown(dd, true); el.style.transform = ''; el.style.transition = ''; }
      }, 200);
    } else if (g.dy > 0) {
      el.style.transition = 'transform 220ms cubic-bezier(.16,1,.3,1)';
      el.style.transform = '';
      setTimeout(function () { el.style.transition = ''; }, 240);
    }
  }

  /* ---------- Programmatic dialogs: confirm / prompt / alert ---------- */
  var DIALOG_ICON = { danger: 'alert', warning: 'alert', success: 'check-circle', info: 'info', accent: 'info' };
  function buildDialog(o, kind) {
    var tone = o.variant || (kind === 'confirm' && o.danger ? 'danger' : '');
    var dlg = d.createElement('dialog');
    dlg.className = 'aui-modal aui-modal--sm' + (o.className ? ' ' + o.className : '');
    dlg.setAttribute('data-aui-temp', '');
    dlg.setAttribute('aria-labelledby', (dlg.id = uid('dlg')) + '-t');
    var ic = o.icon === false ? '' : (o.icon || DIALOG_ICON[tone]);
    var html = '<div class="aui-modal-header">' +
      (ic ? '<span class="aui-icon-box aui-icon-box--round' + (tone ? ' aui-icon-box--' + tone : '') + '">' + icon(ic) + '</span>' : '') +
      '<div class="aui-modal-heading"><h2 class="aui-modal-title" id="' + dlg.id + '-t"></h2>' + (o.message ? '<p class="aui-modal-desc"></p>' : '') + '</div></div>';
    if (kind === 'prompt') {
      html += '<div class="aui-modal-body"><form class="aui-field" method="dialog">' + (o.label ? '<label class="aui-label" for="' + dlg.id + '-i"></label>' : '') +
        '<input class="aui-input" id="' + dlg.id + '-i" autofocus autocomplete="off"></form></div>';
    }
    html += '<div class="aui-modal-footer' + (kind === 'prompt' ? '' : ' aui-modal-footer--plain') + '">' +
      (kind === 'alert' ? '' : '<button type="button" class="aui-btn" data-aui-result="cancel"></button>') +
      '<button type="button" class="aui-btn ' + (tone === 'danger' ? 'aui-btn--danger' : 'aui-btn--primary') + '" data-aui-result="ok"' + (kind !== 'prompt' ? ' autofocus' : '') + '></button></div>';
    dlg.innerHTML = html;
    $('.aui-modal-title', dlg).textContent = o.title || (kind === 'confirm' ? 'Are you sure?' : kind === 'prompt' ? 'Enter a value' : 'Notice');
    if (o.message) $('.aui-modal-desc', dlg).textContent = o.message;
    if (kind === 'prompt') {
      var inp = $('input', dlg);
      if (o.label) $('label', dlg).textContent = o.label;
      if (o.placeholder) inp.placeholder = o.placeholder;
      if (o.value != null) inp.value = o.value;
      if (o.type) inp.type = o.type;
      if (o.required) inp.required = true;
    }
    var c = $('[data-aui-result="cancel"]', dlg); if (c) c.textContent = o.cancelText || 'Cancel';
    $('[data-aui-result="ok"]', dlg).textContent = o.confirmText || (kind === 'alert' ? 'OK' : kind === 'prompt' ? 'Save' : 'Confirm');
    scopeRoot().appendChild(dlg);
    return dlg;
  }
  function runDialog(kind, o) {
    o = typeof o === 'string' ? { title: o } : (o || {});
    return new Promise(function (resolve) {
      var dlg = buildDialog(o, kind);
      var input = $('input', dlg);
      function answer(ok) {
        if (kind === 'prompt') return ok ? input.value : null;
        if (kind === 'confirm') return !!ok;
        return undefined;
      }
      dlg._auiResolve = function (v) { resolve(answer(v === 'ok')); };
      on(dlg, 'click', function (e) {
        var b = e.target.closest('[data-aui-result]'); if (!b) return;
        if (b.getAttribute('data-aui-result') === 'ok' && input && input.required && !input.value) { input.classList.add('is-invalid', 'is-shake'); setTimeout(function () { input.classList.remove('is-shake'); }, 400); input.focus(); return; }
        closeModal(dlg, b.getAttribute('data-aui-result'));
      });
      if (input) on(input, 'keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); $('[data-aui-result="ok"]', dlg).click(); } });
      openModal(dlg);
    });
  }
  function confirmDialog(o) { return runDialog('confirm', o); }
  function promptDialog(o) { return runDialog('prompt', o); }
  function alertDialog(o) { return runDialog('alert', o); }

  /* ---------- Theme ---------- */
  var mqDark = w && w.matchMedia ? w.matchMedia('(prefers-color-scheme: dark)') : null;
  function themeScopes() { var s = $$('[data-aui-theme-scope]'); if (!s.length) { var b = $('body.aui') || $('.aui'); if (b) s = [b]; } return s; }
  function resolveTheme(pref) { return pref === 'system' ? (mqDark && !mqDark.matches ? 'light' : 'dark') : pref; }
  function setTheme(pref, scope) {
    pref = pref || 'dark';
    (scope ? [scope] : themeScopes()).forEach(function (s) { s.setAttribute('data-aui-theme', resolveTheme(pref)); s.setAttribute('data-aui-theme-pref', pref); });
    $$('.aui-toast-region, [data-aui-root]').forEach(function (r) { r.setAttribute('data-aui-theme', resolveTheme(pref)); });
    store('theme', pref);
    emit(d, 'theme', { theme: resolveTheme(pref), preference: pref });
  }
  function getTheme() { var s = themeScopes()[0]; return s ? (s.getAttribute('data-aui-theme') || 'dark') : 'dark'; }
  function initTheme() {
    var saved = store('theme');
    var root = themeScopes()[0];
    if (saved) setTheme(saved);
    else if (root && root.getAttribute('data-aui-theme') === 'system') setTheme('system');
    if (mqDark && mqDark.addEventListener) mqDark.addEventListener('change', function () {
      themeScopes().forEach(function (s) { if (s.getAttribute('data-aui-theme-pref') === 'system') s.setAttribute('data-aui-theme', resolveTheme('system')); });
    });
  }

  /* ---------- Floating positioning: flip + shift inside the viewport ---------- */
  function containingBlock(el) {
    for (var p = el.parentElement; p && p !== d.documentElement && p !== d.body; p = p.parentElement) {
      var cs = w.getComputedStyle(p);
      if (cs.transform !== 'none' || cs.filter !== 'none' || cs.perspective !== 'none' ||
          (cs.backdropFilter && cs.backdropFilter !== 'none') || (cs.webkitBackdropFilter && cs.webkitBackdropFilter !== 'none') ||
          /paint|layout|strict|content/.test(cs.contain || '') || /transform|filter|perspective/.test(cs.willChange || '') ||
          (cs.containerType && cs.containerType !== 'normal')) {
        var r = p.getBoundingClientRect();
        return { left: r.left + p.clientLeft, top: r.top + p.clientTop };
      }
    }
    return { left: 0, top: 0 };
  }
  function placementOf(el, fallback) {
    var p = el.getAttribute('data-aui-placement');
    if (p) return p;
    if (el.classList.contains('aui-menu--up')) return el.classList.contains('aui-menu--end') ? 'top-end' : 'top-start';
    if (el.classList.contains('aui-menu--end') || el.classList.contains('aui-popover--end')) return 'bottom-end';
    if (el.classList.contains('aui-popover--center')) return 'bottom-center';
    return fallback || 'bottom-start';
  }
  /* place(anchor, floating, 'bottom-start' | 'top-end' | 'right-start' | point {x,y}) */
  function place(anchor, el, placement, offset) {
    var m = 8, off = offset == null ? 6 : offset;
    var a = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : { left: anchor.x, right: anchor.x, top: anchor.y, bottom: anchor.y, width: 0, height: 0 };
    var parts = (placement || 'bottom-start').split('-'), side = parts[0], align = parts[1] || 'start';
    var vw = w.innerWidth, vh = w.innerHeight, fw = el.offsetWidth, fh = el.offsetHeight, top, left;
    function compute() {
      if (side === 'bottom') top = a.bottom + off;
      else if (side === 'top') top = a.top - fh - off;
      else if (side === 'right') left = a.right + off;
      else left = a.left - fw - off;
      if (side === 'top' || side === 'bottom') left = align === 'end' ? a.right - fw : align === 'center' ? a.left + a.width / 2 - fw / 2 : a.left;
      else top = align === 'end' ? a.bottom - fh : align === 'center' ? a.top + a.height / 2 - fh / 2 : a.top;
    }
    compute();
    if (side === 'bottom' && top + fh > vh - m && a.top - fh - off >= m) { side = 'top'; compute(); }
    else if (side === 'top' && top < m && a.bottom + fh + off <= vh - m) { side = 'bottom'; compute(); }
    else if (side === 'right' && left + fw > vw - m && a.left - fw - off >= m) { side = 'left'; compute(); }
    else if (side === 'left' && left < m && a.right + fw + off <= vw - m) { side = 'right'; compute(); }
    left = Math.max(m, Math.min(left, vw - fw - m));
    top = Math.max(m, Math.min(top, vh - fh - m));
    var cb = containingBlock(el);
    el.style.left = (left - cb.left) + 'px';
    el.style.top = (top - cb.top) + 'px';
    el.setAttribute('data-placement', side + '-' + align);
    var ox = side === 'left' ? 'right' : side === 'right' ? 'left' : align === 'end' ? 'right' : align === 'center' ? 'center' : 'left';
    var oy = side === 'top' ? 'bottom' : side === 'bottom' ? 'top' : 'center';
    el.style.setProperty('--_origin', oy + ' ' + ox);
    el.style.setProperty('--_ax', Math.max(12, Math.min(fw - 12, a.left + a.width / 2 - left)) + 'px');
    return { side: side, align: align, left: left, top: top };
  }
  var floating = [];
  function trackFloating(anchor, el, placement, offset) {
    untrackFloating(el);
    floating.push({ a: anchor, el: el, p: placement, o: offset });
  }
  function untrackFloating(el) { floating = floating.filter(function (f) { return f.el !== el; }); }
  var repositionQueued = false;
  function repositionAll() {
    if (repositionQueued) return;
    repositionQueued = true;
    requestAnimationFrame(function () {
      repositionQueued = false;
      floating.forEach(function (f) { if (f.el.isConnected && f.a.isConnected) place(f.a, f.el, f.p, f.o); });
    });
  }

  /* ---------- Dropdowns, menus, submenus, popovers, context menus ---------- */
  function panelOf(dd) {
    if (dd._auiPanel && dd._auiPanel.isConnected) return dd._auiPanel;
    var p = null;
    for (var i = 0; i < dd.children.length; i++) { var c = dd.children[i]; if (c.classList.contains('aui-menu') || c.classList.contains('aui-popover')) { p = c; break; } }
    if (p) { dd._auiPanel = p; p._auiOwner = dd; }
    return p;
  }
  function triggerOf(dd) {
    for (var i = 0; i < dd.children.length; i++) if (dd.children[i].matches('[data-aui-dropdown-trigger], .aui-combobox-trigger')) return dd.children[i];
    return $('[data-aui-dropdown-trigger]', dd);
  }
  function ownerOf(el) {
    var panel = el.closest && el.closest('.aui-menu, .aui-popover');
    while (panel) {
      if (panel._auiOwner) return panel._auiOwner;
      var parent = panel.parentElement && panel.parentElement.closest('.aui-menu, .aui-popover');
      if (!parent) break;
      panel = parent;
    }
    return el.closest ? el.closest('[data-aui-dropdown]') : null;
  }
  function menuItems(scope) {
    return $$('.aui-menu-item', scope).filter(function (i) {
      return !i.disabled && !i.classList.contains('is-disabled') && i.getAttribute('aria-disabled') !== 'true' && !i.hidden && i.getClientRects().length > 0;
    });
  }
  function scopedItems(scope) { return menuItems(scope).filter(function (i) { return i.closest('.aui-menu, .aui-popover, .aui-command') === scope; }); }
  function showBackdrop(root, onClose, cls) {
    var b = d.createElement('div');
    b.className = cls || 'aui-sheet-backdrop';
    b._auiClose = onClose;
    root.appendChild(b);
    return b;
  }
  function hideBackdrop(b, instant) {
    if (!b) return;
    if (instant) { if (b.parentNode) b.parentNode.removeChild(b); return; }
    b.classList.add('is-leaving');
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 200);
  }
  function useSheet(dd, panel) {
    if (!panel.classList.contains('aui-menu') || panel.classList.contains('is-static')) return false;
    var v = dd.getAttribute('data-aui-sheet');
    if (v === 'false') return false;
    if (v === 'true' || v === 'always') return true;
    return isSheetViewport();
  }
  function portal(panel, dd) {
    if (panel._auiHome) return;
    panel._auiHome = { parent: panel.parentNode, next: panel.nextSibling };
    panel._auiOwner = dd;
    scopeRoot(dd).appendChild(panel);
  }
  function unportal(panel) {
    var h = panel._auiHome; if (!h) return;
    panel._auiHome = null;
    if (h.parent && h.parent.isConnected) h.parent.insertBefore(panel, h.next && h.next.parentNode === h.parent ? h.next : null);
  }
  function openDropdown(dd) {
    var panel = panelOf(dd), tr = triggerOf(dd);
    if (!panel || dd.classList.contains('is-open') || dd.classList.contains('is-disabled')) return;
    if (!emit(dd, 'dropdown-open', {}, true)) return;
    if (dd._auiSelect) refreshSelect(dd._auiSelect);
    closeDropdowns(dd);
    dd.classList.add('is-open');
    panel.classList.add('is-open');
    if (tr) tr.setAttribute('aria-expanded', 'true');
    if (useSheet(dd, panel)) {
      portal(panel, dd);
      panel.classList.add('is-sheet');
      panel.style.left = panel.style.top = '';
      dd._auiBackdrop = showBackdrop(scopeRoot(dd), function () { closeDropdown(dd); });
      lockScroll(); dd._auiLocked = true;
    } else if (!panel.classList.contains('is-static') && dd.getAttribute('data-aui-floating') !== 'false') {
      panel.classList.add('is-floating');
      if (dd.classList.contains('aui-combobox') && tr) panel.style.minWidth = tr.offsetWidth + 'px';
      place(tr || dd, panel, placementOf(panel), panel.classList.contains('aui-popover') ? 8 : 6);
      trackFloating(tr || dd, panel, placementOf(panel), panel.classList.contains('aui-popover') ? 8 : 6);
    }
    var search = $('.aui-menu-search input, [data-aui-autofocus]', panel);
    if (search) setTimeout(function () { search.focus(); }, 20);
    emit(dd, 'dropdown-opened');
  }
  function closeDropdown(dd, instant) {
    if (!dd || !dd.classList.contains('is-open')) return;
    var panel = panelOf(dd), tr = triggerOf(dd);
    dd.classList.remove('is-open');
    if (tr) tr.setAttribute('aria-expanded', 'false');
    if (!panel) return;
    panel.classList.remove('is-open');
    untrackFloating(panel);
    $$('.aui-menu-sub.is-open', panel).forEach(function (s) { s.classList.remove('is-open'); });
    $$('.is-highlighted', panel).forEach(function (s) { s.classList.remove('is-highlighted'); });
    if (panel.classList.contains('is-sheet')) {
      hideBackdrop(dd._auiBackdrop, instant); dd._auiBackdrop = null;
      if (dd._auiLocked) { dd._auiLocked = false; unlockScroll(); }
      setTimeout(function () { if (!dd.classList.contains('is-open')) { panel.classList.remove('is-sheet'); panel.style.transform = ''; unportal(panel); } }, instant ? 0 : 300);
    } else {
      setTimeout(function () { if (!dd.classList.contains('is-open')) panel.classList.remove('is-floating'); }, 160);
    }
    emit(dd, 'dropdown-closed');
  }
  function toggleDropdown(dd) { if (dd.classList.contains('is-open')) closeDropdown(dd); else openDropdown(dd); }
  function closeDropdowns(except) {
    $$('[data-aui-dropdown].is-open').forEach(function (dd) { if (!except || (dd !== except && !dd.contains(except) && !(panelOf(dd) && panelOf(dd).contains(except)))) closeDropdown(dd); });
    $$('.aui-menu--context.is-open').forEach(function (m) { if (m !== except) { m.classList.remove('is-open'); untrackFloating(m); } });
    $$('[data-aui-popover-panel].is-open').forEach(function (p) { if (p !== except && !p.contains(except)) closePopover(p); });
  }
  /* Checkable items */
  function toggleCheckable(item) {
    var role = item.getAttribute('role');
    if (role === 'menuitemcheckbox') item.setAttribute('aria-checked', item.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
    else if (role === 'menuitemradio') {
      var group = item.closest('[role="group"]') || item.closest('.aui-menu');
      $$('[role="menuitemradio"]', group).forEach(function (r) { if (r.closest('.aui-menu') === item.closest('.aui-menu')) r.setAttribute('aria-checked', r === item ? 'true' : 'false'); });
    }
    emit(item, 'menu-check', { checked: item.getAttribute('aria-checked') === 'true', value: item.getAttribute('data-value') });
  }
  /* Menu search filter: <div class="aui-menu-search"><input></div> */
  function filterMenu(input) {
    var panel = input.closest('.aui-menu, .aui-popover, .aui-command'), q = input.value.trim().toLowerCase(), shown = 0;
    $$('.aui-menu-item', panel).forEach(function (it) {
      var text = (it.textContent + ' ' + (it.getAttribute('data-keywords') || '')).toLowerCase();
      var hit = !q || text.indexOf(q) > -1;
      it.hidden = !hit; if (hit) shown++;
      it.classList.remove('is-highlighted');
    });
    $$('.aui-menu-label, .aui-menu-sep, .aui-command-group', panel).forEach(function (el) {
      if (el.classList.contains('aui-command-group')) { el.hidden = !$$('.aui-menu-item:not([hidden])', el).length; return; }
      el.hidden = !!q;
    });
    var empty = $('.aui-menu-empty, .aui-command-empty, .aui-combobox-empty', panel);
    if (empty) empty.hidden = shown > 0;
    var first = $$('.aui-menu-item:not([hidden])', panel)[0];
    if (first && q) first.classList.add('is-highlighted');
  }
  /* Popover outside dropdowns: <button data-aui-popover="#id"> + <div class="aui-popover" id="id"> */
  function openPopover(trigger, panel) {
    closeDropdowns(panel);
    panel.setAttribute('data-aui-popover-panel', '');
    panel._auiTrigger = trigger;
    panel.classList.add('is-open', 'is-floating');
    trigger.setAttribute('aria-expanded', 'true');
    place(trigger, panel, placementOf(panel, 'bottom-center'), 10);
    trackFloating(trigger, panel, placementOf(panel, 'bottom-center'), 10);
    var f = $('[autofocus], [data-aui-autofocus]', panel); if (f) f.focus();
    emit(panel, 'popover-opened');
  }
  function closePopover(panel) {
    panel.classList.remove('is-open');
    untrackFloating(panel);
    if (panel._auiTrigger) panel._auiTrigger.setAttribute('aria-expanded', 'false');
    setTimeout(function () { if (!panel.classList.contains('is-open')) panel.classList.remove('is-floating'); }, 160);
    emit(panel, 'popover-closed');
  }
  /* Submenu flip when it would leave the viewport */
  function prepareSub(sub) {
    var m = $(':scope > .aui-menu', sub); if (!m) return;
    sub.classList.remove('is-flip');
    var r = sub.getBoundingClientRect();
    if (r.right + m.offsetWidth + 8 > w.innerWidth) sub.classList.add('is-flip');
  }
  function menuKeydown(e, t) {
    var dd = ownerOf(t), panel = dd ? panelOf(dd) : t.closest('.aui-menu--context, .aui-command');
    if (!panel) return false;
    var inSearch = t.matches('.aui-menu-search input, .aui-command-search input');
    var scope = t.closest('.aui-menu-sub > .aui-menu') || (t.closest('.aui-menu') !== panel && t.closest('.aui-menu')) || panel;
    if (inSearch) scope = panel;
    var k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Home' || k === 'End') {
      if (dd && !dd.classList.contains('is-open')) { openDropdown(dd); }
      var items = scopedItems(scope);
      if (!items.length) return true;
      e.preventDefault();
      var cur = items.indexOf(t);
      if (cur < 0) cur = items.indexOf($('.is-highlighted', scope));
      var i = k === 'Home' ? 0 : k === 'End' ? items.length - 1 : k === 'ArrowDown' ? (cur + 1) % items.length : (cur <= 0 ? items.length - 1 : cur - 1);
      items.forEach(function (x) { x.classList.remove('is-highlighted'); });
      if (inSearch) { items[i].classList.add('is-highlighted'); items[i].scrollIntoView({ block: 'nearest' }); }
      else items[i].focus();
      return true;
    }
    if (k === 'Enter' && inSearch) {
      var hl = $('.aui-menu-item.is-highlighted:not([hidden])', panel) || $$('.aui-menu-item:not([hidden])', panel)[0];
      if (hl) { e.preventDefault(); hl.click(); }
      return true;
    }
    if (k === 'ArrowRight' && t.matches('.aui-menu-sub > .aui-menu-item')) {
      e.preventDefault(); var sub = t.parentElement; prepareSub(sub); sub.classList.add('is-open');
      var first = scopedItems($(':scope > .aui-menu', sub))[0]; if (first) first.focus();
      return true;
    }
    if (k === 'ArrowLeft' && t.closest('.aui-menu-sub > .aui-menu')) {
      e.preventDefault(); var s2 = t.closest('.aui-menu-sub'); s2.classList.remove('is-open'); $(':scope > .aui-menu-item', s2).focus();
      return true;
    }
    if (k === 'Tab' && dd && dd.classList.contains('is-open') && !dd.classList.contains('aui-combobox')) { closeDropdown(dd); return false; }
    /* Typeahead */
    if (!inSearch && k.length === 1 && /\S/.test(k) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var list = scopedItems(scope);
      panel._auiTA = (panel._auiTA || '') + k.toLowerCase();
      clearTimeout(panel._auiTAT); panel._auiTAT = setTimeout(function () { panel._auiTA = ''; }, 600);
      var start = Math.max(0, list.indexOf(t) + (panel._auiTA.length === 1 ? 1 : 0));
      for (var j = 0; j < list.length; j++) {
        var it = list[(start + j) % list.length];
        if (it.textContent.trim().toLowerCase().indexOf(panel._auiTA) === 0) { it.focus(); break; }
      }
      return true;
    }
    return false;
  }

  /* ---------- Enhanced select: <select class="aui-select" data-aui-select [data-aui-search] [multiple]> ---------- */
  function enhanceSelect(sel) {
    if (sel._auiCombo || sel.closest('.aui-combobox')) return;
    var multi = sel.multiple, searchable = sel.hasAttribute('data-aui-search') || sel.options.length > 10;
    var box = d.createElement('div');
    box.className = 'aui-combobox aui-dropdown aui-dropdown--block' + (sel.classList.contains('aui-input--sm') ? ' aui-combobox--sm' : sel.classList.contains('aui-input--lg') ? ' aui-combobox--lg' : '');
    box.setAttribute('data-aui-dropdown', '');
    var tr = d.createElement('button');
    tr.type = 'button'; tr.className = 'aui-combobox-trigger'; tr.setAttribute('data-aui-dropdown-trigger', '');
    tr.setAttribute('aria-haspopup', 'listbox'); tr.setAttribute('aria-expanded', 'false');
    if (sel.id) { tr.id = sel.id + '-trigger'; var lab = $('label[for="' + sel.id + '"]'); if (lab) { lab.setAttribute('for', tr.id); tr.setAttribute('aria-labelledby', lab.id || (lab.id = uid('lbl'))); } }
    tr.innerHTML = '<span class="aui-combobox-value"></span>';
    var menu = d.createElement('div');
    menu.className = 'aui-menu aui-menu--scroll';
    menu.setAttribute('role', 'listbox');
    if (multi) menu.setAttribute('aria-multiselectable', 'true');
    menu.innerHTML = (searchable ? '<div class="aui-menu-search">' + icon('search') + '<input type="text" placeholder="' + esc(attr(sel, 'data-aui-search-placeholder', 'Search…')) + '" aria-label="Search options"></div>' : '') +
      '<div class="aui-menu-list"></div><div class="aui-combobox-empty" hidden>' + esc(attr(sel, 'data-aui-empty', 'No results')) + '</div>';
    sel.parentNode.insertBefore(box, sel);
    box.appendChild(sel); box.appendChild(tr); box.appendChild(menu);
    sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    sel._auiCombo = box; box._auiSelect = sel;
    if (sel.disabled) { box.classList.add('is-disabled'); tr.disabled = true; }
    refreshSelect(sel);
    on(sel, 'change', function () { if (!sel._auiSyncing) refreshSelect(sel); });
  }
  function refreshSelect(sel) {
    var box = sel._auiCombo; if (!box) return;
    var list = $('.aui-menu-list', box), html = '';
    toArr(sel.children).forEach(function (node) {
      if (node.tagName === 'OPTGROUP') {
        html += '<div class="aui-menu-label">' + esc(node.label) + '</div>';
        toArr(node.children).forEach(function (o) { html += optionHtml(o); });
      } else if (node.tagName === 'OPTION') html += optionHtml(node);
    });
    list.innerHTML = html;
    var val = $('.aui-combobox-value', box), selected = toArr(sel.selectedOptions || toArr(sel.options).filter(function (o) { return o.selected; })).filter(function (o) { return o.value !== '' || o.textContent.trim(); });
    var ph = attr(sel, 'data-placeholder', '');
    if (sel.multiple) {
      val.innerHTML = selected.length ? selected.map(function (o) { return '<span class="aui-chip">' + esc(o.textContent) + '</span>'; }).join('') : '<span class="aui-combobox-placeholder">' + esc(ph || 'Select…') + '</span>';
    } else {
      var o = sel.options[sel.selectedIndex];
      val.innerHTML = o && o.value !== '' ? '<span>' + esc(o.textContent) + '</span>' : '<span class="aui-combobox-placeholder">' + esc(ph || (o ? o.textContent : 'Select…')) + '</span>';
    }
  }
  function optionHtml(o) {
    if (o.value === '' && o.hasAttribute('hidden')) return '';
    var desc = o.getAttribute('data-description');
    return '<button type="button" class="aui-menu-item" role="option" data-value="' + esc(o.value) + '" aria-selected="' + (o.selected && o.value !== '' ? 'true' : 'false') + '"' + (o.disabled ? ' disabled' : '') + '>' +
      (desc ? '<span class="aui-menu-item-body"><span class="aui-menu-item-title">' + esc(o.textContent) + '</span><span class="aui-menu-item-desc">' + esc(desc) + '</span></span>' : esc(o.textContent)) + '</button>';
  }
  function pickOption(item) {
    var box = ownerOf(item), sel = box && box._auiSelect; if (!sel) return false;
    var v = item.getAttribute('data-value');
    sel._auiSyncing = true;
    if (sel.multiple) { toArr(sel.options).forEach(function (o) { if (o.value === v) o.selected = !o.selected; }); }
    else sel.value = v;
    fire(sel, 'input'); fire(sel, 'change');
    sel._auiSyncing = false;
    refreshSelect(sel);
    if (!sel.multiple) { closeDropdown(box); var tr = triggerOf(box); if (tr) tr.focus(); }
    else { var panel = panelOf(box), s = $('.aui-menu-search input', panel); if (panel.classList.contains('is-floating')) place(triggerOf(box), panel, 'bottom-start', 6); if (s) s.focus(); }
    return true;
  }

  /* ---------- Form behaviours ---------- */
  /* Password reveal: <button class="aui-input-action" data-aui-password-toggle> inside .aui-input-wrap */
  function togglePassword(btn) {
    var wrap = btn.closest('.aui-input-wrap'), input = wrap && $('input', wrap); if (!input) return;
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    wrap.classList.toggle('is-revealed', show);
    btn.setAttribute('aria-pressed', show ? 'true' : 'false');
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  }
  /* Clear button: <button class="aui-input-action" data-aui-clear> */
  function clearInput(btn) {
    var wrap = btn.closest('.aui-input-wrap'), input = wrap && $('input, textarea', wrap); if (!input) return;
    input.value = ''; fire(input, 'input'); fire(input, 'change'); input.focus();
  }
  function syncClear(input) {
    var wrap = input.closest && input.closest('.aui-input-wrap'); if (!wrap) return;
    var b = $('[data-aui-clear]', wrap); if (b) b.classList.toggle('is-visible', !!input.value);
  }
  /* Stepper: <div class="aui-stepper" data-aui-stepper><button data-aui-step="-1">…<input type="number">…<button data-aui-step="1"> */
  function stepValue(btn) {
    var box = btn.closest('[data-aui-stepper], .aui-stepper'), input = box && $('input', box); if (!input) return;
    var step = parseFloat(input.step) || 1, min = input.min !== '' ? parseFloat(input.min) : -Infinity, max = input.max !== '' ? parseFloat(input.max) : Infinity;
    var v = (parseFloat(input.value) || 0) + step * parseFloat(btn.getAttribute('data-aui-step') || 1);
    var dec = (String(step).split('.')[1] || '').length;
    v = Math.max(min, Math.min(max, +v.toFixed(dec)));
    input.value = v; fire(input, 'input'); fire(input, 'change');
    syncStepper(box);
  }
  function syncStepper(box) {
    var input = $('input', box); if (!input) return;
    var v = parseFloat(input.value);
    $$('[data-aui-step]', box).forEach(function (b) {
      var dir = parseFloat(b.getAttribute('data-aui-step'));
      b.disabled = (dir < 0 && input.min !== '' && v <= parseFloat(input.min)) || (dir > 0 && input.max !== '' && v >= parseFloat(input.max));
    });
  }
  /* OTP: <div class="aui-otp" data-aui-otp="6" data-name="code"></div> (inputs generated) */
  function initOtp(box) {
    if (box._auiOtp) return; box._auiOtp = true;
    var n = parseInt(box.getAttribute('data-aui-otp'), 10) || 6;
    var inputs = $$('input:not([type="hidden"])', box);
    if (!inputs.length) {
      var sep = box.getAttribute('data-aui-otp-sep'), html = '';
      for (var i = 0; i < n; i++) {
        if (sep && i && i % parseInt(sep, 10) === 0) html += '<span class="aui-otp-sep" aria-hidden="true"></span>';
        html += '<input type="text" inputmode="numeric" autocomplete="' + (i === 0 ? 'one-time-code' : 'off') + '" maxlength="1" placeholder=" " aria-label="Digit ' + (i + 1) + '">';
      }
      box.insertAdjacentHTML('afterbegin', html);
      inputs = $$('input:not([type="hidden"])', box);
    }
    var name = box.getAttribute('data-name'), hidden = $('input[type="hidden"]', box);
    if (name && !hidden) { hidden = d.createElement('input'); hidden.type = 'hidden'; hidden.name = name; box.appendChild(hidden); }
    var alpha = box.hasAttribute('data-aui-otp-alpha');
    function value() { return inputs.map(function (x) { return x.value; }).join(''); }
    function sync() {
      var v = value(); if (hidden) hidden.value = v;
      box.classList.remove('is-invalid');
      if (v.length === inputs.length) emit(box, 'complete', { value: v });
    }
    function fill(start, text) {
      text = text.replace(alpha ? /[^a-z0-9]/gi : /\D/g, '');
      for (var i = 0; i < text.length && start + i < inputs.length; i++) inputs[start + i].value = text[i].toUpperCase();
      var next = inputs[Math.min(inputs.length - 1, start + text.length)]; if (next) next.focus();
      sync();
    }
    inputs.forEach(function (inp, i) {
      on(inp, 'input', function () {
        if (inp.value.length > 1) { var t = inp.value; inp.value = ''; fill(i, t); return; }
        if (inp.value && !(alpha ? /[a-z0-9]/i : /\d/).test(inp.value)) { inp.value = ''; return; }
        inp.value = inp.value.toUpperCase();
        if (inp.value && inputs[i + 1]) inputs[i + 1].focus();
        sync();
      });
      on(inp, 'keydown', function (e) {
        if (e.key === 'Backspace' && !inp.value && inputs[i - 1]) { inputs[i - 1].focus(); inputs[i - 1].value = ''; sync(); e.preventDefault(); }
        else if (e.key === 'ArrowLeft' && inputs[i - 1]) { inputs[i - 1].focus(); e.preventDefault(); }
        else if (e.key === 'ArrowRight' && inputs[i + 1]) { inputs[i + 1].focus(); e.preventDefault(); }
      });
      on(inp, 'paste', function (e) { var t = (e.clipboardData || w.clipboardData).getData('text'); if (t) { e.preventDefault(); fill(i, t); } });
      on(inp, 'focus', function () { inp.select(); });
    });
  }
  /* Tags: <div class="aui-tags" data-aui-tags data-name="tags" data-value="a,b"><input placeholder="Add tag"></div> */
  function initTags(box) {
    if (box._auiTags) return; box._auiTags = true;
    var input = $('input:not([type="hidden"])', box);
    if (!input) { input = d.createElement('input'); input.type = 'text'; box.appendChild(input); }
    var name = box.getAttribute('data-name'), hidden = $('input[type="hidden"]', box);
    if (name && !hidden) { hidden = d.createElement('input'); hidden.type = 'hidden'; hidden.name = name; box.appendChild(hidden); }
    var max = parseInt(box.getAttribute('data-max'), 10) || Infinity;
    function values() { return $$('.aui-chip', box).map(function (c) { return c.getAttribute('data-value'); }); }
    function sync() { if (hidden) hidden.value = values().join(','); emit(box, 'change', { value: values() }); }
    function add(v) {
      v = String(v).trim(); if (!v || values().indexOf(v) > -1 || values().length >= max) return;
      var chip = d.createElement('span');
      chip.className = 'aui-chip'; chip.setAttribute('data-value', v);
      chip.innerHTML = '<span></span><button type="button" class="aui-chip-remove" aria-label="Remove">' + icon('x') + '</button>';
      chip.firstChild.textContent = v;
      box.insertBefore(chip, input);
    }
    box._auiAdd = function (v) { add(v); sync(); };
    (box.getAttribute('data-value') || '').split(',').forEach(add);
    sync();
    on(input, 'keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ',' || e.key === 'Tab') && input.value.trim()) { e.preventDefault(); add(input.value); input.value = ''; sync(); }
      else if (e.key === 'Backspace' && !input.value) { var last = $$('.aui-chip', box).pop(); if (last) { last.parentNode.removeChild(last); sync(); } }
    });
    on(input, 'blur', function () { if (input.value.trim()) { add(input.value); input.value = ''; sync(); } });
    on(box, 'click', function (e) {
      var rm = e.target.closest('.aui-chip-remove');
      if (rm) { var c = rm.closest('.aui-chip'); c.parentNode.removeChild(c); sync(); input.focus(); }
      else if (e.target === box) input.focus();
    });
  }
  /* Autosize textarea */
  function autosize(ta) { ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight + 2) + 'px'; }
  /* Character counter: <textarea maxlength="280" data-aui-counter> + .aui-counter in the field */
  function syncCounter(el) {
    var field = el.closest('.aui-field') || el.parentNode, c = $('.aui-counter', field);
    if (!c) { c = d.createElement('span'); c.className = 'aui-counter'; var help = $('.aui-help', field); if (help) { help.appendChild(c); } else field.appendChild(c); }
    var max = parseInt(el.getAttribute('maxlength') || el.getAttribute('data-aui-counter'), 10), n = el.value.length;
    c.textContent = max ? n + ' / ' + max : String(n);
    c.classList.toggle('is-over', !!max && n >= max);
  }
  /* Range fill + live value: <input type="range" class="aui-range"> [+ <output data-aui-range-value>] */
  function syncRange(r) {
    var min = parseFloat(r.min) || 0, max = r.max !== '' ? parseFloat(r.max) : 100, v = parseFloat(r.value);
    r.style.setProperty('--_p', ((v - min) / ((max - min) || 1) * 100) + '%');
    var scope = r.closest('.aui-range-row, .aui-field') || r.parentNode, out = $('[data-aui-range-value]', scope);
    if (out) out.textContent = (out.getAttribute('data-prefix') || '') + r.value + (out.getAttribute('data-suffix') || '');
  }
  /* File input name + dropzone list */
  function fmtBytes(b) { return b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB'; }
  function syncFile(input) {
    var files = toArr(input.files);
    var f = input.closest('.aui-file');
    if (f) { var nm = $('.aui-file-name', f); if (nm) nm.textContent = files.length ? files.map(function (x) { return x.name; }).join(', ') : (nm.getAttribute('data-empty') || 'No file chosen'); }
    var dz = input.closest('.aui-dropzone');
    if (dz) {
      var listSel = dz.getAttribute('data-aui-file-list'), list = listSel ? find(listSel) : (dz.nextElementSibling && dz.nextElementSibling.classList.contains('aui-file-list') ? dz.nextElementSibling : null);
      if (list) list.innerHTML = files.map(function (x) {
        return '<li class="aui-file-item"><span class="aui-icon-box aui-icon-box--sm">' + icon(/^image\//.test(x.type) ? 'image' : 'file') + '</span><div class="aui-file-item-body"><div class="aui-file-item-name">' + esc(x.name) + '</div><div class="aui-file-item-meta">' + fmtBytes(x.size) + '</div></div></li>';
      }).join('');
      emit(dz, 'files', { files: files });
    }
  }
  /* Password strength: <input type="password" data-aui-strength="#meter"> */
  function syncStrength(input) {
    var meter = find(input.getAttribute('data-aui-strength')); if (!meter) return;
    var v = input.value, s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v) || v.length >= 14) s++;
    meter.setAttribute('data-level', v ? Math.max(1, s) : 0);
    var label = find(meter.getAttribute('data-label-target'));
    if (label) label.textContent = ['', 'Weak', 'Fair', 'Good', 'Strong'][v ? Math.max(1, s) : 0];
  }
  function initForms(root) {
    $$self('[data-aui-otp]', root).forEach(initOtp);
    $$self('[data-aui-tags]', root).forEach(initTags);
    $$self('textarea[data-aui-autosize]', root).forEach(autosize);
    $$self('[data-aui-counter]', root).forEach(syncCounter);
    $$self('input.aui-range', root).forEach(syncRange);
    $$self('[data-aui-stepper], .aui-stepper', root).forEach(syncStepper);
    $$self('.aui-input-wrap [data-aui-clear]', root).forEach(function (b) { var i = $('input, textarea', b.closest('.aui-input-wrap')); if (i) syncClear(i); });
    $$self('select[data-aui-select]', root).forEach(enhanceSelect);
  }
  function onFormInput(e) {
    var t = e.target; if (!t || !t.matches) return;
    if (t.matches('textarea[data-aui-autosize]')) autosize(t);
    if (t.hasAttribute('data-aui-counter')) syncCounter(t);
    if (t.matches('input.aui-range')) syncRange(t);
    if (t.hasAttribute('data-aui-strength')) syncStrength(t);
    if (t.closest('.aui-input-wrap')) syncClear(t);
    if (t.matches('.aui-menu-search input, .aui-command-search input')) filterMenu(t);
    if (t.closest('.aui-stepper')) syncStepper(t.closest('.aui-stepper'));
    if (t.classList.contains('is-invalid') && t.value) { t.classList.remove('is-invalid'); t.removeAttribute('aria-invalid'); }
  }
  function onFormChange(e) {
    var t = e.target; if (!t || !t.matches) return;
    if (t.matches('input[type="file"]')) syncFile(t);
  }
  function onDrag(e) {
    var dz = e.target.closest && e.target.closest('.aui-dropzone'); if (!dz) return;
    if (e.type === 'dragenter' || e.type === 'dragover') { dz.classList.add('is-dragover'); }
    else if (e.type === 'dragleave' && !dz.contains(e.relatedTarget)) dz.classList.remove('is-dragover');
    else if (e.type === 'drop') dz.classList.remove('is-dragover');
  }

  /* ---------- Tabs: [data-aui-tabs] + [data-aui-tab="x"] + [data-aui-panel="x"] ---------- */
  var syncing = false;
  function owned(el, group) { return el.closest('[data-aui-tabs]') === group; }
  function selectTab(tab, focus) {
    var group = tab.closest('[data-aui-tabs]'); if (!group) return;
    var id = tab.getAttribute('data-aui-tab');
    $$('[data-aui-tab]', group).forEach(function (t) {
      if (!owned(t, group)) return;
      var sel = t.getAttribute('data-aui-tab') === id;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.classList.toggle('is-active', sel);
      t.tabIndex = sel ? 0 : -1;
    });
    $$('[data-aui-panel]', group).forEach(function (p) { if (owned(p, group)) p.hidden = p.getAttribute('data-aui-panel') !== id; });
    if (focus) tab.focus();
    emit(group, 'tab', { tab: id });
    var sync = group.getAttribute('data-aui-tabs-sync');
    if (sync && !syncing) {
      syncing = true;
      $$('[data-aui-tabs-sync="' + sync + '"]').forEach(function (g) { if (g === group) return; var m = $('[data-aui-tab="' + id + '"]', g); if (m) selectTab(m); });
      store('tabs-' + sync, id);
      syncing = false;
    }
  }
  function initTabs(root) {
    $$self('[data-aui-tabs]', root).forEach(function (group) {
      if (group._auiTabs) return; group._auiTabs = true;
      var tabs = $$('[data-aui-tab]', group).filter(function (t) { return owned(t, group); });
      if (!tabs.length) return;
      var list = tabs[0].parentElement; if (list && !list.getAttribute('role')) list.setAttribute('role', 'tablist');
      tabs.forEach(function (t) { t.setAttribute('role', 'tab'); });
      $$('[data-aui-panel]', group).forEach(function (p) { if (owned(p, group)) p.setAttribute('role', 'tabpanel'); });
      var sync = group.getAttribute('data-aui-tabs-sync'), saved = sync ? store('tabs-' + sync) : null;
      var pick = (saved && $('[data-aui-tab="' + saved + '"]', group)) || $('[data-aui-tab][aria-selected="true"], [data-aui-tab].is-active', group) || tabs[0];
      syncing = true; selectTab(pick); syncing = false;
    });
  }

  /* ---------- Copy ---------- */
  function legacyCopy(text) {
    var ta = d.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    d.body.appendChild(ta); ta.select();
    try { d.execCommand('copy'); } catch (e) {}
    d.body.removeChild(ta);
  }
  function copyText(text) {
    if (navigator.clipboard && w.isSecureContext) return navigator.clipboard.writeText(text).catch(function () { legacyCopy(text); });
    legacyCopy(text); return Promise.resolve();
  }
  function visible(el) { return el && !el.closest('[hidden]') && el.getClientRects().length > 0; }
  function copyFrom(btn) {
    var v = btn.getAttribute('data-aui-copy'), text = '', src = null;
    if (v && v.charAt(0) !== '#' && v.charAt(0) !== '.') text = v;
    else {
      src = v ? find(v) : null;
      if (!src) {
        var box = btn.closest('.aui-code, .aui-cli, .aui-endpoint, .aui-input-wrap, .aui-input-group, [data-aui-copy-scope]');
        if (box) src = $$('pre, .aui-cli-cmd, .aui-cli > code, .aui-endpoint-path, input, textarea, [data-aui-copy-source]', box).filter(visible)[0];
      }
      if (src) {
        if (typeof src.value === 'string') text = src.value;
        else {
          var c = src.cloneNode(true);
          $$('.aui-code-prompt, .aui-code-output, [data-aui-copy-ignore], .aui-line.is-del', c).forEach(function (n) { n.parentNode.removeChild(n); });
          text = c.textContent.replace(/\n+$/, '');
        }
      }
    }
    copyText(text).then(function () {
      btn.classList.add('is-copied');
      var label = btn.getAttribute('aria-label');
      if (label && label !== 'Copied') { btn.setAttribute('data-aui-label', label); btn.setAttribute('aria-label', 'Copied'); }
      clearTimeout(btn._auiT);
      btn._auiT = setTimeout(function () { btn.classList.remove('is-copied'); var l = btn.getAttribute('data-aui-label'); if (l) btn.setAttribute('aria-label', l); }, 1600);
      emit(btn, 'copied', { text: text });
    });
  }

  /* ---------- Toasts ---------- */
  var TOAST_ICON = { success: 'check-circle', warning: 'alert', danger: 'x-circle', info: 'info', accent: 'info', neutral: 'info' };
  function toastRegion(pos) {
    pos = pos || cfg.toastPosition;
    var region = $('.aui-toast-region[data-position="' + pos + '"]');
    if (!region) {
      region = d.createElement('div');
      region.className = 'aui aui--transparent aui-toast-region aui-toast-region--' + pos;
      region.setAttribute('data-position', pos);
      region.setAttribute('role', 'region');
      region.setAttribute('aria-label', 'Notifications');
      region.setAttribute('aria-live', 'polite');
      var scope = $('.aui[data-aui-theme]'); if (scope) region.setAttribute('data-aui-theme', scope.getAttribute('data-aui-theme'));
      var accent = $('.aui[data-aui-accent]'); if (accent) region.setAttribute('data-aui-accent', accent.getAttribute('data-aui-accent'));
      d.body.appendChild(region);
    }
    return region;
  }
  function toast(o) {
    o = typeof o === 'string' ? { title: o } : (o || {});
    var v = o.variant || 'neutral', region = toastRegion(o.position);
    var t = d.createElement('div');
    t.className = 'aui-toast aui-toast--' + v;
    t.setAttribute('role', v === 'danger' ? 'alert' : 'status');
    var lead = o.loading ? '<span class="aui-spinner aui-spinner--sm"></span>' : icon(o.icon || TOAST_ICON[v] || 'info');
    t.innerHTML = lead + '<div class="aui-toast-body"><div class="aui-toast-title"></div><div class="aui-toast-text"></div></div>' +
      '<button type="button" class="aui-close aui-close--sm" aria-label="Dismiss">' + icon('x') + '</button>';
    $('.aui-toast-title', t).textContent = o.title || '';
    var txt = $('.aui-toast-text', t);
    if (o.message) txt.textContent = o.message; else txt.parentNode.removeChild(txt);
    if (o.action) {
      var acts = d.createElement('div'); acts.className = 'aui-toast-actions';
      var b = d.createElement('button'); b.type = 'button'; b.className = 'aui-btn aui-btn--xs'; b.textContent = o.action.label || 'Undo';
      on(b, 'click', function () { if (o.action.onClick) o.action.onClick(); dismiss(t); });
      acts.appendChild(b); $('.aui-toast-body', t).appendChild(acts);
    }
    on($('.aui-close', t), 'click', function () { dismiss(t); });
    var ms = o.timeout == null ? (o.loading ? 0 : cfg.toastTimeout) : o.timeout;
    if (ms && o.progress !== false) { var bar = d.createElement('span'); bar.className = 'aui-toast-progress'; bar.style.setProperty('--_d', ms + 'ms'); t.appendChild(bar); }
    region.appendChild(t);
    if (ms) scheduleDismiss(t, ms);
    t.update = function (n) { var r = toast(Object.assign({}, o, n, { position: o.position })); dismiss(t, true); return r; };
    return t;
  }
  function scheduleDismiss(t, ms) {
    var left = ms, start = Date.now(), timer = setTimeout(function () { dismiss(t); }, left);
    on(t, 'mouseenter', function () { clearTimeout(timer); left -= Date.now() - start; });
    on(t, 'mouseleave', function () { start = Date.now(); timer = setTimeout(function () { dismiss(t); }, Math.max(800, left)); });
  }
  /* toast.promise(p, { loading, success, error }) */
  toast.promise = function (p, m) {
    m = m || {};
    var t = toast({ title: m.loading || 'Working…', loading: true, position: m.position });
    return Promise.resolve(p).then(function (r) {
      t.update({ title: typeof m.success === 'function' ? m.success(r) : (m.success || 'Done'), variant: 'success', loading: false, timeout: null });
      return r;
    }, function (err) {
      t.update({ title: typeof m.error === 'function' ? m.error(err) : (m.error || 'Something went wrong'), variant: 'danger', loading: false, timeout: null });
      throw err;
    });
  };
  function toastFrom(el) {
    toast({ title: el.getAttribute('data-aui-toast'), message: el.getAttribute('data-aui-toast-message'), variant: el.getAttribute('data-aui-toast-variant') || 'neutral', position: el.getAttribute('data-aui-toast-position') || undefined });
  }
  function dismiss(el, instant) {
    if (!el || !el.parentNode) return;
    if (instant) { el.parentNode.removeChild(el); return; }
    el.classList.add('is-leaving');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 160);
  }

  /* ---------- Nav toggles: site header, docs sidebar, app sidebar ---------- */
  function navTarget(btn) { var v = btn.getAttribute('data-aui-nav-toggle'); return v ? find(v) : btn.closest('.aui-site-header'); }
  function setNav(btn, target, open) {
    target.classList.toggle('is-open', open);
    if (open) target.setAttribute('data-aui-nav-open', ''); else target.removeAttribute('data-aui-nav-open');
    $$('[data-aui-nav-toggle]').forEach(function (b) { if (navTarget(b) === target) b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    var offcanvas = target.matches('.aui-sidebar, .aui-docs-sidebar');
    if (offcanvas) {
      if (open) { if (!target._auiBackdrop) target._auiBackdrop = showBackdrop(scopeRoot(target), function () { setNav(btn, target, false); }, 'aui-backdrop'); if (!target._auiLocked) { lockScroll(); target._auiLocked = true; } }
      else { hideBackdrop(target._auiBackdrop); target._auiBackdrop = null; if (target._auiLocked) { target._auiLocked = false; unlockScroll(); } }
    } else if (target.matches('.aui-site-header')) {
      if (open) { if (!target._auiLocked) { lockScroll(); target._auiLocked = true; } } else if (target._auiLocked) { target._auiLocked = false; unlockScroll(); }
    }
    emit(target, open ? 'nav-open' : 'nav-close');
  }
  function closeNavs(except) { $$('[data-aui-nav-open]').forEach(function (t) { if (t !== except) setNav(t, t, false); }); }

  /* ---------- Sidebar collapse (icon rail) ---------- */
  function toggleSidebar(btn) {
    var app = btn.closest('.aui-app') || $('.aui-app'); if (!app) return;
    var c = !app.classList.contains('aui-app--collapsed');
    app.classList.toggle('aui-app--collapsed', c);
    btn.setAttribute('aria-pressed', c ? 'true' : 'false');
    store('sidebar-collapsed', c ? '1' : '0');
    emit(app, 'sidebar', { collapsed: c });
  }

  /* ---------- Tables: select-all + client-side sort ---------- */
  function tableOf(el) { return el.closest('table'); }
  function syncTableSelection(table) {
    var rows = $$('[data-aui-select-row]', table), checked = rows.filter(function (r) { return r.checked; });
    rows.forEach(function (r) { var tr = r.closest('tr'); if (tr) tr.classList.toggle('is-selected', r.checked); });
    var all = $('[data-aui-select-all]', table);
    if (all) { all.checked = checked.length > 0 && checked.length === rows.length; all.indeterminate = checked.length > 0 && checked.length < rows.length; }
    var barSel = table.getAttribute('data-aui-bulkbar'), bar = barSel ? find(barSel) : null;
    if (bar) { bar.hidden = !checked.length; $$('[data-aui-selected-count]', bar).forEach(function (n) { n.textContent = checked.length; }); }
    emit(table, 'selection', { count: checked.length, rows: checked.map(function (r) { return r.closest('tr'); }) });
  }
  function sortTable(th) {
    var table = tableOf(th), tbody = table && table.tBodies[0]; if (!tbody) return;
    var idx = toArr(th.parentNode.children).indexOf(th);
    var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('th[aria-sort]', table).forEach(function (h) { h.removeAttribute('aria-sort'); });
    th.setAttribute('aria-sort', dir);
    var type = th.getAttribute('data-aui-sort');
    var rows = toArr(tbody.rows);
    function val(tr) { var c = tr.cells[idx]; if (!c) return ''; var v = c.getAttribute('data-sort-value'); return v != null ? v : c.textContent.trim(); }
    rows.sort(function (a, b) {
      var x = val(a), y = val(b), r;
      if (type === 'number' || (type !== 'text' && !isNaN(parseFloat(x)) && !isNaN(parseFloat(y)))) r = parseFloat(String(x).replace(/[^\d.-]/g, '')) - parseFloat(String(y).replace(/[^\d.-]/g, ''));
      else r = x.localeCompare(y, undefined, { numeric: true, sensitivity: 'base' });
      return dir === 'ascending' ? r : -r;
    });
    rows.forEach(function (r) { tbody.appendChild(r); });
    emit(table, 'sort', { column: idx, direction: dir });
  }

  /* ---------- "On this page" scroll-spy ---------- */
  function initToc(root) {
    $$self('[data-aui-toc]', root).forEach(function (toc) {
      if (toc._auiToc) return; toc._auiToc = true;
      var links = $$('a[href^="#"]', toc).filter(function (a) { return a.getAttribute('href').length > 1; });
      if (!links.length) return;
      var heads = links.map(function (a) { return d.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); });
      var ticking = false;
      function update() {
        ticking = false;
        var offset = Math.max((parseInt(w.getComputedStyle(toc).getPropertyValue('--aui-header-h'), 10) || 64) + 56, w.innerHeight * .3), idx = 0;
        heads.forEach(function (h, i) { if (h && h.getBoundingClientRect().top - offset <= 0) idx = i; });
        if (w.innerHeight + w.scrollY >= d.documentElement.scrollHeight - 4) idx = links.length - 1;
        links.forEach(function (a, i) { a.classList.toggle('is-active', i === idx); if (i === idx) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      }
      on(w, 'scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      update();
    });
  }
  /* Transparent site header → solid after scrolling */
  function syncHeaders() { $$('.aui-site-header--transparent').forEach(function (h) { h.classList.toggle('is-scrolled', w.scrollY > 8); }); }

  /* ---------- Code: highlight.js lazy loader (Atom One Dark via CSS) + line tools ---------- */
  var hljsPromise = null, langPromises = {};
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = d.createElement('script');
      s.src = src; s.async = true; s.crossOrigin = 'anonymous'; s.referrerPolicy = 'no-referrer';
      s.onload = function () { resolve(); }; s.onerror = function () { reject(new Error('Failed to load ' + src)); };
      d.head.appendChild(s);
    });
  }
  function loadHljs() {
    if (w.hljs) return Promise.resolve(w.hljs);
    if (!hljsPromise) hljsPromise = loadScript(cfg.highlightUrl).then(function () { return w.hljs; });
    return hljsPromise;
  }
  var LANG_ALIAS = { html: 'xml', vue: 'xml', svg: 'xml', sh: 'bash', shell: 'bash', zsh: 'bash', console: 'bash', ps: 'powershell', ps1: 'powershell', cs: 'csharp', 'c#': 'csharp', razor: 'xml', cshtml: 'xml', js: 'javascript', jsx: 'javascript', mjs: 'javascript', ts: 'typescript', tsx: 'typescript', py: 'python', rb: 'ruby', yml: 'yaml', md: 'markdown', golang: 'go', rs: 'rust', kt: 'kotlin', blade: 'php', text: 'plaintext', txt: 'plaintext', env: 'ini', toml: 'ini', jsonc: 'json', http: 'http' };
  function langOf(code) {
    var m = (code.className || '').match(/(?:^|\s)(?:language|lang)-([\w#+-]+)/) || [];
    var l = (code.getAttribute('data-aui-lang') || m[1] || '').toLowerCase();
    return LANG_ALIAS[l] || l;
  }
  function ensureLanguage(hljs, lang) {
    if (!lang || hljs.getLanguage(lang)) return Promise.resolve();
    if (!langPromises[lang]) langPromises[lang] = loadScript(cfg.highlightLanguageUrl.replace('{lang}', lang)).catch(function () {});
    return langPromises[lang];
  }
  function highlightAll(root) {
    var blocks = $$('pre > code', root).filter(function (c) {
      return !c._auiHl && !c.classList.contains('hljs') && !c.hasAttribute('data-aui-no-highlight') && langOf(c) && langOf(c) !== 'plaintext' && c.closest('.aui');
    });
    var lineBlocks = $$('pre > code', root).filter(function (c) { return !c._auiLines && needsLines(c); });
    if (!cfg.highlight || !blocks.length) { lineBlocks.forEach(applyLines); return Promise.resolve(); }
    return loadHljs().then(function (hljs) {
      if (!hljs) return;
      return Promise.all(blocks.map(function (c) {
        c._auiHl = true;
        var lang = langOf(c);
        return ensureLanguage(hljs, lang).then(function () {
          try {
            if (hljs.getLanguage(lang)) c.innerHTML = hljs.highlight(c.textContent, { language: lang, ignoreIllegals: true }).value;
            else c.innerHTML = hljs.highlightAuto(c.textContent).value;
            c.classList.add('hljs');
          } catch (e) {}
          if (needsLines(c)) applyLines(c);
        });
      }));
    }).catch(function () { lineBlocks.forEach(applyLines); });
  }
  function needsLines(code) {
    var box = code.closest('.aui-code');
    return !!(box && (box.hasAttribute('data-aui-lines') || box.classList.contains('aui-code--lines') || box.hasAttribute('data-aui-hl') || box.hasAttribute('data-aui-add') || box.hasAttribute('data-aui-del')));
  }
  function parseRanges(s) {
    var set = {};
    (s || '').split(',').forEach(function (p) {
      var m = p.trim().match(/^(\d+)(?:-(\d+))?$/); if (!m) return;
      for (var i = +m[1]; i <= +(m[2] || m[1]); i++) set[i] = true;
    });
    return set;
  }
  /* Split highlighted HTML into per-line spans, re-opening spans that cross line breaks */
  function applyLines(code) {
    if (code._auiLines) return; code._auiLines = true;
    var box = code.closest('.aui-code');
    var hl = parseRanges(box.getAttribute('data-aui-hl')), add = parseRanges(box.getAttribute('data-aui-add')), del = parseRanges(box.getAttribute('data-aui-del'));
    var html = code.innerHTML.replace(/\n$/, ''), out = [], stack = [], line = '';
    var re = /(<span[^>]*>)|(<\/span>)|(\n)|([^<\n]+|<[^>]*>)/g, m;
    while ((m = re.exec(html))) {
      if (m[1]) { stack.push(m[1]); line += m[1]; }
      else if (m[2]) { stack.pop(); line += m[2]; }
      else if (m[3]) { line += stack.map(function () { return '</span>'; }).join(''); out.push(line); line = stack.join(''); }
      else line += m[4];
    }
    out.push(line);
    code.innerHTML = out.map(function (l, i) {
      var n = i + 1, c = 'aui-line' + (hl[n] ? ' is-hl' : '') + (add[n] ? ' is-add' : '') + (del[n] ? ' is-del' : '');
      return '<span class="' + c + '">' + (l || ' ') + '</span>';
    }).join('\n');
  }

  /* ---------- Command palette: <dialog class="aui-command" data-aui-command> ---------- */
  function openCommand(ref) {
    var dlg = ref ? find(ref) : $('dialog[data-aui-command]'); if (!dlg) return;
    var input = $('.aui-command-search input', dlg);
    if (input) { input.value = ''; filterMenu(input); }
    openModal(dlg);
    var first = $$('.aui-menu-item:not([hidden])', dlg)[0];
    $$('.is-highlighted', dlg).forEach(function (x) { x.classList.remove('is-highlighted'); });
    if (first) first.classList.add('is-highlighted');
  }
  function matchHotkey(e, spec) {
    if (!spec) return false;
    var parts = spec.toLowerCase().split('+'), key = parts.pop();
    var mod = parts.indexOf('mod') > -1, ctrl = parts.indexOf('ctrl') > -1, shift = parts.indexOf('shift') > -1, alt = parts.indexOf('alt') > -1;
    if (mod && !(e.metaKey || e.ctrlKey)) return false;
    if (ctrl && !e.ctrlKey) return false;
    if (!!shift !== e.shiftKey || !!alt !== e.altKey) return false;
    return (e.key || '').toLowerCase() === key;
  }

  /* ---------- Delegated events ---------- */
  function onClick(e) {
    var t = e.target, el;
    if (!t || !t.closest) return;

    if (t.matches('.aui-sheet-backdrop, .aui-backdrop')) { if (t._auiClose) t._auiClose(); return; }
    if ((el = t.closest('[data-aui-confirm]')) && !el._auiConfirmed) {
      e.preventDefault();
      confirmDialog({ title: el.getAttribute('data-aui-confirm'), message: el.getAttribute('data-aui-confirm-message'), confirmText: el.getAttribute('data-aui-confirm-text'), variant: el.getAttribute('data-aui-confirm-variant') || 'danger' })
        .then(function (ok) { if (ok) { el._auiConfirmed = true; el.click(); el._auiConfirmed = false; } });
      return;
    }
    if ((el = t.closest('[data-aui-modal-open]'))) { e.preventDefault(); closeDropdowns(null); openModal(el.getAttribute('data-aui-modal-open'), { trigger: el }); return; }
    if ((el = t.closest('[data-aui-command-open]'))) { e.preventDefault(); openCommand(el.getAttribute('data-aui-command-open') || null); return; }
    if ((el = t.closest('[data-aui-modal-close]'))) {
      e.preventDefault();
      if (el.hasAttribute('data-aui-toast')) toastFrom(el);
      closeModal(el.closest('dialog') || el.getAttribute('data-aui-modal-close'), el.getAttribute('data-aui-value') || el.value || 'close');
      return;
    }
    if (backdropClick(e)) return;

    /* Dropdowns & menus */
    if ((el = t.closest('[data-aui-dropdown-trigger], .aui-combobox-trigger'))) {
      var dd = el.closest('[data-aui-dropdown]');
      if (dd) { e.preventDefault(); toggleDropdown(dd); return; }
    }
    if ((el = t.closest('.aui-menu-sub > .aui-menu-item'))) {
      e.preventDefault();
      var sub = el.parentElement, wasOpen = sub.classList.contains('is-open');
      $$('.aui-menu-sub.is-open', sub.parentElement).forEach(function (s) { if (s !== sub) s.classList.remove('is-open'); });
      prepareSub(sub); sub.classList.toggle('is-open', !wasOpen);
      return;
    }
    if ((el = t.closest('.aui-menu-item'))) {
      if (el.getAttribute('role') === 'option' && pickOption(el)) return;
      var host = ownerOf(el);
      var checkable = /^menuitem(checkbox|radio)$/.test(el.getAttribute('role') || '');
      if (checkable) toggleCheckable(el);
      var keep = el.hasAttribute('data-aui-keep-open') || el.getAttribute('role') === 'menuitemcheckbox';
      if (el.closest('dialog.aui-command')) { if (!el.hasAttribute('data-aui-keep-open')) closeModal(el.closest('dialog')); }
      else if (host && !keep) closeDropdown(host);
      var ctx = el.closest('.aui-menu--context'); if (ctx && !keep) { ctx.classList.remove('is-open'); untrackFloating(ctx); }
      var pop = el.closest('[data-aui-popover-panel]'); if (pop && !keep) closePopover(pop);
      emit(el, 'select', { value: el.getAttribute('data-value'), text: el.textContent.trim() });
      /* items that are also modal/toast triggers continue below */
    } else if ((el = t.closest('[data-aui-popover]'))) {
      e.preventDefault();
      var panel = find(el.getAttribute('data-aui-popover'));
      if (panel) { if (panel.classList.contains('is-open')) closePopover(panel); else openPopover(el, panel); }
      return;
    } else if (!t.closest('.aui-menu, .aui-popover, .aui-sheet-backdrop')) closeDropdowns(null);

    /* Site header mega menus (touch/click) */
    var navItem = t.closest('.aui-site-nav-item');
    if ((el = t.closest('button.aui-site-nav-link')) && navItem) {
      var was = navItem.classList.contains('is-open');
      $$('.aui-site-nav-item.is-open').forEach(function (i) { i.classList.remove('is-open'); });
      navItem.classList.toggle('is-open', !was);
      el.setAttribute('aria-expanded', !was ? 'true' : 'false');
      return;
    }
    if (!navItem) $$('.aui-site-nav-item.is-open').forEach(function (i) { i.classList.remove('is-open'); });

    if ((el = t.closest('[data-aui-nav-toggle]'))) {
      var target = navTarget(el);
      if (target) { var o = !target.classList.contains('is-open'); closeNavs(target); setNav(el, target, o); }
      return;
    }
    if (t.closest('[data-aui-nav-open] a[href]')) closeNavs(null);
    if ((el = t.closest('[data-aui-sidebar-collapse]'))) { toggleSidebar(el); return; }

    if ((el = t.closest('[data-aui-tab]'))) { if (el.tagName === 'A') e.preventDefault(); selectTab(el); return; }
    if ((el = t.closest('[data-aui-copy]'))) { e.preventDefault(); copyFrom(el); return; }
    if ((el = t.closest('[data-aui-password-toggle]'))) { e.preventDefault(); togglePassword(el); return; }
    if ((el = t.closest('[data-aui-clear]'))) { e.preventDefault(); clearInput(el); return; }
    if ((el = t.closest('[data-aui-step]'))) { e.preventDefault(); stepValue(el); return; }

    if ((el = t.closest('[data-aui-choice]'))) {
      var g = el.getAttribute('data-aui-choice-group') || 'default', val = el.getAttribute('data-aui-choice');
      $$('[data-aui-choice-group="' + g + '"]').forEach(function (b) { var sel = b.getAttribute('data-aui-choice') === val; b.setAttribute('aria-pressed', sel ? 'true' : 'false'); b.classList.toggle('is-active', sel); });
      $$('[data-aui-when^="' + g + ':"]').forEach(function (x) { x.hidden = x.getAttribute('data-aui-when') !== g + ':' + val; });
      emit(el, 'choice', { group: g, value: val });
      return;
    }
    /* Plain segmented controls & toggle groups: single selection */
    if ((el = t.closest('.aui-segmented > button, .aui-btn-group[data-aui-toggle] > .aui-btn'))) {
      toArr(el.parentNode.children).forEach(function (b) { b.classList.remove('is-active'); if (b.hasAttribute('aria-pressed') || b.tagName === 'BUTTON') b.setAttribute('aria-pressed', 'false'); });
      el.setAttribute('aria-pressed', 'true'); el.classList.add('is-active');
      emit(el, 'change', { value: el.getAttribute('data-value') || el.textContent.trim() });
      return;
    }
    if ((el = t.closest('button.aui-chip[aria-pressed]'))) { el.setAttribute('aria-pressed', el.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); return; }
    if ((el = t.closest('[data-aui-toast]'))) { toastFrom(el); return; }
    if ((el = t.closest('[data-aui-dismiss]'))) { dismiss(el.closest('.aui-alert, .aui-notice, .aui-toast, .aui-callout, .aui-announce, .aui-chip, [data-aui-dismissible]')); return; }
    if ((el = t.closest('[data-aui-theme-toggle]'))) { var cur = getTheme(); setTheme(cur === 'light' ? 'dark' : 'light'); return; }
    if ((el = t.closest('[data-aui-theme-set]'))) { setTheme(el.getAttribute('data-aui-theme-set')); return; }
    if ((el = t.closest('th[data-aui-sort]'))) { sortTable(el); return; }
  }
  function onChange(e) {
    var t = e.target; if (!t || !t.matches) return;
    onFormChange(e);
    if (t.matches('[data-aui-select-all]')) { var table = tableOf(t) || t.closest('[data-aui-selection]'); $$('[data-aui-select-row]', table).forEach(function (r) { r.checked = t.checked; }); syncTableSelection(table); }
    else if (t.matches('[data-aui-select-row]')) syncTableSelection(tableOf(t) || t.closest('[data-aui-selection]'));
  }
  function onKeydown(e) {
    var t = e.target;
    if (matchHotkey(e, cfg.commandHotkey) && $('dialog[data-aui-command]')) { e.preventDefault(); var cmd = $('dialog[data-aui-command]'); if (cmd.open) closeModal(cmd); else openCommand(); return; }
    if (e.key === 'Escape') {
      var openDD = $$('[data-aui-dropdown].is-open').pop();
      if (openDD) { closeDropdown(openDD); var tr = triggerOf(openDD); if (tr) tr.focus(); e.preventDefault(); return; }
      var pops = $$('[data-aui-popover-panel].is-open'); if (pops.length) { pops.forEach(closePopover); return; }
      closeDropdowns(null); closeNavs(null);
      $$('.aui-site-nav-item.is-open').forEach(function (i) { i.classList.remove('is-open'); });
      return;
    }
    if (!t || !t.closest) return;
    if (t.closest('[data-aui-dropdown], .aui-menu, .aui-command')) { if (menuKeydown(e, t)) return; }
    if ((e.key === 'Enter' || e.key === ' ') && t.matches('.aui-menu-item[role]:not(button):not(a)')) { e.preventDefault(); t.click(); return; }
    if (t.hasAttribute('data-aui-tab') && /^(ArrowRight|ArrowLeft|Home|End)$/.test(e.key)) {
      var group = t.closest('[data-aui-tabs]');
      var tabs = $$('[data-aui-tab]', group).filter(function (x) { return owned(x, group); });
      var k = tabs.indexOf(t);
      k = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : e.key === 'ArrowRight' ? (k + 1) % tabs.length : (k - 1 + tabs.length) % tabs.length;
      e.preventDefault(); selectTab(tabs[k], true);
    }
  }
  function onContextMenu(e) {
    var area = e.target.closest && e.target.closest('[data-aui-context-menu]'); if (!area) return;
    var menu = find(area.getAttribute('data-aui-context-menu')); if (!menu) return;
    e.preventDefault(); closeDropdowns(null);
    menu.classList.add('is-open', 'is-floating');
    place({ x: e.clientX, y: e.clientY }, menu, 'bottom-start', 2);
    menu._auiArea = area;
    emit(menu, 'context', { target: e.target });
    var first = menuItems(menu)[0]; if (first) first.focus({ preventScroll: true });
  }
  function onMouseOver(e) {
    var sub = e.target.closest && e.target.closest('.aui-menu-sub');
    if (sub && !sub._auiChecked) { sub._auiChecked = true; prepareSub(sub); setTimeout(function () { sub._auiChecked = false; }, 300); }
  }

  /* ---------- Init ---------- */
  var initialized = false, observer = null;
  function init(root) {
    if (!d || !d.body) return;
    root = root || d;
    if (!initialized) {
      initialized = true;
      sprite();
      initTheme();
      on(d, 'click', onClick);
      on(d, 'change', onChange);
      on(d, 'input', onFormInput);
      on(d, 'keydown', onKeydown);
      on(d, 'contextmenu', onContextMenu);
      on(d, 'mouseover', onMouseOver, { passive: true });
      on(d, 'cancel', onDialogCancel, true);
      on(d, 'close', onDialogClose, true);
      on(d, 'pointerdown', onDragStart);
      on(d, 'pointermove', onDragMove, { passive: true });
      on(d, 'pointerup', onDragEnd);
      on(d, 'pointercancel', onDragEnd);
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (ev) { on(d, ev, onDrag); });
      on(w, 'scroll', function () { repositionAll(); syncHeaders(); $$('.aui-menu--context.is-open').forEach(function (m) { m.classList.remove('is-open'); untrackFloating(m); }); }, { passive: true, capture: true });
      on(w, 'resize', function () { repositionAll(); $$('[data-aui-dropdown].is-open').forEach(function (dd) { var p = panelOf(dd); if (p && p.classList.contains('is-sheet') !== useSheet(dd, p)) closeDropdown(dd, true); }); }, { passive: true });
      if (store('sidebar-collapsed') === '1') $$('.aui-app[data-aui-collapsible]').forEach(function (a) { a.classList.add('aui-app--collapsed'); });
      syncHeaders();
      if (cfg.observe && w.MutationObserver) {
        var pending = [];
        observer = new MutationObserver(function (muts) {
          muts.forEach(function (m) {
            var sel = m.target && m.target.closest && m.target.closest('select'); if (sel && sel._auiCombo) { refreshSelect(sel); return; }
            toArr(m.addedNodes).forEach(function (n) { if (n.nodeType === 1 && !n.matches('#aui-sprite, .aui-toast, .aui-toast-region, .aui-sheet-backdrop, .aui-backdrop')) pending.push(n); });
          });
          if (pending._q || !pending.length) return;
          pending._q = true;
          requestAnimationFrame(function () { var list = pending.splice(0); pending._q = false; list.forEach(function (n) { if (n.isConnected) initRoot(n); }); });
        });
        observer.observe(d.body, { childList: true, subtree: true });
      }
    }
    initRoot(root);
  }
  function initRoot(root) {
    initTabs(root);
    initToc(root);
    initForms(root);
    $$self('[data-aui-dropdown-trigger]', root).forEach(function (b) { if (!b.hasAttribute('aria-haspopup')) b.setAttribute('aria-haspopup', 'menu'); if (!b.hasAttribute('aria-expanded')) b.setAttribute('aria-expanded', 'false'); });
    $$self(OVERLAY_SEL, root).forEach(prepareOverlay);
    highlightAll(root.nodeType === 9 ? d.body : root);
  }

  var ArmsysUI = {
    version: VERSION, config: cfg, icons: ICONS, addIcons: addIcons, icon: icon,
    init: init,
    /* overlays */
    openModal: openModal, closeModal: closeModal, open: openModal, close: closeModal,
    confirm: confirmDialog, prompt: promptDialog, alert: alertDialog,
    openCommand: openCommand,
    /* menus */
    openDropdown: function (r) { var e = find(r); if (e) openDropdown(e.closest('[data-aui-dropdown]') || e); },
    closeDropdown: function (r) { var e = find(r); if (e) closeDropdown(e.closest('[data-aui-dropdown]') || e); },
    closeAll: function () { closeDropdowns(null); closeNavs(null); },
    position: place,
    /* feedback */
    toast: toast, dismiss: dismiss,
    /* misc */
    selectTab: selectTab, copy: copyText, setTheme: setTheme, getTheme: getTheme,
    refreshSelect: function (r) { var s = find(r); if (s) { if (s._auiCombo) refreshSelect(s); else enhanceSelect(s); } },
    highlight: function (r) { return highlightAll(find(r) || d.body); },
    addTag: function (r, v) { var b = find(r); if (b && b._auiAdd) b._auiAdd(v); }
  };
  if (w && !w.ArmsysUI) w.ArmsysUI = ArmsysUI;
  if (d && cfg.autoInit) { if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', function () { init(); }); else init(); }

  return ArmsysUI;
});
