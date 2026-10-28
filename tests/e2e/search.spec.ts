import { expect, test } from '@playwright/test';

test('site search finds projects and navigates by keyboard', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search the site' }).click();
  const dialog = page.getByRole('dialog', { name: 'Search Black Crystal' });
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole('searchbox');
  await expect(input).toBeFocused();
  await input.fill('Karo Platinum');
  await expect(dialog.getByRole('status')).toContainText('result');
  await expect(dialog.locator('[data-search-results] a').first()).toContainText('Karo');
  await input.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/projects\/karo-/);
});

test('search reports when nothing matches', async ({ page }) => {
  await page.goto('/about/');
  await page.getByRole('button', { name: 'Search the site' }).click();
  await page.getByRole('searchbox').fill('qwertyuiop');
  await expect(page.getByRole('status').filter({ hasText: 'No results' })).toBeVisible();
});
