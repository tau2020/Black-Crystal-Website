import { describe, expect, it } from 'vitest';
import { validateEnquiry } from '../../src/lib/contact/validate';

const allowed = new Set(['environmental-social-impact-assessment', 'other']);
const valid = {
  fullName: 'Tendai Moyo',
  email: 'Tendai@Example.co.zw',
  organisation: 'Example Mining',
  service: 'environmental-social-impact-assessment',
  location: 'Chegutu District',
  message: 'We are planning an expansion and need an ESIA scoped this quarter.',
};

describe('validateEnquiry', () => {
  it('accepts a complete enquiry and normalises the email', () => {
    const r = validateEnquiry(valid, allowed);
    expect(r.ok).toBe(true);
    expect(r.data.email).toBe('tendai@example.co.zw');
  });

  it('requires name, email, service and message', () => {
    const r = validateEnquiry({}, allowed);
    expect(r.ok).toBe(false);
    expect(Object.keys(r.errors).sort()).toEqual(['email', 'fullName', 'message', 'service']);
  });

  it('rejects malformed emails', () => {
    for (const email of ['nope', 'a@b', 'a b@example.com', 'a@example', '<a@example.com>']) {
      expect(validateEnquiry({ ...valid, email }, allowed).errors.email).toBeTruthy();
    }
  });

  it('strips line breaks from single-line fields (header injection)', () => {
    const r = validateEnquiry({ ...valid, fullName: 'Tendai\r\nBcc: victim@example.com' }, allowed);
    expect(r.data.fullName).not.toMatch(/[\r\n]/);
  });

  it('rejects services outside the allowed list', () => {
    expect(validateEnquiry({ ...valid, service: 'hacking' }, allowed).errors.service).toBeTruthy();
  });

  it('enforces message length and link limits', () => {
    expect(validateEnquiry({ ...valid, message: 'too short' }, allowed).errors.message).toMatch(
      /more detail/,
    );
    expect(validateEnquiry({ ...valid, message: 'x'.repeat(5001) }, allowed).errors.message).toMatch(/under/);
    const spam = 'Visit http://a.example http://b.example http://c.example http://d.example now please';
    expect(validateEnquiry({ ...valid, message: spam }, allowed).errors.message).toMatch(/links/);
  });

  it('keeps paragraph breaks in the message but removes control characters', () => {
    const r = validateEnquiry(
      { ...valid, message: 'First paragraph of detail.\r\n\r\nSecond\u0007 paragraph.' },
      allowed,
    );
    expect(r.data.message).toBe('First paragraph of detail.\n\nSecond paragraph.');
  });
});
