# Viewer controls

How to edit and compare in `viewer.html`. The header comment of that file lists the keyboard shortcuts and the `timeline.js` fields.

## Navigate

- The active state is highlighted. Click a state to seek to it.
- Pinch, or hold Cmd and scroll, to zoom the timeline. Scroll sideways to pan. Fit returns to the full duration.
- Open a track to draw its value over time under the lane, so an overshoot shows.

## Edit

| Goal | Action |
| --- | --- |
| Change a delay | Drag the segment |
| Change a duration | Drag the segment's right edge |
| Move an event on every track | Drag the event mark |
| Change from, to, delay, duration, or easing by value | Type in the inspector, or drag its slider. The preview follows |
| Change a bezier | Drag the handles, or pick a keyword from the easing menu |
| Move several segments together | Shift-click them, then drag |
| Move every track of one element | Drag the group under its selector |

Segments, layers, and events snap to each other and to the playhead. Hold Alt to drag without snapping.

A spring's length follows from its curve. Change stiffness, damping, and mass to change it. For a bounce and duration spring, drag the segment's edge.

Cmd+Z undoes any edit. An edited field shows a dot and Revert. Original plays the timeline as loaded, so you can judge an edit against the source.

## Compare with a recording

- Press I and O to loop one range, such as press to release.
- Onion Skin ghosts the last frames over the preview.
- Wipe lays the recording over the preview with a divider. Crop the recording to the preview frame so the two line up.
