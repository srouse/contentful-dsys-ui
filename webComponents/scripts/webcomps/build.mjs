import esbuild from "./esbuild.mjs";
import manifest from "./manifest.mjs";
import { distPath, srcPath } from "../config.mjs";

(async () => {
  const config = {
    distPath: `${distPath}/web-comps`,
    srcPath,
    entryPoints: [
      `${srcPath}/index.ts`,
      `${srcPath}/cui-button/cui-button.ts`,
      `${srcPath}/cui-button/CUIButton.ts`,
      `${srcPath}/cui-color-doc/cui-color-doc.ts`,
      `${srcPath}/cui-color-doc/CUIColorDoc.ts`,
      `${srcPath}/cui-page/cui-page.ts`,
      `${srcPath}/cui-page/CUIPage.ts`,
      `${srcPath}/cui-section/cui-section.ts`,
      `${srcPath}/cui-section/CUISection.ts`,
      `${srcPath}/utils/ssg/SSG.ts`,
    ],
    sassIncludePaths: [
        `${distPath}/web/scss/`,
    ],
  };

  await esbuild(false, config);
  await manifest(config);
})()
