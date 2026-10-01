/*!
 * Armsys UI 1.0.0 — Armsys Technology
 * Tiny, dependency-free behaviours via data attributes and event delegation.
 * Safe to load once anywhere (head with defer, or end of body). No build step.
 *
 *   data-aui-modal-open="#id"        open a <dialog class="aui-modal|aui-drawer">
 *   data-aui-modal-close             close the closest dialog
 *   data-aui-dropdown                dropdown wrapper (.aui-dropdown)
 *   data-aui-dropdown-trigger        button that toggles the wrapper
 *   data-aui-context-menu="#menu"    right-click area that opens a .aui-menu--context
 *   data-aui-tabs                    tab group: [data-aui-tab="x"] + [data-aui-panel="x"]
 *   data-aui-tabs-sync="lang"        keep several tab groups in sync (language tabs)
 *   data-aui-copy[="text|#target"]   copy text, a target element, or the nearest code block
 *   data-aui-nav-toggle[="#target"]  toggle .is-open on a nav/sidebar (default: site header)
 *   data-aui-choice="v" data-aui-choice-group="g"  +  data-aui-when="g:v"
 *   data-aui-toast="Title" [data-aui-toast-message] [data-aui-toast-variant]
 *   data-aui-dismiss                 remove the closest alert / notice / toast / callout
 *   data-aui-theme-toggle            toggle light/dark on the closest .aui scope
 *   data-aui-toc                     scroll-spy for an "On this page" nav
 *
 * JS API: ArmsysUI.toast({ title, message, variant, timeout })
 *         ArmsysUI.openModal(elOrSelector) / ArmsysUI.closeModal(elOrSelector)
 */
