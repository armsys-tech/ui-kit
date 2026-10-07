# Recipe — Admin panel / dashboard

Use for: admin panels, consoles, back offices, CRMs, server/VPN management, monitoring.
Reference implementation: `examples/dashboard.html`, `examples/data-table.html`, `examples/settings.html`.

## 1. Shell (copy as-is, then fill)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Servers — Console</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@armsys-tech/ui@2.0.1/dist/armsys-ui.min.css">
  <script src="https://cdn.jsdelivr.net/npm/@armsys-tech/ui@2.0.1/dist/armsys-ui.min.js" defer></script>
</head>
<body class="aui">
<div class="aui-app" data-aui-collapsible>
  <aside class="aui-sidebar" id="sidebar">
    <div class="aui-sidebar-header">
      <a class="aui-brand" href="/"><span class="aui-logo"><svg viewBox="0 0 24 24"><use href="#aui-i-logo"/></svg></span><span class="aui-brand-text">Console<small>Production</small></span></a>
    </div>
    <div class="aui-sidebar-body">
      <nav class="aui-nav aui-nav--indicator" aria-label="Primary">
        <div class="aui-nav-title">Workspace</div>
        <a class="aui-nav-item" aria-current="page" href="/"><svg class="aui-icon"><use href="#aui-i-grid"/></svg><span class="aui-nav-label">Overview</span></a>
        <a class="aui-nav-item" href="/servers"><svg class="aui-icon"><use href="#aui-i-server"/></svg><span class="aui-nav-label">Servers</span><span class="aui-nav-count">12</span></a>
        <a class="aui-nav-item" href="/users"><svg class="aui-icon"><use href="#aui-i-users"/></svg><span class="aui-nav-label">Users</span></a>
        <div class="aui-nav-title">Configure</div>
        <a class="aui-nav-item" href="/settings"><svg class="aui-icon"><use href="#aui-i-settings"/></svg><span class="aui-nav-label">Settings</span></a>
      </nav>
    </div>
    <div class="aui-sidebar-footer">
      <div class="aui-dropdown aui-dropdown--block" data-aui-dropdown>
        <button class="aui-sidebar-user" data-aui-dropdown-trigger>
          <span class="aui-avatar aui-avatar--sm aui-avatar--accent">AT</span>
          <span class="aui-sidebar-user-text"><span>Ayla Tan</span><span>ayla@example.com</span></span>
          <svg class="aui-icon"><use href="#aui-i-chevrons-up-down"/></svg>
        </button>
        <div class="aui-menu aui-menu--up">
          <a class="aui-menu-item" href="/profile"><svg class="aui-icon"><use href="#aui-i-user"/></svg>Profile</a>
          <button class="aui-menu-item" data-aui-theme-toggle data-aui-keep-open><svg class="aui-icon"><use href="#aui-i-moon"/></svg>Toggle theme</button>
          <div class="aui-menu-sep"></div>
          <a class="aui-menu-item" href="/logout"><svg class="aui-icon"><use href="#aui-i-logout"/></svg>Sign out</a>
        </div>
      </div>
    </div>
  </aside>

  <div class="aui-app-main">
    <header class="aui-topbar">
      <button class="aui-btn aui-btn--ghost aui-btn--icon aui-btn--sm aui-sidebar-toggle" data-aui-nav-toggle="#sidebar" aria-label="Open menu"><svg class="aui-icon"><use href="#aui-i-menu"/></svg></button>
      <button class="aui-btn aui-btn--ghost aui-btn--icon aui-btn--sm aui-sidebar-collapse" data-aui-sidebar-collapse aria-label="Collapse sidebar"><svg class="aui-icon"><use href="#aui-i-panel-left"/></svg></button>
      <nav class="aui-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Console</a></li><li><span aria-current="page">Servers</span></li></ol></nav>
      <div class="aui-topbar-search"><button class="aui-search-trigger" data-aui-command-open><svg class="aui-icon"><use href="#aui-i-search"/></svg><span>Search…</span><kbd class="aui-kbd">⌘K</kbd></button></div>
      <div class="aui-topbar-actions">
        <button class="aui-btn aui-btn--ghost aui-btn--icon aui-btn--sm" aria-label="Notifications"><svg class="aui-icon"><use href="#aui-i-bell"/></svg><span class="aui-btn-dot"></span></button>
      </div>
    </header>

    <main class="aui-app-content">
      <!-- 2. page header · 3. KPIs · 4. content -->
    </main>
  </div>
