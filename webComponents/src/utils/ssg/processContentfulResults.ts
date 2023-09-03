import { Entry, EntryCollection, Asset } from "contentful";
import State from "./State";

/**
 * processContentfulResults
 * Takes the results of a contentful api request, finds the
 * needed linked objects and adds them to a list of 
 * need to load entries...
 * @param {void | EntryCollection<unknown>} results
 * @param {BaseController} controller
 * @return {void}
 */
export function processContentfulResults(
  results: void | EntryCollection<any>,
  state: State
) {
  if (!results || !results.items) return;
  results.items.map((entry) => {
    state.addEntry(entry);
  });
  // Contentful API calls (sometimes?) puts the 
  // referenced entries/assets in an includes property
  if (results.includes) {
    if (results.includes.Entry) {
      results.includes.Entry.map((entry: Entry<any>) => {
        state.addEntry(entry);
      });
    }
    if (results.includes.Asset) {
      results.includes.Asset.map((asset: Asset) => {
        state.addAssetToLoad(asset.sys.id);
      });
    }
  }
}