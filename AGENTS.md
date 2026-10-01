# Armsys UI project instructions

This repository is the canonical Armsys UI design system.

For frontend/design work:

1. Read `AI_GUIDE.md` and `ai/index.json` first.
2. Load only the relevant pattern/component metadata for the current task.
3. Reuse existing `aui-*` classes and `--aui-*` tokens before creating new visual primitives.
4. Keep `.aui` scoping and existing framework-independent HTML/CSS/vanilla-JS architecture.
5. Do not introduce another UI framework unless explicitly requested.
6. Do not modify shared Armsys UI components for application-specific requirements when composition or small local styles are sufficient.
7. Use the existing full-page examples as the primary implementation reference.
