# Changelog

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
