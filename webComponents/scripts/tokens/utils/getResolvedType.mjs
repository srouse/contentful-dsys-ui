

export default function getResolvedType(
    type,
    alias
) {
    const finalType = alias ? alias.type : type;
    switch (finalType) {
        case 'dimension' :
        case 'size' :
            return 'FLOAT';
        case 'boolean' :
            return 'BOOLEAN';
        case 'color' :
            return 'COLOR';
        case 'string' :
        default:
            return 'STRING';
    }
}