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
