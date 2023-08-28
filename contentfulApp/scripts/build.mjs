import esbuild from "./esbuild.mjs";

(async () => {
  const config = {
    distPath: `../build/_ctflapp`,
    srcPath: './src',
    entryPoints: [
      `src/index.tsx`,
    ],
    // sassIncludePaths: [
    //     `${distPath}/web/scss/`,
    // ],
  };

  await esbuild(false, config);
})()
