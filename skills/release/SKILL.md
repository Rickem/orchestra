---
name: release
description: Use to prepare a release - verify scope and acceptance, run required tests and build checks, review migrations, configuration, secrets and rollback, and write release notes. Requires explicit user approval before any push or production deployment.
disable-model-invocation: true
---

# Release

Read `${CLAUDE_PLUGIN_ROOT}/standards/principles.md`, `${CLAUDE_PLUGIN_ROOT}/standards/quality-gates.md` and `${CLAUDE_PLUGIN_ROOT}/standards/concise-output.md` first.

## Inputs

- The list of tasks in the release.
- `docs/operations/DEPLOYMENT.md` and `.orchestra/project.json`.

## Steps

1. **Scope.** Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/board.mjs" --project . --check`. Every task in the release must be `accepted` (or `verified` with the user's explicit acceptance now). List anything that is not, and stop.
2. **Gates on the integrated branch.** Run every required gate on the branch being released, not on feature branches. Record results.
3. **Findings.** Confirm `docs/quality/REVIEW_LOG.md` has no open Critical or High finding.
4. **Migrations.** List each migration and whether it is reversible. A destructive one needs the user's separate approval and a tested backup.
5. **Configuration and secrets.** List new or changed environment variables by name. Confirm no secret value is in the diff (`git diff <last-release>...HEAD`).
6. **Rollback.** Write the rollback steps into `DEPLOYMENT.md`, including what cannot be rolled back.
7. **Release notes.** Write `docs/operations/releases/<version>.md`: changes by requirement, migrations, config changes, known issues, rollback.
8. **Ask.** Present the checklist result and ask the user to approve the release.

## After approval only

- To push and open a pull request, the user may run gstack `/ship`, or you do it by hand with git and `gh` when asked. `/ship` has no approval stop of its own; it expects a feature branch, a remote and `gh`, and it updates version and changelog files.
- Production deployment is a separate, explicit approval. Use the procedure in `DEPLOYMENT.md`, or gstack `/land-and-deploy` if the user asks for it.

## Output

Checklist table (item, ran or not, result), the release notes path, and the approval request.

## Gate

Never push, merge, tag or deploy on your own initiative. A previous approval does not carry over to the next release.
