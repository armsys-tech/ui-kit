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
