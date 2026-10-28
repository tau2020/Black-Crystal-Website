# QA report

**Date:** 29 October 2026 · **Build:** `npm run build:review` (production build including draft insights) · **Server:** `server/serve.mjs` on `127.0.0.1` · **Machine:** macOS 26.6, Node 24.0.0, Google Chrome 156; Playwright WebKit and Firefox 157

All testing was local. No CI, cloud builds, deployments or pushes were used.

## 1. Automated results (final run)

| Check                                                                | Command                           | Result                                                                                                               |
| -------------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Type check (strictest TS + Astro)                                    | `npm run check`                   | **0 errors, 0 warnings, 0 hints** (81 files)                                                                         |
| Lint                                                                 | `npm run lint`                    | **0 problems** (typescript-eslint + eslint-plugin-astro)                                                             |
| Formatting                                                           | `npm run format:check`            | All files formatted                                                                                                  |
| Unit tests                                                           | `npm run test`                    | **23 / 23 passed** (validation, rate limiting, contact handler paths, mail composition and escaping, search ranking) |
| Build                                                                | `npm run build:review`            | 129 pages, 468 optimised image files, 24 KB JS in total (3 chunks)                                                   |
| Link / asset / fragment check                                        | `npm run links`                   | **14,775 references across 129 pages: 0 broken**                                                                     |
| End-to-end, Chrome desktop + mobile                                  | `npm run test:e2e`                | **52 passed** (13 skipped by design: desktop-only or mobile-only tests)                                              |
| End-to-end, 5 projects (+ WebKit desktop, WebKit iPhone 14, Firefox) | `PW_ENGINES=all npm run test:e2e` | **155 passed, 0 failed** (28 skipped by design)                                                                      |
| Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA)                    | part of e2e                       | **0 violations** on 13 pages × Chrome, WebKit and Firefox                                                            |
| Dependency audit                                                     | `npm audit`                       | **0 vulnerabilities** (production and dev)                                                                           |

### What the end-to-end suite covers

- **Homepage:** the ten sections in the approved order; hero copy and CTAs; verified credibility facts (and that "100+" appears nowhere); carousel.
- **Hero video:**
  - The correct derivative per viewport, playing muted and looped with no controls.
  - A manual pause survives scrolling away and back.
  - It pauses off-screen.
  - Under reduced motion it makes **zero** `.mp4` requests.
- **Navigation:**
  - Mega-menus on hover, keyboard (ArrowDown, Escape and focus return), outside click, and the active state.
  - A race regression test (dismissing before the open animation starts).
  - The mobile drawer: sub-panels, Back, focus management, Escape, links.
- **Search:** keyboard navigation to a result, and the no-results message.
- **Projects:** filters synchronised to the URL, chips, deep links (`?sector=`, `?service=`), paging with focus moved to new results, and project facts with their source citation.
- **Contact form:**
  - The client-side error summary.
  - **End-to-end delivery through the server** (capture transport writes a real `.eml`, which the test verifies).
  - The truthful "not sent" state with the visitor's text preserved.
- **SEO:** unique titles and descriptions, one `<h1>`, canonical URLs, `lang`, OG image, JSON-LD, `noindex` on drafts, and 301s for legacy URLs (including a zero-width-space slug).
- **Quality:**
  - No horizontal overflow at **360, 390, 768, 1024, 1440 and 1920px** on 12 key pages.
  - No console errors or CSP violations.
  - Every image has alt text and intrinsic dimensions.

### Contact API (manual `curl` against the built server, no SMTP configured)

| Request                                                      | Response                                                                                             |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Valid enquiry, delivery not configured                       | `503 {"code":"not_configured"}`, and the server log names the missing variables (never their values) |
| Invalid fields                                               | `422` with per-field messages                                                                        |
| Honeypot filled / submitted in under 2.5 s                   | `400 rejected` / `400 too_fast`                                                                      |
| Cross-origin JSON; cross-site form post; spoofed Host header | `403`                                                                                                |
| `text/plain`; malformed JSON; `GET`                          | `415`; `400`; `405`                                                                                  |
| Sixth submission within 10 minutes                           | `429` with `Retry-After: 600`                                                                        |
| Same-origin form post without JavaScript                     | `303 → /contact/not-sent/?reason=not_configured`                                                     |

## 2. Lighthouse 13.6 (production build, local)

