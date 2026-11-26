# Interactions and motion

Load when writing the interaction notes in `direct`, building anything the user operates in `build`,
or walking the primary flow in `review`. Covers navigation, focus, keyboard, touch, forms, feedback,
drag and drop, state transitions and motion. Platform detail lives in `web.md` and `flutter.md`.

## Navigation behaviour

- Choose one navigation model per product and record it: flat (tabs or a bar), hierarchical (list to detail), hub and spoke, or a linear flow (wizard, checkout). Do not mix models on one level.
- Keep primary destinations few (five or fewer on a bottom bar) and in the same place on every screen.
- Show where the user is: mark the current destination, title the screen, and show the path (breadcrumb or back label) once the hierarchy is deeper than two levels.
- Back is predictable. It returns to the previous screen in the state it was left, closes an open overlay first, and never discards input without warning.
- Back from a deep link goes to the screen's logical parent, not out of the product.
- Every screen and meaningful view state (selected tab, filter, search, open record) has an address, so it can be linked, reloaded and shared. A dialog that holds real content gets one too.
- Preserve scroll position, filters, selection and unsaved input when the user leaves and returns. Reset them only when the user asks.
- A linear flow shows the step count, lets the user go back without loss, and says what happens at the end.

| Platform | Note |
|---|---|
| Web | The browser's back and forward buttons and reload must work. Changing tab, filter or page updates the URL. Restore scroll on back. |
| Touch | Respect the system back gesture or button. Tabs keep their own stack; re-selecting the current tab returns to its root. |

## Hover and focus

- Hover is an enhancement. Anything revealed or done on hover is also reachable by focus, tap or a visible control.
- Never hide the only route to an action (row actions, delete, edit) behind hover. On touch layouts show it, or put it in a visible menu.
- Content revealed on hover waits a short moment before appearing and lingers briefly on exit, so a passing pointer causes no flicker. Keyboard focus reveals it at once. No hover delay applies to touch.
- Focus is always visible: a clear indicator with enough contrast against both the control and its background. Never remove it without an equal replacement.
- Focus order follows reading order. Fix the order in the layout, not with manual tab indexes.
- Nothing may cover the focused element (sticky headers, bars, the on-screen keyboard).
- Hover, focus and pressed look different from each other and from selected.

## Keyboard

Every action is reachable and operable without a pointer. A composite control (tabs, menu, list, radio group) is one tab stop; arrow keys move inside it.

| Pattern | Expected keys |
|---|---|
| Button, link | Enter activates; Space also activates a button. |
| Dialog, drawer | Focus moves inside on open. Tab and Shift+Tab cycle within it. Esc closes. Focus returns to the control that opened it. |
| Menu, dropdown | Enter, Space or Down opens. Up and Down move; Home and End jump; typing a letter jumps to a match. Enter chooses. Esc closes and returns focus. |
| Tabs, segmented control | Left and Right move between tabs; Tab moves into the panel. |
| List, table, tree | Arrows move; Enter opens; Space selects; Shift extends a selection; Home and End jump. |
| Combobox, autocomplete | Typing filters; Down enters the list; Enter picks; Esc closes the list, then clears. |
| Form | Tab follows visual order. Enter submits from a single-line field. Space toggles a checkbox. Arrows move within a radio group. |
| Slider | Arrows step; Page Up and Page Down take larger steps; Home and End go to the limits. |
| Toast, banner | Never steals focus. Any action in it is reachable and does not expire while focused. |

- Overlays trap focus while open and give it back on close. If the opener is gone (the row was deleted), send focus to the nearest sensible element.
- On opening a destructive dialog, place focus on the safe choice.
- Offer a skip to main content on pages with long navigation.
- Shortcuts are extras. Show them where the action lives, and never override the platform's own.

## Touch gestures

- Every gesture has a visible alternative: a button, a menu item or a handle. A gesture is a shortcut, never the only path.
- Target size: at least 44 by 44 points on iOS and 48 by 48 dp on Android, with about 8 between neighbours. A small icon keeps a full-size hit area. The numbers are owned by `foundations.md`.
- Give pressed feedback at once on touch down.

| Gesture | Convention | Visible alternative |
|---|---|---|
| Tap | Primary action of the element. | Not needed. |
| Swipe on a row | Reveals or commits a row action; a destructive swipe offers undo. | Overflow menu or detail screen action. |
| Swipe between pages | Moves between sibling views (tabs, a carousel). | Tabs, dots or arrows. |
| Edge swipe | Belongs to the system (back). Keep horizontal gestures away from screen edges. | Back control. |
| Pull down | Refreshes a list, only from the top of refreshable content. | A refresh control or automatic refresh. |
| Long-press | Opens a context menu or starts a drag. | Overflow button or handle. |
| Pinch, double-tap | Zooms images and maps. | Zoom controls where zoom matters. |

- Thumb reach: put the primary and most frequent actions in the lower part of the screen. Keep destructive actions out of the easiest reach and away from the primary one.
- A gesture must not fight scrolling. A horizontal swipe inside a vertical list needs a clear threshold.
- Web: there is no hover on touch. Do not depend on double-tap or on precise small targets.

## Forms

| Question | Rule |
|---|---|
| When to validate | On leaving a field (blur) for format, and on submit for everything. Not on every keystroke, and never on a field the user has not touched. |
| When to clear | Once a field shows an error, re-check it as the user types and remove the error the moment it is fixed. |
| Live guidance | Counters and password rules may update while typing. They are guidance, not errors, until blur or submit. |
| Where errors appear | Next to the field, tied to it for assistive technology, in text and not colour alone. On submit, move focus to the first invalid field. A long form also gets a summary at the top that links to each field. |
| Server errors | Map each to its field where possible; otherwise show one message near the submit action. |
| Preserving input | Never clear a field because validation failed. Keep input across a failed submit, back navigation, an expired session and a reload where feasible. Warn before leaving with unsaved changes. |
| Submit button | Goes busy on submit and blocks a second submit, keeping its width. If it is ever disabled, say why; prefer letting the user submit and showing what is missing. |

