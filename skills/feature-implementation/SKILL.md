---
name: feature-implementation
description: Use to implement one orchestra task file end to end - confirm scope and acceptance criteria, inspect existing code, plan, implement only the agreed scope test-first, run the project's checks, and report changed files, results and remaining risks.
---

# Feature implementation

Read `${CLAUDE_PLUGIN_ROOT}/standards/principles.md`, `${CLAUDE_PLUGIN_ROOT}/standards/quality-gates.md` and `${CLAUDE_PLUGIN_ROOT}/standards/concise-output.md` first.

## Inputs

- A task ID or task file path. If no task file exists, create one with `/orchestra:sprint-planning` (a single `light` task is fine for a small change).
- `.orchestra/project.json` for gate commands.

## Steps

1. **Confirm.** Read the task. Stop if acceptance criteria are missing or ambiguous, if a `depends_on` task is not at least `verified`, or if another in-progress task owns the same files.
2. **Inspect.** Read the code the task touches and the nearest existing example of the same kind of change.
3. **Plan.** Write a short plan under `## Plan` in the task file: steps, tests to add, risks. For `standard` and `full` tiers use `superpowers:writing-plans` if available, and get the user's confirmation before coding.
4. **Isolate.** If other tasks are running, work in a separate worktree (`superpowers:using-git-worktrees`).
5. **Implement.** Either dispatch the `orchestra:implementer` agent with the task path, or do it in the main session following that agent's rules: test-first, only the files the task owns, no new dependency the task does not name.
   - UI work follows the project's design system and `stack.ui`; check accessibility and responsive behaviour.
   - Schema work uses reversible migrations; a destructive migration needs the user's approval first.
   - On a failing test or unexpected behaviour, use `superpowers:systematic-debugging` before changing code.
6. **Check.** Run the configured `test`, `lint`, `typecheck` and `build` gates that have a command. Append each result to `## Verification log`. Never weaken or delete a test to pass.
7. **Status.** Set `implemented-unverified`. Do not set `verified`.
8. **Docs.** Update any document the change makes wrong.

## Output

Report, 15 lines at most: task and status, changed files, each gate as ran/not run with result, criteria met or not, risks and follow-ups.

## Gate

Next is `/orchestra:testing`, then `/orchestra:code-review`. No commit, push or merge without the user's approval.
