// Run in the page (DevTools console, Runtime.evaluate or page.evaluate).
// Call window.__avatarSheet.start({ selector, every, scale }), drive the moods with pointer events, then window.__avatarSheet.stop().
// stop() lays every sampled frame on one sheet, over the background the avatar sits on, and returns { frames, distinct }. clear() removes it.
// Keep the tab visible while sampling, or the browser throttles requestAnimationFrame and every frame repeats.
(() => {
  window.__avatarSheet?.clear();

  let timer = 0;
  let target = null;
  let startedAt = 0;
  let samples = [];
  let sheet = null;
  let scale = 4;
  let every = 100;

  const freeze = (svg, index) => {
    const copy = svg.cloneNode(true);
    const sources = [svg, ...svg.querySelectorAll("*")];
    const copies = [copy, ...copy.querySelectorAll("*")];
    sources.forEach((node, i) => {
      const style = getComputedStyle(node);
      copies[i].setAttribute("fill", style.fill);
      copies[i].setAttribute("opacity", style.opacity);
      copies[i].removeAttribute("class");
    });
    for (const node of copy.querySelectorAll("[id]")) {
      const from = `#${node.id}`;
      node.id = `${node.id}-sheet-${index}`;
      for (const el of copies) {
        for (const attr of [...el.attributes]) {
          if (attr.value.includes(from)) el.setAttribute(attr.name, attr.value.replaceAll(from, `#${node.id}`));
        }
      }
    }
    return copy;
  };

  const backdrop = (node) => {
    for (let el = node.parentElement; el; el = el.parentElement) {
      const colour = getComputedStyle(el).backgroundColor;
      if (colour !== "rgba(0, 0, 0, 0)" && colour !== "transparent") return colour;
    }
    return "#ffffff";
  };

  const sample = () => {
    const markup = target.outerHTML;
    samples.push({ at: Math.round(performance.now() - startedAt), markup, node: freeze(target, samples.length) });
  };

  window.__avatarSheet = {
    start({ selector, every: interval = 100, scale: size = 4 } = {}) {
      const found = document.querySelector(selector);
      if (!(found instanceof SVGSVGElement)) return `No <svg> matches ${selector}.`;
      clearInterval(timer);
      target = found;
      scale = size;
      every = interval;
      samples = [];
      startedAt = performance.now();
      sample();
      timer = setInterval(sample, every);
      return `Sampling every ${every}ms. Drive the moods, then call window.__avatarSheet.stop().`;
    },

    stop() {
      if (!target) return null;
      clearInterval(timer);
      sheet?.remove();

      const box = target.getBoundingClientRect();
      const width = Math.round(box.width * scale);
      const height = Math.round(box.height * scale);
      const background = backdrop(target);
      sheet = document.createElement("div");
      sheet.setAttribute("data-avatar-sheet", "");
      Object.assign(sheet.style, {
        position: "fixed",
        inset: "0",
        zIndex: "2147483647",
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, ${width + 24}px)`,
        gap: "8px",
        alignContent: "start",
        padding: "16px",
        overflow: "auto",
        background,
        font: "11px/1.2 ui-monospace, monospace",
        color: "#888888",
      });
      for (const { at, node } of samples) {
        const cell = document.createElement("div");
        Object.assign(cell.style, { display: "grid", justifyItems: "center", gap: "4px", padding: "12px 0 4px" });
        node.setAttribute("width", String(width));
        node.setAttribute("height", String(height));
        node.style.overflow = "visible";
        const label = document.createElement("span");
        label.textContent = `${at}ms`;
        cell.append(node, label);
        sheet.append(cell);
      }
      document.body.append(sheet);

      const distinct = new Set(samples.map(({ markup }) => markup)).size;
      const widestGap = Math.max(0, ...samples.slice(1).map(({ at }, i) => at - samples[i].at));
      const result = { frames: samples.length, distinct, widestGap };
      if (distinct < samples.length / 4) {
        result.warning = "Most frames repeat. The tab was hidden or the loop stalled, so sample again with the tab visible.";
      } else if (widestGap > every * 3) {
        result.warning = `Sampling slowed to ${widestGap}ms gaps, so the tab was hidden part of the time. Sample again with it visible.`;
      }
      target = null;
      return result;
    },

    clear() {
      clearInterval(timer);
      sheet?.remove();
      sheet = null;
      target = null;
      samples = [];
    },
  };

  return "Sheet ready. Call window.__avatarSheet.start({ selector }), drive the moods, then window.__avatarSheet.stop().";
})();
