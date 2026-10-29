import { validateEnquiry, type Enquiry, type FieldErrors } from './validate';
import type { RateLimiter } from './rate-limit';
import type { EnquiryMeta, MailConfig, MailConfigResult } from './mailer';

export interface ContactDeps {
  services: ReadonlyMap<string, string>; // allowed value → label
  limiter: RateLimiter;
  readConfig: () => MailConfigResult;
  deliver: (enquiry: Enquiry, meta: EnquiryMeta, config: MailConfig) => Promise<void>;
  trustProxy: boolean;
  minFillMs?: number;
  log?: Pick<Console, 'info' | 'warn' | 'error'>;
  now?: () => Date;
}

export type ContactErrorCode =
  | 'bad_request'
  | 'forbidden_origin'
  | 'payload_too_large'
  | 'unsupported_media_type'
  | 'rate_limited'
  | 'rejected'
  | 'too_fast'
  | 'invalid'
  | 'not_configured'
  | 'delivery_failed';

const MAX_BODY_BYTES = 32 * 1024;

const json = (status: number, body: Record<string, unknown>, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
  });

export function makeReference(date: Date, random: () => number = Math.random): string {
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = Math.floor(random() * 0xffffff)
    .toString(16)
    .toUpperCase()
    .padStart(6, '0');
  return `BC-${stamp}-${suffix}`;
}

function clientIp(request: Request, clientAddress: string | undefined, trustProxy: boolean): string {
  if (trustProxy) {
    const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    if (forwarded) return forwarded;
  }
  return clientAddress || 'unknown';
}

/**
 * Handles a contact-form POST. Responds with JSON for fetch() callers and with a 303 redirect for
 * plain HTML form posts (no JavaScript). Success is only reported after delivery has been accepted.
 */
export async function handleContact(
  request: Request,
  clientAddress: string | undefined,
  deps: ContactDeps,
): Promise<Response> {
  const log = deps.log ?? console;
  const accept = request.headers.get('accept') ?? '';
  const contentType = (request.headers.get('content-type') ?? '').toLowerCase();
  const wantsJson = accept.includes('application/json') || contentType.includes('application/json');
  const url = new URL(request.url);

  const fail = (
    status: number,
    code: ContactErrorCode,
    extra: Record<string, unknown> = {},
    headers: Record<string, string> = {},
  ) =>
    wantsJson
      ? json(status, { ok: false, code, ...extra }, headers)
      : new Response(null, {
          status: 303,
          headers: { location: `/contact/not-sent/?reason=${code}`, 'cache-control': 'no-store' },
        });

  // Same-origin only (Astro's checkOrigin covers form encodings; this also covers JSON).
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== (request.headers.get('host') ?? url.host))
    return fail(403, 'forbidden_origin');

  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return fail(413, 'payload_too_large');

  let raw: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > MAX_BODY_BYTES) return fail(413, 'payload_too_large');
    if (contentType.includes('application/json')) {
      const parsed: unknown = JSON.parse(body);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return fail(400, 'bad_request');
      raw = parsed as Record<string, unknown>;
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      raw = Object.fromEntries(new URLSearchParams(body));
    } else {
      return fail(415, 'unsupported_media_type');
    }
  } catch {
    return fail(400, 'bad_request');
  }

  const limit = deps.limiter.hit(clientIp(request, clientAddress, deps.trustProxy));
  if (!limit.allowed) {
    log.warn(`[contact] rate limited (retry in ${limit.retryAfterSeconds}s)`);
    return fail(
      429,
      'rate_limited',
      { retryAfterSeconds: limit.retryAfterSeconds },
      { 'retry-after': String(limit.retryAfterSeconds) },
    );
  }

  // Honeypot: a hidden field real visitors never see or fill.
  if (String(raw.website ?? '').trim() !== '') {
    log.warn('[contact] rejected: honeypot field completed');
    return fail(400, 'rejected');
  }
  const elapsed = Number(raw.elapsedMs);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < (deps.minFillMs ?? 2500)) {
    log.warn('[contact] rejected: submitted too quickly');
    return fail(400, 'too_fast');
  }

  const result = validateEnquiry(raw, new Set(deps.services.keys()));
  if (!result.ok) return fail(422, 'invalid', { errors: result.errors satisfies FieldErrors });

  const config = deps.readConfig();
  if (!config.ok) {
    log.error(`[contact] delivery not configured: ${config.reason}`);
    return fail(503, 'not_configured');
  }

  const receivedAt = (deps.now ?? (() => new Date()))();
  const reference = makeReference(receivedAt);
  const meta: EnquiryMeta = {
    reference,
    receivedAt,
    serviceLabel: deps.services.get(result.data.service) ?? result.data.service,
    siteHost: url.host,
  };
  try {
    await deps.deliver(result.data, meta, config.config);
  } catch (error) {
    log.error(
      `[contact] delivery failed for ${reference}: ${error instanceof Error ? error.message : 'unknown error'}`,
    );
    return fail(502, 'delivery_failed');
  }

  log.info(`[contact] enquiry ${reference} accepted via ${config.config.transport}`);
  return wantsJson
    ? json(200, { ok: true, reference })
    : new Response(null, {
        status: 303,
        headers: {
          location: `/contact/thank-you/?ref=${encodeURIComponent(reference)}`,
          'cache-control': 'no-store',
        },
      });
}
