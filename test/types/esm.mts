import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

const cy = cytoscape({ headless: true });
const options: dagre.DagreLayoutOptions = {
  name: 'dagre',
  rankDir: 'LR',
  minLen(edge) {
    return edge.isEdge() ? 2 : 1;
  },
  transform(node, position) {
    return node.isNode() ? position : { x: 0, y: 0 };
  }
};

cy.layout(options);
cy.layout({
  name: 'dagre',
  ranker: 'tight-tree',
  edgeWeight: edge => edge.isEdge() ? 2 : 1
});
cy.elements().layout({ name: 'dagre', align: 'UL' });

// @ts-expect-error invalid Dagre rank direction
const invalidOptions: dagre.DagreLayoutOptions = { name: 'dagre', rankDir: 'sideways' };

// @ts-expect-error direct calls reject invalid Dagre options
cy.layout({ name: 'dagre', rankDir: 'sideways' });

void invalidOptions;
