import { expect, test } from '@playwright/test';

test('project filters update results, count and URL', async ({ page }) => {
  await page.goto('/projects/');
  const count = page.locator('[data-filter-count]');
  await expect(count).toHaveText('Showing 24 of 94 projects');
  await page.getByLabel('Sector', { exact: true }).selectOption('tourism');
  await expect(count).toContainText('of 94 projects');
  await expect(page).toHaveURL(/sector=tourism/);
  const visible = page.locator('[data-project]:visible');
  expect(await visible.count()).toBeGreaterThan(0);
  for (const sectors of await visible.evaluateAll((els) => els.map((e) => e.getAttribute('data-sectors')))) {
    expect(sectors).toContain('tourism');
  }
  await page.getByLabel('Keyword', { exact: true }).fill('Victoria Falls');
  await expect(page).toHaveURL(/q=Victoria/);
  await page.getByRole('button', { name: /Remove filter Sector/ }).click();
  await expect(page).not.toHaveURL(/sector=/);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(count).toHaveText('Showing 24 of 94 projects');
});

test('the unfiltered list is revealed in pages and focus moves to new results', async ({ page }) => {
  await page.goto('/projects/');
  const count = page.locator('[data-filter-count]');
  await expect(page.locator('[data-project]:visible')).toHaveCount(24);
  await page.getByRole('button', { name: 'Show 24 more projects' }).click();
  await expect(count).toHaveText('Showing 48 of 94 projects');
  await expect(page.locator('[data-project]:visible').nth(24).locator('a')).toBeFocused();
  await page.getByRole('button', { name: 'Show 24 more projects' }).click();
  await page.getByRole('button', { name: 'Show 22 more projects' }).click();
  await expect(count).toHaveText('Showing all 94 projects');
  await expect(page.locator('[data-show-more]')).toBeHidden();
});

test('deep links pre-apply filters', async ({ page }) => {
  await page.goto('/projects/?sector=housing');
  await expect(page.locator('[data-filter-count]')).toHaveText('Showing 1 of 94 projects');
  await page.goto('/projects/?service=technical-eia-review');
  await expect(page.locator('[data-filter-count]')).toHaveText('Showing 13 of 94 projects');
});

test('project detail shows facts and source', async ({ page }) => {
  await page.goto('/projects/karo-platinum-mining-esia-ifc/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Karo Platinum');
  const facts = page.locator('.project-facts');
  await expect(facts).toContainText('Karo Platinum Private Limited');
  await expect(facts).toContainText('2021 – 2022');
  await expect(page.locator('.source-note')).toContainText('PDF page 7');
});
