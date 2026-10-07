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
