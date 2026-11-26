---
name: ui-design
description: Use to design, build or review a user interface for a website, web app or Flutter app the way a senior UI/UX designer would - set a design direction, tokens, components, interactions and screen states before code (direct), apply them while implementing a UI task (build), or review the rendered result against the approved design with evidence (review). Review reports only; it does not change code.
---

# UI design

Read `${CLAUDE_PLUGIN_ROOT}/standards/severity.md` and `${CLAUDE_PLUGIN_ROOT}/standards/concise-output.md` first.

References live in `${CLAUDE_PLUGIN_ROOT}/skills/ui-design/references/`. Load only the files a step names.

## Inputs

- Mode and target: `/orchestra:ui-design [direct|build|review] [target]`. No mode given: no UI code and no design file means `direct`; a task in progress, or a requested change to existing UI, means `build`; a finished diff or a URL means `review`. State the inferred mode in one line.
- Stack: `.orchestra/project.json` (`stack.ui`), then `package.json` or `pubspec.yaml`, then the brief. Never assume one.
- `docs/design/DESIGN.md` and `docs/design/SCREENS.md`, if they exist.

## Rules

- Existing design system or brand is the authority. Read it before changing anything.
- Refinement preserves; a redesign replaces. Never smuggle a redesign into a small change. Touch only the named target.
- Specific over vague: name the typeface, the scale step, the token. "Clean and modern" is not a decision.
- Evidence over assertion: a capture is evidence; your own account of what you built is not.
- Every default in the references yields to the user's brief and the project's design system.
- Web and Flutter are covered in depth. For SwiftUI, Compose or React Native, say so and apply only the platform-neutral references.
- Send no project content to an outside service without the user's approval.

## Size

Name the size in one line before any other step. The user can override it.

- **Small change** (restyle, spacing fix): follow the design file. No reference study, no alternative directions, no new component entries. `direct` adds nothing: go to `build`, load only what the change needs and apply steps 3 and 5 to the named target only.
- **New screen or feature**: `direct` steps 1, 3, 4 and 10 to 14, for the new screens only. Reuse the direction and tokens.
- **New product or redesign**: every `direct` step.

## Direct

Before UI code. Load `direction.md`; add the others as steps name them.

