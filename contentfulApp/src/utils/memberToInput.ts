import { MemberInput, WebComponentMember } from "../types";
import isContentfulRef from "./isContentfulRef";


export default function memberToInput(
  member: WebComponentMember
) {
  const input: MemberInput = {
    type: 'string',
    attribute: member.attribute,
    value: member.value || member.default?.replace(/'/g, ''),
    description: member.description
  };

  if (isContentfulRef(member)) {
    input.type = 'reference';
  }else {
    if (member.type.text === 'string') {
      input.type = 'string';
    }else if (member.type.text.indexOf('|') !== -1) {
      let items = member.type.text.split('|');
      items = items.map(item => item.replace(/'/g, '').trim());
      if (member.type.text.trim().indexOf("'") === 0) {
        input.type = 'select';
        input.selectItems = items;
      }
    }
  }

  return input;
}