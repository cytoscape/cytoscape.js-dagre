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

function segmentsToBezierCurves(points, tension = 1.5) {
  const result = [];

  for (let i = 0; i < points.length - 1; i++) {
    var p0 = points[i - 1] || points[i];
    var p1 = points[i];
    var p2 = points[i + 1];
    var p3 = points[i + 2] || p2;

    var c1 = {
      x: p1.x + (p2.x - p0.x) / 6 * tension,
      y: p1.y + (p2.y - p0.y) / 6 * tension
    };

    var c2 = {
      x: p2.x - (p3.x - p1.x) / 6 * tension,
      y: p2.y - (p3.y - p1.y) / 6 * tension
    };

    result.push({ p1, c1, c2, p2 });
  }

  return result;
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

/* Transforms the x/y position of Dagre's middle Bezier edge control point to 
 * the distance perpendicular to the direct line from source to target, as expected 
 * by the `control-point-distances` of Cytoscape's `unbundled-bezier` edge style.
 * We also produce a weight for each point a weight for `control-points-weights`
 * to simulate exactlty the same shape as Dagre would show.
 */
function cytoControlPoint(source, target, control) {
  var dx = target.x - source.x;
  var dy = target.y - source.y;
  var len = Math.hypot(dx, dy) || 1;

  var ux = dx / len;
  var uy = dy / len;

  var px = -uy;
  var py = ux;

  var vx = control.x - source.x;
  var vy = control.y - source.y;

  return { 
    weight: (vx * ux + vy * uy) / len,
    distance: vx * px + vy * py,
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
      var e = g.edge( id );

      if (e && e.points) {
        debugEdge(cy, id, e);
        var curves = segmentsToBezierCurves(e.points);
        var weights = [];
        var distances= [];

        curves.forEach(seg => {
          const { weight: w, distance: d } = cytoControlPoint(seg.p1, seg.p2, seg.c1);
          weights.push(w);
          distances.push(d * 2.5);
        });

        cy.add({
          data: {
            id: `edge__${id.v}_${id.w}`,
            source: id.v,
            target: id.w,
            cpw: weights,
            cpd: distances
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
