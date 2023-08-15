import chalk from "chalk";
import render from 'contentful-typescript-codegen/dist/lib/renderers/render.js';
import contentfulManagement from 'contentful-management';
import {promises as fs} from 'fs';
import 'dotenv/config';
import path from 'path';

export default async function types(output) {
  console.log(chalk.grey(`building typescript types to ${output}`));

  console.log(chalk.grey(`creating client...`));
  const contentfulClient = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN
  });

  console.log(chalk.grey(`loading space...`));
  const space = await contentfulClient.getSpace(
    process.env.CONTENTFUL_SPACE
  );

  console.log(chalk.grey(`loading environment...`));
  const environment = await space.getEnvironment(
    process.env.CONTENTFUL_ENVIRONMENT
  );

  console.log(chalk.grey(`loading content types...`));
  const contentTypes = await environment.getContentTypes({ limit: 1000 });
  const locales = await environment.getLocales();

  let types = await render.default(contentTypes.items, locales.items, {
    localization: false,
    namespace: '',
  });

  const outputFolder = path.dirname(output);
  await fs.mkdir(outputFolder, { recursive: true })
  await fs.writeFile(output, types);

  console.log(chalk.grey(`types written to ${output}`));
  console.log(chalk.green('Typescript types done\n'));
}

(async () => {
  await types('./src/contentful-types.d.ts');
})()