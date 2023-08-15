import { transform } from '@divriots/style-dictionary-to-figma';
import StyleDictionary from 'style-dictionary-utils'
import { makeSdTailwindConfig } from 'sd-tailwindcss-transformer';
import { distPath, tokensSrcPath } from '../config.mjs';

const sdConfig = makeSdTailwindConfig({
  type: 'all',
  isVariables: true,
});

StyleDictionary.registerTransform({
  name: 'scss/css-property',
  type: 'value',
  // matcher: function(prop) {
  //   console.log(`${prop.original.value}`, `${prop.original.value}`.indexOf('{') === 0);
  //   return true;// `${prop.original.value}`.indexOf('{') === 0;
  // },
  transformer: function(prop) {
    // for sake of simplicity, in this example we assume colors are always in the format #xxxxxx
    return `var( --${prop.name} )`;
  }
});

const distFolder = `${distPath}/web`;

const WebStyleDictionary = StyleDictionary.extend({
  source: [
    `${tokensSrcPath}/web/**/*.json`
  ],
  include: [
    `${tokensSrcPath}/*.tokens.json`
  ],
  format: {
    figmaTokensPlugin: ({ dictionary }) => {
      const transformedTokens = transform(dictionary.tokens);
      return JSON.stringify(transformedTokens, null, 2);
    },
    ...sdConfig.format,
  },
  platforms: {
    tailwind:{
      transforms:['attribute/cti','name/cti/kebab'],
      prefix: 'cui',
      buildPath: `${distFolder}/tailwind/`,
      files:[{
        destination :'tailwind.config.js',
        format: 'tailwindFormat'
      }]
    },
    typescript: {
      transforms: ['attribute/cti', 'name/cti/camel'],
      prefix: 'cui',
      buildPath: `${distFolder}/typescript/`,
      files: [
        {
          destination: 'tokens.ts',
          format: 'javascript/esm',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/module-declarations',
        }
      ]
    },
    javascript: {
      transforms: ['attribute/cti', 'name/cti/camel'],
      prefix: 'cui',
      buildPath: `${distFolder}/javascript/`,
      files: [{
        destination: 'tokens.js',
        format: 'javascript/esm',
      }]
    },
    scss: {
      transformGroup: 'scss',
      transforms: [
        'attribute/cti',
        'name/cti/kebab',
        // 'size/px',
        // 'color/rgb',
        'scss/css-property'
      ],
      prefix: 'cui',
      buildPath: `${distFolder}/scss/`,
      files: [{
        destination: '_variables.scss',
        format: 'scss/variables',
        options: {
          // outputReferences: true,
        }
      }]
    },
    css: {
      transformGroup: 'css',
      transforms: [
        'attribute/cti',
        'name/cti/kebab',
        'size/px',
        'color/rgb'
      ],
      prefix: 'cui',
      buildPath: `${distFolder}/css/`,
      files: [{
        destination: '_variables.css',
        format: 'css/variables',
        options: {
          outputReferences: true,
        },
        filter: (token) =>
          (token.attributes.category === 'component') ? false : true
      }]
    },
    json: {
      transformGroup: 'js',
      prefix: 'cui',
      buildPath: `${distFolder}/figma/`,
      files: [
        {
          destination: 'variables.json',
          format: 'figmaTokensPlugin',
          options: {
            outputReferences: true,
          }
        },
      ],
    },
    android: {
      transformGroup: 'android',
      prefix: 'cui',
      buildPath: `${distFolder}/android/`,
      files: [{
        destination: 'font_dimens.xml',
        format: 'android/fontDimens'
      },{
        destination: 'colors.xml',
        format: 'android/colors'
      }]
    },
    compose: {
      transformGroup: 'compose',
      prefix: 'cui',
      buildPath: `${distFolder}/compose/`,
      files: [{
        destination: 'StyleDictionaryColor.kt',
        format: 'compose/object',
        className: 'StyleDictionaryColor',
        packageName: 'StyleDictionaryColor',
        filter: {
          attributes: {
            category: 'color'
          }
        }
      },{
        destination: 'StyleDictionarySize.kt',
        format: 'compose/object',
        className: 'StyleDictionarySize',
        packageName: 'StyleDictionarySize',
        type: 'float',
        filter: {
          attributes: {
            category: 'size'
          }
        }
      }]
    },
    ios: {
      transformGroup: 'ios',
      prefix: 'cui',
      buildPath: `${distFolder}/ios/`,
      files: [{
        destination: 'StyleDictionaryColor.h',
        format: 'ios/colors.h',
        className: 'StyleDictionaryColor',
        type: 'StyleDictionaryColorName',
        filter: {
          attributes: {
            category: 'color'
          }
        }
      },{
        destination: 'StyleDictionaryColor.m',
        format: 'ios/colors.m',
        className: 'StyleDictionaryColor',
        type: 'StyleDictionaryColorName',
        filter: {
          attributes: {
            category: 'color'
          }
        }
      },{
        destination: 'StyleDictionarySize.h',
        format: 'ios/static.h',
        className: 'StyleDictionarySize',
        type: 'float',
        filter: {
          attributes: {
            category: 'size'
          }
        }
      },{
        destination: 'StyleDictionarySize.m',
        format: 'ios/static.m',
        className: 'StyleDictionarySize',
        type: 'float',
        filter: {
          attributes: {
            category: 'size'
          }
        }
      }]
    },
    'ios-swift': {
      transformGroup: 'ios-swift',
      prefix: 'cui',
      buildPath: `${distFolder}/ios-swift/`,
      files: [{
        destination: 'StyleDictionary+Class.swift',
        format: 'ios-swift/class.swift',
        className: 'StyleDictionaryClass',
        filter: {}
      },{
        destination: 'StyleDictionary+Enum.swift',
        format: 'ios-swift/enum.swift',
        className: 'StyleDictionaryEnum',
        filter: {}
      },{
        destination: 'StyleDictionary+Struct.swift',
        format: 'ios-swift/any.swift',
        className: 'StyleDictionaryStruct',
        filter: {},
        options: {
          imports: 'SwiftUI',
          objectType: 'struct',
          accessControl: 'internal'
        }
      }]
    },
    'ios-swift-separate-enums': {
      transformGroup: 'ios-swift-separate',
      prefix: 'cui',
      buildPath: `${distFolder}/ios-swift/`,
      files: [{
        destination: 'StyleDictionaryColor.swift',
        format: 'ios-swift/enum.swift',
        className: 'StyleDictionaryColor',
        filter: {
          attributes: {
            category: 'color'
          }
        }
      },{
        destination: 'StyleDictionarySize.swift',
        format: 'ios-swift/enum.swift',
        className: 'StyleDictionarySize',
        filter: {
          attributes: {
            category: 'size'
          }
        }
      }]
    }
  }
});

export default WebStyleDictionary;
// myStyleDictionary.buildAllPlatforms();