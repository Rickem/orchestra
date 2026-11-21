# Shared lessons

Lessons move from a project into the factory only by hand, after review. Nothing is captured or promoted automatically.

## Process

1. **Capture.** At handover, or after a review, test failure or incident, write a candidate using `templates/governance/LESSON.md`. Keep it in the project.
2. **Sanitise.** Remove secrets, credentials, personal data, client names and anything about the project's business logic, data or architecture. Tick the checklist in the template.
3. **Classify.** `project-only` lessons stay in that project's docs. Only a rule that would help an unrelated project is `reusable`.
4. **Review.** The factory owner reads each reusable candidate and approves or rejects it.
5. **Promote.** Apply an approved lesson as a small edit to a standard, skill or agent in this repository. Add a row below and a `CHANGELOG.md` entry.
6. **Retire.** If a lesson proves wrong or outdated, revert the edit and mark the row retired with the reason.

## Register

| ID | Date | Lesson | Applied in | Factory version | Status |
|---|---|---|---|---|---|
| L-001 | 2026-11-21 | A test command must be run once before it is recorded as a gate; a wrong command can look like a failing test. | `skills/init/SKILL.md` step 4 (confirm gate commands) | 0.1.0 | approved |

L-001 came from building the sample project: `node --test test/` fails on Node 22 for a reason unrelated to the code.
