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
