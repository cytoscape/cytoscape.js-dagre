import { default as impl } from './layout.js';

// registers the extension on a cytoscape lib ref
export default function register(cytoscape){
  if( !cytoscape ){ return; } // can't register if cytoscape unspecified

  cytoscape( 'layout', 'dagre', impl ); // register with cytoscape.js
};

// This can never happen under the import model since scope is locked down
// However, it will survive the webpacking and still work!
if( typeof cytoscape !== 'undefined' ){ // expose to global cytoscape (i.e. window.cytoscape)
  register( cytoscape );
}

