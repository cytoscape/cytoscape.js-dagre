import type cytoscape from 'cytoscape';
import impl from './layout.js';

/**
 * Registers the Dagre layout extension on a Cytoscape library reference.
 */
const register = function (cy?: typeof cytoscape): void {
  if (!cy) {
    return; // Can't register if cytoscape is unspecified
  }

  cy('layout', 'dagre', impl); // Register layout with cytoscape.js
};

// Expose to global cytoscape (i.e. window.cytoscape) in UMD/browser environments
if (typeof window !== 'undefined' && (window as any).cytoscape) {
  register((window as any).cytoscape);
}

export default register;