import {LitElement, html} from 'lit';
import {property} from 'lit/decorators.js';
import styles from './scss/cui-section.scss';

/**
 * @slot - Children of a section
 *
 */
export default class CUISection extends LitElement {

  static styles = styles;

  @property({type: String, reflect: true})
    title = '';

  constructor() {
    super();
  }

  /**
   * render
   * @return {object}
   */
  render(): object {
    return html`
        section
    `;
  }
}

