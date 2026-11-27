// Run in the page (DevTools console, Runtime.evaluate or page.evaluate).
// Returns { findings, unverified } with the contrast of each visible text run and field edge.
// Colours are composited over the backgrounds behind them before the ratio is read.
// Options: set window.__colorOptions = { root } before running.
// Call window.__color.highlight() afterwards to draw numbered overlays.
((options = {}) => {
  const root = options.root ?? document.body;
  const findings = [];
  const unverified = [];

  const pixel = document.createElement("canvas");
  pixel.width = 1;
  pixel.height = 1;
  const context = pixel.getContext("2d", { willReadFrequently: true });

  // Any CSS colour syntax, resolved to sRGB by drawing it.
  const parse = (value) => {
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.fillStyle = value;
    context.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  };

  const over = (top, bottom) => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  });

  const channel = (value) => {
    const s = value / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const luminance = ({ r, g, b }) =>
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  const ratio = (a, b) => {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (high + 0.05) / (low + 0.05);
  };

  const round = (value) => Math.round(value * 100) / 100;
  const hex = ({ r, g, b }) =>
    `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

  const probe = document.createElement("div");
  probe.style.cssText = "position:fixed;width:0;height:0;background-color:Canvas";
  document.documentElement.append(probe);
  const canvasColour = parse(getComputedStyle(probe).backgroundColor);
  probe.remove();

  const isVisible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    if (!rect.width || !rect.height || style.visibility === "hidden") return false;
    return !el.closest("[inert], svg");
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
    const text = (el.value || el.placeholder || el.textContent).trim().replace(/\s+/g, " ").slice(0, 40);
    return text ? `${parts.join(" > ")} "${text}"` : parts.join(" > ");
  };

  // The colour drawn behind an element, plus the opacity its own subtree is drawn at.
  const backdrop = (el, from = el) => {
    const layers = [];
    let opacity = 1;
    let image = false;
    for (let node = from; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.backgroundImage !== "none") image = true;
      const colour = parse(style.backgroundColor);
      if (colour.a > 0) layers.push(colour);
      if (colour.a >= 1) break;
      opacity *= Number(style.opacity);
    }
    let colour = canvasColour;
    for (const layer of layers.reverse()) colour = over(layer, colour);
    return { colour, opacity, image };
  };

  const add = (list, rule, el, detail, measured) => {
    const rect = el.getBoundingClientRect();
    list.push({
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

  const isLarge = (style) => {
    const size = Number.parseFloat(style.fontSize);
    return size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
  };

  const checkText = (el, colourValue, style, label) => {
    if (el.closest(":disabled, [aria-disabled='true']")) return;
    const ground = backdrop(el);
    const ink = parse(colourValue);
    const drawn = over({ ...ink, a: ink.a * ground.opacity }, ground.colour);
    const measured = ratio(drawn, ground.colour);
    const required = isLarge(style) ? 3 : 4.5;
    const values = {
      ratio: round(measured),
      required,
      text: hex(drawn),
      background: hex(ground.colour),
      fontSize: style.fontSize,
    };
    if (ground.image) {
      add(unverified, "color-scrim-under-text", el,
        `${label} sits over an image or gradient. Crop it and read the ratio at the lightest point`, values);
      return;
    }
    if (measured < required) {
      add(findings, "color-text-contrast", el,
        `${label} at ${round(measured)}:1, needs ${required}:1 (${hex(drawn)} on ${hex(ground.colour)})`, values);
    }
  };

  const seen = new Set();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const el = walker.currentNode.parentElement;
    if (!el || seen.has(el) || !walker.currentNode.textContent.trim()) continue;
    if (["SCRIPT", "STYLE", "TEMPLATE", "NOSCRIPT"].includes(el.tagName)) continue;
    seen.add(el);
    if (!isVisible(el)) continue;
    const style = getComputedStyle(el);
    checkText(el, style.color, style, "Text");
  }

  const fields = root.querySelectorAll(
    "input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]), textarea, select",
  );
  for (const field of fields) {
    if (!isVisible(field)) continue;
    const style = getComputedStyle(field);
    if (field.placeholder && !field.value) {
      checkText(field, getComputedStyle(field, "::placeholder").color, style, "Placeholder");
    }
    if (field.disabled || !field.parentElement) continue;
    const outside = backdrop(field, field.parentElement).colour;
    const fill = over(parse(style.backgroundColor), outside);
    const width = Number.parseFloat(style.borderBottomWidth) || 0;
    const edge = width ? over(parse(style.borderBottomColor), fill) : fill;
    const best = Math.max(ratio(fill, outside), ratio(edge, outside));
    if (best < 3) {
      add(findings, "color-ui-contrast", field,
        `Field edge at ${round(best)}:1 against its surround, needs 3:1. Confirm in a crop, a box-shadow ring is not measured`,
        { ratio: round(best), required: 3, fill: hex(fill), edge: hex(edge), surround: hex(outside) });
    }
  }

  window.__color = {
    findings,
    highlight() {
      document.querySelectorAll("[data-color-overlay]").forEach((node) => node.remove());
      findings.forEach((finding, index) => {
        const mark = document.createElement("div");
        mark.dataset.colorOverlay = "";
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
      document.querySelectorAll("[data-color-overlay]").forEach((node) => node.remove());
    },
  };

  const strip = (list) =>
    list.map(({ element, ...finding }, index) => ({ id: index + 1, ...finding }));
  return { findings: strip(findings), unverified: strip(unverified) };
})(window.__colorOptions);
