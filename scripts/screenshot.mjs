#!/usr/bin/env node
// Local visual QA: full-page screenshots of one or more paths at the QA breakpoints.
// Usage: node scripts/screenshot.mjs [--base=http://127.0.0.1:4321] [--widths=360,390,768,1024,1440,1920]
//        [--out=qa/screenshots] [--viewport-only] [--reduced-motion] /path [/path ...]
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? fallback;
const flag = (name) => args.includes(`--${name}`);
const base = opt('base', 'http://127.0.0.1:4321');
const widths = opt('widths', '360,390,768,1024,1440,1920').split(',').map(Number);
const out = opt('out', 'qa/screenshots');
const paths = args.filter((a) => !a.startsWith('--'));
if (!paths.length) paths.push('/');

const heights = { 360: 780, 390: 844, 768: 1024, 1024: 768, 1440: 900, 1920: 1080 };
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' });
try {
  for (const p of paths) {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: heights[width] ?? 900 },
        deviceScaleFactor: 1,
        reducedMotion: flag('reduced-motion') ? 'reduce' : 'no-preference',
      });
      const page = await context.newPage();
      await page.goto(new URL(p, base).href, { waitUntil: 'networkidle' });
      // Load every lazy image (QA capture only), then walk the page so reveal animations settle.
      await page.evaluate(() =>
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => (img.loading = 'eager')),
      );
      await page.waitForLoadState('networkidle');
      await page.evaluate(() =>
        Promise.all(
          [...document.images].map((img) => (img.complete ? null : img.decode().catch(() => null))),
        ),
      );
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.8) {
          window.scrollTo({ top: y, behavior: 'instant' });
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
        // Static layout capture: settle any entrance animations.
        document.querySelectorAll('.reveal-pending').forEach((el) => el.classList.remove('reveal-pending'));
      });
      await page.waitForTimeout(600);
      const name = `${p.replace(/\/$/, '').replace(/[^a-z0-9]+/gi, '_') || 'home'}-${width}.png`;
      await page.screenshot({ path: path.join(out, name), fullPage: !flag('viewport-only') });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      console.log(`${name}${overflow > 0 ? `  ⚠ horizontal overflow ${overflow}px` : ''}`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}
