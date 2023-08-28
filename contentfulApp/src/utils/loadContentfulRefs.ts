import { Entry, EntryProps, KeyValueMap } from "contentful-management";
import { Entry as EntryCPA } from 'contentful';
import { getPreviewEntry } from "./contentfulClient";
import { CMAClient, EditorAppSDK } from "@contentful/app-sdk";

export default async function loadContentfulRefs(
  cmaEntry: EntryProps<KeyValueMap>,
  sdk: EditorAppSDK,
  cma: CMAClient,
  setWebComponentCPARefs: (refs: EntryCPA<unknown>[]) => void,
  setWebComponentRefs: (refs: Entry[]) => void
) {
  if (cmaEntry.fields.references) {
    const cpaRefs = await Promise.all(cmaEntry.fields.references['en-US'].map((reference: any) => {
      return getPreviewEntry(
        cmaEntry.sys.space.sys.id,
        cmaEntry.sys.environment.sys.id,
        sdk.parameters.installation.contentfulPreviewAccessKey,
        reference.sys.id
      );
    }));
    setWebComponentCPARefs(cpaRefs);
    const refs = await Promise.all(cmaEntry.fields.references['en-US'].map((reference: any) => {
      return cma.entry.get({entryId: reference.sys.id});
    }));
    setWebComponentRefs(refs);
  }
}