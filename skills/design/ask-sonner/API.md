# Sonner API

Prop names, types, and defaults. An option passed to `toast()` overrides the same option in the Toaster's `toastOptions`.

## `<Toaster />` props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `theme` | `string` | `'light'` | `'light'`, `'dark'`, or `'system'` |
| `richColors` | `boolean` | `false` | Stronger colours for success and error |
| `expand` | `boolean` | `false` | Show toasts expanded. When false they expand on hover |
| `visibleToasts` | `number` | `3` | How many toasts show at once |
| `id` | `string` | none | Name of this Toaster, matched by the `toasterId` option |
| `position` | `string` | `'bottom-right'` | `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right` |
| `closeButton` | `boolean` | `false` | Close button on every toast |
| `offset` | `string \| number \| object` | `'32px'` | Distance from the screen edges. The object form is per side: `{ bottom: '24px', right: '16px' }` |
| `mobileOffset` | `string \| number \| object` | `'16px'` | The offset below 600px of screen width |
| `swipeDirections` | `array` | from `position` | Directions that dismiss on swipe |
| `dir` | `string` | `'ltr'` | Text direction |
| `hotkey` | `string` | Alt/Option + T | Shortcut that focuses the toast area |
| `invert` | `boolean` | `false` | Dark toasts in light mode, light toasts in dark mode |
| `toastOptions` | `object` | none | Defaults for every toast. Takes any `toast()` option |
| `gap` | `number` | `14` | Space between expanded toasts |
| `icons` | `object` | none | Replacement icons: `{ success, info, warning, error, loading }`. `null` removes one |

## `toast()` options

`toast(message, options)` returns the toast id. `message` is a string, JSX, or a function that returns JSX.

| Option | Type | Default | Meaning |
| --- | --- | --- | --- |
| `description` | `ReactNode` | none | Second line under the title. Also takes a function that returns JSX |
| `closeButton` | `boolean` | `false` | Close button on this toast |
| `invert` | `boolean` | `false` | Inverted colours for this toast |
| `duration` | `number` | `4000` | Milliseconds before auto-close. `Infinity` keeps the toast |
| `position` | `string` | `'bottom-right'` | Position of this toast |
| `dismissible` | `boolean` | `true` | `false` stops the user from dismissing it |
| `icon` | `ReactNode` | none | Icon before the text. `null` removes the default |
| `action` | `ReactNode \| { label, onClick }` | none | Primary button. The click closes the toast unless `onClick` calls `event.preventDefault()` |
| `cancel` | `ReactNode \| { label, onClick }` | none | Secondary button. The click closes the toast |
| `actionButtonStyle` | `object` | `{}` | Inline styles for the action button |
| `cancelButtonStyle` | `object` | `{}` | Inline styles for the cancel button |
| `id` | `string` | none | Your own id. A second `toast()` with the same id updates the toast |
| `testId` | `string` | none | Rendered as `data-testid` |
| `toasterId` | `string` | none | The Toaster that renders this toast |
| `style` | `object` | none | Inline styles for the toast |
| `classNames` | `object` | none | Classes per part: `{ toast, title, description, actionButton, cancelButton, closeButton }`. Each needs `!important` unless `unstyled` is set |
| `unstyled` | `boolean` | `false` | Removes every default style |
| `onDismiss` | `(toast) => void` | none | Runs on a close-button click or a swipe |
| `onAutoClose` | `(toast) => void` | none | Runs when `duration` ends |
| `containerAriaLabel` | `string` | `'Notifications'` | ARIA label of the toast container |

## Functions

| Function | Purpose |
| --- | --- |
| `toast(message, opts?)` | Shows a toast and returns its id |
| `toast.success`, `.error`, `.info`, `.warning` `(message, opts?)` | Shows a toast with the matching icon |
| `toast.loading(message, opts?)` | Shows a spinner toast. Update it by id |
| `toast.promise(promise, { loading, success, error })` | Shows a loading toast that settles with the promise. `success` and `error` take a string, JSX, a function of the result, or an object of toast options |
| `toast.custom((t) => jsx, opts?)` | Headless toast: your JSX, Sonner's behaviour |
| `toast.dismiss(id?)` | Closes one toast, or all with no id |
| `toast.getActiveToasts()` | Returns the active toasts. Works outside React |
| `useSonner()` | React hook that returns `{ toasts }` |
