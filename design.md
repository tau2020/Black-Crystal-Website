# BLACK CRYSTAL — WEBSITE DESIGN SYSTEM

**File:** `design.md`  
**Status:** Implementation specification for owner review  
**Version:** 1.0 — 28 October 2026  
**Project:** [Black Crystal Website](https://github.com/tau2020/Black-Crystal-Website)  
**Primary assets:** [Black Crystal Google Drive](https://drive.google.com/drive/folders/1J___J9z6DvCkcLr4D3rCdrsx8W_8Z0it)

> **Use this file as the visual contract for every page and component.** It translates Black Crystal's official identity into an implementable web system. The 2019 Brand Manual controls brand identity; the approved hybrid homepage mockup controls the website composition; the rules labelled **Website decision** below are design decisions for this implementation, not claims made in the brand manual.

---

## 1. Design intent and hierarchy

**Positioning:** A premium southern African environmental and social advisory consultancy—confident, evidence-led, human, and connected to the natural world.

**Visual idea:** _Natural layers, considered expertise._ Restrained modern editorial typography, wide documentary-style nature photography, organic sedimentation motifs, white space, warm gold and confident dark green. Sophisticated but never ornamental for ornament's sake.

**Personality:** Assured · Calm · Responsible · Technical · African · Contemporary.

**Visual priorities, in order:**

1. Legible content, believable expertise and truthful presentation.
2. Cohesion with the existing Black Crystal logo and approved homepage.
3. Image-led environmental storytelling.
4. Accessible, predictable navigation.
5. Subtle motion and polish without performance compromise.

**Canonical references:**

- `Material/Black Crystal Brand Manual.pdf` — brand identity, logo, colours and fonts (2019).
- `Material/Black Crystal Company Profile 2024.pdf` — factual business content; not a design authority.
- `black_crystal_hybrid_with_variation3_services.png` — approved homepage arrangement.
- `Website Assets — Hybrid Design/` — photographic, vector and brand assets.
- `Website Assets — Hybrid Design/hero-video.mp4` — approved sleeping-elephant hero footage.
- `holiday-tourist-website-template` — _navigation and interaction reference only_; do not reproduce its branding or proprietary media.

---

## 2. Colour system

### 2.1 Official Black Crystal brand palette

These six colours are specified by the **2019 Brand Manual, colour page (PDF page 8)**. Their names and HEX values are authoritative; their suggested UI roles below are **website decisions**.

| Official name    | Hex       | Website role                                                     |
| ---------------- | --------- | ---------------------------------------------------------------- |
| **Thunder**      | `#231f20` | Heading/text on light backgrounds; deep neutral                  |
| **Golden Grass** | `#c6962c` | Primary button fill, borders, graphical highlights, icon accents |
| **Mongoose**     | `#b39f82` | Warm muted accents and borders                                   |
| **Hippie Green** | `#6a8e4f` | Ecological cues, icon accents, section highlights                |
| **Nevada**       | `#6f7072` | Muted text on white, UI secondary neutral                        |
| **Silver Sand**  | `#c4c6c8` | Neutral dividers and pale borders                                |

The manual permits tonal variations. Do not introduce a second unrelated brand palette.

### 2.2 Website-specific functional tokens (derived, not official brand colours)

| Token               | Value     | Use                                                       |
| ------------------- | --------- | --------------------------------------------------------- |
| `--surface`         | `#ffffff` | Main page and card backgrounds                            |
| `--surface-warm`    | `#f7f5f0` | Alternate soft ivory sections                             |
| `--surface-cream`   | `#f6f3ec` | Zebra section and editorial panels                        |
| `--ink`             | `#231f20` | Primary text                                              |
| `--text-muted`      | `#6f7072` | Secondary text on white, subject to contrast checks       |
| `--green-deep`      | `#2c4532` | Dark-green specialist-services panel and dark UI surfaces |
| `--gold-accessible` | `#865f14` | Small gold-coloured text on white/cream                   |
| `--gold-hover`      | `#b58725` | Gold button hover state                                   |
| `--line`            | `#e5e3de` | Lightweight card borders and separators                   |
| `--focus`           | `#1f5d8c` | Clearly visible functional focus ring only                |

**Accessibility rule:** Brand Golden Grass `#c6962c` on white is **not sufficient for normal text contrast** (approximately 2.69:1). Use `--gold-accessible` for small text on light surfaces; reserve Golden Grass for filled controls with dark text, large decorative elements, icons (when contrast permits) and accents. A Golden Grass-filled primary CTA must use **Thunder text**, not small white text. Use white text on `--green-deep`, not on the official lighter Hippie Green unless tested and adjusted. Validate every final combination with WCAG AA (4.5:1 normal text; 3:1 large text and important non-text UI boundaries).

### 2.3 Usage proportions (website guidance)

- Approximately **65–75%** white/ivory backgrounds.
- Approximately **15–25%** image-led and deep-green sections.
- Approximately **5–10%** gold/green/neutral accents.
- Gold is a signature accent, not a full-page background theme.
- Alternate white and warm ivory sections rather than alternating every small card.
- Do not introduce rainbow section colours, blue primary buttons, glossy gradients or neon.

### 2.4 Base CSS custom properties

```css
:root {
  /* Official Black Crystal palette */
  --bc-thunder: #231f20;
  --bc-gold: #c6962c;
  --bc-mongoose: #b39f82;
  --bc-green: #6a8e4f;
  --bc-nevada: #6f7072;
  --bc-silver: #c4c6c8;

  /* Website-derived UI surfaces and contrast helpers */
  --color-surface: #ffffff;
  --color-surface-warm: #f7f5f0;
  --color-surface-cream: #f6f3ec;
  --color-heading: var(--bc-thunder);
  --color-body: var(--bc-thunder);
  --color-muted: var(--bc-nevada);
  --color-panel: #2c4532;
  --color-gold-readable: #865f14;
  --color-gold-hover: #b58725;
  --color-border: #e5e3de;
  --color-focus: #1f5d8c;
  --color-on-dark: #ffffff;
  --color-on-gold: var(--bc-thunder);

  --shadow-subtle: 0 8px 24px rgb(35 31 32 / 7%);
  --shadow-raised: 0 14px 36px rgb(35 31 32 / 12%);
}
```

---

## 3. Typography

### 3.1 Official font roles

The **2019 Brand Manual, fonts page (PDF page 10)** specifies the following (spelled “Avinir” in that source; commonly marketed as “Avenir”):

| Context           | Brand manual typeface | Intended website use                                |
| ----------------- | --------------------- | --------------------------------------------------- |
| Body / paragraphs | **Avenir Book**       | Paragraphs, form labels, metadata, navigation       |
| Headings          | **Avenir Black**      | H1–H3, section headlines, strong card headings      |
| Posters           | **Peace Sans**        | Rare campaign/editorial accent only; not default UI |

**Do not claim the font files are bundled.** The asset pack explicitly does not include font binaries. Obtain a valid web-use licence before self-hosting Avenir or Peace Sans. If unavailable, use an approved substitute such as **Inter** (self-hosted with its licence) or the system UI stack; do not download unlicensed fonts or borrow type from the mirrored template. The standard 12pt/18pt sizes in the print manual are **not web breakpoints**; use the web scale below.

### 3.2 Recommended font stacks

```css
:root {
  --font-body: 'Avenir Book', 'Avenir Next', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-display: 'Avenir Black', 'Avenir Next', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-poster: 'Peace Sans', 'Avenir Black', 'Inter', sans-serif;
}
```

Never expose a faux “Avenir” download or proprietary font as a project asset. Only reference fonts actually installed or legally bundled in the implementation.

### 3.3 Type scale — responsive website decisions

| Style          | CSS                                |  Weight | Line height | Notes                                       |
| -------------- | ---------------------------------- | ------: | ----------: | ------------------------------------------- |
| Hero display   | `clamp(2.65rem, 5vw, 5.5rem)`      | 800/900 |   0.98–1.07 | Max-width 10–13ch where composition permits |
| Page H1        | `clamp(2.35rem, 4.4vw, 4.4rem)`    | 800/900 |   1.05–1.12 | Strong, compact                             |
| Section H2     | `clamp(2rem, 3vw, 3.1rem)`         |     800 |   1.10–1.18 | Editorial section rhythm                    |
| Card H3        | `clamp(1.15rem, 1.55vw, 1.45rem)`  | 700/800 |     1.2–1.3 | Avoid 3+ line cards                         |
| Lead paragraph | `clamp(1.075rem, 1.35vw, 1.25rem)` |     400 |        1.55 | Max-width 62ch                              |
| Standard body  | `1rem`                             |     400 |        1.65 | Default text; no tiny grey body copy        |
| Small/meta     | `0.875rem`                         | 400/500 |        1.45 | Comfortable on mobile                       |
| Navbar         | `0.875–0.9375rem`                  | 500/600 |        1.35 | Clean and understated                       |
| Eyebrow label  | `0.75rem`                          |     700 |         1.3 | Uppercase; `letter-spacing: .1em`           |
| Button         | `0.875–0.9375rem`                  |     700 |         1.2 | Sentence/title case                         |

**Rules:**

- Prefer sentence case for general headlines and controls; use uppercase only for short eyebrows.
- Avoid letterspacing on body copy; limit negative tracking to large display type if needed.
- Maintain readable paragraph width: **52–70 characters**, depending on size.
- Never centre long body paragraphs; left-align for scanning.
- Use real CSS weights the loaded font supports; avoid synthetic bold where possible.
- On the hero, wrap copy into deliberate visual lines on desktop without hard-coding breaks that create poor mobile layouts.
- Do not layer Peace Sans over the entire site; use rarely and only when approved.

---

## 4. Icons and graphic language

### 4.1 Source and style

**Primary icon source:** provided SVGs under `Website Assets — Hybrid Design/07-ui/`.

**Fallback / additional icons:** a consistent single open-source outline system (e.g., **Lucide**, subject to its licence), not a mixture of icon packs. Do not copy the source travel site's icon artwork without permission.

**Style system (website decision):**

- Thin **outline / linear** icons; no emoji, filled clipart, coloured emoji, 3D illustrations or inconsistent weight.
- Standard stroke **1.75px at 24×24**, with rounded joins and caps; small icons may use 2px for visibility.
- Sizes: **16px** inline, **20px** navigation, **24px** cards/actions, **28–32px** feature illustrations.
- Use currentColor in SVGs whenever possible to inherit accessible contextual colours.
- Gold/green on light; white on dark photographic tiles; soft gold on dark-green panels.
- Decorate only when an icon improves comprehension, not every label.

### 4.2 Icon mapping

| Subject                 | Preferred icon                    | Fallback concept       |
| ----------------------- | --------------------------------- | ---------------------- |
| Environment, assessment | `icon-leaf.svg`                   | `leaf`                 |
| Community, stakeholders | `icon-users.svg`                  | `users-round`          |
| Education, training     | `icon-book.svg`                   | `book-open`            |
| Technical services      | `icon-cog.svg`                    | `settings`             |
| Mining                  | `icon-mountain.svg`               | `mountain` / `pickaxe` |
| Energy                  | `icon-wind.svg`                   | `wind` / `zap`         |
| Infrastructure          | `icon-road.svg`                   | `route`                |
| Housing                 | `icon-house.svg`                  | `house`                |
| Water/environment       | `icon-water.svg`                  | `droplets`             |
| Biodiversity            | `icon-leaf.svg`                   | `sprout`               |
| Compliance              | `icon-shield.svg`                 | `shield-check`         |
| Sustainability          | `icon-recycle.svg`                | `recycle`              |
| GIS/location            | `icon-map.svg`                    | `map-pinned`           |
| Search                  | designed from same outline family | `search`               |
| Menu/close              | same outline family               | `menu`, `x`            |
| Arrow/link              | small minimal chevron/arrow       | `arrow-up-right`       |

Use accessible text labels on icon-only buttons. Ensure decorative SVGs are hidden from assistive technology and functional icon-only controls have `aria-label`.

### 4.3 Brandmark graphics

The manual describes the mark as **sedimentation layers** (PDF page 4). The brandmark may be used decoratively/cropped, but must retain its original shape and a clearly recognisable majority of the mark; the manual explicitly says **at least 70% of the mask shape should remain visible** (PDF page 7).

Use the official full-colour, greyscale, monochrome or inverted variations where appropriate (PDF page 5). Do not rearrange layers, alter aspect ratio, reverse colour sequence, substitute gradients or make a new logo.

For the zebra image, use an **organic mask inspired by the brandmark**, with minimal green/gold corner shapes. Decorative contour lines are secondary and must not obscure photography or content.

---

## 5. Layout, grid and spacing

### 5.1 Containers

- Full-bleed sections: hero, services split panel and scenic footer.
- Content container: `max-width: 1280px` with fluid horizontal padding.
- Text columns: max `60–70ch` for paragraphs; narrower for dramatic hero copy.
- Global desktop page gutter: `clamp(24px, 5vw, 72px)`.
- Mobile gutter: `20px` (16px minimum on narrow screens).
- Use a 12-column layout or clean CSS grid; align major headings, images and cards to the same invisible rails.
- Main content is not trapped in a narrow page even when imagery is edge-to-edge.

### 5.2 Spacing scale

Use one 4px-based scale, avoiding arbitrary margin values:

| Token        |  px | Typical use                 |
| ------------ | --: | --------------------------- |
| `--space-1`  |   4 | Icon micro-gap              |
| `--space-2`  |   8 | Small label gap             |
| `--space-3`  |  12 | Small control gap           |
| `--space-4`  |  16 | Card content/gap            |
| `--space-5`  |  20 | Mobile section text padding |
| `--space-6`  |  24 | Card/column gap             |
| `--space-8`  |  32 | Medium layout gap           |
| `--space-10` |  40 | Block spacing               |
| `--space-12` |  48 | Section sub-spacing         |
| `--space-16` |  64 | Desktop section spacing     |
| `--space-20` |  80 | Editorial section spacing   |
| `--space-24` |  96 | Large section spacing       |

- Default section vertical padding: **72–96px desktop**, **48–64px tablet**, **40–56px mobile**.
- Heading → intro paragraph: 12–20px.
- Intro paragraph → visual grid: 24–36px.
- Card gaps: 16–24px desktop, 12–16px mobile.
- Avoid empty 160px expanses or cards cramped against the viewport edge.

### 5.3 Radius and borders

- Navigation, general cards: **6–10px**; clean geometry.
- Small controls/chips: **6px** or full pill only when functionally appropriate.
- Hero CTAs: **6px**; not floating pill buttons.
- Large photographic organic frames: use genuine mask geometry, not large arbitrary corner-radius on every image.
- Border: `1px solid var(--color-border)`; muted, never thick brown outlines.
- Shadow: very subtle, reserved for raised/floating UI.

---

## 6. Core component contracts

### 6.1 Full-width navigation

**Reference:** Approved variation 2 navbar + structural strengths of the Holiday Tourist template.

- Header is full viewport width with white background and a **centred inner container**.
- Height: **76–84px desktop**, **62–68px mobile**, adjust for actual logo readability.
- Logo lockup left; menu centre/right; Contact Us button at far right.
- Active navigation uses a **small thin gold underline**; avoid gold-filled nav tabs.
- Text: Thunder; hover/focus subtle; no oversized nav typography.
- Dropdown or mega-menu panels should feel intentional, dense enough to be useful, but not oversized.
- Mobile drawer must have complete keyboard/focus handling, scroll lock and accessible close/back behaviour.
- Search icon exists only when a genuinely functional search page or overlay is implemented.
- Sticky header may reduce height slightly after scroll; never jump or hide unexpectedly.

### 6.2 Buttons

| Variant           | Background               | Text                            | Border               | Use                                |
| ----------------- | ------------------------ | ------------------------------- | -------------------- | ---------------------------------- |
| Primary           | `#c6962c`                | `#231f20`                       | Gold                 | Hero, key contact/consult CTA      |
| Secondary on hero | Transparent/dark overlay | White                           | White 1px            | Alternative hero action            |
| Secondary light   | White/transparent        | Thunder                         | Thin Thunder/neutral | Secondary action on light sections |
| Ghost link        | None                     | Accessible dark gold or Thunder | None                 | “Our Story”, “View All Projects”   |
| Dark panel        | Gold or white            | Contrast-appropriate dark text  | None                 | Service-panel CTA                  |

Specs:

- Minimum touch height **44px**; suggested standard **46–50px**.
- Horizontal padding **18–24px**; text bold but not oversized.
- Keyboard focus visible; disabled states clear; loading state prevents duplicate submission.
- Hover: subtle colour/distance transition, not dramatic bounce.
- Optional small arrow icon only where meaningful; no giant decorative arrows.
- Never use tiny low-contrast white text on a gold button.

### 6.3 Cards

**Sector image cards:** portrait or tall 3:4-ish frame, dark gradient from bottom, white caption, small outline icon, hover zoom maximum 1.04. Five align as a gallery on desktop. Responsive scroll or clear stacking on mobile.

**Service cards:** wide 1.5–1.8:1 image cap on an ivory/white card; icon/title/body in a clean content area; equal heights per row, consistent border and padding. Full-card link/focus whenever practical.

**Project feature:** larger photograph beside text area, secondary smaller project cards. Real client/project details must come from the company profile; illustrative image captions must not imply source imagery is documentary evidence.

**Insights:** thin-border editorial grid, image ratio approx 1.6:1, descriptive title, actual date only if published. Keep optional content sections out of public pages when no approved content exists.

### 6.4 Forms

- Form labels above fields, not placeholder-only.
- Input height **48–52px**; radius 6px; 1px border.
- Text 16px minimum to avoid mobile zoom issues.
- Error text and state visibly distinct, not colour-only.
- Real submit/load/success/error states.
- Group longer form elements logically; keep columns responsive.
- Privacy explanation near submission, without marketing fluff.

### 6.5 Decorative shapes

Topographic rings, linework, organic corner shapes and brand layers must be restrained and not interfere with important photo subjects. Use CSS/SVG assets from `07-ui`, not repeated raster textures covering every surface.

---

## 7. Media treatment: images, video, backgrounds

### 7.1 General imagery

- Photography should feel natural, documentary-like, high-quality and geographically credible.
- Warm African landscapes, ecological detail, fieldwork and built-environment imagery.
- Avoid clichéd green globes, stock handshake photos, over-saturated filters or generic sustainability stock art.
- Use `object-fit: cover` with **per-image focal-point settings**; never blindly center-crop important subjects.
- Default below-the-fold photos to lazy loading; supply intrinsic dimensions and sensible `srcset/sizes` where applicable.
- Never upscale small illustrative concept-board images and claim they are detailed 4K source photos.
- Track every image's rights and whether illustrative or an approved real project photo.

### 7.2 Approved elephant hero video

**Production asset:** `Website Assets — Hybrid Design/hero-video.mp4` (sleeping elephant at the right of an African sunset landscape). This replaces the original river-valley image as the _moving_ hero background.

**Framing contract:**

- Keep elephant's face/head, trunk and naturally resting posture **visible at the right**.
- Left area remains clear for content; use left-to-right dark gradient only as far as needed.
- No text baked into footage; all messaging is HTML over the video.
- Topographic contour overlay on right remains faint and does not cover the elephant's eye/face.
- Headline maximum width about **580–650px** on desktop; preserve ample negative space.
- On mobile, use a custom focal point; if a 16:9 cover crop sacrifices the elephant or legibility, switch to a poster-first layout or place text in a separate contrast panel.

**Playback rules:** autoplay muted, playsinline, loop if loop quality permits, pause/play control, poster from same source; remove the audio track from the production derivative; respect reduced motion and data saving; pause off-screen/hidden; don't auto-resume after manual pause. Avoid autoplay downloading large files on constrained mobile connections. On reduced motion or failed playback show a static poster without visual gaps.

**Hero type:** white with **select large words in gold**; never small low-contrast gold on a bright sky without backdrop. Eyebrow, main headline, short descriptor, and two CTAs. Scroll cue subtle. Video never blocks text rendering.

**Sizing:** desktop approximately `min-height: clamp(560px, 75svh, 820px)` depending on final nav, mobile intentionally composed rather than blindly `100vh` with a cropped elephant. Do not crop critical subject detail to satisfy a fixed height.

### 7.3 Zebra about panel

- Two-column desktop: approximately **42% copy / 58% image**, with generous gap.
- White/cream background.
- Zebra photography in elongated brand-inspired mask.
- Gold and green decorative corners near mask; light topographic lines behind, not over the animals.
- On mobile, stack copy and image while preserving a clear subject.

### 7.4 Dark-green specialist services panel

- **Immediately below zebra panel.**
- Full-bleed split: approximately **35–40% photo / 60–65% deep-green panel**.
- Photo fills column with subject positioned intentionally.
- Heading large, white, with gold small eyebrow.
- Two-column check/list of services where space permits; compact single column on mobile.
- Outlined gold check/circle icons, consistent 20–24px; no emoji checkmarks.
- Use balanced top/bottom padding and avoid an overly dense wall of services.

### 7.5 Footer imagery

Use dark sunset landscape `01-banners/footer-valley.webp` or `footer-tree-sunset.webp`, with effective gradient overlay. The scenic sectors strip should resolve into a complete accessible site footer. Do not overlay low-contrast links directly on highly detailed imagery.

---

## 8. Page-specific composition contract

The **approved homepage order is fixed**:

| #   | Section             | Visual requirement                                                   |
| --- | ------------------- | -------------------------------------------------------------------- |
| 1   | Navigation          | Full-width white navbar inspired by variation 2 / template behaviour |
| 2   | Hero                | Sleeping-elephant video, left text, contour motif                    |
| 3   | Credibility         | Crisp 4-column white proof band; _verified facts only_               |
| 4   | Sectors             | Variation 3 image tile gallery                                       |
| 5   | About               | Copy left, zebra brand-mask right                                    |
| 6   | Specialist services | **Dark-green split panel immediately after zebras**                  |
| 7   | Services cards      | Four photographic cards on clean light background                    |
| 8   | Featured projects   | One large project + compact supporting cards                         |
| 9   | Insights            | Compact editorial card row; published items only                     |
| 10  | Footer              | Scenic key-sectors strip and full site footer                        |

For supporting pages, reuse the same navbar, section headings, spacing, cards and footer—do not invent independent themes. Subpage heroes may be shorter photographic bands with high-contrast H1 and breadcrumb, but **do not reuse the elephant video on every page**. Project pages are content-first; service/sector pages can use wide supporting imagery.

---

## 9. Motion design and interactive behaviour

### 9.1 Design principles

- Motion should be nearly imperceptible until the user interacts.
- Meaning first; animation confirms action, reveals hierarchy or creates continuity.
- The hero already moves: **no floating animals, bouncing text or heavy parallax**.
- Prefer CSS transitions; use JS only for genuine interaction/state coordination.

### 9.2 Motion tokens (website decisions)

```css
:root {
  --duration-fast: 140ms;
  --duration-base: 220ms;
  --duration-slow: 420ms;
  --ease-standard: cubic-bezier(0.2, 0.7, 0.2, 1);
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- Hover button: 140–220ms.
- Card hover photo scale: 220–420ms, no more than ~1.04.
- Section reveal: 300–450ms max, subtle opacity/8–16px movement, no delay to content availability.
- Nav dropdown: ~180–240ms, keyboard accessible; no hover-only activation.
- Avoid scroll-jacking, excessive blur, shifting the navigation, infinite decorative loops.

---

## 10. Responsive specifications

| Viewport        | Layout requirement                                                           |
| --------------- | ---------------------------------------------------------------------------- |
| **≥1440px**     | Wide editorial desktop; hero/focal point remain composed; containers capped  |
| **1024–1439px** | Desktop navigation where it genuinely fits; refined column widths            |
| **768–1023px**  | Tablet; adaptive menu, 2–3-column grids where appropriate                    |
| **390–767px**   | Mobile stacked editorial; hamburger menu; cards legible                      |
| **≤389px**      | Narrow mobile; no overflows, no clipped hero title, functional touch targets |

Breakpoints are practical starting points, not arbitrary goals; adjust when content actually starts to wrap.

**Must test** widths 360, 390, 768, 1024, 1440 and 1920px. Check the landscape elephant crop in both orientations where appropriate. Do not put a full five-sector gallery into tiny five-column widths. A scrollable rail is acceptable with visible affordance and keyboard usability.

---

## 11. Accessibility and implementation quality bar

- WCAG **2.2 AA** target for contrast, keyboard/focus, forms and responsive interaction.
- Icons alone must never be the only way to understand an action.
- Minimum pointer/touch target 44×44px for primary interactive controls.
- Use real headings and semantic landmarks, not divs chosen for styling alone.
- Decorative hero video `aria-hidden` as appropriate; accessible pause/play control with stateful label.
- All major content readable with video disabled and images slow to load.
- Focus ring clearly visible on white, green and photography.
- Respect reduced-motion preference.
- Avoid heavy font loading; use system or licensed local fallbacks.
- No irrelevant third-party analytics and no template-specific external image URLs.
- No CI/CD; develop and test locally; no push until owner's explicit approval.

---

## 12. Implementation tokens (copy into source, then adapt)

```css
:root {
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --container-max: 1280px;
  --container-wide: 1360px;
  --gutter: clamp(20px, 5vw, 72px);

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  --font-size-body: 1rem;
  --font-size-small: 0.875rem;
  --font-size-eyebrow: 0.75rem;
  --font-size-display: clamp(2.65rem, 5vw, 5.5rem);
  --font-size-h1: clamp(2.35rem, 4.4vw, 4.4rem);
  --font-size-h2: clamp(2rem, 3vw, 3.1rem);
  --font-size-h3: clamp(1.15rem, 1.55vw, 1.45rem);

  --nav-height-desktop: 80px;
  --nav-height-mobile: 64px;
  --section-space: clamp(48px, 6vw, 96px);
}

.container {
  width: min(calc(100% - 2 * var(--gutter)), var(--container-max));
  margin-inline: auto;
}

.section {
  padding-block: var(--section-space);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 12px 22px;
  border: 1px solid var(--bc-gold);
  border-radius: var(--radius-sm);
  color: var(--bc-thunder);
  background: var(--bc-gold);
  font: 700 0.9375rem/1.2 var(--font-body);
  transition: background-color var(--duration-base) var(--ease-standard);
}
.btn-primary:hover {
  background: var(--color-gold-hover);
}
:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.eyebrow {
  font: 700 var(--font-size-eyebrow)/1.3 var(--font-body);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-gold-readable);
}

/* Scope this override to dark sections as needed. */
.on-dark .eyebrow {
  color: var(--bc-gold);
}
```

**Implementation note:** CSS snippets are baseline guidance, not a substitute for component-level accessibility, visual tests and responsive QA. Integrate into whichever static-first architecture is selected for the new repository.

---

## 13. Design acceptance checklist

Before considering any page visually complete, verify:

- [ ] Official brand colours are correctly implemented; derived UI colours are distinguished from brand colours.
- [ ] Avenir/Peace Sans usage follows the brand manual **and font licensing**.
- [ ] One consistent linear icon family is used; no random emoji or mixed icon styles.
- [ ] Logo proportions, colour order and approved lockups remain intact.
- [ ] Navigation matches the approved full-width white treatment and works on mobile.
- [ ] Elephant hero retains subject visibility, text contrast and functioning video fallback.
- [ ] Sector tiles, zebra image mask, and dark-green services panel match approved structure.
- [ ] Dark-green panel appears **immediately after the zebra section**.
- [ ] Cards, links, CTAs, borders and spacing are consistent throughout all pages.
- [ ] All colour combinations meet applicable contrast requirements.
- [ ] Motion is subtle and reduced-motion preferences are respected.
- [ ] Images are correctly cropped, optimised, attributed and rights-reviewed.
- [ ] Site is usable without video autoplay, with keyboard navigation, and on narrow mobile screens.
- [ ] No fabricated statistics, articles, testimonials, project outcomes or employee/project photos are implied.
- [ ] Final browser screenshots are reviewed at the defined breakpoints.
- [ ] All work and testing are local; **no CI/CD, no Actions and no push without approval**.

---

## 14. Authority and change control

**Source authority order for design questions:**

1. **2019 Brand Manual** for official logo, typeface names and palette.
2. **Owner-approved hybrid mockup** for composition and hierarchy.
3. **Owner-approved elephant hero video** for the moving hero.
4. **This `design.md`** for responsive and implementable detail where the preceding sources are silent.
5. **Holiday Tourist template** for structural/interaction inspiration only, not Black Crystal brand decisions.

When sources conflict: preserve the official identity, implement the explicitly approved new video hero, and document any unresolved choice. No redesign should override the approved composition without owner approval.

**Primary next step:** Place this `design.md` in the root of the local `Black-Crystal-Website` project and treat it as an implementation contract. Do not push it to GitHub until the owner approves the full local build.

---

## 15. Implementation notes — as built (29 October 2026)

This section records how the contract above was implemented and every place where a measured result required a refinement. Sections 1–14 are unchanged from the specification supplied by the owner.

### 15.1 Typography

- **Licensed Avenir / Peace Sans web fonts were not available.** The site self-hosts **Nunito Sans** (variable, weights 200–1000, SIL Open Font License; licence in `src/assets/fonts/OFL-NunitoSans.txt`). Of the openly licensed families it is the closest match to Avenir's proportions and to the headline letterforms in the approved mockup.
- Delivered through Astro's Fonts API (`astro.config.mjs → fonts`): a single 31 KB Latin WOFF2, preloaded, `font-display: swap`, with an automatically size-adjusted Arial fallback (measured CLS ≤ 0.002).
- Swapping in licensed Avenir later is a configuration change only. Replace the local font entry and keep the `--font-brand` CSS variable.
- Weights used: body 400; headings 800 (display 850). Peace Sans is not used.

### 15.2 Colour — contrast-driven refinements (measured, WCAG 2.2)

| Pair                                           | Ratio                       | Decision                                                                                                              |
| ---------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Nevada `#6f7072` on cream `#f6f3ec`            | 4.47 (fails)                | Muted text token `--color-muted` is a Nevada shade, **`#5f6163`** (5.6:1 on cream, 6.3:1 on white)                    |
| Golden Grass `#c6962c` on deep green `#2c4532` | 3.89 (fails for small text) | Small gold text on dark surfaces uses the tint **`#dcb35c`** (5.3:1); icons keep full Golden Grass (non-text 3:1 met) |
| Focus blue `#1f5d8c` on deep green             | 1.50 (invisible)            | Focus colour is contextual: `#1f5d8c` on light, **`#f3d792`** inside `.on-dark`                                       |
| White on Hippie Green `#6a8e4f`                | 3.75 (fails)                | White text is never placed on Hippie Green; green text on white uses `#4f6b3b` (6.0:1)                                |
| Thunder on Golden Grass (primary button)       | 6.05                        | Used as specified                                                                                                     |

The brand manual prints RGB values for Golden Grass and Mongoose that do not correspond to their HEX values (p. 8). As instructed, the **HEX values are treated as authoritative**.

### 15.3 Logo

- Header: official full-colour logo (`06-brand/black-crystal-logo-original.png`), unaltered.
- Footer (dark): the manual's official **Inverted Version** (p. 5), rendered from the vector PDF at 600 dpi. The only processing is removing the Thunder background plate (alpha derived from luminance). It is not recoloured or redrawn.

### 15.4 Layout and breakpoints actually used

- Containers: `--container-max` 1280px; `--container-wide` 1360px for full-width sections; gutter `clamp(20px, 5vw, 72px)`.
- Desktop navigation from **1024px** (the full nav fits from 1024 upward; verified at 1024 and 1440). Below that, the drawer.
- Hero composition switches at **900px**:
  - Below 900px: elephant media first, then copy on a dark panel.
  - Below 600px: 4:3 mobile video crop.
  - 900–1199px: the text column narrows so the copy stays clear of the elephant's trunk.
- Section rhythm `--section-space: clamp(52px, 6vw, 88px)`. This was tightened from the initial value after the first visual comparison with the mockup.

### 15.5 Components (source locations)

| Contract item                                      | Implementation                                                                                                                               |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Full-width navbar, active gold underline, gold CTA | `src/components/layout/Header.astro`                                                                                                         |
| Mega-menus                                         | `Header.astro` + `src/scripts/nav.ts`: hover intent (140 ms), click-to-pin, keyboard (ArrowDown/Escape), outside click and focus-out closing |
| Mobile drawer                                      | `MobileNav.astro` + `scripts/mobile-nav.ts`: modal `<dialog>`, sliding sub-panels with Back, overview links, focus return                    |
| Search                                             | `SearchDialog.astro` + `scripts/search.ts`: static index `/search-index.json`                                                                |
| Hero                                               | `src/components/home/HomeHero.astro` + `scripts/hero-video.ts`                                                                               |
| Organic brand frames                               | CSS masks `public/masks/organic-{wide,tall}.svg` (classes `.organic-wide`, `.organic-tall`)                                                  |
| Contour motif                                      | `src/components/ui/Contours.astro`: concentric rings inspired by the sedimentation layers, not the logo itself                               |
| Icons                                              | `src/data/icons.ts`: the 12 pack icons verbatim plus 33 drawn to the same 24px / 1.65 stroke style                                           |
| Buttons, eyebrows, cards, prose                    | `src/styles/global.css`                                                                                                                      |

### 15.6 Motion

- Tokens as specified. Section reveals hide only elements that are still below the fold when the script runs, so content never depends on JavaScript to appear. Reveals are disabled under `prefers-reduced-motion`.
- Card image zoom is capped at 1.04. Mega-menu transitions are 200–240 ms. The drawer uses `@starting-style` transitions.
- No parallax, no auto-rotating carousels, and nothing animated over the hero video.

### 15.7 CSP compatibility rule

Astro's Content Security Policy (`security.csp`) hashes every inline script and style. The markup therefore contains **no `style=""` attributes**. Variable values such as chart bar lengths are expressed as classes, and per-image focal points are set in component CSS.
