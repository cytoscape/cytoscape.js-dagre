import defaults from './defaults.ts';
import assign from './assign.ts';
import dagre from '@dagrejs/dagre';
import type { DagreOptions } from './types.ts';

const isFunction = function(o: any): boolean { return typeof o === 'function'; };
const EPSILON = 0.001; // what does it mean to be too close to 0?

interface Vector2D {
  x: number;
  y: number;
}

interface EdgeFrame {
  src: Vector2D;
  tgt: Vector2D;
  dir: Vector2D;
  normal: Vector2D;
  len: number;
}

// Helper to resolve parent nodes to actual child nodes for Dagre ranking
function getDagreNode(ele: any): any {
  if (ele.isParent()) {
    const children = ele.children();
    if (children.length > 0) {
      // Recursively find the first leaf child inside the compound parent
      return getDagreNode(children[0]);
    }
  }
  return ele;
}

// constructor
// options : object containing layout options
function DagreLayout(this: any, options: DagreOptions) {
  this.options = assign( {}, defaults, options );
}

function subtract(a: Vector2D, b: Vector2D): Vector2D {
  return { x: noZero(a.x - b.x), y: noZero(a.y - b.y) };
}

function product(a: Vector2D, b: Vector2D): number {
  return noZero(a.x * b.x) + noZero(a.y * b.y);
}

function norm(v: Vector2D): Vector2D & { len: number } {
  const len = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / len, y: v.y / len, len };
}

function perp(v: Vector2D): Vector2D {
  return { x: -v.y, y: v.x };
}

/* provides the context for mapping from dagre's x, y coordinate system
 * for control points to cytoscapes coordinate system for control points
 * which is relative to the straight vector from source to target node
 */
function buildEdgeFrame(src: Vector2D, tgt: Vector2D): EdgeFrame {
  const d = subtract(tgt, src);
  const { x, y, len } = norm(d);

  const dir = { x, y };
  const normal = perp(dir);

  return { src, tgt, dir, normal, len };
}

function noZero(x: number): number {
  if (Math.abs(x) < EPSILON) {
    return x < 0 ? -EPSILON : EPSILON;
  }

  return x;
}

function toEdgeCoordinates(P: Vector2D, frame: EdgeFrame) {
  const vector = subtract(P, frame.src);
  const weight = noZero(product(vector, frame.dir) / frame.len);
  const distance = noZero(product(vector, frame.normal));

  return { weight, distance };
}

function normalizeWeight(coords: Array<{ weight: number; distance: number }>) {
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
function dagreEdgeToCytoscapeEdge(dEdge: any, cEdge: any) {
  const fromNode = cEdge.source().position();
  const toNode = cEdge.target().position();
  const frame = buildEdgeFrame(fromNode, toNode);
  const coords = normalizeWeight(dEdge.points.map((p: Vector2D) => toEdgeCoordinates(p, frame)));
  
  const controlPointWeights = coords.slice(1,-1).map((c: any) => c.weight);
  const controlPointDistances = coords.slice(1,-1).map((c: any) => c.distance);

  const result = { controlPointWeights, controlPointDistances };

  return result;
}

// runs the layout
DagreLayout.prototype.run = function(this: any){
  let options: DagreOptions = this.options;
  let layout = this;

  let cy = (options as any).cy; // cy is automatically populated for us in the constructor
  let eles = (options as any).eles;

  let getVal = function( ele: any, val: any ){
    return isFunction(val) ? val.apply( ele, [ ele ] ) : val;
  };
let rawBb = options.boundingBox || {};
  let bb = {
    x1: rawBb.x1 ?? 0,
    y1: rawBb.y1 ?? 0,
    x2: rawBb.x2 ?? (rawBb.x1 !== undefined && rawBb.w !== undefined ? rawBb.x1 + rawBb.w : cy.width()),
    y2: rawBb.y2 ?? (rawBb.y1 !== undefined && rawBb.h !== undefined ? rawBb.y1 + rawBb.h : cy.height()),
    w: 0,
    h: 0
  };
  bb.w = rawBb.w ?? (bb.x2 - bb.x1);
  bb.h = rawBb.h ?? (bb.y2 - bb.y1);
  if (rawBb.x2 === undefined && rawBb.w === undefined) {
    bb.x2 = bb.x1 + bb.w;
  }
  if (rawBb.y2 === undefined && rawBb.h === undefined) {
    bb.y2 = bb.y1 + bb.h;
  }
  let g = new (dagre.graphlib.Graph as any)({
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
  let edges = eles.edges();

  if ( isFunction(options.sort) ) {
    edges = edges.sort( options.sort );
  }

  for( let i = 0; i < edges.length; i++ ){
    let edge = edges[i];

    // Resolve source and target to non-parent leaf nodes if needed
    let sourceNode = getDagreNode(edge.source());
    let targetNode = getDagreNode(edge.target());

    g.setEdge( sourceNode.id(), targetNode.id(), {
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

  let constrainPos = function( p: Vector2D ): Vector2D {
    if( options.boundingBox ){
      let xPct = dagreBB.w === 0 ? 0 : (p.x - dagreBB.x1) / dagreBB.w;
      let yPct = dagreBB.h === 0 ? 0 : (p.y - dagreBB.y1) / dagreBB.h;

      return {
        x: (bb.x1 ?? 0) + xPct * (bb.w ?? 0),
        y: (bb.y1 ?? 0) + yPct * (bb.h ?? 0)
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
    
    g.edges().forEach((id: any) => {
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