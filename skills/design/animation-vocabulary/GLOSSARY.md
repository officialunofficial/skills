# Motion glossary

## Contents

- Entrances and exits
- Sequencing and timing
- Movement and transforms
- Transitions between states
- Scroll
- Feedback and interaction
- Easing
- Springs
- Looping and ambient motion
- Polish and effects
- Performance
- Principles

## Entrances and exits

- **Fade in / Fade out**: an element appears or disappears through a change in opacity.
- **Slide in**: an element enters from off screen, from the left, right, top or bottom.
- **Scale in**: an element grows from a smaller size to full size as it appears, usually with a fade.
- **Pop in**: an element appears with a slight overshoot, as if it bounces into place.
- **Reveal**: content is uncovered gradually, often with an animated clip-path or mask.
- **Enter / Exit**: the animation an element plays when it joins or leaves the screen.

## Sequencing and timing

- **Keyframes**: fixed points in an animation (0%, 50%, 100%). The browser fills the gaps.
- **Interpolation / Tween**: the generation of the in-between frames from a start value to an end value.
- **Stagger**: several items animate one after another with a small delay between them, like a cascade.
- **Orchestration**: several animations timed on purpose so they read as one motion.
- **Delay**: the time before an animation starts.
- **Duration**: how long an animation takes.
- **Fill mode**: whether an element holds its first-frame or last-frame styles before the animation starts or after it ends (for example `forwards`).
- **Stepped animation**: an animation split into discrete steps, like a countdown timer.

## Movement and transforms

- **Translate**: move an element along the X or Y axis.
- **Scale**: make an element bigger or smaller.
- **Rotate**: spin an element around a point.
- **Skew**: slant an element along the X or Y axis, so it shears out of its rectangle.
- **3D tilt / Flip**: rotate in 3D space (`rotateX`, `rotateY`) to add depth.
- **Perspective**: the strength of the 3D effect. A lower value exaggerates depth, as if the viewer were closer.
- **Transform origin**: the anchor point that a scale or rotation grows or spins from.
- **Origin-aware animation**: an element grows out of its trigger, such as a popover from the button that opened it, instead of from its own center (the CSS default).

## Transitions between states

- **Crossfade**: one element fades out while another fades in at the same spot.
- **Continuity transition**: a change that keeps the user oriented by connecting before and after, such as one rectangle that grows and shrinks.
- **Morph**: one shape turns smoothly into another, as in the Dynamic Island.
- **Shared element transition**: an element travels and transforms from one position to another, like a thumbnail that expands into a card.
- **Layout animation**: when an element's size or position changes, it animates to the new place instead of snapping.
- **Accordion / Collapse**: a section expands and collapses its height to show or hide content.
- **Direction-aware transition**: content slides one way going forward and the opposite way going back, so navigation has a direction.

## Scroll

- **Scroll reveal**: elements fade or slide into place as they enter the viewport.
- **Scroll-driven animation**: an animation whose progress follows the scroll position directly.
- **Parallax**: background and foreground move at different speeds during scroll, which creates depth.
- **Page transition**: an animation that plays on navigation from one page or route to another.
- **View transition**: the browser morphs between two states or pages and connects their shared elements.

## Feedback and interaction

- **Hover effect**: a visual change when the cursor moves over an element.
- **Press / Tap feedback**: a slight scale-down on click, so the element feels physical.
- **Hold to confirm**: a progress fill that grows while the user holds a button.
- **Drag**: the user grabs and moves an element, often with momentum on release.
- **Drag to reorder**: the user drags list items to rearrange them while the others shift to make room.
- **Swipe to dismiss**: the user drags an element off screen to close it, as with a drawer or toast.
- **Rubber-banding**: resistance and snap-back on a drag past a boundary (the iOS overscroll feel).
- **Shake / Wiggle**: a quick side-to-side jitter that signals an error or rejected input.
- **Ripple**: a circle that expands from the tap point to confirm the press.

## Easing

