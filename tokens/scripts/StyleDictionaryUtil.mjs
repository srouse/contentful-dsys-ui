import StyleDictionary from 'style-dictionary-utils';

StyleDictionary.registerTransform({
    name: 'scss/css-property',
    type: 'value',
    transitive: true,
    transformer: function(prop) {
        return `var( --${prop.name} )`;
    }
});

// StyleDictionary.registerTransform({
// name: 'sizing/px',
// type: 'value',
// transitive: false,
// matcher: function(prop) {
// return prop.original['$type'] === 'number'
// },
// transformer: function(prop) {
// return `${prop.value}px`;
// }
// });

export default function styleDictionaryReferential(
    source,
    include,
    distFolder,
    filter
) {

    const finalFilter = (token) => filter ? filter(token) : true;
    const StyleDictionaryExtended = StyleDictionary.extend({
        source, // tokens overlaying the "included" tokens
        include, // the core tokens to extend
        platforms: {
            scss: {
                transformGroup: 'scss',
                transforms: [
                    'attribute/cti',
                    'name/cti/kebab',
                    'scss/css-property'
                ],
                prefix: 'sf',
                buildPath: `${distFolder}/scss/`,
                files: [{
                    destination: '_variables.scss',
                    format: 'scss/variables',
                    options: {
                        outputReferences: true,
                    },
                    filter: finalFilter,
                }]
            },
            ts: {
                // transforms: ['color/hexAlpha', 'shadow/css'],
                transforms: [
                    'attribute/cti',
                    'name/cti/kebab',
                    'scss/css-property'
                ],
                prefix: 'sf',
                buildPath: `${distFolder}/typescript/`,
                files: [{
                    // filter: 'isSource',
                    destination: 'tokens.ts',
                    format: 'javascript/esm',
                    options: {
                        outputReferences: true
                    },
                    filter: finalFilter,
                }]
            },
        }
    });

    return StyleDictionaryExtended;
}