#!/usr/bin/env node
// Local review / Node production server. Wraps Astro's standalone handler (static files + /api/contact)
// and applies the same security and cache headers that the generated host configs declare.
//   npm run build:review && npm run start   →   http://127.0.0.1:4321
import http from 'node:http';
import { legacyRedirects } from '../src/data/redirects.mjs';
import { cacheRules, securityHeaders } from '../scripts/security-headers.mjs';

process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler } = await import('../dist/server/entry.mjs');

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 4321);
const hostOnly = legacyRedirects
  .filter((r) => r.hostOnly)
  .map((r) => ({ ...r, stem: decodeURIComponent(r.from).replace(/​\/?$/, '').replace(/\/$/, '') }));

const server = http.createServer((req, res) => {
  for (const [name, value] of Object.entries(securityHeaders)) res.setHeader(name, value);
  const pathname = decodeURIComponent((req.url ?? '/').split('?')[0]);
  const cache = cacheRules.find((r) => pathname.startsWith(r.prefix));
  if (cache) res.setHeader('Cache-Control', cache.value);

  // WordPress slugs ending in a zero-width space cannot be Astro routes; redirect them here.
  const legacy = hostOnly.find((r) => pathname.replace(/​/g, '').replace(/\/$/, '') === r.stem);
  if (legacy) {
    res.writeHead(301, { Location: legacy.to });
    res.end();
    return;
  }
  handler(req, res);
});

server.listen(port, host, () => {
  console.log(`Black Crystal site running at http://${host}:${port}`);
  const smtp = process.env.SMTP_HOST
    ? 'SMTP configured'
    : process.env.CONTACT_TRANSPORT === 'capture'
      ? 'capture mode (.data/outbox)'
      : 'NOT configured (form returns 503)';
  console.log(`Contact delivery: ${smtp}`);
});
