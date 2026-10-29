import type { APIRoute } from 'astro';
import {
  formatPeriod,
  getInsights,
  getProjects,
  getSectors,
  getServices,
  insightCategoryLabels,
} from '../lib/content';
import type { SearchEntry } from '../scripts/search';

export const GET: APIRoute = async () => {
  const pages: SearchEntry[] = [
    {
      t: 'About Black Crystal',
      u: '/about/',
      k: 'Page',
      d: 'Our story, vision and mission, values, milestones, community work and offices.',
      x: 'company history 2005 harare values mission vision csr',
    },
    {
      t: 'Services',
      u: '/services/',
      k: 'Page',
      d: 'Assessment & Analysis, Community Impact, Training & Education and Specialised Services.',
    },
    { t: 'Sectors', u: '/sectors/', k: 'Page', d: 'Mining, energy, infrastructure, housing and tourism.' },
    {
      t: 'Project portfolio',
      u: '/projects/',
      k: 'Page',
      d: 'Documented assignments from the 2024 company profile.',
      x: 'portfolio case studies experience',
    },
    {
      t: 'Insights',
      u: '/insights/',
      k: 'Page',
      d: 'Perspectives on assessment, conservation, heritage and responsible development.',
    },
    {
      t: 'Contact',
      u: '/contact/',
      k: 'Page',
      d: 'Discuss your project — offices in Harare and Cape Town.',
      x: 'email phone address enquiry office zimbabwe south africa',
    },
    {
      t: 'Privacy notice',
      u: '/privacy/',
      k: 'Page',
      d: 'How we handle personal information sent through this website.',
    },
  ];
  const services = (await getServices()).map<SearchEntry>((s) => ({
    t: s.data.title,
    u: `/services/${s.id}/`,
    k: 'Service',
    d: s.data.summary,
    x: [s.data.shortTitle, ...s.data.profileListing].join(' '),
  }));
  const sectors = (await getSectors()).map<SearchEntry>((s) => ({
    t: s.data.title,
    u: `/sectors/${s.id}/`,
    k: 'Sector',
    d: s.data.summary,
    x: s.data.considerations.join(' '),
  }));
  const projects = (await getProjects()).map<SearchEntry>((p) => ({
    t: p.data.title,
    u: `/projects/${p.id}/`,
    k: 'Project',
    d: [p.data.client, p.data.location, formatPeriod(p.data)].filter(Boolean).join(' · '),
    x: [p.data.description, p.data.deliverable, ...p.data.partners, ...p.data.standards, p.data.country]
      .filter(Boolean)
      .join(' '),
  }));
  const insights = (await getInsights()).map<SearchEntry>((i) => ({
    t: i.data.title,
    u: `/insights/${i.id}/`,
    k: 'Insight',
    d: i.data.summary,
    x: insightCategoryLabels[i.data.category],
  }));
  return new Response(JSON.stringify([...pages, ...services, ...sectors, ...insights, ...projects]), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
