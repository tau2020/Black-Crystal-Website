# Black Crystal Consulting — website

The website of Black Crystal Consulting, an environmental, social and cultural heritage advisory firm established in Harare in 2005. It is built with [Astro](https://astro.build) as a static-first site. A small Node endpoint handles the enquiry form.

> **Status:** reviewed on localhost. On 29 October 2026 the owner approved publishing the code to GitHub and a Vercel preview. Production launch still waits for the items in `LAUNCH_CHECKLIST.md`. No CI/CD is configured, by design.

## Quick start

Requires **Node.js 22.23.4 or newer** (developed on Node 24). Google Chrome must be installed for the browser tests.

```bash
npm ci                 # install exact dependency versions
npm run dev            # development server with hot reload → http://127.0.0.1:4321

npm run build:review   # production build that also includes draft insights, for owner review
npm run start          # production server (static pages + /api/contact) → http://127.0.0.1:4321
```

`npm run build` is the real production build: it **excludes unapproved (draft) insights**. Both builds run `scripts/postbuild.mjs`, which writes the host configuration files (`.htaccess`, `_headers`, `_redirects`).

## Scripts

| Command                                    | What it does                                                                              |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `npm run dev`                              | Astro dev server (drafts visible, no CSP)                                                 |
| `npm run build` / `build:review`           | Production build without / with draft insights                                            |
| `npm run build:vercel`                     | Production build for Vercel (`.vercel/output`); run by `vercel build`                     |
| `npm run start`                            | `server/serve.mjs`: Astro handler, security headers, compression, legacy redirects        |
| `npm run check`                            | TypeScript and Astro diagnostics                                                          |
| `npm run lint` / `format` / `format:check` | ESLint and Prettier                                                                       |
| `npm run test`                             | Unit tests (Vitest): validation, rate limiting, contact handler, mail composition, search |
| `npm run test:e2e`                         | Browser tests (Playwright + axe) against the built site. Run `build:review` first         |
| `npm run links`                            | Verifies every internal link, asset and `#fragment` in `dist/client`                      |
| `npm run qa`                               | Everything above, in order                                                                |
| `npm run video:build`                      | Regenerates the hero video derivatives and posters from the original (FFmpeg)             |
| `node scripts/screenshot.mjs /path …`      | Full-page screenshots at 360–1920px into `qa/screenshots/`                                |
| `node scripts/check-vercel-routes.mjs`     | After `build:vercel`: verifies redirects, page reachability and headers in Vercel routing |

## Configuration

Copy `.env.example` to `.env` (never commit `.env`). The variables that matter:

- `SITE_URL`: the canonical origin (default `https://blackcrystal.co.zw`).
- **Contact form:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `CONTACT_FROM`.
  - **Until these are set, the form honestly reports that online enquiries are not connected** (HTTP 503) and shows the email address and phone number instead. It never claims a message was sent.
  - For local testing only, `CONTACT_TRANSPORT=capture` with `CONTACT_ALLOW_CAPTURE=true` writes each enquiry to `.data/outbox/*.eml`.
- `CONTACT_RATE_LIMIT`, `CONTACT_RATE_WINDOW_MINUTES`, `TRUST_PROXY`, `ALLOWED_HOSTS`: see the comments in `.env.example`.

## Vercel preview

Previews are built on this machine and uploaded already built. Vercel never builds from Git: `vercel.json` sets `git.deploymentEnabled: false`.

```bash
vercel pull --yes --environment=preview   # once per machine: links the project and fetches its settings
vercel build                              # runs npm run build:vercel (VERCEL=1 selects @astrojs/vercel)
vercel deploy --prebuilt                  # uploads .vercel/output as a preview deployment
```

- The preview is the production build: draft insights are excluded. To include them, run `BC_SHOW_DRAFTS=true vercel build`.
- Vercel builds send `X-Robots-Tag: noindex`, so previews stay out of search results. Build with `BC_ALLOW_INDEXING=true` only when Vercel serves the launched site on its final domain.
- Vercel makes a new project's first deployment its production deployment, at `black-crystal-website.vercel.app`. Later `vercel deploy --prebuilt` runs create previews behind Vercel login. To update the public address, use `vercel build --prod` and `vercel deploy --prebuilt --prod`.
- The contact form needs the SMTP variables set as Vercel environment variables. Until then it returns the same honest "not connected" response.

## Editing content

All content lives in `src/content/` and `src/data/`. No CMS or database is needed.

| What                                               | Where                                | Notes                                                                                                                         |
| -------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Company facts, contact details, navigation, values | `src/data/site.ts`                   | Items marked `confirm` need owner confirmation before launch                                                                  |
| Projects (94 documented assignments)               | `src/content/projects/projects.json` | One object per project; `source.page` cites the 2024 profile                                                                  |
| Services (14 disciplines)                          | `src/content/services/*.md`          | Front matter + body                                                                                                           |
| Sectors (5)                                        | `src/content/sectors/*.md`           |                                                                                                                               |
| Insights                                           | `src/content/insights/*.md`          | `status: draft` is never published by `npm run build`. Set `status: approved` and add `publishedDate` and `author` to publish |
| Images                                             | `src/data/media.ts`                  | Central registry: alt text and provenance for every image                                                                     |
| Legacy URL redirects                               | `src/data/redirects.mjs`             | Feeds Astro, `.htaccess` and `_redirects`                                                                                     |

The build validates content against schemas (`src/content.config.ts`). Typos in references, such as a service ID that doesn't exist, fail the build.

## Project documents

| Document                                         | Purpose                                                                     |
| ------------------------------------------------ | --------------------------------------------------------------------------- |
| [`design.md`](design.md)                         | Design system contract and as-built implementation notes                    |
| [`ARCHITECTURE.md`](ARCHITECTURE.md)             | Stack, structure, rendering, security and hosting options                   |
| [`TEMPLATE_AUDIT.md`](TEMPLATE_AUDIT.md)         | What was learned from the Holiday Tourist template, and what was excluded   |
| [`ASSET_PROVENANCE.md`](ASSET_PROVENANCE.md)     | Origin, processing and rights status of every image                         |
| [`VIDEO_ASSET_LOG.md`](VIDEO_ASSET_LOG.md)       | Hero video inspection, seamless loop, encoding and playback behaviour       |
| [`CONTENT_SOURCES.md`](CONTENT_SOURCES.md)       | Every business fact traced to the 2024 profile, and items awaiting approval |
| [`SEO_IMPLEMENTATION.md`](SEO_IMPLEMENTATION.md) | Metadata, structured data, sitemap and legacy redirect map                  |
| [`QA_REPORT.md`](QA_REPORT.md)                   | Tests run, results, defects fixed, known limitations                        |
| [`LAUNCH_CHECKLIST.md`](LAUNCH_CHECKLIST.md)     | Approvals and configuration needed before going live                        |

## Repository policy

- **No CI/CD:** there is no `.github/workflows/`, builds and tests run locally, and Vercel's Git deployments are disabled.
- **Changes reach `main` through pull requests**, and are pushed and deployed only with the owner's approval. See `LAUNCH_CHECKLIST.md`.
- `assets-source/video/hero-video-original.mp4` keeps the supplied hero video untouched (including its audio track) so that the derivatives can be regenerated.
