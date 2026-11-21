<!-- orchestra:start -->
## Orchestra

This project uses the orchestra software factory.

- Project configuration: `.orchestra/project.json` (stack, quality gates, protected paths).
- Tasks: `docs/development/tasks/`. Status moves only on evidence; only the user sets `accepted`.
- Decisions: `docs/architecture/decisions/` (ADRs). Project decisions override factory defaults.
- Workflows: `/orchestra:project-discovery`, `:requirements`, `:architecture`, `:sprint-planning`, `:feature-implementation`, `:testing`, `:code-review`, `:security-review`, `:release`, `:project-handover`, `:board`. Only the user can start `:init` and `:release`.
- Never state that a check passed unless it was run and the result seen.
- Keep every report and comment short: result first, 15 lines at most, one line per finding, code comments only for a non-obvious why.
- Ask before pushing, merging, deploying, deleting data, changing credentials or overwriting existing files.
<!-- orchestra:end -->
