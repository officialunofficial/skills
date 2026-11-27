// Run in the page once per viewport (DevTools console, Runtime.evaluate or page.evaluate).
// Returns { viewport, pageOverflow, findings } for sideways overflow, clipped text and small targets.
// Options: set window.__viewportsOptions = { root, minTarget } before running.
// Call window.__viewports.highlight() afterwards to draw numbered overlays.
((options = {}) => {
  const root = options.root ?? document.body;
  const minTarget = options.minTarget ?? 24;
  const findings = [];
  const width = document.documentElement.clientWidth;
  const round = (value) => Math.round(value * 10) / 10;
  const px = (value) => Number.parseFloat(value) || 0;

  const isVisible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    if (!rect.width || !rect.height || style.visibility === "hidden") return false;
    return !el.closest("[inert], [aria-hidden=true]");
  };

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
    const text = el.textContent.trim().replace(/\s+/g, " ").slice(0, 40);
    return text ? `${parts.join(" > ")} "${text}"` : parts.join(" > ");
  };

  const add = (rule, el, detail, measured) => {
    const rect = el.getBoundingClientRect();
    findings.push({
      rule,
      where: describe(el),
      detail,
      measured,
      rect: {
        x: Math.round(rect.x + scrollX),
        y: Math.round(rect.y + scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      element: el,
    });
  };

  const clipsX = (style) => ["hidden", "clip", "auto", "scroll"].includes(style.overflowX);

  const elements = [...root.querySelectorAll("*")].filter(
    (el) => !el.closest("svg") && !["SCRIPT", "STYLE", "TEMPLATE"].includes(el.tagName) && isVisible(el),
  );

  // 1. Sideways scroll: the outermost elements past the right edge that no ancestor clips.
  const pageOverflow = document.documentElement.scrollWidth - width;
  if (pageOverflow > 0) {
    const culprits = elements.filter((el) => {
      if (el.getBoundingClientRect().right <= width + 1) return false;
      if (getComputedStyle(el).position === "fixed") return false;
      for (let node = el.parentElement; node && node !== document.documentElement; node = node.parentElement) {
        if (clipsX(getComputedStyle(node))) return false;
      }
      return true;
    });
    for (const el of culprits) {
      if (culprits.some((other) => other !== el && other.contains(el))) continue;
      const right = el.getBoundingClientRect().right;
      add("viewports-no-sideways-scroll", el,
        `Ends ${round(right - width)}px past the ${width}px viewport`,
        { right: round(right), viewport: width });
    }
  }

  // 2. Clipped text: text cut by a clipping box with no ellipsis or line clamp.
  for (const el of elements) {
    const style = getComputedStyle(el);
    const hasText = [...el.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim());
    if (!hasText) continue;
    const cutX = ["hidden", "clip"].includes(style.overflowX) && el.scrollWidth > el.clientWidth + 1 &&
      style.textOverflow !== "ellipsis";
    const cutY = ["hidden", "clip"].includes(style.overflowY) && el.scrollHeight > el.clientHeight + 1 &&
      (style.webkitLineClamp ?? "none") === "none";
    if (cutX || cutY) {
      add("viewports-no-clipped-text", el,
        `Text cut ${cutX ? "sideways" : "at the bottom"}: ${cutX ? el.scrollWidth : el.scrollHeight}px of content in ${cutX ? el.clientWidth : el.clientHeight}px`,
        { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight });
    }
  }

  // 3. Small targets: the box plus any absolutely placed pseudo-element that extends it.
  const targets = elements.filter((el) =>
    el.matches("a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab], [role=checkbox], [role=switch], [role=menuitem]"),
  );
  for (const el of targets) {
    const style = getComputedStyle(el);
    if (el.matches("a") && style.display === "inline") continue;
    const rect = el.getBoundingClientRect();
    let w = rect.width;
    let h = rect.height;
    for (const pseudo of ["::before", "::after"]) {
      const p = getComputedStyle(el, pseudo);
      if (p.content === "none" || p.position !== "absolute") continue;
      w = Math.max(w, rect.width - Math.min(px(p.left), 0) - Math.min(px(p.right), 0));
      h = Math.max(h, rect.height - Math.min(px(p.top), 0) - Math.min(px(p.bottom), 0));
    }
    if (Math.min(w, h) < minTarget) {
      add("defaults-hit-area", el,
        `Target ${round(w)} by ${round(h)}px, under ${minTarget}px`,
        { width: round(w), height: round(h) });
    }
  }

  window.__viewports = {
    findings,
    highlight() {
      document.querySelectorAll("[data-viewports-overlay]").forEach((node) => node.remove());
      findings.forEach((finding, index) => {
        const mark = document.createElement("div");
        mark.dataset.viewportsOverlay = "";
        Object.assign(mark.style, {
          position: "absolute",
          left: `${finding.rect.x}px`,
          top: `${finding.rect.y}px`,
          width: `${finding.rect.width}px`,
          height: `${finding.rect.height}px`,
          outline: "1px solid #ff2d55",
          zIndex: 2147483647,
          pointerEvents: "none",
          font: "600 11px/16px system-ui",
          color: "#fff",
        });
        const label = document.createElement("span");
        label.textContent = String(index + 1);
        Object.assign(label.style, {
          position: "absolute",
          top: "-16px",
          left: "-1px",
          padding: "0 4px",
          background: "#ff2d55",
        });
        mark.append(label);
        document.body.append(mark);
      });
    },
    clear() {
      document.querySelectorAll("[data-viewports-overlay]").forEach((node) => node.remove());
    },
  };

  return {
    viewport: { width, height: document.documentElement.clientHeight },
    pageOverflow: Math.max(pageOverflow, 0),
    findings: findings.map(({ element, ...finding }, index) => ({ id: index + 1, ...finding })),
  };
})(window.__viewportsOptions);