- Labels stay visible. A placeholder is an example, not a label.
- State format and limits before the user types, not after they fail.
- Touch: open the right keyboard for the field and keep the focused field above it.

## Feedback after actions

| Wait | Feedback |
|---|---|
| Any action | Acknowledge at once (about 100 ms): pressed state, then a change the user can see. |
| Up to about 1 s | A busy state on the control is enough. Avoid flashing a loader for a wait this short. |
| 1 to 10 s | An indicator in place: skeleton for content, spinner or progress on the control. |
| Over 10 s | Determinate progress or named steps, a way to cancel, and permission to leave and come back. |

- Show progress where the action happened and keep the rest of the screen usable.
- Never invent progress. Use a determinate bar only when the figure is real.
- Routine success is brief and unobtrusive (the item appears; a short toast). Reserve larger confirmation for rare, high-effort results.
- Optimistic updates suit low-risk actions that almost always succeed and can be reversed: toggle, like, rename, reorder. Do not use them for payments, sends or permanent deletion.
- When an optimistic update fails: roll back visibly, say what failed, keep what the user entered, and offer retry. Never fail silently.
- Reversible action: do it at once and offer undo for long enough to notice and reach by keyboard. No confirmation dialog.
- Irreversible action: confirm. Name the object and the consequence, repeat the verb on the button, focus the safe choice. Ask for typed confirmation only for the gravest cases.

## Drag and drop

- Use it only where direct manipulation is clearly faster: reordering, moving between groups, placing on a canvas, dropping files.
- Always provide a non-drag route: move up and down controls, a "Move to" menu, a file picker button, and keyboard operation (lift, arrows, drop, Esc to cancel).
- Start from an explicit handle so the item's own actions still work. On touch, lift by handle or long-press so dragging does not fight scrolling.
- Show what is moving and where it will land before the drop. Commit once, on drop. Cancel restores the original order at once.
- Mark valid drop targets while dragging; show clearly when a target refuses the item.

## Transitions between application states

| From, to | Rule |
|---|---|
| Loading to content | The placeholder matches the shape of what arrives. Nothing jumps when content lands. |
| Content to refreshing | Keep the old content on screen with a quiet indicator. Never blank a populated view. |
| Content to error | Replace only the region that failed. Keep the rest working and keep the user's input. |
| Content to empty | After the last item goes, show the empty state, with undo if the removal was reversible. |
| Online to offline and back | Say so once, keep cached content readable, queue or block writes plainly, and report the result when the connection returns. |
| Action to success | Confirm in place and move on. Add a separate success screen only when the user must do something next. |
| Any change of view | Move focus to the new content or its heading, and announce the change to assistive technology. |

## Motion

Every motion has a job. If removing it loses nothing, remove it.

| Purpose | Example |
|---|---|
| Orientation | A panel enters from the side it lives on; a detail grows from its list item. |
| Feedback | A control responds to press; a toggle confirms its new value. |
| Continuity | An item keeps its identity while a list reorders or a view changes. |
| Attention | One new or urgent thing is pointed out, once. |

Durations by kind of movement (defaults; larger distance or surface takes the upper end):

| Kind | Duration |
|---|---|
| Press, hover, colour change | 80 to 150 ms |
| Small state change (toggle, checkbox, fade) | 150 to 250 ms |
| Menu, tooltip, popover | 150 to 200 ms |
| Dialog, sheet, drawer, expanding panel | 250 to 350 ms |
| Screen or view transition | 300 to 450 ms |
| One authored focal entrance (Persuade or Experience screens only) | 500 to 800 ms |
| Reduced-motion cross-fade | 200 ms or less |

- Exits are faster than entrances: roughly two thirds of the entrance time.
- Easing: decelerating ease-out by default, so things arrive and settle. Ease-in only for exits. No bounce or elastic curve by reflex. In Flutter the platform's spring and standard curves are fine.
- Interruptible: a new input reverses or replaces a running animation from where it is. Never block input until an animation ends, and never queue animations.
- Operate and Read screens: motion serves feedback and continuity only; no page-load choreography. Persuade and Experience screens may have one rehearsed focal sequence instead of a reveal on every section.
- Stagger only a real list appearing as a list, and cap the total delay.
- Content is visible by default; it must not depend on an animation running to appear.
- Animate transform and opacity in preference to properties that force layout. Looping motion stops when off screen.
- Status and progress stay understandable with no animation at all.

Reduced motion means fewer and gentler, never a global kill-switch:

- Remove travel, scale, parallax, spring and auto-play.
- Keep short opacity cross-fades and colour changes that carry state; keep press and success feedback.
- The end state is identical with and without the preference; only the route changes.
- Movement the user drives directly (dragging, scrolling) is not an animation and stays.
- Do not switch off every transition with one blanket rule; decide per animation.

## Interaction notes to record

Write these under "Interactions" in the project's `docs/design/DESIGN.md`. Record decisions, not this file's defaults:

1. Navigation model and back behaviour
2. Keyboard and focus order
3. Touch gestures and their visible alternatives
4. Form validation timing and error placement
5. Feedback after each key action (including undo or confirm)
6. State transitions and motion (durations, curves, reduced-motion behaviour)

The brief or the project's design system overrides any default here.
