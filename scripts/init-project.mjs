#!/usr/bin/env node
// Sets up orchestra in a target repository. Never overwrites an existing file unless
// that exact path is passed with --force. Never reads .env values.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATES = path.join(ROOT, 'templates');

// component -> [template (relative to templates/), target (relative to project)]
export const COMPONENTS = {
  product: [
    ['product/DISCOVERY.md', 'docs/product/DISCOVERY.md'],
    ['product/PRD.md', 'docs/product/PRD.md'],
    ['product/REQUIREMENTS.md', 'docs/product/REQUIREMENTS.md'],
  ],
  architecture: [['architecture/SYSTEM_ARCHITECTURE.md', 'docs/architecture/SYSTEM_ARCHITECTURE.md']],
  development: [
    ['development/ROADMAP.md', 'docs/development/ROADMAP.md'],
    ['development/RISK_REGISTER.md', 'docs/development/RISK_REGISTER.md'],
  ],
  quality: [
    ['quality/TEST_STRATEGY.md', 'docs/quality/TEST_STRATEGY.md'],
    ['quality/REVIEW_LOG.md', 'docs/quality/REVIEW_LOG.md'],
  ],
  operations: [['operations/DEPLOYMENT.md', 'docs/operations/DEPLOYMENT.md']],
};
// Copied on demand by skills, not by init.
export const ON_DEMAND = [
  'architecture/ADR.md', 'development/TASK.md', 'development/SPRINT.md', 'development/PROGRESS_REPORT.md',
  'quality/DEFECT.md', 'operations/HANDOVER.md', 'governance/LESSON.md', 'project/CLAUDE.block.md', 'project/project.json',
  'design/DESIGN.md', 'design/SCREENS.md',
];

const exists = (dir, f) => fs.existsSync(path.join(dir, f));
const readJson = (file) => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; } };