Mobile uses Lighthouse's default emulation: simulated slow 4G and 4× CPU slowdown. Full data: `qa/lighthouse/summary.json` (24 runs).

| Page                    | Mobile (P / A / BP / SEO) | Mobile LCP · CLS     | Desktop (P / A / BP / SEO) |
| ----------------------- | ------------------------- | -------------------- | -------------------------- |
| Home (3 runs each)      | **98** / 100 / 100 / 100  | 2.4 s · 0.001        | **100** / 100 / 100 / 100  |
| About                   | 100 / 100 / 100 / 100     | 1.6 s · 0.001        | 100 / 100 / 100 / 100      |
| Services hub            | 98 / 100 / 100 / 100      | 2.3 s · 0            | 100 / 100 / 100 / 100      |
| Service (ESIA)          | 100 / 100 / 100 / 100     | 0.8 s · 0.001        | 100 / 100 / 100 / 100      |
| Sectors / Mining        | 100 / 100                 | 1.8 s, 0.8 s · 0.001 | 100 / 100                  |
| Projects / Karo project | 100 / 100                 | 1.8 s, 1.7 s · 0.001 | 100 / 100                  |
| Insights                | 99 / 100 / 100 / 100      | 2.1 s · 0.001        | 100 / 100 / 100 / 100      |
| Contact                 | 100 / 100 / 100 / 100     | 0.8 s · 0.001        | 100 / 100 / 100 / 100      |

Earlier measurements that were superseded are shown here for transparency:

- **First desktop home run:** 72. A one-off "unattributable" 889 ms task on a cold Chrome start. It scored 100 on every re-run, including with video blocked.
- **Mobile home:** 91 before CSS inlining and response compression.
- **Draft article:** SEO 69, because drafts are intentionally `noindex`.

## 3. Manual reviews

- **Visual comparison:** `qa/mockup-vs-build-home.jpg` shows the approved mockup beside the built homepage at 1440px. Every section matches the approved order and composition. Section-by-section review notes are in §5.
- **Responsive:** full-page screenshots at 360, 390, 768, 1024, 1440 and 1920px (`node scripts/screenshot.mjs`). These were checked for the hero framing, sector rail, zebra frame, dark-green panel, cards, project layouts, contact form and footer.
- **Interactive states:** all four mega-menus, the drawer (root and sub-panel), search results, and contact-form errors and success were captured and checked.
- **Motion review:**
  - The hero was recorded while playing for 56 s (four loops). `currentTime` wraps cleanly (14.04→1.56, 13.74→1.43, 13.01→0.69).
  - The swap from poster to video differs by only 2.2/255, so there's no composition jump.
  - Loop seam metrics are in `VIDEO_ASSET_LOG.md`.
- **CSP:** a real browser refused an injected inline style during testing, confirming the hashed policy is enforced.

## 4. Defects found and fixed (corrective loop)

