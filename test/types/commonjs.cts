import cytoscape = require('cytoscape');
import dagre = require('cytoscape-dagre');

cytoscape.use(dagre);

const cy = cytoscape({ headless: true });
const options: dagre.DagreLayoutOptions = {
  name: 'dagre',
  acyclicer: 'greedy',
  sort(a, b) {
    return a.id().localeCompare(b.id());
  }
};

cy.makeLayout(options);
cy.elements().createLayout({ name: 'dagre', rankDir: 'TB' });
