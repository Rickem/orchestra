---
name: project-discovery
description: Use at the start of a project or before major work on an unfamiliar repo to inspect what exists, clarify the problem, users, goals and constraints, and produce a discovery report. Never starts implementation.
---

# Project discovery

Read `${CLAUDE_PLUGIN_ROOT}/standards/principles.md` and `${CLAUDE_PLUGIN_ROOT}/standards/concise-output.md` first.

## Inputs

- The repository (may be empty) and any brief the user gives.
- `.orchestra/project.json` if present. If absent, suggest `/orchestra:init` and continue read-only.

## Steps

1. **Inspect.** Read the README, docs, manifests, CI config, git log (last 20 commits, if there are any) and directory layout. Note the stack, commands and conventions actually in use.
2. **Map (optional).** For a large or unfamiliar codebase, and only if `integrations.graphify` is true or the user agrees, run `/graphify`, read `graphify-out/GRAPH_REPORT.md`, and use `graphify explain <file>` for dependency questions. Say what it costs first: about seven minutes and 500k tokens for a 100-file repository in testing. Skip it for new projects and whenever the code and docs fit in one context window (roughly under 100k words). Run the doctor first; a graphify version mismatch makes the build fail. Keep `graphify-out/` out of git unless the user wants it tracked.
3. **Clarify.** Ask the user, one question at a time, for anything not in the repo: problem, users, goals, constraints, deadline. For a new product idea, offer gstack `/office-hours` to pressure-test it; if gstack is missing, ask the questions yourself. `/office-hours` writes its own design document under `docs/designs/`: summarise the outcome in `DISCOVERY.md` and link it. Ignore anything it shows from other projects.
4. **Record.** Write or update `docs/product/DISCOVERY.md` from the DISCOVERY template. Separate what was *detected*, what the user *stated* and what is *assumed*.
5. **List env vars by name only.** Read names from `.env.example` or config. Never open or print values from `.env` files.

## Output

`docs/product/DISCOVERY.md` and a report of 15 lines at most: what exists, what to preserve, what is missing, top unknowns, proposed next step.

## Gate

Stop. Do not create code, requirements or architecture. The user accepts the report before `/orchestra:requirements`.
