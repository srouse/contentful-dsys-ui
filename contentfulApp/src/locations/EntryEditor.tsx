import React, { useEffect, useState } from 'react';
import { EditorAppSDK } from '@contentful/app-sdk';
import { useCMA, useSDK } from '@contentful/react-apps-toolkit';
import Grid from '@mui/material/Unstable_Grid2';
import webComps from 'contentful-auto-ui/web-comps/custom-elements.json';
import { WebComponent } from '../types';
import memberToInput from '../utils/memberToInput';
import saveWebComponentConfig from '../utils/saveWebComponentConfig';
import SyncIcon from '@mui/icons-material/Sync';
import { Entry } from 'contentful-management';
import { Entry as EntryCPA } from 'contentful';
import { Button, Stack } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import RenderWebComp from './entryEditor/RenderWebComp';
import loadContentfulRefs from '../utils/loadContentfulRefs';

const EntryEditor = () => {
  const sdk = useSDK<EditorAppSDK>();
  const cma = useCMA();

  const [allWebComps, setAllWebComps] = useState<{value: string, name: string}[]>([]);
  const [webCompLookup, setWebCompLookup] = useState<{[key:string]:WebComponent}>({});
  const [webComponentTagName, setWebComponentTagName] = useState<string>('none');
  const [webComponent, setWebComponent] = useState<WebComponent | undefined>();
  const [webCompHtml, setWebCompHtml] = useState<string>('');
  const [webComponentEntry, setWebComponentEntry] = useState<any>('');
  const [webComponentRefs, setWebComponentRefs] = useState<Entry[]>([]);
  const [webComponentCPARefs, setWebComponentCPARefs] = useState<EntryCPA<unknown>[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const cmaEntry = await cma.entry.get({
        entryId: sdk.entry.getSys().id,
      });
      let configWebComp: WebComponent | undefined;
      if (cmaEntry.fields.configuration) {
        configWebComp = cmaEntry.fields.configuration['en-US'] as WebComponent;
      }
      await loadContentfulRefs(
        cmaEntry, sdk, cma,
        setWebComponentCPARefs, setWebComponentRefs
      );
      setWebComponentEntry(cmaEntry);

      // gather comps
      const newAllWebComps: {value: string, name: string}[] = [];
      const newWebCompLookup: {[key:string]:any} = {};
      webComps.modules.map(module => {
        const exports = module.exports;
        const firstExport = exports[0];
        if (firstExport.kind === 'custom-element-definition') {
          return false;
        }
        const firstDeclaration = module.declarations[0] as WebComponent;
        newAllWebComps.push({
          value: firstDeclaration.tagName,
          name: firstDeclaration.tagName
        });

        if (configWebComp && firstDeclaration.name === configWebComp.name) {
          newWebCompLookup[configWebComp.tagName] = configWebComp;
          const newWebComp = JSON.parse(JSON.stringify(firstDeclaration));
          newWebComp.members.map((member: any, index: number) => {
            const configMember = configWebComp?.members.find(
              configMember => configMember.name === member.name
            );
            if (configMember) {
              newWebComp.members[index] = {
                ...member,
                value: configMember.value,
              };
            }
            return true;
          });
          setWebComponent(newWebComp);
          setWebComponentTagName(configWebComp.tagName);
        }else{
          firstDeclaration.members.map((member) => {
            if (!member.value) {
              member.value = member.default?.replace(/'/g, '');
            }
            return true;
          });
          newWebCompLookup[firstDeclaration.tagName] = firstDeclaration;
        }
        
        return true;
      });
      setWebCompLookup(newWebCompLookup);
      setAllWebComps(newAllWebComps);
    })();
  }, [cma, sdk]);
  
  // WEB COMP HTML
  useEffect(() => {
    if (!webComponent) {
      setWebCompHtml('');
      return;
    }
    const attr: string[] = [];
    webComponent.members.map(member => {
      const input = memberToInput(member);
      if (input.type === 'reference') {
        const inputRef = webComponentCPARefs.find(ref => ref.sys.id === input.value);
        if (inputRef) {
          attr.push(`${input.attribute}="${JSON.stringify(inputRef).replace(/"/g, '&quot;')}"`);
        }
      }else{
        attr.push(`${input.attribute}="${input.value}"`);
      }
      return true;
    });

    const output =
      `<${webComponent?.tagName} ${
          attr.join(' ')
        }></${webComponent?.tagName}>`;

    setWebCompHtml(output);
  }, [webComponent, setWebCompHtml, setIsSaving, cma, sdk, webComponentCPARefs]);

  if (!webComponent) {
    return (
      <Grid container
        alignItems="center"
        justifyContent="center"
        height="100vh">
        <SyncIcon
          sx={{
            animation: "spin 1s linear infinite",
            "@keyframes spin": {
              "0%": {
                transform: "rotate(360deg)",
              },
              "100%": {
                transform: "rotate(0deg)",
              },
            },
          }}></SyncIcon>
        </Grid>
    );
  }

  return (
    <Stack
      alignItems='stretch'
      spacing='none'
      style={{height: '100vh', width: '100vw'}} >
      <Stack
        flexDirection='column'
        alignItems='stretch'
        spacing='none'
        style={{width: 380}} >
        <Stack
          flexDirection='column'
          alignItems='stretch'
          padding='spacingL'
          style={{overflow: 'auto', flex: 1}} >
          <RenderWebComp
            webComponent={webComponent}
            webComponentEntry={webComponentEntry}
            webComponentRefs={webComponentRefs}
            setWebComponent={setWebComponent}
            setIsSaving={setIsSaving}
            allWebComps={allWebComps}
            webCompLookup={webCompLookup}
            webComponentTagName={webComponentTagName}
            setWebComponentTagName={setWebComponentTagName}
            setWebComponentEntry={setWebComponentEntry}
            setWebComponentRefs={setWebComponentRefs}
            setWebComponentCPARefs={setWebComponentCPARefs} />
        </Stack>
        <Stack
          padding='spacingXs'
          justifyContent='end'
          style={{borderTop: `1px solid ${tokens.gray200}`}} >
          {/* <TextInput
            value={webComponentEntry.fields?.title ? 
                  webComponentEntry.fields?.title['en-US'] : ""}
            type="text"
            name="title"
            isDisabled={isSaving}
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
          /> */}
          <Button
            variant="primary"
            isLoading={isSaving}
            onClick={async () => {
              saveWebComponentConfig(
                cma, sdk,
                webComponent,
                setIsSaving,
                setWebComponentEntry
              );
            }}>
            Save
          </Button>
        </Stack>
      </Stack>
      <Stack
        justifyContent="center"
        alignItems="center"
        style={{
          flex: 1,
          backgroundColor: tokens.gray200,
          height: `100%`,
          overflowY: 'auto'}} >
        <div dangerouslySetInnerHTML={{__html:webCompHtml}}></div>
      </Stack>
    </Stack>
  );
  
};

export default EntryEditor;
