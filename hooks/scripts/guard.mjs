#!/usr/bin/env node
// PreToolUse guard for Write/Edit. Active only inside an orchestra project.
// It never blocks: on a match it asks the user to confirm. It never prints matched secrets.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isSecretFile, findSecrets } from '../../scripts/lib/secrets.mjs';

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

export function evaluate(input) {
  const ti = input.tool_input ?? {};
  const target = ti.file_path ?? ti.notebook_path;
  if (!target) return null;
  const project = findProject(input.cwd ?? process.cwd());
  if (!project) return null;
  const config = JSON.parse(fs.readFileSync(project.file, 'utf8'));
  if (config.hooks?.guard === false) return null;

  const reasons = [];
  const abs = path.resolve(input.cwd ?? process.cwd(), target);
  if (isSecretFile(path.basename(abs))) reasons.push(`"${path.basename(abs)}" looks like a secrets file`);

  const text = [ti.content, ti.new_string, ti.new_source, ...(ti.edits ?? []).map((e) => e.new_string)].filter(Boolean).join('\n');
  const found = findSecrets(text);
  if (found.length) reasons.push(`the new content appears to contain: ${found.join(', ')}`);

  const rel = path.relative(project.root, abs).replace(/\\/g, '/');
  const hit = (config.protectedPaths ?? []).find((g) => globToRegex(g).test(rel));
  if (hit) reasons.push(`"${rel}" matches protected path "${hit}"`);

  return reasons.length ? reasons : null;
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
  let reasons;
  try {
    reasons = evaluate(input);
  } catch (e) {
    console.error(`orchestra guard: check failed (${e.message}). No check was made.`);
    return 1;
  }
  if (reasons)
    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: `orchestra guard: ${reasons.join('; ')}. Confirm only if this is intended.`,
      },
    }));
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main());
