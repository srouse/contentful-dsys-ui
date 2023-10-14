import StyleDictionary from 'style-dictionary-utils';

// StyleDictionary.registerTransform({
    // name: 'scss/css-property',
    // type: 'value',
    // transitive: true,
    // transformer: function(prop) {
    // return `var( --${prop.name} )`;
  // }
// });

StyleDictionary.registerTransform({
    name: 'sizing/px',
    type: 'value',
    transitive: false,
    matcher: function(prop) {
        return prop.original['$type'] === 'number'
    },
    transformer: function(prop) {
        return `${prop.value}px`;
    }
});

export default function styleDictionaryCSS(
    source,
    include,
    distFolder,
    filter,
    selector
) {

    const finalFilter = (token) => filter ? filter(token) : true;
    const StyleDictionaryExtended = StyleDictionary.extend({
        source, // tokens overlaying the "included" tokens
        include, // the core tokens to extend
        platforms: {
            css: {
                transformGroup: 'css',
                transforms: [
                    'attribute/cti',
                    'name/cti/kebab',
                    'sizing/px',
                    'color/hex'
                ],
                prefix: 'sf',
                buildPath: `${distFolder}/`, // nothing else is here...
                files: [{
                    destination: '_variables.css',
                    format: 'css/variables',
                    options: {
                        outputReferences: true,
                        selector: selector || ':root',
                    },
                    filter: finalFilter,
                }]
            }
        }
    });

    return StyleDictionaryExtended;
}