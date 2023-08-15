import fs from 'fs';
import fse from 'fs-extra';
import {logDone, logStart} from './log.mjs';
import runScript from './runScript.mjs';

/**
 * Manifest
 * @param {object} buildConfig
 * @return {void}
 */
export default async function manifest(buildConfig) {
  logStart('Creating Component Manifest File');

  const fileName = 'custom-elements.json';

  // it doesn't take absolute paths, so creating then moving...
  const tempPath = '';// cli joins with pwd, so just send this...
  await runScript(
    'custom-elements-manifest',
    [
      'analyze',
      '--outdir', tempPath,
      '--litelement',
      '--globs', `${buildConfig.srcPath}/**/*.ts`,
      '--exclude', `${buildConfig.srcPath}/*.ts|./src/**/*.test.ts`,
    ],
  );

  // now move that file to final destination
  const sourceFile = `${process.cwd()}/${fileName}`;
  if (
    fs.existsSync(sourceFile) &&
    fs.existsSync(buildConfig.distPath)
  ) {
    fse.moveSync(
      sourceFile,
      `${buildConfig.distPath}/${fileName}`,
      {overwrite: true},
    );
  }

  logDone(
    `Component Manifest File ${buildConfig.distPath}/${fileName}`,
  );
  return null;
};


