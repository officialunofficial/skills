// Run in the page before the interaction (DevTools console, Runtime.evaluate or page.evaluate).
// Call window.__frames.start(), perform the interaction, then window.__frames.stop().
// stop() returns frame gaps, long animation frames, interaction latency and layout shift for that window.
// Keep the tab visible while recording, or the browser throttles requestAnimationFrame.
(() => {
  window.__frames?.stop();

  const round = (value) => Math.round(value * 10) / 10;

  const describe = (el) => {
    if (!(el instanceof Element)) return null;
    const parts = [];
    let node = el;
    while (node && node !== document.body && parts.length < 3) {
      let part = node.tagName.toLowerCase();
      const name = [...node.classList]
        .map((value) => value.split("__").pop())
        .find((value) => value.length > 1);
      if (node.id) part += `#${node.id}`;
      else if (name) part += `.${name}`;
      parts.unshift(part);
      node = node.parentElement;
    }
    return parts.join(" > ");
  };

  let running = false;
  let startedAt = 0;
  let last = 0;
  let gaps = [];
  let longFrames = [];
  let events = [];
  let shift = 0;
  let observers = [];

  const tick = (now) => {
    if (!running) return;
    if (last) gaps.push(now - last);
    last = now;
    requestAnimationFrame(tick);
  };

  const observe = (type, handle, extra = {}) => {
    if (!PerformanceObserver.supportedEntryTypes?.includes(type)) return false;
    const observer = new PerformanceObserver((list) => list.getEntries().forEach(handle));
    observer.observe({ type, ...extra });
    observers.push({ observer, handle });
    return true;
  };

  window.__frames = {
    start() {
      running = true;
      startedAt = performance.now();
      last = 0;
      gaps = [];
      longFrames = [];
      events = [];
      shift = 0;
      observers = [];
      const supported = {
        longAnimationFrame: observe("long-animation-frame", (entry) => {
          longFrames.push({
            at: round(entry.startTime - startedAt),
            duration: round(entry.duration),
            blocking: round(entry.blockingDuration),
            forcedLayout: round(
              entry.scripts.reduce((sum, script) => sum + script.forcedStyleAndLayoutDuration, 0),
            ),
            scripts: entry.scripts.map((script) => ({
              source: script.sourceURL,
              function: script.sourceFunctionName,
              invoker: script.invoker,
              duration: round(script.duration),
              forcedLayout: round(script.forcedStyleAndLayoutDuration),
            })),
          });
        }),
        event: observe("event", (entry) => {
          if (!entry.interactionId) return;
          events.push({
            id: entry.interactionId,
            name: entry.name,
            target: describe(entry.target),
            duration: entry.duration,
            inputDelay: entry.processingStart - entry.startTime,
            processing: entry.processingEnd - entry.processingStart,
            presentation: entry.startTime + entry.duration - entry.processingEnd,
          });
        }, { durationThreshold: 16 }),
        layoutShift: observe("layout-shift", (entry) => {
          if (!entry.hadRecentInput) shift += entry.value;
        }),
      };
      requestAnimationFrame(tick);
      return supported;
    },

    stop() {
      if (!running) return null;
      running = false;
      for (const { observer, handle } of observers) {
        observer.takeRecords().forEach(handle);
        observer.disconnect();
      }

      const sorted = [...gaps].sort((a, b) => a - b);
      const frame = sorted[Math.floor(sorted.length / 2)] ?? 1000 / 60;
      const dropped = gaps.reduce((count, gap) => count + Math.max(0, Math.round(gap / frame) - 1), 0);

      const interactions = new Map();
      for (const event of events) {
        const current = interactions.get(event.id);
        if (!current || event.duration > current.duration) interactions.set(event.id, event);
      }
      const slowest = [...interactions.values()]
        .sort((a, b) => b.duration - a.duration)
        .map(({ id, ...event }) => ({
          ...event,
          duration: round(event.duration),
          inputDelay: round(event.inputDelay),
          processing: round(event.processing),
          presentation: round(event.presentation),
        }));

      return {
        recorded: round(performance.now() - startedAt),
        refresh: Math.round(1000 / frame),
        budget: round(frame),
        frames: gaps.length,
        dropped,
        worstGap: round(sorted.at(-1) ?? 0),
        longAnimationFrames: longFrames.sort((a, b) => b.duration - a.duration),
        interactions: slowest,
        layoutShift: Math.round(shift * 1000) / 1000,
      };
    },
  };

  return "Recorder ready. Call window.__frames.start(), perform the interaction, then window.__frames.stop().";
})();
