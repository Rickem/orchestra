#!/usr/bin/env node
// Read-only task board. Reads task files; writes one HTML file or serves it on localhost.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { STATUSES, loadProject, loadTasks, checkTasks, countByStatus } from './lib/tasks.mjs';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function renderBoard(projectDir, { refresh = 0 } = {}) {
  const config = loadProject(projectDir);
  const tasks = loadTasks(projectDir, config);
  const problems = checkTasks(tasks);
  const counts = countByStatus(tasks);
  const name = config?.name || path.basename(path.resolve(projectDir));
  const card = (t) => `
      <article class="card">
        <header><span class="id">${esc(t.id)}</span><span class="tier">${esc(t.tier || '—')}</span></header>
        <h3>${esc(t.title)}</h3>
        <dl>
          <div><dt>Owner</dt><dd>${esc(t.owner || 'unassigned')}</dd></div>
          ${t.requirement ? `<div><dt>Requirement</dt><dd>${esc(t.requirement)}</dd></div>` : ''}
          ${t.depends_on.length ? `<div><dt>Depends on</dt><dd>${esc(t.depends_on.join(', '))}</dd></div>` : ''}
        </dl>
        ${t.lastVerification ? `<p class="log">${esc(t.lastVerification)}</p>` : '<p class="log none">No verification recorded</p>'}
      </article>`;
  const column = (s) => {
    const list = tasks.filter((t) => t.status === s);
    return `
    <section class="col" data-status="${s}">
      <h2>${s} <span class="n">${list.length}</span></h2>${list.map(card).join('') || '\n      <p class="empty">—</p>'}
    </section>`;
  };
  const unknown = tasks.filter((t) => !STATUSES.includes(t.status));
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${refresh ? `<meta http-equiv="refresh" content="${refresh}">` : ''}
<title>${esc(name)} — task board</title>
<style>
  :root { --bg:#f6f7f9; --panel:#fff; --line:#dfe3e8; --text:#1c2430; --muted:#5d6b7c; --accent:#2f6fde; --warn:#b45309; --err:#b42318; --ok:#177245; }
  @media (prefers-color-scheme: dark) { :root { --bg:#12161c; --panel:#1b222b; --line:#2c3642; --text:#e6ebf1; --muted:#9aa7b6; --accent:#7aa7ff; --warn:#f0b35a; --err:#ff8a7a; --ok:#5fd39a; } }
  * { box-sizing: border-box; }
  body { margin:0; padding:16px; background:var(--bg); color:var(--text); font:14px/1.45 system-ui, "Segoe UI", sans-serif; }
  h1 { font-size:20px; margin:0 0 4px; }
  .meta { color:var(--muted); margin:0 0 12px; }
  .problems { background:var(--panel); border:1px solid var(--line); border-left:4px solid var(--err); border-radius:8px; padding:8px 12px; margin:0 0 12px; }
  .problems li.warn { color:var(--warn); } .problems li.error { color:var(--err); }
  .board { display:grid; grid-auto-flow:column; grid-auto-columns:minmax(230px, 1fr); gap:12px; overflow-x:auto; padding-bottom:8px; }
  .col { background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:10px; min-height:120px; }
  .col h2 { font-size:12px; text-transform:uppercase; letter-spacing:.05em; color:var(--muted); margin:0 0 10px; display:flex; justify-content:space-between; }
  .col[data-status="blocked"] h2 { color:var(--err); }
  .col[data-status="verified"] h2, .col[data-status="accepted"] h2 { color:var(--ok); }
  .col[data-status="implemented-unverified"] h2 { color:var(--warn); }
  .n { font-variant-numeric:tabular-nums; }
  .card { border:1px solid var(--line); border-radius:8px; padding:8px 10px; margin-bottom:8px; background:var(--bg); }
  .card header { display:flex; justify-content:space-between; font-size:12px; color:var(--muted); }
  .card .id { font-weight:600; color:var(--accent); }
  .card h3 { font-size:14px; margin:4px 0 6px; overflow-wrap:anywhere; }
  dl { margin:0; font-size:12px; } dl div { display:flex; gap:6px; } dt { color:var(--muted); min-width:84px; } dd { margin:0; overflow-wrap:anywhere; }
  .log { margin:6px 0 0; font:12px/1.4 ui-monospace, Consolas, monospace; color:var(--muted); overflow-wrap:anywhere; border-top:1px dashed var(--line); padding-top:6px; }
  .log.none { font-style:italic; } .empty { color:var(--muted); text-align:center; }
</style>
</head>
<body>
<h1>${esc(name)} — task board</h1>
<p class="meta">${tasks.length} tasks · generated ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC · read-only${refresh ? ` · refreshes every ${refresh}s` : ''}</p>
${problems.length || unknown.length ? `<ul class="problems">${problems.map((p) => `<li class="${p.level}">${esc(p.level)}: ${esc(p.task)} — ${esc(p.message)}</li>`).join('')}</ul>` : ''}
<main class="board">${STATUSES.map(column).join('')}
</main>
<!-- counts: ${esc(JSON.stringify(counts))} -->
</body>
</html>
`;
}

export function summary(projectDir) {
  const tasks = loadTasks(projectDir);
  const problems = checkTasks(tasks);
  const counts = countByStatus(tasks);
  const lines = [`Tasks: ${tasks.length}`];
  for (const s of STATUSES) {
    const ids = tasks.filter((t) => t.status === s).map((t) => t.id);
    lines.push(`  ${s.padEnd(24)} ${String(counts[s]).padStart(3)}  ${ids.join(' ')}`.trimEnd());
  }
  for (const p of problems) lines.push(`${p.level.toUpperCase()}: ${p.task} — ${p.message}`);
  return { text: lines.join('\n'), errors: problems.filter((p) => p.level === 'error').length };
}

function main(argv) {
  const arg = (name) => { const i = argv.indexOf(name); return i === -1 ? undefined : argv[i + 1]; };
  const projectDir = path.resolve(arg('--project') ?? '.');
  if (!fs.existsSync(projectDir)) { console.error(`board: project directory not found: ${projectDir}`); return 2; }
  if (argv.includes('--check')) {
    const s = summary(projectDir);
    console.log(s.text);
    return s.errors ? 1 : 0;
  }
  if (argv.includes('--serve')) {
    const port = Number(arg('--serve')) || 4173;
    const server = http.createServer((req, res) => {
      try {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
        res.end(renderBoard(projectDir, { refresh: 5 }));
      } catch (e) {
        res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
        res.end(`board error: ${e.message}`);
      }
    });
    server.on('error', (e) => { console.error(`board: cannot listen on port ${port}: ${e.message}`); process.exit(2); });
    server.listen(port, '127.0.0.1', () => console.log(`Board: http://127.0.0.1:${port} (read-only, Ctrl+C to stop)`));
    return null;
  }
  const out = path.resolve(arg('--out') ?? path.join(projectDir, '.orchestra', 'board.html'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, renderBoard(projectDir));
  console.log(`Board written: ${out}`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const code = main(process.argv.slice(2));
  if (code !== null) process.exit(code);
}
