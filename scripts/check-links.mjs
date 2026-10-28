#!/usr/bin/env node
// Verifies every internal link, image/media/script/style reference and #fragment in the built site
// (dist/client). Exits non-zero if anything is broken. Run after `npm run build` or `npm run build:review`.
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { astroRedirects } from '../src/data/redirects.mjs';

const root = path.resolve('dist/client');
const serverRoutes = new Set(['/api/contact']);
const redirects = new Set(Object.keys(astroRedirects).map((k) => k.replace(/\/$/, '')));

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}
const exists = async (p) => !!(await stat(p).catch(() => null));

const files = await walk(root);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const idsByPage = new Map();
const pageFor = (file) =>
  '/' +
  path
    .relative(root, file)
    .replace(/index\.html$/, '')
    .replace(/\.html$/, '/');

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  idsByPage.set(pageFor(file), new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

async function resolveTarget(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  if (serverRoutes.has(clean.replace(/\/$/, ''))) return { ok: true, page: null };
  if (redirects.has(clean.replace(/\/$/, ''))) return { ok: true, page: null };
  const candidates = clean.endsWith('/')
    ? [path.join(root, clean, 'index.html')]
    : [path.join(root, clean), path.join(root, clean, 'index.html'), path.join(root, `${clean}.html`)];
  for (const c of candidates)
    if (await exists(c)) return { ok: true, page: c.endsWith('.html') ? pageFor(c) : null };
  return { ok: false };
}

const problems = [];
let checked = 0;
for (const file of htmlFiles) {
  const page = pageFor(file);
  const html = await readFile(file, 'utf8');
  const refs = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) =>
      m[1].split(',').map((s) => s.trim().split(/\s+/)[0]),
    ),
    ...[...html.matchAll(/data-src-(?:desktop|mobile)="([^"]+)"/g)].map((m) => m[1]),
  ];
  for (const ref of new Set(refs)) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(ref) || ref === '') continue;
    checked++;
    const [pathPart, fragment] = ref.split('#');
    if (!pathPart) {
      if (fragment && !idsByPage.get(page)?.has(fragment))
        problems.push(`${page} → #${fragment} (missing id)`);
      continue;
    }
    const target = await resolveTarget(pathPart);
    if (!target.ok) {
      problems.push(`${page} → ${ref} (not found)`);
      continue;
    }
    if (fragment && target.page && !idsByPage.get(target.page)?.has(fragment))
      problems.push(`${page} → ${ref} (missing id)`);
  }
}

console.log(`Checked ${checked} references across ${htmlFiles.length} pages.`);
if (problems.length) {
  console.error(`${problems.length} broken reference(s):\n  ${[...new Set(problems)].join('\n  ')}`);
  process.exit(1);
}
console.log('No broken internal links, assets or fragments.');
