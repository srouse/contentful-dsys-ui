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

const renderHtml = (
  webComp,
  content,
  // state
) => {
  return `
<!DOCTYPE html>
<html lang="en" data-web-comp-id="${webComp?.sys.id}">
<head>
  <script src="${webCompJsPath(webComp)}" type="module"></script>
  <link href="/_webcomps/web/css/_variables.css" rel="stylesheet"></link>
</head>
<body>
  ${content}
</body>
</html>`;
};

(async () => {
  await build({
      tags: 'contentfulDesignSystemExample',
      destination: './build',
      webCompJsPath,
      renderWebComp,
      renderHtml
  });
})();