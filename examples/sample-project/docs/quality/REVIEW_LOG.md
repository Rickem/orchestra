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
