import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://blackcrystal.co.zw');
  const body = [
    'User-agent: *',
    'Disallow: /api/',
    '',
    `Sitemap: ${new URL('/sitemap-index.xml', origin).href}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
