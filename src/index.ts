import impl from './layout.ts';

// Registers the extension on a Cytoscape library reference.
const register = function(cytoscape: any) {
  if (!cytoscape) {
    return;
  }

  // Register the Dagre layout with Cytoscape.js.
  cytoscape('layout', 'dagre', impl);
};

// Expose to global Cytoscape when running in a browser environment.
if (
  typeof window !== 'undefined' &&
  typeof (window as any).cytoscape !== 'undefined'
) {
  register((window as any).cytoscape);
}

export default register;