export function detect(dir) {
  const d = {
    language: null, runtime: null, frameworks: [], packageManager: null, database: null,
    ui: { framework: null, components: null, styling: null },
    commands: { test: null, lint: null, typecheck: null, build: null },
    existing: [], envVars: [], ci: exists(dir, '.github/workflows'),
  };
  for (const f of ['README.md', 'CLAUDE.md', 'AGENTS.md', 'docs', '.claude']) if (exists(dir, f)) d.existing.push(f);

  const pkg = exists(dir, 'package.json') ? readJson(path.join(dir, 'package.json')) : null;
  if (pkg) {
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const has = (n) => Object.prototype.hasOwnProperty.call(deps, n);
    d.language = exists(dir, 'tsconfig.json') || has('typescript') ? 'TypeScript' : 'JavaScript';
    d.runtime = exists(dir, 'bun.lock') || exists(dir, 'bun.lockb') ? 'Bun' : 'Node.js';
    d.packageManager = exists(dir, 'pnpm-lock.yaml') ? 'pnpm' : exists(dir, 'yarn.lock') ? 'yarn'
      : exists(dir, 'bun.lock') || exists(dir, 'bun.lockb') ? 'bun' : 'npm';
    const fw = { next: 'Next.js', nuxt: 'Nuxt', astro: 'Astro', '@sveltejs/kit': 'SvelteKit', react: 'React', vue: 'Vue',
      svelte: 'Svelte', '@angular/core': 'Angular', express: 'Express', fastify: 'Fastify', '@nestjs/core': 'NestJS', hono: 'Hono' };
    for (const [k, v] of Object.entries(fw)) if (has(k)) d.frameworks.push(v);
    d.ui.framework = d.frameworks.find((f) => ['Next.js', 'Nuxt', 'Astro', 'SvelteKit', 'React', 'Vue', 'Svelte', 'Angular'].includes(f)) ?? null;
    d.ui.styling = has('tailwindcss') ? 'Tailwind CSS' : has('styled-components') ? 'styled-components' : has('sass') ? 'Sass' : null;
    d.ui.components = exists(dir, 'components.json') ? 'shadcn/ui' : has('@mui/material') ? 'MUI' : has('@chakra-ui/react') ? 'Chakra UI'
      : has('antd') ? 'Ant Design' : Object.keys(deps).some((k) => k.startsWith('@radix-ui/')) ? 'Radix UI' : null;
    d.database = has('prisma') || has('@prisma/client') ? 'Prisma' : has('drizzle-orm') ? 'Drizzle' : has('@supabase/supabase-js') ? 'Supabase'
      : has('mongoose') ? 'MongoDB (Mongoose)' : has('pg') ? 'PostgreSQL (pg)' : null;
    const run = (s) => (d.packageManager === 'npm' ? `npm run ${s}` : `${d.packageManager} run ${s}`);
    const scripts = pkg.scripts ?? {};
    if (scripts.test && !/no test specified/.test(scripts.test)) d.commands.test = d.packageManager === 'npm' ? 'npm test' : `${d.packageManager} test`;
    if (scripts.lint) d.commands.lint = run('lint');
    if (scripts.typecheck) d.commands.typecheck = run('typecheck');
    else if (scripts['type-check']) d.commands.typecheck = run('type-check');
    if (scripts.build) d.commands.build = run('build');
  } else if (exists(dir, 'pyproject.toml') || exists(dir, 'requirements.txt')) {
    d.language = 'Python';
    const text = ['pyproject.toml', 'requirements.txt', 'requirements-dev.txt']
      .filter((f) => exists(dir, f)).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
    d.packageManager = exists(dir, 'uv.lock') ? 'uv' : exists(dir, 'poetry.lock') ? 'poetry' : 'pip';
    for (const [k, v] of Object.entries({ django: 'Django', fastapi: 'FastAPI', flask: 'Flask' })) if (new RegExp(`\\b${k}\\b`, 'i').test(text)) d.frameworks.push(v);
    if (/\bpytest\b/i.test(text)) d.commands.test = 'pytest';
    if (/\bruff\b/i.test(text)) d.commands.lint = 'ruff check .';
    if (/\bmypy\b/i.test(text)) d.commands.typecheck = 'mypy .';
  } else if (exists(dir, 'go.mod')) {
    Object.assign(d, { language: 'Go', packageManager: 'go modules' });
    d.commands = { test: 'go test ./...', lint: 'go vet ./...', typecheck: null, build: 'go build ./...' };
  } else if (exists(dir, 'Cargo.toml')) {
    Object.assign(d, { language: 'Rust', packageManager: 'cargo' });
    d.commands = { test: 'cargo test', lint: 'cargo clippy', typecheck: null, build: 'cargo build' };
  } else if (exists(dir, 'pom.xml')) {
    Object.assign(d, { language: 'Java', packageManager: 'Maven' });
    d.commands = { test: 'mvn test', lint: null, typecheck: null, build: 'mvn package' };
  } else if (exists(dir, 'build.gradle') || exists(dir, 'build.gradle.kts')) {
    Object.assign(d, { language: 'Java/Kotlin', packageManager: 'Gradle' });
    d.commands = { test: 'gradle test', lint: null, typecheck: null, build: 'gradle build' };
  }
  if (!d.database && exists(dir, 'supabase')) d.database = 'Supabase';
  if (!d.database && exists(dir, 'prisma/schema.prisma')) d.database = 'Prisma';

  // Names only, and only from example files. Real .env files are never opened.
  for (const f of ['.env.example', '.env.sample', '.env.template'])
    if (exists(dir, f))
      for (const line of fs.readFileSync(path.join(dir, f), 'utf8').split(/\r?\n/)) {
        const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/.exec(line);
        if (m && !d.envVars.includes(m[1])) d.envVars.push(m[1]);
      }
  return d;
}

function fill(text, vars) {
  return text.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
}

function detectedMarkdown(d) {
  const rows = [
    ['Language', d.language], ['Runtime', d.runtime], ['Frameworks', d.frameworks.join(', ')], ['Package manager', d.packageManager],
    ['Database', d.database], ['UI framework', d.ui.framework], ['UI components', d.ui.components], ['Styling', d.ui.styling],
    ['Test command', d.commands.test], ['Lint command', d.commands.lint], ['Type check', d.commands.typecheck], ['Build command', d.commands.build],
    ['CI workflows', d.ci ? 'yes' : 'no'], ['Existing', d.existing.join(', ')],
  ];
  return ['| Item | Detected |', '|---|---|', ...rows.map(([k, v]) => `| ${k} | ${v || 'not detected'} |`)].join('\n');
}

