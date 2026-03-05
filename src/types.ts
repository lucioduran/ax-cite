/** Supported citation content types. */
export type CitationType =
  | 'product'
  | 'article'
  | 'service'
  | 'event'
  | 'organization'
  | 'person'
  | 'place'
  | 'review'
  | 'faq'
  | 'generic';

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

export interface PersonAttributes {
  role?: string;
  affiliation?: string;
  email?: string;
  url?: string;
}

export interface PlaceAttributes {
  address?: string;
  latitude?: string;
  longitude?: string;
  country?: string;
}

export interface ReviewAttributes {
  rating?: string;
  reviewer?: string;
  'max-rating'?: string;
  subject?: string;
}

export interface FaqAttributes {
  question?: string;
  answer?: string;
  category?: string;
}

export type KnownAttributeName =
  | keyof ProductAttributes
  | keyof ArticleAttributes
  | keyof ServiceAttributes
  | keyof EventAttributes
  | keyof OrganizationAttributes
  | keyof PersonAttributes
  | keyof PlaceAttributes
  | keyof ReviewAttributes
  | keyof FaqAttributes;

/** Resolved configuration from the element's attributes. */
export interface CitationConfig {
  type: CitationType;
  name?: string;
  summary?: string;
  sourceUrl?: string;
  unstyled: boolean;
  axHidden: boolean;
  attributes: Record<string, string>;
  extraData: Record<string, string>;
}

/** Detail payload for the `ax-cite:render` custom event. */
export type CitationData = Record<string, string>;

/** Custom event dispatched when an ax-cite element renders. */
export interface AxCiteRenderEvent extends CustomEvent<CitationData> {
  readonly detail: CitationData;
}

/** React/Preact JSX props for <ax-cite>. */
export interface AxCiteAttributes {
  type?: CitationType;
  name?: string;
  summary?: string;
  data?: string;
  unstyled?: boolean | string;
  'source-url'?: string;
  'ax-hidden'?: boolean | string;

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

  // Person
  role?: string;
  affiliation?: string;
  email?: string;
  url?: string;

  // Place
  address?: string;
  latitude?: string;
  longitude?: string;
  country?: string;

  // Review
  rating?: string;
  reviewer?: string;
  'max-rating'?: string;
  subject?: string;

  // FAQ
  question?: string;
  answer?: string;
  // category already listed under Product

  // Standard HTML
  class?: string;
  id?: string;
  lang?: string;
  style?: string | Record<string, string>;
  children?: unknown;
}
