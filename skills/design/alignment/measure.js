// Run in the page (DevTools console, Runtime.evaluate or page.evaluate).
// Returns { findings } measured from the rendered layout and the glyph ink.
// Options: set window.__alignmentOptions = { root, scale, tolerance } before running.
((options = {}) => {
  const root = options.root ?? document.body;
  const scale = options.scale ?? 4;
  const tolerance = options.tolerance ?? 4;
  const findings = [];
  const canvas = document.createElement("canvas").getContext("2d");

  const round = (value) => Math.round(value * 10) / 10;

  const isVisible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    if (!rect.width || !rect.height || style.visibility === "hidden") return false;
    if (el.closest("[inert]")) return false;
    for (let node = el; node; node = node.parentElement) {
      if (Number(getComputedStyle(node).opacity) < 0.05) return false;
    }
    return true;
  };

  const hasSurface = (el) => {
    const style = getComputedStyle(el);
    return (
      style.backgroundColor !== "rgba(0, 0, 0, 0)" ||
      style.boxShadow !== "none" ||
      Number.parseFloat(style.borderTopWidth) > 0
    );
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

  const seen = new Set();
  const add = (rule, el, detail, measured) => {
    const key = `${rule} ${describe(el)} ${detail}`;
    if (seen.has(key)) return;
    seen.add(key);
    const rect = el.getBoundingClientRect();
    findings.push({
      rule,
      where: describe(el),
      detail,
      measured,
      rect: {
        x: round(rect.x + scrollX),
        y: round(rect.y + scrollY),
        width: round(rect.width),
        height: round(rect.height),
      },
    });
  };

  const fontOf = (style) =>
    `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

  // Ink box of a text node: where the glyphs draw, not the line box.
  const textInk = (node) => {
    const text = node.textContent.trim();
    if (!text) return null;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = [...range.getClientRects()];
    if (rects.length !== 1) return null;
    const [box] = rects;
    const style = getComputedStyle(node.parentElement);
    canvas.font = fontOf(style);
    const metrics = canvas.measureText(text);
    const cap = canvas.measureText("H").actualBoundingBoxAscent;
    const lead = node.textContent.length - node.textContent.trimStart().length;
    const offset = lead ? canvas.measureText(" ".repeat(lead)).width : 0;
    const baseline = box.top + metrics.fontBoundingBoxAscent;
    const left = box.left + offset - metrics.actualBoundingBoxLeft;
    return {
      left,
      right: box.left + offset + metrics.actualBoundingBoxRight,
      top: baseline - cap,
      bottom: baseline,
      centerY: baseline - cap / 2,
    };
  };

  // Ink box of an inline SVG: its drawn contents mapped to screen pixels.
  const svgInk = (svg) => {
    try {
      const box = svg.getBBox();
      const matrix = svg.getScreenCTM();
      if (!matrix || !box.width) return null;
      const a = new DOMPoint(box.x, box.y).matrixTransform(matrix);
      const b = new DOMPoint(box.x + box.width, box.y + box.height).matrixTransform(matrix);
      const stroke =
        (Number.parseFloat(getComputedStyle(svg).strokeWidth) || 0) * matrix.a * 0.5;
      return {
        left: Math.min(a.x, b.x) - stroke,
        right: Math.max(a.x, b.x) + stroke,
        top: Math.min(a.y, b.y) - stroke,
        bottom: Math.max(a.y, b.y) + stroke,
        centerY: (a.y + b.y) / 2,
        centerX: (a.x + b.x) / 2,
      };
    } catch {
      return null;
    }
  };

  const contentBox = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const px = (value) => Number.parseFloat(value) || 0;
    return {
      left: rect.left + px(style.borderLeftWidth),
      right: rect.right - px(style.borderRightWidth),
      top: rect.top + px(style.borderTopWidth),
      bottom: rect.bottom - px(style.borderBottomWidth),
      padding: {
        left: px(style.paddingLeft),
        right: px(style.paddingRight),
        top: px(style.paddingTop),
        bottom: px(style.paddingBottom),
      },
    };
  };

  const textNodes = (el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.textContent.trim() && isVisible(node.parentElement)) nodes.push(node);
    }
    return nodes;
  };

  const elements = [...root.querySelectorAll("*")].filter(
    (el) => !["SCRIPT", "STYLE", "TEMPLATE", "svg"].includes(el.tagName) &&
      !el.closest("svg") &&
      isVisible(el),
  );

  // 1. Shared edges: text start lines inside one surface that miss by a few px.
  const nearestSurface = (el) => {
    for (let node = el; node && node !== root; node = node.parentElement) {
      if (hasSurface(node)) return node;
    }
    return root;
  };

  for (const surface of elements.filter(hasSurface)) {
    const boxes = [];
    for (const node of textNodes(surface)) {
      if (nearestSurface(node.parentElement) !== surface) continue;
      const style = getComputedStyle(node.parentElement);
      if (style.textAlign === "center" || style.textAlign === "right") continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const [first] = range.getClientRects();
      if (first) boxes.push({ x: first.left, top: first.top, bottom: first.bottom, node });
    }
    // Only the first text on each line forms a left edge.
    const starts = boxes.filter((a) =>
      !boxes.some((b) => b !== a && b.x < a.x - 1 && b.top < a.bottom && b.bottom > a.top),
    );
    if (starts.length < 2) continue;
    const counts = new Map();
    for (const { x } of starts) counts.set(round(x), (counts.get(round(x)) ?? 0) + 1);
    const [line] = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
    for (const { x, node } of starts) {
      const off = x - line;
      if (Math.abs(off) >= 1 && Math.abs(off) <= tolerance) {
        add("alignment-shared-edge", node.parentElement,
          `Text starts ${round(Math.abs(off))}px ${off > 0 ? "right" : "left"} of the line the other text in this surface shares`,
          { offset: round(off), line: round(line) });
      }
    }
  }

  // 2. Even gaps: repeated siblings stacked or in a row with uneven spacing.
  for (const parent of elements) {
    const kids = [...parent.children].filter(isVisible);
    if (kids.length < 3) continue;
    const rects = kids.map((kid) => kid.getBoundingClientRect());
    const column = rects.every((rect, i) => i === 0 || rect.top >= rects[i - 1].bottom - 1);
    const row = rects.every((rect, i) => i === 0 || rect.left >= rects[i - 1].right - 1);
    if (!column && !row) continue;
    const tags = new Set(kids.map((kid) => kid.tagName + kid.className));
    if (tags.size > 2) continue;
    const gaps = rects.slice(1).map((rect, i) =>
      column ? rect.top - rects[i].bottom : rect.left - rects[i].right,
    );
    const spread = Math.max(...gaps) - Math.min(...gaps);
    if (spread >= 1 && spread <= 24) {
      add("alignment-even-gaps", parent,
        `${column ? "Stacked" : "Row of"} ${kids.length} siblings with gaps from ${round(Math.min(...gaps))} to ${round(Math.max(...gaps))}px`,
        { gaps: gaps.map(round) });
    }
  }

  // 3. On scale: spacing values that are not a multiple of the scale.
  const offScale = new Map();
  for (const el of elements) {
    const style = getComputedStyle(el);
    for (const prop of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "rowGap", "columnGap", "marginTop", "marginBottom"]) {
      const value = Number.parseFloat(style[prop]);
      if (!value || value <= 2 || value % scale === 0) continue;
      const key = `${prop} ${round(value)}px`;
      if (!offScale.has(key)) offScale.set(key, []);
      offScale.get(key).push(el);
    }
  }
  for (const [key, els] of offScale) {
    add("alignment-on-scale", els[0], `${key} is off the ${scale}px scale (${els.length} elements)`, { count: els.length });
  }

  // 4–6. Controls: ink centred in its box, icons level with labels, icon-only centring.
  const controls = elements.filter((el) => {
    const rect = el.getBoundingClientRect();
    return rect.height <= 56 && hasSurface(el) &&
      (el.matches("button, a, [role=button], [role=tab], [role=radio], label, input") ||
        el.children.length <= 3);
  });
  for (const el of controls) {
    const box = contentBox(el);
    const texts = textNodes(el).map(textInk).filter(Boolean);
    const icons = [...el.querySelectorAll("svg")].filter(isVisible).map(svgInk).filter(Boolean);
    if (texts.length > 1) continue;
    const parts = [...texts, ...icons];
    if (!parts.length) continue;
    const ink = {
      left: Math.min(...parts.map((p) => p.left)),
      right: Math.max(...parts.map((p) => p.right)),
      top: Math.min(...parts.map((p) => p.top)),
      bottom: Math.max(...parts.map((p) => p.bottom)),
    };
    const topInset = ink.top - box.top;
    const bottomInset = box.bottom - ink.bottom;
    if (Math.abs(topInset - bottomInset) >= 2) {
      add("alignment-ink-centre", el,
        `Ink sits ${round(Math.abs(topInset - bottomInset) / 2)}px ${topInset > bottomInset ? "low" : "high"}: ${round(topInset)}px above, ${round(bottomInset)}px below`,
        { above: round(topInset), below: round(bottomInset) });
    }
    if (box.padding.left === box.padding.right) {
      const left = ink.left - box.left;
      const right = box.right - ink.right;
      if (Math.abs(left - right) >= 2 && left < 48 && right < 48) {
        add("alignment-ink-centre", el,
          `Equal padding but ${round(left)}px of space on the left and ${round(right)}px on the right`,
          { left: round(left), right: round(right) });
      }
    }
    if (texts.length === 1 && icons.length === 1) {
      const off = icons[0].centerY - texts[0].centerY;
      if (Math.abs(off) >= 1) {
        add("alignment-icon-with-label", el,
          `Icon centre ${round(Math.abs(off))}px ${off > 0 ? "below" : "above"} the label's cap centre`,
          { offset: round(off) });
      }
    }
    if (!texts.length && icons.length === 1) {
      const offX = icons[0].centerX - (box.left + box.right) / 2;
      const offY = icons[0].centerY - (box.top + box.bottom) / 2;
      if (Math.abs(offX) >= 1 || Math.abs(offY) >= 1) {
        add("alignment-optical-glyph", el,
          `Icon box is ${round(offX)}px across and ${round(offY)}px down from centre. Confirm against the ink in a screenshot`,
          { x: round(offX), y: round(offY) });
      }
    }
  }

  // 7. Concentric radius: a nested surface's radius should be the outer radius minus the inset.
  for (const outer of elements.filter(hasSurface)) {
    const outerRadius = Number.parseFloat(getComputedStyle(outer).borderTopLeftRadius);
    if (!outerRadius) continue;
    const o = outer.getBoundingClientRect();
    for (const inner of [...outer.querySelectorAll("*")].filter((el) => hasSurface(el) && isVisible(el))) {
      const i = inner.getBoundingClientRect();
      if (i.width < o.width * 0.5) continue;
      const inset = Math.min(i.left - o.left, i.top - o.top);
      if (inset < 1 || inset > 16 || Math.abs(i.left - o.left - (i.top - o.top)) > 1) continue;
      const innerRadius = Number.parseFloat(getComputedStyle(inner).borderTopLeftRadius);
      if (innerRadius >= Math.min(i.width, i.height) / 2) continue;
      const expected = Math.max(outerRadius - inset, 0);
      if (innerRadius && Math.abs(innerRadius - expected) > 2) {
        add("alignment-concentric-radius", inner,
          `Radius ${round(innerRadius)}px inside a ${round(outerRadius)}px corner at ${round(inset)}px inset, expected about ${round(expected)}px`,
          { radius: round(innerRadius), expected: round(expected) });
      }
    }
  }

  return {
    findings: findings.map((finding, index) => ({ id: index + 1, ...finding })),
  };
})(window.__alignmentOptions);
