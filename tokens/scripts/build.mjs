import styleDictionaryCSS from './StyleDictionaryCSS.mjs';
import styleDictionaryReferential from './StyleDictionaryUtil.mjs';

const distFolder = 'dist';

// ================== BASE CSS ==================
styleDictionaryCSS(
    [
        './src/primitives.light.tokens.json',
        './src/semantic.light.tokens.json'
    ], [],
    `${distFolder}/`,
    (token) => (token.attributes.category !== 'component'),
    ':root'
).buildAllPlatforms();

// ================== COMPONENTS ==================
styleDictionaryCSS(
    [
        './src/component.light.tokens.json',
    ],
    [
        './src/primitives.light.tokens.json',
        './src/semantic.light.tokens.json'
    ],
    `${distFolder}/components`,
    (token) => (token.attributes.category === 'component'),
    ':root'
).buildAllPlatforms();


// ============= REFERENTIAL (Only output agnostic CSS Vars) ==================
styleDictionaryReferential(
    [
        './src/primitives.light.tokens.json',
        './src/semantic.light.tokens.json'
    ], [],
    `${distFolder}/utils`,
    (token) => (token.attributes.category !== 'component')
).buildAllPlatforms();

styleDictionaryReferential(
    [
        './src/component.light.tokens.json',
    ],
    [
        './src/primitives.light.tokens.json',
        './src/semantic.light.tokens.json'
    ],
    `${distFolder}/utils/components`,
    (token) => (token.attributes.category === 'component')
).buildAllPlatforms();

