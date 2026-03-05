import type { CitationType, CitationConfig, CitationData } from './types.js';
import {
  TAG_NAME,
  BLOCK_CLASS,
  SUMMARY_CLASS,
  EXTRACTABLE_ATTR,
  TYPE_ATTRIBUTES,
  ALL_OBSERVED_ATTRIBUTES,
  DEFAULT_ARIA_LABEL,
} from './constants.js';
import { DEFAULT_STYLES, STYLE_ID } from './styles.js';

export class AxCite extends HTMLElement {
  static get observedAttributes(): readonly string[] {
    return ALL_OBSERVED_ATTRIBUTES;
  }

  private static _stylesInjected = false;
  private _connected = false;

  // ─── Lifecycle ───────────────────────────────────────────────

  connectedCallback(): void {
    this._connected = true;
    AxCite._injectStyles();
    this._render();
  }

  disconnectedCallback(): void {
    this._connected = false;
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (this._connected && oldValue !== newValue) {
      this._render();
    }
  }

  // ─── Property accessors ─────────────────────────────────────

  get type(): CitationType {
    return (this.getAttribute('type') as CitationType) ?? 'generic';
  }

  set type(value: CitationType) {
    this.setAttribute('type', value);
  }

  get name(): string | null {
    return this.getAttribute('name');
  }

  set name(value: string | null) {
    if (value === null) this.removeAttribute('name');
    else this.setAttribute('name', value);
  }

  get summary(): string | null {
    return this.getAttribute('summary');
  }

  set summary(value: string | null) {
    if (value === null) this.removeAttribute('summary');
    else this.setAttribute('summary', value);
  }

  // ─── Public Methods ────────────────────────────────────────

  /** Return the citation data as a plain object. */
  toJSON(): CitationData {
    const config = this._resolveConfig();
    const result: CitationData = { type: config.type };

    if (config.name) result.name = config.name;
    if (config.summary) result.summary = config.summary;
    if (config.sourceUrl) result['source-url'] = config.sourceUrl;

    for (const [key, value] of Object.entries(config.attributes)) {
      result[key] = value;
    }
    for (const [key, value] of Object.entries(config.extraData)) {
      result[key] = value;
    }

    return result;
  }

  /** Extract all `<ax-cite>` elements from a root and return their data. */
  static extractAll(root: ParentNode = document): CitationData[] {
    const elements = root.querySelectorAll<AxCite>(TAG_NAME);
    return Array.from(elements).map((el) => el.toJSON());
  }

  // ─── Private ────────────────────────────────────────────────

  private static _injectStyles(): void {
    if (AxCite._stylesInjected) return;
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) {
      AxCite._stylesInjected = true;
      return;
    }
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = DEFAULT_STYLES;
    document.head.appendChild(style);
    AxCite._stylesInjected = true;
  }

  private _resolveConfig(): CitationConfig {
    const type = this.type;
    const name = this.getAttribute('name') ?? undefined;
    const summary = this.getAttribute('summary') ?? undefined;
    const sourceUrl = this.getAttribute('source-url') ?? undefined;
    const unstyled = this.hasAttribute('unstyled');
    const axHidden = this.hasAttribute('ax-hidden');

    // Collect all known type-specific attributes that are set
    const allKnown = new Set(Object.values(TYPE_ATTRIBUTES).flat());
    const attributes: Record<string, string> = {};
    for (const key of allKnown) {
      const val = this.getAttribute(key);
      if (val !== null) {
        attributes[key] = val;
      }
    }

    // Parse JSON `data` attribute
    const extraData: Record<string, string> = {};
    const dataAttr = this.getAttribute('data');
    if (dataAttr) {
      try {
        const parsed: unknown = JSON.parse(dataAttr);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
            extraData[k] = String(v);
          }
        }
      } catch {
        // Silently ignore invalid JSON
      }
    }

    return { type, name, summary, sourceUrl, unstyled, axHidden, attributes, extraData };
  }

  private _buildDataAttributes(config: CitationConfig): Array<[string, string]> {
    const entries: Array<[string, string]> = [];

    entries.push(['data-ai-extractable', EXTRACTABLE_ATTR]);
    entries.push(['data-type', config.type]);

    if (config.name) {
      entries.push(['data-name', config.name]);
    }

    if (config.sourceUrl) {
      entries.push(['data-source-url', config.sourceUrl]);
    }

    for (const [key, value] of Object.entries(config.attributes)) {
      entries.push([`data-${key}`, value]);
    }

    for (const [key, value] of Object.entries(config.extraData)) {
      const safeKey = key.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      entries.push([`data-${safeKey}`, value]);
    }

    return entries;
  }

  private _render(): void {
    const config = this._resolveConfig();
    const dataAttrs = this._buildDataAttributes(config);
    const ariaLabel = DEFAULT_ARIA_LABEL.replace('%TYPE%', config.type);

    const aside = document.createElement('aside');
    aside.className = BLOCK_CLASS;
    aside.setAttribute('aria-label', ariaLabel);

    for (const [attr, value] of dataAttrs) {
      aside.setAttribute(attr, value);
    }

    // Propagate lang to the inner aside
    const lang = this.getAttribute('lang');
    if (lang) {
      aside.setAttribute('lang', lang);
    }

    // Hidden mode: aside stays in DOM for crawlers but is invisible
    if (config.axHidden) {
      aside.setAttribute('aria-hidden', 'true');
      aside.style.display = 'none';
    }

    if (config.summary) {
      const p = document.createElement('p');
      p.className = SUMMARY_CLASS;
      p.textContent = config.summary;
      aside.appendChild(p);
    }

    this.innerHTML = '';
    this.appendChild(aside);

    this.dispatchEvent(
      new CustomEvent('ax-cite:render', {
        bubbles: true,
        detail: this.toJSON(),
      }),
    );
  }
}
