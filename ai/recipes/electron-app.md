# Recipe — Electron / desktop application

Use for: Electron, Tauri and WebView2 apps that should look like the Armsys web console.
Reference implementation: `examples/desktop.html` (workbench: menubar, tool strip, rail, explorer tree, editor tabs, resizable bottom panel, status bar). Integration notes: `integrations/electron.md`. Chat clients: `ai/recipes/messenger.md`.

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

## Workbench pieces (3.0)

```html
<header class="aui-titlebar">
  <div class="aui-titlebar-title"><span class="aui-logo">…</span></div>
  <div class="aui-menubar" data-aui-menubar>…aui-dropdown[data-aui-sheet=false] > .aui-menubar-item + .aui-menu…</div>
  <div class="aui-titlebar-actions">…</div><div class="aui-window-controls">…</div>
</header>
<div class="aui-toolstrip">…28px icon buttons · .aui-toolstrip-sep · aui-segmented · search…</div>
<div class="aui-desktop-body">
  <div class="aui-resize" data-aui-resize data-aui-resize-key="main" style="flex:1;min-height:0">
    <nav class="aui-rail">…aui-rail-item…</nav>
    <aside class="aui-pane" style="width:280px"><details class="aui-panel-group" open><summary>Explorer</summary><div class="aui-panel-group-body"><ul class="aui-tree aui-tree--guides" data-aui-tree>…</ul></div></details></aside>
    <div class="aui-resize-handle" data-aui-min="200" data-aui-max="520"></div>
    <div class="aui-pane aui-grow" data-aui-tabs>
      <div class="aui-tabstrip" role="tablist">…aui-tabstrip-tab[data-aui-tab] + aui-tabstrip-close[data-aui-tab-close]…</div>
      <div class="aui-resize aui-resize--vertical aui-grow" data-aui-resize>
        <div class="aui-pane aui-grow">…data-aui-panel editors…</div>
        <div class="aui-resize-handle aui-resize-handle--grip" data-aui-min="120"></div>
        <div class="aui-pane" style="height:260px" data-aui-tabs><div class="aui-panel-header"><div class="aui-tabs aui-tabs--sm">…</div></div><div class="aui-pane-body">…aui-log…</div></div>
      </div>
    </div>
  </div>
  <div class="aui-statusbar">…aui-statusbar-item buttons…</div>
</div>
```

- Tree: `aui:tree-activate` (double-click / Enter) opens a file → add a tab (`aui-tabstrip-tab` + `data-aui-panel`) and call `ArmsysUI.selectTab(tab)`; `aui:tab-close` is cancelable for "unsaved changes" prompts (`is-modified`).
- Panel sizes persist per `data-aui-resize-key`; double-click a handle to reset.
- macOS: `data-aui-platform="mac"` pads for native traffic lights, or draw `.aui-traffic-lights` yourself for custom chrome.
