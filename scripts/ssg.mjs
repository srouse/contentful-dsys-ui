import { build } from '../ssg/scripts/build.mjs'

(async () => {
  await build(
    'contentfulDesignSystemExample', // tag
    './build' // destination
  );
})();