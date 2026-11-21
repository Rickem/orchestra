---
name: testing
description: Use to verify a change or task - find the project's real test framework and commands, run focused tests then the broader relevant suites, add missing tests for changed behaviour, and report failures accurately. Never weakens tests to get a pass.
---

# Testing

Read `${CLAUDE_PLUGIN_ROOT}/standards/principles.md`, `${CLAUDE_PLUGIN_ROOT}/standards/quality-gates.md` and `${CLAUDE_PLUGIN_ROOT}/standards/concise-output.md` first.

## Inputs

- A task file or a diff.
- Gate commands in `.orchestra/project.json`. If `gates.test.command` is null, detect the command from the project's manifest and CI config, confirm it with the user, and save it.

## Steps

1. **Focused first.** Run the tests for the changed files. Then run the broader suite the change could affect. Do not run a full slow suite after every small edit.
2. **Coverage of change.** For each changed behaviour and each acceptance criterion, name the test that would fail without it. Add the missing ones.
3. **Other gates.** Run `lint`, `typecheck` and `build` if they have commands.
4. **Failures.** Report the exact failing test and message. Use `superpowers:systematic-debugging` to find the cause. A pre-existing failure is reported as such, not hidden.
5. **Browser checks (UI only).** If `integrations.browserQa` is true, run gstack `/qa-only` against the acceptance criteria and keep its report as evidence. Fallback: `ecc:e2e-runner`.
6. **No tests is not a pass.** If the test command runs zero tests, or none that exercises the change, record the `test` gate as `fail` with that reason.
7. **Record.** Append one line per check to the task's `## Verification log`. Set status: `in-review` if the required gates pass; `in-progress` if not. Do not set `verified` here: that happens after review, at the end of `/orchestra:code-review`.

## Rules

- Never delete, skip, loosen or mock away a test to obtain a pass. If a test is wrong, say why and get the user's agreement before changing it.
- "Passed" means you ran it in this session and saw the result.
- Test data is synthetic. No production or personal data.

## Output

Report, 15 lines at most: commands run with results, tests added, failures, criteria table, what was not verified.
