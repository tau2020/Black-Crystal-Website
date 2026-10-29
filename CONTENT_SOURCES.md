# Content sources and approval status

## Authority

1. **Black Crystal Company Profile 2024** (`Material/Black Crystal Company Profile 2024.pdf`, 28 pp., dated October 2024): the source of truth for business facts. Page numbers below are PDF pages.
2. **Black Crystal A5 Flyer 2024:** corroborates services, sectors and contact details.
3. **Black Crystal Brand Manual 2019:** identity only (logo, palette, type).
4. The legacy website (`blackcrystal.co.zw`, WordPress) was used only to audit URLs and cross-check contact data. It is outdated and **does not override the profile**.

Code location of the facts: `src/data/site.ts`; projects in `src/content/projects/projects.json` (each record cites `source.page`).

## Company facts used on the site

| Fact (as published)                                                                                                                                                    | Source               | Status                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Established in 2005 in Harare, Zimbabwe                                                                                                                                | p. 2                 | Verified in profile                                                                                                                                                                                                                                                                         |
| Private Limited Company, Company Registration No. 928/2005                                                                                                             | p. 2                 | Verified in profile                                                                                                                                                                                                                                                                         |
| Registered as a Private Limited Company in South Africa in 2020                                                                                                        | p. 2                 | Verified in profile                                                                                                                                                                                                                                                                         |
| Team of specialists with over 40 years of **combined** professional experience                                                                                         | p. 2                 | Verified. Shown as "40+ years combined", never as a headcount                                                                                                                                                                                                                               |
| Environmental, socio-economic and cultural heritage consultancy; multidisciplinary teams drawn from a pool of specialist sub-consultants                               | pp. 2–3              | Verified                                                                                                                                                                                                                                                                                    |
| Clients: private industry, NGOs, architects, engineers, public sector                                                                                                  | p. 3                 | Verified                                                                                                                                                                                                                                                                                    |
| Specialist sectors: construction, conventional and renewable energy, housing, minerals and mining, tourism                                                             | p. 3                 | Verified                                                                                                                                                                                                                                                                                    |
| Registered with the Environmental Management Agency of Zimbabwe to undertake EIAs                                                                                      | p. 3                 | **Confirm current status** before launch (shown on About)                                                                                                                                                                                                                                   |
| Vision (2035, one million households and corporate entities) and mission                                                                                               | p. 4                 | Verified. "implantation" in the source corrected to "implementation"                                                                                                                                                                                                                        |
| Values: Pioneering, Customer Care, Excellence, Hard Work, Integrity (no corruption, no bribery), People Growth and Development, Quality Product Delivery, Time Keeping | p. 4                 | Verified                                                                                                                                                                                                                                                                                    |
| 2023 Green Business Professionals Service Award, Winner                                                                                                                | p. 26                | **Confirm** the awarding body and wording (the profile names no awarding body)                                                                                                                                                                                                              |
| CSR: Enactus/Boost (2016–2018), Natural History Museum guide book (2015), tree planting, Chisipite Science Fair (since 2011), clean-up campaigns (since 2019)          | pp. 22–25            | Verified                                                                                                                                                                                                                                                                                    |
| Offices: 12 Boston Close, Rhodesville, Harare; 35 Torquay Close, Parklands, 7441, Cape Town                                                                            | p. 28                | **Confirm** before launch                                                                                                                                                                                                                                                                   |
| Phones +263 (0) 8677 480 480 and +263 (0) 779 394 179; email `infor@blackcrystal.co.zw`                                                                                | p. 28; flyer; manual | **Confirm.** The address is spelled "infor@" consistently in all three documents and on the legacy site, so it is used as printed. The legacy site and 2019 manual list an older address (33 Bayswater Road, Highlands) and a landline (+263 242 480 865); the 2024 profile supersedes them |

## Homepage credibility band

The mockup's figures **were not used** because they are not substantiated: "20+ years", "40+ specialists & associates", "100+ projects across Southern Africa" and "Trusted by government…". The band shows only:

- 2005 (established)
- 40+ years combined experience
- Zimbabwe & South Africa (2005 / 2020)
- Multidisciplinary

The band carries the line "Source: Black Crystal Company Profile 2024".

## Services

- **Service lines:** profile p. 5 (four categories) and the flyer. Each service page lists the exact profile wording under "As listed in our company profile".
- **Website decisions** (categorisation, not claims):
  - _Technical EIA Review_ is grouped under Assessment & Analysis. It comes from the profile's Technical Review section (pp. 19–20).
  - _Sustainability Advisory & Reporting_ is grouped under Specialised Services. It comes from the profile's Sustainability section (pp. 14–15) and the flyer's "Sustainability Reporting".
  - Biodiversity Assessments + Ecological Surveys, and Legal Compliance Auditing + Environmental Legal Reviews, were combined into single pages.
