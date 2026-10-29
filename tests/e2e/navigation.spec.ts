import { expect, test } from '@playwright/test';

test.describe('desktop navigation', () => {
  test.skip(({ isMobile }) => !!isMobile, 'desktop only');

  test('mega-menu opens on hover and closes with Escape', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Services', exact: true }).first().hover();
    const panel = page.locator('#mega-services');
    await expect(panel).toBeVisible();
    await expect(page.locator('[data-mega-toggle="services"]')).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });

  test('mega-menu is keyboard operable and returns focus', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-mega-toggle="sectors"]');
    await toggle.focus();
    await page.keyboard.press('ArrowDown');
    const panel = page.locator('#mega-sectors');
    await expect(panel).toBeVisible();
    await expect(panel.locator('a').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('toggle click opens and outside click closes', async ({ page }) => {
    await page.goto('/about/');
    await page.locator('[data-mega-toggle="projects"]').click();
    await expect(page.locator('#mega-projects')).toBeVisible();
    await page.mouse.click(700, 600);
    await expect(page.locator('#mega-projects')).toBeHidden();
  });

  test('a menu dismissed before its opening animation runs stays closed', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.querySelector<HTMLButtonElement>('[data-mega-toggle="services"]')!.click();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    await page.waitForTimeout(600);
    await expect(page.locator('#mega-services')).toBeHidden();
    await expect(page.locator('[data-mega-toggle="services"]')).toHaveAttribute('aria-expanded', 'false');
  });

  test('active section is indicated', async ({ page }) => {
    await page.goto('/services/gis-mapping/');
    await expect(page.locator('.primary-nav__link.is-active')).toHaveText('Services');
  });
});

test.describe('mobile navigation', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile only');

  test('drawer opens, navigates sub-panels and closes with Escape', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Menu' });
    await trigger.click();
    const drawer = page.getByRole('dialog', { name: 'Site menu' });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole('button', { name: 'Close menu' })).toBeFocused();
    await drawer.getByRole('button', { name: 'Services' }).click();
    const sub = drawer.locator('#mnav-services');
    await expect(sub).toBeVisible();
    await expect(sub.getByRole('button', { name: 'Back' })).toBeFocused();
    await expect(sub.getByRole('link', { name: 'Mine Closure Planning' })).toBeVisible();
    await sub.getByRole('button', { name: 'Back' }).click();
    await expect(drawer.getByRole('button', { name: 'Services' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('drawer links navigate', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu' }).click();
    const drawer = page.getByRole('dialog', { name: 'Site menu' });
    await drawer.getByRole('button', { name: 'Sectors' }).click();
    await drawer.getByRole('link', { name: 'Tourism' }).click();
    await expect(page).toHaveURL(/\/sectors\/tourism\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tourism');
  });
});
