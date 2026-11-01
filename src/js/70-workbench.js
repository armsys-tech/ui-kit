/* ---------- Workbench: menubar · tab strip · tree · resizable panels · calendar / date picker · composer · chat scroll ---------- */

/* Menubar: while one menu is open, hovering or arrowing to a sibling switches menus (native menubar feel) */
function menubarSwitch(trigger) {
  var bar = trigger.closest('[data-aui-menubar]'), dd = trigger.closest('[data-aui-dropdown]');
  if (!bar || !dd || dd.classList.contains('is-open')) return;
  var open = $$('[data-aui-dropdown].is-open', bar);
  if (!open.length) return;
  open.forEach(function (o) { closeDropdown(o, true); });
  openDropdown(dd);
}
function menubarArrow(e, t) {
  var bar = t.closest('[data-aui-menubar]'); if (!bar || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return false;
  if (t.closest('.aui-menu-sub > .aui-menu') || (e.key === 'ArrowRight' && t.matches('.aui-menu-sub > .aui-menu-item'))) return false;
  var dds = $$(':scope > [data-aui-dropdown]', bar), cur = t.closest('[data-aui-dropdown]'), i = dds.indexOf(cur);
  if (i < 0 || !cur.classList.contains('is-open')) return false;
  e.preventDefault();
  var next = dds[(i + (e.key === 'ArrowRight' ? 1 : dds.length - 1)) % dds.length];
  closeDropdown(cur, true); openDropdown(next);
  var first = menuItems(panelOf(next))[0]; if (first) first.focus();
  return true;
}

/* Tab strip: closable tabs on top of data-aui-tabs */
function closeTab(tab) {
  var group = tab.closest('[data-aui-tabs]'), id = tab.getAttribute('data-aui-tab');
  if (!emit(tab, 'tab-close', { tab: id }, true)) return;
  var tabs = group ? $$('[data-aui-tab]', group).filter(function (t) { return owned(t, group); }) : [];
  var i = tabs.indexOf(tab), wasActive = tab.classList.contains('is-active') || tab.getAttribute('aria-selected') === 'true';
  if (group && id) $$('[data-aui-panel="' + id + '"]', group).forEach(function (p) { p.parentNode.removeChild(p); });
  tab.parentNode.removeChild(tab);
  if (wasActive) { var n = tabs[i + 1] || tabs[i - 1]; if (n) selectTab(n, true); }
  emit(group || d, 'tab-closed', { tab: id });
}

/* Tree view: selection, expand/collapse, keyboard */
function treeRows(tree) { return $$('li[role="treeitem"]', tree).filter(function (li) { return li.getClientRects().length > 0; }); }
function treeSelect(tree, li, focus) {
  $$('li[aria-selected="true"]', tree).forEach(function (x) { if (x !== li) x.removeAttribute('aria-selected'); });
  li.setAttribute('aria-selected', 'true');
  if (!li.id) li.id = uid('tree');
  tree.setAttribute('aria-activedescendant', li.id);
  var row = $(':scope > .aui-tree-row', li); if (row) row.scrollIntoView({ block: 'nearest' });
  if (focus) tree.focus({ preventScroll: true });
  emit(li, 'tree-select', { item: li, value: li.getAttribute('data-value') });
}
function treeToggle(li, open) {
  if (!li.hasAttribute('aria-expanded')) return;
  var o = open == null ? li.getAttribute('aria-expanded') !== 'true' : open;
  li.setAttribute('aria-expanded', o ? 'true' : 'false');
  emit(li, 'tree-toggle', { item: li, expanded: o });
}
function initTree(tree) {
  if (tree._auiTree) return; tree._auiTree = true;
  if (!tree.hasAttribute('tabindex')) tree.tabIndex = 0;
  tree.setAttribute('role', 'tree');
  $$('li', tree).forEach(function (li) {
    li.setAttribute('role', 'treeitem');
    var kids = $(':scope > ul', li);
    if (kids) { kids.setAttribute('role', 'group'); if (!li.hasAttribute('aria-expanded')) li.setAttribute('aria-expanded', 'false'); }
    var row = $(':scope > .aui-tree-row', li);
    if (row && !$(':scope > .aui-tree-toggle', row)) { var tg = d.createElement('span'); tg.className = 'aui-tree-toggle'; row.insertBefore(tg, row.firstChild); }
  });
  var sel = $('li[aria-selected="true"]', tree); if (sel) { if (!sel.id) sel.id = uid('tree'); tree.setAttribute('aria-activedescendant', sel.id); }
}
function treeKeydown(e, tree) {
  var rows = treeRows(tree), cur = $('li[aria-selected="true"]', tree), i = rows.indexOf(cur), k = e.key;
  if (!rows.length) return false;
  if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Home' || k === 'End') {
    e.preventDefault();
    var n = k === 'Home' ? 0 : k === 'End' ? rows.length - 1 : k === 'ArrowDown' ? Math.min(rows.length - 1, i + 1) : Math.max(0, i - 1);
    treeSelect(tree, rows[n]); return true;
  }
  if (!cur) return false;
  if (k === 'ArrowRight') { e.preventDefault(); if (cur.getAttribute('aria-expanded') === 'false') treeToggle(cur, true); else { var c = $(':scope > ul > li', cur); if (c) treeSelect(tree, c); } return true; }
  if (k === 'ArrowLeft') { e.preventDefault(); if (cur.getAttribute('aria-expanded') === 'true') treeToggle(cur, false); else { var p = cur.parentElement.closest('li[role="treeitem"]'); if (p) treeSelect(tree, p); } return true; }
  if (k === 'Enter' || k === ' ') { e.preventDefault(); treeToggle(cur); emit(cur, 'tree-activate', { item: cur, value: cur.getAttribute('data-value') }); return true; }
  if (k === '*') { e.preventDefault(); $$('li[aria-expanded]', cur.parentElement).forEach(function (li) { li.setAttribute('aria-expanded', 'true'); }); return true; }
  return false;
}

