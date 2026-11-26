# Changelog

## 0.2.0 — 2026-11-26

- New skill `/orchestra:ui-design` with three modes: `direct` (direction, tokens, components, interactions and screen states before code), `build` (design discipline during a UI task) and `review` (evidence-based review of the rendered result; reports only). Covers websites, web apps and Flutter. Ten reference files, no scripts, no runtime dependency on any source skill.
- Routing: UI design is owned by the new skill. gstack `/plan-design-review` and `/design-review` run only on the user's request; `/design-review` is now pinned in the manifest. Reasons in ADR-0003.
- New rule, standard and full tiers: a task that touches UI needs an approved `docs/design/DESIGN.md` before it is planned and a passing `/orchestra:ui-design review` after code review. No new key in `project.json`. The light tier is unchanged.
- Two on-demand templates: `design/DESIGN.md`, `design/SCREENS.md`.
- `architecture`, `sprint-planning`, `feature-implementation`, `code-review`, the `implementer` agent and the severity, lifecycle and quality-gates standards point at the new skill.
- Migration: an existing project on the standard or full tier runs `/orchestra:ui-design direct` once to create `docs/design/` before planning further UI tasks.
- Not tested: `build` and `review` with real screenshots on a project; the constrained use of the two gstack design skills. `init` still does not detect Flutter; the skill reads `pubspec.yaml` itself.

## 0.1.5 — 2026-11-21

- Manifest: gstack pinned at 1.102.1.0 (upgraded from 1.91.295.0). The gstack route tests predate the upgrade and were not rerun.
- graphify CLI on the build machine upgraded to 0.9.114, matching the skill; the Windows file-lock workaround is documented in the compatibility notes.
- Update guide: pending items refreshed, including gstack's unfinished settings-hook update.

## 0.1.4 — 2026-11-21

Fixes from running the superpowers, gstack and graphify routes live.

- `testing` and `sprint-planning` now actually point to `superpowers:verification-before-completion` and `superpowers:dispatching-parallel-agents`; the routing table named them but no skill did.
- `feature-implementation`: names the test-first skill on the main-session path; plans stay in the task file; worktree, lockfile and merge rules stated.
- New "Rules when a routed skill runs" in the routing standard: orchestra's approval rules win, routed output is kept under a clear heading, other projects' details are never used, mid-workflow upgrade offers are declined.
- gstack routes: `testing` passes the URL and criteria to `/qa-only` and records the report path; `requirements`, `architecture` and `project-discovery` say what the gstack reviews write and where; `release` notes that `/ship` has no approval stop of its own.
- graphify route: size threshold, measured cost, where the report is and how to query it; `project-handover` falls back to a full build.
- Doctor: reports a graphify CLI that is older than the installed graphify skill.

## 0.1.3 — 2026-11-21

Fixes from running every workflow live in two test sessions.

- Status order made consistent: command gates, then review, then acceptance. `testing` now ends at `in-review`; `code-review` ends by setting `verified` (light tier) or dispatching the acceptance verifier (standard, full). The verifier no longer sets `verified` while a required review is pending.
- A test command that runs zero tests no longer counts as a passing gate.
- `implementer`: verification-log line format stated; it no longer ticks acceptance checkboxes.
- `architecture`: states that the ECC architect is read-only and the main session writes the files; handles a stack already fixed by the brief; undecided choices keep an ADR `proposed`.
- `requirements` and `product-manager`: exact Status line wording; one numbering for open questions.
- `code-review`: task files and the review log are left out of the diff; cited line numbers are checked.
- `init`: writes the current factory version into `project.json`; skips questions the brief answers; dry run can preview the `CLAUDE.md` change.
- Smaller clarifications in `security-review`, `project-handover`, `sprint-planning` and `project-discovery`.
- Sample project: T-003 implemented, reviewed and verified through the live workflows.

## 0.1.2 — 2026-11-21

- Guard hook: secrets files and credential-like content are now blocked in every permission mode. A second live test showed a hook "ask" is also resolved without a prompt in accept-edits mode.
- Guard hook: protected paths ask only in the default and plan modes and are blocked in all others. `hooks.unattended: "ask"` restores asking for protected paths only; it never applies to secrets.
- Lesson L-002 recorded: bump the version for every change that reaches an installed copy.

## 0.1.1 — 2026-11-21

- Guard hook: blocks instead of asking in unattended permission modes (auto, bypassPermissions, dontAsk). Found in the first live test: Claude Code resolved the hook's "ask" without a prompt in auto mode, so a secrets-file write went through.
- Guard hook: the project is located from the target file's path, not only the session directory.
- New project setting `hooks.unattended` (`deny` by default) and the `ORCHESTRA_GUARD_TRACE` debug variable.
- Migration: none needed; existing projects get the safer default.

## 0.1.0 — 2026-11-21

First version.

- Plugin packaging with 13 skills, 3 agents, 8 standards, 18 templates and 1 guard hook.
- Scripts: `init-project`, `board`, `doctor`, `validate-factory`.
- Integration manifest pinning ECC 2.2.3, gstack 1.91.295.0, superpowers 7.0.2 and graphify 0.9.114.
- Sample project with one feature taken from requirements to independent verification.
- Lesson L-001 applied: gate commands are run once before being recorded.
