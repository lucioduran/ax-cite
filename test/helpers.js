import { Window } from 'happy-dom';

/**
 * Create a fresh DOM environment and register the ax-cite component.
 * Returns { window, document, AxCite }.
 */
export function setupDOM() {
  const window = new Window({ url: 'https://localhost' });
  const document = window.document;

  // Expose globals so the component can access DOM APIs
  globalThis.document = document;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.customElements = window.customElements;
  globalThis.CustomEvent = window.CustomEvent;

  return { window, document };
}

/**
 * Create an <ax-cite> element with given attributes and append to body.
 */
export function createElement(document, attributes = {}) {
  const el = document.createElement('ax-cite');
  for (const [key, value] of Object.entries(attributes)) {
    el.setAttribute(key, String(value));
  }
  document.body.appendChild(el);
  return el;
}
