import impl from './layout.ts';

// registers the extension on a cytoscape lib ref
let register = function( cytoscape: any ): void {
  if( !cytoscape ){ return; } // can't register if cytoscape unspecified

  cytoscape( 'layout', 'dagre', impl ); // register with cytoscape.js
};

if( typeof window !== 'undefined' && (window as any).cytoscape !== 'undefined' ){ // expose to global cytoscape (i.e. window.cytoscape)
  register((window as any).cytoscape);
}

export default register;