import { defineConfig } from 'rolldown';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const banner = `/*!

 * ${pkg.name} ${pkg.version}
 * ${pkg.homepage}
 * License: ${pkg.license}
 */`;

/**
 * Common output configuration.
 */
const commonOutput = {
  sourcemap: true,
  banner
};

/**
 * UMD build configuration.
 *
 * This preserves the existing browser/global build.
 */
const umdOutput = {
  ...commonOutput,
  format: 'umd',
  name: 'cytoscapeDagre',
  exports: 'default'
};

/**
 * ESM build configuration.
 *
 * This produces the native ESM package.
 */
const esmOutput = {
  ...commonOutput,
  format: 'esm'
};

export default defineConfig([
  /**
   * Readable UMD build.
   */
  {
    input: 'src/index.ts',

    platform: 'browser',

    output: {
      ...umdOutput,
      file: 'dist/cytoscape-dagre.js',
      minify: false
    }
  },

  /**
   * Minified UMD build.
   */
  {
    input: 'src/index.ts',

    platform: 'browser',

    output: {
      ...umdOutput,
      file: 'dist/cytoscape-dagre.min.js',
      minify: true
    }
  },

  /**
   * Readable ESM build.
   */
  {
    input: 'src/index.ts',

    platform: 'browser',

    output: {
      ...esmOutput,
      file: 'dist/cytoscape-dagre.mjs',
      minify: false
    }
  },

  /**
   * Minified ESM build.
   */
  {
    input: 'src/index.ts',

    platform: 'browser',

    output: {
      ...esmOutput,
      file: 'dist/cytoscape-dagre.min.mjs',
      minify: true
    }
  }
]);