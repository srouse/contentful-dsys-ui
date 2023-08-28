import getPort from 'get-port';
import browserSync from 'browser-sync';
import chalk from 'chalk';
import esbuild from './esbuild.mjs';

const PORT = 3000;

export default async function buildAndServe(config) {
  // ESBuild
  const buildResult = await esbuild(true, config);
  server( buildResult );
}

export async function server(
  buildResult,
) {
  console.log(chalk.yellow(`Creating Dev Server`));

  const browser = browserSync.create();

  const port = await getPort({
    port: PORT // portNumbers(4000, 4999)
  });

  if (port !== PORT) {
    console.log(chalk.magenta(`Error: couldn't get port ${PORT}`));
    return;
  }

  console.log(chalk.cyan(`Launched: http://localhost:${port}\n`));
  
  // Launch browser sync
  browser.init({
    startPath: '/_ctflapp',
    port,
    logLevel: 'silent',
    logPrefix: '[log]',
    logFileChanges: false,
    injectChanges: false,
    notify: false,
    open: false,
    cors: true,
    server: {
      baseDir: `${process.env.PWD}/../build/`,
      directory: false
    },
    ui: {
      port: 8090
    },
  }, (err, bs) => {
    // console.log('browserSync err', err);
  });

  browser.watch([// REBUILD
      `${process.env.PWD}/src/**`,
      // `${process.env.PWD}/../src/**`,
    ],{}).on('change', async filename => {
    rebuildAndReload(
      buildResult,
      browser,
      filename,
    );// , buildConfig);
  });
}

async function rebuildAndReload(
  buildResult,
  browser,
  filename,
) {
  console.log(chalk.yellow(`Rebuilding (${filename})`));
  buildResult
    .rebuild()
    .then(() => {
      console.log(chalk.cyan(`Rebuilding Done\n`));
      return Promise.resolve();
    })
    .then(async () => {
      return Promise.resolve(false);
    })
    .then(() => browser.reload())
    .then(() => console.log(chalk.cyan(`Rebuilt\n`)))
    .catch(err => console.error(chalk.red(err)));
}