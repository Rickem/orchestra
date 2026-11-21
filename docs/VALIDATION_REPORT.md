# Validation report

Date: 2026-11-21. Machine: Windows 10, Node.js 22.17.1, Claude Code 2.1.283. Every "ran" row was executed in the build session and its result observed.

## Ran

| Check | Command | Result |
|---|---|---|
| Unit and integration tests | `node --test tests/factory.test.mjs` | 16 passed, 0 failed |
| Static factory validation | `node scripts/validate-factory.mjs` | 11 of 11 checks passed |
| Marketplace manifest | `claude plugin validate .` | Passed |
| Plugin manifest | `claude plugin validate .claude-plugin/plugin.json` | Passed |
| Skill definitions | `claude plugin validate skills` | Passed |
| Agent definitions | `claude plugin validate agents` | Passed |
| Doctor | `node scripts/doctor.mjs --project examples/sample-project` | 10 ok, 0 warn, 0 fail |
| Init dry run | `init-project.mjs --target examples/sample-project --dry-run --claude-md` | Listed 13 actions; wrote nothing |
| Init apply | Same without `--dry-run` | 12 files created, `CLAUDE.md` block appended |
| Init rerun | Same again | All 13 skipped; nothing changed |
| Sample tests | `npm test` in `examples/sample-project` | 5 passed, 0 failed |
| Board summary | `board.mjs --project examples/sample-project --check` | 3 tasks, no problems |
| Board file | `board.mjs --project examples/sample-project` | `board.html` written |
| Board server | `board.mjs ... --serve 4173`, then HTTP GET and a browser view | HTTP 200, 3 cards rendered |
| Independent code review | ECC `code-reviewer` agent on the sample change | 2 Medium, 2 Low, 0 blocking; logged in the sample `REVIEW_LOG.md` and as T-003 |
| Independent acceptance | A general-purpose agent following `agents/acceptance-verifier.md` | AC1 to AC5 confirmed by its own probes and a 2000-case fuzz; set T-001 to `verified` |

What the automated tests cover: task parsing and consistency checks; board rendering, HTML escaping and read-only behaviour; stack detection; init dry run, file preservation, idempotency, component selection and `--force`; secret patterns; the guard hook's ask, silent, disabled and bad-input paths; doctor results for missing upstreams and for a fresh project.

## Defects found during validation and fixed

| Defect | Fix |
|---|---|
| `node --test <directory>` fails on Node 22 (in the factory's and the sample's test scripts) | Test scripts now name the file or use plain `node --test`; recorded as lesson L-001 |
| Running `graphify install` from an older CLI on PATH downgraded the graphify skill from 0.9.65 to 0.9.7 | Reinstalled from the upgraded package with `python -m graphify`; skill is now 0.9.114; noted in `COMPATIBILITY.md` |

## Not run or not verified

| Item | Why | Risk |
|---|---|---|
| Loading the plugin in a live Claude Code session | The headless run failed with an expired CLI sign-in | Skill discovery under `/orchestra:*`, `${CLAUDE_PLUGIN_ROOT}` substitution in skill text, and the hook firing are unconfirmed in practice |
| Orchestra skills invoked as slash commands | Same | The sample was produced by following the skill steps by hand |
| The `orchestra:acceptance-verifier` agent type itself | Plugin not loaded | Its instructions were exercised through a general-purpose agent instead |
| `implementer` and `product-manager` agents | Not exercised | Instructions only |
| gstack, superpowers and graphify routes | Not exercised | Wired by name; existence checked by the doctor |
| Security review, release and handover on the sample | Not applicable to a one-function library | Unexercised |
| gstack upgrade to v1.102.1.0 | Blocked by a permission check in the build session | Manifest pins the installed 1.91.295.0 |
| macOS and Linux | No machine | Assumed portable |

## First thing to do next

Sign in to the Claude CLI, then run `claude --plugin-dir C:\app\projects\orchestra` inside `examples/sample-project` and invoke `/orchestra:doctor` and `/orchestra:board`. That closes the first three rows above.
