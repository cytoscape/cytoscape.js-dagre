const isFunction = function(o){ return typeof o === 'function'; };
const defaults = require('./defaults');
const assign = require('./assign');
const dagre = require('dagre');
const EPSILON = 0.001; // what does it mean to be too close to 0?

// constructor
// options : object containing layout options
function DagreLayout( options ){
  this.options = assign( {}, defaults, options );
}

// adds visible nodes for all the edge control points.
function debugEdge(cy, id, cyEdge, e) {
  if (e.points && defaults.debugDagreCurves) {
    cy.add({
      data: {
       id: `edgepoint_src_${id.name}`
      },
      classes: 'sourcepoint',
      position: {
        x: cyEdge.source().position().x,
        y: cyEdge.source().position().y
      }
    });

    cy.add({
      data: {
       id: `edgepoint_target_${id.name}`
      },
      classes: 'targetpoint',
      position: {
        x: cyEdge.target().position().x,
        y: cyEdge.target().position().y
      }
    });

    for (var p = 0; p < e.points.length - 1; p++) {
      if (e.points[p]) {
        cy.add({
          data: {
            id: `edgepoint_${id.name}__d${p}`
          },
          classes: 'edgepoint',
          position: {
            x: e.points[p].x,
            y: e.points[p].y
          },
          selectable: false,
          grabbable: false
        });
      }
    }
  }
}

function sub(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}

function norm(v) {
  const len = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / len, y: v.y / len, len };
}

function perp(v) {
  return { x: -v.y, y: v.x };
}

/* provides the context for mapping from dagre's x, y coordinate system
 * for control points to cytoscapes coordinate system for control points
 * which is relative to the straight vector from source to target node
 */
function buildFrame(src, tgt) {
  const d = sub(tgt, src);
  const { x, y, len } = norm(d);

  const dir = { x, y };
  const normal = perp(dir);

  return { src, tgt, dir, normal, len };
}

function addEdgePointStyle(cy, options) {
  if (true | options.debugDagreCurves) {
      cy.style()
        .selector('node.edgepoint')
        .style({
          'background-color': '#ff0000',
          'width': 8,
          'height': 8,
          'shape': 'diamond' 
        })
        .update();
      cy.style()
        .selector('node.sourcepoint')
        .style({
          'background-color': '#ff0000',
          'width': 8,
          'height': 8,
          'shape': 'triangle' 
        })
        .update();
      cy.style()
        .selector('node.targetpoint')
        .style({
          'background-color': '#00ff00',
          'width': 8,
          'height': 8,
          'shape': 'square' 
        })
        .update();
      cy.style()
        .selector('edge[cpd]')
        .style({
          'curve-style' : 'unbundled-bezier',
          'control-point-weights': 'data(cpw)',
          'control-point-distances': 'data(cpd)',
        }).update();
    }
}

function noZero(x) {
  if (Math.abs(x) < EPSILON) {
    return x < 0 ? -EPSILON : EPSILON;
  }

  return x;
}

function projectPoint(P, frame) {
  const v = sub(P, frame.src);
  const w = noZero(dot(v, frame.dir) / frame.len);
  const d = noZero(dot(v, frame.normal));

  return { w, d };
}

function direction(a, b) {
  return norm({ x: b.x - a.x, y: b.y - a.y });
}

function createEndpoints(src, tgt, points, k = 50) {
  if (points.length === 0) return [];

  const first = points[0];
  const last = points[points.length - 1];

  const dirOut = direction(src, first);
  const dirIn  = direction(last, tgt);

  const startCtrl = {
    x: src.x + dirOut.x * k,
    y: src.y + dirOut.y * k
  };

  const endCtrl = {
    x: tgt.x - dirIn.x * k,
    y: tgt.y - dirIn.y * k
  };

  return [startCtrl, ...points, endCtrl];
}

function sanitize(points) {
  const out = [];

  for (let i = 0; i < points.length; i++) {
    const p = points[i];

    if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) {
      continue;
    }

    const prev = out[out.length - 1];
    if (prev && Math.hypot(p.x - prev.x, p.y - prev.y) < EPSILON) {
      continue;
    }

    out.push(p);
  }

  return out;
}

/* First we overwrite the first and last points of the dagre solution
 * with the original source and target positions according to cytoscape.js
 * Then we sanitize any empty or non-existing or degenerate control points
 * And finally we map the Dagre coordinates to the Cytoscape coordinated which
 * are relative to the original direction vector from source to target.
 */
function dagreToCytoscape(dEdge, cyEdge) {
  const from = cyEdge.source().position();
  const to = cyEdge.target().position();
  const frame = buildFrame(from, to);
  const points = createEndpoints(from, to, sanitize(dEdge.points));

  var cpw = [];
  var cpd = [];

  points.forEach(p => {
    const { w, d } = projectPoint(p, frame);

    cpw.push(w);
    cpd.push(d);
  });

  cpw = normalizeWeight(cpw);

  return { cpw, cpd };
}

function normalizeWeight(cpw) {
  const min = Math.min(...cpw);
  const max = Math.max(...cpw);
  const range = max - min || 1;

  return cpw.map(v => (v - min) / range);
}

// runs the layout
DagreLayout.prototype.run = function(){
  let options = this.options;
  let layout = this;

  let cy = options.cy; // cy is automatically populated for us in the constructor
  let eles = options.eles;

  let getVal = function( ele, val ){
    return isFunction(val) ? val.apply( ele, [ ele ] ) : val;
  };

  let bb = options.boundingBox || { x1: 0, y1: 0, w: cy.width(), h: cy.height() };
  if( bb.x2 === undefined ){ bb.x2 = bb.x1 + bb.w; }
  if( bb.w === undefined ){ bb.w = bb.x2 - bb.x1; }
  if( bb.y2 === undefined ){ bb.y2 = bb.y1 + bb.h; }
  if( bb.h === undefined ){ bb.h = bb.y2 - bb.y1; }

  let g = new dagre.graphlib.Graph({
    multigraph: true,
    compound: true
  });

  let gObj = {};
  let setGObj = function( name, val ){
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
  let edges = eles.edges().stdFilter(function( edge ){
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

  let dagreBB;

  if( options.boundingBox ){
    dagreBB = { x1: Infinity, x2: -Infinity, y1: Infinity, y2: -Infinity };
    nodes.forEach(function( node ){
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

  let constrainPos = function( p ){
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

  nodes.layoutPositions(layout, options, function( ele ){
    ele = typeof ele === "object" ? ele : this;
    let dModel = ele.scratch().dagre;

    return constrainPos({
      x: dModel.x,
      y: dModel.y
    });
  });

  if (true | options.useDagreCurves) {
      // moving nodes around does not make sense with dagre edge layout
    addEdgePointStyle(cy, options);
  
    g.edges().forEach(id => {
      const cyEdge = cy.getElementById(id.name);
      const dEdge = g.edge(id);

      if (dEdge && dEdge.points) {
        debugEdge(cy, id, cyEdge, dEdge);
        cyEdge.data(dagreToCytoscape(dEdge, cyEdge));
      }
    });
  }

  return this; // chaining
};

module.exports = DagreLayout;
