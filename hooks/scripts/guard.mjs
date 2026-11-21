#!/usr/bin/env node
// PreToolUse guard for Write/Edit. Active only for files inside an orchestra project.
// Secrets files and credential-like content are always blocked. Protected paths are blocked
// too, except in the default permission mode, where Claude Code's own prompt carries the
// reason. Live tests showed a hook's "ask" is resolved without any prompt in auto and
// accept-edits modes, so asking there would protect nothing.
// It never prints matched secrets.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isSecretFile, findSecrets } from '../../scripts/lib/secrets.mjs';

const PROMPTING_MODES = ['default', 'plan'];

function findProject(start) {
  let dir = path.resolve(start);
  for (;;) {
    const file = path.join(dir, '.orchestra', 'project.json');
    if (fs.existsSync(file)) return { root: dir, file };
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function globToRegex(glob) {
  const g = glob.replace(/\\/g, '/').replace(/\/$/, '/**');
  const body = g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*');
  return new RegExp(`^${body}$`);
}

// Returns null, or { reasons: string[], decision: 'ask' | 'deny' }.
export function evaluate(input) {
  const ti = input.tool_input ?? {};
  const target = ti.file_path ?? ti.notebook_path;
  if (!target) return null;
  const abs = path.resolve(input.cwd ?? process.cwd(), target);
  // The file's own location decides, so the guard holds whatever the session's directory is.
  const project = findProject(path.dirname(abs)) ?? findProject(input.cwd ?? process.cwd());
  if (!project) return null;
  const config = JSON.parse(fs.readFileSync(project.file, 'utf8'));
  if (config.hooks?.guard === false) return null;

  const reasons = [];
  let secret = false;
  if (isSecretFile(path.basename(abs))) { secret = true; reasons.push(`"${path.basename(abs)}" looks like a secrets file`); }

  const text = [ti.content, ti.new_string, ti.new_source, ...(ti.edits ?? []).map((e) => e.new_string)].filter(Boolean).join('\n');
  const found = findSecrets(text);
  if (found.length) { secret = true; reasons.push(`the new content appears to contain: ${found.join(', ')}`); }

  const rel = path.relative(project.root, abs).replace(/\\/g, '/');
  const hit = (config.protectedPaths ?? []).find((g) => globToRegex(g).test(rel));
  if (hit) reasons.push(`"${rel}" matches protected path "${hit}"`);

  if (!reasons.length) return null;
  const prompting = input.permission_mode === undefined || PROMPTING_MODES.includes(input.permission_mode);
  const decision = secret ? 'deny' : prompting || config.hooks?.unattended === 'ask' ? 'ask' : 'deny';
  return { reasons, decision, secret };
}

function main() {
  if ((process.env.ORCHESTRA_HOOKS ?? '').toLowerCase() === 'off') return 0;
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch (e) {
    console.error(`orchestra guard: could not read hook input (${e.message}). No check was made.`);
    return 1;
  }
  let result;
  try {
    result = evaluate(input);
    if (process.env.ORCHESTRA_GUARD_TRACE)
      fs.appendFileSync(process.env.ORCHESTRA_GUARD_TRACE,
        JSON.stringify({ cwd: input.cwd, tool: input.tool_name, mode: input.permission_mode, file: input.tool_input?.file_path, decision: result?.decision ?? 'none' }) + '\n');
  } catch (e) {
    console.error(`orchestra guard: check failed (${e.message}). No check was made.`);
    return 1;
  }
  if (result) {
    const why = `orchestra guard: ${result.reasons.join('; ')}.`;
    const next = result.decision === 'ask'
      ? ' Confirm only if this is intended.'
      : result.secret
        ? ' Blocked: Claude does not write secrets files or credential-like content in an orchestra project. Do not work around it: tell the user what you wanted to write and why, and let them make the change themselves.'
        : ' Blocked because this permission mode shows no confirmation prompt. Do not work around it: tell the user what you wanted to change and why; they can approve it by switching the session to the default permission mode.';
    console.log(JSON.stringify({
      hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: result.decision, permissionDecisionReason: why + next },
    }));
  }
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main());
