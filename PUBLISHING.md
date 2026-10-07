# Publishing Armsys UI

This repository is prepared for three public distribution layers:

1. **GitHub** — canonical source repository and issue/release history
2. **npm + jsDelivr** — package registry and immediate CDN distribution
3. **cdnjs** — optional secondary CDN after the library meets cdnjs admission requirements

The UI source itself does not require a build step.

## 1. Publish the GitHub repository

Recommended public repository:

```text
https://github.com/armsys-tech/ui-kit
```

From the project directory:

```bash
git init
git add .
git commit -m "Initial Armsys UI release"
git branch -M main
git remote add origin https://github.com/armsys-tech/ui-kit.git
git push -u origin main
```

If the directory is already a Git repository, only add/commit/push the new files as appropriate.

### GitHub Pages

The project is already static and the root `index.html` is the component showcase.

In GitHub:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select `main` and `/ (root)`.
4. Save.

For a repository named `ui-kit` under the `armsys-tech` organization, the default Pages URL is normally:

```text
https://armsys-tech.github.io/ui-kit/
```

The included `.nojekyll` file keeps GitHub Pages in plain static-file mode.

## 2. Publish to npm

The included `package.json` uses:

```text
@armsys-tech/ui
```

The npm scope must belong to an npm user/organization you control. If your npm scope is different, change the `name` field **before the first npm publication**, and update the CDN URLs in the AI manifests and README to match.

Log in:

```bash
npm login
```

Publish the initial public scoped package:

```bash
npm publish --access public
```

`package.json` also contains `publishConfig.access = public`.

Current npm publishing policy requires an account configuration that is allowed to publish, such as 2FA or an appropriate granular access token. See the official npm publishing documentation for current account requirements:

```text
https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/
```

## 3. Use jsDelivr immediately after npm publication

jsDelivr serves public npm package files automatically. No separate jsDelivr submission is required.

Version-pinned production URLs:

```text
https://cdn.jsdelivr.net/npm/@armsys-tech/ui@2.0.0/dist/armsys-ui.min.css
https://cdn.jsdelivr.net/npm/@armsys-tech/ui@2.0.0/dist/armsys-ui.min.js
```

AI manifest:

```text
https://cdn.jsdelivr.net/npm/@armsys-tech/ui@2.0.0/ai/index.json
```

Example component catalog:

```text
https://cdn.jsdelivr.net/npm/@armsys-tech/ui@2.0.0/ai/components.json
```

Use pinned versions in production. A versionless URL can move when a new npm version becomes current.

Official jsDelivr npm documentation:

```text
https://github.com/jsdelivr/jsdelivr#usage-documentation
```

### Important note about HTML

jsDelivr is ideal for the CSS, JavaScript and JSON assets. Its npm endpoint serves HTML files as `text/plain` for security reasons, so use **GitHub Pages or your own website** for the rendered showcase and example HTML pages.

## 4. Optional cdnjs publication

cdnjs is optional. Unlike jsDelivr, a new library must be accepted into the `cdnjs/packages` repository.

At the time this publishing guide was prepared, cdnjs documents a basic popularity requirement of roughly:

- **800+ npm downloads/month**, or
- **200+ GitHub stars**

Maintainers retain discretion over admission.

A ready-to-adapt package definition is included at:

```text
publishing/cdnjs/armsys-ui.json
```

When the project qualifies:

1. Fork `https://github.com/cdnjs/packages`.
2. Add the supplied definition as `packages/a/armsys-ui.json` in that fork.
3. Confirm the npm package name in `autoupdate.target` is correct.
4. Submit a pull request to `cdnjs/packages`.

cdnjs can then copy the CSS/JS files from the npm `dist` directory and automatically track later package releases.

Official instructions:

```text
https://github.com/cdnjs/packages/blob/master/CONTRIBUTING.md
```

## 5. Release a new version

Before publishing a new release:

1. Update `version` in `package.json` and `VERSION` in `src/js/00-core.js`.
2. Run `npm run build` — it regenerates `dist/` (banners use the package version), `ai/tokens.json`, `ai/icons.json` and `llms-full.txt`, and verifies that every documented `aui-*` class exists.
3. Update version strings in `README.md`, `ai/index.json`, `ai/integrations.json`, `llms.txt`, `index.html` and `CHANGELOG.md`.
4. Commit the changes.
5. Create a Git tag/release if desired.
6. Publish the new npm version.

Example:

```bash
npm version patch
npm publish --access public
```

Do not reuse an npm version that has already been published.

## 6. AI consumption

AI tools should start with the small manifest:

```text
ai/index.json
```

For a versioned remote source after npm publication:

```text
https://cdn.jsdelivr.net/npm/@armsys-tech/ui@2.0.0/ai/index.json
```

The manifest points to component, pattern, token and integration catalogs. Models should load only the specific files needed for the task rather than scanning the entire CSS bundle.

Platform-specific repository instruction files are included for:

```text
AGENTS.md
CLAUDE.md
GEMINI.md
```

The common rules live in:

```text
AI_GUIDE.md
```
