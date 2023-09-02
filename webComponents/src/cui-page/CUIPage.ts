import {LitElement, html} from 'lit';
import {property} from 'lit/decorators.js';
import styles from './scss/cui-page.scss';
import { IUrl } from 'src/contentful-types';
import { ContentfulEntry } from 'src/types';

/**
 * @slot {cui-section} - You can put some elements here
 * @slot {cui-button, cui-color-doc, cui-section} container - You can put some elements here
 * 
 * @cssprop --text-color - Controls the color of foo
 */
export default class CUIPage extends LitElement {

  static styles = styles;

  @property({type: String, reflect: true})
    title = '';

  @property({type: Object})
    url: ContentfulEntry<IUrl>;

  /** Sections that fill up the content of this page */
  @property({type: Array})
    urls: ContentfulEntry<IUrl>[];

  constructor() {
    super();
  }

  /**
   * render
   * @return {object}
   */
  render(): object {
    return html`
      <div class="page">
        <slot style="display: block; border: 1px solid blue;"></slot>
        <slot name="container" style="display: block; border: 1px solid red;"></slot>
      </div>
    `;
  }
}

