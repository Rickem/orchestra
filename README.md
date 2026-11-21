# orchestra

A reusable software factory for Claude Code. It gives every project the same lifecycle, task tracking, quality gates and approval points, and it orchestrates tools you already have (ECC, gstack, superpowers, optionally graphify) instead of duplicating them.

Version 0.1.2. Licence: MIT. Read [FACTORY_GUIDE.md](FACTORY_GUIDE.md) for day-to-day use.

## What you get

| Part | What it is |
|---|---|
| 13 skills | `/orchestra:init`, `project-discovery`, `requirements`, `architecture`, `sprint-planning`, `feature-implementation`, `testing`, `code-review`, `security-review`, `release`, `project-handover`, `board`, `doctor` |
| 3 agents | `implementer`, `acceptance-verifier`, `product-manager` |
| 8 standards | Principles, concise output, severity, lifecycle, quality gates, parallel work, security and privacy, upstream routing ([`standards/`](standards/)) |
| 18 templates | Project config and product, architecture, development, quality, operations and governance documents ([`templates/`](templates/)) |
| 1 hook | Asks before writing secrets files, credential-like content or protected paths ([`hooks/README.md`](hooks/README.md)) |
| 4 scripts | `init-project`, `board`, `doctor`, `validate-factory` (Node.js, no dependencies) |
| Task board | Read-only HTML board generated from task files |

## Layers

| Layer | Lives in | Contains |
|---|---|---|
| Factory | This repository, installed as a plugin | Workflows, agents, standards, templates, scripts |
| Project | Each project's `.orchestra/project.json`, `docs/`, `CLAUDE.md` | Stack, gate commands, requirements, decisions, tasks |
| Upstreams | Their own installs | ECC, gstack, superpowers, graphify, pinned in [`integrations/manifest.json`](integrations/manifest.json) |

Project decisions override factory defaults. The factory never copies upstream files.

## Install

Requires Claude Code with plugin support and Node.js 18 or newer.

```
claude plugin marketplace add C:\app\projects\orchestra
claude plugin install orchestra@orchestra-local
```

To try it without installing: `claude --plugin-dir C:\app\projects\orchestra`.

Then check the setup with `/orchestra:doctor`, or `node scripts/doctor.mjs`.

The upstreams are recommended, not required. Without one, orchestra uses the fallback in [`standards/upstream-routing.md`](standards/upstream-routing.md) and the doctor tells you which.

## Start a project

1. Open the project folder in Claude Code.
2. `/orchestra:init` — detects the stack, asks what it cannot detect, creates the project layer. It never overwrites a file.
3. `/orchestra:project-discovery`, then `/orchestra:requirements`, and onward. See the lifecycle in [`standards/lifecycle.md`](standards/lifecycle.md).
4. `/orchestra:board` at any time to see where every task stands.

## Reused, custom, excluded

| | |
|---|---|
| Reused | ECC review and architecture agents; gstack product critique, browser QA and shipping; superpowers test-first, debugging, verification and worktrees; graphify (optional) |
| Custom | Init, task format and statuses, quality gates, board, acceptance verifier, implementer, product manager, validation, doctor, integration manifest |
| Excluded | Separate frontend, backend, database and DevOps agents; automatic lesson capture; MCP servers by default; Agent Teams; format and lint hooks |

Reasons are in [`docs/integrations/COMPONENT_MATRIX.md`](docs/integrations/COMPONENT_MATRIX.md).

## Documentation

| Document | For |
|---|---|
| [FACTORY_GUIDE.md](FACTORY_GUIDE.md) | Using and customising the factory |
| [docs/VALIDATION_REPORT.md](docs/VALIDATION_REPORT.md) | What was actually tested, and what was not |
| [docs/integrations/](docs/integrations/UPSTREAM_ASSESSMENT.md) | Upstream assessment, component matrix, compatibility, update guide, MCP notes |
| [docs/governance/](docs/governance/MAINTENANCE.md) | Maintenance and the lessons process |
| [docs/decisions/](docs/decisions/ADR-0001-plugin-packaging.md) | Factory design decisions |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Known limits and planned improvements |
| [examples/sample-project/](examples/sample-project/README.md) | One feature taken through the workflow |

## Develop the factory

```
npm test
node scripts/validate-factory.mjs
claude plugin validate .
```
