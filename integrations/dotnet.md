# Armsys UI in ASP.NET Core (MVC / Razor Pages / Blazor)

## Files

Either reference the CDN, or install with LibMan / npm and serve from `wwwroot/lib/armsys-ui/`:

```json
// libman.json
{ "libraries": [ { "provider": "jsdelivr", "library": "@armsys-tech/ui@2.0.1", "destination": "wwwroot/lib/armsys-ui/", "files": ["dist/armsys-ui.min.css", "dist/armsys-ui.min.js"] } ] }
```

## _Layout.cshtml

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>@ViewData["Title"] — Console</title>
  <link rel="stylesheet" href="~/lib/armsys-ui/dist/armsys-ui.min.css" asp-append-version="true">
  <script src="~/lib/armsys-ui/dist/armsys-ui.min.js" defer asp-append-version="true"></script>
</head>
<body class="aui" data-aui-theme="@(Context.Request.Cookies["theme"] ?? "dark")">
  <div class="aui-app">
    <partial name="_Sidebar" />
    <div class="aui-app-main">
      <partial name="_Topbar" />
      <main class="aui-app-content">@RenderBody()</main>
    </div>
  </div>
  @if (TempData["Toast"] is string toast)
  {
    <script>addEventListener('DOMContentLoaded', () => ArmsysUI.toast(@Json.Serialize(new { title = toast, variant = "success" })));</script>
  }
  @await RenderSectionAsync("Scripts", required: false)
</body>
</html>
```

## Forms & validation

Tag helpers add `input-validation-error`; map it to Armsys UI once:

```html
<div class="aui-field">
  <label asp-for="Email" class="aui-label"></label>
  <input asp-for="Email" class="aui-input">
  <span asp-validation-for="Email" class="aui-help is-error"></span>
</div>
```
```css
.aui .input-validation-error { border-color: color-mix(in srgb, var(--aui-danger) 70%, transparent); }
```

Destructive posts: `<button class="aui-btn aui-btn--danger" type="submit" data-aui-confirm="Delete user?">Delete</button>` — the form submits only after confirmation.

## Blazor

Behaviours are delegated on `document` and the observer initialises re-rendered markup, so Blazor components can use the classes directly. Call JS APIs through interop: `await JS.InvokeVoidAsync("ArmsysUI.toast", new { title = "Saved", variant = "success" });`
