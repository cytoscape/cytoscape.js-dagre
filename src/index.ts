import impl from './layout.ts';
import type cytoscape from 'cytoscape';

// registers the extension on a cytoscape lib ref
const register = function( cytoscapeLib?: typeof cytoscape ){
  if( !cytoscapeLib ){ return; } // can't register if cytoscape unspecified

  cytoscapeLib( 'layout', 'dagre', impl ); // register with cytoscape.js
};

if( typeof window !== 'undefined' && 'cytoscape' in window ){ // expose to global cytoscape (i.e. window.cytoscape)
  register( window.cytoscape as typeof cytoscape );
}

export default register;
