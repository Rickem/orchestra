# Compatibility

Last check: 2026-11-21. Pinned versions live in [`integrations/manifest.json`](../../integrations/manifest.json).

## Claude Code features used

| Feature | Used for | Status |
|---|---|---|
| Plugins (`.claude-plugin/plugin.json`, marketplace) | Packaging and distribution | Required. Tested on 2.1.283. |
| Plugin skills (`skills/<name>/SKILL.md`) | All workflows, as `/orchestra:<name>` | Required |
| Plugin subagents (`agents/*.md`) | `implementer`, `acceptance-verifier`, `product-manager` | Required |
| Plugin hooks (`hooks/hooks.json`, `PreToolUse`) | Guard hook | Optional; can be disabled |
| `${CLAUDE_PLUGIN_ROOT}` substitution in skills and hooks | Locating standards, templates and scripts | Required |
| `disable-model-invocation` skill frontmatter | `init` and `release` run only when the user asks | Required for those two |
| Subagent worktree isolation | Parallel writers | Optional |
| Agent Teams | — | Not used |

Orchestra's scripts need Node.js 18 or newer and have no dependencies.

## Platform

| Platform | Status |
|---|---|
| Windows 10, Git Bash and PowerShell | Factory scripts and tests run here |
| macOS, Linux | Scripts use only Node.js built-ins and should work; not tested |

## Known interactions

| With | Behaviour | What to do |
|---|---|---|
| ECC hooks | Run on the same tool events as the guard | Nothing; if edits feel slow, tune ECC with its `ECC_HOOK_PROFILE` and `ECC_DISABLED_HOOKS` settings |
| superpowers session hook | Urges skill use on any match | Orchestra skills name the superpowers skills they want; no change needed |
| Vercel plugin session hook | In an empty folder it says to skip exploration and start building | Start new projects with `/orchestra:init` and `/orchestra:project-discovery` explicitly |
| Built-in `/code-review`, `/security-review` | Same short names | Use the `/orchestra:` prefix for the gated versions |
| gstack on Windows | Upstream documents Windows 11; copies instead of symlinks without Developer Mode | Rerun `./setup` after each `git pull`. Its bundled browser drove a local page correctly on Windows 10 in a live `/qa-only` run. |
| gstack state and prompts | Every gstack skill prints an upgrade notice, writes logs and a cross-project builder profile to `~/.gstack`, and `/office-hours` showed another project's details from it. `/plan-design-review` mockups send a brief to an outside image service. | Decline mid-workflow upgrades; ignore other projects' details; no mockup generation unless the user approved image generation for the project |
| gstack design skills | `/design-review` stops on an uncommitted working tree and has fix-and-commit phases; `/plan-design-review` sends plan text to an outside image service when its image tool and a key are present | `/orchestra:ui-design` runs them only on request: `/design-review` on a clean tree, audit phases only; `/plan-design-review` text only. This constrained use is **untested** |
| graphify auto-refresh | Running the newer graphify rewrote the graphify skill in another tool's folder (`~/.gemini/config/skills/graphify`) | Set `GRAPHIFY_NO_AUTO_REFRESH=1` if that is unwanted |
| Local-directory marketplace | With the plugin installed from a local folder, skills received paths into that source folder, while `installed_plugins.json` points at a cached snapshot | Bump the version and run `claude plugin update` after every change so the two cannot drift |
| graphify CLI older than the skill | The graphify skill picks the CLI on PATH; if that is older than the skill, the build fails with an ImportError, and running the old CLI's `install` downgrades the skill | The doctor reports the mismatch. Upgrade with `uv tool upgrade graphifyy`. If that fails on Windows with "file used by another process", move `%APPDATA%\uv\tools\graphifyy` aside, run `uv tool install graphifyy --force`, then delete the old folder. Fixed this way on the build machine (0.9.7 to 0.9.114). |

## Limits of this document

Compatibility was checked by installing and reading, plus the runs listed in `docs/VALIDATION_REPORT.md`. Upstream skills were not run end to end.
