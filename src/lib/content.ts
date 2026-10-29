import { getCollection, type CollectionEntry } from 'astro:content';
import { periodBuckets, serviceCategories, type ServiceCategoryId } from '../data/site';

export type Service = CollectionEntry<'services'>;
export type Sector = CollectionEntry<'sectors'>;
export type Project = CollectionEntry<'projects'>;
export type Insight = CollectionEntry<'insights'>;

/**
 * Draft insights are visible only in `astro dev` or review builds (BC_SHOW_DRAFTS=true).
 * A plain `npm run build` never publishes an unapproved article.
 */
export function showDrafts(): boolean {
  return import.meta.env.DEV || process.env.BC_SHOW_DRAFTS === 'true';
}

const categoryOrder = new Map(serviceCategories.map((c, i) => [c.id, i]));

export async function getServices(): Promise<Service[]> {
  const all = await getCollection('services');
  return all.sort(
    (a, b) =>
      (categoryOrder.get(a.data.category) ?? 0) - (categoryOrder.get(b.data.category) ?? 0) ||
      a.data.order - b.data.order,
  );
}

export async function getServicesByCategory(): Promise<
  { category: (typeof serviceCategories)[number]; services: Service[] }[]
> {
  const services = await getServices();
  return serviceCategories.map((category) => ({
    category,
    services: services.filter((s) => s.data.category === category.id),
  }));
}

export async function getSectors(): Promise<Sector[]> {
  return (await getCollection('sectors')).sort((a, b) => a.data.order - b.data.order);
}

/** Most recent first; entries without a year last. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort((a, b) => {
    const ay = a.data.end ?? a.data.start ?? -1;
    const by = b.data.end ?? b.data.start ?? -1;
    return by - ay || (b.data.start ?? -1) - (a.data.start ?? -1) || a.data.title.localeCompare(b.data.title);
  });
}

export async function getFeaturedProjects(slot: 'carousel' | 'card'): Promise<Project[]> {
  return (await getCollection('projects', (p) => p.data.featured === slot)).sort(
    (a, b) => (a.data.featuredOrder ?? 99) - (b.data.featuredOrder ?? 99),
  );
}

export async function getInsights(): Promise<Insight[]> {
  const drafts = showDrafts();
  const all = await getCollection('insights', (i) => drafts || i.data.status === 'approved');
  return all.sort((a, b) => {
    const ad = a.data.publishedDate?.getTime() ?? 0;
    const bd = b.data.publishedDate?.getTime() ?? 0;
    return bd - ad || a.data.title.localeCompare(b.data.title);
  });
}

export function formatPeriod(p: Project['data']): string {
  if (p.start === undefined) return 'Year not stated';
  if (p.end === undefined || p.end === p.start) return String(p.start);
  return `${p.start} – ${p.end}`;
}

/** Bucket by the most recent year of activity. */
export function periodBucket(p: Project['data']): string {
  const year = p.end ?? p.start;
  if (year === undefined) return 'unknown';
  return periodBuckets.find((b) => year >= b.from && year <= b.to)?.id ?? 'unknown';
}

export function serviceCategoryOf(services: Service[], serviceIds: string[]): ServiceCategoryId[] {
  const byId = new Map(services.map((s) => [s.id, s.data.category]));
  return [...new Set(serviceIds.map((id) => byId.get(id)).filter((c): c is ServiceCategoryId => !!c))];
}

export const insightCategoryLabels: Record<Insight['data']['category'], string> = {
  'impact-assessment': 'Impact assessment',
  'biodiversity-conservation': 'Biodiversity & conservation',
  'cultural-heritage': 'Cultural heritage',
  'renewable-energy': 'Renewable energy',
  'responsible-development': 'Responsible development',
};

export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}
