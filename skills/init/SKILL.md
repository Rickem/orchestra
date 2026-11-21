---
name: init
description: Use to set up orchestra in a project repository - detect the stack and conventions, ask for the brief and constraints, create the project configuration and documentation structure from templates without overwriting anything, and run a validation check. Safe to run more than once.
disable-model-invocation: true
---

# Initialise a project

Read `${CLAUDE_PLUGIN_ROOT}/standards/principles.md` and `${CLAUDE_PLUGIN_ROOT}/standards/concise-output.md` first.

The script never overwrites an existing file and never reads `.env` values. It reads variable names from `.env.example` only.

## Steps

1. **Preview.** Run:

   `node "${CLAUDE_PLUGIN_ROOT}/scripts/init-project.mjs" --target . --dry-run`

   Show the user what was detected (stack, package manager, test and lint commands) and the list of files it would create or skip. Add `--claude-md` to the dry run to preview the `CLAUDE.md` change as well.
2. **Ask.** One question at a time, skipping anything the user's brief already answers:
   - Is the detected stack right? For a new project: language, framework, database, auth, hosting, and UI framework, component library and styling. Nothing is imposed; unknown stays `null`.
   - Which document groups to install: `product`, `architecture`, `development`, `quality`, `operations` (default all; a small project may take fewer).
   - Add the orchestra block to `CLAUDE.md`? (Appends between markers; existing content is untouched.)
   - Paths that need a warning before edits (`protectedPaths`), for example migrations or infrastructure.
   - Optional integrations: graphify for codebase maps, gstack browser QA.
3. **Apply.** Run again without `--dry-run`, with the choices:

   `node "${CLAUDE_PLUGIN_ROOT}/scripts/init-project.mjs" --target . --components product,architecture,development,quality,operations --claude-md`

4. **Confirm gates.** Open `.orchestra/project.json`. Show the detected gate commands and have the user confirm or correct each. Run each confirmed command once before relying on it: a wrong command can look like a failing test, and a command that runs zero tests is not yet a working gate (note that in `TEST_STRATEGY.md`). Write the stack answers into `stack`.
5. **Validate.** Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/doctor.mjs" --project .` and report any issue.
6. **Next.** Fill `docs/product/DISCOVERY.md` with `/orchestra:project-discovery`.

## If a file already exists

The script skips it and says so. To replace one, show the user the difference and get approval, then pass `--force <relative-path>` for that file only.

## Output

Report: detected stack, files created, files skipped, gate commands confirmed, doctor result.
