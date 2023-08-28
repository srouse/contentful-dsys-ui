import buildAndServe from "./esbuild-server.mjs";

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

  await buildAndServe(config);
})()
