# Quality gates and task status

## Gates

Gates are configured per project in `.orchestra/project.json` under `gates`. Each gate has a `command` (or `"manual"`), and `required: true|false`. Orchestra never assumes a command; `init` detects candidates and the user confirms them.

| Gate | Typical source | Default |
|---|---|---|
| `test` | Project test command | required |
| `lint` | Project linter | required if one exists |
| `typecheck` | Compiler or type checker | required if one exists |
| `build` | Build command | required if one exists |
| `codeReview` | `/orchestra:code-review` | required |
| `securityReview` | `/orchestra:security-review` | required for sensitive changes (see `lifecycle.md`) |
| `acceptance` | `acceptance-verifier` agent | required for standard and full tiers |

Design review (`/orchestra:ui-design review`) is required by rule, with no key in `project.json`, for tasks that touch UI on the standard and full tiers (see `lifecycle.md`).

A required gate is never skipped silently. To waive one, the user says so and the waiver is written to the task's verification log with a reason.

## Definition of done

A task is done when every applicable item holds:

- Acceptance criteria are met and independently checked.
- The change follows the project's architecture and conventions.
- Required gates ran and passed; results are in the verification log.
- Input validation, error handling, authorization and data access were considered.
- UI changes follow `docs/design/DESIGN.md`; accessibility and responsive behaviour were checked, by `/orchestra:ui-design review` where the tier requires it.
- No open Critical or High finding.
- Affected documentation is updated.

## Task status

| Status | Meaning | Who moves it here |
|---|---|---|
| `not-started` | Specified, not begun | Planner |
| `in-progress` | Being implemented | Implementer |
| `blocked` | Cannot proceed; reason recorded | Anyone |
| `implemented-unverified` | Code written; gates not yet run | Implementer |
| `in-review` | Gates passed; review under way | Tester |
| `verified` | Review clean and acceptance criteria independently confirmed | Acceptance verifier (standard, full); the review step (light) |
| `accepted` | The user accepted it | User only |

The implementer never sets `verified` or `accepted` on their own work.

Order: command gates, then review (code review, security review if needed, design review for UI tasks), then acceptance. `verified` is never set while a required review is still pending. A test command that runs zero tests does not pass the `test` gate.

## Verification log

Each task file ends with a `## Verification log`. One line per check:

`YYYY-MM-DD | gate | ran: <command> | pass/fail | note`
