# Changelog

## 2.0.1 — 2026-10-07

### Fixed
- Re-release of 2.0.0 under a fresh version so CDNs (jsDelivr) serve the published files instead of a cached "release not found" response.
- `ArmsysUI.version` is now injected from `package.json` at build time, so the runtime version can no longer drift from the package version.

### Changed
- All CDN snippets, AI catalogues, recipes and integration guides point to `@2.0.1`.

## 2.0.0 — 2026-10-07

### Layout
- One shared frame for public surfaces: `--aui-frame` (1440px) used by `.aui-container`, `.aui-docs` and the footer; `--aui-header-h` (64px) used by the site header, docs header, app topbar and sidebar header.
- Docs grid now lives inside the frame; sidebar link text aligns with the header logo. Mobile drawer with backdrop.
- New split authentication layout (`.aui-auth-aside` + `.aui-auth-main`), reverse and centred variants.
- New desktop shell for Electron/Tauri: `.aui-desktop`, `.aui-titlebar`, window controls.
- App shell: collapsible icon-rail sidebar (`data-aui-sidebar-collapse`), top-nav app variant, sub-nav, workspace switcher.

### Components
- Buttons: soft/link/social variants, tone combinations, xs/xl sizes, pill/block/start shapes, labelled loading, counts, dots, split buttons, vertical groups, FAB, `.aui-close`.
- Forms: 5 control sizes, filled/ghost/pill variants, affix actions (clear, reveal, copy, units, status), searchable combobox, OTP, tags, stepper, range, file/dropzone, choice cards, password strength, horizontal fields, counters, autosize.
- Menus: floating positioning with flip/shift, submenus, checkable items, search, typeahead, headers/footers, mobile bottom sheets, popovers with arrows, 4-direction tooltips.
- Overlays: animated modal/drawer (4 sides)/bottom sheet with drag-to-dismiss, modals become sheets on phones, confirm/prompt/alert API, command palette.
- Navigation: pill/enclosed/vertical tabs, radio-based segmented control, wizard steps, accordion, bulk bar, chevron breadcrumb.
- Data: ring progress, stacked progress, legends, count bubbles, avatar status, card variants, timeline icons.
- Code: highlight.js (lazy, cdnjs) with Atom One Dark tokens, code groups, line numbers, highlighted/added/removed lines, terminal dots.

### Foundations
- Non-inheriting tone system (`@property --aui-tone`), `--aui-on-{tone}` colours, accent presets (`data-aui-accent`), comfortable density, full light-theme parity, no hard-coded colours.
- Utilities moved to `utilities.css` and loaded last.

### JavaScript & tooling
- Modular sources in `src/js`, UMD + ESM builds, TypeScript declarations, MutationObserver auto-init, custom `aui:*` events.
- `scripts/build.mjs` builds dist, minifies with esbuild when available, generates `ai/tokens.json`, `ai/icons.json`, `llms-full.txt` and verifies that every documented class exists.

### AI
- `llms-full.txt`, rewritten `ai/components.json` (71 components with markup and rules), `ai/javascript.json`, recipes for admin panels, auth, docs, marketing sites and Electron apps.

## 1.0.0 — 2026-10-01
- Initial public release.
