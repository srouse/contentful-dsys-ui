import { IWebComponent } from "src/contentful-types";
import State from "../State";
import renderSlotHtml from "./renderSlotHtml";
import { WebComponentMember } from "src/types";

export default async function renderHtml(
  entry: IWebComponent,
  state: State,
  isRoot: boolean = true,
) {
  if (!entry || !entry.fields.configuration) return '';
  const config = entry.fields.configuration;

  // MEMBERS
  const membersHtml = config.members?.map((member : WebComponentMember) => {
    // Reference (single)
    if (
      member.type.text.indexOf('ContentfulEntry') === 0 &&
      member.type.text.lastIndexOf('[]') !== member.type.text.length -2
    ) {
      const entry = state.getEntry(member.value);
      if (entry) {
        return ` ${member.name}="${
          JSON.stringify(entry).replace(/"/g, '&quot;')
        }"`;
      }
    }

    // Reference Array
    if (
      member.type.text.indexOf('ContentfulEntry') === 0 &&
      member.type.text.lastIndexOf('[]') === member.type.text.length -2
    ) {
      const entries = member.valueArr?.map(val => {
        return state.getEntry(val);
      })
      if (entries) {
        return ` ${member.name}="${
          JSON.stringify(entries).replace(/"/g, '&quot;')
        }"`;
      }
    }
  
    return member.value ? ` ${member.name}="${member.value}"` : '';
  }).join('');

  // SLOTS
  const slotHtml = await renderSlotHtml(entry, state);

  // HTML
  const componentHtml = `<${
    config.tagName
  }${membersHtml}>
    ${slotHtml}
  </${
    config.tagName
  }>`;

  let html = componentHtml;
  if (
    state.website &&
    state.website.fields.htmlFullTemplate &&
    isRoot !== false
  ) {
    html = state.website.fields.htmlFullTemplate?.replace(
      /{{content}}/g, componentHtml
    ).replace(
      /{{metadata}}/g, ''
    ).replace(
      /{{header}}/g, ''
    ).replace(
      /{{footer}}/g, ''
    );
  }

  return html;
}