1. **Read what exists.** Tokens, theme, components, brand files. Decide: follow an established system, extend an incomplete one, or create one.
2. **Design read.** One line: what kind of product, who uses it, where and under what conditions.
3. **Inventory and flows.** Every screen, how the user moves between them, each screen's primary action.
4. **Surface mode per screen.** Persuade, Operate, Read or Experience, from the screen's job, never the product's category.
5. **Dials.** Design variance, motion intensity, visual density, each 1 to 10, with the reason.
6. **Ask.** One message with at most three questions (the one exception to asking one at a time), only on what changes the design: audience, the one thing a screen must achieve, hard constraints, references to share, consent for your own research, a stack detail the files do not show. Never ask the user to choose colours, fonts or CSS values; existing brand values are facts and may be requested.
7. **References** (new product or redesign; `research.md`). Always analyse what the user provides. Research yourself only if the user agreed and a browser or search tool exists; include one reference from outside the category; put no project details in search terms. Record for each: why relevant, borrowed, left.
8. **Direction.** New product or redesign: two or three directions that differ on an axis from the product itself (density, tone, navigation model), never only in loudness; recommend one; stop until the user picks or combines, then continue. Otherwise apply the approved direction and write none. Each passes the mood test and the category test. On request, build one throwaway sample screen per direction.
9. **Tokens** (`foundations.md`, then `web.md` or `flutter.md`). Three tiers: primitive, semantic, component. Map them to the stack. Compute contrast for every text and surface pair from the token values.
10. **Components** (`components.md`). Only those these screens use: the job, the alternative refused, and departures from the library default (the platform's native control where the project has no component library).
11. **Interactions** (`interactions.md`). Navigation and back, keyboard and focus, gestures, validation timing, feedback, transitions.
12. **State matrix** (`states-content.md`). Per screen: loading, empty (first use), empty (no results), error, offline, partial, success, long content.
13. **Save.** `docs/design/DESIGN.md` from `${CLAUDE_PLUGIN_ROOT}/templates/design/DESIGN.md` and `docs/design/SCREENS.md` from `${CLAUDE_PLUGIN_ROOT}/templates/design/SCREENS.md`. A later change of an approved direction also gets an ADR in `docs/architecture/decisions/`.
14. **Stop for approval.** Report the direction, what was assumed, and open questions. When the user approves, set `Status: approved`, `Approved by` and the date in `DESIGN.md`; until then it is a draft.

## Build

While a UI task is implemented. `/orchestra:feature-implementation` owns the task and follows these steps for UI work. A small change with no task file is made here, within the named target.

1. **Read the design file and the task.** No design file and more than a small change: run `direct` first.
2. **Load** `foundations.md`, `components.md`, `interactions.md`, `states-content.md` and the platform file, as the task needs.
3. **Outside-in.** Shell and region widths first, then content. Real copy; no placeholder text, no invented facts.
4. **Tokens only.** No hard-coded colour, spacing or radius.
5. **Every state the change touches.** The matrix rows for the screens built or changed, and each affected component's default, hover where it applies, focus, pressed, disabled, loading and error.
6. **Self-check.** Re-read the changed files against the anti-slop list in `direction.md` and the token rule; fix what it finds.
7. **Verify, bounded** (`review.md`). One batched capture at every target size and colour mode with motion settled, the width sweep on the web, console and runtime errors, overflow and layout shift, and the project's own accessibility check if it has one. Fix everything in one batch, confirm once at most, then stop.
8. **Exceptions.** A departure from the design file is recorded as a dated exception in `DESIGN.md` and approved by the user. Never depart silently.
9. **Report** with the evidence labels: what was captured, what was not, what was assumed. Nothing could be rendered: say `not captured` and use `Source inspected only`. A build report has no result line.

Inside the `orchestra:implementer` agent, which has no browser and cannot ask the user:

- No approved design file and more than a small change: stop and escalate. Never run `direct` there.
- A token or theme file outside the task's `files` needs changing, or the task needs a departure from the design file: stop and escalate.
- Capture with what the shell reaches (Flutter golden tests and `flutter analyze`, the project's own Playwright). Otherwise report `not captured`; the main session does the capture round.

## Review

Independent review of rendered UI, after `/orchestra:code-review` passes. Load `review.md`.

1. **Scope.** The task, the screens, the diff.
2. **Capture.** Same sizes and modes as `build`, including the width sweep on the web, with the session's browser tool. Nothing can render: review source and tokens only. Flutter: golden tests, `flutter screenshot` or an emulator capture, plus `flutter analyze`. Record console and runtime errors, overflow and layout shift.
3. **Accessibility checks.** Use only what the project has: axe through its own Playwright; Flutter's accessibility guideline tests. Install nothing. None available: say `not automatically checked`.
4. **Walk the primary flow** for feel: focus order, keyboard, gestures, feedback, transitions. Functional correctness stays with `/orchestra:testing`; still report a defect you see.
5. **Dispatch one reviewer** in a fresh context with the captures, the check output, your walk notes, `docs/design/DESIGN.md`, the state matrix, `review.md`, `foundations.md` and the anti-slop list in `direction.md`. Not the implementer's explanation. It does steps 6 to 8; check its findings against the captures before logging them.
6. **Score** the nine rubric dimensions 0 to 4. Scores never block; severities do.
7. **Compare** with the approved direction, components and interaction notes. A recorded exception is not a finding; an unrecorded departure is.
8. **Classify** each finding with the design severity mapping in `review.md`, confirmed or potential, with a capture or `path:line` as evidence. A taste finding is Medium at most unless it contradicts the approved direction.
9. **Log.** Append a block to `docs/quality/REVIEW_LOG.md`: date, task, reviewer, evidence labels, scope and limits, one line per finding, result.
10. **Do not edit code.** If the user asks for fixes, hand the findings to `/orchestra:feature-implementation`; the fix passes testing and code review again before a new design review.

## Output

Evidence labels first, one line each with its state:

- `Visually verified`: sizes and modes covered.
- `Accessibility verified`: the check that ran and the manual items walked; `not automatically checked` with no automated check; `not checked` with neither.
- `Functionally verified`: cited from `/orchestra:testing` or acceptance-verifier evidence. Never claim it yourself.
- `Source inspected only`: only when nothing could be rendered. The review cannot pass; say so.

Then findings, most severe first: `[Severity][confirmed|potential] path:line — problem. Fix: action.` Show Critical and High in the report; the full list is in the review log.

Then one line: `Result: pass | blocked (N Critical, N High) | not verified (source only)`. Missing evidence is stated, never turned into a pass.

## Gate

- `direct`: the user approves the direction before any UI is built. A throwaway sample is not UI built.
- `review`: any open Critical or High finding blocks the task. Only the user can waive one; record the waiver and reason in the review log. `not verified (source only)` does not satisfy a required design review unless the user waives it.
- After a pass on a task whose code review, and security review if needed, are logged as passed: `light` tier, set `verified`; `standard` and `full`, dispatch `orchestra:acceptance-verifier`. Otherwise name the review still awaited. With no task, report only.

## On request: gstack

Run these only when the user asks. Their output is input, never approval; their scores and verdicts are discarded.

- `/plan-design-review` on the design file: text only, no mockups unless the user approved image generation for this project; decline outside voices.
- `/design-review` (web, clean working tree only): setup and audit phases, then stop before triage. No fixes, commits, stash, outside voices, target mockups, or writes to `DESIGN.md` or `TODOS.md`. Re-check its findings against the captures, drop duplicates and log the rest tagged with their source.
