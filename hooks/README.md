# Orchestra hooks

Orchestra ships one hook. Hooks do deterministic checks only; anything needing judgement belongs in a skill.

## guard (PreToolUse on Write, Edit, MultiEdit, NotebookEdit)

| | |
|---|---|
| Runs | Before Claude writes or edits a file |
| Active | Only when a `.orchestra/project.json` exists in the working directory or a parent |
| Checks | 1. Target looks like a secrets file (`.env`, `*.pem`, `id_rsa`, `credentials.json`, ...). 2. New content matches an obvious credential pattern. 3. Target matches a glob in `protectedPaths`. |
| Effect | Asks you to confirm. It never blocks outright and never changes anything. |
| Output | Names the kind of match; never prints the matched secret |
| Failure | If the script errors it prints the reason to stderr and exits 1. Claude Code shows the error and the edit proceeds unchecked. |
| Cost | One Node process per edit, no network, no test runs |

`.env.example`, `.env.sample` and `.env.template` are not treated as secrets files.

## What it does not do

It is not a secret scanner: it catches common, well-formed credentials only. It does not format, lint, test, commit, push, deploy or delete anything. ECC and gstack register their own hooks; orchestra adds none for formatting or linting to avoid duplicating them.

## Adapting or disabling

| Need | How |
|---|---|
| Warn on more paths | Add globs to `protectedPaths` in `.orchestra/project.json`, e.g. `"migrations/**"`, `"infra/"` |
| Turn the guard off for one project | Set `"hooks": { "guard": false }` in `.orchestra/project.json` and record why in an ADR |
| Turn it off for one session | Start Claude Code with `ORCHESTRA_HOOKS=off` in the environment |
| Remove it everywhere | Disable the orchestra plugin |

Disabling the guard removes a safety prompt. Prefer narrowing `protectedPaths` over switching it off.
