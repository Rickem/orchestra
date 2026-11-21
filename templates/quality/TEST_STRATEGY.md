# Test strategy — {{PROJECT_NAME}}

## Commands

The source of truth is `gates` in `.orchestra/project.json`.

## Levels

| Level | Covers | Tool | When run |
|---|---|---|---|
| Unit | | | Every change |
| Integration | | | Before review |
| End-to-end | | | Before release |

## What must always be tested

Critical journeys, authorization rules and data-integrity rules, one line each.

## Test data

Synthetic only. No production or personal data in fixtures.

## Known gaps
