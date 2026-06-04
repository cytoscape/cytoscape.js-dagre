import cytoscape from 'cytoscape';
import chai from 'chai';
import register from '../src/index.mjs';

const { expect } = chai;

register( cytoscape );

function createCy( elements ){
  return cytoscape({
    headless: true,
    elements
  });
}

function expectFinitePosition( node ){
  let position = node.position();

  expect( position.x ).to.be.a( 'number' );
  expect( position.y ).to.be.a( 'number' );
  expect( Number.isFinite( position.x ) ).to.equal( true );
  expect( Number.isFinite( position.y ) ).to.equal( true );
}

describe('source dagre layout', function(){
  it('runs on a simple directed graph', function(){
    let cy = createCy([
      { data: { id: 'n0' } },
      { data: { id: 'n1' } },
      { data: { id: 'n2' } },
      { data: { id: 'n3' } },
      { data: { id: 'n4' } },
      { data: { id: 'e0', source: 'n0', target: 'n1' } },
      { data: { id: 'e1', source: 'n1', target: 'n2' } },
      { data: { id: 'e2', source: 'n1', target: 'n3' } },
      { data: { id: 'e3', source: 'n3', target: 'n4' } }
    ]);

    cy.layout({ name: 'dagre' }).run();

    cy.nodes().forEach(function( node ){
      expect( node.scratch().dagre ).to.exist;
      expectFinitePosition( node );
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

  it('honours directional layout options', function(){
    let cy = createCy([
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      { data: { id: 'ab', source: 'a', target: 'b' } }
    ]);

    cy.layout({ name: 'dagre', rankDir: 'LR' }).run();

    expect( cy.getElementById( 'a' ).position().x ).to.be.below( cy.getElementById( 'b' ).position().x );
  });

  it('applies Cytoscape transform callbacks to final positions', function(){
    let cy = createCy([
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      { data: { id: 'ab', source: 'a', target: 'b' } }
    ]);

    cy.layout({
      name: 'dagre',
      transform: function( _node, position ){
        return { x: position.x + 100, y: position.y + 200 };
      }
    }).run();

    cy.nodes().forEach(function( node ){
      expect( node.position().x ).to.be.at.least( 100 );
      expect( node.position().y ).to.be.at.least( 200 );
    });
  });

  it('calls per-edge option callbacks once per edge', function(){
    let minLenCalls = 0;
    let edgeWeightCalls = 0;
    let cy = createCy([
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      { data: { id: 'c' } },
      { data: { id: 'ab', source: 'a', target: 'b' } },
      { data: { id: 'bc', source: 'b', target: 'c' } }
    ]);

    cy.layout({
      name: 'dagre',
      minLen: function( edge ){
        expect( edge.isEdge() ).to.equal( true );
        minLenCalls++;
        return 1;
      },
      edgeWeight: function( edge ){
        expect( edge.isEdge() ).to.equal( true );
        edgeWeightCalls++;
        return 1;
      }
    }).run();

    expect( minLenCalls ).to.equal( 2 );
    expect( edgeWeightCalls ).to.equal( 2 );
  });

  it('lays out compound children relative to parents', function(){
    let cy = createCy([
      { data: { id: 'p' } },
      { data: { id: 'a', parent: 'p' } },
      { data: { id: 'b', parent: 'p' } },
      { data: { id: 'ab', source: 'a', target: 'b' } }
    ]);

    cy.layout({ name: 'dagre' }).run();

    expectFinitePosition( cy.getElementById( 'p' ) );
    expectFinitePosition( cy.getElementById( 'a' ) );
    expectFinitePosition( cy.getElementById( 'b' ) );
    expect( cy.getElementById( 'a' ).parent().id() ).to.equal( 'p' );
    expect( cy.getElementById( 'b' ).parent().id() ).to.equal( 'p' );
  });

  it('completes disconnected component layouts', function(){
    let cy = createCy([
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      { data: { id: 'c' } },
      { data: { id: 'ab', source: 'a', target: 'b' } }
    ]);

    expect(function(){
      cy.layout({ name: 'dagre' }).run();
    }).to.not.throw();

    cy.nodes().forEach( expectFinitePosition );
  });
});
