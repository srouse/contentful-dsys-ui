import { CMAClient, EditorAppSDK } from "@contentful/app-sdk";
import { WebComponent } from "../types";


export default async function saveWebComponentConfig(
  cma: CMAClient,
  sdk: EditorAppSDK,
  entry: WebComponent | undefined,
  output: string,
  setIsSaving: (val: boolean) => void
) {
  setIsSaving(true);
  const cmaEntry = await cma.entry.get({
    entryId: sdk.entry.getSys().id,
  });
  cmaEntry.fields.configuration = {'en-US': entry};
  cmaEntry.fields.output = {'en-US': output};
  await cma.entry.update({entryId: sdk.entry.getSys().id}, cmaEntry);
  setIsSaving(false);
}