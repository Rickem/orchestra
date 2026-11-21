import fs from 'node:fs';
import path from 'node:path';

export const STATUSES = [
  'not-started',
  'in-progress',
  'blocked',
  'implemented-unverified',
  'in-review',
  'verified',
  'accepted',
];
export const ACTIVE = ['in-progress', 'implemented-unverified', 'in-review'];
export const TIERS = ['light', 'standard', 'full'];
const DONE = ['verified', 'accepted'];

export function parseFrontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return { data: null, body: text };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    const raw = kv[2].trim();
    const list = /^\[(.*)\]$/.exec(raw);
    data[kv[1]] = list
      ? list[1].split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
      : raw.replace(/^["']|["']$/g, '');
  }
  return { data, body: text.slice(m[0].length) };
}

export function loadProject(projectDir) {
  const file = path.join(projectDir, '.orchestra', 'project.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function lastVerification(body) {
  const m = /^## Verification log\s*$/m.exec(body);
  if (!m) return '';
  const rest = body.slice(m.index + m[0].length).split(/^## /m)[0];
  const lines = rest.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('<!--'));
  return lines.length ? lines[lines.length - 1] : '';
}

export function tasksDir(projectDir, config) {
  return path.join(projectDir, config?.paths?.tasks ?? 'docs/development/tasks');
}

export function loadTasks(projectDir, config = loadProject(projectDir)) {
  const dir = tasksDir(projectDir, config);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .sort()
    .map((f) => {
      const { data, body } = parseFrontmatter(fs.readFileSync(path.join(dir, f), 'utf8'));
      const d = data ?? {};
      const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);
      return {
        file: f,
        hasFrontmatter: data !== null,
        id: d.id ?? '',
        title: d.title ?? '',
        status: d.status ?? '',
        tier: d.tier ?? '',
        owner: d.owner ?? '',
        requirement: d.requirement ?? '',
        depends_on: asList(d.depends_on),
        files: asList(d.files),
        lastVerification: lastVerification(body),
      };
    });
}

// Returns [{level: 'error'|'warn', task, message}]
export function checkTasks(tasks) {
  const problems = [];
  const add = (level, task, message) => problems.push({ level, task: task.id || task.file, message });
  const byId = new Map();
  for (const t of tasks) {
    if (!t.hasFrontmatter) { add('error', t, 'no frontmatter block'); continue; }
    if (!t.id) add('error', t, 'missing id');
    else if (byId.has(t.id)) add('error', t, `duplicate id (also in ${byId.get(t.id).file})`);
    else byId.set(t.id, t);
    if (!t.title) add('error', t, 'missing title');
    if (!STATUSES.includes(t.status)) add('error', t, `unknown status "${t.status}"`);
    if (t.tier && !TIERS.includes(t.tier)) add('error', t, `unknown tier "${t.tier}"`);
  }
  for (const t of tasks) {
    for (const dep of t.depends_on) {
      const d = byId.get(dep);
      if (!d) add('error', t, `depends on unknown task ${dep}`);
      else if (ACTIVE.includes(t.status) && !DONE.includes(d.status))
        add('warn', t, `started before dependency ${dep} is verified (${d.status})`);
    }
    if (ACTIVE.includes(t.status) && (!t.owner || t.owner === 'unassigned'))
      add('warn', t, 'active task has no owner');
  }
  const active = tasks.filter((t) => ACTIVE.includes(t.status));
  for (let i = 0; i < active.length; i++)
    for (let j = i + 1; j < active.length; j++) {
      const shared = active[i].files.filter((f) => active[j].files.includes(f));
      if (shared.length)
        add('error', active[i], `shares files with active task ${active[j].id}: ${shared.join(', ')}`);
    }
  return problems;
}

export function countByStatus(tasks) {
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  for (const t of tasks) if (t.status in counts) counts[t.status]++;
  return counts;
}
