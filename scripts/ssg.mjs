import { build } from '../ssg/scripts/build.mjs'

const webCompJsPath = (webComp) => {
  const config = webComp.fields.configuration;
  return `/_webcomps/web-comps/${config.tagName}/${config.tagName}.js`;
}

const webCompClassJsPath = (webComp) => {
  const config = webComp.fields.configuration;
  return `/_webcomps/web-comps/${config.tagName}/${config.name}.js`;
}

const renderWebComp = (
  webComp,
  content,
  // state,
) => {
  const config = webComp.fields.configuration;
  return `
import ${config.name} from '${webCompClassJsPath(webComp)}';
${content}`;
};

(async () => {
  await build({
      tags: 'contentfulDesignSystemExample',
      destination: './build',
      webCompJsPath,
      renderWebComp
  });
})();