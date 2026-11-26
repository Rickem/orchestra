# Upstream routing

One owner per capability. Orchestra skills call the owner by name and add gates, evidence and approvals around it. If the owner is not installed, use the fallback and say so in the report.

| Capability | Owner | Fallback |
|---|---|---|
| Product discovery and critique | gstack `/office-hours`, `/plan-ceo-review` | `product-manager` agent |
| Requirements | orchestra `product-manager` agent | — |
| Architecture design | ECC agent `ecc:architect` | Main session |
| Plan critique | gstack `/plan-eng-review` | `ecc:architect` |
| UI design direction, build guidance and review | orchestra `/orchestra:ui-design` | — |
| Implementation plan | superpowers `writing-plans` | Plan section of the task file |
| Test-first development | superpowers `test-driven-development` | ECC skill `ecc:tdd-workflow` |
| Debugging | superpowers `systematic-debugging` | gstack `/investigate` |
| Verify before claiming done | superpowers `verification-before-completion` | ECC skill `ecc:verification-loop` |
| Worktrees and parallel dispatch | superpowers `using-git-worktrees`, `dispatching-parallel-agents` | `parallel-work.md` by hand |
| Code review | ECC agent `ecc:code-reviewer` (plus the matching language reviewer) | Built-in `/code-review` |
| Security review | ECC agent `ecc:security-reviewer` | Built-in `/security-review` |
| Database review | ECC agent `ecc:database-reviewer` | `ecc:code-reviewer` |
| Browser QA | gstack `/qa-only` (report) or `/qa` (fix) | ECC agent `ecc:e2e-runner` |
| Ship (push, open PR) | gstack `/ship`, only after `/orchestra:release` approval | Manual git and `gh` |
| Codebase map (optional) | graphify `/graphify` | Read the code directly |

## Rules when a routed skill runs

- Orchestra's rules win where they differ: no commit, push or merge without the user's approval; plans live in the task file; findings are input, never approval.
- A routed skill may write its own section into an orchestra document or its own files elsewhere (`docs/designs/`, `.gstack/`). Keep such output under a clear heading or link it; do not let it replace the orchestra document.
- Routed skills may keep state outside the project (for example `~/.gstack`) and may show details of other projects from it. Never use those details.
- Decline upgrade, telemetry and setup offers made mid-workflow; updates follow the update guide.
- gstack `/plan-design-review` and `/design-review` run only when the user asks, under the limits in `/orchestra:ui-design`. Their findings are input to that skill; their scores and verdicts are not used.

Not used inside orchestra workflows, to avoid two owners for one job: superpowers `brainstorming`, gstack `/review`, ECC `continuous-learning`, ECC `plan`.

Versions and licences are pinned in `integrations/manifest.json`.
