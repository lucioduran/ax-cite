import { AxCite } from './ax-cite.js';
import { TAG_NAME } from './constants.js';

// Auto-register when imported in a browser environment
if (typeof customElements !== 'undefined' && !customElements.get(TAG_NAME)) {
  customElements.define(TAG_NAME, AxCite);
}

export { AxCite } from './ax-cite.js';
export { TAG_NAME, BLOCK_CLASS, SUMMARY_CLASS } from './constants.js';
export type {
  CitationType,
  CitationConfig,
  CitationData,
  AxCiteAttributes,
  AxCiteRenderEvent,
  ProductAttributes,
  ArticleAttributes,
  ServiceAttributes,
  EventAttributes,
  OrganizationAttributes,
  PersonAttributes,
  PlaceAttributes,
  ReviewAttributes,
  FaqAttributes,
} from './types.js';

// Augment HTMLElementTagNameMap for document.querySelector type inference
declare global {
  interface HTMLElementTagNameMap {
    'ax-cite': AxCite;
  }
}

// React JSX augmentation is provided via src/jsx.d.ts
// It only activates when @types/react is installed in the consumer's project
