import { WebComponentMember } from "../types";


export default function isContentfulRef(
  member: WebComponentMember
) {
  // starts w/ "I" means it is an interface which is as close as we can 
  // get to a Contentful content type...
  if (member && member.type.text.indexOf('ContentfulEntry') === 0) {
    return true;
  }
  return false;
}

export function getContentfulRefClass(
  member: WebComponentMember
) {
  if (member && member.type.text.indexOf('ContentfulEntry') === 0) {
    const result = member.type.text.match(/(?<=ContentfulEntry<I)(.*)(?=>)/);
    if (result && result.length > 0) {
      return result[0].toLowerCase();
    }
  }
  return '';
}