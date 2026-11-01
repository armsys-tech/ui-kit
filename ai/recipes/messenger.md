# Recipe — Messenger (WhatsApp / Telegram style desktop client)

Use for: chat clients, support inboxes, team messaging, anything with a conversation list, a message thread and calls.
Reference implementation: `examples/messenger.html` (Electron shell + three panes + call modal).

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
