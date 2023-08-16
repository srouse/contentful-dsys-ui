import {LitElement, html} from 'lit';
import {property} from 'lit/decorators.js';
import styles from './scss/cui-button.scss';
import { IUrl } from 'src/contentful-types';
// import { IUrl } from 'src/contentful-types';

export default class CUIButton extends LitElement {

  static styles = styles;

  @property({type: String, reflect: true})
    label = 'Submit';

    /** The design style of the button */
  @property({type: String, reflect: true})
    design: 'solid' | 'outline' | 'none' = 'solid';

  /** Contentful Reference to a URL Entry */
  @property({type: Object})
    url: IUrl;

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
        ${this.label}
        ${JSON.stringify(this.url)}
      </div>
    `;
  }
}

