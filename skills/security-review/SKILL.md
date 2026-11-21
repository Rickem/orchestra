---
name: security-review
description: Use for changes touching authentication, authorization, secrets, user input, personal data, file handling, dependencies or infrastructure, to map the attack surface of the change, review the relevant controls and tests, and report findings with explicit scope and limitations.
---

# Security review

Read `${CLAUDE_PLUGIN_ROOT}/standards/severity.md`, `${CLAUDE_PLUGIN_ROOT}/standards/security-privacy.md` and `${CLAUDE_PLUGIN_ROOT}/standards/concise-output.md` first.

## Inputs

- The diff and the task file.
- The security and privacy table in `docs/product/REQUIREMENTS.md`.

## Steps

1. **Attack surface.** List what the change exposes: new endpoints, inputs, file paths, queries, permissions, dependencies, config.
2. **Dispatch one reviewer.** Send the diff and the attack-surface list to the `ecc:security-reviewer` agent. Fallback when ECC is missing: the built-in `/security-review`.
3. **Check each area that applies:** authorization on every new path (server-side and at the data layer), input validation and output encoding, secrets and config, sensitive data in logs and errors, tenant isolation, file upload and download rules, new or updated dependencies.
4. **Controls and tests.** Confirm there is a test for each authorization rule and each validation rule the change adds.
5. **Classify.** Severity plus confirmed or potential. A confirmed finding has a concrete path from input to impact.
6. **Log.** Append a block to `docs/quality/REVIEW_LOG.md` with scope and limits.
7. **Critical finding.** Stop and tell the user immediately. Do not wait for the report.

## Rules

- State what was reviewed and what was not. Never call this a complete security audit or a compliance check.
- Do not paste secrets, tokens or personal data into the report; cite the file and line.
- Flag where a qualified security, privacy or legal review is needed.

## Output

Scope and limits in two lines, then findings one line each, then `Result: pass | blocked`.

## Gate

Open Critical or High findings block the task. Only the user can waive one, in writing in the review log.
