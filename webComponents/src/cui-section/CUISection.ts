import {LitElement, html} from 'lit';
import {property} from 'lit/decorators.js';
import styles from './scss/cui-section.scss';
// import { ContentfulEntry } from 'src/types';

/**
 * @slot - Children of a section
 *
 */
export default class CUISection extends LitElement {

  static styles = styles;

  @property({type: String, reflect: true})
    title = '';

  // @property({type: String})
  //   imageSize: 'left' | 'right' = 'left';

  // @property({type: String})
  //   background: 'primary' | 'primary-dark' = 'primary-dark';

  // @property({type: Object})
  //   content: ContentfulEntry<Content>;

  constructor() {
    super();
  }

  /**
   * render
   * @return {object}
   */
  render(): object {
    return html`
        <slot></slot>
    `;
  }
}

