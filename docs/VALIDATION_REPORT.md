# Validation report

Date: 2026-11-21. Machine: Windows 10, Node.js 22.17.1, Claude Code 2.1.283. Every "ran" row was executed in the build session and its result observed.

## Ran

| Check | Command | Result |
|---|---|---|
| Unit and integration tests | `node --test tests/factory.test.mjs` | 17 passed, 0 failed (rerun on 0.1.3) |
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

## Live session tests (plugin installed at user scope)

Installed with `claude plugin marketplace add` and `claude plugin install orchestra@orchestra-local`. `claude plugin details orchestra` reported 13 skills, 3 agents, 1 hook and about 1,100 always-on tokens. Tests ran in separate desktop-app sessions.

| Check | Result | Evidence |
|---|---|---|
| Skills and agents discovered | Pass | All 3 agents listed; 9 of the 11 model-invocable skills were listed by the test session, and all 11 appear in the parent session's listing. `init` and `release` are user-invoked only and correctly absent. |
| `${CLAUDE_PLUGIN_ROOT}` substitution in skill text | Pass | `orchestra:doctor` delivered `node "C:/app/projects/orchestra/scripts/doctor.mjs"` |
| `/orchestra:doctor` end to end | Pass | 10 ok, 0 info, 0 warn, 0 fail |
| `/orchestra:board` end to end | Pass | 3 tasks; T-001 verified; T-002, T-003 not-started |
| `orchestra:product-manager` agent | Pass | Dispatched; its answer matched the definition's mission and must-not list |
| Guard hook fires on Write | Pass | Trace line showed the hook ran with the right path and matched |
| Guard hook in auto mode, version 0.1.0 | **Fail** | It returned "ask"; Claude Code resolved it with no prompt and the secrets-file write succeeded |
| Guard hook in accept-edits mode, version 0.1.1 | **Fail** | Same: the write succeeded and the user confirmed no prompt appeared |
| Guard hook in auto mode, version 0.1.2 | Pass | The write was blocked with the "orchestra guard:" reason |
| Guard hook in accept-edits mode, version 0.1.2 | Pass | A fresh session using the installed copy: the secrets-file write was blocked with the "orchestra guard:" reason |
| Guard hook leaves ordinary files alone | Pass | In the same session a control file was written with no block, then removed |

## Live workflow tests (version 0.1.2, fixes released as 0.1.3)

Two further desktop-app sessions ran every remaining workflow. Their results were checked against the files afterwards.

| Skill or agent | Result | Evidence |
|---|---|---|
| `init` | Refused by the Skill tool, as designed (user-invoked only); steps followed by hand | Dry run, apply and doctor ran on a throwaway project: 10 ok, 0 fail |
| `project-discovery` | Pass | Produced `DISCOVERY.md` |
| `requirements` with `orchestra:product-manager` | Pass | 8 functional and 6 non-functional requirements, 5 business rules, security table answered; no decisions invented |
| `architecture` with `ecc:architect` | Pass | Architecture document and 5 ADRs; the agent is read-only, so the session wrote the files |
| `sprint-planning` | Pass | 4 task files and a sprint file; board check clean; doctor clean |
| `feature-implementation` with `orchestra:implementer` | Pass | Stayed inside the two owned files; 3 new tests failed first, then passed; left status at `implemented-unverified` |
| `testing` with `orchestra:acceptance-verifier` | Pass, with an ordering defect | Source and test file hashes unchanged by the verifier; it set `verified` before the reviews had run |
| `code-review` with `ecc:code-reviewer` | Pass | 2 Low, 1 Informational; logged |
| `security-review` with `ecc:security-reviewer` | Pass | 1 Low, 1 Informational; scope and limits stated |
| `project-handover` | Pass | `HANDOVER.md` produced for the sample |
| `release` | Refused by the Skill tool, as designed | No release was performed |
| Sample project after the run | Pass | `npm test`: 9 passed; board: T-001 and T-003 `verified`, T-002 `not-started` |

## Defects found by the live tests and fixed

| Defect | Fix |
|---|---|
| A hook's "ask" never reaches the user in auto or accept-edits mode, so the guard protected nothing there | 0.1.2 blocks secrets files and credential-like content in every mode; protected paths ask only in default and plan modes and are blocked elsewhere |
| The guard located the project only from the session directory | It now uses the target file's path first |
| The installed plugin is a cached snapshot; edits under an unchanged version number did not reach new sessions | Version bumped for each installed change (0.1.1, 0.1.2); recorded as lesson L-002 |
| `verified` could be set before a required review had run (`testing` dispatched the verifier ahead of `code-review`) | 0.1.3: order is gates, review, acceptance; the verifier reports `awaiting review` instead |
| A test command running zero tests counted as a passing gate | 0.1.3: zero tests is a fail for the `test` gate |
| `architecture` implied the read-only ECC architect would write files | 0.1.3: the skill says the session writes them |
| `init` wrote factory version 0.1.0 into `project.json` regardless of the installed version | 0.1.3: reads it from the plugin manifest; covered by a test |
| Implementer log lines were free text and it ticked acceptance checkboxes | 0.1.3: format stated; ticking left to the verifier |
| About a dozen smaller ambiguities in skill text (approval wording, question numbering, diff scope, not-applicable areas, missing folders, empty git log) | 0.1.3: each clarified in the skill concerned |

## Not run or not verified

| Item | Why | Risk |
|---|---|---|
| Guard "ask" prompt for protected paths in default mode | Not run live; unit-tested only | Low: default mode prompts for every write anyway |
| Guard on a protected path, live | The sample project defines none; unit-tested in all seven modes | Low |
| `init` and `release` typed as slash commands by a person | The model cannot invoke them; no person has run them yet | Their scripts and steps were exercised by hand; the slash-command entry point was not |
| The 0.1.3 text fixes themselves | Applied after the live runs; not rerun live | Wording changes only, plus one tested script change |
| A release on a real project | No project is at that stage | The `release` checklist is unexercised |
| gstack, superpowers and graphify routes | Not exercised | Wired by name; existence checked by the doctor |
| gstack upgrade to v1.102.1.0 | Blocked by a permission check in the build session | Manifest pins the installed 1.91.295.0 |
| Headless `claude -p` runs | The CLI sign-in on the build machine had expired | None for the plugin; CI-style runs are untested |
| macOS and Linux | No machine | Assumed portable |