(function () {
  'use strict';
  if (window.ArmsysUI) return;
  var d = document;

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
    'webhook': '<circle cx="6" cy="17" r="2.5"/><circle cx="18" cy="17" r="2.5"/><circle cx="12" cy="6" r="2.5"/><path d="M8.5 17h7M10.8 8.2 7.3 14.8M13.2 8.2l3.5 6.6"/>'
  };

  function sprite() {
    if (d.getElementById('aui-sprite')) return;
    var s = '';
    for (var k in ICONS) s += '<symbol id="aui-i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>';
    d.body.insertAdjacentHTML('afterbegin', '<svg id="aui-sprite" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">' + s + '</svg>');
  }

  /* ---------- Helpers ---------- */
  function find(ref, from) {
    if (!ref) return null;
    if (ref.nodeType) return ref;
    var el = d.getElementById(ref.charAt(0) === '#' ? ref.slice(1) : ref);
    if (el) return el;
    try { return (from || d).querySelector(ref); } catch (e) { return null; }
  }
  function each(sel, fn, root) { Array.prototype.forEach.call((root || d).querySelectorAll(sel), fn); }
  function icon(name, cls) { return '<svg class="aui-icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#aui-i-' + name + '"/></svg>'; }

  /* ---------- Modal & drawer (native <dialog>) ---------- */
  function openModal(ref) {
    var el = find(ref); if (!el) return;
    if (typeof el.showModal === 'function') { if (!el.open) el.showModal(); }
    else el.setAttribute('open', '');
    var f = el.querySelector('[autofocus]'); if (f) f.focus();
  }
  function closeModal(ref) {
    var el = find(ref); if (!el) return;
    if (typeof el.close === 'function') el.close(); else el.removeAttribute('open');
  }

  /* ---------- Dropdowns ---------- */
  function setDropdown(dd, open) {
    dd.classList.toggle('is-open', open);
    var tr = dd.querySelector('[data-aui-dropdown-trigger]');
    if (tr) tr.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeDropdowns(except) {
    each('[data-aui-dropdown].is-open', function (dd) { if (!except || (dd !== except && !dd.contains(except))) setDropdown(dd, false); });
    each('.aui-menu--context.is-open', function (m) { if (m !== except) m.classList.remove('is-open'); });
  }
  function menuItems(scope) {
    return Array.prototype.filter.call(scope.querySelectorAll('.aui-menu-item'), function (i) { return !i.disabled && !i.classList.contains('is-disabled'); });
  }

  /* ---------- Tabs ---------- */
  var syncing = false;
  function owned(el, group) { return el.closest('[data-aui-tabs]') === group; }
  function selectTab(tab, focus) {
    var group = tab.closest('[data-aui-tabs]'); if (!group) return;
    var id = tab.getAttribute('data-aui-tab');
    each('[data-aui-tab]', function (t) {
      if (!owned(t, group)) return;
      var on = t.getAttribute('data-aui-tab') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.classList.toggle('is-active', on);
      t.tabIndex = on ? 0 : -1;
    }, group);
    each('[data-aui-panel]', function (p) { if (owned(p, group)) p.hidden = p.getAttribute('data-aui-panel') !== id; }, group);
    if (focus) tab.focus();
    var sync = group.getAttribute('data-aui-tabs-sync');
    if (sync && !syncing) {
      syncing = true;
      each('[data-aui-tabs-sync="' + sync + '"]', function (g) {
        if (g === group) return;
        var m = g.querySelector('[data-aui-tab="' + id + '"]'); if (m) selectTab(m);
      });
      try { localStorage.setItem('aui-tabs-' + sync, id); } catch (e) {}
      syncing = false;
    }
  }
  function initTabs() {
    each('[data-aui-tabs]', function (group) {
      var tabs = Array.prototype.filter.call(group.querySelectorAll('[data-aui-tab]'), function (t) { return owned(t, group); });
      if (!tabs.length) return;
      tabs.forEach(function (t) { t.setAttribute('role', 'tab'); });
      var sync = group.getAttribute('data-aui-tabs-sync'), saved = null;
      if (sync) { try { saved = localStorage.getItem('aui-tabs-' + sync); } catch (e) {} }
      var pick = (saved && group.querySelector('[data-aui-tab="' + saved + '"]')) ||
        group.querySelector('[data-aui-tab][aria-selected="true"], [data-aui-tab].is-active') || tabs[0];
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
  function writeClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(function () { legacyCopy(text); });
    legacyCopy(text); return Promise.resolve();
  }
  function visible(el) { return el && !el.closest('[hidden]') && el.getClientRects().length > 0; }
  function copyFrom(btn) {
    var v = btn.getAttribute('data-aui-copy'), text = '', src = null;
    if (v && v.charAt(0) !== '#' && v.charAt(0) !== '.') text = v;
    else {
      src = v ? find(v) : null;
      if (!src) {
        var box = btn.closest('.aui-code, .aui-cli, .aui-endpoint, [data-aui-copy-scope]');
        if (box) src = Array.prototype.filter.call(box.querySelectorAll('pre, .aui-cli-cmd, .aui-cli > code, .aui-endpoint-path, [data-aui-copy-source]'), visible)[0];
      }
      if (src) {
        if (typeof src.value === 'string') text = src.value;
        else {
          var c = src.cloneNode(true);
          each('.aui-code-prompt, .aui-code-output, [data-aui-copy-ignore]', function (n) { n.parentNode.removeChild(n); }, c);
          text = c.textContent.replace(/\n+$/, '');
        }
      }
    }
    writeClipboard(text).then(function () {
      btn.classList.add('is-copied');
      var label = btn.getAttribute('aria-label');
      if (label && label !== 'Copied') { btn.setAttribute('data-aui-label', label); btn.setAttribute('aria-label', 'Copied'); }
      clearTimeout(btn._auiT);
      btn._auiT = setTimeout(function () {
        btn.classList.remove('is-copied');
        var l = btn.getAttribute('data-aui-label'); if (l) btn.setAttribute('aria-label', l);
      }, 1600);
    });
  }

  /* ---------- Toasts ---------- */
  var TOAST_ICON = { success: 'check-circle', warning: 'alert', danger: 'x-circle', info: 'info', accent: 'info' };
  function toast(o) {
    o = typeof o === 'string' ? { title: o } : (o || {});
    var region = d.querySelector('.aui-toast-region');
    if (!region) {
      region = d.createElement('div');
      region.className = 'aui aui--transparent aui-toast-region';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      var scope = d.querySelector('.aui[data-aui-theme]');
      if (scope) region.setAttribute('data-aui-theme', scope.getAttribute('data-aui-theme'));
      d.body.appendChild(region);
    }
    var v = o.variant || 'info';
    var t = d.createElement('div');
    t.className = 'aui-toast aui-toast--' + v;
    t.innerHTML = icon(TOAST_ICON[v] || 'info') + '<div class="aui-toast-body"><div class="aui-toast-title"></div><div class="aui-toast-text"></div></div>' +
      '<button type="button" class="aui-toast-close" aria-label="Dismiss">' + icon('x', 'aui-icon--sm') + '</button>';
    t.querySelector('.aui-toast-title').textContent = o.title || '';
    var txt = t.querySelector('.aui-toast-text');
    if (o.message) txt.textContent = o.message; else txt.parentNode.removeChild(txt);
    region.appendChild(t);
    var ms = o.timeout == null ? 4200 : o.timeout;
    if (ms) setTimeout(function () { dismiss(t); }, ms);
    return t;
  }
  function toastFrom(el) {
    toast({ title: el.getAttribute('data-aui-toast'), message: el.getAttribute('data-aui-toast-message'), variant: el.getAttribute('data-aui-toast-variant') || 'info' });
  }
  function dismiss(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('is-leaving');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 160);
  }

  /* ---------- Nav toggles (site header, docs sidebar, app sidebar) ---------- */
  function navTarget(btn) {
    var v = btn.getAttribute('data-aui-nav-toggle');
    return v ? find(v) : btn.closest('.aui-site-header');
  }
  function setNav(btn, target, open) {
    target.classList.toggle('is-open', open);
    if (open) target.setAttribute('data-aui-nav-open', ''); else target.removeAttribute('data-aui-nav-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeNavs(except) {
    each('[data-aui-nav-open]', function (t) {
      if (t === except) return;
      t.classList.remove('is-open'); t.removeAttribute('data-aui-nav-open');
      each('[data-aui-nav-toggle]', function (b) { if (navTarget(b) === t) b.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* ---------- Click delegation ---------- */
  d.addEventListener('click', function (e) {
    var t = e.target, el;
    if (!t || !t.closest) return;

    if ((el = t.closest('[data-aui-modal-open]'))) { e.preventDefault(); openModal(el.getAttribute('data-aui-modal-open')); return; }
    if ((el = t.closest('[data-aui-modal-close]'))) {
      e.preventDefault(); closeModal(el.closest('dialog') || el.getAttribute('data-aui-modal-close'));
      if (el.hasAttribute('data-aui-toast')) toastFrom(el);
      return;
    }
    if (t.matches('dialog.aui-modal, dialog.aui-drawer')) { closeModal(t); return; } /* backdrop click */

    if ((el = t.closest('[data-aui-dropdown-trigger]'))) {
      e.preventDefault();
      var dd = el.closest('[data-aui-dropdown]');
      if (dd) { var open = !dd.classList.contains('is-open'); closeDropdowns(dd); setDropdown(dd, open); }
      return;
    }
    if ((el = t.closest('.aui-menu-item'))) {
      var host = el.closest('[data-aui-dropdown]');
      if (host && !el.hasAttribute('data-aui-keep-open')) setDropdown(host, false);
      var ctx = el.closest('.aui-menu--context'); if (ctx) ctx.classList.remove('is-open');
    } else if (!t.closest('.aui-menu')) closeDropdowns(null);

    var navItem = t.closest('.aui-site-nav-item');
    if ((el = t.closest('button.aui-site-nav-link')) && navItem) {
      var was = navItem.classList.contains('is-open');
      each('.aui-site-nav-item.is-open', function (i) { i.classList.remove('is-open'); });
      navItem.classList.toggle('is-open', !was);
      el.setAttribute('aria-expanded', !was ? 'true' : 'false');
      return;
    }
    if (!navItem) each('.aui-site-nav-item.is-open', function (i) { i.classList.remove('is-open'); });

    if ((el = t.closest('[data-aui-nav-toggle]'))) {
      var target = navTarget(el);
      if (target) { var o = !target.classList.contains('is-open'); closeNavs(target); setNav(el, target, o); }
      return;
    }
    if (t.closest('[data-aui-nav-open] a[href]')) closeNavs(null);

    if ((el = t.closest('[data-aui-tab]'))) { if (el.tagName === 'A') e.preventDefault(); selectTab(el); return; }
    if ((el = t.closest('[data-aui-copy]'))) { e.preventDefault(); copyFrom(el); return; }

    if ((el = t.closest('[data-aui-choice]'))) {
      var g = el.getAttribute('data-aui-choice-group') || 'default', val = el.getAttribute('data-aui-choice');
      each('[data-aui-choice-group="' + g + '"]', function (b) {
        var on = b.getAttribute('data-aui-choice') === val;
        b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.classList.toggle('is-active', on);
      });
      each('[data-aui-when^="' + g + ':"]', function (x) { x.hidden = x.getAttribute('data-aui-when') !== g + ':' + val; });
      return;
    }
    /* Plain segmented controls & toggle button groups: single selection, visual only */
    if ((el = t.closest('.aui-segmented > button, .aui-btn-group[data-aui-toggle] > .aui-btn'))) {
      Array.prototype.forEach.call(el.parentNode.children, function (b) {
        b.classList.remove('is-active'); if (b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', 'false');
      });
      el.setAttribute('aria-pressed', 'true'); el.classList.add('is-active');
      return;
    }
    if ((el = t.closest('button.aui-chip[aria-pressed]'))) { el.setAttribute('aria-pressed', el.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); return; }

    if ((el = t.closest('[data-aui-toast]'))) { toastFrom(el); return; }
    if ((el = t.closest('.aui-toast-close'))) { dismiss(el.closest('.aui-toast')); return; }
    if ((el = t.closest('[data-aui-dismiss]'))) { dismiss(el.closest('.aui-alert, .aui-notice, .aui-toast, .aui-callout, [data-aui-dismissible]')); return; }

    if ((el = t.closest('[data-aui-theme-toggle]'))) {
      var scope = el.closest('.aui'); if (!scope) return;
      var next = scope.getAttribute('data-aui-theme') === 'light' ? 'dark' : 'light';
      scope.setAttribute('data-aui-theme', next);
      try { localStorage.setItem('aui-theme', next); } catch (err) {}
    }
  });

  /* ---------- Context menu ---------- */
  d.addEventListener('contextmenu', function (e) {
    var area = e.target.closest && e.target.closest('[data-aui-context-menu]'); if (!area) return;
    var menu = find(area.getAttribute('data-aui-context-menu')); if (!menu) return;
    e.preventDefault(); closeDropdowns(null);
    menu.classList.add('is-open');
    menu.style.left = Math.max(8, Math.min(e.clientX, window.innerWidth - menu.offsetWidth - 8)) + 'px';
    menu.style.top = Math.max(8, Math.min(e.clientY, window.innerHeight - menu.offsetHeight - 8)) + 'px';
    var first = menuItems(menu)[0]; if (first) first.focus();
  });
  window.addEventListener('scroll', function () { each('.aui-menu--context.is-open', function (m) { m.classList.remove('is-open'); }); }, { passive: true });

  /* ---------- Keyboard ---------- */
  d.addEventListener('keydown', function (e) {
    var t = e.target;
    if (e.key === 'Escape') {
      var openDD = d.querySelector('[data-aui-dropdown].is-open');
      if (openDD) { setDropdown(openDD, false); var tr = openDD.querySelector('[data-aui-dropdown-trigger]'); if (tr) tr.focus(); return; }
      closeDropdowns(null); closeNavs(null);
      each('.aui-site-nav-item.is-open', function (i) { i.classList.remove('is-open'); });
      return;
    }
    if (!t || !t.closest) return;
    var dd = t.closest('[data-aui-dropdown]'), ctxMenu = t.closest('.aui-menu--context');
    if ((dd || ctxMenu) && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      if (dd && !dd.classList.contains('is-open')) setDropdown(dd, true);
      var items = menuItems(dd || ctxMenu); if (!items.length) return;
      e.preventDefault();
      var i = items.indexOf(t);
      i = e.key === 'ArrowDown' ? (i + 1) % items.length : (i <= 0 ? items.length - 1 : i - 1);
      items[i].focus();
      return;
    }
    if (t.hasAttribute('data-aui-tab') && /^(ArrowRight|ArrowLeft|Home|End)$/.test(e.key)) {
      var group = t.closest('[data-aui-tabs]');
      var tabs = Array.prototype.filter.call(group.querySelectorAll('[data-aui-tab]'), function (x) { return owned(x, group); });
      var k = tabs.indexOf(t);
      k = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : e.key === 'ArrowRight' ? (k + 1) % tabs.length : (k - 1 + tabs.length) % tabs.length;
      e.preventDefault(); selectTab(tabs[k], true);
    }
  });

  /* ---------- "On this page" scroll-spy ---------- */
  function initToc() {
    each('[data-aui-toc]', function (toc) {
      var links = Array.prototype.filter.call(toc.querySelectorAll('a[href^="#"]'), function (a) { return a.getAttribute('href').length > 1; });
      if (!links.length) return;
      var heads = links.map(function (a) { return d.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); });
      var ticking = false;
      function update() {
        ticking = false;
        var offset = (parseInt(getComputedStyle(toc).getPropertyValue('--aui-header-h'), 10) || 60) + 48, idx = 0;
        heads.forEach(function (h, i) { if (h && h.getBoundingClientRect().top - offset <= 0) idx = i; });
        if (window.innerHeight + window.scrollY >= d.documentElement.scrollHeight - 4) idx = links.length - 1;
        links.forEach(function (a, i) {
          a.classList.toggle('is-active', i === idx);
          if (i === idx) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      }
      window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      update();
    });
  }

  /* ---------- Init ---------- */
  function init() {
    sprite();
    initTabs();
    initToc();
    each('[data-aui-dropdown-trigger]', function (b) { b.setAttribute('aria-haspopup', 'menu'); b.setAttribute('aria-expanded', 'false'); });
    try {
      var theme = localStorage.getItem('aui-theme');
      if (theme) each('[data-aui-theme-toggle]', function (b) { var s = b.closest('.aui'); if (s) s.setAttribute('data-aui-theme', theme); });
    } catch (e) {}
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();

  window.ArmsysUI = {
    version: '1.0.0', icons: ICONS, init: init,
    toast: toast, dismiss: dismiss, openModal: openModal, closeModal: closeModal, selectTab: selectTab
  };
})();
