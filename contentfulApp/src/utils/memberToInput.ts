import { MemberInput, WebComponentMember } from "../types";
import { contentfulRefType } from "./isContentfulRef";


export default function memberToInput(
  member: WebComponentMember
) {

  const input: MemberInput = {
    type: 'string',
    attribute: member.attribute,
    value: member.value || member.default?.replace(/'/g, ''),
    valueArr: member.valueArr,
    description: member.description
  };

  const refType = contentfulRefType(member);

  if (refType) {
    input.type = refType;
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