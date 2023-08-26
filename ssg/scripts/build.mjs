import { processContentfulResults } from "./processContentfulResults.mjs";
import renderState from "./renderState.mjs";
import State from "./state.mjs";

const CONTENTFUL_INCLUDE = 0;// 10;
const MAX_LOADED = 1000;

export async function build (
  tags, distFolder
) {
  const state = new State();
  if (!state.client) return;
  state.distFolder = distFolder;
  state.context.totalCalls++;
  const results = await state.client.getEntries({ 
    'content_type': 'webComponent',
    ['metadata.tags.sys.id[all]']: tags, 
    'include': CONTENTFUL_INCLUDE
  }).catch(console.error);

  processContentfulResults(results, state);
  await loadEntriesToLoad(state);

  // good to go, render
  const renderResults = await renderState(state);
  console.log('renderResults', renderResults);
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