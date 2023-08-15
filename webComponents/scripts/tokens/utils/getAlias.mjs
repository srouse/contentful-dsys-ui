

export default function getAlias(
    value, figmaLookups
) {
    const valueStr = `${value}`;
    if (valueStr.indexOf('{') === 0 ) {
        const varName = valueStr
            .substring(1, valueStr.length-1)
            .replace(/\./g, '-');
        const varRef = figmaLookups.varsNameLookup[varName];
        return varRef;
    }
    return false;
}