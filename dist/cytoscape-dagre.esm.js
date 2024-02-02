/**
 * Copyright (c) 2016-2018, 2020, 2022, 2024, The Cytoscape Consortium.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the “Software”), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as dagre from '@dagrejs/dagre';

var defaults = {
  // dagre algo options, uses default value on undefined
  nodeSep: undefined,
  // the separation between adjacent nodes in the same rank
  edgeSep: undefined,
  // the separation between adjacent edges in the same rank
  rankSep: undefined,
  // the separation between adjacent nodes in the same rank
  rankDir: undefined,
  // 'TB' for top to bottom flow, 'LR' for left to right,
  align: undefined,
  // alignment for rank nodes. Can be 'UL', 'UR', 'DL', or 'DR', where U = up, D = down, L = left, and R = right
  acyclicer: undefined,
  // If set to 'greedy', uses a greedy heuristic for finding a feedback arc set for a graph.
  // A feedback arc set is a set of edges that can be removed to make a graph acyclic.
  ranker: undefined,
  // Type of algorithm to assigns a rank to each node in the input graph.
  // Possible values: network-simplex, tight-tree or longest-path
  minLen: function (edge) {
    return 1;
  },
  // number of ranks to keep between the source and target of the edge
  edgeWeight: function (edge) {
    return 1;
  },
  // higher weight edges are generally made shorter and straighter than lower weight edges

  // general layout options
  fit: true,
  // whether to fit to viewport
  padding: 30,
  // fit padding
  spacingFactor: undefined,
  // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  nodeDimensionsIncludeLabels: false,
  // whether labels should be included in determining the space used by a node
  animate: false,
  // whether to transition the node positions
  animateFilter: function (node, i) {
    return true;
  },
  // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
  animationDuration: 500,
  // duration of animation in ms if enabled
  animationEasing: undefined,
  // easing of animation if enabled
  boundingBox: undefined,
  // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  transform: function (node, pos) {
    return pos;
  },
  // a function that applies a transform to the final node position
  ready: function () {},
  // on layoutready
  sort: undefined,
  // a sorting function to order the nodes and edges; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  // because cytoscape dagre creates a directed graph, and directed graphs use the node order as a tie breaker when
  // defining the topology of a graph, this sort function can help ensure the correct order of the nodes/edges.
  // this feature is most useful when adding and removing the same nodes and edges multiple times in a graph.
  stop: function () {} // on layoutstop
};

// Simple, internal Object.assign() polyfill for options objects etc.

let assign = Object.assign != null ? Object.assign.bind(Object) : function (tgt, ...srcs) {
  srcs.forEach(src => {
    Object.keys(src).forEach(k => tgt[k] = src[k]);
  });
  return tgt;
};

const isFunction = function (o) {
  return typeof o === 'function';
};

// constructor
// options : object containing layout options
function DagreLayout(options) {
  this.options = assign({}, defaults, options);
}

// runs the layout
DagreLayout.prototype.run = function () {
  let options = this.options;
  let layout = this;
  let cy = options.cy; // cy is automatically populated for us in the constructor
  let eles = options.eles;
  let getVal = function (ele, val) {
    return isFunction(val) ? val.apply(ele, [ele]) : val;
  };
  let bb = options.boundingBox || {
    x1: 0,
    y1: 0,
    w: cy.width(),
    h: cy.height()
  };
  if (bb.x2 === undefined) {
    bb.x2 = bb.x1 + bb.w;
  }
  if (bb.w === undefined) {
    bb.w = bb.x2 - bb.x1;
  }
  if (bb.y2 === undefined) {
    bb.y2 = bb.y1 + bb.h;
  }
  if (bb.h === undefined) {
    bb.h = bb.y2 - bb.y1;
  }
  let g = new dagre.graphlib.Graph({
    multigraph: true,
    compound: true
  });
  let gObj = {};
  let setGObj = function (name, val) {
    if (val != null) {
      gObj[name] = val;
    }
  };
  setGObj('nodesep', options.nodeSep);
  setGObj('edgesep', options.edgeSep);
  setGObj('ranksep', options.rankSep);
  setGObj('rankdir', options.rankDir);
  setGObj('align', options.align);
  setGObj('ranker', options.ranker);
  setGObj('acyclicer', options.acyclicer);
  g.setGraph(gObj);
  g.setDefaultEdgeLabel(function () {
    return {};
  });
  g.setDefaultNodeLabel(function () {
    return {};
  });

  // add nodes to dagre
  let nodes = eles.nodes();
  if (isFunction(options.sort)) {
    nodes = nodes.sort(options.sort);
  }
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    let nbb = node.layoutDimensions(options);
    g.setNode(node.id(), {
      width: nbb.w,
      height: nbb.h,
      name: node.id()
    });

    // console.log( g.node(node.id()) );
  }

  // set compound parents
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    if (node.isChild()) {
      g.setParent(node.id(), node.parent().id());
    }
  }

  // add edges to dagre
  let edges = eles.edges().stdFilter(function (edge) {
    return !edge.source().isParent() && !edge.target().isParent(); // dagre can't handle edges on compound nodes
  });
  if (isFunction(options.sort)) {
    edges = edges.sort(options.sort);
  }
  for (let i = 0; i < edges.length; i++) {
    let edge = edges[i];
    g.setEdge(edge.source().id(), edge.target().id(), {
      minlen: getVal(edge, options.minLen),
      weight: getVal(edge, options.edgeWeight),
      name: edge.id()
    }, edge.id());

    // console.log( g.edge(edge.source().id(), edge.target().id(), edge.id()) );
  }
  dagre.layout(g);
  let gNodeIds = g.nodes();
  for (let i = 0; i < gNodeIds.length; i++) {
    let id = gNodeIds[i];
    let n = g.node(id);
    cy.getElementById(id).scratch().dagre = n;
  }
  let dagreBB;
  if (options.boundingBox) {
    dagreBB = {
      x1: Infinity,
      x2: -Infinity,
      y1: Infinity,
      y2: -Infinity
    };
    nodes.forEach(function (node) {
      let dModel = node.scratch().dagre;
      dagreBB.x1 = Math.min(dagreBB.x1, dModel.x);
      dagreBB.x2 = Math.max(dagreBB.x2, dModel.x);
      dagreBB.y1 = Math.min(dagreBB.y1, dModel.y);
      dagreBB.y2 = Math.max(dagreBB.y2, dModel.y);
    });
    dagreBB.w = dagreBB.x2 - dagreBB.x1;
    dagreBB.h = dagreBB.y2 - dagreBB.y1;
  } else {
    dagreBB = bb;
  }
  let constrainPos = function (p) {
    if (options.boundingBox) {
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
  nodes.layoutPositions(layout, options, function (ele) {
    ele = typeof ele === "object" ? ele : this;
    let dModel = ele.scratch().dagre;
    return constrainPos({
      x: dModel.x,
      y: dModel.y
    });
  });
  return this; // chaining
};

// registers the extension on a cytoscape lib ref
function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('layout', 'dagre', DagreLayout); // register with cytoscape.js
}

// This can never happen under the import model since scope is locked down
// However, it will survive the webpacking and still work!
if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

export { register as default };
