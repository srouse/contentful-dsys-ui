import {LitElement, html} from 'lit';
import {property} from 'lit/decorators.js';
import styles from './scss/cui-button.scss';
import { IUrl, IUrlFields } from 'src/contentful-types';
import { ContentfulEntry } from 'src/types';
// import { IUrl } from 'src/contentful-types';

/**
 * @cssprop --text-color - Controls the color of foo
 */
export default class CUIButton extends LitElement {

  static styles = styles;

  @property({type: String, reflect: true})
    label = '';

  /** The design style of the button */
  @property({type: String, reflect: true})
    design: 'solid' | 'outline' | 'none' = 'solid';

  /** Contentful Reference to a URL Entry */
  @property({type: Object})
    url: ContentfulEntry<IUrl>;

  /** Contentful Reference to a URL Entry */
  @property({type: Object, attribute: 'second-url'})
    secondUrl: ContentfulEntry<IUrlFields["title"]>;

  constructor() {
    super();
  }

  /**
   * render
   * @return {object}
   */
  render(): object {
    return html`
      ${this.label || this.url?.fields.title || 'Button'}
    `;
  }
}

