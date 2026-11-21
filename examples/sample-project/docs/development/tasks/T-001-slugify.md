---
id: T-001
title: Implement slugify
status: verified
tier: standard
owner: implementer
requirement: FR-001
depends_on: []
files: [src/slug.js, test/slug.test.js]
---

## Objective

Provide `slugify(title, options)` that turns a title into a URL-safe slug.

## Context

First feature of the sample library. Interface is defined in `docs/architecture/SYSTEM_ARCHITECTURE.md`.

## Scope

`src/slug.js` and its unit tests.

## Out of scope

Command-line wrapper (T-002). Transliteration of non-Latin scripts.

## Acceptance criteria

- [x] AC1 Lowercases and replaces each run of non-alphanumeric characters with one hyphen: `"Hello, World!"` → `"hello-world"`.
- [x] AC2 No leading or trailing hyphen.
- [x] AC3 Removes diacritics: `"Crème Brûlée"` → `"creme-brulee"`.
- [x] AC4 Truncates to `maxLength` (default 60) and never ends with a hyphen.
- [x] AC5 Throws `TypeError` for non-string input; returns `""` when no alphanumeric character remains.

## Testing and verification

One unit test per criterion, run with `npm test`.

## Security and privacy

Input is validated by type. Output is limited to `a-z0-9-`. No data is stored or logged.

## Definition of done

Per the orchestra quality gates: required gates pass, no open Critical or High finding, criteria independently verified, docs updated.

## Plan

1. Write a failing test per criterion in `test/slug.test.js`.
2. Implement `slugify` in `src/slug.js`: type check, NFD normalise and strip combining marks, lowercase, replace non-alphanumeric runs, trim hyphens, truncate, trim again.
3. Run `npm test`.

## Verification log
2026-11-21 | test | ran: npm test (before implementation) | fail | run failed on the test command itself (directory argument), not a valid red step
2026-11-21 | test | ran: npm test | pass | 5 tests, 0 failed, after fixing the test script to `node --test`
2026-11-21 | lint, typecheck, build | not run | — | no command configured for this project
2026-11-21 | acceptance | ran: npm test | pass | rerun independently: 5 tests, 5 pass, 0 fail, exit 0
2026-11-21 | acceptance | ran: node --input-type=module -e probe AC1 ("Hello, World!", mixed space/tab/newline/_/&/- runs, upper+digits, non-Latin run) | pass | hello-world; a-b-c-d; abc-123-def; non-Latin run collapses to separator
2026-11-21 | acceptance | ran: node --input-type=module -e probe AC2 ("  --Hello--  ", "!!!a!!!", combining mark at both ends) | pass | hello; a; x - no leading or trailing hyphen
2026-11-21 | acceptance | ran: node --input-type=module -e probe AC3 ("Crème Brûlée", precomposed and combining forms "Ångström naïve ÑANDÚ") | pass | creme-brulee; angstrom-naive-nandu
2026-11-21 | acceptance | ran: node --input-type=module -e probe AC4 (default on 100 chars, cut landing on hyphen at maxLength 4 and at 60, exact fit, maxLength 0) | pass | length 60; abc; 59/60 chars with no trailing hyphen; maxLength 0 gives ""
2026-11-21 | acceptance | ran: node --input-type=module -e probe AC5 (42, null, undefined, {}, ["a"], new String, Symbol, true, no argument; "!!!", "", whitespace, non-Latin only, combining marks only) | pass | all 9 throw TypeError (instanceof checked); all 5 return ""
2026-11-21 | acceptance | ran: node --input-type=module -e fuzz, 2000 random strings (code points 0-0x2FF) with maxLength 0-69 | pass | 0 violations of ^[a-z0-9]+(-[a-z0-9]+)*$ or length <= maxLength (AC1, AC2, AC4)
2026-11-21 | acceptance | ran: node --input-type=module -e probe invalid maxLength (-1, NaN, "4", 2.5, Infinity) and options null | pass | outside criteria, noted only: maxLength is not validated; -1 returns "abc-de" for "abc-def"; options null throws an incidental TypeError
