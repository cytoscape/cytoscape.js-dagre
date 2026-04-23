const isFunction = function(o){ return typeof o === 'function'; };
const defaults = require('./defaults');
const assign = require('./assign');
const dagre = require('dagre');

// constructor
// options : object containing layout options
function DagreLayout( options ){
  this.options = assign( {}, defaults, options );
}

// adds visible nodes for all the edge control points.
function debugEdge(cy, id, e) {
  if (e.points && defaults.debugDagreCurves) {
    for (var p = 1; p < e.points.length - 1; p++) {
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

/* provides the context for mapping from dagre's x, y coordinate system
 * for control points to cytoscapes coordinate system for control points
 * which is relative to the straight vector from source to target node
 */
function buildFrame(src, tgt) {
  const dx = tgt.x - src.x;
  const dy = tgt.y - src.y;

  const len = Math.hypot(dx, dy) || 1;

  const dir = { x: dx / len, y: dy / len };
  const perp = { x: -dir.y, y: dir.x };

  console.log('frame', { dir, perp, len });
  return { dir, perp, len };
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
        .selector('edge[cpd]')
        .style({
          'curve-style' : 'unbundled-bezier',
          'control-point-weights': 'data(cpw)',
          'control-point-distances': 'data(cpd)',
        }).update();
    }
}

function projectPoint(P, src, frame) {
  const MIN = 0.01;
  const vx = (P.x - src.x) * 1.1;
  const vy = (P.y - src.y) * 1.1;

  const t = Math.abs(vx) < 0.1 ? 0 : (vx * frame.dir.x + vy * frame.dir.y) / frame.len;
  var d = Math.abs(vx) < 0.1 ? 0.5 : (vx * frame.perp.x + vy * frame.perp.y);

  // bezier curves do not work well with exactly perpendicular control points
  if (Math.abs(d) < MIN) {
      d = (d < 0 ? -1 : 1) * MIN;
  }

  return { t, d };
}

function sanitize(points) {
  const out = [];

  for (let i = 0; i < points.length; i++) {
    const p = points[i];

    if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) {
      continue;
    }

    const prev = out[out.length - 1];
    if (prev && Math.hypot(p.x - prev.x, p.y - prev.y) < 0.1) {
      continue;
    }

    out.push(p);
  }

  return out;
}


function dagreToCytoscape(id, edge) {
  const frame = buildFrame(edge.points[0], edge.points[edge.points.length-1]);

  const points = sanitize(edge.points);

  const cpw = [];
  const cpd = [];

  for (let i = 0; i < points.length; i++) {
    const { t, d } = projectPoint(points[i], points[0], frame);

    cpw.push(t);
    cpd.push(d);
  }

  return { cpw, cpd };
}

function normalizeCPW(cpw) {
  const min = Math.min(...cpw);
  const max = Math.max(...cpw);
  const range = max - min || 1;

  return cpw.map(v => (v - min) / range);
}

function dagreEdgeToCy(id, edge) {
  const { cpw, cpd } = dagreToCytoscape(id, edge);

  return {
    cpw: normalizeCPW(cpw),
    cpd
  };
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
    cy.remove('edge'); // remove all existing edges on the cytoscape side (we will make new ones below)

    var gEdgeIds = g.edges();
  
    for (var i = 0; i < gEdgeIds.length; i++ ) {
      var id = gEdgeIds[i];
      var e = g.edge(id);

      if (e && e.points) {
        debugEdge(cy, id, e);
        const { cpw, cpd } = dagreEdgeToCy(id, e);
    
        cy.add({
          data: {
            id: `edge__${id.v}_${id.w}`,
            source: id.v,
            target: id.w,
            cpw: cpw,
            cpd: cpd
          },
          classes: 'edge',
        });
      }
    }

    addEdgePointStyle(cy, options);
  }

  return this; // chaining
};

module.exports = DagreLayout;
