// Face geometry, timing and behaviour for a flat character with two capsule eyes. No framework, no DOM.
// Copy beside the component. createAvatar({ head, pivot }) returns input handlers and step(dt), which returns the pose to write.
// head is { x, y, rx, ry }: the centre and radii of the face in SVG units. pivot is the point the body squashes and leans around.
// Gaze, eye proportions, spacing and blink timing are measured off reference footage, so keep them as written. Moods past idle are tuned.

const TAU = Math.PI * 2;
const AXES = ["yaw", "pitch", "roll"];
const EYE = ["w", "h", "tilt", "open"];

export const REST = { yaw: 24, pitch: 24, roll: -12 };

const pair = (w, h, tilt = 0, open = 1) => [
  { w, h, tilt, open },
  { w, h, tilt: -tilt, open },
];

// Eye width and height are fractions of the mean head radius. split is the angle between the eyes, in degrees.
export const FACES = {
  idle: { gaze: { yaw: 0, pitch: 0, roll: 0 }, split: 15.5, eyes: pair(0.296, 0.652) },
  attentive: { gaze: { yaw: 0, pitch: 0, roll: 0 }, split: 16, eyes: pair(0.326, 0.696) },
  excited: { gaze: { yaw: 0, pitch: -4, roll: 6 }, split: 19, eyes: pair(0.457, 0.848, -8) },
  happy: { gaze: { yaw: 0, pitch: 10, roll: 0 }, split: 17.5, eyes: pair(0.522, 0.217, 18) },
  sleepy: { gaze: { yaw: -6, pitch: -14, roll: 4 }, split: 15, eyes: pair(0.296, 0.652, 0, 0.4) },
  asleep: { gaze: { yaw: -8, pitch: -20, roll: 8 }, split: 15, eyes: pair(0.348, 0.652, 0, 0) },
};

// Seconds, except the chances, which are 0 to 1.
export const TIMING = {
  blink: 0.18,
  blinkClose: 0.45,
  blinkGap: [1.9, 4.6],
  doubleBlink: 0.18,
  glanceGap: [1.5, 4],
  glanceHold: [0.8, 1.8],
  wideGlance: 0.45,
  spin: 1.1,
  spinAfterAway: 6,
  hop: 0.75,
  happy: 1.4,
  sleepy: 24,
  asleep: 30,
  breath: 3.4,
  sleepBreath: 4.6,
  morph: 0.09,
  eyes: 0.06,
  body: 0.22,
  maxStep: 0.064,
};

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const ease = (dt, tau) => 1 - Math.exp(-dt / tau);
const radians = (value) => (value * Math.PI) / 180;
const degrees = (value) => (value * 180) / Math.PI;
const easeOutQuint = (t) => 1 - (1 - t) ** 5;
const round = (value) => Math.round(value * 1000) / 1000;

// Smooth noise from three sines. Use a different period and phase per channel so nothing repeats in step.
export function wave(t, period, phase) {
  const r = (t / period) * TAU;
  return (
    0.55 * Math.sin(r + phase) +
    0.3 * Math.sin(2 * r + phase * 1.7 + 1.1) +
    0.15 * Math.sin(3 * r + phase * 2.3 + 2.4)
  );
}

function turn(a, b, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [
    [a[0] * c + b[0] * s, a[1] * c + b[1] * s, a[2] * c + b[2] * s],
    [b[0] * c - a[0] * s, b[1] * c - a[1] * s, b[2] * c - a[2] * s],
  ];
}

// A capsule path centred on the origin.
export function capsule(w, h) {
  const r = Math.min(w, h) / 2;
  if (h >= w) {
    const y = h / 2 - r;
    return `M${round(-r)} ${round(-y)}a${round(r)} ${round(r)} 0 0 1 ${round(2 * r)} 0v${round(2 * y)}a${round(r)} ${round(r)} 0 0 1 ${round(-2 * r)} 0z`;
  }
  const x = w / 2 - r;
  return `M${round(-x)} ${round(r)}a${round(r)} ${round(r)} 0 0 1 0 ${round(-2 * r)}h${round(2 * x)}a${round(r)} ${round(r)} 0 0 1 0 ${round(2 * r)}z`;
}

