import {LitElement, html} from 'lit';
import {property} from 'lit/decorators.js';
import styles from './scss/cui-page.scss';

/**
 * @slot {cui-section} - You can put some elements here
 * 
 * @cssprop --text-color - Controls the color of foo
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

