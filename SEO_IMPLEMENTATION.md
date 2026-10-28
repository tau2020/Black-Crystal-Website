# SEO implementation

## Per-page metadata (`src/layouts/BaseLayout.astro`)

- **Title and description:** unique per page. Titles follow the pattern `Page | Black Crystal Consulting`; the homepage uses its own title. Uniqueness, presence and length are asserted by `tests/e2e/seo.spec.ts`.
- **Canonical URL:** an absolute URL built from `SITE_URL` (default `https://blackcrystal.co.zw`) with trailing slashes, matching the URL format the legacy site used.
- **Open Graph / Twitter:** `og:type`, `og:title`, `og:description`, `og:url`, `og:image` (absolute), `og:image:alt`, `og:site_name`, `og:locale en_GB`, and `summary_large_image`.
  - Default image: `public/brand/og-default.jpg` (1200×630). It combines the elephant poster, the official inverted logo and the headline.
- **`<html lang="en">`,** one `<h1>` per page (tested), and a logical heading order (axe-verified).
- **`noindex`:** draft insights (review builds only), `/contact/thank-you/`, `/contact/not-sent/` and the 404 page.

## Structured data (JSON-LD, built only from verified facts)

| Type                                 | Where                                                        | Content                                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `ProfessionalService` (organisation) | every page                                                   | Name, slogan, URL, logo, founding date 2005 and location, email, telephones, both postal addresses, areas served, fields of expertise |
| `WebSite`                            | home                                                         | Publisher reference                                                                                                                   |
| `BreadcrumbList`                     | all inner pages                                              | Mirrors the visible breadcrumbs                                                                                                       |
| `Service`                            | each service page                                            | Name, description, provider reference, areas served                                                                                   |
| `Article`                            | insights **only once approved** (needs a date and an author) | Draft articles emit no Article markup                                                                                                 |

No ratings, reviews, prices or other unverifiable properties are emitted.

## Crawl and index files

- **`/sitemap-index.xml`** (via `@astrojs/sitemap`): 126 URLs in a review build. The outcome pages and the 404 page are excluded. Production builds also exclude draft insights.
- **`/robots.txt`:** allows everything except `/api/`, and declares the sitemap.
- **`/search-index.json`:** used by on-site search only.

## Performance (measured, see `QA_REPORT.md`)

- Static HTML with all CSS inlined: no render-blocking requests.
- Brotli/gzip on the Node server: the home HTML is 172 KB → 29 KB on the wire.
- **Images:** AVIF + WebP `srcset`; explicit width and height on every `<img>` (tested); lazy loading below the fold; never upscaled.
- **Font:** a single 31 KB WOFF2, preloaded, with an optimised fallback (CLS ≤ 0.002).
- **Hero:** the poster is the LCP image (`fetchpriority="high"`), and the video loads only after `load`.
- **Lighthouse 13.6** (production build, local):
  - Mobile home 98, desktop home 100.
  - Every other audited page scores 91–100 for performance and 100 for accessibility, best practices and SEO.
  - The exception is the deliberately `noindex` draft article (SEO 69, by design).

## Legacy URL migration

All **80 public URLs** from the legacy WordPress sitemaps were audited on 28 October 2026: pages, posts, Cool Timeline entries and stories, categories and the author archive. The homepage keeps its URL; the other **79** each redirect to their closest new page with a **301** (34 to services, 19 to projects, 8 to sectors, 8 to insights, 7 to About, 1 to Contact and 2 to the homepage). The map lives in `src/data/redirects.mjs`.

| Legacy pattern                                                                                                                                                     | New destination                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `/about-us/`, `/our-partners/`, `/black-crystal-2020-rebrand/`                                                                                                     | `/about/`                                              |
| `/corporate-social-responsibility/`, Enactus and museum timeline items                                                                                             | `/about/#community`                                    |
| `/our-services/` and 33 further service slugs (EIA, auditing, legal, ecological, heritage, social, soils, community, training, mine closure, GIS, sustainability…) | `/services/` or the matching `/services/<discipline>/` |
| `/mining-sector/`, `/conventional-energy/`, `/infrastructure-development/`, `/tourism-sector/`, matching `ctl-stories`                                             | `/sectors/<sector>/`                                   |
| `/our-projects/`, `/our-clients/`, `/timeline/` and project timeline entries                                                                                       | `/projects/` or the specific `/projects/<id>/`         |
| `/news/`, `/newsletters/`, categories and posts                                                                                                                    | `/insights/`                                           |
| `/contact-us/`                                                                                                                                                     | `/contact/`                                            |

Implementation:

- **Node server:** Astro `redirects` (true 301s) plus `server/serve.mjs` for two WordPress slugs that end in a zero-width space (`%E2%80%8B`).
- **Apache:** generated `dist/client/.htaccess`, which also forces HTTPS and the canonical host. **Netlify/Cloudflare:** generated `_redirects`.
- **Tested:** `tests/e2e/seo.spec.ts`, including a zero-width-space slug.

**Before launch:** re-crawl the live site for any URLs added since the audit. Keep the old domain and its HTTPS certificate on the same host so that the redirects resolve. Submit the new sitemap in Google Search Console.

## Not done (by design)

- **No analytics or tag managers.** If analytics are wanted, choose a privacy-respecting tool and update the CSP and privacy notice. Nothing was copied from the template.
- **No inherited Mahlatini metadata.**
