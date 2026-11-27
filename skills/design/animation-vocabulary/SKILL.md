---
name: animation-vocabulary
description: Names a web animation or motion effect from a loose description, for example "the bouncy thing when a popover opens" is Pop in and "the iOS scroll that resists and snaps back" is Rubber-banding. Use when the user asks "what is it called when..." or describes a motion effect and wants the right word to give a designer or an agent. It names effects. It does not design or build them.
license: MIT
metadata: {upstream-author: "Emil Kowalski", upstream-source: "emilkowalski/skills"}
---

# Animation vocabulary

Turn a loose description of a motion effect into its exact term, so the user knows what to ask for. The terms and their definitions are in [GLOSSARY.md](GLOSSARY.md). Read it before you answer.

## How to answer

1. Read for what the user sees or feels ("springy", "slides off", "draws itself in"), not for keywords. Map that sensation to a glossary term.
2. Lead with the term in bold, then its glossary definition. A naming question wants a name, so stop there unless asked for more.
3. When two terms compete, put the best match first and add one or two alternates, each with one line on how it differs. Common pairs: Clip-path and Mask, Pop in and Bounce, Shared element transition and Layout animation.
4. When nothing matches exactly, give the closest term and say it is an approximation, or compose the effect from glossary terms ("a stagger of scale-in entrances").
5. Use only terms from the glossary, so the same effect gets the same name every time. If a term is missing, say so.

## Examples

User: "What's it called when a popover grows out of the button you clicked instead of from its middle?"

```
**Origin-aware animation**: an element grows out of its trigger, such as a popover from the button that opened it, instead of from its own center.
```

User: "The thing where one image turns into another image."

```
**Morph**: one shape turns smoothly into another, as in the Dynamic Island.

Close alternates:
- **Crossfade**, if one fades out while the other fades in at the same spot.
- **Shared element transition**, if the element travels from one position to another as it changes.
```
