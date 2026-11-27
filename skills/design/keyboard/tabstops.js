// Run in the page before walking it with the keyboard (DevTools console, Runtime.evaluate or page.evaluate).
// Returns { unreachable, positiveTabindex } at once, then records every focus stop while keys are pressed.
// Read window.__keyboard.stops after the walk. Call window.__keyboard.highlight() to number the stops on the page.
(() => {
  window.__keyboard?.dispose();

  const focusable =
    "a[href], area[href], button, input:not([type=hidden]), select, textarea, summary, iframe, [tabindex], [contenteditable]:not([contenteditable=false])";

  const describe = (el) => {
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

  // A rough accessible name. Confirm it in the accessibility tree before reporting.
  const nameOf = (el) => {
    const text = (value) => (value ?? "").trim().replace(/\s+/g, " ");
    if (el.getAttribute("aria-label")) return text(el.getAttribute("aria-label"));
    const labelledBy = el.getAttribute("aria-labelledby");
    if (labelledBy) {
      return text(labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent).join(" "));
    }
    if (el.labels?.length) return text([...el.labels].map((label) => label.textContent).join(" "));
    const alt = el.querySelector("img[alt]")?.getAttribute("alt");
    return text(el.textContent) || text(alt) || text(el.getAttribute("title")) || text(el.placeholder);
  };

  const roleOf = (el) => el.getAttribute("role") ?? el.tagName.toLowerCase();

  const hasRing = (el) => {
    const style = getComputedStyle(el);
    const outline = style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) > 0;
    return outline || style.boxShadow !== "none";
  };

  const isVisible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && Number(style.opacity) > 0.05;
  };

  const onScreen = (rect) =>
    rect.right > 0 && rect.bottom > 0 && rect.left < innerWidth && rect.top < innerHeight;

  const stops = [];

  const onFocusIn = (event) => {
    const el = event.target;
    if (!(el instanceof Element)) return;
    const rect = el.getBoundingClientRect();
    stops.push({
      stop: stops.length + 1,
      where: describe(el),
      role: roleOf(el),
      name: nameOf(el),
      tabIndex: el.tabIndex,
      ring: hasRing(el),
      visible: isVisible(el),
      onScreen: onScreen(rect),
      rect: {
        x: Math.round(rect.x + scrollX),
        y: Math.round(rect.y + scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      element: el,
    });
  };

  const onFocusOut = (event) => {
    if (event.relatedTarget) return;
    const from = describe(event.target);
    setTimeout(() => {
      if (document.hasFocus() && document.activeElement === document.body) {
        stops.push({ stop: stops.length + 1, lost: true, from });
      }
    });
  };

  document.addEventListener("focusin", onFocusIn, true);
  document.addEventListener("focusout", onFocusOut, true);

  // Topmost pointer targets with no way in from the keyboard.
  const unreachable = [...document.body.querySelectorAll("*")]
    .filter((el) => {
      if (el.closest("svg") || el.matches("label, :disabled") || !isVisible(el)) return false;
      if (getComputedStyle(el).cursor !== "pointer") return false;
      if (el.parentElement && getComputedStyle(el.parentElement).cursor === "pointer") return false;
      if (el.matches(focusable) || el.closest(focusable) || el.querySelector(focusable)) return false;
      return true;
    })
    .map((el) => ({ where: describe(el), name: nameOf(el) }));

  const positiveTabindex = [...document.querySelectorAll("[tabindex]")]
    .filter((el) => el.tabIndex > 0)
    .map((el) => ({ where: describe(el), tabIndex: el.tabIndex }));

  window.__keyboard = {
    get stops() {
      return stops.map(({ element, ...stop }) => stop);
    },
    highlight() {
      document.querySelectorAll("[data-keyboard-overlay]").forEach((node) => node.remove());
      for (const stop of stops) {
        if (stop.lost) continue;
        const mark = document.createElement("div");
        mark.dataset.keyboardOverlay = "";
        Object.assign(mark.style, {
          position: "absolute",
          left: `${stop.rect.x}px`,
          top: `${stop.rect.y}px`,
          width: `${stop.rect.width}px`,
          height: `${stop.rect.height}px`,
          outline: `1px solid ${stop.ring ? "#0a84ff" : "#ff2d55"}`,
          zIndex: 2147483647,
          pointerEvents: "none",
          font: "600 11px/16px system-ui",
          color: "#fff",
        });
        const label = document.createElement("span");
        label.textContent = String(stop.stop);
        Object.assign(label.style, {
          position: "absolute",
          top: "-16px",
          left: "-1px",
          padding: "0 4px",
          background: stop.ring ? "#0a84ff" : "#ff2d55",
        });
        mark.append(label);
        document.body.append(mark);
      }
    },
    clear() {
      document.querySelectorAll("[data-keyboard-overlay]").forEach((node) => node.remove());
    },
    dispose() {
      this.clear();
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("focusout", onFocusOut, true);
    },
  };

  return { unreachable, positiveTabindex };
})();
