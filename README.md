<div align="center">

# ax-cite

**Ultra-lightweight web component for AI-extractable citation blocks**

[![CI](https://github.com/lucioduran/ax-cite/actions/workflows/ci.yml/badge.svg)](https://github.com/lucioduran/ax-cite/actions)
[![npm](https://img.shields.io/npm/v/ax-cite)](https://www.npmjs.com/package/ax-cite)
[![license](https://img.shields.io/npm/l/ax-cite)](LICENSE)
[![bundle size](https://img.shields.io/badge/gzipped-~2.8KB-brightgreen)]()

</div>

---

Make your content extractable by AI agents. `ax-cite` renders semantic `<aside>` blocks with `data-*` attributes that AI crawlers can parse and understand.

```html
<ax-cite type="product" name="Espresso Machine" price="USD 239"
         in-stock="true" summary="Available at USD 239. Ships free.">
</ax-cite>
```

Renders:

```html
<aside class="ai-citation-block" data-ai-extractable="true"
       data-type="product" data-name="Espresso Machine"
       data-price="USD 239" data-in-stock="true"
       aria-label="AI-extractable product citation">
  <p class="ai-summary">Available at USD 239. Ships free.</p>
</aside>
```

## Part of the AX Ecosystem

| Package | Purpose |
|---------|---------|
| [ax-audit](https://github.com/lucioduran/ax-audit) | Audit websites for AI Agent Experience readiness |
| [ax-init](https://github.com/lucioduran/ax-init) | Generate AI-readiness files (llms.txt, robots.txt, etc.) |
| **ax-cite** | Embed AI-extractable structured data in your pages |

## Install

```bash
npm install ax-cite
```

## Usage

### HTML (via CDN or bundler)

```html
<script type="module">
  import 'ax-cite';
</script>

<ax-cite type="product" name="Wireless Headphones"
         sku="WH-1000" price="USD 349" in-stock="true"
         summary="Wireless Headphones available at USD 349.">
</ax-cite>
```

### React / Preact

```tsx
import 'ax-cite';

function ProductCard() {
  return (
    <ax-cite
      type="product"
      name="Wireless Headphones"
      price="USD 349"
      in-stock="true"
      summary="Wireless Headphones available at USD 349."
    />
  );
}
```

### Vue

```vue
<template>
  <ax-cite type="product" name="Wireless Headphones"
           price="USD 349" summary="Available at USD 349." />
</template>

<script setup>
import 'ax-cite';
</script>
```

### JavaScript (programmatic)

```typescript
import { AxCite } from 'ax-cite';

const el = document.createElement('ax-cite') as AxCite;
el.type = 'product';
el.name = 'Wireless Headphones';
el.setAttribute('price', 'USD 349');
el.summary = 'Available at USD 349.';
document.body.appendChild(el);
```

## Citation Types

### Product

```html
<ax-cite type="product" name="..." sku="..." price="..." currency="..."
         in-stock="..." brand="..." category="..." summary="...">
</ax-cite>
```

### Article

```html
<ax-cite type="article" name="..." title="..." author="..."
         published="..." source="..." language="..." summary="...">
</ax-cite>
```

### Service

```html
<ax-cite type="service" name="..." provider="..."
         availability="..." region="..." summary="...">
</ax-cite>
```

### Event

```html
<ax-cite type="event" name="..." date="..."
         location="..." organizer="..." summary="...">
</ax-cite>
```

### Organization

```html
<ax-cite type="organization" name="..." industry="..."
         founded="..." headquarters="..." summary="...">
</ax-cite>
```

### Person

```html
<ax-cite type="person" name="..." role="..." affiliation="..."
         email="..." url="..." summary="...">
</ax-cite>
```

### Place

```html
<ax-cite type="place" name="..." address="..." latitude="..."
         longitude="..." country="..." summary="...">
</ax-cite>
```

### Review

```html
<ax-cite type="review" name="..." rating="..." max-rating="..."
         reviewer="..." subject="..." summary="...">
</ax-cite>
```

### FAQ

```html
<ax-cite type="faq" name="..." question="..." answer="..."
         category="..." summary="...">
</ax-cite>
```

### Generic (with JSON data)

```html
<ax-cite type="generic" name="Cloud Hosting"
         data='{"provider":"AWS","region":"us-east-1","uptime":"99.99%"}'
         summary="AWS hosting with 99.99% uptime.">
</ax-cite>
```

The `data` attribute accepts a JSON object. Each key becomes a `data-*` attribute on the rendered `<aside>`.

## Theming

Default styles use CSS custom properties:

```css
ax-cite {
  --ax-cite-bg: #1a1a2e;
  --ax-cite-color: #eeeeee;
  --ax-cite-border: #333333;
  --ax-cite-radius: 12px;
  --ax-cite-padding: 1.5rem;
  --ax-cite-font-size: 1rem;
  --ax-cite-display: block;
}
```

To disable all default styles:

```html
<ax-cite unstyled type="product" ...></ax-cite>
```

## Hidden Mode

Use `ax-hidden` to embed machine-readable data without any visible output. The `<aside>` is still present in the DOM (for AI crawlers) but hidden from users.

```html
<ax-cite ax-hidden type="product" name="Widget" price="USD 10"
         summary="Widget available at USD 10.">
</ax-cite>
```

## Source Attribution

Add `source-url` to any citation to link back to the original data source:

```html
<ax-cite type="article" name="AI Trends" author="Jane Doe"
         source-url="https://example.com/ai-trends"
         summary="An article about AI trends.">
</ax-cite>
```

## Programmatic API

### `toJSON()`

Extract citation data as a plain object:

```typescript
const el = document.querySelector('ax-cite');
console.log(el.toJSON());
// { type: 'product', name: 'Widget', price: 'USD 10', ... }
```

### `AxCite.extractAll(root?)`

Extract all citations from a page (or a subtree):

```typescript
import { AxCite } from 'ax-cite';

const all = AxCite.extractAll();
// [{ type: 'product', ... }, { type: 'article', ... }]

// Or scope to a container:
const section = document.getElementById('products');
const products = AxCite.extractAll(section);
```

### Events

The component dispatches `ax-cite:render` (bubbles) whenever it renders or updates:

```typescript
document.addEventListener('ax-cite:render', (e) => {
  console.log('Citation rendered:', e.detail);
});
```

## API

### Attributes

| Attribute | Description |
|-----------|-------------|
| `type` | Citation type: `product`, `article`, `service`, `event`, `organization`, `person`, `place`, `review`, `faq`, `generic` |
| `name` | Content name |
| `summary` | Human-readable summary text |
| `data` | JSON object with arbitrary key-value pairs |
| `source-url` | URL of the original data source |
| `unstyled` | Boolean attribute to disable default styles |
| `ax-hidden` | Boolean attribute to hide the citation visually (still in DOM) |
| `lang` | Language code propagated to the inner `<aside>` |

Plus type-specific attributes listed above.

### Methods

| Method | Description |
|--------|-------------|
| `toJSON()` | Returns citation data as a plain `Record<string, string>` |
| `AxCite.extractAll(root?)` | Static. Returns all citation data from `root` (defaults to `document`) |

### Exports

```typescript
import { AxCite, TAG_NAME, BLOCK_CLASS, SUMMARY_CLASS } from 'ax-cite';
import type {
  CitationType, CitationConfig, CitationData,
  AxCiteAttributes, AxCiteRenderEvent,
} from 'ax-cite';
```

## How It Works

1. Import `ax-cite` in your JS/TS — the custom element auto-registers
2. Add `<ax-cite>` elements with your structured data as attributes
3. The component renders a semantic `<aside>` with `data-ai-extractable="true"` and all your data as `data-*` attributes
4. AI crawlers (GPTBot, ClaudeBot, etc.) can query `[data-ai-extractable]` to extract structured information

**Light DOM** is used intentionally so crawlers can directly access the rendered HTML without needing Shadow DOM traversal.

## Tech Stack

- **Zero** runtime dependencies
- **~2.8KB** gzipped (all files)
- Vanilla Custom Element (no framework)
- TypeScript strict mode
- ESM-only

## License

[Apache-2.0](LICENSE)
