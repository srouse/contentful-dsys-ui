import {LitElement, html} from 'lit';
import {property} from 'lit/decorators.js';
import styles from './scss/cui-button.scss';
import { IUrl } from 'src/contentful-types';
import { ContentfulEntry } from 'src/types';
// import { IUrl } from 'src/contentful-types';

/**
 * @slot - You can put some elements here
 * @slot container - You can put some elements here
 * 
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
    secondUrl: ContentfulEntry<IUrl>;

  constructor() {
    super();
  }

  /**
   * render
   * @return {object}
   */
  render(): object {
    return html`
      <div class="btn ${this.design}">
        ${this.label || this.url?.fields.title || 'Button'}
      </div>
    `;
  }
}

