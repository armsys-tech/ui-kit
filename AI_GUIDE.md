# Armsys UI 3 — AI usage guide

Armsys UI is the default visual system for Armsys Technology web, admin, documentation and desktop (Electron) interfaces unless the user explicitly asks for another design system.

## Fast path

1. **One file:** read `llms-full.txt` — rules, tokens, every component with markup, the JS API and page recipes.
2. **Or structured:** `ai/index.json` → `ai/patterns.json` (pick the surface) → the matching `ai/recipes/*.md` → `ai/components.json` for exact class names → `ai/javascript.json` for behaviours → `ai/tokens.json` only if custom CSS is unavoidable.
3. Start from the closest page in `examples/` and keep its shell.

## Non-negotiable rules

- **Scope:** `<body class="aui">` for full pages, `<div class="aui">` for islands inside a host app. Nothing outside `.aui` is styled.
- **Classes:** only `aui-*` classes that exist in `ai/components.json`. Never invent class names; never add Bootstrap, Tailwind, MUI or another UI kit.
- **Tokens:** custom CSS (only for domain-specific layout) must use `--aui-*` tokens — no hard-coded colours, radii, shadows or spacing.
- **One frame for public pages:** website, docs, pricing, blog and data pages use the same `.aui-site-header` + `.aui-container` + `.aui-site-footer`. Do not change header height or container width per page.
- **Shells:** admin = `.aui-app`; docs = `.aui-site` + `.aui-docs`; auth = `.aui-auth` (split); Electron = `.aui-desktop` + `.aui-titlebar` (+ `.aui-menubar`, `.aui-toolstrip`, `.aui-rail`, `.aui-resize`, `.aui-tabstrip`, `.aui-tree`); messenger = `.aui-chat` inside `.aui-desktop-body`; embedded = `.aui .aui--dense` + `.aui-mini`.
- **Behaviour via attributes:** use `data-aui-*` (modals, dropdowns, tabs, copy, toasts, confirm, OTP, tags, select, sort…). Write custom JS only for app logic, and call the `ArmsysUI` API (`confirm`, `prompt`, `toast`, `openModal`) instead of re-implementing UI.
- **Overlays are native `<dialog>`** (`aui-modal`, `aui-drawer`, `aui-sheet`, `aui-command`). They become bottom sheets on phones automatically.
- **Code blocks:** plain, escaped text in `<pre><code class="language-xxx">` inside `.aui-code`. Highlighting (highlight.js, Atom One Dark) is automatic — never hand-colour spans.
- **Icons:** `<svg class="aui-icon"><use href="#aui-i-NAME"/></svg>` with names from `ai/icons.json`.

## Composition rules

- Buttons: exactly one `aui-btn--primary` per view; tone + style for quieter actions (`aui-btn aui-btn--soft aui-btn--danger`); icon-only buttons need `aria-label`; stateful buttons are `aui-btn--toggle` + `aria-pressed` (with `aui-btn-on`/`aui-btn-off` icon swap); over media use `aui-btn--glass` / `aui-btn--inverse`.
- Desktop apps: menus in `.aui-menubar[data-aui-menubar]`, actions in `.aui-toolstrip`, files in `.aui-tree[data-aui-tree]`, documents in `.aui-tabstrip` tabs, panes separated by `.aui-resize-handle` — never hand-roll splitters or tabs.
- Chat: rows are `.aui-msg--in|--out` grouped with `is-first/is-middle/is-last`; the composer is `.aui-composer[data-aui-composer]` and the app only handles `aui:send` / `aui:convo`.
- Dates: `data-aui-datepicker` on text inputs when the native picker would look different per platform.
- Tones: `--accent --success --info --warning --danger --purple --pink --orange --yellow --teal --neutral` on badges, dots, alerts, callouts, avatars, icon boxes, progress, chips, buttons.
- Status: `aui-badge aui-badge--{tone}` + `aui-dot`; live states add `is-live`.
- Forms: `aui-field` → `aui-label[for]` → control → `aui-help`; errors with `is-invalid` + `aui-help is-error`; layout with `aui-form`, `aui-form-grid`, `aui-form-actions`.
- Destructive actions: `data-aui-confirm="…"` or `await ArmsysUI.confirm({ variant: 'danger' })`, followed by a toast.
- Tables: wrap in `aui-table-wrap` (inside `aui-card aui-card--clip` for app screens); numbers in `aui-num`; row actions in a `aui-dropdown` with `aui-menu--end`.
- Empty and loading states: `aui-empty`, `aui-skeleton`, `is-loading` on buttons.
- Spacing between blocks: `aui-stack`, `aui-row`, `aui-grid--N`, `aui-gap-*`, `aui-mt-*` (utilities load last and win).
- Accessibility: semantic elements, `aria-current="page"` for active nav, labels for every control, `aria-label` on icon buttons. Behaviours already handle focus, Escape and keyboard navigation.

## Surface selection

| Request | Start from | Recipe |
| --- | --- | --- |
| Admin panel, dashboard, console, CRUD | `examples/dashboard.html`, `examples/data-table.html` | `ai/recipes/admin-panel.md` |
| Settings / profile | `examples/settings.html` | admin-panel.md §6 |
| Monitoring / logs | `examples/monitoring.html` | — |
| Login, register, reset, 2FA | `examples/login.html` … `two-factor.html` | `ai/recipes/auth.md` |
| Landing / corporate site | `examples/website.html` | `ai/recipes/marketing-site.md` |
| Docs / API reference | `examples/documentation.html` | `ai/recipes/docs-site.md` |
| Pricing | `examples/pricing.html` | marketing-site.md |
| Rankings / directories | `examples/leaderboard.html` | — |
| Electron / desktop (IDE-like, file manager, console) | `examples/desktop.html` | `ai/recipes/electron-app.md` |
| Messenger, chat, calls (WhatsApp / Telegram style) | `examples/messenger.html` | `ai/recipes/messenger.md` |
| Widget inside another app | `examples/embedded-panel.html` | — |

## Distribution

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@armsys-tech/ui@3.0.0/dist/armsys-ui.min.css">
<script src="https://cdn.jsdelivr.net/npm/@armsys-tech/ui@3.0.0/dist/armsys-ui.min.js" defer></script>
```

npm: `@armsys-tech/ui` — `import '@armsys-tech/ui/css'; import ArmsysUI from '@armsys-tech/ui';` (types included). Framework notes: `integrations/`.
