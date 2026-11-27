---
name: verify
description: "Checks a UI or behaviour change in the running app before calling it done, then tells the user where to see it. Use after any change to interface or behaviour and before replying done or fixed, at once when the user says still broken, nothing changed or test it yourself, and when the same problem is reported a second time."
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Verify

Decide when a change may be called done. The evidence is the running result, seen where the user will see it.

A typecheck, a lint pass or a green build shows that the code compiles. It does not show that a visual or behavioural change works. Saying "fixed" without opening the result is a finding. Opening it and reporting an imperfect result is not.

`scope` owns what to change. `match` owns matching an outside app.

## Steps

1. **See the problem first.** Open the app, the page or the output and find the symptom before you edit. Use the browser, a screenshot or computer use. An edit made from the description alone may fix a different bug. When you cannot reach the running result, say what blocks you.
2. **Look where the user will look.** Reload, or confirm that hot reload applied the change. Then look at the same place the user reported.
3. **Click every new control once.** A control you added must do something when pressed.
4. **Check the whole surface.** Look past the line you edited. Scroll to both ends and open each state the change touches.
5. **Report what you saw.** Say what you checked, how you checked it, and where the user can see it: the route, the window, the menu path or the folder. Open the result for the user when you can, and do not just print a path.
6. **Name the gap.** List anything you could not check and why.

The change is done when you saw it work in the running result and the reply says where, or the reply names each part you could not check.

## On a repeat report

When the user reports the same problem again, the last guess was wrong, so stop adjusting the same value. Find the cause instead: diff against the last commit where it worked, read the computed style, or search for what overrides it. Then fix that.

## Checks

| Rule | Broken | Replacement |
| --- | --- | --- |
| `verify-reproduce-first` | An edit from the bug report alone | The screen opened, the bug seen, then the edit |
| `verify-build-is-not-proof` | "Typecheck passes, so it is fixed" | "Reloaded Settings and the toggle now persists" |
| `verify-click-new-controls` | A new "Add Condition" button with no handler | The button clicked once, a row appears |
| `verify-whole-surface` | Only the edited row checked | The whole panel, scrolled to both ends |
| `verify-root-cause-on-repeat` | A third tweak to the same `padding` | A diff against the last working commit, then the fix |
| `verify-say-where` | "It should work now" | "Open Library, right-click a save, choose Hide" |
| `verify-open-the-result` | `~/Downloads/clips` printed in the reply | The folder opened for the user |
| `verify-name-the-gap` | "Done" while export never ran | "Not verified: export, it needs a signed build" |

## Reporting

When the skill runs as a review, write one finding per root cause, and cite the request when no file applies:

```
file:line - [rule-id] what is wrong
request 2 - [rule-id] what is wrong
```

Severity:

- `HIGH`: "done" with no look at the running result, or a new control that does nothing.
- `MEDIUM`: a repeat report met with another guess, or a reply with no place to see the change.
- `LOW`: a checked change whose reply omits how it was checked.

Close with a `Rule | Count | Severity` summary and a verdict: `Block` while any `HIGH` remains, `Approve` otherwise. Approve only a change you opened. Mark every check you could not run as `Not verified`.
