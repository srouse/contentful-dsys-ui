

export default function getResolvedValue(
    value,
    resolvedType,
    alias
) {
    if (alias) {
        return {
            type: 'VARIABLE_ALIAS',
            id: alias.id
        }
    }

    const valueStr = `${value}`;
    switch (resolvedType) {
        case 'FLOAT' :
            return parseFloat(valueStr.replace(/\D+/g, ''));
        case 'BOOLEAN' :
            return value ? true : false;
        case 'COLOR' :
            return hexToRgb(valueStr);
        case 'STRING' :
        default:
            return valueStr;
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : null;
 }