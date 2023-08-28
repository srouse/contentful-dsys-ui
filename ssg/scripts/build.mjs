import { processContentfulResults } from "./processContentfulResults.mjs";
import renderState from "./renderState.mjs";
import State from "./state.mjs";
import {promises as fs} from 'fs';

const CONTENTFUL_INCLUDE = 0;// 10;
const MAX_LOADED = 1000;

export async function build (
  config
  /*
    tags,
    destination,
    webCompJsPath,
    renderWebComp,
    renderHtml
  */
) {
  const state = new State();
  if (!state.client) return;
  state.config = config;
  state.context.totalCalls++;
  const results = await state.client.getEntries({ 
    'content_type': 'webComponent',
    ['metadata.tags.sys.id[all]']: config.tags, 
    'include': CONTENTFUL_INCLUDE
  }).catch(console.error);

  processContentfulResults(results, state);
  await loadEntriesToLoad(state);

  // good to go, render
  await renderState(state);
  
  await fs.writeFile(
    `${state.config.destination}/state.json`,
    JSON.stringify(state, null, 2)
  );
  console.log(state.generateSummary())
}

async function loadEntriesToLoad(state) {
  const totalLeft = state.entriesToLoad.length;
  if (totalLeft === 0) return;
  if (!state.client) return;

  state.context.totalCallCycles++;
  const entriesToLoad = state.entriesToLoad.splice(0, MAX_LOADED);

  state.context.totalCalls++;
  const entryResults = await state.client.getEntries({
    [`sys.id[in]`]: entriesToLoad.join(','),
    // TODO: Figure out what to load and not to load...
    'include': CONTENTFUL_INCLUDE,
    'limit': MAX_LOADED,
  });

  processContentfulResults(
    entryResults,
    state
  );
  await loadEntriesToLoad(state);
}