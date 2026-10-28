// Verified company facts. Source of truth: "Black Crystal Company Profile 2024.pdf" (PDF page numbers below).
// Items marked `confirm` are traceable to the profile but must be re-confirmed by Black Crystal before launch
// (see CONTENT_SOURCES.md and LAUNCH_CHECKLIST.md).

export const company = {
  name: 'Black Crystal Consulting',
  shortName: 'Black Crystal',
  tagline: 'Caring for the environment beyond today',
  founded: 2005, // p.2
  foundedCity: 'Harare, Zimbabwe', // p.2
  registrationNumber: '928/2005', // p.2 — Private Limited Company (Zimbabwe)
  southAfricaRegistered: 2020, // p.2 — Private Limited Company (South Africa)
  combinedExperience: 'over 40 years', // p.2 — combined professional experience of the specialist team
  emaRegistration: {
    // p.3 — confirm current registration status before launch
    text: 'Registered with the Environmental Management Agency (EMA) of Zimbabwe to undertake Environmental Impact Assessments.',
    confirm: true,
  },
  award: {
    // p.26 — confirm awarding body and wording before launch
    year: 2023,
    title: 'Green Business Professionals Service Award',
    result: 'Winner',
    confirm: true,
  },
  website: 'https://blackcrystal.co.zw',
} as const;

export const about = {
  // p.2 (lightly edited for web; meaning unchanged)
  intro:
    'Established in 2005 in Harare, Zimbabwe, Black Crystal Consulting is an environmental, socio-economic and cultural heritage consultancy with a team of specialists offering over 40 years of combined professional experience.',
  approach:
    'We provide innovative and sustainable solutions for environmental management, advising clients on the sustainable use of natural resources and on how to manage environmental, archaeological and social risks during the implementation of development projects — from water projects, roads, dams and irrigation to office complexes — through tools such as Environmental & Social Impact Assessments.',
  teams:
    'One of our key strengths is the ability to assemble multidisciplinary teams, drawn from a pool of established specialist sub-consultants, to work on complex, multidisciplinary projects.',
  clients:
    'Our consulting services are delivered to private industry, non-governmental organisations, architects, engineers and public-sector clients.',
  commitment:
    'All team members have a personal commitment to the principles of sustainable development and to the improvement of the environment.',
  // p.4 ("implantation" in the source corrected to "implementation")
  vision:
    'By 2035, to have motivated sustainable living — including the conservation of natural resources, the reuse and recycling of resources and the use of renewable energy — in one million households and corporate entities.',
  mission:
    'To equip our clients, and the communities we work with, to conserve the global environment for future generations through the sustainable use of resources and by managing social risks during the implementation of development projects.',
  values: [
    { title: 'Pioneering', icon: 'compass' },
    { title: 'Customer care', icon: 'heart' },
    { title: 'Excellence', icon: 'award' },
    { title: 'Hard work', icon: 'zap' },
    { title: 'Integrity', detail: 'No corruption. No bribery.', icon: 'shield' },
    { title: 'People growth and development', icon: 'sprout' },
    { title: 'Quality product delivery', icon: 'badge-check' },
    { title: 'Time keeping', icon: 'clock' },
  ],
} as const;

export const contact = {
  // p.28 (2024 profile). The 2019 brand manual and the legacy website list an older Highlands address;
  // the 2024 profile supersedes it. All details must be confirmed before launch.
  confirm: true,
  email: 'infor@blackcrystal.co.zw', // spelled "infor@" consistently in the 2019 manual, 2024 flyer and 2024 profile
  phones: [
    { label: '+263 (0) 8677 480 480', href: 'tel:+2638677480480', note: 'Office (VoIP)' },
    { label: '+263 (0) 779 394 179', href: 'tel:+263779394179', note: 'Mobile' },
  ],
  offices: [
    {
      id: 'zimbabwe',
      country: 'Zimbabwe',
      role: 'Head office',
      lines: ['12 Boston Close', 'Rhodesville', 'Harare'],
      locality: 'Harare',
      countryCode: 'ZW',
      mapQuery: '12 Boston Close, Rhodesville, Harare, Zimbabwe',
    },
    {
      id: 'south-africa',
      country: 'South Africa',
      role: 'South African office',
      lines: ['35 Torquay Close', 'Parklands, 7441', 'Cape Town'],
      locality: 'Cape Town',
      postalCode: '7441',
      countryCode: 'ZA',
      mapQuery: '35 Torquay Close, Parklands, Cape Town 7441, South Africa',
    },
  ],
} as const;

