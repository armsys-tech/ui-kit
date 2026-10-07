# Armsys UI with Vue 3 / Nuxt

Armsys UI is plain classes + `data-aui-*` attributes, so there is no component wrapper to install. Import it once; a `MutationObserver` initialises anything Vue renders later (`v-if`, router views, teleports).

## Vite / Vue 3

```js
// main.js
import { createApp } from 'vue';
import '@armsys-tech/ui/css';          // dist/armsys-ui.css
import ArmsysUI from '@armsys-tech/ui'; // dist/armsys-ui.mjs (auto-inits in the browser)
import App from './App.vue';

const app = createApp(App);
app.config.globalProperties.$aui = ArmsysUI; // optional: this.$aui.toast(...)
app.mount('#app');
```

`index.html`: `<body class="aui">` (or put `class="aui"` on the root element of your app).

## Using it in components

```vue
<script setup>
import { ref } from 'vue';
import ArmsysUI from '@armsys-tech/ui';

const region = ref('tr');
async function remove(server) {
  const ok = await ArmsysUI.confirm({ title: `Delete ${server.name}?`, message: 'All clients are removed.', variant: 'danger', confirmText: 'Delete' });
  if (!ok) return;
  await api.delete(server.id);
  ArmsysUI.toast({ title: 'Server deleted', variant: 'success' });
}
const open = () => ArmsysUI.openModal('#new-server');
</script>

<template>
  <select class="aui-select" data-aui-select v-model="region">
    <option value="tr">Türkiye</option><option value="jp">Japan</option>
  </select>
  <button class="aui-btn aui-btn--primary" @click="open">Add server</button>
  <button class="aui-btn aui-btn--soft aui-btn--danger" @click="remove(server)">Delete</button>

  <dialog class="aui-modal" id="new-server" @aui:closed="onClosed">…</dialog>
</template>
```

- Custom events are regular DOM events: `@aui:closed`, `@aui:complete` (OTP), `@aui:change` (tags), `@aui:select` (menu items).
- `v-model` works on enhanced selects (`data-aui-select`) because the native `<select>` stays in the DOM. If you replace the options list, the observer refreshes the combobox; you can also call `ArmsysUI.refreshSelect(el)`.
- Prefer `ArmsysUI.openModal/closeModal` over toggling `open` yourself so animations and scroll-lock stay correct.
- Icons: `<svg class="aui-icon"><use href="#aui-i-server"/></svg>` — the sprite is injected once.

## Nuxt 3

```ts
// nuxt.config.ts
export default defineNuxtConfig({ css: ['@armsys-tech/ui/css'], app: { head: { bodyAttrs: { class: 'aui' } } } });
```
```ts
// plugins/armsys-ui.client.ts — client only (the module is SSR-safe, but behaviours need the DOM)
import ArmsysUI from '@armsys-tech/ui';
export default defineNuxtPlugin(() => ({ provide: { aui: ArmsysUI } }));
```
