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
