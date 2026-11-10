import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import chai from 'chai';
import ts from 'typescript';

const require = createRequire( import.meta.url );
const root = fileURLToPath( new URL( '../', import.meta.url ) );
const { expect } = chai;

describe('TypeScript consumers', function(){
  let directory;

  before(function(){
    directory = fs.mkdtempSync( path.join( os.tmpdir(), 'cytoscape-dagre-types-' ) );

    // Isolate declarations from development dependencies, especially Dagre.
    [ root, path.resolve( path.dirname( require.resolve( 'cytoscape' ) ), '..' ) ].forEach(function( source ){
      const pkg = JSON.parse( fs.readFileSync( path.join( source, 'package.json' ), 'utf8' ) );
      const destination = path.join( directory, 'node_modules', pkg.name );
      fs.mkdirSync( destination, { recursive: true } );
      [ 'package.json', 'index.d.ts' ].forEach(function( file ){
        fs.copyFileSync( path.join( source, file ), path.join( destination, file ) );
      });
    });
  });

  after(function(){
    fs.rmSync( directory, { recursive: true, force: true } );
  });

  [
    { name: 'CommonJS', extension: 'cts', module: ts.ModuleKind.Node16, moduleResolution: ts.ModuleResolutionKind.Node16 },
    { name: 'ESM', extension: 'mts', module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext },
    { name: 'bundler', extension: 'ts', module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler }
  ].forEach(function( config ){
    it(`checks ordering options with ${config.name} resolution without Dagre installed`, function(){
      const file = path.join( directory, `consumer.${config.extension}` );
      fs.writeFileSync( file, `
        import cytoscape from 'cytoscape';
        import dagre from 'cytoscape-dagre';

        cytoscape.use(dagre);
        const constraints: dagre.DagreOrderConstraint[] = [{ left: 'b', right: 'a' }];
        const options: dagre.DagreLayoutOptions = {
          name: 'dagre',
          dagreOptions: {
            constraints,
            disableOptimalOrderHeuristic: false,
            customOrder(graph, builtInOrder) {
              graph.nodes().forEach(id => {
                const node = graph.node(id);
                if (node && node.rank !== undefined) {
                  node.order = node.rank;
                }
              });
              builtInOrder(graph, { constraints });
              builtInOrder(graph);
            }
          }
        };
        cytoscape().layout(options).run();

        // @ts-expect-error Constraint endpoints must be node IDs.
        const invalidConstraint: dagre.DagreOrderConstraint = { left: 1, right: 'a' };
        // @ts-expect-error Both endpoints are required.
        const incompleteConstraint: dagre.DagreOrderConstraint = { left: 'a' };
        // @ts-expect-error The heuristic toggle must be boolean.
        const invalidToggle: dagre.DagreLayoutConfig = { disableOptimalOrderHeuristic: 'true' };
        // @ts-expect-error Callback parameters must match the graph and ordering function.
        const invalidCallback: dagre.DagreLayoutConfig = { customOrder: (graph: number) => {} };
      ` );

      const program = ts.createProgram( [ file ], {
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2020,
        module: config.module,
        moduleResolution: config.moduleResolution,
        types: []
      } );
      const diagnostics = ts.getPreEmitDiagnostics( program );
      const message = ts.formatDiagnosticsWithColorAndContext( diagnostics, {
        getCanonicalFileName: file => file,
        getCurrentDirectory: () => directory,
        getNewLine: () => '\n'
      } );

      expect( diagnostics, message ).to.have.length( 0 );
    });
  });
});
