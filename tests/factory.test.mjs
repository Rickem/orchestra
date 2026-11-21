import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter, loadTasks, checkTasks } from '../scripts/lib/tasks.mjs';
import { isSecretFile, findSecrets } from '../scripts/lib/secrets.mjs';
import { init, detect } from '../scripts/init-project.mjs';
import { renderBoard, summary } from '../scripts/board.mjs';
import { diagnose } from '../scripts/doctor.mjs';
import { validate } from '../scripts/validate-factory.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'orchestra-test-'));
const task = (fields, log = '') =>
  `---\n${Object.entries(fields).map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.join(', ')}]` : v}`).join('\n')}\n---\n\n## Objective\n\nx\n\n## Verification log\n\n${log}\n`;
function project(tasks) {
  const dir = tmp();
  fs.mkdirSync(path.join(dir, '.orchestra'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.orchestra/project.json'), JSON.stringify({ name: 'demo', protectedPaths: ['migrations/**', 'infra/'], hooks: { guard: true } }));
  fs.mkdirSync(path.join(dir, 'docs/development/tasks'), { recursive: true });
  for (const [name, text] of Object.entries(tasks)) fs.writeFileSync(path.join(dir, 'docs/development/tasks', name), text);
  return dir;
}
// Built at runtime so this file contains no secret-shaped literal.
const FAKE_AWS = 'AKIA' + 'ABCDEFGHIJKLMNOP';
const FAKE_PASSWORD_LINE = 'pass' + 'word = "' + 'hunter2hunter2hunter2' + '"';

test('frontmatter parses scalars and lists', () => {
  const { data, body } = parseFrontmatter('---\nid: T-001\ndepends_on: [T-000, T-002]\nfiles: []\n---\nbody');
  assert.deepEqual(data, { id: 'T-001', depends_on: ['T-000', 'T-002'], files: [] });
  assert.equal(body, 'body');
  assert.equal(parseFrontmatter('no frontmatter').data, null);
});

test('tasks load with their last verification line', () => {
  const dir = project({ 'T-001-a.md': task({ id: 'T-001', title: 'A', status: 'verified', owner: 'x' }, '2026-01-01 | test | ran: npm test | pass | 3 tests\n2026-01-02 | acceptance | ran: manual | pass | ok') });
  const [t] = loadTasks(dir);
  assert.equal(t.id, 'T-001');
  assert.match(t.lastVerification, /acceptance/);
});

test('task checks catch bad status, unknown dependency, duplicate id and shared files', () => {
  const dir = project({
    'T-001.md': task({ id: 'T-001', title: 'A', status: 'in-progress', owner: 'a', files: ['src/a.js'] }),
    'T-002.md': task({ id: 'T-002', title: 'B', status: 'in-review', owner: 'b', files: ['src/a.js'], depends_on: ['T-999'] }),
    'T-003.md': task({ id: 'T-003', title: 'C', status: 'done', owner: 'c' }),
    'T-004.md': task({ id: 'T-001', title: 'D', status: 'not-started' }),
  });
  const messages = checkTasks(loadTasks(dir)).map((p) => p.message).join('\n');
  assert.match(messages, /unknown status "done"/);
  assert.match(messages, /depends on unknown task T-999/);
  assert.match(messages, /duplicate id/);
  assert.match(messages, /shares files with active task T-002/);
  assert.ok(summary(dir).errors > 0);
});

test('a clean task set has no problems', () => {
  const dir = project({
    'T-001.md': task({ id: 'T-001', title: 'A', status: 'accepted', owner: 'a', files: ['src/a.js'] }),
    'T-002.md': task({ id: 'T-002', title: 'B', status: 'in-progress', owner: 'b', files: ['src/b.js'], depends_on: ['T-001'] }),
  });
  assert.deepEqual(checkTasks(loadTasks(dir)), []);
});

test('board renders every status column and escapes HTML', () => {
  const dir = project({ 'T-001.md': task({ id: 'T-001', title: '<script>alert(1)</script>', status: 'blocked', owner: 'a' }) });
  const html = renderBoard(dir);
  for (const s of ['not-started', 'in-progress', 'blocked', 'implemented-unverified', 'in-review', 'verified', 'accepted']) assert.ok(html.includes(`data-status="${s}"`));
  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.ok(html.includes('&lt;script&gt;'));
});

test('board CLI writes the HTML file and does not modify tasks', () => {
  const dir = project({ 'T-001.md': task({ id: 'T-001', title: 'A', status: 'verified', owner: 'a' }) });
  const before = fs.readFileSync(path.join(dir, 'docs/development/tasks/T-001.md'), 'utf8');
  const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts/board.mjs'), '--project', dir], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.ok(fs.existsSync(path.join(dir, '.orchestra/board.html')));
  assert.equal(fs.readFileSync(path.join(dir, 'docs/development/tasks/T-001.md'), 'utf8'), before);
});

test('init detects a Node project and reads env names only from example files', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'shop', scripts: { test: 'vitest', lint: 'eslint .', build: 'next build' }, dependencies: { next: '1', react: '1', tailwindcss: '1' }, devDependencies: { typescript: '5' } }));
  fs.writeFileSync(path.join(dir, 'pnpm-lock.yaml'), '');
  fs.writeFileSync(path.join(dir, '.env.example'), 'DATABASE_URL=\nAPI_TOKEN=changeme\n');
  fs.writeFileSync(path.join(dir, '.env'), 'REAL_ONLY_NAME=' + 'x'.repeat(20) + '\n');
  const d = detect(dir);
  assert.equal(d.language, 'TypeScript');
  assert.equal(d.packageManager, 'pnpm');
  assert.deepEqual(d.frameworks, ['Next.js', 'React']);
  assert.equal(d.ui.styling, 'Tailwind CSS');
  assert.deepEqual(d.commands, { test: 'pnpm test', lint: 'pnpm run lint', typecheck: null, build: 'pnpm run build' });
  assert.deepEqual(d.envVars, ['DATABASE_URL', 'API_TOKEN']);
});

test('init dry run writes nothing', () => {
  const dir = tmp();
  const r = init({ target: dir, dryRun: true, claudeMd: true });
  assert.ok(r.created.includes('.orchestra/project.json'));
  assert.deepEqual(fs.readdirSync(dir), []);
});

test('init creates files, preserves existing ones and is idempotent', () => {
  const dir = tmp();
  fs.mkdirSync(path.join(dir, 'docs/product'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docs/product/PRD.md'), 'MINE');
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), '# Existing rules\n');
  const first = init({ target: dir, claudeMd: true });
  assert.ok(first.skipped.includes('docs/product/PRD.md'));
  assert.equal(fs.readFileSync(path.join(dir, 'docs/product/PRD.md'), 'utf8'), 'MINE');
  const claude = fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8');
  assert.ok(claude.startsWith('# Existing rules\n') && claude.includes('<!-- orchestra:start -->'));
  const config = JSON.parse(fs.readFileSync(path.join(dir, '.orchestra/project.json'), 'utf8'));
  assert.equal(config.gates.test.required, true);
  assert.equal(config.orchestra, JSON.parse(fs.readFileSync(path.join(ROOT, '.claude-plugin/plugin.json'), 'utf8')).version);
  assert.ok(!fs.readFileSync(path.join(dir, 'docs/product/DISCOVERY.md'), 'utf8').includes('{{'));

  const second = init({ target: dir, claudeMd: true });
  assert.deepEqual(second.created, []);
  assert.deepEqual(second.appended, []);
  assert.equal(fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8'), claude);

  const forced = init({ target: dir, force: ['docs/product/PRD.md'] });
  assert.deepEqual(forced.created, ['docs/product/PRD.md']);
});

test('init installs only the selected components and rejects unknown ones', () => {
  const dir = tmp();
  init({ target: dir, components: ['quality'] });
  assert.ok(fs.existsSync(path.join(dir, 'docs/quality/REVIEW_LOG.md')));
  assert.ok(!fs.existsSync(path.join(dir, 'docs/product')));
  assert.throws(() => init({ target: dir, components: ['nope'] }), /unknown component/);
});

test('secret helpers', () => {
  for (const f of ['.env', '.env.production', 'server.pem', 'id_rsa', 'credentials.json']) assert.ok(isSecretFile(f), f);
  for (const f of ['.env.example', 'environment.ts', 'keyboard.js', 'README.md']) assert.ok(!isSecretFile(f), f);
  assert.deepEqual(findSecrets(`const k = "${FAKE_AWS}"`), ['AWS access key id']);
  assert.deepEqual(findSecrets(FAKE_PASSWORD_LINE), ['hard-coded credential']);
  assert.deepEqual(findSecrets('const password = process.env.PASSWORD'), []);
});

function guard(input, env = {}) {
  return spawnSync(process.execPath, [path.join(ROOT, 'hooks/scripts/guard.mjs')], { input: typeof input === 'string' ? input : JSON.stringify(input), encoding: 'utf8', env: { ...process.env, ...env } });
}

test('guard blocks secrets files and secret content in every mode and stays quiet otherwise', () => {
  const dir = project({});
  const run = (tool_input, permission_mode) => {
    const r = guard({ tool_name: 'Write', cwd: dir, permission_mode, tool_input });
    assert.equal(r.status, 0, r.stderr);
    return r.stdout ? JSON.parse(r.stdout).hookSpecificOutput : null;
  };
  assert.equal(run({ file_path: path.join(dir, 'src/app.js'), content: 'console.log(1)' }, 'auto'), null);
  assert.equal(run({ file_path: path.join(dir, '.env.example'), content: 'A=' }, 'auto'), null);

  for (const mode of [undefined, 'default', 'plan', 'acceptEdits', 'auto', 'bypassPermissions', 'dontAsk']) {
    const a = run({ file_path: path.join(dir, '.env'), content: 'A=1' }, mode);
    assert.equal(a.permissionDecision, 'deny', String(mode));
    assert.match(a.permissionDecisionReason, /secrets file.*tell the user/);
  }
  const b = run({ file_path: path.join(dir, 'src/config.js'), content: `key = "${FAKE_AWS}"` }, 'default');
  assert.equal(b.permissionDecision, 'deny');
  assert.match(b.permissionDecisionReason, /AWS access key id/);
  assert.ok(!b.permissionDecisionReason.includes(FAKE_AWS), 'must not echo the secret');
  assert.match(run({ file_path: path.join(dir, 'a.js'), edits: [{ new_string: FAKE_PASSWORD_LINE }] }, 'default').permissionDecisionReason, /hard-coded credential/);
});

test('guard is inactive outside orchestra projects, when disabled, and fails loudly on bad input', () => {
  const outside = tmp();
  assert.equal(guard({ cwd: outside, tool_input: { file_path: path.join(outside, '.env'), content: 'A=1' } }).stdout, '');

  const dir = project({});
  const input = { cwd: dir, tool_input: { file_path: path.join(dir, '.env'), content: 'A=1' } };
  assert.equal(guard(input, { ORCHESTRA_HOOKS: 'off' }).stdout, '');
  fs.writeFileSync(path.join(dir, '.orchestra/project.json'), JSON.stringify({ hooks: { guard: false } }));
  assert.equal(guard(input).stdout, '');

  const bad = guard('not json');
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /No check was made/);
});

test('guard asks for protected paths only where a prompt exists, and finds the project from the file path', () => {
  const dir = project({});
  const run = (permission_mode, file = path.join(dir, 'migrations/001/up.sql'), cwd = dir) => {
    const r = guard({ tool_name: 'Write', cwd, permission_mode, tool_input: { file_path: file, content: 'x' } });
    assert.equal(r.status, 0, r.stderr);
    return r.stdout ? JSON.parse(r.stdout).hookSpecificOutput : null;
  };
  for (const mode of [undefined, 'default', 'plan']) {
    const out = run(mode);
    assert.equal(out.permissionDecision, 'ask', String(mode));
    assert.match(out.permissionDecisionReason, /protected path "migrations\/\*\*"/);
  }
  for (const mode of ['acceptEdits', 'auto', 'bypassPermissions', 'dontAsk']) {
    const out = run(mode);
    assert.equal(out.permissionDecision, 'deny', mode);
    assert.match(out.permissionDecisionReason, /default permission mode/);
  }
  assert.match(run('default', 'infra/main.tf').permissionDecisionReason, /protected path "infra\/"/);
  // Session directory outside the project: the target file still decides.
  assert.equal(run('auto', path.join(dir, 'migrations/x.sql'), tmp()).permissionDecision, 'deny');

  fs.writeFileSync(path.join(dir, '.orchestra/project.json'), JSON.stringify({ protectedPaths: ['migrations/**'], hooks: { unattended: 'ask' } }));
  assert.equal(run('auto').permissionDecision, 'ask');
  // The opt-out never applies to secrets.
  assert.equal(run('auto', path.join(dir, '.env')).permissionDecision, 'deny');
});

test('doctor reports missing upstreams as warnings and a missing project config as a failure', () => {
  const home = tmp();
  process.env.ORCHESTRA_CLAUDE_HOME = home;
  try {
    const r = diagnose({ skipCommands: true, project: tmp() });
    assert.equal(r.find((x) => x.check === 'ecc').level, 'warn');
    assert.equal(r.find((x) => x.check === 'graphify').level, 'info');
    assert.equal(r.find((x) => x.check === 'project config').level, 'fail');

    fs.mkdirSync(path.join(home, 'skills/gstack'), { recursive: true });
    fs.writeFileSync(path.join(home, 'skills/gstack/VERSION'), '0.0.1\n');
    const g = diagnose({ skipCommands: true }).filter((x) => x.check.startsWith('gstack'));
    assert.match(g[0].detail, /installed v0\.0\.1, factory tested with/);
    assert.match(g[1].detail, /missing: skill office-hours/);
  } finally {
    delete process.env.ORCHESTRA_CLAUDE_HOME;
  }
});

test('doctor passes on a freshly initialised project', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'x', scripts: { test: 'node --test' } }));
  init({ target: dir, claudeMd: true });
  const r = diagnose({ skipCommands: true, project: dir }).filter((x) => ['project config', 'tasks'].includes(x.check));
  assert.deepEqual(r.map((x) => x.level), ['ok', 'ok']);
});

test('the factory repository passes its own validation', () => {
  const failed = validate().filter((r) => !r.ok);
  assert.deepEqual(failed, []);
});
