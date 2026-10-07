# Armsys UI in Laravel (Blade / Vite / Livewire)

## With Vite

```bash
npm install @armsys-tech/ui
```
```js
// resources/js/app.js
import '@armsys-tech/ui/css';
import ArmsysUI from '@armsys-tech/ui';
window.ArmsysUI = ArmsysUI;
```

## Blade layout

```blade
<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ $title ?? config('app.name') }}</title>
  @vite(['resources/js/app.js'])
</head>
<body class="aui" data-aui-theme="{{ request()->cookie('theme', 'dark') }}">
  @yield('content')
  @if (session('status'))
    <script>addEventListener('DOMContentLoaded', () => ArmsysUI.toast(@json(['title' => session('status'), 'variant' => 'success'])))</script>
  @endif
</body>
</html>
```

## Validation errors

```blade
<div class="aui-field">
  <label class="aui-label" for="email">Email</label>
  <input class="aui-input @error('email') is-invalid @enderror" id="email" name="email" value="{{ old('email') }}">
  @error('email')<p class="aui-help is-error">{{ $message }}</p>@enderror
</div>
```

## Deletes with confirmation

```blade
<form method="POST" action="{{ route('servers.destroy', $server) }}">
  @csrf @method('DELETE')
  <button class="aui-btn aui-btn--soft aui-btn--danger" data-aui-confirm="Delete {{ $server->name }}?" data-aui-confirm-message="This cannot be undone.">Delete</button>
</form>
```

Livewire morphs DOM in place; behaviours are delegated, and newly inserted widgets (OTP, tags, enhanced selects) are initialised by the observer. Add `wire:ignore` to enhanced `<select data-aui-select>` elements so Livewire does not overwrite the generated combobox.
