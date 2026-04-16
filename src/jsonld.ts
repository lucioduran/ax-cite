import type { CitationType, CitationConfig } from './types.js';

/** Map ax-cite types to their schema.org @type. */
const SCHEMA_TYPE_MAP: Record<CitationType, string> = {
  product: 'Product',
  article: 'Article',
  service: 'Service',
  event: 'Event',
  organization: 'Organization',
  person: 'Person',
  place: 'Place',
  review: 'Review',
  faq: 'FAQPage',
  generic: 'Thing',
};

/** Attribute-to-schema.org property mapping per type. */
const PROPERTY_MAP: Record<string, Record<string, string | ((value: string) => [string, unknown])>> = {
  product: {
    sku: 'sku',
    price: (v) => ['offers', { '@type': 'Offer', price: v }],
    currency: (v) => ['offers', { '@type': 'Offer', priceCurrency: v }],
    'in-stock': (v) => [
      'offers',
      { '@type': 'Offer', availability: v === 'true' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
    ],
    brand: (v) => ['brand', { '@type': 'Brand', name: v }],
    category: 'category',
  },
  article: {
    title: 'headline',
    author: (v) => ['author', { '@type': 'Person', name: v }],
    published: 'datePublished',
    source: 'url',
    language: 'inLanguage',
  },
  service: {
    provider: (v) => ['provider', { '@type': 'Organization', name: v }],
    availability: 'availableChannel',
    region: 'areaServed',
  },
  event: {
    date: 'startDate',
    location: (v) => ['location', { '@type': 'Place', name: v }],
    organizer: (v) => ['organizer', { '@type': 'Organization', name: v }],
  },
  organization: {
    industry: 'industry',
    founded: 'foundingDate',
    headquarters: (v) => ['address', { '@type': 'PostalAddress', addressLocality: v }],
  },
  person: {
    role: 'jobTitle',
    affiliation: (v) => ['affiliation', { '@type': 'Organization', name: v }],
    email: 'email',
    url: 'url',
  },
  place: {
    address: (v) => ['address', { '@type': 'PostalAddress', streetAddress: v }],
    latitude: 'latitude',
    longitude: 'longitude',
    country: (v) => ['address', { '@type': 'PostalAddress', addressCountry: v }],
  },
  review: {
    rating: (v) => ['reviewRating', { '@type': 'Rating', ratingValue: v }],
    'max-rating': (v) => ['reviewRating', { '@type': 'Rating', bestRating: v }],
    reviewer: (v) => ['author', { '@type': 'Person', name: v }],
    subject: (v) => ['itemReviewed', { '@type': 'Thing', name: v }],
  },
  faq: {},
  generic: {},
};

/**
 * Build a schema.org JSON-LD object from a CitationConfig.
 * Returns a plain object ready for JSON.stringify.
 */
export function buildJsonLd(config: CitationConfig): Record<string, unknown> {
  const schemaType = SCHEMA_TYPE_MAP[config.type];

  // FAQ is special — uses FAQPage with mainEntity array of Questions
  if (config.type === 'faq') {
    return buildFaqJsonLd(config);
  }

  const result: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
  };

  if (config.name) {
    result.name = config.name;
  }

  if (config.summary) {
    result.description = config.summary;
  }

  if (config.sourceUrl) {
    result.url = config.sourceUrl;
  }

  // Map type-specific attributes
  const typeMap = PROPERTY_MAP[config.type] ?? {};
  const nested: Record<string, Record<string, unknown>> = {};

  for (const [attr, value] of Object.entries(config.attributes)) {
    const mapping = typeMap[attr];
    if (!mapping) continue;

    if (typeof mapping === 'string') {
      result[mapping] = value;
    } else {
      const [prop, obj] = mapping(value);
      // Merge nested objects (e.g., multiple offer fields → single Offer)
      if (typeof obj === 'object' && obj !== null) {
        nested[prop] = { ...(nested[prop] ?? {}), ...(obj as Record<string, unknown>) };
      } else {
        result[prop] = obj;
      }
    }
  }

  // Flatten nested objects into result
  for (const [prop, obj] of Object.entries(nested)) {
    if (result[prop] && typeof result[prop] === 'object') {
      result[prop] = { ...(result[prop] as Record<string, unknown>), ...obj };
    } else {
      result[prop] = obj;
    }
  }

  // Include extra data as additionalProperty when present
  const extraEntries = Object.entries(config.extraData);
  if (extraEntries.length > 0) {
    result.additionalProperty = extraEntries.map(([k, v]) => ({
      '@type': 'PropertyValue',
      name: k,
      value: v,
    }));
  }

  return result;
}

function buildFaqJsonLd(config: CitationConfig): Record<string, unknown> {
  const result: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
  };

  if (config.name) {
    result.name = config.name;
  }

  const question = config.attributes.question;
  const answer = config.attributes.answer;

  if (question) {
    const qObj: Record<string, unknown> = {
      '@type': 'Question',
      name: question,
    };
    if (answer) {
      qObj.acceptedAnswer = {
        '@type': 'Answer',
        text: answer,
      };
    }
    result.mainEntity = [qObj];
  }

  return result;
}
