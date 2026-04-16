import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupDOM, createElement } from './helpers.js';

describe('jsonld', () => {
  let document;

  beforeEach(async () => {
    const env = setupDOM();
    document = env.document;

    const timestamp = Date.now() + Math.random();
    await import(`../dist/ax-cite.js?t=${timestamp}`);

    if (!globalThis.customElements.get('ax-cite')) {
      const { AxCite } = await import(`../dist/ax-cite.js?t=${timestamp}`);
      globalThis.customElements.define('ax-cite', AxCite);
    }
  });

  /** Parse the JSON-LD script content from an element. */
  function getJsonLd(el) {
    const script = el.querySelector('script[type="application/ld+json"]');
    assert.ok(script, 'Expected a <script type="application/ld+json"> element');
    return JSON.parse(script.textContent);
  }

  // ─── Basic Behavior ────────────────────────────────────────

  describe('basic behavior', () => {
    it('should not inject JSON-LD without the jsonld attribute', () => {
      const el = createElement(document, { type: 'product', name: 'Widget' });
      const script = el.querySelector('script[type="application/ld+json"]');
      assert.equal(script, null);
    });

    it('should inject JSON-LD when jsonld attribute is present', () => {
      const el = createElement(document, { type: 'product', name: 'Widget', jsonld: '' });
      const script = el.querySelector('script[type="application/ld+json"]');
      assert.ok(script);
    });

    it('should set @context to https://schema.org', () => {
      const el = createElement(document, { type: 'product', name: 'W', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld['@context'], 'https://schema.org');
    });

    it('should include name and description', () => {
      const el = createElement(document, { type: 'product', name: 'Widget', summary: 'A great widget', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.name, 'Widget');
      assert.equal(ld.description, 'A great widget');
    });

    it('should include source-url as url', () => {
      const el = createElement(document, {
        type: 'product',
        name: 'Widget',
        'source-url': 'https://shop.example.com/widget',
        jsonld: '',
      });
      const ld = getJsonLd(el);
      assert.equal(ld.url, 'https://shop.example.com/widget');
    });

    it('should update JSON-LD when attributes change', () => {
      const el = createElement(document, { type: 'product', name: 'Old', jsonld: '' });
      assert.equal(getJsonLd(el).name, 'Old');
      el.setAttribute('name', 'New');
      assert.equal(getJsonLd(el).name, 'New');
    });

    it('should remove JSON-LD script when jsonld attribute is removed', () => {
      const el = createElement(document, { type: 'product', name: 'W', jsonld: '' });
      assert.ok(el.querySelector('script[type="application/ld+json"]'));
      el.removeAttribute('jsonld');
      assert.equal(el.querySelector('script[type="application/ld+json"]'), null);
    });
  });

  // ─── Type Mapping ──────────────────────────────────────────

  describe('type mapping', () => {
    const typeMappings = [
      ['product', 'Product'],
      ['article', 'Article'],
      ['service', 'Service'],
      ['event', 'Event'],
      ['organization', 'Organization'],
      ['person', 'Person'],
      ['place', 'Place'],
      ['review', 'Review'],
      ['generic', 'Thing'],
    ];

    for (const [axType, schemaType] of typeMappings) {
      it(`should map type="${axType}" to @type="${schemaType}"`, () => {
        const el = createElement(document, { type: axType, name: 'Test', jsonld: '' });
        const ld = getJsonLd(el);
        assert.equal(ld['@type'], schemaType);
      });
    }

    it('should map type="faq" to @type="FAQPage"', () => {
      const el = createElement(document, { type: 'faq', name: 'FAQ', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld['@type'], 'FAQPage');
    });
  });

  // ─── Product Attributes ────────────────────────────────────

  describe('product JSON-LD', () => {
    it('should map sku to sku', () => {
      const el = createElement(document, { type: 'product', sku: 'ABC123', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.sku, 'ABC123');
    });

    it('should map brand to Brand object', () => {
      const el = createElement(document, { type: 'product', brand: 'NAPPO', jsonld: '' });
      const ld = getJsonLd(el);
      assert.deepEqual(ld.brand, { '@type': 'Brand', name: 'NAPPO' });
    });

    it('should map price to Offer object', () => {
      const el = createElement(document, { type: 'product', price: '239', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.offers['@type'], 'Offer');
      assert.equal(ld.offers.price, '239');
    });

    it('should merge price and currency into single Offer', () => {
      const el = createElement(document, { type: 'product', price: '239', currency: 'USD', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.offers.price, '239');
      assert.equal(ld.offers.priceCurrency, 'USD');
    });

    it('should map in-stock=true to InStock availability', () => {
      const el = createElement(document, { type: 'product', 'in-stock': 'true', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.offers.availability, 'https://schema.org/InStock');
    });

    it('should map in-stock=false to OutOfStock availability', () => {
      const el = createElement(document, { type: 'product', 'in-stock': 'false', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.offers.availability, 'https://schema.org/OutOfStock');
    });

    it('should map category to category', () => {
      const el = createElement(document, { type: 'product', category: 'Electronics', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.category, 'Electronics');
    });
  });

  // ─── Article Attributes ────────────────────────────────────

  describe('article JSON-LD', () => {
    it('should map title to headline', () => {
      const el = createElement(document, { type: 'article', title: 'AI Trends', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.headline, 'AI Trends');
    });

    it('should map author to Person object', () => {
      const el = createElement(document, { type: 'article', author: 'Jane Doe', jsonld: '' });
      const ld = getJsonLd(el);
      assert.deepEqual(ld.author, { '@type': 'Person', name: 'Jane Doe' });
    });

    it('should map published to datePublished', () => {
      const el = createElement(document, { type: 'article', published: '2026-04-16', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.datePublished, '2026-04-16');
    });

    it('should map language to inLanguage', () => {
      const el = createElement(document, { type: 'article', language: 'en', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.inLanguage, 'en');
    });
  });

  // ─── Event Attributes ──────────────────────────────────────

  describe('event JSON-LD', () => {
    it('should map date to startDate', () => {
      const el = createElement(document, { type: 'event', date: '2026-06-15', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.startDate, '2026-06-15');
    });

    it('should map location to Place object', () => {
      const el = createElement(document, { type: 'event', location: 'Convention Center', jsonld: '' });
      const ld = getJsonLd(el);
      assert.deepEqual(ld.location, { '@type': 'Place', name: 'Convention Center' });
    });
  });

  // ─── Person Attributes ─────────────────────────────────────

  describe('person JSON-LD', () => {
    it('should map role to jobTitle', () => {
      const el = createElement(document, { type: 'person', name: 'Jane', role: 'CTO', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.jobTitle, 'CTO');
    });

    it('should map affiliation to Organization object', () => {
      const el = createElement(document, { type: 'person', affiliation: 'Acme Corp', jsonld: '' });
      const ld = getJsonLd(el);
      assert.deepEqual(ld.affiliation, { '@type': 'Organization', name: 'Acme Corp' });
    });

    it('should map email and url directly', () => {
      const el = createElement(document, { type: 'person', email: 'j@example.com', url: 'https://example.com', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.email, 'j@example.com');
      assert.equal(ld.url, 'https://example.com');
    });
  });

  // ─── Place Attributes ──────────────────────────────────────

  describe('place JSON-LD', () => {
    it('should map latitude and longitude', () => {
      const el = createElement(document, { type: 'place', latitude: '-34.9', longitude: '-56.1', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.latitude, '-34.9');
      assert.equal(ld.longitude, '-56.1');
    });

    it('should merge address and country into PostalAddress', () => {
      const el = createElement(document, { type: 'place', address: '123 Main St', country: 'Uruguay', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.address['@type'], 'PostalAddress');
      assert.equal(ld.address.streetAddress, '123 Main St');
      assert.equal(ld.address.addressCountry, 'Uruguay');
    });
  });

  // ─── Review Attributes ─────────────────────────────────────

  describe('review JSON-LD', () => {
    it('should map rating and max-rating into Rating object', () => {
      const el = createElement(document, { type: 'review', rating: '4.5', 'max-rating': '5', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.reviewRating['@type'], 'Rating');
      assert.equal(ld.reviewRating.ratingValue, '4.5');
      assert.equal(ld.reviewRating.bestRating, '5');
    });

    it('should map reviewer to Person author', () => {
      const el = createElement(document, { type: 'review', reviewer: 'John', jsonld: '' });
      const ld = getJsonLd(el);
      assert.deepEqual(ld.author, { '@type': 'Person', name: 'John' });
    });

    it('should map subject to itemReviewed', () => {
      const el = createElement(document, { type: 'review', subject: 'Great coffee', jsonld: '' });
      const ld = getJsonLd(el);
      assert.deepEqual(ld.itemReviewed, { '@type': 'Thing', name: 'Great coffee' });
    });
  });

  // ─── FAQ ───────────────────────────────────────────────────

  describe('faq JSON-LD', () => {
    it('should create FAQPage with Question and Answer', () => {
      const el = createElement(document, {
        type: 'faq',
        question: 'What is AX?',
        answer: 'AI Agent Experience',
        jsonld: '',
      });
      const ld = getJsonLd(el);
      assert.equal(ld['@type'], 'FAQPage');
      assert.equal(ld.mainEntity.length, 1);
      assert.equal(ld.mainEntity[0]['@type'], 'Question');
      assert.equal(ld.mainEntity[0].name, 'What is AX?');
      assert.equal(ld.mainEntity[0].acceptedAnswer['@type'], 'Answer');
      assert.equal(ld.mainEntity[0].acceptedAnswer.text, 'AI Agent Experience');
    });

    it('should handle question without answer', () => {
      const el = createElement(document, { type: 'faq', question: 'Why?', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld.mainEntity[0].name, 'Why?');
      assert.equal(ld.mainEntity[0].acceptedAnswer, undefined);
    });
  });

  // ─── Generic Type with Extra Data ─────────────────────────

  describe('generic JSON-LD', () => {
    it('should map generic type to Thing', () => {
      const el = createElement(document, { type: 'generic', name: 'Stuff', jsonld: '' });
      const ld = getJsonLd(el);
      assert.equal(ld['@type'], 'Thing');
    });

    it('should include extra data as additionalProperty', () => {
      const data = JSON.stringify({ uptime: '99.99%', tier: 'enterprise' });
      const el = createElement(document, { type: 'generic', name: 'Hosting', data, jsonld: '' });
      const ld = getJsonLd(el);
      assert.ok(ld.additionalProperty);
      assert.equal(ld.additionalProperty.length, 2);
      assert.equal(ld.additionalProperty[0].name, 'uptime');
      assert.equal(ld.additionalProperty[0].value, '99.99%');
      assert.equal(ld.additionalProperty[1].name, 'tier');
      assert.equal(ld.additionalProperty[1].value, 'enterprise');
    });
  });
});
