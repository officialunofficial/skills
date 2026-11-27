---
name: deconstruct
description: Breaks an animation or interaction into a state machine and a timeline of every property, on a page you can scrub and edit.
disable-model-invocation: true
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Deconstruct

Take an animation or interaction apart. Name every state and event, split each transition into one track per property, and put both on a page the user can scrub and edit.

Describe nothing by feel. Every state has a name, every transition has an event, and every animated property has its from, to, delay, duration, and easing. Mark a value you could not read as `Not verified`. Do not estimate it.

Related work belongs elsewhere: reading computed values and the side-by-side proof to `match`, forcing component states open to `lab`, opening the result to `verify`, and judging whether the motion's values are right to `motion`.

## 1. Capture the real motion

Open the source: the code, the live page, or a recording. Read keyframes, transitions, and spring configs, or step through frames at reduced playback speed. One viewing is not a capture (`deconstruct-capture-the-source`).

## 2. Name the states and events

List the states the element can rest in and the events that move it between them, such as press, release, resolve, and timeout. Write a table with the columns state, entered on, and left on (`deconstruct-name-the-states`).

## 3. Split each transition into tracks

Give every animated property its own track: scale, opacity, blur, width, colour, icon, label. Each track lists from, to, delay, duration, and easing (`deconstruct-every-property`).

Keep the curve as written. A spring stays a spring, with its stiffness, damping, and mass, or its bounce and duration. Do not flatten it into a guessed bezier (`deconstruct-keep-the-curve`).

## 4. Drive it from one clock

Render the element as a pure function of one time value. Scrubbing, pausing, and looping then show the same frame for the same time. A viewer that replays CSS cannot stop mid-transition (`deconstruct-one-clock`).

## 5. Build the viewer

Copy [viewer.html](viewer.html) beside the rebuild as a development-only page. Write `timeline.js` next to it in the shape the header comment of `viewer.html` shows, then open the page. It shows the element, the state machine, and one lane per track with its live value.

The viewer ships with the skill, so write data only (`deconstruct-shipped-viewer`). Keep its scrubber, play, pause, and 0.25x speed (`deconstruct-scrub-the-timeline`).

Change timings in the viewer, not in the reply (`deconstruct-edit-the-segment`). Read [VIEWER.md](VIEWER.md) when you edit in the viewer or explain its controls to the user.

## 6. Compare at slow speed

Set `recording` to a capture of the original. The viewer plays it beside the preview on the same clock. Play both at 0.25x and name every frame that drifts. A check at full speed only is a finding (`deconstruct-compare-slowed`).

## 7. Hand back the data

`timeline.js` is the deliverable: the state table and the tracks as one object. The rebuild imports that file, not a copy, so the viewer and the shipped motion read the same values (`deconstruct-timeline-as-data`).

Copy Timeline writes the open page back into that object. Paste it over `timeline.js`, or the edit stays only in the open page (`deconstruct-copy-the-timeline`). If the clipboard is blocked, the toast says Copy Failed.

Gate the viewer to development or delete it before release. Keep `timeline.js`.

## Rules

Each rule pairs the broken case with its replacement.

| Rule | Broken | Replacement |
| --- | --- | --- |
| `deconstruct-capture-the-source` | A breakdown from watching it once | The code read and frames stepped at 0.1x |
| `deconstruct-name-the-states` | "It shrinks, then spins" | Idle, Pressed, Copying, and Copied with their events |
| `deconstruct-every-property` | "About 300ms" | Scale `1` to `0.96`, 120ms, ease-out, at 400ms |
| `deconstruct-keep-the-curve` | A spring approximated as `ease-out` | `stiffness: 400, damping: 30` as written |
| `deconstruct-one-clock` | A CSS replay button | Every frame computed from one `t` |
| `deconstruct-scrub-the-timeline` | A looping preview only | A scrubber, play, pause, and 0.25x |
| `deconstruct-shipped-viewer` | A viewer page written from scratch | `viewer.html` copied, only `timeline.js` written |
| `deconstruct-compare-slowed` | Checked once at full speed | Original and rebuild side by side at 0.25x |
| `deconstruct-timeline-as-data` | A timeline described in the reply | `timeline.js`, imported by the rebuild |
| `deconstruct-edit-the-segment` | "Make the press 80ms" in the reply | Duration edited on the segment |
| `deconstruct-copy-the-timeline` | The edit left in the open page | Pasted back over `timeline.js` |

## Reporting

**Severity.** `HIGH` is a breakdown made without opening the source, or a missing state. `MEDIUM` is an estimated timing, a flattened curve, a viewer that cannot scrub, a hand-written viewer, or an edit left only in the page. `LOW` is drift found and named at slow speed.

**Format.** One finding per root cause:

```
file:line - [rule-id] what is wrong
```

Follow with a `Rule | Count | Severity` summary. The verdict is `Block` while any `HIGH` remains and `Approve` otherwise. Mark every value you could not read from the source as `Not verified`.
