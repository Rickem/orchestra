# Concise output

Applies to every report, review comment, task note, commit message and code comment produced under orchestra.

## Reports

- Result first. No preamble, no recap of the request, no closing summary.
- 15 lines at most, unless the reader asked for detail. Put long evidence in a file and link it.
- Use a table or list for anything enumerable; one line per item.
- State what was not done or not verified in one line. Do not bury it.

## Findings and review comments

One line each, in this shape:

`[Severity] path:line — problem. Fix: action.`

No praise, no restating the code, no "consider maybe".

## Code comments

- Write a comment only for a non-obvious *why* (constraint, trade-off, workaround with a link).
- Never narrate what the code does or record change history in comments.

## Commit messages

Subject of 72 characters or fewer in the imperative; a body only when the reason is not obvious from the diff.

## Questions to the user

Ask one decision at a time, with your recommended option first.
