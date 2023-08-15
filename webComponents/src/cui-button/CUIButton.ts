import {LitElement, html} from 'lit';
import {property} from 'lit/decorators.js';
import styles from './scss/cui-button.scss';
import { IUrl } from 'src/contentful-types';
// import { IUrl } from 'src/contentful-types';

export default class CUIButton extends LitElement {

  static styles = styles;

  @property({type: String, reflect: true})
    label = 'Submit';

  @property({type: String, reflect: true})
    design: 'solid' | 'outline' | 'none' = 'solid';

  @property({type: Object})
    url: IUrl;

  // @property({type: String, reflect: true})
  //   sublabel = '';

  /** Constructor */
  constructor() {
    super();
  }

  /* <div class="sublabel">${this.sublabel}</div> */

  /**
   * render
   * @return {object}
   */
  render(): object {
    console.log('this.url', this.url);
    return html`
      <div class="btn ${this.design}">
        ${this.label}
        ${JSON.stringify(this.url)}
      </div>
    `;
  }
}