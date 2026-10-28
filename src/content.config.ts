import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const categoryId = z.enum([
  'assessment-analysis',
  'community-impact',
  'training-education',
  'specialised-services',
]);
const sectorId = z.enum(['mining', 'energy', 'infrastructure', 'housing', 'tourism']);
const portfolioGroup = z.enum([
  'mining',
  'infrastructure',
  'energy-renewable',
  'energy-conventional',
  'sustainability',
  'tourism',
  'training',
  'technical-review',
]);

/** Consultancy disciplines — one detail page each (/services/<id>/). */
const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    category: categoryId,
    order: z.number().int(),
    icon: z.string(),
    image: z.string(),
    summary: z.string().max(220),
    /** Service lines exactly as listed in Company Profile 2024, p.5 (or flyer), shown as "As listed in our profile". */
    profileListing: z.array(z.string()).default([]),
    sectors: z.array(sectorId).default([]),
    seoDescription: z.string().max(170),
  }),
});

/** The five specialist sectors (/sectors/<id>/). */
const sectors = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/sectors' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    order: z.number().int(),
    icon: z.string(),
    cardImage: z.string(),
    heroImage: z.string(),
    summary: z.string().max(240),
    considerations: z.array(z.string()).min(3),
    services: z.array(reference('services')).min(1),
    seoDescription: z.string().max(170),
  }),
});

/** Documented assignments transcribed from Company Profile 2024 (PDF pp. 7–20). */
const projects = defineCollection({
  loader: file('./src/content/projects/projects.json'),
  schema: z.object({
    title: z.string(),
    deliverable: z.string(),
    description: z.string(),
    client: z.string().optional(),
    partners: z.array(z.string()).default([]),
    location: z.string().optional(),
    country: z.string().optional(),
    start: z.number().int().min(2005).max(2026).optional(),
    end: z.number().int().min(2005).max(2026).optional(),
    portfolio: portfolioGroup,
    sectors: z.array(sectorId),
    services: z.array(reference('services')).min(1),
    standards: z.array(z.string()).default([]),
    featured: z.enum(['carousel', 'card']).optional(),
    featuredOrder: z.number().int().optional(),
    image: z.string(),
    source: z.object({ page: z.number().int(), note: z.string().optional() }),
  }),
});

/** Editorial insights. Only `approved` entries with a date and author are published in production builds. */
const insights = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/insights' }),
  schema: z
    .object({
      title: z.string(),
      summary: z.string().max(260),
      category: z.enum([
        'impact-assessment',
        'biodiversity-conservation',
        'cultural-heritage',
        'renewable-energy',
        'responsible-development',
      ]),
      image: z.string(),
      status: z.enum(['draft', 'approved']),
      publishedDate: z.coerce.date().optional(),
      author: z.string().optional(),
      readingMinutes: z.number().int().optional(),
      sources: z.array(z.string()).min(1),
      relatedServices: z.array(reference('services')).default([]),
      relatedProjects: z.array(reference('projects')).default([]),
      seoDescription: z.string().max(170),
    })
    .refine((d) => d.status === 'draft' || (d.publishedDate !== undefined && d.author !== undefined), {
      error: 'Approved insights must have a publishedDate and an author.',
    }),
});

export const collections = { services, sectors, projects, insights };
