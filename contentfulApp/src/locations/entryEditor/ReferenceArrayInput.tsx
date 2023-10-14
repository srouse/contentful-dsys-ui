import { EditorAppSDK } from "@contentful/app-sdk";
import { Button, EntityList, Flex, FormControl, IconButton, Menu, MenuItem, MenuSectionTitle, Text, } from "@contentful/f36-components";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { MemberInput, WebComponent, WebComponentMember } from "../../types";
import { Entry } from 'contentful-management';
import saveWebComponentConfig from "../../utils/saveWebComponentConfig";
import { Dispatch, SetStateAction } from "react";
import { getContentfulRefClass } from "../../utils/isContentfulRef";
import contentfulEntryStatus from "../../utils/contentfulEntryStatus";
import loadContentfulRefs from "../../utils/loadContentfulRefs";
import { Entry as EntryCPA } from 'contentful';
import { PlusTrimmedIcon } from '@contentful/f36-icons';

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
  const valuesArr = member.valueArr || [];

  return (
    <FormControl marginBottom="spacing2Xs">
      <Flex style={{width: '100%'}}
        flexDirection="row"
        alignItems="center">
        <FormControl.Label
          style={{flex: 1, marginBottom: 0}}>
          {input.attribute}
        </FormControl.Label>
        <Menu>
          <Menu.Trigger>
            <IconButton
              variant="transparent"
              icon={<PlusTrimmedIcon variant="muted" />}
              aria-label="toggle menu"
            />
          </Menu.Trigger>
          <Menu.List>
            <Menu.Item
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
            </Menu.Item>
            <Menu.Item>
              Create Entry
            </Menu.Item>
          </Menu.List>
        </Menu>
      </Flex>
      <EntityList>
        {valuesArr.map(val => {
          const ref = webComponentRefs?.find((ref : any) => ref.sys.id === val);
          if (!ref) return (
            <Text 
              margin="spacingS">
              No component reference found for {val}
            </Text>
          );
          const config = ref.fields.configuration ?
            ref.fields.configuration['en-US'] : {};
          return (
            <EntityList.Item
              title={ref.fields.title? ref.fields.title['en-US'] : ''}
              description={config ? config.tagName : ''}
              status={contentfulEntryStatus(ref)}
              withThumbnail={false}
              onClick={async () => {
                // await sdk.navigator.openEntry(
                //   ref.sys.id, {
                //     slideIn: {
                //       waitForClose: true
                //     }
                //   }
                // );
                // setIsSaving(true);
                // const cmaEntry = await cma.entry.get({
                //   entryId: sdk.entry.getSys().id,
                // });
                // await loadContentfulRefs(
                //   cmaEntry, sdk, cma,
                //   setWebComponentCPARefs, setWebComponentRefs
                // );
                // setWebComponentEntry(cmaEntry);
                // setIsSaving(false);
              }}
              actions={[
                <MenuSectionTitle key="title">Actions</MenuSectionTitle>,
                <MenuItem key="edit" onClick={async () => {
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
                }}>Edit</MenuItem>,
                <MenuItem key="download">Download</MenuItem>,
                <MenuItem key="remove">Remove</MenuItem>,
              ]}
            />
          );
        })}
      </EntityList>
      {/* <Button isFullWidth
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
      </Button> */}
    </FormControl>
  );
}



export default ReferenceArrayInput;