import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import nodemailer from 'nodemailer';
import type { Enquiry } from './validate';

export interface SmtpConfig {
  transport: 'smtp';
  host: string;
  port: number;
  secure: boolean;
  requireTLS: boolean;
  user?: string;
  pass?: string;
  to: string;
  from: string;
}
export interface CaptureConfig {
  transport: 'capture';
  dir: string;
  to: string;
  from: string;
}
export type MailConfig = SmtpConfig | CaptureConfig;
export type MailConfigResult = { ok: true; config: MailConfig } | { ok: false; reason: string };

export interface EnquiryMeta {
  reference: string;
  receivedAt: Date;
  serviceLabel: string;
  siteHost: string;
}

/**
 * Reads delivery settings from the environment at request time. Nothing is sent unless every required
 * value is present; secrets never appear in responses or logs.
 */
export function readMailConfig(env: NodeJS.ProcessEnv = process.env, isDev = false): MailConfigResult {
  const to = env.CONTACT_TO?.trim();
  const from = env.CONTACT_FROM?.trim();
  if (env.CONTACT_TRANSPORT === 'capture') {
    if (!isDev && env.CONTACT_ALLOW_CAPTURE !== 'true')
      return {
        ok: false,
        reason: 'capture transport refused outside development (set CONTACT_ALLOW_CAPTURE=true)',
      };
    return {
      ok: true,
      config: {
        transport: 'capture',
        dir: path.resolve(env.CONTACT_CAPTURE_DIR ?? '.data/outbox'),
        to: to || 'enquiries@localhost',
        from: from || 'website@localhost',
      },
    };
  }
  const missing = ['SMTP_HOST', 'CONTACT_TO', 'CONTACT_FROM'].filter((key) => !env[key]?.trim());
  if (missing.length) return { ok: false, reason: `missing ${missing.join(', ')}` };
  const port = Number(env.SMTP_PORT ?? 587);
  const secure = env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465;
  return {
    ok: true,
    config: {
      transport: 'smtp',
      host: env.SMTP_HOST!.trim(),
      port,
      secure,
      requireTLS: !secure && env.SMTP_REQUIRE_TLS !== 'false',
      ...(env.SMTP_USER ? { user: env.SMTP_USER } : {}),
      ...(env.SMTP_PASS ? { pass: env.SMTP_PASS } : {}),
      to: to!,
      from: from!,
    },
  };
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

export function composeEnquiryEmail(enquiry: Enquiry, meta: EnquiryMeta, config: MailConfig) {
  const rows: [string, string][] = [
    ['Reference', meta.reference],
    ['Received', `${meta.receivedAt.toISOString().replace('T', ' ').slice(0, 16)} UTC`],
    ['Name', enquiry.fullName],
    ['Email', enquiry.email],
    ['Organisation', enquiry.organisation || '—'],
    ['Service of interest', meta.serviceLabel],
    ['Project location', enquiry.location || '—'],
  ];
  const text = [
    `New enquiry received via the ${meta.siteHost} website.`,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Message:',
    enquiry.message,
    '',
    'Reply directly to this email to respond to the sender.',
  ].join('\n');
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#231f20">
<p>New enquiry received via the ${escapeHtml(meta.siteHost)} website.</p>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><th align="left" style="border-bottom:1px solid #e5e3de">${escapeHtml(k)}</th><td style="border-bottom:1px solid #e5e3de">${escapeHtml(v)}</td></tr>`,
    )
    .join('')}</table>
<h3>Message</h3><p style="white-space:pre-wrap">${escapeHtml(enquiry.message)}</p>
<p style="color:#6f7072">Reply directly to this email to respond to the sender.</p></body></html>`;
  const subject = `Website enquiry ${meta.reference}: ${meta.serviceLabel} — ${enquiry.fullName}`.slice(
    0,
    200,
  );
  return {
    from: { name: 'Black Crystal website', address: config.from },
    to: config.to,
    replyTo: { name: enquiry.fullName, address: enquiry.email },
    subject,
    text,
    html,
    headers: { 'X-Black-Crystal-Reference': meta.reference },
  };
}

export async function deliverEnquiry(enquiry: Enquiry, meta: EnquiryMeta, config: MailConfig): Promise<void> {
  const message = composeEnquiryEmail(enquiry, meta, config);
  if (config.transport === 'capture') {
    await mkdir(config.dir, { recursive: true });
    const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'unix' });
    const info = await transport.sendMail(message);
    await writeFile(path.join(config.dir, `${meta.reference}.eml`), info.message as Buffer);
    return;
  }
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    ...(config.user ? { auth: { user: config.user, pass: config.pass ?? '' } } : {}),
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  await transport.sendMail(message);
}
