# Update guide

Nothing updates automatically. Each upstream is updated on purpose, one at a time.

## Procedure

1. **Read the changes.** Open the upstream's release notes and changelog between the pinned version in `integrations/manifest.json` and the new one.
2. **Review what orchestra depends on.** For each component listed under that upstream in the manifest: was it renamed, removed, or given new hooks, permissions or dependencies?
3. **Look for conflicts.** New hooks on `PreToolUse`, new skills with the names orchestra uses, changed install paths.
4. **Update in a disposable place first.** Where the upstream allows it, install the new version at project scope in a scratch repository, not in your main setup.
5. **Test.** Run `node scripts/doctor.mjs`, `node scripts/validate-factory.mjs` and `npm test`. Then run one representative workflow on `examples/sample-project` (for example `/orchestra:code-review` on a small change).
6. **Approve.** Decide whether to update the primary installation.
7. **Record.** Update `version`, `commit`, `lastCompatibilityCheck` and `knownLimitations` in the manifest, add a line to `CHANGELOG.md`, and note any migration step in `COMPATIBILITY.md`.

## Commands per upstream

| Upstream | Check | Update |
|---|---|---|
| ECC | `claude plugin list` | `claude plugin update ecc@ecc` |
| superpowers | `claude plugin list` | `claude plugin update superpowers@claude-plugins-official` |
| gstack | `cat ~/.claude/skills/gstack/VERSION` | `cd ~/.claude/skills/gstack && git pull --ff-only && ./setup` (or the `/gstack-upgrade` skill) |
| graphify | `python -m pip show graphifyy` | `python -m pip install -U graphifyy`, then `python -m graphify install --platform claude` |

Verify the exact plugin commands with `claude plugin --help` on your version before running them.

## Pending on the build machine

- gstack: 1.91.295.0 installed, v1.102.1.0 available (2026-11-21). Not applied.
- graphify: the `uv tool` copy on PATH is 0.9.7 and failed to upgrade because its files were in use. Close anything using it (for example a running `graphify-mcp`) and run `uv tool upgrade graphifyy`.

## If an upstream becomes unavailable or unsuitable

Record the evidence in `UPSTREAM_ASSESSMENT.md`, switch the owner in `standards/upstream-routing.md` to the listed fallback, and update `COMPONENT_MATRIX.md`. Orchestra's workflows keep working on fallbacks.