// Projects both eyes onto a sphere behind the face. lid is 1 open to 0 shut.
// Returns [{ d, transform, opacity }] for two <path> elements inside a clipPath of the body.
export function drawEyes(face, gaze, lid, head) {
  const r = (head.rx + head.ry) / 2;
  let forward = [0, 0, 1];
  let right = [1, 0, 0];
  let up = [0, 1, 0];
  [forward, right] = turn(forward, right, radians(gaze.yaw));
  [up, forward] = turn(up, forward, radians(gaze.pitch));
  [right, up] = turn(right, up, radians(gaze.roll));

  return face.eyes.map((eye, index) => {
    const [point, tangent] = turn(forward, right, radians(face.split * (index ? 1 : -1)));
    const c = Math.cos(radians(eye.tilt));
    const s = Math.sin(radians(eye.tilt));
    const squash = 0.06 + 0.94 * clamp(Math.min(lid, eye.open));
    const matrix = [
      tangent[0] * c + up[0] * s,
      (tangent[1] * c + up[1] * s) * squash,
      -tangent[0] * s + up[0] * c,
      (-tangent[1] * s + up[1] * c) * squash,
      head.x + point[0] * head.rx,
      head.y + point[1] * head.ry,
    ];
    return {
      d: capsule(eye.w * r, eye.h * r),
      transform: `matrix(${matrix.map(round).join(",")})`,
      opacity: round(clamp(point[2] / 0.12)),
    };
  });
}

// The resting pose, for the server render and for reduced motion.
export const restingEyes = (head) => drawEyes(FACES.idle, REST, 1, head);

export function blinkLid(since) {
  const r = since / TIMING.blink;
  if (r < 0 || r > 1) return 1;
  const close = TIMING.blinkClose;
  return r < close ? 1 - r / close : (r - close) / (1 - close);
}

// Anticipation squash, airborne stretch, then a settling wobble. y is in head radii, negative is up.
export function hop(since) {
  if (since < 0 || since > TIMING.hop) return { y: 0, sx: 1, sy: 1 };
  if (since < 0.08) {
    const k = Math.sin((since / 0.08) * (Math.PI / 2));
    return { y: 0, sx: 1 + 0.08 * k, sy: 1 - 0.12 * k };
  }
  if (since < 0.46) {
    const k = (since - 0.08) / 0.38;
    const stretch = 0.1 * Math.abs(1 - 2 * k);
    return { y: -1.74 * k * (1 - k), sx: 1 - stretch * 0.6, sy: 1 + stretch };
  }
  const k = (since - 0.46) / 0.29;
  const squash = 0.14 * (1 - k) ** 2 * Math.cos(k * TAU * 1.2);
  return { y: 0, sx: 1 + squash * 0.7, sy: 1 - squash };
}