</div>
<!-- dialogs, drawers and the command palette go here, outside .aui-app -->
</body>
</html>
```

## 2. Page header

```html
<div class="aui-page-header">
  <div class="aui-page-header-body">
    <h1 class="aui-page-title">Servers <span class="aui-badge aui-badge--success"><span class="aui-dot aui-dot--success"></span>12 online</span></h1>
    <p class="aui-page-desc">VLESS / WireGuard nodes across all regions.</p>
  </div>
  <div class="aui-page-actions">
    <div class="aui-segmented"><button class="is-active">24h</button><button>7d</button><button>30d</button></div>
    <button class="aui-btn"><svg class="aui-icon"><use href="#aui-i-download"/></svg>Export</button>
    <button class="aui-btn aui-btn--primary" data-aui-modal-open="#new-server"><svg class="aui-icon"><use href="#aui-i-plus"/></svg>Add server</button>
  </div>
</div>
```

## 3. KPI row

```html
<div class="aui-grid aui-grid--4">
  <div class="aui-card aui-metric">
    <div class="aui-stat">
      <div class="aui-stat-label"><svg class="aui-icon"><use href="#aui-i-users"/></svg>Active clients<span class="aui-delta is-up">4.1%</span></div>
      <div class="aui-stat-value">1,284</div>
      <div class="aui-stat-meta">vs last week</div>
    </div>
    <svg class="aui-spark" viewBox="0 0 100 30" preserveAspectRatio="none"><polyline points="0,22 20,18 40,20 60,12 80,14 100,8"/></svg>
  </div>
  <!-- repeat; use aui-progress for quotas, aui-bars for histograms, aui-ring for percentages -->
</div>
```

## 4. Data table with toolbar, selection, row menu, pagination

```html
<div class="aui-card aui-card--clip aui-mt-6">
  <div class="aui-toolbar">
    <div class="aui-input-wrap aui-input-wrap--sm"><svg class="aui-icon"><use href="#aui-i-search"/></svg><input class="aui-input aui-input--sm" placeholder="Search servers"></div>
    <select class="aui-select aui-input--sm" data-aui-select style="width:160px"><option>All regions</option><option>Türkiye</option><option>Japan</option></select>
    <div class="aui-spacer"></div>
    <div class="aui-bulkbar" id="bulk" hidden><span><b data-aui-selected-count>0</b> selected</span><div class="aui-row"><button class="aui-btn aui-btn--sm">Restart</button><button class="aui-btn aui-btn--sm aui-btn--soft aui-btn--danger" data-aui-confirm="Delete selected servers?">Delete</button></div></div>
  </div>
  <div class="aui-table-wrap">
    <table class="aui-table" data-aui-bulkbar="#bulk">
      <thead><tr>
        <th class="aui-check-cell"><label class="aui-check"><input type="checkbox" data-aui-select-all aria-label="Select all"></label></th>
        <th data-aui-sort><button class="aui-sort">Server<svg class="aui-icon"><use href="#aui-i-arrow-up"/></svg></button></th>
        <th>Status</th>
        <th class="aui-num" data-aui-sort="number"><button class="aui-sort">Clients<svg class="aui-icon"><use href="#aui-i-arrow-up"/></svg></button></th>
        <th class="aui-table-actions"></th>
      </tr></thead>
      <tbody>
        <tr>
          <td class="aui-check-cell"><label class="aui-check"><input type="checkbox" data-aui-select-row aria-label="Select TR1"></label></td>
          <td><div class="aui-entity"><span class="aui-icon-box aui-icon-box--sm aui-icon-box--accent"><svg class="aui-icon"><use href="#aui-i-server"/></svg></span><div class="aui-entity-body"><span class="aui-entity-name">TR1</span><span class="aui-entity-sub">Istanbul · VLESS Reality</span></div></div></td>
          <td><span class="aui-badge aui-badge--success"><span class="aui-dot aui-dot--success"></span>Online</span></td>
          <td class="aui-num" data-sort-value="842">842</td>
          <td class="aui-table-actions">
            <div class="aui-dropdown" data-aui-dropdown>
              <button class="aui-btn aui-btn--ghost aui-btn--icon aui-btn--sm" data-aui-dropdown-trigger aria-label="Actions for TR1"><svg class="aui-icon"><use href="#aui-i-more"/></svg></button>
              <div class="aui-menu aui-menu--end">
                <button class="aui-menu-item" data-aui-modal-open="#server-drawer"><svg class="aui-icon"><use href="#aui-i-eye"/></svg>Details</button>
                <button class="aui-menu-item"><svg class="aui-icon"><use href="#aui-i-refresh"/></svg>Restart Xray</button>
                <div class="aui-menu-sep"></div>
                <button class="aui-menu-item aui-menu-item--danger" data-aui-confirm="Delete TR1?" data-aui-confirm-message="All clients on this node are removed."><svg class="aui-icon"><use href="#aui-i-trash"/></svg>Delete</button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="aui-table-footer"><span class="aui-pagination-info">1–25 of 120</span><nav class="aui-pagination"><button class="aui-page" disabled><svg class="aui-icon"><use href="#aui-i-chevron-left"/></svg></button><button class="aui-page" aria-current="page">1</button><button class="aui-page">2</button><button class="aui-page"><svg class="aui-icon"><use href="#aui-i-chevron-right"/></svg></button></nav></div>
