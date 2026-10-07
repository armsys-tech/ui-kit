# Recipe — Documentation / API reference site

Use for: product docs, API reference, guides, changelogs, knowledge bases.
Reference implementation: `examples/documentation.html` and the component reference `index.html`.

**Rule:** documentation uses the *same* `.aui-site-header` and container as the marketing site. Never give docs a different header, height or width — that is what makes moving between site and docs feel seamless.

```html
<body class="aui aui-site">
  <header class="aui-site-header">
    <div class="aui-container aui-site-header-inner">
      <a class="aui-site-brand" href="/"><span class="aui-logo"><svg viewBox="0 0 24 24"><use href="#aui-i-logo"/></svg></span>Armsys</a>
      <nav class="aui-site-nav"><a class="aui-site-nav-link" href="/">Product</a><a class="aui-site-nav-link" aria-current="page" href="/docs">Docs</a><a class="aui-site-nav-link" href="/pricing">Pricing</a></nav>
      <div class="aui-site-search"><button class="aui-search-trigger" data-aui-command-open><svg class="aui-icon"><use href="#aui-i-search"/></svg><span>Search docs…</span><kbd class="aui-kbd">⌘K</kbd></button></div>
      <div class="aui-site-actions"><button class="aui-btn aui-btn--ghost aui-btn--icon aui-btn--sm" data-aui-theme-toggle aria-label="Theme"><svg class="aui-icon"><use href="#aui-i-sun"/></svg></button><a class="aui-btn aui-btn--primary aui-btn--sm" href="/signup">Get started</a><button class="aui-btn aui-btn--ghost aui-btn--icon aui-btn--sm aui-nav-toggle" data-aui-nav-toggle aria-label="Menu"><svg class="aui-icon"><use href="#aui-i-menu"/></svg></button></div>
    </div>
  </header>

  <div class="aui-docs-mobilebar"><button class="aui-btn aui-btn--ghost aui-btn--sm" data-aui-nav-toggle="#docs-nav"><svg class="aui-icon"><use href="#aui-i-sidebar"/></svg>Menu</button><span class="aui-text">Publish events</span></div>

  <div class="aui-docs">
    <aside class="aui-docs-sidebar" id="docs-nav">
      <nav class="aui-docs-nav">
        <div class="aui-docs-group">
          <div class="aui-docs-group-title"><svg class="aui-icon"><use href="#aui-i-book"/></svg>Getting started</div>
          <ul><li><a class="aui-docs-link" href="/docs">Introduction</a></li><li><a class="aui-docs-link" aria-current="page" href="/docs/publish">Publish events <span class="aui-method aui-method--post">POST</span></a></li></ul>
        </div>
        <details class="aui-docs-group" open>
          <summary class="aui-docs-group-title"><svg class="aui-icon"><use href="#aui-i-code"/></svg>SDKs</summary>
          <ul><li><a class="aui-docs-link" href="#">TypeScript</a></li><li><a class="aui-docs-link" href="#">.NET <span class="aui-badge">Beta</span></a></li></ul>
        </details>
      </nav>
    </aside>

    <main class="aui-docs-main">
      <article class="aui-docs-article">
        <header class="aui-docs-header">
          <nav class="aui-breadcrumb"><ol><li><a href="/docs">Docs</a></li><li><span aria-current="page">Publish events</span></li></ol></nav>
          <h1 class="aui-docs-title">Publish events</h1>
          <p class="aui-docs-lead">One-paragraph summary.</p>
          <div class="aui-docs-meta"><span class="aui-badge aui-badge--success">Stable</span><span><svg class="aui-icon"><use href="#aui-i-clock"/></svg>Updated 24 Sep 2026</span></div>
        </header>
        <div class="aui-prose">
          <h2 id="overview">Overview</h2>
          <p>Markdown output is styled automatically by <code>.aui-prose</code>.</p>
          <div class="aui-callout aui-callout--tip"><svg class="aui-icon"><use href="#aui-i-lightbulb"/></svg><div class="aui-callout-body"><div class="aui-callout-title">Tip</div><p>…</p></div></div>
          <div class="aui-code" data-aui-tabs data-aui-tabs-sync="lang">
            <div class="aui-code-header"><div class="aui-code-tabs"><button class="aui-code-tab" data-aui-tab="ts">TypeScript</button><button class="aui-code-tab" data-aui-tab="cs">C#</button></div><div class="aui-code-actions"><button class="aui-copy" data-aui-copy aria-label="Copy"><span class="aui-copy-idle"><svg class="aui-icon"><use href="#aui-i-copy"/></svg>Copy</span><span class="aui-copy-done"><svg class="aui-icon"><use href="#aui-i-check"/></svg>Copied</span></button></div></div>
            <div class="aui-code-body" data-aui-panel="ts"><pre><code class="language-typescript">await client.events.publish('orders', [{ type: 'order.created' }]);</code></pre></div>
            <div class="aui-code-body" data-aui-panel="cs"><pre><code class="language-csharp">await client.Events.PublishAsync("orders", events);</code></pre></div>
          </div>
        </div>
        <nav class="aui-docs-pager"><a class="aui-pager-link" href="#"><span class="aui-pager-label"><svg class="aui-icon"><use href="#aui-i-arrow-left"/></svg>Previous</span><span class="aui-pager-title">Authentication</span></a><a class="aui-pager-link aui-pager-link--next" href="#"><span class="aui-pager-label">Next<svg class="aui-icon"><use href="#aui-i-arrow-right"/></svg></span><span class="aui-pager-title">Subscribe</span></a></nav>
      </article>
    </main>

    <aside class="aui-docs-toc"><nav class="aui-toc" data-aui-toc aria-label="On this page"><div class="aui-toc-title"><svg class="aui-icon"><use href="#aui-i-list"/></svg>On this page</div><ul><li><a href="#overview">Overview</a></li></ul></nav></aside>
  </div>
  <footer class="aui-site-footer aui-site-footer--compact"><div class="aui-container"><div class="aui-footer-bottom"><span>© 2026 Armsys Technology</span><div class="aui-footer-legal"><a href="#">Privacy</a><a href="#">Terms</a></div></div></div></footer>
</body>
```

## API reference blocks

Two-column endpoint: `<section class="aui-api"><div>description + aui-params</div><div class="aui-api-examples">aui-code groups + response</div></section>`. Endpoint bar: `aui-endpoint` with `aui-method--get|post|put|patch|delete|ws`. Parameters: `aui-params > aui-param > aui-param-head (aui-param-name, aui-param-type, aui-param-req) + aui-param-desc`. Responses: `aui-responses > aui-response > aui-status-code.is-2xx`.

## Code

Write plain code in `<pre><code class="language-xxx">` (escape `<`, `>`, `&`). Armsys UI highlights it with highlight.js + Atom One Dark. Line tools on the `.aui-code` wrapper: `data-aui-lines`, `data-aui-hl="2,4-6"`, `data-aui-add`, `data-aui-del`.
