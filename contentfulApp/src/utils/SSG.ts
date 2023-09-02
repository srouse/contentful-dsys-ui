import { EntryProps, KeyValueMap } from "contentful-management";
import { getClient } from "./contentfulClient";
import { EditorAppSDK } from "@contentful/app-sdk";
import { IWebsite, WebComponent } from "../types";
import memberToInput from "./memberToInput";
import { ContentfulClientApi, Entry as EntryCPA } from 'contentful';

export default class SSG {

  tag: string | undefined;
  website: IWebsite | undefined;
  client: ContentfulClientApi | false | undefined;

  async establishWebsite(
    entry: EntryProps<KeyValueMap>,
    sdk: EditorAppSDK
  ) {
    if (entry.metadata?.tags.length === 0) {
      return;
    }
    const tag = entry.metadata?.tags[0];
    this.tag = tag?.sys.id;
    
    this.client = getClient(
      entry.sys.space.sys.id,
      entry.sys.environment.sys.id,
      sdk.parameters.installation.contentfulPreviewAccessKey,
      true,
    );
  }

  async findWebsite() {
    if (!this.client) return;
    const websiteResult = await this.client.getEntries({
      'content_type': 'website',
      'metadata.tags.sys.id[all]': this.tag, 
    }).catch(console.error);// eat the error

    if (!websiteResult || websiteResult?.total === 0) {
      console.error('website was not found')
      return;
    }
    this.website = websiteResult.items[0] as IWebsite;
  }

  async render(
    webComponent: WebComponent | undefined,
    webComponentCPARefs: EntryCPA<unknown>[],
    slotName? : string,
  ): Promise<string> {
    if (!webComponent) {
      return '';
    }
    if (!this.website) {
      await this.findWebsite();
    }
    const attr: string[] = [];
    const slotPromises: Promise<string>[] = [];
    webComponent.slots?.map(slot => {
      const input = memberToInput(slot);
      const inputRefs = input.valueArr?.map(val => {
        return webComponentCPARefs.find(ref => ref.sys.id === val);
      });
      if (inputRefs) {
        inputRefs.map((inputRef) => {
          if (!inputRef) return false;
          slotPromises.push(
            this.render(
              (inputRef.fields as any).configuration as WebComponent,
              webComponentCPARefs,
              slot.name
            )
          );
          return true;
        });
      }
      return true;
    });
    webComponent.members.map(member => {
      const input = memberToInput(member);
      if (
        input.type === 'reference' ||
        input.type === 'referenceArray'
      ) {
        const valueArr = input.type === 'reference' ?
          [input.value] : input.valueArr;
        const inputRefs = valueArr?.map(val => {
          return webComponentCPARefs.find(ref => ref.sys.id === val);
        });
        if (inputRefs) {
          attr.push(`${input.attribute}="${
            JSON.stringify(inputRefs).replace(/"/g, '&quot;')
          }"`);
        }
      }else{
        attr.push(`${input.attribute}="${input.value}"`);
      }
      return true;
    });

    const slots = await Promise.all(slotPromises);

    const componentHtml =
      `<${webComponent?.tagName} ${
          attr.join(' ')
        }${slotName ? ` slot="${slotName}"` : ''}>${slots.join('')}</${webComponent?.tagName}>`;

    let html = this.website?.fields.htmlFullTemplate?.replace(
      /{{content}}/g, componentHtml
    ).replace(
      /{{metadata}}/g, ''
    ).replace(
      /{{header}}/g, ''
    ).replace(
      /{{footer}}/g, ''
    );

    return html || '';
  }
}

