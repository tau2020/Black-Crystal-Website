import { expect, test } from '@playwright/test';
import { keyPages } from './pages';

test('each key page has unique metadata, one h1 and a canonical URL', async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const url of keyPages) {
    await page.goto(url);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(title.length, url).toBeGreaterThan(10);
    expect(description?.length ?? 0, url).toBeGreaterThan(50);
    expect(titles.has(title), `duplicate title ${title}`).toBe(false);
    expect(descriptions.has(description!), `duplicate description on ${url}`).toBe(false);
    titles.add(title);
    descriptions.add(description!);
    await expect(page.locator('h1'), url).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]'), url).toHaveAttribute(
      'href',
      `https://blackcrystal.co.zw${url}`,
    );
    await expect(page.locator('html'), url).toHaveAttribute('lang', 'en');
    await expect(page.locator('meta[property="og:image"]'), url).toHaveAttribute(
      'content',
      /^https:\/\/blackcrystal\.co\.zw\//,
    );
  }
});

test('draft insights are marked noindex', async ({ page }) => {
  await page.goto('/insights/what-an-esia-involves/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.getByText('Draft for Black Crystal review')).toBeVisible();
});

test('structured data is valid JSON with the organisation', async ({ page }) => {
  await page.goto('/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const parsed = blocks.map((b) => JSON.parse(b));
  expect(parsed.some((d) => d['@type'] === 'ProfessionalService' && d.foundingDate === '2005')).toBe(true);
});

test('legacy WordPress URLs redirect permanently', async ({ request }) => {
  const cases: [string, string][] = [
    ['/about-us/', '/about/'],
    ['/our-services/', '/services/'],
    ['/mining-sector/', '/sectors/mining/'],
    ['/timeline/zedtc/', '/projects/zetdc-tokwe-haven-sunway-powerlines-esia-ifc/'],
    ['/community-health-safety-assessments%E2%80%8B/', '/services/community-health-safety/'],
  ];
  for (const [from, to] of cases) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(301);
    expect(new URL(res.headers().location!, 'http://x').pathname, from).toBe(to);
  }
});
