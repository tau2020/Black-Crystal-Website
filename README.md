# Black Crystal Consulting — website

The website of Black Crystal Consulting, an environmental, social and cultural heritage advisory firm established in Harare in 2005. It is built with [Astro](https://astro.build) as a static-first site. A small Node endpoint handles the enquiry form.

> **Status:** local build ready for owner review. Nothing has been pushed or deployed. No CI/CD is configured, by design.

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
| `npm run start`                            | `server/serve.mjs`: Astro handler, security headers, compression, legacy redirects        |
| `npm run check`                            | TypeScript and Astro diagnostics                                                          |
| `npm run lint` / `format` / `format:check` | ESLint and Prettier                                                                       |
| `npm run test`                             | Unit tests (Vitest): validation, rate limiting, contact handler, mail composition, search |
| `npm run test:e2e`                         | Browser tests (Playwright + axe) against the built site. Run `build:review` first         |
| `npm run links`                            | Verifies every internal link, asset and `#fragment` in `dist/client`                      |
| `npm run qa`                               | Everything above, in order                                                                |
| `npm run video:build`                      | Regenerates the hero video derivatives and posters from the original (FFmpeg)             |
| `node scripts/screenshot.mjs /path …`      | Full-page screenshots at 360–1920px into `qa/screenshots/`                                |

## Configuration

Copy `.env.example` to `.env` (never commit `.env`). The variables that matter:

- `SITE_URL`: the canonical origin (default `https://blackcrystal.co.zw`).
- **Contact form:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `CONTACT_FROM`.
  - **Until these are set, the form honestly reports that online enquiries are not connected** (HTTP 503) and shows the email address and phone number instead. It never claims a message was sent.
  - For local testing only, `CONTACT_TRANSPORT=capture` with `CONTACT_ALLOW_CAPTURE=true` writes each enquiry to `.data/outbox/*.eml`.
- `CONTACT_RATE_LIMIT`, `CONTACT_RATE_WINDOW_MINUTES`, `TRUST_PROXY`, `ALLOWED_HOSTS`: see the comments in `.env.example`.

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

- **No CI/CD:** there is no `.github/workflows/`, and builds and tests run locally.
- **No pushes before owner approval.** A local `pre-push` hook (`.git/hooks/pre-push`, not committed) blocks `git push` until it is deliberately removed after approval. See `LAUNCH_CHECKLIST.md`.
- `assets-source/video/hero-video-original.mp4` keeps the supplied hero video untouched (including its audio track) so that the derivatives can be regenerated.
