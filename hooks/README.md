# Orchestra hooks

Orchestra ships one hook. Hooks do deterministic checks only; anything needing judgement belongs in a skill.

## guard (PreToolUse on Write, Edit, MultiEdit, NotebookEdit)

| | |
|---|---|
| Runs | Before Claude writes or edits a file |
| Active | Only when the target file (or, failing that, the working directory) is inside a folder that has `.orchestra/project.json` |
| Checks | 1. Target looks like a secrets file (`.env`, `*.pem`, `id_rsa`, `credentials.json`, ...). 2. New content matches an obvious credential pattern. 3. Target matches a glob in `protectedPaths`. |
| Secrets file or credential-like content | Blocked in every permission mode. Claude is told to report it to you; you make the change yourself. |
| Protected path, `default` or `plan` mode | Asks you to confirm |
| Protected path, any other mode (`acceptEdits`, `auto`, `bypassPermissions`, `dontAsk`) | Blocked, with a note that you can approve it by switching the session to the default mode |
| Why it blocks instead of asking | Live tests on Claude Code 2.1.283 showed a hook's "ask" is resolved with no prompt in auto and accept-edits modes, so asking there protects nothing |
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
| Ask instead of block for protected paths in every mode | Set `"hooks": { "unattended": "ask" }`. No prompt reaches you in auto or accept-edits mode, so this in effect switches protected-path checks off there. It never applies to secrets. |
| Debug what the hook decided | Set `ORCHESTRA_GUARD_TRACE` to a file path; one JSON line per call is appended (no file contents) |
| Turn the guard off for one project | Set `"hooks": { "guard": false }` in `.orchestra/project.json` and record why in an ADR |
| Turn it off for one session | Start Claude Code with `ORCHESTRA_HOOKS=off` in the environment |
| Remove it everywhere | Disable the orchestra plugin |

To let Claude write a file the guard blocks, write it yourself, or turn the guard off for that project. Disabling the guard removes a safety check. Prefer narrowing `protectedPaths` over switching it off.
