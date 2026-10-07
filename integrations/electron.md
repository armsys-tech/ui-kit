# Armsys UI in Electron

## Main process

```js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 800, minWidth: 900, minHeight: 600,
    frame: false,                                   // custom .aui-titlebar
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    backgroundColor: '#09090b',                     // matches --aui-bg, no white flash
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true }
  });
  ipcMain.on('win', (e, action) => {
    if (action === 'min') win.minimize();
    if (action === 'max') win.isMaximized() ? win.unmaximize() : win.maximize();
    if (action === 'close') win.close();
  });
  win.loadFile('index.html');
}
app.whenReady().then(createWindow);
```

## Preload

```js
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktop', { platform: process.platform, win: (a) => ipcRenderer.send('win', a) });
```

## Renderer

```html
<body class="aui aui-desktop">
  <header class="aui-titlebar">…see examples/desktop.html…</header>
  <div class="aui-desktop-body">…</div>
  <script>
    document.body.dataset.auiPlatform = { darwin: 'mac', win32: 'win' }[window.desktop.platform] || 'linux';
    for (const [id, a] of [['win-min', 'min'], ['win-max', 'max'], ['win-close', 'close']])
      document.getElementById(id)?.addEventListener('click', () => window.desktop.win(a));
  </script>
</body>
```

## Offline & CSP

- Ship `dist/armsys-ui.min.css` / `.min.js` with the app (or import from npm with your bundler).
- Code highlighting loads highlight.js from cdnjs by default. For offline apps copy `@highlightjs/cdn-assets/highlight.min.js` (+ `languages/`) into the app and set, before the script:
  ```html
  <script>window.ArmsysUIConfig = { highlightUrl: './vendor/highlight.min.js', highlightLanguageUrl: './vendor/languages/{lang}.min.js' };</script>
  ```
  or `highlight: false`.
- Recommended CSP: `default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data:` (inline style attributes are used for `--value`, `--h` etc.).
