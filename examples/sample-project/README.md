# orchestra-sample

A tiny library used to exercise the orchestra workflow once, end to end. It is evidence, not a product.

## What was done here

| Stage | What happened | Where |
|---|---|---|
| Init | `init-project.mjs` run three times: dry run, apply, rerun (all skipped) | `.orchestra/`, `docs/`, `CLAUDE.md` |
| Requirements | FR-001 and FR-002 with acceptance criteria | `docs/product/REQUIREMENTS.md` |
| Architecture | One module, one ADR | `docs/architecture/` |
| Planning | Three task files | `docs/development/tasks/` |
| Implementation | `slugify`, with one test per criterion | `src/slug.js`, `test/slug.test.js` |
| Verification | `npm test`: 5 passed | T-001 verification log |
| Code review | ECC `code-reviewer`: 2 Medium, 2 Low, no blocker; logged as T-003 (since done) | `docs/quality/REVIEW_LOG.md` |
| Acceptance | Independent verifier confirmed AC1 to AC5 and set `verified` | T-001 verification log |
| Second task, live | T-003 taken through `/orchestra:feature-implementation`, `testing`, `code-review`, `security-review` and `project-handover` in a live session with the `implementer` and `acceptance-verifier` agents: 9 tests pass, reviews found only Low and Informational items | T-003 task file, `REVIEW_LOG.md`, `docs/operations/HANDOVER.md` |

T-001 and T-003 are `verified`, not `accepted`: only a person sets `accepted`. T-003 was marked `verified` before its reviews ran; that ordering defect was fixed in factory 0.1.3.

## Not filled in

`TEST_STRATEGY.md`, `RISK_REGISTER.md` and `DEPLOYMENT.md` are left as untouched templates; a one-function library does not need them.

## Try it

```
npm test
node ../../scripts/board.mjs --project . --check
node ../../scripts/board.mjs --project . --serve 4173
```
