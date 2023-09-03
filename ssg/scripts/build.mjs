import {promises as fs} from 'fs';
import SSG from 'contentful-auto-ui/web-comps/utils/ssg/SSG.js';
import getClient from "./client.mjs";

const WEB_COMP_ID = 'webComponent';

export async function build (
  config/*
      {
        tags,
        destination,
        webCompJsPath,
        webCompClassJsPath,
      }*/
) {
  const client = getClient();
  const ssg = new SSG(client, config.tags);
  await ssg.loadEntries();

  await Promise.all(
    Object.values(ssg.state.entries).map(entry => {
      let finalFolder = `${config.destination}/${entry.sys.id}`;
      if (entry.fields.slug) {
        // all slugs start with a forward slash
        finalFolder = `${config.destination}${entry.fields.slug}`;
      }
      return (async ()=> {
        await fs.mkdir(finalFolder, { recursive: true });
        await createContentfulDataCache(finalFolder, entry);
        if (entry.sys.contentType.sys.id === WEB_COMP_ID) {
          await createAndRenderWebCompHtml(
            finalFolder, entry, ssg
          );
          await createAndRenderWebCompJs(
            finalFolder, entry, ssg,
            config.webCompClassJsPath
          );
        }
        return finalFolder;
      })();
    })
  );

  console.log(ssg.state.generateSummary());
}

async function createContentfulDataCache(finalFolder, entry) {
  await fs.writeFile(
    `${finalFolder}/data.json`,
    JSON.stringify(entry, null, 2)
  );
}

async function createAndRenderWebCompHtml(finalFolder, entry, ssg) {
  const html = await ssg.renderHtml(entry.sys.id);
  await fs.writeFile(
    `${finalFolder}/index.html`,
    html
  );
}

async function createAndRenderWebCompJs(
  finalFolder, entry, ssg,
  webCompClassJsPath
) {
  const webCompJS = await ssg.renderJs(entry.sys.id, webCompClassJsPath);
  await fs.writeFile(
    `${finalFolder}/comp.js`,
    webCompJS
  );
}
