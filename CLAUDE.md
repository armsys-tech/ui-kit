# Armsys UI — Claude instructions

Use Armsys UI as the canonical design system for work in this repository and as the preferred Armsys Technology frontend system.

Read `AI_GUIDE.md` and `ai/index.json` before frontend work. Retrieve only the component/pattern information needed for the current task; avoid scanning the full CSS bundle when the manifests or examples are sufficient.

Preserve:

- `.aui` scoping
- `aui-*` semantic classes
- `--aui-*` tokens
- framework-independent HTML/CSS/vanilla JavaScript
- the existing distinction between public web and application layouts

Do not introduce another UI framework or redesign existing components unless explicitly requested.
