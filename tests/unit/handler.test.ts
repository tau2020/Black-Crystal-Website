import { describe, expect, it, vi } from 'vitest';
import { handleContact, makeReference, type ContactDeps } from '../../src/lib/contact/handler';
import { RateLimiter } from '../../src/lib/contact/rate-limit';
import { composeEnquiryEmail, readMailConfig } from '../../src/lib/contact/mailer';

const silent = { info: () => {}, warn: () => {}, error: () => {} };
const body = {
  fullName: 'Tendai Moyo',
  email: 'tendai@example.co.zw',
  organisation: '',
  service: 'gis-mapping',
  location: '',
  message: 'Please quote for GIS constraints mapping for a solar site.',
  website: '',
  elapsedMs: 8000,
};

function deps(overrides: Partial<ContactDeps> = {}): ContactDeps {
  return {
    services: new Map([['gis-mapping', 'GIS Mapping']]),
    limiter: new RateLimiter(5, 600_000),
    readConfig: () => ({
      ok: true,
      config: { transport: 'capture', dir: '/tmp/never', to: 'to@x', from: 'from@x' },
    }),
    deliver: vi.fn(async () => {}),
    trustProxy: false,
    log: silent,
    now: () => new Date('2026-10-29T08:00:00Z'),
    ...overrides,
  };
}

const post = (data: unknown, headers: Record<string, string> = {}) =>
  new Request('http://localhost:4321/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      host: 'localhost:4321',
      ...headers,
    },
    body: typeof data === 'string' ? data : JSON.stringify(data),
  });

describe('handleContact', () => {
  it('reports success only after delivery resolves', async () => {
    const d = deps();
    const res = await handleContact(post(body), '1.1.1.1', d);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.reference).toMatch(/^BC-20261029-[0-9A-F]{6}$/);
    expect(d.deliver).toHaveBeenCalledOnce();
  });

  it('returns 503 and never claims success when delivery is not configured', async () => {
    const d = deps({ readConfig: () => ({ ok: false, reason: 'missing SMTP_HOST' }) });
    const res = await handleContact(post(body), '1.1.1.1', d);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, code: 'not_configured' });
    expect(d.deliver).not.toHaveBeenCalled();
  });

  it('returns 502 when the mail server rejects the message', async () => {
    const d = deps({ deliver: vi.fn(async () => Promise.reject(new Error('550 relay denied'))) });
    const res = await handleContact(post(body), '1.1.1.1', d);
    expect(res.status).toBe(502);
    expect((await res.json()).code).toBe('delivery_failed');
  });

  it('validates input on the server', async () => {
    const res = await handleContact(post({ ...body, email: 'bad', service: 'nope' }), '1.1.1.1', deps());
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(Object.keys(json.errors).sort()).toEqual(['email', 'service']);
  });

  it('rejects honeypot submissions and implausibly fast submissions', async () => {
    expect((await handleContact(post({ ...body, website: 'http://spam' }), 'x', deps())).status).toBe(400);
    expect((await handleContact(post({ ...body, elapsedMs: 300 }), 'x', deps())).status).toBe(400);
  });

  it('rejects cross-origin, oversized, malformed and unsupported requests', async () => {
    expect((await handleContact(post(body, { origin: 'https://evil.example' }), 'x', deps())).status).toBe(
      403,
    );
    expect(
      (await handleContact(post(body, { 'content-length': String(64 * 1024) }), 'x', deps())).status,
    ).toBe(413);
    expect((await handleContact(post('{bad'), 'x', deps())).status).toBe(400);
    expect((await handleContact(post('[]'), 'x', deps())).status).toBe(400);
    expect((await handleContact(post('hi', { 'content-type': 'text/plain' }), 'x', deps())).status).toBe(415);
  });

  it('rate-limits per client address', async () => {
    const d = deps({ limiter: new RateLimiter(1, 600_000) });
    expect((await handleContact(post(body), '9.9.9.9', d)).status).toBe(200);
    const res = await handleContact(post(body), '9.9.9.9', d);
    expect(res.status).toBe(429);
    expect(res.headers.get('retry-after')).toBe('600');
  });

  it('redirects plain HTML form posts to outcome pages', async () => {
    const form = (data: Record<string, string>) =>
      new Request('http://localhost:4321/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded', host: 'localhost:4321' },
        body: new URLSearchParams(data).toString(),
      });
    const { elapsedMs: _e, ...fields } = body;
    const ok = await handleContact(form(fields), 'x', deps());
    expect(ok.status).toBe(303);
    expect(ok.headers.get('location')).toMatch(/^\/contact\/thank-you\/\?ref=BC-/);
    const bad = await handleContact(form({ ...fields, email: 'bad' }), 'x', deps());
    expect(bad.headers.get('location')).toBe('/contact/not-sent/?reason=invalid');
  });
});

describe('mail configuration', () => {
  it('requires host, recipient and sender for SMTP', () => {
    expect(readMailConfig({}, false)).toEqual({
      ok: false,
      reason: 'missing SMTP_HOST, CONTACT_TO, CONTACT_FROM',
    });
    const cfg = readMailConfig(
      { SMTP_HOST: 'smtp.example', CONTACT_TO: 'a@x', CONTACT_FROM: 'b@x', SMTP_PORT: '465' },
      false,
    );
    expect(cfg.ok && cfg.config.transport === 'smtp' && cfg.config.secure).toBe(true);
  });

  it('refuses capture mode in production unless explicitly allowed', () => {
    expect(readMailConfig({ CONTACT_TRANSPORT: 'capture' }, false).ok).toBe(false);
    expect(readMailConfig({ CONTACT_TRANSPORT: 'capture', CONTACT_ALLOW_CAPTURE: 'true' }, false).ok).toBe(
      true,
    );
    expect(readMailConfig({ CONTACT_TRANSPORT: 'capture' }, true).ok).toBe(true);
  });

  it('escapes HTML in the notification email and keeps the subject on one line', () => {
    const mail = composeEnquiryEmail(
      { ...body, fullName: 'Eve <script>', message: '<img src=x onerror=alert(1)>' },
      {
        reference: 'BC-20261029-ABCDEF',
        receivedAt: new Date('2026-10-29T08:00:00Z'),
        serviceLabel: 'GIS Mapping',
        siteHost: 'localhost',
      },
      { transport: 'capture', dir: '/tmp', to: 'to@x', from: 'from@x' },
    );
    expect(mail.html).not.toContain('<script>');
    expect(mail.html).toContain('&lt;img src=x');
    expect(mail.subject).not.toMatch(/[\r\n]/);
    expect(mail.replyTo.address).toBe('tendai@example.co.zw');
  });

  it('formats references from the received date', () => {
    expect(makeReference(new Date('2026-01-02T00:00:00Z'), () => 0)).toBe('BC-20260102-000000');
  });
});
