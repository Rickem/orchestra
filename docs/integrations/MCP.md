# Optional tool integrations (MCP)

None is installed or configured by orchestra. Add one per project only when the project already uses the service. Record the choice in an ADR.

| Integration | Enables | Authentication | Can access | Main risk |
|---|---|---|---|---|
| GitHub | Issues, pull requests, CI status | OAuth or a fine-grained token in an environment variable | Repositories the token allows | Over-broad token scope; restrict to the project's repositories |
| Figma | Reading designs as reference | OAuth | Files the account can open | Unreleased designs in transcripts |
| Playwright or browser tools | Automated browser tests | None locally | Any site the browser opens, including logged-in sessions | Use a clean profile and test accounts only |
| Supabase or other database tools | Schema inspection, migrations, queries | OAuth or a project token | Project data, possibly production | Point at a development branch; never production by default |
| Issue trackers, documentation platforms | Syncing tasks and docs | OAuth | Workspace content | Personal or client data entering transcripts |

## Rules

- Required or optional is decided per project; the factory default is "not installed".
- Never put credentials in Markdown, `project.json` or task files. Use the provider's sign-in flow or environment variables, referenced by name.
- Grant the narrowest scope that works. Do not widen permissions for convenience.
- Set up: follow the provider's own instructions and `claude mcp add`. Removal: `claude mcp remove <name>`, then revoke the token or OAuth grant at the provider.
- List each enabled integration in the project's `SYSTEM_ARCHITECTURE.md`.
