import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from '@playwright/test';

test('client-side validation summarises errors and marks fields', async ({ page }) => {
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  const alert = page.locator('[data-form-alert]');
  await expect(alert).toBeFocused();
  await expect(alert).toContainText('Please check the highlighted fields');
  for (const name of ['fullName', 'email', 'service', 'message']) {
    await expect(page.locator(`#${name}`)).toHaveAttribute('aria-invalid', 'true');
  }
  await alert.getByRole('link', { name: /email address/ }).click();
  await expect(page.locator('#email')).toBeFocused();
});

test('a valid enquiry is accepted by the server and delivered (capture transport)', async ({
  page,
}, testInfo) => {
  await page.goto('/contact/?service=gis-mapping');
  await expect(page.getByLabel(/Service of interest/)).toHaveValue('gis-mapping');
  const unique = `E2E ${testInfo.project.name} ${Date.now()}`;
  await page.getByLabel(/Full name/).fill('Playwright Tester');
  await page.getByLabel(/Email/).fill('qa@example.com');
  await page.getByLabel(/Company or organisation/).fill('QA Org');
  await page.getByLabel(/Project location/).fill('Harare');
  await page
    .getByLabel(/Message/)
    .fill(`${unique}: please advise on GIS constraints mapping for a solar site.`);
  await page.waitForTimeout(2600); // the server rejects implausibly fast submissions
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  const success = page.locator('[data-form-success]');
  await expect(success).toBeVisible();
  await expect(success).toBeFocused();
  const reference = (await success.locator('[data-success-ref]').innerText()).match(
    /BC-\d{8}-[0-9A-F]{6}/,
  )?.[0];
  expect(reference).toBeTruthy();
  const outbox = path.resolve('test-results/outbox');
  const file = (await readdir(outbox)).find((f) => f.startsWith(reference!));
  expect(file).toBeTruthy();
  const eml = await readFile(path.join(outbox, file!), 'utf8');
  expect(eml).toContain(unique);
  expect(eml).toContain('Reply-To: Playwright Tester <qa@example.com>');
});

test('when delivery is not configured the visitor is told the truth and keeps their text', async ({
  page,
}) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false, code: 'not_configured' }),
    }),
  );
  await page.goto('/contact/');
  await page.getByLabel(/Full name/).fill('Playwright Tester');
  await page.getByLabel(/Email/).fill('qa@example.com');
  await page.getByLabel(/Service of interest/).selectOption('other');
  const text = 'This message must still be in the form after a failed send.';
  await page.getByLabel(/Message/).fill(text);
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(page.locator('[data-form-alert]')).toContainText('has not been sent');
  await expect(page.locator('[data-form-alert]')).toContainText('infor@blackcrystal.co.zw');
  await expect(page.getByLabel(/Message/)).toHaveValue(text);
  await expect(page.locator('[data-form-success]')).toBeHidden();
});
