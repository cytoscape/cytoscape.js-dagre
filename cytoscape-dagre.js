(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("dagre"));
	else if(typeof define === 'function' && define.amd)
		define(["dagre"], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeDagre"] = factory(require("dagre"));
	else
		root["cytoscapeDagre"] = factory(root["dagre"]);
})(this, (__WEBPACK_EXTERNAL_MODULE_dagre__) => {
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
var dagre = __webpack_require__(/*! dagre */ "dagre");

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

/***/ "dagre":
/*!************************!*\
  !*** external "dagre" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_dagre__;

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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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