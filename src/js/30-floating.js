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
