# Motion recipes

Code for the rules in [SKILL.md](SKILL.md). Replace the literal values with the project's tokens where they exist. The motion blur recipes are in [motion-blur.md](motion-blur.md).

## Contents

- [Route transitions](#route-transitions)
- [Curves and durations](#curves-and-durations)
- [Drag release](#drag-release)
- [Flick to dismiss](#flick-to-dismiss)
- [Icon swap](#icon-swap)
- [Icon morph](#icon-morph)
- [Exits](#exits)
- [Container bounds](#container-bounds)

## Route transitions

```tsx
<AnimatePresence initial={false} mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15, ease: [0.77, 0, 0.175, 1] }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

The page animates `opacity` only, with no `x`, `y` or `scale`. `initial={false}` renders the first page in place, so only later switches fade.

## Curves and durations

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}
```

| Motion | Duration | Curve |
| --- | --- | --- |
| Hover colour | Instant | None |
| Press and hover movement | `150ms` | `--ease-out` |
| Tooltip | `125ms` | `--ease-out` |
| Toggle or small state change | `200ms` | `--ease-out` |
| Modal or popover, entering | `200ms` | `--ease-out` |
| Modal or popover, leaving | `150ms` | `--ease-out` |
| Panel or drawer, entering | `400ms` | `--ease-drawer` |
| Panel or drawer, leaving | `350ms` | `--ease-drawer` |
| Staged entrance | `100ms` between parts | `--ease-out` |
| Page change under `mode="wait"` | `150ms` each way | `--ease-in-out` |
| Toast | `200ms` | `--ease-out` |
| Progress bar | `100ms` per step | `linear` |
| Drag release | Spring | `stiffness: 500, damping: 30` |

In Motion, pass a curve as an array, such as `ease: [0.23, 1, 0.32, 1]`.

Give similar controls one duration. A spring that visibly oscillates is too loose, for example `stiffness: 1000` with `damping: 5`.

## Drag release

```tsx
const x = useMotionValue(0);

function onDragEnd(_: PointerEvent, info: PanInfo) {
  animate(x, 0, {
    type: "spring",
    stiffness: 500,
    damping: 30,
    velocity: info.velocity.x,
  });
}

<motion.div drag="x" style={{ x }} onDragEnd={onDragEnd} />;
```

Use this for a release that your code animates. The built-in `drag` inertia carries velocity already.

## Flick to dismiss

```ts
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 0.11;

function shouldDismiss(distance: number, startedAt: number) {
  const velocity = Math.abs(distance) / (Date.now() - startedAt);
  return Math.abs(distance) >= DISMISS_DISTANCE || velocity > DISMISS_VELOCITY;
}

function dampen(overshoot: number) {
  return Math.sign(overshoot) * Math.sqrt(Math.abs(overshoot)) * 4;
}
```

Pass the distance dragged past a boundary through `dampen`, so the sheet slows and does not stop. Call `setPointerCapture` on pointer-down. Ignore a second pointer while one drags.

## Icon swap

```tsx
<AnimatePresence mode="popLayout" initial={false}>
  <motion.span
    key={copied ? "check" : "copy"}
    initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
  >
    {copied ? <CheckIcon /> : <CopyIcon />}
  </motion.span>
</AnimatePresence>
```

Keep `bounce` at `0`. Without a motion library, keep both icons in the DOM. Cross-fade them over `300ms` with `cubic-bezier(0.2, 0, 0, 1)`.

An icon that changes on every hover or tab switch swaps instantly, because that action is frequent.

## Icon morph

```tsx
const reduce = useReducedMotion();
const paths = copied ? checkPaths : copyPaths;

<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
  {paths.map((d, index) => (
    <motion.path
      key={index}
      initial={false}
      animate={{ d }}
      transition={reduce ? { duration: 0 } : { duration: 0.24, ease: [0.77, 0, 0.175, 1] }}
    />
  ))}
</svg>
```

Both icons share one morph form, so path `index` in one icon meets path `index` in the other. Key each path by its index. A key by icon remounts the paths, and they do not morph.

Under reduced motion, wrap the swap in the cross-fade from [icon swap](#icon-swap). Without a motion library, use `transition: d 240ms cubic-bezier(0.77, 0, 0.175, 1)`. Browsers that do not animate `d` swap at once.

## Exits

```tsx
<AnimatePresence mode="popLayout">
  {items.map((item) => (
    <motion.li
      key={item.id}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 0.96,
        transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
      }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
    />
  ))}
</AnimatePresence>
```

- Key by id. A key by index makes the wrong item exit.
- A list that reorders uses `mode="popLayout"`, so the item that leaves drops out of flow. Under `mode="sync"`, take that item out of flow yourself.
- A nested `AnimatePresence` sets `propagate`. Without it, the children vanish when the parent exits. Keep the exit durations of parent and child close.
- Inside a child that exits, `useIsPresent` turns off interaction, as in `disabled={!isPresent}`.
- Async cleanup uses `usePresence` and calls `safeToRemove` when it finishes.

## Container bounds

```tsx
function AnimatedHeight({ children }: { children: React.ReactNode }) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return (
    <motion.div
      animate={{ height: height > 0 ? height : "auto" }}
      transition={{ duration: 0.2, delay: 0.05 }}
      style={{ overflow: "hidden" }}
    >
      <div ref={setNode}>{children}</div>
    </motion.div>
  );
}
```

The callback ref attaches the observer when the node mounts. The `"auto"` guard stops the first frame from growing out of zero.

When the outer node collapses to `0`, give the inner node its open size, such as `width: 256px`. Its content then does not reflow. Use this recipe for content that changes size, such as a label swap or an accordion. A static section does not need it.
