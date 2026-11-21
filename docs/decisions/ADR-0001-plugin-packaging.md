# ADR-0001: Package orchestra as a Claude Code plugin

Date: 2026-11-21
Status: accepted
Approved by: project owner

## Context

The original brief proposed a `.claude/` folder inside the factory repository, copied into each project. That only works inside the factory repository, duplicates files per project and has no update path. Its skill names would also collide with Claude Code built-ins and gstack.

## Decision

Ship the factory as a plugin (`.claude-plugin/plugin.json`, with `skills/`, `agents/`, `hooks/` at the root). Projects receive only their own layer from `init`: `.orchestra/project.json`, `docs/`, and an optional block in `CLAUDE.md`.

## Alternatives considered

| Option | Why not |
|---|---|
| Copy `.claude/` into each project | No namespacing, no updates, factory and project files mixed |
| User-level skills in `~/.claude/skills` | No versioning; name collisions with gstack |

## Consequences

Skills are invoked as `/orchestra:<name>`. One install serves every project. Factory updates do not touch project files. The plugin must be enabled for the hook and skills to be available.
