import { Entry } from "contentful-management";
import { WebComponent } from "../../types";
import { Dispatch, SetStateAction } from "react";
import { FormControl, Select, TextInput } from "@contentful/f36-components";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { EditorAppSDK } from "@contentful/app-sdk";
import MemberInput from "./MemberInput";
import saveWebComponentConfig from "../../utils/saveWebComponentConfig";
import { Entry as EntryCPA } from 'contentful';

type RenderWebCompProps = {
  webComponentEntry: any,
  webComponent: WebComponent,
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
  setWebComponentCPARefs
}: RenderWebCompProps) => {
  const sdk = useSDK<EditorAppSDK>();
  const cma = useCMA();

  return (<>
    {webComponentEntry ? (
      <FormControl marginBottom="spacing2Xs">
        <FormControl.Label>
          Title
        </FormControl.Label>
        <TextInput
          value={webComponentEntry.fields?.title ? 
                 webComponentEntry.fields?.title['en-US'] : ""}
          type="text"
          name="title"
          onBlur={async (evt) => {
            const newCmaEntry = {...webComponentEntry};
            newCmaEntry.fields.title = {'en-US': evt.target.value};
            setWebComponentEntry(newCmaEntry);

            setIsSaving(true);
            const cmaEntry = await cma.entry.get({
              entryId: sdk.entry.getSys().id,
            });
            cmaEntry.fields.title = {'en-US': evt.target.value};
            await cma.entry.update({
              entryId: sdk.entry.getSys().id
            }, cmaEntry);
            setIsSaving(false);
          }}
          onChange={async (evt) => {
            const newCmaEntry = {...webComponentEntry};
            newCmaEntry.fields.title = {'en-US': evt.target.value};
            setWebComponentEntry(newCmaEntry);
          }}
        />
      </FormControl>
    ) : ""}

    <FormControl marginBottom="spacing2Xs">
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

    {webComponent ? 
      (webComponent.members.map((member, index) => {
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
  </>);
}

export default RenderWebComp;
