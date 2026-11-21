# Requirements — orchestra-sample

Status: approved (sample owner, 2026-11-21)

## Functional requirements

| ID | Requirement | Acceptance criteria | Priority | Tasks |
|---|---|---|---|---|
| FR-001 | Turn a title into a URL-safe slug | AC1 lowercases and replaces each run of non-alphanumeric characters with one hyphen (`"Hello, World!"` → `"hello-world"`). AC2 no leading or trailing hyphen. AC3 removes diacritics (`"Crème Brûlée"` → `"creme-brulee"`). AC4 truncates to `maxLength` (default 60) and never ends with a hyphen. AC5 throws `TypeError` for non-string input; returns `""` when no alphanumeric character remains. | Must | T-001 |
| FR-002 | Command-line wrapper that prints the slug for its argument | Prints the slug and exits 0; exits 1 with a message when no argument is given. | Should | T-002 |

## User journeys

1. A developer imports `slugify`, passes a post title, and uses the result in a URL.

## Business rules

| ID | Rule | Source |
|---|---|---|
| BR-001 | Slugs contain only `a-z`, `0-9` and `-` | Sample owner |

## Non-functional requirements

| ID | Area | Requirement | How verified |
|---|---|---|---|
| NFR-001 | Dependencies | No runtime dependencies | Inspect `package.json` |
| NFR-002 | Accessibility | Not applicable: no user interface | — |

## Security and privacy

| Area | Answer |
|---|---|
| Data classification | Not applicable: processes caller-supplied strings only, stores nothing |
| Authentication | Not applicable: library, no users |
| Authorization | Not applicable: library, no users |
| Tenant isolation | Not applicable: no stored data |
| Secrets | None used |
| Input and output | Input is validated by type; output is restricted to `a-z0-9-` (BR-001) |
| File handling | Not applicable: no file access |
| Logging and retention | Nothing is logged |
| Encryption | Not applicable: no transport or storage |
| Dependencies | No runtime dependencies (NFR-001) |
| Backup and recovery | Not applicable: no data |
| Regulation | None identified |

## Unresolved questions

| # | Question | Owner |
|---|---|---|
| 1 | Should non-Latin scripts be transliterated? Out of scope for FR-001. | Sample owner |
