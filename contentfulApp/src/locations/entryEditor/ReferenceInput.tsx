import { EditorAppSDK } from "@contentful/app-sdk";
import { Button, EntryCard, FormControl, MenuItem, } from "@contentful/f36-components";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { MemberInput, WebComponent, WebComponentMember } from "../../types";
import { Entry } from 'contentful-management';
import saveWebComponentConfig from "../../utils/saveWebComponentConfig";
import { Dispatch, SetStateAction } from "react";
import { getContentfulRefClass } from "../../utils/isContentfulRef";
import contentfulEntryStatus from "../../utils/contentfulEntryStatus";
import loadContentfulRefs from "../../utils/loadContentfulRefs";
import { Entry as EntryCPA } from 'contentful';

type ReferenceInputProps = {
  member: WebComponentMember,
  input: MemberInput,
  webComponent: WebComponent,
  webComponentRefs: Entry[],
  setWebComponent: (wc: WebComponent) => void,
  setIsSaving: Dispatch<SetStateAction<boolean>>,
  setWebComponentEntry: (val:any) => void,
  setWebComponentRefs: (val:Entry[]) => void,
  setWebComponentCPARefs: (val:EntryCPA<unknown>[]) => void,
}

const ReferenceInput = ({
  member,
  input,
  webComponent,
  webComponentRefs,
  setWebComponent,
  setIsSaving,
  setWebComponentEntry,
  setWebComponentRefs,
  setWebComponentCPARefs
}: ReferenceInputProps) => {
  const sdk = useSDK<EditorAppSDK>();
  const cma = useCMA();

  const ref = webComponentRefs?.find((ref) => ref.sys.id === member.value);
  if (ref) {
    return (<>
      <FormControl marginBottom="spacing2Xs">
        <FormControl.Label>{input.attribute}</FormControl.Label>
        <EntryCard
          contentType={ref.sys.contentType.sys.id}
          title={ref.fields.title? ref.fields.title['en-US'] : ''}
          size="small"
          status={contentfulEntryStatus(ref)}
          onClick={async () => {
            await sdk.navigator.openEntry(
              ref.sys.id, {
                slideIn: {
                  waitForClose: true
                }
              }
            );
            setIsSaving(true);
            const cmaEntry = await cma.entry.get({
              entryId: sdk.entry.getSys().id,
            });
            await loadContentfulRefs(
              cmaEntry, sdk, cma,
              setWebComponentCPARefs, setWebComponentRefs
            );
            setWebComponentEntry(cmaEntry);
            setIsSaving(false);
          }}
          actions={[
            <MenuItem key="copy" onClick={async () => {
              const selection = await sdk.navigator.openNewEntry(
                ref.sys.contentType.sys.id, {
                  slideIn: {
                    waitForClose: true
                  }
                }
              );
              if (!selection || !selection.entity) return;
              member.value = selection.entity.sys.id;
              const newWebComp = {...webComponent};
              setWebComponent(newWebComp);
              saveWebComponentConfig(
                cma, sdk,
                newWebComp,
                setIsSaving,
                setWebComponentEntry,
                setWebComponentRefs
              );
            }}>
              Create New
            </MenuItem>,
            <MenuItem key="select" onClick={async () => {
               const selection = await sdk.dialogs.selectSingleEntry({
                contentTypes:[
                  getContentfulRefClass(member)
                ]
              }) as Entry;
              if (!selection) return;
              member.value = selection.sys.id;
              const newWebComp = {...webComponent};
              setWebComponent(newWebComp);
              saveWebComponentConfig(
                cma, sdk,
                newWebComp,
                setIsSaving,
                setWebComponentEntry,
                setWebComponentRefs
              );
            }}>
              Change
            </MenuItem>,
            <MenuItem key="delete" onClick={() => {
              delete member.value;
              const newWebComp = {...webComponent};
              setWebComponent(newWebComp);
              saveWebComponentConfig(
                cma, sdk,
                newWebComp,
                setIsSaving,
                setWebComponentEntry,
                setWebComponentRefs
              );
            }}>
              Remove
            </MenuItem>,
          ]}
        />
        {/* <FormControl.HelpText>{member.description}</FormControl.HelpText> */}
      </FormControl>
    </>);
  }

  return (
    <FormControl>
      <FormControl.Label>{input.attribute}</FormControl.Label>
      <Button isFullWidth
        onClick={async () => {
          const selection = await sdk.dialogs.selectSingleEntry({
            contentTypes:[
              getContentfulRefClass(member)
            ]
          }) as Entry;
          if (!selection) return;
          member.value = selection.sys.id;
          const newWebComp = {...webComponent};
          setWebComponent(newWebComp);
          saveWebComponentConfig(
            cma, sdk,
            newWebComp,
            setIsSaving,
            setWebComponentEntry,
            setWebComponentRefs
          );
        }}>
        Select Entry
      </Button>
    </FormControl>
  );
}

export default ReferenceInput;