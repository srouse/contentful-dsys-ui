import { FormControl, Select, TextInput } from "@contentful/f36-components";
import { WebComponent, WebComponentMember } from "../../types";
import memberToInput from "../../utils/memberToInput";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { EditorAppSDK } from "@contentful/app-sdk";
import { Dispatch, SetStateAction } from "react";
import saveWebComponentConfig from "../../utils/saveWebComponentConfig";
import ReferenceInput from "./ReferenceInput";
import { Entry } from "contentful-management";
import { Entry as EntryCPA } from 'contentful';

type ReferenceInputProps = {
  member: WebComponentMember,
  webComponent: WebComponent,
  webComponentRefs: Entry[],
  setWebComponent: (wc: WebComponent) => void,
  setIsSaving: Dispatch<SetStateAction<boolean>>,
  setWebComponentEntry: (val:any) => void,
  setWebComponentRefs: (val:Entry[]) => void,
  setWebComponentCPARefs: (val:EntryCPA<unknown>[]) => void,
}

const MemberInput = ({
  member,
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

  const input = memberToInput(member);
  if (input.type === 'string') {
    return (
      <FormControl marginBottom="spacing2Xs">
        <FormControl.Label>
          {member.name}
        </FormControl.Label>
        <TextInput
          value={member.value}
          type="text"
          name={member.name}
          placeholder={member.description}
          onBlur={async () => {
            saveWebComponentConfig(
              cma, sdk,
              webComponent,
              setIsSaving,
              setWebComponentEntry
            );
          }}
          onChange={(evt) => {
            member.value = evt.target.value;
            const newWebComp = {...webComponent};
            setWebComponent(newWebComp);
          }}
        />
      </FormControl>
    );
  }else if (input.type === 'select') {
    return (
      <FormControl marginBottom="spacing2Xs">
        <FormControl.Label>
          {member.name}
        </FormControl.Label>
        <Select
          name={member.name}
          value={input.value}
          onChange={(evt) => {
            member.value = evt.target.value;
            const newWebComp = {...webComponent};
            setWebComponent(newWebComp);
            saveWebComponentConfig(
              cma, sdk,
              newWebComp,
              setIsSaving,
              setWebComponentEntry
            );
          }}>
          {input.selectItems?.map(item => {
            return (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            );
          })}
        </Select>
      </FormControl>
    );
  }else if (input.type === 'reference') {
    return (
      <ReferenceInput
        member={member}
        input={input}
        setIsSaving={setIsSaving}
        webComponent={webComponent}
        setWebComponent={setWebComponent}
        webComponentRefs={webComponentRefs}
        setWebComponentEntry={setWebComponentEntry}
        setWebComponentRefs={setWebComponentRefs}
        setWebComponentCPARefs={setWebComponentCPARefs} />
    );
  }
  return '';
};

export default MemberInput;
