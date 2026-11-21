# ADR-0001: Use the built-in Node test runner

Date: 2026-11-21
Status: accepted
Approved by: sample owner

## Context

The library has no dependencies (NFR-001) and needs unit tests.

## Decision

Use `node:test` and `node:assert`, run with `npm test`.

## Alternatives considered

| Option | Why not |
|---|---|
| Vitest or Jest | Adds a dependency for no benefit at this size |

## Consequences

No install step is needed to run tests. Revisit if the project needs mocking or coverage reports.
