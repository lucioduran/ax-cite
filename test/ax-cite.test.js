import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupDOM, createElement } from './helpers.js';

describe('ax-cite', () => {
  let document;

  beforeEach(async () => {
    const env = setupDOM();
    document = env.document;

    // Force fresh module evaluation with new globals
    const timestamp = Date.now() + Math.random();
    await import(`../dist/ax-cite.js?t=${timestamp}`);

    if (!globalThis.customElements.get('ax-cite')) {
      const { AxCite } = await import(`../dist/ax-cite.js?t=${timestamp}`);
      globalThis.customElements.define('ax-cite', AxCite);
    }
  });

  // ─── Registration ───────────────────────────────────────────

  describe('registration', () => {
    it('should be defined as a custom element', () => {
      assert.ok(globalThis.customElements.get('ax-cite'));
    });
  });

  // ─── Rendering ──────────────────────────────────────────────

  describe('rendering', () => {
    it('should render an aside with ai-citation-block class', () => {
      const el = createElement(document, { type: 'product', summary: 'Test' });
      const aside = el.querySelector('aside.ai-citation-block');
      assert.ok(aside);
    });

    it('should set data-ai-extractable="true"', () => {
      const el = createElement(document, { type: 'product' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-ai-extractable'), 'true');
    });

    it('should set data-type matching the type attribute', () => {
      const el = createElement(document, { type: 'article' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-type'), 'article');
    });

    it('should default type to generic when not specified', () => {
      const el = createElement(document, {});
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-type'), 'generic');
    });

    it('should render summary text in a p.ai-summary', () => {
      const el = createElement(document, { type: 'product', summary: 'Available at $99' });
      const p = el.querySelector('p.ai-summary');
      assert.ok(p);
      assert.equal(p.textContent, 'Available at $99');
    });

    it('should not render summary paragraph when no summary attribute', () => {
      const el = createElement(document, { type: 'product' });
      const p = el.querySelector('p.ai-summary');
      assert.equal(p, null);
    });

    it('should set data-name when name attribute is provided', () => {
      const el = createElement(document, { type: 'product', name: 'Espresso Machine' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-name'), 'Espresso Machine');
    });
  });

  // ─── Product Attributes ─────────────────────────────────────

  describe('product attributes', () => {
    it('should reflect sku as data-sku', () => {
      const el = createElement(document, { type: 'product', sku: '020745' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-sku'), '020745');
    });

    it('should reflect price as data-price', () => {
      const el = createElement(document, { type: 'product', price: 'USD 239' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-price'), 'USD 239');
    });

    it('should reflect in-stock as data-in-stock', () => {
      const el = createElement(document, { type: 'product', 'in-stock': 'true' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-in-stock'), 'true');
    });

    it('should reflect brand as data-brand', () => {
      const el = createElement(document, { type: 'product', brand: 'NAPPO' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-brand'), 'NAPPO');
    });

    it('should reflect currency as data-currency', () => {
      const el = createElement(document, { type: 'product', currency: 'UYU' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-currency'), 'UYU');
    });
  });

  // ─── Article Attributes ─────────────────────────────────────

  describe('article attributes', () => {
    it('should reflect author as data-author', () => {
      const el = createElement(document, { type: 'article', author: 'John Doe' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-author'), 'John Doe');
    });

    it('should reflect published as data-published', () => {
      const el = createElement(document, { type: 'article', published: '2026-03-01' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-published'), '2026-03-01');
    });

    it('should reflect source as data-source', () => {
      const el = createElement(document, { type: 'article', source: 'https://example.com' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-source'), 'https://example.com');
    });
  });

  // ─── Service Attributes ─────────────────────────────────────

  describe('service attributes', () => {
    it('should reflect provider as data-provider', () => {
      const el = createElement(document, { type: 'service', provider: 'AWS' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-provider'), 'AWS');
    });

    it('should reflect region as data-region', () => {
      const el = createElement(document, { type: 'service', region: 'us-east-1' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-region'), 'us-east-1');
    });
  });

  // ─── JSON Data Attribute ────────────────────────────────────

  describe('JSON data attribute', () => {
    it('should parse and reflect JSON data as data-* attributes', () => {
      const data = JSON.stringify({ uptime: '99.99%', tier: 'enterprise' });
      const el = createElement(document, { type: 'service', data });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-uptime'), '99.99%');
      assert.equal(aside.getAttribute('data-tier'), 'enterprise');
    });

    it('should handle invalid JSON gracefully', () => {
      const el = createElement(document, { type: 'service', data: '{invalid}' });
      const aside = el.querySelector('aside');
      assert.ok(aside);
    });

    it('should sanitize JSON keys for data-* attributes', () => {
      const data = JSON.stringify({ 'Uptime SLA': '99.99%' });
      const el = createElement(document, { type: 'service', data });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-uptime-sla'), '99.99%');
    });

    it('should ignore non-object JSON values', () => {
      const el = createElement(document, { type: 'service', data: '"just a string"' });
      const aside = el.querySelector('aside');
      assert.ok(aside);
      assert.equal(aside.getAttribute('data-ai-extractable'), 'true');
    });
  });

  // ─── Dynamic Updates ────────────────────────────────────────

  describe('dynamic updates', () => {
    it('should re-render when attributes change', () => {
      const el = createElement(document, { type: 'product', price: 'USD 100' });
      assert.equal(el.querySelector('aside').getAttribute('data-price'), 'USD 100');
      el.setAttribute('price', 'USD 200');
      assert.equal(el.querySelector('aside').getAttribute('data-price'), 'USD 200');
    });

    it('should re-render when summary changes', () => {
      const el = createElement(document, { type: 'product', summary: 'Old' });
      assert.equal(el.querySelector('p.ai-summary').textContent, 'Old');
      el.setAttribute('summary', 'New');
      assert.equal(el.querySelector('p.ai-summary').textContent, 'New');
    });

    it('should re-render when type changes', () => {
      const el = createElement(document, { type: 'product' });
      assert.equal(el.querySelector('aside').getAttribute('data-type'), 'product');
      el.setAttribute('type', 'article');
      assert.equal(el.querySelector('aside').getAttribute('data-type'), 'article');
    });
  });

  // ─── Accessibility ──────────────────────────────────────────

  describe('accessibility', () => {
    it('should have an aria-label on the aside', () => {
      const el = createElement(document, { type: 'product' });
      const aside = el.querySelector('aside');
      assert.ok(aside.getAttribute('aria-label'));
    });

    it('should include the type in the aria-label', () => {
      const el = createElement(document, { type: 'article' });
      const aside = el.querySelector('aside');
      assert.ok(aside.getAttribute('aria-label').includes('article'));
    });
  });

  // ─── Unstyled Mode ──────────────────────────────────────────

  describe('unstyled mode', () => {
    it('should accept unstyled attribute without affecting rendering', () => {
      const el = createElement(document, { type: 'product', unstyled: '', summary: 'Test' });
      assert.ok(el.hasAttribute('unstyled'));
      assert.ok(el.querySelector('aside.ai-citation-block'));
      assert.ok(el.querySelector('p.ai-summary'));
    });
  });

  // ─── Cross-type Attributes ──────────────────────────────────

  describe('cross-type attributes', () => {
    it('should reflect attributes from other types if set', () => {
      const el = createElement(document, { type: 'product', author: 'Someone' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-author'), 'Someone');
    });
  });

  // ─── Full Integration ──────────────────────────────────────

  describe('full integration', () => {
    it('should render a complete product citation', () => {
      const el = createElement(document, {
        type: 'product',
        name: 'Cafetera Espresso NAPPO',
        sku: '020745',
        price: 'USD 239',
        'in-stock': 'true',
        brand: 'NAPPO',
        summary: 'Cafetera Espresso NAPPO disponible a USD 239. En stock.',
      });

      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-ai-extractable'), 'true');
      assert.equal(aside.getAttribute('data-type'), 'product');
      assert.equal(aside.getAttribute('data-name'), 'Cafetera Espresso NAPPO');
      assert.equal(aside.getAttribute('data-sku'), '020745');
      assert.equal(aside.getAttribute('data-price'), 'USD 239');
      assert.equal(aside.getAttribute('data-in-stock'), 'true');
      assert.equal(aside.getAttribute('data-brand'), 'NAPPO');

      const p = el.querySelector('p.ai-summary');
      assert.equal(p.textContent, 'Cafetera Espresso NAPPO disponible a USD 239. En stock.');
    });
  });
});
