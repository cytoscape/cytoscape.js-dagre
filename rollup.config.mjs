import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { createRequire } from 'node:module';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const banner = `/*!
 * ${pkg.name} ${pkg.version}
 * ${pkg.homepage}
 * License: ${pkg.license}
 */`;

const extensions = [ '.ts', '.mjs', '.js' ];
const plugins = [
  nodeResolve({
    browser: true,
    extensions
  }),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    extensions,
    exclude: 'node_modules/**',
    presets: ['@babel/preset-typescript']
  })
];

const umdOutput = {
  format: 'umd',
  name: 'cytoscapeDagre',
  exports: 'default',
  sourcemap: true,
  banner
};

const esmOutput = {
  format: 'esm',
  sourcemap: true,
  banner
};

const minify = terser({
  format: {
    comments: /^!/
  }
});

export default [
  {
    input: 'src/index.ts',
    plugins,
    output: {
      ...umdOutput,
      file: 'dist/cytoscape-dagre.js'
    }
  },
  {
    input: 'src/index.ts',
    plugins: [ ...plugins, minify ],
    output: {
      ...umdOutput,
      file: 'dist/cytoscape-dagre.min.js'
    }
  },
  {
    input: 'src/index.ts',
    plugins,
    output: {
      ...esmOutput,
      file: 'dist/cytoscape-dagre.mjs'
    }
  },
  {
    input: 'src/index.ts',
    plugins: [ ...plugins, minify ],
    output: {
      ...esmOutput,
      file: 'dist/cytoscape-dagre.min.mjs'
    }
  }
];