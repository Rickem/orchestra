# Factory guide

## Choosing how much process

| Situation | Tier | Run |
|---|---|---|
| Small fix in one module | light | One task file → `feature-implementation` → `testing` → `code-review` |
| A feature | standard | `requirements` (for that feature) → `sprint-planning` → per task: `feature-implementation` → `testing` → `code-review` |
| New project, or anything touching auth, payments, personal data, migrations or infrastructure | full | Every stage in [`standards/lifecycle.md`](standards/lifecycle.md), plus `security-review` |

Not every task needs every agent. The tier decides.

## The workflows

| Skill | Input | Output | Stops for your approval |
|---|---|---|---|
| `/orchestra:init` | A repository | `.orchestra/project.json`, `docs/` skeleton | Before each choice; never overwrites |
| `/orchestra:project-discovery` | Repo, your brief | `docs/product/DISCOVERY.md` | Yes, before requirements |
| `/orchestra:requirements` | Accepted discovery | `PRD.md`, `REQUIREMENTS.md` | Yes |
| `/orchestra:architecture` | Approved requirements | `SYSTEM_ARCHITECTURE.md`, ADRs, `stack` | Yes |
| `/orchestra:sprint-planning` | Approved architecture | Task files, sprint file | Yes |
| `/orchestra:feature-implementation` | One task | Code, tests, status `implemented-unverified` | Plan confirmation on standard and full tiers |
| `/orchestra:testing` | Task or diff | Verification log, status `in-review` | No |
| `/orchestra:code-review` | The diff | Findings in `REVIEW_LOG.md`; on a pass, status `verified` (through the acceptance verifier on standard and full tiers) | To waive a Critical or High finding |
| `/orchestra:security-review` | The diff | Findings with scope and limits | Same |
| `/orchestra:release` | Accepted tasks | Checklist, release notes | Yes, before any push or deploy |
| `/orchestra:project-handover` | The project | `HANDOVER.md` | No |
| `/orchestra:board` | Task files | Text summary or HTML board | No |
| `/orchestra:doctor` | — | Setup report | No |

`init` and `release` run only when you invoke them.

## Tasks and status

One Markdown file per task in `docs/development/tasks/`, with frontmatter (`id`, `title`, `status`, `tier`, `owner`, `requirement`, `depends_on`, `files`) and fixed sections. The template is [`templates/development/TASK.md`](templates/development/TASK.md).

`not-started` → `in-progress` → `implemented-unverified` → `in-review` → `verified` → `accepted`, with `blocked` available at any point. The implementer cannot set `verified`; only you set `accepted`. Every check adds a line to the task's verification log. Details: [`standards/quality-gates.md`](standards/quality-gates.md).

## The board

```
node scripts/board.mjs --project <dir> --check        # text summary, exits 1 on errors
node scripts/board.mjs --project <dir>                # writes .orchestra/board.html
node scripts/board.mjs --project <dir> --serve 4173   # http://127.0.0.1:4173, refreshes every 5 s
```

It shows what each task's owner is responsible for and the latest evidence. It also flags unknown statuses, missing dependencies and two active tasks owning the same file. To watch an agent work live, open its session in the Claude app.

## Parallel work

Plan first: `sprint-planning` puts tasks with no shared files and no dependency into a parallel group. Run each in its own worktree or session. Rules and costs: [`standards/parallel-work.md`](standards/parallel-work.md).

## UI stack and design

Orchestra imposes no framework or library. `init` detects what a project uses (framework, component library, styling) and records it under `stack.ui`; for a new project `/orchestra:architecture` asks you and records the choice as an ADR. Agents follow the project's design system. For design critique, gstack `/plan-design-review` and `/design-review` are the routed owners.

## Customising safely

| You want to | Change | Notes |
|---|---|---|
| Set or change gate commands | `gates` in the project's `.orchestra/project.json` | Run the command once first |
| Make a gate optional | `required: false` on that gate | Record why in an ADR; never skip a required gate silently |
| Warn before edits to sensitive paths | `protectedPaths` globs | e.g. `"migrations/**"` |
| Turn off the guard hook | `hooks.guard: false` | See [`hooks/README.md`](hooks/README.md) |
| Use graphify or browser QA | `integrations` flags | Off by default |
| Override a factory rule for one project | An ADR in the project | Project decisions win once recorded |
| Change a rule for all projects | Edit `standards/` here | Follow [`docs/governance/MAINTENANCE.md`](docs/governance/MAINTENANCE.md) |
| Route a capability to a different tool | [`standards/upstream-routing.md`](standards/upstream-routing.md) | Keep one owner per capability |

## Output style

Every report and comment follows [`standards/concise-output.md`](standards/concise-output.md): result first, 15 lines at most, one line per finding, code comments only for a non-obvious why.

## What needs your approval, always

Push, merge, deploy, destructive migrations, credential changes, overwriting existing files, waiving a required gate or a Critical or High finding, and marking a task `accepted`.

## Known limitations

See [`docs/ROADMAP.md`](docs/ROADMAP.md) and [`docs/VALIDATION_REPORT.md`](docs/VALIDATION_REPORT.md).
