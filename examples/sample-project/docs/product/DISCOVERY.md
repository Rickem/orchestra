# Discovery report — orchestra-sample

Date: 2026-11-21

## Detected

| Item | Detected |
|---|---|
| Language | JavaScript |
| Runtime | Node.js |
| Frameworks | not detected |
| Package manager | npm |
| Database | not detected |
| UI framework | not detected |
| UI components | not detected |
| Styling | not detected |
| Test command | npm test |
| Lint command | not detected |
| Type check | not detected |
| Build command | not detected |
| CI workflows | no |
| Existing | not detected |

## Problem and users

Developers need consistent URL-safe slugs from post titles. (Stated by the sample owner.)

## Goals and constraints

No runtime dependencies. No deadline. (Stated.)

## What exists and should be preserved

`package.json` with an npm test script using the built-in Node test runner.

## Unknowns and assumptions

| # | Unknown or assumption | Owner | Resolved? |
|---|---|---|---|

## Environment variables (names only)

- `SLUG_MAX_LENGTH`

## Proposed next steps

Done: requirements approved; see `REQUIREMENTS.md`.