</div>
```

Empty state instead of rows: `<div class="aui-empty">…</div>` inside the card.

## 5. Create / edit — modal (becomes a bottom sheet on phones)

```html
<dialog class="aui-modal" id="new-server" aria-labelledby="ns-title">
  <div class="aui-modal-header"><div class="aui-modal-heading"><h2 class="aui-modal-title" id="ns-title">Add server</h2><p class="aui-modal-desc">Connect a 3X-UI panel.</p></div><button class="aui-close" data-aui-modal-close aria-label="Close"></button></div>
  <div class="aui-modal-body">
    <form class="aui-form" id="ns-form">
      <div class="aui-form-grid">
        <div class="aui-field"><label class="aui-label aui-required" for="ns-name">Name</label><input class="aui-input" id="ns-name" required autofocus></div>
        <div class="aui-field"><label class="aui-label" for="ns-region">Region</label><select class="aui-select" id="ns-region" data-aui-select><option>Türkiye</option><option>Japan</option></select></div>
        <div class="aui-field aui-span-full"><label class="aui-label" for="ns-url">Panel URL</label><div class="aui-input-group"><span class="aui-input-addon">https://</span><input class="aui-input" id="ns-url"></div></div>
      </div>
    </form>
  </div>
  <div class="aui-modal-footer"><button class="aui-btn" data-aui-modal-close>Cancel</button><button class="aui-btn aui-btn--primary" type="submit" form="ns-form">Add server</button></div>
</dialog>
```

Detail views use `<dialog class="aui-drawer aui-drawer--lg">` with the same header/body/footer parts.

## 6. JavaScript glue (no framework needed)

```js
document.getElementById('ns-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.querySelector('[form="ns-form"]');
  btn.classList.add('is-loading');
  try {
    await api.createServer(new FormData(e.target));
    ArmsysUI.closeModal('#new-server');
    ArmsysUI.toast({ title: 'Server added', variant: 'success' });
  } catch (err) {
    ArmsysUI.toast({ title: 'Could not add server', message: err.message, variant: 'danger' });
  } finally { btn.classList.remove('is-loading'); }
});
```

## Checklist

- One `aui-btn--primary` per view (the main create/save action).
- Destructive actions: `data-aui-confirm` or `await ArmsysUI.confirm({ variant: 'danger' })`, then a toast.
- Status = `aui-badge` + tone + `aui-dot`; numbers in tables use `aui-num`.
- Settings pages: `aui-settings` + `aui-form-section` + `aui-save-bar` (see `examples/settings.html`).
- Never add Bootstrap/Tailwind; custom CSS only for domain layout, using `--aui-*` tokens.
