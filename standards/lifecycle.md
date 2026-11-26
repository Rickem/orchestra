# Lifecycle

Pick the lightest tier that fits the risk. Record the tier on the task. Iteration is expected; traceability (requirement → task → test → evidence) is not optional.

## Tiers

| Tier | Use for | Stages run |
|---|---|---|
| light | Small, low-risk change in one module | Plan → Develop → Verify → Review |
| standard | A feature or anything touching shared interfaces | Requirements → Plan → Develop → Verify → Review → Integrate |
| full | New project, or security-, data- or architecture-sensitive work | All twelve stages |

Anything touching authentication, authorization, payments, personal data, migrations or infrastructure is at least **standard** and always gets a security review.

A task touches UI when its `files` include screens, components, styles or theme files. On the **standard** and **full** tiers, UI tasks are planned only after `docs/design/DESIGN.md` is approved (`/orchestra:ui-design direct`), and each needs a passing `/orchestra:ui-design review` after code review. On the **light** tier, follow the design file if one exists; no design review is required.

## Stages

| # | Stage | Entry | Activities | Output | Exit | Approval |
|---|---|---|---|---|---|---|
| 1 | Discovery | A brief or an existing repo | `/orchestra:project-discovery` | Discovery report | Unknowns listed | User accepts report |
| 2 | Product requirements | Accepted discovery | `/orchestra:requirements` | `PRD.md`, `REQUIREMENTS.md` | Every requirement has acceptance criteria | User approves requirements |
| 3 | Architecture | Approved requirements | `/orchestra:architecture`; for a product with a UI, `/orchestra:ui-design direct` | `SYSTEM_ARCHITECTURE.md`, ADRs, `DESIGN.md`, `SCREENS.md` | Risks and trade-offs recorded | User approves ADRs and the design direction |
| 4 | Backlog and milestones | Approved architecture | `/orchestra:sprint-planning` | `ROADMAP.md`, task files | Tasks small, owned, non-overlapping | User approves sprint |
| 5 | Implementation plan | A task in `not-started` | Plan step of `/orchestra:feature-implementation` | Plan in the task file | Scope and tests agreed | Standard/full: user confirms plan |
| 6 | Development | Agreed plan | `/orchestra:feature-implementation` | Code, tests | Task is `implemented-unverified` | — |
| 7 | Automated verification | Code complete | `/orchestra:testing` | Verification log entry | Required gates ran and passed | — |
| 8 | Independent review | Verification passed | `/orchestra:code-review`, `/orchestra:security-review`, `/orchestra:ui-design review` | `REVIEW_LOG.md` entries | No open Critical or High | User accepts any waived finding |
| 9 | Integration | Review passed | Merge via reviewed diff; rerun tests on the integrated branch | Integrated branch | Tests pass after integration | User approves merge |
| 10 | Staging / acceptance | Integrated build | Acceptance verification against criteria | Acceptance evidence | Task is `verified` | User marks `accepted` |
| 11 | Approved release | Accepted scope | `/orchestra:release` | Release notes, rollback plan | Checklist complete | User approves deployment |
| 12 | Monitoring and maintenance | Released | Watch, triage defects, `/orchestra:project-handover` | Defect reports, handover | — | — |
