import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { handleContact } from '../../lib/contact/handler';
import { deliverEnquiry, readMailConfig } from '../../lib/contact/mailer';
import { RateLimiter } from '../../lib/contact/rate-limit';

export const prerender = false;

const limiter = new RateLimiter(
  Number(process.env.CONTACT_RATE_LIMIT ?? 5),
  Number(process.env.CONTACT_RATE_WINDOW_MINUTES ?? 10) * 60_000,
);

let servicesCache: Map<string, string> | undefined;
async function services(): Promise<Map<string, string>> {
  if (!servicesCache) {
    const entries = await getCollection('services');
    servicesCache = new Map([
      ...entries.map((s) => [s.id, s.data.title] as const),
      ['other', 'Not sure / other'],
    ]);
  }
  return servicesCache;
}

export const POST: APIRoute = async ({ request, clientAddress }) =>
  handleContact(request, clientAddress, {
    services: await services(),
    limiter,
    readConfig: () => readMailConfig(process.env, import.meta.env.DEV),
    deliver: deliverEnquiry,
    trustProxy: process.env.TRUST_PROXY === 'true',
  });

export const ALL: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, code: 'method_not_allowed' }), {
    status: 405,
    headers: {
      allow: 'POST',
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
