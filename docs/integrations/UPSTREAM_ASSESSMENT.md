# Upstream assessment

Inspected: 2026-11-21, on Windows 10 with Claude Code 2.1.283. Sources: the locally installed copies and each repository's public GitHub metadata.

## Summary

| Upstream | Repository | Licence | Installed | Latest seen | Install method | Inventory |
|---|---|---|---|---|---|---|
| ECC | [affaan-m/ECC](https://github.com/affaan-m/ECC) (renamed from `everything-claude-code`) | MIT | 2.2.3 (`25278e7`) | v2.2.3, released 2026-10-01 | Claude Code plugin, `ecc` marketplace | 71 agents, 311 skills, 97 legacy commands, 27 hook groups, 23 rule sets |
| gstack | [garrytan/gstack](https://github.com/garrytan/gstack) | MIT | 1.91.295.0 (`61e201e`, 2026-10-28) | v1.102.1.0, released 2026-11-20 | `git clone` into `~/.claude/skills/gstack`, then `./setup` | About 80 skills, a bundled browser, one Stop hook |
| superpowers | [obra/superpowers](https://github.com/obra/superpowers) | MIT | 7.0.2 (`22f0b46`) | Not checked against upstream | Claude Code plugin, official marketplace | 15 skills, one SessionStart hook |
| graphify | [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Apache-2.0 | 0.9.114 | 0.9.114 on PyPI | `pip install graphifyy`, `graphify install` | One skill, a CLI |

## Prerequisites

| Upstream | Needs |
|---|---|
| ECC | Claude Code with plugin support, Node.js |
| gstack | Git, Bun 1.4.2+, Node.js on Windows. Docs state Windows 11 via Git Bash or WSL. `/cso` needs a native toolchain. |
| superpowers | Claude Code with plugin support |
| graphify | Python 3.11.5 to 3.14 |

## Overlaps and conflicts found

| Issue | Evidence | Resolution |
|---|---|---|
| Three upstreams offer TDD, planning, review and verification | ECC `tdd-workflow`, `plan`, `code-reviewer`; gstack `/review`, `/autoplan`; superpowers `test-driven-development`, `writing-plans` | One owner per capability in [COMPONENT_MATRIX.md](COMPONENT_MATRIX.md) |
| Name collisions with Claude Code built-ins | Built-in `/code-review` and `/security-review`; gstack `/review`, `/ship`, `/qa` | Orchestra skills are namespaced `/orchestra:*` |
| Many hooks already run | ECC registers 27 hook groups; gstack adds a Stop hook; superpowers a SessionStart hook | Orchestra adds one hook only |
| Session-start instructions conflict with discovery-first | superpowers tells the model to invoke skills at the slightest match; the Vercel plugin (if installed) tells it to skip exploration in empty folders | Documented in [COMPATIBILITY.md](COMPATIBILITY.md); orchestra does not edit other plugins |
| Installing one does not overwrite another | ECC and superpowers live in the plugin cache; gstack and graphify in `~/.claude/skills`; no shared files | No action |
| Automatic learning | ECC `continuous-learning` writes instincts without review | Not used; see `docs/governance/LESSONS.md` |

## Not verified

- gstack browser tooling on this Windows 10 machine was not exercised.
- The gstack upgrade to v1.102.1.0 was not applied; the manifest pins the installed 1.91.295.0.
- superpowers was not compared against its latest upstream release.
- No upstream skill was run as part of this assessment except the ECC `code-reviewer` agent (see `docs/VALIDATION_REPORT.md`).

## Recommendation

Reuse all four by reference, never by copying. Build only the governance layer: init, task tracking, gates, board, validation, doctor, manifest. Details per capability are in [COMPONENT_MATRIX.md](COMPONENT_MATRIX.md).
