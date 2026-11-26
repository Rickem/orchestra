# Review and evidence

Load when verifying in `build` (step 7) or running `review`, and hand it to the fresh-context reviewer.
Covers the evidence labels, capture validity, what to capture, accessibility checks, the interaction walk,
the quick tests, the rubric, the severity mapping, the finding format and the reviewer brief. Both platforms.

## Evidence labels

Every `build` report and `review` result opens with one line per label, each with its state. The fourth label appears only when nothing was rendered.

| Label | Exact meaning | When it cannot be claimed, write |
|---|---|---|
| Visually verified | Rendered captures were inspected. The line lists the sizes and colour modes covered. | `Visually verified: no (<reason>)`, or list only what was covered and name what was not |
| Accessibility verified | An automated check ran, and the manual items (keyboard, focus, text scaling) were walked. | `not automatically checked` when no automated check exists; `not checked` when the manual items were not walked either |
| Functionally verified | Cited from `/orchestra:testing` or acceptance-verifier evidence, with its reference. This skill never claims it on its own. | `Functionally verified: not cited` |
| Source inspected only | No rendering was possible. The review cannot pass on visual grounds; it reports what the source shows and says so. | Omit the line when captures exist |

Rules:

- Missing evidence is stated, never turned into a pass.
- A label covers only what was actually inspected. Three sizes captured in light mode is not "all sizes and modes".
- The implementer's description of the screen is not evidence. Neither is a passing build.
- With `Source inspected only`, score no dimension that needs a render (mark it `n/s`), and never write or imply a visual pass. The result line is `Result: not verified (source only)`, or `blocked` if the source alone shows a Critical or High finding.

Example opening:

```
Visually verified: 1440, 768, 390 and 320 overflow check; light and dark; sweep 320 to 1440
Accessibility verified: axe via project Playwright (0 violations); keyboard and focus walked; text scaling not checked
Functionally verified: not cited
```

## Capture validity

A capture counts as evidence only when all of these hold. Otherwise retake it or name the gap.

| Condition | Check |
|---|---|
| Real data | Real or realistic content at realistic length: long names, large numbers, many rows. No placeholder text, no empty prototype shell. |
| Settled motion | Entrance animation finished or switched off; fonts and images loaded; no spinner unless the loading state is the subject. |
| Right size | The window is exactly the stated size. A scaled-down or cropped image of a larger window is not a narrow capture. |
| Right colour mode | The mode stated is the mode rendered. Check a surface colour, not the file name. |
| State actually shown | The capture shows the state it is named for: the error message is on screen, the list is empty, the dialog is open. |
| Current build | Taken from the code under review, after the last change. |
| Whole screen | Full page or full scroll extent where content runs below the fold, plus the first screenful on its own. |
| Honest fonts | Flutter goldens drawn with the placeholder test font prove layout only; say so. |

## What to capture

| Item | Web | Flutter |
|---|---|---|
| Sizes | 1440, 768 and 390 wide, plus an overflow check at 320 | Small phone, large phone and tablet |
| Modes | Each supported colour mode at every size | Light and dark at every size |
| Text scaling | 200 per cent zoom on the primary screen | Text scale 1.3 or larger |
| Width sweep | 320 to 1440 in steps of 80 px or less, and either side of each breakpoint; note every width where content overflows, collides or wraps badly | Not applicable; resize across the size-class thresholds where a resizable target exists |
| States | Every state-matrix row for the screens in scope; each component state the task touched | The same |
| Errors | Console errors and warnings, failed requests | Exceptions in test or run output; `flutter analyze` result |
| Overflow | Document wider than the window at any width; clipped or cut-off text | Overflow errors and striped overflow markers; clipped text |
| Layout shift | Content that moves after first paint: compare an early and a settled capture, or read layout-shift entries where the browser tool exposes them | Content that jumps when data arrives or the keyboard opens |
| How | The session's browser tool | Golden tests, `flutter screenshot` or an emulator capture |

- Batch the captures: one round at all sizes, fix everything it shows in one batch, at most one confirmation round, then stop.
- Name files so they can be cited: `<screen>-<state>-<width>-<mode>.png`.
- State what was not captured and why. With no way to render, review source and tokens only and use the fourth label.

## Automated accessibility checks

Use only what the project already has. Install nothing; do not fetch a tool with a package runner either.

