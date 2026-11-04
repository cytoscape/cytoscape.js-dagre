import cytoscape from 'cytoscape';
import chai from 'chai';
import register from '../src/index.mjs';

const { expect } = chai;
let currentCy;

function createCy( elements ){
  currentCy = cytoscape({
    headless: true,
    elements
  });
  return currentCy;
}

function createOrderingCy(){
  return createCy([
    { data: { id: 'root' } },
    { data: { id: 'b' } },
    { data: { id: 'a' } },
    { data: { id: 'rb', source: 'root', target: 'b' } },
    { data: { id: 'ra', source: 'root', target: 'a' } }
  ]);
}

function expectFinitePosition( node ){
  let position = node.position();

  expect( position.x ).to.be.a( 'number' );
  expect( position.y ).to.be.a( 'number' );
  expect( Number.isFinite( position.x ) ).to.equal( true );
  expect( Number.isFinite( position.y ) ).to.equal( true );
}

describe('source dagre layout', function(){
  before(function(){
    register( cytoscape );
  });

  afterEach(function(){
    if( currentCy ){ currentCy.destroy(); }
    currentCy = undefined;
  });

  it('applies same-rank ordering constraints without mutating caller options', function(){
    let cy = createOrderingCy();
    let constraints = Object.freeze([ Object.freeze({ left: 'b', right: 'a' }) ]);
    let dagreOptions = Object.freeze({ constraints });
    let options = Object.freeze({ name: 'dagre', dagreOptions });

    cy.layout( options ).run();

    expect( cy.$id('b').position().y ).to.equal( cy.$id('a').position().y );
    expect( cy.$id('b').position().x ).to.be.below( cy.$id('a').position().x );
    expect( options.dagreOptions ).to.equal( dagreOptions );
    expect( dagreOptions.constraints ).to.equal( constraints );
  });

  it('lets customOrder delegate with its own constraints on the ranked graph', function(){
    let cy = createOrderingCy();
    let calls = 0;
    let constraints = Object.freeze([ Object.freeze({ left: 'b', right: 'a' }) ]);
    let options = Object.freeze({
      name: 'dagre',
      dagreOptions: Object.freeze({
        constraints: [ { left: 'a', right: 'b' } ],
        customOrder: function( graph, builtInOrder ){
          calls++;
          expect( graph.node('a').rank ).to.be.a( 'number' );
          expect( graph.node('a').rank ).to.equal( graph.node('b').rank );
          builtInOrder( graph, { constraints } );
        }
      })
    });

    cy.layout( options ).run();

    expect( calls ).to.equal( 1 );
    expect( cy.$id('b').position().x ).to.be.below( cy.$id('a').position().x );
  });

  it('preserves default positions when ordering options are omitted or empty', function(){
    let cy = createOrderingCy();

    [
      {},
      { dagreOptions: undefined },
      { dagreOptions: {} },
      { dagreOptions: { constraints: [] } }
    ].forEach(function( options ){
      cy.layout({ name: 'dagre', ...options }).run();

      expect( cy.nodes().map( node => node.position() ) ).to.deep.equal([
        { x: 26, y: 0.5 },
        { x: 51.5, y: 51.5 },
        { x: 0.5, y: 51.5 }
      ]);
    });
  });

  it('can disable the optimal ordering heuristic', function(){
    let cy = createOrderingCy();

    cy.layout({ name: 'dagre', dagreOptions: {
      disableOptimalOrderHeuristic: true,
      constraints: [ { left: 'a', right: 'b' } ]
    } }).run();

    expect( cy.$id('b').position().x ).to.be.below( cy.$id('a').position().x );
    cy.layout({ name: 'dagre', dagreOptions: { disableOptimalOrderHeuristic: false } }).run();
    expect( cy.$id('a').position().x ).to.be.below( cy.$id('b').position().x );
  });

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
