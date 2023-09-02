import { MemberInputType, WebComponentMember } from "../types";

export function contentfulRefType(
  member: WebComponentMember 
) : MemberInputType | false {
  if (!member) return false;

  if (member.kind === 'field') {
    if (member.type.text.match(/^(ContentfulEntry<).*(>\[\])$/))
      return 'referenceArray';
    
    if (member.type.text.match(/^(ContentfulEntry<).*(>)$/))
      return 'reference';
    
     return false;
  }else{// slots don't have "kind"
    return 'referenceArray';
  }
}

export function getContentfulRefClass(
  member: WebComponentMember
) {
  if (member.kind === 'field') {
    if (member && member.type.text.indexOf('ContentfulEntry') === 0) {
      const result = member.type.text.match(/(?<=ContentfulEntry<I)(.*)(?=>)/);
      if (result && result.length > 0) {
        return lowerCaseFirstLetter(result[0]);
      }
    }
  }
  if (member.kind === 'slot') {
    return 'webComponent';
  }
  return '';
}

function lowerCaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}