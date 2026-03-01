/** Supported citation content types. */
export type CitationType = 'product' | 'article' | 'service' | 'event' | 'organization' | 'generic';

export interface ProductAttributes {
  sku?: string;
  price?: string;
  currency?: string;
  'in-stock'?: string;
  brand?: string;
  category?: string;
}

export interface ArticleAttributes {
  title?: string;
  author?: string;
  published?: string;
  source?: string;
  language?: string;
}

export interface ServiceAttributes {
  provider?: string;
  availability?: string;
  region?: string;
}

export interface EventAttributes {
  date?: string;
  location?: string;
  organizer?: string;
}

export interface OrganizationAttributes {
  industry?: string;
  founded?: string;
  headquarters?: string;
}

export type KnownAttributeName =
  | keyof ProductAttributes
  | keyof ArticleAttributes
  | keyof ServiceAttributes
  | keyof EventAttributes
  | keyof OrganizationAttributes;

/** Resolved configuration from the element's attributes. */
export interface CitationConfig {
  type: CitationType;
  name?: string;
  summary?: string;
  unstyled: boolean;
  attributes: Record<string, string>;
  extraData: Record<string, string>;
}

/** React/Preact JSX props for <ax-cite>. */
export interface AxCiteAttributes {
  type?: CitationType;
  name?: string;
  summary?: string;
  data?: string;
  unstyled?: boolean | string;

  // Product
  sku?: string;
  price?: string;
  currency?: string;
  'in-stock'?: string;
  brand?: string;
  category?: string;

  // Article
  title?: string;
  author?: string;
  published?: string;
  source?: string;
  language?: string;

  // Service
  provider?: string;
  availability?: string;
  region?: string;

  // Event
  date?: string;
  location?: string;
  organizer?: string;

  // Organization
  industry?: string;
  founded?: string;
  headquarters?: string;

  // Standard HTML
  class?: string;
  id?: string;
  style?: string | Record<string, string>;
  children?: unknown;
}
