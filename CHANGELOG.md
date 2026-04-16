# Changelog

## 1.2.0

- **JSON-LD output**: add `jsonld` attribute to inject `<script type="application/ld+json">` with schema.org structured data alongside the visual citation
- Maps all 10 citation types to schema.org equivalents (Product, Article, Service, Event, Organization, Person, Place, Review, FAQPage, Thing)
- Attribute-specific mappings: price/currency/in-stock merge into Offer, author becomes Person, location becomes Place, rating becomes Rating, etc.
- JSON-LD updates reactively on attribute changes and is removed when the `jsonld` attribute is removed
- 42 new tests covering all type mappings, attribute merging, edge cases, and dynamic updates

## 1.1.1

- Fix Prettier formatting for CI compatibility
- Guard `CustomEvent` dispatch for Node 18 environments

## 1.1.0

- New citation types: `person`, `place`, `review`, `faq`
- `toJSON()` instance method for programmatic data extraction
- `AxCite.extractAll(root?)` static method to extract all citations from a page
- `source-url` attribute for linking to original data sources
- `ax-hidden` mode: embed machine-readable data without visible output
- `ax-cite:render` custom event dispatched on every render/update
- `lang` attribute propagated to the inner `<aside>` for multilingual support
- New type exports: `CitationData`, `AxCiteRenderEvent`, `PersonAttributes`, `PlaceAttributes`, `ReviewAttributes`, `FaqAttributes`

## 1.0.0

- Initial release
- Vanilla Custom Element `<ax-cite>` for AI-extractable citation blocks
- Support for product, article, service, event, organization, and generic citation types
- CSS custom properties for theming
- `unstyled` attribute for full style control
- Zero runtime dependencies
- TypeScript types with React JSX augmentation
