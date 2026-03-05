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

  // ─── Person Attributes ─────────────────────────────────────

  describe('person attributes', () => {
    it('should reflect role as data-role', () => {
      const el = createElement(document, { type: 'person', name: 'Jane Doe', role: 'CEO' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-role'), 'CEO');
    });

    it('should reflect affiliation as data-affiliation', () => {
      const el = createElement(document, { type: 'person', affiliation: 'Acme Corp' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-affiliation'), 'Acme Corp');
    });

    it('should reflect url as data-url', () => {
      const el = createElement(document, { type: 'person', url: 'https://example.com' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-url'), 'https://example.com');
    });
  });

  // ─── Place Attributes ─────────────────────────────────────

  describe('place attributes', () => {
    it('should reflect address as data-address', () => {
      const el = createElement(document, { type: 'place', address: '123 Main St' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-address'), '123 Main St');
    });

    it('should reflect latitude and longitude', () => {
      const el = createElement(document, { type: 'place', latitude: '-34.9', longitude: '-56.1' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-latitude'), '-34.9');
      assert.equal(aside.getAttribute('data-longitude'), '-56.1');
    });

    it('should reflect country as data-country', () => {
      const el = createElement(document, { type: 'place', country: 'Uruguay' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-country'), 'Uruguay');
    });
  });

  // ─── Review Attributes ────────────────────────────────────

  describe('review attributes', () => {
    it('should reflect rating and max-rating', () => {
      const el = createElement(document, { type: 'review', rating: '4.5', 'max-rating': '5' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-rating'), '4.5');
      assert.equal(aside.getAttribute('data-max-rating'), '5');
    });

    it('should reflect reviewer as data-reviewer', () => {
      const el = createElement(document, { type: 'review', reviewer: 'John' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-reviewer'), 'John');
    });

    it('should reflect subject as data-subject', () => {
      const el = createElement(document, { type: 'review', subject: 'Great product' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-subject'), 'Great product');
    });
  });

  // ─── FAQ Attributes ───────────────────────────────────────

  describe('faq attributes', () => {
    it('should reflect question and answer', () => {
      const el = createElement(document, { type: 'faq', question: 'What is it?', answer: 'A widget' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-question'), 'What is it?');
      assert.equal(aside.getAttribute('data-answer'), 'A widget');
    });

    it('should reflect category as data-category', () => {
      const el = createElement(document, { type: 'faq', category: 'General' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-category'), 'General');
    });
  });

  // ─── source-url Attribute ─────────────────────────────────

  describe('source-url attribute', () => {
    it('should reflect source-url as data-source-url', () => {
      const el = createElement(document, { type: 'product', 'source-url': 'https://shop.example.com/item/1' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-source-url'), 'https://shop.example.com/item/1');
    });

    it('should include source-url in toJSON output', () => {
      const el = createElement(document, { type: 'product', 'source-url': 'https://example.com' });
      const json = el.toJSON();
      assert.equal(json['source-url'], 'https://example.com');
    });
  });

  // ─── ax-hidden Mode ───────────────────────────────────────

  describe('ax-hidden mode', () => {
    it('should render aside with display:none when ax-hidden is set', () => {
      const el = createElement(document, { type: 'product', 'ax-hidden': '', summary: 'Hidden' });
      const aside = el.querySelector('aside');
      assert.ok(aside);
      assert.equal(aside.getAttribute('aria-hidden'), 'true');
      assert.equal(aside.style.display, 'none');
    });

    it('should still have data-ai-extractable when hidden', () => {
      const el = createElement(document, { type: 'product', 'ax-hidden': '', name: 'Secret' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('data-ai-extractable'), 'true');
      assert.equal(aside.getAttribute('data-name'), 'Secret');
    });

    it('should render normally without ax-hidden', () => {
      const el = createElement(document, { type: 'product', summary: 'Visible' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('aria-hidden'), null);
    });
  });

  // ─── toJSON Method ────────────────────────────────────────

  describe('toJSON()', () => {
    it('should return citation data as a plain object', () => {
      const el = createElement(document, {
        type: 'product',
        name: 'Widget',
        price: 'USD 10',
        summary: 'A widget',
      });
      const json = el.toJSON();
      assert.equal(json.type, 'product');
      assert.equal(json.name, 'Widget');
      assert.equal(json.price, 'USD 10');
      assert.equal(json.summary, 'A widget');
    });

    it('should include JSON data keys', () => {
      const data = JSON.stringify({ tier: 'premium' });
      const el = createElement(document, { type: 'service', data });
      const json = el.toJSON();
      assert.equal(json.tier, 'premium');
    });

    it('should default type to generic', () => {
      const el = createElement(document, {});
      const json = el.toJSON();
      assert.equal(json.type, 'generic');
    });
  });

  // ─── extractAll Static Method ─────────────────────────────

  describe('AxCite.extractAll()', () => {
    it('should return all citations on the page', () => {
      createElement(document, { type: 'product', name: 'A' });
      createElement(document, { type: 'article', name: 'B' });
      createElement(document, { type: 'person', name: 'C' });

      const AxCite = globalThis.customElements.get('ax-cite');
      const all = AxCite.extractAll(document);

      assert.ok(all.length >= 3);
      const names = all.map((c) => c.name);
      assert.ok(names.includes('A'));
      assert.ok(names.includes('B'));
      assert.ok(names.includes('C'));
    });
  });

  // ─── Custom Events ────────────────────────────────────────

  describe('custom events', () => {
    it('should dispatch ax-cite:render on creation', () => {
      let received = null;
      const el = document.createElement('ax-cite');
      el.setAttribute('type', 'product');
      el.setAttribute('name', 'Headphones');
      el.addEventListener(
        'ax-cite:render',
        (e) => {
          received = e.detail;
        },
        { once: true },
      );
      document.body.appendChild(el);

      assert.ok(received);
      assert.equal(received.type, 'product');
      assert.equal(received.name, 'Headphones');
    });

    it('should dispatch ax-cite:render on attribute change', () => {
      const el = createElement(document, { type: 'product', name: 'Old' });

      let received = null;
      el.addEventListener(
        'ax-cite:render',
        (e) => {
          received = e.detail;
        },
        { once: true },
      );

      el.setAttribute('name', 'New');

      assert.ok(received);
      assert.equal(received.name, 'New');
    });
  });

  // ─── Lang Propagation ────────────────────────────────────

  describe('lang propagation', () => {
    it('should propagate lang to the inner aside', () => {
      const el = createElement(document, { type: 'product', lang: 'es', summary: 'Hola' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('lang'), 'es');
    });

    it('should not set lang on aside when not specified', () => {
      const el = createElement(document, { type: 'product' });
      const aside = el.querySelector('aside');
      assert.equal(aside.getAttribute('lang'), null);
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
