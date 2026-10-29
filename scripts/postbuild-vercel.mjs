// Vercel counterpart of postbuild.mjs. The adapter writes Astro's routes to .vercel/output/config.json;
// this prepends the shared security and cache headers, and the legacy WordPress redirects. The adapter's own
// redirect routes only match paths without a trailing slash, and every WordPress URL has one.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { legacyRedirects } from '../src/data/redirects.mjs';
import { cacheRules, securityHeaders } from './security-headers.mjs';

const configPath = path.resolve('.vercel/output/config.json');
const config = JSON.parse(await readFile(configPath, 'utf8'));

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Vercel serves previews until the owner launches there: keep them out of search results unless
// BC_ALLOW_INDEXING=true (set it only for the production build on the final domain).
const indexing = process.env.BC_ALLOW_INDEXING === 'true';

const headerRoutes = [
  {
    src: '^/(.*)$',
    headers: indexing ? securityHeaders : { ...securityHeaders, 'X-Robots-Tag': 'noindex' },
    continue: true,
  },
  ...cacheRules.map((r) => ({
    src: `^${escapeRegex(r.prefix)}(.*)$`,
    headers: { 'Cache-Control': r.value },
    continue: true,
  })),
];

const redirectRoutes = legacyRedirects.map(({ from, to, hostOnly }) => {
  const source = from.replace(/\/$/, '');
  // WordPress emitted some slugs with a trailing zero-width space (%E2%80%8B); match with or without it.
  const src = hostOnly
    ? `^${escapeRegex(source.replace(/%E2%80%8B$/i, ''))}[^/]*/?$`
    : `^${escapeRegex(source)}/?$`;
  return { src, status: 301, headers: { Location: to } };
});

config.routes = [...headerRoutes, ...redirectRoutes, ...(config.routes ?? [])];
await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
console.log(
  `postbuild-vercel: added ${headerRoutes.length} header routes and ${redirectRoutes.length} redirects to .vercel/output/config.json (search indexing ${indexing ? 'allowed' : 'blocked'})`,
);
