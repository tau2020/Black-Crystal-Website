// Progressive enhancement for the enquiry form. The form works without JavaScript (native POST + redirect);
// with JavaScript it validates inline, submits with fetch and shows the server's genuine outcome.
import { FIELDS, LIMITS, validateEnquiry, type Field, type FieldErrors } from '../lib/contact/validate';

type Outcome =
  | { ok: true; reference: string }
  | { ok: false; code: string; errors?: FieldErrors; retryAfterSeconds?: number };

const REQUEST_TIMEOUT_MS = 20_000;

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  if (!form || !success) return;

  const alert = form.querySelector<HTMLElement>('[data-form-alert]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const counter = form.querySelector<HTMLElement>('[data-char-count]');
  const message = form.elements.namedItem('message') as HTMLTextAreaElement;
  const email = form.dataset.email ?? '';
  const phone = form.dataset.phone ?? '';
  const startedAt = performance.now();
  const touched = new Set<Field>();
  const allowed = new Set(
    [...(form.elements.namedItem('service') as HTMLSelectElement).options]
      .map((o) => o.value)
      .filter(Boolean),
  );

  // Preselect a service when arriving from a service page (?service=<id>).
  const requested = new URLSearchParams(location.search).get('service');
  const serviceSelect = form.elements.namedItem('service') as HTMLSelectElement;
  if (requested && allowed.has(requested)) serviceSelect.value = requested;

  const control = (field: Field) =>
    form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  const raw = () => Object.fromEntries(new FormData(form).entries());

  function showFieldErrors(errors: FieldErrors, only?: Field[]): void {
    for (const field of only ?? FIELDS) {
      const input = control(field);
      const holder = form!.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
      const text = errors[field];
      input.setAttribute('aria-invalid', String(!!text));
      if (holder) {
        holder.textContent = text ?? '';
        holder.hidden = !text;
      }
    }
  }

  function showAlert(tone: 'error' | 'warning', html: string): void {
    alert.dataset.tone = tone;
    alert.innerHTML = html;
    alert.hidden = false;
    alert.focus();
  }

  const contactFallback = () =>
    `Please email <a href="mailto:${email}">${email}</a> or call ${phone} and we will be glad to help.`;

  function summarise(errors: FieldErrors): void {
    const items = (Object.entries(errors) as [Field, string][])
      .map(([field, text]) => `<li><a href="#${field}">${escapeHtml(text)}</a></li>`)
      .join('');
    showAlert('error', `<strong>Please check the highlighted fields.</strong><ul>${items}</ul>`);
  }

  function setBusy(busy: boolean): void {
    submit.disabled = busy;
    submit.setAttribute('aria-busy', String(busy));
    submitLabel.textContent = busy ? 'Sending…' : 'Send enquiry';
  }

  function updateCounter(): void {
    if (!counter) return;
    const remaining = LIMITS.message.max - message.value.length;
    counter.textContent = remaining < 500 ? `${remaining} characters remaining.` : '';
  }

  for (const field of FIELDS) {
    const input = control(field);
    input.addEventListener('blur', () => {
      if (!input.value && !touched.has(field)) return;
      touched.add(field);
      showFieldErrors(validateEnquiry(raw(), allowed).errors, [field]);
    });
    input.addEventListener('input', () => {
      if (touched.has(field)) showFieldErrors(validateEnquiry(raw(), allowed).errors, [field]);
    });
  }
  message.addEventListener('input', updateCounter);
  alert.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    event.preventDefault();
    control(link.hash.slice(1) as Field)?.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    alert.hidden = true;
    const values = raw();
    const result = validateEnquiry(values, allowed);
    FIELDS.forEach((f) => touched.add(f));
    showFieldErrors(result.errors);
    if (!result.ok) {
      summarise(result.errors);
      return;
    }

    setBusy(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let outcome: Outcome;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          ...result.data,
          website: values.website ?? '',
          elapsedMs: Math.round(performance.now() - startedAt),
        }),
        signal: controller.signal,
        credentials: 'same-origin',
      });
      outcome = (await response
        .json()
        .catch(() => ({ ok: false, code: `http_${response.status}` }))) as Outcome;
      if (!response.ok && outcome.ok) outcome = { ok: false, code: `http_${response.status}` };
    } catch {
      outcome = { ok: false, code: controller.signal.aborted ? 'timeout' : 'network' };
    } finally {
      window.clearTimeout(timer);
      setBusy(false);
    }

    if (outcome.ok) {
      form.reset();
      updateCounter();
      form.hidden = true;
      success.querySelector('[data-success-ref]')!.textContent = ` (reference ${outcome.reference})`;
      success.hidden = false;
      success.focus();
      return;
    }

    switch (outcome.code) {
      case 'invalid':
        showFieldErrors(outcome.errors ?? {});
        summarise(outcome.errors ?? {});
        break;
      case 'rate_limited': {
        const minutes = Math.max(1, Math.ceil((outcome.retryAfterSeconds ?? 600) / 60));
        showAlert(
          'warning',
          `<strong>Too many enquiries from this connection.</strong> Please try again in about ${minutes} minute${minutes === 1 ? '' : 's'}. ${contactFallback()}`,
        );
        break;
      }
      case 'not_configured':
        showAlert(
          'warning',
          `<strong>Your enquiry has not been sent.</strong> Online enquiries are not yet connected on this site, so we cannot receive your message here. Your text is still in the form. ${contactFallback()}`,
        );
        break;
      case 'too_fast':
        showAlert(
          'warning',
          '<strong>Your enquiry has not been sent.</strong> That was very quick — please review your details and submit again.',
        );
        break;
      case 'timeout':
      case 'network':
        showAlert(
          'error',
          `<strong>Your enquiry has not been sent.</strong> We could not reach the server. Please check your connection and try again. ${contactFallback()}`,
        );
        break;
      default:
        showAlert(
          'error',
          `<strong>Your enquiry has not been sent.</strong> Something went wrong on our side. Your text is still in the form. ${contactFallback()}`,
        );
    }
  });

  success.querySelector('[data-form-again]')?.addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    control('fullName').focus();
  });
}
