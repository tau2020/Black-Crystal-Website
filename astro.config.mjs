// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { astroRedirects } from './src/data/redirects.mjs';

// Canonical production origin. Override with SITE_URL when building for a different host.
const site = process.env.SITE_URL ?? 'https://blackcrystal.co.zw';

// `vercel build` and Vercel's build machines set VERCEL=1: emit Vercel's Build Output API instead of the Node server.
const onVercel = process.env.VERCEL === '1';

// Hosts Astro may trust from the Host / X-Forwarded-* headers. Without this list Astro 7 builds every request
// URL as http://localhost, which makes same-origin form posts fail its CSRF origin check.
const siteHost = new URL(site).hostname.replace(/^www\./, '');
const allowedDomains = [
  { protocol: 'https', hostname: siteHost },
  { protocol: 'https', hostname: `www.${siteHost}` },
  { hostname: 'localhost' },
  { hostname: '127.0.0.1' },
  ...(process.env.ALLOWED_HOSTS ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)
    .map((hostname) => ({ hostname })),
];

const NON_INDEXABLE = /\/(contact\/(thank-you|not-sent)|404)\/?$/;

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  // Astro 7 defaults to JSX whitespace rules, which can silently join words across lines.
  compressHTML: true,
  adapter: onVercel ? vercel() : node({ mode: 'standalone' }),
  integrations: [
    sitemap({
      filter: (page) => !NON_INDEXABLE.test(page),
    }),
  ],
  redirects: astroRedirects,
  // Inline all CSS: removes render-blocking requests before first paint (measured with Lighthouse, see QA_REPORT.md).
  build: { inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: { responsiveStyles: false },
  security: {
    checkOrigin: true,
    allowedDomains,
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "media-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-src 'none'",
        "manifest-src 'self'",
      ],
    },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Nunito Sans',
      cssVariable: '--font-brand',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/NunitoSans-latin-wght-normal.woff2'],
            weight: '200 1000',
            style: 'normal',
          },
        ],
      },
    },
  ],
});