- The descriptive copy (what the service is, typical scope, why it matters) is **new website copy for owner approval**. It describes general professional practice in neutral terms and makes no regulatory guarantees. The legal page includes a "not a substitute for legal opinion" note.
- Regulatory references are limited to well-established facts:
  - Zimbabwe's Environmental Management Act [Chapter 20:27] and the Environmental Management Agency.
  - The IFC Performance Standards (2012) and the Equator Principles (named in the profile).
  - The National Museums and Monuments of Zimbabwe.

## Sectors

Five sector pages, matching the profile's list. The "typical considerations" lists are general guidance, labelled "Indicative only". The Housing page cites the one documented project with a residential component (2013 mixed-use development with private apartments) and does not overstate it.

## Projects (94 records, pp. 7–20)

Transcribed record by record. Rules applied:

- **Wording:**
  - Titles are shortened to sentence case.
  - `description` keeps the profile's wording, with only these edits: missing final letters introduced by PDF text extraction were restored after checking the PDF glyphs ("Management", "Carport", "Cement", "Effluent Treatment Plant"); and "was vpart of" became "formed part of".
- **Duplicates removed:** the PEPSI 2.57 MW solar entry (p. 11) and the Cowdray Park health-centre EMP (p. 10) are each listed twice in the source.
- **Merged entry split:** on p. 12 the Schweppes 0.55 MW entry runs into the Karo Power 300 MW entry. They are recorded as two projects, with notes.
- **Truncated entry:** the 100 MW solar IFC gap review (p. 12) begins mid-sentence in the source. The opening words of the description are a reconstruction and are **flagged for confirmation** on the page itself.
- **Names as written:**
  - "ZEDTC" (p. 13) is kept as printed.
  - "Matebeleland" is spelled "Matabeleland" (the official spelling), with a note.
  - "Distribution Power Africa" (p. 12) is standardised to "Distributed Power Africa" (as on p. 11), with a note.
- **Clients:** a client is recorded only where the profile states it ("for …"). Proponents of reviewed projects (for example Deepline Minerals) are not presented as clients. 45 records name a client; 8 name partners. Client names are reproduced as published in the profile, and **disclosure on the website should be confirmed by the owner**.
- **Sectors:**
  - Assigned from the profile section the project appears in.
  - For technical reviews and training, assigned from the subject of the reviewed project (for example a review of a diamond-mining EIA counts as Mining).
  - Sustainability entries and items with no clear subject are marked "Cross-sector".
- **Periods:** as stated. One record has no year in the source ("Year not stated"). The earliest documented year is 2008; the latest is 2024.
- **Standards:** recorded only where stated: IFC standards (8 records), the IFC Performance Standards, the Integrated Reporting Framework, GRI, ISO, and the Voluntary Carbon Standard / Climate Community Biodiversity Standard validations.
- **Not invented:** outcomes, budgets, success rates, testimonials or endorsements.
- **Derived figures on /projects/:** 94 documented assignments, 2008–2024, 13 technical EIA reviews, 8 prepared to IFC standards, plus counts by section and by year. These are computed from the records and labelled as derived from the profile, with the caveat that **the profile presents a selection, not a complete record**.
- **Featured on the homepage:**
  - Carousel: Bravura (2023–24), Karo Platinum (2021–22, IFC), the Unki Mine solar EIA (2022–23) and the Chipinge RET Park (2021–22, IFC).
  - Cards: the NMSI Chikomba health-centre assessment (2024) and the Mavhuradonha report (2017).
  - The mockup's "Unki Mine Environmental and Social Impact Assessment" was **not used**, because the profile lists no project of that name.

## Insights (5 articles, all `status: draft`)

The articles are new editorial copy built only on profile facts (cited in each article's Sources list) and well-established general knowledge. They carry **no dates or authors**. They are shown with a "Draft" badge and banner in review builds, are `noindex`, and are **excluded from `npm run build`**. To publish one, set `status: approved` and add `publishedDate` and `author`; the schema enforces both.

With no approved articles, the production homepage shows "Areas of expertise" cards linking to service pages, and the Insights page shows an honest "on their way" message.

## Other copy awaiting approval

- **Homepage hero, eyebrow and CTAs:** as specified in the brief.
- **Section intros:** adapted from the mockup. Where the mockup claimed something unverified, the claim was removed.
- **Privacy notice** (`/privacy/`): draft, marked on the page as awaiting legal review. It references the Zimbabwe Cyber and Data Protection Act and South Africa's POPIA in general terms only.
- **"How we work" steps** on /services/: generic process description. The multidisciplinary-team step quotes the profile.

## Not published

- **Team members:** the profile names none, and no personnel are invented. The AI-generated people in the pack are never captioned as staff.
- **Client logos** (profile p. 21): not used without permission.
- **Legacy-site news posts and newsletters:** not migrated; their URLs redirect to /insights/.

## Owner voice note (Material, 28 Oct 2026)

Reviewed by local transcription. The design intent was a global-consultancy calibre homepage that feels publication-driven and data-rich without losing warmth. It was addressed through:

- the editorial structure;
- the data-derived "Portfolio at a glance" (Projects) and the milestone timeline (About);
- searchable, filterable project records.

No statistics beyond those derivable from the profile were added. The note's commercial details are not recorded in this repository.
