import React, { useEffect, useState } from 'react';
import { EditorAppSDK } from '@contentful/app-sdk';
import { useCMA, useSDK } from '@contentful/react-apps-toolkit';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import webComps from 'contentful-auto-ui/web-comps/custom-elements.json';
import { WebComponent } from '../types';
import memberToInput from '../utils/memberToInput';
import saveWebComponentConfig from '../utils/saveWebComponentConfig';
import SyncIcon from '@mui/icons-material/Sync';
import { getPreviewEntry } from '../utils/contentfulClient';
import { Entry } from 'contentful';

const EntryEditor = () => {
  const sdk = useSDK<EditorAppSDK>();
  const cma = useCMA();

  const [allWebComps, setAllWebComps] = useState<{value: string, name: string}[]>([]);
  const [webCompLookup, setWebCompLookup] = useState<{[key:string]:WebComponent}>({});
  const [webComponentTagName, setWebComponentTagName] = useState<string>('none');
  const [webComponent, setWebComponent] = useState<WebComponent | undefined>();
  const [webCompHtml, setWebCompHtml] = useState<string>('');
  const [webComponentEntry, setWebComponentEntry] = useState<any>('');
  const [webComponentRefs, setWebComponentRefs] = useState<Entry<any>[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      console.log('INIT');
      const cmaEntry = await cma.entry.get({
        entryId: sdk.entry.getSys().id,
      });
      let configWebComp: WebComponent | undefined;
      if (cmaEntry.fields.configuration) {
        configWebComp = cmaEntry.fields.configuration['en-US'] as WebComponent;
      }
      if (cmaEntry.fields.references) {
        const refs = await Promise.all(cmaEntry.fields.references['en-US'].map((reference: any) => {
          return getPreviewEntry(
            cmaEntry.sys.space.sys.id,
            cmaEntry.sys.environment.sys.id,
            sdk.parameters.installation.contentfulPreviewAccessKey,
            reference.sys.id
          );
        }));
        setWebComponentRefs(refs);
      }
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
          setWebComponent(newWebComp); // configWebComp);
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
  
  useEffect(() => {
    if (!webComponent) {
      setWebCompHtml('');
      return;
    }
    const attr: string[] = [];
    webComponent.members.map(member => {
      const input = memberToInput(member);
      if (input.type === 'reference') {
        attr.push(`${input.attribute}="{&quot;id&quot;:&quot;${input.value}&quot;}"`);
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
  }, [webComponent, setWebCompHtml, setIsSaving, cma, sdk]);

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
    <Grid container
      alignItems="stretch" height="100vh">
      <Grid
        sx={{
          overflowY: 'auto',
          height: `100%`,
          width: 380
        }}>
        <Stack p={4} pt={4} gap={3}>
          {webComponentEntry ? (
            <TextField 
              label="Title"
              value={webComponentEntry.fields?.title ? 
                webComponentEntry.fields?.title['en-US'] : ""}
              onChange={async (evt) => {
                const newCmaEntry = {...webComponentEntry};
                newCmaEntry.fields.title = {'en-US': evt.target.value};
                setWebComponentEntry(newCmaEntry);
              }}
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
            />
          ) : ""}
          {/* <div>{tokens.cui.color.charcoal}</div> */}
          <TextField 
            select
            label="Component"
            value={webComponentTagName}
            onChange={(event) => {
              const newWebComp = webCompLookup[event.target.value];
              setWebComponentTagName(event.target.value);
              if (newWebComp) {
                setWebComponent({...newWebComp});
              }else{
                setWebComponent(undefined);
              }
              saveWebComponentConfig(cma, sdk, newWebComp, webCompHtml, setIsSaving);
            }}>
            <MenuItem value={'none'}>
              No Web Component Selected
            </MenuItem>
            {allWebComps.map(webComp => {
              return (
                <MenuItem key={webComp.value} value={webComp.value}>
                  {webComp.name}
                </MenuItem>
              );
            })}
          </TextField>
          {webComponent ? 
            (webComponent.members.map((member, index) => {
              const input = memberToInput(member);
              if (input.type === 'string') {
                return (
                  <TextField 
                    key={`name_${member.name}`}
                    label={member.name}
                    defaultValue={member.value}
                    helperText={member.description}
                    onBlur={async () => {
                      saveWebComponentConfig(cma, sdk, webComponent, webCompHtml, setIsSaving);
                    }}
                    onChange={(evt) => {
                      const newWebComp = {...webComponent};
                      const thisMember = newWebComp.members[index];
                      thisMember.value = evt.target.value;
                      setWebComponent(newWebComp);
                    }}
                  />
                );
              }else if (input.type === 'select') {
                return (
                  <TextField 
                    key={`name_${member.name}`}
                    select
                    label={input.attribute}
                    value={input.value}
                    helperText={member.description}
                    onChange={(evt) => {
                      const newWebComp = {...webComponent};
                      const thisMember = newWebComp.members[index];
                      thisMember.value = evt.target.value;
                      setWebComponent(newWebComp);
                      saveWebComponentConfig(cma, sdk, newWebComp, webCompHtml, setIsSaving);
                    }}>
                    {input.selectItems?.map(item => {
                      return (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                );
              }else if (input.type === 'reference' && webComponentRefs) {
                return (
                  <TextField 
                    key={`name_${member.name}`}
                    select
                    label={input.attribute}
                    value={input.value}
                    helperText={member.description}
                    onChange={(evt) => {
                      const newWebComp = {...webComponent};
                      const thisMember = newWebComp.members[index];
                      thisMember.value = evt.target.value;
                      setWebComponent(newWebComp);
                      saveWebComponentConfig(cma, sdk, newWebComp, webCompHtml, setIsSaving);
                    }}>
                    {webComponentRefs.map(ref => {
                      return (
                        <MenuItem key={ref.sys.id} value={ref.sys.id}>
                          {ref.fields.title}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                );
              }
              return '';
            })) :
            ('')
          }
          {webComponent ? (
            <Grid container>
              { isSaving ? (
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
              ) : ""}
              <Grid xs></Grid>
              <Button
                variant="contained"
                disabled={isSaving}
                onClick={async () => {
                  saveWebComponentConfig(cma, sdk, webComponent, webCompHtml, setIsSaving);
                }}>
                Save
              </Button>
            </Grid>
          ) : ''}
        </Stack>
      </Grid>
      <Grid xs sx={{
          bgcolor: '#eeeeee',
          height: `100%`,
          overflowY: 'auto'
        }}
        justifyContent="center"
        alignItems="center"
        display="flex">
        <div dangerouslySetInnerHTML={{__html:webCompHtml}}></div>
      </Grid>
    </Grid>
  );
};

export default EntryEditor;
