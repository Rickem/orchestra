# Parallel work and Git safety

Run tasks in parallel only when they are independent: no shared files, no dependency between them, shared interfaces agreed first.

## Rules

- Each task lists the files or modules it owns. Two running tasks never own the same file.
- Define shared interfaces (types, API contracts, schemas) in their own task and finish it first.
- One branch or worktree per concurrent task. Use `superpowers:using-git-worktrees` when available.
- Integrate through a reviewed diff. Rerun the test gate on the integrated branch, not only on each branch.
- Resolve conflicts deliberately. Never discard another agent's work to make a merge easier.
- Keep commits focused: one task, one purpose.
- Do not push, merge or delete branches without the user's approval.

## Choosing a mechanism

| Mechanism | Use when | Notes |
|---|---|---|
| Subagents (default) | Bounded tasks that report back | Use `isolation: worktree` for writers |
| Separate sessions | Long tasks the user wants to watch or steer | Each appears in the app sidebar |
| Agent Teams | Agents must talk to each other, and the installed Claude Code supports it | Optional; orchestra never depends on it |

## Cost and limits

- Each parallel agent spends its own tokens; three agents cost roughly three times one.
- Parallelism does not help tasks that share files; it creates merge work.
- Cap concurrent writers at the number of truly independent tasks, usually two to four.
