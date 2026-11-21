---
name: architecture
description: Use after requirements are approved, or before a cross-cutting change, to propose architecture and technology choices that fit the actual project, define module boundaries, data flows and API contracts, and record decisions as ADRs with alternatives and trade-offs.
---

# Architecture

Read `${CLAUDE_PLUGIN_ROOT}/standards/principles.md` and `${CLAUDE_PLUGIN_ROOT}/standards/concise-output.md` first.

## Inputs

- Approved `docs/product/REQUIREMENTS.md`.
- Existing code and `.orchestra/project.json` (`stack`).

## Steps

1. **Read what exists.** Existing stack and conventions win unless there is a recorded reason to change them.
2. **Design.** Dispatch the `ecc:architect` agent (fallback: do it in the main session) with the requirements and current code. Ask for: module boundaries, data flow, API contracts, integration points, risks. Require the simplest design that meets the requirements; no distributed system, queue, cache or new service without a stated need tied to a requirement.
3. **Choose the stack for a new project.** Ask the user for language, framework, database, auth, hosting, and for UI: framework, component library and styling. Propose one option with a reason; never impose one. Write the choices to `stack` in `.orchestra/project.json`.
4. **Write.** Fill `docs/architecture/SYSTEM_ARCHITECTURE.md`. For each significant decision create `docs/architecture/decisions/ADR-NNNN-slug.md` from `${CLAUDE_PLUGIN_ROOT}/templates/architecture/ADR.md`, with at least one alternative and the consequences.
5. **Database and API detail.** Add `DATABASE_SCHEMA.md` or `API_SPECIFICATION.md` only if the content outgrows the architecture document. For schema work, have `ecc:database-reviewer` check integrity, migration safety and data-layer authorization.
6. **Critique (optional).** Offer gstack `/plan-eng-review` on the result; for UI-heavy products, `/plan-design-review`.
7. **Conflicts.** If a project decision contradicts a factory default, name it in the ADR and follow the project decision.

## Output

Architecture document, ADRs, updated `stack`, and a report: decisions made, risks, what needs approval.

## Gate

ADRs stay `proposed` until the user accepts them. Do not plan a sprint on proposed architecture.
