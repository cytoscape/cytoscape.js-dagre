import defaults from './defaults.ts';
import type { LayoutDefaults } from './defaults.ts';
import dagre, { type EdgeLabel, type GraphLabel, type NodeLabel } from '@dagrejs/dagre';
import type cytoscape from 'cytoscape';

// the layout options merged with the runtime values cytoscape injects (cy, eles, ...)
type RunOptions = LayoutDefaults & {
  cy: cytoscape.Core;
  eles: cytoscape.CollectionArgument;
  name?: 'dagre';
};

interface Point { x: number; y: number; }
interface EdgeCoord { weight: number; distance: number; }
interface EdgeFrame { src: Point; tgt: Point; dir: Point; normal: Point; len: number; }
interface CompleteBoundingBox extends cytoscape.BoundingBox12, cytoscape.BoundingBoxWH {}
interface DagreScratch {
  dagre?: NodeLabel;
  controlPointWeights?: number[];
  controlPointDistances?: number[];
}
interface DagreLayoutInstance {
  options: RunOptions;
  run(): DagreLayoutInstance;
}
interface LayoutPositionCollection {
  layoutPositions(
    layout: DagreLayoutInstance,
    options: RunOptions,
    handler: (element: cytoscape.NodeSingular) => cytoscape.Position
  ): void;
}

const isFunction = function<TArgs extends unknown[], TResult>(
  value: TResult | ((...args: TArgs) => TResult)
): value is (...args: TArgs) => TResult {
  return typeof value === 'function';
};
const EPSILON = 0.001; // what does it mean to be too close to 0?

function getScratch( element: cytoscape.SingularElementArgument ): DagreScratch {
  return element.scratch() as DagreScratch;
}

function hasPosition( node: NodeLabel ): node is NodeLabel & Point {
  return typeof node.x === 'number' && typeof node.y === 'number';
}

function completeBoundingBox(
  boundingBox: cytoscape.BoundingBox12 | cytoscape.BoundingBoxWH
): CompleteBoundingBox {
  const x2 = 'x2' in boundingBox ? boundingBox.x2 : boundingBox.x1 + boundingBox.w;
  const y2 = 'y2' in boundingBox ? boundingBox.y2 : boundingBox.y1 + boundingBox.h;

  return {
    x1: boundingBox.x1,
    y1: boundingBox.y1,
    x2,
    y2,
    w: 'w' in boundingBox ? boundingBox.w : x2 - boundingBox.x1,
    h: 'h' in boundingBox ? boundingBox.h : y2 - boundingBox.y1
  };
}

function subtract( a: Point, b: Point ): Point {
  return { x: noZero(a.x - b.x), y: noZero(a.y - b.y) };
}

function product( a: Point, b: Point ): number {
  return noZero(a.x * b.x) + noZero(a.y * b.y);
}

function norm( v: Point ): { x: number; y: number; len: number } {
  const len = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / len, y: v.y / len, len };
}

function perp( v: Point ): Point {
  return { x: -v.y, y: v.x };
}

/* provides the context for mapping from dagre's x, y coordinate system
 * for control points to cytoscapes coordinate system for control points
 * which is relative to the straight vector from source to target node
 */
function buildEdgeFrame( src: Point, tgt: Point ): EdgeFrame {
  const d = subtract(tgt, src);
  const { x, y, len } = norm(d);

  const dir = { x, y };
  const normal = perp(dir);

  return { src, tgt, dir, normal, len };
}

function noZero( x: number ): number {
  if (Math.abs(x) < EPSILON) {
    return x < 0 ? -EPSILON : EPSILON;
  }

  return x;
}

function toEdgeCoordinates( P: Point, frame: EdgeFrame ): EdgeCoord {
  const vector = subtract(P, frame.src);
  const weight = noZero(product(vector, frame.dir) / frame.len);
  const distance = noZero(product(vector, frame.normal));

  return { weight, distance };
}

function normalizeWeight( coords: EdgeCoord[] ): EdgeCoord[] {
  let min = Infinity;
  let max = -Infinity;

  for (const p of coords) {
    if (p.weight < min) {
      min = p.weight;
    }

    if (p.weight > max) {
      max = p.weight;
    }
  }

  const range = max - min || 1;

  return coords.map(p => ({
    distance: p.distance,
    weight: (p.weight - min) / range
  }));
}

/* First introduce new control points to bridge between the dagre list of
 * points and the centres of cytoscape nodes.
 * Then we sanitize any empty or non-existing or degenerate control points
 * And finally we map the Dagre coordinates to the Cytoscape coordinated which
 * are relative to the original direction vector from source to target.
 * These final coordinates are stored pairwise in two arrays cpw and cpd
 * which are picked up by the Bezier construction code in cytoscape.
 */
function dagreEdgeToCytoscapeEdge(
  dEdge: EdgeLabel,
  cEdge: cytoscape.EdgeSingular
): { controlPointWeights: number[]; controlPointDistances: number[] } {
  const fromNode = cEdge.source().position();
  const toNode = cEdge.target().position();
  const frame = buildEdgeFrame(fromNode, toNode);
  const coords = normalizeWeight((dEdge.points ?? []).map(p => toEdgeCoordinates(p, frame)));

  const controlPointWeights = coords.slice(1,-1).map(c => c.weight);
  const controlPointDistances = coords.slice(1,-1).map(c => c.distance);

  const result = { controlPointWeights, controlPointDistances };

  return result;
}

// constructor
// options : object containing layout options
// NB: this must stay a function constructor (not an ES `class`); cytoscape
// invokes registered layouts without `new`, which throws for class constructors.
function DagreLayout( this: DagreLayoutInstance, options: RunOptions ) {
  this.options = Object.assign( {}, defaults, options );
}

