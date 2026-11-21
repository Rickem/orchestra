# Changelog

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
