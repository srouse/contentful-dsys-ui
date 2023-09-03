import { ContentfulClientApi } from "contentful";
import State from "./State";
import { processContentfulResults } from "./processContentfulResults";
import { IWebComponent, IWebsite } from "src/contentful-types";
import renderHtml from "./renderers/renderHtml";
import renderJs from "./renderers/renderJs";

const CONTENTFUL_INCLUDE = 0;// 10;
const MAX_LOADED = 1000;

export default class SSG {

  state: State;
  client: ContentfulClientApi;
  tags: string;

  constructor(
    client: ContentfulClientApi,
    tags: string
  ) {
    this.client = client;
    this.tags = tags;
    this.reset();
  }

  reset() {
    this.state = new State();
  }

  async loadEntries(entryId: string | undefined) {
    // Website needed each time...
    const websiteResults = await this.client.getEntries({ 
      'content_type': 'website',
      ['metadata.tags.sys.id[all]']: this.tags, 
      'include': CONTENTFUL_INCLUDE
    }).catch(console.error);
    if (websiteResults && websiteResults.total > 0) {
      this.state.website = websiteResults.items[0] as IWebsite;
    }
    processContentfulResults(websiteResults, this.state);

    if (entryId) {
      const webComp = await this.client.getEntry(
        entryId, {include: 6},
      ).catch(console.error);
      if (webComp) this.state.addEntry(webComp as IWebComponent);
    }else{
      const webCompResults = await this.client.getEntries({ 
        'content_type': 'webComponent',
        ['metadata.tags.sys.id[all]']: this.tags, 
        'include': CONTENTFUL_INCLUDE
      }).catch(console.error);
      processContentfulResults(webCompResults, this.state);
    }

    await this.loadEntriesToLoad();
  }

  async loadEntriesToLoad() {
    const totalLeft = this.state.entriesToLoad.length;
    if (totalLeft === 0) return;
    if (!this.client) return;
  
    this.state.context.totalCallCycles++;
    const entriesToLoad = this.state.entriesToLoad.splice(0, MAX_LOADED);
  
    this.state.context.totalCalls++;
    const entryResults = await this.client.getEntries({
      [`sys.id[in]`]: entriesToLoad.join(','),
      // TODO: Figure out what to load and not to load...
      'include': CONTENTFUL_INCLUDE,
      'limit': MAX_LOADED,
    });
  
    processContentfulResults(
      entryResults,
      this.state
    );
    await this.loadEntriesToLoad();
  }

  async renderHtml(entryId: string | undefined) {
    const entry = this.state.getEntry(entryId);
    if (entry) {
      const html = renderHtml(
        entry as IWebComponent,
        this.state
      );
      return html;
    }
    return '';
  }

  async renderJs(
    entryId: string | undefined,
    webCompClassJsPath: (entry: IWebComponent) => string,
  ) {
    const entry = this.state.getEntry(entryId);
    if (entry) {
      const html = renderJs(
        entry as IWebComponent,
        this.state,
        webCompClassJsPath
      );
      return html;
    }
    return '';
  }

}