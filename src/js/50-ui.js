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
