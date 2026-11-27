# Defaults recipes

Code for the rules in [SKILL.md](SKILL.md). Replace the literal values with the project's tokens where they exist.

## Contents

- [Scroll fade](#scroll-fade)
- [Room for shadows](#room-for-shadows)
- [Sideways scroll](#sideways-scroll)
- [Layered shadow](#layered-shadow)
- [Raised on hover](#raised-on-hover)
- [Image outline](#image-outline)
- [Theme switch](#theme-switch)
- [Hit area](#hit-area)
- [Mobile baseline](#mobile-baseline)
- [Hotkey guard](#hotkey-guard)
- [Loading delay](#loading-delay)
- [Sound](#sound)

## Scroll fade

```css
.scroller {
  overflow-y: auto;
  mask-image: linear-gradient(
    to bottom,
    transparent,
    black 24px,
    black calc(100% - 24px),
    transparent
  );
}
```

A horizontal scroller uses `to right`. Where content scrolls one way only, as in a chat log, fade only the end it scrolls toward.

## Room for shadows

```css
.scroller {
  overflow: auto;
  padding: 8px;
  margin: -8px;
}
```

The padding gives each child shadow room inside the clip. The negative margin keeps the content aligned with its neighbours.

## Sideways scroll

```css
.code,
.table {
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
}

.code::-webkit-scrollbar,
.table::-webkit-scrollbar {
  display: none;
}
```

Add the horizontal scroll fade, so the hidden scrollbar still shows that more content exists.

## Layered shadow

```css
.card {
  border: 1px solid transparent;
  box-shadow:
    0 0 0 1px var(--gray-a4),
    0 1px 2px rgba(0, 0, 0, 0.06),
    0 4px 8px rgba(0, 0, 0, 0.04),
    0 12px 24px rgba(0, 0, 0, 0.03);
}
```

The first layer is the ring. Forced-colours mode removes every shadow, and the transparent border shows only there.

Every surface on the screen uses the same downward offsets. A dropdown and a modal step up one shared scale. They do not each invent a shadow.

## Raised on hover

```css
.card {
  position: relative;
}

.card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0.23, 1, 0.32, 1);
  pointer-events: none;
}

@media (hover: hover) and (pointer: fine) {
  .card:hover::after {
    opacity: 1;
  }
}
```

The pseudo-element does not render without `content: ""`. It covers the wrong box without `position: relative` on the parent.

## Image outline

```css
.content-image {
  outline: 1px solid rgba(0, 0, 0, 0.1);
  outline-offset: -1px;
}

@media (prefers-color-scheme: dark) {
  .content-image {
    outline-color: rgba(255, 255, 255, 0.1);
  }
}
```

Use the project's dark-mode selector in place of the media query. Keep the outline pure black or pure white. A tinted neutral shows as a coloured fringe.

## Theme switch

```ts
export function setTheme(theme: "light" | "dark") {
  const style = document.createElement("style");
  style.textContent = "*, *::before, *::after { transition: none !important; }";
  document.head.appendChild(style);

  document.documentElement.dataset.theme = theme;
  void window.getComputedStyle(document.body).opacity;

  requestAnimationFrame(() => style.remove());
}
```

The read of a computed style forces the new theme to apply before transitions return. When the project uses a theme library, use its option for this.

## Hit area

```css
.icon-button {
  position: relative;
}

.icon-button::before {
  content: "";
  position: absolute;
  inset: -8px;
}
```

On a 16px glyph, `inset: -12px` gives a 40px target, and `-14px` gives 44px for touch. Shrink the inset where it would overlap the hit area of a neighbour.

## Mobile baseline

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
```

```css
html {
  -webkit-tap-highlight-color: transparent;
  -webkit-text-size-adjust: 100%;
}

button,
a,
[role="button"] {
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
}

.app {
  height: 100dvh;
}

.tab-bar {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

Match each `theme-color` to the top of the page, not to the brand colour. Leave `user-select` alone on links inside prose, because people copy that text.

## Hotkey guard

```ts
function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || target.matches("input, textarea, select");
}

window.addEventListener("keydown", (event) => {
  if (isTyping(event.target)) return;
  handleHotkey(event);
});
```

When the project uses a hotkey library, use its option to ignore form fields.

## Loading delay

```tsx
export function useLoadingVisible(loading: boolean, delay = 200, minimum = 400) {
  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        shownAt.current = Date.now();
        setVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
    const remaining = minimum - (Date.now() - shownAt.current);
    const timer = setTimeout(() => setVisible(false), Math.max(0, remaining));
    return () => clearTimeout(timer);
  }, [loading, delay, minimum]);

  return visible;
}
```

A response faster than `delay` shows no skeleton. A response that crosses `delay` keeps the skeleton up for `minimum`, so it does not flash.

## Sound

### Playback from files

```ts
const cues = {
  success: new Audio("/sounds/success.mp3"),
};

Object.values(cues).forEach((audio) => audio.load());

export function playCue(
  cue: keyof typeof cues,
  settings: { enabled: boolean; volume: number },
) {
  if (!settings.enabled) return;
  const audio = cues[cue];
  audio.volume = settings.volume;
  audio.currentTime = 0;
  void audio.play();
}
```

Preload at startup. Reset `currentTime`, so the user hears a second trigger. A cue lasts about as long as its action, near 50ms for a press. A toggle gets a soft click, a purchase gets a short chime, and an error gets a quiet cue, not a buzzer.

### A synthesized click

```ts
let context: AudioContext | null = null;

export async function playClick(volume = 0.3) {
  context ??= new AudioContext();
  const ctx = context;
  if (ctx.state === "suspended") await ctx.resume();

  const length = Math.floor(ctx.sampleRate * 0.008);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 4000;
  filter.Q.value = 3;

  const gain = ctx.createGain();
  const t = ctx.currentTime;
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.008);

  source.connect(filter).connect(gain).connect(ctx.destination);
  source.onended = () => {
    source.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
  source.start(t);
}
```

- One `AudioContext` serves the page.
- Ramp the decay exponentially to `0.001`. A ramp to `0` throws.
- A click is 5 to 15ms of noise through a bandpass at 3000 to 6000Hz, with a Q of 2 to 5 and gain at or under `1`.
- A confirmation tone is an oscillator whose pitch moves, such as 400 to 600Hz over 40ms.

When the user describes a sound, translate the word into a parameter:

| The user says | Change |
| --- | --- |
| Harsh | Lower the frequency or the Q |
| Muffled | Raise the frequency |
| Too long | Shorten the buffer |