| Stack | Look for | Run |
|---|---|---|
| Web | An axe integration in the project's own Playwright, Cypress or unit tests; an accessibility script in `package.json`; a Lighthouse or pa11y setup already configured | The project's own command, against the screens in scope, in each colour mode |
| Flutter | Widget tests that call `meetsGuideline` with `androidTapTargetGuideline`, `iOSTapTargetGuideline`, `textContrastGuideline`, `labeledTapTargetGuideline` | `flutter test`. In `build`, add these expectations to the screen's widget test; the test library ships with the SDK. In `review`, run what exists. |
| Neither present | Nothing | Write `not automatically checked` |

- Report the tool, the scope and the count of violations. Each violation on a core flow becomes a finding.
- A clean automated run is not accessibility verified. Automated checks catch a minority of problems; the manual items below are still required.
- Manual items: keyboard reaches and operates every control; focus is always visible and never trapped or lost; layout holds under text scaling.

## Interaction walk

Walk the primary flow once, start to finish, as a user would. This is a design check of how the flow feels. Functional correctness belongs to `/orchestra:testing` and the acceptance verifier; a functional defect seen on the walk is still reported as a finding.

| Check | Look for |
|---|---|
| Focus order | Follows reading order; starts in a sensible place on each screen; moves into an opened overlay and returns to its trigger on close |
| Keyboard (web, and Flutter with a hardware keyboard) | Every control reachable and operable; Escape closes overlays; Enter submits; no trap; visible focus at every stop |
| Gestures (touch) | Each gesture has a visible alternative; system back works; targets are large enough and not crowded |
| Feedback after each action | Something visible happens at once: pressed state, progress, then a clear result. Success and failure are distinguishable without colour. |
| Transitions | State changes are legible, not abrupt and not slow; motion can be interrupted; the reduce-motion setting is respected |
| Errors on the way | Trigger one validation error and one failure: the message says what happened and what to do, and input is kept |
| Return | Going back keeps scroll position, filters and unsaved input |

## Quick whole-screen tests

Run these on each key screen before scoring. Each failure is a finding, classified by the mapping below.

| Test | How | Fails when |
|---|---|---|
| First impression | Look at the capture for a few seconds before analysing. Write what the screen says it is for and the first three things the eye lands on. | Those three are not the three most important things, or the purpose cannot be stated |
| Squint | Blur or shrink the capture until text is unreadable. | The primary action and the main groups no longer stand out; everything has the same weight |
| Trunk | Imagine arriving on this screen with no context. Answer: which product is this, which screen, what are the main sections, what can I do here, where am I in the structure, how do I search or go back. | Any answer is not available from the screen itself |

## Rubric

Score each dimension 0 to 4 against the anchors. Score from captures and the walk, not from intent. A 4 is rare. This is the only scoring scheme; no totals, grades or percentages.

| Dimension | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Hierarchy and layout | No discernible order; elements compete | Primary action hard to find; grouping accidental | Main order clear, secondary areas muddled or misaligned | Clear order and grouping; minor spacing or alignment slips | Eye path matches task order on every screen; spacing rhythm consistent |
| Typography | Unreadable sizes or line lengths | Readable but no scale; many arbitrary sizes | A scale exists, roles blur or line length strays | Roles consistent; small slips in measure or weight | Every text maps to a role; measure, leading and contrast of scale all deliberate |
| Colour and contrast | Text fails contrast widely | Several failing pairs; colour applied without roles | Passes mostly; roles inconsistent or one mode neglected | Passes in all modes; roles consistent, rare stray value | Every pair passes; colour carries meaning sparingly; modes equally finished |
| States and feedback | Only the happy path exists | Some states exist, primary-flow states missing | Primary-flow states present, others generic or missing | All matrix states present; a few are thin | Every state designed, helpful and consistent; every action answered |
| Content | Placeholder or invented text | Vague labels, jargon, blaming errors | Clear in the main flow, uneven elsewhere | Clear and consistent; minor wordiness | Every label, message and empty state is specific and actionable |
| Interaction and motion | Core interaction confusing or broken to use | Works but fights convention; motion distracts or is absent where needed | Conventional, some rough transitions or weak feedback | Smooth and predictable; small inconsistencies | Every interaction predictable, reversible where it should be; motion explains change and respects reduce-motion |
| Accessibility | Core flow unusable by keyboard or screen reader | Major gaps: unlabelled controls, no visible focus | Partly usable; order, scaling or targets break in places | Meets the numbers in `foundations.md` with minor gaps | Fully operable by keyboard and assistive technology; holds under text scaling |
| Platform fit and responsiveness | Works at one size only, or ignores the platform | Breaks at a supported size; foreign patterns throughout | Works at all sizes with rough edges; some foreign patterns | Adapts structure by size; platform conventions followed with small slips | Feels made for each size and platform; insets, input types and conventions all right |
| Distinctiveness | Indistinguishable from a default template | Generic with one token gesture | Some character, mostly category defaults | Recognisably this product; one or two reflex choices | The approved direction is evident in every screen; nothing present by default |