/* Resizable panels: <div class="aui-resize" data-aui-resize [data-aui-resize-key="editor"]> pane · .aui-resize-handle · pane </div> */
var rz = null;
function resizeTarget(handle) {
  var box = handle.closest('[data-aui-resize]'); if (!box) return null;
  var prev = handle.previousElementSibling; while (prev && prev.classList.contains('aui-resize-handle')) prev = prev.previousElementSibling;
  if (!prev) return null;
  return { box: box, prev: prev, vertical: box.classList.contains('aui-resize--vertical'), handle: handle };
}
function resizeKey(t) { var k = t.box.getAttribute('data-aui-resize-key'); return k ? 'resize-' + k + '-' + toArr(t.box.children).indexOf(t.prev) : null; }
function applySize(t, px) {
  var min = parseFloat(t.handle.getAttribute('data-aui-min')) || 0, max = parseFloat(t.handle.getAttribute('data-aui-max')) || Infinity;
  var total = t.vertical ? t.box.clientHeight : t.box.clientWidth;
  px = Math.max(min, Math.min(px, max, total - 48));
  t.prev.style[t.vertical ? 'height' : 'width'] = px + 'px';
  t.prev.style.flex = '0 0 auto';
  return px;
}
function onResizeStart(e) {
  var h = e.target.closest && e.target.closest('.aui-resize-handle'); if (!h || e.button) return;
  var t = resizeTarget(h); if (!t) return;
  e.preventDefault();
  var r = t.prev.getBoundingClientRect();
  rz = { t: t, x: e.clientX, y: e.clientY, start: t.vertical ? r.height : r.width, id: e.pointerId };
  h.classList.add('is-dragging'); t.box.classList.add('is-resizing'); t.box.style.cursor = t.vertical ? 'row-resize' : 'col-resize';
  try { h.setPointerCapture(e.pointerId); } catch (x) {}
}
function onResizeMove(e) {
  if (!rz || e.pointerId !== rz.id) return;
  var dlt = rz.t.vertical ? e.clientY - rz.y : e.clientX - rz.x;
  applySize(rz.t, rz.start + dlt);
  repositionAll();
}
function onResizeEnd(e) {
  if (!rz || (e.pointerId != null && e.pointerId !== rz.id)) return;
  var t = rz.t; rz = null;
  t.handle.classList.remove('is-dragging'); t.box.classList.remove('is-resizing'); t.box.style.cursor = '';
  var key = resizeKey(t), size = parseFloat(t.prev.style[t.vertical ? 'height' : 'width']);
  if (key) store(key, String(size));
  emit(t.box, 'resize', { pane: t.prev, size: size });
}
function resetResize(h) {
  var t = resizeTarget(h); if (!t) return;
  t.prev.style.width = ''; t.prev.style.height = ''; t.prev.style.flex = '';
  var key = resizeKey(t); if (key) store(key, null);
  emit(t.box, 'resize', { pane: t.prev, size: null });
}
function initResize(box) {
  if (box._auiResize) return; box._auiResize = true;
  $$(':scope > .aui-resize-handle', box).forEach(function (h) {
    if (!h.hasAttribute('role')) { h.setAttribute('role', 'separator'); h.setAttribute('aria-orientation', box.classList.contains('aui-resize--vertical') ? 'horizontal' : 'vertical'); h.tabIndex = 0; }
    var t = resizeTarget(h), key = t && resizeKey(t), saved = key && store(key);
    if (saved) applySize(t, parseFloat(saved));
  });
}
function resizeKeydown(e, h) {
  var t = resizeTarget(h); if (!t) return false;
  var step = e.shiftKey ? 40 : 10, k = e.key, cur = t.vertical ? t.prev.offsetHeight : t.prev.offsetWidth;
  if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); applySize(t, cur - step); return true; }
  if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); applySize(t, cur + step); return true; }
  if (k === 'Enter') { e.preventDefault(); resetResize(h); return true; }
  return false;
}