- **Easing**: the rate at which an animation speeds up or slows down.
- **Ease-out**: starts fast, ends slow. The default for most UI and for anything that responds to the user.
- **Ease-in**: starts slow, ends fast. Usually avoided because it feels sluggish.
- **Ease-in-out**: slow, fast, slow. Good for an element already on screen that moves from A to B.
- **Linear**: constant speed. Avoid it for UI. Keep it for spinners and marquees.
- **Cubic-bezier**: a custom easing curve defined by four numbers.
- **Asymmetric easing**: a curve that accelerates and decelerates at different rates. It feels more alive than a symmetric one.

## Springs

- **Spring**: motion driven by physics (tension, mass, damping) instead of a set duration.
- **Stiffness / Tension**: how hard the spring pulls toward its target. Higher feels snappier.
- **Damping**: how fast a spring settles. Lower damping gives more bounce and oscillation.
- **Mass**: how heavy the element feels. More mass makes it slower.
- **Bounce**: a spring that overshoots and settles, which adds playfulness.
- **Perceptual duration**: how long a spring appears to take, although it keeps settling by tiny amounts afterward.
- **Momentum**: motion that carries velocity, mainly after a drag or an interruption.
- **Velocity**: how fast and in which direction an element moves. A spring carries it into the next animation, so a flicked element keeps its speed.
- **Interruptible animation**: an animation that can change direction mid-flight instead of finishing first.

## Looping and ambient motion

- **Marquee**: content that scrolls continuously in a loop.
- **Loop**: an animation that repeats, a set number of times or forever.
- **Alternate (yoyo)**: a loop that plays forward and then in reverse, instead of jumping back to the start.
- **Orbit**: an element that circles another on a continuous path.
- **Pulse**: a gentle repeated change in scale or opacity that draws attention.
- **Float**: a gentle, continuous up-and-down drift that makes a static element feel weightless.
- **Idle animation**: subtle motion that plays while an element waits for interaction.

## Polish and effects

- **Blur**: a blur filter that softens an element or hides small imperfections.
- **Clip-path**: clipping an element to a shape. Used for reveals, masks and before/after sliders.
- **Mask**: hiding or showing parts of an element with a shape or gradient. Like clip-path, but with soft edges that can fade.
- **Before / after slider**: a draggable divider that wipes between two stacked images to compare them.
- **Line drawing**: an SVG path that draws itself, as if traced by an invisible pen.
- **Text morph**: text that animates character by character when it changes, which draws the eye to the new value.
- **Skeleton / Shimmer**: a placeholder with a moving sheen, shown while content loads.
- **Number ticker**: digits that roll or count up to a value.
- **Tabular numbers**: fixed-width digits, so numbers do not shift as they change. Needed for tickers, timers and counters.
- **Typewriter**: text that appears one character at a time, as if typed.

## Performance

- **Frame rate (FPS)**: frames drawn per second. 60fps is the baseline for smooth motion, and newer displays run 120fps.
- **Jank**: visible stutter when the browser drops frames because it cannot keep up.
- **Dropped frame**: a frame the browser failed to draw by its deadline, seen as a small hitch.
- **Compositing**: the GPU moves or fades an element on its own layer with no new layout or paint.
- **will-change**: a CSS hint that an element is about to animate, so the browser can give it a layer ahead of time.
- **Layout thrashing**: animating properties such as width, height, top or left, which force a layout pass every frame and cause jank.

## Principles

- **Purposeful animation**: motion serves a function (orient, give feedback, show a relationship) and does not just decorate.
- **Anticipation**: a small wind-up in the opposite direction before a move, which hints at what comes next.
- **Follow-through**: parts of an element keep moving and settle slightly after the main motion stops, which adds weight.
- **Squash and stretch**: deforming an element as it moves to convey weight, speed and flexibility.
- **Perceived performance**: the right animation makes an interface feel faster even when it is not.
- **Frequency of use**: the more often a user sees an animation, the shorter and subtler it should be.
- **Spatial consistency**: an element keeps its identity and position across states, so the user never loses track of it.
- **Hardware acceleration**: animating transform and opacity lets the GPU keep motion smooth.
- **Reduced motion**: honoring the user's `prefers-reduced-motion` setting by toning motion down or removing it.
