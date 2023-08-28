import { Entry } from "contentful-management"

export default function contentfulEntryStatus(entry: Entry) {
  if (isDraft(entry)) return 'draft';
  if (isChanged(entry)) return 'changed';
  if (isPublished(entry)) return 'published';
  if (isArchived(entry)) return 'archived';
}

export function isDraft(entry: Entry) {
  return !entry.sys.publishedVersion
}

export function isChanged(entry: Entry) {
  return !!entry.sys.publishedVersion &&
    entry.sys.version >= entry.sys.publishedVersion + 2
}

export function isPublished(entry: Entry) {
  return !!entry.sys.publishedVersion &&
    entry.sys.version === entry.sys.publishedVersion + 1
}

export function isArchived(entry: Entry) {
  return !!entry.sys.archivedVersion
}