/* ---------- Calendar & date picker ---------- */
function pad2(n) { return (n < 10 ? '0' : '') + n; }
function isoDate(dt) { return dt.getFullYear() + '-' + pad2(dt.getMonth() + 1) + '-' + pad2(dt.getDate()); }
function parseDate(s, fmt) {
  if (!s) return null;
  var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s); if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  m = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(s);
  if (m) return fmt && /^mm/i.test(fmt) ? new Date(+m[3], +m[1] - 1, +m[2]) : new Date(+m[3], +m[2] - 1, +m[1]);
  var t = Date.parse(s); return isNaN(t) ? null : new Date(t);
}
function formatDate(dt, fmt) {
  if (!dt) return '';
  if (!fmt) return isoDate(dt);
  return fmt.replace(/yyyy/i, dt.getFullYear()).replace(/mm/i, pad2(dt.getMonth() + 1)).replace(/dd/i, pad2(dt.getDate()));
}
function calLocale(el) { return el.getAttribute('data-aui-locale') || (el.closest('[lang]') && el.closest('[lang]').getAttribute('lang')) || undefined; }
function calState(el) {
  if (el._auiCal) return el._auiCal;
  var v = parseDate(el.getAttribute('data-value')), today = new Date();
  var view = v || today;
  el._auiCal = { value: v, y: view.getFullYear(), m: view.getMonth(), mode: 'days', min: parseDate(el.getAttribute('data-min') || el.getAttribute('min')), max: parseDate(el.getAttribute('data-max') || el.getAttribute('max')), weekStart: parseInt(el.getAttribute('data-aui-week-start') || '1', 10) };
  return el._auiCal;
}
function renderCalendar(el) {
  var s = calState(el), loc = calLocale(el), today = isoDate(new Date());
  var monthName = new Intl.DateTimeFormat(loc, { month: 'long', year: 'numeric' }).format(new Date(s.y, s.m, 1));
  var html = '<div class="aui-calendar-head">' +
    '<button type="button" class="aui-btn aui-btn--ghost aui-btn--icon" data-cal="prev" aria-label="Previous">' + icon('chevron-left') + '</button>' +
    '<div class="aui-calendar-title"><button type="button" data-cal="mode">' + esc(monthName) + '</button></div>' +
    '<button type="button" class="aui-btn aui-btn--ghost aui-btn--icon" data-cal="next" aria-label="Next">' + icon('chevron-right') + '</button></div>';
  if (s.mode === 'months') {
    html += '<div class="aui-calendar-months">';
    for (var mi = 0; mi < 12; mi++) html += '<button type="button" data-cal="month" data-m="' + mi + '" class="' + (mi === s.m ? 'is-selected' : '') + '">' + esc(new Intl.DateTimeFormat(loc, { month: 'short' }).format(new Date(2000, mi, 1))) + '</button>';
    html += '</div>';
  } else if (s.mode === 'years') {
    var y0 = s.y - (s.y % 12);
    html += '<div class="aui-calendar-years">';
    for (var yi = y0; yi < y0 + 12; yi++) html += '<button type="button" data-cal="year" data-y="' + yi + '" class="' + (yi === s.y ? 'is-selected' : '') + '">' + yi + '</button>';
    html += '</div>';
  } else {
    html += '<div class="aui-calendar-grid" role="grid">';
    var wd = new Intl.DateTimeFormat(loc, { weekday: 'short' });
    for (var i = 0; i < 7; i++) { var dow = (s.weekStart + i) % 7; html += '<div class="aui-calendar-wd" aria-hidden="true">' + esc(wd.format(new Date(2024, 0, 7 + dow)).slice(0, 2)) + '</div>'; }
    var first = new Date(s.y, s.m, 1), lead = (first.getDay() - s.weekStart + 7) % 7;
    var start = new Date(s.y, s.m, 1 - lead), sel = s.value ? isoDate(s.value) : '';
    var marks = (el.getAttribute('data-marked') || '').split(/[\s,]+/);
    for (var c = 0; c < 42; c++) {
      var dt = new Date(start.getFullYear(), start.getMonth(), start.getDate() + c), id = isoDate(dt), cls = 'aui-calendar-day';
      if (dt.getMonth() !== s.m) cls += ' is-outside';
      if (id === today) cls += ' is-today';
      if (id === sel) cls += ' is-selected';
      if (dt.getDay() === 0 || dt.getDay() === 6) cls += ' is-weekend';
      if (marks.indexOf(id) > -1) cls += ' is-marked';
      var dis = (s.min && dt < s.min) || (s.max && dt > s.max);
      html += '<button type="button" role="gridcell" class="' + cls + '" data-cal="day" data-date="' + id + '"' + (dis ? ' disabled' : '') + (id === sel ? ' aria-selected="true"' : '') + ' tabindex="' + (id === (sel || today) ? 0 : -1) + '">' + dt.getDate() + '</button>';
    }
    html += '</div>';
  }
  if (!el.hasAttribute('data-aui-no-foot')) html += '<div class="aui-calendar-foot"><button type="button" class="aui-btn aui-btn--ghost aui-btn--sm" data-cal="today">' + esc(el.getAttribute('data-aui-today-label') || 'Today') + '</button><button type="button" class="aui-btn aui-btn--ghost aui-btn--sm" data-cal="clear">' + esc(el.getAttribute('data-aui-clear-label') || 'Clear') + '</button></div>';
  el.innerHTML = html;
}
function initCalendar(el) { if (el._auiCalReady) return; el._auiCalReady = true; el.classList.add('aui-calendar'); renderCalendar(el); }
function setCalendarValue(el, dt, silent) {
  var s = calState(el); s.value = dt;
  if (dt) { s.y = dt.getFullYear(); s.m = dt.getMonth(); el.setAttribute('data-value', isoDate(dt)); } else el.removeAttribute('data-value');
  s.mode = 'days'; renderCalendar(el);
  if (!silent) emit(el, 'date', { value: dt ? isoDate(dt) : '', date: dt });
}
function calendarClick(btn) {
  var el = btn.closest('.aui-calendar'), s = calState(el), a = btn.getAttribute('data-cal');
  if (a === 'prev' || a === 'next') {
    var dir = a === 'prev' ? -1 : 1;
    if (s.mode === 'days') { s.m += dir; if (s.m < 0) { s.m = 11; s.y--; } if (s.m > 11) { s.m = 0; s.y++; } }
    else if (s.mode === 'months') s.y += dir; else s.y += dir * 12;
    renderCalendar(el);
  } else if (a === 'mode') { s.mode = s.mode === 'days' ? 'months' : s.mode === 'months' ? 'years' : 'days'; renderCalendar(el); }
  else if (a === 'month') { s.m = +btn.getAttribute('data-m'); s.mode = 'days'; renderCalendar(el); }
  else if (a === 'year') { s.y = +btn.getAttribute('data-y'); s.mode = 'months'; renderCalendar(el); }
  else if (a === 'day') setCalendarValue(el, parseDate(btn.getAttribute('data-date')));
  else if (a === 'today') setCalendarValue(el, new Date());
  else if (a === 'clear') setCalendarValue(el, null);
}
function calendarKeydown(e, btn) {
  var el = btn.closest('.aui-calendar'), s = calState(el);
  if (btn.getAttribute('data-cal') !== 'day') return false;
  var delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]; if (!delta) return false;
  e.preventDefault();
  var dt = parseDate(btn.getAttribute('data-date')); dt.setDate(dt.getDate() + delta);
  if (dt.getMonth() !== s.m) { s.m = dt.getMonth(); s.y = dt.getFullYear(); renderCalendar(el); }
  var next = $('[data-date="' + isoDate(dt) + '"]', el); if (next) next.focus();
  return true;
}
/* Date picker on text inputs */
var openPicker = null;
function openDatepicker(input) {
  if (openPicker && openPicker.input === input) return;
  closeDatepicker();
  var panel = d.createElement('div');
  panel.className = 'aui-popover aui-datepicker is-floating';
  panel.setAttribute('data-aui-popover-panel', '');
  var cal = d.createElement('div');
  ['min', 'max', 'data-min', 'data-max', 'data-aui-locale', 'data-aui-week-start', 'data-marked', 'data-aui-today-label', 'data-aui-clear-label'].forEach(function (a) { if (input.hasAttribute(a)) cal.setAttribute(a.replace(/^(min|max)$/, 'data-$1'), input.getAttribute(a)); });
  var v = parseDate(input.value, input.getAttribute('data-aui-format')); if (v) cal.setAttribute('data-value', isoDate(v));
  panel.appendChild(cal);
  scopeRoot(input).appendChild(panel);
  initCalendar(cal);
  panel._auiInput = input; panel._auiCal = cal;
  place(input, panel, 'bottom-start', 6); trackFloating(input, panel, 'bottom-start', 6);
  requestAnimationFrame(function () { panel.classList.add('is-open'); });
  openPicker = { input: input, panel: panel, cal: cal };
  input.setAttribute('aria-expanded', 'true');
  on(cal, 'aui:date', function (ev) {
    input.value = formatDate(ev.detail.date, input.getAttribute('data-aui-format'));
    fire(input, 'input'); fire(input, 'change');
    if (ev.detail.date || !ev.detail.value) closeDatepicker(true);
  });
}
function closeDatepicker(refocus) {
  if (!openPicker) return;
  var p = openPicker; openPicker = null;
  p.input.setAttribute('aria-expanded', 'false');
  untrackFloating(p.panel); p.panel.classList.remove('is-open');
  setTimeout(function () { if (p.panel.parentNode) p.panel.parentNode.removeChild(p.panel); }, 160);
  if (refocus) { p.input._auiHold = true; p.input.focus(); setTimeout(function () { p.input._auiHold = false; }, 0); }
}