export const credibility = [
  { value: '2005', label: 'Established in Harare, Zimbabwe', icon: 'calendar' },
  { value: '40+ years', label: 'Combined professional experience across our specialist team', icon: 'users' },
  {
    value: 'Zimbabwe & South Africa',
    label: 'Registered in Zimbabwe (2005) and South Africa (2020)',
    icon: 'map',
  },
  {
    value: 'Multidisciplinary',
    label: 'Environmental, social, ecological and heritage expertise',
    icon: 'layers',
  },
] as const;

export const serviceCategories = [
  {
    id: 'assessment-analysis',
    title: 'Assessment & Analysis',
    icon: 'leaf',
    image: 'service-assessment',
    summary:
      'ESIAs, environmental and social audits, biodiversity, heritage, soils and social risk assessments.',
  },
  {
    id: 'community-impact',
    title: 'Community Impact',
    icon: 'users',
    image: 'service-community',
    summary: 'Community health and safety assessments, clean-up campaigns and recycling partnerships.',
  },
  {
    id: 'training-education',
    title: 'Training & Education',
    icon: 'book',
    image: 'service-training',
    summary: 'Environmental awareness, community conservation and company environmental management training.',
  },
  {
    id: 'specialised-services',
    title: 'Specialised Services',
    icon: 'cog',
    image: 'service-specialised',
    summary: 'Mine closure planning, GIS mapping and sustainability advisory and reporting.',
  },
] as const;

export type ServiceCategoryId = (typeof serviceCategories)[number]['id'];
export const serviceCategoryIds = serviceCategories.map((c) => c.id) as [
  ServiceCategoryId,
  ...ServiceCategoryId[],
];

export const sectorIds = ['mining', 'energy', 'infrastructure', 'housing', 'tourism'] as const;
export type SectorId = (typeof sectorIds)[number];
export const sectorShortLabels: Record<SectorId, string> = {
  mining: 'Mining',
  energy: 'Energy',
  infrastructure: 'Infrastructure',
  housing: 'Housing',
  tourism: 'Tourism',
};

export const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/', menu: 'about' },
  { label: 'Services', href: '/services/', menu: 'services' },
  { label: 'Sectors', href: '/sectors/', menu: 'sectors' },
  { label: 'Projects', href: '/projects/', menu: 'projects' },
  { label: 'Insights', href: '/insights/' },
] as const;

export const aboutLinks = [
  { label: 'Our story', href: '/about/#story' },
  { label: 'Vision & mission', href: '/about/#vision' },
  { label: 'Our values', href: '/about/#values' },
  { label: 'Milestones', href: '/about/#milestones' },
  { label: 'Community & CSR', href: '/about/#community' },
  { label: 'Our offices', href: '/about/#offices' },
] as const;

/** Profile sections used to group the documented project list (p.6–20). */
export const portfolioGroups = {
  mining: 'Mining sector',
  infrastructure: 'Infrastructure development',
  'energy-renewable': 'Renewable energy',
  'energy-conventional': 'Conventional energy',
  sustainability: 'Sustainability',
  tourism: 'Tourism',
  training: 'Training programmes',
  'technical-review': 'Technical review',
} as const;
export type PortfolioGroup = keyof typeof portfolioGroups;

export const periodBuckets = [
  { id: '2020-2024', label: '2020 – 2024', from: 2020, to: 2024 },
  { id: '2015-2019', label: '2015 – 2019', from: 2015, to: 2019 },
  { id: '2010-2014', label: '2010 – 2014', from: 2010, to: 2014 },
  { id: '2005-2009', label: '2005 – 2009', from: 2005, to: 2009 },
] as const;