// Pass a seeded random to make every frame repeatable for tests and contact sheets.
export function createAvatar({ head, pivot, random = Math.random }) {
  const r = (head.rx + head.ry) / 2;
  const span = (min, max) => min + random() * (max - min);
  const between = ([min, max]) => span(min, max);

  const face = structuredClone(FACES.idle);
  const gaze = { ...REST };
  const lean = { x: 0, y: 0, angle: 0, excited: 0 };
  const glance = { yaw: 0, pitch: 0, until: 0, next: span(1.5, 3) };
  let t = 0;
  let quiet = 0;
  let inside = false;
  let overAction = false;
  let pointer = null;
  let leftAt = -10;
  let blinkAt = -10;
  let nextBlink = span(1, 2.5);
  let spinAt = -10;
  let hopAt = -10;
  let happyUntil = -10;

  const mood = () => {
    if (t < happyUntil) return "happy";
    if (overAction) return "excited";
    if (inside) return "attentive";
    if (quiet > TIMING.asleep) return "asleep";
    if (quiet > TIMING.sleepy) return "sleepy";
    return "idle";
  };

  const follow = () => {
    const yaw = clamp(degrees(Math.atan2(pointer.x, 90)), -45, 45);
    const pitch = 12 + clamp(degrees(Math.atan2(-pointer.y, 70)), -45, 35) * 0.6;
    return { yaw, pitch, roll: REST.roll - yaw * 0.1 };
  };

  const press = () => {
    hopAt = t;
    happyUntil = t + TIMING.happy;
    quiet = 0;
  };

  return {
    get mood() {
      return mood();
    },
    enter() {
      if (quiet > TIMING.sleepy || t - leftAt > TIMING.spinAfterAway) {
        spinAt = t;
        blinkAt = t;
      }
      inside = true;
      quiet = 0;
    },
    // x and y are the pointer's offset from the character's centre, in CSS pixels.
    move(x, y) {
      pointer = { x, y };
      inside = true;
      quiet = 0;
    },
    leave() {
      inside = false;
      pointer = null;
      leftAt = t;
    },
    hover(on) {
      overAction = on;
    },
    press,
    poke() {
      if (t - hopAt > 1.2) press();
    },
    step(seconds) {
      const dt = Math.min(seconds, TIMING.maxStep);
      t += dt;
      const current = mood();
      if (!inside) quiet += dt;

      if (current === "idle" && t > glance.next) {
        const wide = random() < TIMING.wideGlance;
        glance.yaw = wide ? span(-40, 30) : span(-10, 10);
        glance.pitch = wide ? span(-25, 12) : span(-6, 6);
        glance.until = t + between(TIMING.glanceHold);
        glance.next = glance.until + between(TIMING.glanceGap);
        if (Math.abs(glance.yaw) > 25) blinkAt = t;
      }
      if (t > glance.until) {
        glance.yaw = 0;
        glance.pitch = 0;
      }

      if (t > nextBlink && current !== "asleep") {
        blinkAt = t;
        nextBlink = t + between(TIMING.blinkGap);
        if (random() < TIMING.doubleBlink) nextBlink = t + 0.24;
      }

      const target = FACES[current];
      const morph = ease(dt, TIMING.morph);
      face.split = lerp(face.split, target.split, morph);
      for (const key of AXES) face.gaze[key] = lerp(face.gaze[key], target.gaze[key], morph);
      face.eyes.forEach((eye, index) => {
        for (const key of EYE) eye[key] = lerp(eye[key], target.eyes[index][key], morph);
      });

      const aim =
        pointer && current !== "happy"
          ? follow()
          : { yaw: REST.yaw + glance.yaw, pitch: REST.pitch + glance.pitch, roll: REST.roll };
      const snap = ease(dt, TIMING.eyes);
      for (const key of AXES) gaze[key] = lerp(gaze[key], aim[key] + face.gaze[key], snap);

      const drift = pointer ? 0.35 : current === "asleep" ? 0 : 1;
      const spin = t - spinAt < TIMING.spin ? 360 * (1 - easeOutQuint((t - spinAt) / TIMING.spin)) : 0;
      const roll = wave(t, 13.7, 3.2) * 2.2 * drift;
      const final = {
        yaw: gaze.yaw + (wave(t, 11.3, 0.4) * 5.5 + wave(t, 3.7, 2.1) * 1.6) * drift - spin,
        pitch: gaze.pitch + (wave(t, 9.1, 1.3) * 4.2 + wave(t, 4.3, 0.7) * 1.3) * drift,
        roll: gaze.roll + roll,
      };

      const settle = ease(dt, TIMING.body);
      const turned = gaze.yaw - REST.yaw;
      lean.angle = lerp(lean.angle, clamp(turned * 0.07, -4, 4) + roll * 0.5, settle);
      lean.x = lerp(lean.x, clamp(turned * 0.0022, -0.11, 0.11) * r, settle);
      lean.y = lerp(lean.y, clamp((REST.pitch - gaze.pitch) * 0.0017, -0.076, 0.076) * r, settle);
      lean.excited = lerp(lean.excited, current === "excited" ? 1 : 0, settle);

      const resting = current === "asleep" || current === "sleepy";
      const breath = resting
        ? Math.sin((t / TIMING.sleepBreath) * TAU) * 0.03
        : Math.sin((t / TIMING.breath) * TAU) * 0.012;
      const jump = hop(t - hopAt);
      const x = lean.x + wave(t, 7.9, 1.9) * 0.033 * r;
      const y =
        lean.y +
        wave(t, 5.3, 0.3) * 0.065 * r +
        jump.y * r -
        Math.abs(Math.sin(t * TAU * 1.4)) * 0.076 * r * lean.excited;
      const sx = jump.sx * (1 - breath * 0.4);
      const sy = jump.sy * (1 + breath);

      return {
        mood: current,
        // Write to the <g> that holds the body, any moving part and the clipped eyes.
        transform: `translate(${round(x)} ${round(y)}) rotate(${round(lean.angle)} ${pivot.x} ${pivot.y}) translate(${pivot.x} ${pivot.y}) scale(${round(sx)} ${round(sy)}) translate(${-pivot.x} ${-pivot.y})`,
        // Above 0 while stretched upward, below 0 while squashed. Drive a lagging part, such as a lid, from it.
        stretch: round(jump.sy - 1),
        eyes: drawEyes(face, final, blinkLid(t - blinkAt), head),
      };
    },
  };
}
