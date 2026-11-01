# Changelog

## 3.0.0 — 2026-11-01

### Workbench (desktop applications) — `src/components/workbench.css`, `src/js/70-workbench.js`
- `.aui-menubar[data-aui-menubar]`: File · Edit · View menus built from ordinary dropdowns; hovering or ←/→ switches between open menus; `<u>` mnemonics.
- `.aui-toolstrip` (28px icon buttons, separators, labels; `--plain`, `--floating`, `--vertical`).
- `.aui-rail` activity bar with `.aui-rail-item` and corner `.aui-btn-badge`.
- `.aui-tabstrip` editor/browser tabs on top of `data-aui-tabs`: `data-aui-tab-close` (cancelable `aui:tab-close`, middle-click, Delete), `data-aui-tab-add`, `is-modified`, `is-pinned`, `--chrome`, `--pills`, `ArmsysUI.closeTab()`.
- `.aui-tree[data-aui-tree]`: nested lists with chevrons, guides, selection, hover actions, badges, checkboxes; full keyboard navigation; `aui:tree-select / tree-toggle / tree-activate`; `ArmsysUI.treeSelect / treeToggle`.
- `.aui-resize[data-aui-resize]` + `.aui-resize-handle`: pointer and keyboard resizing, min/max, double-click reset, persisted sizes via `data-aui-resize-key`, nested vertical containers; `aui:resize`.
- `<details class="aui-panel-group">` sidebar sections, `.aui-panel-header` tool-window header, `.aui-props` property grid, `.aui-traffic-lights`, `.aui-statusbar-item`, `.aui-statusbar--accent`, `.aui-desktop--framed`.
- Tokens: `--aui-menubar-h`, `--aui-toolstrip-h`, `--aui-rail-w`.

### Messaging — `src/components/chat.css`
- `.aui-chat` three-pane shell (`aui-chat--info`, `aui-chat--compact`, single-pane below 900px with `is-conversation` and `.aui-chat-back`), side header/search/filters, `.aui-convos` + `.aui-convo` rows (unread, muted, typing, draft, pinned, actions), chat header with peer status, pinned-message bar, jump-to-latest button.
- Messages: `.aui-msg--in|--out` with `is-first/is-middle/is-last` grouping, tails, sender colours by tone, meta + `.aui-ticks` (sent/delivered/read/pending/failed), replies, forwarded, media grids (1–4 + more), captions, play overlay, files, voice messages with waveform and speed, link previews, polls, reactions + reaction bar, call rows, system rows, day separators (sticky), unread divider, typing indicator, deleted/sticker/big-emoji bubbles, selection mode, hover actions.
- `.aui-composer[data-aui-composer]`: autosize, Enter/Ctrl+Enter send (`aui:send`, cancelable), send ↔ mic icon swap, reply/edit bar, attachments, tools row, recording state, static emoji picker.
- `.aui-chat-info` pane (profile, sections, media grid, members), `.aui-call` stage (peer with ringing rings, video, PiP, 1–4+ column group grid, tiles with tags, side panel, control bar, incoming banner, in-call strip).
- `data-aui-chat-scroll` keeps the thread at the bottom and follows new messages; `data-aui-chat-info-toggle`; `aui:convo`; `ArmsysUI.send / scrollChat`.
- Tokens: `--aui-chat-list-w`, `--aui-chat-info-w`, `--aui-chat-bg`, `--aui-bubble-in`, `--aui-bubble-out`, `--aui-bubble-system`, `--aui-bubble-radius` (light-theme values included).
- Multi-account / multi-platform inbox: `data-platform` colours (WhatsApp, Telegram, TikTok, WeChat, Zalo, Messenger, Instagram, Signal, LINE, Viber, Discord, Slack, SMS, email → `--aui-platform-*` tokens), `.aui-platform` badge (sizes, round, soft, corner badge on avatars), `.aui-via` "platform · account" label, accounts rail (`.aui-rail--accounts[data-aui-rail]`, `aui:rail`, offline state + status dot), Thunderbird-style `.aui-accounts` list, Unified / By account modes (`aui-convos--grouped` + sticky `.aui-convos-account`), receiving-account line (`.aui-convo-via` with `aui-chat--via`), platform colour edge (`aui-chat--stripes`), `data-aui-chat-toggle` (`aui:chat-option`), connection banner `.aui-chat-banner`, unknown-sender bar `.aui-chat-request`.
- More message types and states: translation (`.aui-bubble-tr`, `.aui-bubble-original`, `data-aui-show-original`, `aui:original`), AI meaning `.aui-bubble-explain`, failed send `.aui-msg--failed` + `.aui-msg-failed` (Retry), scheduled `.aui-bubble--scheduled`, group read receipts `.aui-msg-seen`, `.aui-ticks.is-played`, location (live), contact card + `.aui-bubble-actions`, round video note, view-once, story reply, GIF label, code in text, `.aui-bubble--unsupported`; list rows `is-failed`, `is-recording`, mention badge, archived row, unread dot `.aui-count--dot`.
- Composer: every bar control shares `--aui-composer-h` (44px) so attach, field and send line up; `.aui-composer-action` soft round side button; send keeps its on-accent icon colour; `.aui-composer-from` reply-from account picker; `.aui-composer-translate` toggle; sending always scrolls the thread to the bottom; long placeholders no longer wrap.

