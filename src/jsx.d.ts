import type { AxCiteAttributes } from './types.js';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ax-cite': AxCiteAttributes;
    }
  }
}
