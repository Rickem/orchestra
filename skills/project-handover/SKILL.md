---
name: project-handover
description: Use at a milestone or project end to write a handover document covering architecture, implemented features, setup, commands, environment variables by name only, known issues, operations and next steps, clearly marking incomplete or unverified work.
---

# Project handover

Read `${CLAUDE_PLUGIN_ROOT}/standards/principles.md` and `${CLAUDE_PLUGIN_ROOT}/standards/concise-output.md` first.

## Inputs

- The repository, `docs/`, task files and `.orchestra/project.json`.

## Steps

1. **Gather from sources, not memory.** Features and status from task files (`node "${CLAUDE_PLUGIN_ROOT}/scripts/board.mjs" --project . --check` prints the counts); architecture from `SYSTEM_ARCHITECTURE.md` and ADRs; commands from the manifest and `gates`.
2. **Verify setup.** Run the documented install, test and build commands. Mark each as ran (result) or not run (why).
3. **Environment variables.** List names and purpose only, from `.env.example` or config. Never read or print values.
4. **Honest status.** List separately: accepted, verified but not accepted, implemented but unverified, not started. List open findings and defects.
5. **Map (optional).** For a large codebase with `integrations.graphify` true, refresh the graph with `/graphify --update` and link its report.
6. **Write** `docs/operations/HANDOVER.md` from `${CLAUDE_PLUGIN_ROOT}/templates/operations/HANDOVER.md`. Link to existing docs; do not copy them.
7. **Lessons.** Propose candidate lessons using the LESSON template. They stay candidates until the user approves them; see the factory's `docs/governance/LESSONS.md`.

## Output

`HANDOVER.md` and a report: what is done, what is unverified, top risks, next steps.

## Rules

No secret values, personal data or client-confidential detail anywhere in the handover.
