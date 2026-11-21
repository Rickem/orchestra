---
name: requirements
description: Use after discovery is accepted to convert approved product decisions into functional and non-functional requirements with IDs, user journeys, business rules, edge cases and testable acceptance criteria, and to record unresolved questions.
---

# Requirements

Read `${CLAUDE_PLUGIN_ROOT}/standards/principles.md` and `${CLAUDE_PLUGIN_ROOT}/standards/concise-output.md` first.

## Inputs

- An accepted `docs/product/DISCOVERY.md`, or a brief the user confirms. If neither exists, run `/orchestra:project-discovery` first.

## Steps

1. Dispatch the `orchestra:product-manager` agent with the discovery report and the user's approved decisions. Tell it which template paths to fill: `docs/product/PRD.md` and `docs/product/REQUIREMENTS.md` (templates are in `${CLAUDE_PLUGIN_ROOT}/templates/product/`).
2. Check its output yourself:
   - Every functional requirement has an ID, a priority and acceptance criteria that a test could fail.
   - No requirement rests on an assumption; assumptions are in the open-questions table.
   - The security and privacy table is answered row by row, using `${CLAUDE_PLUGIN_ROOT}/standards/security-privacy.md`.
   - Accessibility and performance needs are stated or marked not applicable with a reason.
3. For a product-level challenge of scope and priorities, offer gstack `/plan-ceo-review` on the PRD. Optional.
4. Put open questions to the user one at a time, most blocking first.

## Output

`PRD.md`, `REQUIREMENTS.md` and a report: counts, conflicts found, open questions.

## Gate

Requirements stay `draft` until the user approves them. Record who approved and the date in the Status line. Do not start architecture on draft requirements.