// runs the layout
DagreLayout.prototype.run = function( this: DagreLayoutInstance ){
    const options = this.options;
    const layout = this;

    const cy = options.cy; // cy is automatically populated for us in the constructor
    const eles = options.eles;

    const getVal = function( ele: cytoscape.EdgeSingular, val: number | ((edge: cytoscape.EdgeSingular) => number) ){
      return isFunction(val) ? val.call( ele, ele ) : val;
    };

    const bb = completeBoundingBox(options.boundingBox ?? { x1: 0, y1: 0, w: cy.width(), h: cy.height() });

    const g = new dagre.graphlib.Graph<GraphLabel, NodeLabel, EdgeLabel>({
      multigraph: true,
      compound: true
    });

    const gObj: GraphLabel = {};
    const setGObj = function<K extends keyof GraphLabel>( name: K, val: GraphLabel[K] ){
      if( val != null ){
        gObj[ name ] = val;
      }
    };

    setGObj( 'nodesep', options.nodeSep );
    setGObj( 'edgesep', options.edgeSep );
    setGObj( 'ranksep', options.rankSep );
    setGObj( 'rankdir', options.rankDir );
    setGObj( 'align', options.align);
    setGObj( 'ranker', options.ranker );
    setGObj( 'acyclicer', options.acyclicer);

    g.setGraph( gObj );

    // add nodes to dagre
    let nodes = eles.nodes();

    if ( isFunction(options.sort) ) {
      nodes = nodes.sort( options.sort );
    }

    for( let i = 0; i < nodes.length; i++ ){
      let node = nodes[i];
      let nbb = node.layoutDimensions( options );

      g.setNode( node.id(), {
        width: nbb.w,
        height: nbb.h,
        shape: 'ellipse',
        name: node.id()
      } );
    }

    // set compound parents
    for( let i = 0; i < nodes.length; i++ ){
      let node = nodes[i];

      if( node.isChild() ){
        const parent = node.parent()[0];
        if( parent ){
          g.setParent( node.id(), parent.id() );
        }
      }
    }

    // add edges to dagre
    let edges = eles.edges().filter(function( edge: cytoscape.EdgeSingular ){
      return !edge.source().isParent() && !edge.target().isParent(); // dagre can't handle edges on compound nodes
    });

    if ( isFunction(options.sort) ) {
      edges = edges.sort( options.sort );
    }

    for( let i = 0; i < edges.length; i++ ){
      let edge = edges[i];

      g.setEdge( edge.source().id(), edge.target().id(), {
        minlen: getVal( edge, options.minLen ?? defaults.minLen ),
        weight: getVal( edge, options.edgeWeight ?? defaults.edgeWeight ),
        name: edge.id()
      }, edge.id() );
    }

    dagre.layout( g );

    let gNodeIds = g.nodes();
    for( let i = 0; i < gNodeIds.length; i++ ){
      let id = gNodeIds[i];
      let n = g.node( id );

      getScratch(cy.getElementById(id)).dagre = n;
    }

    let dagreBB: CompleteBoundingBox;

    if( options.boundingBox ){
      dagreBB = { x1: Infinity, x2: -Infinity, y1: Infinity, y2: -Infinity, w: 0, h: 0 };
      nodes.forEach(function( node: cytoscape.NodeSingular ){
        const dModel = getScratch(node).dagre;
        if( !dModel || !hasPosition(dModel) ){ return; }

        dagreBB.x1 = Math.min( dagreBB.x1, dModel.x );
        dagreBB.x2 = Math.max( dagreBB.x2, dModel.x );

        dagreBB.y1 = Math.min( dagreBB.y1, dModel.y );
        dagreBB.y2 = Math.max( dagreBB.y2, dModel.y );
      });

      dagreBB.w = dagreBB.x2 - dagreBB.x1;
      dagreBB.h = dagreBB.y2 - dagreBB.y1;
    } else {
      dagreBB = bb;
    }

    const constrainPos = function( p: Point ){
      if( options.boundingBox ){
        let xPct = dagreBB.w === 0 ? 0 : (p.x - dagreBB.x1) / dagreBB.w;
        let yPct = dagreBB.h === 0 ? 0 : (p.y - dagreBB.y1) / dagreBB.h;

        return {
          x: bb.x1 + xPct * bb.w,
          y: bb.y1 + yPct * bb.h
        };
      } else {
        return p;
      }
    };

    (nodes as unknown as LayoutPositionCollection).layoutPositions(layout, options, function( ele ){
      const dModel = getScratch(ele).dagre;
      if( !dModel || !hasPosition(dModel) ){
        return ele.position();
      }

      return constrainPos({
        x: dModel.x,
        y: dModel.y
      });
    });

    if (options.useDagreEdgeControlPoints) {
      if (options.automaticDagreEdgeStyle) {
        cy.edges().addClass('useDagreEdgeControlPoints');
        cy.style()
          .selector('edge.useDagreEdgeControlPoints')
          .style(options.dagreEdgeStyle ?? defaults.dagreEdgeStyle)
          .update();
      }

      g.edges().forEach(id => {
        if( id.name === undefined ){ return; }
        const cyEdge = cy.getElementById(id.name);
        const dEdge = g.edge(id);

        if (dEdge && dEdge.points) {
          Object.assign(getScratch(cyEdge), dagreEdgeToCytoscapeEdge(dEdge, cyEdge));
        }
      });
    }

    return this; // chaining
};

export default DagreLayout;