export function init({ target, dryRun = false, components = Object.keys(COMPONENTS), claudeMd = false, force = [], name }) {
  const dir = path.resolve(target);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) throw new Error(`target is not a directory: ${dir}`);
  const unknown = components.filter((c) => !(c in COMPONENTS));
  if (unknown.length) throw new Error(`unknown component(s): ${unknown.join(', ')}. Valid: ${Object.keys(COMPONENTS).join(', ')}`);

  const d = detect(dir);
  const projectName = name ?? readJson(path.join(dir, 'package.json'))?.name ?? path.basename(dir);
  const vars = {
    PROJECT_NAME: projectName,
    DATE: new Date().toISOString().slice(0, 10),
    DETECTED: detectedMarkdown(d),
    ENV_VARS: d.envVars.length ? d.envVars.map((v) => `- \`${v}\``).join('\n') : '_None found in example env files._',
  };
  const result = { target: dir, dryRun, detected: d, created: [], skipped: [], appended: [] };
  const forced = force.map((f) => f.replace(/\\/g, '/'));
  const write = (rel, content) => {
    const file = path.join(dir, rel);
    if (fs.existsSync(file) && !forced.includes(rel)) { result.skipped.push(rel); return; }
    result.created.push(rel);
    if (dryRun) return;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  };

  const config = JSON.parse(fill(fs.readFileSync(path.join(TEMPLATES, 'project/project.json'), 'utf8'), { PROJECT_NAME: JSON.stringify(projectName).slice(1, -1) }));
  Object.assign(config.stack, { language: d.language, runtime: d.runtime, frameworks: d.frameworks, packageManager: d.packageManager, database: d.database, ui: d.ui });
  for (const g of ['test', 'lint', 'typecheck', 'build']) {
    config.gates[g].command = d.commands[g];
    if (g !== 'test') config.gates[g].required = Boolean(d.commands[g]);
  }
  config.envVars = d.envVars;
  config.orchestra = readJson(path.join(ROOT, '.claude-plugin', 'plugin.json'))?.version ?? config.orchestra;
  write('.orchestra/project.json', JSON.stringify(config, null, 2) + '\n');
  write('.orchestra/.gitignore', 'board.html\n');

  for (const c of components)
    for (const [tpl, rel] of COMPONENTS[c]) write(rel, fill(fs.readFileSync(path.join(TEMPLATES, tpl), 'utf8'), vars));
  if (components.includes('development'))
    write('docs/development/tasks/README.md',
      '# Tasks\n\nOne file per task (`T-NNN-slug.md`), created by `/orchestra:sprint-planning`.\nStatus values: not-started, in-progress, blocked, implemented-unverified, in-review, verified, accepted.\nView them with `/orchestra:board`.\n');

  if (claudeMd) {
    const file = path.join(dir, 'CLAUDE.md');
    const block = fs.readFileSync(path.join(TEMPLATES, 'project/CLAUDE.block.md'), 'utf8');
    const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    if (current.includes('<!-- orchestra:start -->')) result.skipped.push('CLAUDE.md (orchestra block already present)');
    else {
      result.appended.push('CLAUDE.md');
      if (!dryRun) fs.writeFileSync(file, current ? current.replace(/\s*$/, '\n\n') + block : block);
    }
  }
  return result;
}

function main(argv) {
  const all = (name) => argv.flatMap((a, i) => (a === name && argv[i + 1] ? [argv[i + 1]] : []));
  const one = (name) => all(name)[0];
  if (argv.includes('--help') || !one('--target')) {
    console.log('Usage: init-project.mjs --target <dir> [--dry-run] [--components a,b] [--claude-md] [--force <rel-path>]... [--name <name>] [--json]\nComponents: ' + Object.keys(COMPONENTS).join(', '));
    return argv.includes('--help') ? 0 : 2;
  }
  let r;
  try {
    r = init({
      target: one('--target'), dryRun: argv.includes('--dry-run'), claudeMd: argv.includes('--claude-md'),
      components: one('--components')?.split(',').map((s) => s.trim()).filter(Boolean), force: all('--force'), name: one('--name'),
    });
  } catch (e) { console.error(`init: ${e.message}`); return 2; }
  if (argv.includes('--json')) { console.log(JSON.stringify(r, null, 2)); return 0; }
  const d = r.detected;
  console.log(`${r.dryRun ? 'DRY RUN — nothing written. ' : ''}Target: ${r.target}`);
  console.log(`Detected: ${d.language ?? 'no known stack'}${d.frameworks.length ? ' / ' + d.frameworks.join(', ') : ''}${d.packageManager ? ' / ' + d.packageManager : ''}`);
  console.log(`Commands: test=${d.commands.test ?? '-'} lint=${d.commands.lint ?? '-'} typecheck=${d.commands.typecheck ?? '-'} build=${d.commands.build ?? '-'}`);
  console.log(`Env var names: ${d.envVars.length ? d.envVars.join(', ') : 'none found'}`);
  for (const f of r.created) console.log(`  ${r.dryRun ? 'would create' : 'created'}  ${f}`);
  for (const f of r.appended) console.log(`  ${r.dryRun ? 'would append' : 'appended'}  ${f}`);
  for (const f of r.skipped) console.log(`  skipped (exists)  ${f}`);
  if (!r.dryRun) console.log('Next: confirm gate commands in .orchestra/project.json, then run the doctor.');
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main(process.argv.slice(2)));
