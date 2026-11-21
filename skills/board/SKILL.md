---
name: board
description: Use to see project status at a glance - generates a read-only task board (columns by status, with owner, dependencies and latest verification result per task) from the orchestra task files, optionally served locally with auto-refresh, or prints a text summary.
---

# Task board

The board is read-only. It reads task files and writes one HTML file; it never changes a task.

## Commands

| Goal | Command |
|---|---|
| Text summary and consistency check | `node "${CLAUDE_PLUGIN_ROOT}/scripts/board.mjs" --project . --check` |
| Write `.orchestra/board.html` | `node "${CLAUDE_PLUGIN_ROOT}/scripts/board.mjs" --project .` |
| Serve with auto-refresh | `node "${CLAUDE_PLUGIN_ROOT}/scripts/board.mjs" --project . --serve 4173` |

## Steps

1. Run `--check` and report the counts per status plus any problem it finds (unknown status, missing dependency, files owned by two active tasks).
2. If the user wants the visual board, run the serve command in the background and give them `http://127.0.0.1:4173`. It listens on localhost only and refreshes every five seconds.
3. To stop it, end the background process.

## Reading the board

- A card shows ID, title, owner, tier, dependencies and the last line of the verification log.
- `implemented-unverified` means code exists but no gate has confirmed it.
- Only the user moves a task to `accepted`.

The board shows task state. To watch an agent work live, open its session in the Claude app sidebar.
