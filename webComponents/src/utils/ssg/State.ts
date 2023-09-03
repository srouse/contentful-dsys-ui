import { Entry, Link } from "contentful";
import { IWebComponent, IWebsite } from "src/contentful-types";

export default class State {

  entries: {[key:string]: Entry<unknown>} = {};
  webComponents: {[key:string]: Entry<unknown>[]}  = {};
  entriesToLoad: string[] = [];
  assetsToLoad: string[] = [];
  website: IWebsite;

  distFolder: string;

  context = {
    totalCalls: 0,
    totalEntries: 0,
    errorCalls: [],
    totalCallCycles: 0,
  };

  // client = getClient();

  config: {};// passed via build
  /*
    tags,
    destination,
    webCompJsPath,
    renderWebComp,
    renderHtml
  */

  getEntry(identifier: string | undefined) : Entry<unknown> | undefined {
    if (!identifier ) return undefined;
    return this.entries[identifier];
  }

  addEntry(entry: Entry<unknown> | undefined) {
    if (
      !entry ||
      !entry.sys ||
      entry.sys.type === 'Link'
    ) return;

    // Don't re-add
    const sysId = entry.sys.id;
    if (this.entries[sysId]) {
      return;
    }

    // Remove from entries to load...
    const entryLoadedIndex = this.entriesToLoad.indexOf(sysId);
    if (entryLoadedIndex !== -1) {
      this.entriesToLoad.splice(entryLoadedIndex, 1);
    }

    this.context.totalEntries++;
    this.entries[sysId] = entry;

    if (
      entry.sys.contentType.sys.id === 'webComponent'
    ) {
      const webComp = entry as IWebComponent;
      const config = webComp.fields.configuration;
      if (config) {
        if (!this.webComponents[config.name]) {
          this.webComponents[config.name] = [];
        }
        this.webComponents[config.name]!.push(entry);
      }
    }

    // look for child entries 
    if (entry.fields) {
      const fields = Object.values(entry.fields);
      fields.map(value => {
        if (Array.isArray( value )) {
          const valueArr = value;
          valueArr.map((valueValue) => {
            this.processValue(valueValue);
          })
        }else{
          this.processValue(value);
        }
      });
    }
  }

  addEntryToLoad(identifier: string) {
    if (
      !this.entries[identifier] &&
      !this.entriesToLoad.includes(identifier)
    ) {
      this.entriesToLoad.push(identifier);
    }
  }

  addAssetToLoad(id: string) {
    if (!this.assetsToLoad.includes(id)) {
      this.assetsToLoad.push(id);
    }
  }

  processValue(
    value: Entry<any> | Link<any> | any
  ) {
    if (!value || !value.sys) {// a simple value...
      return;
    }

    if (value.sys.type === 'Entry') {
      const entry = value;
      this.addEntry(entry);
      return;
    }

    if (value.sys.type === 'Link') {
      const link = value;
      if (link.sys.linkType === 'Asset') {
        this.addAssetToLoad(link.sys.id);
      }else if (link.sys.linkType === 'Entry') {
        this.addEntryToLoad(link.sys.id);
      }
    }
  }

  generateSummary() {
    return `= SSG API CALLS ===========
Total Calls:       ${this.padNumber(this.context.totalCalls)}
Total Entities:    ${this.padNumber(this.context.totalEntries)}
Total Call Cycles: ${this.padNumber(this.context.totalCallCycles)}
Errors:            ${this.padNumber(this.context.errorCalls.length)}${
  this.context.errorCalls.length > 0 ? 
  `\n${JSON.stringify(this.context.errorCalls, null, 2)}` : ''}
===========================`;
  }

  padNumber(num: number) {
    const timePadding = new Array(9 - `${num}`.length).join(' ');
    return `${timePadding}${num}`;
  }

}