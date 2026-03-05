# Changelog

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
