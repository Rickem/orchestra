# Known limits and planned improvements

## Known limits in 0.1.0

- Skills were validated statically and exercised by hand on the sample project; they have no automated behavioural tests.
- Only the ECC `code-reviewer` route was run for real. The gstack, superpowers and graphify routes are wired but unexercised.
- Scripts were run on Windows 10 only.
- The guard hook catches common credential shapes, not all secrets.
- The board shows task state, not live agent activity.
- Stack detection covers Node.js, Python, Go, Rust and JVM manifests; anything else is recorded as not detected.

## Planned, in priority order

| # | Improvement | Why |
|---|---|---|
| 1 | Behavioural evals for the skills using `claude plugin eval` | Catch regressions in instructions, not only in file structure |
| 2 | Run each upstream route once on the sample project and record it | Turn "wired" into "verified" |
| 3 | Test on macOS and Linux in CI | Portability is assumed, not proven |
| 4 | Task-to-requirement traceability check in the board (`requirement` IDs must exist) | Closes the trace from requirement to evidence |
| 5 | Issue-tracker sync (GitHub Issues first) for projects that already use one | Avoid two sources of truth |
| 6 | A personal default stack profile that `init` proposes for new projects | Faster starts without imposing a stack |
| 7 | Board: filter by owner and sprint; show open findings per task | Useful once projects pass about 30 tasks |
| 8 | Optional CI workflow template that runs the project's gates | Gates enforced outside the session too |
