import {LitElement, TemplateResult, html} from 'lit';
import {property} from 'lit/decorators.js';
import tokens from '../../dist/web/typescript/tokens';
import styles from './scss/cui-color-doc.scss';

const processColors = (
  colors: any,
  results: TemplateResult<1>[] = [],
  nameArr: string[] = []
) => {
  Object.entries(colors).map(color => {
    const name = [...nameArr, color[0]].join('-');
    const value = color[1];
    if (typeof value === 'string') {
      const cssProp = `var( --cui-color-${name} )`;
      results.push(
        html`
          <div class="row">
            <div class="cell name">${name}</div>
            <div class="cell chip">
              <div style="
                background-color: ${cssProp};"></div>
            </div>
            <div class="cell css">${cssProp}</div>
          </div>
        `
      );
    }else{
      const subNameArr = [...nameArr, color[0]];
      processColors(value, results, subNameArr);
    }
    return false;
  });

  return results;
}

export default class CUIColorDoc extends LitElement {

  static styles = styles;

  /** test */
  @property({type: String, reflect: true})
    title = 'Colors';

    /** The cluster of tokens to display */
  @property({type: String, reflect: true})
    colors: 'primary' | 'secondary' | 'accent' | 'all' = 'all';

  /** Constructor */
  constructor() {
    super();
  }

  /**
   * render
   * @return {object}
   */
  render(): object {

    const colors = tokens.cui.color;

    return html`
      <h1>${this.title}</h1>
      <div class="table">
        ${processColors(colors)}
      </div>
    `;
  }
}
