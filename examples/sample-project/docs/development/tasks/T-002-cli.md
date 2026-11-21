---
id: T-002
title: Command-line wrapper
status: not-started
tier: light
owner: unassigned
requirement: FR-002
depends_on: [T-001]
files: [bin/slug.js, test/cli.test.js]
---

## Objective

Print the slug for a title given on the command line.

## Context

Thin wrapper over `slugify` from T-001.

## Scope

`bin/slug.js` and its test.

## Out of scope

Reading from standard input; publishing to npm.

## Acceptance criteria

- [ ] AC1 `node bin/slug.js "Hello World"` prints `hello-world` and exits 0.
- [ ] AC2 With no argument it prints a usage message to stderr and exits 1.

## Testing and verification

Spawn the script in a test and assert on output and exit code.

## Security and privacy

No new input surface beyond the argument string.

## Definition of done

Per the orchestra quality gates.

## Plan

## Verification log

