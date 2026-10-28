import { expect, test } from '@playwright/test';
import { keyPages } from './pages';

const widths = [360, 390, 768, 1024, 1440, 1920];

for (const width of widths) {
  test(`no horizontal overflow at ${width}px`, async ({ browser, isMobile }) => {
    test.skip(!!isMobile, 'covered by explicit widths');
    test.setTimeout(120_000);
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const url of keyPages) {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${url} @ ${width}px`).toBeLessThanOrEqual(0);
    }
    await context.close();
  });
}

// WebKit checks the user-agent stylesheet of native <select> elements against the page CSP and logs this
// message even on a minimal page with only a <select>; it has no effect (see QA_REPORT.md).
const WEBKIT_SELECT_QUIRK = /^Refused to apply a stylesheet because its hash, its nonce, or 'unsafe-inline'/;

test('pages load without console errors or CSP violations', async ({ page, browserName }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    if (browserName === 'webkit' && WEBKIT_SELECT_QUIRK.test(m.text())) return;
    errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  for (const url of keyPages) {
    await page.goto(url, { waitUntil: 'networkidle' });
  }
  expect(errors).toEqual([]);
});

test('every image has an alt attribute and intrinsic dimensions', async ({ page }) => {
  test.setTimeout(120_000);
  for (const url of keyPages) {
    await page.goto(url);
    const bad = await page.evaluate(() =>
      [...document.images]
        .filter(
          (img) => !img.hasAttribute('alt') || !img.getAttribute('width') || !img.getAttribute('height'),
        )
        .map((img) => img.currentSrc || img.src),
    );
    expect(bad, url).toEqual([]);
  }
});
