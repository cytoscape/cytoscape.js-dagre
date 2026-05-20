import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import chai from 'chai';

const require = createRequire( import.meta.url );
const pkg = require('../package.json');
const { expect } = chai;

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const root = path.join( __dirname, '..' );
const dist = path.join( root, 'dist' );

function readDist( file ){
  return fs.readFileSync( path.join( dist, file ), 'utf8' );
}

describe('package metadata', function(){
  it('exposes CommonJS, ESM, TypeScript, and conditional export entrypoints', function(){
    expect( pkg.main ).to.equal( 'dist/cytoscape-dagre.js' );
    expect( pkg.module ).to.equal( 'dist/cytoscape-dagre.mjs' );
    expect( pkg.types ).to.equal( 'index.d.ts' );
    expect( pkg.exports['.'].types ).to.equal( './index.d.ts' );
    expect( pkg.exports['.'].import ).to.equal( './dist/cytoscape-dagre.mjs' );
    expect( pkg.exports['.'].require ).to.equal( './dist/cytoscape-dagre.js' );
  });

  it('keeps Dagre bundled for builds and Cytoscape as a peer dependency', function(){
    expect( pkg.dependencies || {} ).to.not.have.property( '@dagrejs/dagre' );
    expect( pkg.devDependencies ).to.have.property( '@dagrejs/dagre' );
    expect( pkg.peerDependencies ).to.have.property( 'cytoscape' );
  });
});

describe('built artifacts', function(){
  it('keeps legacy UMD artifact links pointed at dist', function(){
    let rootLink = path.join( root, 'cytoscape-dagre.js' );
    let pagesLink = path.join( root, 'pages', 'cytoscape-dagre.js' );

    expect( fs.lstatSync( rootLink ).isSymbolicLink() ).to.equal( true );
    expect( fs.readlinkSync( rootLink ) ).to.equal( 'dist/cytoscape-dagre.js' );
    expect( fs.lstatSync( pagesLink ).isSymbolicLink() ).to.equal( true );
    expect( fs.readlinkSync( pagesLink ) ).to.equal( '../dist/cytoscape-dagre.js' );
  });

  it('loads the UMD builds through CommonJS', function(){
    expect( require( '../dist/cytoscape-dagre.js' ) ).to.be.a( 'function' );
    expect( require( '../dist/cytoscape-dagre.min.js' ) ).to.be.a( 'function' );
  });

  it('loads the ESM builds through dynamic import', async function(){
    let esm = await import( pathToFileURL( path.join( dist, 'cytoscape-dagre.mjs' ) ).href );
    let min = await import( pathToFileURL( path.join( dist, 'cytoscape-dagre.min.mjs' ) ).href );

    expect( esm.default ).to.be.a( 'function' );
    expect( min.default ).to.be.a( 'function' );
  });

  it('bundles Dagre without external Dagre imports', function(){
    [
      'cytoscape-dagre.js',
      'cytoscape-dagre.min.js',
      'cytoscape-dagre.mjs',
      'cytoscape-dagre.min.mjs'
    ].forEach(function( file ){
      let source = readDist( file );

      expect( source ).to.not.match( /(?:require\(|from\s+|import\s+).*@dagrejs\/dagre/ );
      expect( source ).to.contain( 'network-simplex' );
    });
  });

  it('emits source maps for every build', function(){
    [
      'cytoscape-dagre.js.map',
      'cytoscape-dagre.min.js.map',
      'cytoscape-dagre.mjs.map',
      'cytoscape-dagre.min.mjs.map'
    ].forEach(function( file ){
      expect( fs.existsSync( path.join( dist, file ) ) ).to.equal( true );
    });
  });
});
