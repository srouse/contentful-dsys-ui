import {promises as fs} from 'fs';

const WEB_COMP_ID = 'webComponent';

export default function renderState(state) {
  return Promise.all(
    Object.values(state.entries).map(entry => {
      const finalFolder = `${state.distFolder}/${entry.sys.id}`;
      if (entry.sys.contentType.sys.id === WEB_COMP_ID) {
        return (async ()=> {
          await createContentfulDataCache(finalFolder, entry);
          await createWebCompHtml(finalFolder, entry, state);
          return finalFolder
        })();
      }else{
        return (async ()=> {
          await createContentfulDataCache(finalFolder, entry);
          return finalFolder
        })();
      }
    })
  );
}

async function createWebCompHtml(finalFolder, entry, state) {
  await fs.mkdir(finalFolder, { recursive: true });
  const config = entry.fields.configuration;
  const html = `
  <script src="/_webcomps/web-comps/cui-button/cui-button.js" type="module"></script>
  <script src="/_webcomps/web-comps/cui-color-doc/cui-color-doc.js" type="module"></script>
  <link href="/_webcomps/web/css/_variables.css" rel="stylesheet"></link>
  <${
    config.tagName
  } ${config.members.map(member => {
    if (
      member.type.text.indexOf('I') === 0
    ) {
      const entry = state.getEntry(member.value);
      if (entry) {
        return member.value ? `${member.name}="${
          JSON.stringify(entry).replace(/"/g, '#quote;')
        }"` : '';
      }
    }
    return member.value ? `${member.name}="${member.value}"` : '';
  }).join(' ')}></${
    config.tagName
  }>`;

  await fs.writeFile(
    `${finalFolder}/index.html`,
    html
  );
}

async function createContentfulDataCache(finalFolder, entry) {
  await fs.mkdir(finalFolder, { recursive: true });
  await fs.writeFile(
    `${finalFolder}/index.json`,
    JSON.stringify(entry, null, 2)
  );
}