### Date picker — `src/components/picker.css`
- `data-aui-datepicker` on text inputs (floating, flip/shift aware, Escape, arrow keys, locale, week start, min/max, marked days, `data-aui-format`), inline `data-aui-calendar`, month/year jump, Today/Clear footer; `aui:date`; `ArmsysUI.openDatepicker / closeDatepicker / setDate / parseDate / formatDate`.

### Buttons
- New variants `aui-btn--dashed`, `--inverse`, `--glass`, `--toggle` (auto `aria-pressed`, `aui:toggle`, `.aui-btn-on/.aui-btn-off` icon swap), `--hover-danger`; solid `--yellow` and `--neutral`; size `--2xl`; shapes `--round`, `--square`, `--rounded`, `--wide`, `--stack`; `.aui-btn-badge` corner count; avatars inside buttons.

### Data & forms
- `.aui-notifs` notification center (`.aui-notif`, unread, quote, actions, day labels).
- `.aui-option-row-title/-desc` are block-level so they work inside `<label>` with spans.

### Fixed
- Docs sidebar: the active/hover pill was clipped by the sidebar overflow so link text looked flush with its left edge. The sidebar now overhangs the gutter by the link inset (`--aui-docs-inset`), keeping text aligned with the header logo.
- `.aui-search-trigger`: the shortcut hint (`.aui-kbd-group`) was stretched by the label rule and floated mid-control; it now hugs the right edge with 18px keys.

### Icons
- 40 new: mic, mic-off, video, video-off, phone-off, phone-incoming, phone-outgoing, phone-missed, smile, check-check, reply, forward, pin, archive, volume, volume-x, camera, maximize, screen-share, file-text, music, at-sign, undo, redo, scissors, clipboard, zoom-in, zoom-out, folder-open, flag, printer, bold, italic, strikethrough, list-ordered, headphones, ban, user-check, dots-grid, sticker, hand.

### Docs & AI
- New reference sections (Date picker, Desktop workbench, Messaging, notification center, button additions), `examples/messenger.html`, rebuilt `examples/desktop.html` as a workbench, `ai/recipes/messenger.md`, 16 new entries in `ai/components.json`, updated `ai/javascript.json`, `ai/patterns.json`, TypeScript declarations and `llms-full.txt`.

## 2.0.1 — 2026-10-07

### Fixed
- Re-release of 2.0.0 under a fresh version so CDNs (jsDelivr) serve the published files instead of a cached "release not found" response.
- `npm run check` ignores CRLF line endings, so it no longer reports false "out of date" files on Windows checkouts.
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
