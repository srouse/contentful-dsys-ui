// import figmaGet from "./figmaGet.mjs";
// import figmaPost from "./figmaPost.mjs";
// import { promises as fs } from 'fs';
// import processVarCollections from "./utils/processVarCollections.mjs";

// // gather variables and create lookups
// const variables = await figmaGet('variables/local');
// const figmaLookups = {
//     varCollectionsIDLookup: {},
//     varCollectionsNameLookup: {},
//     varsIDLookup: {},
//     varsNameLookup: {}
// };
// const figmaDistFolder = './dist/web/figma';

// const downloadFolder = `${figmaDistFolder}/downloaded/`;
// await fs.mkdir(downloadFolder, { recursive: true })
// await fs.writeFile(`${downloadFolder}/variables.json`, JSON.stringify(variables, null ,2 ));

// Object.values(variables.meta.variableCollections).map(varCollection => {
//     figmaLookups.varCollectionsIDLookup[varCollection.id] = varCollection;
//     figmaLookups.varCollectionsNameLookup[varCollection.name] = varCollection;
// });
// Object.values(variables.meta.variables).map(variable => {
//     figmaLookups.varsIDLookup[variable.id] = variable;
//     figmaLookups.varsNameLookup[variable.name] = variable;
// });

// // walk through the tokens and compare against what is there...
// const tokensRaw = await fs.readFile(`${figmaDistFolder}/variables.json`, 'utf8');
// const tokens = JSON.parse(tokensRaw);

// const varActionsArgs = {
//     variableCollections: [],
//     variables: [],
//     variableModeValues: []
// }

// processVarCollections(tokens, varActionsArgs, figmaLookups);
// await fs.writeFile(`${downloadFolder}/actions.json`, JSON.stringify(varActionsArgs, null ,2 ));
// await fs.writeFile(`${downloadFolder}/lookups.json`, JSON.stringify(figmaLookups, null ,2 ));

// await figmaPost(varActionsArgs);
// console.log('DONE');
