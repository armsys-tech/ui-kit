# Recipe — Messenger (WhatsApp / Telegram style desktop client, single or multi-account)

Use for: chat clients, support inboxes, team messaging, and aggregators that combine many accounts on WhatsApp, Telegram, Zalo, WeChat, TikTok … in one window.
Reference implementation: `examples/messenger.html` (Electron shell + accounts rail + three panes + translation + call modal; the list is rendered from data the way a React/Vue app would).

```html
<body class="aui aui-desktop" data-aui-platform="win">
  <header class="aui-titlebar">…title · theme toggle · .aui-window-controls…</header>
  <div class="aui-desktop-body">
    <div class="aui-resize" data-aui-resize data-aui-resize-key="chat" style="height:100%">
      <nav class="aui-rail">…aui-rail-item (chats · calls · settings · avatar)…</nav>
      <div class="aui-chat aui-chat--info" style="width:100%">

        <aside class="aui-chat-side">
          <div class="aui-chat-side-header"><div class="aui-chat-side-title">Chats</div><div class="aui-row">…new chat · menu…</div></div>
          <div class="aui-chat-search"><div class="aui-input-wrap aui-input-wrap--sm">…aui-input--filled aui-input--pill…</div></div>
          <div class="aui-chat-filters"><button class="aui-chip aui-chip--sm is-active">All</button><button class="aui-chip aui-chip--sm">Unread</button></div>
          <div class="aui-convos">
            <div class="aui-convos-label">Pinned</div>
            <button class="aui-convo is-active" data-value="design">…avatar · aui-convo-head · aui-convo-foot…</button>
          </div>
        </aside>

        <section class="aui-chat-main">
          <header class="aui-chat-header">
            <button class="aui-btn aui-btn--ghost aui-btn--icon aui-chat-back" aria-label="Back">…</button>
            <span class="aui-avatar">…</span>
            <div class="aui-chat-peer" data-aui-chat-info-toggle><div class="aui-chat-peer-name">Design team</div><div class="aui-chat-peer-status is-typing">Mert is typing…</div></div>
            <div class="aui-chat-header-actions">…call · video · search · details (data-aui-chat-info-toggle) · more…</div>
          </header>
          <div class="aui-chat-body aui-chat-body--pattern" data-aui-chat-scroll>
            <div class="aui-msgs aui-msgs--tails">
              <div class="aui-msg-day aui-msg-day--sticky">Today</div>
              <div class="aui-msg aui-msg--in is-first">…</div>
              <div class="aui-msg aui-msg--in is-last">…</div>
              <div class="aui-msg aui-msg--out is-first is-last">…</div>
            </div>
            <button class="aui-btn aui-btn--round aui-chat-jump" aria-label="Jump to latest">…</button>
          </div>
          <footer class="aui-composer" data-aui-composer>…aui-composer-bar…</footer>
        </section>

        <aside class="aui-chat-info">…aui-chat-info-header · aui-chat-profile · aui-chat-info-section…</aside>
      </div>
    </div>
  </div>
  <dialog class="aui-modal aui-modal--full aui-modal--no-sheet" id="call"><div class="aui-call">…</div></dialog>
</body>
```

## Rules

- Message grouping is explicit: `is-first` / `is-middle` / `is-last` on `.aui-msg` rows (a lone message is `is-first is-last`). Corners, tails (`aui-msgs--tails`) and the avatar (last row only) follow.
- Outgoing = `aui-msg--out`; incoming group chats add a tone class to the bubble (`aui-tone--pink`) to colour the sender name and reply quotes.
- Ticks: `aui-i-check` sent · `aui-i-check-check` delivered · `.aui-ticks.is-read` read · `.is-pending` + clock while sending.
- Rich content lives inside the bubble: `aui-bubble-reply`, `aui-bubble-media` (1–4 images, `aui-bubble-media-more[data-count]`), `aui-bubble-file`, `aui-bubble-voice` + `aui-wave`, `aui-bubble-link`, `aui-poll`, `aui-bubble-reactions`, `aui-bubble-call`; non-bubble rows are `aui-msg-day`, `aui-msg-unread`, `aui-msg-system`.
- Composer: the kit autosizes, swaps send/mic and fires `aui:send` on Enter; your app appends the bubble and the `data-aui-chat-scroll` body follows. Attachment menus open with `data-aui-placement="top-start"` + `aui-menu--up`; the emoji picker is `.aui-emoji-picker` inside a dropdown with `data-aui-sheet="false"`.
- Info pane toggles with `data-aui-chat-info-toggle`; under 900px the shell becomes single-pane and `.aui-chat-back` navigates back.
- Calls: `.aui-call` inside a full modal; glass toggle buttons with `aria-pressed="true"` = muted / camera off; `.aui-call-grid` for groups, `.aui-call-pip` for self view, `.aui-call-banner` for incoming calls.
- Tokens: `--aui-chat-list-w`, `--aui-chat-info-w`, `--aui-chat-bg`, `--aui-bubble-in`, `--aui-bubble-out`, `--aui-bubble-radius` — override on `.aui` to re-skin (e.g. green bubbles).

