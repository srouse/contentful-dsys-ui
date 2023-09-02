import { EditorAppSDK } from "@contentful/app-sdk";
import { Button, EntityList, EntryCard, FormControl, MenuItem, MenuSectionTitle, Text, } from "@contentful/f36-components";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { MemberInput, WebComponent, WebComponentMember } from "../../types";
import { Entry } from 'contentful-management';
import saveWebComponentConfig from "../../utils/saveWebComponentConfig";
import { Dispatch, SetStateAction } from "react";
import { getContentfulRefClass } from "../../utils/isContentfulRef";
import contentfulEntryStatus from "../../utils/contentfulEntryStatus";
import loadContentfulRefs from "../../utils/loadContentfulRefs";
import { Entry as EntryCPA } from 'contentful';

type ReferenceArrayInputProps = {
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

const ReferenceArrayInput = ({
  member,
  input,
  webComponent,
  webComponentRefs,
  setWebComponent,
  setIsSaving,
  setWebComponentEntry,
  setWebComponentRefs,
  setWebComponentCPARefs
}: ReferenceArrayInputProps) => {
  const sdk = useSDK<EditorAppSDK>();
  const cma = useCMA();


  const renderEntry = (ref: Entry | undefined) => {
    if (!ref) {
      return (
        <Text>Entry not found</Text>
      );
    }
    return (
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
        </FormControl>
    );
  }


  const valuesArr = member.valueArr || [];
  console.log('valuesArr', valuesArr);
  console.log('member', member);

  return (
    <FormControl marginBottom="spacing2Xs">
      <FormControl.Label>{input.attribute}</FormControl.Label>
      <EntityList>
        {valuesArr.map(val => {
          const ref = webComponentRefs?.find((ref) => ref.sys.id === val);
          if (!ref) return (
            <Text 
              margin="spacingS">
              No component reference found for {val}
            </Text>
          );
          return (
            <EntityList.Item
              title={ref.fields.title? ref.fields.title['en-US'] : ''}
              description={ref.sys.contentType.sys.id}
              status={contentfulEntryStatus(ref)}
              withThumbnail={false}
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
                <MenuSectionTitle key="title">Actions</MenuSectionTitle>,
                <MenuItem key="edit">Edit</MenuItem>,
                <MenuItem key="download">Download</MenuItem>,
                <MenuItem key="remove">Remove</MenuItem>,
              ]}
            />
          );
        })}
      </EntityList>
      <Button isFullWidth
        onClick={async () => {
          const selection = await sdk.dialogs.selectSingleEntry({
            contentTypes:[
              getContentfulRefClass(member)
            ]
          }) as Entry;
          if (!selection) return;
          member.valueArr = member.valueArr ? 
            [...member.valueArr, selection.sys.id] :
            [selection.sys.id];

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
        Add Entry
      </Button>
    </FormControl>
  );
}



export default ReferenceArrayInput;