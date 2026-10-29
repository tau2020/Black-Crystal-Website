// Legacy WordPress URLs (audited from https://blackcrystal.co.zw/sitemap_index.xml on 28 Oct 2026)
// mapped to their closest equivalent on the new site. One source feeds:
//   - astro.config.mjs `redirects` (dev server / Node preview)
//   - scripts/postbuild.mjs → dist/client/.htaccess (Apache) and dist/client/_redirects (Netlify/Cloudflare)
// Paths that WordPress generated with a trailing zero-width space (%E2%80%8B) cannot be expressed as
// Astro route keys, so they are marked `hostOnly` and only emitted into the host-level files.

/** @type {{ from: string; to: string; hostOnly?: boolean }[]} */
export const legacyRedirects = [
  // Core pages
  { from: '/about-us/', to: '/about/' },
  { from: '/our-partners/', to: '/about/' },
  { from: '/black-crystal-2020-rebrand/', to: '/about/' },
  { from: '/corporate-social-responsibility/', to: '/about/#community' },
  { from: '/contact-us/', to: '/contact/' },
  { from: '/our-projects/', to: '/projects/' },
  { from: '/our-clients/', to: '/projects/' },
  { from: '/938-2/', to: '/' },
  { from: '/author/admin/', to: '/' },

  // Services
  { from: '/our-services/', to: '/services/' },
  { from: '/environmental-management/', to: '/services/' },
  { from: '/air-quality-testing-services-now-available/', to: '/services/' },
  { from: '/environmental-impact-assessment/', to: '/services/environmental-social-impact-assessment/' },
  { from: '/environmental-impact-assessment-2/', to: '/services/environmental-social-impact-assessment/' },
  {
    from: '/environmental-social-impact-assessments/',
    to: '/services/environmental-social-impact-assessment/',
  },
  { from: '/environmental-social-auditing/', to: '/services/environmental-social-auditing/' },
  { from: '/legal-compliance-auditing/', to: '/services/legal-compliance/' },
  { from: '/environmental-legal-reviews/', to: '/services/legal-compliance/' },
  { from: '/biodiversity-assessments/', to: '/services/biodiversity-ecological-surveys/' },
  { from: '/ecological-surveys-and-monitoring/', to: '/services/biodiversity-ecological-surveys/' },
  {
    from: '/archaeological-cultural-heritage-assessments/',
    to: '/services/archaeological-cultural-heritage/',
  },
  { from: '/social-risk-assessments/', to: '/services/social-risk-assessment/' },
  { from: '/soils-land-use-assessment/', to: '/services/soils-land-use-assessment/' },
  {
    from: '/community-health-safety-assessments%E2%80%8B/',
    to: '/services/community-health-safety/',
    hostOnly: true,
  },
  { from: '/participating-in-clean-up-campaigns/', to: '/services/community-environmental-programmes/' },
  {
    from: '/working-with-partners-in-the-up-scaling-recycling-of-waste/',
    to: '/services/community-environmental-programmes/',
  },
  {
    from: '/collection-of-e-waste-now-offered-in-zimbabwe/',
    to: '/services/community-environmental-programmes/',
  },
  {
    from: '/waste-management-waste-bins-now-available/',
    to: '/services/community-environmental-programmes/',
  },
  { from: '/environmental-awareness/', to: '/services/environmental-training-education/' },
  {
    from: '/environmental-awareness-training-to-women-and-youth/',
    to: '/services/environmental-training-education/',
  },
  {
    from: '/community-training-on-environmental-conservation%E2%80%8B/',
    to: '/services/environmental-training-education/',
    hostOnly: true,
  },
  { from: '/company-environmental-management-training/', to: '/services/environmental-training-education/' },
  { from: '/environmental-management-training/', to: '/services/environmental-training-education/' },
  {
    from: '/promoting-educational-conservation-to-children/',
    to: '/services/environmental-training-education/',
  },
  {
    from: '/environmental-awareness-through-bi-monthly-newsletter/',
    to: '/services/environmental-training-education/',
  },
  { from: '/mine-closure-planning/', to: '/services/mine-closure-planning/' },
  { from: '/geographical-information-systems-mapping/', to: '/services/gis-mapping/' },
  { from: '/environmental-sustainability/', to: '/services/sustainability-advisory/' },
  { from: '/sustainability/', to: '/services/sustainability-advisory/' },
  { from: '/sustainability-reporting/', to: '/services/sustainability-advisory/' },

  // Sectors
  { from: '/mining-sector/', to: '/sectors/mining/' },
  { from: '/conventional-energy/', to: '/sectors/energy/' },
  { from: '/infrastructure-development/', to: '/sectors/infrastructure/' },
  { from: '/tourism-sector/', to: '/sectors/tourism/' },

  // News, newsletters and categories (content not migrated; see LAUNCH_CHECKLIST.md)
  { from: '/news/', to: '/insights/' },
  { from: '/newsletters/', to: '/insights/' },
  { from: '/category/news/', to: '/insights/' },
  { from: '/category/newsletters/', to: '/insights/' },
  { from: '/category/uncategorized/', to: '/insights/' },
  { from: '/the-crystal-december-2019/', to: '/insights/' },
  { from: '/the-crystal-may-2020/', to: '/insights/' },
  { from: '/structure-and-design/', to: '/insights/' },

  // Cool Timeline entries → documented project records
  { from: '/timeline/', to: '/projects/' },
  { from: '/timeline/548/', to: '/projects/' },
  { from: '/timeline/566/', to: '/projects/' },
  { from: '/timeline/607/', to: '/projects/' },
  { from: '/timeline/unki-platinum/', to: '/projects/' },
  { from: '/timeline/unki-platinum-mines/', to: '/projects/' },
  { from: '/timeline/platinum-great-dyke-investments/', to: '/projects/great-dyke-investments-esia-ifc/' },
  {
    from: '/timeline/salene-chrome-zimbabwe-private-limited/',
    to: '/projects/salene-chrome-prospecting-esia/',
  },
  { from: '/timeline/zedtc/', to: '/projects/zetdc-tokwe-haven-sunway-powerlines-esia-ifc/' },
  { from: '/timeline/irrigation-scheme/', to: '/projects/masvingo-irrigation-scheme-scoping/' },
  {
    from: '/timeline/proposed-explosives-manufacturing-plant/',
    to: '/projects/kwekwe-explosives-plant-eia/',
  },
  { from: '/timeline/paramark-integrated-reporting/', to: '/projects/paramark-integrated-reporting-review/' },
  { from: '/timeline/umfurudzi-national-park/', to: '/projects/umfurudzi-national-park-tourism-prospectus/' },
  { from: '/timeline/zambezi-valley/', to: '/projects/zambezi-valley-tourism-facility-eia/' },
  { from: '/timeline/rift-valley-corporation/', to: '/projects/broa-biodiversity-training-workshop/' },
  { from: '/timeline/deepline-minerals/', to: '/projects/deepline-minerals-diamond-mining-review/' },
  { from: '/timeline/global-diamond-trekkers/', to: '/projects/global-diamond-trekkers-review/' },
  { from: '/timeline/enactus-world-cup/', to: '/about/#community' },
  { from: '/timeline/natural-history-museum/', to: '/about/#community' },

  // Cool Timeline "stories"
  { from: '/ctl-stories/corporate-social-responsibility/', to: '/about/#community' },
  { from: '/ctl-stories/energy-sector-projects/', to: '/sectors/energy/' },
  {
    from: '/ctl-stories/environmental-impact-assessment/',
    to: '/services/environmental-social-impact-assessment/',
  },
  {
    from: '/ctl-stories/environmental-management-training/',
    to: '/services/environmental-training-education/',
  },
  { from: '/ctl-stories/infrastructure-projects/', to: '/sectors/infrastructure/' },
  { from: '/ctl-stories/mining-sector-projects/', to: '/sectors/mining/' },
  { from: '/ctl-stories/sustainability-projects/', to: '/services/sustainability-advisory/' },
  { from: '/ctl-stories/tourism-sector-projects/', to: '/sectors/tourism/' },
];

/**
 * Astro `redirects` config: keys without trailing slash so both forms match in dev/preview.
 * @type {Record<string, { status: 301; destination: string }>}
 */
export const astroRedirects = Object.fromEntries(
  legacyRedirects
    .filter((r) => !r.hostOnly)
    .map((r) => [r.from.replace(/\/$/, ''), { status: 301, destination: r.to }]),
);
