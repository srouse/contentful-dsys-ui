import { build } from '../ssg/scripts/build.mjs'

(async () => {
  await build({
      tags: 'contentfulDesignSystemExample',
      destination: './build',
      webCompJsPath: (webComp) => {
        const config = webComp.fields.configuration;
        return `/_webcomps/web-comps/${config.tagName}/${config.tagName}.js`;
      },
      webCompClassJsPath: (webComp) => {
        const config = webComp.fields.configuration;
        return `/_webcomps/web-comps/${config.tagName}/${config.name}.js`;
      }
  });
})();