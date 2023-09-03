import { WebComponentMember } from "src/types";
import State from "../State";
import renderHtml from "./renderHtml";
import { IWebComponent } from "src/contentful-types";

export default async function renderSlotHtml(
  entry: IWebComponent | undefined,
  state: State
) {
  if (!entry || !entry.fields.configuration) return '';
  const config = entry.fields.configuration;

  // SLOTS
  const slotHtmlPromiseArr: Promise<string>[] = [];
  config.slots?.map((slot: WebComponentMember) => {
    if (slot.valueArr) {
      const slotHtmlArr: Promise<string>[] = [];
      slot.valueArr.map(entryId => {
        const entry = state.getEntry(entryId);
        if (entry) {
          const entryWebCompHtml = renderHtml(
            entry as IWebComponent, state, false
          );
          slotHtmlArr.push(entryWebCompHtml);
        }
      });
      slotHtmlPromiseArr.push((async () => {
        const results = await Promise.all(slotHtmlArr);
        if (slot.name) {
          return `<div slot="${slot.name}">\n${results.join('\n')}\n</div>`;
        }
        return results.join('\n');
      })());
    }
  });
  return (await Promise.all(slotHtmlPromiseArr)).join('\n');
}