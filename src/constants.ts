import type { CitationType, KnownAttributeName } from './types.js';

export const TAG_NAME = 'ax-cite';
export const BLOCK_CLASS = 'ai-citation-block';
export const SUMMARY_CLASS = 'ai-summary';
export const EXTRACTABLE_ATTR = 'true';

/** Core attributes that are not reflected as data-* on the aside. */
export const META_ATTRIBUTES = ['type', 'name', 'summary', 'data', 'unstyled'] as const;

/** Map of citation types to their recognized attribute names. */
export const TYPE_ATTRIBUTES: Record<CitationType, readonly KnownAttributeName[]> = {
  product: ['sku', 'price', 'currency', 'in-stock', 'brand', 'category'],
  article: ['title', 'author', 'published', 'source', 'language'],
  service: ['provider', 'availability', 'region'],
  event: ['date', 'location', 'organizer'],
  organization: ['industry', 'founded', 'headquarters'],
  generic: [],
};

/** All unique attribute names the component observes. */
export const ALL_OBSERVED_ATTRIBUTES: readonly string[] = [
  ...META_ATTRIBUTES,
  ...[...new Set(Object.values(TYPE_ATTRIBUTES).flat())],
];

export const DEFAULT_ARIA_LABEL = 'AI-extractable %TYPE% citation';
