---
name: code-review
description: Use to get an independent review of an orchestra task's actual diff for correctness, security, data integrity, regressions and maintainability, with findings by severity logged to the review log. Reports only; does not change code unless asked to fix findings.
---

# Code review

Read `${CLAUDE_PLUGIN_ROOT}/standards/severity.md` and `${CLAUDE_PLUGIN_ROOT}/standards/concise-output.md` first.

## Inputs

- The diff: a branch, commit range or working tree (`git diff`). Review the diff itself, never a description of it.
- The task file, for scope and acceptance criteria.

## Steps

1. **Get the diff.** `git diff <base>...HEAD` or `git diff` for uncommitted work. If there is no diff, stop. Review code, tests and configuration; leave task files and the review log out of it.
2. **Dispatch one reviewer.** Send the diff and the task's acceptance criteria to the `ecc:code-reviewer` agent, in a fresh context without the implementer's explanation. Ask for line numbers of the source file, not of the diff, and check any cited line before logging it. If a language-specific ECC reviewer matches the stack (for example `ecc:typescript-reviewer`, `ecc:python-reviewer`), use it together with the general one for the same pass. Fallback when ECC is missing: the built-in `/code-review`.
   Do not also run gstack `/review` on the same diff; one owner per review.
3. **Check scope.** Flag any changed file outside the task's `files` list and any behaviour the task did not ask for.
4. **Classify.** Give each finding a severity and mark it confirmed or potential. Drop style nits a linter would catch.
5. **Log.** Append a block to `docs/quality/REVIEW_LOG.md`: date, task, reviewer, scope and limits, one line per finding, result.
6. **Do not edit code.** If the user asks for fixes, hand the findings to `/orchestra:feature-implementation`, then review the new diff.

## Output

Findings, one line each, most severe first:

`[Severity][confirmed|potential] path:line — problem. Fix: action.`

Then one line: `Result: pass | blocked (N Critical, N High)`.

## Gate

Any open Critical or High finding blocks the task. Only the user can waive one; record the waiver and reason in the review log.

## After a pass

1. If the task needs a security review (see the lifecycle standard) and none is logged for this change, run `/orchestra:security-review` first.
2. If the task touches UI and its tier is `standard` or `full`, run `/orchestra:ui-design review` next. It must pass, and it takes over the two steps below.
3. `light` tier: set the task to `verified` and add a verification-log line naming the review.
4. `standard` and `full` tiers: dispatch `orchestra:acceptance-verifier` with the task path. It rechecks every criterion itself and sets `verified`.
