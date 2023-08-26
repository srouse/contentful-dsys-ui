import getClient from "./client.mjs";
import padNumber from "./paddNumber.mjs";



export default class State {

  entries = {};
  entriesToLoad = [];
  assetsToLoad = [];

  distFolder;

  context = {
    totalCalls: 0,
    totalEntries: 0,
    errorCalls: [],
    totalCallCycles: 0,
  };

  client = getClient();

  getEntry(identifier) {
    if (!identifier ) return undefined;
    return this.entries[identifier];
  }

  addEntry(entry) {
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

  addEntryToLoad(identifier) {
    if (
      !this.entries[identifier] &&
      !this.entriesToLoad.includes(identifier)
    ) {
      this.entriesToLoad.push(identifier);
    }
  }

  addAssetToLoad(id) {
    if (!this.assetsToLoad.includes(id)) {
      this.assetsToLoad.push(id);
    }
  }

  processValue(
    value
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
Total Calls:       ${padNumber(this.context.totalCalls)}
Total Entities:    ${padNumber(this.context.totalEntries)}
Total Call Cycles: ${padNumber(this.context.totalCallCycles)}
Errors:            ${padNumber(this.context.errorCalls.length)}${
  this.context.errorCalls.length > 0 ? 
  `\n${JSON.stringify(this.context.errorCalls, null, 2)}` : ''}
===========================`;
  }

}