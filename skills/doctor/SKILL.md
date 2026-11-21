---
name: doctor
description: Use to diagnose the orchestra setup - reports environment prerequisites, the detected Claude Code version, which upstream components (ECC, gstack, superpowers, graphify) are installed and whether their versions match the integration manifest, and any project configuration issue, each with a fix.
---

# Doctor

## Steps

1. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/doctor.mjs"` (add `--project .` inside an orchestra project, `--json` for machine output).
2. Report each line that is not `ok`, with the fix the script suggests.
3. For a missing upstream, name the orchestra workflows that fall back and what they fall back to (see `${CLAUDE_PLUGIN_ROOT}/standards/upstream-routing.md`).
4. Do not install or upgrade anything yourself. Give the command and let the user decide; upgrades follow `docs/integrations/UPDATE_GUIDE.md` in the factory repository.

## What it does not check

It checks that components exist and reads their version files. It does not run upstream skills or prove that they behave correctly.
