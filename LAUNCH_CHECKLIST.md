# Launch checklist

The owner reviewed the localhost build. On 29 October 2026 they approved publishing the code to GitHub and a Vercel preview. The **production launch** waits until every item in sections 1–3 is resolved and the owner explicitly approves it.

## 1. Owner approvals (content and facts)

- [ ] **Contact details still current** (2024 profile, p. 28):
  - [ ] 12 Boston Close, Rhodesville, Harare.
  - [ ] 35 Torquay Close, Parklands, 7441, Cape Town.
  - [ ] +263 (0) 8677 480 480.
  - [ ] +263 (0) 779 394 179.
  - [ ] **`infor@blackcrystal.co.zw`**: confirm this spelling is the intended mailbox. It is printed this way in every source.
- [ ] **EMA registration** to undertake EIAs is still current (shown on About).
- [ ] **2023 Green Business Professionals Service Award:** confirm the exact name and the awarding body.
- [ ] **Client names** on the 94 project pages may be published. They are taken from the profile; some contracts may have confidentiality terms.
- [ ] Correct wording for the **100 MW solar IFC gap review** (`harare-100mw-solar-ifc-gap-review`). The source entry is truncated.
- [ ] Approve the **service and sector page copy**, the **privacy notice** (legal review), and the **"How we work"** steps.
- [ ] **Insights:** approve, edit or withhold each of the five draft articles. To publish one, set `status: approved` and add `publishedDate` and `author`. Unapproved drafts are automatically excluded from `npm run build`.
- [ ] Decide what to do with legacy news and newsletters: they are not migrated, and their URLs redirect to /insights/.

## 2. Imagery and brand

- [ ] **Web reuse rights** for the photographs extracted from the 2024 profile (see `ASSET_PROVENANCE.md`). Check especially the images showing people or contractor branding (haul trucks, p. 7; community event, p. 25; tree planting, p. 24).
- [ ] Replace soft AI concept images with commissioned photography where possible. Priority: the **Housing** sector card, the fieldwork portrait, and the community and training cards.
- [ ] Optional: license **Avenir** (and Peace Sans if wanted) for web use and swap the font (`design.md` §15.1).
- [ ] Confirm that the hero video is cleared for public web use.

## 3. Configuration

- [ ] **Hosting decision** (`ARCHITECTURE.md → Hosting options`): a Node host, Apache static hosting plus an endpoint, Netlify/Cloudflare with the platform adapter, or Vercel. Vercel is set up for previews; production there needs a paid plan.
- [ ] **Email delivery:**
  - [ ] Create or confirm a mailbox and SMTP account.
  - [ ] Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO` and `CONTACT_FROM` on the server (never in Git).
  - [ ] Send a test enquiry and confirm it arrives with the correct Reply-To.
  - [ ] Confirm SPF/DKIM for the sending domain so enquiries are not marked as spam.
- [ ] `SITE_URL` set to the final canonical origin. If the domain differs from `blackcrystal.co.zw`, add it to `ALLOWED_HOSTS` or update `astro.config.mjs`.
- [ ] Behind a reverse proxy: set `TRUST_PROXY=true` so rate limiting uses the real client IP.
- [ ] HTTPS certificate in place. HSTS is sent, so HTTPS must stay available on the domain.

## 4. Final verification (on the machine that will build the release)

```bash
npm ci
npm run check && npm run lint && npm run test
npm run build            # production build: drafts excluded
npm run links
npm run build:review && PW_ENGINES=all npm run test:e2e   # optional full browser run
npm run build:vercel && node scripts/check-vercel-routes.mjs   # when deploying to Vercel
```

- [ ] Review the production build (`npm run build && npm run start`) in a browser, on a phone and a desktop.
- [ ] Watch the hero video for 30 seconds on a real phone and a real laptop (loop, smoothness, pause button).
- [ ] Spot-check five legacy URLs on the live host for 301s (for example `/about-us/`, `/mining-sector/`, `/our-services/`).

## 5. Publishing and deployments

- [x] The owner approved publishing to GitHub on 29 October 2026, and the local `pre-push` guard was removed.
- Changes reach `main` through pull requests, and are pushed only with the owner's approval.
- Vercel deployments are manual (`vercel build`, then `vercel deploy --prebuilt`; see `README.md`). Git deployments stay disabled in `vercel.json`.
- Do not add `.github/workflows/` or other automation without a separate decision.

## 6. After launch

- [ ] Submit `https://blackcrystal.co.zw/sitemap-index.xml` in Google Search Console and monitor crawl errors for the old URLs.
- [ ] Re-crawl the old WordPress sitemap for any URL added after the 28 October 2026 audit, and add redirects if needed.
- [ ] Keep `src/content/projects/projects.json` updated as new assignments are completed (cite the source document).
- [ ] Run `npm audit` and update dependencies periodically. Review Astro major upgrades against their upgrade guides.
