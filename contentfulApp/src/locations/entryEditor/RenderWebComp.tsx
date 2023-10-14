import { Entry } from "contentful-management";
import { WebComponent } from "../../types";
import { Dispatch, SetStateAction, useState } from "react";
import { Button, Flex, FormControl, Select, Text } from "@contentful/f36-components";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { EditorAppSDK } from "@contentful/app-sdk";
import MemberInput from "./MemberInput";
import saveWebComponentConfig from "../../utils/saveWebComponentConfig";
import { Entry as EntryCPA } from 'contentful';
import MetadataModal from "./MetadataModal";
import tokens from "@contentful/f36-tokens";
import { SettingsIcon } from '@contentful/f36-icons';

type RenderWebCompProps = {
  webComponentEntry: any,
  webComponent?: WebComponent,
  webComponentRefs: Entry[],
  allWebComps: {value: string, name: string}[],
  webCompLookup: {[key:string]:WebComponent},
  webComponentTagName: string,
  setWebComponentTagName: (tag: string) => void,
  setWebComponent: (wc: WebComponent | undefined) => void,
  setIsSaving: Dispatch<SetStateAction<boolean>>,
  setWebComponentEntry: (val:any) => void,
  setWebComponentRefs: (val:Entry[]) => void,
  setWebComponentCPARefs: (val:EntryCPA<unknown>[]) => void,
  invalidate: () => void,
}

const RenderWebComp = ({
  webComponent,
  webComponentEntry,
  webComponentRefs,
  setWebComponent,
  setIsSaving,
  allWebComps,
  webCompLookup,
  webComponentTagName,
  setWebComponentTagName,
  setWebComponentEntry,
  setWebComponentRefs,
  setWebComponentCPARefs,
  invalidate
}: RenderWebCompProps) => {
  const sdk = useSDK<EditorAppSDK>();
  const cma = useCMA();

  const [showModal, setShowModal] = useState<boolean>(false);

  return (<>
    {webComponentEntry ? (
      <Flex
        flexDirection="row"
        paddingBottom="spacingS"
        style={{borderBottom: `1px solid ${tokens.gray300}`}}
        alignItems="center">
        <Flex flexDirection="column"
          flex={1}>
          <Text
            fontSize="fontSizeL"
            fontWeight="fontWeightDemiBold"
            marginBottom="spacing2Xs">{
            webComponentEntry.fields?.title ? 
              webComponentEntry.fields?.title['en-US'] : ""
          }</Text>
          <Text
            fontSize="fontSizeS">slug: {
            webComponentEntry.fields?.slug ? 
              webComponentEntry.fields?.slug['en-US'] : "(no slug)"
          }</Text>
          <Text
            fontSize="fontSizeS">component: {
              webComponent?.tagName
          }</Text>
        </Flex>
        <Button onClick={() => setShowModal(true)}
          startIcon={<SettingsIcon variant="muted" />}
          variant="transparent"
          size="small">
        </Button>
        <Button onClick={() => {
            sdk.dialogs.openCurrentApp({
              title: `${webComponentEntry.fields?.title ? 
                webComponentEntry.fields?.title['en-US'] : ""} Editor`,
              width: 'fullWidth',
              // position: 'top',
              // allowHeightOverflow: false,
              minHeight: '80vh',
              shouldCloseOnOverlayClick: true,
            });
          }}
          startIcon={<SettingsIcon variant="muted" />}
          variant="transparent"
          size="small">
        </Button>
      </Flex>
    ) : ""}

    <MetadataModal
      showModal={showModal}
      closeModal={() => {
        invalidate();
        setShowModal(false);
      }}
      componentSelector={(
        <FormControl
          marginLeft="spacingL"
          marginRight="spacingL"
          marginBottom="spacing2Xs">
          <FormControl.Label>
            Component
          </FormControl.Label>
          <Select
            name="Component"
            value={webComponentTagName}
            onChange={(event) => {
              const newWebComp = webCompLookup[event.target.value];
              setWebComponentTagName(event.target.value);
              if (newWebComp) {
                setWebComponent({...newWebComp});
              }else{
                setWebComponent(undefined);
              }
              saveWebComponentConfig(
                cma, sdk,
                newWebComp,
                setIsSaving,
                setWebComponentEntry
              );
            }}>
            <Select.Option value={'none'}>
              No Web Component Selected
            </Select.Option>
            {allWebComps.map(webComp => {
              return (
                <Select.Option key={webComp.value} value={webComp.value}>
                  {webComp.name}
                </Select.Option>
              );
            })}
          </Select>
        </FormControl>
      )} />

    {webComponent ? 
      (webComponent.members?.map((member, index) => {
        return (
          <MemberInput
            key={`input_${member.name}_${index}`}
            member={member}
            setIsSaving={setIsSaving}
            webComponent={webComponent}
            setWebComponent={setWebComponent}
            webComponentRefs={webComponentRefs}
            setWebComponentEntry={setWebComponentEntry}
            setWebComponentRefs={setWebComponentRefs}
            setWebComponentCPARefs={setWebComponentCPARefs} />
        );
      })) :
      ('')
    }

    {webComponent ? 
      (webComponent.slots?.map((slot, index) => {
        return (
          <MemberInput
            key={`slot_${slot.name}_${index}`}
            member={slot}
            setIsSaving={setIsSaving}
            webComponent={webComponent}
            setWebComponent={setWebComponent}
            webComponentRefs={webComponentRefs}
            setWebComponentEntry={setWebComponentEntry}
            setWebComponentRefs={setWebComponentRefs}
            setWebComponentCPARefs={setWebComponentCPARefs} />
        );
      })) :
      ('')
    }
  </>);
}

export default RenderWebComp;
