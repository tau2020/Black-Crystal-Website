// Run after `npm run build:vercel`. Replays Vercel's first-match routing over .vercel/output/config.json:
// every legacy URL must redirect (with and without the trailing slash and the zero-width space), no page may
// be shadowed by a redirect, and every page must receive the security headers.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { legacyRedirects } from '../src/data/redirects.mjs';

const output = path.resolve('.vercel/output');
const { routes } = JSON.parse(await readFile(path.join(output, 'config.json'), 'utf8'));
const beforeFilesystem = routes.slice(
  0,
  routes.findIndex((r) => r.handle === 'filesystem'),
);

const resolve = (pathname) => {
  const headers = {};
  for (const route of beforeFilesystem) {
    if (!new RegExp(route.src).test(pathname)) continue;
    Object.assign(headers, route.headers);
    if (!route.continue) return { status: route.status, headers };
  }
  return { status: 200, headers };
};

const failures = [];
for (const { from, to, hostOnly } of legacyRedirects) {
  const base = from.replace(/\/$/, '');
  const stem = base.replace(/%E2%80%8B$/i, '');
  const variants = hostOnly
    ? [base, `${base}/`, `${stem}/`, `${stem}​/`, `${stem}%e2%80%8b/`]
    : [base, `${base}/`];
  for (const pathname of variants) {
    const { status, headers } = resolve(pathname);
    if (status !== 301 || headers.Location !== to)
      failures.push(`${pathname} → ${status} ${headers.Location ?? ''} (expected 301 ${to})`);
  }
}

const pages = [];
const walk = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) await walk(path.join(dir, entry.name));
    else if (entry.name === 'index.html')
      pages.push(`/${path.relative(path.join(output, 'static'), dir)}/`.replace(/\/+/g, '/'));
  }
};
await walk(path.join(output, 'static'));
for (const page of pages) {
  const { status, headers } = resolve(page);
  if (status !== 200) failures.push(`${page} is shadowed by a ${status} route`);
  if (!headers['Content-Security-Policy']) failures.push(`${page} has no security headers`);
}

console.log(`Checked ${legacyRedirects.length} legacy redirects (with variants) and ${pages.length} pages.`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('All redirects resolve, no page is shadowed, and every page gets the security headers.');
