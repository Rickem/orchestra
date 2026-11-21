#!/usr/bin/env node
// Static validation of the factory repository. It checks structure, formats, references,
// links and obvious secrets. It does not test how skills or agents behave when run.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseFrontmatter, loadTasks, checkTasks } from './lib/tasks.mjs';
import { findSecrets } from './lib/secrets.mjs';
import { COMPONENTS, ON_DEMAND } from './init-project.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'graphify-out']);
const HOOK_EVENTS = new Set(['PreToolUse', 'PostToolUse', 'PostToolUseFailure', 'UserPromptSubmit', 'Notification', 'Stop', 'SubagentStop', 'PreCompact', 'SessionStart', 'SessionEnd']);
const REQUIRED_FILES = ['README.md', 'FACTORY_GUIDE.md', 'CHANGELOG.md', 'LICENSE', '.claude-plugin/plugin.json', 'hooks/hooks.json', 'integrations/manifest.json',
  'docs/integrations/UPSTREAM_ASSESSMENT.md', 'docs/integrations/COMPONENT_MATRIX.md', 'docs/integrations/COMPATIBILITY.md', 'docs/integrations/UPDATE_GUIDE.md'];
const AGENT_SECTIONS = ['## Mission', '## Required inputs', '## Responsibilities', '## You must not', '## Escalate', '## Completion report'];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

