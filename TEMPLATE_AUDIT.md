# Holiday Tourist template — audit

**Template:** `tau2020/holiday-tourist-website-template`, an HTTrack capture of the Mahlatini luxury travel website plus an unrelated chatbot.

**Audited:** 28 October 2026, read-only. Nothing in the template repository was modified, committed or pushed, and its git status was clean before and after.

**Purpose:** learn from its navigation and interaction patterns, then rebuild them as original, accessible code for Black Crystal. No template code, styles, images, fonts, copy or trackers were copied.

## What the template is

- **Size:** 4,628 captured HTML pages, including 2,275 under `us/`, 690 reviews and 179 blog pages. These are country → area → lodge pages, experience hubs, itineraries and guides.
- **Stack:** Craft CMS output, with a Vue 2 root wrapping the entire page (`#app v-cloak`).
  - The main bundle `app47b9.js` is 1.13 MB (Vue, Vuex, vue-router, axios, lodash, mmenu, Swiper, GLightbox).
  - The CSS is 310 KB.
  - The ~98 KB header markup is duplicated on every page.

## Navigation patterns studied

### Desktop header

- Three columns: logo, centred main navigation, icon links (search, wishlist, account) and a bright "Enquire Now" button.
- Transparent over the hero by default.
- It is **not sticky**. A separate condensed bar slides in after 150px of scroll (logo, phone, CTA, no navigation), driven by an unthrottled `window.onscroll` animating `top`.

### Mega-menus

- Opened by a hover-intent directive (`sensitivity 7, interval 100ms, timeout 300ms`). **Hover only:** the top-level link navigates, so touch users and keyboard users cannot open the menus.
- Two-zone panels: grouped link columns with image cards, plus a promotional column or a carousel strip of round thumbnails. A caret marks the open item and sibling items are dimmed.
- Close on mouse-out only: no Escape, focus-out or outside-click handling, and no ARIA (`aria-expanded`, `aria-controls`).

### Mobile navigation

- The `mmenu.js` v8 off-canvas drawer: sliding sub-panels with a back button, a heading and an overview link, plus third-level accordions.
- Focus is never moved into the drawer, and mmenu's Tab guard blocks the Tab key entirely.
- The scroll lock is `body { overflow: hidden }`, which iOS does not reliably honour.
- **Licensing:** mmenu is distributed under **CC-BY-NC-4.0 (non-commercial)** according to its own CSS header, so it cannot be used on a commercial site without a paid licence.

### Other interactions

- Algolia-powered search overlay. The application ID and search key are inline in the page, and every keystroke makes a request with no debounce.
- A sticky in-page section nav with scroll-spy, and card image zoom (scale 1.1).
- URL-synchronised itinerary filters with chips and a mobile "apply" drawer.
- Breadcrumbs that collapse to "back to parent" on small screens.

### Accessibility gaps observed

- Hover-only menus and no skip link.
- Focus outlines removed (`outline: 0`).
- Icon controls named by leftover design-tool titles (for example "Combined Shape").
- `maximum-scale=1` blocks zoom.
- `v-cloak` hides the whole page until 1.1 MB of JavaScript has run.

## How the patterns were modernised for Black Crystal

| Template pattern                 | Black Crystal implementation                                                                                                                                                                                                                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hover-only mega-menus            | Link plus a separate disclosure `<button>` (`aria-expanded`, `aria-controls`). Mouse hover with intent delay; click and tap pin the menu open. ArrowDown moves focus into the panel; Escape returns focus; outside click and focus-out close. Panels stay `display:none` until opened, so their images never load early. |
| Two-zone panels with image cards | Services: four category columns. Sectors: five image cards. Projects: links, sector filters and two featured project cards. About: intro, links and a feature card. Restrained 200–240 ms fade and slide.                                                                                                                |
| Condensed sticky bar             | The real navigation is sticky at constant height (no layout jump) with a shadow after scroll. Driven by a passive, rAF-throttled scroll listener.                                                                                                                                                                        |
| mmenu drawer                     | Original code on a native modal `<dialog>`: inert background, focus contained, Escape closes, focus returns to the trigger. Sliding sub-panels with Back and an overview link. Accessible names throughout. No third-party library.                                                                                      |
| Algolia search                   | Static index generated at build (`/search-index.json`), fetched on first open, scored client-side. No external service and no keys.                                                                                                                                                                                      |
| Itinerary filters                | Project portfolio filters (sector, service category, period, keyword) synchronised to the URL, with removable chips and a live result count.                                                                                                                                                                             |
| Breadcrumb collapse              | Breadcrumbs collapse to the parent link below 600px.                                                                                                                                                                                                                                                                     |
| Card zoom 1.1                    | Capped at 1.04 and disabled under reduced motion.                                                                                                                                                                                                                                                                        |

## Excluded, and why

- **All Mahlatini assets and copy:** images, logos (152 KB SVGs), the licensed Ernest & Emily font, and travel content.
- **Trackers and services:** Google Tag Manager (GTM-KGNB7D) and Google Ads, CookieYes, Google Fonts, MyFonts, `cdn.mahlatini.com`, the S3 asset host, unpkg, Plyr, Cloudflare `cdn-cgi`, Algolia, Google Maps (key inline), Vimeo and YouTube, Craft and Freeform form endpoints, reCAPTCHA, Mailchimp, Feefo, TripAdvisor, and the social embeds.
- **`mmenu.js`:** CC-BY-NC licence, plus the focus problems above.
- **The `chatbot/` system:** a Mahlatini-specific AI concierge and lead pipeline.
  - Built on FastAPI, Groq/Claude/Gemini, Qdrant, Postgres, Redis, Nginx and n8n workflows.
  - It is travel- and brand-specific, needs paid API keys and heavy infrastructure, and processes personal data. It is not appropriate for this site.
- **`cookies.txt`** in the template root contains a captured Craft session cookie and CSRF token. It was not copied anywhere and should be treated as sensitive.
- The ~4,500-page mirror itself. The Black Crystal site does not depend on any Mahlatini server at runtime; the end-to-end tests assert there are no console or CSP errors, and the CSP restricts all resources to `'self'`.
