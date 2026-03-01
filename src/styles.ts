import { TAG_NAME, BLOCK_CLASS, SUMMARY_CLASS } from './constants.js';

/** Default styles injected once into <head>. Uses CSS custom properties for theming. */
export const DEFAULT_STYLES = `
${TAG_NAME} {
  --ax-cite-bg: #f8f9fa;
  --ax-cite-border: #e2e8f0;
  --ax-cite-radius: 8px;
  --ax-cite-padding: 1rem;
  --ax-cite-font-size: 0.875rem;
  --ax-cite-color: #374151;
  --ax-cite-display: block;
  display: var(--ax-cite-display);
}
${TAG_NAME} .${BLOCK_CLASS} {
  background: var(--ax-cite-bg);
  border: 1px solid var(--ax-cite-border);
  border-radius: var(--ax-cite-radius);
  padding: var(--ax-cite-padding);
  font-size: var(--ax-cite-font-size);
  color: var(--ax-cite-color);
  margin: 0;
}
${TAG_NAME} .${SUMMARY_CLASS} {
  margin: 0;
  line-height: 1.5;
}
${TAG_NAME}[unstyled] .${BLOCK_CLASS},
${TAG_NAME}[unstyled] .${SUMMARY_CLASS} {
  all: unset;
}
`;

export const STYLE_ID = 'ax-cite-styles';
