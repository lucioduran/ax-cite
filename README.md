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

## API

### Attributes

| Attribute | Description |
|-----------|-------------|
| `type` | Citation type: `product`, `article`, `service`, `event`, `organization`, `generic` |
| `name` | Content name |
| `summary` | Human-readable summary text |
| `data` | JSON object with arbitrary key-value pairs |
| `unstyled` | Boolean attribute to disable default styles |

Plus type-specific attributes listed above.

### Exports

```typescript
import { AxCite, TAG_NAME, BLOCK_CLASS, SUMMARY_CLASS } from 'ax-cite';
import type { CitationType, CitationConfig, AxCiteAttributes } from 'ax-cite';
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