| #   | Defect                                                                                                | Cause                                                                   | Fix                                                                 | Verified by                                            |
| --- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------ |
| 1   | Credibility band ignored container gutters                                                            | `ul[role=list]{margin:0}` outranked `.container`                        | Zero-specificity `:where()` reset                                   | Screenshot                                             |
| 2   | Eyebrows grey and oversized in four sections                                                          | Scoped `p` rules outranked `.eyebrow`                                   | `p:not(.eyebrow)`                                                   | Screenshot                                             |
| 3   | Featured project image shorter than its card                                                          | `<picture>` wrapper not stretched                                       | Absolute fill                                                       | Screenshot                                             |
| 4   | Footer sector labels wrapping to four lines and colliding                                             | Long titles in fixed columns                                            | Short titles + flex wrap                                            | Screenshot                                             |
| 5   | Hero copy over the elephant's trunk at about 1024px                                                   | Text column too wide                                                    | Narrower column at 900–1199px                                       | Screenshot                                             |
| 6   | "relate s" text                                                                                       | Whitespace collapse with a conditional suffix                           | Whole-sentence strings                                              | Build output                                           |
| 7   | 3.4 MB PNG fallbacks generated                                                                        | `<Picture>` defaults to the source format and size                      | WebP fallback at the largest requested width                        | Build output                                           |
| 8   | **Same-origin no-JavaScript form posts rejected (403)**, which would also have happened in production | Astro 7 ignores the Host header unless `security.allowedDomains` is set | Trusted host list                                                   | curl: 303 same-origin, 403 cross-site and spoofed host |
| 9   | **Hero pause button not clickable on desktop**                                                        | Covered by the copy layer                                               | Moved above it                                                      | e2e                                                    |
| 10  | **First click on a filter chip did nothing after typing a keyword**                                   | Blur fired `change`, which re-rendered the chips mid-click              | Render chips only when they change                                  | e2e                                                    |
| 11  | **Hover then click closed the mega-menu**                                                             | Hover-intent opened it, then the click toggled it shut                  | Click-to-pin                                                        | e2e                                                    |
| 12  | **A dismissed menu could reappear as a visible panel with `aria-expanded=false`**                     | A late animation frame re-added `is-open`                               | Intent-guarded callbacks (and the same guard for mobile sub-panels) | Deterministic regression test                          |
| 13  | **Focus not returned after closing the drawer or search in Safari**                                   | Safari does not focus links or buttons on tap                           | Explicit focus return                                               | WebKit e2e                                             |
| 14  | Render-blocking CSS (est. 430 ms on mobile)                                                           | External stylesheets                                                    | Inline all CSS                                                      | Lighthouse FCP 1.7 → 0.8 s                             |
| 15  | Uncompressed HTML from the Node server (172 KB)                                                       | The adapter does not compress                                           | Brotli/gzip middleware (video untouched)                            | 29 KB on the wire; video still returns 206             |
| 16  | Insights layout shift (CLS 0.045)                                                                     | Topic filter revealed after load                                        | Shown from first paint via `@media (scripting: enabled)`            | CLS 0.001                                              |
| 17  | Mobile projects page about 21,000px long                                                              | 94 stacked cards                                                        | Paged reveal (24 at a time)                                         | e2e                                                    |
| 18  | Concept-board images with baked labels and white edges                                                | Crops from the mockup board                                             | Re-cropped or trimmed; profile originals used where sharper         | Visual                                                 |
| 19  | Visible jump at the hero loop                                                                         | Clip end ≠ start (seam 15× the median motion)                           | Crossfade loop + bitrate zone                                       | Seam 0.70 = natural motion                             |
| 20  | Social preview showed the superseded river-valley concept                                             | Pack OG composite                                                       | New OG image from the elephant poster                               | Visual                                                 |

## 5. Known limitations and differences

- **Contact delivery is not connected.** SMTP credentials and a confirmed recipient are needed (`LAUNCH_CHECKLIST.md`). Until then, the form tells visitors the truth and offers email and phone.
- **Video smoothness could not be measured reliably here.** Automated Chrome reports about 50% dropped frames, but the figure is identical for a bare `<video>` of the same file in Chrome's own viewer and unchanged with the page overlays removed. That indicates an environment artifact (the automated window is probably occluded). **Please confirm by eye** on real devices.
- **WebKit console message.** WebKit logs "Refused to apply a stylesheet…" once per native `<select>` under a strict CSP. This was reproduced on a minimal page containing only a `<select>`; the selects work normally (all WebKit form and filter tests pass). The tests tolerate exactly this message on WebKit only.
- **Real Safari and iOS devices** were not available. WebKit testing used Playwright's WebKit build, including an iPhone 14 emulation profile.
- **Rate limiting** is in-memory (a single Node process). Serverless or multi-instance hosting needs a shared store.
- **Typography** uses Nunito Sans (OFL) in place of the unlicensed Avenir. A licensed Avenir can be dropped in.
- **Imagery:** AI concept images are soft (Housing card in particular) and should be replaced with commissioned photography. The rights for the profile photographs must be confirmed.
- **Differences from the mockup, all intentional:**
  - The elephant video hero (as directed).
  - The credibility band uses verified facts (no "100+ projects" or "40+ specialists").
  - Featured projects are real profile assignments instead of the mockup's invented "Unki Mine ESIA".
  - Insights carry "Draft" badges instead of invented dates.
  - Small chevron toggles beside menu items (needed for keyboard and touch access).
  - The vertical rhythm is more generous than the compressed concept image.
  - A full footer below the Key Sectors strip, as the brief requires.
- **Ready for owner review:** yes. **Ready for public launch:** no. The approvals and configuration in `LAUNCH_CHECKLIST.md` come first.
