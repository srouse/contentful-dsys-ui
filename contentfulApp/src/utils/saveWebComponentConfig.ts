import { CMAClient, EditorAppSDK } from "@contentful/app-sdk";
import { WebComponent } from "../types";
import isContentfulRef from "./isContentfulRef";
import { Entry } from "contentful-management";
import loadContentfulRefs from "./loadContentfulRefs";
import { Entry as EntryCPA } from 'contentful';

export default async function saveWebComponentConfig(
  cma: CMAClient,
  sdk: EditorAppSDK,
  config: WebComponent | undefined,
  setIsSaving: (val: boolean) => void,
  setWebComponentEntry: (val:any) => void,
  setWebComponentRefs?: (val:Entry[]) => void,
  setWebComponentCPARefs?: (val:EntryCPA<unknown>[]) => void,
) {
  setIsSaving(true);
  const cmaEntry = await cma.entry.get({
    entryId: sdk.entry.getSys().id,
  });
  cmaEntry.fields.configuration = {'en-US': config};
  // cmaEntry.fields.output = {'en-US': output};
  const refs: Object[] = [];
  config?.members.map(member => {
    if (isContentfulRef(member) && member.value) {
      refs.push({
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: member.value
        }
      })
    }
    cmaEntry.fields.references = {'en-US': refs};
    return true;
  });
  await cma.entry.update({entryId: sdk.entry.getSys().id}, cmaEntry);

  // update component references
  if (setWebComponentRefs && setWebComponentCPARefs) {
    await loadContentfulRefs(
      cmaEntry, sdk, cma,
      setWebComponentCPARefs, setWebComponentRefs
    );
  }

  // Update comp entry
  setWebComponentEntry(cmaEntry);

  setIsSaving(false);
}
