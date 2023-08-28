import {promises as fs} from 'fs';

const WEB_COMP_ID = 'webComponent';

export default function renderState(state) {
  return Promise.all(
    Object.values(state.entries).map(entry => {
      const finalFolder = `${state.config.destination}/${entry.sys.id}`;
      if (entry.sys.contentType.sys.id === WEB_COMP_ID) {
        return (async ()=> {
          await createContentfulDataCache(finalFolder, entry);
          await createWebCompHtml(finalFolder, entry, state);
          await createWebComp(finalFolder, entry, state);
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

async function createWebCompHtml(finalFolder, webComp, state) {
  await fs.mkdir(finalFolder, { recursive: true });
  const config = webComp.fields.configuration;
  const html = `<${
    config.tagName
  } ${config.members.map(member => {
    if (
      member.type.text.indexOf('ContentfulEntry') === 0
    ) {
      const entry = state.getEntry(member.value);
      if (entry) {
        return member.value ? `${member.name}="${
          JSON.stringify(entry).replace(/"/g, '&quot;')
        }"` : '';
      }
    }
    return member.value ? `${member.name}="${member.value}"` : '';
  }).join(' ')}></${
    config.tagName
  }>`;

  await fs.writeFile(
    `${finalFolder}/index.html`,
    state.config.renderHtml(webComp, html)
  );
}

async function createContentfulDataCache(finalFolder, entry) {
  await fs.mkdir(finalFolder, { recursive: true });
  await fs.writeFile(
    `${finalFolder}/data.json`,
    JSON.stringify(entry, null, 2)
  );
}

async function createWebComp(finalFolder, webComp, state) {
  const config = webComp.fields.configuration;
  const className = `${config.name}${webComp.sys.id}`;
  const tagName = `${config.tagName}-${webComp.sys.id}`.toLowerCase();
  const webCompJS = `
export default class ${className} extends ${config.name} {
  ${config.members.map(member => {
    if (
      member.type.text.indexOf('ContentfulEntry') === 0
    ) {
      const entry = state.getEntry(member.value);
      if (entry) {
        return member.value ? `${member.name}= ${
          JSON.stringify(entry)
        };` : '';
      }
    }
    return member.value ? `${member.name} = "${member.value}";` : '';
  }).join('\n\t')}
}
customElements.define('${tagName}', ${className} );`;

  await fs.mkdir(finalFolder, { recursive: true });
  await fs.writeFile(
    `${finalFolder}/comp.js`,
    state.config.renderWebComp(webComp, webCompJS)
  );
}