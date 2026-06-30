import { defineConfig } from 'rolldown';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const banner = `/*!
 * ${pkg.name} ${pkg.version}
 * ${pkg.homepage}
 * License: ${pkg.license}
 */`;

// Rolldown handles TypeScript, CommonJS interop (e.g. @dagrejs/dagre) and
// node resolution natively, so no plugins are needed. `platform: 'browser'`
// mirrors the old nodeResolve({ browser: true }); the es2015 target keeps the
// bundles broadly compatible like the previous babel pipeline did.
const shared = {
  input: 'src/index.ts',
  platform: 'browser',
  transform: { target: 'es2015' }
};

const umdOutput = {
  format: 'umd',
  name: 'cytoscapeDagre',
  exports: 'default',
  sourcemap: true,
  banner
};

const esmOutput = {
  format: 'es',
  sourcemap: true,
  banner
};

export default defineConfig([
  {
    ...shared,
    output: { ...umdOutput, file: 'dist/cytoscape-dagre.js' }
  },
  {
    ...shared,
    output: { ...umdOutput, file: 'dist/cytoscape-dagre.min.js', minify: true }
  },
  {
    ...shared,
    output: { ...esmOutput, file: 'dist/cytoscape-dagre.mjs' }
  },
  {
    ...shared,
    output: { ...esmOutput, file: 'dist/cytoscape-dagre.min.mjs', minify: true }
  }
]);
