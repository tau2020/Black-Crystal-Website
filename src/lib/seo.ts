import { company, contact } from '../data/site';

/** Organization structured data built only from verified company-profile facts. */
export function organizationJsonLd(site: URL): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': new URL('/#organization', site).href,
    name: company.name,
    alternateName: company.shortName,
    slogan: company.tagline,
    url: site.href,
    logo: new URL('/brand/favicon-512.png', site).href,
    image: new URL('/brand/social-share-og.jpg', site).href,
    foundingDate: String(company.founded),
    foundingLocation: { '@type': 'Place', name: company.foundedCity },
    email: contact.email,
    telephone: contact.phones.map((p) => p.href.replace('tel:', '')),
    areaServed: ['Zimbabwe', 'South Africa', 'Southern Africa'],
    knowsAbout: [
      'Environmental and Social Impact Assessment',
      'Environmental auditing',
      'Biodiversity assessment',
      'Archaeological and cultural heritage assessment',
      'Social risk assessment',
      'Mine closure planning',
      'GIS mapping',
      'Sustainability reporting',
    ],
    address: contact.offices.map((o) => ({
      '@type': 'PostalAddress',
      streetAddress: o.lines[0],
      addressLocality: o.locality,
      ...('postalCode' in o ? { postalCode: o.postalCode } : {}),
      addressCountry: o.countryCode,
    })),
  };
}

export function breadcrumbJsonLd(
  site: URL,
  items: { name: string; href: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.href, site).href,
    })),
  };
}

export function websiteJsonLd(site: URL): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': new URL('/#website', site).href,
    url: site.href,
    name: company.name,
    publisher: { '@id': new URL('/#organization', site).href },
    inLanguage: 'en',
  };
}

export function serviceJsonLd(
  site: URL,
  name: string,
  description: string,
  path: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: new URL(path, site).href,
    provider: { '@id': new URL('/#organization', site).href },
    areaServed: ['Zimbabwe', 'South Africa'],
  };
}
