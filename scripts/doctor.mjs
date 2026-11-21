#!/usr/bin/env node
// Reports prerequisites, installed upstreams versus the integration manifest, and project
// configuration issues. Checks presence and version files only; it runs no upstream skill.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadTasks, checkTasks } from './lib/tasks.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const sh = (cmd) => { try { return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'], timeout: 15000 }).toString().trim(); } catch { return null; } };

export function claudeHome() {
  return process.env.ORCHESTRA_CLAUDE_HOME || process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
}

function locateUpstream(u, home) {
  if (u.locate.type === 'plugin') {
    const installed = readJson(path.join(home, 'plugins', 'installed_plugins.json'))?.plugins ?? {};
    const key = Object.keys(installed).find((k) => k.split('@')[0] === u.locate.key);
    const entry = key ? installed[key][0] : null;
    if (!entry || !fs.existsSync(entry.installPath)) return null;
    const enabled = readJson(path.join(home, 'settings.json'))?.enabledPlugins?.[key];
    return {
      version: entry.version, enabled: enabled !== false && enabled !== undefined,
      has: (c) => fs.existsSync(c.kind === 'agent' ? path.join(entry.installPath, 'agents', `${c.name}.md`) : path.join(entry.installPath, 'skills', c.name, 'SKILL.md')),
    };
  }
  const dir = path.join(home, 'skills', u.locate.dir);
  if (!fs.existsSync(dir)) return null;
  const vf = path.join(dir, u.locate.versionFile);
  return {
    version: fs.existsSync(vf) ? fs.readFileSync(vf, 'utf8').trim() : 'unknown', enabled: true,
    has: (c) => fs.existsSync(path.join(home, 'skills', c.name, 'SKILL.md')) || fs.existsSync(path.join(dir, c.name, 'SKILL.md')),
  };
}

export function diagnose({ project, skipCommands = false } = {}) {
  const out = [];
  const add = (level, check, detail, fix) => out.push({ level, check, detail, ...(fix ? { fix } : {}) });
  const manifest = readJson(path.join(ROOT, 'integrations', 'manifest.json'));
  const home = claudeHome();

  const major = Number(process.versions.node.split('.')[0]);
  add(major >= 18 ? 'ok' : 'fail', 'node', `v${process.versions.node}`, major >= 18 ? undefined : 'Install Node.js 18 or newer.');
  if (!skipCommands) {
    const git = sh('git --version');
    add(git ? 'ok' : 'fail', 'git', git ?? 'not found', git ? undefined : 'Install Git.');
    const cc = sh('claude --version');
    const tested = manifest?.claudeCode?.testedVersion;
    if (!cc) add('warn', 'claude code', 'CLI not found on PATH', 'Install Claude Code or add it to PATH.');
    else add(cc.startsWith(tested) ? 'ok' : 'info', 'claude code', `${cc} (factory tested with ${tested})`);
    const bun = sh('bun --version');
    add(bun ? 'ok' : 'info', 'bun', bun ?? 'not found (needed only for gstack browser skills)');
  }

  if (!manifest) add('fail', 'manifest', 'integrations/manifest.json missing or invalid', 'Restore the file from the factory repository.');
  for (const u of manifest?.upstreams ?? []) {
    const found = locateUpstream(u, home);
    const optional = u.necessity === 'optional';
    if (!found) {
      add(optional ? 'info' : 'warn', u.id, `not installed (${u.necessity})`, `${u.installMethod}. Until then orchestra uses the fallbacks in standards/upstream-routing.md.`);
      continue;
    }
    if (!found.enabled) add('warn', u.id, 'installed but not enabled', `Enable the ${u.id} plugin.`);
    add(found.version === u.version ? 'ok' : 'warn', u.id,
      found.version === u.version ? `v${found.version}` : `installed v${found.version}, factory tested with v${u.version}`,
      found.version === u.version ? undefined : 'Follow docs/integrations/UPDATE_GUIDE.md, then update the manifest.');
    const missing = u.components.filter((c) => !found.has(c)).map((c) => `${c.kind} ${c.name}`);
    if (missing.length) add('warn', `${u.id} components`, `missing: ${missing.join(', ')}`, 'Upstream may have renamed or removed them; check UPDATE_GUIDE.md.');
  }

  if (project) {
    const dir = path.resolve(project);
    const file = path.join(dir, '.orchestra', 'project.json');
    const config = readJson(file);
    if (!fs.existsSync(file)) add('fail', 'project config', `${file} not found`, 'Run /orchestra:init.');
    else if (!config) add('fail', 'project config', 'project.json is not valid JSON', 'Fix the syntax.');
    else {
      add('ok', 'project config', config.name ?? path.basename(dir));
      for (const [name, g] of Object.entries(config.gates ?? {}))
        if (g.required && !g.command) add('warn', `gate ${name}`, 'required but has no command', `Set gates.${name}.command in .orchestra/project.json.`);
      if (!config.stack?.language) add('info', 'stack', 'language not set', 'Record the stack with /orchestra:architecture.');
      const tasks = loadTasks(dir, config);
      const problems = checkTasks(tasks);
      const errors = problems.filter((p) => p.level === 'error');
      add(errors.length ? 'fail' : 'ok', 'tasks', `${tasks.length} task(s), ${errors.length} error(s), ${problems.length - errors.length} warning(s)`,
        errors.length ? 'Run the board with --check for details.' : undefined);
      const claudeMd = path.join(dir, 'CLAUDE.md');
      if (!fs.existsSync(claudeMd) || !fs.readFileSync(claudeMd, 'utf8').includes('<!-- orchestra:start -->'))
        add('info', 'CLAUDE.md', 'no orchestra block', 'Optional: rerun init with --claude-md.');
    }
  }
  return out;
}

function main(argv) {
  const i = argv.indexOf('--project');
  const results = diagnose({ project: i === -1 ? undefined : argv[i + 1] });
  if (argv.includes('--json')) console.log(JSON.stringify(results, null, 2));
  else {
    for (const r of results) {
      console.log(`${r.level.toUpperCase().padEnd(5)} ${r.check}: ${r.detail}`);
      if (r.fix) console.log(`      fix: ${r.fix}`);
    }
    const n = (l) => results.filter((r) => r.level === l).length;
    console.log(`\n${n('ok')} ok, ${n('info')} info, ${n('warn')} warn, ${n('fail')} fail. Presence and versions only; upstream behaviour is not tested.`);
  }
  return results.some((r) => r.level === 'fail') ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main(process.argv.slice(2)));
