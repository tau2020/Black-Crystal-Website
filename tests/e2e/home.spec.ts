import { expect, test } from '@playwright/test';

test.describe('homepage', () => {
  test('sections follow the approved order', async ({ page }) => {
    await page.goto('/');
    const order = await page.evaluate(() => {
      const marks = [
        ['navbar', '[data-site-header]'],
        ['hero', '[data-hero]'],
        ['credibility', '#at-a-glance'],
        ['sectors', '#sectors-title'],
        ['about', '#about-intro-title'],
        ['specialist-panel', '#specialist-title'],
        ['service-cards', '#svc-title'],
        ['featured-projects', '#featured-title'],
        ['insights', '#insights-home-title'],
        ['footer', '.site-footer'],
      ] as const;
      return marks
        .map(([name, sel]) => ({
          name,
          top: document.querySelector(sel)!.getBoundingClientRect().top + window.scrollY,
        }))
        .sort((a, b) => a.top - b.top)
        .map((m) => m.name);
    });
    expect(order).toEqual([
      'navbar',
      'hero',
      'credibility',
      'sectors',
      'about',
      'specialist-panel',
      'service-cards',
      'featured-projects',
      'insights',
      'footer',
    ]);
  });

  test('hero copy, CTAs and verified credibility facts', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Sustainable Development for Thriving Communities.',
    );
    await expect(page.getByText('Environmental & Social Advisory', { exact: true }).first()).toBeVisible();
    const hero = page.locator('[data-hero]');
    await expect(hero.getByRole('link', { name: 'Explore Our Services', exact: true })).toHaveAttribute(
      'href',
      '/services/',
    );
    await expect(hero.getByRole('link', { name: 'Discuss Your Project', exact: true })).toHaveAttribute(
      'href',
      '/contact/',
    );
    const band = page.locator('#at-a-glance');
    for (const fact of ['2005', '40+ years', 'Zimbabwe & South Africa', 'Multidisciplinary'])
      await expect(band).toContainText(fact);
    await expect(page.locator('body')).not.toContainText('100+');
  });

  test('hero video loads after the poster, plays muted, and stays paused after a manual pause', async ({
    page,
  }) => {
    await page.goto('/');
    const hero = page.locator('[data-hero]');
    const video = page.locator('[data-hero-video]');
    await expect(page.locator('.hero__poster')).toBeVisible();
    await expect(hero).toHaveClass(/is-video-ready/, { timeout: 15_000 });
    expect(
      await video.evaluate((v: HTMLVideoElement) => ({
        muted: v.muted,
        loop: v.loop,
        controls: v.controls,
        src: v.currentSrc,
      })),
    ).toMatchObject({
      muted: true,
      loop: true,
      controls: false,
      src: expect.stringMatching(/hero-(desktop-1280x720|mobile-960x720)\.mp4$/),
    });
    const toggle = page.getByRole('button', { name: 'Pause background video' });
    await toggle.click();
    await expect(page.getByRole('button', { name: 'Play background video' })).toBeVisible();
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    // Scroll away and back: a manual pause must not be undone.
    await page.evaluate(() => window.scrollTo({ top: 3000, behavior: 'instant' }));
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(600);
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });

  test('hero video pauses when scrolled out of view', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-hero]')).toHaveClass(/is-video-ready/, { timeout: 15_000 });
    await page.evaluate(() => window.scrollTo({ top: 4000, behavior: 'instant' }));
    await expect
      .poll(() => page.locator('[data-hero-video]').evaluate((v: HTMLVideoElement) => v.paused))
      .toBe(true);
  });

  test('reduced motion keeps the poster and downloads no video', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    const videoRequests: string[] = [];
    page.on('request', (r) => r.url().endsWith('.mp4') && videoRequests.push(r.url()));
    await page.goto('/');
    await page.waitForTimeout(2500);
    expect(videoRequests).toEqual([]);
    await expect(page.getByRole('button', { name: 'Play background video' })).toBeVisible();
    await context.close();
  });

  test('featured project carousel is operable', async ({ page }) => {
    await page.goto('/');
    const carousel = page.locator('[data-carousel]');
    const visibleTitle = () => carousel.locator('[data-slide]:not([hidden]) h3').innerText();
    const first = await visibleTitle();
    await carousel.getByRole('button', { name: 'Next featured project' }).click();
    expect(await visibleTitle()).not.toBe(first);
    await carousel.getByRole('button', { name: 'Previous featured project' }).click();
    expect(await visibleTitle()).toBe(first);
  });
});
