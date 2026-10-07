# Migrating from Armsys UI 1.x to 2.0

2.0 is a clean break: a few class names changed, the layout frame is unified and the JavaScript grew. Most markup keeps working; this list covers everything that needs an edit.

## Load

| 1.x | 2.0 |
| --- | --- |
| `dist/armsys-ui.css`, `dist/armsys-ui.js` | same files, plus `.min.css`, `.min.js`, ESM `armsys-ui.mjs` and `armsys-ui.d.ts` |
| CDN `@1.0.0` | `@2.0.1` |
| `import "@armsys-tech/ui/dist/armsys-ui.css"` | `import '@armsys-tech/ui/css'` (old path still works) |

## Layout

| Change | What to do |
| --- | --- |
| One frame: `--aui-container` (1200) and `--aui-container-docs` (1520) are replaced by `--aui-frame` (1440) | Remove custom container widths. `.aui-container` now matches the docs grid. For an inner reading width use `.aui-container--content` (1200) or `--narrow`. |
| `.aui-site-header-inner--fluid` removed | Use `.aui-container aui-site-header-inner` everywhere; for edge-to-edge sites add `aui-site--fluid` on `<body>`. |
| Header height 60 → 64, app topbar 56 → 64 (`--aui-header-h` for both, `--aui-topbar-h` removed) | Replace `--aui-topbar-h` with `--aui-header-h`. |
| `.aui-docs` now sits inside the frame and aligns with the header | Nothing — remove any manual offsets. |
| `.aui-app--compact` | `.aui-app--collapsed` (toggle with `data-aui-sidebar-collapse`). |
| Sidebar nav accent bar is opt-in | Add `aui-nav--indicator` to `.aui-nav` to keep the left indicator. |
| Auth: `.aui-auth` is now a split layout; `.aui-auth-card/-panel/-brand/-foot` (centred card) | Use the new structure (`aui-auth-aside` + `aui-auth-main`, see `examples/login.html`), or `aui-auth aui-auth--center` + `aui-auth-card` for a single card. |

## Components

| 1.x | 2.0 |
| --- | --- |
| `.aui-modal-close`, `.aui-alert-close`, `.aui-toast-close` | `.aui-close` (renders its own × when empty) |
| `.aui-btn--danger-soft` | `.aui-btn--soft .aui-btn--danger` (any tone works with `--soft`, `--outline`, `--ghost`) |
| `.aui-timeline-marker.aui-dot--success` | `.aui-timeline-marker.aui-timeline-marker--success` |
| `.aui-code-keyword`, `.aui-code-string`, … token spans | Write plain code in `<pre><code class="language-js">` — highlight.js colours it (Atom One Dark). Hand-written spans: `.aui-tok-keyword`, `.aui-tok-string`, … |
| `.aui-pre` inside `.aui-code` | Still supported; prefer `<pre><code class="language-…">`. |
| Card radius 8 → 12 (`--aui-radius-lg`) | Nothing; nested elements inherit. |
| Tones were inherited by children | `--aui-tone` no longer inherits (registered with `@property`) — a badge inside a danger alert stays neutral. If you relied on inheritance, put the tone class on the child. |
| Hard-coded colours (`#d8434a`, rank golds, `#0a0a0c`) | Tokens: `--aui-danger-solid`, `--aui-gold/silver/bronze`, `--aui-on-{tone}`. |
| Utilities in `base.css` | Moved to `src/base/utilities.css`, loaded last — `aui-mt-*` etc. now override component margins. |

## JavaScript

| 1.x | 2.0 |
| --- | --- |
| `ArmsysUI.toast({ title, message, variant, timeout })` | Same, plus `action`, `position`, `icon`, `loading`, `toast.promise()`. Default variant is `neutral`. |
| Modals opened instantly | Enter/exit animations, scroll-lock, focus return, bottom sheet on phones, swipe-to-dismiss. Listen to `aui:closed` instead of the native `close` event if you need the close value. |
| Dropdown menus were `position:absolute` | Floating (`position:fixed`, flip/shift). If you styled menus relative to their wrapper, use `data-aui-floating="false"`. |
| `data-aui-theme-toggle` stored theme per scope | Theme applies to `body.aui` (or `[data-aui-theme-scope]`) and supports `system`; `ArmsysUI.setTheme()`. |
| New | `confirm`, `prompt`, `alert`, `openCommand`, `openDropdown`, `closeAll`, `position`, `refreshSelect`, `highlight`, `addIcons`, `init(root)` + MutationObserver auto-init. |
| New attributes | `data-aui-confirm`, `data-aui-select`, `data-aui-otp`, `data-aui-tags`, `data-aui-stepper`, `data-aui-clear`, `data-aui-password-toggle`, `data-aui-popover`, `data-aui-sidebar-collapse`, `data-aui-command(-open)`, `data-aui-sort`, `data-aui-select-all/row`, `data-aui-strength`, `data-aui-counter`, `data-aui-autosize`. |

## Quick find-and-replace

```text
aui-modal-close          → aui-close
aui-alert-close          → aui-close
aui-toast-close          → aui-close
aui-btn--danger-soft     → aui-btn--soft aui-btn--danger
aui-app--compact         → aui-app--collapsed
aui-site-header-inner--fluid → (remove)
--aui-topbar-h           → --aui-header-h
--aui-container-docs     → --aui-frame
class="aui-nav"          → class="aui-nav aui-nav--indicator"   (app sidebars)
@1.0.0                   → @2.0.1
```
