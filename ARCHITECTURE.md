# Architecture

## Decision summary

| Concern   | Choice                                                                                     | Why                                                                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework | **Astro 7.4** (static output)                                                              | The template audit showed a 1.1 MB Vue bundle wrapping every page. A marketing site of ~130 pages needs almost no client JavaScript. Astro renders HTML at build time and ships 24 KB of JS in total. |
| Language  | TypeScript (`astro/tsconfigs/strictest`)                                                   | Type-checked content, components and server code (`npm run check`: 0 errors).                                                                                                                         |
| Content   | Astro content collections (Markdown + one JSON file) with Zod schemas                      | Structured, reviewable in Git, validated at build. No CMS or database needed.                                                                                                                         |
| Styling   | Plain CSS: global tokens (`src/styles/tokens.css`, `global.css`) + scoped component styles | Small, framework-free, CSP-compatible. All CSS is inlined per page (no render-blocking requests).                                                                                                     |
| Images    | `astro:assets` (Sharp) → AVIF + WebP, responsive `srcset`, never upscaled                  | 468 optimised variants generated from 60 source images.                                                                                                                                               |
| Server    | `@astrojs/node` (standalone handler) wrapped by `server/serve.mjs`                         | Only `/api/contact` runs on demand; every page is prerendered. The wrapper adds security headers, compression and legacy redirects.                                                                   |
| Email     | Nodemailer over SMTP (the company's own mailbox)                                           | No paid third-party API.                                                                                                                                                                              |
| Tests     | Vitest (unit) + Playwright with axe-core (end-to-end, accessibility)                       | Runs locally against the production build.                                                                                                                                                            |

## Rendering model

```
            build time (npm run build)                          request time
 src/content/*  ─┐                                   ┌─ dist/client/  ← static HTML, CSS (inlined), JS, images, video
 src/data/*     ─┼─► Astro + Sharp ─► 129 pages ─────┤
 src/pages/*    ─┘                                   └─ dist/server/  ← /api/contact handler (Node)
                                                                         ▲
 server/serve.mjs ── security headers ── compression ── legacy 301s ─────┘
```

- **Pages:** 129 HTML pages:
  - home, about, privacy, 404
  - services hub + 14 disciplines
  - sectors hub + 5 sectors
  - projects hub + 94 projects
  - insights hub + articles
  - contact + 2 outcome pages
- **Endpoints:** `/search-index.json` and `/robots.txt` are generated at build time. `/sitemap-index.xml` comes from `@astrojs/sitemap`. `/api/contact` is the only on-demand route (`prerender = false`).
- **Draft gating:** `src/lib/content.ts → showDrafts()` returns true only in `astro dev` or when `BC_SHOW_DRAFTS=true` (the `build:review` script). Production builds cannot contain unapproved insights.

## Folder structure

```
astro.config.mjs        site, adapter (Node, or Vercel when VERCEL=1), CSP, allowed hosts, fonts, redirects, sitemap
vercel.json             Vercel build command; Git deployments disabled
server/serve.mjs        production/review server (headers, compression, zero-width-space redirects)
scripts/
  postbuild.mjs         writes .htaccess, _headers, _redirects into dist/client
  postbuild-vercel.mjs  adds headers and legacy 301s to .vercel/output/config.json
  security-headers.mjs  single source for response headers and cache rules
  check-links.mjs       internal link / asset / fragment checker
  check-vercel-routes.mjs  replays the Vercel routing config: redirects, page reachability, headers
  build-hero-video.sh   reproducible FFmpeg pipeline for the hero
  screenshot.mjs        responsive screenshot capture for QA
src/
  content.config.ts     collection schemas (services, sectors, projects, insights)
  content/              Markdown and JSON content
  data/                 site facts, navigation, media registry, icons, redirects
  layouts/BaseLayout    <head> (SEO, OG, JSON-LD, font), header, footer
  components/           layout/, home/, projects/, contact/, ui/
  pages/                routes (file-based)
  scripts/              client modules: nav, mobile-nav, search, hero-video, carousel, filters, contact form, reveal
  lib/                  content queries, SEO helpers, contact (validation, rate limit, mailer, handler)
  styles/               tokens + global styles
public/                 hero video derivatives, favicons, OG image, CSS masks, web manifest
assets-source/          untouched original hero video (not served)
tests/unit, tests/e2e   Vitest and Playwright suites
```

## Client-side JavaScript

The site works without JavaScript: the poster stands in for the video, all projects are listed, and the form posts natively. Scripts enhance it.

| Module                                      | Loaded on  | Role                                                         |
| ------------------------------------------- | ---------- | ------------------------------------------------------------ |
| `site.ts` (nav, mobile-nav, search, reveal) | every page | Mega-menus, drawer, search dialog, section reveals           |
| `hero-video.ts`                             | home       | Deferred, preference-aware video playback                    |
| `carousel.ts`                               | home       | Featured-project carousel                                    |
| `project-filters.ts`                        | /projects/ | URL-synchronised filtering                                   |
| `contact-form.ts`                           | /contact/  | Inline validation, fetch submission, truthful outcome states |

Controls that need JavaScript (mega-menu toggles, search button, video toggle, filters, carousel arrows) are rendered `hidden` and revealed by their scripts, so there are never dead buttons. Without JavaScript the menu button is a link to the footer navigation.

## Contact form

```
browser ──POST JSON or form──► /api/contact (src/pages/api/contact.ts)
                                 └─ handleContact() (src/lib/contact/handler.ts)
                                      1. same-origin check (plus Astro checkOrigin for form posts)
                                      2. size limit (32 KB) and content-type allow-list
                                      3. rate limit per client IP (default 5 / 10 min)
                                      4. honeypot field and minimum fill time (2.5 s)
                                      5. validateEnquiry(): the same rules the browser runs
                                      6. readMailConfig(): missing settings → 503 not_configured
                                      7. deliverEnquiry() via SMTP → 200 {reference} or 502 delivery_failed
```

- JSON callers get JSON. Plain HTML form posts (no JavaScript) get a `303` to `/contact/thank-you/` or `/contact/not-sent/?reason=…`.
- Logs record only a reference and the outcome, never enquiry content.
- The rate limiter is in-memory, which is appropriate for a single Node process. A multi-instance or serverless host needs a shared store.

## Security

- **CSP:** Astro emits a per-page `<meta>` policy with SHA-256 hashes for every inline script and style (`security.csp` in `astro.config.mjs`). The header policy adds `frame-ancestors 'none'`, `base-uri`, `object-src` and `form-action`.
- **Headers** (`scripts/security-headers.mjs`): HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener-Policy`. They are applied by the Node server and written into `.htaccess`, `_headers` and Vercel's `config.json`.
- **Trusted hosts:** `security.allowedDomains` lists the hosts Astro may trust from `Host` / `X-Forwarded-*`. Without it, Astro 7 builds every request URL as `http://localhost`, and same-origin form posts would fail its CSRF check.
- **No third parties at runtime:** no analytics, tag managers, CDNs, remote fonts, maps embeds or Mahlatini resources. External links (Google Maps directions) are plain links.
- **Secrets:** read from `process.env` on the server only. `.env` is gitignored.

## Hosting options (owner decision required)

The legacy site runs on Apache with WordPress at `blackcrystal.co.zw`. The build supports four routes:

1. **Node host** (simplest, everything works): run `npm ci && npm run build && npm run start` behind HTTPS (a reverse proxy may set `TRUST_PROXY=true`). Set the SMTP variables.
2. **Apache static hosting** (the current host type): upload `dist/client/`. The generated `.htaccess` provides HTTPS, the canonical host, 301s, headers and caching. The contact endpoint needs an additional runtime: a Node app if the host offers one, or a small server-side handler implementing the same contract (`ARCHITECTURE.md → Contact form`). Until then the form shows the honest "not connected" state.
3. **Netlify / Cloudflare Pages:** swap `@astrojs/node` for the platform adapter. The handler uses standard `Request`/`Response`. `_headers` and `_redirects` are generated. The in-memory rate limiter should be replaced with the platform's KV or rate-limiting features.
4. **Vercel** (used for previews): `vercel build` sets `VERCEL=1`, which selects `@astrojs/vercel`.
   - Pages and media are served from Vercel's CDN, and `/api/contact` runs as a Node 24 function.
   - `scripts/postbuild-vercel.mjs` adds the shared headers and all 79 legacy 301s to the routing config. It also adds `X-Robots-Tag: noindex` unless the build sets `BC_ALLOW_INDEXING=true`.
   - Builds run locally and are uploaded with `vercel deploy --prebuilt` (see `README.md`).
   - For production: the rate limiter is per function instance, so use Vercel's firewall rate limiting or a shared store. Vercel's free Hobby plan is for non-commercial use, so a company site needs a paid plan.

In every case, deployment is a manual, owner-approved step. There are no CI/CD pipelines.
