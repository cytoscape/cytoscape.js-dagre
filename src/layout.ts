import defaults from './defaults.ts';
import assign from './assign.ts';
import dagre from '@dagrejs/dagre';

// `defaults` is the source of truth for the recognised option shape. The
// public `DagreLayoutOptions` type lives in the root `index.ts` (it is the
// generated `index.d.ts`); src/ stays self-contained so it type-checks alone.
type LayoutOptions = typeof defaults;

// the layout options merged with the runtime values cytoscape injects (cy, eles, ...)
type RunOptions = LayoutOptions & { cy?: any; eles?: any; name?: string; [key: string]: any };

interface Point { x: number; y: number; }
interface EdgeCoord { weight: number; distance: number; }
interface EdgeFrame { src: Point; tgt: Point; dir: Point; normal: Point; len: number; }

const isFunction = function( o: any ): o is ( ...args: any[] ) => any { return typeof o === 'function'; };
const EPSILON = 0.001; // what does it mean to be too close to 0?

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
function dagreEdgeToCytoscapeEdge( dEdge: any, cEdge: any ): { controlPointWeights: number[]; controlPointDistances: number[] } {
  const fromNode = cEdge.source().position();
  const toNode = cEdge.target().position();
  const frame = buildEdgeFrame(fromNode, toNode);
  const coords = normalizeWeight(dEdge.points.map(( p: Point ) => toEdgeCoordinates(p, frame)));

  const controlPointWeights = coords.slice(1,-1).map(c => c.weight);
  const controlPointDistances = coords.slice(1,-1).map(c => c.distance);

  const result = { controlPointWeights, controlPointDistances };

  return result;
}

// constructor
// options : object containing layout options
// NB: this must stay a function constructor (not an ES `class`); cytoscape
// invokes registered layouts without `new`, which throws for class constructors.
function DagreLayout( this: any, options: Partial<RunOptions> ) {
  this.options = assign( {}, defaults, options ) as RunOptions;
}

// runs the layout
DagreLayout.prototype.run = function( this: any ){
    let options = this.options as RunOptions;
    let layout = this;

    let cy = options.cy; // cy is automatically populated for us in the constructor
    let eles = options.eles;

    let getVal = function( ele: any, val: any ){
      return isFunction(val) ? val.apply( ele, [ ele ] ) : val;
    };

    let bb: any = options.boundingBox || { x1: 0, y1: 0, w: cy.width(), h: cy.height() };
    if( bb.x2 === undefined ){ bb.x2 = bb.x1 + bb.w; }
    if( bb.w === undefined ){ bb.w = bb.x2 - bb.x1; }
    if( bb.y2 === undefined ){ bb.y2 = bb.y1 + bb.h; }
    if( bb.h === undefined ){ bb.h = bb.y2 - bb.y1; }

    let g = new dagre.graphlib.Graph({
      multigraph: true,
      compound: true
    });

    let gObj: Record<string, any> = {};
    let setGObj = function( name: string, val: any ){
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

    g.setDefaultEdgeLabel(function() { return {}; });
    g.setDefaultNodeLabel(function() { return {}; });

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
        g.setParent( node.id(), node.parent().id() );
      }
    }

    // add edges to dagre
    let edges = eles.edges().stdFilter(function( edge: any ){
      return !edge.source().isParent() && !edge.target().isParent(); // dagre can't handle edges on compound nodes
    });

    if ( isFunction(options.sort) ) {
      edges = edges.sort( options.sort );
    }

    for( let i = 0; i < edges.length; i++ ){
      let edge = edges[i];

      g.setEdge( edge.source().id(), edge.target().id(), {
        minlen: getVal( edge, options.minLen ),
        weight: getVal( edge, options.edgeWeight ),
        name: edge.id()
      }, edge.id() );
    }

    dagre.layout( g );

    let gNodeIds = g.nodes();
    for( let i = 0; i < gNodeIds.length; i++ ){
      let id = gNodeIds[i];
      let n = g.node( id );

      cy.getElementById(id).scratch().dagre = n;
    }

    let dagreBB: any;

    if( options.boundingBox ){
      dagreBB = { x1: Infinity, x2: -Infinity, y1: Infinity, y2: -Infinity };
      nodes.forEach(function( node: any ){
        let dModel = node.scratch().dagre;

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

    let constrainPos = function( p: Point ){
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

    nodes.layoutPositions(layout, options, function( this: any, ele: any ){
      ele = typeof ele === "object" ? ele : this;
      let dModel = ele.scratch().dagre;

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
          .style(options.dagreEdgeStyle)
          .update();
      }

      g.edges().forEach(( id: any ) => {
        const cyEdge = cy.getElementById(id.name);
        const dEdge = g.edge(id);

        if (dEdge && dEdge.points) {
          cyEdge.scratch(dagreEdgeToCytoscapeEdge(dEdge, cyEdge));
        }
      });
    }

    return this; // chaining
};

export default DagreLayout;
