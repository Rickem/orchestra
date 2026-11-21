# System architecture — orchestra-sample

Status: approved (sample owner, 2026-11-21)

## Context

A dependency-free JavaScript library with one function. Nothing external.

## Stack

| Layer | Choice | Reason | ADR |
|---|---|---|---|
| Language | JavaScript (ES modules) on Node.js | Already in use | — |
| Tests | Built-in `node:test` | No test dependency needed | [ADR-0001](decisions/ADR-0001-node-test-runner.md) |

## Modules and boundaries

| Module | Responsibility | Owns | Depends on |
|---|---|---|---|
| `src/slug.js` | `slugify(title, options)` | Slug rules | Nothing |

## Data

None stored.

## Interfaces

`slugify(title: string, options?: { maxLength?: number }): string`

## Cross-cutting

Errors: `TypeError` for non-string input. No logging, configuration or authentication.

## Risks and trade-offs

| Risk | Impact | Mitigation |
|---|---|---|
| Non-Latin titles produce an empty slug | Low | Documented as an open question in the requirements |
