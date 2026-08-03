import { defineConfig } from 'rolldown';

export default defineConfig([
  // ESM & UMD standard builds
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/cytoscape-dagre.mjs',
        format: 'es',
        sourcemap: true
      },
      {
        file: 'dist/cytoscape-dagre.js',
        format: 'umd',
        name: 'cytoscapeDagre',
        exports: 'auto',
        sourcemap: true,
        globals: {
          cytoscape: 'cytoscape'
        }
      }
    ],
    external: ['cytoscape']
  },
  // ESM & UMD minified builds
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/cytoscape-dagre.min.mjs',
        format: 'es',
        sourcemap: true,
        minify: true
      },
      {
        file: 'dist/cytoscape-dagre.min.js',
        format: 'umd',
        name: 'cytoscapeDagre',
        exports: 'auto',
        sourcemap: true,
        minify: true,
        globals: {
          cytoscape: 'cytoscape'
        }
      }
    ],
    external: ['cytoscape']
  }
]);