import impl from './layout.mjs';

// registers the extension on a cytoscape lib ref
let register = function( cytoscape ){
  if( !cytoscape ){ return; } // can't register if cytoscape unspecified

  cytoscape( 'layout', 'dagre', impl ); // register with cytoscape.js
};

if( typeof window !== 'undefined' && typeof window.cytoscape !== 'undefined' ){ // expose to global cytoscape (i.e. window.cytoscape)
  register( window.cytoscape );
}

export default register;
