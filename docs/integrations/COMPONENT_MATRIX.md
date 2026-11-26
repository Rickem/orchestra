# Component matrix

Decision values: **reuse** (called as-is), **wrap** (called inside an orchestra skill that adds gates and evidence), **custom** (built here), **defer** (not built or installed).

## Capabilities

| Capability | Decision | Owner | Orchestra adds | Why this owner |
|---|---|---|---|---|
| Product discovery and critique | wrap | gstack `/office-hours`, `/plan-ceo-review` | Discovery report, approval gate | Strongest product questioning of the three |
| Requirements | custom | `product-manager` agent, `/orchestra:requirements` | IDs, acceptance criteria, security table | No upstream ties requirements to tasks and tests |
| Architecture design | wrap | ECC `architect` agent | ADR template, approval gate | Read-only specialist agent |
| Plan critique | reuse | gstack `/plan-eng-review` | — | Optional second opinion |
| UI design direction, build guidance and review | custom | `/orchestra:ui-design` | Design file, state matrix, evidence labels, blocking gate | No upstream covers Flutter or runs report-only; see ADR-0003 |
| Sprint planning and task files | custom | `/orchestra:sprint-planning` | Task format, file ownership, parallel groups | Needed for the board and gates |
| Implementation | custom | `implementer` agent | Scope and file-ownership rules | One stack-agnostic agent replaces separate frontend, backend and database agents |
| Test-first discipline | reuse | superpowers `test-driven-development` | — | Small, strict, stack-agnostic |
| Debugging | reuse | superpowers `systematic-debugging` | — | Same |
| Verify before done | reuse | superpowers `verification-before-completion` | Verification log | Same |
| Worktrees, parallel dispatch | reuse | superpowers `using-git-worktrees`, `dispatching-parallel-agents` | File-ownership check | Matches the Git safety rules |
| Code review | wrap | ECC `code-reviewer` agent (plus language reviewers) | Severity policy, review log, blocking gate | Independent context, many language variants |
| Security review | wrap | ECC `security-reviewer` agent | Scope and limits statement, blocking gate | Same |
| Database review | reuse | ECC `database-reviewer` agent | — | Covers migrations and data-layer authorization |
| Acceptance verification | custom | `acceptance-verifier` agent | — | No upstream verifies criteria independently of the author |
| Browser QA | wrap | gstack `/qa-only`, `/qa` | Acceptance criteria as input, evidence kept | Real-browser tooling |
| Release | wrap | gstack `/ship`, `/land-and-deploy` | Checklist, release notes, approval before any push or deploy | Upstream ships fast; orchestra adds the stop |
| Handover | custom | `/orchestra:project-handover` | — | Built from task evidence |
| Project init | custom | `/orchestra:init`, `init-project.mjs` | — | Specific to this factory |
| Quality gates, task status | custom | `standards/quality-gates.md`, `project.json` | — | Specific to this factory |
| Task board | custom | `board.mjs` | — | No upstream reads these task files |
| Validation, doctor, manifest | custom | `validate-factory.mjs`, `doctor.mjs`, `manifest.json` | — | Specific to this factory |
| Codebase map | reuse, optional | graphify | Off by default per project | Helps only on large or unfamiliar code |
| Shared lessons | custom, manual | `docs/governance/LESSONS.md` | Human approval before promotion | Automatic capture risks leaking project detail |

## Selected components

| Upstream | Components |
|---|---|
| ECC | Agents `architect`, `code-reviewer`, `security-reviewer`, `database-reviewer`, `e2e-runner`; skills `tdd-workflow`, `verification-loop` (fallbacks) |
| gstack | `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/qa-only`, `/ship`, `/land-and-deploy`; on the user's request only: `/plan-design-review`, `/design-review` |
| superpowers | `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `writing-plans`, `using-git-worktrees`, `dispatching-parallel-agents` |
| graphify | `/graphify` (optional) |

## Deliberately not used or installed

| Item | Reason |
|---|---|
| Separate frontend, backend, database and DevOps agents | One implementer plus ECC reviewers covers them; role agents added files, not quality |
| ECC `continuous-learning`, instincts | Automatic rule creation without review |
| ECC `plan`, gstack `/review`, `/autoplan`, superpowers `brainstorming` | Would give a capability two owners |
| gstack `/cso` | Needs a native toolchain; ECC owns security review |
| The other ~300 ECC skills and ~70 gstack skills | Not needed by the lifecycle; still available to the user directly |
| MCP servers | Project-dependent; see [MCP.md](MCP.md) |
| Agent Teams | Optional Claude Code capability; never a dependency |
| Format and lint hooks | ECC already provides them |
