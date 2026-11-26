---
name: sprint-planning
description: Use to break approved requirements and architecture into small, independently verifiable task files with unique IDs, dependencies, file ownership, acceptance criteria and verification steps, and to identify which tasks can safely run in parallel.
---

# Sprint planning

Read `${CLAUDE_PLUGIN_ROOT}/standards/principles.md`, `${CLAUDE_PLUGIN_ROOT}/standards/parallel-work.md` and `${CLAUDE_PLUGIN_ROOT}/standards/concise-output.md` first.

## Inputs

- Approved requirements and accepted ADRs (for the `light` tier, a clear request from the user is enough).
- `paths.tasks` from `.orchestra/project.json` (default `docs/development/tasks`).

If the project already uses an issue tracker, keep tasks there and create task files only as local working copies that link to the issue.

## Steps

1. **Slice.** One task is one reviewable change: about a day of work or less, one purpose. Split anything broader before writing it down.
2. **Write task files.** Copy `${CLAUDE_PLUGIN_ROOT}/templates/development/TASK.md` to `<tasks>/T-NNN-slug.md`. IDs are sequential and never reused. Fill every section; acceptance criteria come from the requirement they trace to (`requirement: FR-001`).
3. **Own files.** List in `files`, as an inline list such as `[src/a.js, test/a.test.js]`, the files or modules the task may edit. No two tasks that could run at the same time may share an entry. A UI task names its screens from `docs/design/SCREENS.md` under `## Scope`, never in `files`; token and theme files get one owning task.
4. **Order.** Fill `depends_on`. Put shared interfaces (types, schemas, API contracts) in their own task, first. A contract already fixed in the architecture document needs no separate task.
5. **Group for parallel work.** Tasks with no dependency between them and no shared files form a parallel group. State the group in the sprint file. To run a group, use `superpowers:dispatching-parallel-agents` if it is installed.
6. **Tier.** Set `tier` per task using `${CLAUDE_PLUGIN_ROOT}/standards/lifecycle.md`. Anything touching auth, payments, personal data, migrations or infrastructure is at least `standard`. Do not create UI tasks on `standard` or `full` without an approved `docs/design/DESIGN.md`; run `/orchestra:ui-design direct` first. Such tasks need a design review after code review.
7. **Sprint file.** Write `docs/development/SPRINTS/sprint-NN.md` from the SPRINT template (create the folder if needed; leave the end date blank if none is set) and update `ROADMAP.md`.
8. **Check.** Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/board.mjs" --project . --check` and fix anything it reports (bad status, missing dependency, overlapping files).

## Output

Task files, sprint file, and a report: task count, parallel groups, risks.

## Gate

The user approves the sprint before implementation starts.
