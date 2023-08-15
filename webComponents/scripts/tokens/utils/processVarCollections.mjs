import processVariables from "./processVariables.mjs";

let newIndex = 0;

export default function processVarCollections(
    varCollections, varActionsArgs, figmaLookups
) {
    // var collections are only on the root
    Object.entries( varCollections ).map(varCollectionInfo => {
        const varCollectionName = varCollectionInfo[0];
        const varCollection = varCollectionInfo[1];
        let varCollectionAction;
        // IS in Figma...
        if (figmaLookups.varCollectionsNameLookup[varCollectionName]) {
            const figmaVarCollection = figmaLookups.varCollectionsNameLookup[varCollectionName];
            varCollectionAction = {
                action: 'UPDATE',
                id: figmaVarCollection.id,
                name: varCollectionName,
                initialModeId: figmaVarCollection.defaultModeId,
            };
        }else{// NOT in Figma
            varCollectionAction = {
                action: 'CREATE',
                name: varCollectionName,
                id: `NewVarCollection-${newIndex++}`,
                initialModeId: `NewMode-${newIndex++}`,
            };
            figmaLookups.varCollectionsNameLookup[varCollectionName] = varCollectionAction;
        }
        
        varActionsArgs.variableCollections.push(varCollectionAction);
        processVariables(
            varCollectionAction,
            varCollection,
            [],
            varActionsArgs,
            figmaLookups
        );
    });
}
