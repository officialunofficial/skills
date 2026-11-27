---
name: ask-sonner
description: Guides work with Sonner, the React toast library: mounting the Toaster, choosing the right toast() call, promise and loading toasts, updating, dismissing and persisting, styling, theming, icons, positioning and multiple toasters. Use when writing or debugging Sonner code, including toasts that never appear, appear twice, lose their styles, ignore Tailwind classes, sit behind a modal, or ignore dark mode.
license: MIT
metadata:
  upstream-author: "Emil Kowalski"
  upstream-source: "emilkowalski/skills"
---

# Ask Sonner

Answer Sonner questions from this file first. Read [API.md](API.md) when you need an exact prop name, type, or default.

## Setup

Sonner has two parts.

1. **One `<Toaster />`, mounted once**, as near the root as possible. In Next.js that is `layout.tsx`, and it works inside server components. A Toaster rendered per page or behind a condition goes missing, and a second mounted Toaster shows every toast twice.
2. **`toast()` called from client code**: event handlers, effects, callbacks. It is a plain function with no hook or provider. It does nothing on the server, so a server action returns its result and the client code that receives it calls `toast()`.

```jsx
import { Toaster } from 'sonner'; // once, in the layout
import { toast } from 'sonner';   // anywhere on the client
```

## Pick the call

| Goal | Call |
| --- | --- |
| Plain message | `toast('Title')`, with `{ description }` for a second line |
| Message with a status icon | `toast.success()`, `toast.error()`, `toast.info()`, `toast.warning()` |
| Spinner while you track state yourself | `toast.loading()`, then update it by id |
| Loading that resolves with a promise | `toast.promise(promise, { loading, success, error })`. `success` and `error` may be functions of the resolved value or the error |
| A button in the toast | `{ action: { label, onClick } }`. The click closes the toast unless `onClick` calls `event.preventDefault()`. `cancel` is the secondary button |
| Custom JSX inside the default shell | `toast(<jsx />)` |
| Custom JSX with no Sonner styles | `toast.custom((t) => <jsx />)`. `t` is the id, for dismissing |

## Recipes

**Update a toast.** Call `toast()` again with the same `id`. Only the props you pass change, and a typed call changes the type.

```jsx
const id = toast.loading('Uploading...');
toast.success('Uploaded', { id });
```

**Persist.** Pass `{ duration: Infinity }`.

**Dismiss.** `toast.dismiss(id)` closes one toast. `toast.dismiss()` closes all.

**Read active toasts.** Use `useSonner()` in React and `toast.getActiveToasts()` outside it.

**Links or components in the text.** Pass a function as the title or description: `toast(() => <a href="/doc">View</a>)`.

**Multiple toasters.** Give each Toaster an `id` and target one with `toast('Saved', { toasterId: 'canvas' })`. A toast with no `toasterId` renders in every Toaster.

**Close callbacks.** `onDismiss` fires for the close button and for a swipe. `onAutoClose` fires on timeout. No single callback covers both.

## Styling

Use the lowest level that achieves the change. For a design-system toast, go straight to level 4.

1. **Defaults.** Add `richColors` on the Toaster for coloured success and error toasts, or `invert` to flip against the theme.
2. **Inline styles.** `toastOptions={{ style }}` on the Toaster covers every toast. `style` on a `toast()` call covers one.
3. **Classes on parts.** `toastOptions={{ classNames: { toast, title, description, actionButton, cancelButton, closeButton } }}`. Sonner's injected styles win the cascade, so each class needs `!important` (Tailwind: `!text-red-900`). If more than a few classes need it, move to level 4.
4. **Headless.** `toast.custom()` renders your JSX and keeps Sonner's positioning, stacking, and swipe. Wrap it in your own `toast()` function. `unstyled: true` is a halfway option that gives less control for the same effort.

**Icons.** The Toaster's `icons` prop replaces the default per type. `icon` on a call replaces one. `null` removes it.

**Theme.** `theme` defaults to `'light'` and does not follow the OS. Pass `theme="system"`, or pass the resolved theme from your provider, such as `<Toaster theme={resolvedTheme} />` with `next-themes`.

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Toast never appears | No Toaster is mounted, or it unmounted. Mount one at the root. In a server action, return the result and call `toast()` on the client |
| Toast appears twice | Two Toasters are mounted, often layout and page. Keep one. Or an effect fired twice under React StrictMode in development: call from the event handler, or pass a stable `id` so the second call updates the first |
| Tailwind or CSS classes do nothing | The default styles override them. Add `!important`, or go headless |
| Toasts fully unstyled (common in Astro and with view transitions) | The injected stylesheet was lost. Import it in a layout: `import 'sonner/dist/styles.css'` |
| Unstyled inside Shadow DOM | Styles go to `document.head`. Copy the style tag whose text contains `[data-sonner-toaster]` into the shadow root |
| Toast behind a modal, or clipped | An ancestor creates a stacking context (`transform`, `filter`, `overflow`), or the overlay has a higher z-index. Move the Toaster to the document root, outside any dialog or portal container |
| Dark mode ignored | `theme` defaults to `'light'`. Set `theme="system"` or pass the resolved theme |
| Success and error look gray | That is the default. Add `richColors` |
| Toast never closes | `duration: Infinity`, `dismissible: false`, or a `toast.promise` whose promise never settles |
| `toast.promise` stuck on loading | The first argument must be a promise, or a function that returns one, and it must resolve or reject |
| Swipe goes the wrong way or does nothing | Swipe directions follow `position`. Set `swipeDirections` on the Toaster |
| Toast shows in every Toaster | Give each Toaster an `id` and pass `toasterId` in the call |
| Toasts too close to the edge on mobile | `offset` (default 32px) and `mobileOffset` (below 600px wide, default 16px). Each takes a number, a CSS string, or a per-side object |
