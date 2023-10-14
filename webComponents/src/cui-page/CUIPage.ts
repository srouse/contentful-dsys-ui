import {LitElement, html} from 'lit';
import {property} from 'lit/decorators.js';
import styles from './scss/cui-page.scss';

/**
 * @slot {cui-section} - Section children of page
 */
export default class CUIPage extends LitElement {

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
      <slot></slot>
    `;
  }
}

