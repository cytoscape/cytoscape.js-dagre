import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { describe, it } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire( import.meta.url );
const pkg = require('../package.json');

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const root = path.join( __dirname, '..' );
const dist = path.join( root, 'dist' );

function readDist( file ){
  return fs.readFileSync( path.join( dist, file ), 'utf8' );
}

describe('package metadata', function(){
  it('exposes CommonJS, ESM, TypeScript, and conditional export entrypoints', function(){
    assert.equal( pkg.main, 'dist/cytoscape-dagre.js' );
    assert.equal( pkg.module, 'dist/cytoscape-dagre.mjs' );
    assert.equal( pkg.types, 'index.d.ts' );
    assert.equal( pkg.exports['.'].types, './index.d.ts' );
    assert.equal( pkg.exports['.'].import, './dist/cytoscape-dagre.mjs' );
    assert.equal( pkg.exports['.'].require, './dist/cytoscape-dagre.js' );
  });

  it('keeps Dagre bundled for builds and Cytoscape as a peer dependency', function(){
    assert.ok( !( '@dagrejs/dagre' in (pkg.dependencies || {}) ) );
    assert.ok( '@dagrejs/dagre' in pkg.devDependencies );
    assert.ok( 'cytoscape' in pkg.peerDependencies );
  });
});

describe('built artifacts', function(){
  it('keeps legacy UMD artifact links pointed at dist', function(){
    let rootLink = path.join( root, 'cytoscape-dagre.js' );
    let pagesLink = path.join( root, 'pages', 'cytoscape-dagre.js' );

    assert.equal( fs.lstatSync( rootLink ).isSymbolicLink(), true );
    assert.equal( fs.readlinkSync( rootLink ), 'dist/cytoscape-dagre.js' );
    assert.equal( fs.lstatSync( pagesLink ).isSymbolicLink(), true );
    assert.equal( fs.readlinkSync( pagesLink ), '../dist/cytoscape-dagre.js' );
  });

  it('loads the UMD builds through CommonJS', function(){
    assert.equal( typeof require( '../dist/cytoscape-dagre.js' ), 'function' );
    assert.equal( typeof require( '../dist/cytoscape-dagre.min.js' ), 'function' );
  });

  it('loads the ESM builds through dynamic import', async function(){
    let esm = await import( pathToFileURL( path.join( dist, 'cytoscape-dagre.mjs' ) ).href );
    let min = await import( pathToFileURL( path.join( dist, 'cytoscape-dagre.min.mjs' ) ).href );

    assert.equal( typeof esm.default, 'function' );
    assert.equal( typeof min.default, 'function' );
  });

  it('bundles Dagre without external Dagre imports', function(){
    [
      'cytoscape-dagre.js',
      'cytoscape-dagre.min.js',
      'cytoscape-dagre.mjs',
      'cytoscape-dagre.min.mjs'
    ].forEach(function( file ){
      let source = readDist( file );

      assert.doesNotMatch( source, /(?:require\(|from\s+|import\s+).*@dagrejs\/dagre/ );
      assert.ok( source.includes( 'network-simplex' ) );
    });
  });

  it('emits source maps for every build', function(){
    [
      'cytoscape-dagre.js.map',
      'cytoscape-dagre.min.js.map',
      'cytoscape-dagre.mjs.map',
      'cytoscape-dagre.min.mjs.map'
    ].forEach(function( file ){
      assert.equal( fs.existsSync( path.join( dist, file ) ), true );
    });
  });
});