export function validate(root = ROOT) {
  const results = [];
  const rel = (p) => path.relative(root, p).replace(/\\/g, '/');
  const check = (name, problems) => results.push({ name, ok: problems.length === 0, problems });
  const read = (p) => fs.readFileSync(p, 'utf8');
  const json = (p) => { try { return JSON.parse(read(p)); } catch { return null; } };
  const files = walk(root);
  const md = files.filter((f) => f.endsWith('.md'));

  check('required files exist', REQUIRED_FILES.filter((f) => !fs.existsSync(path.join(root, f))).map((f) => `missing ${f}`));

  {
    const p = [];
    const plugin = json(path.join(root, '.claude-plugin/plugin.json'));
    const market = json(path.join(root, '.claude-plugin/marketplace.json'));
    if (!plugin) p.push('plugin.json missing or invalid JSON');
    else {
      if (!/^[a-z][a-z0-9-]*$/.test(plugin.name ?? '')) p.push('plugin name must be kebab-case');
      if (!/^\d+\.\d+\.\d+$/.test(plugin.version ?? '')) p.push('plugin version must be semver');
      if (!plugin.description) p.push('plugin description missing');
      const entry = market?.plugins?.find((x) => x.name === plugin.name);
      if (market && !entry) p.push('marketplace.json does not list the plugin');
      if (entry && entry.version !== plugin.version) p.push(`marketplace version ${entry.version} differs from plugin ${plugin.version}`);
      const manifest = json(path.join(root, 'integrations/manifest.json'));
      if (manifest && manifest.factoryVersion !== plugin.version) p.push(`manifest factoryVersion ${manifest.factoryVersion} differs from plugin ${plugin.version}`);
    }
    check('plugin metadata', p);
  }

  const skillNames = [];
  {
    const p = [];
    const dir = path.join(root, 'skills');
    for (const name of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
      const file = path.join(dir, name, 'SKILL.md');
      if (!fs.existsSync(file)) { p.push(`skills/${name}: no SKILL.md`); continue; }
      const text = read(file);
      const { data } = parseFrontmatter(text);
      skillNames.push(name);
      if (!data) { p.push(`skills/${name}: no frontmatter`); continue; }
      if (data.name !== name) p.push(`skills/${name}: frontmatter name "${data.name}" differs from directory`);
      const len = (data.description ?? '').length;
      if (len < 40 || len > 1024) p.push(`skills/${name}: description length ${len} (need 40-1024)`);
      if (text.split(/\r?\n/).length > 120) p.push(`skills/${name}: over 120 lines; keep skills concise`);
    }
    if (!skillNames.length) p.push('no skills found');
    check('skill definitions', p);
  }

  {
    const p = [];
    const dir = path.join(root, 'agents');
    const list = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')) : [];
    for (const f of list) {
      const text = read(path.join(dir, f));
      const { data } = parseFrontmatter(text);
      if (!data) { p.push(`agents/${f}: no frontmatter`); continue; }
      if (data.name !== f.replace(/\.md$/, '')) p.push(`agents/${f}: name "${data.name}" differs from filename`);
      if (!data.description) p.push(`agents/${f}: description missing`);
      if (!data.tools) p.push(`agents/${f}: tools missing (least privilege requires an explicit list)`);
      for (const s of AGENT_SECTIONS) if (!text.includes(s)) p.push(`agents/${f}: section "${s}" missing`);
    }
    if (!list.length) p.push('no agents found');
    check('agent definitions', p);
  }

  {
    const p = [];
    for (const f of md)
      for (const m of read(f).matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([A-Za-z0-9_./-]+)/g)) {
        const target = m[1].replace(/[.,;:)]+$/, '');
        if (!fs.existsSync(path.join(root, target))) p.push(`${rel(f)}: ${target} does not exist`);
      }
    check('plugin-root references resolve', p);
  }

  {
    const p = [];
    const hooks = json(path.join(root, 'hooks/hooks.json'));
    if (!hooks?.hooks) p.push('hooks.json missing or has no "hooks" object');
    for (const [event, groups] of Object.entries(hooks?.hooks ?? {})) {
      if (!HOOK_EVENTS.has(event)) p.push(`unknown hook event ${event}`);
      for (const g of groups)
        for (const h of g.hooks ?? []) {
          if (h.type !== 'command' || !h.command) { p.push(`${event}: hook needs type "command" and a command`); continue; }
          const m = /\$\{CLAUDE_PLUGIN_ROOT\}\/([^"'\s]+)/.exec(h.command);
          if (!m) p.push(`${event}: command does not use \${CLAUDE_PLUGIN_ROOT}`);
          else if (!fs.existsSync(path.join(root, m[1]))) p.push(`${event}: script ${m[1]} does not exist`);
          else if (/\bgit\s+(commit|push|merge)\b|\bdeploy\b|\brm\s+-rf\b/.test(read(path.join(root, m[1])))) p.push(`${event}: ${m[1]} contains a commit, push, merge, deploy or delete command`);
          if (!h.timeout) p.push(`${event}: hook has no timeout`);
        }
    }
    check('hook configuration', p);
  }

  {
    const p = [];
    for (const f of md) {
      const text = read(f).replace(/```[\s\S]*?```/g, '').replace(/<!--[\s\S]*?-->/g, '');
      for (const m of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
        const link = m[1];
        if (/^(https?:|mailto:|#)/.test(link) || link.includes('{{')) continue;
        if (!fs.existsSync(path.resolve(path.dirname(f), decodeURIComponent(link.split('#')[0])))) p.push(`${rel(f)}: broken link ${link}`);
      }
    }
    check('markdown links resolve', p);
  }

  {
    const p = [];
    for (const f of files) {
      if (fs.statSync(f).size > 1_000_000) continue;
      const found = findSecrets(read(f));
      if (found.length) p.push(`${rel(f)}: ${found.join(', ')}`);
    }
    check('no obvious secrets', p);
  }

  {
    const p = [];
    const manifest = json(path.join(root, 'integrations/manifest.json'));
    if (!manifest) p.push('manifest missing or invalid JSON');
    for (const u of manifest?.upstreams ?? []) {
      for (const k of ['id', 'name', 'repository', 'license', 'installMethod', 'locate', 'version', 'necessity', 'components'])
        if (u[k] === undefined || u[k] === '') p.push(`${u.id ?? '?'}: field "${k}" missing`);
      for (const c of u.components ?? [])
        for (const s of c.usedBy ?? []) if (!skillNames.includes(s)) p.push(`${u.id}: component ${c.name} is used by unknown skill "${s}"`);
    }
    check('integration manifest', p);
  }

  {
    const p = [];
    const all = [...Object.values(COMPONENTS).flat().map(([t]) => t), ...ON_DEMAND];
    for (const t of all) if (!fs.existsSync(path.join(root, 'templates', t))) p.push(`template ${t} missing`);
    const shipped = walk(path.join(root, 'templates')).map((f) => path.relative(path.join(root, 'templates'), f).replace(/\\/g, '/'));
    for (const t of shipped) if (!all.includes(t)) p.push(`template ${t} is not referenced by init or the on-demand list`);
    check('templates', p);
  }

  {
    const p = [];
    const sample = path.join(root, 'examples/sample-project');
    const config = json(path.join(sample, '.orchestra/project.json'));
    if (!config) p.push('sample project has no valid .orchestra/project.json');
    else {
      const tasks = loadTasks(sample, config);
      if (!tasks.length) p.push('sample project has no tasks');
      for (const x of checkTasks(tasks).filter((x) => x.level === 'error')) p.push(`${x.task}: ${x.message}`);
      if (!config.gates?.test?.command) p.push('sample project has no test command');
    }
    check('sample project is coherent', p);
  }

  return results;
}

function main(argv) {
  const results = validate();
  if (argv.includes('--json')) console.log(JSON.stringify(results, null, 2));
  else {
    for (const r of results) {
      console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}`);
      for (const p of r.problems) console.log(`        ${p}`);
    }
    const failed = results.filter((r) => !r.ok).length;
    console.log(`\n${results.length - failed}/${results.length} checks passed. Static checks only: skill and agent behaviour is not tested here.`);
  }
  return results.every((r) => r.ok) ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main(process.argv.slice(2)));
