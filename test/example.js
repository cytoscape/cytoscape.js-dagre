const cytoscape = require('cytoscape');
const expect = require('chai').expect;
const register = require('../src');

register( cytoscape );

describe('dagre layout', function(){
  it('runs on a simple directed graph', function(){
    let cy = cytoscape({
      headless: true,
      elements: [
        { data: { id: 'n0' } },
        { data: { id: 'n1' } },
        { data: { id: 'n2' } },
        { data: { id: 'n3' } },
        { data: { id: 'n4' } },
        { data: { id: 'e0', source: 'n0', target: 'n1' } },
        { data: { id: 'e1', source: 'n1', target: 'n2' } },
        { data: { id: 'e2', source: 'n1', target: 'n3' } },
        { data: { id: 'e3', source: 'n3', target: 'n4' } }
      ]
    });

    cy.layout({ name: 'dagre' }).run();

    cy.nodes().forEach(function( node ){
      let position = node.position();
      let dagreModel = node.scratch().dagre;

      expect( dagreModel ).to.exist;
      expect( position.x ).to.be.a('number');
      expect( position.y ).to.be.a('number');
    });

    let n0 = cy.getElementById('n0').position();
    let n1 = cy.getElementById('n1').position();
    let n2 = cy.getElementById('n2').position();
    let n3 = cy.getElementById('n3').position();
    let n4 = cy.getElementById('n4').position();

    expect( n0.y ).to.be.below( n1.y );
    expect( n1.y ).to.be.below( n2.y );
    expect( n1.y ).to.be.below( n3.y );
    expect( n3.y ).to.be.below( n4.y );
    expect( n2.x ).to.not.equal( n3.x );
  });
});
