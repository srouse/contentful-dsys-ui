import { IWebComponent } from "src/contentful-types";
import renderSlotHtml from "./renderSlotHtml";
import State from "../State";
import { WebComponentMember } from "src/types";

export default async function renderJs(
  entry: IWebComponent,
  state: State,
  webCompClassJsPath: (entry: IWebComponent) => string = () => '',
) {
  const config = entry.fields.configuration;
  if (!config) return '';
  const slug = entry.fields.slug ?
    entry.fields.slug.substring(0, entry.fields.slug.length-1) : undefined;

  const classId = slug ?
    slug.replace(/\/./g, x=> (x && x.length>0 && x[1]) ? x[1].toUpperCase() : '')
        .replace(/-./g, x=> (x && x.length>0 && x[1]) ? x[1].toUpperCase() : '') : entry.sys.id;
  const className = `${config.name}${classId}`;

  // TAG ID
  const tagId = slug ?
    slug.replace(/\//g, '-') : `-${entry.sys.id}`;
  const tagName = `${config.tagName}${tagId}`.toLowerCase();


  // MEMBERS
  const memberProps = config.members?.map((member: WebComponentMember) => {
    if (
      member.type.text.indexOf('ContentfulEntry') === 0
    ) {
      const entry = state.getEntry(member.value);
      if (entry) {
        return member.value ? `${member.name}= ${
          JSON.stringify(entry)
        };` : '';
      }
    }
    return member.value ? `${member.name} = "${member.value}";` : '';
  }).join('\n\t');

  // SLOTS 
  const slotHtml = await renderSlotHtml(entry, state);

  const entryJS = `
import ${config.name} from '${webCompClassJsPath(entry)}';
export default class ${className} extends ${config.name} {
  constructor() {
    super();
    this.innerHTML = \`${slotHtml}\`;
  }
  ${memberProps}
}
customElements.define('${tagName}', ${className} );`;

  return entryJS;
}