/* ---------- Composer: Enter sends, Shift+Enter newline, mic ↔ send swap ---------- */
function composerInput(c) { return $('.aui-composer-input, textarea, input[type="text"]', c); }
function syncComposer(c) {
  var i = composerInput(c); if (!i) return;
  if (i.tagName === 'TEXTAREA') autosize(i);
  c.classList.toggle('is-typing', !!i.value.trim());
}
function composerSend(c) {
  var i = composerInput(c); if (!i) return;
  var text = i.value;
  if (!text.trim() && !c.classList.contains('is-typing')) { emit(c, 'send-empty'); return; }
  if (!emit(c, 'send', { text: text, input: i }, true)) return;
  i.value = ''; syncComposer(c); i.focus();
}
function composerKeydown(e, t) {
  var c = t.closest('[data-aui-composer]'); if (!c || e.key !== 'Enter' || e.isComposing) return false;
  var mode = c.getAttribute('data-aui-composer');
  var send = mode === 'ctrl' ? (e.ctrlKey || e.metaKey) : !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey;
  if (!send) return false;
  e.preventDefault(); composerSend(c); return true;
}
/* Jump-to-latest for chat bodies */
function syncChatScroll(body) {
  var gap = body.scrollHeight - body.scrollTop - body.clientHeight, jump = $('.aui-chat-jump', body.parentNode) || $('.aui-chat-jump', body);
  if (jump) jump.classList.toggle('is-visible', gap > 160);
  body._auiAtBottom = gap < 8;
}
function initChatScroll(body) {
  if (body._auiChat) return; body._auiChat = true;
  if (body.getAttribute('data-aui-chat-scroll') !== 'keep') body.scrollTop = body.scrollHeight;
  on(body, 'scroll', function () { syncChatScroll(body); }, { passive: true });
  if (w.MutationObserver) new MutationObserver(function () { if (body._auiAtBottom !== false) body.scrollTop = body.scrollHeight; syncChatScroll(body); }).observe(body, { childList: true, subtree: true });
  syncChatScroll(body);
}

function initWorkbench(root) {
  $$self('[data-aui-tree]', root).forEach(initTree);
  $$self('[data-aui-resize]', root).forEach(initResize);
  $$self('[data-aui-calendar]', root).forEach(initCalendar);
  $$self('[data-aui-datepicker]', root).forEach(function (i) { if (!i.hasAttribute('autocomplete')) i.setAttribute('autocomplete', 'off'); i.setAttribute('aria-haspopup', 'dialog'); i.setAttribute('aria-expanded', 'false'); });
  $$self('[data-aui-composer]', root).forEach(syncComposer);
  $$self('[data-aui-chat-scroll]', root).forEach(initChatScroll);
  $$self('.aui-tabstrip .aui-tabstrip-tab[data-aui-tab]:not(button):not(a)', root).forEach(function (t) { if (!t.hasAttribute('tabindex')) t.tabIndex = -1; });
}
