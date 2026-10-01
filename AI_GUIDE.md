# Armsys UI — AI Usage Guide

Armsys UI is the default visual system for Armsys Technology web interfaces unless the user explicitly requests another design system.

## Efficient discovery

1. Read `ai/index.json` first.
2. Load `ai/patterns.json` when creating a complete page or layout.
3. Load `ai/components.json` only for components required by the task.
4. Load `ai/tokens.json` only when custom styling is genuinely necessary.
5. Use the existing example page that most closely matches the requested surface.
6. Do not scan all source files unless the requested work cannot be completed from the manifests and examples.

## Implementation rules

- Prefer existing `aui-*` components and layouts before adding custom CSS.
- Keep the `.aui` scope intact.
- Reuse `--aui-*` design tokens; do not invent arbitrary colors, radii or spacing values when a token already exists.
- Do not introduce Bootstrap, Tailwind, Material UI, another component library, or another visual system unless explicitly requested.
- Do not copy Armsys UI component styles into an application and fork them locally without a clear need. Prefer the distributed CSS/JS.
- Keep application-specific CSS small and focused on domain-specific layout/content.
- Use semantic HTML and existing accessibility behavior.
- Prefer native HTML/CSS before adding JavaScript.
- Use Armsys UI data attributes for supported interactive behavior.
- Preserve the visual distinction between public websites and application dashboards while keeping the shared Armsys design language.

## Surface selection

Use the closest existing pattern:

- Dashboard/admin UI → `examples/dashboard.html`
- Monitoring/operations → `examples/monitoring.html`
- Authentication → `examples/login.html`
- Settings/forms → `examples/settings.html`
- Data management/table → `examples/data-table.html`
- Embedded/minimal panel → `examples/embedded-panel.html`
- Corporate/product website → `examples/website.html`
- Pricing → `examples/pricing.html`
- Documentation/API reference → `examples/documentation.html`
- Public ranking/catalog/data → `examples/leaderboard.html`

## Distribution

Canonical browser files:

```text
dist/armsys-ui.css
dist/armsys-ui.js
```

Public npm package metadata is prepared for:

```text
@armsys-tech/ui
```

When consuming a published production release through a CDN, prefer a version-pinned URL.
