// Enquiry validation shared by the browser (scripts/contact-form.ts) and the server (lib/contact/handler.ts),
// so both sides always apply identical rules.

export const FIELDS = ['fullName', 'email', 'organisation', 'service', 'location', 'message'] as const;
export type Field = (typeof FIELDS)[number];

export interface Enquiry {
  fullName: string;
  email: string;
  organisation: string;
  service: string;
  location: string;
  message: string;
}

export type FieldErrors = Partial<Record<Field, string>>;

export interface ValidationResult {
  ok: boolean;
  data: Enquiry;
  errors: FieldErrors;
}

export const LIMITS = {
  fullName: { min: 2, max: 120 },
  email: { max: 254 },
  organisation: { max: 160 },
  location: { max: 160 },
  message: { min: 20, max: 5000 },
  links: 3,
} as const;

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:".]+(\.[^\s@<>()[\]\\,;:".]+)+$/;
const URLISH = /(https?:\/\/|www\.)/gi;

const singleLine = (value: unknown): string =>
  String(value ?? '')
    .replace(CONTROL, '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

const multiLine = (value: unknown): string =>
  String(value ?? '')
    .replace(CONTROL, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();

/**
 * @param raw untrusted input (form fields or parsed JSON)
 * @param allowedServices accepted values for the "service of interest" field
 */
export function validateEnquiry(
  raw: Record<string, unknown>,
  allowedServices: ReadonlySet<string>,
): ValidationResult {
  const data: Enquiry = {
    fullName: singleLine(raw.fullName),
    email: singleLine(raw.email).toLowerCase(),
    organisation: singleLine(raw.organisation),
    service: singleLine(raw.service),
    location: singleLine(raw.location),
    message: multiLine(raw.message),
  };
  const errors: FieldErrors = {};

  if (!data.fullName) errors.fullName = 'Please enter your full name.';
  else if (data.fullName.length < LIMITS.fullName.min || !/\p{L}/u.test(data.fullName))
    errors.fullName = 'Please enter your full name.';
  else if (data.fullName.length > LIMITS.fullName.max)
    errors.fullName = `Please keep your name under ${LIMITS.fullName.max} characters.`;

  if (!data.email) errors.email = 'Please enter your email address.';
  else if (data.email.length > LIMITS.email.max || !EMAIL.test(data.email))
    errors.email = 'Please enter a valid email address, for example name@example.com.';

  if (data.organisation.length > LIMITS.organisation.max)
    errors.organisation = `Please keep this under ${LIMITS.organisation.max} characters.`;

  if (!data.service) errors.service = 'Please choose the service you are interested in.';
  else if (!allowedServices.has(data.service)) errors.service = 'Please choose a service from the list.';

  if (data.location.length > LIMITS.location.max)
    errors.location = `Please keep this under ${LIMITS.location.max} characters.`;

  if (!data.message) errors.message = 'Please tell us about your project.';
  else if (data.message.length < LIMITS.message.min)
    errors.message = `Please add a little more detail (at least ${LIMITS.message.min} characters).`;
  else if (data.message.length > LIMITS.message.max)
    errors.message = `Please keep your message under ${LIMITS.message.max} characters.`;
  else if ((data.message.match(URLISH)?.length ?? 0) > LIMITS.links)
    errors.message = `Please include no more than ${LIMITS.links} links.`;

  return { ok: Object.keys(errors).length === 0, data, errors };
}
