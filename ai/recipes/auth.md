# Recipe — Authentication pages

Use for: sign in, sign up, forgot/reset password, 2FA/OTP, email verification, invitations, SSO.
Reference implementation: `examples/login.html`, `examples/register.html`, `examples/forgot-password.html`, `examples/two-factor.html`.

## Layout

`.aui-auth` is a split screen: **showcase on the left** (brand, headline, feature cards or checklist, testimonial, stats, status) and **the form on the right**. `aui-auth--reverse` swaps the sides, `aui-auth--center` gives a single centred card. The showcase is hidden at ≤900px (add `aui-auth-aside--mobile` to keep a compact header version).

```html
<body class="aui">
<div class="aui-auth">
  <aside class="aui-auth-aside">
    <div class="aui-auth-aside-top">
      <a class="aui-brand" href="/"><span class="aui-logo"><svg viewBox="0 0 24 24"><use href="#aui-i-logo"/></svg></span>Armsys</a>
      <a class="aui-link-arrow aui-text-sm" href="/"><svg class="aui-icon"><use href="#aui-i-arrow-left"/></svg>Back to website</a>
    </div>
    <div class="aui-auth-showcase">
      <h2 class="aui-auth-headline">The control plane for products that <em>never stop moving.</em></h2>
      <p class="aui-auth-subline">One sentence of value proposition.</p>
      <div class="aui-auth-features">
        <div class="aui-auth-feature"><span class="aui-icon-box aui-icon-box--sm aui-icon-box--accent"><svg class="aui-icon"><use href="#aui-i-zap"/></svg></span><div class="aui-auth-feature-title">Fast</div><div class="aui-auth-feature-text">Short supporting line.</div></div>
        <!-- 2 or 4 cards -->
      </div>
    </div>
    <figure class="aui-auth-quote"><blockquote>“Testimonial.”</blockquote><figcaption><span class="aui-avatar aui-avatar--sm aui-avatar--pink">LR</span><span><b class="aui-text">Name</b> <span class="aui-text-subtle">· Role</span></span></figcaption></figure>
    <div class="aui-auth-aside-bottom aui-mt-6"><span>© 2026 Company</span><span class="aui-status aui-text-xs"><span class="aui-dot aui-dot--success is-live"></span>All systems operational</span></div>
  </aside>

  <main class="aui-auth-main">
    <div class="aui-auth-top">
      <a class="aui-brand aui-show-mobile" href="/"><span class="aui-logo aui-logo--sm"><svg viewBox="0 0 24 24"><use href="#aui-i-logo"/></svg></span>Armsys</a>
      <span class="aui-row aui-gap-3 aui-ml-auto"><span>New here?</span><a class="aui-btn aui-btn--outline aui-btn--sm" href="/register">Create account</a></span>
    </div>
    <div class="aui-auth-form">
      <div class="aui-auth-header"><h1 class="aui-auth-title">Welcome back</h1><p class="aui-auth-desc">Sign in to continue.</p></div>
      <div class="aui-auth-social aui-auth-social--2">
        <button class="aui-btn aui-btn--social aui-btn--lg" type="button"><svg class="aui-btn-brand" viewBox="0 0 24 24"><use href="#aui-i-google"/></svg>Google</button>
        <button class="aui-btn aui-btn--social aui-btn--lg" type="button"><svg class="aui-btn-brand" viewBox="0 0 24 24"><use href="#aui-i-github"/></svg>GitHub</button>
      </div>
      <div class="aui-divider-text aui-auth-divider">or continue with email</div>
      <form class="aui-form" method="post">
        <div class="aui-field"><label class="aui-label" for="email">Email</label><div class="aui-input-wrap"><svg class="aui-icon"><use href="#aui-i-mail"/></svg><input class="aui-input" id="email" name="email" type="email" autocomplete="email" required></div></div>
        <div class="aui-field">
          <div class="aui-label-row"><label class="aui-label" for="password">Password</label><a class="aui-link" href="/forgot-password">Forgot password?</a></div>
          <div class="aui-input-wrap"><svg class="aui-icon"><use href="#aui-i-lock"/></svg><input class="aui-input" id="password" name="password" type="password" autocomplete="current-password" required><div class="aui-input-end"><button class="aui-input-action" type="button" data-aui-password-toggle aria-label="Show password"><svg class="aui-icon aui-reveal-off"><use href="#aui-i-eye"/></svg><svg class="aui-icon aui-reveal-on"><use href="#aui-i-eye-off"/></svg></button></div></div>
        </div>
        <label class="aui-check"><input type="checkbox" name="remember"><span>Keep me signed in</span></label>
        <button class="aui-btn aui-btn--primary aui-btn--block" type="submit">Sign in</button>
      </form>
      <p class="aui-auth-legal">By continuing you agree to the <a href="/terms">Terms</a>.</p>
    </div>
    <div class="aui-auth-bottom"><div class="aui-footer-legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></div>
  </main>
</div>
</body>
```

## Variants of the form column

- **Register** — optional `aui-wizard` on top, `aui-form-grid` for first/last name, password with `data-aui-strength="#meter"` and `<div class="aui-strength" id="meter" data-level="0"><span></span><span></span><span></span><span></span></div>`, terms checkbox.
- **Forgot password** — `<a class="aui-auth-back">` + `aui-icon-box aui-icon-box--lg aui-icon-box--accent` in `aui-auth-header`; success state uses `.aui-auth-result` (toggle with `data-aui-choice` / `data-aui-when` or your framework).
- **2FA** — `<div class="aui-otp" data-aui-otp="6" data-aui-otp-sep="3" data-name="code"></div>`; listen for `aui:complete` to auto-submit; mark `is-invalid` + `is-shake` on failure.
- **Server errors** — `aui-alert aui-alert--danger aui-alert--sm` above the form, `is-invalid` on fields, `aui-help is-error` messages.

Inside `.aui-auth-form` inputs and block buttons are 42px tall automatically.
