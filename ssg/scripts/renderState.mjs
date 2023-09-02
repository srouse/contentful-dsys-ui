import {promises as fs} from 'fs';

const WEB_COMP_ID = 'webComponent';

export default function renderState(state) {
  return Promise.all(
    Object.values(state.entries).map(entry => {
      let finalFolder = `${state.config.destination}/${entry.sys.id}`;
      if (entry.fields.slug) {
        finalFolder = `${state.config.destination}/${entry.fields.slug}`;
      }
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

  // slots...

  const componentHtml = `<${
    config.tagName
  } ${config.members.map(member => {

    // Reference (single)
    if (
      member.type.text.indexOf('ContentfulEntry') === 0 &&
      member.type.text.lastIndexOf('[]]') !== member.type.text.length -2
    ) {
      const entry = state.getEntry(member.value);
      if (entry) {
        return `${member.name}="${
          JSON.stringify(entry).replace(/"/g, '&quot;')
        }"`;
      }
    }

    // Reference Array
    if (
      member.type.text.indexOf('ContentfulEntry') === 0 &&
      member.type.text.lastIndexOf('[]') === member.type.text.length -2
    ) {
      const entries = member.valueArr.map(val => {
        return state.getEntry(val);
      })
      if (entries) {
        return `${member.name}="${
          JSON.stringify(entries).replace(/"/g, '&quot;')
        }"`;
      }
    }
  
    return member.value ? `${member.name}="${member.value}"` : '';
  }).join(' ')}></${
    config.tagName
  }>`;

  let html = componentHtml;
  if (state.website) {
    html = state.website.fields.htmlFullTemplate?.replace(
      /{{content}}/g, componentHtml
    ).replace(
      /{{metadata}}/g, ''
    ).replace(
      /{{header}}/g, ''
    ).replace(
      /{{footer}}/g, ''
    );
  }

  await fs.writeFile(
    `${finalFolder}/index.html`,
    html // state.config.renderHtml(webComp, html)
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
  const slug = webComp.fields.slug ?
    webComp.fields.slug.substring(0, webComp.fields.slug.length-1) : undefined;
  const classId = slug ?
    slug.replace(/\/./g, x=>x[1].toUpperCase()) :
    webComp.sys.id;
  const className = `${config.name}${classId}`;
  const tagId = slug ?
    slug.replace(/\/./g, '-') :
    `-${webComp.sys.id}`;
  const tagName = `${config.tagName}${tagId}`.toLowerCase();

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