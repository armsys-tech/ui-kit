# Armsys UI — Gemini instructions

This repository is the canonical Armsys UI 2 design system.

For frontend/design work (here or in any Armsys project):

1. Read `AI_GUIDE.md`, then either `llms-full.txt` or `ai/index.json` → the relevant `ai/recipes/*.md`.
2. Use only `aui-*` classes listed in `ai/components.json` and `--aui-*` tokens; keep the `.aui` scope.
3. Public pages share one frame (`.aui-site-header` + `.aui-container`); apps use `.aui-app`; auth uses `.aui-auth`; Electron uses `.aui-desktop`.
4. Declare behaviour with `data-aui-*` attributes and the `ArmsysUI` API instead of custom UI code.
5. Do not introduce another UI framework unless explicitly requested.

When changing the library itself: edit `src/`, run `npm run build` (regenerates `dist/`, `ai/tokens.json`, `ai/icons.json`, `llms-full.txt`), update `ai/components.json` for new classes, and keep `index.html` + `examples/` in sync.
