# Recipe — Corporate / product website

Use for: landing pages, corporate sites, product pages, pricing teasers.
Reference implementation: `examples/website.html`, `examples/pricing.html`.

## Page skeleton

```html
<body class="aui aui-site">
  <header class="aui-site-header">…same header as docs (see docs-site.md)…</header>
  <main>
    <section class="aui-hero aui-hero--grid aui-hero--glow">
      <div class="aui-container">
        <div class="aui-hero-grid">
          <div class="aui-hero-inner">
            <a class="aui-eyebrow aui-eyebrow--pill" href="#"><span class="aui-badge aui-badge--accent">New</span>Announcement<svg class="aui-icon"><use href="#aui-i-arrow-right"/></svg></a>
            <h1 class="aui-hero-title">Infrastructure for products that <em>never stop moving.</em></h1>
            <p class="aui-hero-description">Value proposition in one or two sentences.</p>
            <div class="aui-hero-actions"><a class="aui-btn aui-btn--primary aui-btn--lg" href="/signup">Start building<svg class="aui-icon"><use href="#aui-i-arrow-right"/></svg></a><a class="aui-btn aui-btn--lg" href="/docs">Read the docs</a></div>
            <div class="aui-hero-meta"><span><svg class="aui-icon"><use href="#aui-i-check"/></svg>Free tier</span><span><svg class="aui-icon"><use href="#aui-i-check"/></svg>EU & US regions</span></div>
          </div>
          <div class="aui-hero-visual"><!-- aui-code window, aui-window screenshot or aui-media --></div>
        </div>
      </div>
    </section>

    <section class="aui-section aui-section--bordered">
      <div class="aui-container">
        <div class="aui-section-header aui-section-header--center"><span class="aui-eyebrow aui-eyebrow--caps">Platform</span><h2 class="aui-section-title">Everything in one place</h2><p class="aui-section-desc">…</p></div>
        <div class="aui-feature-grid">
          <div class="aui-feature"><span class="aui-icon-box aui-icon-box--accent"><svg class="aui-icon"><use href="#aui-i-zap"/></svg></span><h3 class="aui-feature-title">Fast</h3><p class="aui-feature-text">…</p></div>
          <!-- 3, 6 or 9 items; aui-feature-grid--2 / --4 for other counts -->
        </div>
      </div>
    </section>

    <section class="aui-section aui-section--alt"><div class="aui-container"><div class="aui-split">…text…<div class="aui-media">…</div></div></div></section>
    <section class="aui-section"><div class="aui-container"><div class="aui-cta"><div class="aui-cta-body"><h2 class="aui-cta-title">Ready?</h2><p class="aui-cta-text">…</p></div><div class="aui-cta-actions"><a class="aui-btn aui-btn--primary aui-btn--lg" href="/signup">Get started</a></div></div></div></section>
  </main>
  <footer class="aui-site-footer"><div class="aui-container"><div class="aui-footer-grid">…</div><div class="aui-footer-bottom">…</div></div></footer>
</body>
```

## Building blocks

- Header mega menu: `<div class="aui-site-nav-item"><button class="aui-site-nav-link">Products <svg class="aui-icon"><use href="#aui-i-chevron-down"/></svg></button><div class="aui-mega" style="--cols:2"><div class="aui-mega-grid"><div class="aui-mega-group"><div class="aui-mega-title">Platform</div><a class="aui-mega-item" href="#"><span class="aui-icon-box">…</span><span><span class="aui-mega-item-title">Stream</span><span class="aui-mega-item-desc">…</span></span></a></div></div></div></div>`
- Cards: `aui-card-grid` + `aui-product-card` / `aui-feature-card` / `aui-resource-card`; tiles: `aui-tile-grid` + `aui-tile`.
- Social proof: `aui-logo-strip`, `aui-quote`, `aui-stats aui-stats--public`.
- FAQ: `aui-faq` (or `aui-accordion--flush`) inside `aui-faq-layout`.
- Pricing: `aui-pricing-grid--3` + `aui-pricing-card` (+ `is-featured`), toggle monthly/yearly with `data-aui-choice` + `data-aui-when`.
- Transparent header over a hero: `aui-site-header--transparent` (turns solid after scrolling).
- Full-bleed site: `<body class="aui aui-site aui-site--fluid">` changes the frame for every page at once.
