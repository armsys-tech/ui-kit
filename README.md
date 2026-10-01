# Armsys UI

Framework-independent design system and UI library by **Armsys Technology**.

Armsys UI is a dark-first, dependency-free interface system for application UIs and public web surfaces. It is designed to work with plain HTML as well as server-rendered and framework-based projects without forcing a frontend framework.

## Highlights

- Framework-independent HTML, CSS and vanilla JavaScript
- No required runtime dependencies
- Scoped with `.aui` to reduce style leakage into host applications
- Application layouts: dashboards, admin panels, monitoring, settings and embedded panels
- Public web layouts: corporate/product sites, pricing, documentation and public data pages
- Developer UI: code windows, terminal blocks, API endpoints, parameters and response layouts
- Responsive components and accessible interaction states
- Reusable design tokens through `--aui-*` CSS custom properties

## Quick start

### Direct files

```html
<link rel="stylesheet" href="dist/armsys-ui.css">
<script src="dist/armsys-ui.js" defer></script>

<body class="aui">
  <button class="aui-btn aui-btn--primary">Save changes</button>
</body>
```

Use `<body class="aui">` for a full Armsys UI page, or wrap only the required area with `<div class="aui">` when embedding the kit into an existing application.

### npm

The package metadata is prepared for the public package name:

```text
@armsys-tech/ui
```

After the package has been published:

```bash
npm install @armsys-tech/ui
```

Then import the assets your project needs:

```js
import "@armsys-tech/ui/dist/armsys-ui.css";
import "@armsys-tech/ui/dist/armsys-ui.js";
```

### jsDelivr CDN

After the npm package is public, jsDelivr can serve the published files directly:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@armsys-tech/ui@1.0.0/dist/armsys-ui.css"
>
<script
  src="https://cdn.jsdelivr.net/npm/@armsys-tech/ui@1.0.0/dist/armsys-ui.js"
  defer
></script>
```

Pin a version in production projects. The complete publishing process is documented in [PUBLISHING.md](PUBLISHING.md).

## Examples

Open `index.html` for the complete component reference.

Full-page examples are available under `examples/`:

- `dashboard.html` — application dashboard
- `monitoring.html` — operational monitoring UI
- `login.html` — authentication
- `settings.html` — settings interface
- `data-table.html` — data management/table UI
- `embedded-panel.html` — scoped UI embedded in another surface
- `website.html` — corporate/product website
- `pricing.html` — pricing page
- `documentation.html` — developer documentation/API reference
- `leaderboard.html` — public ranking/data page

## Project structure

```text
armsys-ui/
├─ dist/              Directly consumable CSS and JavaScript
├─ src/               Design tokens, components, layouts and JS source
├─ examples/          Complete page examples
├─ ai/                Machine-readable component and pattern manifests
├─ publishing/        Optional publishing helper files
├─ index.html         Component showcase
├─ AI_GUIDE.md        Model-independent AI usage rules
├─ AGENTS.md          OpenAI/Codex project instructions
├─ CLAUDE.md          Claude project instructions
├─ GEMINI.md          Gemini project instructions
└─ llms.txt           Lightweight AI/crawler entry point
```

## AI-assisted development

Armsys UI includes a small machine-readable catalog so AI coding tools do not need to scan the entire stylesheet to understand the system.

Start with:

```text
ai/index.json
```

Then load only the component or pattern metadata required for the current task. Shared rules are defined in `AI_GUIDE.md`.

For external AI tools, the same files can be consumed from the public GitHub repository, GitHub Pages, or the versioned npm/jsDelivr package.

## Distribution

The canonical browser assets are:

```text
dist/armsys-ui.css
dist/armsys-ui.js
```

The project does not require a build step to use these files.

## Version

Current release: **1.0.0**

## License

MIT © 2026 Armsys Technology. See [LICENSE](LICENSE).
