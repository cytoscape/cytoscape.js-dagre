(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeDagre"] = factory();
	else
		root["cytoscapeDagre"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assign.js":
/*!***********************!*\
  !*** ./src/assign.js ***!
  \***********************/
/***/ ((module) => {

// Simple, internal Object.assign() polyfill for options objects etc.

module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt) {
  for (var _len = arguments.length, srcs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    srcs[_key - 1] = arguments[_key];
  }
  srcs.forEach(function (src) {
    Object.keys(src).forEach(function (k) {
      return tgt[k] = src[k];
    });
  });
  return tgt;
};

/***/ }),

/***/ "./src/defaults.js":
/*!*************************!*\
  !*** ./src/defaults.js ***!
  \*************************/
/***/ ((module) => {

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
  minLen: function minLen(edge) {
    return 1;
  },
  // number of ranks to keep between the source and target of the edge
  edgeWeight: function edgeWeight(edge) {
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
  animateFilter: function animateFilter(node, i) {
    return true;
  },
  // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
  animationDuration: 500,
  // duration of animation in ms if enabled
  animationEasing: undefined,
  // easing of animation if enabled
  boundingBox: undefined,
  // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  transform: function transform(node, pos) {
    return pos;
  },
  // a function that applies a transform to the final node position
  ready: function ready() {},
  // on layoutready
  sort: undefined,
  // a sorting function to order the nodes and edges; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  // because cytoscape dagre creates a directed graph, and directed graphs use the node order as a tie breaker when
  // defining the topology of a graph, this sort function can help ensure the correct order of the nodes/edges.
  // this feature is most useful when adding and removing the same nodes and edges multiple times in a graph.
  stop: function stop() {} // on layoutstop
};

module.exports = defaults;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var impl = __webpack_require__(/*! ./layout */ "./src/layout.js");

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('layout', 'dagre', impl); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}
module.exports = register;

/***/ }),

/***/ "./src/layout.js":
/*!***********************!*\
  !*** ./src/layout.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var isFunction = function isFunction(o) {
  return typeof o === 'function';
};
var defaults = __webpack_require__(/*! ./defaults */ "./src/defaults.js");
var assign = __webpack_require__(/*! ./assign */ "./src/assign.js");
var dagre = __webpack_require__(/*! dagre */ "./node_modules/dagre/index.js");

// constructor
// options : object containing layout options
function DagreLayout(options) {
  this.options = assign({}, defaults, options);
}

// runs the layout
DagreLayout.prototype.run = function () {
  var options = this.options;
  var layout = this;
  var cy = options.cy; // cy is automatically populated for us in the constructor
  var eles = options.eles;
  var getVal = function getVal(ele, val) {
    return isFunction(val) ? val.apply(ele, [ele]) : val;
  };
  var bb = options.boundingBox || {
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
  var g = new dagre.graphlib.Graph({
    multigraph: true,
    compound: true
  });
  var gObj = {};
  var setGObj = function setGObj(name, val) {
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
  var nodes = eles.nodes();
  if (isFunction(options.sort)) {
    nodes = nodes.sort(options.sort);
  }
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var nbb = node.layoutDimensions(options);
    g.setNode(node.id(), {
      width: nbb.w,
      height: nbb.h,
      name: node.id()
    });

    // console.log( g.node(node.id()) );
  }

  // set compound parents
  for (var _i = 0; _i < nodes.length; _i++) {
    var _node = nodes[_i];
    if (_node.isChild()) {
      g.setParent(_node.id(), _node.parent().id());
    }
  }

  // add edges to dagre
  var edges = eles.edges().stdFilter(function (edge) {
    return !edge.source().isParent() && !edge.target().isParent(); // dagre can't handle edges on compound nodes
  });

  if (isFunction(options.sort)) {
    edges = edges.sort(options.sort);
  }
  for (var _i2 = 0; _i2 < edges.length; _i2++) {
    var edge = edges[_i2];
    g.setEdge(edge.source().id(), edge.target().id(), {
      minlen: getVal(edge, options.minLen),
      weight: getVal(edge, options.edgeWeight),
      name: edge.id()
    }, edge.id());

    // console.log( g.edge(edge.source().id(), edge.target().id(), edge.id()) );
  }

  dagre.layout(g);
  var gNodeIds = g.nodes();
  for (var _i3 = 0; _i3 < gNodeIds.length; _i3++) {
    var id = gNodeIds[_i3];
    var n = g.node(id);
    cy.getElementById(id).scratch().dagre = n;
  }
  var dagreBB;
  if (options.boundingBox) {
    dagreBB = {
      x1: Infinity,
      x2: -Infinity,
      y1: Infinity,
      y2: -Infinity
    };
    nodes.forEach(function (node) {
      var dModel = node.scratch().dagre;
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
  var constrainPos = function constrainPos(p) {
    if (options.boundingBox) {
      var xPct = dagreBB.w === 0 ? 0 : (p.x - dagreBB.x1) / dagreBB.w;
      var yPct = dagreBB.h === 0 ? 0 : (p.y - dagreBB.y1) / dagreBB.h;
      return {
        x: bb.x1 + xPct * bb.w,
        y: bb.y1 + yPct * bb.h
      };
    } else {
      return p;
    }
  };
  nodes.layoutPositions(layout, options, function (ele) {
    ele = _typeof(ele) === "object" ? ele : this;
    var dModel = ele.scratch().dagre;
    return constrainPos({
      x: dModel.x,
      y: dModel.y
    });
  });
  return this; // chaining
};

module.exports = DagreLayout;

/***/ }),

/***/ "./node_modules/dagre/index.js":
/*!*************************************!*\
  !*** ./node_modules/dagre/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
Copyright (c) 2012-2014 Chris Pettitt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

module.exports = {
  graphlib: __webpack_require__(/*! ./lib/graphlib */ "./node_modules/dagre/lib/graphlib.js"),

  layout: __webpack_require__(/*! ./lib/layout */ "./node_modules/dagre/lib/layout.js"),
  debug: __webpack_require__(/*! ./lib/debug */ "./node_modules/dagre/lib/debug.js"),
  util: {
    time: (__webpack_require__(/*! ./lib/util */ "./node_modules/dagre/lib/util.js").time),
    notime: (__webpack_require__(/*! ./lib/util */ "./node_modules/dagre/lib/util.js").notime)
  },
  version: __webpack_require__(/*! ./lib/version */ "./node_modules/dagre/lib/version.js")
};


/***/ }),

/***/ "./node_modules/dagre/lib/acyclic.js":
/*!*******************************************!*\
  !*** ./node_modules/dagre/lib/acyclic.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ./lodash */ "./node_modules/dagre/lib/lodash.js");
var greedyFAS = __webpack_require__(/*! ./greedy-fas */ "./node_modules/dagre/lib/greedy-fas.js");

module.exports = {
  run: run,
  undo: undo
};

function run(g) {
  var fas = (g.graph().acyclicer === "greedy"
    ? greedyFAS(g, weightFn(g))
    : dfsFAS(g));
  _.forEach(fas, function(e) {
    var label = g.edge(e);
    g.removeEdge(e);
    label.forwardName = e.name;
    label.reversed = true;
    g.setEdge(e.w, e.v, label, _.uniqueId("rev"));
  });

  function weightFn(g) {
    return function(e) {
      return g.edge(e).weight;
    };
  }
}

function dfsFAS(g) {
  var fas = [];
  var stack = {};
  var visited = {};

  function dfs(v) {
    if (_.has(visited, v)) {
      return;
    }
    visited[v] = true;
    stack[v] = true;
    _.forEach(g.outEdges(v), function(e) {
      if (_.has(stack, e.w)) {
        fas.push(e);
      } else {
        dfs(e.w);
      }
    });
    delete stack[v];
  }

  _.forEach(g.nodes(), dfs);
  return fas;
}

function undo(g) {
  _.forEach(g.edges(), function(e) {
    var label = g.edge(e);
    if (label.reversed) {
      g.removeEdge(e);

      var forwardName = label.forwardName;
      delete label.reversed;
      delete label.forwardName;
      g.setEdge(e.w, e.v, label, forwardName);
    }
  });
}


/***/ }),

/***/ "./node_modules/dagre/lib/add-border-segments.js":
/*!*******************************************************!*\
  !*** ./node_modules/dagre/lib/add-border-segments.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./lodash */ "./node_modules/dagre/lib/lodash.js");
var util = __webpack_require__(/*! ./util */ "./node_modules/dagre/lib/util.js");

module.exports = addBorderSegments;

function addBorderSegments(g) {
  function dfs(v) {
    var children = g.children(v);
    var node = g.node(v);
    if (children.length) {
      _.forEach(children, dfs);
    }

    if (_.has(node, "minRank")) {
      node.borderLeft = [];
      node.borderRight = [];
      for (var rank = node.minRank, maxRank = node.maxRank + 1;
        rank < maxRank;
        ++rank) {
        addBorderNode(g, "borderLeft", "_bl", v, node, rank);
        addBorderNode(g, "borderRight", "_br", v, node, rank);
      }
    }
  }

  _.forEach(g.children(), dfs);
}

function addBorderNode(g, prop, prefix, sg, sgNode, rank) {
  var label = { width: 0, height: 0, rank: rank, borderType: prop };
  var prev = sgNode[prop][rank - 1];
  var curr = util.addDummyNode(g, "border", label, prefix);
  sgNode[prop][rank] = curr;
  g.setParent(curr, sg);
  if (prev) {
    g.setEdge(prev, curr, { weight: 1 });
  }
}


/***/ }),

/***/ "./node_modules/dagre/lib/coordinate-system.js":
/*!*****************************************************!*\
  !*** ./node_modules/dagre/lib/coordinate-system.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ./lodash */ "./node_modules/dagre/lib/lodash.js");

module.exports = {
  adjust: adjust,
  undo: undo
};

function adjust(g) {
  var rankDir = g.graph().rankdir.toLowerCase();
  if (rankDir === "lr" || rankDir === "rl") {
    swapWidthHeight(g);
  }
}

function undo(g) {
  var rankDir = g.graph().rankdir.toLowerCase();
  if (rankDir === "bt" || rankDir === "rl") {
    reverseY(g);
  }

  if (rankDir === "lr" || rankDir === "rl") {
    swapXY(g);
    swapWidthHeight(g);
  }
}

function swapWidthHeight(g) {
  _.forEach(g.nodes(), function(v) { swapWidthHeightOne(g.node(v)); });
  _.forEach(g.edges(), function(e) { swapWidthHeightOne(g.edge(e)); });
}

function swapWidthHeightOne(attrs) {
  var w = attrs.width;
  attrs.width = attrs.height;
  attrs.height = w;
}

function reverseY(g) {
  _.forEach(g.nodes(), function(v) { reverseYOne(g.node(v)); });

  _.forEach(g.edges(), function(e) {
    var edge = g.edge(e);
    _.forEach(edge.points, reverseYOne);
    if (_.has(edge, "y")) {
      reverseYOne(edge);
    }
  });
}

function reverseYOne(attrs) {
  attrs.y = -attrs.y;
}

function swapXY(g) {
  _.forEach(g.nodes(), function(v) { swapXYOne(g.node(v)); });

  _.forEach(g.edges(), function(e) {
    var edge = g.edge(e);
    _.forEach(edge.points, swapXYOne);
    if (_.has(edge, "x")) {
      swapXYOne(edge);
    }
  });
}

function swapXYOne(attrs) {
  var x = attrs.x;
  attrs.x = attrs.y;
  attrs.y = x;
}


/***/ }),

/***/ "./node_modules/dagre/lib/data/list.js":
/*!*********************************************!*\
  !*** ./node_modules/dagre/lib/data/list.js ***!
  \*********************************************/
/***/ ((module) => {

/*
 * Simple doubly linked list implementation derived from Cormen, et al.,
 * "Introduction to Algorithms".
 */

module.exports = List;

function List() {
  var sentinel = {};
  sentinel._next = sentinel._prev = sentinel;
  this._sentinel = sentinel;
}

List.prototype.dequeue = function() {
  var sentinel = this._sentinel;
  var entry = sentinel._prev;
  if (entry !== sentinel) {
    unlink(entry);
    return entry;
  }
};

List.prototype.enqueue = function(entry) {
  var sentinel = this._sentinel;
  if (entry._prev && entry._next) {
    unlink(entry);
  }
  entry._next = sentinel._next;
  sentinel._next._prev = entry;
  sentinel._next = entry;
  entry._prev = sentinel;
};

List.prototype.toString = function() {
  var strs = [];
  var sentinel = this._sentinel;
  var curr = sentinel._prev;
  while (curr !== sentinel) {
    strs.push(JSON.stringify(curr, filterOutLinks));
    curr = curr._prev;
  }
  return "[" + strs.join(", ") + "]";
};

function unlink(entry) {
  entry._prev._next = entry._next;
  entry._next._prev = entry._prev;
  delete entry._next;
  delete entry._prev;
}

function filterOutLinks(k, v) {
  if (k !== "_next" && k !== "_prev") {
    return v;
  }
}


/***/ }),

/***/ "./node_modules/dagre/lib/debug.js":
/*!*****************************************!*\
  !*** ./node_modules/dagre/lib/debug.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./lodash */ "./node_modules/dagre/lib/lodash.js");
var util = __webpack_require__(/*! ./util */ "./node_modules/dagre/lib/util.js");
var Graph = (__webpack_require__(/*! ./graphlib */ "./node_modules/dagre/lib/graphlib.js").Graph);

module.exports = {
  debugOrdering: debugOrdering
};

/* istanbul ignore next */
function debugOrdering(g) {
  var layerMatrix = util.buildLayerMatrix(g);

  var h = new Graph({ compound: true, multigraph: true }).setGraph({});

  _.forEach(g.nodes(), function(v) {
    h.setNode(v, { label: v });
    h.setParent(v, "layer" + g.node(v).rank);
  });

  _.forEach(g.edges(), function(e) {
    h.setEdge(e.v, e.w, {}, e.name);
  });

  _.forEach(layerMatrix, function(layer, i) {
    var layerV = "layer" + i;
    h.setNode(layerV, { rank: "same" });
    _.reduce(layer, function(u, v) {
      h.setEdge(u, v, { style: "invis" });
      return v;
    });
  });

  return h;
}


/***/ }),

/***/ "./node_modules/dagre/lib/graphlib.js":
/*!********************************************!*\
  !*** ./node_modules/dagre/lib/graphlib.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* global window */

var graphlib;

if (true) {
  try {
    graphlib = __webpack_require__(/*! graphlib */ "./node_modules/graphlib/index.js");
  } catch (e) {
    // continue regardless of error
  }
}

if (!graphlib) {
  graphlib = window.graphlib;
}

module.exports = graphlib;


/***/ }),

/***/ "./node_modules/dagre/lib/greedy-fas.js":
/*!**********************************************!*\
  !*** ./node_modules/dagre/lib/greedy-fas.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./lodash */ "./node_modules/dagre/lib/lodash.js");
var Graph = (__webpack_require__(/*! ./graphlib */ "./node_modules/dagre/lib/graphlib.js").Graph);
var List = __webpack_require__(/*! ./data/list */ "./node_modules/dagre/lib/data/list.js");

/*
 * A greedy heuristic for finding a feedback arc set for a graph. A feedback
 * arc set is a set of edges that can be removed to make a graph acyclic.
 * The algorithm comes from: P. Eades, X. Lin, and W. F. Smyth, "A fast and
 * effective heuristic for the feedback arc set problem." This implementation
 * adjusts that from the paper to allow for weighted edges.
 */
module.exports = greedyFAS;

var DEFAULT_WEIGHT_FN = _.constant(1);

function greedyFAS(g, weightFn) {
  if (g.nodeCount() <= 1) {
    return [];
  }
  var state = buildState(g, weightFn || DEFAULT_WEIGHT_FN);
  var results = doGreedyFAS(state.graph, state.buckets, state.zeroIdx);

  // Expand multi-edges
  return _.flatten(_.map(results, function(e) {
    return g.outEdges(e.v, e.w);
  }), true);
}

function doGreedyFAS(g, buckets, zeroIdx) {
  var results = [];
  var sources = buckets[buckets.length - 1];
  var sinks = buckets[0];

  var entry;
  while (g.nodeCount()) {
    while ((entry = sinks.dequeue()))   { removeNode(g, buckets, zeroIdx, entry); }
    while ((entry = sources.dequeue())) { removeNode(g, buckets, zeroIdx, entry); }
    if (g.nodeCount()) {
      for (var i = buckets.length - 2; i > 0; --i) {
        entry = buckets[i].dequeue();
        if (entry) {
          results = results.concat(removeNode(g, buckets, zeroIdx, entry, true));
          break;
        }
      }
    }
  }

  return results;
}

function removeNode(g, buckets, zeroIdx, entry, collectPredecessors) {
  var results = collectPredecessors ? [] : undefined;

  _.forEach(g.inEdges(entry.v), function(edge) {
    var weight = g.edge(edge);
    var uEntry = g.node(edge.v);

    if (collectPredecessors) {
      results.push({ v: edge.v, w: edge.w });
    }

    uEntry.out -= weight;
    assignBucket(buckets, zeroIdx, uEntry);
  });

  _.forEach(g.outEdges(entry.v), function(edge) {
    var weight = g.edge(edge);
    var w = edge.w;
    var wEntry = g.node(w);
    wEntry["in"] -= weight;
    assignBucket(buckets, zeroIdx, wEntry);
  });

  g.removeNode(entry.v);

  return results;
}

function buildState(g, weightFn) {
  var fasGraph = new Graph();
  var maxIn = 0;
  var maxOut = 0;

  _.forEach(g.nodes(), function(v) {
    fasGraph.setNode(v, { v: v, "in": 0, out: 0 });
  });

  // Aggregate weights on nodes, but also sum the weights across multi-edges
  // into a single edge for the fasGraph.
  _.forEach(g.edges(), function(e) {
    var prevWeight = fasGraph.edge(e.v, e.w) || 0;
    var weight = weightFn(e);
    var edgeWeight = prevWeight + weight;
    fasGraph.setEdge(e.v, e.w, edgeWeight);
    maxOut = Math.max(maxOut, fasGraph.node(e.v).out += weight);
    maxIn  = Math.max(maxIn,  fasGraph.node(e.w)["in"]  += weight);
  });

  var buckets = _.range(maxOut + maxIn + 3).map(function() { return new List(); });
  var zeroIdx = maxIn + 1;

  _.forEach(fasGraph.nodes(), function(v) {
    assignBucket(buckets, zeroIdx, fasGraph.node(v));
  });

  return { graph: fasGraph, buckets: buckets, zeroIdx: zeroIdx };
}

function assignBucket(buckets, zeroIdx, entry) {
  if (!entry.out) {
    buckets[0].enqueue(entry);
  } else if (!entry["in"]) {
    buckets[buckets.length - 1].enqueue(entry);
  } else {
    buckets[entry.out - entry["in"] + zeroIdx].enqueue(entry);
  }
}


/***/ }),

/***/ "./node_modules/dagre/lib/layout.js":
/*!******************************************!*\
  !*** ./node_modules/dagre/lib/layout.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ./lodash */ "./node_modules/dagre/lib/lodash.js");
var acyclic = __webpack_require__(/*! ./acyclic */ "./node_modules/dagre/lib/acyclic.js");
var normalize = __webpack_require__(/*! ./normalize */ "./node_modules/dagre/lib/normalize.js");
var rank = __webpack_require__(/*! ./rank */ "./node_modules/dagre/lib/rank/index.js");
var normalizeRanks = (__webpack_require__(/*! ./util */ "./node_modules/dagre/lib/util.js").normalizeRanks);
var parentDummyChains = __webpack_require__(/*! ./parent-dummy-chains */ "./node_modules/dagre/lib/parent-dummy-chains.js");
var removeEmptyRanks = (__webpack_require__(/*! ./util */ "./node_modules/dagre/lib/util.js").removeEmptyRanks);
var nestingGraph = __webpack_require__(/*! ./nesting-graph */ "./node_modules/dagre/lib/nesting-graph.js");
var addBorderSegments = __webpack_require__(/*! ./add-border-segments */ "./node_modules/dagre/lib/add-border-segments.js");
var coordinateSystem = __webpack_require__(/*! ./coordinate-system */ "./node_modules/dagre/lib/coordinate-system.js");
var order = __webpack_require__(/*! ./order */ "./node_modules/dagre/lib/order/index.js");
var position = __webpack_require__(/*! ./position */ "./node_modules/dagre/lib/position/index.js");
var util = __webpack_require__(/*! ./util */ "./node_modules/dagre/lib/util.js");
var Graph = (__webpack_require__(/*! ./graphlib */ "./node_modules/dagre/lib/graphlib.js").Graph);

module.exports = layout;

function layout(g, opts) {
  var time = opts && opts.debugTiming ? util.time : util.notime;
  time("layout", function() {
    var layoutGraph = 
      time("  buildLayoutGraph", function() { return buildLayoutGraph(g); });
    time("  runLayout",        function() { runLayout(layoutGraph, time); });
    time("  updateInputGraph", function() { updateInputGraph(g, layoutGraph); });
  });
}

function runLayout(g, time) {
  time("    makeSpaceForEdgeLabels", function() { makeSpaceForEdgeLabels(g); });
  time("    removeSelfEdges",        function() { removeSelfEdges(g); });
  time("    acyclic",                function() { acyclic.run(g); });
  time("    nestingGraph.run",       function() { nestingGraph.run(g); });
  time("    rank",                   function() { rank(util.asNonCompoundGraph(g)); });
  time("    injectEdgeLabelProxies", function() { injectEdgeLabelProxies(g); });
  time("    removeEmptyRanks",       function() { removeEmptyRanks(g); });
  time("    nestingGraph.cleanup",   function() { nestingGraph.cleanup(g); });
  time("    normalizeRanks",         function() { normalizeRanks(g); });
  time("    assignRankMinMax",       function() { assignRankMinMax(g); });
  time("    removeEdgeLabelProxies", function() { removeEdgeLabelProxies(g); });
  time("    normalize.run",          function() { normalize.run(g); });
  time("    parentDummyChains",      function() { parentDummyChains(g); });
  time("    addBorderSegments",      function() { addBorderSegments(g); });
  time("    order",                  function() { order(g); });
  time("    insertSelfEdges",        function() { insertSelfEdges(g); });
  time("    adjustCoordinateSystem", function() { coordinateSystem.adjust(g); });
  time("    position",               function() { position(g); });
  time("    positionSelfEdges",      function() { positionSelfEdges(g); });
  time("    removeBorderNodes",      function() { removeBorderNodes(g); });
  time("    normalize.undo",         function() { normalize.undo(g); });
  time("    fixupEdgeLabelCoords",   function() { fixupEdgeLabelCoords(g); });
  time("    undoCoordinateSystem",   function() { coordinateSystem.undo(g); });
  time("    translateGraph",         function() { translateGraph(g); });
  time("    assignNodeIntersects",   function() { assignNodeIntersects(g); });
  time("    reversePoints",          function() { reversePointsForReversedEdges(g); });
  time("    acyclic.undo",           function() { acyclic.undo(g); });
}

/*
 * Copies final layout information from the layout graph back to the input
 * graph. This process only copies whitelisted attributes from the layout graph
 * to the input graph, so it serves as a good place to determine what
 * attributes can influence layout.
 */
function updateInputGraph(inputGraph, layoutGraph) {
  _.forEach(inputGraph.nodes(), function(v) {
    var inputLabel = inputGraph.node(v);
    var layoutLabel = layoutGraph.node(v);

    if (inputLabel) {
      inputLabel.x = layoutLabel.x;
      inputLabel.y = layoutLabel.y;

      if (layoutGraph.children(v).length) {
        inputLabel.width = layoutLabel.width;
        inputLabel.height = layoutLabel.height;
      }
    }
  });

  _.forEach(inputGraph.edges(), function(e) {
    var inputLabel = inputGraph.edge(e);
    var layoutLabel = layoutGraph.edge(e);

    inputLabel.points = layoutLabel.points;
    if (_.has(layoutLabel, "x")) {
      inputLabel.x = layoutLabel.x;
      inputLabel.y = layoutLabel.y;
    }
  });

  inputGraph.graph().width = layoutGraph.graph().width;
  inputGraph.graph().height = layoutGraph.graph().height;
}

var graphNumAttrs = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"];
var graphDefaults = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" };
var graphAttrs = ["acyclicer", "ranker", "rankdir", "align"];
var nodeNumAttrs = ["width", "height"];
var nodeDefaults = { width: 0, height: 0 };
var edgeNumAttrs = ["minlen", "weight", "width", "height", "labeloffset"];
var edgeDefaults = {
  minlen: 1, weight: 1, width: 0, height: 0,
  labeloffset: 10, labelpos: "r"
};
var edgeAttrs = ["labelpos"];

/*
 * Constructs a new graph from the input graph, which can be used for layout.
 * This process copies only whitelisted attributes from the input graph to the
 * layout graph. Thus this function serves as a good place to determine what
 * attributes can influence layout.
 */
function buildLayoutGraph(inputGraph) {
  var g = new Graph({ multigraph: true, compound: true });
  var graph = canonicalize(inputGraph.graph());

  g.setGraph(_.merge({},
    graphDefaults,
    selectNumberAttrs(graph, graphNumAttrs),
    _.pick(graph, graphAttrs)));

  _.forEach(inputGraph.nodes(), function(v) {
    var node = canonicalize(inputGraph.node(v));
    g.setNode(v, _.defaults(selectNumberAttrs(node, nodeNumAttrs), nodeDefaults));
    g.setParent(v, inputGraph.parent(v));
  });

  _.forEach(inputGraph.edges(), function(e) {
    var edge = canonicalize(inputGraph.edge(e));
    g.setEdge(e, _.merge({},
      edgeDefaults,
      selectNumberAttrs(edge, edgeNumAttrs),
      _.pick(edge, edgeAttrs)));
  });

  return g;
}

/*
 * This idea comes from the Gansner paper: to account for edge labels in our
 * layout we split each rank in half by doubling minlen and halving ranksep.
 * Then we can place labels at these mid-points between nodes.
 *
 * We also add some minimal padding to the width to push the label for the edge
 * away from the edge itself a bit.
 */
function makeSpaceForEdgeLabels(g) {
  var graph = g.graph();
  graph.ranksep /= 2;
  _.forEach(g.edges(), function(e) {
    var edge = g.edge(e);
    edge.minlen *= 2;
    if (edge.labelpos.toLowerCase() !== "c") {
      if (graph.rankdir === "TB" || graph.rankdir === "BT") {
        edge.width += edge.labeloffset;
      } else {
        edge.height += edge.labeloffset;
      }
    }
  });
}

/*
 * Creates temporary dummy nodes that capture the rank in which each edge's
 * label is going to, if it has one of non-zero width and height. We do this
 * so that we can safely remove empty ranks while preserving balance for the
 * label's position.
 */
function injectEdgeLabelProxies(g) {
  _.forEach(g.edges(), function(e) {
    var edge = g.edge(e);
    if (edge.width && edge.height) {
      var v = g.node(e.v);
      var w = g.node(e.w);
      var label = { rank: (w.rank - v.rank) / 2 + v.rank, e: e };
      util.addDummyNode(g, "edge-proxy", label, "_ep");
    }
  });
}

function assignRankMinMax(g) {
  var maxRank = 0;
  _.forEach(g.nodes(), function(v) {
    var node = g.node(v);
    if (node.borderTop) {
      node.minRank = g.node(node.borderTop).rank;
      node.maxRank = g.node(node.borderBottom).rank;
      maxRank = _.max(maxRank, node.maxRank);
    }
  });
  g.graph().maxRank = maxRank;
}

function removeEdgeLabelProxies(g) {
  _.forEach(g.nodes(), function(v) {
    var node = g.node(v);
    if (node.dummy === "edge-proxy") {
      g.edge(node.e).labelRank = node.rank;
      g.removeNode(v);
    }
  });
}

function translateGraph(g) {
  var minX = Number.POSITIVE_INFINITY;
  var maxX = 0;
  var minY = Number.POSITIVE_INFINITY;
  var maxY = 0;
  var graphLabel = g.graph();
  var marginX = graphLabel.marginx || 0;
  var marginY = graphLabel.marginy || 0;

  function getExtremes(attrs) {
    var x = attrs.x;
    var y = attrs.y;
    var w = attrs.width;
    var h = attrs.height;
    minX = Math.min(minX, x - w / 2);
    maxX = Math.max(maxX, x + w / 2);
    minY = Math.min(minY, y - h / 2);
    maxY = Math.max(maxY, y + h / 2);
  }

  _.forEach(g.nodes(), function(v) { getExtremes(g.node(v)); });
  _.forEach(g.edges(), function(e) {
    var edge = g.edge(e);
    if (_.has(edge, "x")) {
      getExtremes(edge);
    }
  });

  minX -= marginX;
  minY -= marginY;

  _.forEach(g.nodes(), function(v) {
    var node = g.node(v);
    node.x -= minX;
    node.y -= minY;
  });

  _.forEach(g.edges(), function(e) {
    var edge = g.edge(e);
    _.forEach(edge.points, function(p) {
      p.x -= minX;
      p.y -= minY;
    });
    if (_.has(edge, "x")) { edge.x -= minX; }
    if (_.has(edge, "y")) { edge.y -= minY; }
  });

  graphLabel.width = maxX - minX + marginX;
  graphLabel.height = maxY - minY + marginY;
}

function assignNodeIntersects(g) {
  _.forEach(g.edges(), function(e) {
    var edge = g.edge(e);
    var nodeV = g.node(e.v);
    var nodeW = g.node(e.w);
    var p1, p2;
    if (!edge.points) {
      edge.points = [];
      p1 = nodeW;
      p2 = nodeV;
    } else {
      p1 = edge.points[0];
      p2 = edge.points[edge.points.length - 1];
    }
    edge.points.unshift(util.intersectRect(nodeV, p1));
    edge.points.push(util.intersectRect(nodeW, p2));
  });
}

function fixupEdgeLabelCoords(g) {
  _.forEach(g.edges(), function(e) {
    var edge = g.edge(e);
    if (_.has(edge, "x")) {
      if (edge.labelpos === "l" || edge.labelpos === "r") {
        edge.width -= edge.labeloffset;
      }
      switch (edge.labelpos) {
      case "l": edge.x -= edge.width / 2 + edge.labeloffset; break;
      case "r": edge.x += edge.width / 2 + edge.labeloffset; break;
      }
    }
  });
}

function reversePointsForReversedEdges(g) {
  _.forEach(g.edges(), function(e) {
    var edge = g.edge(e);
    if (edge.reversed) {
      edge.points.reverse();
    }
  });
}

function removeBorderNodes(g) {
  _.forEach(g.nodes(), function(v) {
    if (g.children(v).length) {
      var node = g.node(v);
      var t = g.node(node.borderTop);
      var b = g.node(node.borderBottom);
      var l = g.node(_.last(node.borderLeft));
      var r = g.node(_.last(node.borderRight));

      node.width = Math.abs(r.x - l.x);
      node.height = Math.abs(b.y - t.y);
      node.x = l.x + node.width / 2;
      node.y = t.y + node.height / 2;
    }
  });

  _.forEach(g.nodes(), function(v) {
    if (g.node(v).dummy === "border") {
      g.removeNode(v);
    }
  });
}

function removeSelfEdges(g) {
  _.forEach(g.edges(), function(e) {
    if (e.v === e.w) {
      var node = g.node(e.v);
      if (!node.selfEdges) {
        node.selfEdges = [];
      }
      node.selfEdges.push({ e: e, label: g.edge(e) });
      g.removeEdge(e);
    }
  });
}

function insertSelfEdges(g) {
  var layers = util.buildLayerMatrix(g);
  _.forEach(layers, function(layer) {
    var orderShift = 0;
    _.forEach(layer, function(v, i) {
      var node = g.node(v);
      node.order = i + orderShift;
      _.forEach(node.selfEdges, function(selfEdge) {
        util.addDummyNode(g, "selfedge", {
          width: selfEdge.label.width,
          height: selfEdge.label.height,
          rank: node.rank,
          order: i + (++orderShift),
          e: selfEdge.e,
          label: selfEdge.label
        }, "_se");
      });
      delete node.selfEdges;
    });
  });
}

function positionSelfEdges(g) {
  _.forEach(g.nodes(), function(v) {
    var node = g.node(v);
    if (node.dummy === "selfedge") {
      var selfNode = g.node(node.e.v);
      var x = selfNode.x + selfNode.width / 2;
      var y = selfNode.y;
      var dx = node.x - x;
      var dy = selfNode.height / 2;
      g.setEdge(node.e, node.label);
      g.removeNode(v);
      node.label.points = [
        { x: x + 2 * dx / 3, y: y - dy },
        { x: x + 5 * dx / 6, y: y - dy },
        { x: x +     dx    , y: y },
        { x: x + 5 * dx / 6, y: y + dy },
        { x: x + 2 * dx / 3, y: y + dy }
      ];
      node.label.x = node.x;
      node.label.y = node.y;
    }
  });
}

function selectNumberAttrs(obj, attrs) {
  return _.mapValues(_.pick(obj, attrs), Number);
}

function canonicalize(attrs) {
  var newAttrs = {};
  _.forEach(attrs, function(v, k) {
    newAttrs[k.toLowerCase()] = v;
  });
  return newAttrs;
}


/***/ }),

/***/ "./node_modules/dagre/lib/lodash.js":
/*!******************************************!*\
  !*** ./node_modules/dagre/lib/lodash.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* global window */

var lodash;

if (true) {
  try {
    lodash = {
      cloneDeep: __webpack_require__(/*! lodash/cloneDeep */ "./node_modules/lodash/cloneDeep.js"),
      constant: __webpack_require__(/*! lodash/constant */ "./node_modules/lodash/constant.js"),
      defaults: __webpack_require__(/*! lodash/defaults */ "./node_modules/lodash/defaults.js"),
      each: __webpack_require__(/*! lodash/each */ "./node_modules/lodash/each.js"),
      filter: __webpack_require__(/*! lodash/filter */ "./node_modules/lodash/filter.js"),
      find: __webpack_require__(/*! lodash/find */ "./node_modules/lodash/find.js"),
      flatten: __webpack_require__(/*! lodash/flatten */ "./node_modules/lodash/flatten.js"),
      forEach: __webpack_require__(/*! lodash/forEach */ "./node_modules/lodash/forEach.js"),
      forIn: __webpack_require__(/*! lodash/forIn */ "./node_modules/lodash/forIn.js"),
      has:  __webpack_require__(/*! lodash/has */ "./node_modules/lodash/has.js"),
      isUndefined: __webpack_require__(/*! lodash/isUndefined */ "./node_modules/lodash/isUndefined.js"),
      last: __webpack_require__(/*! lodash/last */ "./node_modules/lodash/last.js"),
      map: __webpack_require__(/*! lodash/map */ "./node_modules/lodash/map.js"),
      mapValues: __webpack_require__(/*! lodash/mapValues */ "./node_modules/lodash/mapValues.js"),
      max: __webpack_require__(/*! lodash/max */ "./node_modules/lodash/max.js"),
      merge: __webpack_require__(/*! lodash/merge */ "./node_modules/lodash/merge.js"),
      min: __webpack_require__(/*! lodash/min */ "./node_modules/lodash/min.js"),
      minBy: __webpack_require__(/*! lodash/minBy */ "./node_modules/lodash/minBy.js"),
      now: __webpack_require__(/*! lodash/now */ "./node_modules/lodash/now.js"),
      pick: __webpack_require__(/*! lodash/pick */ "./node_modules/lodash/pick.js"),
      range: __webpack_require__(/*! lodash/range */ "./node_modules/lodash/range.js"),
      reduce: __webpack_require__(/*! lodash/reduce */ "./node_modules/lodash/reduce.js"),
      sortBy: __webpack_require__(/*! lodash/sortBy */ "./node_modules/lodash/sortBy.js"),
      uniqueId: __webpack_require__(/*! lodash/uniqueId */ "./node_modules/lodash/uniqueId.js"),
      values: __webpack_require__(/*! lodash/values */ "./node_modules/lodash/values.js"),
      zipObject: __webpack_require__(/*! lodash/zipObject */ "./node_modules/lodash/zipObject.js"),
    };
  } catch (e) {
    // continue regardless of error
  }
}

if (!lodash) {
  lodash = window._;
}

module.exports = lodash;


/***/ }),

/***/ "./node_modules/dagre/lib/nesting-graph.js":
/*!*************************************************!*\
  !*** ./node_modules/dagre/lib/nesting-graph.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./lodash */ "./node_modules/dagre/lib/lodash.js");
var util = __webpack_require__(/*! ./util */ "./node_modules/dagre/lib/util.js");

module.exports = {
  run: run,
  cleanup: cleanup
};

/*
 * A nesting graph creates dummy nodes for the tops and bottoms of subgraphs,
 * adds appropriate edges to ensure that all cluster nodes are placed between
 * these boundries, and ensures that the graph is connected.
 *
 * In addition we ensure, through the use of the minlen property, that nodes
 * and subgraph border nodes to not end up on the same rank.
 *
 * Preconditions:
 *
 *    1. Input graph is a DAG
 *    2. Nodes in the input graph has a minlen attribute
 *
 * Postconditions:
 *
 *    1. Input graph is connected.
 *    2. Dummy nodes are added for the tops and bottoms of subgraphs.
 *    3. The minlen attribute for nodes is adjusted to ensure nodes do not
 *       get placed on the same rank as subgraph border nodes.
 *
 * The nesting graph idea comes from Sander, "Layout of Compound Directed
 * Graphs."
 */
function run(g) {
  var root = util.addDummyNode(g, "root", {}, "_root");
  var depths = treeDepths(g);
  var height = _.max(_.values(depths)) - 1; // Note: depths is an Object not an array
  var nodeSep = 2 * height + 1;

  g.graph().nestingRoot = root;

  // Multiply minlen by nodeSep to align nodes on non-border ranks.
  _.forEach(g.edges(), function(e) { g.edge(e).minlen *= nodeSep; });

  // Calculate a weight that is sufficient to keep subgraphs vertically compact
  var weight = sumWeights(g) + 1;

  // Create border nodes and link them up
  _.forEach(g.children(), function(child) {
    dfs(g, root, nodeSep, weight, height, depths, child);
  });

  // Save the multiplier for node layers for later removal of empty border
  // layers.
  g.graph().nodeRankFactor = nodeSep;
}

function dfs(g, root, nodeSep, weight, height, depths, v) {
  var children = g.children(v);
  if (!children.length) {
    if (v !== root) {
      g.setEdge(root, v, { weight: 0, minlen: nodeSep });
    }
    return;
  }

  var top = util.addBorderNode(g, "_bt");
  var bottom = util.addBorderNode(g, "_bb");
  var label = g.node(v);

  g.setParent(top, v);
  label.borderTop = top;
  g.setParent(bottom, v);
  label.borderBottom = bottom;

  _.forEach(children, function(child) {
    dfs(g, root, nodeSep, weight, height, depths, child);

    var childNode = g.node(child);
    var childTop = childNode.borderTop ? childNode.borderTop : child;
    var childBottom = childNode.borderBottom ? childNode.borderBottom : child;
    var thisWeight = childNode.borderTop ? weight : 2 * weight;
    var minlen = childTop !== childBottom ? 1 : height - depths[v] + 1;

    g.setEdge(top, childTop, {
      weight: thisWeight,
      minlen: minlen,
      nestingEdge: true
    });

    g.setEdge(childBottom, bottom, {
      weight: thisWeight,
      minlen: minlen,
      nestingEdge: true
    });
  });

  if (!g.parent(v)) {
    g.setEdge(root, top, { weight: 0, minlen: height + depths[v] });
  }
}

function treeDepths(g) {
  var depths = {};
  function dfs(v, depth) {
    var children = g.children(v);
    if (children && children.length) {
      _.forEach(children, function(child) {
        dfs(child, depth + 1);
      });
    }
    depths[v] = depth;
  }
  _.forEach(g.children(), function(v) { dfs(v, 1); });
  return depths;
}

function sumWeights(g) {
  return _.reduce(g.edges(), function(acc, e) {
    return acc + g.edge(e).weight;
  }, 0);
}

function cleanup(g) {
  var graphLabel = g.graph();
  g.removeNode(graphLabel.nestingRoot);
  delete graphLabel.nestingRoot;
  _.forEach(g.edges(), function(e) {
    var edge = g.edge(e);
    if (edge.nestingEdge) {
      g.removeEdge(e);
    }
  });
}


/***/ }),

/***/ "./node_modules/dagre/lib/normalize.js":
/*!*********************************************!*\
  !*** ./node_modules/dagre/lib/normalize.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ./lodash */ "./node_modules/dagre/lib/lodash.js");
var util = __webpack_require__(/*! ./util */ "./node_modules/dagre/lib/util.js");

module.exports = {
  run: run,
  undo: undo
};

/*
 * Breaks any long edges in the graph into short segments that span 1 layer
 * each. This operation is undoable with the denormalize function.
 *
 * Pre-conditions:
 *
 *    1. The input graph is a DAG.
 *    2. Each node in the graph has a "rank" property.
 *
 * Post-condition:
 *
 *    1. All edges in the graph have a length of 1.
 *    2. Dummy nodes are added where edges have been split into segments.
 *    3. The graph is augmented with a "dummyChains" attribute which contains
 *       the first dummy in each chain of dummy nodes produced.
 */
function run(g) {
  g.graph().dummyChains = [];
  _.forEach(g.edges(), function(edge) { normalizeEdge(g, edge); });
}

function normalizeEdge(g, e) {
  var v = e.v;
  var vRank = g.node(v).rank;
  var w = e.w;
  var wRank = g.node(w).rank;
  var name = e.name;
  var edgeLabel = g.edge(e);
  var labelRank = edgeLabel.labelRank;

  if (wRank === vRank + 1) return;

  g.removeEdge(e);

  var dummy, attrs, i;
  for (i = 0, ++vRank; vRank < wRank; ++i, ++vRank) {
    edgeLabel.points = [];
    attrs = {
      width: 0, height: 0,
      edgeLabel: edgeLabel, edgeObj: e,
      rank: vRank
    };
    dummy = util.addDummyNode(g, "edge", attrs, "_d");
    if (vRank === labelRank) {
      attrs.width = edgeLabel.width;
      attrs.height = edgeLabel.height;
      attrs.dummy = "edge-label";
      attrs.labelpos = edgeLabel.labelpos;
    }
    g.setEdge(v, dummy, { weight: edgeLabel.weight }, name);
    if (i === 0) {
      g.graph().dummyChains.push(dummy);
    }
    v = dummy;
  }

  g.setEdge(v, w, { weight: edgeLabel.weight }, name);
}

function undo(g) {
  _.forEach(g.graph().dummyChains, function(v) {
    var node = g.node(v);
    var origLabel = node.edgeLabel;
    var w;
    g.setEdge(node.edgeObj, origLabel);
    while (node.dummy) {
      w = g.successors(v)[0];
      g.removeNode(v);
      origLabel.points.push({ x: node.x, y: node.y });
      if (node.dummy === "edge-label") {
        origLabel.x = node.x;
        origLabel.y = node.y;
        origLabel.width = node.width;
        origLabel.height = node.height;
      }
      v = w;
      node = g.node(v);
    }
  });
}


/***/ }),

/***/ "./node_modules/dagre/lib/order/add-subgraph-constraints.js":
/*!******************************************************************!*\
  !*** ./node_modules/dagre/lib/order/add-subgraph-constraints.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");

module.exports = addSubgraphConstraints;

function addSubgraphConstraints(g, cg, vs) {
  var prev = {},
    rootPrev;

  _.forEach(vs, function(v) {
    var child = g.parent(v),
      parent,
      prevChild;
    while (child) {
      parent = g.parent(child);
      if (parent) {
        prevChild = prev[parent];
        prev[parent] = child;
      } else {
        prevChild = rootPrev;
        rootPrev = child;
      }
      if (prevChild && prevChild !== child) {
        cg.setEdge(prevChild, child);
        return;
      }
      child = parent;
    }
  });

  /*
  function dfs(v) {
    var children = v ? g.children(v) : g.children();
    if (children.length) {
      var min = Number.POSITIVE_INFINITY,
          subgraphs = [];
      _.each(children, function(child) {
        var childMin = dfs(child);
        if (g.children(child).length) {
          subgraphs.push({ v: child, order: childMin });
        }
        min = Math.min(min, childMin);
      });
      _.reduce(_.sortBy(subgraphs, "order"), function(prev, curr) {
        cg.setEdge(prev.v, curr.v);
        return curr;
      });
      return min;
    }
    return g.node(v).order;
  }
  dfs(undefined);
  */
}


/***/ }),

/***/ "./node_modules/dagre/lib/order/barycenter.js":
/*!****************************************************!*\
  !*** ./node_modules/dagre/lib/order/barycenter.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");

module.exports = barycenter;

function barycenter(g, movable) {
  return _.map(movable, function(v) {
    var inV = g.inEdges(v);
    if (!inV.length) {
      return { v: v };
    } else {
      var result = _.reduce(inV, function(acc, e) {
        var edge = g.edge(e),
          nodeU = g.node(e.v);
        return {
          sum: acc.sum + (edge.weight * nodeU.order),
          weight: acc.weight + edge.weight
        };
      }, { sum: 0, weight: 0 });

      return {
        v: v,
        barycenter: result.sum / result.weight,
        weight: result.weight
      };
    }
  });
}



/***/ }),

/***/ "./node_modules/dagre/lib/order/build-layer-graph.js":
/*!***********************************************************!*\
  !*** ./node_modules/dagre/lib/order/build-layer-graph.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");
var Graph = (__webpack_require__(/*! ../graphlib */ "./node_modules/dagre/lib/graphlib.js").Graph);

module.exports = buildLayerGraph;

/*
 * Constructs a graph that can be used to sort a layer of nodes. The graph will
 * contain all base and subgraph nodes from the request layer in their original
 * hierarchy and any edges that are incident on these nodes and are of the type
 * requested by the "relationship" parameter.
 *
 * Nodes from the requested rank that do not have parents are assigned a root
 * node in the output graph, which is set in the root graph attribute. This
 * makes it easy to walk the hierarchy of movable nodes during ordering.
 *
 * Pre-conditions:
 *
 *    1. Input graph is a DAG
 *    2. Base nodes in the input graph have a rank attribute
 *    3. Subgraph nodes in the input graph has minRank and maxRank attributes
 *    4. Edges have an assigned weight
 *
 * Post-conditions:
 *
 *    1. Output graph has all nodes in the movable rank with preserved
 *       hierarchy.
 *    2. Root nodes in the movable layer are made children of the node
 *       indicated by the root attribute of the graph.
 *    3. Non-movable nodes incident on movable nodes, selected by the
 *       relationship parameter, are included in the graph (without hierarchy).
 *    4. Edges incident on movable nodes, selected by the relationship
 *       parameter, are added to the output graph.
 *    5. The weights for copied edges are aggregated as need, since the output
 *       graph is not a multi-graph.
 */
function buildLayerGraph(g, rank, relationship) {
  var root = createRootNode(g),
    result = new Graph({ compound: true }).setGraph({ root: root })
      .setDefaultNodeLabel(function(v) { return g.node(v); });

  _.forEach(g.nodes(), function(v) {
    var node = g.node(v),
      parent = g.parent(v);

    if (node.rank === rank || node.minRank <= rank && rank <= node.maxRank) {
      result.setNode(v);
      result.setParent(v, parent || root);

      // This assumes we have only short edges!
      _.forEach(g[relationship](v), function(e) {
        var u = e.v === v ? e.w : e.v,
          edge = result.edge(u, v),
          weight = !_.isUndefined(edge) ? edge.weight : 0;
        result.setEdge(u, v, { weight: g.edge(e).weight + weight });
      });

      if (_.has(node, "minRank")) {
        result.setNode(v, {
          borderLeft: node.borderLeft[rank],
          borderRight: node.borderRight[rank]
        });
      }
    }
  });

  return result;
}

function createRootNode(g) {
  var v;
  while (g.hasNode((v = _.uniqueId("_root"))));
  return v;
}


/***/ }),

/***/ "./node_modules/dagre/lib/order/cross-count.js":
/*!*****************************************************!*\
  !*** ./node_modules/dagre/lib/order/cross-count.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");

module.exports = crossCount;

/*
 * A function that takes a layering (an array of layers, each with an array of
 * ordererd nodes) and a graph and returns a weighted crossing count.
 *
 * Pre-conditions:
 *
 *    1. Input graph must be simple (not a multigraph), directed, and include
 *       only simple edges.
 *    2. Edges in the input graph must have assigned weights.
 *
 * Post-conditions:
 *
 *    1. The graph and layering matrix are left unchanged.
 *
 * This algorithm is derived from Barth, et al., "Bilayer Cross Counting."
 */
function crossCount(g, layering) {
  var cc = 0;
  for (var i = 1; i < layering.length; ++i) {
    cc += twoLayerCrossCount(g, layering[i-1], layering[i]);
  }
  return cc;
}

function twoLayerCrossCount(g, northLayer, southLayer) {
  // Sort all of the edges between the north and south layers by their position
  // in the north layer and then the south. Map these edges to the position of
  // their head in the south layer.
  var southPos = _.zipObject(southLayer,
    _.map(southLayer, function (v, i) { return i; }));
  var southEntries = _.flatten(_.map(northLayer, function(v) {
    return _.sortBy(_.map(g.outEdges(v), function(e) {
      return { pos: southPos[e.w], weight: g.edge(e).weight };
    }), "pos");
  }), true);

  // Build the accumulator tree
  var firstIndex = 1;
  while (firstIndex < southLayer.length) firstIndex <<= 1;
  var treeSize = 2 * firstIndex - 1;
  firstIndex -= 1;
  var tree = _.map(new Array(treeSize), function() { return 0; });

  // Calculate the weighted crossings
  var cc = 0;
  _.forEach(southEntries.forEach(function(entry) {
    var index = entry.pos + firstIndex;
    tree[index] += entry.weight;
    var weightSum = 0;
    while (index > 0) {
      if (index % 2) {
        weightSum += tree[index + 1];
      }
      index = (index - 1) >> 1;
      tree[index] += entry.weight;
    }
    cc += entry.weight * weightSum;
  }));

  return cc;
}


/***/ }),

/***/ "./node_modules/dagre/lib/order/index.js":
/*!***********************************************!*\
  !*** ./node_modules/dagre/lib/order/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");
var initOrder = __webpack_require__(/*! ./init-order */ "./node_modules/dagre/lib/order/init-order.js");
var crossCount = __webpack_require__(/*! ./cross-count */ "./node_modules/dagre/lib/order/cross-count.js");
var sortSubgraph = __webpack_require__(/*! ./sort-subgraph */ "./node_modules/dagre/lib/order/sort-subgraph.js");
var buildLayerGraph = __webpack_require__(/*! ./build-layer-graph */ "./node_modules/dagre/lib/order/build-layer-graph.js");
var addSubgraphConstraints = __webpack_require__(/*! ./add-subgraph-constraints */ "./node_modules/dagre/lib/order/add-subgraph-constraints.js");
var Graph = (__webpack_require__(/*! ../graphlib */ "./node_modules/dagre/lib/graphlib.js").Graph);
var util = __webpack_require__(/*! ../util */ "./node_modules/dagre/lib/util.js");

module.exports = order;

/*
 * Applies heuristics to minimize edge crossings in the graph and sets the best
 * order solution as an order attribute on each node.
 *
 * Pre-conditions:
 *
 *    1. Graph must be DAG
 *    2. Graph nodes must be objects with a "rank" attribute
 *    3. Graph edges must have the "weight" attribute
 *
 * Post-conditions:
 *
 *    1. Graph nodes will have an "order" attribute based on the results of the
 *       algorithm.
 */
function order(g) {
  var maxRank = util.maxRank(g),
    downLayerGraphs = buildLayerGraphs(g, _.range(1, maxRank + 1), "inEdges"),
    upLayerGraphs = buildLayerGraphs(g, _.range(maxRank - 1, -1, -1), "outEdges");

  var layering = initOrder(g);
  assignOrder(g, layering);

  var bestCC = Number.POSITIVE_INFINITY,
    best;

  for (var i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
    sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2);

    layering = util.buildLayerMatrix(g);
    var cc = crossCount(g, layering);
    if (cc < bestCC) {
      lastBest = 0;
      best = _.cloneDeep(layering);
      bestCC = cc;
    }
  }

  assignOrder(g, best);
}

function buildLayerGraphs(g, ranks, relationship) {
  return _.map(ranks, function(rank) {
    return buildLayerGraph(g, rank, relationship);
  });
}

function sweepLayerGraphs(layerGraphs, biasRight) {
  var cg = new Graph();
  _.forEach(layerGraphs, function(lg) {
    var root = lg.graph().root;
    var sorted = sortSubgraph(lg, root, cg, biasRight);
    _.forEach(sorted.vs, function(v, i) {
      lg.node(v).order = i;
    });
    addSubgraphConstraints(lg, cg, sorted.vs);
  });
}

function assignOrder(g, layering) {
  _.forEach(layering, function(layer) {
    _.forEach(layer, function(v, i) {
      g.node(v).order = i;
    });
  });
}


/***/ }),

/***/ "./node_modules/dagre/lib/order/init-order.js":
/*!****************************************************!*\
  !*** ./node_modules/dagre/lib/order/init-order.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");

module.exports = initOrder;

/*
 * Assigns an initial order value for each node by performing a DFS search
 * starting from nodes in the first rank. Nodes are assigned an order in their
 * rank as they are first visited.
 *
 * This approach comes from Gansner, et al., "A Technique for Drawing Directed
 * Graphs."
 *
 * Returns a layering matrix with an array per layer and each layer sorted by
 * the order of its nodes.
 */
function initOrder(g) {
  var visited = {};
  var simpleNodes = _.filter(g.nodes(), function(v) {
    return !g.children(v).length;
  });
  var maxRank = _.max(_.map(simpleNodes, function(v) { return g.node(v).rank; }));
  var layers = _.map(_.range(maxRank + 1), function() { return []; });

  function dfs(v) {
    if (_.has(visited, v)) return;
    visited[v] = true;
    var node = g.node(v);
    layers[node.rank].push(v);
    _.forEach(g.successors(v), dfs);
  }

  var orderedVs = _.sortBy(simpleNodes, function(v) { return g.node(v).rank; });
  _.forEach(orderedVs, dfs);

  return layers;
}


/***/ }),

/***/ "./node_modules/dagre/lib/order/resolve-conflicts.js":
/*!***********************************************************!*\
  !*** ./node_modules/dagre/lib/order/resolve-conflicts.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");

module.exports = resolveConflicts;

/*
 * Given a list of entries of the form {v, barycenter, weight} and a
 * constraint graph this function will resolve any conflicts between the
 * constraint graph and the barycenters for the entries. If the barycenters for
 * an entry would violate a constraint in the constraint graph then we coalesce
 * the nodes in the conflict into a new node that respects the contraint and
 * aggregates barycenter and weight information.
 *
 * This implementation is based on the description in Forster, "A Fast and
 * Simple Hueristic for Constrained Two-Level Crossing Reduction," thought it
 * differs in some specific details.
 *
 * Pre-conditions:
 *
 *    1. Each entry has the form {v, barycenter, weight}, or if the node has
 *       no barycenter, then {v}.
 *
 * Returns:
 *
 *    A new list of entries of the form {vs, i, barycenter, weight}. The list
 *    `vs` may either be a singleton or it may be an aggregation of nodes
 *    ordered such that they do not violate constraints from the constraint
 *    graph. The property `i` is the lowest original index of any of the
 *    elements in `vs`.
 */
function resolveConflicts(entries, cg) {
  var mappedEntries = {};
  _.forEach(entries, function(entry, i) {
    var tmp = mappedEntries[entry.v] = {
      indegree: 0,
      "in": [],
      out: [],
      vs: [entry.v],
      i: i
    };
    if (!_.isUndefined(entry.barycenter)) {
      tmp.barycenter = entry.barycenter;
      tmp.weight = entry.weight;
    }
  });

  _.forEach(cg.edges(), function(e) {
    var entryV = mappedEntries[e.v];
    var entryW = mappedEntries[e.w];
    if (!_.isUndefined(entryV) && !_.isUndefined(entryW)) {
      entryW.indegree++;
      entryV.out.push(mappedEntries[e.w]);
    }
  });

  var sourceSet = _.filter(mappedEntries, function(entry) {
    return !entry.indegree;
  });

  return doResolveConflicts(sourceSet);
}

function doResolveConflicts(sourceSet) {
  var entries = [];

  function handleIn(vEntry) {
    return function(uEntry) {
      if (uEntry.merged) {
        return;
      }
      if (_.isUndefined(uEntry.barycenter) ||
          _.isUndefined(vEntry.barycenter) ||
          uEntry.barycenter >= vEntry.barycenter) {
        mergeEntries(vEntry, uEntry);
      }
    };
  }

  function handleOut(vEntry) {
    return function(wEntry) {
      wEntry["in"].push(vEntry);
      if (--wEntry.indegree === 0) {
        sourceSet.push(wEntry);
      }
    };
  }

  while (sourceSet.length) {
    var entry = sourceSet.pop();
    entries.push(entry);
    _.forEach(entry["in"].reverse(), handleIn(entry));
    _.forEach(entry.out, handleOut(entry));
  }

  return _.map(_.filter(entries, function(entry) { return !entry.merged; }),
    function(entry) {
      return _.pick(entry, ["vs", "i", "barycenter", "weight"]);
    });

}

function mergeEntries(target, source) {
  var sum = 0;
  var weight = 0;

  if (target.weight) {
    sum += target.barycenter * target.weight;
    weight += target.weight;
  }

  if (source.weight) {
    sum += source.barycenter * source.weight;
    weight += source.weight;
  }

  target.vs = source.vs.concat(target.vs);
  target.barycenter = sum / weight;
  target.weight = weight;
  target.i = Math.min(source.i, target.i);
  source.merged = true;
}


/***/ }),

/***/ "./node_modules/dagre/lib/order/sort-subgraph.js":
/*!*******************************************************!*\
  !*** ./node_modules/dagre/lib/order/sort-subgraph.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");
var barycenter = __webpack_require__(/*! ./barycenter */ "./node_modules/dagre/lib/order/barycenter.js");
var resolveConflicts = __webpack_require__(/*! ./resolve-conflicts */ "./node_modules/dagre/lib/order/resolve-conflicts.js");
var sort = __webpack_require__(/*! ./sort */ "./node_modules/dagre/lib/order/sort.js");

module.exports = sortSubgraph;

function sortSubgraph(g, v, cg, biasRight) {
  var movable = g.children(v);
  var node = g.node(v);
  var bl = node ? node.borderLeft : undefined;
  var br = node ? node.borderRight: undefined;
  var subgraphs = {};

  if (bl) {
    movable = _.filter(movable, function(w) {
      return w !== bl && w !== br;
    });
  }

  var barycenters = barycenter(g, movable);
  _.forEach(barycenters, function(entry) {
    if (g.children(entry.v).length) {
      var subgraphResult = sortSubgraph(g, entry.v, cg, biasRight);
      subgraphs[entry.v] = subgraphResult;
      if (_.has(subgraphResult, "barycenter")) {
        mergeBarycenters(entry, subgraphResult);
      }
    }
  });

  var entries = resolveConflicts(barycenters, cg);
  expandSubgraphs(entries, subgraphs);

  var result = sort(entries, biasRight);

  if (bl) {
    result.vs = _.flatten([bl, result.vs, br], true);
    if (g.predecessors(bl).length) {
      var blPred = g.node(g.predecessors(bl)[0]),
        brPred = g.node(g.predecessors(br)[0]);
      if (!_.has(result, "barycenter")) {
        result.barycenter = 0;
        result.weight = 0;
      }
      result.barycenter = (result.barycenter * result.weight +
                           blPred.order + brPred.order) / (result.weight + 2);
      result.weight += 2;
    }
  }

  return result;
}

function expandSubgraphs(entries, subgraphs) {
  _.forEach(entries, function(entry) {
    entry.vs = _.flatten(entry.vs.map(function(v) {
      if (subgraphs[v]) {
        return subgraphs[v].vs;
      }
      return v;
    }), true);
  });
}

function mergeBarycenters(target, other) {
  if (!_.isUndefined(target.barycenter)) {
    target.barycenter = (target.barycenter * target.weight +
                         other.barycenter * other.weight) /
                        (target.weight + other.weight);
    target.weight += other.weight;
  } else {
    target.barycenter = other.barycenter;
    target.weight = other.weight;
  }
}


/***/ }),

/***/ "./node_modules/dagre/lib/order/sort.js":
/*!**********************************************!*\
  !*** ./node_modules/dagre/lib/order/sort.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");
var util = __webpack_require__(/*! ../util */ "./node_modules/dagre/lib/util.js");

module.exports = sort;

function sort(entries, biasRight) {
  var parts = util.partition(entries, function(entry) {
    return _.has(entry, "barycenter");
  });
  var sortable = parts.lhs,
    unsortable = _.sortBy(parts.rhs, function(entry) { return -entry.i; }),
    vs = [],
    sum = 0,
    weight = 0,
    vsIndex = 0;

  sortable.sort(compareWithBias(!!biasRight));

  vsIndex = consumeUnsortable(vs, unsortable, vsIndex);

  _.forEach(sortable, function (entry) {
    vsIndex += entry.vs.length;
    vs.push(entry.vs);
    sum += entry.barycenter * entry.weight;
    weight += entry.weight;
    vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
  });

  var result = { vs: _.flatten(vs, true) };
  if (weight) {
    result.barycenter = sum / weight;
    result.weight = weight;
  }
  return result;
}

function consumeUnsortable(vs, unsortable, index) {
  var last;
  while (unsortable.length && (last = _.last(unsortable)).i <= index) {
    unsortable.pop();
    vs.push(last.vs);
    index++;
  }
  return index;
}

function compareWithBias(bias) {
  return function(entryV, entryW) {
    if (entryV.barycenter < entryW.barycenter) {
      return -1;
    } else if (entryV.barycenter > entryW.barycenter) {
      return 1;
    }

    return !bias ? entryV.i - entryW.i : entryW.i - entryV.i;
  };
}


/***/ }),

/***/ "./node_modules/dagre/lib/parent-dummy-chains.js":
/*!*******************************************************!*\
  !*** ./node_modules/dagre/lib/parent-dummy-chains.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./lodash */ "./node_modules/dagre/lib/lodash.js");

module.exports = parentDummyChains;

function parentDummyChains(g) {
  var postorderNums = postorder(g);

  _.forEach(g.graph().dummyChains, function(v) {
    var node = g.node(v);
    var edgeObj = node.edgeObj;
    var pathData = findPath(g, postorderNums, edgeObj.v, edgeObj.w);
    var path = pathData.path;
    var lca = pathData.lca;
    var pathIdx = 0;
    var pathV = path[pathIdx];
    var ascending = true;

    while (v !== edgeObj.w) {
      node = g.node(v);

      if (ascending) {
        while ((pathV = path[pathIdx]) !== lca &&
               g.node(pathV).maxRank < node.rank) {
          pathIdx++;
        }

        if (pathV === lca) {
          ascending = false;
        }
      }

      if (!ascending) {
        while (pathIdx < path.length - 1 &&
               g.node(pathV = path[pathIdx + 1]).minRank <= node.rank) {
          pathIdx++;
        }
        pathV = path[pathIdx];
      }

      g.setParent(v, pathV);
      v = g.successors(v)[0];
    }
  });
}

// Find a path from v to w through the lowest common ancestor (LCA). Return the
// full path and the LCA.
function findPath(g, postorderNums, v, w) {
  var vPath = [];
  var wPath = [];
  var low = Math.min(postorderNums[v].low, postorderNums[w].low);
  var lim = Math.max(postorderNums[v].lim, postorderNums[w].lim);
  var parent;
  var lca;

  // Traverse up from v to find the LCA
  parent = v;
  do {
    parent = g.parent(parent);
    vPath.push(parent);
  } while (parent &&
           (postorderNums[parent].low > low || lim > postorderNums[parent].lim));
  lca = parent;

  // Traverse from w to LCA
  parent = w;
  while ((parent = g.parent(parent)) !== lca) {
    wPath.push(parent);
  }

  return { path: vPath.concat(wPath.reverse()), lca: lca };
}

function postorder(g) {
  var result = {};
  var lim = 0;

  function dfs(v) {
    var low = lim;
    _.forEach(g.children(v), dfs);
    result[v] = { low: low, lim: lim++ };
  }
  _.forEach(g.children(), dfs);

  return result;
}


/***/ }),

/***/ "./node_modules/dagre/lib/position/bk.js":
/*!***********************************************!*\
  !*** ./node_modules/dagre/lib/position/bk.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");
var Graph = (__webpack_require__(/*! ../graphlib */ "./node_modules/dagre/lib/graphlib.js").Graph);
var util = __webpack_require__(/*! ../util */ "./node_modules/dagre/lib/util.js");

/*
 * This module provides coordinate assignment based on Brandes and Köpf, "Fast
 * and Simple Horizontal Coordinate Assignment."
 */

module.exports = {
  positionX: positionX,
  findType1Conflicts: findType1Conflicts,
  findType2Conflicts: findType2Conflicts,
  addConflict: addConflict,
  hasConflict: hasConflict,
  verticalAlignment: verticalAlignment,
  horizontalCompaction: horizontalCompaction,
  alignCoordinates: alignCoordinates,
  findSmallestWidthAlignment: findSmallestWidthAlignment,
  balance: balance
};

/*
 * Marks all edges in the graph with a type-1 conflict with the "type1Conflict"
 * property. A type-1 conflict is one where a non-inner segment crosses an
 * inner segment. An inner segment is an edge with both incident nodes marked
 * with the "dummy" property.
 *
 * This algorithm scans layer by layer, starting with the second, for type-1
 * conflicts between the current layer and the previous layer. For each layer
 * it scans the nodes from left to right until it reaches one that is incident
 * on an inner segment. It then scans predecessors to determine if they have
 * edges that cross that inner segment. At the end a final scan is done for all
 * nodes on the current rank to see if they cross the last visited inner
 * segment.
 *
 * This algorithm (safely) assumes that a dummy node will only be incident on a
 * single node in the layers being scanned.
 */
function findType1Conflicts(g, layering) {
  var conflicts = {};

  function visitLayer(prevLayer, layer) {
    var
      // last visited node in the previous layer that is incident on an inner
      // segment.
      k0 = 0,
      // Tracks the last node in this layer scanned for crossings with a type-1
      // segment.
      scanPos = 0,
      prevLayerLength = prevLayer.length,
      lastNode = _.last(layer);

    _.forEach(layer, function(v, i) {
      var w = findOtherInnerSegmentNode(g, v),
        k1 = w ? g.node(w).order : prevLayerLength;

      if (w || v === lastNode) {
        _.forEach(layer.slice(scanPos, i +1), function(scanNode) {
          _.forEach(g.predecessors(scanNode), function(u) {
            var uLabel = g.node(u),
              uPos = uLabel.order;
            if ((uPos < k0 || k1 < uPos) &&
                !(uLabel.dummy && g.node(scanNode).dummy)) {
              addConflict(conflicts, u, scanNode);
            }
          });
        });
        scanPos = i + 1;
        k0 = k1;
      }
    });

    return layer;
  }

  _.reduce(layering, visitLayer);
  return conflicts;
}

function findType2Conflicts(g, layering) {
  var conflicts = {};

  function scan(south, southPos, southEnd, prevNorthBorder, nextNorthBorder) {
    var v;
    _.forEach(_.range(southPos, southEnd), function(i) {
      v = south[i];
      if (g.node(v).dummy) {
        _.forEach(g.predecessors(v), function(u) {
          var uNode = g.node(u);
          if (uNode.dummy &&
              (uNode.order < prevNorthBorder || uNode.order > nextNorthBorder)) {
            addConflict(conflicts, u, v);
          }
        });
      }
    });
  }


  function visitLayer(north, south) {
    var prevNorthPos = -1,
      nextNorthPos,
      southPos = 0;

    _.forEach(south, function(v, southLookahead) {
      if (g.node(v).dummy === "border") {
        var predecessors = g.predecessors(v);
        if (predecessors.length) {
          nextNorthPos = g.node(predecessors[0]).order;
          scan(south, southPos, southLookahead, prevNorthPos, nextNorthPos);
          southPos = southLookahead;
          prevNorthPos = nextNorthPos;
        }
      }
      scan(south, southPos, south.length, nextNorthPos, north.length);
    });

    return south;
  }

  _.reduce(layering, visitLayer);
  return conflicts;
}

function findOtherInnerSegmentNode(g, v) {
  if (g.node(v).dummy) {
    return _.find(g.predecessors(v), function(u) {
      return g.node(u).dummy;
    });
  }
}

function addConflict(conflicts, v, w) {
  if (v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }

  var conflictsV = conflicts[v];
  if (!conflictsV) {
    conflicts[v] = conflictsV = {};
  }
  conflictsV[w] = true;
}

function hasConflict(conflicts, v, w) {
  if (v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  return _.has(conflicts[v], w);
}

/*
 * Try to align nodes into vertical "blocks" where possible. This algorithm
 * attempts to align a node with one of its median neighbors. If the edge
 * connecting a neighbor is a type-1 conflict then we ignore that possibility.
 * If a previous node has already formed a block with a node after the node
 * we're trying to form a block with, we also ignore that possibility - our
 * blocks would be split in that scenario.
 */
function verticalAlignment(g, layering, conflicts, neighborFn) {
  var root = {},
    align = {},
    pos = {};

  // We cache the position here based on the layering because the graph and
  // layering may be out of sync. The layering matrix is manipulated to
  // generate different extreme alignments.
  _.forEach(layering, function(layer) {
    _.forEach(layer, function(v, order) {
      root[v] = v;
      align[v] = v;
      pos[v] = order;
    });
  });

  _.forEach(layering, function(layer) {
    var prevIdx = -1;
    _.forEach(layer, function(v) {
      var ws = neighborFn(v);
      if (ws.length) {
        ws = _.sortBy(ws, function(w) { return pos[w]; });
        var mp = (ws.length - 1) / 2;
        for (var i = Math.floor(mp), il = Math.ceil(mp); i <= il; ++i) {
          var w = ws[i];
          if (align[v] === v &&
              prevIdx < pos[w] &&
              !hasConflict(conflicts, v, w)) {
            align[w] = v;
            align[v] = root[v] = root[w];
            prevIdx = pos[w];
          }
        }
      }
    });
  });

  return { root: root, align: align };
}

function horizontalCompaction(g, layering, root, align, reverseSep) {
  // This portion of the algorithm differs from BK due to a number of problems.
  // Instead of their algorithm we construct a new block graph and do two
  // sweeps. The first sweep places blocks with the smallest possible
  // coordinates. The second sweep removes unused space by moving blocks to the
  // greatest coordinates without violating separation.
  var xs = {},
    blockG = buildBlockGraph(g, layering, root, reverseSep),
    borderType = reverseSep ? "borderLeft" : "borderRight";

  function iterate(setXsFunc, nextNodesFunc) {
    var stack = blockG.nodes();
    var elem = stack.pop();
    var visited = {};
    while (elem) {
      if (visited[elem]) {
        setXsFunc(elem);
      } else {
        visited[elem] = true;
        stack.push(elem);
        stack = stack.concat(nextNodesFunc(elem));
      }

      elem = stack.pop();
    }
  }

  // First pass, assign smallest coordinates
  function pass1(elem) {
    xs[elem] = blockG.inEdges(elem).reduce(function(acc, e) {
      return Math.max(acc, xs[e.v] + blockG.edge(e));
    }, 0);
  }

  // Second pass, assign greatest coordinates
  function pass2(elem) {
    var min = blockG.outEdges(elem).reduce(function(acc, e) {
      return Math.min(acc, xs[e.w] - blockG.edge(e));
    }, Number.POSITIVE_INFINITY);

    var node = g.node(elem);
    if (min !== Number.POSITIVE_INFINITY && node.borderType !== borderType) {
      xs[elem] = Math.max(xs[elem], min);
    }
  }

  iterate(pass1, blockG.predecessors.bind(blockG));
  iterate(pass2, blockG.successors.bind(blockG));

  // Assign x coordinates to all nodes
  _.forEach(align, function(v) {
    xs[v] = xs[root[v]];
  });

  return xs;
}


function buildBlockGraph(g, layering, root, reverseSep) {
  var blockGraph = new Graph(),
    graphLabel = g.graph(),
    sepFn = sep(graphLabel.nodesep, graphLabel.edgesep, reverseSep);

  _.forEach(layering, function(layer) {
    var u;
    _.forEach(layer, function(v) {
      var vRoot = root[v];
      blockGraph.setNode(vRoot);
      if (u) {
        var uRoot = root[u],
          prevMax = blockGraph.edge(uRoot, vRoot);
        blockGraph.setEdge(uRoot, vRoot, Math.max(sepFn(g, v, u), prevMax || 0));
      }
      u = v;
    });
  });

  return blockGraph;
}

/*
 * Returns the alignment that has the smallest width of the given alignments.
 */
function findSmallestWidthAlignment(g, xss) {
  return _.minBy(_.values(xss), function (xs) {
    var max = Number.NEGATIVE_INFINITY;
    var min = Number.POSITIVE_INFINITY;

    _.forIn(xs, function (x, v) {
      var halfWidth = width(g, v) / 2;

      max = Math.max(x + halfWidth, max);
      min = Math.min(x - halfWidth, min);
    });

    return max - min;
  });
}

/*
 * Align the coordinates of each of the layout alignments such that
 * left-biased alignments have their minimum coordinate at the same point as
 * the minimum coordinate of the smallest width alignment and right-biased
 * alignments have their maximum coordinate at the same point as the maximum
 * coordinate of the smallest width alignment.
 */
function alignCoordinates(xss, alignTo) {
  var alignToVals = _.values(alignTo),
    alignToMin = _.min(alignToVals),
    alignToMax = _.max(alignToVals);

  _.forEach(["u", "d"], function(vert) {
    _.forEach(["l", "r"], function(horiz) {
      var alignment = vert + horiz,
        xs = xss[alignment],
        delta;
      if (xs === alignTo) return;

      var xsVals = _.values(xs);
      delta = horiz === "l" ? alignToMin - _.min(xsVals) : alignToMax - _.max(xsVals);

      if (delta) {
        xss[alignment] = _.mapValues(xs, function(x) { return x + delta; });
      }
    });
  });
}

function balance(xss, align) {
  return _.mapValues(xss.ul, function(ignore, v) {
    if (align) {
      return xss[align.toLowerCase()][v];
    } else {
      var xs = _.sortBy(_.map(xss, v));
      return (xs[1] + xs[2]) / 2;
    }
  });
}

function positionX(g) {
  var layering = util.buildLayerMatrix(g);
  var conflicts = _.merge(
    findType1Conflicts(g, layering),
    findType2Conflicts(g, layering));

  var xss = {};
  var adjustedLayering;
  _.forEach(["u", "d"], function(vert) {
    adjustedLayering = vert === "u" ? layering : _.values(layering).reverse();
    _.forEach(["l", "r"], function(horiz) {
      if (horiz === "r") {
        adjustedLayering = _.map(adjustedLayering, function(inner) {
          return _.values(inner).reverse();
        });
      }

      var neighborFn = (vert === "u" ? g.predecessors : g.successors).bind(g);
      var align = verticalAlignment(g, adjustedLayering, conflicts, neighborFn);
      var xs = horizontalCompaction(g, adjustedLayering,
        align.root, align.align, horiz === "r");
      if (horiz === "r") {
        xs = _.mapValues(xs, function(x) { return -x; });
      }
      xss[vert + horiz] = xs;
    });
  });

  var smallestWidth = findSmallestWidthAlignment(g, xss);
  alignCoordinates(xss, smallestWidth);
  return balance(xss, g.graph().align);
}

function sep(nodeSep, edgeSep, reverseSep) {
  return function(g, v, w) {
    var vLabel = g.node(v);
    var wLabel = g.node(w);
    var sum = 0;
    var delta;

    sum += vLabel.width / 2;
    if (_.has(vLabel, "labelpos")) {
      switch (vLabel.labelpos.toLowerCase()) {
      case "l": delta = -vLabel.width / 2; break;
      case "r": delta = vLabel.width / 2; break;
      }
    }
    if (delta) {
      sum += reverseSep ? delta : -delta;
    }
    delta = 0;

    sum += (vLabel.dummy ? edgeSep : nodeSep) / 2;
    sum += (wLabel.dummy ? edgeSep : nodeSep) / 2;

    sum += wLabel.width / 2;
    if (_.has(wLabel, "labelpos")) {
      switch (wLabel.labelpos.toLowerCase()) {
      case "l": delta = wLabel.width / 2; break;
      case "r": delta = -wLabel.width / 2; break;
      }
    }
    if (delta) {
      sum += reverseSep ? delta : -delta;
    }
    delta = 0;

    return sum;
  };
}

function width(g, v) {
  return g.node(v).width;
}


/***/ }),

/***/ "./node_modules/dagre/lib/position/index.js":
/*!**************************************************!*\
  !*** ./node_modules/dagre/lib/position/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");
var util = __webpack_require__(/*! ../util */ "./node_modules/dagre/lib/util.js");
var positionX = (__webpack_require__(/*! ./bk */ "./node_modules/dagre/lib/position/bk.js").positionX);

module.exports = position;

function position(g) {
  g = util.asNonCompoundGraph(g);

  positionY(g);
  _.forEach(positionX(g), function(x, v) {
    g.node(v).x = x;
  });
}

function positionY(g) {
  var layering = util.buildLayerMatrix(g);
  var rankSep = g.graph().ranksep;
  var prevY = 0;
  _.forEach(layering, function(layer) {
    var maxHeight = _.max(_.map(layer, function(v) { return g.node(v).height; }));
    _.forEach(layer, function(v) {
      g.node(v).y = prevY + maxHeight / 2;
    });
    prevY += maxHeight + rankSep;
  });
}



/***/ }),

/***/ "./node_modules/dagre/lib/rank/feasible-tree.js":
/*!******************************************************!*\
  !*** ./node_modules/dagre/lib/rank/feasible-tree.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");
var Graph = (__webpack_require__(/*! ../graphlib */ "./node_modules/dagre/lib/graphlib.js").Graph);
var slack = (__webpack_require__(/*! ./util */ "./node_modules/dagre/lib/rank/util.js").slack);

module.exports = feasibleTree;

/*
 * Constructs a spanning tree with tight edges and adjusted the input node's
 * ranks to achieve this. A tight edge is one that is has a length that matches
 * its "minlen" attribute.
 *
 * The basic structure for this function is derived from Gansner, et al., "A
 * Technique for Drawing Directed Graphs."
 *
 * Pre-conditions:
 *
 *    1. Graph must be a DAG.
 *    2. Graph must be connected.
 *    3. Graph must have at least one node.
 *    5. Graph nodes must have been previously assigned a "rank" property that
 *       respects the "minlen" property of incident edges.
 *    6. Graph edges must have a "minlen" property.
 *
 * Post-conditions:
 *
 *    - Graph nodes will have their rank adjusted to ensure that all edges are
 *      tight.
 *
 * Returns a tree (undirected graph) that is constructed using only "tight"
 * edges.
 */
function feasibleTree(g) {
  var t = new Graph({ directed: false });

  // Choose arbitrary node from which to start our tree
  var start = g.nodes()[0];
  var size = g.nodeCount();
  t.setNode(start, {});

  var edge, delta;
  while (tightTree(t, g) < size) {
    edge = findMinSlackEdge(t, g);
    delta = t.hasNode(edge.v) ? slack(g, edge) : -slack(g, edge);
    shiftRanks(t, g, delta);
  }

  return t;
}

/*
 * Finds a maximal tree of tight edges and returns the number of nodes in the
 * tree.
 */
function tightTree(t, g) {
  function dfs(v) {
    _.forEach(g.nodeEdges(v), function(e) {
      var edgeV = e.v,
        w = (v === edgeV) ? e.w : edgeV;
      if (!t.hasNode(w) && !slack(g, e)) {
        t.setNode(w, {});
        t.setEdge(v, w, {});
        dfs(w);
      }
    });
  }

  _.forEach(t.nodes(), dfs);
  return t.nodeCount();
}

/*
 * Finds the edge with the smallest slack that is incident on tree and returns
 * it.
 */
function findMinSlackEdge(t, g) {
  return _.minBy(g.edges(), function(e) {
    if (t.hasNode(e.v) !== t.hasNode(e.w)) {
      return slack(g, e);
    }
  });
}

function shiftRanks(t, g, delta) {
  _.forEach(t.nodes(), function(v) {
    g.node(v).rank += delta;
  });
}


/***/ }),

/***/ "./node_modules/dagre/lib/rank/index.js":
/*!**********************************************!*\
  !*** ./node_modules/dagre/lib/rank/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var rankUtil = __webpack_require__(/*! ./util */ "./node_modules/dagre/lib/rank/util.js");
var longestPath = rankUtil.longestPath;
var feasibleTree = __webpack_require__(/*! ./feasible-tree */ "./node_modules/dagre/lib/rank/feasible-tree.js");
var networkSimplex = __webpack_require__(/*! ./network-simplex */ "./node_modules/dagre/lib/rank/network-simplex.js");

module.exports = rank;

/*
 * Assigns a rank to each node in the input graph that respects the "minlen"
 * constraint specified on edges between nodes.
 *
 * This basic structure is derived from Gansner, et al., "A Technique for
 * Drawing Directed Graphs."
 *
 * Pre-conditions:
 *
 *    1. Graph must be a connected DAG
 *    2. Graph nodes must be objects
 *    3. Graph edges must have "weight" and "minlen" attributes
 *
 * Post-conditions:
 *
 *    1. Graph nodes will have a "rank" attribute based on the results of the
 *       algorithm. Ranks can start at any index (including negative), we'll
 *       fix them up later.
 */
function rank(g) {
  switch(g.graph().ranker) {
  case "network-simplex": networkSimplexRanker(g); break;
  case "tight-tree": tightTreeRanker(g); break;
  case "longest-path": longestPathRanker(g); break;
  default: networkSimplexRanker(g);
  }
}

// A fast and simple ranker, but results are far from optimal.
var longestPathRanker = longestPath;

function tightTreeRanker(g) {
  longestPath(g);
  feasibleTree(g);
}

function networkSimplexRanker(g) {
  networkSimplex(g);
}


/***/ }),

/***/ "./node_modules/dagre/lib/rank/network-simplex.js":
/*!********************************************************!*\
  !*** ./node_modules/dagre/lib/rank/network-simplex.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");
var feasibleTree = __webpack_require__(/*! ./feasible-tree */ "./node_modules/dagre/lib/rank/feasible-tree.js");
var slack = (__webpack_require__(/*! ./util */ "./node_modules/dagre/lib/rank/util.js").slack);
var initRank = (__webpack_require__(/*! ./util */ "./node_modules/dagre/lib/rank/util.js").longestPath);
var preorder = (__webpack_require__(/*! ../graphlib */ "./node_modules/dagre/lib/graphlib.js").alg.preorder);
var postorder = (__webpack_require__(/*! ../graphlib */ "./node_modules/dagre/lib/graphlib.js").alg.postorder);
var simplify = (__webpack_require__(/*! ../util */ "./node_modules/dagre/lib/util.js").simplify);

module.exports = networkSimplex;

// Expose some internals for testing purposes
networkSimplex.initLowLimValues = initLowLimValues;
networkSimplex.initCutValues = initCutValues;
networkSimplex.calcCutValue = calcCutValue;
networkSimplex.leaveEdge = leaveEdge;
networkSimplex.enterEdge = enterEdge;
networkSimplex.exchangeEdges = exchangeEdges;

/*
 * The network simplex algorithm assigns ranks to each node in the input graph
 * and iteratively improves the ranking to reduce the length of edges.
 *
 * Preconditions:
 *
 *    1. The input graph must be a DAG.
 *    2. All nodes in the graph must have an object value.
 *    3. All edges in the graph must have "minlen" and "weight" attributes.
 *
 * Postconditions:
 *
 *    1. All nodes in the graph will have an assigned "rank" attribute that has
 *       been optimized by the network simplex algorithm. Ranks start at 0.
 *
 *
 * A rough sketch of the algorithm is as follows:
 *
 *    1. Assign initial ranks to each node. We use the longest path algorithm,
 *       which assigns ranks to the lowest position possible. In general this
 *       leads to very wide bottom ranks and unnecessarily long edges.
 *    2. Construct a feasible tight tree. A tight tree is one such that all
 *       edges in the tree have no slack (difference between length of edge
 *       and minlen for the edge). This by itself greatly improves the assigned
 *       rankings by shorting edges.
 *    3. Iteratively find edges that have negative cut values. Generally a
 *       negative cut value indicates that the edge could be removed and a new
 *       tree edge could be added to produce a more compact graph.
 *
 * Much of the algorithms here are derived from Gansner, et al., "A Technique
 * for Drawing Directed Graphs." The structure of the file roughly follows the
 * structure of the overall algorithm.
 */
function networkSimplex(g) {
  g = simplify(g);
  initRank(g);
  var t = feasibleTree(g);
  initLowLimValues(t);
  initCutValues(t, g);

  var e, f;
  while ((e = leaveEdge(t))) {
    f = enterEdge(t, g, e);
    exchangeEdges(t, g, e, f);
  }
}

/*
 * Initializes cut values for all edges in the tree.
 */
function initCutValues(t, g) {
  var vs = postorder(t, t.nodes());
  vs = vs.slice(0, vs.length - 1);
  _.forEach(vs, function(v) {
    assignCutValue(t, g, v);
  });
}

function assignCutValue(t, g, child) {
  var childLab = t.node(child);
  var parent = childLab.parent;
  t.edge(child, parent).cutvalue = calcCutValue(t, g, child);
}

/*
 * Given the tight tree, its graph, and a child in the graph calculate and
 * return the cut value for the edge between the child and its parent.
 */
function calcCutValue(t, g, child) {
  var childLab = t.node(child);
  var parent = childLab.parent;
  // True if the child is on the tail end of the edge in the directed graph
  var childIsTail = true;
  // The graph's view of the tree edge we're inspecting
  var graphEdge = g.edge(child, parent);
  // The accumulated cut value for the edge between this node and its parent
  var cutValue = 0;

  if (!graphEdge) {
    childIsTail = false;
    graphEdge = g.edge(parent, child);
  }

  cutValue = graphEdge.weight;

  _.forEach(g.nodeEdges(child), function(e) {
    var isOutEdge = e.v === child,
      other = isOutEdge ? e.w : e.v;

    if (other !== parent) {
      var pointsToHead = isOutEdge === childIsTail,
        otherWeight = g.edge(e).weight;

      cutValue += pointsToHead ? otherWeight : -otherWeight;
      if (isTreeEdge(t, child, other)) {
        var otherCutValue = t.edge(child, other).cutvalue;
        cutValue += pointsToHead ? -otherCutValue : otherCutValue;
      }
    }
  });

  return cutValue;
}

function initLowLimValues(tree, root) {
  if (arguments.length < 2) {
    root = tree.nodes()[0];
  }
  dfsAssignLowLim(tree, {}, 1, root);
}

function dfsAssignLowLim(tree, visited, nextLim, v, parent) {
  var low = nextLim;
  var label = tree.node(v);

  visited[v] = true;
  _.forEach(tree.neighbors(v), function(w) {
    if (!_.has(visited, w)) {
      nextLim = dfsAssignLowLim(tree, visited, nextLim, w, v);
    }
  });

  label.low = low;
  label.lim = nextLim++;
  if (parent) {
    label.parent = parent;
  } else {
    // TODO should be able to remove this when we incrementally update low lim
    delete label.parent;
  }

  return nextLim;
}

function leaveEdge(tree) {
  return _.find(tree.edges(), function(e) {
    return tree.edge(e).cutvalue < 0;
  });
}

function enterEdge(t, g, edge) {
  var v = edge.v;
  var w = edge.w;

  // For the rest of this function we assume that v is the tail and w is the
  // head, so if we don't have this edge in the graph we should flip it to
  // match the correct orientation.
  if (!g.hasEdge(v, w)) {
    v = edge.w;
    w = edge.v;
  }

  var vLabel = t.node(v);
  var wLabel = t.node(w);
  var tailLabel = vLabel;
  var flip = false;

  // If the root is in the tail of the edge then we need to flip the logic that
  // checks for the head and tail nodes in the candidates function below.
  if (vLabel.lim > wLabel.lim) {
    tailLabel = wLabel;
    flip = true;
  }

  var candidates = _.filter(g.edges(), function(edge) {
    return flip === isDescendant(t, t.node(edge.v), tailLabel) &&
           flip !== isDescendant(t, t.node(edge.w), tailLabel);
  });

  return _.minBy(candidates, function(edge) { return slack(g, edge); });
}

function exchangeEdges(t, g, e, f) {
  var v = e.v;
  var w = e.w;
  t.removeEdge(v, w);
  t.setEdge(f.v, f.w, {});
  initLowLimValues(t);
  initCutValues(t, g);
  updateRanks(t, g);
}

function updateRanks(t, g) {
  var root = _.find(t.nodes(), function(v) { return !g.node(v).parent; });
  var vs = preorder(t, root);
  vs = vs.slice(1);
  _.forEach(vs, function(v) {
    var parent = t.node(v).parent,
      edge = g.edge(v, parent),
      flipped = false;

    if (!edge) {
      edge = g.edge(parent, v);
      flipped = true;
    }

    g.node(v).rank = g.node(parent).rank + (flipped ? edge.minlen : -edge.minlen);
  });
}

/*
 * Returns true if the edge is in the tree.
 */
function isTreeEdge(tree, u, v) {
  return tree.hasEdge(u, v);
}

/*
 * Returns true if the specified node is descendant of the root node per the
 * assigned low and lim attributes in the tree.
 */
function isDescendant(tree, vLabel, rootLabel) {
  return rootLabel.low <= vLabel.lim && vLabel.lim <= rootLabel.lim;
}


/***/ }),

/***/ "./node_modules/dagre/lib/rank/util.js":
/*!*********************************************!*\
  !*** ./node_modules/dagre/lib/rank/util.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ../lodash */ "./node_modules/dagre/lib/lodash.js");

module.exports = {
  longestPath: longestPath,
  slack: slack
};

/*
 * Initializes ranks for the input graph using the longest path algorithm. This
 * algorithm scales well and is fast in practice, it yields rather poor
 * solutions. Nodes are pushed to the lowest layer possible, leaving the bottom
 * ranks wide and leaving edges longer than necessary. However, due to its
 * speed, this algorithm is good for getting an initial ranking that can be fed
 * into other algorithms.
 *
 * This algorithm does not normalize layers because it will be used by other
 * algorithms in most cases. If using this algorithm directly, be sure to
 * run normalize at the end.
 *
 * Pre-conditions:
 *
 *    1. Input graph is a DAG.
 *    2. Input graph node labels can be assigned properties.
 *
 * Post-conditions:
 *
 *    1. Each node will be assign an (unnormalized) "rank" property.
 */
function longestPath(g) {
  var visited = {};

  function dfs(v) {
    var label = g.node(v);
    if (_.has(visited, v)) {
      return label.rank;
    }
    visited[v] = true;

    var rank = _.min(_.map(g.outEdges(v), function(e) {
      return dfs(e.w) - g.edge(e).minlen;
    }));

    if (rank === Number.POSITIVE_INFINITY || // return value of _.map([]) for Lodash 3
        rank === undefined || // return value of _.map([]) for Lodash 4
        rank === null) { // return value of _.map([null])
      rank = 0;
    }

    return (label.rank = rank);
  }

  _.forEach(g.sources(), dfs);
}

/*
 * Returns the amount of slack for the given edge. The slack is defined as the
 * difference between the length of the edge and its minimum length.
 */
function slack(g, e) {
  return g.node(e.w).rank - g.node(e.v).rank - g.edge(e).minlen;
}


/***/ }),

/***/ "./node_modules/dagre/lib/util.js":
/*!****************************************!*\
  !*** ./node_modules/dagre/lib/util.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint "no-console": off */



var _ = __webpack_require__(/*! ./lodash */ "./node_modules/dagre/lib/lodash.js");
var Graph = (__webpack_require__(/*! ./graphlib */ "./node_modules/dagre/lib/graphlib.js").Graph);

module.exports = {
  addDummyNode: addDummyNode,
  simplify: simplify,
  asNonCompoundGraph: asNonCompoundGraph,
  successorWeights: successorWeights,
  predecessorWeights: predecessorWeights,
  intersectRect: intersectRect,
  buildLayerMatrix: buildLayerMatrix,
  normalizeRanks: normalizeRanks,
  removeEmptyRanks: removeEmptyRanks,
  addBorderNode: addBorderNode,
  maxRank: maxRank,
  partition: partition,
  time: time,
  notime: notime
};

/*
 * Adds a dummy node to the graph and return v.
 */
function addDummyNode(g, type, attrs, name) {
  var v;
  do {
    v = _.uniqueId(name);
  } while (g.hasNode(v));

  attrs.dummy = type;
  g.setNode(v, attrs);
  return v;
}

/*
 * Returns a new graph with only simple edges. Handles aggregation of data
 * associated with multi-edges.
 */
function simplify(g) {
  var simplified = new Graph().setGraph(g.graph());
  _.forEach(g.nodes(), function(v) { simplified.setNode(v, g.node(v)); });
  _.forEach(g.edges(), function(e) {
    var simpleLabel = simplified.edge(e.v, e.w) || { weight: 0, minlen: 1 };
    var label = g.edge(e);
    simplified.setEdge(e.v, e.w, {
      weight: simpleLabel.weight + label.weight,
      minlen: Math.max(simpleLabel.minlen, label.minlen)
    });
  });
  return simplified;
}

function asNonCompoundGraph(g) {
  var simplified = new Graph({ multigraph: g.isMultigraph() }).setGraph(g.graph());
  _.forEach(g.nodes(), function(v) {
    if (!g.children(v).length) {
      simplified.setNode(v, g.node(v));
    }
  });
  _.forEach(g.edges(), function(e) {
    simplified.setEdge(e, g.edge(e));
  });
  return simplified;
}

function successorWeights(g) {
  var weightMap = _.map(g.nodes(), function(v) {
    var sucs = {};
    _.forEach(g.outEdges(v), function(e) {
      sucs[e.w] = (sucs[e.w] || 0) + g.edge(e).weight;
    });
    return sucs;
  });
  return _.zipObject(g.nodes(), weightMap);
}

function predecessorWeights(g) {
  var weightMap = _.map(g.nodes(), function(v) {
    var preds = {};
    _.forEach(g.inEdges(v), function(e) {
      preds[e.v] = (preds[e.v] || 0) + g.edge(e).weight;
    });
    return preds;
  });
  return _.zipObject(g.nodes(), weightMap);
}

/*
 * Finds where a line starting at point ({x, y}) would intersect a rectangle
 * ({x, y, width, height}) if it were pointing at the rectangle's center.
 */
function intersectRect(rect, point) {
  var x = rect.x;
  var y = rect.y;

  // Rectangle intersection algorithm from:
  // http://math.stackexchange.com/questions/108113/find-edge-between-two-boxes
  var dx = point.x - x;
  var dy = point.y - y;
  var w = rect.width / 2;
  var h = rect.height / 2;

  if (!dx && !dy) {
    throw new Error("Not possible to find intersection inside of the rectangle");
  }

  var sx, sy;
  if (Math.abs(dy) * w > Math.abs(dx) * h) {
    // Intersection is top or bottom of rect.
    if (dy < 0) {
      h = -h;
    }
    sx = h * dx / dy;
    sy = h;
  } else {
    // Intersection is left or right of rect.
    if (dx < 0) {
      w = -w;
    }
    sx = w;
    sy = w * dy / dx;
  }

  return { x: x + sx, y: y + sy };
}

/*
 * Given a DAG with each node assigned "rank" and "order" properties, this
 * function will produce a matrix with the ids of each node.
 */
function buildLayerMatrix(g) {
  var layering = _.map(_.range(maxRank(g) + 1), function() { return []; });
  _.forEach(g.nodes(), function(v) {
    var node = g.node(v);
    var rank = node.rank;
    if (!_.isUndefined(rank)) {
      layering[rank][node.order] = v;
    }
  });
  return layering;
}

/*
 * Adjusts the ranks for all nodes in the graph such that all nodes v have
 * rank(v) >= 0 and at least one node w has rank(w) = 0.
 */
function normalizeRanks(g) {
  var min = _.min(_.map(g.nodes(), function(v) { return g.node(v).rank; }));
  _.forEach(g.nodes(), function(v) {
    var node = g.node(v);
    if (_.has(node, "rank")) {
      node.rank -= min;
    }
  });
}

function removeEmptyRanks(g) {
  // Ranks may not start at 0, so we need to offset them
  var offset = _.min(_.map(g.nodes(), function(v) { return g.node(v).rank; }));

  var layers = [];
  _.forEach(g.nodes(), function(v) {
    var rank = g.node(v).rank - offset;
    if (!layers[rank]) {
      layers[rank] = [];
    }
    layers[rank].push(v);
  });

  var delta = 0;
  var nodeRankFactor = g.graph().nodeRankFactor;
  _.forEach(layers, function(vs, i) {
    if (_.isUndefined(vs) && i % nodeRankFactor !== 0) {
      --delta;
    } else if (delta) {
      _.forEach(vs, function(v) { g.node(v).rank += delta; });
    }
  });
}

function addBorderNode(g, prefix, rank, order) {
  var node = {
    width: 0,
    height: 0
  };
  if (arguments.length >= 4) {
    node.rank = rank;
    node.order = order;
  }
  return addDummyNode(g, "border", node, prefix);
}

function maxRank(g) {
  return _.max(_.map(g.nodes(), function(v) {
    var rank = g.node(v).rank;
    if (!_.isUndefined(rank)) {
      return rank;
    }
  }));
}

/*
 * Partition a collection into two groups: `lhs` and `rhs`. If the supplied
 * function returns true for an entry it goes into `lhs`. Otherwise it goes
 * into `rhs.
 */
function partition(collection, fn) {
  var result = { lhs: [], rhs: [] };
  _.forEach(collection, function(value) {
    if (fn(value)) {
      result.lhs.push(value);
    } else {
      result.rhs.push(value);
    }
  });
  return result;
}

/*
 * Returns a new function that wraps `fn` with a timer. The wrapper logs the
 * time it takes to execute the function.
 */
function time(name, fn) {
  var start = _.now();
  try {
    return fn();
  } finally {
    console.log(name + " time: " + (_.now() - start) + "ms");
  }
}

function notime(name, fn) {
  return fn();
}


/***/ }),

/***/ "./node_modules/dagre/lib/version.js":
/*!*******************************************!*\
  !*** ./node_modules/dagre/lib/version.js ***!
  \*******************************************/
/***/ ((module) => {

module.exports = "0.8.5";


/***/ }),

/***/ "./node_modules/graphlib/index.js":
/*!****************************************!*\
  !*** ./node_modules/graphlib/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2014, Chris Pettitt
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var lib = __webpack_require__(/*! ./lib */ "./node_modules/graphlib/lib/index.js");

module.exports = {
  Graph: lib.Graph,
  json: __webpack_require__(/*! ./lib/json */ "./node_modules/graphlib/lib/json.js"),
  alg: __webpack_require__(/*! ./lib/alg */ "./node_modules/graphlib/lib/alg/index.js"),
  version: lib.version
};


/***/ }),

/***/ "./node_modules/graphlib/lib/alg/components.js":
/*!*****************************************************!*\
  !*** ./node_modules/graphlib/lib/alg/components.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/graphlib/lib/lodash.js");

module.exports = components;

function components(g) {
  var visited = {};
  var cmpts = [];
  var cmpt;

  function dfs(v) {
    if (_.has(visited, v)) return;
    visited[v] = true;
    cmpt.push(v);
    _.each(g.successors(v), dfs);
    _.each(g.predecessors(v), dfs);
  }

  _.each(g.nodes(), function(v) {
    cmpt = [];
    dfs(v);
    if (cmpt.length) {
      cmpts.push(cmpt);
    }
  });

  return cmpts;
}


/***/ }),

/***/ "./node_modules/graphlib/lib/alg/dfs.js":
/*!**********************************************!*\
  !*** ./node_modules/graphlib/lib/alg/dfs.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/graphlib/lib/lodash.js");

module.exports = dfs;

/*
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and returns the nodes in the order they were visited. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * Order must be one of "pre" or "post".
 */
function dfs(g, vs, order) {
  if (!_.isArray(vs)) {
    vs = [vs];
  }

  var navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g);

  var acc = [];
  var visited = {};
  _.each(vs, function(v) {
    if (!g.hasNode(v)) {
      throw new Error("Graph does not have node: " + v);
    }

    doDfs(g, v, order === "post", visited, navigation, acc);
  });
  return acc;
}

function doDfs(g, v, postorder, visited, navigation, acc) {
  if (!_.has(visited, v)) {
    visited[v] = true;

    if (!postorder) { acc.push(v); }
    _.each(navigation(v), function(w) {
      doDfs(g, w, postorder, visited, navigation, acc);
    });
    if (postorder) { acc.push(v); }
  }
}


/***/ }),

/***/ "./node_modules/graphlib/lib/alg/dijkstra-all.js":
/*!*******************************************************!*\
  !*** ./node_modules/graphlib/lib/alg/dijkstra-all.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var dijkstra = __webpack_require__(/*! ./dijkstra */ "./node_modules/graphlib/lib/alg/dijkstra.js");
var _ = __webpack_require__(/*! ../lodash */ "./node_modules/graphlib/lib/lodash.js");

module.exports = dijkstraAll;

function dijkstraAll(g, weightFunc, edgeFunc) {
  return _.transform(g.nodes(), function(acc, v) {
    acc[v] = dijkstra(g, v, weightFunc, edgeFunc);
  }, {});
}


/***/ }),

/***/ "./node_modules/graphlib/lib/alg/dijkstra.js":
/*!***************************************************!*\
  !*** ./node_modules/graphlib/lib/alg/dijkstra.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/graphlib/lib/lodash.js");
var PriorityQueue = __webpack_require__(/*! ../data/priority-queue */ "./node_modules/graphlib/lib/data/priority-queue.js");

module.exports = dijkstra;

var DEFAULT_WEIGHT_FUNC = _.constant(1);

function dijkstra(g, source, weightFn, edgeFn) {
  return runDijkstra(g, String(source),
    weightFn || DEFAULT_WEIGHT_FUNC,
    edgeFn || function(v) { return g.outEdges(v); });
}

function runDijkstra(g, source, weightFn, edgeFn) {
  var results = {};
  var pq = new PriorityQueue();
  var v, vEntry;

  var updateNeighbors = function(edge) {
    var w = edge.v !== v ? edge.v : edge.w;
    var wEntry = results[w];
    var weight = weightFn(edge);
    var distance = vEntry.distance + weight;

    if (weight < 0) {
      throw new Error("dijkstra does not allow negative edge weights. " +
                      "Bad edge: " + edge + " Weight: " + weight);
    }

    if (distance < wEntry.distance) {
      wEntry.distance = distance;
      wEntry.predecessor = v;
      pq.decrease(w, distance);
    }
  };

  g.nodes().forEach(function(v) {
    var distance = v === source ? 0 : Number.POSITIVE_INFINITY;
    results[v] = { distance: distance };
    pq.add(v, distance);
  });

  while (pq.size() > 0) {
    v = pq.removeMin();
    vEntry = results[v];
    if (vEntry.distance === Number.POSITIVE_INFINITY) {
      break;
    }

    edgeFn(v).forEach(updateNeighbors);
  }

  return results;
}


/***/ }),

/***/ "./node_modules/graphlib/lib/alg/find-cycles.js":
/*!******************************************************!*\
  !*** ./node_modules/graphlib/lib/alg/find-cycles.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/graphlib/lib/lodash.js");
var tarjan = __webpack_require__(/*! ./tarjan */ "./node_modules/graphlib/lib/alg/tarjan.js");

module.exports = findCycles;

function findCycles(g) {
  return _.filter(tarjan(g), function(cmpt) {
    return cmpt.length > 1 || (cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]));
  });
}


/***/ }),

/***/ "./node_modules/graphlib/lib/alg/floyd-warshall.js":
/*!*********************************************************!*\
  !*** ./node_modules/graphlib/lib/alg/floyd-warshall.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/graphlib/lib/lodash.js");

module.exports = floydWarshall;

var DEFAULT_WEIGHT_FUNC = _.constant(1);

function floydWarshall(g, weightFn, edgeFn) {
  return runFloydWarshall(g,
    weightFn || DEFAULT_WEIGHT_FUNC,
    edgeFn || function(v) { return g.outEdges(v); });
}

function runFloydWarshall(g, weightFn, edgeFn) {
  var results = {};
  var nodes = g.nodes();

  nodes.forEach(function(v) {
    results[v] = {};
    results[v][v] = { distance: 0 };
    nodes.forEach(function(w) {
      if (v !== w) {
        results[v][w] = { distance: Number.POSITIVE_INFINITY };
      }
    });
    edgeFn(v).forEach(function(edge) {
      var w = edge.v === v ? edge.w : edge.v;
      var d = weightFn(edge);
      results[v][w] = { distance: d, predecessor: v };
    });
  });

  nodes.forEach(function(k) {
    var rowK = results[k];
    nodes.forEach(function(i) {
      var rowI = results[i];
      nodes.forEach(function(j) {
        var ik = rowI[k];
        var kj = rowK[j];
        var ij = rowI[j];
        var altDistance = ik.distance + kj.distance;
        if (altDistance < ij.distance) {
          ij.distance = altDistance;
          ij.predecessor = kj.predecessor;
        }
      });
    });
  });

  return results;
}


/***/ }),

/***/ "./node_modules/graphlib/lib/alg/index.js":
/*!************************************************!*\
  !*** ./node_modules/graphlib/lib/alg/index.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  components: __webpack_require__(/*! ./components */ "./node_modules/graphlib/lib/alg/components.js"),
  dijkstra: __webpack_require__(/*! ./dijkstra */ "./node_modules/graphlib/lib/alg/dijkstra.js"),
  dijkstraAll: __webpack_require__(/*! ./dijkstra-all */ "./node_modules/graphlib/lib/alg/dijkstra-all.js"),
  findCycles: __webpack_require__(/*! ./find-cycles */ "./node_modules/graphlib/lib/alg/find-cycles.js"),
  floydWarshall: __webpack_require__(/*! ./floyd-warshall */ "./node_modules/graphlib/lib/alg/floyd-warshall.js"),
  isAcyclic: __webpack_require__(/*! ./is-acyclic */ "./node_modules/graphlib/lib/alg/is-acyclic.js"),
  postorder: __webpack_require__(/*! ./postorder */ "./node_modules/graphlib/lib/alg/postorder.js"),
  preorder: __webpack_require__(/*! ./preorder */ "./node_modules/graphlib/lib/alg/preorder.js"),
  prim: __webpack_require__(/*! ./prim */ "./node_modules/graphlib/lib/alg/prim.js"),
  tarjan: __webpack_require__(/*! ./tarjan */ "./node_modules/graphlib/lib/alg/tarjan.js"),
  topsort: __webpack_require__(/*! ./topsort */ "./node_modules/graphlib/lib/alg/topsort.js")
};


/***/ }),

/***/ "./node_modules/graphlib/lib/alg/is-acyclic.js":
/*!*****************************************************!*\
  !*** ./node_modules/graphlib/lib/alg/is-acyclic.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var topsort = __webpack_require__(/*! ./topsort */ "./node_modules/graphlib/lib/alg/topsort.js");

module.exports = isAcyclic;

function isAcyclic(g) {
  try {
    topsort(g);
  } catch (e) {
    if (e instanceof topsort.CycleException) {
      return false;
    }
    throw e;
  }
  return true;
}


/***/ }),

/***/ "./node_modules/graphlib/lib/alg/postorder.js":
/*!****************************************************!*\
  !*** ./node_modules/graphlib/lib/alg/postorder.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var dfs = __webpack_require__(/*! ./dfs */ "./node_modules/graphlib/lib/alg/dfs.js");

module.exports = postorder;

function postorder(g, vs) {
  return dfs(g, vs, "post");
}


/***/ }),

/***/ "./node_modules/graphlib/lib/alg/preorder.js":
/*!***************************************************!*\
  !*** ./node_modules/graphlib/lib/alg/preorder.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var dfs = __webpack_require__(/*! ./dfs */ "./node_modules/graphlib/lib/alg/dfs.js");

module.exports = preorder;

function preorder(g, vs) {
  return dfs(g, vs, "pre");
}


/***/ }),

/***/ "./node_modules/graphlib/lib/alg/prim.js":
/*!***********************************************!*\
  !*** ./node_modules/graphlib/lib/alg/prim.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/graphlib/lib/lodash.js");
var Graph = __webpack_require__(/*! ../graph */ "./node_modules/graphlib/lib/graph.js");
var PriorityQueue = __webpack_require__(/*! ../data/priority-queue */ "./node_modules/graphlib/lib/data/priority-queue.js");

module.exports = prim;

function prim(g, weightFunc) {
  var result = new Graph();
  var parents = {};
  var pq = new PriorityQueue();
  var v;

  function updateNeighbors(edge) {
    var w = edge.v === v ? edge.w : edge.v;
    var pri = pq.priority(w);
    if (pri !== undefined) {
      var edgeWeight = weightFunc(edge);
      if (edgeWeight < pri) {
        parents[w] = v;
        pq.decrease(w, edgeWeight);
      }
    }
  }

  if (g.nodeCount() === 0) {
    return result;
  }

  _.each(g.nodes(), function(v) {
    pq.add(v, Number.POSITIVE_INFINITY);
    result.setNode(v);
  });

  // Start from an arbitrary node
  pq.decrease(g.nodes()[0], 0);

  var init = false;
  while (pq.size() > 0) {
    v = pq.removeMin();
    if (_.has(parents, v)) {
      result.setEdge(v, parents[v]);
    } else if (init) {
      throw new Error("Input graph is not connected: " + g);
    } else {
      init = true;
    }

    g.nodeEdges(v).forEach(updateNeighbors);
  }

  return result;
}


/***/ }),

/***/ "./node_modules/graphlib/lib/alg/tarjan.js":
/*!*************************************************!*\
  !*** ./node_modules/graphlib/lib/alg/tarjan.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/graphlib/lib/lodash.js");

module.exports = tarjan;

function tarjan(g) {
  var index = 0;
  var stack = [];
  var visited = {}; // node id -> { onStack, lowlink, index }
  var results = [];

  function dfs(v) {
    var entry = visited[v] = {
      onStack: true,
      lowlink: index,
      index: index++
    };
    stack.push(v);

    g.successors(v).forEach(function(w) {
      if (!_.has(visited, w)) {
        dfs(w);
        entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink);
      } else if (visited[w].onStack) {
        entry.lowlink = Math.min(entry.lowlink, visited[w].index);
      }
    });

    if (entry.lowlink === entry.index) {
      var cmpt = [];
      var w;
      do {
        w = stack.pop();
        visited[w].onStack = false;
        cmpt.push(w);
      } while (v !== w);
      results.push(cmpt);
    }
  }

  g.nodes().forEach(function(v) {
    if (!_.has(visited, v)) {
      dfs(v);
    }
  });

  return results;
}


/***/ }),

/***/ "./node_modules/graphlib/lib/alg/topsort.js":
/*!**************************************************!*\
  !*** ./node_modules/graphlib/lib/alg/topsort.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/graphlib/lib/lodash.js");

module.exports = topsort;
topsort.CycleException = CycleException;

function topsort(g) {
  var visited = {};
  var stack = {};
  var results = [];

  function visit(node) {
    if (_.has(stack, node)) {
      throw new CycleException();
    }

    if (!_.has(visited, node)) {
      stack[node] = true;
      visited[node] = true;
      _.each(g.predecessors(node), visit);
      delete stack[node];
      results.push(node);
    }
  }

  _.each(g.sinks(), visit);

  if (_.size(visited) !== g.nodeCount()) {
    throw new CycleException();
  }

  return results;
}

function CycleException() {}
CycleException.prototype = new Error(); // must be an instance of Error to pass testing

/***/ }),

/***/ "./node_modules/graphlib/lib/data/priority-queue.js":
/*!**********************************************************!*\
  !*** ./node_modules/graphlib/lib/data/priority-queue.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../lodash */ "./node_modules/graphlib/lib/lodash.js");

module.exports = PriorityQueue;

/**
 * A min-priority queue data structure. This algorithm is derived from Cormen,
 * et al., "Introduction to Algorithms". The basic idea of a min-priority
 * queue is that you can efficiently (in O(1) time) get the smallest key in
 * the queue. Adding and removing elements takes O(log n) time. A key can
 * have its priority decreased in O(log n) time.
 */
function PriorityQueue() {
  this._arr = [];
  this._keyIndices = {};
}

/**
 * Returns the number of elements in the queue. Takes `O(1)` time.
 */
PriorityQueue.prototype.size = function() {
  return this._arr.length;
};

/**
 * Returns the keys that are in the queue. Takes `O(n)` time.
 */
PriorityQueue.prototype.keys = function() {
  return this._arr.map(function(x) { return x.key; });
};

/**
 * Returns `true` if **key** is in the queue and `false` if not.
 */
PriorityQueue.prototype.has = function(key) {
  return _.has(this._keyIndices, key);
};

/**
 * Returns the priority for **key**. If **key** is not present in the queue
 * then this function returns `undefined`. Takes `O(1)` time.
 *
 * @param {Object} key
 */
PriorityQueue.prototype.priority = function(key) {
  var index = this._keyIndices[key];
  if (index !== undefined) {
    return this._arr[index].priority;
  }
};

/**
 * Returns the key for the minimum element in this queue. If the queue is
 * empty this function throws an Error. Takes `O(1)` time.
 */
PriorityQueue.prototype.min = function() {
  if (this.size() === 0) {
    throw new Error("Queue underflow");
  }
  return this._arr[0].key;
};

/**
 * Inserts a new key into the priority queue. If the key already exists in
 * the queue this function returns `false`; otherwise it will return `true`.
 * Takes `O(n)` time.
 *
 * @param {Object} key the key to add
 * @param {Number} priority the initial priority for the key
 */
PriorityQueue.prototype.add = function(key, priority) {
  var keyIndices = this._keyIndices;
  key = String(key);
  if (!_.has(keyIndices, key)) {
    var arr = this._arr;
    var index = arr.length;
    keyIndices[key] = index;
    arr.push({key: key, priority: priority});
    this._decrease(index);
    return true;
  }
  return false;
};

/**
 * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
 */
PriorityQueue.prototype.removeMin = function() {
  this._swap(0, this._arr.length - 1);
  var min = this._arr.pop();
  delete this._keyIndices[min.key];
  this._heapify(0);
  return min.key;
};

/**
 * Decreases the priority for **key** to **priority**. If the new priority is
 * greater than the previous priority, this function will throw an Error.
 *
 * @param {Object} key the key for which to raise priority
 * @param {Number} priority the new priority for the key
 */
PriorityQueue.prototype.decrease = function(key, priority) {
  var index = this._keyIndices[key];
  if (priority > this._arr[index].priority) {
    throw new Error("New priority is greater than current priority. " +
        "Key: " + key + " Old: " + this._arr[index].priority + " New: " + priority);
  }
  this._arr[index].priority = priority;
  this._decrease(index);
};

PriorityQueue.prototype._heapify = function(i) {
  var arr = this._arr;
  var l = 2 * i;
  var r = l + 1;
  var largest = i;
  if (l < arr.length) {
    largest = arr[l].priority < arr[largest].priority ? l : largest;
    if (r < arr.length) {
      largest = arr[r].priority < arr[largest].priority ? r : largest;
    }
    if (largest !== i) {
      this._swap(i, largest);
      this._heapify(largest);
    }
  }
};

PriorityQueue.prototype._decrease = function(index) {
  var arr = this._arr;
  var priority = arr[index].priority;
  var parent;
  while (index !== 0) {
    parent = index >> 1;
    if (arr[parent].priority < priority) {
      break;
    }
    this._swap(index, parent);
    index = parent;
  }
};

PriorityQueue.prototype._swap = function(i, j) {
  var arr = this._arr;
  var keyIndices = this._keyIndices;
  var origArrI = arr[i];
  var origArrJ = arr[j];
  arr[i] = origArrJ;
  arr[j] = origArrI;
  keyIndices[origArrJ.key] = i;
  keyIndices[origArrI.key] = j;
};


/***/ }),

/***/ "./node_modules/graphlib/lib/graph.js":
/*!********************************************!*\
  !*** ./node_modules/graphlib/lib/graph.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! ./lodash */ "./node_modules/graphlib/lib/lodash.js");

module.exports = Graph;

var DEFAULT_EDGE_NAME = "\x00";
var GRAPH_NODE = "\x00";
var EDGE_KEY_DELIM = "\x01";

// Implementation notes:
//
//  * Node id query functions should return string ids for the nodes
//  * Edge id query functions should return an "edgeObj", edge object, that is
//    composed of enough information to uniquely identify an edge: {v, w, name}.
//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
//    reference edges. This is because we need a performant way to look these
//    edges up and, object properties, which have string keys, are the closest
//    we're going to get to a performant hashtable in JavaScript.

function Graph(opts) {
  this._isDirected = _.has(opts, "directed") ? opts.directed : true;
  this._isMultigraph = _.has(opts, "multigraph") ? opts.multigraph : false;
  this._isCompound = _.has(opts, "compound") ? opts.compound : false;

  // Label for the graph itself
  this._label = undefined;

  // Defaults to be set when creating a new node
  this._defaultNodeLabelFn = _.constant(undefined);

  // Defaults to be set when creating a new edge
  this._defaultEdgeLabelFn = _.constant(undefined);

  // v -> label
  this._nodes = {};

  if (this._isCompound) {
    // v -> parent
    this._parent = {};

    // v -> children
    this._children = {};
    this._children[GRAPH_NODE] = {};
  }

  // v -> edgeObj
  this._in = {};

  // u -> v -> Number
  this._preds = {};

  // v -> edgeObj
  this._out = {};

  // v -> w -> Number
  this._sucs = {};

  // e -> edgeObj
  this._edgeObjs = {};

  // e -> label
  this._edgeLabels = {};
}

/* Number of nodes in the graph. Should only be changed by the implementation. */
Graph.prototype._nodeCount = 0;

/* Number of edges in the graph. Should only be changed by the implementation. */
Graph.prototype._edgeCount = 0;


/* === Graph functions ========= */

Graph.prototype.isDirected = function() {
  return this._isDirected;
};

Graph.prototype.isMultigraph = function() {
  return this._isMultigraph;
};

Graph.prototype.isCompound = function() {
  return this._isCompound;
};

Graph.prototype.setGraph = function(label) {
  this._label = label;
  return this;
};

Graph.prototype.graph = function() {
  return this._label;
};


/* === Node functions ========== */

Graph.prototype.setDefaultNodeLabel = function(newDefault) {
  if (!_.isFunction(newDefault)) {
    newDefault = _.constant(newDefault);
  }
  this._defaultNodeLabelFn = newDefault;
  return this;
};

Graph.prototype.nodeCount = function() {
  return this._nodeCount;
};

Graph.prototype.nodes = function() {
  return _.keys(this._nodes);
};

Graph.prototype.sources = function() {
  var self = this;
  return _.filter(this.nodes(), function(v) {
    return _.isEmpty(self._in[v]);
  });
};

Graph.prototype.sinks = function() {
  var self = this;
  return _.filter(this.nodes(), function(v) {
    return _.isEmpty(self._out[v]);
  });
};

Graph.prototype.setNodes = function(vs, value) {
  var args = arguments;
  var self = this;
  _.each(vs, function(v) {
    if (args.length > 1) {
      self.setNode(v, value);
    } else {
      self.setNode(v);
    }
  });
  return this;
};

Graph.prototype.setNode = function(v, value) {
  if (_.has(this._nodes, v)) {
    if (arguments.length > 1) {
      this._nodes[v] = value;
    }
    return this;
  }

  this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
  if (this._isCompound) {
    this._parent[v] = GRAPH_NODE;
    this._children[v] = {};
    this._children[GRAPH_NODE][v] = true;
  }
  this._in[v] = {};
  this._preds[v] = {};
  this._out[v] = {};
  this._sucs[v] = {};
  ++this._nodeCount;
  return this;
};

Graph.prototype.node = function(v) {
  return this._nodes[v];
};

Graph.prototype.hasNode = function(v) {
  return _.has(this._nodes, v);
};

Graph.prototype.removeNode =  function(v) {
  var self = this;
  if (_.has(this._nodes, v)) {
    var removeEdge = function(e) { self.removeEdge(self._edgeObjs[e]); };
    delete this._nodes[v];
    if (this._isCompound) {
      this._removeFromParentsChildList(v);
      delete this._parent[v];
      _.each(this.children(v), function(child) {
        self.setParent(child);
      });
      delete this._children[v];
    }
    _.each(_.keys(this._in[v]), removeEdge);
    delete this._in[v];
    delete this._preds[v];
    _.each(_.keys(this._out[v]), removeEdge);
    delete this._out[v];
    delete this._sucs[v];
    --this._nodeCount;
  }
  return this;
};

Graph.prototype.setParent = function(v, parent) {
  if (!this._isCompound) {
    throw new Error("Cannot set parent in a non-compound graph");
  }

  if (_.isUndefined(parent)) {
    parent = GRAPH_NODE;
  } else {
    // Coerce parent to string
    parent += "";
    for (var ancestor = parent;
      !_.isUndefined(ancestor);
      ancestor = this.parent(ancestor)) {
      if (ancestor === v) {
        throw new Error("Setting " + parent+ " as parent of " + v +
                        " would create a cycle");
      }
    }

    this.setNode(parent);
  }

  this.setNode(v);
  this._removeFromParentsChildList(v);
  this._parent[v] = parent;
  this._children[parent][v] = true;
  return this;
};

Graph.prototype._removeFromParentsChildList = function(v) {
  delete this._children[this._parent[v]][v];
};

Graph.prototype.parent = function(v) {
  if (this._isCompound) {
    var parent = this._parent[v];
    if (parent !== GRAPH_NODE) {
      return parent;
    }
  }
};

Graph.prototype.children = function(v) {
  if (_.isUndefined(v)) {
    v = GRAPH_NODE;
  }

  if (this._isCompound) {
    var children = this._children[v];
    if (children) {
      return _.keys(children);
    }
  } else if (v === GRAPH_NODE) {
    return this.nodes();
  } else if (this.hasNode(v)) {
    return [];
  }
};

Graph.prototype.predecessors = function(v) {
  var predsV = this._preds[v];
  if (predsV) {
    return _.keys(predsV);
  }
};

Graph.prototype.successors = function(v) {
  var sucsV = this._sucs[v];
  if (sucsV) {
    return _.keys(sucsV);
  }
};

Graph.prototype.neighbors = function(v) {
  var preds = this.predecessors(v);
  if (preds) {
    return _.union(preds, this.successors(v));
  }
};

Graph.prototype.isLeaf = function (v) {
  var neighbors;
  if (this.isDirected()) {
    neighbors = this.successors(v);
  } else {
    neighbors = this.neighbors(v);
  }
  return neighbors.length === 0;
};

Graph.prototype.filterNodes = function(filter) {
  var copy = new this.constructor({
    directed: this._isDirected,
    multigraph: this._isMultigraph,
    compound: this._isCompound
  });

  copy.setGraph(this.graph());

  var self = this;
  _.each(this._nodes, function(value, v) {
    if (filter(v)) {
      copy.setNode(v, value);
    }
  });

  _.each(this._edgeObjs, function(e) {
    if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
      copy.setEdge(e, self.edge(e));
    }
  });

  var parents = {};
  function findParent(v) {
    var parent = self.parent(v);
    if (parent === undefined || copy.hasNode(parent)) {
      parents[v] = parent;
      return parent;
    } else if (parent in parents) {
      return parents[parent];
    } else {
      return findParent(parent);
    }
  }

  if (this._isCompound) {
    _.each(copy.nodes(), function(v) {
      copy.setParent(v, findParent(v));
    });
  }

  return copy;
};

/* === Edge functions ========== */

Graph.prototype.setDefaultEdgeLabel = function(newDefault) {
  if (!_.isFunction(newDefault)) {
    newDefault = _.constant(newDefault);
  }
  this._defaultEdgeLabelFn = newDefault;
  return this;
};

Graph.prototype.edgeCount = function() {
  return this._edgeCount;
};

Graph.prototype.edges = function() {
  return _.values(this._edgeObjs);
};

Graph.prototype.setPath = function(vs, value) {
  var self = this;
  var args = arguments;
  _.reduce(vs, function(v, w) {
    if (args.length > 1) {
      self.setEdge(v, w, value);
    } else {
      self.setEdge(v, w);
    }
    return w;
  });
  return this;
};

/*
 * setEdge(v, w, [value, [name]])
 * setEdge({ v, w, [name] }, [value])
 */
Graph.prototype.setEdge = function() {
  var v, w, name, value;
  var valueSpecified = false;
  var arg0 = arguments[0];

  if (typeof arg0 === "object" && arg0 !== null && "v" in arg0) {
    v = arg0.v;
    w = arg0.w;
    name = arg0.name;
    if (arguments.length === 2) {
      value = arguments[1];
      valueSpecified = true;
    }
  } else {
    v = arg0;
    w = arguments[1];
    name = arguments[3];
    if (arguments.length > 2) {
      value = arguments[2];
      valueSpecified = true;
    }
  }

  v = "" + v;
  w = "" + w;
  if (!_.isUndefined(name)) {
    name = "" + name;
  }

  var e = edgeArgsToId(this._isDirected, v, w, name);
  if (_.has(this._edgeLabels, e)) {
    if (valueSpecified) {
      this._edgeLabels[e] = value;
    }
    return this;
  }

  if (!_.isUndefined(name) && !this._isMultigraph) {
    throw new Error("Cannot set a named edge when isMultigraph = false");
  }

  // It didn't exist, so we need to create it.
  // First ensure the nodes exist.
  this.setNode(v);
  this.setNode(w);

  this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name);

  var edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
  // Ensure we add undirected edges in a consistent way.
  v = edgeObj.v;
  w = edgeObj.w;

  Object.freeze(edgeObj);
  this._edgeObjs[e] = edgeObj;
  incrementOrInitEntry(this._preds[w], v);
  incrementOrInitEntry(this._sucs[v], w);
  this._in[w][e] = edgeObj;
  this._out[v][e] = edgeObj;
  this._edgeCount++;
  return this;
};

Graph.prototype.edge = function(v, w, name) {
  var e = (arguments.length === 1
    ? edgeObjToId(this._isDirected, arguments[0])
    : edgeArgsToId(this._isDirected, v, w, name));
  return this._edgeLabels[e];
};

Graph.prototype.hasEdge = function(v, w, name) {
  var e = (arguments.length === 1
    ? edgeObjToId(this._isDirected, arguments[0])
    : edgeArgsToId(this._isDirected, v, w, name));
  return _.has(this._edgeLabels, e);
};

Graph.prototype.removeEdge = function(v, w, name) {
  var e = (arguments.length === 1
    ? edgeObjToId(this._isDirected, arguments[0])
    : edgeArgsToId(this._isDirected, v, w, name));
  var edge = this._edgeObjs[e];
  if (edge) {
    v = edge.v;
    w = edge.w;
    delete this._edgeLabels[e];
    delete this._edgeObjs[e];
    decrementOrRemoveEntry(this._preds[w], v);
    decrementOrRemoveEntry(this._sucs[v], w);
    delete this._in[w][e];
    delete this._out[v][e];
    this._edgeCount--;
  }
  return this;
};

Graph.prototype.inEdges = function(v, u) {
  var inV = this._in[v];
  if (inV) {
    var edges = _.values(inV);
    if (!u) {
      return edges;
    }
    return _.filter(edges, function(edge) { return edge.v === u; });
  }
};

Graph.prototype.outEdges = function(v, w) {
  var outV = this._out[v];
  if (outV) {
    var edges = _.values(outV);
    if (!w) {
      return edges;
    }
    return _.filter(edges, function(edge) { return edge.w === w; });
  }
};

Graph.prototype.nodeEdges = function(v, w) {
  var inEdges = this.inEdges(v, w);
  if (inEdges) {
    return inEdges.concat(this.outEdges(v, w));
  }
};

function incrementOrInitEntry(map, k) {
  if (map[k]) {
    map[k]++;
  } else {
    map[k] = 1;
  }
}

function decrementOrRemoveEntry(map, k) {
  if (!--map[k]) { delete map[k]; }
}

function edgeArgsToId(isDirected, v_, w_, name) {
  var v = "" + v_;
  var w = "" + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM +
             (_.isUndefined(name) ? DEFAULT_EDGE_NAME : name);
}

function edgeArgsToObj(isDirected, v_, w_, name) {
  var v = "" + v_;
  var w = "" + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  var edgeObj =  { v: v, w: w };
  if (name) {
    edgeObj.name = name;
  }
  return edgeObj;
}

function edgeObjToId(isDirected, edgeObj) {
  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
}


/***/ }),

/***/ "./node_modules/graphlib/lib/index.js":
/*!********************************************!*\
  !*** ./node_modules/graphlib/lib/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Includes only the "core" of graphlib
module.exports = {
  Graph: __webpack_require__(/*! ./graph */ "./node_modules/graphlib/lib/graph.js"),
  version: __webpack_require__(/*! ./version */ "./node_modules/graphlib/lib/version.js")
};


/***/ }),

/***/ "./node_modules/graphlib/lib/json.js":
/*!*******************************************!*\
  !*** ./node_modules/graphlib/lib/json.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./lodash */ "./node_modules/graphlib/lib/lodash.js");
var Graph = __webpack_require__(/*! ./graph */ "./node_modules/graphlib/lib/graph.js");

module.exports = {
  write: write,
  read: read
};

function write(g) {
  var json = {
    options: {
      directed: g.isDirected(),
      multigraph: g.isMultigraph(),
      compound: g.isCompound()
    },
    nodes: writeNodes(g),
    edges: writeEdges(g)
  };
  if (!_.isUndefined(g.graph())) {
    json.value = _.clone(g.graph());
  }
  return json;
}

function writeNodes(g) {
  return _.map(g.nodes(), function(v) {
    var nodeValue = g.node(v);
    var parent = g.parent(v);
    var node = { v: v };
    if (!_.isUndefined(nodeValue)) {
      node.value = nodeValue;
    }
    if (!_.isUndefined(parent)) {
      node.parent = parent;
    }
    return node;
  });
}

function writeEdges(g) {
  return _.map(g.edges(), function(e) {
    var edgeValue = g.edge(e);
    var edge = { v: e.v, w: e.w };
    if (!_.isUndefined(e.name)) {
      edge.name = e.name;
    }
    if (!_.isUndefined(edgeValue)) {
      edge.value = edgeValue;
    }
    return edge;
  });
}

function read(json) {
  var g = new Graph(json.options).setGraph(json.value);
  _.each(json.nodes, function(entry) {
    g.setNode(entry.v, entry.value);
    if (entry.parent) {
      g.setParent(entry.v, entry.parent);
    }
  });
  _.each(json.edges, function(entry) {
    g.setEdge({ v: entry.v, w: entry.w, name: entry.name }, entry.value);
  });
  return g;
}


/***/ }),

/***/ "./node_modules/graphlib/lib/lodash.js":
/*!*********************************************!*\
  !*** ./node_modules/graphlib/lib/lodash.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* global window */

var lodash;

if (true) {
  try {
    lodash = {
      clone: __webpack_require__(/*! lodash/clone */ "./node_modules/lodash/clone.js"),
      constant: __webpack_require__(/*! lodash/constant */ "./node_modules/lodash/constant.js"),
      each: __webpack_require__(/*! lodash/each */ "./node_modules/lodash/each.js"),
      filter: __webpack_require__(/*! lodash/filter */ "./node_modules/lodash/filter.js"),
      has:  __webpack_require__(/*! lodash/has */ "./node_modules/lodash/has.js"),
      isArray: __webpack_require__(/*! lodash/isArray */ "./node_modules/lodash/isArray.js"),
      isEmpty: __webpack_require__(/*! lodash/isEmpty */ "./node_modules/lodash/isEmpty.js"),
      isFunction: __webpack_require__(/*! lodash/isFunction */ "./node_modules/lodash/isFunction.js"),
      isUndefined: __webpack_require__(/*! lodash/isUndefined */ "./node_modules/lodash/isUndefined.js"),
      keys: __webpack_require__(/*! lodash/keys */ "./node_modules/lodash/keys.js"),
      map: __webpack_require__(/*! lodash/map */ "./node_modules/lodash/map.js"),
      reduce: __webpack_require__(/*! lodash/reduce */ "./node_modules/lodash/reduce.js"),
      size: __webpack_require__(/*! lodash/size */ "./node_modules/lodash/size.js"),
      transform: __webpack_require__(/*! lodash/transform */ "./node_modules/lodash/transform.js"),
      union: __webpack_require__(/*! lodash/union */ "./node_modules/lodash/union.js"),
      values: __webpack_require__(/*! lodash/values */ "./node_modules/lodash/values.js")
    };
  } catch (e) {
    // continue regardless of error
  }
}

if (!lodash) {
  lodash = window._;
}

module.exports = lodash;


/***/ }),

/***/ "./node_modules/graphlib/lib/version.js":
/*!**********************************************!*\
  !*** ./node_modules/graphlib/lib/version.js ***!
  \**********************************************/
/***/ ((module) => {

module.exports = '2.1.8';


/***/ }),

/***/ "./node_modules/lodash/_DataView.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_DataView.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ "./node_modules/lodash/_Hash.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_Hash.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hashClear = __webpack_require__(/*! ./_hashClear */ "./node_modules/lodash/_hashClear.js"),
    hashDelete = __webpack_require__(/*! ./_hashDelete */ "./node_modules/lodash/_hashDelete.js"),
    hashGet = __webpack_require__(/*! ./_hashGet */ "./node_modules/lodash/_hashGet.js"),
    hashHas = __webpack_require__(/*! ./_hashHas */ "./node_modules/lodash/_hashHas.js"),
    hashSet = __webpack_require__(/*! ./_hashSet */ "./node_modules/lodash/_hashSet.js");

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ "./node_modules/lodash/_ListCache.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_ListCache.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var listCacheClear = __webpack_require__(/*! ./_listCacheClear */ "./node_modules/lodash/_listCacheClear.js"),
    listCacheDelete = __webpack_require__(/*! ./_listCacheDelete */ "./node_modules/lodash/_listCacheDelete.js"),
    listCacheGet = __webpack_require__(/*! ./_listCacheGet */ "./node_modules/lodash/_listCacheGet.js"),
    listCacheHas = __webpack_require__(/*! ./_listCacheHas */ "./node_modules/lodash/_listCacheHas.js"),
    listCacheSet = __webpack_require__(/*! ./_listCacheSet */ "./node_modules/lodash/_listCacheSet.js");

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ "./node_modules/lodash/_Map.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Map.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ "./node_modules/lodash/_MapCache.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_MapCache.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mapCacheClear = __webpack_require__(/*! ./_mapCacheClear */ "./node_modules/lodash/_mapCacheClear.js"),
    mapCacheDelete = __webpack_require__(/*! ./_mapCacheDelete */ "./node_modules/lodash/_mapCacheDelete.js"),
    mapCacheGet = __webpack_require__(/*! ./_mapCacheGet */ "./node_modules/lodash/_mapCacheGet.js"),
    mapCacheHas = __webpack_require__(/*! ./_mapCacheHas */ "./node_modules/lodash/_mapCacheHas.js"),
    mapCacheSet = __webpack_require__(/*! ./_mapCacheSet */ "./node_modules/lodash/_mapCacheSet.js");

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ "./node_modules/lodash/_Promise.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_Promise.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ "./node_modules/lodash/_Set.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Set.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ "./node_modules/lodash/_SetCache.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_SetCache.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MapCache = __webpack_require__(/*! ./_MapCache */ "./node_modules/lodash/_MapCache.js"),
    setCacheAdd = __webpack_require__(/*! ./_setCacheAdd */ "./node_modules/lodash/_setCacheAdd.js"),
    setCacheHas = __webpack_require__(/*! ./_setCacheHas */ "./node_modules/lodash/_setCacheHas.js");

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),

/***/ "./node_modules/lodash/_Stack.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_Stack.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    stackClear = __webpack_require__(/*! ./_stackClear */ "./node_modules/lodash/_stackClear.js"),
    stackDelete = __webpack_require__(/*! ./_stackDelete */ "./node_modules/lodash/_stackDelete.js"),
    stackGet = __webpack_require__(/*! ./_stackGet */ "./node_modules/lodash/_stackGet.js"),
    stackHas = __webpack_require__(/*! ./_stackHas */ "./node_modules/lodash/_stackHas.js"),
    stackSet = __webpack_require__(/*! ./_stackSet */ "./node_modules/lodash/_stackSet.js");

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),

/***/ "./node_modules/lodash/_Symbol.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "./node_modules/lodash/_Uint8Array.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_Uint8Array.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ "./node_modules/lodash/_WeakMap.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_WeakMap.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ "./node_modules/lodash/_apply.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_apply.js ***!
  \***************************************/
/***/ ((module) => {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),

/***/ "./node_modules/lodash/_arrayEach.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayEach.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),

/***/ "./node_modules/lodash/_arrayFilter.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_arrayFilter.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),

/***/ "./node_modules/lodash/_arrayIncludes.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_arrayIncludes.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIndexOf = __webpack_require__(/*! ./_baseIndexOf */ "./node_modules/lodash/_baseIndexOf.js");

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;


/***/ }),

/***/ "./node_modules/lodash/_arrayIncludesWith.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash/_arrayIncludesWith.js ***!
  \***************************************************/
/***/ ((module) => {

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;


/***/ }),

/***/ "./node_modules/lodash/_arrayLikeKeys.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_arrayLikeKeys.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTimes = __webpack_require__(/*! ./_baseTimes */ "./node_modules/lodash/_baseTimes.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "./node_modules/lodash/_isIndex.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "./node_modules/lodash/isTypedArray.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),

/***/ "./node_modules/lodash/_arrayMap.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_arrayMap.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),

/***/ "./node_modules/lodash/_arrayPush.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayPush.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ "./node_modules/lodash/_arrayReduce.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_arrayReduce.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;


/***/ }),

/***/ "./node_modules/lodash/_arraySome.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arraySome.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),

/***/ "./node_modules/lodash/_asciiSize.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_asciiSize.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseProperty = __webpack_require__(/*! ./_baseProperty */ "./node_modules/lodash/_baseProperty.js");

/**
 * Gets the size of an ASCII `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
var asciiSize = baseProperty('length');

module.exports = asciiSize;


/***/ }),

/***/ "./node_modules/lodash/_assignMergeValue.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_assignMergeValue.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./node_modules/lodash/_baseAssignValue.js"),
    eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js");

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignMergeValue;


/***/ }),

/***/ "./node_modules/lodash/_assignValue.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_assignValue.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./node_modules/lodash/_baseAssignValue.js"),
    eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),

/***/ "./node_modules/lodash/_assocIndexOf.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_assocIndexOf.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js");

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ "./node_modules/lodash/_baseAssign.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseAssign.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),

/***/ "./node_modules/lodash/_baseAssignIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseAssignIn.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),

/***/ "./node_modules/lodash/_baseAssignValue.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseAssignValue.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defineProperty = __webpack_require__(/*! ./_defineProperty */ "./node_modules/lodash/_defineProperty.js");

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),

/***/ "./node_modules/lodash/_baseClone.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseClone.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(/*! ./_Stack */ "./node_modules/lodash/_Stack.js"),
    arrayEach = __webpack_require__(/*! ./_arrayEach */ "./node_modules/lodash/_arrayEach.js"),
    assignValue = __webpack_require__(/*! ./_assignValue */ "./node_modules/lodash/_assignValue.js"),
    baseAssign = __webpack_require__(/*! ./_baseAssign */ "./node_modules/lodash/_baseAssign.js"),
    baseAssignIn = __webpack_require__(/*! ./_baseAssignIn */ "./node_modules/lodash/_baseAssignIn.js"),
    cloneBuffer = __webpack_require__(/*! ./_cloneBuffer */ "./node_modules/lodash/_cloneBuffer.js"),
    copyArray = __webpack_require__(/*! ./_copyArray */ "./node_modules/lodash/_copyArray.js"),
    copySymbols = __webpack_require__(/*! ./_copySymbols */ "./node_modules/lodash/_copySymbols.js"),
    copySymbolsIn = __webpack_require__(/*! ./_copySymbolsIn */ "./node_modules/lodash/_copySymbolsIn.js"),
    getAllKeys = __webpack_require__(/*! ./_getAllKeys */ "./node_modules/lodash/_getAllKeys.js"),
    getAllKeysIn = __webpack_require__(/*! ./_getAllKeysIn */ "./node_modules/lodash/_getAllKeysIn.js"),
    getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    initCloneArray = __webpack_require__(/*! ./_initCloneArray */ "./node_modules/lodash/_initCloneArray.js"),
    initCloneByTag = __webpack_require__(/*! ./_initCloneByTag */ "./node_modules/lodash/_initCloneByTag.js"),
    initCloneObject = __webpack_require__(/*! ./_initCloneObject */ "./node_modules/lodash/_initCloneObject.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isMap = __webpack_require__(/*! ./isMap */ "./node_modules/lodash/isMap.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isSet = __webpack_require__(/*! ./isSet */ "./node_modules/lodash/isSet.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ }),

/***/ "./node_modules/lodash/_baseCreate.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseCreate.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),

/***/ "./node_modules/lodash/_baseEach.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseEach.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseForOwn = __webpack_require__(/*! ./_baseForOwn */ "./node_modules/lodash/_baseForOwn.js"),
    createBaseEach = __webpack_require__(/*! ./_createBaseEach */ "./node_modules/lodash/_createBaseEach.js");

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;


/***/ }),

/***/ "./node_modules/lodash/_baseExtremum.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseExtremum.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/**
 * The base implementation of methods like `_.max` and `_.min` which accepts a
 * `comparator` to determine the extremum value.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per iteration.
 * @param {Function} comparator The comparator used to compare values.
 * @returns {*} Returns the extremum value.
 */
function baseExtremum(array, iteratee, comparator) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index],
        current = iteratee(value);

    if (current != null && (computed === undefined
          ? (current === current && !isSymbol(current))
          : comparator(current, computed)
        )) {
      var computed = current,
          result = value;
    }
  }
  return result;
}

module.exports = baseExtremum;


/***/ }),

/***/ "./node_modules/lodash/_baseFilter.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseFilter.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseEach = __webpack_require__(/*! ./_baseEach */ "./node_modules/lodash/_baseEach.js");

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;


/***/ }),

/***/ "./node_modules/lodash/_baseFindIndex.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_baseFindIndex.js ***!
  \***********************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ }),

/***/ "./node_modules/lodash/_baseFlatten.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseFlatten.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./node_modules/lodash/_arrayPush.js"),
    isFlattenable = __webpack_require__(/*! ./_isFlattenable */ "./node_modules/lodash/_isFlattenable.js");

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ }),

/***/ "./node_modules/lodash/_baseFor.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseFor.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var createBaseFor = __webpack_require__(/*! ./_createBaseFor */ "./node_modules/lodash/_createBaseFor.js");

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;


/***/ }),

/***/ "./node_modules/lodash/_baseForOwn.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseForOwn.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseFor = __webpack_require__(/*! ./_baseFor */ "./node_modules/lodash/_baseFor.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;


/***/ }),

/***/ "./node_modules/lodash/_baseGet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseGet.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var castPath = __webpack_require__(/*! ./_castPath */ "./node_modules/lodash/_castPath.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "./node_modules/lodash/_toKey.js");

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),

/***/ "./node_modules/lodash/_baseGetAllKeys.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_baseGetAllKeys.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./node_modules/lodash/_arrayPush.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js");

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),

/***/ "./node_modules/lodash/_baseGetTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "./node_modules/lodash/_baseGt.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_baseGt.js ***!
  \****************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.gt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than `other`,
 *  else `false`.
 */
function baseGt(value, other) {
  return value > other;
}

module.exports = baseGt;


/***/ }),

/***/ "./node_modules/lodash/_baseHas.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseHas.js ***!
  \*****************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

module.exports = baseHas;


/***/ }),

/***/ "./node_modules/lodash/_baseHasIn.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseHasIn.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;


/***/ }),

/***/ "./node_modules/lodash/_baseIndexOf.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseIndexOf.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseFindIndex = __webpack_require__(/*! ./_baseFindIndex */ "./node_modules/lodash/_baseFindIndex.js"),
    baseIsNaN = __webpack_require__(/*! ./_baseIsNaN */ "./node_modules/lodash/_baseIsNaN.js"),
    strictIndexOf = __webpack_require__(/*! ./_strictIndexOf */ "./node_modules/lodash/_strictIndexOf.js");

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;


/***/ }),

/***/ "./node_modules/lodash/_baseIsArguments.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsArguments.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ "./node_modules/lodash/_baseIsEqual.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseIsEqual.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsEqualDeep = __webpack_require__(/*! ./_baseIsEqualDeep */ "./node_modules/lodash/_baseIsEqualDeep.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),

/***/ "./node_modules/lodash/_baseIsEqualDeep.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsEqualDeep.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(/*! ./_Stack */ "./node_modules/lodash/_Stack.js"),
    equalArrays = __webpack_require__(/*! ./_equalArrays */ "./node_modules/lodash/_equalArrays.js"),
    equalByTag = __webpack_require__(/*! ./_equalByTag */ "./node_modules/lodash/_equalByTag.js"),
    equalObjects = __webpack_require__(/*! ./_equalObjects */ "./node_modules/lodash/_equalObjects.js"),
    getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "./node_modules/lodash/isTypedArray.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),

/***/ "./node_modules/lodash/_baseIsMap.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsMap.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;


/***/ }),

/***/ "./node_modules/lodash/_baseIsMatch.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseIsMatch.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(/*! ./_Stack */ "./node_modules/lodash/_Stack.js"),
    baseIsEqual = __webpack_require__(/*! ./_baseIsEqual */ "./node_modules/lodash/_baseIsEqual.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;


/***/ }),

/***/ "./node_modules/lodash/_baseIsNaN.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsNaN.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;


/***/ }),

/***/ "./node_modules/lodash/_baseIsNative.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseIsNative.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isMasked = __webpack_require__(/*! ./_isMasked */ "./node_modules/lodash/_isMasked.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./node_modules/lodash/_toSource.js");

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ "./node_modules/lodash/_baseIsSet.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsSet.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;


/***/ }),

/***/ "./node_modules/lodash/_baseIsTypedArray.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_baseIsTypedArray.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),

/***/ "./node_modules/lodash/_baseIteratee.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseIteratee.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseMatches = __webpack_require__(/*! ./_baseMatches */ "./node_modules/lodash/_baseMatches.js"),
    baseMatchesProperty = __webpack_require__(/*! ./_baseMatchesProperty */ "./node_modules/lodash/_baseMatchesProperty.js"),
    identity = __webpack_require__(/*! ./identity */ "./node_modules/lodash/identity.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    property = __webpack_require__(/*! ./property */ "./node_modules/lodash/property.js");

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;


/***/ }),

/***/ "./node_modules/lodash/_baseKeys.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseKeys.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js"),
    nativeKeys = __webpack_require__(/*! ./_nativeKeys */ "./node_modules/lodash/_nativeKeys.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),

/***/ "./node_modules/lodash/_baseKeysIn.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseKeysIn.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js"),
    nativeKeysIn = __webpack_require__(/*! ./_nativeKeysIn */ "./node_modules/lodash/_nativeKeysIn.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),

/***/ "./node_modules/lodash/_baseLt.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_baseLt.js ***!
  \****************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.lt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than `other`,
 *  else `false`.
 */
function baseLt(value, other) {
  return value < other;
}

module.exports = baseLt;


/***/ }),

/***/ "./node_modules/lodash/_baseMap.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseMap.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseEach = __webpack_require__(/*! ./_baseEach */ "./node_modules/lodash/_baseEach.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js");

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;


/***/ }),

/***/ "./node_modules/lodash/_baseMatches.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseMatches.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsMatch = __webpack_require__(/*! ./_baseIsMatch */ "./node_modules/lodash/_baseIsMatch.js"),
    getMatchData = __webpack_require__(/*! ./_getMatchData */ "./node_modules/lodash/_getMatchData.js"),
    matchesStrictComparable = __webpack_require__(/*! ./_matchesStrictComparable */ "./node_modules/lodash/_matchesStrictComparable.js");

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;


/***/ }),

/***/ "./node_modules/lodash/_baseMatchesProperty.js":
/*!*****************************************************!*\
  !*** ./node_modules/lodash/_baseMatchesProperty.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsEqual = __webpack_require__(/*! ./_baseIsEqual */ "./node_modules/lodash/_baseIsEqual.js"),
    get = __webpack_require__(/*! ./get */ "./node_modules/lodash/get.js"),
    hasIn = __webpack_require__(/*! ./hasIn */ "./node_modules/lodash/hasIn.js"),
    isKey = __webpack_require__(/*! ./_isKey */ "./node_modules/lodash/_isKey.js"),
    isStrictComparable = __webpack_require__(/*! ./_isStrictComparable */ "./node_modules/lodash/_isStrictComparable.js"),
    matchesStrictComparable = __webpack_require__(/*! ./_matchesStrictComparable */ "./node_modules/lodash/_matchesStrictComparable.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "./node_modules/lodash/_toKey.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;


/***/ }),

/***/ "./node_modules/lodash/_baseMerge.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseMerge.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(/*! ./_Stack */ "./node_modules/lodash/_Stack.js"),
    assignMergeValue = __webpack_require__(/*! ./_assignMergeValue */ "./node_modules/lodash/_assignMergeValue.js"),
    baseFor = __webpack_require__(/*! ./_baseFor */ "./node_modules/lodash/_baseFor.js"),
    baseMergeDeep = __webpack_require__(/*! ./_baseMergeDeep */ "./node_modules/lodash/_baseMergeDeep.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js"),
    safeGet = __webpack_require__(/*! ./_safeGet */ "./node_modules/lodash/_safeGet.js");

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack || (stack = new Stack);
    if (isObject(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

module.exports = baseMerge;


/***/ }),

/***/ "./node_modules/lodash/_baseMergeDeep.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_baseMergeDeep.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assignMergeValue = __webpack_require__(/*! ./_assignMergeValue */ "./node_modules/lodash/_assignMergeValue.js"),
    cloneBuffer = __webpack_require__(/*! ./_cloneBuffer */ "./node_modules/lodash/_cloneBuffer.js"),
    cloneTypedArray = __webpack_require__(/*! ./_cloneTypedArray */ "./node_modules/lodash/_cloneTypedArray.js"),
    copyArray = __webpack_require__(/*! ./_copyArray */ "./node_modules/lodash/_copyArray.js"),
    initCloneObject = __webpack_require__(/*! ./_initCloneObject */ "./node_modules/lodash/_initCloneObject.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "./node_modules/lodash/isArrayLikeObject.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isPlainObject = __webpack_require__(/*! ./isPlainObject */ "./node_modules/lodash/isPlainObject.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "./node_modules/lodash/isTypedArray.js"),
    safeGet = __webpack_require__(/*! ./_safeGet */ "./node_modules/lodash/_safeGet.js"),
    toPlainObject = __webpack_require__(/*! ./toPlainObject */ "./node_modules/lodash/toPlainObject.js");

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

module.exports = baseMergeDeep;


/***/ }),

/***/ "./node_modules/lodash/_baseOrderBy.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseOrderBy.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayMap = __webpack_require__(/*! ./_arrayMap */ "./node_modules/lodash/_arrayMap.js"),
    baseGet = __webpack_require__(/*! ./_baseGet */ "./node_modules/lodash/_baseGet.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "./node_modules/lodash/_baseIteratee.js"),
    baseMap = __webpack_require__(/*! ./_baseMap */ "./node_modules/lodash/_baseMap.js"),
    baseSortBy = __webpack_require__(/*! ./_baseSortBy */ "./node_modules/lodash/_baseSortBy.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    compareMultiple = __webpack_require__(/*! ./_compareMultiple */ "./node_modules/lodash/_compareMultiple.js"),
    identity = __webpack_require__(/*! ./identity */ "./node_modules/lodash/identity.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js");

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  if (iteratees.length) {
    iteratees = arrayMap(iteratees, function(iteratee) {
      if (isArray(iteratee)) {
        return function(value) {
          return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
        }
      }
      return iteratee;
    });
  } else {
    iteratees = [identity];
  }

  var index = -1;
  iteratees = arrayMap(iteratees, baseUnary(baseIteratee));

  var result = baseMap(collection, function(value, key, collection) {
    var criteria = arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function(object, other) {
    return compareMultiple(object, other, orders);
  });
}

module.exports = baseOrderBy;


/***/ }),

/***/ "./node_modules/lodash/_basePick.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_basePick.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var basePickBy = __webpack_require__(/*! ./_basePickBy */ "./node_modules/lodash/_basePickBy.js"),
    hasIn = __webpack_require__(/*! ./hasIn */ "./node_modules/lodash/hasIn.js");

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, paths) {
  return basePickBy(object, paths, function(value, path) {
    return hasIn(object, path);
  });
}

module.exports = basePick;


/***/ }),

/***/ "./node_modules/lodash/_basePickBy.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_basePickBy.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGet = __webpack_require__(/*! ./_baseGet */ "./node_modules/lodash/_baseGet.js"),
    baseSet = __webpack_require__(/*! ./_baseSet */ "./node_modules/lodash/_baseSet.js"),
    castPath = __webpack_require__(/*! ./_castPath */ "./node_modules/lodash/_castPath.js");

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = baseGet(object, path);

    if (predicate(value, path)) {
      baseSet(result, castPath(path, object), value);
    }
  }
  return result;
}

module.exports = basePickBy;


/***/ }),

/***/ "./node_modules/lodash/_baseProperty.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseProperty.js ***!
  \**********************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;


/***/ }),

/***/ "./node_modules/lodash/_basePropertyDeep.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_basePropertyDeep.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGet = __webpack_require__(/*! ./_baseGet */ "./node_modules/lodash/_baseGet.js");

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;


/***/ }),

/***/ "./node_modules/lodash/_baseRange.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseRange.js ***!
  \*******************************************/
/***/ ((module) => {

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax = Math.max;

/**
 * The base implementation of `_.range` and `_.rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}

module.exports = baseRange;


/***/ }),

/***/ "./node_modules/lodash/_baseReduce.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseReduce.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.reduce` and `_.reduceRight`, without support
 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initAccum Specify using the first or last element of
 *  `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initAccum
      ? (initAccum = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

module.exports = baseReduce;


/***/ }),

/***/ "./node_modules/lodash/_baseRest.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseRest.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var identity = __webpack_require__(/*! ./identity */ "./node_modules/lodash/identity.js"),
    overRest = __webpack_require__(/*! ./_overRest */ "./node_modules/lodash/_overRest.js"),
    setToString = __webpack_require__(/*! ./_setToString */ "./node_modules/lodash/_setToString.js");

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ }),

/***/ "./node_modules/lodash/_baseSet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseSet.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assignValue = __webpack_require__(/*! ./_assignValue */ "./node_modules/lodash/_assignValue.js"),
    castPath = __webpack_require__(/*! ./_castPath */ "./node_modules/lodash/_castPath.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "./node_modules/lodash/_isIndex.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "./node_modules/lodash/_toKey.js");

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return object;
    }

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;


/***/ }),

/***/ "./node_modules/lodash/_baseSetToString.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseSetToString.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var constant = __webpack_require__(/*! ./constant */ "./node_modules/lodash/constant.js"),
    defineProperty = __webpack_require__(/*! ./_defineProperty */ "./node_modules/lodash/_defineProperty.js"),
    identity = __webpack_require__(/*! ./identity */ "./node_modules/lodash/identity.js");

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),

/***/ "./node_modules/lodash/_baseSortBy.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseSortBy.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

module.exports = baseSortBy;


/***/ }),

/***/ "./node_modules/lodash/_baseTimes.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseTimes.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),

/***/ "./node_modules/lodash/_baseToString.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseToString.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ "./node_modules/lodash/_arrayMap.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),

/***/ "./node_modules/lodash/_baseTrim.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseTrim.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var trimmedEndIndex = __webpack_require__(/*! ./_trimmedEndIndex */ "./node_modules/lodash/_trimmedEndIndex.js");

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

module.exports = baseTrim;


/***/ }),

/***/ "./node_modules/lodash/_baseUnary.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseUnary.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ "./node_modules/lodash/_baseUniq.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseUniq.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var SetCache = __webpack_require__(/*! ./_SetCache */ "./node_modules/lodash/_SetCache.js"),
    arrayIncludes = __webpack_require__(/*! ./_arrayIncludes */ "./node_modules/lodash/_arrayIncludes.js"),
    arrayIncludesWith = __webpack_require__(/*! ./_arrayIncludesWith */ "./node_modules/lodash/_arrayIncludesWith.js"),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ "./node_modules/lodash/_cacheHas.js"),
    createSet = __webpack_require__(/*! ./_createSet */ "./node_modules/lodash/_createSet.js"),
    setToArray = __webpack_require__(/*! ./_setToArray */ "./node_modules/lodash/_setToArray.js");

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;


/***/ }),

/***/ "./node_modules/lodash/_baseValues.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseValues.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayMap = __webpack_require__(/*! ./_arrayMap */ "./node_modules/lodash/_arrayMap.js");

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;


/***/ }),

/***/ "./node_modules/lodash/_baseZipObject.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_baseZipObject.js ***!
  \***********************************************/
/***/ ((module) => {

/**
 * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
 *
 * @private
 * @param {Array} props The property identifiers.
 * @param {Array} values The property values.
 * @param {Function} assignFunc The function to assign values.
 * @returns {Object} Returns the new object.
 */
function baseZipObject(props, values, assignFunc) {
  var index = -1,
      length = props.length,
      valsLength = values.length,
      result = {};

  while (++index < length) {
    var value = index < valsLength ? values[index] : undefined;
    assignFunc(result, props[index], value);
  }
  return result;
}

module.exports = baseZipObject;


/***/ }),

/***/ "./node_modules/lodash/_cacheHas.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_cacheHas.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),

/***/ "./node_modules/lodash/_castFunction.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_castFunction.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var identity = __webpack_require__(/*! ./identity */ "./node_modules/lodash/identity.js");

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;


/***/ }),

/***/ "./node_modules/lodash/_castPath.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_castPath.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isKey = __webpack_require__(/*! ./_isKey */ "./node_modules/lodash/_isKey.js"),
    stringToPath = __webpack_require__(/*! ./_stringToPath */ "./node_modules/lodash/_stringToPath.js"),
    toString = __webpack_require__(/*! ./toString */ "./node_modules/lodash/toString.js");

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),

/***/ "./node_modules/lodash/_cloneArrayBuffer.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_cloneArrayBuffer.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Uint8Array = __webpack_require__(/*! ./_Uint8Array */ "./node_modules/lodash/_Uint8Array.js");

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),

/***/ "./node_modules/lodash/_cloneBuffer.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneBuffer.js ***!
  \*********************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;


/***/ }),

/***/ "./node_modules/lodash/_cloneDataView.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_cloneDataView.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./node_modules/lodash/_cloneArrayBuffer.js");

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),

/***/ "./node_modules/lodash/_cloneRegExp.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneRegExp.js ***!
  \*********************************************/
/***/ ((module) => {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),

/***/ "./node_modules/lodash/_cloneSymbol.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneSymbol.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),

/***/ "./node_modules/lodash/_cloneTypedArray.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_cloneTypedArray.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./node_modules/lodash/_cloneArrayBuffer.js");

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),

/***/ "./node_modules/lodash/_compareAscending.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_compareAscending.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

module.exports = compareAscending;


/***/ }),

/***/ "./node_modules/lodash/_compareMultiple.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_compareMultiple.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var compareAscending = __webpack_require__(/*! ./_compareAscending */ "./node_modules/lodash/_compareAscending.js");

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

module.exports = compareMultiple;


/***/ }),

/***/ "./node_modules/lodash/_copyArray.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_copyArray.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),

/***/ "./node_modules/lodash/_copyObject.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_copyObject.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assignValue = __webpack_require__(/*! ./_assignValue */ "./node_modules/lodash/_assignValue.js"),
    baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./node_modules/lodash/_baseAssignValue.js");

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),

/***/ "./node_modules/lodash/_copySymbols.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_copySymbols.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./node_modules/lodash/_getSymbols.js");

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),

/***/ "./node_modules/lodash/_copySymbolsIn.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_copySymbolsIn.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    getSymbolsIn = __webpack_require__(/*! ./_getSymbolsIn */ "./node_modules/lodash/_getSymbolsIn.js");

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),

/***/ "./node_modules/lodash/_coreJsData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_coreJsData.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ "./node_modules/lodash/_createAssigner.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_createAssigner.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseRest = __webpack_require__(/*! ./_baseRest */ "./node_modules/lodash/_baseRest.js"),
    isIterateeCall = __webpack_require__(/*! ./_isIterateeCall */ "./node_modules/lodash/_isIterateeCall.js");

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;


/***/ }),

/***/ "./node_modules/lodash/_createBaseEach.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_createBaseEach.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js");

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;


/***/ }),

/***/ "./node_modules/lodash/_createBaseFor.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_createBaseFor.js ***!
  \***********************************************/
/***/ ((module) => {

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;


/***/ }),

/***/ "./node_modules/lodash/_createFind.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_createFind.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "./node_modules/lodash/_baseIteratee.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;


/***/ }),

/***/ "./node_modules/lodash/_createRange.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_createRange.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseRange = __webpack_require__(/*! ./_baseRange */ "./node_modules/lodash/_baseRange.js"),
    isIterateeCall = __webpack_require__(/*! ./_isIterateeCall */ "./node_modules/lodash/_isIterateeCall.js"),
    toFinite = __webpack_require__(/*! ./toFinite */ "./node_modules/lodash/toFinite.js");

/**
 * Creates a `_.range` or `_.rangeRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new range function.
 */
function createRange(fromRight) {
  return function(start, end, step) {
    if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
      end = step = undefined;
    }
    // Ensure the sign of `-0` is preserved.
    start = toFinite(start);
    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = toFinite(end);
    }
    step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
    return baseRange(start, end, step, fromRight);
  };
}

module.exports = createRange;


/***/ }),

/***/ "./node_modules/lodash/_createSet.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_createSet.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Set = __webpack_require__(/*! ./_Set */ "./node_modules/lodash/_Set.js"),
    noop = __webpack_require__(/*! ./noop */ "./node_modules/lodash/noop.js"),
    setToArray = __webpack_require__(/*! ./_setToArray */ "./node_modules/lodash/_setToArray.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

module.exports = createSet;


/***/ }),

/***/ "./node_modules/lodash/_defineProperty.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_defineProperty.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ "./node_modules/lodash/_equalArrays.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_equalArrays.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var SetCache = __webpack_require__(/*! ./_SetCache */ "./node_modules/lodash/_SetCache.js"),
    arraySome = __webpack_require__(/*! ./_arraySome */ "./node_modules/lodash/_arraySome.js"),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ "./node_modules/lodash/_cacheHas.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),

/***/ "./node_modules/lodash/_equalByTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_equalByTag.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    Uint8Array = __webpack_require__(/*! ./_Uint8Array */ "./node_modules/lodash/_Uint8Array.js"),
    eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js"),
    equalArrays = __webpack_require__(/*! ./_equalArrays */ "./node_modules/lodash/_equalArrays.js"),
    mapToArray = __webpack_require__(/*! ./_mapToArray */ "./node_modules/lodash/_mapToArray.js"),
    setToArray = __webpack_require__(/*! ./_setToArray */ "./node_modules/lodash/_setToArray.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),

/***/ "./node_modules/lodash/_equalObjects.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_equalObjects.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getAllKeys = __webpack_require__(/*! ./_getAllKeys */ "./node_modules/lodash/_getAllKeys.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),

/***/ "./node_modules/lodash/_flatRest.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_flatRest.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var flatten = __webpack_require__(/*! ./flatten */ "./node_modules/lodash/flatten.js"),
    overRest = __webpack_require__(/*! ./_overRest */ "./node_modules/lodash/_overRest.js"),
    setToString = __webpack_require__(/*! ./_setToString */ "./node_modules/lodash/_setToString.js");

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;


/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ "./node_modules/lodash/_getAllKeys.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getAllKeys.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ "./node_modules/lodash/_baseGetAllKeys.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./node_modules/lodash/_getSymbols.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),

/***/ "./node_modules/lodash/_getAllKeysIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getAllKeysIn.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ "./node_modules/lodash/_baseGetAllKeys.js"),
    getSymbolsIn = __webpack_require__(/*! ./_getSymbolsIn */ "./node_modules/lodash/_getSymbolsIn.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),

/***/ "./node_modules/lodash/_getMapData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getMapData.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isKeyable = __webpack_require__(/*! ./_isKeyable */ "./node_modules/lodash/_isKeyable.js");

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ "./node_modules/lodash/_getMatchData.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getMatchData.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isStrictComparable = __webpack_require__(/*! ./_isStrictComparable */ "./node_modules/lodash/_isStrictComparable.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;


/***/ }),

/***/ "./node_modules/lodash/_getNative.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getNative.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsNative = __webpack_require__(/*! ./_baseIsNative */ "./node_modules/lodash/_baseIsNative.js"),
    getValue = __webpack_require__(/*! ./_getValue */ "./node_modules/lodash/_getValue.js");

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ "./node_modules/lodash/_getPrototype.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getPrototype.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(/*! ./_overArg */ "./node_modules/lodash/_overArg.js");

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),

/***/ "./node_modules/lodash/_getRawTag.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "./node_modules/lodash/_getSymbols.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getSymbols.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "./node_modules/lodash/_arrayFilter.js"),
    stubArray = __webpack_require__(/*! ./stubArray */ "./node_modules/lodash/stubArray.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),

/***/ "./node_modules/lodash/_getSymbolsIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getSymbolsIn.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./node_modules/lodash/_arrayPush.js"),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ "./node_modules/lodash/_getPrototype.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./node_modules/lodash/_getSymbols.js"),
    stubArray = __webpack_require__(/*! ./stubArray */ "./node_modules/lodash/stubArray.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),

/***/ "./node_modules/lodash/_getTag.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_getTag.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DataView = __webpack_require__(/*! ./_DataView */ "./node_modules/lodash/_DataView.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js"),
    Promise = __webpack_require__(/*! ./_Promise */ "./node_modules/lodash/_Promise.js"),
    Set = __webpack_require__(/*! ./_Set */ "./node_modules/lodash/_Set.js"),
    WeakMap = __webpack_require__(/*! ./_WeakMap */ "./node_modules/lodash/_WeakMap.js"),
    baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./node_modules/lodash/_toSource.js");

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),

/***/ "./node_modules/lodash/_getValue.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_getValue.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ "./node_modules/lodash/_hasPath.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hasPath.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var castPath = __webpack_require__(/*! ./_castPath */ "./node_modules/lodash/_castPath.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "./node_modules/lodash/_isIndex.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "./node_modules/lodash/_toKey.js");

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;


/***/ }),

/***/ "./node_modules/lodash/_hasUnicode.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_hasUnicode.js ***!
  \********************************************/
/***/ ((module) => {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

module.exports = hasUnicode;


/***/ }),

/***/ "./node_modules/lodash/_hashClear.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_hashClear.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ "./node_modules/lodash/_hashDelete.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_hashDelete.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ "./node_modules/lodash/_hashGet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashGet.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ "./node_modules/lodash/_hashHas.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashHas.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ "./node_modules/lodash/_hashSet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashSet.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ "./node_modules/lodash/_initCloneArray.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_initCloneArray.js ***!
  \************************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),

/***/ "./node_modules/lodash/_initCloneByTag.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_initCloneByTag.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./node_modules/lodash/_cloneArrayBuffer.js"),
    cloneDataView = __webpack_require__(/*! ./_cloneDataView */ "./node_modules/lodash/_cloneDataView.js"),
    cloneRegExp = __webpack_require__(/*! ./_cloneRegExp */ "./node_modules/lodash/_cloneRegExp.js"),
    cloneSymbol = __webpack_require__(/*! ./_cloneSymbol */ "./node_modules/lodash/_cloneSymbol.js"),
    cloneTypedArray = __webpack_require__(/*! ./_cloneTypedArray */ "./node_modules/lodash/_cloneTypedArray.js");

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),

/***/ "./node_modules/lodash/_initCloneObject.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_initCloneObject.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseCreate = __webpack_require__(/*! ./_baseCreate */ "./node_modules/lodash/_baseCreate.js"),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ "./node_modules/lodash/_getPrototype.js"),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js");

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),

/***/ "./node_modules/lodash/_isFlattenable.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_isFlattenable.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js");

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ }),

/***/ "./node_modules/lodash/_isIndex.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_isIndex.js ***!
  \*****************************************/
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ "./node_modules/lodash/_isIterateeCall.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_isIterateeCall.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "./node_modules/lodash/_isIndex.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),

/***/ "./node_modules/lodash/_isKey.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_isKey.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),

/***/ "./node_modules/lodash/_isKeyable.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_isKeyable.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ "./node_modules/lodash/_isMasked.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_isMasked.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var coreJsData = __webpack_require__(/*! ./_coreJsData */ "./node_modules/lodash/_coreJsData.js");

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ "./node_modules/lodash/_isPrototype.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_isPrototype.js ***!
  \*********************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),

/***/ "./node_modules/lodash/_isStrictComparable.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash/_isStrictComparable.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;


/***/ }),

/***/ "./node_modules/lodash/_listCacheClear.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_listCacheClear.js ***!
  \************************************************/
/***/ ((module) => {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_listCacheDelete.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_listCacheDelete.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_listCacheGet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheGet.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_listCacheHas.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheHas.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_listCacheSet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheSet.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheClear.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_mapCacheClear.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Hash = __webpack_require__(/*! ./_Hash */ "./node_modules/lodash/_Hash.js"),
    ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js");

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheDelete.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_mapCacheDelete.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheGet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheGet.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheHas.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheSet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheSet.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_mapToArray.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_mapToArray.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),

/***/ "./node_modules/lodash/_matchesStrictComparable.js":
/*!*********************************************************!*\
  !*** ./node_modules/lodash/_matchesStrictComparable.js ***!
  \*********************************************************/
/***/ ((module) => {

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;


/***/ }),

/***/ "./node_modules/lodash/_memoizeCapped.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_memoizeCapped.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var memoize = __webpack_require__(/*! ./memoize */ "./node_modules/lodash/memoize.js");

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),

/***/ "./node_modules/lodash/_nativeCreate.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeCreate.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ "./node_modules/lodash/_nativeKeys.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_nativeKeys.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(/*! ./_overArg */ "./node_modules/lodash/_overArg.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ "./node_modules/lodash/_nativeKeysIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeKeysIn.js ***!
  \**********************************************/
/***/ ((module) => {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),

/***/ "./node_modules/lodash/_nodeUtil.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_nodeUtil.js ***!
  \******************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;


/***/ }),

/***/ "./node_modules/lodash/_objectToString.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "./node_modules/lodash/_overArg.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_overArg.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ "./node_modules/lodash/_overRest.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_overRest.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var apply = __webpack_require__(/*! ./_apply */ "./node_modules/lodash/_apply.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),

/***/ "./node_modules/lodash/_root.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "./node_modules/lodash/_safeGet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_safeGet.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

module.exports = safeGet;


/***/ }),

/***/ "./node_modules/lodash/_setCacheAdd.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setCacheAdd.js ***!
  \*********************************************/
/***/ ((module) => {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),

/***/ "./node_modules/lodash/_setCacheHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setCacheHas.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_setToArray.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_setToArray.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),

/***/ "./node_modules/lodash/_setToString.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setToString.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseSetToString = __webpack_require__(/*! ./_baseSetToString */ "./node_modules/lodash/_baseSetToString.js"),
    shortOut = __webpack_require__(/*! ./_shortOut */ "./node_modules/lodash/_shortOut.js");

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),

/***/ "./node_modules/lodash/_shortOut.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_shortOut.js ***!
  \******************************************/
/***/ ((module) => {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),

/***/ "./node_modules/lodash/_stackClear.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_stackClear.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js");

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),

/***/ "./node_modules/lodash/_stackDelete.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_stackDelete.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),

/***/ "./node_modules/lodash/_stackGet.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackGet.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),

/***/ "./node_modules/lodash/_stackHas.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackHas.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),

/***/ "./node_modules/lodash/_stackSet.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackSet.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js"),
    MapCache = __webpack_require__(/*! ./_MapCache */ "./node_modules/lodash/_MapCache.js");

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),

/***/ "./node_modules/lodash/_strictIndexOf.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_strictIndexOf.js ***!
  \***********************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;


/***/ }),

/***/ "./node_modules/lodash/_stringSize.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_stringSize.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var asciiSize = __webpack_require__(/*! ./_asciiSize */ "./node_modules/lodash/_asciiSize.js"),
    hasUnicode = __webpack_require__(/*! ./_hasUnicode */ "./node_modules/lodash/_hasUnicode.js"),
    unicodeSize = __webpack_require__(/*! ./_unicodeSize */ "./node_modules/lodash/_unicodeSize.js");

/**
 * Gets the number of symbols in `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the string size.
 */
function stringSize(string) {
  return hasUnicode(string)
    ? unicodeSize(string)
    : asciiSize(string);
}

module.exports = stringSize;


/***/ }),

/***/ "./node_modules/lodash/_stringToPath.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_stringToPath.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var memoizeCapped = __webpack_require__(/*! ./_memoizeCapped */ "./node_modules/lodash/_memoizeCapped.js");

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),

/***/ "./node_modules/lodash/_toKey.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_toKey.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),

/***/ "./node_modules/lodash/_toSource.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_toSource.js ***!
  \******************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ "./node_modules/lodash/_trimmedEndIndex.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_trimmedEndIndex.js ***!
  \*************************************************/
/***/ ((module) => {

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

module.exports = trimmedEndIndex;


/***/ }),

/***/ "./node_modules/lodash/_unicodeSize.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_unicodeSize.js ***!
  \*********************************************/
/***/ ((module) => {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Gets the size of a Unicode `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
function unicodeSize(string) {
  var result = reUnicode.lastIndex = 0;
  while (reUnicode.test(string)) {
    ++result;
  }
  return result;
}

module.exports = unicodeSize;


/***/ }),

/***/ "./node_modules/lodash/clone.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/clone.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseClone = __webpack_require__(/*! ./_baseClone */ "./node_modules/lodash/_baseClone.js");

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG);
}

module.exports = clone;


/***/ }),

/***/ "./node_modules/lodash/cloneDeep.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/cloneDeep.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseClone = __webpack_require__(/*! ./_baseClone */ "./node_modules/lodash/_baseClone.js");

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;


/***/ }),

/***/ "./node_modules/lodash/constant.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/constant.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),

/***/ "./node_modules/lodash/defaults.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/defaults.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseRest = __webpack_require__(/*! ./_baseRest */ "./node_modules/lodash/_baseRest.js"),
    eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js"),
    isIterateeCall = __webpack_require__(/*! ./_isIterateeCall */ "./node_modules/lodash/_isIterateeCall.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest(function(object, sources) {
  object = Object(object);

  var index = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : undefined;

  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
    length = 1;
  }

  while (++index < length) {
    var source = sources[index];
    var props = keysIn(source);
    var propsIndex = -1;
    var propsLength = props.length;

    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];

      if (value === undefined ||
          (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        object[key] = source[key];
      }
    }
  }

  return object;
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/lodash/each.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/each.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./forEach */ "./node_modules/lodash/forEach.js");


/***/ }),

/***/ "./node_modules/lodash/eq.js":
/*!***********************************!*\
  !*** ./node_modules/lodash/eq.js ***!
  \***********************************/
/***/ ((module) => {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ "./node_modules/lodash/filter.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/filter.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "./node_modules/lodash/_arrayFilter.js"),
    baseFilter = __webpack_require__(/*! ./_baseFilter */ "./node_modules/lodash/_baseFilter.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "./node_modules/lodash/_baseIteratee.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js");

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 *
 * // Combining several predicates using `_.overEvery` or `_.overSome`.
 * _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
 * // => objects for ['fred', 'barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = filter;


/***/ }),

/***/ "./node_modules/lodash/find.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/find.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var createFind = __webpack_require__(/*! ./_createFind */ "./node_modules/lodash/_createFind.js"),
    findIndex = __webpack_require__(/*! ./findIndex */ "./node_modules/lodash/findIndex.js");

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;


/***/ }),

/***/ "./node_modules/lodash/findIndex.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/findIndex.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseFindIndex = __webpack_require__(/*! ./_baseFindIndex */ "./node_modules/lodash/_baseFindIndex.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "./node_modules/lodash/_baseIteratee.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "./node_modules/lodash/toInteger.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;


/***/ }),

/***/ "./node_modules/lodash/flatten.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/flatten.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "./node_modules/lodash/_baseFlatten.js");

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;


/***/ }),

/***/ "./node_modules/lodash/forEach.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/forEach.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayEach = __webpack_require__(/*! ./_arrayEach */ "./node_modules/lodash/_arrayEach.js"),
    baseEach = __webpack_require__(/*! ./_baseEach */ "./node_modules/lodash/_baseEach.js"),
    castFunction = __webpack_require__(/*! ./_castFunction */ "./node_modules/lodash/_castFunction.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js");

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;


/***/ }),

/***/ "./node_modules/lodash/forIn.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/forIn.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseFor = __webpack_require__(/*! ./_baseFor */ "./node_modules/lodash/_baseFor.js"),
    castFunction = __webpack_require__(/*! ./_castFunction */ "./node_modules/lodash/_castFunction.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/**
 * Iterates over own and inherited enumerable string keyed properties of an
 * object and invokes `iteratee` for each property. The iteratee is invoked
 * with three arguments: (value, key, object). Iteratee functions may exit
 * iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 0.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forInRight
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forIn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
 */
function forIn(object, iteratee) {
  return object == null
    ? object
    : baseFor(object, castFunction(iteratee), keysIn);
}

module.exports = forIn;


/***/ }),

/***/ "./node_modules/lodash/get.js":
/*!************************************!*\
  !*** ./node_modules/lodash/get.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGet = __webpack_require__(/*! ./_baseGet */ "./node_modules/lodash/_baseGet.js");

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),

/***/ "./node_modules/lodash/has.js":
/*!************************************!*\
  !*** ./node_modules/lodash/has.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseHas = __webpack_require__(/*! ./_baseHas */ "./node_modules/lodash/_baseHas.js"),
    hasPath = __webpack_require__(/*! ./_hasPath */ "./node_modules/lodash/_hasPath.js");

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;


/***/ }),

/***/ "./node_modules/lodash/hasIn.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/hasIn.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseHasIn = __webpack_require__(/*! ./_baseHasIn */ "./node_modules/lodash/_baseHasIn.js"),
    hasPath = __webpack_require__(/*! ./_hasPath */ "./node_modules/lodash/_hasPath.js");

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;


/***/ }),

/***/ "./node_modules/lodash/identity.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/identity.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),

/***/ "./node_modules/lodash/isArguments.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArguments.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsArguments = __webpack_require__(/*! ./_baseIsArguments */ "./node_modules/lodash/_baseIsArguments.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ "./node_modules/lodash/isArray.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/isArray.js ***!
  \****************************************/
/***/ ((module) => {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ "./node_modules/lodash/isArrayLike.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArrayLike.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js");

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ "./node_modules/lodash/isArrayLikeObject.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/isArrayLikeObject.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;


/***/ }),

/***/ "./node_modules/lodash/isBuffer.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isBuffer.js ***!
  \*****************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js"),
    stubFalse = __webpack_require__(/*! ./stubFalse */ "./node_modules/lodash/stubFalse.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;


/***/ }),

/***/ "./node_modules/lodash/isEmpty.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/isEmpty.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseKeys = __webpack_require__(/*! ./_baseKeys */ "./node_modules/lodash/_baseKeys.js"),
    getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "./node_modules/lodash/isTypedArray.js");

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

module.exports = isEmpty;


/***/ }),

/***/ "./node_modules/lodash/isFunction.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/isFunction.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ "./node_modules/lodash/isLength.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isLength.js ***!
  \*****************************************/
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ "./node_modules/lodash/isMap.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/isMap.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsMap = __webpack_require__(/*! ./_baseIsMap */ "./node_modules/lodash/_baseIsMap.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;


/***/ }),

/***/ "./node_modules/lodash/isObject.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ "./node_modules/lodash/isObjectLike.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isObjectLike.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ "./node_modules/lodash/isPlainObject.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/isPlainObject.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ "./node_modules/lodash/_getPrototype.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ }),

/***/ "./node_modules/lodash/isSet.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/isSet.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsSet = __webpack_require__(/*! ./_baseIsSet */ "./node_modules/lodash/_baseIsSet.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;


/***/ }),

/***/ "./node_modules/lodash/isString.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isString.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

module.exports = isString;


/***/ }),

/***/ "./node_modules/lodash/isSymbol.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isSymbol.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ "./node_modules/lodash/isTypedArray.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isTypedArray.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsTypedArray = __webpack_require__(/*! ./_baseIsTypedArray */ "./node_modules/lodash/_baseIsTypedArray.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),

/***/ "./node_modules/lodash/isUndefined.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isUndefined.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

module.exports = isUndefined;


/***/ }),

/***/ "./node_modules/lodash/keys.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/keys.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "./node_modules/lodash/_arrayLikeKeys.js"),
    baseKeys = __webpack_require__(/*! ./_baseKeys */ "./node_modules/lodash/_baseKeys.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js");

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),

/***/ "./node_modules/lodash/keysIn.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/keysIn.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "./node_modules/lodash/_arrayLikeKeys.js"),
    baseKeysIn = __webpack_require__(/*! ./_baseKeysIn */ "./node_modules/lodash/_baseKeysIn.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js");

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),

/***/ "./node_modules/lodash/last.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/last.js ***!
  \*************************************/
/***/ ((module) => {

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;


/***/ }),

/***/ "./node_modules/lodash/map.js":
/*!************************************!*\
  !*** ./node_modules/lodash/map.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayMap = __webpack_require__(/*! ./_arrayMap */ "./node_modules/lodash/_arrayMap.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "./node_modules/lodash/_baseIteratee.js"),
    baseMap = __webpack_require__(/*! ./_baseMap */ "./node_modules/lodash/_baseMap.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js");

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;


/***/ }),

/***/ "./node_modules/lodash/mapValues.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/mapValues.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./node_modules/lodash/_baseAssignValue.js"),
    baseForOwn = __webpack_require__(/*! ./_baseForOwn */ "./node_modules/lodash/_baseForOwn.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "./node_modules/lodash/_baseIteratee.js");

/**
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapKeys
 * @example
 *
 * var users = {
 *   'fred':    { 'user': 'fred',    'age': 40 },
 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
 * };
 *
 * _.mapValues(users, function(o) { return o.age; });
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 *
 * // The `_.property` iteratee shorthand.
 * _.mapValues(users, 'age');
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 */
function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee, 3);

  baseForOwn(object, function(value, key, object) {
    baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}

module.exports = mapValues;


/***/ }),

/***/ "./node_modules/lodash/max.js":
/*!************************************!*\
  !*** ./node_modules/lodash/max.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseExtremum = __webpack_require__(/*! ./_baseExtremum */ "./node_modules/lodash/_baseExtremum.js"),
    baseGt = __webpack_require__(/*! ./_baseGt */ "./node_modules/lodash/_baseGt.js"),
    identity = __webpack_require__(/*! ./identity */ "./node_modules/lodash/identity.js");

/**
 * Computes the maximum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * _.max([]);
 * // => undefined
 */
function max(array) {
  return (array && array.length)
    ? baseExtremum(array, identity, baseGt)
    : undefined;
}

module.exports = max;


/***/ }),

/***/ "./node_modules/lodash/memoize.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/memoize.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MapCache = __webpack_require__(/*! ./_MapCache */ "./node_modules/lodash/_MapCache.js");

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),

/***/ "./node_modules/lodash/merge.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/merge.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseMerge = __webpack_require__(/*! ./_baseMerge */ "./node_modules/lodash/_baseMerge.js"),
    createAssigner = __webpack_require__(/*! ./_createAssigner */ "./node_modules/lodash/_createAssigner.js");

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

module.exports = merge;


/***/ }),

/***/ "./node_modules/lodash/min.js":
/*!************************************!*\
  !*** ./node_modules/lodash/min.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseExtremum = __webpack_require__(/*! ./_baseExtremum */ "./node_modules/lodash/_baseExtremum.js"),
    baseLt = __webpack_require__(/*! ./_baseLt */ "./node_modules/lodash/_baseLt.js"),
    identity = __webpack_require__(/*! ./identity */ "./node_modules/lodash/identity.js");

/**
 * Computes the minimum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * _.min([4, 2, 8, 6]);
 * // => 2
 *
 * _.min([]);
 * // => undefined
 */
function min(array) {
  return (array && array.length)
    ? baseExtremum(array, identity, baseLt)
    : undefined;
}

module.exports = min;


/***/ }),

/***/ "./node_modules/lodash/minBy.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/minBy.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseExtremum = __webpack_require__(/*! ./_baseExtremum */ "./node_modules/lodash/_baseExtremum.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "./node_modules/lodash/_baseIteratee.js"),
    baseLt = __webpack_require__(/*! ./_baseLt */ "./node_modules/lodash/_baseLt.js");

/**
 * This method is like `_.min` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * the value is ranked. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * var objects = [{ 'n': 1 }, { 'n': 2 }];
 *
 * _.minBy(objects, function(o) { return o.n; });
 * // => { 'n': 1 }
 *
 * // The `_.property` iteratee shorthand.
 * _.minBy(objects, 'n');
 * // => { 'n': 1 }
 */
function minBy(array, iteratee) {
  return (array && array.length)
    ? baseExtremum(array, baseIteratee(iteratee, 2), baseLt)
    : undefined;
}

module.exports = minBy;


/***/ }),

/***/ "./node_modules/lodash/noop.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/noop.js ***!
  \*************************************/
/***/ ((module) => {

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;


/***/ }),

/***/ "./node_modules/lodash/now.js":
/*!************************************!*\
  !*** ./node_modules/lodash/now.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ }),

/***/ "./node_modules/lodash/pick.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/pick.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var basePick = __webpack_require__(/*! ./_basePick */ "./node_modules/lodash/_basePick.js"),
    flatRest = __webpack_require__(/*! ./_flatRest */ "./node_modules/lodash/_flatRest.js");

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = flatRest(function(object, paths) {
  return object == null ? {} : basePick(object, paths);
});

module.exports = pick;


/***/ }),

/***/ "./node_modules/lodash/property.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/property.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseProperty = __webpack_require__(/*! ./_baseProperty */ "./node_modules/lodash/_baseProperty.js"),
    basePropertyDeep = __webpack_require__(/*! ./_basePropertyDeep */ "./node_modules/lodash/_basePropertyDeep.js"),
    isKey = __webpack_require__(/*! ./_isKey */ "./node_modules/lodash/_isKey.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "./node_modules/lodash/_toKey.js");

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;


/***/ }),

/***/ "./node_modules/lodash/range.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/range.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var createRange = __webpack_require__(/*! ./_createRange */ "./node_modules/lodash/_createRange.js");

/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
 * `start` is specified without an `end` or `step`. If `end` is not specified,
 * it's set to `start` with `start` then set to `0`.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.rangeRight
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(-4);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
var range = createRange();

module.exports = range;


/***/ }),

/***/ "./node_modules/lodash/reduce.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/reduce.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayReduce = __webpack_require__(/*! ./_arrayReduce */ "./node_modules/lodash/_arrayReduce.js"),
    baseEach = __webpack_require__(/*! ./_baseEach */ "./node_modules/lodash/_baseEach.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "./node_modules/lodash/_baseIteratee.js"),
    baseReduce = __webpack_require__(/*! ./_baseReduce */ "./node_modules/lodash/_baseReduce.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js");

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;

  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}

module.exports = reduce;


/***/ }),

/***/ "./node_modules/lodash/size.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/size.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseKeys = __webpack_require__(/*! ./_baseKeys */ "./node_modules/lodash/_baseKeys.js"),
    getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js"),
    isString = __webpack_require__(/*! ./isString */ "./node_modules/lodash/isString.js"),
    stringSize = __webpack_require__(/*! ./_stringSize */ "./node_modules/lodash/_stringSize.js");

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/**
 * Gets the size of `collection` by returning its length for array-like
 * values or the number of own enumerable string keyed properties for objects.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @returns {number} Returns the collection size.
 * @example
 *
 * _.size([1, 2, 3]);
 * // => 3
 *
 * _.size({ 'a': 1, 'b': 2 });
 * // => 2
 *
 * _.size('pebbles');
 * // => 7
 */
function size(collection) {
  if (collection == null) {
    return 0;
  }
  if (isArrayLike(collection)) {
    return isString(collection) ? stringSize(collection) : collection.length;
  }
  var tag = getTag(collection);
  if (tag == mapTag || tag == setTag) {
    return collection.size;
  }
  return baseKeys(collection).length;
}

module.exports = size;


/***/ }),

/***/ "./node_modules/lodash/sortBy.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/sortBy.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "./node_modules/lodash/_baseFlatten.js"),
    baseOrderBy = __webpack_require__(/*! ./_baseOrderBy */ "./node_modules/lodash/_baseOrderBy.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "./node_modules/lodash/_baseRest.js"),
    isIterateeCall = __webpack_require__(/*! ./_isIterateeCall */ "./node_modules/lodash/_isIterateeCall.js");

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 30 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, [function(o) { return o.user; }]);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
 */
var sortBy = baseRest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});

module.exports = sortBy;


/***/ }),

/***/ "./node_modules/lodash/stubArray.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/stubArray.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),

/***/ "./node_modules/lodash/stubFalse.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/stubFalse.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),

/***/ "./node_modules/lodash/toFinite.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/toFinite.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toNumber = __webpack_require__(/*! ./toNumber */ "./node_modules/lodash/toNumber.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ }),

/***/ "./node_modules/lodash/toInteger.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/toInteger.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toFinite = __webpack_require__(/*! ./toFinite */ "./node_modules/lodash/toFinite.js");

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ }),

/***/ "./node_modules/lodash/toNumber.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/toNumber.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTrim = __webpack_require__(/*! ./_baseTrim */ "./node_modules/lodash/_baseTrim.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),

/***/ "./node_modules/lodash/toPlainObject.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/toPlainObject.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

module.exports = toPlainObject;


/***/ }),

/***/ "./node_modules/lodash/toString.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/toString.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseToString = __webpack_require__(/*! ./_baseToString */ "./node_modules/lodash/_baseToString.js");

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),

/***/ "./node_modules/lodash/transform.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/transform.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayEach = __webpack_require__(/*! ./_arrayEach */ "./node_modules/lodash/_arrayEach.js"),
    baseCreate = __webpack_require__(/*! ./_baseCreate */ "./node_modules/lodash/_baseCreate.js"),
    baseForOwn = __webpack_require__(/*! ./_baseForOwn */ "./node_modules/lodash/_baseForOwn.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "./node_modules/lodash/_baseIteratee.js"),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ "./node_modules/lodash/_getPrototype.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "./node_modules/lodash/isTypedArray.js");

/**
 * An alternative to `_.reduce`; this method transforms `object` to a new
 * `accumulator` object which is the result of running each of its own
 * enumerable string keyed properties thru `iteratee`, with each invocation
 * potentially mutating the `accumulator` object. If `accumulator` is not
 * provided, a new object with the same `[[Prototype]]` will be used. The
 * iteratee is invoked with four arguments: (accumulator, value, key, object).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 1.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The custom accumulator value.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * _.transform([2, 3, 4], function(result, n) {
 *   result.push(n *= n);
 *   return n % 2 == 0;
 * }, []);
 * // => [4, 9]
 *
 * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] }
 */
function transform(object, iteratee, accumulator) {
  var isArr = isArray(object),
      isArrLike = isArr || isBuffer(object) || isTypedArray(object);

  iteratee = baseIteratee(iteratee, 4);
  if (accumulator == null) {
    var Ctor = object && object.constructor;
    if (isArrLike) {
      accumulator = isArr ? new Ctor : [];
    }
    else if (isObject(object)) {
      accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
    }
    else {
      accumulator = {};
    }
  }
  (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
    return iteratee(accumulator, value, index, object);
  });
  return accumulator;
}

module.exports = transform;


/***/ }),

/***/ "./node_modules/lodash/union.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/union.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "./node_modules/lodash/_baseFlatten.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "./node_modules/lodash/_baseRest.js"),
    baseUniq = __webpack_require__(/*! ./_baseUniq */ "./node_modules/lodash/_baseUniq.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "./node_modules/lodash/isArrayLikeObject.js");

/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */
var union = baseRest(function(arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});

module.exports = union;


/***/ }),

/***/ "./node_modules/lodash/uniqueId.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/uniqueId.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toString = __webpack_require__(/*! ./toString */ "./node_modules/lodash/toString.js");

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}

module.exports = uniqueId;


/***/ }),

/***/ "./node_modules/lodash/values.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/values.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseValues = __webpack_require__(/*! ./_baseValues */ "./node_modules/lodash/_baseValues.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

module.exports = values;


/***/ }),

/***/ "./node_modules/lodash/zipObject.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/zipObject.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assignValue = __webpack_require__(/*! ./_assignValue */ "./node_modules/lodash/_assignValue.js"),
    baseZipObject = __webpack_require__(/*! ./_baseZipObject */ "./node_modules/lodash/_baseZipObject.js");

/**
 * This method is like `_.fromPairs` except that it accepts two arrays,
 * one of property identifiers and one of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 0.4.0
 * @category Array
 * @param {Array} [props=[]] The property identifiers.
 * @param {Array} [values=[]] The property values.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.zipObject(['a', 'b'], [1, 2]);
 * // => { 'a': 1, 'b': 2 }
 */
function zipObject(props, values) {
  return baseZipObject(props || [], values || [], assignValue);
}

module.exports = zipObject;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdkphOztBQUViLFFBQVEsbUJBQU8sQ0FBQyx1REFBVTs7QUFFMUI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FLFdBQVc7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxjQUFjO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxzQkFBc0I7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxzQkFBc0I7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQjtBQUNuQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbmhCQTtBQUNBO0FBQ0EsU0FBUyxtQkFBTyxDQUFDLHFEQUFTO0FBQzFCLFdBQVcsbUJBQU8sQ0FBQyx5REFBVztBQUM5Qjs7Ozs7Ozs7Ozs7QUNKQSxRQUFRLG1CQUFPLENBQUMsdURBQVU7QUFDMUIsWUFBWSxtQkFBTyxDQUFDLHFEQUFTOztBQUU3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxnQkFBZ0IsMENBQTBDO0FBQzFELEdBQUc7QUFDSDtBQUNBOzs7Ozs7Ozs7OztBQ2pFQTs7QUFFQTs7QUFFQSxJQUFJLElBQTZCO0FBQ2pDO0FBQ0E7QUFDQSxhQUFhLG1CQUFPLENBQUMsb0RBQWM7QUFDbkMsZ0JBQWdCLG1CQUFPLENBQUMsMERBQWlCO0FBQ3pDLFlBQVksbUJBQU8sQ0FBQyxrREFBYTtBQUNqQyxjQUFjLG1CQUFPLENBQUMsc0RBQWU7QUFDckMsWUFBWSxtQkFBTyxDQUFDLGdEQUFZO0FBQ2hDLGVBQWUsbUJBQU8sQ0FBQyx3REFBZ0I7QUFDdkMsZUFBZSxtQkFBTyxDQUFDLHdEQUFnQjtBQUN2QyxrQkFBa0IsbUJBQU8sQ0FBQyw4REFBbUI7QUFDN0MsbUJBQW1CLG1CQUFPLENBQUMsZ0VBQW9CO0FBQy9DLFlBQVksbUJBQU8sQ0FBQyxrREFBYTtBQUNqQyxXQUFXLG1CQUFPLENBQUMsZ0RBQVk7QUFDL0IsY0FBYyxtQkFBTyxDQUFDLHNEQUFlO0FBQ3JDLFlBQVksbUJBQU8sQ0FBQyxrREFBYTtBQUNqQyxpQkFBaUIsbUJBQU8sQ0FBQyw0REFBa0I7QUFDM0MsYUFBYSxtQkFBTyxDQUFDLG9EQUFjO0FBQ25DLGNBQWMsbUJBQU8sQ0FBQyxzREFBZTtBQUNyQztBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2pDQTs7Ozs7Ozs7Ozs7QUNBQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxXQUFXLG1CQUFPLENBQUMsK0NBQVM7O0FBRTVCO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDTkEsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7QUFDeEMsY0FBYyxtQkFBTyxDQUFDLHFEQUFZO0FBQ2xDLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTtBQUNsQyxjQUFjLG1CQUFPLENBQUMscURBQVk7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUMvQkEscUJBQXFCLG1CQUFPLENBQUMsbUVBQW1CO0FBQ2hELHNCQUFzQixtQkFBTyxDQUFDLHFFQUFvQjtBQUNsRCxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCO0FBQzVDLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjs7QUFFNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQy9CQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxXQUFXLG1CQUFPLENBQUMsK0NBQVM7O0FBRTVCO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDTkEsb0JBQW9CLG1CQUFPLENBQUMsaUVBQWtCO0FBQzlDLHFCQUFxQixtQkFBTyxDQUFDLG1FQUFtQjtBQUNoRCxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7QUFDMUMsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCO0FBQzFDLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjs7QUFFMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQy9CQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxXQUFXLG1CQUFPLENBQUMsK0NBQVM7O0FBRTVCO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDTkEsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMsV0FBVyxtQkFBTyxDQUFDLCtDQUFTOztBQUU1QjtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ05BLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTtBQUNwQyxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7QUFDMUMsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDMUJBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQyxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsZUFBZSxtQkFBTyxDQUFDLHVEQUFhO0FBQ3BDLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTs7QUFFcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUMxQkEsV0FBVyxtQkFBTyxDQUFDLCtDQUFTOztBQUU1QjtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ0xBLFdBQVcsbUJBQU8sQ0FBQywrQ0FBUzs7QUFFNUI7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNMQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxXQUFXLG1CQUFPLENBQUMsK0NBQVM7O0FBRTVCO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQixXQUFXLEdBQUc7QUFDZCxXQUFXLE9BQU87QUFDbEIsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsVUFBVTtBQUNyQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN4QkEsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLEdBQUc7QUFDZCxXQUFXLFVBQVU7QUFDckIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3JCQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxrQkFBa0IsbUJBQU8sQ0FBQywyREFBZTtBQUN6QyxjQUFjLG1CQUFPLENBQUMsbURBQVc7QUFDakMsZUFBZSxtQkFBTyxDQUFDLHFEQUFZO0FBQ25DLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTtBQUNsQyxtQkFBbUIsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTNDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLFdBQVcsU0FBUztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsVUFBVTtBQUNyQixXQUFXLEdBQUc7QUFDZCxXQUFXLFNBQVM7QUFDcEI7QUFDQSxhQUFhLEdBQUc7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLFVBQVU7QUFDckIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdEJBLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjs7QUFFNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDWEEsc0JBQXNCLG1CQUFPLENBQUMscUVBQW9CO0FBQ2xELFNBQVMsbUJBQU8sQ0FBQyx5Q0FBTTs7QUFFdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxHQUFHO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbkJBLHNCQUFzQixtQkFBTyxDQUFDLHFFQUFvQjtBQUNsRCxTQUFTLG1CQUFPLENBQUMseUNBQU07O0FBRXZCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsR0FBRztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDM0JBLFNBQVMsbUJBQU8sQ0FBQyx5Q0FBTTs7QUFFdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3BCQSxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxXQUFXLG1CQUFPLENBQUMsNkNBQVE7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNoQkEsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7QUFDeEMsYUFBYSxtQkFBTyxDQUFDLGlEQUFVOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDaEJBLHFCQUFxQixtQkFBTyxDQUFDLG1FQUFtQjs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxHQUFHO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3hCQSxZQUFZLG1CQUFPLENBQUMsaURBQVU7QUFDOUIsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCO0FBQzFDLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjtBQUM1QyxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7QUFDMUMsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCO0FBQzFDLG9CQUFvQixtQkFBTyxDQUFDLGlFQUFrQjtBQUM5QyxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsYUFBYSxtQkFBTyxDQUFDLG1EQUFXO0FBQ2hDLHFCQUFxQixtQkFBTyxDQUFDLG1FQUFtQjtBQUNoRCxxQkFBcUIsbUJBQU8sQ0FBQyxtRUFBbUI7QUFDaEQsc0JBQXNCLG1CQUFPLENBQUMscUVBQW9CO0FBQ2xELGNBQWMsbUJBQU8sQ0FBQyxtREFBVztBQUNqQyxlQUFlLG1CQUFPLENBQUMscURBQVk7QUFDbkMsWUFBWSxtQkFBTyxDQUFDLCtDQUFTO0FBQzdCLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTtBQUNuQyxZQUFZLG1CQUFPLENBQUMsK0NBQVM7QUFDN0IsV0FBVyxtQkFBTyxDQUFDLDZDQUFRO0FBQzNCLGFBQWEsbUJBQU8sQ0FBQyxpREFBVTs7QUFFL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLFdBQVcsU0FBUztBQUNwQjtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJO0FBQ0o7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3JLQSxlQUFlLG1CQUFPLENBQUMscURBQVk7O0FBRW5DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUM3QkEsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7QUFDeEMscUJBQXFCLG1CQUFPLENBQUMsbUVBQW1COztBQUVoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsY0FBYztBQUN6QixXQUFXLFVBQVU7QUFDckIsYUFBYSxjQUFjO0FBQzNCO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDYkEsZUFBZSxtQkFBTyxDQUFDLHFEQUFZOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsVUFBVTtBQUNyQixXQUFXLFVBQVU7QUFDckIsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUMvQkEsZUFBZSxtQkFBTyxDQUFDLHVEQUFhOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsY0FBYztBQUN6QixXQUFXLFVBQVU7QUFDckIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsUUFBUTtBQUNuQixXQUFXLFNBQVM7QUFDcEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3ZCQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxvQkFBb0IsbUJBQU8sQ0FBQyxpRUFBa0I7O0FBRTlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsUUFBUTtBQUNuQixXQUFXLFNBQVM7QUFDcEIsV0FBVyxTQUFTO0FBQ3BCLFdBQVcsT0FBTztBQUNsQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3JDQSxvQkFBb0IsbUJBQU8sQ0FBQyxpRUFBa0I7O0FBRTlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2ZBLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTtBQUNsQyxXQUFXLG1CQUFPLENBQUMsNkNBQVE7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsVUFBVTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDZkEsZUFBZSxtQkFBTyxDQUFDLHVEQUFhO0FBQ3BDLFlBQVksbUJBQU8sQ0FBQyxpREFBVTs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxjQUFjO0FBQ3pCLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3ZCQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxjQUFjLG1CQUFPLENBQUMsbURBQVc7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ25CQSxhQUFhLG1CQUFPLENBQUMsbURBQVc7QUFDaEMsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMscUJBQXFCLG1CQUFPLENBQUMsbUVBQW1COztBQUVoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsV0FBVyxHQUFHO0FBQ2QsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsY0FBYztBQUN6QixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsY0FBYztBQUN6QixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDWkEsb0JBQW9CLG1CQUFPLENBQUMsaUVBQWtCO0FBQzlDLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLG9CQUFvQixtQkFBTyxDQUFDLGlFQUFrQjs7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxHQUFHO0FBQ2QsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbkJBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLG1CQUFtQixtQkFBTyxDQUFDLDZEQUFnQjs7QUFFM0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNqQkEsc0JBQXNCLG1CQUFPLENBQUMscUVBQW9CO0FBQ2xELG1CQUFtQixtQkFBTyxDQUFDLDZEQUFnQjs7QUFFM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLFdBQVcsR0FBRztBQUNkLFdBQVcsU0FBUztBQUNwQjtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDM0JBLFlBQVksbUJBQU8sQ0FBQyxpREFBVTtBQUM5QixrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7QUFDMUMsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7QUFDeEMsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCO0FBQzVDLGFBQWEsbUJBQU8sQ0FBQyxtREFBVztBQUNoQyxjQUFjLG1CQUFPLENBQUMsbURBQVc7QUFDakMsZUFBZSxtQkFBTyxDQUFDLHFEQUFZO0FBQ25DLG1CQUFtQixtQkFBTyxDQUFDLDZEQUFnQjs7QUFFM0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbEZBLGFBQWEsbUJBQU8sQ0FBQyxtREFBVztBQUNoQyxtQkFBbUIsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakJBLFlBQVksbUJBQU8sQ0FBQyxpREFBVTtBQUM5QixrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTFDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsVUFBVTtBQUNyQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDWEEsaUJBQWlCLG1CQUFPLENBQUMseURBQWM7QUFDdkMsZUFBZSxtQkFBTyxDQUFDLHVEQUFhO0FBQ3BDLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTtBQUNuQyxlQUFlLG1CQUFPLENBQUMsdURBQWE7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDOUNBLGFBQWEsbUJBQU8sQ0FBQyxtREFBVztBQUNoQyxtQkFBbUIsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakJBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTtBQUNuQyxtQkFBbUIsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUMzREEsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCO0FBQzFDLDBCQUEwQixtQkFBTyxDQUFDLDZFQUF3QjtBQUMxRCxlQUFlLG1CQUFPLENBQUMscURBQVk7QUFDbkMsY0FBYyxtQkFBTyxDQUFDLG1EQUFXO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFVBQVU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUM5QkEsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCO0FBQzFDLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlOztBQUV4QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzdCQSxlQUFlLG1CQUFPLENBQUMscURBQVk7QUFDbkMsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCO0FBQzFDLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjs7QUFFNUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNiQSxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsa0JBQWtCLG1CQUFPLENBQUMsMkRBQWU7O0FBRXpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsVUFBVTtBQUNyQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3JCQSxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7QUFDMUMsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCO0FBQzVDLDhCQUE4QixtQkFBTyxDQUFDLHFGQUE0Qjs7QUFFbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3JCQSxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7QUFDMUMsVUFBVSxtQkFBTyxDQUFDLDJDQUFPO0FBQ3pCLFlBQVksbUJBQU8sQ0FBQywrQ0FBUztBQUM3QixZQUFZLG1CQUFPLENBQUMsaURBQVU7QUFDOUIseUJBQXlCLG1CQUFPLENBQUMsMkVBQXVCO0FBQ3hELDhCQUE4QixtQkFBTyxDQUFDLHFGQUE0QjtBQUNsRSxZQUFZLG1CQUFPLENBQUMsaURBQVU7O0FBRTlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLEdBQUc7QUFDZCxhQUFhLFVBQVU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2hDQSxZQUFZLG1CQUFPLENBQUMsaURBQVU7QUFDOUIsdUJBQXVCLG1CQUFPLENBQUMsdUVBQXFCO0FBQ3BELGNBQWMsbUJBQU8sQ0FBQyxxREFBWTtBQUNsQyxvQkFBb0IsbUJBQU8sQ0FBQyxpRUFBa0I7QUFDOUMsZUFBZSxtQkFBTyxDQUFDLHFEQUFZO0FBQ25DLGFBQWEsbUJBQU8sQ0FBQyxpREFBVTtBQUMvQixjQUFjLG1CQUFPLENBQUMscURBQVk7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7Ozs7Ozs7Ozs7QUN6Q0EsdUJBQXVCLG1CQUFPLENBQUMsdUVBQXFCO0FBQ3BELGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQyxzQkFBc0IsbUJBQU8sQ0FBQyxxRUFBb0I7QUFDbEQsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMsc0JBQXNCLG1CQUFPLENBQUMscUVBQW9CO0FBQ2xELGtCQUFrQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3pDLGNBQWMsbUJBQU8sQ0FBQyxtREFBVztBQUNqQyx3QkFBd0IsbUJBQU8sQ0FBQyx1RUFBcUI7QUFDckQsZUFBZSxtQkFBTyxDQUFDLHFEQUFZO0FBQ25DLGlCQUFpQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3ZDLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTtBQUNuQyxvQkFBb0IsbUJBQU8sQ0FBQywrREFBaUI7QUFDN0MsbUJBQW1CLG1CQUFPLENBQUMsNkRBQWdCO0FBQzNDLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTtBQUNsQyxvQkFBb0IsbUJBQU8sQ0FBQywrREFBaUI7O0FBRTdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUM3RkEsZUFBZSxtQkFBTyxDQUFDLHVEQUFhO0FBQ3BDLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTtBQUNsQyxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsY0FBYyxtQkFBTyxDQUFDLHFEQUFZO0FBQ2xDLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLHNCQUFzQixtQkFBTyxDQUFDLHFFQUFvQjtBQUNsRCxlQUFlLG1CQUFPLENBQUMscURBQVk7QUFDbkMsY0FBYyxtQkFBTyxDQUFDLG1EQUFXOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsY0FBYztBQUN6QixXQUFXLDhCQUE4QjtBQUN6QyxXQUFXLFVBQVU7QUFDckIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLGFBQWE7QUFDYixHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7Ozs7Ozs7Ozs7O0FDaERBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLFlBQVksbUJBQU8sQ0FBQywrQ0FBUzs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOzs7Ozs7Ozs7OztBQ2xCQSxjQUFjLG1CQUFPLENBQUMscURBQVk7QUFDbEMsY0FBYyxtQkFBTyxDQUFDLHFEQUFZO0FBQ2xDLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTs7QUFFcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFVBQVU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2JBLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGNBQWM7QUFDekIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNmQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsU0FBUztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGNBQWM7QUFDekIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsR0FBRztBQUNkLFdBQVcsU0FBUztBQUNwQjtBQUNBLFdBQVcsVUFBVTtBQUNyQixhQUFhLEdBQUc7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdEJBLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTtBQUNuQyxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2hCQSxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7QUFDMUMsZUFBZSxtQkFBTyxDQUFDLHVEQUFhO0FBQ3BDLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTtBQUNsQyxlQUFlLG1CQUFPLENBQUMscURBQVk7QUFDbkMsWUFBWSxtQkFBTyxDQUFDLGlEQUFVOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLGNBQWM7QUFDekIsV0FBVyxHQUFHO0FBQ2QsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbERBLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTtBQUNuQyxxQkFBcUIsbUJBQU8sQ0FBQyxtRUFBbUI7QUFDaEQsZUFBZSxtQkFBTyxDQUFDLHFEQUFZOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQixXQUFXLFVBQVU7QUFDckIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOzs7Ozs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsVUFBVTtBQUNyQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNuQkEsYUFBYSxtQkFBTyxDQUFDLG1EQUFXO0FBQ2hDLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTtBQUNwQyxjQUFjLG1CQUFPLENBQUMsbURBQVc7QUFDakMsZUFBZSxtQkFBTyxDQUFDLHFEQUFZOztBQUVuQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3BDQSxzQkFBc0IsbUJBQU8sQ0FBQyxxRUFBb0I7O0FBRWxEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNiQSxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsb0JBQW9CLG1CQUFPLENBQUMsaUVBQWtCO0FBQzlDLHdCQUF3QixtQkFBTyxDQUFDLHlFQUFzQjtBQUN0RCxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7O0FBRXhDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3ZFQSxlQUFlLG1CQUFPLENBQUMsdURBQWE7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOzs7Ozs7Ozs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ1pBLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFVBQVU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDYkEsY0FBYyxtQkFBTyxDQUFDLG1EQUFXO0FBQ2pDLFlBQVksbUJBQU8sQ0FBQyxpREFBVTtBQUM5QixtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsZUFBZSxtQkFBTyxDQUFDLHFEQUFZOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLFdBQVcsUUFBUTtBQUNuQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDcEJBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlOztBQUV4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsYUFBYTtBQUN4QixhQUFhLGFBQWE7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUNmQSxXQUFXLG1CQUFPLENBQUMsK0NBQVM7O0FBRTVCO0FBQ0Esa0JBQWtCLEtBQTBCOztBQUU1QztBQUNBLGdDQUFnQyxRQUFhOztBQUU3QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFNBQVM7QUFDcEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNsQ0EsdUJBQXVCLG1CQUFPLENBQUMsdUVBQXFCOztBQUVwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFNBQVM7QUFDcEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDZkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2hCQSxhQUFhLG1CQUFPLENBQUMsbURBQVc7O0FBRWhDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakJBLHVCQUF1QixtQkFBTyxDQUFDLHVFQUFxQjs7QUFFcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxTQUFTO0FBQ3BCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2ZBLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxXQUFXLEdBQUc7QUFDZCxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN4Q0EsdUJBQXVCLG1CQUFPLENBQUMsdUVBQXFCOztBQUVwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsb0JBQW9CO0FBQy9CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbkJBLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQyxzQkFBc0IsbUJBQU8sQ0FBQyxxRUFBb0I7O0FBRWxEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsT0FBTztBQUNsQixXQUFXLFFBQVEsVUFBVTtBQUM3QixXQUFXLFVBQVU7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qjs7QUFFeEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdkNBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlOztBQUV4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVEsVUFBVTtBQUM3QixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDZkEsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7QUFDeEMsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCOztBQUU1QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVEsVUFBVTtBQUM3QixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDZkEsV0FBVyxtQkFBTyxDQUFDLCtDQUFTOztBQUU1QjtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ0xBLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTtBQUNwQyxxQkFBcUIsbUJBQU8sQ0FBQyxtRUFBbUI7O0FBRWhEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOzs7Ozs7Ozs7OztBQ3BDQSxrQkFBa0IsbUJBQU8sQ0FBQywyREFBZTs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckIsV0FBVyxTQUFTO0FBQ3BCLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFNBQVM7QUFDcEIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN4QkEsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCO0FBQzVDLGtCQUFrQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3pDLFdBQVcsbUJBQU8sQ0FBQyw2Q0FBUTs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDeEJBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLHFCQUFxQixtQkFBTyxDQUFDLG1FQUFtQjtBQUNoRCxlQUFlLG1CQUFPLENBQUMscURBQVk7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUM3QkEsVUFBVSxtQkFBTyxDQUFDLDZDQUFRO0FBQzFCLFdBQVcsbUJBQU8sQ0FBQyw2Q0FBUTtBQUMzQixpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTs7QUFFeEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbEJBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjOztBQUV0QztBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQSxJQUFJO0FBQ0osQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUNWQSxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMsZUFBZSxtQkFBTyxDQUFDLHVEQUFhOztBQUVwQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsVUFBVTtBQUNyQixXQUFXLFVBQVU7QUFDckIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ25GQSxhQUFhLG1CQUFPLENBQUMsbURBQVc7QUFDaEMsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7QUFDeEMsU0FBUyxtQkFBTyxDQUFDLHlDQUFNO0FBQ3ZCLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQyxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTs7QUFFeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDL0dBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlOztBQUV4QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN6RkEsY0FBYyxtQkFBTyxDQUFDLG1EQUFXO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTtBQUNwQyxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNmQTtBQUNBLHdCQUF3QixxQkFBTSxnQkFBZ0IscUJBQU0sSUFBSSxxQkFBTSxzQkFBc0IscUJBQU07O0FBRTFGOzs7Ozs7Ozs7OztBQ0hBLHFCQUFxQixtQkFBTyxDQUFDLG1FQUFtQjtBQUNoRCxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxXQUFXLG1CQUFPLENBQUMsNkNBQVE7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNmQSxxQkFBcUIsbUJBQU8sQ0FBQyxtRUFBbUI7QUFDaEQsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCO0FBQzVDLGFBQWEsbUJBQU8sQ0FBQyxpREFBVTs7QUFFL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDaEJBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjOztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2pCQSx5QkFBeUIsbUJBQU8sQ0FBQywyRUFBdUI7QUFDeEQsV0FBVyxtQkFBTyxDQUFDLDZDQUFROztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3ZCQSxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsZUFBZSxtQkFBTyxDQUFDLHVEQUFhOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDaEJBLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTs7QUFFbEM7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNMQSxhQUFhLG1CQUFPLENBQUMsbURBQVc7O0FBRWhDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDN0NBLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQyxnQkFBZ0IsbUJBQU8sQ0FBQyx1REFBYTs7QUFFckM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7Ozs7Ozs7Ozs7O0FDN0JBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjtBQUM1QyxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxnQkFBZ0IsbUJBQU8sQ0FBQyx1REFBYTs7QUFFckM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3hCQSxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsVUFBVSxtQkFBTyxDQUFDLDZDQUFRO0FBQzFCLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTtBQUNsQyxVQUFVLG1CQUFPLENBQUMsNkNBQVE7QUFDMUIsY0FBYyxtQkFBTyxDQUFDLHFEQUFZO0FBQ2xDLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTs7QUFFcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNaQSxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsa0JBQWtCLG1CQUFPLENBQUMsMkRBQWU7QUFDekMsY0FBYyxtQkFBTyxDQUFDLG1EQUFXO0FBQ2pDLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTtBQUNsQyxlQUFlLG1CQUFPLENBQUMscURBQVk7QUFDbkMsWUFBWSxtQkFBTyxDQUFDLGlEQUFVOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLGNBQWM7QUFDekIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDekJBLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjs7QUFFNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDaEJBLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjs7QUFFNUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDN0JBLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjs7QUFFNUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN0QkEsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCOztBQUU1QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLEdBQUc7QUFDZCxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdEJBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDekJBLHVCQUF1QixtQkFBTyxDQUFDLHVFQUFxQjtBQUNwRCxvQkFBb0IsbUJBQU8sQ0FBQyxpRUFBa0I7QUFDOUMsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCO0FBQzFDLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQyxzQkFBc0IsbUJBQU8sQ0FBQyxxRUFBb0I7O0FBRWxEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFNBQVM7QUFDcEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDNUVBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjtBQUM1QyxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakJBLGFBQWEsbUJBQU8sQ0FBQyxtREFBVztBQUNoQyxrQkFBa0IsbUJBQU8sQ0FBQywyREFBZTtBQUN6QyxjQUFjLG1CQUFPLENBQUMsbURBQVc7O0FBRWpDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNuQkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3hCQSxTQUFTLG1CQUFPLENBQUMseUNBQU07QUFDdkIsa0JBQWtCLG1CQUFPLENBQUMsMkRBQWU7QUFDekMsY0FBYyxtQkFBTyxDQUFDLHFEQUFZO0FBQ2xDLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxXQUFXLEdBQUc7QUFDZCxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzdCQSxjQUFjLG1CQUFPLENBQUMsbURBQVc7QUFDakMsZUFBZSxtQkFBTyxDQUFDLHFEQUFZOztBQUVuQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNkQSxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNuQkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2pCQSxlQUFlLG1CQUFPLENBQUMscURBQVk7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNaQSxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7O0FBRTVDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2xDQSxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7O0FBRTVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLEdBQUc7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNsQkEsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCOztBQUU1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2ZBLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjs7QUFFNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDekJBLFdBQVcsbUJBQU8sQ0FBQywrQ0FBUztBQUM1QixnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxVQUFVLG1CQUFPLENBQUMsNkNBQVE7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNwQkEsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7O0FBRXhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2pCQSxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNmQSxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNmQSxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLEdBQUc7QUFDZCxhQUFhLFVBQVU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbkJBLGNBQWMsbUJBQU8sQ0FBQyxtREFBVzs7QUFFakM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3pCQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYzs7QUFFdEM7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNMQSxjQUFjLG1CQUFPLENBQUMscURBQVk7O0FBRWxDO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FDbkJBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlOztBQUV4QztBQUNBLGtCQUFrQixLQUEwQjs7QUFFNUM7QUFDQSxnQ0FBZ0MsUUFBYTs7QUFFN0M7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUM3QkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQixhQUFhLFVBQVU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2RBLFlBQVksbUJBQU8sQ0FBQyxpREFBVTs7QUFFOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNuQ0EsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7O0FBRXhDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDcEJBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakJBLHNCQUFzQixtQkFBTyxDQUFDLHFFQUFvQjtBQUNsRCxlQUFlLG1CQUFPLENBQUMsdURBQWE7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQixhQUFhLFVBQVU7QUFDdkI7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNiQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDcENBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjOztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDYkEsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMsVUFBVSxtQkFBTyxDQUFDLDZDQUFRO0FBQzFCLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTs7QUFFcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsR0FBRztBQUNkLFdBQVcsUUFBUTtBQUNuQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdEJBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjs7QUFFMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNqQkEsb0JBQW9CLG1CQUFPLENBQUMsaUVBQWtCOztBQUU5QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQzFCQSxlQUFlLG1CQUFPLENBQUMscURBQVk7O0FBRW5DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLGVBQWU7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNwQkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3pCQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxFQUFFO0FBQ2pEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDM0NBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjOztBQUV0QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsUUFBUSxJQUFJLFFBQVE7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNuQ0EsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7O0FBRXRDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsUUFBUSxJQUFJLFFBQVE7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFVBQVU7QUFDdkI7QUFDQTtBQUNBLHlDQUF5QyxRQUFRO0FBQ2pEO0FBQ0E7QUFDQSxZQUFZLFFBQVEsSUFBSSxRQUFRO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN6QkEsZUFBZSxtQkFBTyxDQUFDLHVEQUFhO0FBQ3BDLFNBQVMsbUJBQU8sQ0FBQyx5Q0FBTTtBQUN2QixxQkFBcUIsbUJBQU8sQ0FBQyxtRUFBbUI7QUFDaEQsYUFBYSxtQkFBTyxDQUFDLGlEQUFVOztBQUUvQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsV0FBVztBQUN0QixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFFBQVEsSUFBSSxRQUFRLElBQUksUUFBUTtBQUNoRCxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUMvREEseUZBQXFDOzs7Ozs7Ozs7OztBQ0FyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDcENBLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQyxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsY0FBYyxtQkFBTyxDQUFDLG1EQUFXOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsVUFBVTtBQUNyQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLDZDQUE2QztBQUNwRCxPQUFPO0FBQ1A7QUFDQTtBQUNBLGlDQUFpQyxtQkFBbUI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDJCQUEyQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLFdBQVc7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ25EQSxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxnQkFBZ0IsbUJBQU8sQ0FBQyx1REFBYTs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBLE9BQU8sOENBQThDO0FBQ3JELE9BQU8sK0NBQStDO0FBQ3RELE9BQU87QUFDUDtBQUNBO0FBQ0EsK0JBQStCLG9CQUFvQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMEJBQTBCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDekNBLG9CQUFvQixtQkFBTyxDQUFDLGlFQUFrQjtBQUM5QyxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsZ0JBQWdCLG1CQUFPLENBQUMsdURBQWE7O0FBRXJDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLFVBQVU7QUFDckIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxPQUFPLG9DQUFvQztBQUMzQyxPQUFPLG9DQUFvQztBQUMzQyxPQUFPO0FBQ1A7QUFDQTtBQUNBLG9DQUFvQyw0QkFBNEI7QUFDaEU7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGlDQUFpQztBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdERBLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjs7QUFFMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNyQkEsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMsZUFBZSxtQkFBTyxDQUFDLHVEQUFhO0FBQ3BDLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjtBQUM1QyxjQUFjLG1CQUFPLENBQUMsbURBQVc7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGNBQWM7QUFDekIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsY0FBYztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxlQUFlLGdCQUFnQjtBQUMvQjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDeENBLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTtBQUNsQyxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsYUFBYSxtQkFBTyxDQUFDLGlEQUFVOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN0Q0EsY0FBYyxtQkFBTyxDQUFDLHFEQUFZOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsY0FBYztBQUN6QixXQUFXLEdBQUc7QUFDZCxhQUFhLEdBQUc7QUFDaEI7QUFDQTtBQUNBLGtCQUFrQixRQUFRLE9BQU8sVUFBVTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2hDQSxjQUFjLG1CQUFPLENBQUMscURBQVk7QUFDbEMsY0FBYyxtQkFBTyxDQUFDLHFEQUFZOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLGNBQWM7QUFDekIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQSxrQkFBa0IsT0FBTztBQUN6QiwwQkFBMEIsZ0JBQWdCLFFBQVEsR0FBRztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNsQ0EsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMsY0FBYyxtQkFBTyxDQUFDLHFEQUFZOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLGNBQWM7QUFDekIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQSwyQkFBMkIsZ0JBQWdCLFFBQVEsR0FBRztBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLEdBQUc7QUFDaEI7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNwQkEsc0JBQXNCLG1CQUFPLENBQUMscUVBQW9CO0FBQ2xELG1CQUFtQixtQkFBTyxDQUFDLDZEQUFnQjs7QUFFM0M7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLG1CQUFtQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLG1CQUFtQjtBQUNsRTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN6QkEsaUJBQWlCLG1CQUFPLENBQUMseURBQWM7QUFDdkMsZUFBZSxtQkFBTyxDQUFDLHFEQUFZOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNoQ0Esa0JBQWtCLG1CQUFPLENBQUMsMkRBQWU7QUFDekMsbUJBQW1CLG1CQUFPLENBQUMsNkRBQWdCOztBQUUzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FDaENBLFdBQVcsbUJBQU8sQ0FBQywrQ0FBUztBQUM1QixnQkFBZ0IsbUJBQU8sQ0FBQyx1REFBYTs7QUFFckM7QUFDQSxrQkFBa0IsS0FBMEI7O0FBRTVDO0FBQ0EsZ0NBQWdDLFFBQWE7O0FBRTdDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNyQ0EsZUFBZSxtQkFBTyxDQUFDLHVEQUFhO0FBQ3BDLGFBQWEsbUJBQU8sQ0FBQyxtREFBVztBQUNoQyxrQkFBa0IsbUJBQU8sQ0FBQywyREFBZTtBQUN6QyxjQUFjLG1CQUFPLENBQUMsbURBQVc7QUFDakMsa0JBQWtCLG1CQUFPLENBQUMsMkRBQWU7QUFDekMsZUFBZSxtQkFBTyxDQUFDLHFEQUFZO0FBQ25DLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQyxtQkFBbUIsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTNDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzVFQSxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxlQUFlLG1CQUFPLENBQUMscURBQVk7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNwQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbENBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTs7QUFFcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDNUJBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjtBQUM1QyxtQkFBbUIsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGdCQUFnQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzdEQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxlQUFlLG1CQUFPLENBQUMsdURBQWE7O0FBRXBDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzFCQSxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxjQUFjLG1CQUFPLENBQUMsbURBQVc7QUFDakMsbUJBQW1CLG1CQUFPLENBQUMsNkRBQWdCOztBQUUzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUM3QkEsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7QUFDeEMsbUJBQW1CLG1CQUFPLENBQUMsNkRBQWdCOztBQUUzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUM1QkEsdUJBQXVCLG1CQUFPLENBQUMsdUVBQXFCO0FBQ3BELGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTs7QUFFcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDckJBLG9CQUFvQixtQkFBTyxDQUFDLGlFQUFrQjtBQUM5QyxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsa0JBQWtCLG1CQUFPLENBQUMsMkRBQWU7O0FBRXpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNwQ0Esb0JBQW9CLG1CQUFPLENBQUMsaUVBQWtCO0FBQzlDLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLGtCQUFrQixtQkFBTyxDQUFDLDJEQUFlOztBQUV6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNuQkEsZUFBZSxtQkFBTyxDQUFDLHVEQUFhO0FBQ3BDLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjtBQUM1QyxjQUFjLG1CQUFPLENBQUMscURBQVk7QUFDbEMsY0FBYyxtQkFBTyxDQUFDLG1EQUFXOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGNBQWM7QUFDekIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGdCQUFnQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSxPQUFPLGtCQUFrQjtBQUN6QixPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDcERBLHNCQUFzQixtQkFBTyxDQUFDLHFFQUFvQjtBQUNsRCxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7O0FBRTVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsVUFBVTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsOEJBQThCO0FBQ2hELGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0Esb0NBQW9DLGVBQWU7QUFDbkQsV0FBVywyQkFBMkI7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsV0FBVywyQkFBMkI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzFDQSxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsYUFBYSxtQkFBTyxDQUFDLG1EQUFXO0FBQ2hDLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLEdBQUc7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDNUJBLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTs7QUFFcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQixhQUFhLFVBQVU7QUFDdkI7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN4RUEsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMscUJBQXFCLG1CQUFPLENBQUMsbUVBQW1COztBQUVoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxXQUFXO0FBQ3RCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVEsSUFBSSxRQUFRO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUSxJQUFJLFFBQVE7QUFDakM7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRLGdCQUFnQixJQUFJLGdCQUFnQjtBQUN2RDtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQ3RDQSxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsYUFBYSxtQkFBTyxDQUFDLG1EQUFXO0FBQ2hDLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLEdBQUc7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDNUJBLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjtBQUM1QyxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsYUFBYSxtQkFBTyxDQUFDLG1EQUFXOztBQUVoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0Esb0JBQW9CLFFBQVEsSUFBSSxRQUFRO0FBQ3hDO0FBQ0Esa0NBQWtDLGFBQWE7QUFDL0MsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNoQkEsV0FBVyxtQkFBTyxDQUFDLCtDQUFTOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdEJBLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTtBQUNwQyxlQUFlLG1CQUFPLENBQUMsdURBQWE7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsc0JBQXNCO0FBQ2pDLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QixDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQ3hCQSxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsdUJBQXVCLG1CQUFPLENBQUMsdUVBQXFCO0FBQ3BELFlBQVksbUJBQU8sQ0FBQyxpREFBVTtBQUM5QixZQUFZLG1CQUFPLENBQUMsaURBQVU7O0FBRTlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxPQUFPLE9BQU8sVUFBVTtBQUN4QixPQUFPLE9BQU87QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQy9CQSxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzdDQSxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7QUFDMUMsZUFBZSxtQkFBTyxDQUFDLHVEQUFhO0FBQ3BDLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjtBQUM1QyxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxjQUFjLG1CQUFPLENBQUMsbURBQVc7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsVUFBVTtBQUNyQixXQUFXLEdBQUc7QUFDZCxhQUFhLEdBQUc7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsY0FBYyx3QkFBd0I7QUFDdEM7QUFDQTtBQUNBLElBQUksSUFBSTtBQUNSLFdBQVcsOEJBQThCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbERBLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTtBQUNwQyxhQUFhLG1CQUFPLENBQUMsbURBQVc7QUFDaEMsa0JBQWtCLG1CQUFPLENBQUMsMkRBQWU7QUFDekMsZUFBZSxtQkFBTyxDQUFDLHFEQUFZO0FBQ25DLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlOztBQUV4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcscUJBQXFCO0FBQ2hDLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxnQkFBZ0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzdDQSxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7QUFDMUMsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCO0FBQzFDLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTtBQUNwQyxxQkFBcUIsbUJBQU8sQ0FBQyxtRUFBbUI7O0FBRWhEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsMEJBQTBCO0FBQ3JDO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLE9BQU8sNkJBQTZCO0FBQ3BDLE9BQU8sNkJBQTZCO0FBQ3BDLE9BQU8sNkJBQTZCO0FBQ3BDLE9BQU87QUFDUDtBQUNBO0FBQ0Esa0NBQWtDLGdCQUFnQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakJBLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTs7QUFFbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3pDQSxlQUFlLG1CQUFPLENBQUMscURBQVk7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNuQ0EsZUFBZSxtQkFBTyxDQUFDLHVEQUFhO0FBQ3BDLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTtBQUNuQyxlQUFlLG1CQUFPLENBQUMscURBQVk7O0FBRW5DO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUMvREEsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7QUFDeEMsYUFBYSxtQkFBTyxDQUFDLGlEQUFVOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFFBQVE7QUFDdEIsV0FBVztBQUNYO0FBQ0EsY0FBYyxRQUFRO0FBQ3RCLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUMvQkEsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCOztBQUU1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDM0JBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjtBQUM1QyxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsY0FBYyxtQkFBTyxDQUFDLG1EQUFXO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTtBQUNuQyxpQkFBaUIsbUJBQU8sQ0FBQyx5REFBYztBQUN2QyxlQUFlLG1CQUFPLENBQUMscURBQVk7QUFDbkMsbUJBQW1CLG1CQUFPLENBQUMsNkRBQWdCOztBQUUzQztBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsVUFBVTtBQUNyQixXQUFXLEdBQUc7QUFDZCxhQUFhLEdBQUc7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsaUJBQWlCLHdCQUF3QjtBQUN6QztBQUNBLElBQUksSUFBSTtBQUNSLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNoRUEsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCO0FBQzFDLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTtBQUNwQyxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsd0JBQXdCLG1CQUFPLENBQUMsdUVBQXFCOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUN6QkEsZUFBZSxtQkFBTyxDQUFDLHFEQUFZOztBQUVuQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDM0JBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLFdBQVcsbUJBQU8sQ0FBQyw2Q0FBUTs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakNBLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQyxvQkFBb0IsbUJBQU8sQ0FBQyxpRUFBa0I7O0FBRTlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7VUN2QkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3pCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztVRUpBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vc3JjL2Fzc2lnbi5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL3NyYy9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL3NyYy9sYXlvdXQuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZGFncmUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZGFncmUvbGliL2FjeWNsaWMuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZGFncmUvbGliL2FkZC1ib3JkZXItc2VnbWVudHMuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZGFncmUvbGliL2Nvb3JkaW5hdGUtc3lzdGVtLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2RhZ3JlL2xpYi9kYXRhL2xpc3QuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZGFncmUvbGliL2RlYnVnLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2RhZ3JlL2xpYi9ncmFwaGxpYi5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9kYWdyZS9saWIvZ3JlZWR5LWZhcy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9kYWdyZS9saWIvbGF5b3V0LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2RhZ3JlL2xpYi9sb2Rhc2guanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZGFncmUvbGliL25lc3RpbmctZ3JhcGguanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZGFncmUvbGliL25vcm1hbGl6ZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9kYWdyZS9saWIvb3JkZXIvYWRkLXN1YmdyYXBoLWNvbnN0cmFpbnRzLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2RhZ3JlL2xpYi9vcmRlci9iYXJ5Y2VudGVyLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2RhZ3JlL2xpYi9vcmRlci9idWlsZC1sYXllci1ncmFwaC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9kYWdyZS9saWIvb3JkZXIvY3Jvc3MtY291bnQuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZGFncmUvbGliL29yZGVyL2luZGV4LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2RhZ3JlL2xpYi9vcmRlci9pbml0LW9yZGVyLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2RhZ3JlL2xpYi9vcmRlci9yZXNvbHZlLWNvbmZsaWN0cy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9kYWdyZS9saWIvb3JkZXIvc29ydC1zdWJncmFwaC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9kYWdyZS9saWIvb3JkZXIvc29ydC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9kYWdyZS9saWIvcGFyZW50LWR1bW15LWNoYWlucy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9kYWdyZS9saWIvcG9zaXRpb24vYmsuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZGFncmUvbGliL3Bvc2l0aW9uL2luZGV4LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2RhZ3JlL2xpYi9yYW5rL2ZlYXNpYmxlLXRyZWUuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZGFncmUvbGliL3JhbmsvaW5kZXguanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZGFncmUvbGliL3JhbmsvbmV0d29yay1zaW1wbGV4LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2RhZ3JlL2xpYi9yYW5rL3V0aWwuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZGFncmUvbGliL3V0aWwuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZGFncmUvbGliL3ZlcnNpb24uanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZ3JhcGhsaWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZ3JhcGhsaWIvbGliL2FsZy9jb21wb25lbnRzLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2dyYXBobGliL2xpYi9hbGcvZGZzLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2dyYXBobGliL2xpYi9hbGcvZGlqa3N0cmEtYWxsLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2dyYXBobGliL2xpYi9hbGcvZGlqa3N0cmEuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZ3JhcGhsaWIvbGliL2FsZy9maW5kLWN5Y2xlcy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9ncmFwaGxpYi9saWIvYWxnL2Zsb3lkLXdhcnNoYWxsLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2dyYXBobGliL2xpYi9hbGcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZ3JhcGhsaWIvbGliL2FsZy9pcy1hY3ljbGljLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2dyYXBobGliL2xpYi9hbGcvcG9zdG9yZGVyLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2dyYXBobGliL2xpYi9hbGcvcHJlb3JkZXIuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZ3JhcGhsaWIvbGliL2FsZy9wcmltLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2dyYXBobGliL2xpYi9hbGcvdGFyamFuLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2dyYXBobGliL2xpYi9hbGcvdG9wc29ydC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9ncmFwaGxpYi9saWIvZGF0YS9wcmlvcml0eS1xdWV1ZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9ncmFwaGxpYi9saWIvZ3JhcGguanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZ3JhcGhsaWIvbGliL2luZGV4LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2dyYXBobGliL2xpYi9qc29uLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2dyYXBobGliL2xpYi9sb2Rhc2guanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvZ3JhcGhsaWIvbGliL3ZlcnNpb24uanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19EYXRhVmlldy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX0hhc2guanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19MaXN0Q2FjaGUuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19NYXAuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19NYXBDYWNoZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1Byb21pc2UuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TZXQuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TZXRDYWNoZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N0YWNrLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fU3ltYm9sLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fVWludDhBcnJheS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1dlYWtNYXAuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcHBseS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5RWFjaC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5RmlsdGVyLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlJbmNsdWRlcy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5SW5jbHVkZXNXaXRoLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlMaWtlS2V5cy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TWFwLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlQdXNoLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlSZWR1Y2UuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVNvbWUuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hc2NpaVNpemUuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hc3NpZ25NZXJnZVZhbHVlLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzaWduVmFsdWUuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY0luZGV4T2YuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQXNzaWduLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbkluLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnblZhbHVlLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUNsb25lLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUNyZWF0ZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VFYWNoLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUV4dHJlbXVtLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZpbHRlci5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGaW5kSW5kZXguanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRmxhdHRlbi5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3IuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yT3duLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRBbGxLZXlzLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHdC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VIYXMuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSGFzSW4uanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSW5kZXhPZi5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0VxdWFsLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzRXF1YWxEZWVwLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTWFwLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTWF0Y2guanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNOYU4uanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNOYXRpdmUuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNTZXQuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNUeXBlZEFycmF5LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUl0ZXJhdGVlLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlS2V5c0luLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUx0LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hcC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VNYXRjaGVzLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hdGNoZXNQcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VNZXJnZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VNZXJnZURlZXAuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlT3JkZXJCeS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQaWNrLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVBpY2tCeS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQcm9wZXJ0eURlZXAuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlUmFuZ2UuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlUmVkdWNlLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVJlc3QuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU2V0LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVNldFRvU3RyaW5nLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVNvcnRCeS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUaW1lcy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUcmltLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVVuYXJ5LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVVuaXEuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVmFsdWVzLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVppcE9iamVjdC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NhY2hlSGFzLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdEZ1bmN0aW9uLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdFBhdGguanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZUFycmF5QnVmZmVyLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVCdWZmZXIuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZURhdGFWaWV3LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVSZWdFeHAuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVN5bWJvbC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lVHlwZWRBcnJheS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvbXBhcmVBc2NlbmRpbmcuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb21wYXJlTXVsdGlwbGUuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5QXJyYXkuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5T2JqZWN0LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weVN5bWJvbHMuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5U3ltYm9sc0luLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29yZUpzRGF0YS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUFzc2lnbmVyLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUVhY2guanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlRmluZC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZVJhbmdlLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlU2V0LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZGVmaW5lUHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbEFycmF5cy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2VxdWFsQnlUYWcuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbE9iamVjdHMuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mbGF0UmVzdC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZyZWVHbG9iYWwuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRBbGxLZXlzLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5c0luLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TWFwRGF0YS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hdGNoRGF0YS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE5hdGl2ZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFByb3RvdHlwZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFN5bWJvbHMuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzSW4uanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRUYWcuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRWYWx1ZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc1BhdGguanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNVbmljb2RlLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaENsZWFyLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaERlbGV0ZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hHZXQuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoSGFzLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaFNldC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUFycmF5LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQnlUYWcuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVPYmplY3QuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0ZsYXR0ZW5hYmxlLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNJbmRleC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSXRlcmF0ZWVDYWxsLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXkuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleWFibGUuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc01hc2tlZC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNTdHJpY3RDb21wYXJhYmxlLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlQ2xlYXIuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVEZWxldGUuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVHZXQuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVIYXMuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVTZXQuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVEZWxldGUuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUdldC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlSGFzLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVTZXQuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBUb0FycmF5LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tZW1vaXplQ2FwcGVkLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlQ3JlYXRlLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXNJbi5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlclJlc3QuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc2FmZUdldC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldENhY2hlQWRkLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc2V0Q2FjaGVIYXMuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zZXRUb0FycmF5LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc2V0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zaG9ydE91dC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrQ2xlYXIuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0RlbGV0ZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrR2V0LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tIYXMuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja1NldC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdHJpbmdTaXplLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RyaW5nVG9QYXRoLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9LZXkuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL190b1NvdXJjZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3RyaW1tZWRFbmRJbmRleC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3VuaWNvZGVTaXplLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9jbG9uZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvY2xvbmVEZWVwLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9jb25zdGFudC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2VhY2guanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2VxLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2ZpbmQuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2ZpbmRJbmRleC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZmxhdHRlbi5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZm9ySW4uanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2dldC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaGFzLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9oYXNJbi5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaWRlbnRpdHkuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJndW1lbnRzLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2VPYmplY3QuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQnVmZmVyLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0VtcHR5LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNNYXAuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzUGxhaW5PYmplY3QuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU2V0LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N0cmluZy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTeW1ib2wuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzVHlwZWRBcnJheS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNVbmRlZmluZWQuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXMuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXNJbi5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFzdC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvbWFwLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9tYXBWYWx1ZXMuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL21heC5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvbWVtb2l6ZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvbWVyZ2UuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL21pbi5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvbWluQnkuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL25vb3AuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL25vdy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvcGljay5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvcHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL3JhbmdlLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9yZWR1Y2UuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL3NpemUuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL3NvcnRCeS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkFycmF5LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViRmFsc2UuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvRmluaXRlLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC90b0ludGVnZXIuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC90b1BsYWluT2JqZWN0LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC90b1N0cmluZy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvdHJhbnNmb3JtLmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC91bmlvbi5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvdW5pcXVlSWQuanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvLi9ub2RlX21vZHVsZXMvbG9kYXNoL3ZhbHVlcy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvemlwT2JqZWN0LmpzIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlRGFncmUvd2VicGFjay9ydW50aW1lL25vZGUgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2N5dG9zY2FwZURhZ3JlL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jeXRvc2NhcGVEYWdyZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiY3l0b3NjYXBlRGFncmVcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiY3l0b3NjYXBlRGFncmVcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCAoKSA9PiB7XG5yZXR1cm4gIiwiLy8gU2ltcGxlLCBpbnRlcm5hbCBPYmplY3QuYXNzaWduKCkgcG9seWZpbGwgZm9yIG9wdGlvbnMgb2JqZWN0cyBldGMuXG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiAhPSBudWxsID8gT2JqZWN0LmFzc2lnbi5iaW5kKCBPYmplY3QgKSA6IGZ1bmN0aW9uKCB0Z3QsIC4uLnNyY3MgKXtcbiAgc3Jjcy5mb3JFYWNoKCBzcmMgPT4ge1xuICAgIE9iamVjdC5rZXlzKCBzcmMgKS5mb3JFYWNoKCBrID0+IHRndFtrXSA9IHNyY1trXSApO1xuICB9ICk7XG5cbiAgcmV0dXJuIHRndDtcbn07XG4iLCJsZXQgZGVmYXVsdHMgPSB7XG4gIC8vIGRhZ3JlIGFsZ28gb3B0aW9ucywgdXNlcyBkZWZhdWx0IHZhbHVlIG9uIHVuZGVmaW5lZFxuICBub2RlU2VwOiB1bmRlZmluZWQsIC8vIHRoZSBzZXBhcmF0aW9uIGJldHdlZW4gYWRqYWNlbnQgbm9kZXMgaW4gdGhlIHNhbWUgcmFua1xuICBlZGdlU2VwOiB1bmRlZmluZWQsIC8vIHRoZSBzZXBhcmF0aW9uIGJldHdlZW4gYWRqYWNlbnQgZWRnZXMgaW4gdGhlIHNhbWUgcmFua1xuICByYW5rU2VwOiB1bmRlZmluZWQsIC8vIHRoZSBzZXBhcmF0aW9uIGJldHdlZW4gYWRqYWNlbnQgbm9kZXMgaW4gdGhlIHNhbWUgcmFua1xuICByYW5rRGlyOiB1bmRlZmluZWQsIC8vICdUQicgZm9yIHRvcCB0byBib3R0b20gZmxvdywgJ0xSJyBmb3IgbGVmdCB0byByaWdodCxcbiAgYWxpZ246IHVuZGVmaW5lZCwgIC8vIGFsaWdubWVudCBmb3IgcmFuayBub2Rlcy4gQ2FuIGJlICdVTCcsICdVUicsICdETCcsIG9yICdEUicsIHdoZXJlIFUgPSB1cCwgRCA9IGRvd24sIEwgPSBsZWZ0LCBhbmQgUiA9IHJpZ2h0XG4gIGFjeWNsaWNlcjogdW5kZWZpbmVkLCAvLyBJZiBzZXQgdG8gJ2dyZWVkeScsIHVzZXMgYSBncmVlZHkgaGV1cmlzdGljIGZvciBmaW5kaW5nIGEgZmVlZGJhY2sgYXJjIHNldCBmb3IgYSBncmFwaC5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEEgZmVlZGJhY2sgYXJjIHNldCBpcyBhIHNldCBvZiBlZGdlcyB0aGF0IGNhbiBiZSByZW1vdmVkIHRvIG1ha2UgYSBncmFwaCBhY3ljbGljLlxuICByYW5rZXI6ICB1bmRlZmluZWQsIC8vIFR5cGUgb2YgYWxnb3JpdGhtIHRvIGFzc2lnbnMgYSByYW5rIHRvIGVhY2ggbm9kZSBpbiB0aGUgaW5wdXQgZ3JhcGguXG4gICAgICAgICAgICAgICAgICAgICAgLy8gUG9zc2libGUgdmFsdWVzOiBuZXR3b3JrLXNpbXBsZXgsIHRpZ2h0LXRyZWUgb3IgbG9uZ2VzdC1wYXRoXG4gIG1pbkxlbjogZnVuY3Rpb24oIGVkZ2UgKXsgcmV0dXJuIDE7IH0sIC8vIG51bWJlciBvZiByYW5rcyB0byBrZWVwIGJldHdlZW4gdGhlIHNvdXJjZSBhbmQgdGFyZ2V0IG9mIHRoZSBlZGdlXG4gIGVkZ2VXZWlnaHQ6IGZ1bmN0aW9uKCBlZGdlICl7IHJldHVybiAxOyB9LCAvLyBoaWdoZXIgd2VpZ2h0IGVkZ2VzIGFyZSBnZW5lcmFsbHkgbWFkZSBzaG9ydGVyIGFuZCBzdHJhaWdodGVyIHRoYW4gbG93ZXIgd2VpZ2h0IGVkZ2VzXG5cbiAgLy8gZ2VuZXJhbCBsYXlvdXQgb3B0aW9uc1xuICBmaXQ6IHRydWUsIC8vIHdoZXRoZXIgdG8gZml0IHRvIHZpZXdwb3J0XG4gIHBhZGRpbmc6IDMwLCAvLyBmaXQgcGFkZGluZ1xuICBzcGFjaW5nRmFjdG9yOiB1bmRlZmluZWQsIC8vIEFwcGxpZXMgYSBtdWx0aXBsaWNhdGl2ZSBmYWN0b3IgKD4wKSB0byBleHBhbmQgb3IgY29tcHJlc3MgdGhlIG92ZXJhbGwgYXJlYSB0aGF0IHRoZSBub2RlcyB0YWtlIHVwXG4gIG5vZGVEaW1lbnNpb25zSW5jbHVkZUxhYmVsczogZmFsc2UsIC8vIHdoZXRoZXIgbGFiZWxzIHNob3VsZCBiZSBpbmNsdWRlZCBpbiBkZXRlcm1pbmluZyB0aGUgc3BhY2UgdXNlZCBieSBhIG5vZGVcbiAgYW5pbWF0ZTogZmFsc2UsIC8vIHdoZXRoZXIgdG8gdHJhbnNpdGlvbiB0aGUgbm9kZSBwb3NpdGlvbnNcbiAgYW5pbWF0ZUZpbHRlcjogZnVuY3Rpb24oIG5vZGUsIGkgKXsgcmV0dXJuIHRydWU7IH0sIC8vIHdoZXRoZXIgdG8gYW5pbWF0ZSBzcGVjaWZpYyBub2RlcyB3aGVuIGFuaW1hdGlvbiBpcyBvbjsgbm9uLWFuaW1hdGVkIG5vZGVzIGltbWVkaWF0ZWx5IGdvIHRvIHRoZWlyIGZpbmFsIHBvc2l0aW9uc1xuICBhbmltYXRpb25EdXJhdGlvbjogNTAwLCAvLyBkdXJhdGlvbiBvZiBhbmltYXRpb24gaW4gbXMgaWYgZW5hYmxlZFxuICBhbmltYXRpb25FYXNpbmc6IHVuZGVmaW5lZCwgLy8gZWFzaW5nIG9mIGFuaW1hdGlvbiBpZiBlbmFibGVkXG4gIGJvdW5kaW5nQm94OiB1bmRlZmluZWQsIC8vIGNvbnN0cmFpbiBsYXlvdXQgYm91bmRzOyB7IHgxLCB5MSwgeDIsIHkyIH0gb3IgeyB4MSwgeTEsIHcsIGggfVxuICB0cmFuc2Zvcm06IGZ1bmN0aW9uKCBub2RlLCBwb3MgKXsgcmV0dXJuIHBvczsgfSwgLy8gYSBmdW5jdGlvbiB0aGF0IGFwcGxpZXMgYSB0cmFuc2Zvcm0gdG8gdGhlIGZpbmFsIG5vZGUgcG9zaXRpb25cbiAgcmVhZHk6IGZ1bmN0aW9uKCl7fSwgLy8gb24gbGF5b3V0cmVhZHlcbiAgc29ydDogdW5kZWZpbmVkLCAvLyBhIHNvcnRpbmcgZnVuY3Rpb24gdG8gb3JkZXIgdGhlIG5vZGVzIGFuZCBlZGdlczsgZS5nLiBmdW5jdGlvbihhLCBiKXsgcmV0dXJuIGEuZGF0YSgnd2VpZ2h0JykgLSBiLmRhdGEoJ3dlaWdodCcpIH1cbiAgICAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIGN5dG9zY2FwZSBkYWdyZSBjcmVhdGVzIGEgZGlyZWN0ZWQgZ3JhcGgsIGFuZCBkaXJlY3RlZCBncmFwaHMgdXNlIHRoZSBub2RlIG9yZGVyIGFzIGEgdGllIGJyZWFrZXIgd2hlblxuICAgICAgICAgICAgICAgICAgIC8vIGRlZmluaW5nIHRoZSB0b3BvbG9neSBvZiBhIGdyYXBoLCB0aGlzIHNvcnQgZnVuY3Rpb24gY2FuIGhlbHAgZW5zdXJlIHRoZSBjb3JyZWN0IG9yZGVyIG9mIHRoZSBub2Rlcy9lZGdlcy5cbiAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGZlYXR1cmUgaXMgbW9zdCB1c2VmdWwgd2hlbiBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBzYW1lIG5vZGVzIGFuZCBlZGdlcyBtdWx0aXBsZSB0aW1lcyBpbiBhIGdyYXBoLlxuICBzdG9wOiBmdW5jdGlvbigpe30gLy8gb24gbGF5b3V0c3RvcFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsImNvbnN0IGltcGwgPSByZXF1aXJlKCcuL2xheW91dCcpO1xuXG4vLyByZWdpc3RlcnMgdGhlIGV4dGVuc2lvbiBvbiBhIGN5dG9zY2FwZSBsaWIgcmVmXG5sZXQgcmVnaXN0ZXIgPSBmdW5jdGlvbiggY3l0b3NjYXBlICl7XG4gIGlmKCAhY3l0b3NjYXBlICl7IHJldHVybjsgfSAvLyBjYW4ndCByZWdpc3RlciBpZiBjeXRvc2NhcGUgdW5zcGVjaWZpZWRcblxuICBjeXRvc2NhcGUoICdsYXlvdXQnLCAnZGFncmUnLCBpbXBsICk7IC8vIHJlZ2lzdGVyIHdpdGggY3l0b3NjYXBlLmpzXG59O1xuXG5pZiggdHlwZW9mIGN5dG9zY2FwZSAhPT0gJ3VuZGVmaW5lZCcgKXsgLy8gZXhwb3NlIHRvIGdsb2JhbCBjeXRvc2NhcGUgKGkuZS4gd2luZG93LmN5dG9zY2FwZSlcbiAgcmVnaXN0ZXIoIGN5dG9zY2FwZSApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlZ2lzdGVyO1xuIiwiY29uc3QgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG8peyByZXR1cm4gdHlwZW9mIG8gPT09ICdmdW5jdGlvbic7IH07XG5jb25zdCBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcbmNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJy4vYXNzaWduJyk7XG5jb25zdCBkYWdyZSA9IHJlcXVpcmUoJ2RhZ3JlJyk7XG5cbi8vIGNvbnN0cnVjdG9yXG4vLyBvcHRpb25zIDogb2JqZWN0IGNvbnRhaW5pbmcgbGF5b3V0IG9wdGlvbnNcbmZ1bmN0aW9uIERhZ3JlTGF5b3V0KCBvcHRpb25zICl7XG4gIHRoaXMub3B0aW9ucyA9IGFzc2lnbigge30sIGRlZmF1bHRzLCBvcHRpb25zICk7XG59XG5cbi8vIHJ1bnMgdGhlIGxheW91dFxuRGFncmVMYXlvdXQucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCl7XG4gIGxldCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICBsZXQgbGF5b3V0ID0gdGhpcztcblxuICBsZXQgY3kgPSBvcHRpb25zLmN5OyAvLyBjeSBpcyBhdXRvbWF0aWNhbGx5IHBvcHVsYXRlZCBmb3IgdXMgaW4gdGhlIGNvbnN0cnVjdG9yXG4gIGxldCBlbGVzID0gb3B0aW9ucy5lbGVzO1xuXG4gIGxldCBnZXRWYWwgPSBmdW5jdGlvbiggZWxlLCB2YWwgKXtcbiAgICByZXR1cm4gaXNGdW5jdGlvbih2YWwpID8gdmFsLmFwcGx5KCBlbGUsIFsgZWxlIF0gKSA6IHZhbDtcbiAgfTtcblxuICBsZXQgYmIgPSBvcHRpb25zLmJvdW5kaW5nQm94IHx8IHsgeDE6IDAsIHkxOiAwLCB3OiBjeS53aWR0aCgpLCBoOiBjeS5oZWlnaHQoKSB9O1xuICBpZiggYmIueDIgPT09IHVuZGVmaW5lZCApeyBiYi54MiA9IGJiLngxICsgYmIudzsgfVxuICBpZiggYmIudyA9PT0gdW5kZWZpbmVkICl7IGJiLncgPSBiYi54MiAtIGJiLngxOyB9XG4gIGlmKCBiYi55MiA9PT0gdW5kZWZpbmVkICl7IGJiLnkyID0gYmIueTEgKyBiYi5oOyB9XG4gIGlmKCBiYi5oID09PSB1bmRlZmluZWQgKXsgYmIuaCA9IGJiLnkyIC0gYmIueTE7IH1cblxuICBsZXQgZyA9IG5ldyBkYWdyZS5ncmFwaGxpYi5HcmFwaCh7XG4gICAgbXVsdGlncmFwaDogdHJ1ZSxcbiAgICBjb21wb3VuZDogdHJ1ZVxuICB9KTtcblxuICBsZXQgZ09iaiA9IHt9O1xuICBsZXQgc2V0R09iaiA9IGZ1bmN0aW9uKCBuYW1lLCB2YWwgKXtcbiAgICBpZiggdmFsICE9IG51bGwgKXtcbiAgICAgIGdPYmpbIG5hbWUgXSA9IHZhbDtcbiAgICB9XG4gIH07XG5cbiAgc2V0R09iaiggJ25vZGVzZXAnLCBvcHRpb25zLm5vZGVTZXAgKTtcbiAgc2V0R09iaiggJ2VkZ2VzZXAnLCBvcHRpb25zLmVkZ2VTZXAgKTtcbiAgc2V0R09iaiggJ3JhbmtzZXAnLCBvcHRpb25zLnJhbmtTZXAgKTtcbiAgc2V0R09iaiggJ3JhbmtkaXInLCBvcHRpb25zLnJhbmtEaXIgKTtcbiAgc2V0R09iaiggJ2FsaWduJywgb3B0aW9ucy5hbGlnbik7XG4gIHNldEdPYmooICdyYW5rZXInLCBvcHRpb25zLnJhbmtlciApO1xuICBzZXRHT2JqKCAnYWN5Y2xpY2VyJywgb3B0aW9ucy5hY3ljbGljZXIpO1xuXG4gIGcuc2V0R3JhcGgoIGdPYmogKTtcblxuICBnLnNldERlZmF1bHRFZGdlTGFiZWwoZnVuY3Rpb24oKSB7IHJldHVybiB7fTsgfSk7XG4gIGcuc2V0RGVmYXVsdE5vZGVMYWJlbChmdW5jdGlvbigpIHsgcmV0dXJuIHt9OyB9KTtcblxuICAvLyBhZGQgbm9kZXMgdG8gZGFncmVcbiAgbGV0IG5vZGVzID0gZWxlcy5ub2RlcygpO1xuXG4gIGlmICggaXNGdW5jdGlvbihvcHRpb25zLnNvcnQpICkge1xuICAgIG5vZGVzID0gbm9kZXMuc29ydCggb3B0aW9ucy5zb3J0ICk7XG4gIH1cblxuICBmb3IoIGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrICl7XG4gICAgbGV0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICBsZXQgbmJiID0gbm9kZS5sYXlvdXREaW1lbnNpb25zKCBvcHRpb25zICk7XG5cbiAgICBnLnNldE5vZGUoIG5vZGUuaWQoKSwge1xuICAgICAgd2lkdGg6IG5iYi53LFxuICAgICAgaGVpZ2h0OiBuYmIuaCxcbiAgICAgIG5hbWU6IG5vZGUuaWQoKVxuICAgIH0gKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCBnLm5vZGUobm9kZS5pZCgpKSApO1xuICB9XG5cbiAgLy8gc2V0IGNvbXBvdW5kIHBhcmVudHNcbiAgZm9yKCBsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKyApe1xuICAgIGxldCBub2RlID0gbm9kZXNbaV07XG5cbiAgICBpZiggbm9kZS5pc0NoaWxkKCkgKXtcbiAgICAgIGcuc2V0UGFyZW50KCBub2RlLmlkKCksIG5vZGUucGFyZW50KCkuaWQoKSApO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFkZCBlZGdlcyB0byBkYWdyZVxuICBsZXQgZWRnZXMgPSBlbGVzLmVkZ2VzKCkuc3RkRmlsdGVyKGZ1bmN0aW9uKCBlZGdlICl7XG4gICAgcmV0dXJuICFlZGdlLnNvdXJjZSgpLmlzUGFyZW50KCkgJiYgIWVkZ2UudGFyZ2V0KCkuaXNQYXJlbnQoKTsgLy8gZGFncmUgY2FuJ3QgaGFuZGxlIGVkZ2VzIG9uIGNvbXBvdW5kIG5vZGVzXG4gIH0pO1xuXG4gIGlmICggaXNGdW5jdGlvbihvcHRpb25zLnNvcnQpICkge1xuICAgIGVkZ2VzID0gZWRnZXMuc29ydCggb3B0aW9ucy5zb3J0ICk7XG4gIH1cblxuICBmb3IoIGxldCBpID0gMDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrICl7XG4gICAgbGV0IGVkZ2UgPSBlZGdlc1tpXTtcblxuICAgIGcuc2V0RWRnZSggZWRnZS5zb3VyY2UoKS5pZCgpLCBlZGdlLnRhcmdldCgpLmlkKCksIHtcbiAgICAgIG1pbmxlbjogZ2V0VmFsKCBlZGdlLCBvcHRpb25zLm1pbkxlbiApLFxuICAgICAgd2VpZ2h0OiBnZXRWYWwoIGVkZ2UsIG9wdGlvbnMuZWRnZVdlaWdodCApLFxuICAgICAgbmFtZTogZWRnZS5pZCgpXG4gICAgfSwgZWRnZS5pZCgpICk7XG5cbiAgICAvLyBjb25zb2xlLmxvZyggZy5lZGdlKGVkZ2Uuc291cmNlKCkuaWQoKSwgZWRnZS50YXJnZXQoKS5pZCgpLCBlZGdlLmlkKCkpICk7XG4gIH1cblxuICBkYWdyZS5sYXlvdXQoIGcgKTtcblxuICBsZXQgZ05vZGVJZHMgPSBnLm5vZGVzKCk7XG4gIGZvciggbGV0IGkgPSAwOyBpIDwgZ05vZGVJZHMubGVuZ3RoOyBpKysgKXtcbiAgICBsZXQgaWQgPSBnTm9kZUlkc1tpXTtcbiAgICBsZXQgbiA9IGcubm9kZSggaWQgKTtcblxuICAgIGN5LmdldEVsZW1lbnRCeUlkKGlkKS5zY3JhdGNoKCkuZGFncmUgPSBuO1xuICB9XG5cbiAgbGV0IGRhZ3JlQkI7XG5cbiAgaWYoIG9wdGlvbnMuYm91bmRpbmdCb3ggKXtcbiAgICBkYWdyZUJCID0geyB4MTogSW5maW5pdHksIHgyOiAtSW5maW5pdHksIHkxOiBJbmZpbml0eSwgeTI6IC1JbmZpbml0eSB9O1xuICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24oIG5vZGUgKXtcbiAgICAgIGxldCBkTW9kZWwgPSBub2RlLnNjcmF0Y2goKS5kYWdyZTtcblxuICAgICAgZGFncmVCQi54MSA9IE1hdGgubWluKCBkYWdyZUJCLngxLCBkTW9kZWwueCApO1xuICAgICAgZGFncmVCQi54MiA9IE1hdGgubWF4KCBkYWdyZUJCLngyLCBkTW9kZWwueCApO1xuXG4gICAgICBkYWdyZUJCLnkxID0gTWF0aC5taW4oIGRhZ3JlQkIueTEsIGRNb2RlbC55ICk7XG4gICAgICBkYWdyZUJCLnkyID0gTWF0aC5tYXgoIGRhZ3JlQkIueTIsIGRNb2RlbC55ICk7XG4gICAgfSk7XG5cbiAgICBkYWdyZUJCLncgPSBkYWdyZUJCLngyIC0gZGFncmVCQi54MTtcbiAgICBkYWdyZUJCLmggPSBkYWdyZUJCLnkyIC0gZGFncmVCQi55MTtcbiAgfSBlbHNlIHtcbiAgICBkYWdyZUJCID0gYmI7XG4gIH1cblxuICBsZXQgY29uc3RyYWluUG9zID0gZnVuY3Rpb24oIHAgKXtcbiAgICBpZiggb3B0aW9ucy5ib3VuZGluZ0JveCApe1xuICAgICAgbGV0IHhQY3QgPSBkYWdyZUJCLncgPT09IDAgPyAwIDogKHAueCAtIGRhZ3JlQkIueDEpIC8gZGFncmVCQi53O1xuICAgICAgbGV0IHlQY3QgPSBkYWdyZUJCLmggPT09IDAgPyAwIDogKHAueSAtIGRhZ3JlQkIueTEpIC8gZGFncmVCQi5oO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiBiYi54MSArIHhQY3QgKiBiYi53LFxuICAgICAgICB5OiBiYi55MSArIHlQY3QgKiBiYi5oXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gIH07XG5cbiAgbm9kZXMubGF5b3V0UG9zaXRpb25zKGxheW91dCwgb3B0aW9ucywgZnVuY3Rpb24oIGVsZSApe1xuICAgIGVsZSA9IHR5cGVvZiBlbGUgPT09IFwib2JqZWN0XCIgPyBlbGUgOiB0aGlzO1xuICAgIGxldCBkTW9kZWwgPSBlbGUuc2NyYXRjaCgpLmRhZ3JlO1xuXG4gICAgcmV0dXJuIGNvbnN0cmFpblBvcyh7XG4gICAgICB4OiBkTW9kZWwueCxcbiAgICAgIHk6IGRNb2RlbC55XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzOyAvLyBjaGFpbmluZ1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYWdyZUxheW91dDtcbiIsIi8qXG5Db3B5cmlnaHQgKGMpIDIwMTItMjAxNCBDaHJpcyBQZXR0aXR0XG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS5cbiovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBncmFwaGxpYjogcmVxdWlyZShcIi4vbGliL2dyYXBobGliXCIpLFxuXG4gIGxheW91dDogcmVxdWlyZShcIi4vbGliL2xheW91dFwiKSxcbiAgZGVidWc6IHJlcXVpcmUoXCIuL2xpYi9kZWJ1Z1wiKSxcbiAgdXRpbDoge1xuICAgIHRpbWU6IHJlcXVpcmUoXCIuL2xpYi91dGlsXCIpLnRpbWUsXG4gICAgbm90aW1lOiByZXF1aXJlKFwiLi9saWIvdXRpbFwiKS5ub3RpbWVcbiAgfSxcbiAgdmVyc2lvbjogcmVxdWlyZShcIi4vbGliL3ZlcnNpb25cIilcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF8gPSByZXF1aXJlKFwiLi9sb2Rhc2hcIik7XG52YXIgZ3JlZWR5RkFTID0gcmVxdWlyZShcIi4vZ3JlZWR5LWZhc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJ1bjogcnVuLFxuICB1bmRvOiB1bmRvXG59O1xuXG5mdW5jdGlvbiBydW4oZykge1xuICB2YXIgZmFzID0gKGcuZ3JhcGgoKS5hY3ljbGljZXIgPT09IFwiZ3JlZWR5XCJcbiAgICA/IGdyZWVkeUZBUyhnLCB3ZWlnaHRGbihnKSlcbiAgICA6IGRmc0ZBUyhnKSk7XG4gIF8uZm9yRWFjaChmYXMsIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgbGFiZWwgPSBnLmVkZ2UoZSk7XG4gICAgZy5yZW1vdmVFZGdlKGUpO1xuICAgIGxhYmVsLmZvcndhcmROYW1lID0gZS5uYW1lO1xuICAgIGxhYmVsLnJldmVyc2VkID0gdHJ1ZTtcbiAgICBnLnNldEVkZ2UoZS53LCBlLnYsIGxhYmVsLCBfLnVuaXF1ZUlkKFwicmV2XCIpKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gd2VpZ2h0Rm4oZykge1xuICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICByZXR1cm4gZy5lZGdlKGUpLndlaWdodDtcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGRmc0ZBUyhnKSB7XG4gIHZhciBmYXMgPSBbXTtcbiAgdmFyIHN0YWNrID0ge307XG4gIHZhciB2aXNpdGVkID0ge307XG5cbiAgZnVuY3Rpb24gZGZzKHYpIHtcbiAgICBpZiAoXy5oYXModmlzaXRlZCwgdikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmlzaXRlZFt2XSA9IHRydWU7XG4gICAgc3RhY2tbdl0gPSB0cnVlO1xuICAgIF8uZm9yRWFjaChnLm91dEVkZ2VzKHYpLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoXy5oYXMoc3RhY2ssIGUudykpIHtcbiAgICAgICAgZmFzLnB1c2goZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZnMoZS53KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBkZWxldGUgc3RhY2tbdl07XG4gIH1cblxuICBfLmZvckVhY2goZy5ub2RlcygpLCBkZnMpO1xuICByZXR1cm4gZmFzO1xufVxuXG5mdW5jdGlvbiB1bmRvKGcpIHtcbiAgXy5mb3JFYWNoKGcuZWRnZXMoKSwgZnVuY3Rpb24oZSkge1xuICAgIHZhciBsYWJlbCA9IGcuZWRnZShlKTtcbiAgICBpZiAobGFiZWwucmV2ZXJzZWQpIHtcbiAgICAgIGcucmVtb3ZlRWRnZShlKTtcblxuICAgICAgdmFyIGZvcndhcmROYW1lID0gbGFiZWwuZm9yd2FyZE5hbWU7XG4gICAgICBkZWxldGUgbGFiZWwucmV2ZXJzZWQ7XG4gICAgICBkZWxldGUgbGFiZWwuZm9yd2FyZE5hbWU7XG4gICAgICBnLnNldEVkZ2UoZS53LCBlLnYsIGxhYmVsLCBmb3J3YXJkTmFtZSk7XG4gICAgfVxuICB9KTtcbn1cbiIsInZhciBfID0gcmVxdWlyZShcIi4vbG9kYXNoXCIpO1xudmFyIHV0aWwgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZEJvcmRlclNlZ21lbnRzO1xuXG5mdW5jdGlvbiBhZGRCb3JkZXJTZWdtZW50cyhnKSB7XG4gIGZ1bmN0aW9uIGRmcyh2KSB7XG4gICAgdmFyIGNoaWxkcmVuID0gZy5jaGlsZHJlbih2KTtcbiAgICB2YXIgbm9kZSA9IGcubm9kZSh2KTtcbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBfLmZvckVhY2goY2hpbGRyZW4sIGRmcyk7XG4gICAgfVxuXG4gICAgaWYgKF8uaGFzKG5vZGUsIFwibWluUmFua1wiKSkge1xuICAgICAgbm9kZS5ib3JkZXJMZWZ0ID0gW107XG4gICAgICBub2RlLmJvcmRlclJpZ2h0ID0gW107XG4gICAgICBmb3IgKHZhciByYW5rID0gbm9kZS5taW5SYW5rLCBtYXhSYW5rID0gbm9kZS5tYXhSYW5rICsgMTtcbiAgICAgICAgcmFuayA8IG1heFJhbms7XG4gICAgICAgICsrcmFuaykge1xuICAgICAgICBhZGRCb3JkZXJOb2RlKGcsIFwiYm9yZGVyTGVmdFwiLCBcIl9ibFwiLCB2LCBub2RlLCByYW5rKTtcbiAgICAgICAgYWRkQm9yZGVyTm9kZShnLCBcImJvcmRlclJpZ2h0XCIsIFwiX2JyXCIsIHYsIG5vZGUsIHJhbmspO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF8uZm9yRWFjaChnLmNoaWxkcmVuKCksIGRmcyk7XG59XG5cbmZ1bmN0aW9uIGFkZEJvcmRlck5vZGUoZywgcHJvcCwgcHJlZml4LCBzZywgc2dOb2RlLCByYW5rKSB7XG4gIHZhciBsYWJlbCA9IHsgd2lkdGg6IDAsIGhlaWdodDogMCwgcmFuazogcmFuaywgYm9yZGVyVHlwZTogcHJvcCB9O1xuICB2YXIgcHJldiA9IHNnTm9kZVtwcm9wXVtyYW5rIC0gMV07XG4gIHZhciBjdXJyID0gdXRpbC5hZGREdW1teU5vZGUoZywgXCJib3JkZXJcIiwgbGFiZWwsIHByZWZpeCk7XG4gIHNnTm9kZVtwcm9wXVtyYW5rXSA9IGN1cnI7XG4gIGcuc2V0UGFyZW50KGN1cnIsIHNnKTtcbiAgaWYgKHByZXYpIHtcbiAgICBnLnNldEVkZ2UocHJldiwgY3VyciwgeyB3ZWlnaHQ6IDEgfSk7XG4gIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgXyA9IHJlcXVpcmUoXCIuL2xvZGFzaFwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkanVzdDogYWRqdXN0LFxuICB1bmRvOiB1bmRvXG59O1xuXG5mdW5jdGlvbiBhZGp1c3QoZykge1xuICB2YXIgcmFua0RpciA9IGcuZ3JhcGgoKS5yYW5rZGlyLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChyYW5rRGlyID09PSBcImxyXCIgfHwgcmFua0RpciA9PT0gXCJybFwiKSB7XG4gICAgc3dhcFdpZHRoSGVpZ2h0KGcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuZG8oZykge1xuICB2YXIgcmFua0RpciA9IGcuZ3JhcGgoKS5yYW5rZGlyLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChyYW5rRGlyID09PSBcImJ0XCIgfHwgcmFua0RpciA9PT0gXCJybFwiKSB7XG4gICAgcmV2ZXJzZVkoZyk7XG4gIH1cblxuICBpZiAocmFua0RpciA9PT0gXCJsclwiIHx8IHJhbmtEaXIgPT09IFwicmxcIikge1xuICAgIHN3YXBYWShnKTtcbiAgICBzd2FwV2lkdGhIZWlnaHQoZyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc3dhcFdpZHRoSGVpZ2h0KGcpIHtcbiAgXy5mb3JFYWNoKGcubm9kZXMoKSwgZnVuY3Rpb24odikgeyBzd2FwV2lkdGhIZWlnaHRPbmUoZy5ub2RlKHYpKTsgfSk7XG4gIF8uZm9yRWFjaChnLmVkZ2VzKCksIGZ1bmN0aW9uKGUpIHsgc3dhcFdpZHRoSGVpZ2h0T25lKGcuZWRnZShlKSk7IH0pO1xufVxuXG5mdW5jdGlvbiBzd2FwV2lkdGhIZWlnaHRPbmUoYXR0cnMpIHtcbiAgdmFyIHcgPSBhdHRycy53aWR0aDtcbiAgYXR0cnMud2lkdGggPSBhdHRycy5oZWlnaHQ7XG4gIGF0dHJzLmhlaWdodCA9IHc7XG59XG5cbmZ1bmN0aW9uIHJldmVyc2VZKGcpIHtcbiAgXy5mb3JFYWNoKGcubm9kZXMoKSwgZnVuY3Rpb24odikgeyByZXZlcnNlWU9uZShnLm5vZGUodikpOyB9KTtcblxuICBfLmZvckVhY2goZy5lZGdlcygpLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGVkZ2UgPSBnLmVkZ2UoZSk7XG4gICAgXy5mb3JFYWNoKGVkZ2UucG9pbnRzLCByZXZlcnNlWU9uZSk7XG4gICAgaWYgKF8uaGFzKGVkZ2UsIFwieVwiKSkge1xuICAgICAgcmV2ZXJzZVlPbmUoZWRnZSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmV2ZXJzZVlPbmUoYXR0cnMpIHtcbiAgYXR0cnMueSA9IC1hdHRycy55O1xufVxuXG5mdW5jdGlvbiBzd2FwWFkoZykge1xuICBfLmZvckVhY2goZy5ub2RlcygpLCBmdW5jdGlvbih2KSB7IHN3YXBYWU9uZShnLm5vZGUodikpOyB9KTtcblxuICBfLmZvckVhY2goZy5lZGdlcygpLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGVkZ2UgPSBnLmVkZ2UoZSk7XG4gICAgXy5mb3JFYWNoKGVkZ2UucG9pbnRzLCBzd2FwWFlPbmUpO1xuICAgIGlmIChfLmhhcyhlZGdlLCBcInhcIikpIHtcbiAgICAgIHN3YXBYWU9uZShlZGdlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzd2FwWFlPbmUoYXR0cnMpIHtcbiAgdmFyIHggPSBhdHRycy54O1xuICBhdHRycy54ID0gYXR0cnMueTtcbiAgYXR0cnMueSA9IHg7XG59XG4iLCIvKlxuICogU2ltcGxlIGRvdWJseSBsaW5rZWQgbGlzdCBpbXBsZW1lbnRhdGlvbiBkZXJpdmVkIGZyb20gQ29ybWVuLCBldCBhbC4sXG4gKiBcIkludHJvZHVjdGlvbiB0byBBbGdvcml0aG1zXCIuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0O1xuXG5mdW5jdGlvbiBMaXN0KCkge1xuICB2YXIgc2VudGluZWwgPSB7fTtcbiAgc2VudGluZWwuX25leHQgPSBzZW50aW5lbC5fcHJldiA9IHNlbnRpbmVsO1xuICB0aGlzLl9zZW50aW5lbCA9IHNlbnRpbmVsO1xufVxuXG5MaXN0LnByb3RvdHlwZS5kZXF1ZXVlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZW50aW5lbCA9IHRoaXMuX3NlbnRpbmVsO1xuICB2YXIgZW50cnkgPSBzZW50aW5lbC5fcHJldjtcbiAgaWYgKGVudHJ5ICE9PSBzZW50aW5lbCkge1xuICAgIHVubGluayhlbnRyeSk7XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG59O1xuXG5MaXN0LnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24oZW50cnkpIHtcbiAgdmFyIHNlbnRpbmVsID0gdGhpcy5fc2VudGluZWw7XG4gIGlmIChlbnRyeS5fcHJldiAmJiBlbnRyeS5fbmV4dCkge1xuICAgIHVubGluayhlbnRyeSk7XG4gIH1cbiAgZW50cnkuX25leHQgPSBzZW50aW5lbC5fbmV4dDtcbiAgc2VudGluZWwuX25leHQuX3ByZXYgPSBlbnRyeTtcbiAgc2VudGluZWwuX25leHQgPSBlbnRyeTtcbiAgZW50cnkuX3ByZXYgPSBzZW50aW5lbDtcbn07XG5cbkxpc3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzdHJzID0gW107XG4gIHZhciBzZW50aW5lbCA9IHRoaXMuX3NlbnRpbmVsO1xuICB2YXIgY3VyciA9IHNlbnRpbmVsLl9wcmV2O1xuICB3aGlsZSAoY3VyciAhPT0gc2VudGluZWwpIHtcbiAgICBzdHJzLnB1c2goSlNPTi5zdHJpbmdpZnkoY3VyciwgZmlsdGVyT3V0TGlua3MpKTtcbiAgICBjdXJyID0gY3Vyci5fcHJldjtcbiAgfVxuICByZXR1cm4gXCJbXCIgKyBzdHJzLmpvaW4oXCIsIFwiKSArIFwiXVwiO1xufTtcblxuZnVuY3Rpb24gdW5saW5rKGVudHJ5KSB7XG4gIGVudHJ5Ll9wcmV2Ll9uZXh0ID0gZW50cnkuX25leHQ7XG4gIGVudHJ5Ll9uZXh0Ll9wcmV2ID0gZW50cnkuX3ByZXY7XG4gIGRlbGV0ZSBlbnRyeS5fbmV4dDtcbiAgZGVsZXRlIGVudHJ5Ll9wcmV2O1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJPdXRMaW5rcyhrLCB2KSB7XG4gIGlmIChrICE9PSBcIl9uZXh0XCIgJiYgayAhPT0gXCJfcHJldlwiKSB7XG4gICAgcmV0dXJuIHY7XG4gIH1cbn1cbiIsInZhciBfID0gcmVxdWlyZShcIi4vbG9kYXNoXCIpO1xudmFyIHV0aWwgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIEdyYXBoID0gcmVxdWlyZShcIi4vZ3JhcGhsaWJcIikuR3JhcGg7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkZWJ1Z09yZGVyaW5nOiBkZWJ1Z09yZGVyaW5nXG59O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZnVuY3Rpb24gZGVidWdPcmRlcmluZyhnKSB7XG4gIHZhciBsYXllck1hdHJpeCA9IHV0aWwuYnVpbGRMYXllck1hdHJpeChnKTtcblxuICB2YXIgaCA9IG5ldyBHcmFwaCh7IGNvbXBvdW5kOiB0cnVlLCBtdWx0aWdyYXBoOiB0cnVlIH0pLnNldEdyYXBoKHt9KTtcblxuICBfLmZvckVhY2goZy5ub2RlcygpLCBmdW5jdGlvbih2KSB7XG4gICAgaC5zZXROb2RlKHYsIHsgbGFiZWw6IHYgfSk7XG4gICAgaC5zZXRQYXJlbnQodiwgXCJsYXllclwiICsgZy5ub2RlKHYpLnJhbmspO1xuICB9KTtcblxuICBfLmZvckVhY2goZy5lZGdlcygpLCBmdW5jdGlvbihlKSB7XG4gICAgaC5zZXRFZGdlKGUudiwgZS53LCB7fSwgZS5uYW1lKTtcbiAgfSk7XG5cbiAgXy5mb3JFYWNoKGxheWVyTWF0cml4LCBmdW5jdGlvbihsYXllciwgaSkge1xuICAgIHZhciBsYXllclYgPSBcImxheWVyXCIgKyBpO1xuICAgIGguc2V0Tm9kZShsYXllclYsIHsgcmFuazogXCJzYW1lXCIgfSk7XG4gICAgXy5yZWR1Y2UobGF5ZXIsIGZ1bmN0aW9uKHUsIHYpIHtcbiAgICAgIGguc2V0RWRnZSh1LCB2LCB7IHN0eWxlOiBcImludmlzXCIgfSk7XG4gICAgICByZXR1cm4gdjtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGg7XG59XG4iLCIvKiBnbG9iYWwgd2luZG93ICovXG5cbnZhciBncmFwaGxpYjtcblxuaWYgKHR5cGVvZiByZXF1aXJlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgdHJ5IHtcbiAgICBncmFwaGxpYiA9IHJlcXVpcmUoXCJncmFwaGxpYlwiKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGNvbnRpbnVlIHJlZ2FyZGxlc3Mgb2YgZXJyb3JcbiAgfVxufVxuXG5pZiAoIWdyYXBobGliKSB7XG4gIGdyYXBobGliID0gd2luZG93LmdyYXBobGliO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdyYXBobGliO1xuIiwidmFyIF8gPSByZXF1aXJlKFwiLi9sb2Rhc2hcIik7XG52YXIgR3JhcGggPSByZXF1aXJlKFwiLi9ncmFwaGxpYlwiKS5HcmFwaDtcbnZhciBMaXN0ID0gcmVxdWlyZShcIi4vZGF0YS9saXN0XCIpO1xuXG4vKlxuICogQSBncmVlZHkgaGV1cmlzdGljIGZvciBmaW5kaW5nIGEgZmVlZGJhY2sgYXJjIHNldCBmb3IgYSBncmFwaC4gQSBmZWVkYmFja1xuICogYXJjIHNldCBpcyBhIHNldCBvZiBlZGdlcyB0aGF0IGNhbiBiZSByZW1vdmVkIHRvIG1ha2UgYSBncmFwaCBhY3ljbGljLlxuICogVGhlIGFsZ29yaXRobSBjb21lcyBmcm9tOiBQLiBFYWRlcywgWC4gTGluLCBhbmQgVy4gRi4gU215dGgsIFwiQSBmYXN0IGFuZFxuICogZWZmZWN0aXZlIGhldXJpc3RpYyBmb3IgdGhlIGZlZWRiYWNrIGFyYyBzZXQgcHJvYmxlbS5cIiBUaGlzIGltcGxlbWVudGF0aW9uXG4gKiBhZGp1c3RzIHRoYXQgZnJvbSB0aGUgcGFwZXIgdG8gYWxsb3cgZm9yIHdlaWdodGVkIGVkZ2VzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGdyZWVkeUZBUztcblxudmFyIERFRkFVTFRfV0VJR0hUX0ZOID0gXy5jb25zdGFudCgxKTtcblxuZnVuY3Rpb24gZ3JlZWR5RkFTKGcsIHdlaWdodEZuKSB7XG4gIGlmIChnLm5vZGVDb3VudCgpIDw9IDEpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgdmFyIHN0YXRlID0gYnVpbGRTdGF0ZShnLCB3ZWlnaHRGbiB8fCBERUZBVUxUX1dFSUdIVF9GTik7XG4gIHZhciByZXN1bHRzID0gZG9HcmVlZHlGQVMoc3RhdGUuZ3JhcGgsIHN0YXRlLmJ1Y2tldHMsIHN0YXRlLnplcm9JZHgpO1xuXG4gIC8vIEV4cGFuZCBtdWx0aS1lZGdlc1xuICByZXR1cm4gXy5mbGF0dGVuKF8ubWFwKHJlc3VsdHMsIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZy5vdXRFZGdlcyhlLnYsIGUudyk7XG4gIH0pLCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gZG9HcmVlZHlGQVMoZywgYnVja2V0cywgemVyb0lkeCkge1xuICB2YXIgcmVzdWx0cyA9IFtdO1xuICB2YXIgc291cmNlcyA9IGJ1Y2tldHNbYnVja2V0cy5sZW5ndGggLSAxXTtcbiAgdmFyIHNpbmtzID0gYnVja2V0c1swXTtcblxuICB2YXIgZW50cnk7XG4gIHdoaWxlIChnLm5vZGVDb3VudCgpKSB7XG4gICAgd2hpbGUgKChlbnRyeSA9IHNpbmtzLmRlcXVldWUoKSkpICAgeyByZW1vdmVOb2RlKGcsIGJ1Y2tldHMsIHplcm9JZHgsIGVudHJ5KTsgfVxuICAgIHdoaWxlICgoZW50cnkgPSBzb3VyY2VzLmRlcXVldWUoKSkpIHsgcmVtb3ZlTm9kZShnLCBidWNrZXRzLCB6ZXJvSWR4LCBlbnRyeSk7IH1cbiAgICBpZiAoZy5ub2RlQ291bnQoKSkge1xuICAgICAgZm9yICh2YXIgaSA9IGJ1Y2tldHMubGVuZ3RoIC0gMjsgaSA+IDA7IC0taSkge1xuICAgICAgICBlbnRyeSA9IGJ1Y2tldHNbaV0uZGVxdWV1ZSgpO1xuICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5jb25jYXQocmVtb3ZlTm9kZShnLCBidWNrZXRzLCB6ZXJvSWR4LCBlbnRyeSwgdHJ1ZSkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU5vZGUoZywgYnVja2V0cywgemVyb0lkeCwgZW50cnksIGNvbGxlY3RQcmVkZWNlc3NvcnMpIHtcbiAgdmFyIHJlc3VsdHMgPSBjb2xsZWN0UHJlZGVjZXNzb3JzID8gW10gOiB1bmRlZmluZWQ7XG5cbiAgXy5mb3JFYWNoKGcuaW5FZGdlcyhlbnRyeS52KSwgZnVuY3Rpb24oZWRnZSkge1xuICAgIHZhciB3ZWlnaHQgPSBnLmVkZ2UoZWRnZSk7XG4gICAgdmFyIHVFbnRyeSA9IGcubm9kZShlZGdlLnYpO1xuXG4gICAgaWYgKGNvbGxlY3RQcmVkZWNlc3NvcnMpIHtcbiAgICAgIHJlc3VsdHMucHVzaCh7IHY6IGVkZ2UudiwgdzogZWRnZS53IH0pO1xuICAgIH1cblxuICAgIHVFbnRyeS5vdXQgLT0gd2VpZ2h0O1xuICAgIGFzc2lnbkJ1Y2tldChidWNrZXRzLCB6ZXJvSWR4LCB1RW50cnkpO1xuICB9KTtcblxuICBfLmZvckVhY2goZy5vdXRFZGdlcyhlbnRyeS52KSwgZnVuY3Rpb24oZWRnZSkge1xuICAgIHZhciB3ZWlnaHQgPSBnLmVkZ2UoZWRnZSk7XG4gICAgdmFyIHcgPSBlZGdlLnc7XG4gICAgdmFyIHdFbnRyeSA9IGcubm9kZSh3KTtcbiAgICB3RW50cnlbXCJpblwiXSAtPSB3ZWlnaHQ7XG4gICAgYXNzaWduQnVja2V0KGJ1Y2tldHMsIHplcm9JZHgsIHdFbnRyeSk7XG4gIH0pO1xuXG4gIGcucmVtb3ZlTm9kZShlbnRyeS52KTtcblxuICByZXR1cm4gcmVzdWx0cztcbn1cblxuZnVuY3Rpb24gYnVpbGRTdGF0ZShnLCB3ZWlnaHRGbikge1xuICB2YXIgZmFzR3JhcGggPSBuZXcgR3JhcGgoKTtcbiAgdmFyIG1heEluID0gMDtcbiAgdmFyIG1heE91dCA9IDA7XG5cbiAgXy5mb3JFYWNoKGcubm9kZXMoKSwgZnVuY3Rpb24odikge1xuICAgIGZhc0dyYXBoLnNldE5vZGUodiwgeyB2OiB2LCBcImluXCI6IDAsIG91dDogMCB9KTtcbiAgfSk7XG5cbiAgLy8gQWdncmVnYXRlIHdlaWdodHMgb24gbm9kZXMsIGJ1dCBhbHNvIHN1bSB0aGUgd2VpZ2h0cyBhY3Jvc3MgbXVsdGktZWRnZXNcbiAgLy8gaW50byBhIHNpbmdsZSBlZGdlIGZvciB0aGUgZmFzR3JhcGguXG4gIF8uZm9yRWFjaChnLmVkZ2VzKCksIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgcHJldldlaWdodCA9IGZhc0dyYXBoLmVkZ2UoZS52LCBlLncpIHx8IDA7XG4gICAgdmFyIHdlaWdodCA9IHdlaWdodEZuKGUpO1xuICAgIHZhciBlZGdlV2VpZ2h0ID0gcHJldldlaWdodCArIHdlaWdodDtcbiAgICBmYXNHcmFwaC5zZXRFZGdlKGUudiwgZS53LCBlZGdlV2VpZ2h0KTtcbiAgICBtYXhPdXQgPSBNYXRoLm1heChtYXhPdXQsIGZhc0dyYXBoLm5vZGUoZS52KS5vdXQgKz0gd2VpZ2h0KTtcbiAgICBtYXhJbiAgPSBNYXRoLm1heChtYXhJbiwgIGZhc0dyYXBoLm5vZGUoZS53KVtcImluXCJdICArPSB3ZWlnaHQpO1xuICB9KTtcblxuICB2YXIgYnVja2V0cyA9IF8ucmFuZ2UobWF4T3V0ICsgbWF4SW4gKyAzKS5tYXAoZnVuY3Rpb24oKSB7IHJldHVybiBuZXcgTGlzdCgpOyB9KTtcbiAgdmFyIHplcm9JZHggPSBtYXhJbiArIDE7XG5cbiAgXy5mb3JFYWNoKGZhc0dyYXBoLm5vZGVzKCksIGZ1bmN0aW9uKHYpIHtcbiAgICBhc3NpZ25CdWNrZXQoYnVja2V0cywgemVyb0lkeCwgZmFzR3JhcGgubm9kZSh2KSk7XG4gIH0pO1xuXG4gIHJldHVybiB7IGdyYXBoOiBmYXNHcmFwaCwgYnVja2V0czogYnVja2V0cywgemVyb0lkeDogemVyb0lkeCB9O1xufVxuXG5mdW5jdGlvbiBhc3NpZ25CdWNrZXQoYnVja2V0cywgemVyb0lkeCwgZW50cnkpIHtcbiAgaWYgKCFlbnRyeS5vdXQpIHtcbiAgICBidWNrZXRzWzBdLmVucXVldWUoZW50cnkpO1xuICB9IGVsc2UgaWYgKCFlbnRyeVtcImluXCJdKSB7XG4gICAgYnVja2V0c1tidWNrZXRzLmxlbmd0aCAtIDFdLmVucXVldWUoZW50cnkpO1xuICB9IGVsc2Uge1xuICAgIGJ1Y2tldHNbZW50cnkub3V0IC0gZW50cnlbXCJpblwiXSArIHplcm9JZHhdLmVucXVldWUoZW50cnkpO1xuICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF8gPSByZXF1aXJlKFwiLi9sb2Rhc2hcIik7XG52YXIgYWN5Y2xpYyA9IHJlcXVpcmUoXCIuL2FjeWNsaWNcIik7XG52YXIgbm9ybWFsaXplID0gcmVxdWlyZShcIi4vbm9ybWFsaXplXCIpO1xudmFyIHJhbmsgPSByZXF1aXJlKFwiLi9yYW5rXCIpO1xudmFyIG5vcm1hbGl6ZVJhbmtzID0gcmVxdWlyZShcIi4vdXRpbFwiKS5ub3JtYWxpemVSYW5rcztcbnZhciBwYXJlbnREdW1teUNoYWlucyA9IHJlcXVpcmUoXCIuL3BhcmVudC1kdW1teS1jaGFpbnNcIik7XG52YXIgcmVtb3ZlRW1wdHlSYW5rcyA9IHJlcXVpcmUoXCIuL3V0aWxcIikucmVtb3ZlRW1wdHlSYW5rcztcbnZhciBuZXN0aW5nR3JhcGggPSByZXF1aXJlKFwiLi9uZXN0aW5nLWdyYXBoXCIpO1xudmFyIGFkZEJvcmRlclNlZ21lbnRzID0gcmVxdWlyZShcIi4vYWRkLWJvcmRlci1zZWdtZW50c1wiKTtcbnZhciBjb29yZGluYXRlU3lzdGVtID0gcmVxdWlyZShcIi4vY29vcmRpbmF0ZS1zeXN0ZW1cIik7XG52YXIgb3JkZXIgPSByZXF1aXJlKFwiLi9vcmRlclwiKTtcbnZhciBwb3NpdGlvbiA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uXCIpO1xudmFyIHV0aWwgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIEdyYXBoID0gcmVxdWlyZShcIi4vZ3JhcGhsaWJcIikuR3JhcGg7XG5cbm1vZHVsZS5leHBvcnRzID0gbGF5b3V0O1xuXG5mdW5jdGlvbiBsYXlvdXQoZywgb3B0cykge1xuICB2YXIgdGltZSA9IG9wdHMgJiYgb3B0cy5kZWJ1Z1RpbWluZyA/IHV0aWwudGltZSA6IHV0aWwubm90aW1lO1xuICB0aW1lKFwibGF5b3V0XCIsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXlvdXRHcmFwaCA9IFxuICAgICAgdGltZShcIiAgYnVpbGRMYXlvdXRHcmFwaFwiLCBmdW5jdGlvbigpIHsgcmV0dXJuIGJ1aWxkTGF5b3V0R3JhcGgoZyk7IH0pO1xuICAgIHRpbWUoXCIgIHJ1bkxheW91dFwiLCAgICAgICAgZnVuY3Rpb24oKSB7IHJ1bkxheW91dChsYXlvdXRHcmFwaCwgdGltZSk7IH0pO1xuICAgIHRpbWUoXCIgIHVwZGF0ZUlucHV0R3JhcGhcIiwgZnVuY3Rpb24oKSB7IHVwZGF0ZUlucHV0R3JhcGgoZywgbGF5b3V0R3JhcGgpOyB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJ1bkxheW91dChnLCB0aW1lKSB7XG4gIHRpbWUoXCIgICAgbWFrZVNwYWNlRm9yRWRnZUxhYmVsc1wiLCBmdW5jdGlvbigpIHsgbWFrZVNwYWNlRm9yRWRnZUxhYmVscyhnKTsgfSk7XG4gIHRpbWUoXCIgICAgcmVtb3ZlU2VsZkVkZ2VzXCIsICAgICAgICBmdW5jdGlvbigpIHsgcmVtb3ZlU2VsZkVkZ2VzKGcpOyB9KTtcbiAgdGltZShcIiAgICBhY3ljbGljXCIsICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyBhY3ljbGljLnJ1bihnKTsgfSk7XG4gIHRpbWUoXCIgICAgbmVzdGluZ0dyYXBoLnJ1blwiLCAgICAgICBmdW5jdGlvbigpIHsgbmVzdGluZ0dyYXBoLnJ1bihnKTsgfSk7XG4gIHRpbWUoXCIgICAgcmFua1wiLCAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHsgcmFuayh1dGlsLmFzTm9uQ29tcG91bmRHcmFwaChnKSk7IH0pO1xuICB0aW1lKFwiICAgIGluamVjdEVkZ2VMYWJlbFByb3hpZXNcIiwgZnVuY3Rpb24oKSB7IGluamVjdEVkZ2VMYWJlbFByb3hpZXMoZyk7IH0pO1xuICB0aW1lKFwiICAgIHJlbW92ZUVtcHR5UmFua3NcIiwgICAgICAgZnVuY3Rpb24oKSB7IHJlbW92ZUVtcHR5UmFua3MoZyk7IH0pO1xuICB0aW1lKFwiICAgIG5lc3RpbmdHcmFwaC5jbGVhbnVwXCIsICAgZnVuY3Rpb24oKSB7IG5lc3RpbmdHcmFwaC5jbGVhbnVwKGcpOyB9KTtcbiAgdGltZShcIiAgICBub3JtYWxpemVSYW5rc1wiLCAgICAgICAgIGZ1bmN0aW9uKCkgeyBub3JtYWxpemVSYW5rcyhnKTsgfSk7XG4gIHRpbWUoXCIgICAgYXNzaWduUmFua01pbk1heFwiLCAgICAgICBmdW5jdGlvbigpIHsgYXNzaWduUmFua01pbk1heChnKTsgfSk7XG4gIHRpbWUoXCIgICAgcmVtb3ZlRWRnZUxhYmVsUHJveGllc1wiLCBmdW5jdGlvbigpIHsgcmVtb3ZlRWRnZUxhYmVsUHJveGllcyhnKTsgfSk7XG4gIHRpbWUoXCIgICAgbm9ybWFsaXplLnJ1blwiLCAgICAgICAgICBmdW5jdGlvbigpIHsgbm9ybWFsaXplLnJ1bihnKTsgfSk7XG4gIHRpbWUoXCIgICAgcGFyZW50RHVtbXlDaGFpbnNcIiwgICAgICBmdW5jdGlvbigpIHsgcGFyZW50RHVtbXlDaGFpbnMoZyk7IH0pO1xuICB0aW1lKFwiICAgIGFkZEJvcmRlclNlZ21lbnRzXCIsICAgICAgZnVuY3Rpb24oKSB7IGFkZEJvcmRlclNlZ21lbnRzKGcpOyB9KTtcbiAgdGltZShcIiAgICBvcmRlclwiLCAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyBvcmRlcihnKTsgfSk7XG4gIHRpbWUoXCIgICAgaW5zZXJ0U2VsZkVkZ2VzXCIsICAgICAgICBmdW5jdGlvbigpIHsgaW5zZXJ0U2VsZkVkZ2VzKGcpOyB9KTtcbiAgdGltZShcIiAgICBhZGp1c3RDb29yZGluYXRlU3lzdGVtXCIsIGZ1bmN0aW9uKCkgeyBjb29yZGluYXRlU3lzdGVtLmFkanVzdChnKTsgfSk7XG4gIHRpbWUoXCIgICAgcG9zaXRpb25cIiwgICAgICAgICAgICAgICBmdW5jdGlvbigpIHsgcG9zaXRpb24oZyk7IH0pO1xuICB0aW1lKFwiICAgIHBvc2l0aW9uU2VsZkVkZ2VzXCIsICAgICAgZnVuY3Rpb24oKSB7IHBvc2l0aW9uU2VsZkVkZ2VzKGcpOyB9KTtcbiAgdGltZShcIiAgICByZW1vdmVCb3JkZXJOb2Rlc1wiLCAgICAgIGZ1bmN0aW9uKCkgeyByZW1vdmVCb3JkZXJOb2RlcyhnKTsgfSk7XG4gIHRpbWUoXCIgICAgbm9ybWFsaXplLnVuZG9cIiwgICAgICAgICBmdW5jdGlvbigpIHsgbm9ybWFsaXplLnVuZG8oZyk7IH0pO1xuICB0aW1lKFwiICAgIGZpeHVwRWRnZUxhYmVsQ29vcmRzXCIsICAgZnVuY3Rpb24oKSB7IGZpeHVwRWRnZUxhYmVsQ29vcmRzKGcpOyB9KTtcbiAgdGltZShcIiAgICB1bmRvQ29vcmRpbmF0ZVN5c3RlbVwiLCAgIGZ1bmN0aW9uKCkgeyBjb29yZGluYXRlU3lzdGVtLnVuZG8oZyk7IH0pO1xuICB0aW1lKFwiICAgIHRyYW5zbGF0ZUdyYXBoXCIsICAgICAgICAgZnVuY3Rpb24oKSB7IHRyYW5zbGF0ZUdyYXBoKGcpOyB9KTtcbiAgdGltZShcIiAgICBhc3NpZ25Ob2RlSW50ZXJzZWN0c1wiLCAgIGZ1bmN0aW9uKCkgeyBhc3NpZ25Ob2RlSW50ZXJzZWN0cyhnKTsgfSk7XG4gIHRpbWUoXCIgICAgcmV2ZXJzZVBvaW50c1wiLCAgICAgICAgICBmdW5jdGlvbigpIHsgcmV2ZXJzZVBvaW50c0ZvclJldmVyc2VkRWRnZXMoZyk7IH0pO1xuICB0aW1lKFwiICAgIGFjeWNsaWMudW5kb1wiLCAgICAgICAgICAgZnVuY3Rpb24oKSB7IGFjeWNsaWMudW5kbyhnKTsgfSk7XG59XG5cbi8qXG4gKiBDb3BpZXMgZmluYWwgbGF5b3V0IGluZm9ybWF0aW9uIGZyb20gdGhlIGxheW91dCBncmFwaCBiYWNrIHRvIHRoZSBpbnB1dFxuICogZ3JhcGguIFRoaXMgcHJvY2VzcyBvbmx5IGNvcGllcyB3aGl0ZWxpc3RlZCBhdHRyaWJ1dGVzIGZyb20gdGhlIGxheW91dCBncmFwaFxuICogdG8gdGhlIGlucHV0IGdyYXBoLCBzbyBpdCBzZXJ2ZXMgYXMgYSBnb29kIHBsYWNlIHRvIGRldGVybWluZSB3aGF0XG4gKiBhdHRyaWJ1dGVzIGNhbiBpbmZsdWVuY2UgbGF5b3V0LlxuICovXG5mdW5jdGlvbiB1cGRhdGVJbnB1dEdyYXBoKGlucHV0R3JhcGgsIGxheW91dEdyYXBoKSB7XG4gIF8uZm9yRWFjaChpbnB1dEdyYXBoLm5vZGVzKCksIGZ1bmN0aW9uKHYpIHtcbiAgICB2YXIgaW5wdXRMYWJlbCA9IGlucHV0R3JhcGgubm9kZSh2KTtcbiAgICB2YXIgbGF5b3V0TGFiZWwgPSBsYXlvdXRHcmFwaC5ub2RlKHYpO1xuXG4gICAgaWYgKGlucHV0TGFiZWwpIHtcbiAgICAgIGlucHV0TGFiZWwueCA9IGxheW91dExhYmVsLng7XG4gICAgICBpbnB1dExhYmVsLnkgPSBsYXlvdXRMYWJlbC55O1xuXG4gICAgICBpZiAobGF5b3V0R3JhcGguY2hpbGRyZW4odikubGVuZ3RoKSB7XG4gICAgICAgIGlucHV0TGFiZWwud2lkdGggPSBsYXlvdXRMYWJlbC53aWR0aDtcbiAgICAgICAgaW5wdXRMYWJlbC5oZWlnaHQgPSBsYXlvdXRMYWJlbC5oZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBfLmZvckVhY2goaW5wdXRHcmFwaC5lZGdlcygpLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGlucHV0TGFiZWwgPSBpbnB1dEdyYXBoLmVkZ2UoZSk7XG4gICAgdmFyIGxheW91dExhYmVsID0gbGF5b3V0R3JhcGguZWRnZShlKTtcblxuICAgIGlucHV0TGFiZWwucG9pbnRzID0gbGF5b3V0TGFiZWwucG9pbnRzO1xuICAgIGlmIChfLmhhcyhsYXlvdXRMYWJlbCwgXCJ4XCIpKSB7XG4gICAgICBpbnB1dExhYmVsLnggPSBsYXlvdXRMYWJlbC54O1xuICAgICAgaW5wdXRMYWJlbC55ID0gbGF5b3V0TGFiZWwueTtcbiAgICB9XG4gIH0pO1xuXG4gIGlucHV0R3JhcGguZ3JhcGgoKS53aWR0aCA9IGxheW91dEdyYXBoLmdyYXBoKCkud2lkdGg7XG4gIGlucHV0R3JhcGguZ3JhcGgoKS5oZWlnaHQgPSBsYXlvdXRHcmFwaC5ncmFwaCgpLmhlaWdodDtcbn1cblxudmFyIGdyYXBoTnVtQXR0cnMgPSBbXCJub2Rlc2VwXCIsIFwiZWRnZXNlcFwiLCBcInJhbmtzZXBcIiwgXCJtYXJnaW54XCIsIFwibWFyZ2lueVwiXTtcbnZhciBncmFwaERlZmF1bHRzID0geyByYW5rc2VwOiA1MCwgZWRnZXNlcDogMjAsIG5vZGVzZXA6IDUwLCByYW5rZGlyOiBcInRiXCIgfTtcbnZhciBncmFwaEF0dHJzID0gW1wiYWN5Y2xpY2VyXCIsIFwicmFua2VyXCIsIFwicmFua2RpclwiLCBcImFsaWduXCJdO1xudmFyIG5vZGVOdW1BdHRycyA9IFtcIndpZHRoXCIsIFwiaGVpZ2h0XCJdO1xudmFyIG5vZGVEZWZhdWx0cyA9IHsgd2lkdGg6IDAsIGhlaWdodDogMCB9O1xudmFyIGVkZ2VOdW1BdHRycyA9IFtcIm1pbmxlblwiLCBcIndlaWdodFwiLCBcIndpZHRoXCIsIFwiaGVpZ2h0XCIsIFwibGFiZWxvZmZzZXRcIl07XG52YXIgZWRnZURlZmF1bHRzID0ge1xuICBtaW5sZW46IDEsIHdlaWdodDogMSwgd2lkdGg6IDAsIGhlaWdodDogMCxcbiAgbGFiZWxvZmZzZXQ6IDEwLCBsYWJlbHBvczogXCJyXCJcbn07XG52YXIgZWRnZUF0dHJzID0gW1wibGFiZWxwb3NcIl07XG5cbi8qXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGdyYXBoIGZyb20gdGhlIGlucHV0IGdyYXBoLCB3aGljaCBjYW4gYmUgdXNlZCBmb3IgbGF5b3V0LlxuICogVGhpcyBwcm9jZXNzIGNvcGllcyBvbmx5IHdoaXRlbGlzdGVkIGF0dHJpYnV0ZXMgZnJvbSB0aGUgaW5wdXQgZ3JhcGggdG8gdGhlXG4gKiBsYXlvdXQgZ3JhcGguIFRodXMgdGhpcyBmdW5jdGlvbiBzZXJ2ZXMgYXMgYSBnb29kIHBsYWNlIHRvIGRldGVybWluZSB3aGF0XG4gKiBhdHRyaWJ1dGVzIGNhbiBpbmZsdWVuY2UgbGF5b3V0LlxuICovXG5mdW5jdGlvbiBidWlsZExheW91dEdyYXBoKGlucHV0R3JhcGgpIHtcbiAgdmFyIGcgPSBuZXcgR3JhcGgoeyBtdWx0aWdyYXBoOiB0cnVlLCBjb21wb3VuZDogdHJ1ZSB9KTtcbiAgdmFyIGdyYXBoID0gY2Fub25pY2FsaXplKGlucHV0R3JhcGguZ3JhcGgoKSk7XG5cbiAgZy5zZXRHcmFwaChfLm1lcmdlKHt9LFxuICAgIGdyYXBoRGVmYXVsdHMsXG4gICAgc2VsZWN0TnVtYmVyQXR0cnMoZ3JhcGgsIGdyYXBoTnVtQXR0cnMpLFxuICAgIF8ucGljayhncmFwaCwgZ3JhcGhBdHRycykpKTtcblxuICBfLmZvckVhY2goaW5wdXRHcmFwaC5ub2RlcygpLCBmdW5jdGlvbih2KSB7XG4gICAgdmFyIG5vZGUgPSBjYW5vbmljYWxpemUoaW5wdXRHcmFwaC5ub2RlKHYpKTtcbiAgICBnLnNldE5vZGUodiwgXy5kZWZhdWx0cyhzZWxlY3ROdW1iZXJBdHRycyhub2RlLCBub2RlTnVtQXR0cnMpLCBub2RlRGVmYXVsdHMpKTtcbiAgICBnLnNldFBhcmVudCh2LCBpbnB1dEdyYXBoLnBhcmVudCh2KSk7XG4gIH0pO1xuXG4gIF8uZm9yRWFjaChpbnB1dEdyYXBoLmVkZ2VzKCksIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgZWRnZSA9IGNhbm9uaWNhbGl6ZShpbnB1dEdyYXBoLmVkZ2UoZSkpO1xuICAgIGcuc2V0RWRnZShlLCBfLm1lcmdlKHt9LFxuICAgICAgZWRnZURlZmF1bHRzLFxuICAgICAgc2VsZWN0TnVtYmVyQXR0cnMoZWRnZSwgZWRnZU51bUF0dHJzKSxcbiAgICAgIF8ucGljayhlZGdlLCBlZGdlQXR0cnMpKSk7XG4gIH0pO1xuXG4gIHJldHVybiBnO1xufVxuXG4vKlxuICogVGhpcyBpZGVhIGNvbWVzIGZyb20gdGhlIEdhbnNuZXIgcGFwZXI6IHRvIGFjY291bnQgZm9yIGVkZ2UgbGFiZWxzIGluIG91clxuICogbGF5b3V0IHdlIHNwbGl0IGVhY2ggcmFuayBpbiBoYWxmIGJ5IGRvdWJsaW5nIG1pbmxlbiBhbmQgaGFsdmluZyByYW5rc2VwLlxuICogVGhlbiB3ZSBjYW4gcGxhY2UgbGFiZWxzIGF0IHRoZXNlIG1pZC1wb2ludHMgYmV0d2VlbiBub2Rlcy5cbiAqXG4gKiBXZSBhbHNvIGFkZCBzb21lIG1pbmltYWwgcGFkZGluZyB0byB0aGUgd2lkdGggdG8gcHVzaCB0aGUgbGFiZWwgZm9yIHRoZSBlZGdlXG4gKiBhd2F5IGZyb20gdGhlIGVkZ2UgaXRzZWxmIGEgYml0LlxuICovXG5mdW5jdGlvbiBtYWtlU3BhY2VGb3JFZGdlTGFiZWxzKGcpIHtcbiAgdmFyIGdyYXBoID0gZy5ncmFwaCgpO1xuICBncmFwaC5yYW5rc2VwIC89IDI7XG4gIF8uZm9yRWFjaChnLmVkZ2VzKCksIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgZWRnZSA9IGcuZWRnZShlKTtcbiAgICBlZGdlLm1pbmxlbiAqPSAyO1xuICAgIGlmIChlZGdlLmxhYmVscG9zLnRvTG93ZXJDYXNlKCkgIT09IFwiY1wiKSB7XG4gICAgICBpZiAoZ3JhcGgucmFua2RpciA9PT0gXCJUQlwiIHx8IGdyYXBoLnJhbmtkaXIgPT09IFwiQlRcIikge1xuICAgICAgICBlZGdlLndpZHRoICs9IGVkZ2UubGFiZWxvZmZzZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlZGdlLmhlaWdodCArPSBlZGdlLmxhYmVsb2Zmc2V0O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbi8qXG4gKiBDcmVhdGVzIHRlbXBvcmFyeSBkdW1teSBub2RlcyB0aGF0IGNhcHR1cmUgdGhlIHJhbmsgaW4gd2hpY2ggZWFjaCBlZGdlJ3NcbiAqIGxhYmVsIGlzIGdvaW5nIHRvLCBpZiBpdCBoYXMgb25lIG9mIG5vbi16ZXJvIHdpZHRoIGFuZCBoZWlnaHQuIFdlIGRvIHRoaXNcbiAqIHNvIHRoYXQgd2UgY2FuIHNhZmVseSByZW1vdmUgZW1wdHkgcmFua3Mgd2hpbGUgcHJlc2VydmluZyBiYWxhbmNlIGZvciB0aGVcbiAqIGxhYmVsJ3MgcG9zaXRpb24uXG4gKi9cbmZ1bmN0aW9uIGluamVjdEVkZ2VMYWJlbFByb3hpZXMoZykge1xuICBfLmZvckVhY2goZy5lZGdlcygpLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGVkZ2UgPSBnLmVkZ2UoZSk7XG4gICAgaWYgKGVkZ2Uud2lkdGggJiYgZWRnZS5oZWlnaHQpIHtcbiAgICAgIHZhciB2ID0gZy5ub2RlKGUudik7XG4gICAgICB2YXIgdyA9IGcubm9kZShlLncpO1xuICAgICAgdmFyIGxhYmVsID0geyByYW5rOiAody5yYW5rIC0gdi5yYW5rKSAvIDIgKyB2LnJhbmssIGU6IGUgfTtcbiAgICAgIHV0aWwuYWRkRHVtbXlOb2RlKGcsIFwiZWRnZS1wcm94eVwiLCBsYWJlbCwgXCJfZXBcIik7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gYXNzaWduUmFua01pbk1heChnKSB7XG4gIHZhciBtYXhSYW5rID0gMDtcbiAgXy5mb3JFYWNoKGcubm9kZXMoKSwgZnVuY3Rpb24odikge1xuICAgIHZhciBub2RlID0gZy5ub2RlKHYpO1xuICAgIGlmIChub2RlLmJvcmRlclRvcCkge1xuICAgICAgbm9kZS5taW5SYW5rID0gZy5ub2RlKG5vZGUuYm9yZGVyVG9wKS5yYW5rO1xuICAgICAgbm9kZS5tYXhSYW5rID0gZy5ub2RlKG5vZGUuYm9yZGVyQm90dG9tKS5yYW5rO1xuICAgICAgbWF4UmFuayA9IF8ubWF4KG1heFJhbmssIG5vZGUubWF4UmFuayk7XG4gICAgfVxuICB9KTtcbiAgZy5ncmFwaCgpLm1heFJhbmsgPSBtYXhSYW5rO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFZGdlTGFiZWxQcm94aWVzKGcpIHtcbiAgXy5mb3JFYWNoKGcubm9kZXMoKSwgZnVuY3Rpb24odikge1xuICAgIHZhciBub2RlID0gZy5ub2RlKHYpO1xuICAgIGlmIChub2RlLmR1bW15ID09PSBcImVkZ2UtcHJveHlcIikge1xuICAgICAgZy5lZGdlKG5vZGUuZSkubGFiZWxSYW5rID0gbm9kZS5yYW5rO1xuICAgICAgZy5yZW1vdmVOb2RlKHYpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZUdyYXBoKGcpIHtcbiAgdmFyIG1pblggPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gIHZhciBtYXhYID0gMDtcbiAgdmFyIG1pblkgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gIHZhciBtYXhZID0gMDtcbiAgdmFyIGdyYXBoTGFiZWwgPSBnLmdyYXBoKCk7XG4gIHZhciBtYXJnaW5YID0gZ3JhcGhMYWJlbC5tYXJnaW54IHx8IDA7XG4gIHZhciBtYXJnaW5ZID0gZ3JhcGhMYWJlbC5tYXJnaW55IHx8IDA7XG5cbiAgZnVuY3Rpb24gZ2V0RXh0cmVtZXMoYXR0cnMpIHtcbiAgICB2YXIgeCA9IGF0dHJzLng7XG4gICAgdmFyIHkgPSBhdHRycy55O1xuICAgIHZhciB3ID0gYXR0cnMud2lkdGg7XG4gICAgdmFyIGggPSBhdHRycy5oZWlnaHQ7XG4gICAgbWluWCA9IE1hdGgubWluKG1pblgsIHggLSB3IC8gMik7XG4gICAgbWF4WCA9IE1hdGgubWF4KG1heFgsIHggKyB3IC8gMik7XG4gICAgbWluWSA9IE1hdGgubWluKG1pblksIHkgLSBoIC8gMik7XG4gICAgbWF4WSA9IE1hdGgubWF4KG1heFksIHkgKyBoIC8gMik7XG4gIH1cblxuICBfLmZvckVhY2goZy5ub2RlcygpLCBmdW5jdGlvbih2KSB7IGdldEV4dHJlbWVzKGcubm9kZSh2KSk7IH0pO1xuICBfLmZvckVhY2goZy5lZGdlcygpLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGVkZ2UgPSBnLmVkZ2UoZSk7XG4gICAgaWYgKF8uaGFzKGVkZ2UsIFwieFwiKSkge1xuICAgICAgZ2V0RXh0cmVtZXMoZWRnZSk7XG4gICAgfVxuICB9KTtcblxuICBtaW5YIC09IG1hcmdpblg7XG4gIG1pblkgLT0gbWFyZ2luWTtcblxuICBfLmZvckVhY2goZy5ub2RlcygpLCBmdW5jdGlvbih2KSB7XG4gICAgdmFyIG5vZGUgPSBnLm5vZGUodik7XG4gICAgbm9kZS54IC09IG1pblg7XG4gICAgbm9kZS55IC09IG1pblk7XG4gIH0pO1xuXG4gIF8uZm9yRWFjaChnLmVkZ2VzKCksIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgZWRnZSA9IGcuZWRnZShlKTtcbiAgICBfLmZvckVhY2goZWRnZS5wb2ludHMsIGZ1bmN0aW9uKHApIHtcbiAgICAgIHAueCAtPSBtaW5YO1xuICAgICAgcC55IC09IG1pblk7XG4gICAgfSk7XG4gICAgaWYgKF8uaGFzKGVkZ2UsIFwieFwiKSkgeyBlZGdlLnggLT0gbWluWDsgfVxuICAgIGlmIChfLmhhcyhlZGdlLCBcInlcIikpIHsgZWRnZS55IC09IG1pblk7IH1cbiAgfSk7XG5cbiAgZ3JhcGhMYWJlbC53aWR0aCA9IG1heFggLSBtaW5YICsgbWFyZ2luWDtcbiAgZ3JhcGhMYWJlbC5oZWlnaHQgPSBtYXhZIC0gbWluWSArIG1hcmdpblk7XG59XG5cbmZ1bmN0aW9uIGFzc2lnbk5vZGVJbnRlcnNlY3RzKGcpIHtcbiAgXy5mb3JFYWNoKGcuZWRnZXMoKSwgZnVuY3Rpb24oZSkge1xuICAgIHZhciBlZGdlID0gZy5lZGdlKGUpO1xuICAgIHZhciBub2RlViA9IGcubm9kZShlLnYpO1xuICAgIHZhciBub2RlVyA9IGcubm9kZShlLncpO1xuICAgIHZhciBwMSwgcDI7XG4gICAgaWYgKCFlZGdlLnBvaW50cykge1xuICAgICAgZWRnZS5wb2ludHMgPSBbXTtcbiAgICAgIHAxID0gbm9kZVc7XG4gICAgICBwMiA9IG5vZGVWO1xuICAgIH0gZWxzZSB7XG4gICAgICBwMSA9IGVkZ2UucG9pbnRzWzBdO1xuICAgICAgcDIgPSBlZGdlLnBvaW50c1tlZGdlLnBvaW50cy5sZW5ndGggLSAxXTtcbiAgICB9XG4gICAgZWRnZS5wb2ludHMudW5zaGlmdCh1dGlsLmludGVyc2VjdFJlY3Qobm9kZVYsIHAxKSk7XG4gICAgZWRnZS5wb2ludHMucHVzaCh1dGlsLmludGVyc2VjdFJlY3Qobm9kZVcsIHAyKSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBmaXh1cEVkZ2VMYWJlbENvb3JkcyhnKSB7XG4gIF8uZm9yRWFjaChnLmVkZ2VzKCksIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgZWRnZSA9IGcuZWRnZShlKTtcbiAgICBpZiAoXy5oYXMoZWRnZSwgXCJ4XCIpKSB7XG4gICAgICBpZiAoZWRnZS5sYWJlbHBvcyA9PT0gXCJsXCIgfHwgZWRnZS5sYWJlbHBvcyA9PT0gXCJyXCIpIHtcbiAgICAgICAgZWRnZS53aWR0aCAtPSBlZGdlLmxhYmVsb2Zmc2V0O1xuICAgICAgfVxuICAgICAgc3dpdGNoIChlZGdlLmxhYmVscG9zKSB7XG4gICAgICBjYXNlIFwibFwiOiBlZGdlLnggLT0gZWRnZS53aWR0aCAvIDIgKyBlZGdlLmxhYmVsb2Zmc2V0OyBicmVhaztcbiAgICAgIGNhc2UgXCJyXCI6IGVkZ2UueCArPSBlZGdlLndpZHRoIC8gMiArIGVkZ2UubGFiZWxvZmZzZXQ7IGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJldmVyc2VQb2ludHNGb3JSZXZlcnNlZEVkZ2VzKGcpIHtcbiAgXy5mb3JFYWNoKGcuZWRnZXMoKSwgZnVuY3Rpb24oZSkge1xuICAgIHZhciBlZGdlID0gZy5lZGdlKGUpO1xuICAgIGlmIChlZGdlLnJldmVyc2VkKSB7XG4gICAgICBlZGdlLnBvaW50cy5yZXZlcnNlKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQm9yZGVyTm9kZXMoZykge1xuICBfLmZvckVhY2goZy5ub2RlcygpLCBmdW5jdGlvbih2KSB7XG4gICAgaWYgKGcuY2hpbGRyZW4odikubGVuZ3RoKSB7XG4gICAgICB2YXIgbm9kZSA9IGcubm9kZSh2KTtcbiAgICAgIHZhciB0ID0gZy5ub2RlKG5vZGUuYm9yZGVyVG9wKTtcbiAgICAgIHZhciBiID0gZy5ub2RlKG5vZGUuYm9yZGVyQm90dG9tKTtcbiAgICAgIHZhciBsID0gZy5ub2RlKF8ubGFzdChub2RlLmJvcmRlckxlZnQpKTtcbiAgICAgIHZhciByID0gZy5ub2RlKF8ubGFzdChub2RlLmJvcmRlclJpZ2h0KSk7XG5cbiAgICAgIG5vZGUud2lkdGggPSBNYXRoLmFicyhyLnggLSBsLngpO1xuICAgICAgbm9kZS5oZWlnaHQgPSBNYXRoLmFicyhiLnkgLSB0LnkpO1xuICAgICAgbm9kZS54ID0gbC54ICsgbm9kZS53aWR0aCAvIDI7XG4gICAgICBub2RlLnkgPSB0LnkgKyBub2RlLmhlaWdodCAvIDI7XG4gICAgfVxuICB9KTtcblxuICBfLmZvckVhY2goZy5ub2RlcygpLCBmdW5jdGlvbih2KSB7XG4gICAgaWYgKGcubm9kZSh2KS5kdW1teSA9PT0gXCJib3JkZXJcIikge1xuICAgICAgZy5yZW1vdmVOb2RlKHYpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVNlbGZFZGdlcyhnKSB7XG4gIF8uZm9yRWFjaChnLmVkZ2VzKCksIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoZS52ID09PSBlLncpIHtcbiAgICAgIHZhciBub2RlID0gZy5ub2RlKGUudik7XG4gICAgICBpZiAoIW5vZGUuc2VsZkVkZ2VzKSB7XG4gICAgICAgIG5vZGUuc2VsZkVkZ2VzID0gW107XG4gICAgICB9XG4gICAgICBub2RlLnNlbGZFZGdlcy5wdXNoKHsgZTogZSwgbGFiZWw6IGcuZWRnZShlKSB9KTtcbiAgICAgIGcucmVtb3ZlRWRnZShlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTZWxmRWRnZXMoZykge1xuICB2YXIgbGF5ZXJzID0gdXRpbC5idWlsZExheWVyTWF0cml4KGcpO1xuICBfLmZvckVhY2gobGF5ZXJzLCBmdW5jdGlvbihsYXllcikge1xuICAgIHZhciBvcmRlclNoaWZ0ID0gMDtcbiAgICBfLmZvckVhY2gobGF5ZXIsIGZ1bmN0aW9uKHYsIGkpIHtcbiAgICAgIHZhciBub2RlID0gZy5ub2RlKHYpO1xuICAgICAgbm9kZS5vcmRlciA9IGkgKyBvcmRlclNoaWZ0O1xuICAgICAgXy5mb3JFYWNoKG5vZGUuc2VsZkVkZ2VzLCBmdW5jdGlvbihzZWxmRWRnZSkge1xuICAgICAgICB1dGlsLmFkZER1bW15Tm9kZShnLCBcInNlbGZlZGdlXCIsIHtcbiAgICAgICAgICB3aWR0aDogc2VsZkVkZ2UubGFiZWwud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBzZWxmRWRnZS5sYWJlbC5oZWlnaHQsXG4gICAgICAgICAgcmFuazogbm9kZS5yYW5rLFxuICAgICAgICAgIG9yZGVyOiBpICsgKCsrb3JkZXJTaGlmdCksXG4gICAgICAgICAgZTogc2VsZkVkZ2UuZSxcbiAgICAgICAgICBsYWJlbDogc2VsZkVkZ2UubGFiZWxcbiAgICAgICAgfSwgXCJfc2VcIik7XG4gICAgICB9KTtcbiAgICAgIGRlbGV0ZSBub2RlLnNlbGZFZGdlcztcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBvc2l0aW9uU2VsZkVkZ2VzKGcpIHtcbiAgXy5mb3JFYWNoKGcubm9kZXMoKSwgZnVuY3Rpb24odikge1xuICAgIHZhciBub2RlID0gZy5ub2RlKHYpO1xuICAgIGlmIChub2RlLmR1bW15ID09PSBcInNlbGZlZGdlXCIpIHtcbiAgICAgIHZhciBzZWxmTm9kZSA9IGcubm9kZShub2RlLmUudik7XG4gICAgICB2YXIgeCA9IHNlbGZOb2RlLnggKyBzZWxmTm9kZS53aWR0aCAvIDI7XG4gICAgICB2YXIgeSA9IHNlbGZOb2RlLnk7XG4gICAgICB2YXIgZHggPSBub2RlLnggLSB4O1xuICAgICAgdmFyIGR5ID0gc2VsZk5vZGUuaGVpZ2h0IC8gMjtcbiAgICAgIGcuc2V0RWRnZShub2RlLmUsIG5vZGUubGFiZWwpO1xuICAgICAgZy5yZW1vdmVOb2RlKHYpO1xuICAgICAgbm9kZS5sYWJlbC5wb2ludHMgPSBbXG4gICAgICAgIHsgeDogeCArIDIgKiBkeCAvIDMsIHk6IHkgLSBkeSB9LFxuICAgICAgICB7IHg6IHggKyA1ICogZHggLyA2LCB5OiB5IC0gZHkgfSxcbiAgICAgICAgeyB4OiB4ICsgICAgIGR4ICAgICwgeTogeSB9LFxuICAgICAgICB7IHg6IHggKyA1ICogZHggLyA2LCB5OiB5ICsgZHkgfSxcbiAgICAgICAgeyB4OiB4ICsgMiAqIGR4IC8gMywgeTogeSArIGR5IH1cbiAgICAgIF07XG4gICAgICBub2RlLmxhYmVsLnggPSBub2RlLng7XG4gICAgICBub2RlLmxhYmVsLnkgPSBub2RlLnk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0TnVtYmVyQXR0cnMob2JqLCBhdHRycykge1xuICByZXR1cm4gXy5tYXBWYWx1ZXMoXy5waWNrKG9iaiwgYXR0cnMpLCBOdW1iZXIpO1xufVxuXG5mdW5jdGlvbiBjYW5vbmljYWxpemUoYXR0cnMpIHtcbiAgdmFyIG5ld0F0dHJzID0ge307XG4gIF8uZm9yRWFjaChhdHRycywgZnVuY3Rpb24odiwgaykge1xuICAgIG5ld0F0dHJzW2sudG9Mb3dlckNhc2UoKV0gPSB2O1xuICB9KTtcbiAgcmV0dXJuIG5ld0F0dHJzO1xufVxuIiwiLyogZ2xvYmFsIHdpbmRvdyAqL1xuXG52YXIgbG9kYXNoO1xuXG5pZiAodHlwZW9mIHJlcXVpcmUgPT09IFwiZnVuY3Rpb25cIikge1xuICB0cnkge1xuICAgIGxvZGFzaCA9IHtcbiAgICAgIGNsb25lRGVlcDogcmVxdWlyZShcImxvZGFzaC9jbG9uZURlZXBcIiksXG4gICAgICBjb25zdGFudDogcmVxdWlyZShcImxvZGFzaC9jb25zdGFudFwiKSxcbiAgICAgIGRlZmF1bHRzOiByZXF1aXJlKFwibG9kYXNoL2RlZmF1bHRzXCIpLFxuICAgICAgZWFjaDogcmVxdWlyZShcImxvZGFzaC9lYWNoXCIpLFxuICAgICAgZmlsdGVyOiByZXF1aXJlKFwibG9kYXNoL2ZpbHRlclwiKSxcbiAgICAgIGZpbmQ6IHJlcXVpcmUoXCJsb2Rhc2gvZmluZFwiKSxcbiAgICAgIGZsYXR0ZW46IHJlcXVpcmUoXCJsb2Rhc2gvZmxhdHRlblwiKSxcbiAgICAgIGZvckVhY2g6IHJlcXVpcmUoXCJsb2Rhc2gvZm9yRWFjaFwiKSxcbiAgICAgIGZvckluOiByZXF1aXJlKFwibG9kYXNoL2ZvckluXCIpLFxuICAgICAgaGFzOiAgcmVxdWlyZShcImxvZGFzaC9oYXNcIiksXG4gICAgICBpc1VuZGVmaW5lZDogcmVxdWlyZShcImxvZGFzaC9pc1VuZGVmaW5lZFwiKSxcbiAgICAgIGxhc3Q6IHJlcXVpcmUoXCJsb2Rhc2gvbGFzdFwiKSxcbiAgICAgIG1hcDogcmVxdWlyZShcImxvZGFzaC9tYXBcIiksXG4gICAgICBtYXBWYWx1ZXM6IHJlcXVpcmUoXCJsb2Rhc2gvbWFwVmFsdWVzXCIpLFxuICAgICAgbWF4OiByZXF1aXJlKFwibG9kYXNoL21heFwiKSxcbiAgICAgIG1lcmdlOiByZXF1aXJlKFwibG9kYXNoL21lcmdlXCIpLFxuICAgICAgbWluOiByZXF1aXJlKFwibG9kYXNoL21pblwiKSxcbiAgICAgIG1pbkJ5OiByZXF1aXJlKFwibG9kYXNoL21pbkJ5XCIpLFxuICAgICAgbm93OiByZXF1aXJlKFwibG9kYXNoL25vd1wiKSxcbiAgICAgIHBpY2s6IHJlcXVpcmUoXCJsb2Rhc2gvcGlja1wiKSxcbiAgICAgIHJhbmdlOiByZXF1aXJlKFwibG9kYXNoL3JhbmdlXCIpLFxuICAgICAgcmVkdWNlOiByZXF1aXJlKFwibG9kYXNoL3JlZHVjZVwiKSxcbiAgICAgIHNvcnRCeTogcmVxdWlyZShcImxvZGFzaC9zb3J0QnlcIiksXG4gICAgICB1bmlxdWVJZDogcmVxdWlyZShcImxvZGFzaC91bmlxdWVJZFwiKSxcbiAgICAgIHZhbHVlczogcmVxdWlyZShcImxvZGFzaC92YWx1ZXNcIiksXG4gICAgICB6aXBPYmplY3Q6IHJlcXVpcmUoXCJsb2Rhc2gvemlwT2JqZWN0XCIpLFxuICAgIH07XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBjb250aW51ZSByZWdhcmRsZXNzIG9mIGVycm9yXG4gIH1cbn1cblxuaWYgKCFsb2Rhc2gpIHtcbiAgbG9kYXNoID0gd2luZG93Ll87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbG9kYXNoO1xuIiwidmFyIF8gPSByZXF1aXJlKFwiLi9sb2Rhc2hcIik7XG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBydW46IHJ1bixcbiAgY2xlYW51cDogY2xlYW51cFxufTtcblxuLypcbiAqIEEgbmVzdGluZyBncmFwaCBjcmVhdGVzIGR1bW15IG5vZGVzIGZvciB0aGUgdG9wcyBhbmQgYm90dG9tcyBvZiBzdWJncmFwaHMsXG4gKiBhZGRzIGFwcHJvcHJpYXRlIGVkZ2VzIHRvIGVuc3VyZSB0aGF0IGFsbCBjbHVzdGVyIG5vZGVzIGFyZSBwbGFjZWQgYmV0d2VlblxuICogdGhlc2UgYm91bmRyaWVzLCBhbmQgZW5zdXJlcyB0aGF0IHRoZSBncmFwaCBpcyBjb25uZWN0ZWQuXG4gKlxuICogSW4gYWRkaXRpb24gd2UgZW5zdXJlLCB0aHJvdWdoIHRoZSB1c2Ugb2YgdGhlIG1pbmxlbiBwcm9wZXJ0eSwgdGhhdCBub2Rlc1xuICogYW5kIHN1YmdyYXBoIGJvcmRlciBub2RlcyB0byBub3QgZW5kIHVwIG9uIHRoZSBzYW1lIHJhbmsuXG4gKlxuICogUHJlY29uZGl0aW9uczpcbiAqXG4gKiAgICAxLiBJbnB1dCBncmFwaCBpcyBhIERBR1xuICogICAgMi4gTm9kZXMgaW4gdGhlIGlucHV0IGdyYXBoIGhhcyBhIG1pbmxlbiBhdHRyaWJ1dGVcbiAqXG4gKiBQb3N0Y29uZGl0aW9uczpcbiAqXG4gKiAgICAxLiBJbnB1dCBncmFwaCBpcyBjb25uZWN0ZWQuXG4gKiAgICAyLiBEdW1teSBub2RlcyBhcmUgYWRkZWQgZm9yIHRoZSB0b3BzIGFuZCBib3R0b21zIG9mIHN1YmdyYXBocy5cbiAqICAgIDMuIFRoZSBtaW5sZW4gYXR0cmlidXRlIGZvciBub2RlcyBpcyBhZGp1c3RlZCB0byBlbnN1cmUgbm9kZXMgZG8gbm90XG4gKiAgICAgICBnZXQgcGxhY2VkIG9uIHRoZSBzYW1lIHJhbmsgYXMgc3ViZ3JhcGggYm9yZGVyIG5vZGVzLlxuICpcbiAqIFRoZSBuZXN0aW5nIGdyYXBoIGlkZWEgY29tZXMgZnJvbSBTYW5kZXIsIFwiTGF5b3V0IG9mIENvbXBvdW5kIERpcmVjdGVkXG4gKiBHcmFwaHMuXCJcbiAqL1xuZnVuY3Rpb24gcnVuKGcpIHtcbiAgdmFyIHJvb3QgPSB1dGlsLmFkZER1bW15Tm9kZShnLCBcInJvb3RcIiwge30sIFwiX3Jvb3RcIik7XG4gIHZhciBkZXB0aHMgPSB0cmVlRGVwdGhzKGcpO1xuICB2YXIgaGVpZ2h0ID0gXy5tYXgoXy52YWx1ZXMoZGVwdGhzKSkgLSAxOyAvLyBOb3RlOiBkZXB0aHMgaXMgYW4gT2JqZWN0IG5vdCBhbiBhcnJheVxuICB2YXIgbm9kZVNlcCA9IDIgKiBoZWlnaHQgKyAxO1xuXG4gIGcuZ3JhcGgoKS5uZXN0aW5nUm9vdCA9IHJvb3Q7XG5cbiAgLy8gTXVsdGlwbHkgbWlubGVuIGJ5IG5vZGVTZXAgdG8gYWxpZ24gbm9kZXMgb24gbm9uLWJvcmRlciByYW5rcy5cbiAgXy5mb3JFYWNoKGcuZWRnZXMoKSwgZnVuY3Rpb24oZSkgeyBnLmVkZ2UoZSkubWlubGVuICo9IG5vZGVTZXA7IH0pO1xuXG4gIC8vIENhbGN1bGF0ZSBhIHdlaWdodCB0aGF0IGlzIHN1ZmZpY2llbnQgdG8ga2VlcCBzdWJncmFwaHMgdmVydGljYWxseSBjb21wYWN0XG4gIHZhciB3ZWlnaHQgPSBzdW1XZWlnaHRzKGcpICsgMTtcblxuICAvLyBDcmVhdGUgYm9yZGVyIG5vZGVzIGFuZCBsaW5rIHRoZW0gdXBcbiAgXy5mb3JFYWNoKGcuY2hpbGRyZW4oKSwgZnVuY3Rpb24oY2hpbGQpIHtcbiAgICBkZnMoZywgcm9vdCwgbm9kZVNlcCwgd2VpZ2h0LCBoZWlnaHQsIGRlcHRocywgY2hpbGQpO1xuICB9KTtcblxuICAvLyBTYXZlIHRoZSBtdWx0aXBsaWVyIGZvciBub2RlIGxheWVycyBmb3IgbGF0ZXIgcmVtb3ZhbCBvZiBlbXB0eSBib3JkZXJcbiAgLy8gbGF5ZXJzLlxuICBnLmdyYXBoKCkubm9kZVJhbmtGYWN0b3IgPSBub2RlU2VwO1xufVxuXG5mdW5jdGlvbiBkZnMoZywgcm9vdCwgbm9kZVNlcCwgd2VpZ2h0LCBoZWlnaHQsIGRlcHRocywgdikge1xuICB2YXIgY2hpbGRyZW4gPSBnLmNoaWxkcmVuKHYpO1xuICBpZiAoIWNoaWxkcmVuLmxlbmd0aCkge1xuICAgIGlmICh2ICE9PSByb290KSB7XG4gICAgICBnLnNldEVkZ2Uocm9vdCwgdiwgeyB3ZWlnaHQ6IDAsIG1pbmxlbjogbm9kZVNlcCB9KTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHRvcCA9IHV0aWwuYWRkQm9yZGVyTm9kZShnLCBcIl9idFwiKTtcbiAgdmFyIGJvdHRvbSA9IHV0aWwuYWRkQm9yZGVyTm9kZShnLCBcIl9iYlwiKTtcbiAgdmFyIGxhYmVsID0gZy5ub2RlKHYpO1xuXG4gIGcuc2V0UGFyZW50KHRvcCwgdik7XG4gIGxhYmVsLmJvcmRlclRvcCA9IHRvcDtcbiAgZy5zZXRQYXJlbnQoYm90dG9tLCB2KTtcbiAgbGFiZWwuYm9yZGVyQm90dG9tID0gYm90dG9tO1xuXG4gIF8uZm9yRWFjaChjaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpIHtcbiAgICBkZnMoZywgcm9vdCwgbm9kZVNlcCwgd2VpZ2h0LCBoZWlnaHQsIGRlcHRocywgY2hpbGQpO1xuXG4gICAgdmFyIGNoaWxkTm9kZSA9IGcubm9kZShjaGlsZCk7XG4gICAgdmFyIGNoaWxkVG9wID0gY2hpbGROb2RlLmJvcmRlclRvcCA/IGNoaWxkTm9kZS5ib3JkZXJUb3AgOiBjaGlsZDtcbiAgICB2YXIgY2hpbGRCb3R0b20gPSBjaGlsZE5vZGUuYm9yZGVyQm90dG9tID8gY2hpbGROb2RlLmJvcmRlckJvdHRvbSA6IGNoaWxkO1xuICAgIHZhciB0aGlzV2VpZ2h0ID0gY2hpbGROb2RlLmJvcmRlclRvcCA/IHdlaWdodCA6IDIgKiB3ZWlnaHQ7XG4gICAgdmFyIG1pbmxlbiA9IGNoaWxkVG9wICE9PSBjaGlsZEJvdHRvbSA/IDEgOiBoZWlnaHQgLSBkZXB0aHNbdl0gKyAxO1xuXG4gICAgZy5zZXRFZGdlKHRvcCwgY2hpbGRUb3AsIHtcbiAgICAgIHdlaWdodDogdGhpc1dlaWdodCxcbiAgICAgIG1pbmxlbjogbWlubGVuLFxuICAgICAgbmVzdGluZ0VkZ2U6IHRydWVcbiAgICB9KTtcblxuICAgIGcuc2V0RWRnZShjaGlsZEJvdHRvbSwgYm90dG9tLCB7XG4gICAgICB3ZWlnaHQ6IHRoaXNXZWlnaHQsXG4gICAgICBtaW5sZW46IG1pbmxlbixcbiAgICAgIG5lc3RpbmdFZGdlOiB0cnVlXG4gICAgfSk7XG4gIH0pO1xuXG4gIGlmICghZy5wYXJlbnQodikpIHtcbiAgICBnLnNldEVkZ2Uocm9vdCwgdG9wLCB7IHdlaWdodDogMCwgbWlubGVuOiBoZWlnaHQgKyBkZXB0aHNbdl0gfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJlZURlcHRocyhnKSB7XG4gIHZhciBkZXB0aHMgPSB7fTtcbiAgZnVuY3Rpb24gZGZzKHYsIGRlcHRoKSB7XG4gICAgdmFyIGNoaWxkcmVuID0gZy5jaGlsZHJlbih2KTtcbiAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBfLmZvckVhY2goY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIGRmcyhjaGlsZCwgZGVwdGggKyAxKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBkZXB0aHNbdl0gPSBkZXB0aDtcbiAgfVxuICBfLmZvckVhY2goZy5jaGlsZHJlbigpLCBmdW5jdGlvbih2KSB7IGRmcyh2LCAxKTsgfSk7XG4gIHJldHVybiBkZXB0aHM7XG59XG5cbmZ1bmN0aW9uIHN1bVdlaWdodHMoZykge1xuICByZXR1cm4gXy5yZWR1Y2UoZy5lZGdlcygpLCBmdW5jdGlvbihhY2MsIGUpIHtcbiAgICByZXR1cm4gYWNjICsgZy5lZGdlKGUpLndlaWdodDtcbiAgfSwgMCk7XG59XG5cbmZ1bmN0aW9uIGNsZWFudXAoZykge1xuICB2YXIgZ3JhcGhMYWJlbCA9IGcuZ3JhcGgoKTtcbiAgZy5yZW1vdmVOb2RlKGdyYXBoTGFiZWwubmVzdGluZ1Jvb3QpO1xuICBkZWxldGUgZ3JhcGhMYWJlbC5uZXN0aW5nUm9vdDtcbiAgXy5mb3JFYWNoKGcuZWRnZXMoKSwgZnVuY3Rpb24oZSkge1xuICAgIHZhciBlZGdlID0gZy5lZGdlKGUpO1xuICAgIGlmIChlZGdlLm5lc3RpbmdFZGdlKSB7XG4gICAgICBnLnJlbW92ZUVkZ2UoZSk7XG4gICAgfVxuICB9KTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgXyA9IHJlcXVpcmUoXCIuL2xvZGFzaFwiKTtcbnZhciB1dGlsID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJ1bjogcnVuLFxuICB1bmRvOiB1bmRvXG59O1xuXG4vKlxuICogQnJlYWtzIGFueSBsb25nIGVkZ2VzIGluIHRoZSBncmFwaCBpbnRvIHNob3J0IHNlZ21lbnRzIHRoYXQgc3BhbiAxIGxheWVyXG4gKiBlYWNoLiBUaGlzIG9wZXJhdGlvbiBpcyB1bmRvYWJsZSB3aXRoIHRoZSBkZW5vcm1hbGl6ZSBmdW5jdGlvbi5cbiAqXG4gKiBQcmUtY29uZGl0aW9uczpcbiAqXG4gKiAgICAxLiBUaGUgaW5wdXQgZ3JhcGggaXMgYSBEQUcuXG4gKiAgICAyLiBFYWNoIG5vZGUgaW4gdGhlIGdyYXBoIGhhcyBhIFwicmFua1wiIHByb3BlcnR5LlxuICpcbiAqIFBvc3QtY29uZGl0aW9uOlxuICpcbiAqICAgIDEuIEFsbCBlZGdlcyBpbiB0aGUgZ3JhcGggaGF2ZSBhIGxlbmd0aCBvZiAxLlxuICogICAgMi4gRHVtbXkgbm9kZXMgYXJlIGFkZGVkIHdoZXJlIGVkZ2VzIGhhdmUgYmVlbiBzcGxpdCBpbnRvIHNlZ21lbnRzLlxuICogICAgMy4gVGhlIGdyYXBoIGlzIGF1Z21lbnRlZCB3aXRoIGEgXCJkdW1teUNoYWluc1wiIGF0dHJpYnV0ZSB3aGljaCBjb250YWluc1xuICogICAgICAgdGhlIGZpcnN0IGR1bW15IGluIGVhY2ggY2hhaW4gb2YgZHVtbXkgbm9kZXMgcHJvZHVjZWQuXG4gKi9cbmZ1bmN0aW9uIHJ1bihnKSB7XG4gIGcuZ3JhcGgoKS5kdW1teUNoYWlucyA9IFtdO1xuICBfLmZvckVhY2goZy5lZGdlcygpLCBmdW5jdGlvbihlZGdlKSB7IG5vcm1hbGl6ZUVkZ2UoZywgZWRnZSk7IH0pO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVFZGdlKGcsIGUpIHtcbiAgdmFyIHYgPSBlLnY7XG4gIHZhciB2UmFuayA9IGcubm9kZSh2KS5yYW5rO1xuICB2YXIgdyA9IGUudztcbiAgdmFyIHdSYW5rID0gZy5ub2RlKHcpLnJhbms7XG4gIHZhciBuYW1lID0gZS5uYW1lO1xuICB2YXIgZWRnZUxhYmVsID0gZy5lZGdlKGUpO1xuICB2YXIgbGFiZWxSYW5rID0gZWRnZUxhYmVsLmxhYmVsUmFuaztcblxuICBpZiAod1JhbmsgPT09IHZSYW5rICsgMSkgcmV0dXJuO1xuXG4gIGcucmVtb3ZlRWRnZShlKTtcblxuICB2YXIgZHVtbXksIGF0dHJzLCBpO1xuICBmb3IgKGkgPSAwLCArK3ZSYW5rOyB2UmFuayA8IHdSYW5rOyArK2ksICsrdlJhbmspIHtcbiAgICBlZGdlTGFiZWwucG9pbnRzID0gW107XG4gICAgYXR0cnMgPSB7XG4gICAgICB3aWR0aDogMCwgaGVpZ2h0OiAwLFxuICAgICAgZWRnZUxhYmVsOiBlZGdlTGFiZWwsIGVkZ2VPYmo6IGUsXG4gICAgICByYW5rOiB2UmFua1xuICAgIH07XG4gICAgZHVtbXkgPSB1dGlsLmFkZER1bW15Tm9kZShnLCBcImVkZ2VcIiwgYXR0cnMsIFwiX2RcIik7XG4gICAgaWYgKHZSYW5rID09PSBsYWJlbFJhbmspIHtcbiAgICAgIGF0dHJzLndpZHRoID0gZWRnZUxhYmVsLndpZHRoO1xuICAgICAgYXR0cnMuaGVpZ2h0ID0gZWRnZUxhYmVsLmhlaWdodDtcbiAgICAgIGF0dHJzLmR1bW15ID0gXCJlZGdlLWxhYmVsXCI7XG4gICAgICBhdHRycy5sYWJlbHBvcyA9IGVkZ2VMYWJlbC5sYWJlbHBvcztcbiAgICB9XG4gICAgZy5zZXRFZGdlKHYsIGR1bW15LCB7IHdlaWdodDogZWRnZUxhYmVsLndlaWdodCB9LCBuYW1lKTtcbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgZy5ncmFwaCgpLmR1bW15Q2hhaW5zLnB1c2goZHVtbXkpO1xuICAgIH1cbiAgICB2ID0gZHVtbXk7XG4gIH1cblxuICBnLnNldEVkZ2UodiwgdywgeyB3ZWlnaHQ6IGVkZ2VMYWJlbC53ZWlnaHQgfSwgbmFtZSk7XG59XG5cbmZ1bmN0aW9uIHVuZG8oZykge1xuICBfLmZvckVhY2goZy5ncmFwaCgpLmR1bW15Q2hhaW5zLCBmdW5jdGlvbih2KSB7XG4gICAgdmFyIG5vZGUgPSBnLm5vZGUodik7XG4gICAgdmFyIG9yaWdMYWJlbCA9IG5vZGUuZWRnZUxhYmVsO1xuICAgIHZhciB3O1xuICAgIGcuc2V0RWRnZShub2RlLmVkZ2VPYmosIG9yaWdMYWJlbCk7XG4gICAgd2hpbGUgKG5vZGUuZHVtbXkpIHtcbiAgICAgIHcgPSBnLnN1Y2Nlc3NvcnModilbMF07XG4gICAgICBnLnJlbW92ZU5vZGUodik7XG4gICAgICBvcmlnTGFiZWwucG9pbnRzLnB1c2goeyB4OiBub2RlLngsIHk6IG5vZGUueSB9KTtcbiAgICAgIGlmIChub2RlLmR1bW15ID09PSBcImVkZ2UtbGFiZWxcIikge1xuICAgICAgICBvcmlnTGFiZWwueCA9IG5vZGUueDtcbiAgICAgICAgb3JpZ0xhYmVsLnkgPSBub2RlLnk7XG4gICAgICAgIG9yaWdMYWJlbC53aWR0aCA9IG5vZGUud2lkdGg7XG4gICAgICAgIG9yaWdMYWJlbC5oZWlnaHQgPSBub2RlLmhlaWdodDtcbiAgICAgIH1cbiAgICAgIHYgPSB3O1xuICAgICAgbm9kZSA9IGcubm9kZSh2KTtcbiAgICB9XG4gIH0pO1xufVxuIiwidmFyIF8gPSByZXF1aXJlKFwiLi4vbG9kYXNoXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZFN1YmdyYXBoQ29uc3RyYWludHM7XG5cbmZ1bmN0aW9uIGFkZFN1YmdyYXBoQ29uc3RyYWludHMoZywgY2csIHZzKSB7XG4gIHZhciBwcmV2ID0ge30sXG4gICAgcm9vdFByZXY7XG5cbiAgXy5mb3JFYWNoKHZzLCBmdW5jdGlvbih2KSB7XG4gICAgdmFyIGNoaWxkID0gZy5wYXJlbnQodiksXG4gICAgICBwYXJlbnQsXG4gICAgICBwcmV2Q2hpbGQ7XG4gICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICBwYXJlbnQgPSBnLnBhcmVudChjaGlsZCk7XG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIHByZXZDaGlsZCA9IHByZXZbcGFyZW50XTtcbiAgICAgICAgcHJldltwYXJlbnRdID0gY2hpbGQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmV2Q2hpbGQgPSByb290UHJldjtcbiAgICAgICAgcm9vdFByZXYgPSBjaGlsZDtcbiAgICAgIH1cbiAgICAgIGlmIChwcmV2Q2hpbGQgJiYgcHJldkNoaWxkICE9PSBjaGlsZCkge1xuICAgICAgICBjZy5zZXRFZGdlKHByZXZDaGlsZCwgY2hpbGQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjaGlsZCA9IHBhcmVudDtcbiAgICB9XG4gIH0pO1xuXG4gIC8qXG4gIGZ1bmN0aW9uIGRmcyh2KSB7XG4gICAgdmFyIGNoaWxkcmVuID0gdiA/IGcuY2hpbGRyZW4odikgOiBnLmNoaWxkcmVuKCk7XG4gICAgaWYgKGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgdmFyIG1pbiA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgICAgICAgICBzdWJncmFwaHMgPSBbXTtcbiAgICAgIF8uZWFjaChjaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgdmFyIGNoaWxkTWluID0gZGZzKGNoaWxkKTtcbiAgICAgICAgaWYgKGcuY2hpbGRyZW4oY2hpbGQpLmxlbmd0aCkge1xuICAgICAgICAgIHN1YmdyYXBocy5wdXNoKHsgdjogY2hpbGQsIG9yZGVyOiBjaGlsZE1pbiB9KTtcbiAgICAgICAgfVxuICAgICAgICBtaW4gPSBNYXRoLm1pbihtaW4sIGNoaWxkTWluKTtcbiAgICAgIH0pO1xuICAgICAgXy5yZWR1Y2UoXy5zb3J0Qnkoc3ViZ3JhcGhzLCBcIm9yZGVyXCIpLCBmdW5jdGlvbihwcmV2LCBjdXJyKSB7XG4gICAgICAgIGNnLnNldEVkZ2UocHJldi52LCBjdXJyLnYpO1xuICAgICAgICByZXR1cm4gY3VycjtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG1pbjtcbiAgICB9XG4gICAgcmV0dXJuIGcubm9kZSh2KS5vcmRlcjtcbiAgfVxuICBkZnModW5kZWZpbmVkKTtcbiAgKi9cbn1cbiIsInZhciBfID0gcmVxdWlyZShcIi4uL2xvZGFzaFwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXJ5Y2VudGVyO1xuXG5mdW5jdGlvbiBiYXJ5Y2VudGVyKGcsIG1vdmFibGUpIHtcbiAgcmV0dXJuIF8ubWFwKG1vdmFibGUsIGZ1bmN0aW9uKHYpIHtcbiAgICB2YXIgaW5WID0gZy5pbkVkZ2VzKHYpO1xuICAgIGlmICghaW5WLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHsgdjogdiB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzdWx0ID0gXy5yZWR1Y2UoaW5WLCBmdW5jdGlvbihhY2MsIGUpIHtcbiAgICAgICAgdmFyIGVkZ2UgPSBnLmVkZ2UoZSksXG4gICAgICAgICAgbm9kZVUgPSBnLm5vZGUoZS52KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdW06IGFjYy5zdW0gKyAoZWRnZS53ZWlnaHQgKiBub2RlVS5vcmRlciksXG4gICAgICAgICAgd2VpZ2h0OiBhY2Mud2VpZ2h0ICsgZWRnZS53ZWlnaHRcbiAgICAgICAgfTtcbiAgICAgIH0sIHsgc3VtOiAwLCB3ZWlnaHQ6IDAgfSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHY6IHYsXG4gICAgICAgIGJhcnljZW50ZXI6IHJlc3VsdC5zdW0gLyByZXN1bHQud2VpZ2h0LFxuICAgICAgICB3ZWlnaHQ6IHJlc3VsdC53ZWlnaHRcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn1cblxuIiwidmFyIF8gPSByZXF1aXJlKFwiLi4vbG9kYXNoXCIpO1xudmFyIEdyYXBoID0gcmVxdWlyZShcIi4uL2dyYXBobGliXCIpLkdyYXBoO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1aWxkTGF5ZXJHcmFwaDtcblxuLypcbiAqIENvbnN0cnVjdHMgYSBncmFwaCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNvcnQgYSBsYXllciBvZiBub2Rlcy4gVGhlIGdyYXBoIHdpbGxcbiAqIGNvbnRhaW4gYWxsIGJhc2UgYW5kIHN1YmdyYXBoIG5vZGVzIGZyb20gdGhlIHJlcXVlc3QgbGF5ZXIgaW4gdGhlaXIgb3JpZ2luYWxcbiAqIGhpZXJhcmNoeSBhbmQgYW55IGVkZ2VzIHRoYXQgYXJlIGluY2lkZW50IG9uIHRoZXNlIG5vZGVzIGFuZCBhcmUgb2YgdGhlIHR5cGVcbiAqIHJlcXVlc3RlZCBieSB0aGUgXCJyZWxhdGlvbnNoaXBcIiBwYXJhbWV0ZXIuXG4gKlxuICogTm9kZXMgZnJvbSB0aGUgcmVxdWVzdGVkIHJhbmsgdGhhdCBkbyBub3QgaGF2ZSBwYXJlbnRzIGFyZSBhc3NpZ25lZCBhIHJvb3RcbiAqIG5vZGUgaW4gdGhlIG91dHB1dCBncmFwaCwgd2hpY2ggaXMgc2V0IGluIHRoZSByb290IGdyYXBoIGF0dHJpYnV0ZS4gVGhpc1xuICogbWFrZXMgaXQgZWFzeSB0byB3YWxrIHRoZSBoaWVyYXJjaHkgb2YgbW92YWJsZSBub2RlcyBkdXJpbmcgb3JkZXJpbmcuXG4gKlxuICogUHJlLWNvbmRpdGlvbnM6XG4gKlxuICogICAgMS4gSW5wdXQgZ3JhcGggaXMgYSBEQUdcbiAqICAgIDIuIEJhc2Ugbm9kZXMgaW4gdGhlIGlucHV0IGdyYXBoIGhhdmUgYSByYW5rIGF0dHJpYnV0ZVxuICogICAgMy4gU3ViZ3JhcGggbm9kZXMgaW4gdGhlIGlucHV0IGdyYXBoIGhhcyBtaW5SYW5rIGFuZCBtYXhSYW5rIGF0dHJpYnV0ZXNcbiAqICAgIDQuIEVkZ2VzIGhhdmUgYW4gYXNzaWduZWQgd2VpZ2h0XG4gKlxuICogUG9zdC1jb25kaXRpb25zOlxuICpcbiAqICAgIDEuIE91dHB1dCBncmFwaCBoYXMgYWxsIG5vZGVzIGluIHRoZSBtb3ZhYmxlIHJhbmsgd2l0aCBwcmVzZXJ2ZWRcbiAqICAgICAgIGhpZXJhcmNoeS5cbiAqICAgIDIuIFJvb3Qgbm9kZXMgaW4gdGhlIG1vdmFibGUgbGF5ZXIgYXJlIG1hZGUgY2hpbGRyZW4gb2YgdGhlIG5vZGVcbiAqICAgICAgIGluZGljYXRlZCBieSB0aGUgcm9vdCBhdHRyaWJ1dGUgb2YgdGhlIGdyYXBoLlxuICogICAgMy4gTm9uLW1vdmFibGUgbm9kZXMgaW5jaWRlbnQgb24gbW92YWJsZSBub2Rlcywgc2VsZWN0ZWQgYnkgdGhlXG4gKiAgICAgICByZWxhdGlvbnNoaXAgcGFyYW1ldGVyLCBhcmUgaW5jbHVkZWQgaW4gdGhlIGdyYXBoICh3aXRob3V0IGhpZXJhcmNoeSkuXG4gKiAgICA0LiBFZGdlcyBpbmNpZGVudCBvbiBtb3ZhYmxlIG5vZGVzLCBzZWxlY3RlZCBieSB0aGUgcmVsYXRpb25zaGlwXG4gKiAgICAgICBwYXJhbWV0ZXIsIGFyZSBhZGRlZCB0byB0aGUgb3V0cHV0IGdyYXBoLlxuICogICAgNS4gVGhlIHdlaWdodHMgZm9yIGNvcGllZCBlZGdlcyBhcmUgYWdncmVnYXRlZCBhcyBuZWVkLCBzaW5jZSB0aGUgb3V0cHV0XG4gKiAgICAgICBncmFwaCBpcyBub3QgYSBtdWx0aS1ncmFwaC5cbiAqL1xuZnVuY3Rpb24gYnVpbGRMYXllckdyYXBoKGcsIHJhbmssIHJlbGF0aW9uc2hpcCkge1xuICB2YXIgcm9vdCA9IGNyZWF0ZVJvb3ROb2RlKGcpLFxuICAgIHJlc3VsdCA9IG5ldyBHcmFwaCh7IGNvbXBvdW5kOiB0cnVlIH0pLnNldEdyYXBoKHsgcm9vdDogcm9vdCB9KVxuICAgICAgLnNldERlZmF1bHROb2RlTGFiZWwoZnVuY3Rpb24odikgeyByZXR1cm4gZy5ub2RlKHYpOyB9KTtcblxuICBfLmZvckVhY2goZy5ub2RlcygpLCBmdW5jdGlvbih2KSB7XG4gICAgdmFyIG5vZGUgPSBnLm5vZGUodiksXG4gICAgICBwYXJlbnQgPSBnLnBhcmVudCh2KTtcblxuICAgIGlmIChub2RlLnJhbmsgPT09IHJhbmsgfHwgbm9kZS5taW5SYW5rIDw9IHJhbmsgJiYgcmFuayA8PSBub2RlLm1heFJhbmspIHtcbiAgICAgIHJlc3VsdC5zZXROb2RlKHYpO1xuICAgICAgcmVzdWx0LnNldFBhcmVudCh2LCBwYXJlbnQgfHwgcm9vdCk7XG5cbiAgICAgIC8vIFRoaXMgYXNzdW1lcyB3ZSBoYXZlIG9ubHkgc2hvcnQgZWRnZXMhXG4gICAgICBfLmZvckVhY2goZ1tyZWxhdGlvbnNoaXBdKHYpLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciB1ID0gZS52ID09PSB2ID8gZS53IDogZS52LFxuICAgICAgICAgIGVkZ2UgPSByZXN1bHQuZWRnZSh1LCB2KSxcbiAgICAgICAgICB3ZWlnaHQgPSAhXy5pc1VuZGVmaW5lZChlZGdlKSA/IGVkZ2Uud2VpZ2h0IDogMDtcbiAgICAgICAgcmVzdWx0LnNldEVkZ2UodSwgdiwgeyB3ZWlnaHQ6IGcuZWRnZShlKS53ZWlnaHQgKyB3ZWlnaHQgfSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKF8uaGFzKG5vZGUsIFwibWluUmFua1wiKSkge1xuICAgICAgICByZXN1bHQuc2V0Tm9kZSh2LCB7XG4gICAgICAgICAgYm9yZGVyTGVmdDogbm9kZS5ib3JkZXJMZWZ0W3JhbmtdLFxuICAgICAgICAgIGJvcmRlclJpZ2h0OiBub2RlLmJvcmRlclJpZ2h0W3JhbmtdXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUm9vdE5vZGUoZykge1xuICB2YXIgdjtcbiAgd2hpbGUgKGcuaGFzTm9kZSgodiA9IF8udW5pcXVlSWQoXCJfcm9vdFwiKSkpKTtcbiAgcmV0dXJuIHY7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF8gPSByZXF1aXJlKFwiLi4vbG9kYXNoXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNyb3NzQ291bnQ7XG5cbi8qXG4gKiBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBsYXllcmluZyAoYW4gYXJyYXkgb2YgbGF5ZXJzLCBlYWNoIHdpdGggYW4gYXJyYXkgb2ZcbiAqIG9yZGVyZXJkIG5vZGVzKSBhbmQgYSBncmFwaCBhbmQgcmV0dXJucyBhIHdlaWdodGVkIGNyb3NzaW5nIGNvdW50LlxuICpcbiAqIFByZS1jb25kaXRpb25zOlxuICpcbiAqICAgIDEuIElucHV0IGdyYXBoIG11c3QgYmUgc2ltcGxlIChub3QgYSBtdWx0aWdyYXBoKSwgZGlyZWN0ZWQsIGFuZCBpbmNsdWRlXG4gKiAgICAgICBvbmx5IHNpbXBsZSBlZGdlcy5cbiAqICAgIDIuIEVkZ2VzIGluIHRoZSBpbnB1dCBncmFwaCBtdXN0IGhhdmUgYXNzaWduZWQgd2VpZ2h0cy5cbiAqXG4gKiBQb3N0LWNvbmRpdGlvbnM6XG4gKlxuICogICAgMS4gVGhlIGdyYXBoIGFuZCBsYXllcmluZyBtYXRyaXggYXJlIGxlZnQgdW5jaGFuZ2VkLlxuICpcbiAqIFRoaXMgYWxnb3JpdGhtIGlzIGRlcml2ZWQgZnJvbSBCYXJ0aCwgZXQgYWwuLCBcIkJpbGF5ZXIgQ3Jvc3MgQ291bnRpbmcuXCJcbiAqL1xuZnVuY3Rpb24gY3Jvc3NDb3VudChnLCBsYXllcmluZykge1xuICB2YXIgY2MgPSAwO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGxheWVyaW5nLmxlbmd0aDsgKytpKSB7XG4gICAgY2MgKz0gdHdvTGF5ZXJDcm9zc0NvdW50KGcsIGxheWVyaW5nW2ktMV0sIGxheWVyaW5nW2ldKTtcbiAgfVxuICByZXR1cm4gY2M7XG59XG5cbmZ1bmN0aW9uIHR3b0xheWVyQ3Jvc3NDb3VudChnLCBub3J0aExheWVyLCBzb3V0aExheWVyKSB7XG4gIC8vIFNvcnQgYWxsIG9mIHRoZSBlZGdlcyBiZXR3ZWVuIHRoZSBub3J0aCBhbmQgc291dGggbGF5ZXJzIGJ5IHRoZWlyIHBvc2l0aW9uXG4gIC8vIGluIHRoZSBub3J0aCBsYXllciBhbmQgdGhlbiB0aGUgc291dGguIE1hcCB0aGVzZSBlZGdlcyB0byB0aGUgcG9zaXRpb24gb2ZcbiAgLy8gdGhlaXIgaGVhZCBpbiB0aGUgc291dGggbGF5ZXIuXG4gIHZhciBzb3V0aFBvcyA9IF8uemlwT2JqZWN0KHNvdXRoTGF5ZXIsXG4gICAgXy5tYXAoc291dGhMYXllciwgZnVuY3Rpb24gKHYsIGkpIHsgcmV0dXJuIGk7IH0pKTtcbiAgdmFyIHNvdXRoRW50cmllcyA9IF8uZmxhdHRlbihfLm1hcChub3J0aExheWVyLCBmdW5jdGlvbih2KSB7XG4gICAgcmV0dXJuIF8uc29ydEJ5KF8ubWFwKGcub3V0RWRnZXModiksIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiB7IHBvczogc291dGhQb3NbZS53XSwgd2VpZ2h0OiBnLmVkZ2UoZSkud2VpZ2h0IH07XG4gICAgfSksIFwicG9zXCIpO1xuICB9KSwgdHJ1ZSk7XG5cbiAgLy8gQnVpbGQgdGhlIGFjY3VtdWxhdG9yIHRyZWVcbiAgdmFyIGZpcnN0SW5kZXggPSAxO1xuICB3aGlsZSAoZmlyc3RJbmRleCA8IHNvdXRoTGF5ZXIubGVuZ3RoKSBmaXJzdEluZGV4IDw8PSAxO1xuICB2YXIgdHJlZVNpemUgPSAyICogZmlyc3RJbmRleCAtIDE7XG4gIGZpcnN0SW5kZXggLT0gMTtcbiAgdmFyIHRyZWUgPSBfLm1hcChuZXcgQXJyYXkodHJlZVNpemUpLCBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH0pO1xuXG4gIC8vIENhbGN1bGF0ZSB0aGUgd2VpZ2h0ZWQgY3Jvc3NpbmdzXG4gIHZhciBjYyA9IDA7XG4gIF8uZm9yRWFjaChzb3V0aEVudHJpZXMuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuICAgIHZhciBpbmRleCA9IGVudHJ5LnBvcyArIGZpcnN0SW5kZXg7XG4gICAgdHJlZVtpbmRleF0gKz0gZW50cnkud2VpZ2h0O1xuICAgIHZhciB3ZWlnaHRTdW0gPSAwO1xuICAgIHdoaWxlIChpbmRleCA+IDApIHtcbiAgICAgIGlmIChpbmRleCAlIDIpIHtcbiAgICAgICAgd2VpZ2h0U3VtICs9IHRyZWVbaW5kZXggKyAxXTtcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gKGluZGV4IC0gMSkgPj4gMTtcbiAgICAgIHRyZWVbaW5kZXhdICs9IGVudHJ5LndlaWdodDtcbiAgICB9XG4gICAgY2MgKz0gZW50cnkud2VpZ2h0ICogd2VpZ2h0U3VtO1xuICB9KSk7XG5cbiAgcmV0dXJuIGNjO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfID0gcmVxdWlyZShcIi4uL2xvZGFzaFwiKTtcbnZhciBpbml0T3JkZXIgPSByZXF1aXJlKFwiLi9pbml0LW9yZGVyXCIpO1xudmFyIGNyb3NzQ291bnQgPSByZXF1aXJlKFwiLi9jcm9zcy1jb3VudFwiKTtcbnZhciBzb3J0U3ViZ3JhcGggPSByZXF1aXJlKFwiLi9zb3J0LXN1YmdyYXBoXCIpO1xudmFyIGJ1aWxkTGF5ZXJHcmFwaCA9IHJlcXVpcmUoXCIuL2J1aWxkLWxheWVyLWdyYXBoXCIpO1xudmFyIGFkZFN1YmdyYXBoQ29uc3RyYWludHMgPSByZXF1aXJlKFwiLi9hZGQtc3ViZ3JhcGgtY29uc3RyYWludHNcIik7XG52YXIgR3JhcGggPSByZXF1aXJlKFwiLi4vZ3JhcGhsaWJcIikuR3JhcGg7XG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9yZGVyO1xuXG4vKlxuICogQXBwbGllcyBoZXVyaXN0aWNzIHRvIG1pbmltaXplIGVkZ2UgY3Jvc3NpbmdzIGluIHRoZSBncmFwaCBhbmQgc2V0cyB0aGUgYmVzdFxuICogb3JkZXIgc29sdXRpb24gYXMgYW4gb3JkZXIgYXR0cmlidXRlIG9uIGVhY2ggbm9kZS5cbiAqXG4gKiBQcmUtY29uZGl0aW9uczpcbiAqXG4gKiAgICAxLiBHcmFwaCBtdXN0IGJlIERBR1xuICogICAgMi4gR3JhcGggbm9kZXMgbXVzdCBiZSBvYmplY3RzIHdpdGggYSBcInJhbmtcIiBhdHRyaWJ1dGVcbiAqICAgIDMuIEdyYXBoIGVkZ2VzIG11c3QgaGF2ZSB0aGUgXCJ3ZWlnaHRcIiBhdHRyaWJ1dGVcbiAqXG4gKiBQb3N0LWNvbmRpdGlvbnM6XG4gKlxuICogICAgMS4gR3JhcGggbm9kZXMgd2lsbCBoYXZlIGFuIFwib3JkZXJcIiBhdHRyaWJ1dGUgYmFzZWQgb24gdGhlIHJlc3VsdHMgb2YgdGhlXG4gKiAgICAgICBhbGdvcml0aG0uXG4gKi9cbmZ1bmN0aW9uIG9yZGVyKGcpIHtcbiAgdmFyIG1heFJhbmsgPSB1dGlsLm1heFJhbmsoZyksXG4gICAgZG93bkxheWVyR3JhcGhzID0gYnVpbGRMYXllckdyYXBocyhnLCBfLnJhbmdlKDEsIG1heFJhbmsgKyAxKSwgXCJpbkVkZ2VzXCIpLFxuICAgIHVwTGF5ZXJHcmFwaHMgPSBidWlsZExheWVyR3JhcGhzKGcsIF8ucmFuZ2UobWF4UmFuayAtIDEsIC0xLCAtMSksIFwib3V0RWRnZXNcIik7XG5cbiAgdmFyIGxheWVyaW5nID0gaW5pdE9yZGVyKGcpO1xuICBhc3NpZ25PcmRlcihnLCBsYXllcmluZyk7XG5cbiAgdmFyIGJlc3RDQyA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgICBiZXN0O1xuXG4gIGZvciAodmFyIGkgPSAwLCBsYXN0QmVzdCA9IDA7IGxhc3RCZXN0IDwgNDsgKytpLCArK2xhc3RCZXN0KSB7XG4gICAgc3dlZXBMYXllckdyYXBocyhpICUgMiA/IGRvd25MYXllckdyYXBocyA6IHVwTGF5ZXJHcmFwaHMsIGkgJSA0ID49IDIpO1xuXG4gICAgbGF5ZXJpbmcgPSB1dGlsLmJ1aWxkTGF5ZXJNYXRyaXgoZyk7XG4gICAgdmFyIGNjID0gY3Jvc3NDb3VudChnLCBsYXllcmluZyk7XG4gICAgaWYgKGNjIDwgYmVzdENDKSB7XG4gICAgICBsYXN0QmVzdCA9IDA7XG4gICAgICBiZXN0ID0gXy5jbG9uZURlZXAobGF5ZXJpbmcpO1xuICAgICAgYmVzdENDID0gY2M7XG4gICAgfVxuICB9XG5cbiAgYXNzaWduT3JkZXIoZywgYmVzdCk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkTGF5ZXJHcmFwaHMoZywgcmFua3MsIHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gXy5tYXAocmFua3MsIGZ1bmN0aW9uKHJhbmspIHtcbiAgICByZXR1cm4gYnVpbGRMYXllckdyYXBoKGcsIHJhbmssIHJlbGF0aW9uc2hpcCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzd2VlcExheWVyR3JhcGhzKGxheWVyR3JhcGhzLCBiaWFzUmlnaHQpIHtcbiAgdmFyIGNnID0gbmV3IEdyYXBoKCk7XG4gIF8uZm9yRWFjaChsYXllckdyYXBocywgZnVuY3Rpb24obGcpIHtcbiAgICB2YXIgcm9vdCA9IGxnLmdyYXBoKCkucm9vdDtcbiAgICB2YXIgc29ydGVkID0gc29ydFN1YmdyYXBoKGxnLCByb290LCBjZywgYmlhc1JpZ2h0KTtcbiAgICBfLmZvckVhY2goc29ydGVkLnZzLCBmdW5jdGlvbih2LCBpKSB7XG4gICAgICBsZy5ub2RlKHYpLm9yZGVyID0gaTtcbiAgICB9KTtcbiAgICBhZGRTdWJncmFwaENvbnN0cmFpbnRzKGxnLCBjZywgc29ydGVkLnZzKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFzc2lnbk9yZGVyKGcsIGxheWVyaW5nKSB7XG4gIF8uZm9yRWFjaChsYXllcmluZywgZnVuY3Rpb24obGF5ZXIpIHtcbiAgICBfLmZvckVhY2gobGF5ZXIsIGZ1bmN0aW9uKHYsIGkpIHtcbiAgICAgIGcubm9kZSh2KS5vcmRlciA9IGk7XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfID0gcmVxdWlyZShcIi4uL2xvZGFzaFwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbml0T3JkZXI7XG5cbi8qXG4gKiBBc3NpZ25zIGFuIGluaXRpYWwgb3JkZXIgdmFsdWUgZm9yIGVhY2ggbm9kZSBieSBwZXJmb3JtaW5nIGEgREZTIHNlYXJjaFxuICogc3RhcnRpbmcgZnJvbSBub2RlcyBpbiB0aGUgZmlyc3QgcmFuay4gTm9kZXMgYXJlIGFzc2lnbmVkIGFuIG9yZGVyIGluIHRoZWlyXG4gKiByYW5rIGFzIHRoZXkgYXJlIGZpcnN0IHZpc2l0ZWQuXG4gKlxuICogVGhpcyBhcHByb2FjaCBjb21lcyBmcm9tIEdhbnNuZXIsIGV0IGFsLiwgXCJBIFRlY2huaXF1ZSBmb3IgRHJhd2luZyBEaXJlY3RlZFxuICogR3JhcGhzLlwiXG4gKlxuICogUmV0dXJucyBhIGxheWVyaW5nIG1hdHJpeCB3aXRoIGFuIGFycmF5IHBlciBsYXllciBhbmQgZWFjaCBsYXllciBzb3J0ZWQgYnlcbiAqIHRoZSBvcmRlciBvZiBpdHMgbm9kZXMuXG4gKi9cbmZ1bmN0aW9uIGluaXRPcmRlcihnKSB7XG4gIHZhciB2aXNpdGVkID0ge307XG4gIHZhciBzaW1wbGVOb2RlcyA9IF8uZmlsdGVyKGcubm9kZXMoKSwgZnVuY3Rpb24odikge1xuICAgIHJldHVybiAhZy5jaGlsZHJlbih2KS5sZW5ndGg7XG4gIH0pO1xuICB2YXIgbWF4UmFuayA9IF8ubWF4KF8ubWFwKHNpbXBsZU5vZGVzLCBmdW5jdGlvbih2KSB7IHJldHVybiBnLm5vZGUodikucmFuazsgfSkpO1xuICB2YXIgbGF5ZXJzID0gXy5tYXAoXy5yYW5nZShtYXhSYW5rICsgMSksIGZ1bmN0aW9uKCkgeyByZXR1cm4gW107IH0pO1xuXG4gIGZ1bmN0aW9uIGRmcyh2KSB7XG4gICAgaWYgKF8uaGFzKHZpc2l0ZWQsIHYpKSByZXR1cm47XG4gICAgdmlzaXRlZFt2XSA9IHRydWU7XG4gICAgdmFyIG5vZGUgPSBnLm5vZGUodik7XG4gICAgbGF5ZXJzW25vZGUucmFua10ucHVzaCh2KTtcbiAgICBfLmZvckVhY2goZy5zdWNjZXNzb3JzKHYpLCBkZnMpO1xuICB9XG5cbiAgdmFyIG9yZGVyZWRWcyA9IF8uc29ydEJ5KHNpbXBsZU5vZGVzLCBmdW5jdGlvbih2KSB7IHJldHVybiBnLm5vZGUodikucmFuazsgfSk7XG4gIF8uZm9yRWFjaChvcmRlcmVkVnMsIGRmcyk7XG5cbiAgcmV0dXJuIGxheWVycztcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgXyA9IHJlcXVpcmUoXCIuLi9sb2Rhc2hcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVzb2x2ZUNvbmZsaWN0cztcblxuLypcbiAqIEdpdmVuIGEgbGlzdCBvZiBlbnRyaWVzIG9mIHRoZSBmb3JtIHt2LCBiYXJ5Y2VudGVyLCB3ZWlnaHR9IGFuZCBhXG4gKiBjb25zdHJhaW50IGdyYXBoIHRoaXMgZnVuY3Rpb24gd2lsbCByZXNvbHZlIGFueSBjb25mbGljdHMgYmV0d2VlbiB0aGVcbiAqIGNvbnN0cmFpbnQgZ3JhcGggYW5kIHRoZSBiYXJ5Y2VudGVycyBmb3IgdGhlIGVudHJpZXMuIElmIHRoZSBiYXJ5Y2VudGVycyBmb3JcbiAqIGFuIGVudHJ5IHdvdWxkIHZpb2xhdGUgYSBjb25zdHJhaW50IGluIHRoZSBjb25zdHJhaW50IGdyYXBoIHRoZW4gd2UgY29hbGVzY2VcbiAqIHRoZSBub2RlcyBpbiB0aGUgY29uZmxpY3QgaW50byBhIG5ldyBub2RlIHRoYXQgcmVzcGVjdHMgdGhlIGNvbnRyYWludCBhbmRcbiAqIGFnZ3JlZ2F0ZXMgYmFyeWNlbnRlciBhbmQgd2VpZ2h0IGluZm9ybWF0aW9uLlxuICpcbiAqIFRoaXMgaW1wbGVtZW50YXRpb24gaXMgYmFzZWQgb24gdGhlIGRlc2NyaXB0aW9uIGluIEZvcnN0ZXIsIFwiQSBGYXN0IGFuZFxuICogU2ltcGxlIEh1ZXJpc3RpYyBmb3IgQ29uc3RyYWluZWQgVHdvLUxldmVsIENyb3NzaW5nIFJlZHVjdGlvbixcIiB0aG91Z2h0IGl0XG4gKiBkaWZmZXJzIGluIHNvbWUgc3BlY2lmaWMgZGV0YWlscy5cbiAqXG4gKiBQcmUtY29uZGl0aW9uczpcbiAqXG4gKiAgICAxLiBFYWNoIGVudHJ5IGhhcyB0aGUgZm9ybSB7diwgYmFyeWNlbnRlciwgd2VpZ2h0fSwgb3IgaWYgdGhlIG5vZGUgaGFzXG4gKiAgICAgICBubyBiYXJ5Y2VudGVyLCB0aGVuIHt2fS5cbiAqXG4gKiBSZXR1cm5zOlxuICpcbiAqICAgIEEgbmV3IGxpc3Qgb2YgZW50cmllcyBvZiB0aGUgZm9ybSB7dnMsIGksIGJhcnljZW50ZXIsIHdlaWdodH0uIFRoZSBsaXN0XG4gKiAgICBgdnNgIG1heSBlaXRoZXIgYmUgYSBzaW5nbGV0b24gb3IgaXQgbWF5IGJlIGFuIGFnZ3JlZ2F0aW9uIG9mIG5vZGVzXG4gKiAgICBvcmRlcmVkIHN1Y2ggdGhhdCB0aGV5IGRvIG5vdCB2aW9sYXRlIGNvbnN0cmFpbnRzIGZyb20gdGhlIGNvbnN0cmFpbnRcbiAqICAgIGdyYXBoLiBUaGUgcHJvcGVydHkgYGlgIGlzIHRoZSBsb3dlc3Qgb3JpZ2luYWwgaW5kZXggb2YgYW55IG9mIHRoZVxuICogICAgZWxlbWVudHMgaW4gYHZzYC5cbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZUNvbmZsaWN0cyhlbnRyaWVzLCBjZykge1xuICB2YXIgbWFwcGVkRW50cmllcyA9IHt9O1xuICBfLmZvckVhY2goZW50cmllcywgZnVuY3Rpb24oZW50cnksIGkpIHtcbiAgICB2YXIgdG1wID0gbWFwcGVkRW50cmllc1tlbnRyeS52XSA9IHtcbiAgICAgIGluZGVncmVlOiAwLFxuICAgICAgXCJpblwiOiBbXSxcbiAgICAgIG91dDogW10sXG4gICAgICB2czogW2VudHJ5LnZdLFxuICAgICAgaTogaVxuICAgIH07XG4gICAgaWYgKCFfLmlzVW5kZWZpbmVkKGVudHJ5LmJhcnljZW50ZXIpKSB7XG4gICAgICB0bXAuYmFyeWNlbnRlciA9IGVudHJ5LmJhcnljZW50ZXI7XG4gICAgICB0bXAud2VpZ2h0ID0gZW50cnkud2VpZ2h0O1xuICAgIH1cbiAgfSk7XG5cbiAgXy5mb3JFYWNoKGNnLmVkZ2VzKCksIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgZW50cnlWID0gbWFwcGVkRW50cmllc1tlLnZdO1xuICAgIHZhciBlbnRyeVcgPSBtYXBwZWRFbnRyaWVzW2Uud107XG4gICAgaWYgKCFfLmlzVW5kZWZpbmVkKGVudHJ5VikgJiYgIV8uaXNVbmRlZmluZWQoZW50cnlXKSkge1xuICAgICAgZW50cnlXLmluZGVncmVlKys7XG4gICAgICBlbnRyeVYub3V0LnB1c2gobWFwcGVkRW50cmllc1tlLnddKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBzb3VyY2VTZXQgPSBfLmZpbHRlcihtYXBwZWRFbnRyaWVzLCBmdW5jdGlvbihlbnRyeSkge1xuICAgIHJldHVybiAhZW50cnkuaW5kZWdyZWU7XG4gIH0pO1xuXG4gIHJldHVybiBkb1Jlc29sdmVDb25mbGljdHMoc291cmNlU2V0KTtcbn1cblxuZnVuY3Rpb24gZG9SZXNvbHZlQ29uZmxpY3RzKHNvdXJjZVNldCkge1xuICB2YXIgZW50cmllcyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUluKHZFbnRyeSkge1xuICAgIHJldHVybiBmdW5jdGlvbih1RW50cnkpIHtcbiAgICAgIGlmICh1RW50cnkubWVyZ2VkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChfLmlzVW5kZWZpbmVkKHVFbnRyeS5iYXJ5Y2VudGVyKSB8fFxuICAgICAgICAgIF8uaXNVbmRlZmluZWQodkVudHJ5LmJhcnljZW50ZXIpIHx8XG4gICAgICAgICAgdUVudHJ5LmJhcnljZW50ZXIgPj0gdkVudHJ5LmJhcnljZW50ZXIpIHtcbiAgICAgICAgbWVyZ2VFbnRyaWVzKHZFbnRyeSwgdUVudHJ5KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlT3V0KHZFbnRyeSkge1xuICAgIHJldHVybiBmdW5jdGlvbih3RW50cnkpIHtcbiAgICAgIHdFbnRyeVtcImluXCJdLnB1c2godkVudHJ5KTtcbiAgICAgIGlmICgtLXdFbnRyeS5pbmRlZ3JlZSA9PT0gMCkge1xuICAgICAgICBzb3VyY2VTZXQucHVzaCh3RW50cnkpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICB3aGlsZSAoc291cmNlU2V0Lmxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IHNvdXJjZVNldC5wb3AoKTtcbiAgICBlbnRyaWVzLnB1c2goZW50cnkpO1xuICAgIF8uZm9yRWFjaChlbnRyeVtcImluXCJdLnJldmVyc2UoKSwgaGFuZGxlSW4oZW50cnkpKTtcbiAgICBfLmZvckVhY2goZW50cnkub3V0LCBoYW5kbGVPdXQoZW50cnkpKTtcbiAgfVxuXG4gIHJldHVybiBfLm1hcChfLmZpbHRlcihlbnRyaWVzLCBmdW5jdGlvbihlbnRyeSkgeyByZXR1cm4gIWVudHJ5Lm1lcmdlZDsgfSksXG4gICAgZnVuY3Rpb24oZW50cnkpIHtcbiAgICAgIHJldHVybiBfLnBpY2soZW50cnksIFtcInZzXCIsIFwiaVwiLCBcImJhcnljZW50ZXJcIiwgXCJ3ZWlnaHRcIl0pO1xuICAgIH0pO1xuXG59XG5cbmZ1bmN0aW9uIG1lcmdlRW50cmllcyh0YXJnZXQsIHNvdXJjZSkge1xuICB2YXIgc3VtID0gMDtcbiAgdmFyIHdlaWdodCA9IDA7XG5cbiAgaWYgKHRhcmdldC53ZWlnaHQpIHtcbiAgICBzdW0gKz0gdGFyZ2V0LmJhcnljZW50ZXIgKiB0YXJnZXQud2VpZ2h0O1xuICAgIHdlaWdodCArPSB0YXJnZXQud2VpZ2h0O1xuICB9XG5cbiAgaWYgKHNvdXJjZS53ZWlnaHQpIHtcbiAgICBzdW0gKz0gc291cmNlLmJhcnljZW50ZXIgKiBzb3VyY2Uud2VpZ2h0O1xuICAgIHdlaWdodCArPSBzb3VyY2Uud2VpZ2h0O1xuICB9XG5cbiAgdGFyZ2V0LnZzID0gc291cmNlLnZzLmNvbmNhdCh0YXJnZXQudnMpO1xuICB0YXJnZXQuYmFyeWNlbnRlciA9IHN1bSAvIHdlaWdodDtcbiAgdGFyZ2V0LndlaWdodCA9IHdlaWdodDtcbiAgdGFyZ2V0LmkgPSBNYXRoLm1pbihzb3VyY2UuaSwgdGFyZ2V0LmkpO1xuICBzb3VyY2UubWVyZ2VkID0gdHJ1ZTtcbn1cbiIsInZhciBfID0gcmVxdWlyZShcIi4uL2xvZGFzaFwiKTtcbnZhciBiYXJ5Y2VudGVyID0gcmVxdWlyZShcIi4vYmFyeWNlbnRlclwiKTtcbnZhciByZXNvbHZlQ29uZmxpY3RzID0gcmVxdWlyZShcIi4vcmVzb2x2ZS1jb25mbGljdHNcIik7XG52YXIgc29ydCA9IHJlcXVpcmUoXCIuL3NvcnRcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gc29ydFN1YmdyYXBoO1xuXG5mdW5jdGlvbiBzb3J0U3ViZ3JhcGgoZywgdiwgY2csIGJpYXNSaWdodCkge1xuICB2YXIgbW92YWJsZSA9IGcuY2hpbGRyZW4odik7XG4gIHZhciBub2RlID0gZy5ub2RlKHYpO1xuICB2YXIgYmwgPSBub2RlID8gbm9kZS5ib3JkZXJMZWZ0IDogdW5kZWZpbmVkO1xuICB2YXIgYnIgPSBub2RlID8gbm9kZS5ib3JkZXJSaWdodDogdW5kZWZpbmVkO1xuICB2YXIgc3ViZ3JhcGhzID0ge307XG5cbiAgaWYgKGJsKSB7XG4gICAgbW92YWJsZSA9IF8uZmlsdGVyKG1vdmFibGUsIGZ1bmN0aW9uKHcpIHtcbiAgICAgIHJldHVybiB3ICE9PSBibCAmJiB3ICE9PSBicjtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBiYXJ5Y2VudGVycyA9IGJhcnljZW50ZXIoZywgbW92YWJsZSk7XG4gIF8uZm9yRWFjaChiYXJ5Y2VudGVycywgZnVuY3Rpb24oZW50cnkpIHtcbiAgICBpZiAoZy5jaGlsZHJlbihlbnRyeS52KS5sZW5ndGgpIHtcbiAgICAgIHZhciBzdWJncmFwaFJlc3VsdCA9IHNvcnRTdWJncmFwaChnLCBlbnRyeS52LCBjZywgYmlhc1JpZ2h0KTtcbiAgICAgIHN1YmdyYXBoc1tlbnRyeS52XSA9IHN1YmdyYXBoUmVzdWx0O1xuICAgICAgaWYgKF8uaGFzKHN1YmdyYXBoUmVzdWx0LCBcImJhcnljZW50ZXJcIikpIHtcbiAgICAgICAgbWVyZ2VCYXJ5Y2VudGVycyhlbnRyeSwgc3ViZ3JhcGhSZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgdmFyIGVudHJpZXMgPSByZXNvbHZlQ29uZmxpY3RzKGJhcnljZW50ZXJzLCBjZyk7XG4gIGV4cGFuZFN1YmdyYXBocyhlbnRyaWVzLCBzdWJncmFwaHMpO1xuXG4gIHZhciByZXN1bHQgPSBzb3J0KGVudHJpZXMsIGJpYXNSaWdodCk7XG5cbiAgaWYgKGJsKSB7XG4gICAgcmVzdWx0LnZzID0gXy5mbGF0dGVuKFtibCwgcmVzdWx0LnZzLCBicl0sIHRydWUpO1xuICAgIGlmIChnLnByZWRlY2Vzc29ycyhibCkubGVuZ3RoKSB7XG4gICAgICB2YXIgYmxQcmVkID0gZy5ub2RlKGcucHJlZGVjZXNzb3JzKGJsKVswXSksXG4gICAgICAgIGJyUHJlZCA9IGcubm9kZShnLnByZWRlY2Vzc29ycyhicilbMF0pO1xuICAgICAgaWYgKCFfLmhhcyhyZXN1bHQsIFwiYmFyeWNlbnRlclwiKSkge1xuICAgICAgICByZXN1bHQuYmFyeWNlbnRlciA9IDA7XG4gICAgICAgIHJlc3VsdC53ZWlnaHQgPSAwO1xuICAgICAgfVxuICAgICAgcmVzdWx0LmJhcnljZW50ZXIgPSAocmVzdWx0LmJhcnljZW50ZXIgKiByZXN1bHQud2VpZ2h0ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsUHJlZC5vcmRlciArIGJyUHJlZC5vcmRlcikgLyAocmVzdWx0LndlaWdodCArIDIpO1xuICAgICAgcmVzdWx0LndlaWdodCArPSAyO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGV4cGFuZFN1YmdyYXBocyhlbnRyaWVzLCBzdWJncmFwaHMpIHtcbiAgXy5mb3JFYWNoKGVudHJpZXMsIGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgZW50cnkudnMgPSBfLmZsYXR0ZW4oZW50cnkudnMubWFwKGZ1bmN0aW9uKHYpIHtcbiAgICAgIGlmIChzdWJncmFwaHNbdl0pIHtcbiAgICAgICAgcmV0dXJuIHN1YmdyYXBoc1t2XS52cztcbiAgICAgIH1cbiAgICAgIHJldHVybiB2O1xuICAgIH0pLCB0cnVlKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlQmFyeWNlbnRlcnModGFyZ2V0LCBvdGhlcikge1xuICBpZiAoIV8uaXNVbmRlZmluZWQodGFyZ2V0LmJhcnljZW50ZXIpKSB7XG4gICAgdGFyZ2V0LmJhcnljZW50ZXIgPSAodGFyZ2V0LmJhcnljZW50ZXIgKiB0YXJnZXQud2VpZ2h0ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlci5iYXJ5Y2VudGVyICogb3RoZXIud2VpZ2h0KSAvXG4gICAgICAgICAgICAgICAgICAgICAgICAodGFyZ2V0LndlaWdodCArIG90aGVyLndlaWdodCk7XG4gICAgdGFyZ2V0LndlaWdodCArPSBvdGhlci53ZWlnaHQ7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0LmJhcnljZW50ZXIgPSBvdGhlci5iYXJ5Y2VudGVyO1xuICAgIHRhcmdldC53ZWlnaHQgPSBvdGhlci53ZWlnaHQ7XG4gIH1cbn1cbiIsInZhciBfID0gcmVxdWlyZShcIi4uL2xvZGFzaFwiKTtcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gc29ydDtcblxuZnVuY3Rpb24gc29ydChlbnRyaWVzLCBiaWFzUmlnaHQpIHtcbiAgdmFyIHBhcnRzID0gdXRpbC5wYXJ0aXRpb24oZW50cmllcywgZnVuY3Rpb24oZW50cnkpIHtcbiAgICByZXR1cm4gXy5oYXMoZW50cnksIFwiYmFyeWNlbnRlclwiKTtcbiAgfSk7XG4gIHZhciBzb3J0YWJsZSA9IHBhcnRzLmxocyxcbiAgICB1bnNvcnRhYmxlID0gXy5zb3J0QnkocGFydHMucmhzLCBmdW5jdGlvbihlbnRyeSkgeyByZXR1cm4gLWVudHJ5Lmk7IH0pLFxuICAgIHZzID0gW10sXG4gICAgc3VtID0gMCxcbiAgICB3ZWlnaHQgPSAwLFxuICAgIHZzSW5kZXggPSAwO1xuXG4gIHNvcnRhYmxlLnNvcnQoY29tcGFyZVdpdGhCaWFzKCEhYmlhc1JpZ2h0KSk7XG5cbiAgdnNJbmRleCA9IGNvbnN1bWVVbnNvcnRhYmxlKHZzLCB1bnNvcnRhYmxlLCB2c0luZGV4KTtcblxuICBfLmZvckVhY2goc29ydGFibGUsIGZ1bmN0aW9uIChlbnRyeSkge1xuICAgIHZzSW5kZXggKz0gZW50cnkudnMubGVuZ3RoO1xuICAgIHZzLnB1c2goZW50cnkudnMpO1xuICAgIHN1bSArPSBlbnRyeS5iYXJ5Y2VudGVyICogZW50cnkud2VpZ2h0O1xuICAgIHdlaWdodCArPSBlbnRyeS53ZWlnaHQ7XG4gICAgdnNJbmRleCA9IGNvbnN1bWVVbnNvcnRhYmxlKHZzLCB1bnNvcnRhYmxlLCB2c0luZGV4KTtcbiAgfSk7XG5cbiAgdmFyIHJlc3VsdCA9IHsgdnM6IF8uZmxhdHRlbih2cywgdHJ1ZSkgfTtcbiAgaWYgKHdlaWdodCkge1xuICAgIHJlc3VsdC5iYXJ5Y2VudGVyID0gc3VtIC8gd2VpZ2h0O1xuICAgIHJlc3VsdC53ZWlnaHQgPSB3ZWlnaHQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gY29uc3VtZVVuc29ydGFibGUodnMsIHVuc29ydGFibGUsIGluZGV4KSB7XG4gIHZhciBsYXN0O1xuICB3aGlsZSAodW5zb3J0YWJsZS5sZW5ndGggJiYgKGxhc3QgPSBfLmxhc3QodW5zb3J0YWJsZSkpLmkgPD0gaW5kZXgpIHtcbiAgICB1bnNvcnRhYmxlLnBvcCgpO1xuICAgIHZzLnB1c2gobGFzdC52cyk7XG4gICAgaW5kZXgrKztcbiAgfVxuICByZXR1cm4gaW5kZXg7XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmVXaXRoQmlhcyhiaWFzKSB7XG4gIHJldHVybiBmdW5jdGlvbihlbnRyeVYsIGVudHJ5Vykge1xuICAgIGlmIChlbnRyeVYuYmFyeWNlbnRlciA8IGVudHJ5Vy5iYXJ5Y2VudGVyKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfSBlbHNlIGlmIChlbnRyeVYuYmFyeWNlbnRlciA+IGVudHJ5Vy5iYXJ5Y2VudGVyKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gIWJpYXMgPyBlbnRyeVYuaSAtIGVudHJ5Vy5pIDogZW50cnlXLmkgLSBlbnRyeVYuaTtcbiAgfTtcbn1cbiIsInZhciBfID0gcmVxdWlyZShcIi4vbG9kYXNoXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcmVudER1bW15Q2hhaW5zO1xuXG5mdW5jdGlvbiBwYXJlbnREdW1teUNoYWlucyhnKSB7XG4gIHZhciBwb3N0b3JkZXJOdW1zID0gcG9zdG9yZGVyKGcpO1xuXG4gIF8uZm9yRWFjaChnLmdyYXBoKCkuZHVtbXlDaGFpbnMsIGZ1bmN0aW9uKHYpIHtcbiAgICB2YXIgbm9kZSA9IGcubm9kZSh2KTtcbiAgICB2YXIgZWRnZU9iaiA9IG5vZGUuZWRnZU9iajtcbiAgICB2YXIgcGF0aERhdGEgPSBmaW5kUGF0aChnLCBwb3N0b3JkZXJOdW1zLCBlZGdlT2JqLnYsIGVkZ2VPYmoudyk7XG4gICAgdmFyIHBhdGggPSBwYXRoRGF0YS5wYXRoO1xuICAgIHZhciBsY2EgPSBwYXRoRGF0YS5sY2E7XG4gICAgdmFyIHBhdGhJZHggPSAwO1xuICAgIHZhciBwYXRoViA9IHBhdGhbcGF0aElkeF07XG4gICAgdmFyIGFzY2VuZGluZyA9IHRydWU7XG5cbiAgICB3aGlsZSAodiAhPT0gZWRnZU9iai53KSB7XG4gICAgICBub2RlID0gZy5ub2RlKHYpO1xuXG4gICAgICBpZiAoYXNjZW5kaW5nKSB7XG4gICAgICAgIHdoaWxlICgocGF0aFYgPSBwYXRoW3BhdGhJZHhdKSAhPT0gbGNhICYmXG4gICAgICAgICAgICAgICBnLm5vZGUocGF0aFYpLm1heFJhbmsgPCBub2RlLnJhbmspIHtcbiAgICAgICAgICBwYXRoSWR4Kys7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGF0aFYgPT09IGxjYSkge1xuICAgICAgICAgIGFzY2VuZGluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghYXNjZW5kaW5nKSB7XG4gICAgICAgIHdoaWxlIChwYXRoSWR4IDwgcGF0aC5sZW5ndGggLSAxICYmXG4gICAgICAgICAgICAgICBnLm5vZGUocGF0aFYgPSBwYXRoW3BhdGhJZHggKyAxXSkubWluUmFuayA8PSBub2RlLnJhbmspIHtcbiAgICAgICAgICBwYXRoSWR4Kys7XG4gICAgICAgIH1cbiAgICAgICAgcGF0aFYgPSBwYXRoW3BhdGhJZHhdO1xuICAgICAgfVxuXG4gICAgICBnLnNldFBhcmVudCh2LCBwYXRoVik7XG4gICAgICB2ID0gZy5zdWNjZXNzb3JzKHYpWzBdO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIEZpbmQgYSBwYXRoIGZyb20gdiB0byB3IHRocm91Z2ggdGhlIGxvd2VzdCBjb21tb24gYW5jZXN0b3IgKExDQSkuIFJldHVybiB0aGVcbi8vIGZ1bGwgcGF0aCBhbmQgdGhlIExDQS5cbmZ1bmN0aW9uIGZpbmRQYXRoKGcsIHBvc3RvcmRlck51bXMsIHYsIHcpIHtcbiAgdmFyIHZQYXRoID0gW107XG4gIHZhciB3UGF0aCA9IFtdO1xuICB2YXIgbG93ID0gTWF0aC5taW4ocG9zdG9yZGVyTnVtc1t2XS5sb3csIHBvc3RvcmRlck51bXNbd10ubG93KTtcbiAgdmFyIGxpbSA9IE1hdGgubWF4KHBvc3RvcmRlck51bXNbdl0ubGltLCBwb3N0b3JkZXJOdW1zW3ddLmxpbSk7XG4gIHZhciBwYXJlbnQ7XG4gIHZhciBsY2E7XG5cbiAgLy8gVHJhdmVyc2UgdXAgZnJvbSB2IHRvIGZpbmQgdGhlIExDQVxuICBwYXJlbnQgPSB2O1xuICBkbyB7XG4gICAgcGFyZW50ID0gZy5wYXJlbnQocGFyZW50KTtcbiAgICB2UGF0aC5wdXNoKHBhcmVudCk7XG4gIH0gd2hpbGUgKHBhcmVudCAmJlxuICAgICAgICAgICAocG9zdG9yZGVyTnVtc1twYXJlbnRdLmxvdyA+IGxvdyB8fCBsaW0gPiBwb3N0b3JkZXJOdW1zW3BhcmVudF0ubGltKSk7XG4gIGxjYSA9IHBhcmVudDtcblxuICAvLyBUcmF2ZXJzZSBmcm9tIHcgdG8gTENBXG4gIHBhcmVudCA9IHc7XG4gIHdoaWxlICgocGFyZW50ID0gZy5wYXJlbnQocGFyZW50KSkgIT09IGxjYSkge1xuICAgIHdQYXRoLnB1c2gocGFyZW50KTtcbiAgfVxuXG4gIHJldHVybiB7IHBhdGg6IHZQYXRoLmNvbmNhdCh3UGF0aC5yZXZlcnNlKCkpLCBsY2E6IGxjYSB9O1xufVxuXG5mdW5jdGlvbiBwb3N0b3JkZXIoZykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIHZhciBsaW0gPSAwO1xuXG4gIGZ1bmN0aW9uIGRmcyh2KSB7XG4gICAgdmFyIGxvdyA9IGxpbTtcbiAgICBfLmZvckVhY2goZy5jaGlsZHJlbih2KSwgZGZzKTtcbiAgICByZXN1bHRbdl0gPSB7IGxvdzogbG93LCBsaW06IGxpbSsrIH07XG4gIH1cbiAgXy5mb3JFYWNoKGcuY2hpbGRyZW4oKSwgZGZzKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfID0gcmVxdWlyZShcIi4uL2xvZGFzaFwiKTtcbnZhciBHcmFwaCA9IHJlcXVpcmUoXCIuLi9ncmFwaGxpYlwiKS5HcmFwaDtcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XG5cbi8qXG4gKiBUaGlzIG1vZHVsZSBwcm92aWRlcyBjb29yZGluYXRlIGFzc2lnbm1lbnQgYmFzZWQgb24gQnJhbmRlcyBhbmQgS8O2cGYsIFwiRmFzdFxuICogYW5kIFNpbXBsZSBIb3Jpem9udGFsIENvb3JkaW5hdGUgQXNzaWdubWVudC5cIlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwb3NpdGlvblg6IHBvc2l0aW9uWCxcbiAgZmluZFR5cGUxQ29uZmxpY3RzOiBmaW5kVHlwZTFDb25mbGljdHMsXG4gIGZpbmRUeXBlMkNvbmZsaWN0czogZmluZFR5cGUyQ29uZmxpY3RzLFxuICBhZGRDb25mbGljdDogYWRkQ29uZmxpY3QsXG4gIGhhc0NvbmZsaWN0OiBoYXNDb25mbGljdCxcbiAgdmVydGljYWxBbGlnbm1lbnQ6IHZlcnRpY2FsQWxpZ25tZW50LFxuICBob3Jpem9udGFsQ29tcGFjdGlvbjogaG9yaXpvbnRhbENvbXBhY3Rpb24sXG4gIGFsaWduQ29vcmRpbmF0ZXM6IGFsaWduQ29vcmRpbmF0ZXMsXG4gIGZpbmRTbWFsbGVzdFdpZHRoQWxpZ25tZW50OiBmaW5kU21hbGxlc3RXaWR0aEFsaWdubWVudCxcbiAgYmFsYW5jZTogYmFsYW5jZVxufTtcblxuLypcbiAqIE1hcmtzIGFsbCBlZGdlcyBpbiB0aGUgZ3JhcGggd2l0aCBhIHR5cGUtMSBjb25mbGljdCB3aXRoIHRoZSBcInR5cGUxQ29uZmxpY3RcIlxuICogcHJvcGVydHkuIEEgdHlwZS0xIGNvbmZsaWN0IGlzIG9uZSB3aGVyZSBhIG5vbi1pbm5lciBzZWdtZW50IGNyb3NzZXMgYW5cbiAqIGlubmVyIHNlZ21lbnQuIEFuIGlubmVyIHNlZ21lbnQgaXMgYW4gZWRnZSB3aXRoIGJvdGggaW5jaWRlbnQgbm9kZXMgbWFya2VkXG4gKiB3aXRoIHRoZSBcImR1bW15XCIgcHJvcGVydHkuXG4gKlxuICogVGhpcyBhbGdvcml0aG0gc2NhbnMgbGF5ZXIgYnkgbGF5ZXIsIHN0YXJ0aW5nIHdpdGggdGhlIHNlY29uZCwgZm9yIHR5cGUtMVxuICogY29uZmxpY3RzIGJldHdlZW4gdGhlIGN1cnJlbnQgbGF5ZXIgYW5kIHRoZSBwcmV2aW91cyBsYXllci4gRm9yIGVhY2ggbGF5ZXJcbiAqIGl0IHNjYW5zIHRoZSBub2RlcyBmcm9tIGxlZnQgdG8gcmlnaHQgdW50aWwgaXQgcmVhY2hlcyBvbmUgdGhhdCBpcyBpbmNpZGVudFxuICogb24gYW4gaW5uZXIgc2VnbWVudC4gSXQgdGhlbiBzY2FucyBwcmVkZWNlc3NvcnMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgaGF2ZVxuICogZWRnZXMgdGhhdCBjcm9zcyB0aGF0IGlubmVyIHNlZ21lbnQuIEF0IHRoZSBlbmQgYSBmaW5hbCBzY2FuIGlzIGRvbmUgZm9yIGFsbFxuICogbm9kZXMgb24gdGhlIGN1cnJlbnQgcmFuayB0byBzZWUgaWYgdGhleSBjcm9zcyB0aGUgbGFzdCB2aXNpdGVkIGlubmVyXG4gKiBzZWdtZW50LlxuICpcbiAqIFRoaXMgYWxnb3JpdGhtIChzYWZlbHkpIGFzc3VtZXMgdGhhdCBhIGR1bW15IG5vZGUgd2lsbCBvbmx5IGJlIGluY2lkZW50IG9uIGFcbiAqIHNpbmdsZSBub2RlIGluIHRoZSBsYXllcnMgYmVpbmcgc2Nhbm5lZC5cbiAqL1xuZnVuY3Rpb24gZmluZFR5cGUxQ29uZmxpY3RzKGcsIGxheWVyaW5nKSB7XG4gIHZhciBjb25mbGljdHMgPSB7fTtcblxuICBmdW5jdGlvbiB2aXNpdExheWVyKHByZXZMYXllciwgbGF5ZXIpIHtcbiAgICB2YXJcbiAgICAgIC8vIGxhc3QgdmlzaXRlZCBub2RlIGluIHRoZSBwcmV2aW91cyBsYXllciB0aGF0IGlzIGluY2lkZW50IG9uIGFuIGlubmVyXG4gICAgICAvLyBzZWdtZW50LlxuICAgICAgazAgPSAwLFxuICAgICAgLy8gVHJhY2tzIHRoZSBsYXN0IG5vZGUgaW4gdGhpcyBsYXllciBzY2FubmVkIGZvciBjcm9zc2luZ3Mgd2l0aCBhIHR5cGUtMVxuICAgICAgLy8gc2VnbWVudC5cbiAgICAgIHNjYW5Qb3MgPSAwLFxuICAgICAgcHJldkxheWVyTGVuZ3RoID0gcHJldkxheWVyLmxlbmd0aCxcbiAgICAgIGxhc3ROb2RlID0gXy5sYXN0KGxheWVyKTtcblxuICAgIF8uZm9yRWFjaChsYXllciwgZnVuY3Rpb24odiwgaSkge1xuICAgICAgdmFyIHcgPSBmaW5kT3RoZXJJbm5lclNlZ21lbnROb2RlKGcsIHYpLFxuICAgICAgICBrMSA9IHcgPyBnLm5vZGUodykub3JkZXIgOiBwcmV2TGF5ZXJMZW5ndGg7XG5cbiAgICAgIGlmICh3IHx8IHYgPT09IGxhc3ROb2RlKSB7XG4gICAgICAgIF8uZm9yRWFjaChsYXllci5zbGljZShzY2FuUG9zLCBpICsxKSwgZnVuY3Rpb24oc2Nhbk5vZGUpIHtcbiAgICAgICAgICBfLmZvckVhY2goZy5wcmVkZWNlc3NvcnMoc2Nhbk5vZGUpLCBmdW5jdGlvbih1KSB7XG4gICAgICAgICAgICB2YXIgdUxhYmVsID0gZy5ub2RlKHUpLFxuICAgICAgICAgICAgICB1UG9zID0gdUxhYmVsLm9yZGVyO1xuICAgICAgICAgICAgaWYgKCh1UG9zIDwgazAgfHwgazEgPCB1UG9zKSAmJlxuICAgICAgICAgICAgICAgICEodUxhYmVsLmR1bW15ICYmIGcubm9kZShzY2FuTm9kZSkuZHVtbXkpKSB7XG4gICAgICAgICAgICAgIGFkZENvbmZsaWN0KGNvbmZsaWN0cywgdSwgc2Nhbk5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgc2NhblBvcyA9IGkgKyAxO1xuICAgICAgICBrMCA9IGsxO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGxheWVyO1xuICB9XG5cbiAgXy5yZWR1Y2UobGF5ZXJpbmcsIHZpc2l0TGF5ZXIpO1xuICByZXR1cm4gY29uZmxpY3RzO1xufVxuXG5mdW5jdGlvbiBmaW5kVHlwZTJDb25mbGljdHMoZywgbGF5ZXJpbmcpIHtcbiAgdmFyIGNvbmZsaWN0cyA9IHt9O1xuXG4gIGZ1bmN0aW9uIHNjYW4oc291dGgsIHNvdXRoUG9zLCBzb3V0aEVuZCwgcHJldk5vcnRoQm9yZGVyLCBuZXh0Tm9ydGhCb3JkZXIpIHtcbiAgICB2YXIgdjtcbiAgICBfLmZvckVhY2goXy5yYW5nZShzb3V0aFBvcywgc291dGhFbmQpLCBmdW5jdGlvbihpKSB7XG4gICAgICB2ID0gc291dGhbaV07XG4gICAgICBpZiAoZy5ub2RlKHYpLmR1bW15KSB7XG4gICAgICAgIF8uZm9yRWFjaChnLnByZWRlY2Vzc29ycyh2KSwgZnVuY3Rpb24odSkge1xuICAgICAgICAgIHZhciB1Tm9kZSA9IGcubm9kZSh1KTtcbiAgICAgICAgICBpZiAodU5vZGUuZHVtbXkgJiZcbiAgICAgICAgICAgICAgKHVOb2RlLm9yZGVyIDwgcHJldk5vcnRoQm9yZGVyIHx8IHVOb2RlLm9yZGVyID4gbmV4dE5vcnRoQm9yZGVyKSkge1xuICAgICAgICAgICAgYWRkQ29uZmxpY3QoY29uZmxpY3RzLCB1LCB2KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cblxuICBmdW5jdGlvbiB2aXNpdExheWVyKG5vcnRoLCBzb3V0aCkge1xuICAgIHZhciBwcmV2Tm9ydGhQb3MgPSAtMSxcbiAgICAgIG5leHROb3J0aFBvcyxcbiAgICAgIHNvdXRoUG9zID0gMDtcblxuICAgIF8uZm9yRWFjaChzb3V0aCwgZnVuY3Rpb24odiwgc291dGhMb29rYWhlYWQpIHtcbiAgICAgIGlmIChnLm5vZGUodikuZHVtbXkgPT09IFwiYm9yZGVyXCIpIHtcbiAgICAgICAgdmFyIHByZWRlY2Vzc29ycyA9IGcucHJlZGVjZXNzb3JzKHYpO1xuICAgICAgICBpZiAocHJlZGVjZXNzb3JzLmxlbmd0aCkge1xuICAgICAgICAgIG5leHROb3J0aFBvcyA9IGcubm9kZShwcmVkZWNlc3NvcnNbMF0pLm9yZGVyO1xuICAgICAgICAgIHNjYW4oc291dGgsIHNvdXRoUG9zLCBzb3V0aExvb2thaGVhZCwgcHJldk5vcnRoUG9zLCBuZXh0Tm9ydGhQb3MpO1xuICAgICAgICAgIHNvdXRoUG9zID0gc291dGhMb29rYWhlYWQ7XG4gICAgICAgICAgcHJldk5vcnRoUG9zID0gbmV4dE5vcnRoUG9zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzY2FuKHNvdXRoLCBzb3V0aFBvcywgc291dGgubGVuZ3RoLCBuZXh0Tm9ydGhQb3MsIG5vcnRoLmxlbmd0aCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc291dGg7XG4gIH1cblxuICBfLnJlZHVjZShsYXllcmluZywgdmlzaXRMYXllcik7XG4gIHJldHVybiBjb25mbGljdHM7XG59XG5cbmZ1bmN0aW9uIGZpbmRPdGhlcklubmVyU2VnbWVudE5vZGUoZywgdikge1xuICBpZiAoZy5ub2RlKHYpLmR1bW15KSB7XG4gICAgcmV0dXJuIF8uZmluZChnLnByZWRlY2Vzc29ycyh2KSwgZnVuY3Rpb24odSkge1xuICAgICAgcmV0dXJuIGcubm9kZSh1KS5kdW1teTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRDb25mbGljdChjb25mbGljdHMsIHYsIHcpIHtcbiAgaWYgKHYgPiB3KSB7XG4gICAgdmFyIHRtcCA9IHY7XG4gICAgdiA9IHc7XG4gICAgdyA9IHRtcDtcbiAgfVxuXG4gIHZhciBjb25mbGljdHNWID0gY29uZmxpY3RzW3ZdO1xuICBpZiAoIWNvbmZsaWN0c1YpIHtcbiAgICBjb25mbGljdHNbdl0gPSBjb25mbGljdHNWID0ge307XG4gIH1cbiAgY29uZmxpY3RzVlt3XSA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIGhhc0NvbmZsaWN0KGNvbmZsaWN0cywgdiwgdykge1xuICBpZiAodiA+IHcpIHtcbiAgICB2YXIgdG1wID0gdjtcbiAgICB2ID0gdztcbiAgICB3ID0gdG1wO1xuICB9XG4gIHJldHVybiBfLmhhcyhjb25mbGljdHNbdl0sIHcpO1xufVxuXG4vKlxuICogVHJ5IHRvIGFsaWduIG5vZGVzIGludG8gdmVydGljYWwgXCJibG9ja3NcIiB3aGVyZSBwb3NzaWJsZS4gVGhpcyBhbGdvcml0aG1cbiAqIGF0dGVtcHRzIHRvIGFsaWduIGEgbm9kZSB3aXRoIG9uZSBvZiBpdHMgbWVkaWFuIG5laWdoYm9ycy4gSWYgdGhlIGVkZ2VcbiAqIGNvbm5lY3RpbmcgYSBuZWlnaGJvciBpcyBhIHR5cGUtMSBjb25mbGljdCB0aGVuIHdlIGlnbm9yZSB0aGF0IHBvc3NpYmlsaXR5LlxuICogSWYgYSBwcmV2aW91cyBub2RlIGhhcyBhbHJlYWR5IGZvcm1lZCBhIGJsb2NrIHdpdGggYSBub2RlIGFmdGVyIHRoZSBub2RlXG4gKiB3ZSdyZSB0cnlpbmcgdG8gZm9ybSBhIGJsb2NrIHdpdGgsIHdlIGFsc28gaWdub3JlIHRoYXQgcG9zc2liaWxpdHkgLSBvdXJcbiAqIGJsb2NrcyB3b3VsZCBiZSBzcGxpdCBpbiB0aGF0IHNjZW5hcmlvLlxuICovXG5mdW5jdGlvbiB2ZXJ0aWNhbEFsaWdubWVudChnLCBsYXllcmluZywgY29uZmxpY3RzLCBuZWlnaGJvckZuKSB7XG4gIHZhciByb290ID0ge30sXG4gICAgYWxpZ24gPSB7fSxcbiAgICBwb3MgPSB7fTtcblxuICAvLyBXZSBjYWNoZSB0aGUgcG9zaXRpb24gaGVyZSBiYXNlZCBvbiB0aGUgbGF5ZXJpbmcgYmVjYXVzZSB0aGUgZ3JhcGggYW5kXG4gIC8vIGxheWVyaW5nIG1heSBiZSBvdXQgb2Ygc3luYy4gVGhlIGxheWVyaW5nIG1hdHJpeCBpcyBtYW5pcHVsYXRlZCB0b1xuICAvLyBnZW5lcmF0ZSBkaWZmZXJlbnQgZXh0cmVtZSBhbGlnbm1lbnRzLlxuICBfLmZvckVhY2gobGF5ZXJpbmcsIGZ1bmN0aW9uKGxheWVyKSB7XG4gICAgXy5mb3JFYWNoKGxheWVyLCBmdW5jdGlvbih2LCBvcmRlcikge1xuICAgICAgcm9vdFt2XSA9IHY7XG4gICAgICBhbGlnblt2XSA9IHY7XG4gICAgICBwb3Nbdl0gPSBvcmRlcjtcbiAgICB9KTtcbiAgfSk7XG5cbiAgXy5mb3JFYWNoKGxheWVyaW5nLCBmdW5jdGlvbihsYXllcikge1xuICAgIHZhciBwcmV2SWR4ID0gLTE7XG4gICAgXy5mb3JFYWNoKGxheWVyLCBmdW5jdGlvbih2KSB7XG4gICAgICB2YXIgd3MgPSBuZWlnaGJvckZuKHYpO1xuICAgICAgaWYgKHdzLmxlbmd0aCkge1xuICAgICAgICB3cyA9IF8uc29ydEJ5KHdzLCBmdW5jdGlvbih3KSB7IHJldHVybiBwb3Nbd107IH0pO1xuICAgICAgICB2YXIgbXAgPSAod3MubGVuZ3RoIC0gMSkgLyAyO1xuICAgICAgICBmb3IgKHZhciBpID0gTWF0aC5mbG9vcihtcCksIGlsID0gTWF0aC5jZWlsKG1wKTsgaSA8PSBpbDsgKytpKSB7XG4gICAgICAgICAgdmFyIHcgPSB3c1tpXTtcbiAgICAgICAgICBpZiAoYWxpZ25bdl0gPT09IHYgJiZcbiAgICAgICAgICAgICAgcHJldklkeCA8IHBvc1t3XSAmJlxuICAgICAgICAgICAgICAhaGFzQ29uZmxpY3QoY29uZmxpY3RzLCB2LCB3KSkge1xuICAgICAgICAgICAgYWxpZ25bd10gPSB2O1xuICAgICAgICAgICAgYWxpZ25bdl0gPSByb290W3ZdID0gcm9vdFt3XTtcbiAgICAgICAgICAgIHByZXZJZHggPSBwb3Nbd107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB7IHJvb3Q6IHJvb3QsIGFsaWduOiBhbGlnbiB9O1xufVxuXG5mdW5jdGlvbiBob3Jpem9udGFsQ29tcGFjdGlvbihnLCBsYXllcmluZywgcm9vdCwgYWxpZ24sIHJldmVyc2VTZXApIHtcbiAgLy8gVGhpcyBwb3J0aW9uIG9mIHRoZSBhbGdvcml0aG0gZGlmZmVycyBmcm9tIEJLIGR1ZSB0byBhIG51bWJlciBvZiBwcm9ibGVtcy5cbiAgLy8gSW5zdGVhZCBvZiB0aGVpciBhbGdvcml0aG0gd2UgY29uc3RydWN0IGEgbmV3IGJsb2NrIGdyYXBoIGFuZCBkbyB0d29cbiAgLy8gc3dlZXBzLiBUaGUgZmlyc3Qgc3dlZXAgcGxhY2VzIGJsb2NrcyB3aXRoIHRoZSBzbWFsbGVzdCBwb3NzaWJsZVxuICAvLyBjb29yZGluYXRlcy4gVGhlIHNlY29uZCBzd2VlcCByZW1vdmVzIHVudXNlZCBzcGFjZSBieSBtb3ZpbmcgYmxvY2tzIHRvIHRoZVxuICAvLyBncmVhdGVzdCBjb29yZGluYXRlcyB3aXRob3V0IHZpb2xhdGluZyBzZXBhcmF0aW9uLlxuICB2YXIgeHMgPSB7fSxcbiAgICBibG9ja0cgPSBidWlsZEJsb2NrR3JhcGgoZywgbGF5ZXJpbmcsIHJvb3QsIHJldmVyc2VTZXApLFxuICAgIGJvcmRlclR5cGUgPSByZXZlcnNlU2VwID8gXCJib3JkZXJMZWZ0XCIgOiBcImJvcmRlclJpZ2h0XCI7XG5cbiAgZnVuY3Rpb24gaXRlcmF0ZShzZXRYc0Z1bmMsIG5leHROb2Rlc0Z1bmMpIHtcbiAgICB2YXIgc3RhY2sgPSBibG9ja0cubm9kZXMoKTtcbiAgICB2YXIgZWxlbSA9IHN0YWNrLnBvcCgpO1xuICAgIHZhciB2aXNpdGVkID0ge307XG4gICAgd2hpbGUgKGVsZW0pIHtcbiAgICAgIGlmICh2aXNpdGVkW2VsZW1dKSB7XG4gICAgICAgIHNldFhzRnVuYyhlbGVtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZpc2l0ZWRbZWxlbV0gPSB0cnVlO1xuICAgICAgICBzdGFjay5wdXNoKGVsZW0pO1xuICAgICAgICBzdGFjayA9IHN0YWNrLmNvbmNhdChuZXh0Tm9kZXNGdW5jKGVsZW0pKTtcbiAgICAgIH1cblxuICAgICAgZWxlbSA9IHN0YWNrLnBvcCgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpcnN0IHBhc3MsIGFzc2lnbiBzbWFsbGVzdCBjb29yZGluYXRlc1xuICBmdW5jdGlvbiBwYXNzMShlbGVtKSB7XG4gICAgeHNbZWxlbV0gPSBibG9ja0cuaW5FZGdlcyhlbGVtKS5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBlKSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgoYWNjLCB4c1tlLnZdICsgYmxvY2tHLmVkZ2UoZSkpO1xuICAgIH0sIDApO1xuICB9XG5cbiAgLy8gU2Vjb25kIHBhc3MsIGFzc2lnbiBncmVhdGVzdCBjb29yZGluYXRlc1xuICBmdW5jdGlvbiBwYXNzMihlbGVtKSB7XG4gICAgdmFyIG1pbiA9IGJsb2NrRy5vdXRFZGdlcyhlbGVtKS5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBlKSB7XG4gICAgICByZXR1cm4gTWF0aC5taW4oYWNjLCB4c1tlLnddIC0gYmxvY2tHLmVkZ2UoZSkpO1xuICAgIH0sIE51bWJlci5QT1NJVElWRV9JTkZJTklUWSk7XG5cbiAgICB2YXIgbm9kZSA9IGcubm9kZShlbGVtKTtcbiAgICBpZiAobWluICE9PSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkgJiYgbm9kZS5ib3JkZXJUeXBlICE9PSBib3JkZXJUeXBlKSB7XG4gICAgICB4c1tlbGVtXSA9IE1hdGgubWF4KHhzW2VsZW1dLCBtaW4pO1xuICAgIH1cbiAgfVxuXG4gIGl0ZXJhdGUocGFzczEsIGJsb2NrRy5wcmVkZWNlc3NvcnMuYmluZChibG9ja0cpKTtcbiAgaXRlcmF0ZShwYXNzMiwgYmxvY2tHLnN1Y2Nlc3NvcnMuYmluZChibG9ja0cpKTtcblxuICAvLyBBc3NpZ24geCBjb29yZGluYXRlcyB0byBhbGwgbm9kZXNcbiAgXy5mb3JFYWNoKGFsaWduLCBmdW5jdGlvbih2KSB7XG4gICAgeHNbdl0gPSB4c1tyb290W3ZdXTtcbiAgfSk7XG5cbiAgcmV0dXJuIHhzO1xufVxuXG5cbmZ1bmN0aW9uIGJ1aWxkQmxvY2tHcmFwaChnLCBsYXllcmluZywgcm9vdCwgcmV2ZXJzZVNlcCkge1xuICB2YXIgYmxvY2tHcmFwaCA9IG5ldyBHcmFwaCgpLFxuICAgIGdyYXBoTGFiZWwgPSBnLmdyYXBoKCksXG4gICAgc2VwRm4gPSBzZXAoZ3JhcGhMYWJlbC5ub2Rlc2VwLCBncmFwaExhYmVsLmVkZ2VzZXAsIHJldmVyc2VTZXApO1xuXG4gIF8uZm9yRWFjaChsYXllcmluZywgZnVuY3Rpb24obGF5ZXIpIHtcbiAgICB2YXIgdTtcbiAgICBfLmZvckVhY2gobGF5ZXIsIGZ1bmN0aW9uKHYpIHtcbiAgICAgIHZhciB2Um9vdCA9IHJvb3Rbdl07XG4gICAgICBibG9ja0dyYXBoLnNldE5vZGUodlJvb3QpO1xuICAgICAgaWYgKHUpIHtcbiAgICAgICAgdmFyIHVSb290ID0gcm9vdFt1XSxcbiAgICAgICAgICBwcmV2TWF4ID0gYmxvY2tHcmFwaC5lZGdlKHVSb290LCB2Um9vdCk7XG4gICAgICAgIGJsb2NrR3JhcGguc2V0RWRnZSh1Um9vdCwgdlJvb3QsIE1hdGgubWF4KHNlcEZuKGcsIHYsIHUpLCBwcmV2TWF4IHx8IDApKTtcbiAgICAgIH1cbiAgICAgIHUgPSB2O1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gYmxvY2tHcmFwaDtcbn1cblxuLypcbiAqIFJldHVybnMgdGhlIGFsaWdubWVudCB0aGF0IGhhcyB0aGUgc21hbGxlc3Qgd2lkdGggb2YgdGhlIGdpdmVuIGFsaWdubWVudHMuXG4gKi9cbmZ1bmN0aW9uIGZpbmRTbWFsbGVzdFdpZHRoQWxpZ25tZW50KGcsIHhzcykge1xuICByZXR1cm4gXy5taW5CeShfLnZhbHVlcyh4c3MpLCBmdW5jdGlvbiAoeHMpIHtcbiAgICB2YXIgbWF4ID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuICAgIHZhciBtaW4gPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG5cbiAgICBfLmZvckluKHhzLCBmdW5jdGlvbiAoeCwgdikge1xuICAgICAgdmFyIGhhbGZXaWR0aCA9IHdpZHRoKGcsIHYpIC8gMjtcblxuICAgICAgbWF4ID0gTWF0aC5tYXgoeCArIGhhbGZXaWR0aCwgbWF4KTtcbiAgICAgIG1pbiA9IE1hdGgubWluKHggLSBoYWxmV2lkdGgsIG1pbik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWF4IC0gbWluO1xuICB9KTtcbn1cblxuLypcbiAqIEFsaWduIHRoZSBjb29yZGluYXRlcyBvZiBlYWNoIG9mIHRoZSBsYXlvdXQgYWxpZ25tZW50cyBzdWNoIHRoYXRcbiAqIGxlZnQtYmlhc2VkIGFsaWdubWVudHMgaGF2ZSB0aGVpciBtaW5pbXVtIGNvb3JkaW5hdGUgYXQgdGhlIHNhbWUgcG9pbnQgYXNcbiAqIHRoZSBtaW5pbXVtIGNvb3JkaW5hdGUgb2YgdGhlIHNtYWxsZXN0IHdpZHRoIGFsaWdubWVudCBhbmQgcmlnaHQtYmlhc2VkXG4gKiBhbGlnbm1lbnRzIGhhdmUgdGhlaXIgbWF4aW11bSBjb29yZGluYXRlIGF0IHRoZSBzYW1lIHBvaW50IGFzIHRoZSBtYXhpbXVtXG4gKiBjb29yZGluYXRlIG9mIHRoZSBzbWFsbGVzdCB3aWR0aCBhbGlnbm1lbnQuXG4gKi9cbmZ1bmN0aW9uIGFsaWduQ29vcmRpbmF0ZXMoeHNzLCBhbGlnblRvKSB7XG4gIHZhciBhbGlnblRvVmFscyA9IF8udmFsdWVzKGFsaWduVG8pLFxuICAgIGFsaWduVG9NaW4gPSBfLm1pbihhbGlnblRvVmFscyksXG4gICAgYWxpZ25Ub01heCA9IF8ubWF4KGFsaWduVG9WYWxzKTtcblxuICBfLmZvckVhY2goW1widVwiLCBcImRcIl0sIGZ1bmN0aW9uKHZlcnQpIHtcbiAgICBfLmZvckVhY2goW1wibFwiLCBcInJcIl0sIGZ1bmN0aW9uKGhvcml6KSB7XG4gICAgICB2YXIgYWxpZ25tZW50ID0gdmVydCArIGhvcml6LFxuICAgICAgICB4cyA9IHhzc1thbGlnbm1lbnRdLFxuICAgICAgICBkZWx0YTtcbiAgICAgIGlmICh4cyA9PT0gYWxpZ25UbykgcmV0dXJuO1xuXG4gICAgICB2YXIgeHNWYWxzID0gXy52YWx1ZXMoeHMpO1xuICAgICAgZGVsdGEgPSBob3JpeiA9PT0gXCJsXCIgPyBhbGlnblRvTWluIC0gXy5taW4oeHNWYWxzKSA6IGFsaWduVG9NYXggLSBfLm1heCh4c1ZhbHMpO1xuXG4gICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgeHNzW2FsaWdubWVudF0gPSBfLm1hcFZhbHVlcyh4cywgZnVuY3Rpb24oeCkgeyByZXR1cm4geCArIGRlbHRhOyB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGJhbGFuY2UoeHNzLCBhbGlnbikge1xuICByZXR1cm4gXy5tYXBWYWx1ZXMoeHNzLnVsLCBmdW5jdGlvbihpZ25vcmUsIHYpIHtcbiAgICBpZiAoYWxpZ24pIHtcbiAgICAgIHJldHVybiB4c3NbYWxpZ24udG9Mb3dlckNhc2UoKV1bdl07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB4cyA9IF8uc29ydEJ5KF8ubWFwKHhzcywgdikpO1xuICAgICAgcmV0dXJuICh4c1sxXSArIHhzWzJdKSAvIDI7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gcG9zaXRpb25YKGcpIHtcbiAgdmFyIGxheWVyaW5nID0gdXRpbC5idWlsZExheWVyTWF0cml4KGcpO1xuICB2YXIgY29uZmxpY3RzID0gXy5tZXJnZShcbiAgICBmaW5kVHlwZTFDb25mbGljdHMoZywgbGF5ZXJpbmcpLFxuICAgIGZpbmRUeXBlMkNvbmZsaWN0cyhnLCBsYXllcmluZykpO1xuXG4gIHZhciB4c3MgPSB7fTtcbiAgdmFyIGFkanVzdGVkTGF5ZXJpbmc7XG4gIF8uZm9yRWFjaChbXCJ1XCIsIFwiZFwiXSwgZnVuY3Rpb24odmVydCkge1xuICAgIGFkanVzdGVkTGF5ZXJpbmcgPSB2ZXJ0ID09PSBcInVcIiA/IGxheWVyaW5nIDogXy52YWx1ZXMobGF5ZXJpbmcpLnJldmVyc2UoKTtcbiAgICBfLmZvckVhY2goW1wibFwiLCBcInJcIl0sIGZ1bmN0aW9uKGhvcml6KSB7XG4gICAgICBpZiAoaG9yaXogPT09IFwiclwiKSB7XG4gICAgICAgIGFkanVzdGVkTGF5ZXJpbmcgPSBfLm1hcChhZGp1c3RlZExheWVyaW5nLCBmdW5jdGlvbihpbm5lcikge1xuICAgICAgICAgIHJldHVybiBfLnZhbHVlcyhpbm5lcikucmV2ZXJzZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdmFyIG5laWdoYm9yRm4gPSAodmVydCA9PT0gXCJ1XCIgPyBnLnByZWRlY2Vzc29ycyA6IGcuc3VjY2Vzc29ycykuYmluZChnKTtcbiAgICAgIHZhciBhbGlnbiA9IHZlcnRpY2FsQWxpZ25tZW50KGcsIGFkanVzdGVkTGF5ZXJpbmcsIGNvbmZsaWN0cywgbmVpZ2hib3JGbik7XG4gICAgICB2YXIgeHMgPSBob3Jpem9udGFsQ29tcGFjdGlvbihnLCBhZGp1c3RlZExheWVyaW5nLFxuICAgICAgICBhbGlnbi5yb290LCBhbGlnbi5hbGlnbiwgaG9yaXogPT09IFwiclwiKTtcbiAgICAgIGlmIChob3JpeiA9PT0gXCJyXCIpIHtcbiAgICAgICAgeHMgPSBfLm1hcFZhbHVlcyh4cywgZnVuY3Rpb24oeCkgeyByZXR1cm4gLXg7IH0pO1xuICAgICAgfVxuICAgICAgeHNzW3ZlcnQgKyBob3Jpel0gPSB4cztcbiAgICB9KTtcbiAgfSk7XG5cbiAgdmFyIHNtYWxsZXN0V2lkdGggPSBmaW5kU21hbGxlc3RXaWR0aEFsaWdubWVudChnLCB4c3MpO1xuICBhbGlnbkNvb3JkaW5hdGVzKHhzcywgc21hbGxlc3RXaWR0aCk7XG4gIHJldHVybiBiYWxhbmNlKHhzcywgZy5ncmFwaCgpLmFsaWduKTtcbn1cblxuZnVuY3Rpb24gc2VwKG5vZGVTZXAsIGVkZ2VTZXAsIHJldmVyc2VTZXApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGcsIHYsIHcpIHtcbiAgICB2YXIgdkxhYmVsID0gZy5ub2RlKHYpO1xuICAgIHZhciB3TGFiZWwgPSBnLm5vZGUodyk7XG4gICAgdmFyIHN1bSA9IDA7XG4gICAgdmFyIGRlbHRhO1xuXG4gICAgc3VtICs9IHZMYWJlbC53aWR0aCAvIDI7XG4gICAgaWYgKF8uaGFzKHZMYWJlbCwgXCJsYWJlbHBvc1wiKSkge1xuICAgICAgc3dpdGNoICh2TGFiZWwubGFiZWxwb3MudG9Mb3dlckNhc2UoKSkge1xuICAgICAgY2FzZSBcImxcIjogZGVsdGEgPSAtdkxhYmVsLndpZHRoIC8gMjsgYnJlYWs7XG4gICAgICBjYXNlIFwiclwiOiBkZWx0YSA9IHZMYWJlbC53aWR0aCAvIDI7IGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZGVsdGEpIHtcbiAgICAgIHN1bSArPSByZXZlcnNlU2VwID8gZGVsdGEgOiAtZGVsdGE7XG4gICAgfVxuICAgIGRlbHRhID0gMDtcblxuICAgIHN1bSArPSAodkxhYmVsLmR1bW15ID8gZWRnZVNlcCA6IG5vZGVTZXApIC8gMjtcbiAgICBzdW0gKz0gKHdMYWJlbC5kdW1teSA/IGVkZ2VTZXAgOiBub2RlU2VwKSAvIDI7XG5cbiAgICBzdW0gKz0gd0xhYmVsLndpZHRoIC8gMjtcbiAgICBpZiAoXy5oYXMod0xhYmVsLCBcImxhYmVscG9zXCIpKSB7XG4gICAgICBzd2l0Y2ggKHdMYWJlbC5sYWJlbHBvcy50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBjYXNlIFwibFwiOiBkZWx0YSA9IHdMYWJlbC53aWR0aCAvIDI7IGJyZWFrO1xuICAgICAgY2FzZSBcInJcIjogZGVsdGEgPSAtd0xhYmVsLndpZHRoIC8gMjsgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChkZWx0YSkge1xuICAgICAgc3VtICs9IHJldmVyc2VTZXAgPyBkZWx0YSA6IC1kZWx0YTtcbiAgICB9XG4gICAgZGVsdGEgPSAwO1xuXG4gICAgcmV0dXJuIHN1bTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gd2lkdGgoZywgdikge1xuICByZXR1cm4gZy5ub2RlKHYpLndpZHRoO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfID0gcmVxdWlyZShcIi4uL2xvZGFzaFwiKTtcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XG52YXIgcG9zaXRpb25YID0gcmVxdWlyZShcIi4vYmtcIikucG9zaXRpb25YO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBvc2l0aW9uO1xuXG5mdW5jdGlvbiBwb3NpdGlvbihnKSB7XG4gIGcgPSB1dGlsLmFzTm9uQ29tcG91bmRHcmFwaChnKTtcblxuICBwb3NpdGlvblkoZyk7XG4gIF8uZm9yRWFjaChwb3NpdGlvblgoZyksIGZ1bmN0aW9uKHgsIHYpIHtcbiAgICBnLm5vZGUodikueCA9IHg7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwb3NpdGlvblkoZykge1xuICB2YXIgbGF5ZXJpbmcgPSB1dGlsLmJ1aWxkTGF5ZXJNYXRyaXgoZyk7XG4gIHZhciByYW5rU2VwID0gZy5ncmFwaCgpLnJhbmtzZXA7XG4gIHZhciBwcmV2WSA9IDA7XG4gIF8uZm9yRWFjaChsYXllcmluZywgZnVuY3Rpb24obGF5ZXIpIHtcbiAgICB2YXIgbWF4SGVpZ2h0ID0gXy5tYXgoXy5tYXAobGF5ZXIsIGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGcubm9kZSh2KS5oZWlnaHQ7IH0pKTtcbiAgICBfLmZvckVhY2gobGF5ZXIsIGZ1bmN0aW9uKHYpIHtcbiAgICAgIGcubm9kZSh2KS55ID0gcHJldlkgKyBtYXhIZWlnaHQgLyAyO1xuICAgIH0pO1xuICAgIHByZXZZICs9IG1heEhlaWdodCArIHJhbmtTZXA7XG4gIH0pO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF8gPSByZXF1aXJlKFwiLi4vbG9kYXNoXCIpO1xudmFyIEdyYXBoID0gcmVxdWlyZShcIi4uL2dyYXBobGliXCIpLkdyYXBoO1xudmFyIHNsYWNrID0gcmVxdWlyZShcIi4vdXRpbFwiKS5zbGFjaztcblxubW9kdWxlLmV4cG9ydHMgPSBmZWFzaWJsZVRyZWU7XG5cbi8qXG4gKiBDb25zdHJ1Y3RzIGEgc3Bhbm5pbmcgdHJlZSB3aXRoIHRpZ2h0IGVkZ2VzIGFuZCBhZGp1c3RlZCB0aGUgaW5wdXQgbm9kZSdzXG4gKiByYW5rcyB0byBhY2hpZXZlIHRoaXMuIEEgdGlnaHQgZWRnZSBpcyBvbmUgdGhhdCBpcyBoYXMgYSBsZW5ndGggdGhhdCBtYXRjaGVzXG4gKiBpdHMgXCJtaW5sZW5cIiBhdHRyaWJ1dGUuXG4gKlxuICogVGhlIGJhc2ljIHN0cnVjdHVyZSBmb3IgdGhpcyBmdW5jdGlvbiBpcyBkZXJpdmVkIGZyb20gR2Fuc25lciwgZXQgYWwuLCBcIkFcbiAqIFRlY2huaXF1ZSBmb3IgRHJhd2luZyBEaXJlY3RlZCBHcmFwaHMuXCJcbiAqXG4gKiBQcmUtY29uZGl0aW9uczpcbiAqXG4gKiAgICAxLiBHcmFwaCBtdXN0IGJlIGEgREFHLlxuICogICAgMi4gR3JhcGggbXVzdCBiZSBjb25uZWN0ZWQuXG4gKiAgICAzLiBHcmFwaCBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIG5vZGUuXG4gKiAgICA1LiBHcmFwaCBub2RlcyBtdXN0IGhhdmUgYmVlbiBwcmV2aW91c2x5IGFzc2lnbmVkIGEgXCJyYW5rXCIgcHJvcGVydHkgdGhhdFxuICogICAgICAgcmVzcGVjdHMgdGhlIFwibWlubGVuXCIgcHJvcGVydHkgb2YgaW5jaWRlbnQgZWRnZXMuXG4gKiAgICA2LiBHcmFwaCBlZGdlcyBtdXN0IGhhdmUgYSBcIm1pbmxlblwiIHByb3BlcnR5LlxuICpcbiAqIFBvc3QtY29uZGl0aW9uczpcbiAqXG4gKiAgICAtIEdyYXBoIG5vZGVzIHdpbGwgaGF2ZSB0aGVpciByYW5rIGFkanVzdGVkIHRvIGVuc3VyZSB0aGF0IGFsbCBlZGdlcyBhcmVcbiAqICAgICAgdGlnaHQuXG4gKlxuICogUmV0dXJucyBhIHRyZWUgKHVuZGlyZWN0ZWQgZ3JhcGgpIHRoYXQgaXMgY29uc3RydWN0ZWQgdXNpbmcgb25seSBcInRpZ2h0XCJcbiAqIGVkZ2VzLlxuICovXG5mdW5jdGlvbiBmZWFzaWJsZVRyZWUoZykge1xuICB2YXIgdCA9IG5ldyBHcmFwaCh7IGRpcmVjdGVkOiBmYWxzZSB9KTtcblxuICAvLyBDaG9vc2UgYXJiaXRyYXJ5IG5vZGUgZnJvbSB3aGljaCB0byBzdGFydCBvdXIgdHJlZVxuICB2YXIgc3RhcnQgPSBnLm5vZGVzKClbMF07XG4gIHZhciBzaXplID0gZy5ub2RlQ291bnQoKTtcbiAgdC5zZXROb2RlKHN0YXJ0LCB7fSk7XG5cbiAgdmFyIGVkZ2UsIGRlbHRhO1xuICB3aGlsZSAodGlnaHRUcmVlKHQsIGcpIDwgc2l6ZSkge1xuICAgIGVkZ2UgPSBmaW5kTWluU2xhY2tFZGdlKHQsIGcpO1xuICAgIGRlbHRhID0gdC5oYXNOb2RlKGVkZ2UudikgPyBzbGFjayhnLCBlZGdlKSA6IC1zbGFjayhnLCBlZGdlKTtcbiAgICBzaGlmdFJhbmtzKHQsIGcsIGRlbHRhKTtcbiAgfVxuXG4gIHJldHVybiB0O1xufVxuXG4vKlxuICogRmluZHMgYSBtYXhpbWFsIHRyZWUgb2YgdGlnaHQgZWRnZXMgYW5kIHJldHVybnMgdGhlIG51bWJlciBvZiBub2RlcyBpbiB0aGVcbiAqIHRyZWUuXG4gKi9cbmZ1bmN0aW9uIHRpZ2h0VHJlZSh0LCBnKSB7XG4gIGZ1bmN0aW9uIGRmcyh2KSB7XG4gICAgXy5mb3JFYWNoKGcubm9kZUVkZ2VzKHYpLCBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgZWRnZVYgPSBlLnYsXG4gICAgICAgIHcgPSAodiA9PT0gZWRnZVYpID8gZS53IDogZWRnZVY7XG4gICAgICBpZiAoIXQuaGFzTm9kZSh3KSAmJiAhc2xhY2soZywgZSkpIHtcbiAgICAgICAgdC5zZXROb2RlKHcsIHt9KTtcbiAgICAgICAgdC5zZXRFZGdlKHYsIHcsIHt9KTtcbiAgICAgICAgZGZzKHcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgXy5mb3JFYWNoKHQubm9kZXMoKSwgZGZzKTtcbiAgcmV0dXJuIHQubm9kZUNvdW50KCk7XG59XG5cbi8qXG4gKiBGaW5kcyB0aGUgZWRnZSB3aXRoIHRoZSBzbWFsbGVzdCBzbGFjayB0aGF0IGlzIGluY2lkZW50IG9uIHRyZWUgYW5kIHJldHVybnNcbiAqIGl0LlxuICovXG5mdW5jdGlvbiBmaW5kTWluU2xhY2tFZGdlKHQsIGcpIHtcbiAgcmV0dXJuIF8ubWluQnkoZy5lZGdlcygpLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKHQuaGFzTm9kZShlLnYpICE9PSB0Lmhhc05vZGUoZS53KSkge1xuICAgICAgcmV0dXJuIHNsYWNrKGcsIGUpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNoaWZ0UmFua3ModCwgZywgZGVsdGEpIHtcbiAgXy5mb3JFYWNoKHQubm9kZXMoKSwgZnVuY3Rpb24odikge1xuICAgIGcubm9kZSh2KS5yYW5rICs9IGRlbHRhO1xuICB9KTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgcmFua1V0aWwgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIGxvbmdlc3RQYXRoID0gcmFua1V0aWwubG9uZ2VzdFBhdGg7XG52YXIgZmVhc2libGVUcmVlID0gcmVxdWlyZShcIi4vZmVhc2libGUtdHJlZVwiKTtcbnZhciBuZXR3b3JrU2ltcGxleCA9IHJlcXVpcmUoXCIuL25ldHdvcmstc2ltcGxleFwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSByYW5rO1xuXG4vKlxuICogQXNzaWducyBhIHJhbmsgdG8gZWFjaCBub2RlIGluIHRoZSBpbnB1dCBncmFwaCB0aGF0IHJlc3BlY3RzIHRoZSBcIm1pbmxlblwiXG4gKiBjb25zdHJhaW50IHNwZWNpZmllZCBvbiBlZGdlcyBiZXR3ZWVuIG5vZGVzLlxuICpcbiAqIFRoaXMgYmFzaWMgc3RydWN0dXJlIGlzIGRlcml2ZWQgZnJvbSBHYW5zbmVyLCBldCBhbC4sIFwiQSBUZWNobmlxdWUgZm9yXG4gKiBEcmF3aW5nIERpcmVjdGVkIEdyYXBocy5cIlxuICpcbiAqIFByZS1jb25kaXRpb25zOlxuICpcbiAqICAgIDEuIEdyYXBoIG11c3QgYmUgYSBjb25uZWN0ZWQgREFHXG4gKiAgICAyLiBHcmFwaCBub2RlcyBtdXN0IGJlIG9iamVjdHNcbiAqICAgIDMuIEdyYXBoIGVkZ2VzIG11c3QgaGF2ZSBcIndlaWdodFwiIGFuZCBcIm1pbmxlblwiIGF0dHJpYnV0ZXNcbiAqXG4gKiBQb3N0LWNvbmRpdGlvbnM6XG4gKlxuICogICAgMS4gR3JhcGggbm9kZXMgd2lsbCBoYXZlIGEgXCJyYW5rXCIgYXR0cmlidXRlIGJhc2VkIG9uIHRoZSByZXN1bHRzIG9mIHRoZVxuICogICAgICAgYWxnb3JpdGhtLiBSYW5rcyBjYW4gc3RhcnQgYXQgYW55IGluZGV4IChpbmNsdWRpbmcgbmVnYXRpdmUpLCB3ZSdsbFxuICogICAgICAgZml4IHRoZW0gdXAgbGF0ZXIuXG4gKi9cbmZ1bmN0aW9uIHJhbmsoZykge1xuICBzd2l0Y2goZy5ncmFwaCgpLnJhbmtlcikge1xuICBjYXNlIFwibmV0d29yay1zaW1wbGV4XCI6IG5ldHdvcmtTaW1wbGV4UmFua2VyKGcpOyBicmVhaztcbiAgY2FzZSBcInRpZ2h0LXRyZWVcIjogdGlnaHRUcmVlUmFua2VyKGcpOyBicmVhaztcbiAgY2FzZSBcImxvbmdlc3QtcGF0aFwiOiBsb25nZXN0UGF0aFJhbmtlcihnKTsgYnJlYWs7XG4gIGRlZmF1bHQ6IG5ldHdvcmtTaW1wbGV4UmFua2VyKGcpO1xuICB9XG59XG5cbi8vIEEgZmFzdCBhbmQgc2ltcGxlIHJhbmtlciwgYnV0IHJlc3VsdHMgYXJlIGZhciBmcm9tIG9wdGltYWwuXG52YXIgbG9uZ2VzdFBhdGhSYW5rZXIgPSBsb25nZXN0UGF0aDtcblxuZnVuY3Rpb24gdGlnaHRUcmVlUmFua2VyKGcpIHtcbiAgbG9uZ2VzdFBhdGgoZyk7XG4gIGZlYXNpYmxlVHJlZShnKTtcbn1cblxuZnVuY3Rpb24gbmV0d29ya1NpbXBsZXhSYW5rZXIoZykge1xuICBuZXR3b3JrU2ltcGxleChnKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgXyA9IHJlcXVpcmUoXCIuLi9sb2Rhc2hcIik7XG52YXIgZmVhc2libGVUcmVlID0gcmVxdWlyZShcIi4vZmVhc2libGUtdHJlZVwiKTtcbnZhciBzbGFjayA9IHJlcXVpcmUoXCIuL3V0aWxcIikuc2xhY2s7XG52YXIgaW5pdFJhbmsgPSByZXF1aXJlKFwiLi91dGlsXCIpLmxvbmdlc3RQYXRoO1xudmFyIHByZW9yZGVyID0gcmVxdWlyZShcIi4uL2dyYXBobGliXCIpLmFsZy5wcmVvcmRlcjtcbnZhciBwb3N0b3JkZXIgPSByZXF1aXJlKFwiLi4vZ3JhcGhsaWJcIikuYWxnLnBvc3RvcmRlcjtcbnZhciBzaW1wbGlmeSA9IHJlcXVpcmUoXCIuLi91dGlsXCIpLnNpbXBsaWZ5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldHdvcmtTaW1wbGV4O1xuXG4vLyBFeHBvc2Ugc29tZSBpbnRlcm5hbHMgZm9yIHRlc3RpbmcgcHVycG9zZXNcbm5ldHdvcmtTaW1wbGV4LmluaXRMb3dMaW1WYWx1ZXMgPSBpbml0TG93TGltVmFsdWVzO1xubmV0d29ya1NpbXBsZXguaW5pdEN1dFZhbHVlcyA9IGluaXRDdXRWYWx1ZXM7XG5uZXR3b3JrU2ltcGxleC5jYWxjQ3V0VmFsdWUgPSBjYWxjQ3V0VmFsdWU7XG5uZXR3b3JrU2ltcGxleC5sZWF2ZUVkZ2UgPSBsZWF2ZUVkZ2U7XG5uZXR3b3JrU2ltcGxleC5lbnRlckVkZ2UgPSBlbnRlckVkZ2U7XG5uZXR3b3JrU2ltcGxleC5leGNoYW5nZUVkZ2VzID0gZXhjaGFuZ2VFZGdlcztcblxuLypcbiAqIFRoZSBuZXR3b3JrIHNpbXBsZXggYWxnb3JpdGhtIGFzc2lnbnMgcmFua3MgdG8gZWFjaCBub2RlIGluIHRoZSBpbnB1dCBncmFwaFxuICogYW5kIGl0ZXJhdGl2ZWx5IGltcHJvdmVzIHRoZSByYW5raW5nIHRvIHJlZHVjZSB0aGUgbGVuZ3RoIG9mIGVkZ2VzLlxuICpcbiAqIFByZWNvbmRpdGlvbnM6XG4gKlxuICogICAgMS4gVGhlIGlucHV0IGdyYXBoIG11c3QgYmUgYSBEQUcuXG4gKiAgICAyLiBBbGwgbm9kZXMgaW4gdGhlIGdyYXBoIG11c3QgaGF2ZSBhbiBvYmplY3QgdmFsdWUuXG4gKiAgICAzLiBBbGwgZWRnZXMgaW4gdGhlIGdyYXBoIG11c3QgaGF2ZSBcIm1pbmxlblwiIGFuZCBcIndlaWdodFwiIGF0dHJpYnV0ZXMuXG4gKlxuICogUG9zdGNvbmRpdGlvbnM6XG4gKlxuICogICAgMS4gQWxsIG5vZGVzIGluIHRoZSBncmFwaCB3aWxsIGhhdmUgYW4gYXNzaWduZWQgXCJyYW5rXCIgYXR0cmlidXRlIHRoYXQgaGFzXG4gKiAgICAgICBiZWVuIG9wdGltaXplZCBieSB0aGUgbmV0d29yayBzaW1wbGV4IGFsZ29yaXRobS4gUmFua3Mgc3RhcnQgYXQgMC5cbiAqXG4gKlxuICogQSByb3VnaCBza2V0Y2ggb2YgdGhlIGFsZ29yaXRobSBpcyBhcyBmb2xsb3dzOlxuICpcbiAqICAgIDEuIEFzc2lnbiBpbml0aWFsIHJhbmtzIHRvIGVhY2ggbm9kZS4gV2UgdXNlIHRoZSBsb25nZXN0IHBhdGggYWxnb3JpdGhtLFxuICogICAgICAgd2hpY2ggYXNzaWducyByYW5rcyB0byB0aGUgbG93ZXN0IHBvc2l0aW9uIHBvc3NpYmxlLiBJbiBnZW5lcmFsIHRoaXNcbiAqICAgICAgIGxlYWRzIHRvIHZlcnkgd2lkZSBib3R0b20gcmFua3MgYW5kIHVubmVjZXNzYXJpbHkgbG9uZyBlZGdlcy5cbiAqICAgIDIuIENvbnN0cnVjdCBhIGZlYXNpYmxlIHRpZ2h0IHRyZWUuIEEgdGlnaHQgdHJlZSBpcyBvbmUgc3VjaCB0aGF0IGFsbFxuICogICAgICAgZWRnZXMgaW4gdGhlIHRyZWUgaGF2ZSBubyBzbGFjayAoZGlmZmVyZW5jZSBiZXR3ZWVuIGxlbmd0aCBvZiBlZGdlXG4gKiAgICAgICBhbmQgbWlubGVuIGZvciB0aGUgZWRnZSkuIFRoaXMgYnkgaXRzZWxmIGdyZWF0bHkgaW1wcm92ZXMgdGhlIGFzc2lnbmVkXG4gKiAgICAgICByYW5raW5ncyBieSBzaG9ydGluZyBlZGdlcy5cbiAqICAgIDMuIEl0ZXJhdGl2ZWx5IGZpbmQgZWRnZXMgdGhhdCBoYXZlIG5lZ2F0aXZlIGN1dCB2YWx1ZXMuIEdlbmVyYWxseSBhXG4gKiAgICAgICBuZWdhdGl2ZSBjdXQgdmFsdWUgaW5kaWNhdGVzIHRoYXQgdGhlIGVkZ2UgY291bGQgYmUgcmVtb3ZlZCBhbmQgYSBuZXdcbiAqICAgICAgIHRyZWUgZWRnZSBjb3VsZCBiZSBhZGRlZCB0byBwcm9kdWNlIGEgbW9yZSBjb21wYWN0IGdyYXBoLlxuICpcbiAqIE11Y2ggb2YgdGhlIGFsZ29yaXRobXMgaGVyZSBhcmUgZGVyaXZlZCBmcm9tIEdhbnNuZXIsIGV0IGFsLiwgXCJBIFRlY2huaXF1ZVxuICogZm9yIERyYXdpbmcgRGlyZWN0ZWQgR3JhcGhzLlwiIFRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGZpbGUgcm91Z2hseSBmb2xsb3dzIHRoZVxuICogc3RydWN0dXJlIG9mIHRoZSBvdmVyYWxsIGFsZ29yaXRobS5cbiAqL1xuZnVuY3Rpb24gbmV0d29ya1NpbXBsZXgoZykge1xuICBnID0gc2ltcGxpZnkoZyk7XG4gIGluaXRSYW5rKGcpO1xuICB2YXIgdCA9IGZlYXNpYmxlVHJlZShnKTtcbiAgaW5pdExvd0xpbVZhbHVlcyh0KTtcbiAgaW5pdEN1dFZhbHVlcyh0LCBnKTtcblxuICB2YXIgZSwgZjtcbiAgd2hpbGUgKChlID0gbGVhdmVFZGdlKHQpKSkge1xuICAgIGYgPSBlbnRlckVkZ2UodCwgZywgZSk7XG4gICAgZXhjaGFuZ2VFZGdlcyh0LCBnLCBlLCBmKTtcbiAgfVxufVxuXG4vKlxuICogSW5pdGlhbGl6ZXMgY3V0IHZhbHVlcyBmb3IgYWxsIGVkZ2VzIGluIHRoZSB0cmVlLlxuICovXG5mdW5jdGlvbiBpbml0Q3V0VmFsdWVzKHQsIGcpIHtcbiAgdmFyIHZzID0gcG9zdG9yZGVyKHQsIHQubm9kZXMoKSk7XG4gIHZzID0gdnMuc2xpY2UoMCwgdnMubGVuZ3RoIC0gMSk7XG4gIF8uZm9yRWFjaCh2cywgZnVuY3Rpb24odikge1xuICAgIGFzc2lnbkN1dFZhbHVlKHQsIGcsIHYpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYXNzaWduQ3V0VmFsdWUodCwgZywgY2hpbGQpIHtcbiAgdmFyIGNoaWxkTGFiID0gdC5ub2RlKGNoaWxkKTtcbiAgdmFyIHBhcmVudCA9IGNoaWxkTGFiLnBhcmVudDtcbiAgdC5lZGdlKGNoaWxkLCBwYXJlbnQpLmN1dHZhbHVlID0gY2FsY0N1dFZhbHVlKHQsIGcsIGNoaWxkKTtcbn1cblxuLypcbiAqIEdpdmVuIHRoZSB0aWdodCB0cmVlLCBpdHMgZ3JhcGgsIGFuZCBhIGNoaWxkIGluIHRoZSBncmFwaCBjYWxjdWxhdGUgYW5kXG4gKiByZXR1cm4gdGhlIGN1dCB2YWx1ZSBmb3IgdGhlIGVkZ2UgYmV0d2VlbiB0aGUgY2hpbGQgYW5kIGl0cyBwYXJlbnQuXG4gKi9cbmZ1bmN0aW9uIGNhbGNDdXRWYWx1ZSh0LCBnLCBjaGlsZCkge1xuICB2YXIgY2hpbGRMYWIgPSB0Lm5vZGUoY2hpbGQpO1xuICB2YXIgcGFyZW50ID0gY2hpbGRMYWIucGFyZW50O1xuICAvLyBUcnVlIGlmIHRoZSBjaGlsZCBpcyBvbiB0aGUgdGFpbCBlbmQgb2YgdGhlIGVkZ2UgaW4gdGhlIGRpcmVjdGVkIGdyYXBoXG4gIHZhciBjaGlsZElzVGFpbCA9IHRydWU7XG4gIC8vIFRoZSBncmFwaCdzIHZpZXcgb2YgdGhlIHRyZWUgZWRnZSB3ZSdyZSBpbnNwZWN0aW5nXG4gIHZhciBncmFwaEVkZ2UgPSBnLmVkZ2UoY2hpbGQsIHBhcmVudCk7XG4gIC8vIFRoZSBhY2N1bXVsYXRlZCBjdXQgdmFsdWUgZm9yIHRoZSBlZGdlIGJldHdlZW4gdGhpcyBub2RlIGFuZCBpdHMgcGFyZW50XG4gIHZhciBjdXRWYWx1ZSA9IDA7XG5cbiAgaWYgKCFncmFwaEVkZ2UpIHtcbiAgICBjaGlsZElzVGFpbCA9IGZhbHNlO1xuICAgIGdyYXBoRWRnZSA9IGcuZWRnZShwYXJlbnQsIGNoaWxkKTtcbiAgfVxuXG4gIGN1dFZhbHVlID0gZ3JhcGhFZGdlLndlaWdodDtcblxuICBfLmZvckVhY2goZy5ub2RlRWRnZXMoY2hpbGQpLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGlzT3V0RWRnZSA9IGUudiA9PT0gY2hpbGQsXG4gICAgICBvdGhlciA9IGlzT3V0RWRnZSA/IGUudyA6IGUudjtcblxuICAgIGlmIChvdGhlciAhPT0gcGFyZW50KSB7XG4gICAgICB2YXIgcG9pbnRzVG9IZWFkID0gaXNPdXRFZGdlID09PSBjaGlsZElzVGFpbCxcbiAgICAgICAgb3RoZXJXZWlnaHQgPSBnLmVkZ2UoZSkud2VpZ2h0O1xuXG4gICAgICBjdXRWYWx1ZSArPSBwb2ludHNUb0hlYWQgPyBvdGhlcldlaWdodCA6IC1vdGhlcldlaWdodDtcbiAgICAgIGlmIChpc1RyZWVFZGdlKHQsIGNoaWxkLCBvdGhlcikpIHtcbiAgICAgICAgdmFyIG90aGVyQ3V0VmFsdWUgPSB0LmVkZ2UoY2hpbGQsIG90aGVyKS5jdXR2YWx1ZTtcbiAgICAgICAgY3V0VmFsdWUgKz0gcG9pbnRzVG9IZWFkID8gLW90aGVyQ3V0VmFsdWUgOiBvdGhlckN1dFZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGN1dFZhbHVlO1xufVxuXG5mdW5jdGlvbiBpbml0TG93TGltVmFsdWVzKHRyZWUsIHJvb3QpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgcm9vdCA9IHRyZWUubm9kZXMoKVswXTtcbiAgfVxuICBkZnNBc3NpZ25Mb3dMaW0odHJlZSwge30sIDEsIHJvb3QpO1xufVxuXG5mdW5jdGlvbiBkZnNBc3NpZ25Mb3dMaW0odHJlZSwgdmlzaXRlZCwgbmV4dExpbSwgdiwgcGFyZW50KSB7XG4gIHZhciBsb3cgPSBuZXh0TGltO1xuICB2YXIgbGFiZWwgPSB0cmVlLm5vZGUodik7XG5cbiAgdmlzaXRlZFt2XSA9IHRydWU7XG4gIF8uZm9yRWFjaCh0cmVlLm5laWdoYm9ycyh2KSwgZnVuY3Rpb24odykge1xuICAgIGlmICghXy5oYXModmlzaXRlZCwgdykpIHtcbiAgICAgIG5leHRMaW0gPSBkZnNBc3NpZ25Mb3dMaW0odHJlZSwgdmlzaXRlZCwgbmV4dExpbSwgdywgdik7XG4gICAgfVxuICB9KTtcblxuICBsYWJlbC5sb3cgPSBsb3c7XG4gIGxhYmVsLmxpbSA9IG5leHRMaW0rKztcbiAgaWYgKHBhcmVudCkge1xuICAgIGxhYmVsLnBhcmVudCA9IHBhcmVudDtcbiAgfSBlbHNlIHtcbiAgICAvLyBUT0RPIHNob3VsZCBiZSBhYmxlIHRvIHJlbW92ZSB0aGlzIHdoZW4gd2UgaW5jcmVtZW50YWxseSB1cGRhdGUgbG93IGxpbVxuICAgIGRlbGV0ZSBsYWJlbC5wYXJlbnQ7XG4gIH1cblxuICByZXR1cm4gbmV4dExpbTtcbn1cblxuZnVuY3Rpb24gbGVhdmVFZGdlKHRyZWUpIHtcbiAgcmV0dXJuIF8uZmluZCh0cmVlLmVkZ2VzKCksIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gdHJlZS5lZGdlKGUpLmN1dHZhbHVlIDwgMDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGVudGVyRWRnZSh0LCBnLCBlZGdlKSB7XG4gIHZhciB2ID0gZWRnZS52O1xuICB2YXIgdyA9IGVkZ2UudztcblxuICAvLyBGb3IgdGhlIHJlc3Qgb2YgdGhpcyBmdW5jdGlvbiB3ZSBhc3N1bWUgdGhhdCB2IGlzIHRoZSB0YWlsIGFuZCB3IGlzIHRoZVxuICAvLyBoZWFkLCBzbyBpZiB3ZSBkb24ndCBoYXZlIHRoaXMgZWRnZSBpbiB0aGUgZ3JhcGggd2Ugc2hvdWxkIGZsaXAgaXQgdG9cbiAgLy8gbWF0Y2ggdGhlIGNvcnJlY3Qgb3JpZW50YXRpb24uXG4gIGlmICghZy5oYXNFZGdlKHYsIHcpKSB7XG4gICAgdiA9IGVkZ2UudztcbiAgICB3ID0gZWRnZS52O1xuICB9XG5cbiAgdmFyIHZMYWJlbCA9IHQubm9kZSh2KTtcbiAgdmFyIHdMYWJlbCA9IHQubm9kZSh3KTtcbiAgdmFyIHRhaWxMYWJlbCA9IHZMYWJlbDtcbiAgdmFyIGZsaXAgPSBmYWxzZTtcblxuICAvLyBJZiB0aGUgcm9vdCBpcyBpbiB0aGUgdGFpbCBvZiB0aGUgZWRnZSB0aGVuIHdlIG5lZWQgdG8gZmxpcCB0aGUgbG9naWMgdGhhdFxuICAvLyBjaGVja3MgZm9yIHRoZSBoZWFkIGFuZCB0YWlsIG5vZGVzIGluIHRoZSBjYW5kaWRhdGVzIGZ1bmN0aW9uIGJlbG93LlxuICBpZiAodkxhYmVsLmxpbSA+IHdMYWJlbC5saW0pIHtcbiAgICB0YWlsTGFiZWwgPSB3TGFiZWw7XG4gICAgZmxpcCA9IHRydWU7XG4gIH1cblxuICB2YXIgY2FuZGlkYXRlcyA9IF8uZmlsdGVyKGcuZWRnZXMoKSwgZnVuY3Rpb24oZWRnZSkge1xuICAgIHJldHVybiBmbGlwID09PSBpc0Rlc2NlbmRhbnQodCwgdC5ub2RlKGVkZ2UudiksIHRhaWxMYWJlbCkgJiZcbiAgICAgICAgICAgZmxpcCAhPT0gaXNEZXNjZW5kYW50KHQsIHQubm9kZShlZGdlLncpLCB0YWlsTGFiZWwpO1xuICB9KTtcblxuICByZXR1cm4gXy5taW5CeShjYW5kaWRhdGVzLCBmdW5jdGlvbihlZGdlKSB7IHJldHVybiBzbGFjayhnLCBlZGdlKTsgfSk7XG59XG5cbmZ1bmN0aW9uIGV4Y2hhbmdlRWRnZXModCwgZywgZSwgZikge1xuICB2YXIgdiA9IGUudjtcbiAgdmFyIHcgPSBlLnc7XG4gIHQucmVtb3ZlRWRnZSh2LCB3KTtcbiAgdC5zZXRFZGdlKGYudiwgZi53LCB7fSk7XG4gIGluaXRMb3dMaW1WYWx1ZXModCk7XG4gIGluaXRDdXRWYWx1ZXModCwgZyk7XG4gIHVwZGF0ZVJhbmtzKHQsIGcpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVSYW5rcyh0LCBnKSB7XG4gIHZhciByb290ID0gXy5maW5kKHQubm9kZXMoKSwgZnVuY3Rpb24odikgeyByZXR1cm4gIWcubm9kZSh2KS5wYXJlbnQ7IH0pO1xuICB2YXIgdnMgPSBwcmVvcmRlcih0LCByb290KTtcbiAgdnMgPSB2cy5zbGljZSgxKTtcbiAgXy5mb3JFYWNoKHZzLCBmdW5jdGlvbih2KSB7XG4gICAgdmFyIHBhcmVudCA9IHQubm9kZSh2KS5wYXJlbnQsXG4gICAgICBlZGdlID0gZy5lZGdlKHYsIHBhcmVudCksXG4gICAgICBmbGlwcGVkID0gZmFsc2U7XG5cbiAgICBpZiAoIWVkZ2UpIHtcbiAgICAgIGVkZ2UgPSBnLmVkZ2UocGFyZW50LCB2KTtcbiAgICAgIGZsaXBwZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGcubm9kZSh2KS5yYW5rID0gZy5ub2RlKHBhcmVudCkucmFuayArIChmbGlwcGVkID8gZWRnZS5taW5sZW4gOiAtZWRnZS5taW5sZW4pO1xuICB9KTtcbn1cblxuLypcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZWRnZSBpcyBpbiB0aGUgdHJlZS5cbiAqL1xuZnVuY3Rpb24gaXNUcmVlRWRnZSh0cmVlLCB1LCB2KSB7XG4gIHJldHVybiB0cmVlLmhhc0VkZ2UodSwgdik7XG59XG5cbi8qXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNwZWNpZmllZCBub2RlIGlzIGRlc2NlbmRhbnQgb2YgdGhlIHJvb3Qgbm9kZSBwZXIgdGhlXG4gKiBhc3NpZ25lZCBsb3cgYW5kIGxpbSBhdHRyaWJ1dGVzIGluIHRoZSB0cmVlLlxuICovXG5mdW5jdGlvbiBpc0Rlc2NlbmRhbnQodHJlZSwgdkxhYmVsLCByb290TGFiZWwpIHtcbiAgcmV0dXJuIHJvb3RMYWJlbC5sb3cgPD0gdkxhYmVsLmxpbSAmJiB2TGFiZWwubGltIDw9IHJvb3RMYWJlbC5saW07XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF8gPSByZXF1aXJlKFwiLi4vbG9kYXNoXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbG9uZ2VzdFBhdGg6IGxvbmdlc3RQYXRoLFxuICBzbGFjazogc2xhY2tcbn07XG5cbi8qXG4gKiBJbml0aWFsaXplcyByYW5rcyBmb3IgdGhlIGlucHV0IGdyYXBoIHVzaW5nIHRoZSBsb25nZXN0IHBhdGggYWxnb3JpdGhtLiBUaGlzXG4gKiBhbGdvcml0aG0gc2NhbGVzIHdlbGwgYW5kIGlzIGZhc3QgaW4gcHJhY3RpY2UsIGl0IHlpZWxkcyByYXRoZXIgcG9vclxuICogc29sdXRpb25zLiBOb2RlcyBhcmUgcHVzaGVkIHRvIHRoZSBsb3dlc3QgbGF5ZXIgcG9zc2libGUsIGxlYXZpbmcgdGhlIGJvdHRvbVxuICogcmFua3Mgd2lkZSBhbmQgbGVhdmluZyBlZGdlcyBsb25nZXIgdGhhbiBuZWNlc3NhcnkuIEhvd2V2ZXIsIGR1ZSB0byBpdHNcbiAqIHNwZWVkLCB0aGlzIGFsZ29yaXRobSBpcyBnb29kIGZvciBnZXR0aW5nIGFuIGluaXRpYWwgcmFua2luZyB0aGF0IGNhbiBiZSBmZWRcbiAqIGludG8gb3RoZXIgYWxnb3JpdGhtcy5cbiAqXG4gKiBUaGlzIGFsZ29yaXRobSBkb2VzIG5vdCBub3JtYWxpemUgbGF5ZXJzIGJlY2F1c2UgaXQgd2lsbCBiZSB1c2VkIGJ5IG90aGVyXG4gKiBhbGdvcml0aG1zIGluIG1vc3QgY2FzZXMuIElmIHVzaW5nIHRoaXMgYWxnb3JpdGhtIGRpcmVjdGx5LCBiZSBzdXJlIHRvXG4gKiBydW4gbm9ybWFsaXplIGF0IHRoZSBlbmQuXG4gKlxuICogUHJlLWNvbmRpdGlvbnM6XG4gKlxuICogICAgMS4gSW5wdXQgZ3JhcGggaXMgYSBEQUcuXG4gKiAgICAyLiBJbnB1dCBncmFwaCBub2RlIGxhYmVscyBjYW4gYmUgYXNzaWduZWQgcHJvcGVydGllcy5cbiAqXG4gKiBQb3N0LWNvbmRpdGlvbnM6XG4gKlxuICogICAgMS4gRWFjaCBub2RlIHdpbGwgYmUgYXNzaWduIGFuICh1bm5vcm1hbGl6ZWQpIFwicmFua1wiIHByb3BlcnR5LlxuICovXG5mdW5jdGlvbiBsb25nZXN0UGF0aChnKSB7XG4gIHZhciB2aXNpdGVkID0ge307XG5cbiAgZnVuY3Rpb24gZGZzKHYpIHtcbiAgICB2YXIgbGFiZWwgPSBnLm5vZGUodik7XG4gICAgaWYgKF8uaGFzKHZpc2l0ZWQsIHYpKSB7XG4gICAgICByZXR1cm4gbGFiZWwucmFuaztcbiAgICB9XG4gICAgdmlzaXRlZFt2XSA9IHRydWU7XG5cbiAgICB2YXIgcmFuayA9IF8ubWluKF8ubWFwKGcub3V0RWRnZXModiksIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBkZnMoZS53KSAtIGcuZWRnZShlKS5taW5sZW47XG4gICAgfSkpO1xuXG4gICAgaWYgKHJhbmsgPT09IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSB8fCAvLyByZXR1cm4gdmFsdWUgb2YgXy5tYXAoW10pIGZvciBMb2Rhc2ggM1xuICAgICAgICByYW5rID09PSB1bmRlZmluZWQgfHwgLy8gcmV0dXJuIHZhbHVlIG9mIF8ubWFwKFtdKSBmb3IgTG9kYXNoIDRcbiAgICAgICAgcmFuayA9PT0gbnVsbCkgeyAvLyByZXR1cm4gdmFsdWUgb2YgXy5tYXAoW251bGxdKVxuICAgICAgcmFuayA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIChsYWJlbC5yYW5rID0gcmFuayk7XG4gIH1cblxuICBfLmZvckVhY2goZy5zb3VyY2VzKCksIGRmcyk7XG59XG5cbi8qXG4gKiBSZXR1cm5zIHRoZSBhbW91bnQgb2Ygc2xhY2sgZm9yIHRoZSBnaXZlbiBlZGdlLiBUaGUgc2xhY2sgaXMgZGVmaW5lZCBhcyB0aGVcbiAqIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgbGVuZ3RoIG9mIHRoZSBlZGdlIGFuZCBpdHMgbWluaW11bSBsZW5ndGguXG4gKi9cbmZ1bmN0aW9uIHNsYWNrKGcsIGUpIHtcbiAgcmV0dXJuIGcubm9kZShlLncpLnJhbmsgLSBnLm5vZGUoZS52KS5yYW5rIC0gZy5lZGdlKGUpLm1pbmxlbjtcbn1cbiIsIi8qIGVzbGludCBcIm5vLWNvbnNvbGVcIjogb2ZmICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgXyA9IHJlcXVpcmUoXCIuL2xvZGFzaFwiKTtcbnZhciBHcmFwaCA9IHJlcXVpcmUoXCIuL2dyYXBobGliXCIpLkdyYXBoO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkRHVtbXlOb2RlOiBhZGREdW1teU5vZGUsXG4gIHNpbXBsaWZ5OiBzaW1wbGlmeSxcbiAgYXNOb25Db21wb3VuZEdyYXBoOiBhc05vbkNvbXBvdW5kR3JhcGgsXG4gIHN1Y2Nlc3NvcldlaWdodHM6IHN1Y2Nlc3NvcldlaWdodHMsXG4gIHByZWRlY2Vzc29yV2VpZ2h0czogcHJlZGVjZXNzb3JXZWlnaHRzLFxuICBpbnRlcnNlY3RSZWN0OiBpbnRlcnNlY3RSZWN0LFxuICBidWlsZExheWVyTWF0cml4OiBidWlsZExheWVyTWF0cml4LFxuICBub3JtYWxpemVSYW5rczogbm9ybWFsaXplUmFua3MsXG4gIHJlbW92ZUVtcHR5UmFua3M6IHJlbW92ZUVtcHR5UmFua3MsXG4gIGFkZEJvcmRlck5vZGU6IGFkZEJvcmRlck5vZGUsXG4gIG1heFJhbms6IG1heFJhbmssXG4gIHBhcnRpdGlvbjogcGFydGl0aW9uLFxuICB0aW1lOiB0aW1lLFxuICBub3RpbWU6IG5vdGltZVxufTtcblxuLypcbiAqIEFkZHMgYSBkdW1teSBub2RlIHRvIHRoZSBncmFwaCBhbmQgcmV0dXJuIHYuXG4gKi9cbmZ1bmN0aW9uIGFkZER1bW15Tm9kZShnLCB0eXBlLCBhdHRycywgbmFtZSkge1xuICB2YXIgdjtcbiAgZG8ge1xuICAgIHYgPSBfLnVuaXF1ZUlkKG5hbWUpO1xuICB9IHdoaWxlIChnLmhhc05vZGUodikpO1xuXG4gIGF0dHJzLmR1bW15ID0gdHlwZTtcbiAgZy5zZXROb2RlKHYsIGF0dHJzKTtcbiAgcmV0dXJuIHY7XG59XG5cbi8qXG4gKiBSZXR1cm5zIGEgbmV3IGdyYXBoIHdpdGggb25seSBzaW1wbGUgZWRnZXMuIEhhbmRsZXMgYWdncmVnYXRpb24gb2YgZGF0YVxuICogYXNzb2NpYXRlZCB3aXRoIG11bHRpLWVkZ2VzLlxuICovXG5mdW5jdGlvbiBzaW1wbGlmeShnKSB7XG4gIHZhciBzaW1wbGlmaWVkID0gbmV3IEdyYXBoKCkuc2V0R3JhcGgoZy5ncmFwaCgpKTtcbiAgXy5mb3JFYWNoKGcubm9kZXMoKSwgZnVuY3Rpb24odikgeyBzaW1wbGlmaWVkLnNldE5vZGUodiwgZy5ub2RlKHYpKTsgfSk7XG4gIF8uZm9yRWFjaChnLmVkZ2VzKCksIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgc2ltcGxlTGFiZWwgPSBzaW1wbGlmaWVkLmVkZ2UoZS52LCBlLncpIHx8IHsgd2VpZ2h0OiAwLCBtaW5sZW46IDEgfTtcbiAgICB2YXIgbGFiZWwgPSBnLmVkZ2UoZSk7XG4gICAgc2ltcGxpZmllZC5zZXRFZGdlKGUudiwgZS53LCB7XG4gICAgICB3ZWlnaHQ6IHNpbXBsZUxhYmVsLndlaWdodCArIGxhYmVsLndlaWdodCxcbiAgICAgIG1pbmxlbjogTWF0aC5tYXgoc2ltcGxlTGFiZWwubWlubGVuLCBsYWJlbC5taW5sZW4pXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gc2ltcGxpZmllZDtcbn1cblxuZnVuY3Rpb24gYXNOb25Db21wb3VuZEdyYXBoKGcpIHtcbiAgdmFyIHNpbXBsaWZpZWQgPSBuZXcgR3JhcGgoeyBtdWx0aWdyYXBoOiBnLmlzTXVsdGlncmFwaCgpIH0pLnNldEdyYXBoKGcuZ3JhcGgoKSk7XG4gIF8uZm9yRWFjaChnLm5vZGVzKCksIGZ1bmN0aW9uKHYpIHtcbiAgICBpZiAoIWcuY2hpbGRyZW4odikubGVuZ3RoKSB7XG4gICAgICBzaW1wbGlmaWVkLnNldE5vZGUodiwgZy5ub2RlKHYpKTtcbiAgICB9XG4gIH0pO1xuICBfLmZvckVhY2goZy5lZGdlcygpLCBmdW5jdGlvbihlKSB7XG4gICAgc2ltcGxpZmllZC5zZXRFZGdlKGUsIGcuZWRnZShlKSk7XG4gIH0pO1xuICByZXR1cm4gc2ltcGxpZmllZDtcbn1cblxuZnVuY3Rpb24gc3VjY2Vzc29yV2VpZ2h0cyhnKSB7XG4gIHZhciB3ZWlnaHRNYXAgPSBfLm1hcChnLm5vZGVzKCksIGZ1bmN0aW9uKHYpIHtcbiAgICB2YXIgc3VjcyA9IHt9O1xuICAgIF8uZm9yRWFjaChnLm91dEVkZ2VzKHYpLCBmdW5jdGlvbihlKSB7XG4gICAgICBzdWNzW2Uud10gPSAoc3Vjc1tlLnddIHx8IDApICsgZy5lZGdlKGUpLndlaWdodDtcbiAgICB9KTtcbiAgICByZXR1cm4gc3VjcztcbiAgfSk7XG4gIHJldHVybiBfLnppcE9iamVjdChnLm5vZGVzKCksIHdlaWdodE1hcCk7XG59XG5cbmZ1bmN0aW9uIHByZWRlY2Vzc29yV2VpZ2h0cyhnKSB7XG4gIHZhciB3ZWlnaHRNYXAgPSBfLm1hcChnLm5vZGVzKCksIGZ1bmN0aW9uKHYpIHtcbiAgICB2YXIgcHJlZHMgPSB7fTtcbiAgICBfLmZvckVhY2goZy5pbkVkZ2VzKHYpLCBmdW5jdGlvbihlKSB7XG4gICAgICBwcmVkc1tlLnZdID0gKHByZWRzW2Uudl0gfHwgMCkgKyBnLmVkZ2UoZSkud2VpZ2h0O1xuICAgIH0pO1xuICAgIHJldHVybiBwcmVkcztcbiAgfSk7XG4gIHJldHVybiBfLnppcE9iamVjdChnLm5vZGVzKCksIHdlaWdodE1hcCk7XG59XG5cbi8qXG4gKiBGaW5kcyB3aGVyZSBhIGxpbmUgc3RhcnRpbmcgYXQgcG9pbnQgKHt4LCB5fSkgd291bGQgaW50ZXJzZWN0IGEgcmVjdGFuZ2xlXG4gKiAoe3gsIHksIHdpZHRoLCBoZWlnaHR9KSBpZiBpdCB3ZXJlIHBvaW50aW5nIGF0IHRoZSByZWN0YW5nbGUncyBjZW50ZXIuXG4gKi9cbmZ1bmN0aW9uIGludGVyc2VjdFJlY3QocmVjdCwgcG9pbnQpIHtcbiAgdmFyIHggPSByZWN0Lng7XG4gIHZhciB5ID0gcmVjdC55O1xuXG4gIC8vIFJlY3RhbmdsZSBpbnRlcnNlY3Rpb24gYWxnb3JpdGhtIGZyb206XG4gIC8vIGh0dHA6Ly9tYXRoLnN0YWNrZXhjaGFuZ2UuY29tL3F1ZXN0aW9ucy8xMDgxMTMvZmluZC1lZGdlLWJldHdlZW4tdHdvLWJveGVzXG4gIHZhciBkeCA9IHBvaW50LnggLSB4O1xuICB2YXIgZHkgPSBwb2ludC55IC0geTtcbiAgdmFyIHcgPSByZWN0LndpZHRoIC8gMjtcbiAgdmFyIGggPSByZWN0LmhlaWdodCAvIDI7XG5cbiAgaWYgKCFkeCAmJiAhZHkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgcG9zc2libGUgdG8gZmluZCBpbnRlcnNlY3Rpb24gaW5zaWRlIG9mIHRoZSByZWN0YW5nbGVcIik7XG4gIH1cblxuICB2YXIgc3gsIHN5O1xuICBpZiAoTWF0aC5hYnMoZHkpICogdyA+IE1hdGguYWJzKGR4KSAqIGgpIHtcbiAgICAvLyBJbnRlcnNlY3Rpb24gaXMgdG9wIG9yIGJvdHRvbSBvZiByZWN0LlxuICAgIGlmIChkeSA8IDApIHtcbiAgICAgIGggPSAtaDtcbiAgICB9XG4gICAgc3ggPSBoICogZHggLyBkeTtcbiAgICBzeSA9IGg7XG4gIH0gZWxzZSB7XG4gICAgLy8gSW50ZXJzZWN0aW9uIGlzIGxlZnQgb3IgcmlnaHQgb2YgcmVjdC5cbiAgICBpZiAoZHggPCAwKSB7XG4gICAgICB3ID0gLXc7XG4gICAgfVxuICAgIHN4ID0gdztcbiAgICBzeSA9IHcgKiBkeSAvIGR4O1xuICB9XG5cbiAgcmV0dXJuIHsgeDogeCArIHN4LCB5OiB5ICsgc3kgfTtcbn1cblxuLypcbiAqIEdpdmVuIGEgREFHIHdpdGggZWFjaCBub2RlIGFzc2lnbmVkIFwicmFua1wiIGFuZCBcIm9yZGVyXCIgcHJvcGVydGllcywgdGhpc1xuICogZnVuY3Rpb24gd2lsbCBwcm9kdWNlIGEgbWF0cml4IHdpdGggdGhlIGlkcyBvZiBlYWNoIG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkTGF5ZXJNYXRyaXgoZykge1xuICB2YXIgbGF5ZXJpbmcgPSBfLm1hcChfLnJhbmdlKG1heFJhbmsoZykgKyAxKSwgZnVuY3Rpb24oKSB7IHJldHVybiBbXTsgfSk7XG4gIF8uZm9yRWFjaChnLm5vZGVzKCksIGZ1bmN0aW9uKHYpIHtcbiAgICB2YXIgbm9kZSA9IGcubm9kZSh2KTtcbiAgICB2YXIgcmFuayA9IG5vZGUucmFuaztcbiAgICBpZiAoIV8uaXNVbmRlZmluZWQocmFuaykpIHtcbiAgICAgIGxheWVyaW5nW3JhbmtdW25vZGUub3JkZXJdID0gdjtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGF5ZXJpbmc7XG59XG5cbi8qXG4gKiBBZGp1c3RzIHRoZSByYW5rcyBmb3IgYWxsIG5vZGVzIGluIHRoZSBncmFwaCBzdWNoIHRoYXQgYWxsIG5vZGVzIHYgaGF2ZVxuICogcmFuayh2KSA+PSAwIGFuZCBhdCBsZWFzdCBvbmUgbm9kZSB3IGhhcyByYW5rKHcpID0gMC5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplUmFua3MoZykge1xuICB2YXIgbWluID0gXy5taW4oXy5tYXAoZy5ub2RlcygpLCBmdW5jdGlvbih2KSB7IHJldHVybiBnLm5vZGUodikucmFuazsgfSkpO1xuICBfLmZvckVhY2goZy5ub2RlcygpLCBmdW5jdGlvbih2KSB7XG4gICAgdmFyIG5vZGUgPSBnLm5vZGUodik7XG4gICAgaWYgKF8uaGFzKG5vZGUsIFwicmFua1wiKSkge1xuICAgICAgbm9kZS5yYW5rIC09IG1pbjtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFbXB0eVJhbmtzKGcpIHtcbiAgLy8gUmFua3MgbWF5IG5vdCBzdGFydCBhdCAwLCBzbyB3ZSBuZWVkIHRvIG9mZnNldCB0aGVtXG4gIHZhciBvZmZzZXQgPSBfLm1pbihfLm1hcChnLm5vZGVzKCksIGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGcubm9kZSh2KS5yYW5rOyB9KSk7XG5cbiAgdmFyIGxheWVycyA9IFtdO1xuICBfLmZvckVhY2goZy5ub2RlcygpLCBmdW5jdGlvbih2KSB7XG4gICAgdmFyIHJhbmsgPSBnLm5vZGUodikucmFuayAtIG9mZnNldDtcbiAgICBpZiAoIWxheWVyc1tyYW5rXSkge1xuICAgICAgbGF5ZXJzW3JhbmtdID0gW107XG4gICAgfVxuICAgIGxheWVyc1tyYW5rXS5wdXNoKHYpO1xuICB9KTtcblxuICB2YXIgZGVsdGEgPSAwO1xuICB2YXIgbm9kZVJhbmtGYWN0b3IgPSBnLmdyYXBoKCkubm9kZVJhbmtGYWN0b3I7XG4gIF8uZm9yRWFjaChsYXllcnMsIGZ1bmN0aW9uKHZzLCBpKSB7XG4gICAgaWYgKF8uaXNVbmRlZmluZWQodnMpICYmIGkgJSBub2RlUmFua0ZhY3RvciAhPT0gMCkge1xuICAgICAgLS1kZWx0YTtcbiAgICB9IGVsc2UgaWYgKGRlbHRhKSB7XG4gICAgICBfLmZvckVhY2godnMsIGZ1bmN0aW9uKHYpIHsgZy5ub2RlKHYpLnJhbmsgKz0gZGVsdGE7IH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZEJvcmRlck5vZGUoZywgcHJlZml4LCByYW5rLCBvcmRlcikge1xuICB2YXIgbm9kZSA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDBcbiAgfTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkge1xuICAgIG5vZGUucmFuayA9IHJhbms7XG4gICAgbm9kZS5vcmRlciA9IG9yZGVyO1xuICB9XG4gIHJldHVybiBhZGREdW1teU5vZGUoZywgXCJib3JkZXJcIiwgbm9kZSwgcHJlZml4KTtcbn1cblxuZnVuY3Rpb24gbWF4UmFuayhnKSB7XG4gIHJldHVybiBfLm1heChfLm1hcChnLm5vZGVzKCksIGZ1bmN0aW9uKHYpIHtcbiAgICB2YXIgcmFuayA9IGcubm9kZSh2KS5yYW5rO1xuICAgIGlmICghXy5pc1VuZGVmaW5lZChyYW5rKSkge1xuICAgICAgcmV0dXJuIHJhbms7XG4gICAgfVxuICB9KSk7XG59XG5cbi8qXG4gKiBQYXJ0aXRpb24gYSBjb2xsZWN0aW9uIGludG8gdHdvIGdyb3VwczogYGxoc2AgYW5kIGByaHNgLiBJZiB0aGUgc3VwcGxpZWRcbiAqIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSBmb3IgYW4gZW50cnkgaXQgZ29lcyBpbnRvIGBsaHNgLiBPdGhlcndpc2UgaXQgZ29lc1xuICogaW50byBgcmhzLlxuICovXG5mdW5jdGlvbiBwYXJ0aXRpb24oY29sbGVjdGlvbiwgZm4pIHtcbiAgdmFyIHJlc3VsdCA9IHsgbGhzOiBbXSwgcmhzOiBbXSB9O1xuICBfLmZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAoZm4odmFsdWUpKSB7XG4gICAgICByZXN1bHQubGhzLnB1c2godmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucmhzLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qXG4gKiBSZXR1cm5zIGEgbmV3IGZ1bmN0aW9uIHRoYXQgd3JhcHMgYGZuYCB3aXRoIGEgdGltZXIuIFRoZSB3cmFwcGVyIGxvZ3MgdGhlXG4gKiB0aW1lIGl0IHRha2VzIHRvIGV4ZWN1dGUgdGhlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiB0aW1lKG5hbWUsIGZuKSB7XG4gIHZhciBzdGFydCA9IF8ubm93KCk7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZuKCk7XG4gIH0gZmluYWxseSB7XG4gICAgY29uc29sZS5sb2cobmFtZSArIFwiIHRpbWU6IFwiICsgKF8ubm93KCkgLSBzdGFydCkgKyBcIm1zXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG5vdGltZShuYW1lLCBmbikge1xuICByZXR1cm4gZm4oKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gXCIwLjguNVwiO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIENocmlzIFBldHRpdHRcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gKiBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAqXG4gKiAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXNcbiAqIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICpcbiAqIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb25cbiAqIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICpcbiAqIDMuIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGNvcHlyaWdodCBob2xkZXIgbm9yIHRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzXG4gKiBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dFxuICogc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORFxuICogQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRURcbiAqIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkVcbiAqIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEVcbiAqIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMXG4gKiBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUlxuICogU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVJcbiAqIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksXG4gKiBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRVxuICogT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuXG52YXIgbGliID0gcmVxdWlyZShcIi4vbGliXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgR3JhcGg6IGxpYi5HcmFwaCxcbiAganNvbjogcmVxdWlyZShcIi4vbGliL2pzb25cIiksXG4gIGFsZzogcmVxdWlyZShcIi4vbGliL2FsZ1wiKSxcbiAgdmVyc2lvbjogbGliLnZlcnNpb25cbn07XG4iLCJ2YXIgXyA9IHJlcXVpcmUoXCIuLi9sb2Rhc2hcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcG9uZW50cztcblxuZnVuY3Rpb24gY29tcG9uZW50cyhnKSB7XG4gIHZhciB2aXNpdGVkID0ge307XG4gIHZhciBjbXB0cyA9IFtdO1xuICB2YXIgY21wdDtcblxuICBmdW5jdGlvbiBkZnModikge1xuICAgIGlmIChfLmhhcyh2aXNpdGVkLCB2KSkgcmV0dXJuO1xuICAgIHZpc2l0ZWRbdl0gPSB0cnVlO1xuICAgIGNtcHQucHVzaCh2KTtcbiAgICBfLmVhY2goZy5zdWNjZXNzb3JzKHYpLCBkZnMpO1xuICAgIF8uZWFjaChnLnByZWRlY2Vzc29ycyh2KSwgZGZzKTtcbiAgfVxuXG4gIF8uZWFjaChnLm5vZGVzKCksIGZ1bmN0aW9uKHYpIHtcbiAgICBjbXB0ID0gW107XG4gICAgZGZzKHYpO1xuICAgIGlmIChjbXB0Lmxlbmd0aCkge1xuICAgICAgY21wdHMucHVzaChjbXB0KTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBjbXB0cztcbn1cbiIsInZhciBfID0gcmVxdWlyZShcIi4uL2xvZGFzaFwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZnM7XG5cbi8qXG4gKiBBIGhlbHBlciB0aGF0IHByZWZvcm1zIGEgcHJlLSBvciBwb3N0LW9yZGVyIHRyYXZlcnNhbCBvbiB0aGUgaW5wdXQgZ3JhcGhcbiAqIGFuZCByZXR1cm5zIHRoZSBub2RlcyBpbiB0aGUgb3JkZXIgdGhleSB3ZXJlIHZpc2l0ZWQuIElmIHRoZSBncmFwaCBpc1xuICogdW5kaXJlY3RlZCB0aGVuIHRoaXMgYWxnb3JpdGhtIHdpbGwgbmF2aWdhdGUgdXNpbmcgbmVpZ2hib3JzLiBJZiB0aGUgZ3JhcGhcbiAqIGlzIGRpcmVjdGVkIHRoZW4gdGhpcyBhbGdvcml0aG0gd2lsbCBuYXZpZ2F0ZSB1c2luZyBzdWNjZXNzb3JzLlxuICpcbiAqIE9yZGVyIG11c3QgYmUgb25lIG9mIFwicHJlXCIgb3IgXCJwb3N0XCIuXG4gKi9cbmZ1bmN0aW9uIGRmcyhnLCB2cywgb3JkZXIpIHtcbiAgaWYgKCFfLmlzQXJyYXkodnMpKSB7XG4gICAgdnMgPSBbdnNdO1xuICB9XG5cbiAgdmFyIG5hdmlnYXRpb24gPSAoZy5pc0RpcmVjdGVkKCkgPyBnLnN1Y2Nlc3NvcnMgOiBnLm5laWdoYm9ycykuYmluZChnKTtcblxuICB2YXIgYWNjID0gW107XG4gIHZhciB2aXNpdGVkID0ge307XG4gIF8uZWFjaCh2cywgZnVuY3Rpb24odikge1xuICAgIGlmICghZy5oYXNOb2RlKHYpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHcmFwaCBkb2VzIG5vdCBoYXZlIG5vZGU6IFwiICsgdik7XG4gICAgfVxuXG4gICAgZG9EZnMoZywgdiwgb3JkZXIgPT09IFwicG9zdFwiLCB2aXNpdGVkLCBuYXZpZ2F0aW9uLCBhY2MpO1xuICB9KTtcbiAgcmV0dXJuIGFjYztcbn1cblxuZnVuY3Rpb24gZG9EZnMoZywgdiwgcG9zdG9yZGVyLCB2aXNpdGVkLCBuYXZpZ2F0aW9uLCBhY2MpIHtcbiAgaWYgKCFfLmhhcyh2aXNpdGVkLCB2KSkge1xuICAgIHZpc2l0ZWRbdl0gPSB0cnVlO1xuXG4gICAgaWYgKCFwb3N0b3JkZXIpIHsgYWNjLnB1c2godik7IH1cbiAgICBfLmVhY2gobmF2aWdhdGlvbih2KSwgZnVuY3Rpb24odykge1xuICAgICAgZG9EZnMoZywgdywgcG9zdG9yZGVyLCB2aXNpdGVkLCBuYXZpZ2F0aW9uLCBhY2MpO1xuICAgIH0pO1xuICAgIGlmIChwb3N0b3JkZXIpIHsgYWNjLnB1c2godik7IH1cbiAgfVxufVxuIiwidmFyIGRpamtzdHJhID0gcmVxdWlyZShcIi4vZGlqa3N0cmFcIik7XG52YXIgXyA9IHJlcXVpcmUoXCIuLi9sb2Rhc2hcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZGlqa3N0cmFBbGw7XG5cbmZ1bmN0aW9uIGRpamtzdHJhQWxsKGcsIHdlaWdodEZ1bmMsIGVkZ2VGdW5jKSB7XG4gIHJldHVybiBfLnRyYW5zZm9ybShnLm5vZGVzKCksIGZ1bmN0aW9uKGFjYywgdikge1xuICAgIGFjY1t2XSA9IGRpamtzdHJhKGcsIHYsIHdlaWdodEZ1bmMsIGVkZ2VGdW5jKTtcbiAgfSwge30pO1xufVxuIiwidmFyIF8gPSByZXF1aXJlKFwiLi4vbG9kYXNoXCIpO1xudmFyIFByaW9yaXR5UXVldWUgPSByZXF1aXJlKFwiLi4vZGF0YS9wcmlvcml0eS1xdWV1ZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkaWprc3RyYTtcblxudmFyIERFRkFVTFRfV0VJR0hUX0ZVTkMgPSBfLmNvbnN0YW50KDEpO1xuXG5mdW5jdGlvbiBkaWprc3RyYShnLCBzb3VyY2UsIHdlaWdodEZuLCBlZGdlRm4pIHtcbiAgcmV0dXJuIHJ1bkRpamtzdHJhKGcsIFN0cmluZyhzb3VyY2UpLFxuICAgIHdlaWdodEZuIHx8IERFRkFVTFRfV0VJR0hUX0ZVTkMsXG4gICAgZWRnZUZuIHx8IGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGcub3V0RWRnZXModik7IH0pO1xufVxuXG5mdW5jdGlvbiBydW5EaWprc3RyYShnLCBzb3VyY2UsIHdlaWdodEZuLCBlZGdlRm4pIHtcbiAgdmFyIHJlc3VsdHMgPSB7fTtcbiAgdmFyIHBxID0gbmV3IFByaW9yaXR5UXVldWUoKTtcbiAgdmFyIHYsIHZFbnRyeTtcblxuICB2YXIgdXBkYXRlTmVpZ2hib3JzID0gZnVuY3Rpb24oZWRnZSkge1xuICAgIHZhciB3ID0gZWRnZS52ICE9PSB2ID8gZWRnZS52IDogZWRnZS53O1xuICAgIHZhciB3RW50cnkgPSByZXN1bHRzW3ddO1xuICAgIHZhciB3ZWlnaHQgPSB3ZWlnaHRGbihlZGdlKTtcbiAgICB2YXIgZGlzdGFuY2UgPSB2RW50cnkuZGlzdGFuY2UgKyB3ZWlnaHQ7XG5cbiAgICBpZiAod2VpZ2h0IDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZGlqa3N0cmEgZG9lcyBub3QgYWxsb3cgbmVnYXRpdmUgZWRnZSB3ZWlnaHRzLiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgXCJCYWQgZWRnZTogXCIgKyBlZGdlICsgXCIgV2VpZ2h0OiBcIiArIHdlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKGRpc3RhbmNlIDwgd0VudHJ5LmRpc3RhbmNlKSB7XG4gICAgICB3RW50cnkuZGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICAgIHdFbnRyeS5wcmVkZWNlc3NvciA9IHY7XG4gICAgICBwcS5kZWNyZWFzZSh3LCBkaXN0YW5jZSk7XG4gICAgfVxuICB9O1xuXG4gIGcubm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICB2YXIgZGlzdGFuY2UgPSB2ID09PSBzb3VyY2UgPyAwIDogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIHJlc3VsdHNbdl0gPSB7IGRpc3RhbmNlOiBkaXN0YW5jZSB9O1xuICAgIHBxLmFkZCh2LCBkaXN0YW5jZSk7XG4gIH0pO1xuXG4gIHdoaWxlIChwcS5zaXplKCkgPiAwKSB7XG4gICAgdiA9IHBxLnJlbW92ZU1pbigpO1xuICAgIHZFbnRyeSA9IHJlc3VsdHNbdl07XG4gICAgaWYgKHZFbnRyeS5kaXN0YW5jZSA9PT0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBlZGdlRm4odikuZm9yRWFjaCh1cGRhdGVOZWlnaGJvcnMpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG4iLCJ2YXIgXyA9IHJlcXVpcmUoXCIuLi9sb2Rhc2hcIik7XG52YXIgdGFyamFuID0gcmVxdWlyZShcIi4vdGFyamFuXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRDeWNsZXM7XG5cbmZ1bmN0aW9uIGZpbmRDeWNsZXMoZykge1xuICByZXR1cm4gXy5maWx0ZXIodGFyamFuKGcpLCBmdW5jdGlvbihjbXB0KSB7XG4gICAgcmV0dXJuIGNtcHQubGVuZ3RoID4gMSB8fCAoY21wdC5sZW5ndGggPT09IDEgJiYgZy5oYXNFZGdlKGNtcHRbMF0sIGNtcHRbMF0pKTtcbiAgfSk7XG59XG4iLCJ2YXIgXyA9IHJlcXVpcmUoXCIuLi9sb2Rhc2hcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZmxveWRXYXJzaGFsbDtcblxudmFyIERFRkFVTFRfV0VJR0hUX0ZVTkMgPSBfLmNvbnN0YW50KDEpO1xuXG5mdW5jdGlvbiBmbG95ZFdhcnNoYWxsKGcsIHdlaWdodEZuLCBlZGdlRm4pIHtcbiAgcmV0dXJuIHJ1bkZsb3lkV2Fyc2hhbGwoZyxcbiAgICB3ZWlnaHRGbiB8fCBERUZBVUxUX1dFSUdIVF9GVU5DLFxuICAgIGVkZ2VGbiB8fCBmdW5jdGlvbih2KSB7IHJldHVybiBnLm91dEVkZ2VzKHYpOyB9KTtcbn1cblxuZnVuY3Rpb24gcnVuRmxveWRXYXJzaGFsbChnLCB3ZWlnaHRGbiwgZWRnZUZuKSB7XG4gIHZhciByZXN1bHRzID0ge307XG4gIHZhciBub2RlcyA9IGcubm9kZXMoKTtcblxuICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICByZXN1bHRzW3ZdID0ge307XG4gICAgcmVzdWx0c1t2XVt2XSA9IHsgZGlzdGFuY2U6IDAgfTtcbiAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKHcpIHtcbiAgICAgIGlmICh2ICE9PSB3KSB7XG4gICAgICAgIHJlc3VsdHNbdl1bd10gPSB7IGRpc3RhbmNlOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBlZGdlRm4odikuZm9yRWFjaChmdW5jdGlvbihlZGdlKSB7XG4gICAgICB2YXIgdyA9IGVkZ2UudiA9PT0gdiA/IGVkZ2UudyA6IGVkZ2UudjtcbiAgICAgIHZhciBkID0gd2VpZ2h0Rm4oZWRnZSk7XG4gICAgICByZXN1bHRzW3ZdW3ddID0geyBkaXN0YW5jZTogZCwgcHJlZGVjZXNzb3I6IHYgfTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgdmFyIHJvd0sgPSByZXN1bHRzW2tdO1xuICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgdmFyIHJvd0kgPSByZXN1bHRzW2ldO1xuICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihqKSB7XG4gICAgICAgIHZhciBpayA9IHJvd0lba107XG4gICAgICAgIHZhciBraiA9IHJvd0tbal07XG4gICAgICAgIHZhciBpaiA9IHJvd0lbal07XG4gICAgICAgIHZhciBhbHREaXN0YW5jZSA9IGlrLmRpc3RhbmNlICsga2ouZGlzdGFuY2U7XG4gICAgICAgIGlmIChhbHREaXN0YW5jZSA8IGlqLmRpc3RhbmNlKSB7XG4gICAgICAgICAgaWouZGlzdGFuY2UgPSBhbHREaXN0YW5jZTtcbiAgICAgICAgICBpai5wcmVkZWNlc3NvciA9IGtqLnByZWRlY2Vzc29yO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29tcG9uZW50czogcmVxdWlyZShcIi4vY29tcG9uZW50c1wiKSxcbiAgZGlqa3N0cmE6IHJlcXVpcmUoXCIuL2RpamtzdHJhXCIpLFxuICBkaWprc3RyYUFsbDogcmVxdWlyZShcIi4vZGlqa3N0cmEtYWxsXCIpLFxuICBmaW5kQ3ljbGVzOiByZXF1aXJlKFwiLi9maW5kLWN5Y2xlc1wiKSxcbiAgZmxveWRXYXJzaGFsbDogcmVxdWlyZShcIi4vZmxveWQtd2Fyc2hhbGxcIiksXG4gIGlzQWN5Y2xpYzogcmVxdWlyZShcIi4vaXMtYWN5Y2xpY1wiKSxcbiAgcG9zdG9yZGVyOiByZXF1aXJlKFwiLi9wb3N0b3JkZXJcIiksXG4gIHByZW9yZGVyOiByZXF1aXJlKFwiLi9wcmVvcmRlclwiKSxcbiAgcHJpbTogcmVxdWlyZShcIi4vcHJpbVwiKSxcbiAgdGFyamFuOiByZXF1aXJlKFwiLi90YXJqYW5cIiksXG4gIHRvcHNvcnQ6IHJlcXVpcmUoXCIuL3RvcHNvcnRcIilcbn07XG4iLCJ2YXIgdG9wc29ydCA9IHJlcXVpcmUoXCIuL3RvcHNvcnRcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBY3ljbGljO1xuXG5mdW5jdGlvbiBpc0FjeWNsaWMoZykge1xuICB0cnkge1xuICAgIHRvcHNvcnQoZyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIHRvcHNvcnQuQ3ljbGVFeGNlcHRpb24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhyb3cgZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbiIsInZhciBkZnMgPSByZXF1aXJlKFwiLi9kZnNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gcG9zdG9yZGVyO1xuXG5mdW5jdGlvbiBwb3N0b3JkZXIoZywgdnMpIHtcbiAgcmV0dXJuIGRmcyhnLCB2cywgXCJwb3N0XCIpO1xufVxuIiwidmFyIGRmcyA9IHJlcXVpcmUoXCIuL2Rmc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBwcmVvcmRlcjtcblxuZnVuY3Rpb24gcHJlb3JkZXIoZywgdnMpIHtcbiAgcmV0dXJuIGRmcyhnLCB2cywgXCJwcmVcIik7XG59XG4iLCJ2YXIgXyA9IHJlcXVpcmUoXCIuLi9sb2Rhc2hcIik7XG52YXIgR3JhcGggPSByZXF1aXJlKFwiLi4vZ3JhcGhcIik7XG52YXIgUHJpb3JpdHlRdWV1ZSA9IHJlcXVpcmUoXCIuLi9kYXRhL3ByaW9yaXR5LXF1ZXVlXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHByaW07XG5cbmZ1bmN0aW9uIHByaW0oZywgd2VpZ2h0RnVuYykge1xuICB2YXIgcmVzdWx0ID0gbmV3IEdyYXBoKCk7XG4gIHZhciBwYXJlbnRzID0ge307XG4gIHZhciBwcSA9IG5ldyBQcmlvcml0eVF1ZXVlKCk7XG4gIHZhciB2O1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZU5laWdoYm9ycyhlZGdlKSB7XG4gICAgdmFyIHcgPSBlZGdlLnYgPT09IHYgPyBlZGdlLncgOiBlZGdlLnY7XG4gICAgdmFyIHByaSA9IHBxLnByaW9yaXR5KHcpO1xuICAgIGlmIChwcmkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGVkZ2VXZWlnaHQgPSB3ZWlnaHRGdW5jKGVkZ2UpO1xuICAgICAgaWYgKGVkZ2VXZWlnaHQgPCBwcmkpIHtcbiAgICAgICAgcGFyZW50c1t3XSA9IHY7XG4gICAgICAgIHBxLmRlY3JlYXNlKHcsIGVkZ2VXZWlnaHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChnLm5vZGVDb3VudCgpID09PSAwKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIF8uZWFjaChnLm5vZGVzKCksIGZ1bmN0aW9uKHYpIHtcbiAgICBwcS5hZGQodiwgTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKTtcbiAgICByZXN1bHQuc2V0Tm9kZSh2KTtcbiAgfSk7XG5cbiAgLy8gU3RhcnQgZnJvbSBhbiBhcmJpdHJhcnkgbm9kZVxuICBwcS5kZWNyZWFzZShnLm5vZGVzKClbMF0sIDApO1xuXG4gIHZhciBpbml0ID0gZmFsc2U7XG4gIHdoaWxlIChwcS5zaXplKCkgPiAwKSB7XG4gICAgdiA9IHBxLnJlbW92ZU1pbigpO1xuICAgIGlmIChfLmhhcyhwYXJlbnRzLCB2KSkge1xuICAgICAgcmVzdWx0LnNldEVkZ2UodiwgcGFyZW50c1t2XSk7XG4gICAgfSBlbHNlIGlmIChpbml0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBncmFwaCBpcyBub3QgY29ubmVjdGVkOiBcIiArIGcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbml0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBnLm5vZGVFZGdlcyh2KS5mb3JFYWNoKHVwZGF0ZU5laWdoYm9ycyk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwidmFyIF8gPSByZXF1aXJlKFwiLi4vbG9kYXNoXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRhcmphbjtcblxuZnVuY3Rpb24gdGFyamFuKGcpIHtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIHN0YWNrID0gW107XG4gIHZhciB2aXNpdGVkID0ge307IC8vIG5vZGUgaWQgLT4geyBvblN0YWNrLCBsb3dsaW5rLCBpbmRleCB9XG4gIHZhciByZXN1bHRzID0gW107XG5cbiAgZnVuY3Rpb24gZGZzKHYpIHtcbiAgICB2YXIgZW50cnkgPSB2aXNpdGVkW3ZdID0ge1xuICAgICAgb25TdGFjazogdHJ1ZSxcbiAgICAgIGxvd2xpbms6IGluZGV4LFxuICAgICAgaW5kZXg6IGluZGV4KytcbiAgICB9O1xuICAgIHN0YWNrLnB1c2godik7XG5cbiAgICBnLnN1Y2Nlc3NvcnModikuZm9yRWFjaChmdW5jdGlvbih3KSB7XG4gICAgICBpZiAoIV8uaGFzKHZpc2l0ZWQsIHcpKSB7XG4gICAgICAgIGRmcyh3KTtcbiAgICAgICAgZW50cnkubG93bGluayA9IE1hdGgubWluKGVudHJ5Lmxvd2xpbmssIHZpc2l0ZWRbd10ubG93bGluayk7XG4gICAgICB9IGVsc2UgaWYgKHZpc2l0ZWRbd10ub25TdGFjaykge1xuICAgICAgICBlbnRyeS5sb3dsaW5rID0gTWF0aC5taW4oZW50cnkubG93bGluaywgdmlzaXRlZFt3XS5pbmRleCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoZW50cnkubG93bGluayA9PT0gZW50cnkuaW5kZXgpIHtcbiAgICAgIHZhciBjbXB0ID0gW107XG4gICAgICB2YXIgdztcbiAgICAgIGRvIHtcbiAgICAgICAgdyA9IHN0YWNrLnBvcCgpO1xuICAgICAgICB2aXNpdGVkW3ddLm9uU3RhY2sgPSBmYWxzZTtcbiAgICAgICAgY21wdC5wdXNoKHcpO1xuICAgICAgfSB3aGlsZSAodiAhPT0gdyk7XG4gICAgICByZXN1bHRzLnB1c2goY21wdCk7XG4gICAgfVxuICB9XG5cbiAgZy5ub2RlcygpLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgIGlmICghXy5oYXModmlzaXRlZCwgdikpIHtcbiAgICAgIGRmcyh2KTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHRzO1xufVxuIiwidmFyIF8gPSByZXF1aXJlKFwiLi4vbG9kYXNoXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvcHNvcnQ7XG50b3Bzb3J0LkN5Y2xlRXhjZXB0aW9uID0gQ3ljbGVFeGNlcHRpb247XG5cbmZ1bmN0aW9uIHRvcHNvcnQoZykge1xuICB2YXIgdmlzaXRlZCA9IHt9O1xuICB2YXIgc3RhY2sgPSB7fTtcbiAgdmFyIHJlc3VsdHMgPSBbXTtcblxuICBmdW5jdGlvbiB2aXNpdChub2RlKSB7XG4gICAgaWYgKF8uaGFzKHN0YWNrLCBub2RlKSkge1xuICAgICAgdGhyb3cgbmV3IEN5Y2xlRXhjZXB0aW9uKCk7XG4gICAgfVxuXG4gICAgaWYgKCFfLmhhcyh2aXNpdGVkLCBub2RlKSkge1xuICAgICAgc3RhY2tbbm9kZV0gPSB0cnVlO1xuICAgICAgdmlzaXRlZFtub2RlXSA9IHRydWU7XG4gICAgICBfLmVhY2goZy5wcmVkZWNlc3NvcnMobm9kZSksIHZpc2l0KTtcbiAgICAgIGRlbGV0ZSBzdGFja1tub2RlXTtcbiAgICAgIHJlc3VsdHMucHVzaChub2RlKTtcbiAgICB9XG4gIH1cblxuICBfLmVhY2goZy5zaW5rcygpLCB2aXNpdCk7XG5cbiAgaWYgKF8uc2l6ZSh2aXNpdGVkKSAhPT0gZy5ub2RlQ291bnQoKSkge1xuICAgIHRocm93IG5ldyBDeWNsZUV4Y2VwdGlvbigpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIEN5Y2xlRXhjZXB0aW9uKCkge31cbkN5Y2xlRXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpOyAvLyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIEVycm9yIHRvIHBhc3MgdGVzdGluZyIsInZhciBfID0gcmVxdWlyZShcIi4uL2xvZGFzaFwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmlvcml0eVF1ZXVlO1xuXG4vKipcbiAqIEEgbWluLXByaW9yaXR5IHF1ZXVlIGRhdGEgc3RydWN0dXJlLiBUaGlzIGFsZ29yaXRobSBpcyBkZXJpdmVkIGZyb20gQ29ybWVuLFxuICogZXQgYWwuLCBcIkludHJvZHVjdGlvbiB0byBBbGdvcml0aG1zXCIuIFRoZSBiYXNpYyBpZGVhIG9mIGEgbWluLXByaW9yaXR5XG4gKiBxdWV1ZSBpcyB0aGF0IHlvdSBjYW4gZWZmaWNpZW50bHkgKGluIE8oMSkgdGltZSkgZ2V0IHRoZSBzbWFsbGVzdCBrZXkgaW5cbiAqIHRoZSBxdWV1ZS4gQWRkaW5nIGFuZCByZW1vdmluZyBlbGVtZW50cyB0YWtlcyBPKGxvZyBuKSB0aW1lLiBBIGtleSBjYW5cbiAqIGhhdmUgaXRzIHByaW9yaXR5IGRlY3JlYXNlZCBpbiBPKGxvZyBuKSB0aW1lLlxuICovXG5mdW5jdGlvbiBQcmlvcml0eVF1ZXVlKCkge1xuICB0aGlzLl9hcnIgPSBbXTtcbiAgdGhpcy5fa2V5SW5kaWNlcyA9IHt9O1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgcXVldWUuIFRha2VzIGBPKDEpYCB0aW1lLlxuICovXG5Qcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9hcnIubGVuZ3RoO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBrZXlzIHRoYXQgYXJlIGluIHRoZSBxdWV1ZS4gVGFrZXMgYE8obilgIHRpbWUuXG4gKi9cblByaW9yaXR5UXVldWUucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX2Fyci5tYXAoZnVuY3Rpb24oeCkgeyByZXR1cm4geC5rZXk7IH0pO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiAqKmtleSoqIGlzIGluIHRoZSBxdWV1ZSBhbmQgYGZhbHNlYCBpZiBub3QuXG4gKi9cblByaW9yaXR5UXVldWUucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKGtleSkge1xuICByZXR1cm4gXy5oYXModGhpcy5fa2V5SW5kaWNlcywga2V5KTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcHJpb3JpdHkgZm9yICoqa2V5KiouIElmICoqa2V5KiogaXMgbm90IHByZXNlbnQgaW4gdGhlIHF1ZXVlXG4gKiB0aGVuIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBgdW5kZWZpbmVkYC4gVGFrZXMgYE8oMSlgIHRpbWUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGtleVxuICovXG5Qcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5wcmlvcml0eSA9IGZ1bmN0aW9uKGtleSkge1xuICB2YXIgaW5kZXggPSB0aGlzLl9rZXlJbmRpY2VzW2tleV07XG4gIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FycltpbmRleF0ucHJpb3JpdHk7XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUga2V5IGZvciB0aGUgbWluaW11bSBlbGVtZW50IGluIHRoaXMgcXVldWUuIElmIHRoZSBxdWV1ZSBpc1xuICogZW1wdHkgdGhpcyBmdW5jdGlvbiB0aHJvd3MgYW4gRXJyb3IuIFRha2VzIGBPKDEpYCB0aW1lLlxuICovXG5Qcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuc2l6ZSgpID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUXVldWUgdW5kZXJmbG93XCIpO1xuICB9XG4gIHJldHVybiB0aGlzLl9hcnJbMF0ua2V5O1xufTtcblxuLyoqXG4gKiBJbnNlcnRzIGEgbmV3IGtleSBpbnRvIHRoZSBwcmlvcml0eSBxdWV1ZS4gSWYgdGhlIGtleSBhbHJlYWR5IGV4aXN0cyBpblxuICogdGhlIHF1ZXVlIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBgZmFsc2VgOyBvdGhlcndpc2UgaXQgd2lsbCByZXR1cm4gYHRydWVgLlxuICogVGFrZXMgYE8obilgIHRpbWUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGtleSB0aGUga2V5IHRvIGFkZFxuICogQHBhcmFtIHtOdW1iZXJ9IHByaW9yaXR5IHRoZSBpbml0aWFsIHByaW9yaXR5IGZvciB0aGUga2V5XG4gKi9cblByaW9yaXR5UXVldWUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGtleSwgcHJpb3JpdHkpIHtcbiAgdmFyIGtleUluZGljZXMgPSB0aGlzLl9rZXlJbmRpY2VzO1xuICBrZXkgPSBTdHJpbmcoa2V5KTtcbiAgaWYgKCFfLmhhcyhrZXlJbmRpY2VzLCBrZXkpKSB7XG4gICAgdmFyIGFyciA9IHRoaXMuX2FycjtcbiAgICB2YXIgaW5kZXggPSBhcnIubGVuZ3RoO1xuICAgIGtleUluZGljZXNba2V5XSA9IGluZGV4O1xuICAgIGFyci5wdXNoKHtrZXk6IGtleSwgcHJpb3JpdHk6IHByaW9yaXR5fSk7XG4gICAgdGhpcy5fZGVjcmVhc2UoaW5kZXgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgc21hbGxlc3Qga2V5IGluIHRoZSBxdWV1ZS4gVGFrZXMgYE8obG9nIG4pYCB0aW1lLlxuICovXG5Qcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5yZW1vdmVNaW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc3dhcCgwLCB0aGlzLl9hcnIubGVuZ3RoIC0gMSk7XG4gIHZhciBtaW4gPSB0aGlzLl9hcnIucG9wKCk7XG4gIGRlbGV0ZSB0aGlzLl9rZXlJbmRpY2VzW21pbi5rZXldO1xuICB0aGlzLl9oZWFwaWZ5KDApO1xuICByZXR1cm4gbWluLmtleTtcbn07XG5cbi8qKlxuICogRGVjcmVhc2VzIHRoZSBwcmlvcml0eSBmb3IgKiprZXkqKiB0byAqKnByaW9yaXR5KiouIElmIHRoZSBuZXcgcHJpb3JpdHkgaXNcbiAqIGdyZWF0ZXIgdGhhbiB0aGUgcHJldmlvdXMgcHJpb3JpdHksIHRoaXMgZnVuY3Rpb24gd2lsbCB0aHJvdyBhbiBFcnJvci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0ga2V5IHRoZSBrZXkgZm9yIHdoaWNoIHRvIHJhaXNlIHByaW9yaXR5XG4gKiBAcGFyYW0ge051bWJlcn0gcHJpb3JpdHkgdGhlIG5ldyBwcmlvcml0eSBmb3IgdGhlIGtleVxuICovXG5Qcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5kZWNyZWFzZSA9IGZ1bmN0aW9uKGtleSwgcHJpb3JpdHkpIHtcbiAgdmFyIGluZGV4ID0gdGhpcy5fa2V5SW5kaWNlc1trZXldO1xuICBpZiAocHJpb3JpdHkgPiB0aGlzLl9hcnJbaW5kZXhdLnByaW9yaXR5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTmV3IHByaW9yaXR5IGlzIGdyZWF0ZXIgdGhhbiBjdXJyZW50IHByaW9yaXR5LiBcIiArXG4gICAgICAgIFwiS2V5OiBcIiArIGtleSArIFwiIE9sZDogXCIgKyB0aGlzLl9hcnJbaW5kZXhdLnByaW9yaXR5ICsgXCIgTmV3OiBcIiArIHByaW9yaXR5KTtcbiAgfVxuICB0aGlzLl9hcnJbaW5kZXhdLnByaW9yaXR5ID0gcHJpb3JpdHk7XG4gIHRoaXMuX2RlY3JlYXNlKGluZGV4KTtcbn07XG5cblByaW9yaXR5UXVldWUucHJvdG90eXBlLl9oZWFwaWZ5ID0gZnVuY3Rpb24oaSkge1xuICB2YXIgYXJyID0gdGhpcy5fYXJyO1xuICB2YXIgbCA9IDIgKiBpO1xuICB2YXIgciA9IGwgKyAxO1xuICB2YXIgbGFyZ2VzdCA9IGk7XG4gIGlmIChsIDwgYXJyLmxlbmd0aCkge1xuICAgIGxhcmdlc3QgPSBhcnJbbF0ucHJpb3JpdHkgPCBhcnJbbGFyZ2VzdF0ucHJpb3JpdHkgPyBsIDogbGFyZ2VzdDtcbiAgICBpZiAociA8IGFyci5sZW5ndGgpIHtcbiAgICAgIGxhcmdlc3QgPSBhcnJbcl0ucHJpb3JpdHkgPCBhcnJbbGFyZ2VzdF0ucHJpb3JpdHkgPyByIDogbGFyZ2VzdDtcbiAgICB9XG4gICAgaWYgKGxhcmdlc3QgIT09IGkpIHtcbiAgICAgIHRoaXMuX3N3YXAoaSwgbGFyZ2VzdCk7XG4gICAgICB0aGlzLl9oZWFwaWZ5KGxhcmdlc3QpO1xuICAgIH1cbiAgfVxufTtcblxuUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUuX2RlY3JlYXNlID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgdmFyIGFyciA9IHRoaXMuX2FycjtcbiAgdmFyIHByaW9yaXR5ID0gYXJyW2luZGV4XS5wcmlvcml0eTtcbiAgdmFyIHBhcmVudDtcbiAgd2hpbGUgKGluZGV4ICE9PSAwKSB7XG4gICAgcGFyZW50ID0gaW5kZXggPj4gMTtcbiAgICBpZiAoYXJyW3BhcmVudF0ucHJpb3JpdHkgPCBwcmlvcml0eSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMuX3N3YXAoaW5kZXgsIHBhcmVudCk7XG4gICAgaW5kZXggPSBwYXJlbnQ7XG4gIH1cbn07XG5cblByaW9yaXR5UXVldWUucHJvdG90eXBlLl9zd2FwID0gZnVuY3Rpb24oaSwgaikge1xuICB2YXIgYXJyID0gdGhpcy5fYXJyO1xuICB2YXIga2V5SW5kaWNlcyA9IHRoaXMuX2tleUluZGljZXM7XG4gIHZhciBvcmlnQXJySSA9IGFycltpXTtcbiAgdmFyIG9yaWdBcnJKID0gYXJyW2pdO1xuICBhcnJbaV0gPSBvcmlnQXJySjtcbiAgYXJyW2pdID0gb3JpZ0Fyckk7XG4gIGtleUluZGljZXNbb3JpZ0Fyckoua2V5XSA9IGk7XG4gIGtleUluZGljZXNbb3JpZ0Fyckkua2V5XSA9IGo7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfID0gcmVxdWlyZShcIi4vbG9kYXNoXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYXBoO1xuXG52YXIgREVGQVVMVF9FREdFX05BTUUgPSBcIlxceDAwXCI7XG52YXIgR1JBUEhfTk9ERSA9IFwiXFx4MDBcIjtcbnZhciBFREdFX0tFWV9ERUxJTSA9IFwiXFx4MDFcIjtcblxuLy8gSW1wbGVtZW50YXRpb24gbm90ZXM6XG4vL1xuLy8gICogTm9kZSBpZCBxdWVyeSBmdW5jdGlvbnMgc2hvdWxkIHJldHVybiBzdHJpbmcgaWRzIGZvciB0aGUgbm9kZXNcbi8vICAqIEVkZ2UgaWQgcXVlcnkgZnVuY3Rpb25zIHNob3VsZCByZXR1cm4gYW4gXCJlZGdlT2JqXCIsIGVkZ2Ugb2JqZWN0LCB0aGF0IGlzXG4vLyAgICBjb21wb3NlZCBvZiBlbm91Z2ggaW5mb3JtYXRpb24gdG8gdW5pcXVlbHkgaWRlbnRpZnkgYW4gZWRnZToge3YsIHcsIG5hbWV9LlxuLy8gICogSW50ZXJuYWxseSB3ZSB1c2UgYW4gXCJlZGdlSWRcIiwgYSBzdHJpbmdpZmllZCBmb3JtIG9mIHRoZSBlZGdlT2JqLCB0b1xuLy8gICAgcmVmZXJlbmNlIGVkZ2VzLiBUaGlzIGlzIGJlY2F1c2Ugd2UgbmVlZCBhIHBlcmZvcm1hbnQgd2F5IHRvIGxvb2sgdGhlc2Vcbi8vICAgIGVkZ2VzIHVwIGFuZCwgb2JqZWN0IHByb3BlcnRpZXMsIHdoaWNoIGhhdmUgc3RyaW5nIGtleXMsIGFyZSB0aGUgY2xvc2VzdFxuLy8gICAgd2UncmUgZ29pbmcgdG8gZ2V0IHRvIGEgcGVyZm9ybWFudCBoYXNodGFibGUgaW4gSmF2YVNjcmlwdC5cblxuZnVuY3Rpb24gR3JhcGgob3B0cykge1xuICB0aGlzLl9pc0RpcmVjdGVkID0gXy5oYXMob3B0cywgXCJkaXJlY3RlZFwiKSA/IG9wdHMuZGlyZWN0ZWQgOiB0cnVlO1xuICB0aGlzLl9pc011bHRpZ3JhcGggPSBfLmhhcyhvcHRzLCBcIm11bHRpZ3JhcGhcIikgPyBvcHRzLm11bHRpZ3JhcGggOiBmYWxzZTtcbiAgdGhpcy5faXNDb21wb3VuZCA9IF8uaGFzKG9wdHMsIFwiY29tcG91bmRcIikgPyBvcHRzLmNvbXBvdW5kIDogZmFsc2U7XG5cbiAgLy8gTGFiZWwgZm9yIHRoZSBncmFwaCBpdHNlbGZcbiAgdGhpcy5fbGFiZWwgPSB1bmRlZmluZWQ7XG5cbiAgLy8gRGVmYXVsdHMgdG8gYmUgc2V0IHdoZW4gY3JlYXRpbmcgYSBuZXcgbm9kZVxuICB0aGlzLl9kZWZhdWx0Tm9kZUxhYmVsRm4gPSBfLmNvbnN0YW50KHVuZGVmaW5lZCk7XG5cbiAgLy8gRGVmYXVsdHMgdG8gYmUgc2V0IHdoZW4gY3JlYXRpbmcgYSBuZXcgZWRnZVxuICB0aGlzLl9kZWZhdWx0RWRnZUxhYmVsRm4gPSBfLmNvbnN0YW50KHVuZGVmaW5lZCk7XG5cbiAgLy8gdiAtPiBsYWJlbFxuICB0aGlzLl9ub2RlcyA9IHt9O1xuXG4gIGlmICh0aGlzLl9pc0NvbXBvdW5kKSB7XG4gICAgLy8gdiAtPiBwYXJlbnRcbiAgICB0aGlzLl9wYXJlbnQgPSB7fTtcblxuICAgIC8vIHYgLT4gY2hpbGRyZW5cbiAgICB0aGlzLl9jaGlsZHJlbiA9IHt9O1xuICAgIHRoaXMuX2NoaWxkcmVuW0dSQVBIX05PREVdID0ge307XG4gIH1cblxuICAvLyB2IC0+IGVkZ2VPYmpcbiAgdGhpcy5faW4gPSB7fTtcblxuICAvLyB1IC0+IHYgLT4gTnVtYmVyXG4gIHRoaXMuX3ByZWRzID0ge307XG5cbiAgLy8gdiAtPiBlZGdlT2JqXG4gIHRoaXMuX291dCA9IHt9O1xuXG4gIC8vIHYgLT4gdyAtPiBOdW1iZXJcbiAgdGhpcy5fc3VjcyA9IHt9O1xuXG4gIC8vIGUgLT4gZWRnZU9ialxuICB0aGlzLl9lZGdlT2JqcyA9IHt9O1xuXG4gIC8vIGUgLT4gbGFiZWxcbiAgdGhpcy5fZWRnZUxhYmVscyA9IHt9O1xufVxuXG4vKiBOdW1iZXIgb2Ygbm9kZXMgaW4gdGhlIGdyYXBoLiBTaG91bGQgb25seSBiZSBjaGFuZ2VkIGJ5IHRoZSBpbXBsZW1lbnRhdGlvbi4gKi9cbkdyYXBoLnByb3RvdHlwZS5fbm9kZUNvdW50ID0gMDtcblxuLyogTnVtYmVyIG9mIGVkZ2VzIGluIHRoZSBncmFwaC4gU2hvdWxkIG9ubHkgYmUgY2hhbmdlZCBieSB0aGUgaW1wbGVtZW50YXRpb24uICovXG5HcmFwaC5wcm90b3R5cGUuX2VkZ2VDb3VudCA9IDA7XG5cblxuLyogPT09IEdyYXBoIGZ1bmN0aW9ucyA9PT09PT09PT0gKi9cblxuR3JhcGgucHJvdG90eXBlLmlzRGlyZWN0ZWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX2lzRGlyZWN0ZWQ7XG59O1xuXG5HcmFwaC5wcm90b3R5cGUuaXNNdWx0aWdyYXBoID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9pc011bHRpZ3JhcGg7XG59O1xuXG5HcmFwaC5wcm90b3R5cGUuaXNDb21wb3VuZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5faXNDb21wb3VuZDtcbn07XG5cbkdyYXBoLnByb3RvdHlwZS5zZXRHcmFwaCA9IGZ1bmN0aW9uKGxhYmVsKSB7XG4gIHRoaXMuX2xhYmVsID0gbGFiZWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuR3JhcGgucHJvdG90eXBlLmdyYXBoID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9sYWJlbDtcbn07XG5cblxuLyogPT09IE5vZGUgZnVuY3Rpb25zID09PT09PT09PT0gKi9cblxuR3JhcGgucHJvdG90eXBlLnNldERlZmF1bHROb2RlTGFiZWwgPSBmdW5jdGlvbihuZXdEZWZhdWx0KSB7XG4gIGlmICghXy5pc0Z1bmN0aW9uKG5ld0RlZmF1bHQpKSB7XG4gICAgbmV3RGVmYXVsdCA9IF8uY29uc3RhbnQobmV3RGVmYXVsdCk7XG4gIH1cbiAgdGhpcy5fZGVmYXVsdE5vZGVMYWJlbEZuID0gbmV3RGVmYXVsdDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5HcmFwaC5wcm90b3R5cGUubm9kZUNvdW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9ub2RlQ291bnQ7XG59O1xuXG5HcmFwaC5wcm90b3R5cGUubm9kZXMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIF8ua2V5cyh0aGlzLl9ub2Rlcyk7XG59O1xuXG5HcmFwaC5wcm90b3R5cGUuc291cmNlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHJldHVybiBfLmZpbHRlcih0aGlzLm5vZGVzKCksIGZ1bmN0aW9uKHYpIHtcbiAgICByZXR1cm4gXy5pc0VtcHR5KHNlbGYuX2luW3ZdKTtcbiAgfSk7XG59O1xuXG5HcmFwaC5wcm90b3R5cGUuc2lua3MgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICByZXR1cm4gXy5maWx0ZXIodGhpcy5ub2RlcygpLCBmdW5jdGlvbih2KSB7XG4gICAgcmV0dXJuIF8uaXNFbXB0eShzZWxmLl9vdXRbdl0pO1xuICB9KTtcbn07XG5cbkdyYXBoLnByb3RvdHlwZS5zZXROb2RlcyA9IGZ1bmN0aW9uKHZzLCB2YWx1ZSkge1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBfLmVhY2godnMsIGZ1bmN0aW9uKHYpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPiAxKSB7XG4gICAgICBzZWxmLnNldE5vZGUodiwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnNldE5vZGUodik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5HcmFwaC5wcm90b3R5cGUuc2V0Tm9kZSA9IGZ1bmN0aW9uKHYsIHZhbHVlKSB7XG4gIGlmIChfLmhhcyh0aGlzLl9ub2RlcywgdikpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRoaXMuX25vZGVzW3ZdID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdGhpcy5fbm9kZXNbdl0gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IHZhbHVlIDogdGhpcy5fZGVmYXVsdE5vZGVMYWJlbEZuKHYpO1xuICBpZiAodGhpcy5faXNDb21wb3VuZCkge1xuICAgIHRoaXMuX3BhcmVudFt2XSA9IEdSQVBIX05PREU7XG4gICAgdGhpcy5fY2hpbGRyZW5bdl0gPSB7fTtcbiAgICB0aGlzLl9jaGlsZHJlbltHUkFQSF9OT0RFXVt2XSA9IHRydWU7XG4gIH1cbiAgdGhpcy5faW5bdl0gPSB7fTtcbiAgdGhpcy5fcHJlZHNbdl0gPSB7fTtcbiAgdGhpcy5fb3V0W3ZdID0ge307XG4gIHRoaXMuX3N1Y3Nbdl0gPSB7fTtcbiAgKyt0aGlzLl9ub2RlQ291bnQ7XG4gIHJldHVybiB0aGlzO1xufTtcblxuR3JhcGgucHJvdG90eXBlLm5vZGUgPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiB0aGlzLl9ub2Rlc1t2XTtcbn07XG5cbkdyYXBoLnByb3RvdHlwZS5oYXNOb2RlID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gXy5oYXModGhpcy5fbm9kZXMsIHYpO1xufTtcblxuR3JhcGgucHJvdG90eXBlLnJlbW92ZU5vZGUgPSAgZnVuY3Rpb24odikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmIChfLmhhcyh0aGlzLl9ub2RlcywgdikpIHtcbiAgICB2YXIgcmVtb3ZlRWRnZSA9IGZ1bmN0aW9uKGUpIHsgc2VsZi5yZW1vdmVFZGdlKHNlbGYuX2VkZ2VPYmpzW2VdKTsgfTtcbiAgICBkZWxldGUgdGhpcy5fbm9kZXNbdl07XG4gICAgaWYgKHRoaXMuX2lzQ29tcG91bmQpIHtcbiAgICAgIHRoaXMuX3JlbW92ZUZyb21QYXJlbnRzQ2hpbGRMaXN0KHYpO1xuICAgICAgZGVsZXRlIHRoaXMuX3BhcmVudFt2XTtcbiAgICAgIF8uZWFjaCh0aGlzLmNoaWxkcmVuKHYpLCBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICBzZWxmLnNldFBhcmVudChjaGlsZCk7XG4gICAgICB9KTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9jaGlsZHJlblt2XTtcbiAgICB9XG4gICAgXy5lYWNoKF8ua2V5cyh0aGlzLl9pblt2XSksIHJlbW92ZUVkZ2UpO1xuICAgIGRlbGV0ZSB0aGlzLl9pblt2XTtcbiAgICBkZWxldGUgdGhpcy5fcHJlZHNbdl07XG4gICAgXy5lYWNoKF8ua2V5cyh0aGlzLl9vdXRbdl0pLCByZW1vdmVFZGdlKTtcbiAgICBkZWxldGUgdGhpcy5fb3V0W3ZdO1xuICAgIGRlbGV0ZSB0aGlzLl9zdWNzW3ZdO1xuICAgIC0tdGhpcy5fbm9kZUNvdW50O1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuR3JhcGgucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uKHYsIHBhcmVudCkge1xuICBpZiAoIXRoaXMuX2lzQ29tcG91bmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3Qgc2V0IHBhcmVudCBpbiBhIG5vbi1jb21wb3VuZCBncmFwaFwiKTtcbiAgfVxuXG4gIGlmIChfLmlzVW5kZWZpbmVkKHBhcmVudCkpIHtcbiAgICBwYXJlbnQgPSBHUkFQSF9OT0RFO1xuICB9IGVsc2Uge1xuICAgIC8vIENvZXJjZSBwYXJlbnQgdG8gc3RyaW5nXG4gICAgcGFyZW50ICs9IFwiXCI7XG4gICAgZm9yICh2YXIgYW5jZXN0b3IgPSBwYXJlbnQ7XG4gICAgICAhXy5pc1VuZGVmaW5lZChhbmNlc3Rvcik7XG4gICAgICBhbmNlc3RvciA9IHRoaXMucGFyZW50KGFuY2VzdG9yKSkge1xuICAgICAgaWYgKGFuY2VzdG9yID09PSB2KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNldHRpbmcgXCIgKyBwYXJlbnQrIFwiIGFzIHBhcmVudCBvZiBcIiArIHYgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIgd291bGQgY3JlYXRlIGEgY3ljbGVcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXROb2RlKHBhcmVudCk7XG4gIH1cblxuICB0aGlzLnNldE5vZGUodik7XG4gIHRoaXMuX3JlbW92ZUZyb21QYXJlbnRzQ2hpbGRMaXN0KHYpO1xuICB0aGlzLl9wYXJlbnRbdl0gPSBwYXJlbnQ7XG4gIHRoaXMuX2NoaWxkcmVuW3BhcmVudF1bdl0gPSB0cnVlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkdyYXBoLnByb3RvdHlwZS5fcmVtb3ZlRnJvbVBhcmVudHNDaGlsZExpc3QgPSBmdW5jdGlvbih2KSB7XG4gIGRlbGV0ZSB0aGlzLl9jaGlsZHJlblt0aGlzLl9wYXJlbnRbdl1dW3ZdO1xufTtcblxuR3JhcGgucHJvdG90eXBlLnBhcmVudCA9IGZ1bmN0aW9uKHYpIHtcbiAgaWYgKHRoaXMuX2lzQ29tcG91bmQpIHtcbiAgICB2YXIgcGFyZW50ID0gdGhpcy5fcGFyZW50W3ZdO1xuICAgIGlmIChwYXJlbnQgIT09IEdSQVBIX05PREUpIHtcbiAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgfVxuICB9XG59O1xuXG5HcmFwaC5wcm90b3R5cGUuY2hpbGRyZW4gPSBmdW5jdGlvbih2KSB7XG4gIGlmIChfLmlzVW5kZWZpbmVkKHYpKSB7XG4gICAgdiA9IEdSQVBIX05PREU7XG4gIH1cblxuICBpZiAodGhpcy5faXNDb21wb3VuZCkge1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuW3ZdO1xuICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgcmV0dXJuIF8ua2V5cyhjaGlsZHJlbik7XG4gICAgfVxuICB9IGVsc2UgaWYgKHYgPT09IEdSQVBIX05PREUpIHtcbiAgICByZXR1cm4gdGhpcy5ub2RlcygpO1xuICB9IGVsc2UgaWYgKHRoaXMuaGFzTm9kZSh2KSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxufTtcblxuR3JhcGgucHJvdG90eXBlLnByZWRlY2Vzc29ycyA9IGZ1bmN0aW9uKHYpIHtcbiAgdmFyIHByZWRzViA9IHRoaXMuX3ByZWRzW3ZdO1xuICBpZiAocHJlZHNWKSB7XG4gICAgcmV0dXJuIF8ua2V5cyhwcmVkc1YpO1xuICB9XG59O1xuXG5HcmFwaC5wcm90b3R5cGUuc3VjY2Vzc29ycyA9IGZ1bmN0aW9uKHYpIHtcbiAgdmFyIHN1Y3NWID0gdGhpcy5fc3Vjc1t2XTtcbiAgaWYgKHN1Y3NWKSB7XG4gICAgcmV0dXJuIF8ua2V5cyhzdWNzVik7XG4gIH1cbn07XG5cbkdyYXBoLnByb3RvdHlwZS5uZWlnaGJvcnMgPSBmdW5jdGlvbih2KSB7XG4gIHZhciBwcmVkcyA9IHRoaXMucHJlZGVjZXNzb3JzKHYpO1xuICBpZiAocHJlZHMpIHtcbiAgICByZXR1cm4gXy51bmlvbihwcmVkcywgdGhpcy5zdWNjZXNzb3JzKHYpKTtcbiAgfVxufTtcblxuR3JhcGgucHJvdG90eXBlLmlzTGVhZiA9IGZ1bmN0aW9uICh2KSB7XG4gIHZhciBuZWlnaGJvcnM7XG4gIGlmICh0aGlzLmlzRGlyZWN0ZWQoKSkge1xuICAgIG5laWdoYm9ycyA9IHRoaXMuc3VjY2Vzc29ycyh2KTtcbiAgfSBlbHNlIHtcbiAgICBuZWlnaGJvcnMgPSB0aGlzLm5laWdoYm9ycyh2KTtcbiAgfVxuICByZXR1cm4gbmVpZ2hib3JzLmxlbmd0aCA9PT0gMDtcbn07XG5cbkdyYXBoLnByb3RvdHlwZS5maWx0ZXJOb2RlcyA9IGZ1bmN0aW9uKGZpbHRlcikge1xuICB2YXIgY29weSA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHtcbiAgICBkaXJlY3RlZDogdGhpcy5faXNEaXJlY3RlZCxcbiAgICBtdWx0aWdyYXBoOiB0aGlzLl9pc011bHRpZ3JhcGgsXG4gICAgY29tcG91bmQ6IHRoaXMuX2lzQ29tcG91bmRcbiAgfSk7XG5cbiAgY29weS5zZXRHcmFwaCh0aGlzLmdyYXBoKCkpO1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgXy5lYWNoKHRoaXMuX25vZGVzLCBmdW5jdGlvbih2YWx1ZSwgdikge1xuICAgIGlmIChmaWx0ZXIodikpIHtcbiAgICAgIGNvcHkuc2V0Tm9kZSh2LCB2YWx1ZSk7XG4gICAgfVxuICB9KTtcblxuICBfLmVhY2godGhpcy5fZWRnZU9ianMsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoY29weS5oYXNOb2RlKGUudikgJiYgY29weS5oYXNOb2RlKGUudykpIHtcbiAgICAgIGNvcHkuc2V0RWRnZShlLCBzZWxmLmVkZ2UoZSkpO1xuICAgIH1cbiAgfSk7XG5cbiAgdmFyIHBhcmVudHMgPSB7fTtcbiAgZnVuY3Rpb24gZmluZFBhcmVudCh2KSB7XG4gICAgdmFyIHBhcmVudCA9IHNlbGYucGFyZW50KHYpO1xuICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCB8fCBjb3B5Lmhhc05vZGUocGFyZW50KSkge1xuICAgICAgcGFyZW50c1t2XSA9IHBhcmVudDtcbiAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgfSBlbHNlIGlmIChwYXJlbnQgaW4gcGFyZW50cykge1xuICAgICAgcmV0dXJuIHBhcmVudHNbcGFyZW50XTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpbmRQYXJlbnQocGFyZW50KTtcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5faXNDb21wb3VuZCkge1xuICAgIF8uZWFjaChjb3B5Lm5vZGVzKCksIGZ1bmN0aW9uKHYpIHtcbiAgICAgIGNvcHkuc2V0UGFyZW50KHYsIGZpbmRQYXJlbnQodikpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGNvcHk7XG59O1xuXG4vKiA9PT0gRWRnZSBmdW5jdGlvbnMgPT09PT09PT09PSAqL1xuXG5HcmFwaC5wcm90b3R5cGUuc2V0RGVmYXVsdEVkZ2VMYWJlbCA9IGZ1bmN0aW9uKG5ld0RlZmF1bHQpIHtcbiAgaWYgKCFfLmlzRnVuY3Rpb24obmV3RGVmYXVsdCkpIHtcbiAgICBuZXdEZWZhdWx0ID0gXy5jb25zdGFudChuZXdEZWZhdWx0KTtcbiAgfVxuICB0aGlzLl9kZWZhdWx0RWRnZUxhYmVsRm4gPSBuZXdEZWZhdWx0O1xuICByZXR1cm4gdGhpcztcbn07XG5cbkdyYXBoLnByb3RvdHlwZS5lZGdlQ291bnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX2VkZ2VDb3VudDtcbn07XG5cbkdyYXBoLnByb3RvdHlwZS5lZGdlcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXy52YWx1ZXModGhpcy5fZWRnZU9ianMpO1xufTtcblxuR3JhcGgucHJvdG90eXBlLnNldFBhdGggPSBmdW5jdGlvbih2cywgdmFsdWUpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgXy5yZWR1Y2UodnMsIGZ1bmN0aW9uKHYsIHcpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPiAxKSB7XG4gICAgICBzZWxmLnNldEVkZ2UodiwgdywgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnNldEVkZ2Uodiwgdyk7XG4gICAgfVxuICAgIHJldHVybiB3O1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKlxuICogc2V0RWRnZSh2LCB3LCBbdmFsdWUsIFtuYW1lXV0pXG4gKiBzZXRFZGdlKHsgdiwgdywgW25hbWVdIH0sIFt2YWx1ZV0pXG4gKi9cbkdyYXBoLnByb3RvdHlwZS5zZXRFZGdlID0gZnVuY3Rpb24oKSB7XG4gIHZhciB2LCB3LCBuYW1lLCB2YWx1ZTtcbiAgdmFyIHZhbHVlU3BlY2lmaWVkID0gZmFsc2U7XG4gIHZhciBhcmcwID0gYXJndW1lbnRzWzBdO1xuXG4gIGlmICh0eXBlb2YgYXJnMCA9PT0gXCJvYmplY3RcIiAmJiBhcmcwICE9PSBudWxsICYmIFwidlwiIGluIGFyZzApIHtcbiAgICB2ID0gYXJnMC52O1xuICAgIHcgPSBhcmcwLnc7XG4gICAgbmFtZSA9IGFyZzAubmFtZTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgdmFsdWUgPSBhcmd1bWVudHNbMV07XG4gICAgICB2YWx1ZVNwZWNpZmllZCA9IHRydWU7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHYgPSBhcmcwO1xuICAgIHcgPSBhcmd1bWVudHNbMV07XG4gICAgbmFtZSA9IGFyZ3VtZW50c1szXTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgIHZhbHVlID0gYXJndW1lbnRzWzJdO1xuICAgICAgdmFsdWVTcGVjaWZpZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHYgPSBcIlwiICsgdjtcbiAgdyA9IFwiXCIgKyB3O1xuICBpZiAoIV8uaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBuYW1lID0gXCJcIiArIG5hbWU7XG4gIH1cblxuICB2YXIgZSA9IGVkZ2VBcmdzVG9JZCh0aGlzLl9pc0RpcmVjdGVkLCB2LCB3LCBuYW1lKTtcbiAgaWYgKF8uaGFzKHRoaXMuX2VkZ2VMYWJlbHMsIGUpKSB7XG4gICAgaWYgKHZhbHVlU3BlY2lmaWVkKSB7XG4gICAgICB0aGlzLl9lZGdlTGFiZWxzW2VdID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaWYgKCFfLmlzVW5kZWZpbmVkKG5hbWUpICYmICF0aGlzLl9pc011bHRpZ3JhcGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3Qgc2V0IGEgbmFtZWQgZWRnZSB3aGVuIGlzTXVsdGlncmFwaCA9IGZhbHNlXCIpO1xuICB9XG5cbiAgLy8gSXQgZGlkbid0IGV4aXN0LCBzbyB3ZSBuZWVkIHRvIGNyZWF0ZSBpdC5cbiAgLy8gRmlyc3QgZW5zdXJlIHRoZSBub2RlcyBleGlzdC5cbiAgdGhpcy5zZXROb2RlKHYpO1xuICB0aGlzLnNldE5vZGUodyk7XG5cbiAgdGhpcy5fZWRnZUxhYmVsc1tlXSA9IHZhbHVlU3BlY2lmaWVkID8gdmFsdWUgOiB0aGlzLl9kZWZhdWx0RWRnZUxhYmVsRm4odiwgdywgbmFtZSk7XG5cbiAgdmFyIGVkZ2VPYmogPSBlZGdlQXJnc1RvT2JqKHRoaXMuX2lzRGlyZWN0ZWQsIHYsIHcsIG5hbWUpO1xuICAvLyBFbnN1cmUgd2UgYWRkIHVuZGlyZWN0ZWQgZWRnZXMgaW4gYSBjb25zaXN0ZW50IHdheS5cbiAgdiA9IGVkZ2VPYmoudjtcbiAgdyA9IGVkZ2VPYmoudztcblxuICBPYmplY3QuZnJlZXplKGVkZ2VPYmopO1xuICB0aGlzLl9lZGdlT2Jqc1tlXSA9IGVkZ2VPYmo7XG4gIGluY3JlbWVudE9ySW5pdEVudHJ5KHRoaXMuX3ByZWRzW3ddLCB2KTtcbiAgaW5jcmVtZW50T3JJbml0RW50cnkodGhpcy5fc3Vjc1t2XSwgdyk7XG4gIHRoaXMuX2luW3ddW2VdID0gZWRnZU9iajtcbiAgdGhpcy5fb3V0W3ZdW2VdID0gZWRnZU9iajtcbiAgdGhpcy5fZWRnZUNvdW50Kys7XG4gIHJldHVybiB0aGlzO1xufTtcblxuR3JhcGgucHJvdG90eXBlLmVkZ2UgPSBmdW5jdGlvbih2LCB3LCBuYW1lKSB7XG4gIHZhciBlID0gKGFyZ3VtZW50cy5sZW5ndGggPT09IDFcbiAgICA/IGVkZ2VPYmpUb0lkKHRoaXMuX2lzRGlyZWN0ZWQsIGFyZ3VtZW50c1swXSlcbiAgICA6IGVkZ2VBcmdzVG9JZCh0aGlzLl9pc0RpcmVjdGVkLCB2LCB3LCBuYW1lKSk7XG4gIHJldHVybiB0aGlzLl9lZGdlTGFiZWxzW2VdO1xufTtcblxuR3JhcGgucHJvdG90eXBlLmhhc0VkZ2UgPSBmdW5jdGlvbih2LCB3LCBuYW1lKSB7XG4gIHZhciBlID0gKGFyZ3VtZW50cy5sZW5ndGggPT09IDFcbiAgICA/IGVkZ2VPYmpUb0lkKHRoaXMuX2lzRGlyZWN0ZWQsIGFyZ3VtZW50c1swXSlcbiAgICA6IGVkZ2VBcmdzVG9JZCh0aGlzLl9pc0RpcmVjdGVkLCB2LCB3LCBuYW1lKSk7XG4gIHJldHVybiBfLmhhcyh0aGlzLl9lZGdlTGFiZWxzLCBlKTtcbn07XG5cbkdyYXBoLnByb3RvdHlwZS5yZW1vdmVFZGdlID0gZnVuY3Rpb24odiwgdywgbmFtZSkge1xuICB2YXIgZSA9IChhcmd1bWVudHMubGVuZ3RoID09PSAxXG4gICAgPyBlZGdlT2JqVG9JZCh0aGlzLl9pc0RpcmVjdGVkLCBhcmd1bWVudHNbMF0pXG4gICAgOiBlZGdlQXJnc1RvSWQodGhpcy5faXNEaXJlY3RlZCwgdiwgdywgbmFtZSkpO1xuICB2YXIgZWRnZSA9IHRoaXMuX2VkZ2VPYmpzW2VdO1xuICBpZiAoZWRnZSkge1xuICAgIHYgPSBlZGdlLnY7XG4gICAgdyA9IGVkZ2UudztcbiAgICBkZWxldGUgdGhpcy5fZWRnZUxhYmVsc1tlXTtcbiAgICBkZWxldGUgdGhpcy5fZWRnZU9ianNbZV07XG4gICAgZGVjcmVtZW50T3JSZW1vdmVFbnRyeSh0aGlzLl9wcmVkc1t3XSwgdik7XG4gICAgZGVjcmVtZW50T3JSZW1vdmVFbnRyeSh0aGlzLl9zdWNzW3ZdLCB3KTtcbiAgICBkZWxldGUgdGhpcy5faW5bd11bZV07XG4gICAgZGVsZXRlIHRoaXMuX291dFt2XVtlXTtcbiAgICB0aGlzLl9lZGdlQ291bnQtLTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbkdyYXBoLnByb3RvdHlwZS5pbkVkZ2VzID0gZnVuY3Rpb24odiwgdSkge1xuICB2YXIgaW5WID0gdGhpcy5faW5bdl07XG4gIGlmIChpblYpIHtcbiAgICB2YXIgZWRnZXMgPSBfLnZhbHVlcyhpblYpO1xuICAgIGlmICghdSkge1xuICAgICAgcmV0dXJuIGVkZ2VzO1xuICAgIH1cbiAgICByZXR1cm4gXy5maWx0ZXIoZWRnZXMsIGZ1bmN0aW9uKGVkZ2UpIHsgcmV0dXJuIGVkZ2UudiA9PT0gdTsgfSk7XG4gIH1cbn07XG5cbkdyYXBoLnByb3RvdHlwZS5vdXRFZGdlcyA9IGZ1bmN0aW9uKHYsIHcpIHtcbiAgdmFyIG91dFYgPSB0aGlzLl9vdXRbdl07XG4gIGlmIChvdXRWKSB7XG4gICAgdmFyIGVkZ2VzID0gXy52YWx1ZXMob3V0Vik7XG4gICAgaWYgKCF3KSB7XG4gICAgICByZXR1cm4gZWRnZXM7XG4gICAgfVxuICAgIHJldHVybiBfLmZpbHRlcihlZGdlcywgZnVuY3Rpb24oZWRnZSkgeyByZXR1cm4gZWRnZS53ID09PSB3OyB9KTtcbiAgfVxufTtcblxuR3JhcGgucHJvdG90eXBlLm5vZGVFZGdlcyA9IGZ1bmN0aW9uKHYsIHcpIHtcbiAgdmFyIGluRWRnZXMgPSB0aGlzLmluRWRnZXModiwgdyk7XG4gIGlmIChpbkVkZ2VzKSB7XG4gICAgcmV0dXJuIGluRWRnZXMuY29uY2F0KHRoaXMub3V0RWRnZXModiwgdykpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBpbmNyZW1lbnRPckluaXRFbnRyeShtYXAsIGspIHtcbiAgaWYgKG1hcFtrXSkge1xuICAgIG1hcFtrXSsrO1xuICB9IGVsc2Uge1xuICAgIG1hcFtrXSA9IDE7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVjcmVtZW50T3JSZW1vdmVFbnRyeShtYXAsIGspIHtcbiAgaWYgKCEtLW1hcFtrXSkgeyBkZWxldGUgbWFwW2tdOyB9XG59XG5cbmZ1bmN0aW9uIGVkZ2VBcmdzVG9JZChpc0RpcmVjdGVkLCB2Xywgd18sIG5hbWUpIHtcbiAgdmFyIHYgPSBcIlwiICsgdl87XG4gIHZhciB3ID0gXCJcIiArIHdfO1xuICBpZiAoIWlzRGlyZWN0ZWQgJiYgdiA+IHcpIHtcbiAgICB2YXIgdG1wID0gdjtcbiAgICB2ID0gdztcbiAgICB3ID0gdG1wO1xuICB9XG4gIHJldHVybiB2ICsgRURHRV9LRVlfREVMSU0gKyB3ICsgRURHRV9LRVlfREVMSU0gK1xuICAgICAgICAgICAgIChfLmlzVW5kZWZpbmVkKG5hbWUpID8gREVGQVVMVF9FREdFX05BTUUgOiBuYW1lKTtcbn1cblxuZnVuY3Rpb24gZWRnZUFyZ3NUb09iaihpc0RpcmVjdGVkLCB2Xywgd18sIG5hbWUpIHtcbiAgdmFyIHYgPSBcIlwiICsgdl87XG4gIHZhciB3ID0gXCJcIiArIHdfO1xuICBpZiAoIWlzRGlyZWN0ZWQgJiYgdiA+IHcpIHtcbiAgICB2YXIgdG1wID0gdjtcbiAgICB2ID0gdztcbiAgICB3ID0gdG1wO1xuICB9XG4gIHZhciBlZGdlT2JqID0gIHsgdjogdiwgdzogdyB9O1xuICBpZiAobmFtZSkge1xuICAgIGVkZ2VPYmoubmFtZSA9IG5hbWU7XG4gIH1cbiAgcmV0dXJuIGVkZ2VPYmo7XG59XG5cbmZ1bmN0aW9uIGVkZ2VPYmpUb0lkKGlzRGlyZWN0ZWQsIGVkZ2VPYmopIHtcbiAgcmV0dXJuIGVkZ2VBcmdzVG9JZChpc0RpcmVjdGVkLCBlZGdlT2JqLnYsIGVkZ2VPYmoudywgZWRnZU9iai5uYW1lKTtcbn1cbiIsIi8vIEluY2x1ZGVzIG9ubHkgdGhlIFwiY29yZVwiIG9mIGdyYXBobGliXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgR3JhcGg6IHJlcXVpcmUoXCIuL2dyYXBoXCIpLFxuICB2ZXJzaW9uOiByZXF1aXJlKFwiLi92ZXJzaW9uXCIpXG59O1xuIiwidmFyIF8gPSByZXF1aXJlKFwiLi9sb2Rhc2hcIik7XG52YXIgR3JhcGggPSByZXF1aXJlKFwiLi9ncmFwaFwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHdyaXRlOiB3cml0ZSxcbiAgcmVhZDogcmVhZFxufTtcblxuZnVuY3Rpb24gd3JpdGUoZykge1xuICB2YXIganNvbiA9IHtcbiAgICBvcHRpb25zOiB7XG4gICAgICBkaXJlY3RlZDogZy5pc0RpcmVjdGVkKCksXG4gICAgICBtdWx0aWdyYXBoOiBnLmlzTXVsdGlncmFwaCgpLFxuICAgICAgY29tcG91bmQ6IGcuaXNDb21wb3VuZCgpXG4gICAgfSxcbiAgICBub2Rlczogd3JpdGVOb2RlcyhnKSxcbiAgICBlZGdlczogd3JpdGVFZGdlcyhnKVxuICB9O1xuICBpZiAoIV8uaXNVbmRlZmluZWQoZy5ncmFwaCgpKSkge1xuICAgIGpzb24udmFsdWUgPSBfLmNsb25lKGcuZ3JhcGgoKSk7XG4gIH1cbiAgcmV0dXJuIGpzb247XG59XG5cbmZ1bmN0aW9uIHdyaXRlTm9kZXMoZykge1xuICByZXR1cm4gXy5tYXAoZy5ub2RlcygpLCBmdW5jdGlvbih2KSB7XG4gICAgdmFyIG5vZGVWYWx1ZSA9IGcubm9kZSh2KTtcbiAgICB2YXIgcGFyZW50ID0gZy5wYXJlbnQodik7XG4gICAgdmFyIG5vZGUgPSB7IHY6IHYgfTtcbiAgICBpZiAoIV8uaXNVbmRlZmluZWQobm9kZVZhbHVlKSkge1xuICAgICAgbm9kZS52YWx1ZSA9IG5vZGVWYWx1ZTtcbiAgICB9XG4gICAgaWYgKCFfLmlzVW5kZWZpbmVkKHBhcmVudCkpIHtcbiAgICAgIG5vZGUucGFyZW50ID0gcGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlRWRnZXMoZykge1xuICByZXR1cm4gXy5tYXAoZy5lZGdlcygpLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGVkZ2VWYWx1ZSA9IGcuZWRnZShlKTtcbiAgICB2YXIgZWRnZSA9IHsgdjogZS52LCB3OiBlLncgfTtcbiAgICBpZiAoIV8uaXNVbmRlZmluZWQoZS5uYW1lKSkge1xuICAgICAgZWRnZS5uYW1lID0gZS5uYW1lO1xuICAgIH1cbiAgICBpZiAoIV8uaXNVbmRlZmluZWQoZWRnZVZhbHVlKSkge1xuICAgICAgZWRnZS52YWx1ZSA9IGVkZ2VWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGVkZ2U7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZWFkKGpzb24pIHtcbiAgdmFyIGcgPSBuZXcgR3JhcGgoanNvbi5vcHRpb25zKS5zZXRHcmFwaChqc29uLnZhbHVlKTtcbiAgXy5lYWNoKGpzb24ubm9kZXMsIGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgZy5zZXROb2RlKGVudHJ5LnYsIGVudHJ5LnZhbHVlKTtcbiAgICBpZiAoZW50cnkucGFyZW50KSB7XG4gICAgICBnLnNldFBhcmVudChlbnRyeS52LCBlbnRyeS5wYXJlbnQpO1xuICAgIH1cbiAgfSk7XG4gIF8uZWFjaChqc29uLmVkZ2VzLCBmdW5jdGlvbihlbnRyeSkge1xuICAgIGcuc2V0RWRnZSh7IHY6IGVudHJ5LnYsIHc6IGVudHJ5LncsIG5hbWU6IGVudHJ5Lm5hbWUgfSwgZW50cnkudmFsdWUpO1xuICB9KTtcbiAgcmV0dXJuIGc7XG59XG4iLCIvKiBnbG9iYWwgd2luZG93ICovXG5cbnZhciBsb2Rhc2g7XG5cbmlmICh0eXBlb2YgcmVxdWlyZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gIHRyeSB7XG4gICAgbG9kYXNoID0ge1xuICAgICAgY2xvbmU6IHJlcXVpcmUoXCJsb2Rhc2gvY2xvbmVcIiksXG4gICAgICBjb25zdGFudDogcmVxdWlyZShcImxvZGFzaC9jb25zdGFudFwiKSxcbiAgICAgIGVhY2g6IHJlcXVpcmUoXCJsb2Rhc2gvZWFjaFwiKSxcbiAgICAgIGZpbHRlcjogcmVxdWlyZShcImxvZGFzaC9maWx0ZXJcIiksXG4gICAgICBoYXM6ICByZXF1aXJlKFwibG9kYXNoL2hhc1wiKSxcbiAgICAgIGlzQXJyYXk6IHJlcXVpcmUoXCJsb2Rhc2gvaXNBcnJheVwiKSxcbiAgICAgIGlzRW1wdHk6IHJlcXVpcmUoXCJsb2Rhc2gvaXNFbXB0eVwiKSxcbiAgICAgIGlzRnVuY3Rpb246IHJlcXVpcmUoXCJsb2Rhc2gvaXNGdW5jdGlvblwiKSxcbiAgICAgIGlzVW5kZWZpbmVkOiByZXF1aXJlKFwibG9kYXNoL2lzVW5kZWZpbmVkXCIpLFxuICAgICAga2V5czogcmVxdWlyZShcImxvZGFzaC9rZXlzXCIpLFxuICAgICAgbWFwOiByZXF1aXJlKFwibG9kYXNoL21hcFwiKSxcbiAgICAgIHJlZHVjZTogcmVxdWlyZShcImxvZGFzaC9yZWR1Y2VcIiksXG4gICAgICBzaXplOiByZXF1aXJlKFwibG9kYXNoL3NpemVcIiksXG4gICAgICB0cmFuc2Zvcm06IHJlcXVpcmUoXCJsb2Rhc2gvdHJhbnNmb3JtXCIpLFxuICAgICAgdW5pb246IHJlcXVpcmUoXCJsb2Rhc2gvdW5pb25cIiksXG4gICAgICB2YWx1ZXM6IHJlcXVpcmUoXCJsb2Rhc2gvdmFsdWVzXCIpXG4gICAgfTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGNvbnRpbnVlIHJlZ2FyZGxlc3Mgb2YgZXJyb3JcbiAgfVxufVxuXG5pZiAoIWxvZGFzaCkge1xuICBsb2Rhc2ggPSB3aW5kb3cuXztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsb2Rhc2g7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICcyLjEuOCc7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFWaWV3O1xuIiwidmFyIGhhc2hDbGVhciA9IHJlcXVpcmUoJy4vX2hhc2hDbGVhcicpLFxuICAgIGhhc2hEZWxldGUgPSByZXF1aXJlKCcuL19oYXNoRGVsZXRlJyksXG4gICAgaGFzaEdldCA9IHJlcXVpcmUoJy4vX2hhc2hHZXQnKSxcbiAgICBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpLFxuICAgIGhhc2hTZXQgPSByZXF1aXJlKCcuL19oYXNoU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2g7XG4iLCJ2YXIgbGlzdENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVDbGVhcicpLFxuICAgIGxpc3RDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZURlbGV0ZScpLFxuICAgIGxpc3RDYWNoZUdldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUdldCcpLFxuICAgIGxpc3RDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUhhcycpLFxuICAgIGxpc3RDYWNoZVNldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBtYXBDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVDbGVhcicpLFxuICAgIG1hcENhY2hlRGVsZXRlID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVEZWxldGUnKSxcbiAgICBtYXBDYWNoZUdldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlR2V0JyksXG4gICAgbWFwQ2FjaGVIYXMgPSByZXF1aXJlKCcuL19tYXBDYWNoZUhhcycpLFxuICAgIG1hcENhY2hlU2V0ID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwQ2FjaGU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldDtcbiIsInZhciBNYXBDYWNoZSA9IHJlcXVpcmUoJy4vX01hcENhY2hlJyksXG4gICAgc2V0Q2FjaGVBZGQgPSByZXF1aXJlKCcuL19zZXRDYWNoZUFkZCcpLFxuICAgIHNldENhY2hlSGFzID0gcmVxdWlyZSgnLi9fc2V0Q2FjaGVIYXMnKTtcblxuLyoqXG4gKlxuICogQ3JlYXRlcyBhbiBhcnJheSBjYWNoZSBvYmplY3QgdG8gc3RvcmUgdW5pcXVlIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTZXRDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPT0gbnVsbCA/IDAgOiB2YWx1ZXMubGVuZ3RoO1xuXG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGU7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdGhpcy5hZGQodmFsdWVzW2luZGV4XSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFNldENhY2hlYC5cblNldENhY2hlLnByb3RvdHlwZS5hZGQgPSBTZXRDYWNoZS5wcm90b3R5cGUucHVzaCA9IHNldENhY2hlQWRkO1xuU2V0Q2FjaGUucHJvdG90eXBlLmhhcyA9IHNldENhY2hlSGFzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldENhY2hlO1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIHN0YWNrQ2xlYXIgPSByZXF1aXJlKCcuL19zdGFja0NsZWFyJyksXG4gICAgc3RhY2tEZWxldGUgPSByZXF1aXJlKCcuL19zdGFja0RlbGV0ZScpLFxuICAgIHN0YWNrR2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tHZXQnKSxcbiAgICBzdGFja0hhcyA9IHJlcXVpcmUoJy4vX3N0YWNrSGFzJyksXG4gICAgc3RhY2tTZXQgPSByZXF1aXJlKCcuL19zdGFja1NldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzdGFjayBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTdGFjayhlbnRyaWVzKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGUoZW50cmllcyk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFN0YWNrYC5cblN0YWNrLnByb3RvdHlwZS5jbGVhciA9IHN0YWNrQ2xlYXI7XG5TdGFjay5wcm90b3R5cGVbJ2RlbGV0ZSddID0gc3RhY2tEZWxldGU7XG5TdGFjay5wcm90b3R5cGUuZ2V0ID0gc3RhY2tHZXQ7XG5TdGFjay5wcm90b3R5cGUuaGFzID0gc3RhY2tIYXM7XG5TdGFjay5wcm90b3R5cGUuc2V0ID0gc3RhY2tTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhY2s7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ltYm9sO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gVWludDhBcnJheTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYWtNYXA7XG4iLCIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuICovXG5mdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHk7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5mb3JFYWNoYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlFYWNoKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlFYWNoO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZmlsdGVyYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RmlsdGVyKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc0luZGV4ID0gMCxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJlc3VsdFtyZXNJbmRleCsrXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RmlsdGVyO1xuIiwidmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSgnLi9fYmFzZUluZGV4T2YnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uaW5jbHVkZXNgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogc3BlY2lmeWluZyBhbiBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0IFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB0YXJnZXRgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5SW5jbHVkZXMoYXJyYXksIHZhbHVlKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgMCkgPiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUluY2x1ZGVzO1xuIiwiLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2UgYGFycmF5SW5jbHVkZXNgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYSBjb21wYXJhdG9yLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB0YXJnZXQgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wYXJhdG9yIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHRhcmdldGAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlJbmNsdWRlc1dpdGgoYXJyYXksIHZhbHVlLCBjb21wYXJhdG9yKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoY29tcGFyYXRvcih2YWx1ZSwgYXJyYXlbaW5kZXhdKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUluY2x1ZGVzV2l0aDtcbiIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlMaWtlS2V5cztcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1hcGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheU1hcChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlNYXA7XG4iLCIvKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlQdXNoO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ucmVkdWNlYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFthY2N1bXVsYXRvcl0gVGhlIGluaXRpYWwgdmFsdWUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpbml0QWNjdW1dIFNwZWNpZnkgdXNpbmcgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYGFycmF5YCBhc1xuICogIHRoZSBpbml0aWFsIHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBhcnJheVJlZHVjZShhcnJheSwgaXRlcmF0ZWUsIGFjY3VtdWxhdG9yLCBpbml0QWNjdW0pIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICBpZiAoaW5pdEFjY3VtICYmIGxlbmd0aCkge1xuICAgIGFjY3VtdWxhdG9yID0gYXJyYXlbKytpbmRleF07XG4gIH1cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhY2N1bXVsYXRvciA9IGl0ZXJhdGVlKGFjY3VtdWxhdG9yLCBhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIGFjY3VtdWxhdG9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5UmVkdWNlO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uc29tZWAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbnkgZWxlbWVudCBwYXNzZXMgdGhlIHByZWRpY2F0ZSBjaGVjayxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5U29tZShhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVNvbWU7XG4iLCJ2YXIgYmFzZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fYmFzZVByb3BlcnR5Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgc2l6ZSBvZiBhbiBBU0NJSSBgc3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBzdHJpbmcgc2l6ZS5cbiAqL1xudmFyIGFzY2lpU2l6ZSA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXNjaWlTaXplO1xuIiwidmFyIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYXNzaWduVmFsdWVgIGV4Y2VwdCB0aGF0IGl0IGRvZXNuJ3QgYXNzaWduXG4gKiBgdW5kZWZpbmVkYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmICFlcShvYmplY3Rba2V5XSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbk1lcmdlVmFsdWU7XG4iLCJ2YXIgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyksXG4gICAgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduVmFsdWU7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzb2NJbmRleE9mO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbmAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzXG4gKiBvciBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbjtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduSW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlc1xuICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25JbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzSW4oc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduSW47XG4iLCJ2YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ25WYWx1ZTtcbiIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGJhc2VBc3NpZ24gPSByZXF1aXJlKCcuL19iYXNlQXNzaWduJyksXG4gICAgYmFzZUFzc2lnbkluID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnbkluJyksXG4gICAgY2xvbmVCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUJ1ZmZlcicpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpLFxuICAgIGNvcHlTeW1ib2xzID0gcmVxdWlyZSgnLi9fY29weVN5bWJvbHMnKSxcbiAgICBjb3B5U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fY29weVN5bWJvbHNJbicpLFxuICAgIGdldEFsbEtleXMgPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzJyksXG4gICAgZ2V0QWxsS2V5c0luID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5c0luJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaW5pdENsb25lQXJyYXkgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVBcnJheScpLFxuICAgIGluaXRDbG9uZUJ5VGFnID0gcmVxdWlyZSgnLi9faW5pdENsb25lQnlUYWcnKSxcbiAgICBpbml0Q2xvbmVPYmplY3QgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVPYmplY3QnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNNYXAgPSByZXF1aXJlKCcuL2lzTWFwJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNTZXQgPSByZXF1aXJlKCcuL2lzU2V0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMSxcbiAgICBDTE9ORV9GTEFUX0ZMQUcgPSAyLFxuICAgIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgc3VwcG9ydGVkIGJ5IGBfLmNsb25lYC4gKi9cbnZhciBjbG9uZWFibGVUYWdzID0ge307XG5jbG9uZWFibGVUYWdzW2FyZ3NUYWddID0gY2xvbmVhYmxlVGFnc1thcnJheVRhZ10gPVxuY2xvbmVhYmxlVGFnc1thcnJheUJ1ZmZlclRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGFWaWV3VGFnXSA9XG5jbG9uZWFibGVUYWdzW2Jvb2xUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRlVGFnXSA9XG5jbG9uZWFibGVUYWdzW2Zsb2F0MzJUYWddID0gY2xvbmVhYmxlVGFnc1tmbG9hdDY0VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDhUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQxNlRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQzMlRhZ10gPSBjbG9uZWFibGVUYWdzW21hcFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tudW1iZXJUYWddID0gY2xvbmVhYmxlVGFnc1tvYmplY3RUYWddID1cbmNsb25lYWJsZVRhZ3NbcmVnZXhwVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc2V0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3N0cmluZ1RhZ10gPSBjbG9uZWFibGVUYWdzW3N5bWJvbFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbmNsb25lYWJsZVRhZ3NbZXJyb3JUYWddID0gY2xvbmVhYmxlVGFnc1tmdW5jVGFnXSA9XG5jbG9uZWFibGVUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIGFuZCBgXy5jbG9uZURlZXBgIHdoaWNoIHRyYWNrc1xuICogdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBEZWVwIGNsb25lXG4gKiAgMiAtIEZsYXR0ZW4gaW5oZXJpdGVkIHByb3BlcnRpZXNcbiAqICA0IC0gQ2xvbmUgc3ltYm9sc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBUaGUga2V5IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIHBhcmVudCBvYmplY3Qgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgdGhlaXIgY2xvbmUgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUNsb25lKHZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIG9iamVjdCwgc3RhY2spIHtcbiAgdmFyIHJlc3VsdCxcbiAgICAgIGlzRGVlcCA9IGJpdG1hc2sgJiBDTE9ORV9ERUVQX0ZMQUcsXG4gICAgICBpc0ZsYXQgPSBiaXRtYXNrICYgQ0xPTkVfRkxBVF9GTEFHLFxuICAgICAgaXNGdWxsID0gYml0bWFzayAmIENMT05FX1NZTUJPTFNfRkxBRztcblxuICBpZiAoY3VzdG9taXplcikge1xuICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0LCBzdGFjaykgOiBjdXN0b21pemVyKHZhbHVlKTtcbiAgfVxuICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpO1xuICBpZiAoaXNBcnIpIHtcbiAgICByZXN1bHQgPSBpbml0Q2xvbmVBcnJheSh2YWx1ZSk7XG4gICAgaWYgKCFpc0RlZXApIHtcbiAgICAgIHJldHVybiBjb3B5QXJyYXkodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpLFxuICAgICAgICBpc0Z1bmMgPSB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xuXG4gICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNsb25lQnVmZmVyKHZhbHVlLCBpc0RlZXApO1xuICAgIH1cbiAgICBpZiAodGFnID09IG9iamVjdFRhZyB8fCB0YWcgPT0gYXJnc1RhZyB8fCAoaXNGdW5jICYmICFvYmplY3QpKSB7XG4gICAgICByZXN1bHQgPSAoaXNGbGF0IHx8IGlzRnVuYykgPyB7fSA6IGluaXRDbG9uZU9iamVjdCh2YWx1ZSk7XG4gICAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgICByZXR1cm4gaXNGbGF0XG4gICAgICAgICAgPyBjb3B5U3ltYm9sc0luKHZhbHVlLCBiYXNlQXNzaWduSW4ocmVzdWx0LCB2YWx1ZSkpXG4gICAgICAgICAgOiBjb3B5U3ltYm9scyh2YWx1ZSwgYmFzZUFzc2lnbihyZXN1bHQsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2xvbmVhYmxlVGFnc1t0YWddKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QgPyB2YWx1ZSA6IHt9O1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gaW5pdENsb25lQnlUYWcodmFsdWUsIHRhZywgaXNEZWVwKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBpdHMgY29ycmVzcG9uZGluZyBjbG9uZS5cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQodmFsdWUpO1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHJldHVybiBzdGFja2VkO1xuICB9XG4gIHN0YWNrLnNldCh2YWx1ZSwgcmVzdWx0KTtcblxuICBpZiAoaXNTZXQodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihzdWJWYWx1ZSkge1xuICAgICAgcmVzdWx0LmFkZChiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN1YlZhbHVlLCB2YWx1ZSwgc3RhY2spKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChpc01hcCh2YWx1ZSkpIHtcbiAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICAgIHJlc3VsdC5zZXQoa2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gICAgfSk7XG4gIH1cblxuICB2YXIga2V5c0Z1bmMgPSBpc0Z1bGxcbiAgICA/IChpc0ZsYXQgPyBnZXRBbGxLZXlzSW4gOiBnZXRBbGxLZXlzKVxuICAgIDogKGlzRmxhdCA/IGtleXNJbiA6IGtleXMpO1xuXG4gIHZhciBwcm9wcyA9IGlzQXJyID8gdW5kZWZpbmVkIDoga2V5c0Z1bmModmFsdWUpO1xuICBhcnJheUVhY2gocHJvcHMgfHwgdmFsdWUsIGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGtleSA9IHN1YlZhbHVlO1xuICAgICAgc3ViVmFsdWUgPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBwb3B1bGF0ZSBjbG9uZSAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGFzc2lnblZhbHVlKHJlc3VsdCwga2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDbG9uZTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG4gKiBwcm9wZXJ0aWVzIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xudmFyIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIG9iamVjdCgpIHt9XG4gIHJldHVybiBmdW5jdGlvbihwcm90bykge1xuICAgIGlmICghaXNPYmplY3QocHJvdG8pKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmIChvYmplY3RDcmVhdGUpIHtcbiAgICAgIHJldHVybiBvYmplY3RDcmVhdGUocHJvdG8pO1xuICAgIH1cbiAgICBvYmplY3QucHJvdG90eXBlID0gcHJvdG87XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBvYmplY3Q7XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ3JlYXRlO1xuIiwidmFyIGJhc2VGb3JPd24gPSByZXF1aXJlKCcuL19iYXNlRm9yT3duJyksXG4gICAgY3JlYXRlQmFzZUVhY2ggPSByZXF1aXJlKCcuL19jcmVhdGVCYXNlRWFjaCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvckVhY2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG52YXIgYmFzZUVhY2ggPSBjcmVhdGVCYXNlRWFjaChiYXNlRm9yT3duKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRWFjaDtcbiIsInZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBtZXRob2RzIGxpa2UgYF8ubWF4YCBhbmQgYF8ubWluYCB3aGljaCBhY2NlcHRzIGFcbiAqIGBjb21wYXJhdG9yYCB0byBkZXRlcm1pbmUgdGhlIGV4dHJlbXVtIHZhbHVlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgVGhlIGNvbXBhcmF0b3IgdXNlZCB0byBjb21wYXJlIHZhbHVlcy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBleHRyZW11bSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUV4dHJlbXVtKGFycmF5LCBpdGVyYXRlZSwgY29tcGFyYXRvcikge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgY3VycmVudCA9IGl0ZXJhdGVlKHZhbHVlKTtcblxuICAgIGlmIChjdXJyZW50ICE9IG51bGwgJiYgKGNvbXB1dGVkID09PSB1bmRlZmluZWRcbiAgICAgICAgICA/IChjdXJyZW50ID09PSBjdXJyZW50ICYmICFpc1N5bWJvbChjdXJyZW50KSlcbiAgICAgICAgICA6IGNvbXBhcmF0b3IoY3VycmVudCwgY29tcHV0ZWQpXG4gICAgICAgICkpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGN1cnJlbnQsXG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUV4dHJlbXVtO1xuIiwidmFyIGJhc2VFYWNoID0gcmVxdWlyZSgnLi9fYmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5maWx0ZXJgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYmFzZUZpbHRlcihjb2xsZWN0aW9uLCBwcmVkaWNhdGUpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBiYXNlRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGaWx0ZXI7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZpbmRJbmRleGAgYW5kIGBfLmZpbmRMYXN0SW5kZXhgIHdpdGhvdXRcbiAqIHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZpbmRJbmRleChhcnJheSwgcHJlZGljYXRlLCBmcm9tSW5kZXgsIGZyb21SaWdodCkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgaW5kZXggPSBmcm9tSW5kZXggKyAoZnJvbVJpZ2h0ID8gMSA6IC0xKTtcblxuICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRmluZEluZGV4O1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzRmxhdHRlbmFibGUgPSByZXF1aXJlKCcuL19pc0ZsYXR0ZW5hYmxlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmxhdHRlbmAgd2l0aCBzdXBwb3J0IGZvciByZXN0cmljdGluZyBmbGF0dGVuaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkZXB0aCBUaGUgbWF4aW11bSByZWN1cnNpb24gZGVwdGguXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcmVkaWNhdGU9aXNGbGF0dGVuYWJsZV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU3RyaWN0XSBSZXN0cmljdCB0byB2YWx1ZXMgdGhhdCBwYXNzIGBwcmVkaWNhdGVgIGNoZWNrcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtyZXN1bHQ9W11dIFRoZSBpbml0aWFsIHJlc3VsdCB2YWx1ZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYmFzZUZsYXR0ZW4oYXJyYXksIGRlcHRoLCBwcmVkaWNhdGUsIGlzU3RyaWN0LCByZXN1bHQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgcHJlZGljYXRlIHx8IChwcmVkaWNhdGUgPSBpc0ZsYXR0ZW5hYmxlKTtcbiAgcmVzdWx0IHx8IChyZXN1bHQgPSBbXSk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKGRlcHRoID4gMCAmJiBwcmVkaWNhdGUodmFsdWUpKSB7XG4gICAgICBpZiAoZGVwdGggPiAxKSB7XG4gICAgICAgIC8vIFJlY3Vyc2l2ZWx5IGZsYXR0ZW4gYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICAgIGJhc2VGbGF0dGVuKHZhbHVlLCBkZXB0aCAtIDEsIHByZWRpY2F0ZSwgaXNTdHJpY3QsIHJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheVB1c2gocmVzdWx0LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaXNTdHJpY3QpIHtcbiAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGbGF0dGVuO1xuIiwidmFyIGNyZWF0ZUJhc2VGb3IgPSByZXF1aXJlKCcuL19jcmVhdGVCYXNlRm9yJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGJhc2VGb3JPd25gIHdoaWNoIGl0ZXJhdGVzIG92ZXIgYG9iamVjdGBcbiAqIHByb3BlcnRpZXMgcmV0dXJuZWQgYnkgYGtleXNGdW5jYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIHByb3BlcnR5LlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG52YXIgYmFzZUZvciA9IGNyZWF0ZUJhc2VGb3IoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yO1xuIiwidmFyIGJhc2VGb3IgPSByZXF1aXJlKCcuL19iYXNlRm9yJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvck93bmAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JPd24ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGJhc2VGb3Iob2JqZWN0LCBpdGVyYXRlZSwga2V5cyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvck93bjtcbiIsInZhciBjYXN0UGF0aCA9IHJlcXVpcmUoJy4vX2Nhc3RQYXRoJyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmdldGAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWZhdWx0IHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldChvYmplY3QsIHBhdGgpIHtcbiAgcGF0aCA9IGNhc3RQYXRoKHBhdGgsIG9iamVjdCk7XG5cbiAgdmFyIGluZGV4ID0gMCxcbiAgICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoO1xuXG4gIHdoaWxlIChvYmplY3QgIT0gbnVsbCAmJiBpbmRleCA8IGxlbmd0aCkge1xuICAgIG9iamVjdCA9IG9iamVjdFt0b0tleShwYXRoW2luZGV4KytdKV07XG4gIH1cbiAgcmV0dXJuIChpbmRleCAmJiBpbmRleCA9PSBsZW5ndGgpID8gb2JqZWN0IDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXQ7XG4iLCJ2YXIgYXJyYXlQdXNoID0gcmVxdWlyZSgnLi9fYXJyYXlQdXNoJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRBbGxLZXlzYCBhbmQgYGdldEFsbEtleXNJbmAgd2hpY2ggdXNlc1xuICogYGtleXNGdW5jYCBhbmQgYHN5bWJvbHNGdW5jYCB0byBnZXQgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kXG4gKiBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3ltYm9sc0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5c0Z1bmMsIHN5bWJvbHNGdW5jKSB7XG4gIHZhciByZXN1bHQgPSBrZXlzRnVuYyhvYmplY3QpO1xuICByZXR1cm4gaXNBcnJheShvYmplY3QpID8gcmVzdWx0IDogYXJyYXlQdXNoKHJlc3VsdCwgc3ltYm9sc0Z1bmMob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldEFsbEtleXM7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgZ2V0UmF3VGFnID0gcmVxdWlyZSgnLi9fZ2V0UmF3VGFnJyksXG4gICAgb2JqZWN0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19vYmplY3RUb1N0cmluZycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0VGFnO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5ndGAgd2hpY2ggZG9lc24ndCBjb2VyY2UgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGdyZWF0ZXIgdGhhbiBgb3RoZXJgLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUd0KHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPiBvdGhlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR3Q7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmhhc2Agd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUhhcyhvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUhhcztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaGFzSW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VIYXNJbihvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYga2V5IGluIE9iamVjdChvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VIYXNJbjtcbiIsInZhciBiYXNlRmluZEluZGV4ID0gcmVxdWlyZSgnLi9fYmFzZUZpbmRJbmRleCcpLFxuICAgIGJhc2VJc05hTiA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hTicpLFxuICAgIHN0cmljdEluZGV4T2YgPSByZXF1aXJlKCcuL19zdHJpY3RJbmRleE9mJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5kZXhPZmAgd2l0aG91dCBgZnJvbUluZGV4YCBib3VuZHMgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWVcbiAgICA/IHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpXG4gICAgOiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXNOYU4sIGZyb21JbmRleCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2Y7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0FyZ3VtZW50cztcbiIsInZhciBiYXNlSXNFcXVhbERlZXAgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbERlZXAnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzRXF1YWxgIHdoaWNoIHN1cHBvcnRzIHBhcnRpYWwgY29tcGFyaXNvbnNcbiAqIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBVbm9yZGVyZWQgY29tcGFyaXNvblxuICogIDIgLSBQYXJ0aWFsIGNvbXBhcmlzb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgdmFsdWVgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIGlmICh2YWx1ZSA9PT0gb3RoZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBvdGhlciA9PSBudWxsIHx8ICghaXNPYmplY3RMaWtlKHZhbHVlKSAmJiAhaXNPYmplY3RMaWtlKG90aGVyKSkpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcjtcbiAgfVxuICByZXR1cm4gYmFzZUlzRXF1YWxEZWVwKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgYmFzZUlzRXF1YWwsIHN0YWNrKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNFcXVhbDtcbiIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgZXF1YWxBcnJheXMgPSByZXF1aXJlKCcuL19lcXVhbEFycmF5cycpLFxuICAgIGVxdWFsQnlUYWcgPSByZXF1aXJlKCcuL19lcXVhbEJ5VGFnJyksXG4gICAgZXF1YWxPYmplY3RzID0gcmVxdWlyZSgnLi9fZXF1YWxPYmplY3RzJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbGAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBjb21wYXJpc29ucyBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGVuYWJsaW5nIG9iamVjdHMgd2l0aCBjaXJjdWxhclxuICogcmVmZXJlbmNlcyB0byBiZSBjb21wYXJlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWxEZWVwKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIG9iaklzQXJyID0gaXNBcnJheShvYmplY3QpLFxuICAgICAgb3RoSXNBcnIgPSBpc0FycmF5KG90aGVyKSxcbiAgICAgIG9ialRhZyA9IG9iaklzQXJyID8gYXJyYXlUYWcgOiBnZXRUYWcob2JqZWN0KSxcbiAgICAgIG90aFRhZyA9IG90aElzQXJyID8gYXJyYXlUYWcgOiBnZXRUYWcob3RoZXIpO1xuXG4gIG9ialRhZyA9IG9ialRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb2JqVGFnO1xuICBvdGhUYWcgPSBvdGhUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG90aFRhZztcblxuICB2YXIgb2JqSXNPYmogPSBvYmpUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgb3RoSXNPYmogPSBvdGhUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgaXNTYW1lVGFnID0gb2JqVGFnID09IG90aFRhZztcblxuICBpZiAoaXNTYW1lVGFnICYmIGlzQnVmZmVyKG9iamVjdCkpIHtcbiAgICBpZiAoIWlzQnVmZmVyKG90aGVyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBvYmpJc0FyciA9IHRydWU7XG4gICAgb2JqSXNPYmogPSBmYWxzZTtcbiAgfVxuICBpZiAoaXNTYW1lVGFnICYmICFvYmpJc09iaikge1xuICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgcmV0dXJuIChvYmpJc0FyciB8fCBpc1R5cGVkQXJyYXkob2JqZWN0KSlcbiAgICAgID8gZXF1YWxBcnJheXMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaylcbiAgICAgIDogZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCBvYmpUYWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICB9XG4gIGlmICghKGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRykpIHtcbiAgICB2YXIgb2JqSXNXcmFwcGVkID0gb2JqSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsICdfX3dyYXBwZWRfXycpLFxuICAgICAgICBvdGhJc1dyYXBwZWQgPSBvdGhJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCAnX193cmFwcGVkX18nKTtcblxuICAgIGlmIChvYmpJc1dyYXBwZWQgfHwgb3RoSXNXcmFwcGVkKSB7XG4gICAgICB2YXIgb2JqVW53cmFwcGVkID0gb2JqSXNXcmFwcGVkID8gb2JqZWN0LnZhbHVlKCkgOiBvYmplY3QsXG4gICAgICAgICAgb3RoVW53cmFwcGVkID0gb3RoSXNXcmFwcGVkID8gb3RoZXIudmFsdWUoKSA6IG90aGVyO1xuXG4gICAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgICAgcmV0dXJuIGVxdWFsRnVuYyhvYmpVbndyYXBwZWQsIG90aFVud3JhcHBlZCwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spO1xuICAgIH1cbiAgfVxuICBpZiAoIWlzU2FtZVRhZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICByZXR1cm4gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0VxdWFsRGVlcDtcbiIsInZhciBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNNYXBgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbWFwLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc01hcCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBnZXRUYWcodmFsdWUpID09IG1hcFRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNNYXA7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGJhc2VJc0VxdWFsID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWwnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTWF0Y2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtBcnJheX0gbWF0Y2hEYXRhIFRoZSBwcm9wZXJ0eSBuYW1lcywgdmFsdWVzLCBhbmQgY29tcGFyZSBmbGFncyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBvYmplY3RgIGlzIGEgbWF0Y2gsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSwgY3VzdG9taXplcikge1xuICB2YXIgaW5kZXggPSBtYXRjaERhdGEubGVuZ3RoLFxuICAgICAgbGVuZ3RoID0gaW5kZXgsXG4gICAgICBub0N1c3RvbWl6ZXIgPSAhY3VzdG9taXplcjtcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gIWxlbmd0aDtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgaWYgKChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSlcbiAgICAgICAgICA/IGRhdGFbMV0gIT09IG9iamVjdFtkYXRhWzBdXVxuICAgICAgICAgIDogIShkYXRhWzBdIGluIG9iamVjdClcbiAgICAgICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgdmFyIGtleSA9IGRhdGFbMF0sXG4gICAgICAgIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHNyY1ZhbHVlID0gZGF0YVsxXTtcblxuICAgIGlmIChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSkge1xuICAgICAgaWYgKG9ialZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFjayA9IG5ldyBTdGFjaztcbiAgICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSwgc3RhY2spO1xuICAgICAgfVxuICAgICAgaWYgKCEocmVzdWx0ID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gYmFzZUlzRXF1YWwoc3JjVmFsdWUsIG9ialZhbHVlLCBDT01QQVJFX1BBUlRJQUxfRkxBRyB8IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcsIGN1c3RvbWl6ZXIsIHN0YWNrKVxuICAgICAgICAgICAgOiByZXN1bHRcbiAgICAgICAgICApKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTWF0Y2g7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmFOYCB3aXRob3V0IHN1cHBvcnQgZm9yIG51bWJlciBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGBOYU5gLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc05hTjtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNNYXNrZWQgPSByZXF1aXJlKCcuL19pc01hc2tlZCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYXRpdmU7XG4iLCJ2YXIgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzU2V0YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHNldCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNTZXQodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgZ2V0VGFnKHZhbHVlKSA9PSBzZXRUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzU2V0O1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1R5cGVkQXJyYXk7XG4iLCJ2YXIgYmFzZU1hdGNoZXMgPSByZXF1aXJlKCcuL19iYXNlTWF0Y2hlcycpLFxuICAgIGJhc2VNYXRjaGVzUHJvcGVydHkgPSByZXF1aXJlKCcuL19iYXNlTWF0Y2hlc1Byb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIHByb3BlcnR5ID0gcmVxdWlyZSgnLi9wcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLml0ZXJhdGVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSBbdmFsdWU9Xy5pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYW4gaXRlcmF0ZWUuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGl0ZXJhdGVlLlxuICovXG5mdW5jdGlvbiBiYXNlSXRlcmF0ZWUodmFsdWUpIHtcbiAgLy8gRG9uJ3Qgc3RvcmUgdGhlIGB0eXBlb2ZgIHJlc3VsdCBpbiBhIHZhcmlhYmxlIHRvIGF2b2lkIGEgSklUIGJ1ZyBpbiBTYWZhcmkgOS5cbiAgLy8gU2VlIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNTYwMzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGlkZW50aXR5O1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gaXNBcnJheSh2YWx1ZSlcbiAgICAgID8gYmFzZU1hdGNoZXNQcm9wZXJ0eSh2YWx1ZVswXSwgdmFsdWVbMV0pXG4gICAgICA6IGJhc2VNYXRjaGVzKHZhbHVlKTtcbiAgfVxuICByZXR1cm4gcHJvcGVydHkodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJdGVyYXRlZTtcbiIsInZhciBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5cyA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBuYXRpdmVLZXlzSW4gPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzSW4nKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzSW5gIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXNJbihvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXNJbihvYmplY3QpO1xuICB9XG4gIHZhciBpc1Byb3RvID0gaXNQcm90b3R5cGUob2JqZWN0KSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5c0luO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5sdGAgd2hpY2ggZG9lc24ndCBjb2VyY2UgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGxlc3MgdGhhbiBgb3RoZXJgLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUx0KHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPCBvdGhlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTHQ7XG4iLCJ2YXIgYmFzZUVhY2ggPSByZXF1aXJlKCcuL19iYXNlRWFjaCcpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1hcGAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBiYXNlTWFwKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gaXNBcnJheUxpa2UoY29sbGVjdGlvbikgPyBBcnJheShjb2xsZWN0aW9uLmxlbmd0aCkgOiBbXTtcblxuICBiYXNlRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gaXRlcmF0ZWUodmFsdWUsIGtleSwgY29sbGVjdGlvbik7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNYXA7XG4iLCJ2YXIgYmFzZUlzTWF0Y2ggPSByZXF1aXJlKCcuL19iYXNlSXNNYXRjaCcpLFxuICAgIGdldE1hdGNoRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hdGNoRGF0YScpLFxuICAgIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzYCB3aGljaCBkb2Vzbid0IGNsb25lIGBzb3VyY2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXMoc291cmNlKSB7XG4gIHZhciBtYXRjaERhdGEgPSBnZXRNYXRjaERhdGEoc291cmNlKTtcbiAgaWYgKG1hdGNoRGF0YS5sZW5ndGggPT0gMSAmJiBtYXRjaERhdGFbMF1bMl0pIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUobWF0Y2hEYXRhWzBdWzBdLCBtYXRjaERhdGFbMF1bMV0pO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09PSBzb3VyY2UgfHwgYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1hdGNoZXM7XG4iLCJ2YXIgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbCcpLFxuICAgIGdldCA9IHJlcXVpcmUoJy4vZ2V0JyksXG4gICAgaGFzSW4gPSByZXF1aXJlKCcuL2hhc0luJyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIGlzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX2lzU3RyaWN0Q29tcGFyYWJsZScpLFxuICAgIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzUHJvcGVydHlgIHdoaWNoIGRvZXNuJ3QgY2xvbmUgYHNyY1ZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHZhbHVlIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXNQcm9wZXJ0eShwYXRoLCBzcmNWYWx1ZSkge1xuICBpZiAoaXNLZXkocGF0aCkgJiYgaXNTdHJpY3RDb21wYXJhYmxlKHNyY1ZhbHVlKSkge1xuICAgIHJldHVybiBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSh0b0tleShwYXRoKSwgc3JjVmFsdWUpO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIgb2JqVmFsdWUgPSBnZXQob2JqZWN0LCBwYXRoKTtcbiAgICByZXR1cm4gKG9ialZhbHVlID09PSB1bmRlZmluZWQgJiYgb2JqVmFsdWUgPT09IHNyY1ZhbHVlKVxuICAgICAgPyBoYXNJbihvYmplY3QsIHBhdGgpXG4gICAgICA6IGJhc2VJc0VxdWFsKHNyY1ZhbHVlLCBvYmpWYWx1ZSwgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgfCBDT01QQVJFX1VOT1JERVJFRF9GTEFHKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWF0Y2hlc1Byb3BlcnR5O1xuIiwidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBhc3NpZ25NZXJnZVZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduTWVyZ2VWYWx1ZScpLFxuICAgIGJhc2VGb3IgPSByZXF1aXJlKCcuL19iYXNlRm9yJyksXG4gICAgYmFzZU1lcmdlRGVlcCA9IHJlcXVpcmUoJy4vX2Jhc2VNZXJnZURlZXAnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpLFxuICAgIHNhZmVHZXQgPSByZXF1aXJlKCcuL19zYWZlR2V0Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWVyZ2VgIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzcmNJbmRleCBUaGUgaW5kZXggb2YgYHNvdXJjZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBtZXJnZWQgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2UgdmFsdWVzIGFuZCB0aGVpciBtZXJnZWRcbiAqICBjb3VudGVycGFydHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIGlmIChvYmplY3QgPT09IHNvdXJjZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBiYXNlRm9yKHNvdXJjZSwgZnVuY3Rpb24oc3JjVmFsdWUsIGtleSkge1xuICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgaWYgKGlzT2JqZWN0KHNyY1ZhbHVlKSkge1xuICAgICAgYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBzcmNJbmRleCwgYmFzZU1lcmdlLCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgICA/IGN1c3RvbWl6ZXIoc2FmZUdldChvYmplY3QsIGtleSksIHNyY1ZhbHVlLCAoa2V5ICsgJycpLCBvYmplY3QsIHNvdXJjZSwgc3RhY2spXG4gICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBuZXdWYWx1ZSA9IHNyY1ZhbHVlO1xuICAgICAgfVxuICAgICAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfSwga2V5c0luKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWVyZ2U7XG4iLCJ2YXIgYXNzaWduTWVyZ2VWYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnbk1lcmdlVmFsdWUnKSxcbiAgICBjbG9uZUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQnVmZmVyJyksXG4gICAgY2xvbmVUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fY2xvbmVUeXBlZEFycmF5JyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgaW5pdENsb25lT2JqZWN0ID0gcmVxdWlyZSgnLi9faW5pdENsb25lT2JqZWN0JyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZU9iamVjdCcpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi9pc1BsYWluT2JqZWN0JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKSxcbiAgICBzYWZlR2V0ID0gcmVxdWlyZSgnLi9fc2FmZUdldCcpLFxuICAgIHRvUGxhaW5PYmplY3QgPSByZXF1aXJlKCcuL3RvUGxhaW5PYmplY3QnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VNZXJnZWAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBtZXJnZXMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgbWVyZ2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBtZXJnZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzcmNJbmRleCBUaGUgaW5kZXggb2YgYHNvdXJjZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXJnZUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1lcmdlIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIHZhbHVlcyBhbmQgdGhlaXIgbWVyZ2VkXG4gKiAgY291bnRlcnBhcnRzLlxuICovXG5mdW5jdGlvbiBiYXNlTWVyZ2VEZWVwKG9iamVjdCwgc291cmNlLCBrZXksIHNyY0luZGV4LCBtZXJnZUZ1bmMsIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIHZhciBvYmpWYWx1ZSA9IHNhZmVHZXQob2JqZWN0LCBrZXkpLFxuICAgICAgc3JjVmFsdWUgPSBzYWZlR2V0KHNvdXJjZSwga2V5KSxcbiAgICAgIHN0YWNrZWQgPSBzdGFjay5nZXQoc3JjVmFsdWUpO1xuXG4gIGlmIChzdGFja2VkKSB7XG4gICAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgc3RhY2tlZCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICA/IGN1c3RvbWl6ZXIob2JqVmFsdWUsIHNyY1ZhbHVlLCAoa2V5ICsgJycpLCBvYmplY3QsIHNvdXJjZSwgc3RhY2spXG4gICAgOiB1bmRlZmluZWQ7XG5cbiAgdmFyIGlzQ29tbW9uID0gbmV3VmFsdWUgPT09IHVuZGVmaW5lZDtcblxuICBpZiAoaXNDb21tb24pIHtcbiAgICB2YXIgaXNBcnIgPSBpc0FycmF5KHNyY1ZhbHVlKSxcbiAgICAgICAgaXNCdWZmID0gIWlzQXJyICYmIGlzQnVmZmVyKHNyY1ZhbHVlKSxcbiAgICAgICAgaXNUeXBlZCA9ICFpc0FyciAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheShzcmNWYWx1ZSk7XG5cbiAgICBuZXdWYWx1ZSA9IHNyY1ZhbHVlO1xuICAgIGlmIChpc0FyciB8fCBpc0J1ZmYgfHwgaXNUeXBlZCkge1xuICAgICAgaWYgKGlzQXJyYXkob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gb2JqVmFsdWU7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc0FycmF5TGlrZU9iamVjdChvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBjb3B5QXJyYXkob2JqVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNCdWZmKSB7XG4gICAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgICAgIG5ld1ZhbHVlID0gY2xvbmVCdWZmZXIoc3JjVmFsdWUsIHRydWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNUeXBlZCkge1xuICAgICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgICAgICBuZXdWYWx1ZSA9IGNsb25lVHlwZWRBcnJheShzcmNWYWx1ZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbmV3VmFsdWUgPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChzcmNWYWx1ZSkgfHwgaXNBcmd1bWVudHMoc3JjVmFsdWUpKSB7XG4gICAgICBuZXdWYWx1ZSA9IG9ialZhbHVlO1xuICAgICAgaWYgKGlzQXJndW1lbnRzKG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IHRvUGxhaW5PYmplY3Qob2JqVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIWlzT2JqZWN0KG9ialZhbHVlKSB8fCBpc0Z1bmN0aW9uKG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IGluaXRDbG9uZU9iamVjdChzcmNWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgbWVyZ2Ugb2JqZWN0cyBhbmQgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgc3RhY2suc2V0KHNyY1ZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgbWVyZ2VGdW5jKG5ld1ZhbHVlLCBzcmNWYWx1ZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICBzdGFja1snZGVsZXRlJ10oc3JjVmFsdWUpO1xuICB9XG4gIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWVyZ2VEZWVwO1xuIiwidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGJhc2VNYXAgPSByZXF1aXJlKCcuL19iYXNlTWFwJyksXG4gICAgYmFzZVNvcnRCeSA9IHJlcXVpcmUoJy4vX2Jhc2VTb3J0QnknKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBjb21wYXJlTXVsdGlwbGUgPSByZXF1aXJlKCcuL19jb21wYXJlTXVsdGlwbGUnKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ub3JkZXJCeWAgd2l0aG91dCBwYXJhbSBndWFyZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb25bXXxPYmplY3RbXXxzdHJpbmdbXX0gaXRlcmF0ZWVzIFRoZSBpdGVyYXRlZXMgdG8gc29ydCBieS5cbiAqIEBwYXJhbSB7c3RyaW5nW119IG9yZGVycyBUaGUgc29ydCBvcmRlcnMgb2YgYGl0ZXJhdGVlc2AuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBzb3J0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGJhc2VPcmRlckJ5KGNvbGxlY3Rpb24sIGl0ZXJhdGVlcywgb3JkZXJzKSB7XG4gIGlmIChpdGVyYXRlZXMubGVuZ3RoKSB7XG4gICAgaXRlcmF0ZWVzID0gYXJyYXlNYXAoaXRlcmF0ZWVzLCBmdW5jdGlvbihpdGVyYXRlZSkge1xuICAgICAgaWYgKGlzQXJyYXkoaXRlcmF0ZWUpKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBiYXNlR2V0KHZhbHVlLCBpdGVyYXRlZS5sZW5ndGggPT09IDEgPyBpdGVyYXRlZVswXSA6IGl0ZXJhdGVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdGVlO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGl0ZXJhdGVlcyA9IFtpZGVudGl0eV07XG4gIH1cblxuICB2YXIgaW5kZXggPSAtMTtcbiAgaXRlcmF0ZWVzID0gYXJyYXlNYXAoaXRlcmF0ZWVzLCBiYXNlVW5hcnkoYmFzZUl0ZXJhdGVlKSk7XG5cbiAgdmFyIHJlc3VsdCA9IGJhc2VNYXAoY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGtleSwgY29sbGVjdGlvbikge1xuICAgIHZhciBjcml0ZXJpYSA9IGFycmF5TWFwKGl0ZXJhdGVlcywgZnVuY3Rpb24oaXRlcmF0ZWUpIHtcbiAgICAgIHJldHVybiBpdGVyYXRlZSh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHsgJ2NyaXRlcmlhJzogY3JpdGVyaWEsICdpbmRleCc6ICsraW5kZXgsICd2YWx1ZSc6IHZhbHVlIH07XG4gIH0pO1xuXG4gIHJldHVybiBiYXNlU29ydEJ5KHJlc3VsdCwgZnVuY3Rpb24ob2JqZWN0LCBvdGhlcikge1xuICAgIHJldHVybiBjb21wYXJlTXVsdGlwbGUob2JqZWN0LCBvdGhlciwgb3JkZXJzKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU9yZGVyQnk7XG4iLCJ2YXIgYmFzZVBpY2tCeSA9IHJlcXVpcmUoJy4vX2Jhc2VQaWNrQnknKSxcbiAgICBoYXNJbiA9IHJlcXVpcmUoJy4vaGFzSW4nKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5waWNrYCB3aXRob3V0IHN1cHBvcnQgZm9yIGluZGl2aWR1YWxcbiAqIHByb3BlcnR5IGlkZW50aWZpZXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGF0aHMgVGhlIHByb3BlcnR5IHBhdGhzIHRvIHBpY2suXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBiYXNlUGljayhvYmplY3QsIHBhdGhzKSB7XG4gIHJldHVybiBiYXNlUGlja0J5KG9iamVjdCwgcGF0aHMsIGZ1bmN0aW9uKHZhbHVlLCBwYXRoKSB7XG4gICAgcmV0dXJuIGhhc0luKG9iamVjdCwgcGF0aCk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQaWNrO1xuIiwidmFyIGJhc2VHZXQgPSByZXF1aXJlKCcuL19iYXNlR2V0JyksXG4gICAgYmFzZVNldCA9IHJlcXVpcmUoJy4vX2Jhc2VTZXQnKSxcbiAgICBjYXN0UGF0aCA9IHJlcXVpcmUoJy4vX2Nhc3RQYXRoJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgIGBfLnBpY2tCeWAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGF0aHMgVGhlIHByb3BlcnR5IHBhdGhzIHRvIHBpY2suXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIHByb3BlcnR5LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gYmFzZVBpY2tCeShvYmplY3QsIHBhdGhzLCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRocy5sZW5ndGgsXG4gICAgICByZXN1bHQgPSB7fTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBwYXRoID0gcGF0aHNbaW5kZXhdLFxuICAgICAgICB2YWx1ZSA9IGJhc2VHZXQob2JqZWN0LCBwYXRoKTtcblxuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIHBhdGgpKSB7XG4gICAgICBiYXNlU2V0KHJlc3VsdCwgY2FzdFBhdGgocGF0aCwgb2JqZWN0KSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQaWNrQnk7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQcm9wZXJ0eTtcbiIsInZhciBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVByb3BlcnR5YCB3aGljaCBzdXBwb3J0cyBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eURlZXAocGF0aCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIGJhc2VHZXQob2JqZWN0LCBwYXRoKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHlEZWVwO1xuIiwiLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUNlaWwgPSBNYXRoLmNlaWwsXG4gICAgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmFuZ2VgIGFuZCBgXy5yYW5nZVJpZ2h0YCB3aGljaCBkb2Vzbid0XG4gKiBjb2VyY2UgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgVGhlIHN0YXJ0IG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhlIGVuZCBvZiB0aGUgcmFuZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gc3RlcCBUaGUgdmFsdWUgdG8gaW5jcmVtZW50IG9yIGRlY3JlbWVudCBieS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSByYW5nZSBvZiBudW1iZXJzLlxuICovXG5mdW5jdGlvbiBiYXNlUmFuZ2Uoc3RhcnQsIGVuZCwgc3RlcCwgZnJvbVJpZ2h0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KG5hdGl2ZUNlaWwoKGVuZCAtIHN0YXJ0KSAvIChzdGVwIHx8IDEpKSwgMCksXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIHJlc3VsdFtmcm9tUmlnaHQgPyBsZW5ndGggOiArK2luZGV4XSA9IHN0YXJ0O1xuICAgIHN0YXJ0ICs9IHN0ZXA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUmFuZ2U7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlZHVjZWAgYW5kIGBfLnJlZHVjZVJpZ2h0YCwgd2l0aG91dCBzdXBwb3J0XG4gKiBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcywgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgY29sbGVjdGlvbmAgdXNpbmcgYGVhY2hGdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gYWNjdW11bGF0b3IgVGhlIGluaXRpYWwgdmFsdWUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaXRBY2N1bSBTcGVjaWZ5IHVzaW5nIHRoZSBmaXJzdCBvciBsYXN0IGVsZW1lbnQgb2ZcbiAqICBgY29sbGVjdGlvbmAgYXMgdGhlIGluaXRpYWwgdmFsdWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGBjb2xsZWN0aW9uYC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZVJlZHVjZShjb2xsZWN0aW9uLCBpdGVyYXRlZSwgYWNjdW11bGF0b3IsIGluaXRBY2N1bSwgZWFjaEZ1bmMpIHtcbiAgZWFjaEZ1bmMoY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgYWNjdW11bGF0b3IgPSBpbml0QWNjdW1cbiAgICAgID8gKGluaXRBY2N1bSA9IGZhbHNlLCB2YWx1ZSlcbiAgICAgIDogaXRlcmF0ZWUoYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gIH0pO1xuICByZXR1cm4gYWNjdW11bGF0b3I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVJlZHVjZTtcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBvdmVyUmVzdCA9IHJlcXVpcmUoJy4vX292ZXJSZXN0JyksXG4gICAgc2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19zZXRUb1N0cmluZycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgc3RhcnQsIGlkZW50aXR5KSwgZnVuYyArICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUmVzdDtcbiIsInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNldGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgcGF0aCBjcmVhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VTZXQob2JqZWN0LCBwYXRoLCB2YWx1ZSwgY3VzdG9taXplcikge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICBsYXN0SW5kZXggPSBsZW5ndGggLSAxLFxuICAgICAgbmVzdGVkID0gb2JqZWN0O1xuXG4gIHdoaWxlIChuZXN0ZWQgIT0gbnVsbCAmJiArK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHRvS2V5KHBhdGhbaW5kZXhdKSxcbiAgICAgICAgbmV3VmFsdWUgPSB2YWx1ZTtcblxuICAgIGlmIChrZXkgPT09ICdfX3Byb3RvX18nIHx8IGtleSA9PT0gJ2NvbnN0cnVjdG9yJyB8fCBrZXkgPT09ICdwcm90b3R5cGUnKSB7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIGlmIChpbmRleCAhPSBsYXN0SW5kZXgpIHtcbiAgICAgIHZhciBvYmpWYWx1ZSA9IG5lc3RlZFtrZXldO1xuICAgICAgbmV3VmFsdWUgPSBjdXN0b21pemVyID8gY3VzdG9taXplcihvYmpWYWx1ZSwga2V5LCBuZXN0ZWQpIDogdW5kZWZpbmVkO1xuICAgICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBpc09iamVjdChvYmpWYWx1ZSlcbiAgICAgICAgICA/IG9ialZhbHVlXG4gICAgICAgICAgOiAoaXNJbmRleChwYXRoW2luZGV4ICsgMV0pID8gW10gOiB7fSk7XG4gICAgICB9XG4gICAgfVxuICAgIGFzc2lnblZhbHVlKG5lc3RlZCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgbmVzdGVkID0gbmVzdGVkW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU2V0O1xuIiwidmFyIGNvbnN0YW50ID0gcmVxdWlyZSgnLi9jb25zdGFudCcpLFxuICAgIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fZGVmaW5lUHJvcGVydHknKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0VG9TdHJpbmdgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaG90IGxvb3Agc2hvcnRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgYmFzZVNldFRvU3RyaW5nID0gIWRlZmluZVByb3BlcnR5ID8gaWRlbnRpdHkgOiBmdW5jdGlvbihmdW5jLCBzdHJpbmcpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5KGZ1bmMsICd0b1N0cmluZycsIHtcbiAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAnZW51bWVyYWJsZSc6IGZhbHNlLFxuICAgICd2YWx1ZSc6IGNvbnN0YW50KHN0cmluZyksXG4gICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNldFRvU3RyaW5nO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zb3J0QnlgIHdoaWNoIHVzZXMgYGNvbXBhcmVyYCB0byBkZWZpbmUgdGhlXG4gKiBzb3J0IG9yZGVyIG9mIGBhcnJheWAgYW5kIHJlcGxhY2VzIGNyaXRlcmlhIG9iamVjdHMgd2l0aCB0aGVpciBjb3JyZXNwb25kaW5nXG4gKiB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzb3J0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyZXIgVGhlIGZ1bmN0aW9uIHRvIGRlZmluZSBzb3J0IG9yZGVyLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VTb3J0QnkoYXJyYXksIGNvbXBhcmVyKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgYXJyYXkuc29ydChjb21wYXJlcik7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGFycmF5W2xlbmd0aF0gPSBhcnJheVtsZW5ndGhdLnZhbHVlO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU29ydEJ5O1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVGltZXM7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by50b1N0cmluZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50b1N0cmluZ2Agd2hpY2ggZG9lc24ndCBjb252ZXJ0IG51bGxpc2hcbiAqIHZhbHVlcyB0byBlbXB0eSBzdHJpbmdzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAvLyBSZWN1cnNpdmVseSBjb252ZXJ0IHZhbHVlcyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIHJldHVybiBhcnJheU1hcCh2YWx1ZSwgYmFzZVRvU3RyaW5nKSArICcnO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICB9XG4gIHZhciByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVG9TdHJpbmc7XG4iLCJ2YXIgdHJpbW1lZEVuZEluZGV4ID0gcmVxdWlyZSgnLi9fdHJpbW1lZEVuZEluZGV4Jyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW1TdGFydCA9IC9eXFxzKy87XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udHJpbWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byB0cmltLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdHJpbW1lZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUcmltKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nXG4gICAgPyBzdHJpbmcuc2xpY2UoMCwgdHJpbW1lZEVuZEluZGV4KHN0cmluZykgKyAxKS5yZXBsYWNlKHJlVHJpbVN0YXJ0LCAnJylcbiAgICA6IHN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVHJpbTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVW5hcnk7XG4iLCJ2YXIgU2V0Q2FjaGUgPSByZXF1aXJlKCcuL19TZXRDYWNoZScpLFxuICAgIGFycmF5SW5jbHVkZXMgPSByZXF1aXJlKCcuL19hcnJheUluY2x1ZGVzJyksXG4gICAgYXJyYXlJbmNsdWRlc1dpdGggPSByZXF1aXJlKCcuL19hcnJheUluY2x1ZGVzV2l0aCcpLFxuICAgIGNhY2hlSGFzID0gcmVxdWlyZSgnLi9fY2FjaGVIYXMnKSxcbiAgICBjcmVhdGVTZXQgPSByZXF1aXJlKCcuL19jcmVhdGVTZXQnKSxcbiAgICBzZXRUb0FycmF5ID0gcmVxdWlyZSgnLi9fc2V0VG9BcnJheScpO1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuaXFCeWAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZV0gVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyYXRvcl0gVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGR1cGxpY2F0ZSBmcmVlIGFycmF5LlxuICovXG5mdW5jdGlvbiBiYXNlVW5pcShhcnJheSwgaXRlcmF0ZWUsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBpbmNsdWRlcyA9IGFycmF5SW5jbHVkZXMsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBpc0NvbW1vbiA9IHRydWUsXG4gICAgICByZXN1bHQgPSBbXSxcbiAgICAgIHNlZW4gPSByZXN1bHQ7XG5cbiAgaWYgKGNvbXBhcmF0b3IpIHtcbiAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgIGluY2x1ZGVzID0gYXJyYXlJbmNsdWRlc1dpdGg7XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID49IExBUkdFX0FSUkFZX1NJWkUpIHtcbiAgICB2YXIgc2V0ID0gaXRlcmF0ZWUgPyBudWxsIDogY3JlYXRlU2V0KGFycmF5KTtcbiAgICBpZiAoc2V0KSB7XG4gICAgICByZXR1cm4gc2V0VG9BcnJheShzZXQpO1xuICAgIH1cbiAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgIGluY2x1ZGVzID0gY2FjaGVIYXM7XG4gICAgc2VlbiA9IG5ldyBTZXRDYWNoZTtcbiAgfVxuICBlbHNlIHtcbiAgICBzZWVuID0gaXRlcmF0ZWUgPyBbXSA6IHJlc3VsdDtcbiAgfVxuICBvdXRlcjpcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSkgOiB2YWx1ZTtcblxuICAgIHZhbHVlID0gKGNvbXBhcmF0b3IgfHwgdmFsdWUgIT09IDApID8gdmFsdWUgOiAwO1xuICAgIGlmIChpc0NvbW1vbiAmJiBjb21wdXRlZCA9PT0gY29tcHV0ZWQpIHtcbiAgICAgIHZhciBzZWVuSW5kZXggPSBzZWVuLmxlbmd0aDtcbiAgICAgIHdoaWxlIChzZWVuSW5kZXgtLSkge1xuICAgICAgICBpZiAoc2VlbltzZWVuSW5kZXhdID09PSBjb21wdXRlZCkge1xuICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXRlcmF0ZWUpIHtcbiAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIWluY2x1ZGVzKHNlZW4sIGNvbXB1dGVkLCBjb21wYXJhdG9yKSkge1xuICAgICAgaWYgKHNlZW4gIT09IHJlc3VsdCkge1xuICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgfVxuICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmlxO1xuIiwidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy52YWx1ZXNgIGFuZCBgXy52YWx1ZXNJbmAgd2hpY2ggY3JlYXRlcyBhblxuICogYXJyYXkgb2YgYG9iamVjdGAgcHJvcGVydHkgdmFsdWVzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHByb3BlcnR5IG5hbWVzXG4gKiBvZiBgcHJvcHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgbmFtZXMgdG8gZ2V0IHZhbHVlcyBmb3IuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VWYWx1ZXMob2JqZWN0LCBwcm9wcykge1xuICByZXR1cm4gYXJyYXlNYXAocHJvcHMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBvYmplY3Rba2V5XTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVZhbHVlcztcbiIsIi8qKlxuICogVGhpcyBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnppcE9iamVjdGAgd2hpY2ggYXNzaWducyB2YWx1ZXMgdXNpbmcgYGFzc2lnbkZ1bmNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgaWRlbnRpZmllcnMuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHByb3BlcnR5IHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbkZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBiYXNlWmlwT2JqZWN0KHByb3BzLCB2YWx1ZXMsIGFzc2lnbkZ1bmMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICB2YWxzTGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IHt9O1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gaW5kZXggPCB2YWxzTGVuZ3RoID8gdmFsdWVzW2luZGV4XSA6IHVuZGVmaW5lZDtcbiAgICBhc3NpZ25GdW5jKHJlc3VsdCwgcHJvcHNbaW5kZXhdLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlWmlwT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYSBgY2FjaGVgIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjYWNoZSBUaGUgY2FjaGUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gY2FjaGVIYXMoY2FjaGUsIGtleSkge1xuICByZXR1cm4gY2FjaGUuaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FjaGVIYXM7XG4iLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBgaWRlbnRpdHlgIGlmIGl0J3Mgbm90IGEgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgY2FzdCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY2FzdEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlIDogaWRlbnRpdHk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdEZ1bmN0aW9uO1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgc3RyaW5nVG9QYXRoID0gcmVxdWlyZSgnLi9fc3RyaW5nVG9QYXRoJyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBhIHBhdGggYXJyYXkgaWYgaXQncyBub3Qgb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkga2V5cyBvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2FzdCBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG5mdW5jdGlvbiBjYXN0UGF0aCh2YWx1ZSwgb2JqZWN0KSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gaXNLZXkodmFsdWUsIG9iamVjdCkgPyBbdmFsdWVdIDogc3RyaW5nVG9QYXRoKHRvU3RyaW5nKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdFBhdGg7XG4iLCJ2YXIgVWludDhBcnJheSA9IHJlcXVpcmUoJy4vX1VpbnQ4QXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGFycmF5QnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXlCdWZmZXIgVGhlIGFycmF5IGJ1ZmZlciB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheUJ1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5IGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVBcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gbmV3IGFycmF5QnVmZmVyLmNvbnN0cnVjdG9yKGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgpO1xuICBuZXcgVWludDhBcnJheShyZXN1bHQpLnNldChuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcikpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQXJyYXlCdWZmZXI7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgYWxsb2NVbnNhZmUgPSBCdWZmZXIgPyBCdWZmZXIuYWxsb2NVbnNhZmUgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mICBgYnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciBUaGUgYnVmZmVyIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQnVmZmVyKGJ1ZmZlciwgaXNEZWVwKSB7XG4gIGlmIChpc0RlZXApIHtcbiAgICByZXR1cm4gYnVmZmVyLnNsaWNlKCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBhbGxvY1Vuc2FmZSA/IGFsbG9jVW5zYWZlKGxlbmd0aCkgOiBuZXcgYnVmZmVyLmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgYnVmZmVyLmNvcHkocmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZUJ1ZmZlcjtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgZGF0YVZpZXdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVZpZXcgVGhlIGRhdGEgdmlldyB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgZGF0YSB2aWV3LlxuICovXG5mdW5jdGlvbiBjbG9uZURhdGFWaWV3KGRhdGFWaWV3LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIoZGF0YVZpZXcuYnVmZmVyKSA6IGRhdGFWaWV3LmJ1ZmZlcjtcbiAgcmV0dXJuIG5ldyBkYXRhVmlldy5jb25zdHJ1Y3RvcihidWZmZXIsIGRhdGFWaWV3LmJ5dGVPZmZzZXQsIGRhdGFWaWV3LmJ5dGVMZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lRGF0YVZpZXc7XG4iLCIvKiogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUZsYWdzID0gL1xcdyokLztcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHJlZ2V4cGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWdleHAgVGhlIHJlZ2V4cCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCByZWdleHAuXG4gKi9cbmZ1bmN0aW9uIGNsb25lUmVnRXhwKHJlZ2V4cCkge1xuICB2YXIgcmVzdWx0ID0gbmV3IHJlZ2V4cC5jb25zdHJ1Y3RvcihyZWdleHAuc291cmNlLCByZUZsYWdzLmV4ZWMocmVnZXhwKSk7XG4gIHJlc3VsdC5sYXN0SW5kZXggPSByZWdleHAubGFzdEluZGV4O1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lUmVnRXhwO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhlIGBzeW1ib2xgIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHN5bWJvbCBUaGUgc3ltYm9sIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBzeW1ib2wgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBjbG9uZVN5bWJvbChzeW1ib2wpIHtcbiAgcmV0dXJuIHN5bWJvbFZhbHVlT2YgPyBPYmplY3Qoc3ltYm9sVmFsdWVPZi5jYWxsKHN5bWJvbCkpIDoge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVTeW1ib2w7XG4iLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHR5cGVkQXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gdHlwZWRBcnJheSBUaGUgdHlwZWQgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHR5cGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBjbG9uZVR5cGVkQXJyYXkodHlwZWRBcnJheSwgaXNEZWVwKSB7XG4gIHZhciBidWZmZXIgPSBpc0RlZXAgPyBjbG9uZUFycmF5QnVmZmVyKHR5cGVkQXJyYXkuYnVmZmVyKSA6IHR5cGVkQXJyYXkuYnVmZmVyO1xuICByZXR1cm4gbmV3IHR5cGVkQXJyYXkuY29uc3RydWN0b3IoYnVmZmVyLCB0eXBlZEFycmF5LmJ5dGVPZmZzZXQsIHR5cGVkQXJyYXkubGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVR5cGVkQXJyYXk7XG4iLCJ2YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKlxuICogQ29tcGFyZXMgdmFsdWVzIHRvIHNvcnQgdGhlbSBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgc29ydCBvcmRlciBpbmRpY2F0b3IgZm9yIGB2YWx1ZWAuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVBc2NlbmRpbmcodmFsdWUsIG90aGVyKSB7XG4gIGlmICh2YWx1ZSAhPT0gb3RoZXIpIHtcbiAgICB2YXIgdmFsSXNEZWZpbmVkID0gdmFsdWUgIT09IHVuZGVmaW5lZCxcbiAgICAgICAgdmFsSXNOdWxsID0gdmFsdWUgPT09IG51bGwsXG4gICAgICAgIHZhbElzUmVmbGV4aXZlID0gdmFsdWUgPT09IHZhbHVlLFxuICAgICAgICB2YWxJc1N5bWJvbCA9IGlzU3ltYm9sKHZhbHVlKTtcblxuICAgIHZhciBvdGhJc0RlZmluZWQgPSBvdGhlciAhPT0gdW5kZWZpbmVkLFxuICAgICAgICBvdGhJc051bGwgPSBvdGhlciA9PT0gbnVsbCxcbiAgICAgICAgb3RoSXNSZWZsZXhpdmUgPSBvdGhlciA9PT0gb3RoZXIsXG4gICAgICAgIG90aElzU3ltYm9sID0gaXNTeW1ib2wob3RoZXIpO1xuXG4gICAgaWYgKCghb3RoSXNOdWxsICYmICFvdGhJc1N5bWJvbCAmJiAhdmFsSXNTeW1ib2wgJiYgdmFsdWUgPiBvdGhlcikgfHxcbiAgICAgICAgKHZhbElzU3ltYm9sICYmIG90aElzRGVmaW5lZCAmJiBvdGhJc1JlZmxleGl2ZSAmJiAhb3RoSXNOdWxsICYmICFvdGhJc1N5bWJvbCkgfHxcbiAgICAgICAgKHZhbElzTnVsbCAmJiBvdGhJc0RlZmluZWQgJiYgb3RoSXNSZWZsZXhpdmUpIHx8XG4gICAgICAgICghdmFsSXNEZWZpbmVkICYmIG90aElzUmVmbGV4aXZlKSB8fFxuICAgICAgICAhdmFsSXNSZWZsZXhpdmUpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICBpZiAoKCF2YWxJc051bGwgJiYgIXZhbElzU3ltYm9sICYmICFvdGhJc1N5bWJvbCAmJiB2YWx1ZSA8IG90aGVyKSB8fFxuICAgICAgICAob3RoSXNTeW1ib2wgJiYgdmFsSXNEZWZpbmVkICYmIHZhbElzUmVmbGV4aXZlICYmICF2YWxJc051bGwgJiYgIXZhbElzU3ltYm9sKSB8fFxuICAgICAgICAob3RoSXNOdWxsICYmIHZhbElzRGVmaW5lZCAmJiB2YWxJc1JlZmxleGl2ZSkgfHxcbiAgICAgICAgKCFvdGhJc0RlZmluZWQgJiYgdmFsSXNSZWZsZXhpdmUpIHx8XG4gICAgICAgICFvdGhJc1JlZmxleGl2ZSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgfVxuICByZXR1cm4gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb21wYXJlQXNjZW5kaW5nO1xuIiwidmFyIGNvbXBhcmVBc2NlbmRpbmcgPSByZXF1aXJlKCcuL19jb21wYXJlQXNjZW5kaW5nJyk7XG5cbi8qKlxuICogVXNlZCBieSBgXy5vcmRlckJ5YCB0byBjb21wYXJlIG11bHRpcGxlIHByb3BlcnRpZXMgb2YgYSB2YWx1ZSB0byBhbm90aGVyXG4gKiBhbmQgc3RhYmxlIHNvcnQgdGhlbS5cbiAqXG4gKiBJZiBgb3JkZXJzYCBpcyB1bnNwZWNpZmllZCwgYWxsIHZhbHVlcyBhcmUgc29ydGVkIGluIGFzY2VuZGluZyBvcmRlci4gT3RoZXJ3aXNlLFxuICogc3BlY2lmeSBhbiBvcmRlciBvZiBcImRlc2NcIiBmb3IgZGVzY2VuZGluZyBvciBcImFzY1wiIGZvciBhc2NlbmRpbmcgc29ydCBvcmRlclxuICogb2YgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbltdfHN0cmluZ1tdfSBvcmRlcnMgVGhlIG9yZGVyIHRvIHNvcnQgYnkgZm9yIGVhY2ggcHJvcGVydHkuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBzb3J0IG9yZGVyIGluZGljYXRvciBmb3IgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVNdWx0aXBsZShvYmplY3QsIG90aGVyLCBvcmRlcnMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBvYmpDcml0ZXJpYSA9IG9iamVjdC5jcml0ZXJpYSxcbiAgICAgIG90aENyaXRlcmlhID0gb3RoZXIuY3JpdGVyaWEsXG4gICAgICBsZW5ndGggPSBvYmpDcml0ZXJpYS5sZW5ndGgsXG4gICAgICBvcmRlcnNMZW5ndGggPSBvcmRlcnMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHJlc3VsdCA9IGNvbXBhcmVBc2NlbmRpbmcob2JqQ3JpdGVyaWFbaW5kZXhdLCBvdGhDcml0ZXJpYVtpbmRleF0pO1xuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIGlmIChpbmRleCA+PSBvcmRlcnNMZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHZhciBvcmRlciA9IG9yZGVyc1tpbmRleF07XG4gICAgICByZXR1cm4gcmVzdWx0ICogKG9yZGVyID09ICdkZXNjJyA/IC0xIDogMSk7XG4gICAgfVxuICB9XG4gIC8vIEZpeGVzIGFuIGBBcnJheSNzb3J0YCBidWcgaW4gdGhlIEpTIGVuZ2luZSBlbWJlZGRlZCBpbiBBZG9iZSBhcHBsaWNhdGlvbnNcbiAgLy8gdGhhdCBjYXVzZXMgaXQsIHVuZGVyIGNlcnRhaW4gY2lyY3Vtc3RhbmNlcywgdG8gcHJvdmlkZSB0aGUgc2FtZSB2YWx1ZSBmb3JcbiAgLy8gYG9iamVjdGAgYW5kIGBvdGhlcmAuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamFzaGtlbmFzL3VuZGVyc2NvcmUvcHVsbC8xMjQ3XG4gIC8vIGZvciBtb3JlIGRldGFpbHMuXG4gIC8vXG4gIC8vIFRoaXMgYWxzbyBlbnN1cmVzIGEgc3RhYmxlIHNvcnQgaW4gVjggYW5kIG90aGVyIGVuZ2luZXMuXG4gIC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD05MCBmb3IgbW9yZSBkZXRhaWxzLlxuICByZXR1cm4gb2JqZWN0LmluZGV4IC0gb3RoZXIuaW5kZXg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcGFyZU11bHRpcGxlO1xuIiwiLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weUFycmF5O1xuIiwidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKTtcblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb3BpZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weU9iamVjdChzb3VyY2UsIHByb3BzLCBvYmplY3QsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGlzTmV3ID0gIW9iamVjdDtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXG4gICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSlcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1ZhbHVlID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIGlmIChpc05ldykge1xuICAgICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weU9iamVjdDtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBzeW1ib2xzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIGZyb20uXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5U3ltYm9scyhzb3VyY2UsIG9iamVjdCkge1xuICByZXR1cm4gY29weU9iamVjdChzb3VyY2UsIGdldFN5bWJvbHMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5U3ltYm9scztcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGdldFN5bWJvbHNJbiA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHNJbicpO1xuXG4vKipcbiAqIENvcGllcyBvd24gYW5kIGluaGVyaXRlZCBzeW1ib2xzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIGZyb20uXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5U3ltYm9sc0luKHNvdXJjZSwgb2JqZWN0KSB7XG4gIHJldHVybiBjb3B5T2JqZWN0KHNvdXJjZSwgZ2V0U3ltYm9sc0luKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVN5bWJvbHNJbjtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcmVKc0RhdGE7XG4iLCJ2YXIgYmFzZVJlc3QgPSByZXF1aXJlKCcuL19iYXNlUmVzdCcpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9faXNJdGVyYXRlZUNhbGwnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gbGlrZSBgXy5hc3NpZ25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhc3NpZ25lciBUaGUgZnVuY3Rpb24gdG8gYXNzaWduIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFzc2lnbmVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVBc3NpZ25lcihhc3NpZ25lcikge1xuICByZXR1cm4gYmFzZVJlc3QoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2VzKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IHNvdXJjZXMubGVuZ3RoLFxuICAgICAgICBjdXN0b21pemVyID0gbGVuZ3RoID4gMSA/IHNvdXJjZXNbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQsXG4gICAgICAgIGd1YXJkID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbMl0gOiB1bmRlZmluZWQ7XG5cbiAgICBjdXN0b21pemVyID0gKGFzc2lnbmVyLmxlbmd0aCA+IDMgJiYgdHlwZW9mIGN1c3RvbWl6ZXIgPT0gJ2Z1bmN0aW9uJylcbiAgICAgID8gKGxlbmd0aC0tLCBjdXN0b21pemVyKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoZ3VhcmQgJiYgaXNJdGVyYXRlZUNhbGwoc291cmNlc1swXSwgc291cmNlc1sxXSwgZ3VhcmQpKSB7XG4gICAgICBjdXN0b21pemVyID0gbGVuZ3RoIDwgMyA/IHVuZGVmaW5lZCA6IGN1c3RvbWl6ZXI7XG4gICAgICBsZW5ndGggPSAxO1xuICAgIH1cbiAgICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNbaW5kZXhdO1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBhc3NpZ25lcihvYmplY3QsIHNvdXJjZSwgaW5kZXgsIGN1c3RvbWl6ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVBc3NpZ25lcjtcbiIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYGJhc2VFYWNoYCBvciBgYmFzZUVhY2hSaWdodGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRWFjaChlYWNoRnVuYywgZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIGlmIChjb2xsZWN0aW9uID09IG51bGwpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH1cbiAgICBpZiAoIWlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgICByZXR1cm4gZWFjaEZ1bmMoY29sbGVjdGlvbiwgaXRlcmF0ZWUpO1xuICAgIH1cbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gZnJvbVJpZ2h0ID8gbGVuZ3RoIDogLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gT2JqZWN0KGNvbGxlY3Rpb24pO1xuXG4gICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtpbmRleF0sIGluZGV4LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRWFjaDtcbiIsIi8qKlxuICogQ3JlYXRlcyBhIGJhc2UgZnVuY3Rpb24gZm9yIG1ldGhvZHMgbGlrZSBgXy5mb3JJbmAgYW5kIGBfLmZvck93bmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUZvcihmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgaXRlcmF0ZWUsIGtleXNGdW5jKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gT2JqZWN0KG9iamVjdCksXG4gICAgICAgIHByb3BzID0ga2V5c0Z1bmMob2JqZWN0KSxcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICB2YXIga2V5ID0gcHJvcHNbZnJvbVJpZ2h0ID8gbGVuZ3RoIDogKytpbmRleF07XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVba2V5XSwga2V5LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VGb3I7XG4iLCJ2YXIgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgXy5maW5kYCBvciBgXy5maW5kTGFzdGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZpbmRJbmRleEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGZpbmQgdGhlIGNvbGxlY3Rpb24gaW5kZXguXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmaW5kIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVGaW5kKGZpbmRJbmRleEZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgZnJvbUluZGV4KSB7XG4gICAgdmFyIGl0ZXJhYmxlID0gT2JqZWN0KGNvbGxlY3Rpb24pO1xuICAgIGlmICghaXNBcnJheUxpa2UoY29sbGVjdGlvbikpIHtcbiAgICAgIHZhciBpdGVyYXRlZSA9IGJhc2VJdGVyYXRlZShwcmVkaWNhdGUsIDMpO1xuICAgICAgY29sbGVjdGlvbiA9IGtleXMoY29sbGVjdGlvbik7XG4gICAgICBwcmVkaWNhdGUgPSBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpOyB9O1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXhGdW5jKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgZnJvbUluZGV4KTtcbiAgICByZXR1cm4gaW5kZXggPiAtMSA/IGl0ZXJhYmxlW2l0ZXJhdGVlID8gY29sbGVjdGlvbltpbmRleF0gOiBpbmRleF0gOiB1bmRlZmluZWQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRmluZDtcbiIsInZhciBiYXNlUmFuZ2UgPSByZXF1aXJlKCcuL19iYXNlUmFuZ2UnKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vX2lzSXRlcmF0ZWVDYWxsJyksXG4gICAgdG9GaW5pdGUgPSByZXF1aXJlKCcuL3RvRmluaXRlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBfLnJhbmdlYCBvciBgXy5yYW5nZVJpZ2h0YCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyByYW5nZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlUmFuZ2UoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihzdGFydCwgZW5kLCBzdGVwKSB7XG4gICAgaWYgKHN0ZXAgJiYgdHlwZW9mIHN0ZXAgIT0gJ251bWJlcicgJiYgaXNJdGVyYXRlZUNhbGwoc3RhcnQsIGVuZCwgc3RlcCkpIHtcbiAgICAgIGVuZCA9IHN0ZXAgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIEVuc3VyZSB0aGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAgICBzdGFydCA9IHRvRmluaXRlKHN0YXJ0KTtcbiAgICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVuZCA9IHN0YXJ0O1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmQgPSB0b0Zpbml0ZShlbmQpO1xuICAgIH1cbiAgICBzdGVwID0gc3RlcCA9PT0gdW5kZWZpbmVkID8gKHN0YXJ0IDwgZW5kID8gMSA6IC0xKSA6IHRvRmluaXRlKHN0ZXApO1xuICAgIHJldHVybiBiYXNlUmFuZ2Uoc3RhcnQsIGVuZCwgc3RlcCwgZnJvbVJpZ2h0KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVSYW5nZTtcbiIsInZhciBTZXQgPSByZXF1aXJlKCcuL19TZXQnKSxcbiAgICBub29wID0gcmVxdWlyZSgnLi9ub29wJyksXG4gICAgc2V0VG9BcnJheSA9IHJlcXVpcmUoJy4vX3NldFRvQXJyYXknKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2V0IG9iamVjdCBvZiBgdmFsdWVzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gYWRkIHRvIHRoZSBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgc2V0LlxuICovXG52YXIgY3JlYXRlU2V0ID0gIShTZXQgJiYgKDEgLyBzZXRUb0FycmF5KG5ldyBTZXQoWywtMF0pKVsxXSkgPT0gSU5GSU5JVFkpID8gbm9vcCA6IGZ1bmN0aW9uKHZhbHVlcykge1xuICByZXR1cm4gbmV3IFNldCh2YWx1ZXMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVTZXQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICB2YXIgZnVuYyA9IGdldE5hdGl2ZShPYmplY3QsICdkZWZpbmVQcm9wZXJ0eScpO1xuICAgIGZ1bmMoe30sICcnLCB7fSk7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmluZVByb3BlcnR5O1xuIiwidmFyIFNldENhY2hlID0gcmVxdWlyZSgnLi9fU2V0Q2FjaGUnKSxcbiAgICBhcnJheVNvbWUgPSByZXF1aXJlKCcuL19hcnJheVNvbWUnKSxcbiAgICBjYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2NhY2hlSGFzJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGFycmF5cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtBcnJheX0gb3RoZXIgVGhlIG90aGVyIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBhcnJheWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJyYXlzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQXJyYXlzKGFycmF5LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgYXJyTGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoZXIubGVuZ3RoO1xuXG4gIGlmIChhcnJMZW5ndGggIT0gb3RoTGVuZ3RoICYmICEoaXNQYXJ0aWFsICYmIG90aExlbmd0aCA+IGFyckxlbmd0aCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gQ2hlY2sgdGhhdCBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIGFyclN0YWNrZWQgPSBzdGFjay5nZXQoYXJyYXkpO1xuICB2YXIgb3RoU3RhY2tlZCA9IHN0YWNrLmdldChvdGhlcik7XG4gIGlmIChhcnJTdGFja2VkICYmIG90aFN0YWNrZWQpIHtcbiAgICByZXR1cm4gYXJyU3RhY2tlZCA9PSBvdGhlciAmJiBvdGhTdGFja2VkID09IGFycmF5O1xuICB9XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gdHJ1ZSxcbiAgICAgIHNlZW4gPSAoYml0bWFzayAmIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcpID8gbmV3IFNldENhY2hlIDogdW5kZWZpbmVkO1xuXG4gIHN0YWNrLnNldChhcnJheSwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIGFycmF5KTtcblxuICAvLyBJZ25vcmUgbm9uLWluZGV4IHByb3BlcnRpZXMuXG4gIHdoaWxlICgrK2luZGV4IDwgYXJyTGVuZ3RoKSB7XG4gICAgdmFyIGFyclZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2luZGV4XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBhcnJWYWx1ZSwgaW5kZXgsIG90aGVyLCBhcnJheSwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihhcnJWYWx1ZSwgb3RoVmFsdWUsIGluZGV4LCBhcnJheSwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgaWYgKGNvbXBhcmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChjb21wYXJlZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKHNlZW4pIHtcbiAgICAgIGlmICghYXJyYXlTb21lKG90aGVyLCBmdW5jdGlvbihvdGhWYWx1ZSwgb3RoSW5kZXgpIHtcbiAgICAgICAgICAgIGlmICghY2FjaGVIYXMoc2Vlbiwgb3RoSW5kZXgpICYmXG4gICAgICAgICAgICAgICAgKGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWVuLnB1c2gob3RoSW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCEoXG4gICAgICAgICAgYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8XG4gICAgICAgICAgICBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaylcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKGFycmF5KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcXVhbEFycmF5cztcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpLFxuICAgIGVxdWFsQXJyYXlzID0gcmVxdWlyZSgnLi9fZXF1YWxBcnJheXMnKSxcbiAgICBtYXBUb0FycmF5ID0gcmVxdWlyZSgnLi9fbWFwVG9BcnJheScpLFxuICAgIHNldFRvQXJyYXkgPSByZXF1aXJlKCcuL19zZXRUb0FycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGNvbXBhcmluZyBvYmplY3RzIG9mXG4gKiB0aGUgc2FtZSBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY29tcGFyaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3RzIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCB0YWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgIChvYmplY3QuYnl0ZU9mZnNldCAhPSBvdGhlci5ieXRlT2Zmc2V0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBvYmplY3QuYnVmZmVyO1xuICAgICAgb3RoZXIgPSBvdGhlci5idWZmZXI7XG5cbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgICFlcXVhbEZ1bmMobmV3IFVpbnQ4QXJyYXkob2JqZWN0KSwgbmV3IFVpbnQ4QXJyYXkob3RoZXIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgICAvLyBDb2VyY2UgYm9vbGVhbnMgdG8gYDFgIG9yIGAwYCBhbmQgZGF0ZXMgdG8gbWlsbGlzZWNvbmRzLlxuICAgICAgLy8gSW52YWxpZCBkYXRlcyBhcmUgY29lcmNlZCB0byBgTmFOYC5cbiAgICAgIHJldHVybiBlcSgrb2JqZWN0LCArb3RoZXIpO1xuXG4gICAgY2FzZSBlcnJvclRhZzpcbiAgICAgIHJldHVybiBvYmplY3QubmFtZSA9PSBvdGhlci5uYW1lICYmIG9iamVjdC5tZXNzYWdlID09IG90aGVyLm1lc3NhZ2U7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIC8vIENvZXJjZSByZWdleGVzIHRvIHN0cmluZ3MgYW5kIHRyZWF0IHN0cmluZ3MsIHByaW1pdGl2ZXMgYW5kIG9iamVjdHMsXG4gICAgICAvLyBhcyBlcXVhbC4gU2VlIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1yZWdleHAucHJvdG90eXBlLnRvc3RyaW5nXG4gICAgICAvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgcmV0dXJuIG9iamVjdCA9PSAob3RoZXIgKyAnJyk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHZhciBjb252ZXJ0ID0gbWFwVG9BcnJheTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRztcbiAgICAgIGNvbnZlcnQgfHwgKGNvbnZlcnQgPSBzZXRUb0FycmF5KTtcblxuICAgICAgaWYgKG9iamVjdC5zaXplICE9IG90aGVyLnNpemUgJiYgIWlzUGFydGlhbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gICAgICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICAgICAgaWYgKHN0YWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gICAgICB9XG4gICAgICBiaXRtYXNrIHw9IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUc7XG5cbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICAgICAgdmFyIHJlc3VsdCA9IGVxdWFsQXJyYXlzKGNvbnZlcnQob2JqZWN0KSwgY29udmVydChvdGhlciksIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICAgICAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICBpZiAoc3ltYm9sVmFsdWVPZikge1xuICAgICAgICByZXR1cm4gc3ltYm9sVmFsdWVPZi5jYWxsKG9iamVjdCkgPT0gc3ltYm9sVmFsdWVPZi5jYWxsKG90aGVyKTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxCeVRhZztcbiIsInZhciBnZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5cycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDE7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBvYmplY3RzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBvYmpQcm9wcyA9IGdldEFsbEtleXMob2JqZWN0KSxcbiAgICAgIG9iakxlbmd0aCA9IG9ialByb3BzLmxlbmd0aCxcbiAgICAgIG90aFByb3BzID0gZ2V0QWxsS2V5cyhvdGhlciksXG4gICAgICBvdGhMZW5ndGggPSBvdGhQcm9wcy5sZW5ndGg7XG5cbiAgaWYgKG9iakxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIWlzUGFydGlhbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgaW5kZXggPSBvYmpMZW5ndGg7XG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgdmFyIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICBpZiAoIShpc1BhcnRpYWwgPyBrZXkgaW4gb3RoZXIgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCBrZXkpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICAvLyBDaGVjayB0aGF0IGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgb2JqU3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICB2YXIgb3RoU3RhY2tlZCA9IHN0YWNrLmdldChvdGhlcik7XG4gIGlmIChvYmpTdGFja2VkICYmIG90aFN0YWNrZWQpIHtcbiAgICByZXR1cm4gb2JqU3RhY2tlZCA9PSBvdGhlciAmJiBvdGhTdGFja2VkID09IG9iamVjdDtcbiAgfVxuICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIG9iamVjdCk7XG5cbiAgdmFyIHNraXBDdG9yID0gaXNQYXJ0aWFsO1xuICB3aGlsZSAoKytpbmRleCA8IG9iakxlbmd0aCkge1xuICAgIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltrZXldO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIG9ialZhbHVlLCBrZXksIG90aGVyLCBvYmplY3QsIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIob2JqVmFsdWUsIG90aFZhbHVlLCBrZXksIG9iamVjdCwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKCEoY29tcGFyZWQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gKG9ialZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMob2JqVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpXG4gICAgICAgICAgOiBjb21wYXJlZFxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBza2lwQ3RvciB8fCAoc2tpcEN0b3IgPSBrZXkgPT0gJ2NvbnN0cnVjdG9yJyk7XG4gIH1cbiAgaWYgKHJlc3VsdCAmJiAhc2tpcEN0b3IpIHtcbiAgICB2YXIgb2JqQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgICAgb3RoQ3RvciA9IG90aGVyLmNvbnN0cnVjdG9yO1xuXG4gICAgLy8gTm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWwuXG4gICAgaWYgKG9iakN0b3IgIT0gb3RoQ3RvciAmJlxuICAgICAgICAoJ2NvbnN0cnVjdG9yJyBpbiBvYmplY3QgJiYgJ2NvbnN0cnVjdG9yJyBpbiBvdGhlcikgJiZcbiAgICAgICAgISh0eXBlb2Ygb2JqQ3RvciA9PSAnZnVuY3Rpb24nICYmIG9iakN0b3IgaW5zdGFuY2VvZiBvYmpDdG9yICYmXG4gICAgICAgICAgdHlwZW9mIG90aEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvdGhDdG9yIGluc3RhbmNlb2Ygb3RoQ3RvcikpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcXVhbE9iamVjdHM7XG4iLCJ2YXIgZmxhdHRlbiA9IHJlcXVpcmUoJy4vZmxhdHRlbicpLFxuICAgIG92ZXJSZXN0ID0gcmVxdWlyZSgnLi9fb3ZlclJlc3QnKSxcbiAgICBzZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX3NldFRvU3RyaW5nJyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggZmxhdHRlbnMgdGhlIHJlc3QgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gZmxhdFJlc3QoZnVuYykge1xuICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgdW5kZWZpbmVkLCBmbGF0dGVuKSwgZnVuYyArICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmbGF0UmVzdDtcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcbiIsInZhciBiYXNlR2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRBbGxLZXlzJyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5cywgZ2V0U3ltYm9scyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0QWxsS2V5cztcbiIsInZhciBiYXNlR2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRBbGxLZXlzJyksXG4gICAgZ2V0U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9sc0luJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi9rZXlzSW4nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kXG4gKiBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNJbiwgZ2V0U3ltYm9sc0luKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzSW47XG4iLCJ2YXIgaXNLZXlhYmxlID0gcmVxdWlyZSgnLi9faXNLZXlhYmxlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0YSBmb3IgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHJlZmVyZW5jZSBrZXkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGdldE1hcERhdGEobWFwLCBrZXkpIHtcbiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187XG4gIHJldHVybiBpc0tleWFibGUoa2V5KVxuICAgID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddXG4gICAgOiBkYXRhLm1hcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRNYXBEYXRhO1xuIiwidmFyIGlzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX2lzU3RyaWN0Q29tcGFyYWJsZScpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBwcm9wZXJ0eSBuYW1lcywgdmFsdWVzLCBhbmQgY29tcGFyZSBmbGFncyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBtYXRjaCBkYXRhIG9mIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBnZXRNYXRjaERhdGEob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBrZXlzKG9iamVjdCksXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIHZhciBrZXkgPSByZXN1bHRbbGVuZ3RoXSxcbiAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XTtcblxuICAgIHJlc3VsdFtsZW5ndGhdID0gW2tleSwgdmFsdWUsIGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSldO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWF0Y2hEYXRhO1xuIiwidmFyIGJhc2VJc05hdGl2ZSA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hdGl2ZScpLFxuICAgIGdldFZhbHVlID0gcmVxdWlyZSgnLi9fZ2V0VmFsdWUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXROYXRpdmU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgZ2V0UHJvdG90eXBlID0gb3ZlckFyZyhPYmplY3QuZ2V0UHJvdG90eXBlT2YsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UHJvdG90eXBlO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwidmFyIGFycmF5RmlsdGVyID0gcmVxdWlyZSgnLi9fYXJyYXlGaWx0ZXInKSxcbiAgICBzdHViQXJyYXkgPSByZXF1aXJlKCcuL3N0dWJBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5RmlsdGVyKG5hdGl2ZUdldFN5bWJvbHMob2JqZWN0KSwgZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBzeW1ib2wpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9scztcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIHN0dWJBcnJheSA9IHJlcXVpcmUoJy4vc3R1YkFycmF5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHNJbiA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgd2hpbGUgKG9iamVjdCkge1xuICAgIGFycmF5UHVzaChyZXN1bHQsIGdldFN5bWJvbHMob2JqZWN0KSk7XG4gICAgb2JqZWN0ID0gZ2V0UHJvdG90eXBlKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9sc0luO1xuIiwidmFyIERhdGFWaWV3ID0gcmVxdWlyZSgnLi9fRGF0YVZpZXcnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBQcm9taXNlID0gcmVxdWlyZSgnLi9fUHJvbWlzZScpLFxuICAgIFNldCA9IHJlcXVpcmUoJy4vX1NldCcpLFxuICAgIFdlYWtNYXAgPSByZXF1aXJlKCcuL19XZWFrTWFwJyksXG4gICAgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VHZXRUYWcodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGFnO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VmFsdWU7XG4iLCJ2YXIgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGV4aXN0cyBvbiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYXNGdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjayBwcm9wZXJ0aWVzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzUGF0aChvYmplY3QsIHBhdGgsIGhhc0Z1bmMpIHtcbiAgcGF0aCA9IGNhc3RQYXRoKHBhdGgsIG9iamVjdCk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHRvS2V5KHBhdGhbaW5kZXhdKTtcbiAgICBpZiAoIShyZXN1bHQgPSBvYmplY3QgIT0gbnVsbCAmJiBoYXNGdW5jKG9iamVjdCwga2V5KSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBvYmplY3QgPSBvYmplY3Rba2V5XTtcbiAgfVxuICBpZiAocmVzdWx0IHx8ICsraW5kZXggIT0gbGVuZ3RoKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBsZW5ndGggPSBvYmplY3QgPT0gbnVsbCA/IDAgOiBvYmplY3QubGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzUGF0aDtcbiIsIi8qKiBVc2VkIHRvIGNvbXBvc2UgdW5pY29kZSBjaGFyYWN0ZXIgY2xhc3Nlcy4gKi9cbnZhciByc0FzdHJhbFJhbmdlID0gJ1xcXFx1ZDgwMC1cXFxcdWRmZmYnLFxuICAgIHJzQ29tYm9NYXJrc1JhbmdlID0gJ1xcXFx1MDMwMC1cXFxcdTAzNmYnLFxuICAgIHJlQ29tYm9IYWxmTWFya3NSYW5nZSA9ICdcXFxcdWZlMjAtXFxcXHVmZTJmJyxcbiAgICByc0NvbWJvU3ltYm9sc1JhbmdlID0gJ1xcXFx1MjBkMC1cXFxcdTIwZmYnLFxuICAgIHJzQ29tYm9SYW5nZSA9IHJzQ29tYm9NYXJrc1JhbmdlICsgcmVDb21ib0hhbGZNYXJrc1JhbmdlICsgcnNDb21ib1N5bWJvbHNSYW5nZSxcbiAgICByc1ZhclJhbmdlID0gJ1xcXFx1ZmUwZVxcXFx1ZmUwZic7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgdW5pY29kZSBjYXB0dXJlIGdyb3Vwcy4gKi9cbnZhciByc1pXSiA9ICdcXFxcdTIwMGQnO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgc3RyaW5ncyB3aXRoIFt6ZXJvLXdpZHRoIGpvaW5lcnMgb3IgY29kZSBwb2ludHMgZnJvbSB0aGUgYXN0cmFsIHBsYW5lc10oaHR0cDovL2Vldi5lZS9ibG9nLzIwMTUvMDkvMTIvZGFyay1jb3JuZXJzLW9mLXVuaWNvZGUvKS4gKi9cbnZhciByZUhhc1VuaWNvZGUgPSBSZWdFeHAoJ1snICsgcnNaV0ogKyByc0FzdHJhbFJhbmdlICArIHJzQ29tYm9SYW5nZSArIHJzVmFyUmFuZ2UgKyAnXScpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgc3RyaW5nYCBjb250YWlucyBVbmljb2RlIHN5bWJvbHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBpbnNwZWN0LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGEgc3ltYm9sIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc1VuaWNvZGUoc3RyaW5nKSB7XG4gIHJldHVybiByZUhhc1VuaWNvZGUudGVzdChzdHJpbmcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc1VuaWNvZGU7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaERlbGV0ZTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hHZXQ7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoSGFzO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoU2V0O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBhcnJheSBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQXJyYXkoYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IG5ldyBhcnJheS5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIC8vIEFkZCBwcm9wZXJ0aWVzIGFzc2lnbmVkIGJ5IGBSZWdFeHAjZXhlY2AuXG4gIGlmIChsZW5ndGggJiYgdHlwZW9mIGFycmF5WzBdID09ICdzdHJpbmcnICYmIGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksICdpbmRleCcpKSB7XG4gICAgcmVzdWx0LmluZGV4ID0gYXJyYXkuaW5kZXg7XG4gICAgcmVzdWx0LmlucHV0ID0gYXJyYXkuaW5wdXQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVBcnJheTtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpLFxuICAgIGNsb25lRGF0YVZpZXcgPSByZXF1aXJlKCcuL19jbG9uZURhdGFWaWV3JyksXG4gICAgY2xvbmVSZWdFeHAgPSByZXF1aXJlKCcuL19jbG9uZVJlZ0V4cCcpLFxuICAgIGNsb25lU3ltYm9sID0gcmVxdWlyZSgnLi9fY2xvbmVTeW1ib2wnKSxcbiAgICBjbG9uZVR5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19jbG9uZVR5cGVkQXJyYXknKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lIGJhc2VkIG9uIGl0cyBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY2xvbmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE1hcGAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgYFNldGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUJ5VGFnKG9iamVjdCwgdGFnLCBpc0RlZXApIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIHJldHVybiBjbG9uZUFycmF5QnVmZmVyKG9iamVjdCk7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKCtvYmplY3QpO1xuXG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIHJldHVybiBjbG9uZURhdGFWaWV3KG9iamVjdCwgaXNEZWVwKTtcblxuICAgIGNhc2UgZmxvYXQzMlRhZzogY2FzZSBmbG9hdDY0VGFnOlxuICAgIGNhc2UgaW50OFRhZzogY2FzZSBpbnQxNlRhZzogY2FzZSBpbnQzMlRhZzpcbiAgICBjYXNlIHVpbnQ4VGFnOiBjYXNlIHVpbnQ4Q2xhbXBlZFRhZzogY2FzZSB1aW50MTZUYWc6IGNhc2UgdWludDMyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lVHlwZWRBcnJheShvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcjtcblxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKG9iamVjdCk7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVJlZ0V4cChvYmplY3QpO1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3I7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVN5bWJvbChvYmplY3QpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQnlUYWc7XG4iLCJ2YXIgYmFzZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX2Jhc2VDcmVhdGUnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNQcm90b3R5cGUob2JqZWN0KSlcbiAgICA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlKG9iamVjdCkpXG4gICAgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVPYmplY3Q7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcHJlYWRhYmxlU3ltYm9sID0gU3ltYm9sID8gU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZSA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGZsYXR0ZW5hYmxlIGBhcmd1bWVudHNgIG9iamVjdCBvciBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmbGF0dGVuYWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0ZsYXR0ZW5hYmxlKHZhbHVlKSB7XG4gIHJldHVybiBpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkgfHxcbiAgICAhIShzcHJlYWRhYmxlU3ltYm9sICYmIHZhbHVlICYmIHZhbHVlW3NwcmVhZGFibGVTeW1ib2xdKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0ZsYXR0ZW5hYmxlO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG5cbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGUgPT0gJ251bWJlcicgfHxcbiAgICAgICh0eXBlICE9ICdzeW1ib2wnICYmIHJlSXNVaW50LnRlc3QodmFsdWUpKSkgJiZcbiAgICAgICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJ1xuICAgICAgICA/IChpc0FycmF5TGlrZShvYmplY3QpICYmIGlzSW5kZXgoaW5kZXgsIG9iamVjdC5sZW5ndGgpKVxuICAgICAgICA6ICh0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdClcbiAgICAgICkge1xuICAgIHJldHVybiBlcShvYmplY3RbaW5kZXhdLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlSXNEZWVwUHJvcCA9IC9cXC58XFxbKD86W15bXFxdXSp8KFtcIiddKSg/Oig/IVxcMSlbXlxcXFxdfFxcXFwuKSo/XFwxKVxcXS8sXG4gICAgcmVJc1BsYWluUHJvcCA9IC9eXFx3KiQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSBhbmQgbm90IGEgcHJvcGVydHkgcGF0aC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5KHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nIHx8XG4gICAgICB2YWx1ZSA9PSBudWxsIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiByZUlzUGxhaW5Qcm9wLnRlc3QodmFsdWUpIHx8ICFyZUlzRGVlcFByb3AudGVzdCh2YWx1ZSkgfHxcbiAgICAob2JqZWN0ICE9IG51bGwgJiYgdmFsdWUgaW4gT2JqZWN0KG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5YWJsZTtcbiIsInZhciBjb3JlSnNEYXRhID0gcmVxdWlyZSgnLi9fY29yZUpzRGF0YScpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTWFza2VkO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUHJvdG90eXBlO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciBzdHJpY3QgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaWYgc3VpdGFibGUgZm9yIHN0cmljdFxuICogIGVxdWFsaXR5IGNvbXBhcmlzb25zLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlICYmICFpc09iamVjdCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTdHJpY3RDb21wYXJhYmxlO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IFtdO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUNsZWFyO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlRGVsZXRlO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUdldDtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGFzc29jSW5kZXhPZih0aGlzLl9fZGF0YV9fLCBrZXkpID4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlSGFzO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlU2V0O1xuIiwidmFyIEhhc2ggPSByZXF1aXJlKCcuL19IYXNoJyksXG4gICAgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuc2l6ZSA9IDA7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUNsZWFyO1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlRGVsZXRlO1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUdldDtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIG1hcCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlSGFzO1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZVNldDtcbiIsIi8qKlxuICogQ29udmVydHMgYG1hcGAgdG8gaXRzIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGtleS12YWx1ZSBwYWlycy5cbiAqL1xuZnVuY3Rpb24gbWFwVG9BcnJheShtYXApIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShtYXAuc2l6ZSk7XG5cbiAgbWFwLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IFtrZXksIHZhbHVlXTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwVG9BcnJheTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBtYXRjaGVzUHJvcGVydHlgIGZvciBzb3VyY2UgdmFsdWVzIHN1aXRhYmxlXG4gKiBmb3Igc3RyaWN0IGVxdWFsaXR5IGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHZhbHVlIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUoa2V5LCBzcmNWYWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Rba2V5XSA9PT0gc3JjVmFsdWUgJiZcbiAgICAgIChzcmNWYWx1ZSAhPT0gdW5kZWZpbmVkIHx8IChrZXkgaW4gT2JqZWN0KG9iamVjdCkpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZTtcbiIsInZhciBtZW1vaXplID0gcmVxdWlyZSgnLi9tZW1vaXplJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBtYXhpbXVtIG1lbW9pemUgY2FjaGUgc2l6ZS4gKi9cbnZhciBNQVhfTUVNT0laRV9TSVpFID0gNTAwO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5tZW1vaXplYCB3aGljaCBjbGVhcnMgdGhlIG1lbW9pemVkIGZ1bmN0aW9uJ3NcbiAqIGNhY2hlIHdoZW4gaXQgZXhjZWVkcyBgTUFYX01FTU9JWkVfU0laRWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGhhdmUgaXRzIG91dHB1dCBtZW1vaXplZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IG1lbW9pemVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBtZW1vaXplQ2FwcGVkKGZ1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IG1lbW9pemUoZnVuYywgZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKGNhY2hlLnNpemUgPT09IE1BWF9NRU1PSVpFX1NJWkUpIHtcbiAgICAgIGNhY2hlLmNsZWFyKCk7XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG4gIH0pO1xuXG4gIHZhciBjYWNoZSA9IHJlc3VsdC5jYWNoZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZW1vaXplQ2FwcGVkO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUNyZWF0ZTtcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5cztcbiIsIi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlXG4gKiBbYE9iamVjdC5rZXlzYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBleGNlcHQgdGhhdCBpdCBpbmNsdWRlcyBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBuYXRpdmVLZXlzSW4ob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgaWYgKG9iamVjdCAhPSBudWxsKSB7XG4gICAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXNJbjtcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIC8vIFVzZSBgdXRpbC50eXBlc2AgZm9yIE5vZGUuanMgMTArLlxuICAgIHZhciB0eXBlcyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlICYmIGZyZWVNb2R1bGUucmVxdWlyZSgndXRpbCcpLnR5cGVzO1xuXG4gICAgaWYgKHR5cGVzKSB7XG4gICAgICByZXR1cm4gdHlwZXM7XG4gICAgfVxuXG4gICAgLy8gTGVnYWN5IGBwcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKWAgZm9yIE5vZGUuanMgPCAxMC5cbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVVdGlsO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0VG9TdHJpbmc7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyQXJnO1xuIiwidmFyIGFwcGx5ID0gcmVxdWlyZSgnLi9fYXBwbHknKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVJlc3RgIHdoaWNoIHRyYW5zZm9ybXMgdGhlIHJlc3QgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIHJlc3QgYXJyYXkgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCB0cmFuc2Zvcm0pIHtcbiAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogc3RhcnQsIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgYXJyYXkgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGFycmF5W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIGluZGV4ID0gLTE7XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gdHJhbnNmb3JtKGFycmF5KTtcbiAgICByZXR1cm4gYXBwbHkoZnVuYywgdGhpcywgb3RoZXJBcmdzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyUmVzdDtcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAsIHVubGVzcyBga2V5YCBpcyBcIl9fcHJvdG9fX1wiIG9yIFwiY29uc3RydWN0b3JcIi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHNhZmVHZXQob2JqZWN0LCBrZXkpIHtcbiAgaWYgKGtleSA9PT0gJ2NvbnN0cnVjdG9yJyAmJiB0eXBlb2Ygb2JqZWN0W2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNhZmVHZXQ7XG4iLCIvKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgYWRkXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBhbGlhcyBwdXNoXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjYWNoZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUFkZCh2YWx1ZSkge1xuICB0aGlzLl9fZGF0YV9fLnNldCh2YWx1ZSwgSEFTSF9VTkRFRklORUQpO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYWNoZUFkZDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgaW4gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVIYXModmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYWNoZUhhcztcbiIsIi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9BcnJheTtcbiIsInZhciBiYXNlU2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlU2V0VG9TdHJpbmcnKSxcbiAgICBzaG9ydE91dCA9IHJlcXVpcmUoJy4vX3Nob3J0T3V0Jyk7XG5cbi8qKlxuICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYGZ1bmNgIHRvIHJldHVybiBgc3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9TdHJpbmc7XG4iLCIvKiogVXNlZCB0byBkZXRlY3QgaG90IGZ1bmN0aW9ucyBieSBudW1iZXIgb2YgY2FsbHMgd2l0aGluIGEgc3BhbiBvZiBtaWxsaXNlY29uZHMuICovXG52YXIgSE9UX0NPVU5UID0gODAwLFxuICAgIEhPVF9TUEFOID0gMTY7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVOb3cgPSBEYXRlLm5vdztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCdsbCBzaG9ydCBvdXQgYW5kIGludm9rZSBgaWRlbnRpdHlgIGluc3RlYWRcbiAqIG9mIGBmdW5jYCB3aGVuIGl0J3MgY2FsbGVkIGBIT1RfQ09VTlRgIG9yIG1vcmUgdGltZXMgaW4gYEhPVF9TUEFOYFxuICogbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNob3J0YWJsZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gc2hvcnRPdXQoZnVuYykge1xuICB2YXIgY291bnQgPSAwLFxuICAgICAgbGFzdENhbGxlZCA9IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFtcCA9IG5hdGl2ZU5vdygpLFxuICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXG4gICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG4gICAgICBpZiAoKytjb3VudCA+PSBIT1RfQ09VTlQpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvcnRPdXQ7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0RlbGV0ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0dldDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tIYXM7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja1NldDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmluZGV4T2ZgIHdoaWNoIHBlcmZvcm1zIHN0cmljdCBlcXVhbGl0eVxuICogY29tcGFyaXNvbnMgb2YgdmFsdWVzLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgdmFyIGluZGV4ID0gZnJvbUluZGV4IC0gMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpY3RJbmRleE9mO1xuIiwidmFyIGFzY2lpU2l6ZSA9IHJlcXVpcmUoJy4vX2FzY2lpU2l6ZScpLFxuICAgIGhhc1VuaWNvZGUgPSByZXF1aXJlKCcuL19oYXNVbmljb2RlJyksXG4gICAgdW5pY29kZVNpemUgPSByZXF1aXJlKCcuL191bmljb2RlU2l6ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG51bWJlciBvZiBzeW1ib2xzIGluIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHN0cmluZyBzaXplLlxuICovXG5mdW5jdGlvbiBzdHJpbmdTaXplKHN0cmluZykge1xuICByZXR1cm4gaGFzVW5pY29kZShzdHJpbmcpXG4gICAgPyB1bmljb2RlU2l6ZShzdHJpbmcpXG4gICAgOiBhc2NpaVNpemUoc3RyaW5nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdTaXplO1xuIiwidmFyIG1lbW9pemVDYXBwZWQgPSByZXF1aXJlKCcuL19tZW1vaXplQ2FwcGVkJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZVByb3BOYW1lID0gL1teLltcXF1dK3xcXFsoPzooLT9cXGQrKD86XFwuXFxkKyk/KXwoW1wiJ10pKCg/Oig/IVxcMilbXlxcXFxdfFxcXFwuKSo/KVxcMilcXF18KD89KD86XFwufFxcW1xcXSkoPzpcXC58XFxbXFxdfCQpKS9nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBiYWNrc2xhc2hlcyBpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUVzY2FwZUNoYXIgPSAvXFxcXChcXFxcKT8vZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0byBhIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG52YXIgc3RyaW5nVG9QYXRoID0gbWVtb2l6ZUNhcHBlZChmdW5jdGlvbihzdHJpbmcpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAoc3RyaW5nLmNoYXJDb2RlQXQoMCkgPT09IDQ2IC8qIC4gKi8pIHtcbiAgICByZXN1bHQucHVzaCgnJyk7XG4gIH1cbiAgc3RyaW5nLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN1YlN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3ViU3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdUb1BhdGg7XG4iLCJ2YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBrZXkgaWYgaXQncyBub3QgYSBzdHJpbmcgb3Igc3ltYm9sLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS5cbiAqL1xuZnVuY3Rpb24gdG9LZXkodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvS2V5O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU291cmNlO1xuIiwiLyoqIFVzZWQgdG8gbWF0Y2ggYSBzaW5nbGUgd2hpdGVzcGFjZSBjaGFyYWN0ZXIuICovXG52YXIgcmVXaGl0ZXNwYWNlID0gL1xccy87XG5cbi8qKlxuICogVXNlZCBieSBgXy50cmltYCBhbmQgYF8udHJpbUVuZGAgdG8gZ2V0IHRoZSBpbmRleCBvZiB0aGUgbGFzdCBub24td2hpdGVzcGFjZVxuICogY2hhcmFjdGVyIG9mIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBsYXN0IG5vbi13aGl0ZXNwYWNlIGNoYXJhY3Rlci5cbiAqL1xuZnVuY3Rpb24gdHJpbW1lZEVuZEluZGV4KHN0cmluZykge1xuICB2YXIgaW5kZXggPSBzdHJpbmcubGVuZ3RoO1xuXG4gIHdoaWxlIChpbmRleC0tICYmIHJlV2hpdGVzcGFjZS50ZXN0KHN0cmluZy5jaGFyQXQoaW5kZXgpKSkge31cbiAgcmV0dXJuIGluZGV4O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRyaW1tZWRFbmRJbmRleDtcbiIsIi8qKiBVc2VkIHRvIGNvbXBvc2UgdW5pY29kZSBjaGFyYWN0ZXIgY2xhc3Nlcy4gKi9cbnZhciByc0FzdHJhbFJhbmdlID0gJ1xcXFx1ZDgwMC1cXFxcdWRmZmYnLFxuICAgIHJzQ29tYm9NYXJrc1JhbmdlID0gJ1xcXFx1MDMwMC1cXFxcdTAzNmYnLFxuICAgIHJlQ29tYm9IYWxmTWFya3NSYW5nZSA9ICdcXFxcdWZlMjAtXFxcXHVmZTJmJyxcbiAgICByc0NvbWJvU3ltYm9sc1JhbmdlID0gJ1xcXFx1MjBkMC1cXFxcdTIwZmYnLFxuICAgIHJzQ29tYm9SYW5nZSA9IHJzQ29tYm9NYXJrc1JhbmdlICsgcmVDb21ib0hhbGZNYXJrc1JhbmdlICsgcnNDb21ib1N5bWJvbHNSYW5nZSxcbiAgICByc1ZhclJhbmdlID0gJ1xcXFx1ZmUwZVxcXFx1ZmUwZic7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgdW5pY29kZSBjYXB0dXJlIGdyb3Vwcy4gKi9cbnZhciByc0FzdHJhbCA9ICdbJyArIHJzQXN0cmFsUmFuZ2UgKyAnXScsXG4gICAgcnNDb21ibyA9ICdbJyArIHJzQ29tYm9SYW5nZSArICddJyxcbiAgICByc0ZpdHogPSAnXFxcXHVkODNjW1xcXFx1ZGZmYi1cXFxcdWRmZmZdJyxcbiAgICByc01vZGlmaWVyID0gJyg/OicgKyByc0NvbWJvICsgJ3wnICsgcnNGaXR6ICsgJyknLFxuICAgIHJzTm9uQXN0cmFsID0gJ1teJyArIHJzQXN0cmFsUmFuZ2UgKyAnXScsXG4gICAgcnNSZWdpb25hbCA9ICcoPzpcXFxcdWQ4M2NbXFxcXHVkZGU2LVxcXFx1ZGRmZl0pezJ9JyxcbiAgICByc1N1cnJQYWlyID0gJ1tcXFxcdWQ4MDAtXFxcXHVkYmZmXVtcXFxcdWRjMDAtXFxcXHVkZmZmXScsXG4gICAgcnNaV0ogPSAnXFxcXHUyMDBkJztcblxuLyoqIFVzZWQgdG8gY29tcG9zZSB1bmljb2RlIHJlZ2V4ZXMuICovXG52YXIgcmVPcHRNb2QgPSByc01vZGlmaWVyICsgJz8nLFxuICAgIHJzT3B0VmFyID0gJ1snICsgcnNWYXJSYW5nZSArICddPycsXG4gICAgcnNPcHRKb2luID0gJyg/OicgKyByc1pXSiArICcoPzonICsgW3JzTm9uQXN0cmFsLCByc1JlZ2lvbmFsLCByc1N1cnJQYWlyXS5qb2luKCd8JykgKyAnKScgKyByc09wdFZhciArIHJlT3B0TW9kICsgJykqJyxcbiAgICByc1NlcSA9IHJzT3B0VmFyICsgcmVPcHRNb2QgKyByc09wdEpvaW4sXG4gICAgcnNTeW1ib2wgPSAnKD86JyArIFtyc05vbkFzdHJhbCArIHJzQ29tYm8gKyAnPycsIHJzQ29tYm8sIHJzUmVnaW9uYWwsIHJzU3VyclBhaXIsIHJzQXN0cmFsXS5qb2luKCd8JykgKyAnKSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIFtzdHJpbmcgc3ltYm9sc10oaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtdW5pY29kZSkuICovXG52YXIgcmVVbmljb2RlID0gUmVnRXhwKHJzRml0eiArICcoPz0nICsgcnNGaXR6ICsgJyl8JyArIHJzU3ltYm9sICsgcnNTZXEsICdnJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgc2l6ZSBvZiBhIFVuaWNvZGUgYHN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyBpbnNwZWN0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgc3RyaW5nIHNpemUuXG4gKi9cbmZ1bmN0aW9uIHVuaWNvZGVTaXplKHN0cmluZykge1xuICB2YXIgcmVzdWx0ID0gcmVVbmljb2RlLmxhc3RJbmRleCA9IDA7XG4gIHdoaWxlIChyZVVuaWNvZGUudGVzdChzdHJpbmcpKSB7XG4gICAgKytyZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1bmljb2RlU2l6ZTtcbiIsInZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCcuL19iYXNlQ2xvbmUnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY2xvbmluZy4gKi9cbnZhciBDTE9ORV9TWU1CT0xTX0ZMQUcgPSA0O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzaGFsbG93IGNsb25lIG9mIGB2YWx1ZWAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb24gdGhlXG4gKiBbc3RydWN0dXJlZCBjbG9uZSBhbGdvcml0aG1dKGh0dHBzOi8vbWRuLmlvL1N0cnVjdHVyZWRfY2xvbmVfYWxnb3JpdGhtKVxuICogYW5kIHN1cHBvcnRzIGNsb25pbmcgYXJyYXlzLCBhcnJheSBidWZmZXJzLCBib29sZWFucywgZGF0ZSBvYmplY3RzLCBtYXBzLFxuICogbnVtYmVycywgYE9iamVjdGAgb2JqZWN0cywgcmVnZXhlcywgc2V0cywgc3RyaW5ncywgc3ltYm9scywgYW5kIHR5cGVkXG4gKiBhcnJheXMuIFRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGBhcmd1bWVudHNgIG9iamVjdHMgYXJlIGNsb25lZFxuICogYXMgcGxhaW4gb2JqZWN0cy4gQW4gZW1wdHkgb2JqZWN0IGlzIHJldHVybmVkIGZvciB1bmNsb25lYWJsZSB2YWx1ZXMgc3VjaFxuICogYXMgZXJyb3Igb2JqZWN0cywgZnVuY3Rpb25zLCBET00gbm9kZXMsIGFuZCBXZWFrTWFwcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICogQHNlZSBfLmNsb25lRGVlcFxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFt7ICdhJzogMSB9LCB7ICdiJzogMiB9XTtcbiAqXG4gKiB2YXIgc2hhbGxvdyA9IF8uY2xvbmUob2JqZWN0cyk7XG4gKiBjb25zb2xlLmxvZyhzaGFsbG93WzBdID09PSBvYmplY3RzWzBdKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY2xvbmUodmFsdWUpIHtcbiAgcmV0dXJuIGJhc2VDbG9uZSh2YWx1ZSwgQ0xPTkVfU1lNQk9MU19GTEFHKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZTtcbiIsInZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCcuL19iYXNlQ2xvbmUnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY2xvbmluZy4gKi9cbnZhciBDTE9ORV9ERUVQX0ZMQUcgPSAxLFxuICAgIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5jbG9uZWAgZXhjZXB0IHRoYXQgaXQgcmVjdXJzaXZlbHkgY2xvbmVzIGB2YWx1ZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAxLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJlY3Vyc2l2ZWx5IGNsb25lLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGRlZXAgY2xvbmVkIHZhbHVlLlxuICogQHNlZSBfLmNsb25lXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW3sgJ2EnOiAxIH0sIHsgJ2InOiAyIH1dO1xuICpcbiAqIHZhciBkZWVwID0gXy5jbG9uZURlZXAob2JqZWN0cyk7XG4gKiBjb25zb2xlLmxvZyhkZWVwWzBdID09PSBvYmplY3RzWzBdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGVlcCh2YWx1ZSkge1xuICByZXR1cm4gYmFzZUNsb25lKHZhbHVlLCBDTE9ORV9ERUVQX0ZMQUcgfCBDTE9ORV9TWU1CT0xTX0ZMQUcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lRGVlcDtcbiIsIi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29uc3RhbnQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gXy50aW1lcygyLCBfLmNvbnN0YW50KHsgJ2EnOiAxIH0pKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzKTtcbiAqIC8vID0+IFt7ICdhJzogMSB9LCB7ICdhJzogMSB9XVxuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHNbMF0gPT09IG9iamVjdHNbMV0pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50O1xuIiwidmFyIGJhc2VSZXN0ID0gcmVxdWlyZSgnLi9fYmFzZVJlc3QnKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vX2lzSXRlcmF0ZWVDYWxsJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi9rZXlzSW4nKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBc3NpZ25zIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgc3RyaW5nIGtleWVkIHByb3BlcnRpZXMgb2Ygc291cmNlXG4gKiBvYmplY3RzIHRvIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QgZm9yIGFsbCBkZXN0aW5hdGlvbiBwcm9wZXJ0aWVzIHRoYXRcbiAqIHJlc29sdmUgdG8gYHVuZGVmaW5lZGAuIFNvdXJjZSBvYmplY3RzIGFyZSBhcHBsaWVkIGZyb20gbGVmdCB0byByaWdodC5cbiAqIE9uY2UgYSBwcm9wZXJ0eSBpcyBzZXQsIGFkZGl0aW9uYWwgdmFsdWVzIG9mIHRoZSBzYW1lIHByb3BlcnR5IGFyZSBpZ25vcmVkLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBzZWUgXy5kZWZhdWx0c0RlZXBcbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZhdWx0cyh7ICdhJzogMSB9LCB7ICdiJzogMiB9LCB7ICdhJzogMyB9KTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIgfVxuICovXG52YXIgZGVmYXVsdHMgPSBiYXNlUmVzdChmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG5cbiAgdmFyIGluZGV4ID0gLTE7XG4gIHZhciBsZW5ndGggPSBzb3VyY2VzLmxlbmd0aDtcbiAgdmFyIGd1YXJkID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbMl0gOiB1bmRlZmluZWQ7XG5cbiAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgIGxlbmd0aCA9IDE7XG4gIH1cblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICB2YXIgcHJvcHMgPSBrZXlzSW4oc291cmNlKTtcbiAgICB2YXIgcHJvcHNJbmRleCA9IC0xO1xuICAgIHZhciBwcm9wc0xlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlICgrK3Byb3BzSW5kZXggPCBwcm9wc0xlbmd0aCkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW3Byb3BzSW5kZXhdO1xuICAgICAgdmFyIHZhbHVlID0gb2JqZWN0W2tleV07XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgKGVxKHZhbHVlLCBvYmplY3RQcm90b1trZXldKSAmJiAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSB7XG4gICAgICAgIG9iamVjdFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZvckVhY2gnKTtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuIiwidmFyIGFycmF5RmlsdGVyID0gcmVxdWlyZSgnLi9fYXJyYXlGaWx0ZXInKSxcbiAgICBiYXNlRmlsdGVyID0gcmVxdWlyZSgnLi9fYmFzZUZpbHRlcicpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCwgcmV0dXJuaW5nIGFuIGFycmF5IG9mIGFsbCBlbGVtZW50c1xuICogYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkgZm9yLiBUaGUgcHJlZGljYXRlIGlzIGludm9rZWQgd2l0aCB0aHJlZVxuICogYXJndW1lbnRzOiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gKlxuICogKipOb3RlOioqIFVubGlrZSBgXy5yZW1vdmVgLCB0aGlzIG1ldGhvZCByZXR1cm5zIGEgbmV3IGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJlZGljYXRlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqIEBzZWUgXy5yZWplY3RcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9XG4gKiBdO1xuICpcbiAqIF8uZmlsdGVyKHVzZXJzLCBmdW5jdGlvbihvKSB7IHJldHVybiAhby5hY3RpdmU7IH0pO1xuICogLy8gPT4gb2JqZWN0cyBmb3IgWydmcmVkJ11cbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maWx0ZXIodXNlcnMsIHsgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9KTtcbiAqIC8vID0+IG9iamVjdHMgZm9yIFsnYmFybmV5J11cbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbHRlcih1c2VycywgWydhY3RpdmUnLCBmYWxzZV0pO1xuICogLy8gPT4gb2JqZWN0cyBmb3IgWydmcmVkJ11cbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmlsdGVyKHVzZXJzLCAnYWN0aXZlJyk7XG4gKiAvLyA9PiBvYmplY3RzIGZvciBbJ2Jhcm5leSddXG4gKlxuICogLy8gQ29tYmluaW5nIHNldmVyYWwgcHJlZGljYXRlcyB1c2luZyBgXy5vdmVyRXZlcnlgIG9yIGBfLm92ZXJTb21lYC5cbiAqIF8uZmlsdGVyKHVzZXJzLCBfLm92ZXJTb21lKFt7ICdhZ2UnOiAzNiB9LCBbJ2FnZScsIDQwXV0pKTtcbiAqIC8vID0+IG9iamVjdHMgZm9yIFsnZnJlZCcsICdiYXJuZXknXVxuICovXG5mdW5jdGlvbiBmaWx0ZXIoY29sbGVjdGlvbiwgcHJlZGljYXRlKSB7XG4gIHZhciBmdW5jID0gaXNBcnJheShjb2xsZWN0aW9uKSA/IGFycmF5RmlsdGVyIDogYmFzZUZpbHRlcjtcbiAgcmV0dXJuIGZ1bmMoY29sbGVjdGlvbiwgYmFzZUl0ZXJhdGVlKHByZWRpY2F0ZSwgMykpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbHRlcjtcbiIsInZhciBjcmVhdGVGaW5kID0gcmVxdWlyZSgnLi9fY3JlYXRlRmluZCcpLFxuICAgIGZpbmRJbmRleCA9IHJlcXVpcmUoJy4vZmluZEluZGV4Jyk7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAsIHJldHVybmluZyB0aGUgZmlyc3QgZWxlbWVudFxuICogYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkgZm9yLiBUaGUgcHJlZGljYXRlIGlzIGludm9rZWQgd2l0aCB0aHJlZVxuICogYXJndW1lbnRzOiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJlZGljYXRlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleD0wXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWF0Y2hlZCBlbGVtZW50LCBlbHNlIGB1bmRlZmluZWRgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfSxcbiAqICAgeyAndXNlcic6ICdwZWJibGVzJywgJ2FnZSc6IDEsICAnYWN0aXZlJzogdHJ1ZSB9XG4gKiBdO1xuICpcbiAqIF8uZmluZCh1c2VycywgZnVuY3Rpb24obykgeyByZXR1cm4gby5hZ2UgPCA0MDsgfSk7XG4gKiAvLyA9PiBvYmplY3QgZm9yICdiYXJuZXknXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZCh1c2VycywgeyAnYWdlJzogMSwgJ2FjdGl2ZSc6IHRydWUgfSk7XG4gKiAvLyA9PiBvYmplY3QgZm9yICdwZWJibGVzJ1xuICpcbiAqIC8vIFRoZSBgXy5tYXRjaGVzUHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZCh1c2VycywgWydhY3RpdmUnLCBmYWxzZV0pO1xuICogLy8gPT4gb2JqZWN0IGZvciAnZnJlZCdcbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZCh1c2VycywgJ2FjdGl2ZScpO1xuICogLy8gPT4gb2JqZWN0IGZvciAnYmFybmV5J1xuICovXG52YXIgZmluZCA9IGNyZWF0ZUZpbmQoZmluZEluZGV4KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kO1xuIiwidmFyIGJhc2VGaW5kSW5kZXggPSByZXF1aXJlKCcuL19iYXNlRmluZEluZGV4JyksXG4gICAgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZmluZGAgZXhjZXB0IHRoYXQgaXQgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZpcnN0XG4gKiBlbGVtZW50IGBwcmVkaWNhdGVgIHJldHVybnMgdHJ1dGh5IGZvciBpbnN0ZWFkIG9mIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDEuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZvdW5kIGVsZW1lbnQsIGVsc2UgYC0xYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScsICAnYWN0aXZlJzogZmFsc2UgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAgJ2FjdGl2ZSc6IGZhbHNlIH0sXG4gKiAgIHsgJ3VzZXInOiAncGViYmxlcycsICdhY3RpdmUnOiB0cnVlIH1cbiAqIF07XG4gKlxuICogXy5maW5kSW5kZXgodXNlcnMsIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8udXNlciA9PSAnYmFybmV5JzsgfSk7XG4gKiAvLyA9PiAwXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZEluZGV4KHVzZXJzLCB7ICd1c2VyJzogJ2ZyZWQnLCAnYWN0aXZlJzogZmFsc2UgfSk7XG4gKiAvLyA9PiAxXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNQcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kSW5kZXgodXNlcnMsIFsnYWN0aXZlJywgZmFsc2VdKTtcbiAqIC8vID0+IDBcbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZEluZGV4KHVzZXJzLCAnYWN0aXZlJyk7XG4gKiAvLyA9PiAyXG4gKi9cbmZ1bmN0aW9uIGZpbmRJbmRleChhcnJheSwgcHJlZGljYXRlLCBmcm9tSW5kZXgpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuICBpZiAoIWxlbmd0aCkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICB2YXIgaW5kZXggPSBmcm9tSW5kZXggPT0gbnVsbCA/IDAgOiB0b0ludGVnZXIoZnJvbUluZGV4KTtcbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIGluZGV4ID0gbmF0aXZlTWF4KGxlbmd0aCArIGluZGV4LCAwKTtcbiAgfVxuICByZXR1cm4gYmFzZUZpbmRJbmRleChhcnJheSwgYmFzZUl0ZXJhdGVlKHByZWRpY2F0ZSwgMyksIGluZGV4KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kSW5kZXg7XG4iLCJ2YXIgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL19iYXNlRmxhdHRlbicpO1xuXG4vKipcbiAqIEZsYXR0ZW5zIGBhcnJheWAgYSBzaW5nbGUgbGV2ZWwgZGVlcC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmbGF0dGVuLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZsYXR0ZW4oWzEsIFsyLCBbMywgWzRdXSwgNV1dKTtcbiAqIC8vID0+IFsxLCAyLCBbMywgWzRdXSwgNV1cbiAqL1xuZnVuY3Rpb24gZmxhdHRlbihhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG4gIHJldHVybiBsZW5ndGggPyBiYXNlRmxhdHRlbihhcnJheSwgMSkgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmbGF0dGVuO1xuIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnLi9fYmFzZUVhY2gnKSxcbiAgICBjYXN0RnVuY3Rpb24gPSByZXF1aXJlKCcuL19jYXN0RnVuY3Rpb24nKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBlbGVtZW50LlxuICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIlxuICogcHJvcGVydHkgYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIHVzZSBgXy5mb3JJbmBcbiAqIG9yIGBfLmZvck93bmAgZm9yIG9iamVjdCBpdGVyYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGFsaWFzIGVhY2hcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNlZSBfLmZvckVhY2hSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZvckVhY2goWzEsIDJdLCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgYDFgIHRoZW4gYDJgLlxuICpcbiAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAqICAgY29uc29sZS5sb2coa2V5KTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyAnYScgdGhlbiAnYicgKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCkuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlFYWNoIDogYmFzZUVhY2g7XG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGNhc3RGdW5jdGlvbihpdGVyYXRlZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2g7XG4iLCJ2YXIgYmFzZUZvciA9IHJlcXVpcmUoJy4vX2Jhc2VGb3InKSxcbiAgICBjYXN0RnVuY3Rpb24gPSByZXF1aXJlKCcuL19jYXN0RnVuY3Rpb24nKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydGllcyBvZiBhblxuICogb2JqZWN0IGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkXG4gKiB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBrZXksIG9iamVjdCkuIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdFxuICogaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjMuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBzZWUgXy5mb3JJblJpZ2h0XG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8uZm9ySW4obmV3IEZvbywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICogICBjb25zb2xlLmxvZyhrZXkpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzICdhJywgJ2InLCB0aGVuICdjJyAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKS5cbiAqL1xuZnVuY3Rpb24gZm9ySW4ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGxcbiAgICA/IG9iamVjdFxuICAgIDogYmFzZUZvcihvYmplY3QsIGNhc3RGdW5jdGlvbihpdGVyYXRlZSksIGtleXNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9ySW47XG4iLCJ2YXIgYmFzZUdldCA9IHJlcXVpcmUoJy4vX2Jhc2VHZXQnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBgcGF0aGAgb2YgYG9iamVjdGAuIElmIHRoZSByZXNvbHZlZCB2YWx1ZSBpc1xuICogYHVuZGVmaW5lZGAsIHRoZSBgZGVmYXVsdFZhbHVlYCBpcyByZXR1cm5lZCBpbiBpdHMgcGxhY2UuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjcuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gW2RlZmF1bHRWYWx1ZV0gVGhlIHZhbHVlIHJldHVybmVkIGZvciBgdW5kZWZpbmVkYCByZXNvbHZlZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogW3sgJ2InOiB7ICdjJzogMyB9IH1dIH07XG4gKlxuICogXy5nZXQob2JqZWN0LCAnYVswXS5iLmMnKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLmdldChvYmplY3QsIFsnYScsICcwJywgJ2InLCAnYyddKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLmdldChvYmplY3QsICdhLmIuYycsICdkZWZhdWx0Jyk7XG4gKiAvLyA9PiAnZGVmYXVsdCdcbiAqL1xuZnVuY3Rpb24gZ2V0KG9iamVjdCwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gIHZhciByZXN1bHQgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IGJhc2VHZXQob2JqZWN0LCBwYXRoKTtcbiAgcmV0dXJuIHJlc3VsdCA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdFZhbHVlIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldDtcbiIsInZhciBiYXNlSGFzID0gcmVxdWlyZSgnLi9fYmFzZUhhcycpLFxuICAgIGhhc1BhdGggPSByZXF1aXJlKCcuL19oYXNQYXRoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBpcyBhIGRpcmVjdCBwcm9wZXJ0eSBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogeyAnYic6IDIgfSB9O1xuICogdmFyIG90aGVyID0gXy5jcmVhdGUoeyAnYSc6IF8uY3JlYXRlKHsgJ2InOiAyIH0pIH0pO1xuICpcbiAqIF8uaGFzKG9iamVjdCwgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhcyhvYmplY3QsICdhLmInKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhcyhvYmplY3QsIFsnYScsICdiJ10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG90aGVyLCAnYScpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaGFzKG9iamVjdCwgcGF0aCkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzUGF0aChvYmplY3QsIHBhdGgsIGJhc2VIYXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhcztcbiIsInZhciBiYXNlSGFzSW4gPSByZXF1aXJlKCcuL19iYXNlSGFzSW4nKSxcbiAgICBoYXNQYXRoID0gcmVxdWlyZSgnLi9faGFzUGF0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgcGF0aGAgaXMgYSBkaXJlY3Qgb3IgaW5oZXJpdGVkIHByb3BlcnR5IG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IF8uY3JlYXRlKHsgJ2EnOiBfLmNyZWF0ZSh7ICdiJzogMiB9KSB9KTtcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2EuYicpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2InKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGhhc0luKG9iamVjdCwgcGF0aCkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzUGF0aChvYmplY3QsIHBhdGgsIGJhc2VIYXNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzSW47XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pc0FycmF5TGlrZWAgZXhjZXB0IHRoYXQgaXQgYWxzbyBjaGVja3MgaWYgYHZhbHVlYFxuICogaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LWxpa2Ugb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZU9iamVjdDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0J1ZmZlcjtcbiIsInZhciBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gZW1wdHkgb2JqZWN0LCBjb2xsZWN0aW9uLCBtYXAsIG9yIHNldC5cbiAqXG4gKiBPYmplY3RzIGFyZSBjb25zaWRlcmVkIGVtcHR5IGlmIHRoZXkgaGF2ZSBubyBvd24gZW51bWVyYWJsZSBzdHJpbmcga2V5ZWRcbiAqIHByb3BlcnRpZXMuXG4gKlxuICogQXJyYXktbGlrZSB2YWx1ZXMgc3VjaCBhcyBgYXJndW1lbnRzYCBvYmplY3RzLCBhcnJheXMsIGJ1ZmZlcnMsIHN0cmluZ3MsIG9yXG4gKiBqUXVlcnktbGlrZSBjb2xsZWN0aW9ucyBhcmUgY29uc2lkZXJlZCBlbXB0eSBpZiB0aGV5IGhhdmUgYSBgbGVuZ3RoYCBvZiBgMGAuXG4gKiBTaW1pbGFybHksIG1hcHMgYW5kIHNldHMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgaWYgdGhleSBoYXZlIGEgYHNpemVgIG9mIGAwYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBlbXB0eSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRW1wdHkobnVsbCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KHRydWUpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eSgxKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0VtcHR5KHsgJ2EnOiAxIH0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChpc0FycmF5TGlrZSh2YWx1ZSkgJiZcbiAgICAgIChpc0FycmF5KHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlLnNwbGljZSA9PSAnZnVuY3Rpb24nIHx8XG4gICAgICAgIGlzQnVmZmVyKHZhbHVlKSB8fCBpc1R5cGVkQXJyYXkodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSkpIHtcbiAgICByZXR1cm4gIXZhbHVlLmxlbmd0aDtcbiAgfVxuICB2YXIgdGFnID0gZ2V0VGFnKHZhbHVlKTtcbiAgaWYgKHRhZyA9PSBtYXBUYWcgfHwgdGFnID09IHNldFRhZykge1xuICAgIHJldHVybiAhdmFsdWUuc2l6ZTtcbiAgfVxuICBpZiAoaXNQcm90b3R5cGUodmFsdWUpKSB7XG4gICAgcmV0dXJuICFiYXNlS2V5cyh2YWx1ZSkubGVuZ3RoO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRW1wdHk7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGVuZ3RoO1xuIiwidmFyIGJhc2VJc01hcCA9IHJlcXVpcmUoJy4vX2Jhc2VJc01hcCcpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIG5vZGVVdGlsID0gcmVxdWlyZSgnLi9fbm9kZVV0aWwnKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNNYXAgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc01hcDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYE1hcGAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbWFwLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNNYXAobmV3IE1hcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc01hcChuZXcgV2Vha01hcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNNYXAgPSBub2RlSXNNYXAgPyBiYXNlVW5hcnkobm9kZUlzTWFwKSA6IGJhc2VJc01hcDtcblxubW9kdWxlLmV4cG9ydHMgPSBpc01hcDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgZ2V0UHJvdG90eXBlID0gcmVxdWlyZSgnLi9fZ2V0UHJvdG90eXBlJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gaW5mZXIgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLiAqL1xudmFyIG9iamVjdEN0b3JTdHJpbmcgPSBmdW5jVG9TdHJpbmcuY2FsbChPYmplY3QpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCB0aGF0IGlzLCBhbiBvYmplY3QgY3JlYXRlZCBieSB0aGVcbiAqIGBPYmplY3RgIGNvbnN0cnVjdG9yIG9yIG9uZSB3aXRoIGEgYFtbUHJvdG90eXBlXV1gIG9mIGBudWxsYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuOC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogXy5pc1BsYWluT2JqZWN0KG5ldyBGb28pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KHsgJ3gnOiAwLCAneSc6IDAgfSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHZhbHVlKSB8fCBiYXNlR2V0VGFnKHZhbHVlKSAhPSBvYmplY3RUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHByb3RvID0gZ2V0UHJvdG90eXBlKHZhbHVlKTtcbiAgaWYgKHByb3RvID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIEN0b3IgPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3RvLCAnY29uc3RydWN0b3InKSAmJiBwcm90by5jb25zdHJ1Y3RvcjtcbiAgcmV0dXJuIHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3RvciBpbnN0YW5jZW9mIEN0b3IgJiZcbiAgICBmdW5jVG9TdHJpbmcuY2FsbChDdG9yKSA9PSBvYmplY3RDdG9yU3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUGxhaW5PYmplY3Q7XG4iLCJ2YXIgYmFzZUlzU2V0ID0gcmVxdWlyZSgnLi9fYmFzZUlzU2V0JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1NldCA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzU2V0O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU2V0YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzZXQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1NldChuZXcgU2V0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU2V0KG5ldyBXZWFrU2V0KTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1NldCA9IG5vZGVJc1NldCA/IGJhc2VVbmFyeShub2RlSXNTZXQpIDogYmFzZUlzU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU2V0O1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN0cmluZ2AgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN0cmluZywgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3RyaW5nKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3RyaW5nKDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fFxuICAgICghaXNBcnJheSh2YWx1ZSkgJiYgaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzdHJpbmdUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyaW5nO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNVbmRlZmluZWQodm9pZCAwKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVW5kZWZpbmVkKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNVbmRlZmluZWQ7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5c0luID0gcmVxdWlyZSgnLi9fYmFzZUtleXNJbicpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24ga2V5c0luKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0LCB0cnVlKSA6IGJhc2VLZXlzSW4ob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzSW47XG4iLCIvKipcbiAqIEdldHMgdGhlIGxhc3QgZWxlbWVudCBvZiBgYXJyYXlgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGxhc3QgZWxlbWVudCBvZiBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmxhc3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IDNcbiAqL1xuZnVuY3Rpb24gbGFzdChhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG4gIHJldHVybiBsZW5ndGggPyBhcnJheVtsZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsYXN0O1xuIiwidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBiYXNlTWFwID0gcmVxdWlyZSgnLi9fYmFzZU1hcCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHZhbHVlcyBieSBydW5uaW5nIGVhY2ggZWxlbWVudCBpbiBgY29sbGVjdGlvbmAgdGhydVxuICogYGl0ZXJhdGVlYC4gVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6XG4gKiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gKlxuICogTWFueSBsb2Rhc2ggbWV0aG9kcyBhcmUgZ3VhcmRlZCB0byB3b3JrIGFzIGl0ZXJhdGVlcyBmb3IgbWV0aG9kcyBsaWtlXG4gKiBgXy5ldmVyeWAsIGBfLmZpbHRlcmAsIGBfLm1hcGAsIGBfLm1hcFZhbHVlc2AsIGBfLnJlamVjdGAsIGFuZCBgXy5zb21lYC5cbiAqXG4gKiBUaGUgZ3VhcmRlZCBtZXRob2RzIGFyZTpcbiAqIGBhcnlgLCBgY2h1bmtgLCBgY3VycnlgLCBgY3VycnlSaWdodGAsIGBkcm9wYCwgYGRyb3BSaWdodGAsIGBldmVyeWAsXG4gKiBgZmlsbGAsIGBpbnZlcnRgLCBgcGFyc2VJbnRgLCBgcmFuZG9tYCwgYHJhbmdlYCwgYHJhbmdlUmlnaHRgLCBgcmVwZWF0YCxcbiAqIGBzYW1wbGVTaXplYCwgYHNsaWNlYCwgYHNvbWVgLCBgc29ydEJ5YCwgYHNwbGl0YCwgYHRha2VgLCBgdGFrZVJpZ2h0YCxcbiAqIGB0ZW1wbGF0ZWAsIGB0cmltYCwgYHRyaW1FbmRgLCBgdHJpbVN0YXJ0YCwgYW5kIGB3b3Jkc2BcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIHNxdWFyZShuKSB7XG4gKiAgIHJldHVybiBuICogbjtcbiAqIH1cbiAqXG4gKiBfLm1hcChbNCwgOF0sIHNxdWFyZSk7XG4gKiAvLyA9PiBbMTYsIDY0XVxuICpcbiAqIF8ubWFwKHsgJ2EnOiA0LCAnYic6IDggfSwgc3F1YXJlKTtcbiAqIC8vID0+IFsxNiwgNjRdIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJyB9XG4gKiBdO1xuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5tYXAodXNlcnMsICd1c2VyJyk7XG4gKiAvLyA9PiBbJ2Jhcm5leScsICdmcmVkJ11cbiAqL1xuZnVuY3Rpb24gbWFwKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHZhciBmdW5jID0gaXNBcnJheShjb2xsZWN0aW9uKSA/IGFycmF5TWFwIDogYmFzZU1hcDtcbiAgcmV0dXJuIGZ1bmMoY29sbGVjdGlvbiwgYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlLCAzKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwO1xuIiwidmFyIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpLFxuICAgIGJhc2VGb3JPd24gPSByZXF1aXJlKCcuL19iYXNlRm9yT3duJyksXG4gICAgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBrZXlzIGFzIGBvYmplY3RgIGFuZCB2YWx1ZXMgZ2VuZXJhdGVkXG4gKiBieSBydW5uaW5nIGVhY2ggb3duIGVudW1lcmFibGUgc3RyaW5nIGtleWVkIHByb3BlcnR5IG9mIGBvYmplY3RgIHRocnVcbiAqIGBpdGVyYXRlZWAuIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuICogKHZhbHVlLCBrZXksIG9iamVjdCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBvYmplY3QuXG4gKiBAc2VlIF8ubWFwS2V5c1xuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSB7XG4gKiAgICdmcmVkJzogICAgeyAndXNlcic6ICdmcmVkJywgICAgJ2FnZSc6IDQwIH0sXG4gKiAgICdwZWJibGVzJzogeyAndXNlcic6ICdwZWJibGVzJywgJ2FnZSc6IDEgfVxuICogfTtcbiAqXG4gKiBfLm1hcFZhbHVlcyh1c2VycywgZnVuY3Rpb24obykgeyByZXR1cm4gby5hZ2U7IH0pO1xuICogLy8gPT4geyAnZnJlZCc6IDQwLCAncGViYmxlcyc6IDEgfSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5tYXBWYWx1ZXModXNlcnMsICdhZ2UnKTtcbiAqIC8vID0+IHsgJ2ZyZWQnOiA0MCwgJ3BlYmJsZXMnOiAxIH0gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24gbWFwVmFsdWVzKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBpdGVyYXRlZSA9IGJhc2VJdGVyYXRlZShpdGVyYXRlZSwgMyk7XG5cbiAgYmFzZUZvck93bihvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iamVjdCkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShyZXN1bHQsIGtleSwgaXRlcmF0ZWUodmFsdWUsIGtleSwgb2JqZWN0KSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcFZhbHVlcztcbiIsInZhciBiYXNlRXh0cmVtdW0gPSByZXF1aXJlKCcuL19iYXNlRXh0cmVtdW0nKSxcbiAgICBiYXNlR3QgPSByZXF1aXJlKCcuL19iYXNlR3QnKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgbWF4aW11bSB2YWx1ZSBvZiBgYXJyYXlgLiBJZiBgYXJyYXlgIGlzIGVtcHR5IG9yIGZhbHNleSxcbiAqIGB1bmRlZmluZWRgIGlzIHJldHVybmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBNYXRoXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1heGltdW0gdmFsdWUuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ubWF4KFs0LCAyLCA4LCA2XSk7XG4gKiAvLyA9PiA4XG4gKlxuICogXy5tYXgoW10pO1xuICogLy8gPT4gdW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIG1heChhcnJheSkge1xuICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aClcbiAgICA/IGJhc2VFeHRyZW11bShhcnJheSwgaWRlbnRpdHksIGJhc2VHdClcbiAgICA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXg7XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzXG4gKiBwcm92aWRlZCwgaXQgZGV0ZXJtaW5lcyB0aGUgY2FjaGUga2V5IGZvciBzdG9yaW5nIHRoZSByZXN1bHQgYmFzZWQgb24gdGhlXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGUgZmlyc3QgYXJndW1lbnRcbiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gKiBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkXG4gKiBmdW5jdGlvbi4gSXRzIGNyZWF0aW9uIG1heSBiZSBjdXN0b21pemVkIGJ5IHJlcGxhY2luZyB0aGUgYF8ubWVtb2l6ZS5DYWNoZWBcbiAqIGNvbnN0cnVjdG9yIHdpdGggb25lIHdob3NlIGluc3RhbmNlcyBpbXBsZW1lbnQgdGhlXG4gKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KVxuICogbWV0aG9kIGludGVyZmFjZSBvZiBgY2xlYXJgLCBgZGVsZXRlYCwgYGdldGAsIGBoYXNgLCBhbmQgYHNldGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzb2x2ZXJdIFRoZSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBjYWNoZSBrZXkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2MnOiAzLCAnZCc6IDQgfTtcbiAqXG4gKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogdmFsdWVzKG90aGVyKTtcbiAqIC8vID0+IFszLCA0XVxuICpcbiAqIG9iamVjdC5hID0gMjtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogLy8gTW9kaWZ5IHRoZSByZXN1bHQgY2FjaGUuXG4gKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBSZXBsYWNlIGBfLm1lbW9pemUuQ2FjaGVgLlxuICogXy5tZW1vaXplLkNhY2hlID0gV2Vha01hcDtcbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJyB8fCAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gRXhwb3NlIGBNYXBDYWNoZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZTtcbiIsInZhciBiYXNlTWVyZ2UgPSByZXF1aXJlKCcuL19iYXNlTWVyZ2UnKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUFzc2lnbmVyJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5hc3NpZ25gIGV4Y2VwdCB0aGF0IGl0IHJlY3Vyc2l2ZWx5IG1lcmdlcyBvd24gYW5kXG4gKiBpbmhlcml0ZWQgZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0cyBpbnRvIHRoZVxuICogZGVzdGluYXRpb24gb2JqZWN0LiBTb3VyY2UgcHJvcGVydGllcyB0aGF0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAgYXJlXG4gKiBza2lwcGVkIGlmIGEgZGVzdGluYXRpb24gdmFsdWUgZXhpc3RzLiBBcnJheSBhbmQgcGxhaW4gb2JqZWN0IHByb3BlcnRpZXNcbiAqIGFyZSBtZXJnZWQgcmVjdXJzaXZlbHkuIE90aGVyIG9iamVjdHMgYW5kIHZhbHVlIHR5cGVzIGFyZSBvdmVycmlkZGVuIGJ5XG4gKiBhc3NpZ25tZW50LiBTb3VyY2Ugb2JqZWN0cyBhcmUgYXBwbGllZCBmcm9tIGxlZnQgdG8gcmlnaHQuIFN1YnNlcXVlbnRcbiAqIHNvdXJjZXMgb3ZlcndyaXRlIHByb3BlcnR5IGFzc2lnbm1lbnRzIG9mIHByZXZpb3VzIHNvdXJjZXMuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjUuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0ge1xuICogICAnYSc6IFt7ICdiJzogMiB9LCB7ICdkJzogNCB9XVxuICogfTtcbiAqXG4gKiB2YXIgb3RoZXIgPSB7XG4gKiAgICdhJzogW3sgJ2MnOiAzIH0sIHsgJ2UnOiA1IH1dXG4gKiB9O1xuICpcbiAqIF8ubWVyZ2Uob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiB7ICdhJzogW3sgJ2InOiAyLCAnYyc6IDMgfSwgeyAnZCc6IDQsICdlJzogNSB9XSB9XG4gKi9cbnZhciBtZXJnZSA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCkge1xuICBiYXNlTWVyZ2Uob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4KTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlO1xuIiwidmFyIGJhc2VFeHRyZW11bSA9IHJlcXVpcmUoJy4vX2Jhc2VFeHRyZW11bScpLFxuICAgIGJhc2VMdCA9IHJlcXVpcmUoJy4vX2Jhc2VMdCcpLFxuICAgIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBtaW5pbXVtIHZhbHVlIG9mIGBhcnJheWAuIElmIGBhcnJheWAgaXMgZW1wdHkgb3IgZmFsc2V5LFxuICogYHVuZGVmaW5lZGAgaXMgcmV0dXJuZWQuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE1hdGhcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWluaW11bSB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5taW4oWzQsIDIsIDgsIDZdKTtcbiAqIC8vID0+IDJcbiAqXG4gKiBfLm1pbihbXSk7XG4gKiAvLyA9PiB1bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gbWluKGFycmF5KSB7XG4gIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKVxuICAgID8gYmFzZUV4dHJlbXVtKGFycmF5LCBpZGVudGl0eSwgYmFzZUx0KVxuICAgIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1pbjtcbiIsInZhciBiYXNlRXh0cmVtdW0gPSByZXF1aXJlKCcuL19iYXNlRXh0cmVtdW0nKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBiYXNlTHQgPSByZXF1aXJlKCcuL19iYXNlTHQnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLm1pbmAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgaXRlcmF0ZWVgIHdoaWNoIGlzXG4gKiBpbnZva2VkIGZvciBlYWNoIGVsZW1lbnQgaW4gYGFycmF5YCB0byBnZW5lcmF0ZSB0aGUgY3JpdGVyaW9uIGJ5IHdoaWNoXG4gKiB0aGUgdmFsdWUgaXMgcmFua2VkLiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogKHZhbHVlKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTWF0aFxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtaW5pbXVtIHZhbHVlLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFt7ICduJzogMSB9LCB7ICduJzogMiB9XTtcbiAqXG4gKiBfLm1pbkJ5KG9iamVjdHMsIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8ubjsgfSk7XG4gKiAvLyA9PiB7ICduJzogMSB9XG4gKlxuICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLm1pbkJ5KG9iamVjdHMsICduJyk7XG4gKiAvLyA9PiB7ICduJzogMSB9XG4gKi9cbmZ1bmN0aW9uIG1pbkJ5KGFycmF5LCBpdGVyYXRlZSkge1xuICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aClcbiAgICA/IGJhc2VFeHRyZW11bShhcnJheSwgYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlLCAyKSwgYmFzZUx0KVxuICAgIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1pbkJ5O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGB1bmRlZmluZWRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi4zLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5ub29wKTtcbiAqIC8vID0+IFt1bmRlZmluZWQsIHVuZGVmaW5lZF1cbiAqL1xuZnVuY3Rpb24gbm9vcCgpIHtcbiAgLy8gTm8gb3BlcmF0aW9uIHBlcmZvcm1lZC5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBub29wO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbm93O1xuIiwidmFyIGJhc2VQaWNrID0gcmVxdWlyZSgnLi9fYmFzZVBpY2snKSxcbiAgICBmbGF0UmVzdCA9IHJlcXVpcmUoJy4vX2ZsYXRSZXN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIHBpY2tlZCBgb2JqZWN0YCBwcm9wZXJ0aWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0gey4uLihzdHJpbmd8c3RyaW5nW10pfSBbcGF0aHNdIFRoZSBwcm9wZXJ0eSBwYXRocyB0byBwaWNrLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6ICcyJywgJ2MnOiAzIH07XG4gKlxuICogXy5waWNrKG9iamVjdCwgWydhJywgJ2MnXSk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2MnOiAzIH1cbiAqL1xudmFyIHBpY2sgPSBmbGF0UmVzdChmdW5jdGlvbihvYmplY3QsIHBhdGhzKSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHt9IDogYmFzZVBpY2sob2JqZWN0LCBwYXRocyk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBwaWNrO1xuIiwidmFyIGJhc2VQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2Jhc2VQcm9wZXJ0eScpLFxuICAgIGJhc2VQcm9wZXJ0eURlZXAgPSByZXF1aXJlKCcuL19iYXNlUHJvcGVydHlEZWVwJyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB2YWx1ZSBhdCBgcGF0aGAgb2YgYSBnaXZlbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhY2Nlc3NvciBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbXG4gKiAgIHsgJ2EnOiB7ICdiJzogMiB9IH0sXG4gKiAgIHsgJ2EnOiB7ICdiJzogMSB9IH1cbiAqIF07XG4gKlxuICogXy5tYXAob2JqZWN0cywgXy5wcm9wZXJ0eSgnYS5iJykpO1xuICogLy8gPT4gWzIsIDFdXG4gKlxuICogXy5tYXAoXy5zb3J0Qnkob2JqZWN0cywgXy5wcm9wZXJ0eShbJ2EnLCAnYiddKSksICdhLmInKTtcbiAqIC8vID0+IFsxLCAyXVxuICovXG5mdW5jdGlvbiBwcm9wZXJ0eShwYXRoKSB7XG4gIHJldHVybiBpc0tleShwYXRoKSA/IGJhc2VQcm9wZXJ0eSh0b0tleShwYXRoKSkgOiBiYXNlUHJvcGVydHlEZWVwKHBhdGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHByb3BlcnR5O1xuIiwidmFyIGNyZWF0ZVJhbmdlID0gcmVxdWlyZSgnLi9fY3JlYXRlUmFuZ2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG51bWJlcnMgKHBvc2l0aXZlIGFuZC9vciBuZWdhdGl2ZSkgcHJvZ3Jlc3NpbmcgZnJvbVxuICogYHN0YXJ0YCB1cCB0bywgYnV0IG5vdCBpbmNsdWRpbmcsIGBlbmRgLiBBIHN0ZXAgb2YgYC0xYCBpcyB1c2VkIGlmIGEgbmVnYXRpdmVcbiAqIGBzdGFydGAgaXMgc3BlY2lmaWVkIHdpdGhvdXQgYW4gYGVuZGAgb3IgYHN0ZXBgLiBJZiBgZW5kYCBpcyBub3Qgc3BlY2lmaWVkLFxuICogaXQncyBzZXQgdG8gYHN0YXJ0YCB3aXRoIGBzdGFydGAgdGhlbiBzZXQgdG8gYDBgLlxuICpcbiAqICoqTm90ZToqKiBKYXZhU2NyaXB0IGZvbGxvd3MgdGhlIElFRUUtNzU0IHN0YW5kYXJkIGZvciByZXNvbHZpbmdcbiAqIGZsb2F0aW5nLXBvaW50IHZhbHVlcyB3aGljaCBjYW4gcHJvZHVjZSB1bmV4cGVjdGVkIHJlc3VsdHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhlIGVuZCBvZiB0aGUgcmFuZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0ZXA9MV0gVGhlIHZhbHVlIHRvIGluY3JlbWVudCBvciBkZWNyZW1lbnQgYnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHJhbmdlIG9mIG51bWJlcnMuXG4gKiBAc2VlIF8uaW5SYW5nZSwgXy5yYW5nZVJpZ2h0XG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ucmFuZ2UoNCk7XG4gKiAvLyA9PiBbMCwgMSwgMiwgM11cbiAqXG4gKiBfLnJhbmdlKC00KTtcbiAqIC8vID0+IFswLCAtMSwgLTIsIC0zXVxuICpcbiAqIF8ucmFuZ2UoMSwgNSk7XG4gKiAvLyA9PiBbMSwgMiwgMywgNF1cbiAqXG4gKiBfLnJhbmdlKDAsIDIwLCA1KTtcbiAqIC8vID0+IFswLCA1LCAxMCwgMTVdXG4gKlxuICogXy5yYW5nZSgwLCAtNCwgLTEpO1xuICogLy8gPT4gWzAsIC0xLCAtMiwgLTNdXG4gKlxuICogXy5yYW5nZSgxLCA0LCAwKTtcbiAqIC8vID0+IFsxLCAxLCAxXVxuICpcbiAqIF8ucmFuZ2UoMCk7XG4gKiAvLyA9PiBbXVxuICovXG52YXIgcmFuZ2UgPSBjcmVhdGVSYW5nZSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJhbmdlO1xuIiwidmFyIGFycmF5UmVkdWNlID0gcmVxdWlyZSgnLi9fYXJyYXlSZWR1Y2UnKSxcbiAgICBiYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2Jhc2VFYWNoJyksXG4gICAgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgYmFzZVJlZHVjZSA9IHJlcXVpcmUoJy4vX2Jhc2VSZWR1Y2UnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogUmVkdWNlcyBgY29sbGVjdGlvbmAgdG8gYSB2YWx1ZSB3aGljaCBpcyB0aGUgYWNjdW11bGF0ZWQgcmVzdWx0IG9mIHJ1bm5pbmdcbiAqIGVhY2ggZWxlbWVudCBpbiBgY29sbGVjdGlvbmAgdGhydSBgaXRlcmF0ZWVgLCB3aGVyZSBlYWNoIHN1Y2Nlc3NpdmVcbiAqIGludm9jYXRpb24gaXMgc3VwcGxpZWQgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgcHJldmlvdXMuIElmIGBhY2N1bXVsYXRvcmBcbiAqIGlzIG5vdCBnaXZlbiwgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYGNvbGxlY3Rpb25gIGlzIHVzZWQgYXMgdGhlIGluaXRpYWxcbiAqIHZhbHVlLiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIGZvdXIgYXJndW1lbnRzOlxuICogKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqXG4gKiBNYW55IGxvZGFzaCBtZXRob2RzIGFyZSBndWFyZGVkIHRvIHdvcmsgYXMgaXRlcmF0ZWVzIGZvciBtZXRob2RzIGxpa2VcbiAqIGBfLnJlZHVjZWAsIGBfLnJlZHVjZVJpZ2h0YCwgYW5kIGBfLnRyYW5zZm9ybWAuXG4gKlxuICogVGhlIGd1YXJkZWQgbWV0aG9kcyBhcmU6XG4gKiBgYXNzaWduYCwgYGRlZmF1bHRzYCwgYGRlZmF1bHRzRGVlcGAsIGBpbmNsdWRlc2AsIGBtZXJnZWAsIGBvcmRlckJ5YCxcbiAqIGFuZCBgc29ydEJ5YFxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW2FjY3VtdWxhdG9yXSBUaGUgaW5pdGlhbCB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAqIEBzZWUgXy5yZWR1Y2VSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnJlZHVjZShbMSwgMl0sIGZ1bmN0aW9uKHN1bSwgbikge1xuICogICByZXR1cm4gc3VtICsgbjtcbiAqIH0sIDApO1xuICogLy8gPT4gM1xuICpcbiAqIF8ucmVkdWNlKHsgJ2EnOiAxLCAnYic6IDIsICdjJzogMSB9LCBmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAqICAgKHJlc3VsdFt2YWx1ZV0gfHwgKHJlc3VsdFt2YWx1ZV0gPSBbXSkpLnB1c2goa2V5KTtcbiAqICAgcmV0dXJuIHJlc3VsdDtcbiAqIH0sIHt9KTtcbiAqIC8vID0+IHsgJzEnOiBbJ2EnLCAnYyddLCAnMic6IFsnYiddIH0gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24gcmVkdWNlKGNvbGxlY3Rpb24sIGl0ZXJhdGVlLCBhY2N1bXVsYXRvcikge1xuICB2YXIgZnVuYyA9IGlzQXJyYXkoY29sbGVjdGlvbikgPyBhcnJheVJlZHVjZSA6IGJhc2VSZWR1Y2UsXG4gICAgICBpbml0QWNjdW0gPSBhcmd1bWVudHMubGVuZ3RoIDwgMztcblxuICByZXR1cm4gZnVuYyhjb2xsZWN0aW9uLCBiYXNlSXRlcmF0ZWUoaXRlcmF0ZWUsIDQpLCBhY2N1bXVsYXRvciwgaW5pdEFjY3VtLCBiYXNlRWFjaCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVkdWNlO1xuIiwidmFyIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc1N0cmluZyA9IHJlcXVpcmUoJy4vaXNTdHJpbmcnKSxcbiAgICBzdHJpbmdTaXplID0gcmVxdWlyZSgnLi9fc3RyaW5nU2l6ZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XSc7XG5cbi8qKlxuICogR2V0cyB0aGUgc2l6ZSBvZiBgY29sbGVjdGlvbmAgYnkgcmV0dXJuaW5nIGl0cyBsZW5ndGggZm9yIGFycmF5LWxpa2VcbiAqIHZhbHVlcyBvciB0aGUgbnVtYmVyIG9mIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzIGZvciBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbGxlY3Rpb24gc2l6ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zaXplKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy5zaXplKHsgJ2EnOiAxLCAnYic6IDIgfSk7XG4gKiAvLyA9PiAyXG4gKlxuICogXy5zaXplKCdwZWJibGVzJyk7XG4gKiAvLyA9PiA3XG4gKi9cbmZ1bmN0aW9uIHNpemUoY29sbGVjdGlvbikge1xuICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgaWYgKGlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgcmV0dXJuIGlzU3RyaW5nKGNvbGxlY3Rpb24pID8gc3RyaW5nU2l6ZShjb2xsZWN0aW9uKSA6IGNvbGxlY3Rpb24ubGVuZ3RoO1xuICB9XG4gIHZhciB0YWcgPSBnZXRUYWcoY29sbGVjdGlvbik7XG4gIGlmICh0YWcgPT0gbWFwVGFnIHx8IHRhZyA9PSBzZXRUYWcpIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5zaXplO1xuICB9XG4gIHJldHVybiBiYXNlS2V5cyhjb2xsZWN0aW9uKS5sZW5ndGg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2l6ZTtcbiIsInZhciBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgYmFzZU9yZGVyQnkgPSByZXF1aXJlKCcuL19iYXNlT3JkZXJCeScpLFxuICAgIGJhc2VSZXN0ID0gcmVxdWlyZSgnLi9fYmFzZVJlc3QnKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vX2lzSXRlcmF0ZWVDYWxsJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBlbGVtZW50cywgc29ydGVkIGluIGFzY2VuZGluZyBvcmRlciBieSB0aGUgcmVzdWx0cyBvZlxuICogcnVubmluZyBlYWNoIGVsZW1lbnQgaW4gYSBjb2xsZWN0aW9uIHRocnUgZWFjaCBpdGVyYXRlZS4gVGhpcyBtZXRob2RcbiAqIHBlcmZvcm1zIGEgc3RhYmxlIHNvcnQsIHRoYXQgaXMsIGl0IHByZXNlcnZlcyB0aGUgb3JpZ2luYWwgc29ydCBvcmRlciBvZlxuICogZXF1YWwgZWxlbWVudHMuIFRoZSBpdGVyYXRlZXMgYXJlIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6ICh2YWx1ZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7Li4uKEZ1bmN0aW9ufEZ1bmN0aW9uW10pfSBbaXRlcmF0ZWVzPVtfLmlkZW50aXR5XV1cbiAqICBUaGUgaXRlcmF0ZWVzIHRvIHNvcnQgYnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBzb3J0ZWQgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogNDggfSxcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogMzAgfSxcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzQgfVxuICogXTtcbiAqXG4gKiBfLnNvcnRCeSh1c2VycywgW2Z1bmN0aW9uKG8pIHsgcmV0dXJuIG8udXNlcjsgfV0pO1xuICogLy8gPT4gb2JqZWN0cyBmb3IgW1snYmFybmV5JywgMzZdLCBbJ2Jhcm5leScsIDM0XSwgWydmcmVkJywgNDhdLCBbJ2ZyZWQnLCAzMF1dXG4gKlxuICogXy5zb3J0QnkodXNlcnMsIFsndXNlcicsICdhZ2UnXSk7XG4gKiAvLyA9PiBvYmplY3RzIGZvciBbWydiYXJuZXknLCAzNF0sIFsnYmFybmV5JywgMzZdLCBbJ2ZyZWQnLCAzMF0sIFsnZnJlZCcsIDQ4XV1cbiAqL1xudmFyIHNvcnRCeSA9IGJhc2VSZXN0KGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZXJhdGVlcykge1xuICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHZhciBsZW5ndGggPSBpdGVyYXRlZXMubGVuZ3RoO1xuICBpZiAobGVuZ3RoID4gMSAmJiBpc0l0ZXJhdGVlQ2FsbChjb2xsZWN0aW9uLCBpdGVyYXRlZXNbMF0sIGl0ZXJhdGVlc1sxXSkpIHtcbiAgICBpdGVyYXRlZXMgPSBbXTtcbiAgfSBlbHNlIGlmIChsZW5ndGggPiAyICYmIGlzSXRlcmF0ZWVDYWxsKGl0ZXJhdGVlc1swXSwgaXRlcmF0ZWVzWzFdLCBpdGVyYXRlZXNbMl0pKSB7XG4gICAgaXRlcmF0ZWVzID0gW2l0ZXJhdGVlc1swXV07XG4gIH1cbiAgcmV0dXJuIGJhc2VPcmRlckJ5KGNvbGxlY3Rpb24sIGJhc2VGbGF0dGVuKGl0ZXJhdGVlcywgMSksIFtdKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNvcnRCeTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBlbXB0eSBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGVtcHR5IGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXlzID0gXy50aW1lcygyLCBfLnN0dWJBcnJheSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzKTtcbiAqIC8vID0+IFtbXSwgW11dXG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzWzBdID09PSBhcnJheXNbMV0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3R1YkFycmF5KCkge1xuICByZXR1cm4gW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkFycmF5O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcbiIsInZhciB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMCxcbiAgICBNQVhfSU5URUdFUiA9IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBmaW5pdGUgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMi4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9GaW5pdGUoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9GaW5pdGUoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvRmluaXRlKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0Zpbml0ZSgnMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9GaW5pdGUodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogMDtcbiAgfVxuICB2YWx1ZSA9IHRvTnVtYmVyKHZhbHVlKTtcbiAgaWYgKHZhbHVlID09PSBJTkZJTklUWSB8fCB2YWx1ZSA9PT0gLUlORklOSVRZKSB7XG4gICAgdmFyIHNpZ24gPSAodmFsdWUgPCAwID8gLTEgOiAxKTtcbiAgICByZXR1cm4gc2lnbiAqIE1BWF9JTlRFR0VSO1xuICB9XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyB2YWx1ZSA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9GaW5pdGU7XG4iLCJ2YXIgdG9GaW5pdGUgPSByZXF1aXJlKCcuL3RvRmluaXRlJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBpbnRlZ2VyLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvSW50ZWdlcmBdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2ludGVnZXIpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29udmVydGVkIGludGVnZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9JbnRlZ2VyKDMuMik7XG4gKiAvLyA9PiAzXG4gKlxuICogXy50b0ludGVnZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiAwXG4gKlxuICogXy50b0ludGVnZXIoSW5maW5pdHkpO1xuICogLy8gPT4gMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDhcbiAqXG4gKiBfLnRvSW50ZWdlcignMy4yJyk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZSkge1xuICB2YXIgcmVzdWx0ID0gdG9GaW5pdGUodmFsdWUpLFxuICAgICAgcmVtYWluZGVyID0gcmVzdWx0ICUgMTtcblxuICByZXR1cm4gcmVzdWx0ID09PSByZXN1bHQgPyAocmVtYWluZGVyID8gcmVzdWx0IC0gcmVtYWluZGVyIDogcmVzdWx0KSA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9JbnRlZ2VyO1xuIiwidmFyIGJhc2VUcmltID0gcmVxdWlyZSgnLi9fYmFzZVRyaW0nKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IGJhc2VUcmltKHZhbHVlKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9OdW1iZXI7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBwbGFpbiBvYmplY3QgZmxhdHRlbmluZyBpbmhlcml0ZWQgZW51bWVyYWJsZSBzdHJpbmdcbiAqIGtleWVkIHByb3BlcnRpZXMgb2YgYHZhbHVlYCB0byBvd24gcHJvcGVydGllcyBvZiB0aGUgcGxhaW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY29udmVydGVkIHBsYWluIG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgbmV3IEZvbyk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2InOiAyIH1cbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMSB9LCBfLnRvUGxhaW5PYmplY3QobmV3IEZvbykpO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzIH1cbiAqL1xuZnVuY3Rpb24gdG9QbGFpbk9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gY29weU9iamVjdCh2YWx1ZSwga2V5c0luKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9QbGFpbk9iamVjdDtcbiIsInZhciBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlVG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvU3RyaW5nKG51bGwpO1xuICogLy8gPT4gJydcbiAqXG4gKiBfLnRvU3RyaW5nKC0wKTtcbiAqIC8vID0+ICctMCdcbiAqXG4gKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAnMSwyLDMnXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU3RyaW5nO1xuIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGJhc2VDcmVhdGUgPSByZXF1aXJlKCcuL19iYXNlQ3JlYXRlJyksXG4gICAgYmFzZUZvck93biA9IHJlcXVpcmUoJy4vX2Jhc2VGb3JPd24nKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKlxuICogQW4gYWx0ZXJuYXRpdmUgdG8gYF8ucmVkdWNlYDsgdGhpcyBtZXRob2QgdHJhbnNmb3JtcyBgb2JqZWN0YCB0byBhIG5ld1xuICogYGFjY3VtdWxhdG9yYCBvYmplY3Qgd2hpY2ggaXMgdGhlIHJlc3VsdCBvZiBydW5uaW5nIGVhY2ggb2YgaXRzIG93blxuICogZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydGllcyB0aHJ1IGBpdGVyYXRlZWAsIHdpdGggZWFjaCBpbnZvY2F0aW9uXG4gKiBwb3RlbnRpYWxseSBtdXRhdGluZyB0aGUgYGFjY3VtdWxhdG9yYCBvYmplY3QuIElmIGBhY2N1bXVsYXRvcmAgaXMgbm90XG4gKiBwcm92aWRlZCwgYSBuZXcgb2JqZWN0IHdpdGggdGhlIHNhbWUgYFtbUHJvdG90eXBlXV1gIHdpbGwgYmUgdXNlZC4gVGhlXG4gKiBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggZm91ciBhcmd1bWVudHM6IChhY2N1bXVsYXRvciwgdmFsdWUsIGtleSwgb2JqZWN0KS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDEuMy4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFthY2N1bXVsYXRvcl0gVGhlIGN1c3RvbSBhY2N1bXVsYXRvciB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50cmFuc2Zvcm0oWzIsIDMsIDRdLCBmdW5jdGlvbihyZXN1bHQsIG4pIHtcbiAqICAgcmVzdWx0LnB1c2gobiAqPSBuKTtcbiAqICAgcmV0dXJuIG4gJSAyID09IDA7XG4gKiB9LCBbXSk7XG4gKiAvLyA9PiBbNCwgOV1cbiAqXG4gKiBfLnRyYW5zZm9ybSh7ICdhJzogMSwgJ2InOiAyLCAnYyc6IDEgfSwgZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gKiAgIChyZXN1bHRbdmFsdWVdIHx8IChyZXN1bHRbdmFsdWVdID0gW10pKS5wdXNoKGtleSk7XG4gKiB9LCB7fSk7XG4gKiAvLyA9PiB7ICcxJzogWydhJywgJ2MnXSwgJzInOiBbJ2InXSB9XG4gKi9cbmZ1bmN0aW9uIHRyYW5zZm9ybShvYmplY3QsIGl0ZXJhdGVlLCBhY2N1bXVsYXRvcikge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KG9iamVjdCksXG4gICAgICBpc0Fyckxpa2UgPSBpc0FyciB8fCBpc0J1ZmZlcihvYmplY3QpIHx8IGlzVHlwZWRBcnJheShvYmplY3QpO1xuXG4gIGl0ZXJhdGVlID0gYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlLCA0KTtcbiAgaWYgKGFjY3VtdWxhdG9yID09IG51bGwpIHtcbiAgICB2YXIgQ3RvciA9IG9iamVjdCAmJiBvYmplY3QuY29uc3RydWN0b3I7XG4gICAgaWYgKGlzQXJyTGlrZSkge1xuICAgICAgYWNjdW11bGF0b3IgPSBpc0FyciA/IG5ldyBDdG9yIDogW107XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gaXNGdW5jdGlvbihDdG9yKSA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlKG9iamVjdCkpIDoge307XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgYWNjdW11bGF0b3IgPSB7fTtcbiAgICB9XG4gIH1cbiAgKGlzQXJyTGlrZSA/IGFycmF5RWFjaCA6IGJhc2VGb3JPd24pKG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgICByZXR1cm4gaXRlcmF0ZWUoYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgb2JqZWN0KTtcbiAgfSk7XG4gIHJldHVybiBhY2N1bXVsYXRvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0cmFuc2Zvcm07XG4iLCJ2YXIgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL19iYXNlRmxhdHRlbicpLFxuICAgIGJhc2VSZXN0ID0gcmVxdWlyZSgnLi9fYmFzZVJlc3QnKSxcbiAgICBiYXNlVW5pcSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmlxJyksXG4gICAgaXNBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlT2JqZWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB1bmlxdWUgdmFsdWVzLCBpbiBvcmRlciwgZnJvbSBhbGwgZ2l2ZW4gYXJyYXlzIHVzaW5nXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHsuLi5BcnJheX0gW2FycmF5c10gVGhlIGFycmF5cyB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgY29tYmluZWQgdmFsdWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnVuaW9uKFsyXSwgWzEsIDJdKTtcbiAqIC8vID0+IFsyLCAxXVxuICovXG52YXIgdW5pb24gPSBiYXNlUmVzdChmdW5jdGlvbihhcnJheXMpIHtcbiAgcmV0dXJuIGJhc2VVbmlxKGJhc2VGbGF0dGVuKGFycmF5cywgMSwgaXNBcnJheUxpa2VPYmplY3QsIHRydWUpKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVuaW9uO1xuIiwidmFyIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzLiAqL1xudmFyIGlkQ291bnRlciA9IDA7XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgdW5pcXVlIElELiBJZiBgcHJlZml4YCBpcyBnaXZlbiwgdGhlIElEIGlzIGFwcGVuZGVkIHRvIGl0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge3N0cmluZ30gW3ByZWZpeD0nJ10gVGhlIHZhbHVlIHRvIHByZWZpeCB0aGUgSUQgd2l0aC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuaXF1ZSBJRC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy51bmlxdWVJZCgnY29udGFjdF8nKTtcbiAqIC8vID0+ICdjb250YWN0XzEwNCdcbiAqXG4gKiBfLnVuaXF1ZUlkKCk7XG4gKiAvLyA9PiAnMTA1J1xuICovXG5mdW5jdGlvbiB1bmlxdWVJZChwcmVmaXgpIHtcbiAgdmFyIGlkID0gKytpZENvdW50ZXI7XG4gIHJldHVybiB0b1N0cmluZyhwcmVmaXgpICsgaWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdW5pcXVlSWQ7XG4iLCJ2YXIgYmFzZVZhbHVlcyA9IHJlcXVpcmUoJy4vX2Jhc2VWYWx1ZXMnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3RyaW5nIGtleWVkIHByb3BlcnR5IHZhbHVlcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy52YWx1ZXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbMSwgMl0gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLnZhbHVlcygnaGknKTtcbiAqIC8vID0+IFsnaCcsICdpJ11cbiAqL1xuZnVuY3Rpb24gdmFsdWVzKG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyBbXSA6IGJhc2VWYWx1ZXMob2JqZWN0LCBrZXlzKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlcztcbiIsInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZVppcE9iamVjdCA9IHJlcXVpcmUoJy4vX2Jhc2VaaXBPYmplY3QnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmZyb21QYWlyc2AgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyB0d28gYXJyYXlzLFxuICogb25lIG9mIHByb3BlcnR5IGlkZW50aWZpZXJzIGFuZCBvbmUgb2YgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjQuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBbcHJvcHM9W11dIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycy5cbiAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXM9W11dIFRoZSBwcm9wZXJ0eSB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnppcE9iamVjdChbJ2EnLCAnYiddLCBbMSwgMl0pO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiB9XG4gKi9cbmZ1bmN0aW9uIHppcE9iamVjdChwcm9wcywgdmFsdWVzKSB7XG4gIHJldHVybiBiYXNlWmlwT2JqZWN0KHByb3BzIHx8IFtdLCB2YWx1ZXMgfHwgW10sIGFzc2lnblZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB6aXBPYmplY3Q7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubm1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUucGF0aHMgPSBbXTtcblx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRyZXR1cm4gbW9kdWxlO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiT2JqZWN0IiwiYXNzaWduIiwiYmluZCIsInRndCIsIl9sZW4iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJzcmNzIiwiQXJyYXkiLCJfa2V5IiwiZm9yRWFjaCIsInNyYyIsImtleXMiLCJrIiwiZGVmYXVsdHMiLCJub2RlU2VwIiwidW5kZWZpbmVkIiwiZWRnZVNlcCIsInJhbmtTZXAiLCJyYW5rRGlyIiwiYWxpZ24iLCJhY3ljbGljZXIiLCJyYW5rZXIiLCJtaW5MZW4iLCJlZGdlIiwiZWRnZVdlaWdodCIsImZpdCIsInBhZGRpbmciLCJzcGFjaW5nRmFjdG9yIiwibm9kZURpbWVuc2lvbnNJbmNsdWRlTGFiZWxzIiwiYW5pbWF0ZSIsImFuaW1hdGVGaWx0ZXIiLCJub2RlIiwiaSIsImFuaW1hdGlvbkR1cmF0aW9uIiwiYW5pbWF0aW9uRWFzaW5nIiwiYm91bmRpbmdCb3giLCJ0cmFuc2Zvcm0iLCJwb3MiLCJyZWFkeSIsInNvcnQiLCJzdG9wIiwiaW1wbCIsInJlcXVpcmUiLCJyZWdpc3RlciIsImN5dG9zY2FwZSIsImlzRnVuY3Rpb24iLCJvIiwiZGFncmUiLCJEYWdyZUxheW91dCIsIm9wdGlvbnMiLCJwcm90b3R5cGUiLCJydW4iLCJsYXlvdXQiLCJjeSIsImVsZXMiLCJnZXRWYWwiLCJlbGUiLCJ2YWwiLCJhcHBseSIsImJiIiwieDEiLCJ5MSIsInciLCJ3aWR0aCIsImgiLCJoZWlnaHQiLCJ4MiIsInkyIiwiZyIsImdyYXBobGliIiwiR3JhcGgiLCJtdWx0aWdyYXBoIiwiY29tcG91bmQiLCJnT2JqIiwic2V0R09iaiIsIm5hbWUiLCJzZXRHcmFwaCIsInNldERlZmF1bHRFZGdlTGFiZWwiLCJzZXREZWZhdWx0Tm9kZUxhYmVsIiwibm9kZXMiLCJuYmIiLCJsYXlvdXREaW1lbnNpb25zIiwic2V0Tm9kZSIsImlkIiwiaXNDaGlsZCIsInNldFBhcmVudCIsInBhcmVudCIsImVkZ2VzIiwic3RkRmlsdGVyIiwic291cmNlIiwiaXNQYXJlbnQiLCJ0YXJnZXQiLCJzZXRFZGdlIiwibWlubGVuIiwid2VpZ2h0IiwiZ05vZGVJZHMiLCJuIiwiZ2V0RWxlbWVudEJ5SWQiLCJzY3JhdGNoIiwiZGFncmVCQiIsIkluZmluaXR5IiwiZE1vZGVsIiwiTWF0aCIsIm1pbiIsIngiLCJtYXgiLCJ5IiwiY29uc3RyYWluUG9zIiwicCIsInhQY3QiLCJ5UGN0IiwibGF5b3V0UG9zaXRpb25zIiwiX3R5cGVvZiJdLCJzb3VyY2VSb290IjoiIn0=