## Events your app handles

```js
chat.addEventListener('aui:convo', e => loadThread(e.detail.value));
composer.addEventListener('aui:send', e => { api.send(threadId, e.detail.text); appendOutgoing(e.detail.text); });
```

## Multi-account / multi-platform inbox

```html
<nav class="aui-rail aui-rail--accounts" data-aui-rail>
  <button class="aui-rail-item is-active" data-value="all"><svg class="aui-icon"><use href="#aui-i-inbox"/></svg><span class="aui-btn-badge">18</span></button>
  <span class="aui-rail-sep"></span>
  <button class="aui-rail-item" data-value="wa-work" data-platform="whatsapp"><span class="aui-avatar">AR<span class="aui-platform"><!-- WhatsApp SVG --></span></span><span class="aui-btn-badge">3</span></button>
  <button class="aui-rail-item is-offline" data-value="tiktok" data-platform="tiktok"><span class="aui-avatar">AC<span class="aui-platform">TT</span></span><span class="aui-rail-status aui-tone--danger"></span></button>
</nav>
<div class="aui-chat aui-chat--via aui-chat--stripes">
  <aside class="aui-chat-side">
    …header…
    <div class="aui-chat-banner"><svg class="aui-icon"><use href="#aui-i-alert"/></svg><span><b>TikTok · @ayla.creates</b> disconnected</span><button class="aui-btn aui-btn--sm">Reconnect</button></div>
    <div class="aui-chat-filters"><div class="aui-segmented aui-segmented--sm"><button class="is-active" data-value="unified">Unified</button><button data-value="grouped">By account</button></div>…chips…</div>
    <div class="aui-convos">            <!-- add aui-convos--grouped in By account mode -->
      <div class="aui-convos-account" data-platform="zalo"><span class="aui-platform">ZL</span>Zalo · Personal <span>+84 …</span><span class="aui-count aui-count--accent">1</span></div>
      <button class="aui-convo is-unread" data-value="linh" data-platform="zalo">
        <span class="aui-avatar">LN<span class="aui-platform">ZL</span></span>
        <div class="aui-convo-head">…</div><div class="aui-convo-foot">…</div>
        <span class="aui-convo-via aui-via"><span class="aui-platform">ZL</span><span>Zalo · <b>Personal</b></span></span>
      </button>
    </div>
  </aside>
  …
</div>
```

- `data-platform` (whatsapp, telegram, tiktok, wechat, zalo, messenger, instagram, signal, line, viber, discord, slack, sms, email) sets an inheriting `--aui-platform`; badges, `.aui-via` labels and the colour edge all read it. Brand logos are not bundled — put the official SVG inside `.aui-platform`.
- Modes: rail item `all` + segmented Unified (one time-sorted list) / By account (`aui-convos--grouped`, sorted by account, sticky `.aui-convos-account` headers); clicking an account in the rail (`aui:rail`) shows only that account and hides the mode switch.
- Which account received a chat: corner badge always; `.aui-convo-via` line when the shell has `aui-chat--via`. Let users toggle it from a menu: `<button class="aui-menu-item" role="menuitemcheckbox" aria-checked="true" data-aui-chat-toggle="via">Show receiving account</button>` (same for `stripes`).
- Header: put a `.aui-via` chip after the peer name. Composer: `.aui-composer-from` (reply-from account, limited to accounts on the chat's platform) and `.aui-composer-translate` (`aui-btn--toggle`).
- Sessions: show a dropped account as `.aui-rail-item.is-offline` + `.aui-rail-status`, an `.aui-chat-banner` with Reconnect, and failed sends as `.aui-msg--failed` + `.aui-msg-failed` row with Retry.
- Translation: incoming → `.aui-bubble-text` (translated) + `.aui-bubble-original` + `.aui-bubble-tr` with `data-aui-show-original`; outgoing auto-translation uses the same parts ("Sent in Vietnamese · Show sent text"); AI meaning in `.aui-bubble-explain`.
- Types the client cannot render yet: `.aui-bubble--unsupported` with "Open in <platform>".
