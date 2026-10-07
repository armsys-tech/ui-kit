# Recipe — Electron / desktop application

Use for: Electron, Tauri and WebView2 apps that should look like the Armsys web console.
Reference implementation: `examples/desktop.html`. Integration notes: `integrations/electron.md`.

```html
<body class="aui aui-desktop" data-aui-platform="win"><!-- set from preload: mac | win | linux -->
  <header class="aui-titlebar">
    <div class="aui-titlebar-title"><span class="aui-logo"><svg viewBox="0 0 24 24"><use href="#aui-i-logo"/></svg></span>App name</div>
    <div class="aui-titlebar-center aui-hide-mobile"><button class="aui-search-trigger" data-aui-command-open><svg class="aui-icon"><use href="#aui-i-search"/></svg><span>Search…</span><kbd class="aui-kbd aui-kbd--sm">Ctrl K</kbd></button></div>
    <div class="aui-titlebar-actions"><button class="aui-btn aui-btn--ghost aui-btn--icon" data-aui-theme-toggle aria-label="Theme"><svg class="aui-icon"><use href="#aui-i-moon"/></svg></button></div>
    <div class="aui-window-controls">
      <button class="aui-window-control" id="win-min" aria-label="Minimize"><svg viewBox="0 0 10 10"><path d="M0 5h10"/></svg></button>
      <button class="aui-window-control" id="win-max" aria-label="Maximize"><svg viewBox="0 0 10 10"><rect x=".5" y=".5" width="9" height="9"/></svg></button>
      <button class="aui-window-control aui-window-control--close" id="win-close" aria-label="Close"><svg viewBox="0 0 10 10"><path d="m0 0 10 10M10 0 0 10"/></svg></button>
    </div>
  </header>
  <div class="aui-desktop-body">
    <div class="aui-app aui-app--collapsed">
      <aside class="aui-sidebar aui-sidebar--alt">…icon rail: aui-nav-item with data-aui-tooltip + data-aui-tooltip-pos="right"…</aside>
      <div class="aui-app-main">
        <div class="aui-tool" style="height:100%">
          <div class="aui-tool-bar">…</div>
          <div class="aui-tool-body"><div class="aui-pane">…list…</div><div class="aui-pane aui-grow">…detail…</div></div>
          <div class="aui-statusbar">…</div>
        </div>
      </div>
    </div>
  </div>
  <dialog class="aui-command" data-aui-command>…</dialog>
</body>
```

- The title bar is a drag region; interactive children are automatically `no-drag`. Use `.aui-no-drag` / `.aui-drag` for custom areas.
- Scrolling happens inside `.aui-app-main` / panes, never the window.
- `aui-desktop` makes text non-selectable except inputs, code, prose and table cells (add `.aui-selectable` elsewhere).
- Offline apps: copy `highlight.min.js` locally and set `window.ArmsysUIConfig = { highlightUrl: './vendor/highlight.min.js', highlightLanguageUrl: './vendor/languages/{lang}.min.js' }` (or `highlight: false`). Allow it in your CSP.
