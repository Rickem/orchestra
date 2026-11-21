---
id: T-003
title: Validate maxLength and handle non-decomposing letters
status: not-started
tier: light
owner: unassigned
requirement: FR-001
depends_on: [T-001]
files: [src/slug.js, test/slug.test.js]
---

## Objective

Close the four findings from the T-001 code review.

## Context

See the 2026-11-21 entry in `docs/quality/REVIEW_LOG.md`.

## Scope

`maxLength` validation, safe handling of a `null` options argument, a decision on letters such as ß, æ, ø and ł, and the missing tests.

## Out of scope

Transliteration of non-Latin scripts.

## Acceptance criteria

- [ ] AC1 A `maxLength` that is not a non-negative integer throws `RangeError`.
- [ ] AC2 `slugify("x", null)` behaves like `slugify("x")`.
- [ ] AC3 `"Straße"` → `"strasse"`, `"Æther"` → `"aether"`, `"Łódź"` → `"lodz"`.
- [ ] AC4 Tests cover `maxLength` 0 and a cut that lands on a hyphen at the default length.

## Testing and verification

One unit test per criterion, run with `npm test`.

## Security and privacy

No change to the input surface.

## Definition of done

Per the orchestra quality gates.

## Plan

## Verification log