- Give one line of evidence per score: a capture name or `path:line`.
- Distinctiveness is judged against the approved direction in `DESIGN.md`, not against the reviewer's taste. A restrained direction executed faithfully scores high.
- A score explains; it does not block. Any score of 0 or 1 must have at least one finding behind it.

## Severity mapping

| Severity | A design finding is this when |
|---|---|
| Critical | A core flow cannot be completed, or the UI leads to data loss or an irreversible action without warning. |
| High | An accessibility failure on a core flow (contrast, keyboard access, target size, text scaling); a missing loading, empty or error state on a primary flow; broken or overflowing layout at a supported size; a clear departure from the approved `DESIGN.md` that is not recorded as an exception. |
| Medium | Inconsistency with tokens, weak hierarchy, anti-slop tells, unclear copy. |
| Low | Polish. |

Rules:

- Rubric scores never block on their own. Only severities do.
- A taste or distinctiveness finding is Medium at most, unless it contradicts the approved direction.
- A departure recorded in the Exceptions list of `DESIGN.md` is not a finding. An unrecorded one is.
- Mark each finding `confirmed` (seen in a capture, reproduced on the walk, or proven from source) or `potential` (plausible, not proven). A finding raised from source alone about how something renders is `potential`.
- Report each problem once, at its root, even if it shows at several sizes. List the sizes in the problem text.
- Compare against the direction, the component inventory and the interaction notes, not only against general rules.

## Finding format

One line per finding, most severe first:

`[Severity][confirmed|potential] path:line — problem. Fix: action.`

A screenshot name may stand in for `path:line`. Then one closing line:

`Result: pass | blocked (N Critical, N High) | not verified (source only)`

- The problem names the element and what the user experiences. The fix is one concrete action, not "consider".
- No praise, no summary paragraph, no restating the code.
- `blocked` whenever any Critical or High is open. Only the user can waive one; the waiver and its reason go in the review log.
- After the result line, state in one line what was not inspected.

Example:

```
[High][confirmed] orders-empty-390-dark.png — empty state shows a blank list with no message or action. Fix: add the empty (first use) state from the matrix.
[Medium][confirmed] src/ui/OrderRow.tsx:41 — padding is a literal 13px, not a spacing token. Fix: use the space-3 token.
Result: blocked (0 Critical, 1 High)
Not inspected: tablet width in dark mode; screen reader.
```

## Brief for the fresh-context reviewer

Dispatch one reviewer in a fresh context so the verdict is not anchored on the implementer's account.

| Given | Not given |
|---|---|
| The captures, with size, mode and state in each name | The implementer's explanation, summary or self-assessment |
| Output of the automated checks, console and runtime errors, sweep notes | The conversation that produced the code |
| `docs/design/DESIGN.md`, including its Exceptions list; `foundations.md` and the anti-slop list in `direction.md`; the notes from the interaction walk | Any statement of what the screen is "meant" to look like beyond the design file |
| The state matrix from `docs/design/SCREENS.md` | A proposed verdict or expected score |
| This file | |
| The scope: task, screens, diff or file list | |

Instructions to the reviewer:

- Report only. Edit nothing, commit nothing.
- Check each capture against the validity table first; set aside invalid ones and say so.
- Run the three quick tests, then score the nine dimensions with one line of evidence each.
- Compare with the approved direction, component inventory, interaction notes and state matrix. Check the Exceptions list before raising a departure.
- Judge only what the evidence shows. Where evidence is missing, say what is missing; do not assume it is fine.

Returns:

1. The evidence labels, one line each, as far as the supplied material supports them.
2. The nine scores, each with its evidence.
3. Findings in the format above, most severe first.
4. The result line.
5. One line listing what could not be inspected.

The main session checks the returned findings against the captures, adds findings from the interaction walk, and writes the block to `docs/quality/REVIEW_LOG.md`.
