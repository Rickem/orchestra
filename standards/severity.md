# Finding severity

| Level | Meaning | Effect on gates |
|---|---|---|
| Critical | Immediate severe security, data-integrity or system-compromise risk | Blocks. Escalate to the user at once. |
| High | Major functional failure, privilege issue or serious regression | Blocks until fixed or explicitly accepted by the user. |
| Medium | Material defect or maintainability risk with limited impact | Fix or log as a task before release. |
| Low | Minor defect or improvement | Log; optional. |
| Informational | Observation or optional recommendation | No action required. |

Rules:

- Mark each finding **confirmed** (reproduced or proven from code) or **potential** (plausible, not proven).
- A review states its scope and limits. A limited review is never called a complete audit.
- Findings go in `docs/quality/REVIEW_LOG.md` using the one-line format in `concise-output.md`.
- Design findings use the same levels, mapped in `${CLAUDE_PLUGIN_ROOT}/skills/ui-design/references/review.md`. A taste finding is Medium at most unless it contradicts the approved design.
