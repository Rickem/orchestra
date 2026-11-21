# ADR-0002: Three custom agents; reuse ECC, gstack and superpowers for the rest

Date: 2026-11-21
Status: accepted
Approved by: project owner

## Context

The brief listed nine agents and ten skills. ECC, gstack and superpowers, already installed, cover most of them. The brief also requires reuse before rebuilding and one reviewer per review.

## Decision

- Build three agents: `implementer`, `acceptance-verifier`, `product-manager`.
- Route architecture, code, security and database review to ECC agents; product critique, browser QA and shipping to gstack; test-first, debugging, verification and worktrees to superpowers.
- Each orchestra skill calls its owner by name and adds gates, evidence and approvals. Fallbacks are listed in `standards/upstream-routing.md`.
- Treat graphify as optional and off by default.

## Alternatives considered

| Option | Why not |
|---|---|
| Nine custom agents | Duplicates ECC; more to maintain; no quality gain |
| Depend on upstreams with no fallback | A missing or renamed upstream would break workflows |
| Copy upstream files into the factory | Blocks independent updates; licence and attribution burden |

## Consequences

Orchestra stays small. Upstream renames can break a route; the doctor reports missing components and the manifest pins tested versions. Three upstreams must be tracked.
