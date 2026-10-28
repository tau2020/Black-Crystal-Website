import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { keyPages } from './pages';

for (const url of [...keyPages, '/404/']) {
  test(`no WCAG A/AA violations: ${url}`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto(url);
    await page.evaluate(() =>
      document.querySelectorAll('.reveal-pending').forEach((el) => el.classList.remove('reveal-pending')),
    );
    // Let entrance transitions finish so contrast is measured on the final, fully opaque state.
    await page.waitForTimeout(900);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const summary = results.violations.map(
      (v) => `${v.impact} ${v.id}: ${v.nodes.length} × ${v.nodes[0]?.target.join(' ')}`,
    );
    expect(summary).toEqual([]);
  });
}
