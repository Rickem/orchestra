---
id: T-003
title: Validate maxLength and handle non-decomposing letters
status: verified
tier: light
owner: implementer
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

- [x] AC1 A `maxLength` that is not a non-negative integer throws `RangeError`.
- [x] AC2 `slugify("x", null)` behaves like `slugify("x")`.
- [x] AC3 `"Straße"` → `"strasse"`, `"Æther"` → `"aether"`, `"Łódź"` → `"lodz"`.
- [x] AC4 Tests cover `maxLength` 0 and a cut that lands on a hyphen at the default length.

## Testing and verification

One unit test per criterion, run with `npm test`.

## Security and privacy

No change to the input surface.

## Definition of done

Per the orchestra quality gates.

## Plan

1. Tests first in `test/slug.test.js`, one per criterion: AC1 invalid `maxLength` (-1, 1.5, NaN, "5", Infinity) throws `RangeError`; AC2 `null` options; AC3 ß/Æ/Ł words; AC4 `maxLength` 0 and a default-length cut landing on a hyphen. Run, see them fail.
2. `src/slug.js`: validate `maxLength`, default `null` options, add small transliteration map (ß→ss, æ→ae, ø→o, ł→l) applied after lowercasing.
3. Run `npm test`; log result.
Risks: validation must not change behaviour for existing valid calls. `Infinity` is rejected (not an integer).

## Verification log

- test: `npm test` before change 3 failed (AC1-3), after change pass (9 tests).
- lint, typecheck, build: not run (no command).
2026-11-21 | test | ran: npm test (testing skill) | pass | 9/9; each AC has a test; lint/typecheck/build: no command
2026-11-21 | verifier | npm test rerun | pass | 9/9
2026-11-21 | verifier | AC1 probe: -1, 1.5, NaN, "5", Infinity, null maxLength | pass | all RangeError
2026-11-21 | verifier | AC2 probe: null options, {}, maxLength undefined | pass | same as no options
2026-11-21 | verifier | AC3 probe: Straße, Æther, Łódź, Ørsted | pass | strasse, aether, lodz, orsted
2026-11-21 | verifier | AC4 probe: maxLength 0 -> "", 59 a + " b" -> 59 a | pass | no trailing hyphen
2026-11-21 | verifier | codeReview gate (required) | not run | pending
