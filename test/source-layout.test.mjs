import cytoscape from 'cytoscape';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import register from '../src/index.ts';

register( cytoscape );

function createCy( elements, options = {} ){
  return cytoscape({
    headless: true,
    elements,
    ...options
  });
}

function expectFinitePosition( node ){
  let position = node.position();

  assert.equal( typeof position.x, 'number' );
  assert.equal( typeof position.y, 'number' );
  assert.equal( Number.isFinite( position.x ), true );
  assert.equal( Number.isFinite( position.y ), true );
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
      assert.ok( node.scratch().dagre );
      expectFinitePosition( node );
    });

    let n0 = cy.getElementById('n0').position();
    let n1 = cy.getElementById('n1').position();
    let n2 = cy.getElementById('n2').position();
    let n3 = cy.getElementById('n3').position();
    let n4 = cy.getElementById('n4').position();

    assert.ok( n0.y < n1.y );
    assert.ok( n1.y < n2.y );
    assert.ok( n1.y < n3.y );
    assert.ok( n3.y < n4.y );
    assert.notEqual( n2.x, n3.x );
  });

  it('honours directional layout options', function(){
    let cy = createCy([
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      { data: { id: 'ab', source: 'a', target: 'b' } }
    ]);

    cy.layout({ name: 'dagre', rankDir: 'LR' }).run();

    assert.ok( cy.getElementById( 'a' ).position().x < cy.getElementById( 'b' ).position().x );
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
      assert.ok( node.position().x >= 100 );
      assert.ok( node.position().y >= 200 );
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
        assert.equal( edge.isEdge(), true );
        minLenCalls++;
        return 1;
      },
      edgeWeight: function( edge ){
        assert.equal( edge.isEdge(), true );
        edgeWeightCalls++;
        return 1;
      }
    }).run();

    assert.equal( minLenCalls, 2 );
    assert.equal( edgeWeightCalls, 2 );
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
    assert.equal( cy.getElementById( 'a' ).parent().id(), 'p' );
    assert.equal( cy.getElementById( 'b' ).parent().id(), 'p' );
  });

  it('completes disconnected component layouts', function(){
    let cy = createCy([
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      { data: { id: 'c' } },
      { data: { id: 'ab', source: 'a', target: 'b' } }
    ]);

    assert.doesNotThrow(function(){
      cy.layout({ name: 'dagre' }).run();
    });

    cy.nodes().forEach( expectFinitePosition );
  });

  it('constrains node positions to a width-height bounding box', function(){
    let cy = createCy([
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      { data: { id: 'c' } },
      { data: { id: 'ab', source: 'a', target: 'b' } },
      { data: { id: 'bc', source: 'b', target: 'c' } }
    ]);

    cy.layout({
      name: 'dagre',
      boundingBox: { x1: 100, y1: 200, w: 300, h: 400 }
    }).run();

    cy.nodes().forEach(function( node ){
      assert.ok( node.position().x >= 100 && node.position().x <= 400 );
      assert.ok( node.position().y >= 200 && node.position().y <= 600 );
    });
  });

  it('uses the sort callback for both nodes and edges', function(){
    let comparedKinds = new Set();
    let cy = createCy([
      { data: { id: 'c' } },
      { data: { id: 'b' } },
      { data: { id: 'a' } },
      { data: { id: 'bc', source: 'b', target: 'c' } },
      { data: { id: 'ab', source: 'a', target: 'b' } }
    ]);

    cy.layout({
      name: 'dagre',
      sort: function( a, b ){
        comparedKinds.add( a.isNode() ? 'node' : 'edge' );
        return a.id().localeCompare( b.id() );
      }
    }).run();

    assert.deepEqual( [...comparedKinds].sort(), [ 'edge', 'node' ] );
  });

  it('filters edges connected to compound parents before invoking edge options', function(){
    let visitedEdges = [];
    let cy = createCy([
      { data: { id: 'p' } },
      { data: { id: 'a', parent: 'p' } },
      { data: { id: 'b' } },
      { data: { id: 'parent-edge', source: 'p', target: 'b' } },
      { data: { id: 'child-edge', source: 'a', target: 'b' } }
    ]);

    cy.layout({
      name: 'dagre',
      minLen: function( edge ){
        visitedEdges.push( edge.id() );
        return 1;
      }
    }).run();

    assert.deepEqual( visitedEdges, [ 'child-edge' ] );
  });

  it('stores and automatically styles Dagre edge control points', function(){
    let cy = createCy([
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      { data: { id: 'ab', source: 'a', target: 'b' } }
    ], { styleEnabled: true });

    cy.layout({
      name: 'dagre',
      useDagreEdgeControlPoints: true,
      automaticDagreEdgeStyle: true
    }).run();

    let edge = cy.getElementById( 'ab' );
    assert.equal( edge.hasClass( 'useDagreEdgeControlPoints' ), true );
    assert.ok( Array.isArray( edge.scratch( 'controlPointWeights' ) ) );
    assert.ok( edge.scratch( 'controlPointWeights' ).length > 0 );
    assert.ok( Array.isArray( edge.scratch( 'controlPointDistances' ) ) );
    assert.ok( edge.scratch( 'controlPointDistances' ).length > 0 );
    assert.equal( edge.style( 'curve-style' ), 'unbundled-bezier' );
    cy.destroy();
  });
});
