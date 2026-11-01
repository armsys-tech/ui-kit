# Armsys UI 3

Framework-independent design system and UI library by **Armsys Technology** — one visual language for websites, documentation, admin panels, monitoring tools, embedded widgets, messengers and Electron desktop apps.

Dark-first with a full light theme, scoped to `.aui`, no runtime dependencies, no build step for consumers.

## What's new in 3.0

- **Desktop workbench.** Everything an Electron / Tauri app is built from: menubar with hover-switching menus, tool strip, activity rail, browser-style tab strip (closable, pinned, modified), tree view with keyboard navigation, resizable panels that remember their size, collapsible panel groups, property grid, status-bar items and macOS traffic lights.
- **Messaging.** A WhatsApp / Telegram style client out of the box: three-pane `.aui-chat` shell, conversation rows with unread/muted/typing states, grouped message bubbles with tails, ticks, replies, media grids, files, voice messages, link previews, polls and reactions, a composer that autosizes and sends on Enter, contact/group info pane, call stage with group grid, picture-in-picture and incoming-call banner.
- **Buttons.** Inverse and glass variants for media, toggle buttons with icon swap, stacked icon+label, round, dashed, wide, 2xl, yellow/neutral solids, corner count badges, hover-danger.
- **Date picker & calendar.** `data-aui-datepicker` on any text input; inline `data-aui-calendar`; locale, week start, min/max, marked days, month/year jump.
- **Notification center**, 40 new icons (mic, video, phone states, reply, forward, pin, undo/redo, bold/italic …), `aui-option-row` fixes.
- **Polish.** Docs sidebar pills keep their inset (text aligns with the logo without clipping), search-trigger shortcut hints hug the right edge.

Upgrading from 2.x? Nothing breaks — see [MIGRATION.md](MIGRATION.md) for the few things that changed.

## What's new in 2.0

- **One frame for every public page.** Website, docs, pricing and data pages share the same header (64 px) and container (`--aui-frame: 1440px`). Moving from the landing page to the docs no longer changes the layout.
- **Button library (2.0):** 8 variants, 8 solid tones, soft/outline/ghost + any tone, 5 sizes, icon/pill/block shapes, loading with label, counts, split buttons, toggle groups, social sign-in, FAB.
- **Input library:** affixes, clear & reveal actions, 5 sizes, validation states, input groups, searchable combobox (`data-aui-select`), OTP, tag input, stepper, range, file input & dropzone, choice cards, password strength.
- **Professional dropdowns:** viewport-aware positioning (never clipped by tables or cards), submenus, checkable items, search, typeahead, keyboard navigation, context menus, popovers.
- **Overlays like native apps:** animated modals, drawers on four sides, bottom sheets with drag-to-dismiss — every modal becomes a Flutter-style sheet on phones. Promise-based `ArmsysUI.confirm / prompt / alert`, toasts with actions and `toast.promise`, and a ⌘K command palette.
- **Auth layouts:** split screen with showcase panel — sign in, register, reset password, two-factor.
- **Code:** highlight.js loaded on demand with an **Atom One Dark** palette, code groups, line numbers, highlighted/added/removed lines.
- **Integrations:** ES module + CommonJS + TypeScript types, auto-init for markup rendered later (Vue, Blazor, Livewire, Electron), Electron title bar.
- **AI-ready:** `llms-full.txt`, a complete component catalogue, recipes and token map so assistants can build a full admin panel from the docs alone.

## Quick start

### CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@armsys-tech/ui@3.0.0/dist/armsys-ui.min.css">
<script src="https://cdn.jsdelivr.net/npm/@armsys-tech/ui@3.0.0/dist/armsys-ui.min.js" defer></script>

<body class="aui">
  <button class="aui-btn aui-btn--primary" data-aui-toast="Deployed" data-aui-toast-variant="success">Deploy</button>
</body>
```

Optional fonts (falls back to the system UI stack):

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">
```

### npm (Vue, Vite, Electron, Nuxt)

```bash
npm install @armsys-tech/ui
```

```js
import '@armsys-tech/ui/css';
import ArmsysUI from '@armsys-tech/ui';

await ArmsysUI.confirm({ title: 'Delete server?', variant: 'danger' });
ArmsysUI.toast({ title: 'Saved', variant: 'success' });
```

Framework guides: [Vue / Nuxt](integrations/vue.md) · [Electron](integrations/electron.md) · [ASP.NET Core](integrations/dotnet.md) · [Laravel](integrations/laravel.md).

## Theming

```html
<body class="aui" data-aui-theme="light|dark|system" data-aui-accent="violet|emerald|orange|rose|cyan|mono">
<div class="aui aui--dense">…</div>   <!-- tighter controls for embedded tools -->
```

Every value is a `--aui-*` custom property (see `src/tokens/tokens.css` or `ai/tokens.json`). Override them on `.aui` to re-brand.

## Examples

Open `index.html` for the component reference. Complete pages in `examples/`:

| Public web | Application | Auth | Desktop |
| --- | --- | --- | --- |
| `website.html` | `dashboard.html` | `login.html` | `desktop.html` (Electron workbench) |
| | | | `messenger.html` (chat + calls) |
| `documentation.html` | `monitoring.html` | `register.html` | `embedded-panel.html` |
| `pricing.html` | `data-table.html` | `forgot-password.html` | |
| `leaderboard.html` | `settings.html` | `two-factor.html` | |

## Project structure

```text
ui-kit/
├─ dist/            armsys-ui.css · .min.css · .js (UMD) · .min.js · .mjs (ESM) · .d.ts
├─ src/
│  ├─ tokens/       design tokens, themes, accents, density
│  ├─ base/         base, typography, prose, utilities (loaded last)
│  ├─ components/   button, forms, menu, overlay, navigation, data, table, feedback, code, picker, workbench, chat
│  ├─ layouts/      frame (shared shell), site, docs, app, auth, pricing, data-pages, desktop
│  ├─ js/           behaviour modules (concatenated into dist)
│  └─ types/        TypeScript declarations
├─ examples/        complete pages
├─ integrations/    Vue, Electron, .NET, Laravel guides
├─ ai/              components / patterns / tokens / javascript / icons catalogues + recipes
├─ scripts/build.mjs
├─ llms.txt · llms-full.txt · AI_GUIDE.md · AGENTS.md · CLAUDE.md · GEMINI.md
└─ index.html       component reference
```

## Building (maintainers)

Consumers never need a build. When you change `src/`:

```bash
npm install        # optional: esbuild for minification
npm run build      # src → dist, ai/tokens.json, ai/icons.json, llms-full.txt; verifies every aui-* class used in docs exists
npm run check      # CI: fails if dist/ is stale or a documented class is missing
```

## AI-assisted development

Point an assistant at `llms-full.txt` (single file) or `ai/index.json` (structured). Shared rules live in [AI_GUIDE.md](AI_GUIDE.md); `AGENTS.md`, `CLAUDE.md` and `GEMINI.md` point to them.

## Browser support

Evergreen browsers (Chrome/Edge 111+, Safari 16.4+, Firefox 128+) — the kit uses `color-mix()`, `:has()`, `@property` and native `<dialog>`. Electron 25+.

## License

MIT © 2026 Armsys Technology. See [LICENSE](LICENSE).
