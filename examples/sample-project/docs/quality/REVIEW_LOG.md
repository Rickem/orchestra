# Review log — orchestra-sample

One block per review. One line per finding.

<!--
## YYYY-MM-DD — T-000 — code | security — reviewer
Scope: what was reviewed (diff range, files). Limits: what was not.
- [High][confirmed] path:line — problem. Fix: action. Status: open | fixed | waived (by whom, why)
Result: pass | blocked
-->

## 2026-11-21 — T-001 — code — ECC `code-reviewer` agent
Scope: `src/slug.js`, `test/slug.test.js` in full (no commits yet, so no diff range). Reviewer ran `npm test`. Limits: no security review (tier and content did not require one).
- [Medium][confirmed] src/slug.js:12 — `maxLength` is not validated; negative, NaN or string values give wrong lengths. Fix: require a non-negative integer and test it. Status: open, logged as T-003
- [Medium][confirmed] src/slug.js:7 — letters with no NFD decomposition (ß, æ, ø, ł) are dropped. Fix: add a small transliteration map or document the limit. Status: open, logged as T-003
- [Low][confirmed] src/slug.js:3 — `options: null` throws an incidental TypeError. Fix: default safely. Status: open, logged as T-003
- [Low][confirmed] test/slug.test.js:18 — AC4 tests miss `maxLength` 0, invalid values and a cut on a hyphen at the default. Fix: add cases. Status: open, logged as T-003
Result: pass (0 Critical, 0 High)

## 2026-11-21 — T-003 — code — ECC `code-reviewer` agent
Scope: `git diff -- examples/sample-project` (src/slug.js, test/slug.test.js, task file). Reviewer ran `npm test`. Limits: no security review yet.
- [Low][confirmed] src/slug.js:3 — map covers only ß, æ, ø, ł; đ, þ, œ, ð are still dropped ("Đorđe" → "orde"). Not an AC. Fix: extend map or document the limit. Status: open
- [Low][confirmed] test/slug.test.js:35 — AC1 test omits `null` as `maxLength` (reported as line 86, a diff-file line; actual line is the NaN list). Fix: add `null`. Status: open
- [Informational][confirmed] docs/development/tasks/T-003-slugify-hardening.md — log line "before change 3 failed" is garbled; and status was `verified` while `codeReview` gate was pending. Fix: reword; see report. Status: open
Result: pass (0 Critical, 0 High)

## 2026-11-21 — T-003 — security — ECC `security-reviewer` agent
Scope: `git diff -- examples/sample-project`, full src/slug.js, package.json, SLUG_MAX_LENGTH usage. Limits: read-only; no tests, npm audit or execution; not a complete security audit.
- [Low][confirmed] src/slug.js:6 — `options` destructured before the title check; a non-object truthy `options` is silently ignored. Fix: optionally throw TypeError. Status: open
- [Informational][confirmed] .orchestra/project.json, .env.example — SLUG_MAX_LENGTH declared but never read. Fix: remove or implement. Status: open
Result: pass (0 Critical, 0 High)
