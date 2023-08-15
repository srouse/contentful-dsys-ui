import getAlias from "./getAlias.mjs";
import getResolvedType from "./getResolvedType.mjs";
import getResolvedValue from "./getResolvedValue.mjs";

let newIndex = 0;

export default function processVariables(
    varCollectionAction,
    variables,
    names,
    varActionsArgs,
    figmaLookups
) {
    Object.entries( variables ).map(varInfo => {
        const varNameRoot = varInfo[0];
        const varName = [...names, varNameRoot].join('-');
        const varObj = varInfo[1];

        if (varObj.value) {
            console.log(varName);
            const alias = getAlias(varObj.value, figmaLookups);
            if (figmaLookups.varsNameLookup[varName]) {// IS in Figma
                const figmaVariable = figmaLookups.varsNameLookup[varName];
                const resolvedType = getResolvedType(
                    varObj.type, alias
                );
                varActionsArgs.variables.push({
                    action: 'UPDATE',
                    id: figmaVariable.id,
                    name: varName,
                    variableCollectionId: varCollectionAction.id,
                    resolvedType
                });
                varActionsArgs.variableModeValues.push({
                    action: 'UPDATE',
                    variableId: figmaVariable.id,
                    modeId: varCollectionAction.initialModeId,
                    value: getResolvedValue(
                        varObj.value, resolvedType, alias
                    ),
                });
            }else{// NOT in Figma
                // varActions.creates.push(varObj);
                const newVarId = `NewVariable-${newIndex++}`;
                const resolvedType = getResolvedType(
                    varObj.type, alias
                );
                varActionsArgs.variables.push({
                    action: 'CREATE',
                    id: newVarId,
                    name: varName,
                    variableCollectionId: varCollectionAction.id,
                    resolvedType
                });
                varActionsArgs.variableModeValues.push({
                    action: 'CREATE',
                    variableId: newVarId,
                    modeId: varCollectionAction.initialModeId,
                    value: getResolvedValue(
                        varObj.value, resolvedType, alias
                    ),
                });
                // just need id for lookup...
                figmaLookups.varsNameLookup[varName] = {
                    id: newVarId,
                    type: varObj.type
                };
            }
        }else{
            processVariables(
                varCollectionAction,
                varObj,
                [...names, varNameRoot],
                varActionsArgs,
                figmaLookups
            );
        }
    });
}