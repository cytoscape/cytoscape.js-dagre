(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeDagre"] = factory();
	else
		root["cytoscapeDagre"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint "no-console": off */



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0) { ; } } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var Graph = __webpack_require__(1).Graph;
module.exports = {
  addBorderNode: addBorderNode,
  addDummyNode: addDummyNode,
  asNonCompoundGraph: asNonCompoundGraph,
  buildLayerMatrix: buildLayerMatrix,
  intersectRect: intersectRect,
  mapValues: mapValues,
  maxRank: maxRank,
  normalizeRanks: normalizeRanks,
  notime: notime,
  partition: partition,
  pick: pick,
  predecessorWeights: predecessorWeights,
  range: range,
  removeEmptyRanks: removeEmptyRanks,
  simplify: simplify,
  successorWeights: successorWeights,
  time: time,
  uniqueId: uniqueId,
  zipObject: zipObject
};

/*
 * Adds a dummy node to the graph and return v.
 */
function addDummyNode(g, type, attrs, name) {
  var v;
  do {
    v = uniqueId(name);
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
  g.nodes().forEach(function (v) {
    return simplified.setNode(v, g.node(v));
  });
  g.edges().forEach(function (e) {
    var simpleLabel = simplified.edge(e.v, e.w) || {
      weight: 0,
      minlen: 1
    };
    var label = g.edge(e);
    simplified.setEdge(e.v, e.w, {
      weight: simpleLabel.weight + label.weight,
      minlen: Math.max(simpleLabel.minlen, label.minlen)
    });
  });
  return simplified;
}
function asNonCompoundGraph(g) {
  var simplified = new Graph({
    multigraph: g.isMultigraph()
  }).setGraph(g.graph());
  g.nodes().forEach(function (v) {
    if (!g.children(v).length) {
      simplified.setNode(v, g.node(v));
    }
  });
  g.edges().forEach(function (e) {
    simplified.setEdge(e, g.edge(e));
  });
  return simplified;
}
function successorWeights(g) {
  var weightMap = g.nodes().map(function (v) {
    var sucs = {};
    g.outEdges(v).forEach(function (e) {
      sucs[e.w] = (sucs[e.w] || 0) + g.edge(e).weight;
    });
    return sucs;
  });
  return zipObject(g.nodes(), weightMap);
}
function predecessorWeights(g) {
  var weightMap = g.nodes().map(function (v) {
    var preds = {};
    g.inEdges(v).forEach(function (e) {
      preds[e.v] = (preds[e.v] || 0) + g.edge(e).weight;
    });
    return preds;
  });
  return zipObject(g.nodes(), weightMap);
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
  return {
    x: x + sx,
    y: y + sy
  };
}

/*
 * Given a DAG with each node assigned "rank" and "order" properties, this
 * function will produce a matrix with the ids of each node.
 */
function buildLayerMatrix(g) {
  var layering = range(maxRank(g) + 1).map(function () {
    return [];
  });
  g.nodes().forEach(function (v) {
    var node = g.node(v);
    var rank = node.rank;
    if (rank !== undefined) {
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
  var min = Math.min.apply(Math, _toConsumableArray(g.nodes().map(function (v) {
    var rank = g.node(v).rank;
    if (rank === undefined) {
      return Number.MAX_VALUE;
    }
    return rank;
  })));
  g.nodes().forEach(function (v) {
    var node = g.node(v);
    if (node.hasOwnProperty("rank")) {
      node.rank -= min;
    }
  });
}
function removeEmptyRanks(g) {
  // Ranks may not start at 0, so we need to offset them
  var offset = Math.min.apply(Math, _toConsumableArray(g.nodes().map(function (v) {
    return g.node(v).rank;
  })));
  var layers = [];
  g.nodes().forEach(function (v) {
    var rank = g.node(v).rank - offset;
    if (!layers[rank]) {
      layers[rank] = [];
    }
    layers[rank].push(v);
  });
  var delta = 0;
  var nodeRankFactor = g.graph().nodeRankFactor;
  Array.from(layers).forEach(function (vs, i) {
    if (vs === undefined && i % nodeRankFactor !== 0) {
      --delta;
    } else if (vs !== undefined && delta) {
      vs.forEach(function (v) {
        return g.node(v).rank += delta;
      });
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
  return Math.max.apply(Math, _toConsumableArray(g.nodes().map(function (v) {
    var rank = g.node(v).rank;
    if (rank === undefined) {
      return Number.MIN_VALUE;
    }
    return rank;
  })));
}

/*
 * Partition a collection into two groups: `lhs` and `rhs`. If the supplied
 * function returns true for an entry it goes into `lhs`. Otherwise it goes
 * into `rhs.
 */
function partition(collection, fn) {
  var result = {
    lhs: [],
    rhs: []
  };
  collection.forEach(function (value) {
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
  var start = Date.now();
  try {
    return fn();
  } finally {
    console.log(name + " time: " + (Date.now() - start) + "ms");
  }
}
function notime(name, fn) {
  return fn();
}
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}
function range(start, limit) {
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  if (limit == null) {
    limit = start;
    start = 0;
  }
  var endCon = function endCon(i) {
    return i < limit;
  };
  if (step < 0) {
    endCon = function endCon(i) {
      return limit < i;
    };
  }
  var range = [];
  for (var i = start; endCon(i); i += step) {
    range.push(i);
  }
  return range;
}
function pick(source, keys) {
  var dest = {};
  var _iterator = _createForOfIteratorHelper(keys),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var key = _step.value;
      if (source[key] !== undefined) {
        dest[key] = source[key];
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return dest;
}
function mapValues(obj, funcOrProp) {
  var func = funcOrProp;
  if (typeof funcOrProp === 'string') {
    func = function func(val) {
      return val[funcOrProp];
    };
  }
  return Object.entries(obj).reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      k = _ref2[0],
      v = _ref2[1];
    acc[k] = func(v, k);
    return acc;
  }, {});
}
function zipObject(props, values) {
  return props.reduce(function (acc, key, i) {
    acc[key] = values[i];
    return acc;
  }, {});
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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

var lib = __webpack_require__(15);
module.exports = {
  Graph: lib.Graph,
  json: __webpack_require__(17),
  alg: __webpack_require__(18),
  version: lib.version
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
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
    if (visited.hasOwnProperty(v)) {
      return label.rank;
    }
    visited[v] = true;
    var rank = Math.min.apply(Math, _toConsumableArray(g.outEdges(v).map(function (e) {
      if (e == null) {
        return Number.POSITIVE_INFINITY;
      }
      return dfs(e.w) - g.edge(e).minlen;
    })));
    if (rank === Number.POSITIVE_INFINITY) {
      rank = 0;
    }
    return label.rank = rank;
  }
  g.sources().forEach(dfs);
}

/*
 * Returns the amount of slack for the given edge. The slack is defined as the
 * difference between the length of the edge and its minimum length.
 */
function slack(g, e) {
  return g.node(e.w).rank - g.node(e.v).rank - g.edge(e).minlen;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0) { ; } } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
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
var _isDirected = new WeakMap();
var _isMultigraph = new WeakMap();
var _isCompound = new WeakMap();
var _label = new WeakMap();
var _defaultNodeLabelFn = new WeakMap();
var _defaultEdgeLabelFn = new WeakMap();
var _nodes = new WeakMap();
var _in = new WeakMap();
var _preds = new WeakMap();
var _out = new WeakMap();
var _sucs = new WeakMap();
var _edgeObjs = new WeakMap();
var _edgeLabels = new WeakMap();
var _nodeCount = new WeakMap();
var _edgeCount = new WeakMap();
var _parent = new WeakMap();
var _children = new WeakMap();
var _removeFromParentsChildList = new WeakSet();
var Graph = /*#__PURE__*/function () {
  // Label for the graph itself

  // Defaults to be set when creating a new node

  // Defaults to be set when creating a new edge

  // v -> label

  // v -> edgeObj

  // u -> v -> Number

  // v -> edgeObj

  // v -> w -> Number

  // e -> edgeObj

  // e -> label

  /* Number of nodes in the graph. Should only be changed by the implementation. */

  /* Number of edges in the graph. Should only be changed by the implementation. */

  function Graph(opts) {
    _classCallCheck(this, Graph);
    _removeFromParentsChildList.add(this);
    _isDirected.set(this, {
      writable: true,
      value: true
    });
    _isMultigraph.set(this, {
      writable: true,
      value: false
    });
    _isCompound.set(this, {
      writable: true,
      value: false
    });
    _label.set(this, {
      writable: true,
      value: void 0
    });
    _defaultNodeLabelFn.set(this, {
      writable: true,
      value: function value() {
        return undefined;
      }
    });
    _defaultEdgeLabelFn.set(this, {
      writable: true,
      value: function value() {
        return undefined;
      }
    });
    _nodes.set(this, {
      writable: true,
      value: {}
    });
    _in.set(this, {
      writable: true,
      value: {}
    });
    _preds.set(this, {
      writable: true,
      value: {}
    });
    _out.set(this, {
      writable: true,
      value: {}
    });
    _sucs.set(this, {
      writable: true,
      value: {}
    });
    _edgeObjs.set(this, {
      writable: true,
      value: {}
    });
    _edgeLabels.set(this, {
      writable: true,
      value: {}
    });
    _nodeCount.set(this, {
      writable: true,
      value: 0
    });
    _edgeCount.set(this, {
      writable: true,
      value: 0
    });
    _parent.set(this, {
      writable: true,
      value: void 0
    });
    _children.set(this, {
      writable: true,
      value: void 0
    });
    if (opts) {
      _classPrivateFieldSet(this, _isDirected, opts.hasOwnProperty("directed") ? opts.directed : true);
      _classPrivateFieldSet(this, _isMultigraph, opts.hasOwnProperty("multigraph") ? opts.multigraph : false);
      _classPrivateFieldSet(this, _isCompound, opts.hasOwnProperty("compound") ? opts.compound : false);
    }
    if (_classPrivateFieldGet(this, _isCompound)) {
      // v -> parent
      _classPrivateFieldSet(this, _parent, {});

      // v -> children
      _classPrivateFieldSet(this, _children, {});
      _classPrivateFieldGet(this, _children)[GRAPH_NODE] = {};
    }
  }

  /* === Graph functions ========= */

  /**
   * Whether graph was created with 'directed' flag set to true or not.
   */
  _createClass(Graph, [{
    key: "isDirected",
    value: function isDirected() {
      return _classPrivateFieldGet(this, _isDirected);
    }
    /**
     * Whether graph was created with 'multigraph' flag set to true or not.
     */
  }, {
    key: "isMultigraph",
    value: function isMultigraph() {
      return _classPrivateFieldGet(this, _isMultigraph);
    }
    /**
     * Whether graph was created with 'compound' flag set to true or not.
     */
  }, {
    key: "isCompound",
    value: function isCompound() {
      return _classPrivateFieldGet(this, _isCompound);
    }
    /**
     * Sets the label of the graph.
     */
  }, {
    key: "setGraph",
    value: function setGraph(label) {
      _classPrivateFieldSet(this, _label, label);
      return this;
    }
    /**
     * Gets the graph label.
     */
  }, {
    key: "graph",
    value: function graph() {
      return _classPrivateFieldGet(this, _label);
    }
    /* === Node functions ========== */
    /**
     * Sets the default node label. If newDefault is a function, it will be
     * invoked ach time when setting a label for a node. Otherwise, this label
     * will be assigned as default label in case if no label was specified while
     * setting a node.
     * Complexity: O(1).
     */
  }, {
    key: "setDefaultNodeLabel",
    value: function setDefaultNodeLabel(newDefault) {
      _classPrivateFieldSet(this, _defaultNodeLabelFn, newDefault);
      if (typeof newDefault !== 'function') {
        _classPrivateFieldSet(this, _defaultNodeLabelFn, function () {
          return newDefault;
        });
      }
      return this;
    }
    /**
     * Gets the number of nodes in the graph.
     * Complexity: O(1).
     */
  }, {
    key: "nodeCount",
    value: function nodeCount() {
      return _classPrivateFieldGet(this, _nodeCount);
    }
    /**
     * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
     * not included in list.
     * Complexity: O(1).
     */
  }, {
    key: "nodes",
    value: function nodes() {
      return Object.keys(_classPrivateFieldGet(this, _nodes));
    }
    /**
     * Gets list of nodes without in-edges.
     * Complexity: O(|V|).
     */
  }, {
    key: "sources",
    value: function sources() {
      var self = this;
      return this.nodes().filter(function (v) {
        return Object.keys(_classPrivateFieldGet(self, _in)[v]).length === 0;
      });
    }
    /**
     * Gets list of nodes without out-edges.
     * Complexity: O(|V|).
     */
  }, {
    key: "sinks",
    value: function sinks() {
      var self = this;
      return this.nodes().filter(function (v) {
        return Object.keys(_classPrivateFieldGet(self, _out)[v]).length === 0;
      });
    }
    /**
     * Invokes setNode method for each node in names list.
     * Complexity: O(|names|).
     */
  }, {
    key: "setNodes",
    value: function setNodes(vs, value) {
      var args = arguments;
      var self = this;
      vs.forEach(function (v) {
        if (args.length > 1) {
          self.setNode(v, value);
        } else {
          self.setNode(v);
        }
      });
      return this;
    }
    /**
     * Creates or updates the value for the node v in the graph. If label is supplied
     * it is set as the value for the node. If label is not supplied and the node was
     * created by this call then the default node label will be assigned.
     * Complexity: O(1).
     */
  }, {
    key: "setNode",
    value: function setNode(v, value) {
      if (_classPrivateFieldGet(this, _nodes).hasOwnProperty(v)) {
        if (arguments.length > 1) {
          _classPrivateFieldGet(this, _nodes)[v] = value;
        }
        return this;
      }
      _classPrivateFieldGet(this, _nodes)[v] = arguments.length > 1 ? value : _classPrivateFieldGet(this, _defaultNodeLabelFn).call(this, v);
      if (_classPrivateFieldGet(this, _isCompound)) {
        _classPrivateFieldGet(this, _parent)[v] = GRAPH_NODE;
        _classPrivateFieldGet(this, _children)[v] = {};
        _classPrivateFieldGet(this, _children)[GRAPH_NODE][v] = true;
      }
      _classPrivateFieldGet(this, _in)[v] = {};
      _classPrivateFieldGet(this, _preds)[v] = {};
      _classPrivateFieldGet(this, _out)[v] = {};
      _classPrivateFieldGet(this, _sucs)[v] = {};
      _classPrivateFieldSet(this, _nodeCount, +_classPrivateFieldGet(this, _nodeCount) + 1);
      return this;
    }
    /**
     * Gets the label of node with specified name.
     * Complexity: O(|V|).
     */
  }, {
    key: "node",
    value: function node(v) {
      return _classPrivateFieldGet(this, _nodes)[v];
    }
    /**
     * Detects whether graph has a node with specified name or not.
     */
  }, {
    key: "hasNode",
    value: function hasNode(v) {
      return _classPrivateFieldGet(this, _nodes).hasOwnProperty(v);
    }
    /**
     * Remove the node with the name from the graph or do nothing if the node is not in
     * the graph. If the node was removed this function also removes any incident
     * edges.
     * Complexity: O(1).
     */
  }, {
    key: "removeNode",
    value: function removeNode(v) {
      var self = this;
      if (_classPrivateFieldGet(this, _nodes).hasOwnProperty(v)) {
        var removeEdge = function removeEdge(e) {
          return self.removeEdge(_classPrivateFieldGet(self, _edgeObjs)[e]);
        };
        delete _classPrivateFieldGet(this, _nodes)[v];
        if (_classPrivateFieldGet(this, _isCompound)) {
          _classPrivateMethodGet(this, _removeFromParentsChildList, _removeFromParentsChildList2).call(this, v);
          delete _classPrivateFieldGet(this, _parent)[v];
          this.children(v).forEach(function (child) {
            self.setParent(child);
          });
          delete _classPrivateFieldGet(this, _children)[v];
        }
        Object.keys(_classPrivateFieldGet(this, _in)[v]).forEach(removeEdge);
        delete _classPrivateFieldGet(this, _in)[v];
        delete _classPrivateFieldGet(this, _preds)[v];
        Object.keys(_classPrivateFieldGet(this, _out)[v]).forEach(removeEdge);
        delete _classPrivateFieldGet(this, _out)[v];
        delete _classPrivateFieldGet(this, _sucs)[v];
        _classPrivateFieldSet(this, _nodeCount, +_classPrivateFieldGet(this, _nodeCount) - 1);
      }
      return this;
    }
    /**
     * Sets node p as a parent for node v if it is defined, or removes the
     * parent for v if p is undefined. Method throws an exception in case of
     * invoking it in context of noncompound graph.
     * Average-case complexity: O(1).
     */
  }, {
    key: "setParent",
    value: function setParent(v, parent) {
      if (!_classPrivateFieldGet(this, _isCompound)) {
        throw new Error("Cannot set parent in a non-compound graph");
      }
      if (parent === undefined) {
        parent = GRAPH_NODE;
      } else {
        // Coerce parent to string
        parent += "";
        for (var ancestor = parent; ancestor !== undefined; ancestor = this.parent(ancestor)) {
          if (ancestor === v) {
            throw new Error("Setting " + parent + " as parent of " + v + " would create a cycle");
          }
        }
        this.setNode(parent);
      }
      this.setNode(v);
      _classPrivateMethodGet(this, _removeFromParentsChildList, _removeFromParentsChildList2).call(this, v);
      _classPrivateFieldGet(this, _parent)[v] = parent;
      _classPrivateFieldGet(this, _children)[parent][v] = true;
      return this;
    }
  }, {
    key: "parent",
    /**
     * Gets parent node for node v.
     * Complexity: O(1).
     */
    value: function parent(v) {
      if (_classPrivateFieldGet(this, _isCompound)) {
        var parent = _classPrivateFieldGet(this, _parent)[v];
        if (parent !== GRAPH_NODE) {
          return parent;
        }
      }
    }
    /**
     * Gets list of direct children of node v.
     * Complexity: O(1).
     */
  }, {
    key: "children",
    value: function children() {
      var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : GRAPH_NODE;
      if (_classPrivateFieldGet(this, _isCompound)) {
        var children = _classPrivateFieldGet(this, _children)[v];
        if (children) {
          return Object.keys(children);
        }
      } else if (v === GRAPH_NODE) {
        return this.nodes();
      } else if (this.hasNode(v)) {
        return [];
      }
    }
    /**
     * Return all nodes that are predecessors of the specified node or undefined if node v is not in
     * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
     * Complexity: O(|V|).
     */
  }, {
    key: "predecessors",
    value: function predecessors(v) {
      var predsV = _classPrivateFieldGet(this, _preds)[v];
      if (predsV) {
        return Object.keys(predsV);
      }
    }
    /**
     * Return all nodes that are successors of the specified node or undefined if node v is not in
     * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
     * Complexity: O(|V|).
     */
  }, {
    key: "successors",
    value: function successors(v) {
      var sucsV = _classPrivateFieldGet(this, _sucs)[v];
      if (sucsV) {
        return Object.keys(sucsV);
      }
    }
    /**
     * Return all nodes that are predecessors or successors of the specified node or undefined if
     * node v is not in the graph.
     * Complexity: O(|V|).
     */
  }, {
    key: "neighbors",
    value: function neighbors(v) {
      var preds = this.predecessors(v);
      if (preds) {
        var union = new Set(preds);
        var _iterator = _createForOfIteratorHelper(this.successors(v)),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var succ = _step.value;
            union.add(succ);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return Array.from(union.values());
      }
    }
  }, {
    key: "isLeaf",
    value: function isLeaf(v) {
      var neighbors;
      if (this.isDirected()) {
        neighbors = this.successors(v);
      } else {
        neighbors = this.neighbors(v);
      }
      return neighbors.length === 0;
    }
    /**
     * Creates new graph with nodes filtered via filter. Edges incident to rejected node
     * are also removed. In case of compound graph, if parent is rejected by filter,
     * than all its children are rejected too.
     * Average-case complexity: O(|E|+|V|).
     */
  }, {
    key: "filterNodes",
    value: function filterNodes(filter) {
      var copy = new this.constructor({
        directed: _classPrivateFieldGet(this, _isDirected),
        multigraph: _classPrivateFieldGet(this, _isMultigraph),
        compound: _classPrivateFieldGet(this, _isCompound)
      });
      copy.setGraph(this.graph());
      var self = this;
      Object.entries(_classPrivateFieldGet(this, _nodes)).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          v = _ref2[0],
          value = _ref2[1];
        if (filter(v)) {
          copy.setNode(v, value);
        }
      });
      Object.values(_classPrivateFieldGet(this, _edgeObjs)).forEach(function (e) {
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
      if (_classPrivateFieldGet(this, _isCompound)) {
        copy.nodes().forEach(function (v) {
          return copy.setParent(v, findParent(v));
        });
      }
      return copy;
    }
    /* === Edge functions ========== */
    /**
     * Sets the default edge label or factory function. This label will be
     * assigned as default label in case if no label was specified while setting
     * an edge or this function will be invoked each time when setting an edge
     * with no label specified and returned value * will be used as a label for edge.
     * Complexity: O(1).
     */
  }, {
    key: "setDefaultEdgeLabel",
    value: function setDefaultEdgeLabel(newDefault) {
      _classPrivateFieldSet(this, _defaultEdgeLabelFn, newDefault);
      if (typeof newDefault !== 'function') {
        _classPrivateFieldSet(this, _defaultEdgeLabelFn, function () {
          return newDefault;
        });
      }
      return this;
    }
    /**
     * Gets the number of edges in the graph.
     * Complexity: O(1).
     */
  }, {
    key: "edgeCount",
    value: function edgeCount() {
      return _classPrivateFieldGet(this, _edgeCount);
    }
    /**
     * Gets edges of the graph. In case of compound graph subgraphs are not considered.
     * Complexity: O(|E|).
     */
  }, {
    key: "edges",
    value: function edges() {
      return Object.values(_classPrivateFieldGet(this, _edgeObjs));
    }
    /**
     * Establish an edges path over the nodes in nodes list. If some edge is already
     * exists, it will update its label, otherwise it will create an edge between pair
     * of nodes with label provided or default label if no label provided.
     * Complexity: O(|nodes|).
     */
  }, {
    key: "setPath",
    value: function setPath(vs, value) {
      var self = this;
      var args = arguments;
      vs.reduce(function (v, w) {
        if (args.length > 1) {
          self.setEdge(v, w, value);
        } else {
          self.setEdge(v, w);
        }
        return w;
      });
      return this;
    }
    /**
     * Creates or updates the label for the edge (v, w) with the optionally supplied
     * name. If label is supplied it is set as the value for the edge. If label is not
     * supplied and the edge was created by this call then the default edge label will
     * be assigned. The name parameter is only useful with multigraphs.
     */
  }, {
    key: "setEdge",
    value: function setEdge() {
      var _this$edgeCount;
      var v, w, name, value;
      var valueSpecified = false;
      var arg0 = arguments[0];
      if (_typeof(arg0) === "object" && arg0 !== null && "v" in arg0) {
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
      if (name !== undefined) {
        name = "" + name;
      }
      var e = edgeArgsToId(_classPrivateFieldGet(this, _isDirected), v, w, name);
      if (_classPrivateFieldGet(this, _edgeLabels).hasOwnProperty(e)) {
        if (valueSpecified) {
          _classPrivateFieldGet(this, _edgeLabels)[e] = value;
        }
        return this;
      }
      if (name !== undefined && !_classPrivateFieldGet(this, _isMultigraph)) {
        throw new Error("Cannot set a named edge when isMultigraph = false");
      }

      // It didn't exist, so we need to create it.
      // First ensure the nodes exist.
      this.setNode(v);
      this.setNode(w);
      _classPrivateFieldGet(this, _edgeLabels)[e] = valueSpecified ? value : _classPrivateFieldGet(this, _defaultEdgeLabelFn).call(this, v, w, name);
      var edgeObj = edgeArgsToObj(_classPrivateFieldGet(this, _isDirected), v, w, name);
      // Ensure we add undirected edges in a consistent way.
      v = edgeObj.v;
      w = edgeObj.w;
      Object.freeze(edgeObj);
      _classPrivateFieldGet(this, _edgeObjs)[e] = edgeObj;
      incrementOrInitEntry(_classPrivateFieldGet(this, _preds)[w], v);
      incrementOrInitEntry(_classPrivateFieldGet(this, _sucs)[v], w);
      _classPrivateFieldGet(this, _in)[w][e] = edgeObj;
      _classPrivateFieldGet(this, _out)[v][e] = edgeObj;
      _classPrivateFieldSet(this, _edgeCount, (_this$edgeCount = +_classPrivateFieldGet(this, _edgeCount)) + 1), _this$edgeCount;
      return this;
    }
    /**
     * Gets the label for the specified edge.
     * Complexity: O(1).
     */
  }, {
    key: "edge",
    value: function edge(v, w, name) {
      var e = arguments.length === 1 ? edgeObjToId(_classPrivateFieldGet(this, _isDirected), arguments[0]) : edgeArgsToId(_classPrivateFieldGet(this, _isDirected), v, w, name);
      return _classPrivateFieldGet(this, _edgeLabels)[e];
    }
    /**
     * Gets the label for the specified edge and converts it to an object.
     * Complexity: O(1)
     */
  }, {
    key: "edgeAsObj",
    value: function edgeAsObj() {
      var edge = this.edge.apply(this, arguments);
      if (_typeof(edge) !== "object") {
        return {
          label: edge
        };
      }
      return edge;
    }
    /**
     * Detects whether the graph contains specified edge or not. No subgraphs are considered.
     * Complexity: O(1).
     */
  }, {
    key: "hasEdge",
    value: function hasEdge(v, w, name) {
      var e = arguments.length === 1 ? edgeObjToId(_classPrivateFieldGet(this, _isDirected), arguments[0]) : edgeArgsToId(_classPrivateFieldGet(this, _isDirected), v, w, name);
      return _classPrivateFieldGet(this, _edgeLabels).hasOwnProperty(e);
    }
    /**
     * Removes the specified edge from the graph. No subgraphs are considered.
     * Complexity: O(1).
     */
  }, {
    key: "removeEdge",
    value: function removeEdge(v, w, name) {
      var e = arguments.length === 1 ? edgeObjToId(_classPrivateFieldGet(this, _isDirected), arguments[0]) : edgeArgsToId(_classPrivateFieldGet(this, _isDirected), v, w, name);
      var edge = _classPrivateFieldGet(this, _edgeObjs)[e];
      if (edge) {
        var _this$edgeCount2;
        v = edge.v;
        w = edge.w;
        delete _classPrivateFieldGet(this, _edgeLabels)[e];
        delete _classPrivateFieldGet(this, _edgeObjs)[e];
        decrementOrRemoveEntry(_classPrivateFieldGet(this, _preds)[w], v);
        decrementOrRemoveEntry(_classPrivateFieldGet(this, _sucs)[v], w);
        delete _classPrivateFieldGet(this, _in)[w][e];
        delete _classPrivateFieldGet(this, _out)[v][e];
        _classPrivateFieldSet(this, _edgeCount, (_this$edgeCount2 = +_classPrivateFieldGet(this, _edgeCount)) - 1), _this$edgeCount2;
      }
      return this;
    }
    /**
     * Return all edges that point to the node v. Optionally filters those edges down to just those
     * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     */
  }, {
    key: "inEdges",
    value: function inEdges(v, u) {
      var inV = _classPrivateFieldGet(this, _in)[v];
      if (inV) {
        var edges = Object.values(inV);
        if (!u) {
          return edges;
        }
        return edges.filter(function (edge) {
          return edge.v === u;
        });
      }
    }
    /**
     * Return all edges that are pointed at by node v. Optionally filters those edges down to just
     * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     */
  }, {
    key: "outEdges",
    value: function outEdges(v, w) {
      var outV = _classPrivateFieldGet(this, _out)[v];
      if (outV) {
        var edges = Object.values(outV);
        if (!w) {
          return edges;
        }
        return edges.filter(function (edge) {
          return edge.w === w;
        });
      }
    }
    /**
     * Returns all edges to or from node v regardless of direction. Optionally filters those edges
     * down to just those between nodes v and w regardless of direction.
     * Complexity: O(|E|).
     */
  }, {
    key: "nodeEdges",
    value: function nodeEdges(v, w) {
      var inEdges = this.inEdges(v, w);
      if (inEdges) {
        return inEdges.concat(this.outEdges(v, w));
      }
    }
  }]);
  return Graph;
}();
var _removeFromParentsChildList2 = function _removeFromParentsChildList2(v) {
  delete _classPrivateFieldGet(this, _children)[_classPrivateFieldGet(this, _parent)[v]][v];
};
function incrementOrInitEntry(map, k) {
  if (map[k]) {
    map[k]++;
  } else {
    map[k] = 1;
  }
}
function decrementOrRemoveEntry(map, k) {
  if (! --map[k]) {
    delete map[k];
  }
}
function edgeArgsToId(isDirected, v_, w_, name) {
  var v = "" + v_;
  var w = "" + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM + (name === undefined ? DEFAULT_EDGE_NAME : name);
}
function edgeArgsToObj(isDirected, v_, w_, name) {
  var v = "" + v_;
  var w = "" + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  var edgeObj = {
    v: v,
    w: w
  };
  if (name) {
    edgeObj.name = name;
  }
  return edgeObj;
}
function edgeObjToId(isDirected, edgeObj) {
  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
}
module.exports = Graph;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var PriorityQueue = __webpack_require__(5);
module.exports = dijkstra;
var DEFAULT_WEIGHT_FUNC = function DEFAULT_WEIGHT_FUNC() {
  return 1;
};
function dijkstra(g, source, weightFn, edgeFn) {
  return runDijkstra(g, String(source), weightFn || DEFAULT_WEIGHT_FUNC, edgeFn || function (v) {
    return g.outEdges(v);
  });
}
function runDijkstra(g, source, weightFn, edgeFn) {
  var results = {};
  var pq = new PriorityQueue();
  var v, vEntry;
  var updateNeighbors = function updateNeighbors(edge) {
    var w = edge.v !== v ? edge.v : edge.w;
    var wEntry = results[w];
    var weight = weightFn(edge);
    var distance = vEntry.distance + weight;
    if (weight < 0) {
      throw new Error("dijkstra does not allow negative edge weights. " + "Bad edge: " + edge + " Weight: " + weight);
    }
    if (distance < wEntry.distance) {
      wEntry.distance = distance;
      wEntry.predecessor = v;
      pq.decrease(w, distance);
    }
  };
  g.nodes().forEach(function (v) {
    var distance = v === source ? 0 : Number.POSITIVE_INFINITY;
    results[v] = {
      distance: distance
    };
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
/* 5 */
/***/ (function(module, exports) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
var _arr = new WeakMap();
var _keyIndices = new WeakMap();
var _heapify = new WeakSet();
var _decrease = new WeakSet();
var _swap = new WeakSet();
/**
 * A min-priority queue data structure. This algorithm is derived from Cormen,
 * et al., "Introduction to Algorithms". The basic idea of a min-priority
 * queue is that you can efficiently (in O(1) time) get the smallest key in
 * the queue. Adding and removing elements takes O(log n) time. A key can
 * have its priority decreased in O(log n) time.
 */
var PriorityQueue = /*#__PURE__*/function () {
  function PriorityQueue() {
    _classCallCheck(this, PriorityQueue);
    _swap.add(this);
    _decrease.add(this);
    _heapify.add(this);
    _arr.set(this, {
      writable: true,
      value: []
    });
    _keyIndices.set(this, {
      writable: true,
      value: {}
    });
  }
  _createClass(PriorityQueue, [{
    key: "size",
    /**
     * Returns the number of elements in the queue. Takes `O(1)` time.
     */
    value: function size() {
      return _classPrivateFieldGet(this, _arr).length;
    }
    /**
     * Returns the keys that are in the queue. Takes `O(n)` time.
     */
  }, {
    key: "keys",
    value: function keys() {
      return _classPrivateFieldGet(this, _arr).map(function (x) {
        return x.key;
      });
    }
    /**
     * Returns `true` if **key** is in the queue and `false` if not.
     */
  }, {
    key: "has",
    value: function has(key) {
      return _classPrivateFieldGet(this, _keyIndices).hasOwnProperty(key);
    }
    /**
     * Returns the priority for **key**. If **key** is not present in the queue
     * then this function returns `undefined`. Takes `O(1)` time.
     *
     * @param {Object} key
     */
  }, {
    key: "priority",
    value: function priority(key) {
      var index = _classPrivateFieldGet(this, _keyIndices)[key];
      if (index !== undefined) {
        return _classPrivateFieldGet(this, _arr)[index].priority;
      }
    }
    /**
     * Returns the key for the minimum element in this queue. If the queue is
     * empty this function throws an Error. Takes `O(1)` time.
     */
  }, {
    key: "min",
    value: function min() {
      if (this.size() === 0) {
        throw new Error("Queue underflow");
      }
      return _classPrivateFieldGet(this, _arr)[0].key;
    }
    /**
     * Inserts a new key into the priority queue. If the key already exists in
     * the queue this function returns `false`; otherwise it will return `true`.
     * Takes `O(n)` time.
     *
     * @param {Object} key the key to add
     * @param {Number} priority the initial priority for the key
     */
  }, {
    key: "add",
    value: function add(key, priority) {
      var keyIndices = _classPrivateFieldGet(this, _keyIndices);
      key = String(key);
      if (!keyIndices.hasOwnProperty(key)) {
        var arr = _classPrivateFieldGet(this, _arr);
        var index = arr.length;
        keyIndices[key] = index;
        arr.push({
          key: key,
          priority: priority
        });
        _classPrivateMethodGet(this, _decrease, _decrease2).call(this, index);
        return true;
      }
      return false;
    }
    /**
     * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
     */
  }, {
    key: "removeMin",
    value: function removeMin() {
      _classPrivateMethodGet(this, _swap, _swap2).call(this, 0, _classPrivateFieldGet(this, _arr).length - 1);
      var min = _classPrivateFieldGet(this, _arr).pop();
      delete _classPrivateFieldGet(this, _keyIndices)[min.key];
      _classPrivateMethodGet(this, _heapify, _heapify2).call(this, 0);
      return min.key;
    }
    /**
     * Decreases the priority for **key** to **priority**. If the new priority is
     * greater than the previous priority, this function will throw an Error.
     *
     * @param {Object} key the key for which to raise priority
     * @param {Number} priority the new priority for the key
     */
  }, {
    key: "decrease",
    value: function decrease(key, priority) {
      var index = _classPrivateFieldGet(this, _keyIndices)[key];
      if (priority > _classPrivateFieldGet(this, _arr)[index].priority) {
        throw new Error("New priority is greater than current priority. " + "Key: " + key + " Old: " + _classPrivateFieldGet(this, _arr)[index].priority + " New: " + priority);
      }
      _classPrivateFieldGet(this, _arr)[index].priority = priority;
      _classPrivateMethodGet(this, _decrease, _decrease2).call(this, index);
    }
  }]);
  return PriorityQueue;
}();
var _heapify2 = function _heapify2(i) {
  var arr = _classPrivateFieldGet(this, _arr);
  var l = 2 * i;
  var r = l + 1;
  var largest = i;
  if (l < arr.length) {
    largest = arr[l].priority < arr[largest].priority ? l : largest;
    if (r < arr.length) {
      largest = arr[r].priority < arr[largest].priority ? r : largest;
    }
    if (largest !== i) {
      _classPrivateMethodGet(this, _swap, _swap2).call(this, i, largest);
      _classPrivateMethodGet(this, _heapify, _heapify2).call(this, largest);
    }
  }
};
var _decrease2 = function _decrease2(index) {
  var arr = _classPrivateFieldGet(this, _arr);
  var priority = arr[index].priority;
  var parent;
  while (index !== 0) {
    parent = index >> 1;
    if (arr[parent].priority < priority) {
      break;
    }
    _classPrivateMethodGet(this, _swap, _swap2).call(this, index, parent);
    index = parent;
  }
};
var _swap2 = function _swap2(i, j) {
  var arr = _classPrivateFieldGet(this, _arr);
  var keyIndices = _classPrivateFieldGet(this, _keyIndices);
  var origArrI = arr[i];
  var origArrJ = arr[j];
  arr[i] = origArrJ;
  arr[j] = origArrI;
  keyIndices[origArrJ.key] = i;
  keyIndices[origArrI.key] = j;
};
module.exports = PriorityQueue;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

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
    g.successors(v).forEach(function (w) {
      if (!visited.hasOwnProperty(w)) {
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
  g.nodes().forEach(function (v) {
    if (!visited.hasOwnProperty(v)) {
      dfs(v);
    }
  });
  return results;
}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function topsort(g) {
  var visited = {};
  var stack = {};
  var results = [];
  function visit(node) {
    if (stack.hasOwnProperty(node)) {
      throw new CycleException();
    }
    if (!visited.hasOwnProperty(node)) {
      stack[node] = true;
      visited[node] = true;
      g.predecessors(node).forEach(visit);
      delete stack[node];
      results.push(node);
    }
  }
  g.sinks().forEach(visit);
  if (Object.keys(visited).length !== g.nodeCount()) {
    throw new CycleException();
  }
  return results;
}
var CycleException = /*#__PURE__*/function (_Error) {
  _inherits(CycleException, _Error);
  var _super = _createSuper(CycleException);
  function CycleException() {
    _classCallCheck(this, CycleException);
    return _super.apply(this, arguments);
  }
  return CycleException;
}( /*#__PURE__*/_wrapNativeSuper(Error));
module.exports = topsort;
topsort.CycleException = CycleException;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = dfs;

/*
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and returns the nodes in the order they were visited. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * If the order is not "post", it will be treated as "pre".
 */
function dfs(g, vs, order) {
  if (!Array.isArray(vs)) {
    vs = [vs];
  }
  var navigation = g.isDirected() ? function (v) {
    return g.successors(v);
  } : function (v) {
    return g.neighbors(v);
  };
  var orderFunc = order === "post" ? postOrderDfs : preOrderDfs;
  var acc = [];
  var visited = {};
  vs.forEach(function (v) {
    if (!g.hasNode(v)) {
      throw new Error("Graph does not have node: " + v);
    }
    orderFunc(v, navigation, visited, acc);
  });
  return acc;
}
function postOrderDfs(v, navigation, visited, acc) {
  var stack = [[v, false]];
  while (stack.length > 0) {
    var curr = stack.pop();
    if (curr[1]) {
      acc.push(curr[0]);
    } else {
      if (!visited.hasOwnProperty(curr[0])) {
        visited[curr[0]] = true;
        stack.push([curr[0], true]);
        forEachRight(navigation(curr[0]), function (w) {
          return stack.push([w, false]);
        });
      }
    }
  }
}
function preOrderDfs(v, navigation, visited, acc) {
  var stack = [v];
  while (stack.length > 0) {
    var curr = stack.pop();
    if (!visited.hasOwnProperty(curr)) {
      visited[curr] = true;
      acc.push(curr);
      forEachRight(navigation(curr), function (w) {
        return stack.push(w);
      });
    }
  }
}
function forEachRight(array, iteratee) {
  var length = array.length;
  while (length--) {
    iteratee(array[length], length, array);
  }
  return array;
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Graph = __webpack_require__(1).Graph;
var slack = __webpack_require__(2).slack;
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
  var t = new Graph({
    directed: false
  });

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
    g.nodeEdges(v).forEach(function (e) {
      var edgeV = e.v,
        w = v === edgeV ? e.w : edgeV;
      if (!t.hasNode(w) && !slack(g, e)) {
        t.setNode(w, {});
        t.setEdge(v, w, {});
        dfs(w);
      }
    });
  }
  t.nodes().forEach(dfs);
  return t.nodeCount();
}

/*
 * Finds the edge with the smallest slack that is incident on tree and returns
 * it.
 */
function findMinSlackEdge(t, g) {
  var edges = g.edges();
  return edges.reduce(function (acc, edge) {
    var edgeSlack = Number.POSITIVE_INFINITY;
    if (t.hasNode(edge.v) !== t.hasNode(edge.w)) {
      edgeSlack = slack(g, edge);
    }
    if (edgeSlack < acc[0]) {
      return [edgeSlack, edge];
    }
    return acc;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function shiftRanks(t, g, delta) {
  t.nodes().forEach(function (v) {
    return g.node(v).rank += delta;
  });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = register;
var _layout = _interopRequireDefault(__webpack_require__(11));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
// registers the extension on a cytoscape lib ref
function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('layout', 'dagre', _layout["default"]); // register with cytoscape.js
}
;

// This can never happen under the import model since scope is locked down
// However, it will survive the webpacking and still work!
if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}
module.exports = exports["default"];

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DagreLayout;
var _defaults = _interopRequireDefault(__webpack_require__(12));
var _assign = _interopRequireDefault(__webpack_require__(13));
var dagre = _interopRequireWildcard(__webpack_require__(14));
function _getRequireWildcardCache(e) {
  if ("function" != typeof WeakMap) return null;
  var r = new WeakMap(),
    t = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(e) {
    return e ? t : r;
  })(e);
}
function _interopRequireWildcard(e, r) {
  if (!r && e && e.__esModule) return e;
  if (null === e || "object" != _typeof(e) && "function" != typeof e) return {
    "default": e
  };
  var t = _getRequireWildcardCache(r);
  if (t && t.has(e)) return t.get(e);
  var n = {
      __proto__: null
    },
    a = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var u in e) {
    if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
      var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
      i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
    }
  }
  return n["default"] = e, t && t.set(e, n), n;
}
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
var isFunction = function isFunction(o) {
  return typeof o === 'function';
};
// constructor
// options : object containing layout options
function DagreLayout(options) {
  this.options = (0, _assign["default"])({}, _defaults["default"], options);
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
module.exports = exports["default"];

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = exports["default"] = {
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
module.exports = exports["default"];

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// Simple, internal Object.assign() polyfill for options objects etc.

var assign = Object.assign != null ? Object.assign.bind(Object) : function (tgt) {
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
var _default = exports["default"] = assign;
module.exports = exports["default"];

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

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
  graphlib: __webpack_require__(1),
  layout: __webpack_require__(27),
  debug: __webpack_require__(49),
  util: {
    time: __webpack_require__(0).time,
    notime: __webpack_require__(0).notime
  },
  version: __webpack_require__(50)
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// Includes only the "core" of graphlib
module.exports = {
  Graph: __webpack_require__(3),
  version: __webpack_require__(16)
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = '2.1.13';

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var Graph = __webpack_require__(3);
module.exports = {
  write: write,
  read: read
};

/**
 * Creates a JSON representation of the graph that can be serialized to a string with
 * JSON.stringify. The graph can later be restored using json.read.
 */
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
  if (g.graph() !== undefined) {
    json.value = structuredClone(g.graph());
  }
  return json;
}
function writeNodes(g) {
  return g.nodes().map(function (v) {
    var nodeValue = g.node(v);
    var parent = g.parent(v);
    var node = {
      v: v
    };
    if (nodeValue !== undefined) {
      node.value = nodeValue;
    }
    if (parent !== undefined) {
      node.parent = parent;
    }
    return node;
  });
}
function writeEdges(g) {
  return g.edges().map(function (e) {
    var edgeValue = g.edge(e);
    var edge = {
      v: e.v,
      w: e.w
    };
    if (e.name !== undefined) {
      edge.name = e.name;
    }
    if (edgeValue !== undefined) {
      edge.value = edgeValue;
    }
    return edge;
  });
}

/**
 * Takes JSON as input and returns the graph representation.
 *
 * @example
 * var g2 = graphlib.json.read(JSON.parse(str));
 * g2.nodes();
 * // ['a', 'b']
 * g2.edges()
 * // [ { v: 'a', w: 'b' } ]
 */
function read(json) {
  var g = new Graph(json.options).setGraph(json.value);
  json.nodes.forEach(function (entry) {
    g.setNode(entry.v, entry.value);
    if (entry.parent) {
      g.setParent(entry.v, entry.parent);
    }
  });
  json.edges.forEach(function (entry) {
    g.setEdge({
      v: entry.v,
      w: entry.w,
      name: entry.name
    }, entry.value);
  });
  return g;
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  components: __webpack_require__(19),
  dijkstra: __webpack_require__(4),
  dijkstraAll: __webpack_require__(20),
  findCycles: __webpack_require__(21),
  floydWarshall: __webpack_require__(22),
  isAcyclic: __webpack_require__(23),
  postorder: __webpack_require__(24),
  preorder: __webpack_require__(25),
  prim: __webpack_require__(26),
  tarjan: __webpack_require__(6),
  topsort: __webpack_require__(7)
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = components;
function components(g) {
  var visited = {};
  var cmpts = [];
  var cmpt;
  function dfs(v) {
    if (visited.hasOwnProperty(v)) return;
    visited[v] = true;
    cmpt.push(v);
    g.successors(v).forEach(dfs);
    g.predecessors(v).forEach(dfs);
  }
  g.nodes().forEach(function (v) {
    cmpt = [];
    dfs(v);
    if (cmpt.length) {
      cmpts.push(cmpt);
    }
  });
  return cmpts;
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var dijkstra = __webpack_require__(4);
module.exports = dijkstraAll;
function dijkstraAll(g, weightFunc, edgeFunc) {
  return g.nodes().reduce(function (acc, v) {
    acc[v] = dijkstra(g, v, weightFunc, edgeFunc);
    return acc;
  }, {});
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var tarjan = __webpack_require__(6);
module.exports = findCycles;
function findCycles(g) {
  return tarjan(g).filter(function (cmpt) {
    return cmpt.length > 1 || cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]);
  });
}

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = floydWarshall;
var DEFAULT_WEIGHT_FUNC = function DEFAULT_WEIGHT_FUNC() {
  return 1;
};
function floydWarshall(g, weightFn, edgeFn) {
  return runFloydWarshall(g, weightFn || DEFAULT_WEIGHT_FUNC, edgeFn || function (v) {
    return g.outEdges(v);
  });
}
function runFloydWarshall(g, weightFn, edgeFn) {
  var results = {};
  var nodes = g.nodes();
  nodes.forEach(function (v) {
    results[v] = {};
    results[v][v] = {
      distance: 0
    };
    nodes.forEach(function (w) {
      if (v !== w) {
        results[v][w] = {
          distance: Number.POSITIVE_INFINITY
        };
      }
    });
    edgeFn(v).forEach(function (edge) {
      var w = edge.v === v ? edge.w : edge.v;
      var d = weightFn(edge);
      results[v][w] = {
        distance: d,
        predecessor: v
      };
    });
  });
  nodes.forEach(function (k) {
    var rowK = results[k];
    nodes.forEach(function (i) {
      var rowI = results[i];
      nodes.forEach(function (j) {
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var topsort = __webpack_require__(7);
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var dfs = __webpack_require__(8);
module.exports = postorder;
function postorder(g, vs) {
  return dfs(g, vs, "post");
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var dfs = __webpack_require__(8);
module.exports = preorder;
function preorder(g, vs) {
  return dfs(g, vs, "pre");
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var Graph = __webpack_require__(3);
var PriorityQueue = __webpack_require__(5);
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
  g.nodes().forEach(function (v) {
    pq.add(v, Number.POSITIVE_INFINITY);
    result.setNode(v);
  });

  // Start from an arbitrary node
  pq.decrease(g.nodes()[0], 0);
  var init = false;
  while (pq.size() > 0) {
    v = pq.removeMin();
    if (parents.hasOwnProperty(v)) {
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0) { ; } } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var acyclic = __webpack_require__(28);
var normalize = __webpack_require__(31);
var rank = __webpack_require__(32);
var normalizeRanks = __webpack_require__(0).normalizeRanks;
var parentDummyChains = __webpack_require__(34);
var removeEmptyRanks = __webpack_require__(0).removeEmptyRanks;
var nestingGraph = __webpack_require__(35);
var addBorderSegments = __webpack_require__(36);
var coordinateSystem = __webpack_require__(37);
var order = __webpack_require__(38);
var position = __webpack_require__(47);
var util = __webpack_require__(0);
var Graph = __webpack_require__(1).Graph;
module.exports = layout;
function layout(g, opts) {
  var time = opts && opts.debugTiming ? util.time : util.notime;
  time("layout", function () {
    var layoutGraph = time("  buildLayoutGraph", function () {
      return buildLayoutGraph(g);
    });
    time("  runLayout", function () {
      return runLayout(layoutGraph, time);
    });
    time("  updateInputGraph", function () {
      return updateInputGraph(g, layoutGraph);
    });
  });
}
function runLayout(g, time) {
  time("    makeSpaceForEdgeLabels", function () {
    return makeSpaceForEdgeLabels(g);
  });
  time("    removeSelfEdges", function () {
    return removeSelfEdges(g);
  });
  time("    acyclic", function () {
    return acyclic.run(g);
  });
  time("    nestingGraph.run", function () {
    return nestingGraph.run(g);
  });
  time("    rank", function () {
    return rank(util.asNonCompoundGraph(g));
  });
  time("    injectEdgeLabelProxies", function () {
    return injectEdgeLabelProxies(g);
  });
  time("    removeEmptyRanks", function () {
    return removeEmptyRanks(g);
  });
  time("    nestingGraph.cleanup", function () {
    return nestingGraph.cleanup(g);
  });
  time("    normalizeRanks", function () {
    return normalizeRanks(g);
  });
  time("    assignRankMinMax", function () {
    return assignRankMinMax(g);
  });
  time("    removeEdgeLabelProxies", function () {
    return removeEdgeLabelProxies(g);
  });
  time("    normalize.run", function () {
    return normalize.run(g);
  });
  time("    parentDummyChains", function () {
    return parentDummyChains(g);
  });
  time("    addBorderSegments", function () {
    return addBorderSegments(g);
  });
  time("    order", function () {
    return order(g);
  });
  time("    insertSelfEdges", function () {
    return insertSelfEdges(g);
  });
  time("    adjustCoordinateSystem", function () {
    return coordinateSystem.adjust(g);
  });
  time("    position", function () {
    return position(g);
  });
  time("    positionSelfEdges", function () {
    return positionSelfEdges(g);
  });
  time("    removeBorderNodes", function () {
    return removeBorderNodes(g);
  });
  time("    normalize.undo", function () {
    return normalize.undo(g);
  });
  time("    fixupEdgeLabelCoords", function () {
    return fixupEdgeLabelCoords(g);
  });
  time("    undoCoordinateSystem", function () {
    return coordinateSystem.undo(g);
  });
  time("    translateGraph", function () {
    return translateGraph(g);
  });
  time("    assignNodeIntersects", function () {
    return assignNodeIntersects(g);
  });
  time("    reversePoints", function () {
    return reversePointsForReversedEdges(g);
  });
  time("    acyclic.undo", function () {
    return acyclic.undo(g);
  });
}

/*
 * Copies final layout information from the layout graph back to the input
 * graph. This process only copies whitelisted attributes from the layout graph
 * to the input graph, so it serves as a good place to determine what
 * attributes can influence layout.
 */
function updateInputGraph(inputGraph, layoutGraph) {
  inputGraph.nodes().forEach(function (v) {
    var inputLabel = inputGraph.node(v);
    var layoutLabel = layoutGraph.node(v);
    if (inputLabel) {
      inputLabel.x = layoutLabel.x;
      inputLabel.y = layoutLabel.y;
      inputLabel.rank = layoutLabel.rank;
      if (layoutGraph.children(v).length) {
        inputLabel.width = layoutLabel.width;
        inputLabel.height = layoutLabel.height;
      }
    }
  });
  inputGraph.edges().forEach(function (e) {
    var inputLabel = inputGraph.edge(e);
    var layoutLabel = layoutGraph.edge(e);
    inputLabel.points = layoutLabel.points;
    if (layoutLabel.hasOwnProperty("x")) {
      inputLabel.x = layoutLabel.x;
      inputLabel.y = layoutLabel.y;
    }
  });
  inputGraph.graph().width = layoutGraph.graph().width;
  inputGraph.graph().height = layoutGraph.graph().height;
}
var graphNumAttrs = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"];
var graphDefaults = {
  ranksep: 50,
  edgesep: 20,
  nodesep: 50,
  rankdir: "tb"
};
var graphAttrs = ["acyclicer", "ranker", "rankdir", "align"];
var nodeNumAttrs = ["width", "height"];
var nodeDefaults = {
  width: 0,
  height: 0
};
var edgeNumAttrs = ["minlen", "weight", "width", "height", "labeloffset"];
var edgeDefaults = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
};
var edgeAttrs = ["labelpos"];

/*
 * Constructs a new graph from the input graph, which can be used for layout.
 * This process copies only whitelisted attributes from the input graph to the
 * layout graph. Thus this function serves as a good place to determine what
 * attributes can influence layout.
 */
function buildLayoutGraph(inputGraph) {
  var g = new Graph({
    multigraph: true,
    compound: true
  });
  var graph = canonicalize(inputGraph.graph());
  g.setGraph(Object.assign({}, graphDefaults, selectNumberAttrs(graph, graphNumAttrs), util.pick(graph, graphAttrs)));
  inputGraph.nodes().forEach(function (v) {
    var node = canonicalize(inputGraph.node(v));
    var newNode = selectNumberAttrs(node, nodeNumAttrs);
    Object.keys(nodeDefaults).forEach(function (k) {
      if (newNode[k] === undefined) {
        newNode[k] = nodeDefaults[k];
      }
    });
    g.setNode(v, newNode);
    g.setParent(v, inputGraph.parent(v));
  });
  inputGraph.edges().forEach(function (e) {
    var edge = canonicalize(inputGraph.edge(e));
    g.setEdge(e, Object.assign({}, edgeDefaults, selectNumberAttrs(edge, edgeNumAttrs), util.pick(edge, edgeAttrs)));
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
  g.edges().forEach(function (e) {
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
  g.edges().forEach(function (e) {
    var edge = g.edge(e);
    if (edge.width && edge.height) {
      var v = g.node(e.v);
      var w = g.node(e.w);
      var label = {
        rank: (w.rank - v.rank) / 2 + v.rank,
        e: e
      };
      util.addDummyNode(g, "edge-proxy", label, "_ep");
    }
  });
}
function assignRankMinMax(g) {
  var maxRank = 0;
  g.nodes().forEach(function (v) {
    var node = g.node(v);
    if (node.borderTop) {
      node.minRank = g.node(node.borderTop).rank;
      node.maxRank = g.node(node.borderBottom).rank;
      maxRank = Math.max(maxRank, node.maxRank);
    }
  });
  g.graph().maxRank = maxRank;
}
function removeEdgeLabelProxies(g) {
  g.nodes().forEach(function (v) {
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
  g.nodes().forEach(function (v) {
    return getExtremes(g.node(v));
  });
  g.edges().forEach(function (e) {
    var edge = g.edge(e);
    if (edge.hasOwnProperty("x")) {
      getExtremes(edge);
    }
  });
  minX -= marginX;
  minY -= marginY;
  g.nodes().forEach(function (v) {
    var node = g.node(v);
    node.x -= minX;
    node.y -= minY;
  });
  g.edges().forEach(function (e) {
    var edge = g.edge(e);
    edge.points.forEach(function (p) {
      p.x -= minX;
      p.y -= minY;
    });
    if (edge.hasOwnProperty("x")) {
      edge.x -= minX;
    }
    if (edge.hasOwnProperty("y")) {
      edge.y -= minY;
    }
  });
  graphLabel.width = maxX - minX + marginX;
  graphLabel.height = maxY - minY + marginY;
}
function assignNodeIntersects(g) {
  g.edges().forEach(function (e) {
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
  g.edges().forEach(function (e) {
    var edge = g.edge(e);
    if (edge.hasOwnProperty("x")) {
      if (edge.labelpos === "l" || edge.labelpos === "r") {
        edge.width -= edge.labeloffset;
      }
      switch (edge.labelpos) {
        case "l":
          edge.x -= edge.width / 2 + edge.labeloffset;
          break;
        case "r":
          edge.x += edge.width / 2 + edge.labeloffset;
          break;
      }
    }
  });
}
function reversePointsForReversedEdges(g) {
  g.edges().forEach(function (e) {
    var edge = g.edge(e);
    if (edge.reversed) {
      edge.points.reverse();
    }
  });
}
function removeBorderNodes(g) {
  g.nodes().forEach(function (v) {
    if (g.children(v).length) {
      var node = g.node(v);
      var t = g.node(node.borderTop);
      var b = g.node(node.borderBottom);
      var l = g.node(node.borderLeft[node.borderLeft.length - 1]);
      var r = g.node(node.borderRight[node.borderRight.length - 1]);
      node.width = Math.abs(r.x - l.x);
      node.height = Math.abs(b.y - t.y);
      node.x = l.x + node.width / 2;
      node.y = t.y + node.height / 2;
    }
  });
  g.nodes().forEach(function (v) {
    if (g.node(v).dummy === "border") {
      g.removeNode(v);
    }
  });
}
function removeSelfEdges(g) {
  g.edges().forEach(function (e) {
    if (e.v === e.w) {
      var node = g.node(e.v);
      if (!node.selfEdges) {
        node.selfEdges = [];
      }
      node.selfEdges.push({
        e: e,
        label: g.edge(e)
      });
      g.removeEdge(e);
    }
  });
}
function insertSelfEdges(g) {
  var layers = util.buildLayerMatrix(g);
  layers.forEach(function (layer) {
    var orderShift = 0;
    layer.forEach(function (v, i) {
      var node = g.node(v);
      node.order = i + orderShift;
      (node.selfEdges || []).forEach(function (selfEdge) {
        util.addDummyNode(g, "selfedge", {
          width: selfEdge.label.width,
          height: selfEdge.label.height,
          rank: node.rank,
          order: i + ++orderShift,
          e: selfEdge.e,
          label: selfEdge.label
        }, "_se");
      });
      delete node.selfEdges;
    });
  });
}
function positionSelfEdges(g) {
  g.nodes().forEach(function (v) {
    var node = g.node(v);
    if (node.dummy === "selfedge") {
      var selfNode = g.node(node.e.v);
      var x = selfNode.x + selfNode.width / 2;
      var y = selfNode.y;
      var dx = node.x - x;
      var dy = selfNode.height / 2;
      g.setEdge(node.e, node.label);
      g.removeNode(v);
      node.label.points = [{
        x: x + 2 * dx / 3,
        y: y - dy
      }, {
        x: x + 5 * dx / 6,
        y: y - dy
      }, {
        x: x + dx,
        y: y
      }, {
        x: x + 5 * dx / 6,
        y: y + dy
      }, {
        x: x + 2 * dx / 3,
        y: y + dy
      }];
      node.label.x = node.x;
      node.label.y = node.y;
    }
  });
}
function selectNumberAttrs(obj, attrs) {
  return util.mapValues(util.pick(obj, attrs), Number);
}
function canonicalize(attrs) {
  var newAttrs = {};
  if (attrs) {
    Object.entries(attrs).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];
      if (typeof k === "string") {
        k = k.toLowerCase();
      }
      newAttrs[k] = v;
    });
  }
  return newAttrs;
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var greedyFAS = __webpack_require__(29);
var uniqueId = __webpack_require__(0).uniqueId;
module.exports = {
  run: run,
  undo: undo
};
function run(g) {
  var fas = g.graph().acyclicer === "greedy" ? greedyFAS(g, weightFn(g)) : dfsFAS(g);
  fas.forEach(function (e) {
    var label = g.edge(e);
    g.removeEdge(e);
    label.forwardName = e.name;
    label.reversed = true;
    g.setEdge(e.w, e.v, label, uniqueId("rev"));
  });
  function weightFn(g) {
    return function (e) {
      return g.edge(e).weight;
    };
  }
}
function dfsFAS(g) {
  var fas = [];
  var stack = {};
  var visited = {};
  function dfs(v) {
    if (visited.hasOwnProperty(v)) {
      return;
    }
    visited[v] = true;
    stack[v] = true;
    g.outEdges(v).forEach(function (e) {
      if (stack.hasOwnProperty(e.w)) {
        fas.push(e);
      } else {
        dfs(e.w);
      }
    });
    delete stack[v];
  }
  g.nodes().forEach(dfs);
  return fas;
}
function undo(g) {
  g.edges().forEach(function (e) {
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var Graph = __webpack_require__(1).Graph;
var List = __webpack_require__(30);

/*
 * A greedy heuristic for finding a feedback arc set for a graph. A feedback
 * arc set is a set of edges that can be removed to make a graph acyclic.
 * The algorithm comes from: P. Eades, X. Lin, and W. F. Smyth, "A fast and
 * effective heuristic for the feedback arc set problem." This implementation
 * adjusts that from the paper to allow for weighted edges.
 */
module.exports = greedyFAS;
var DEFAULT_WEIGHT_FN = function DEFAULT_WEIGHT_FN() {
  return 1;
};
function greedyFAS(g, weightFn) {
  if (g.nodeCount() <= 1) {
    return [];
  }
  var state = buildState(g, weightFn || DEFAULT_WEIGHT_FN);
  var results = doGreedyFAS(state.graph, state.buckets, state.zeroIdx);

  // Expand multi-edges
  return results.flatMap(function (e) {
    return g.outEdges(e.v, e.w);
  });
}
function doGreedyFAS(g, buckets, zeroIdx) {
  var results = [];
  var sources = buckets[buckets.length - 1];
  var sinks = buckets[0];
  var entry;
  while (g.nodeCount()) {
    while (entry = sinks.dequeue()) {
      removeNode(g, buckets, zeroIdx, entry);
    }
    while (entry = sources.dequeue()) {
      removeNode(g, buckets, zeroIdx, entry);
    }
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
  g.inEdges(entry.v).forEach(function (edge) {
    var weight = g.edge(edge);
    var uEntry = g.node(edge.v);
    if (collectPredecessors) {
      results.push({
        v: edge.v,
        w: edge.w
      });
    }
    uEntry.out -= weight;
    assignBucket(buckets, zeroIdx, uEntry);
  });
  g.outEdges(entry.v).forEach(function (edge) {
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
  g.nodes().forEach(function (v) {
    fasGraph.setNode(v, {
      v: v,
      "in": 0,
      out: 0
    });
  });

  // Aggregate weights on nodes, but also sum the weights across multi-edges
  // into a single edge for the fasGraph.
  g.edges().forEach(function (e) {
    var prevWeight = fasGraph.edge(e.v, e.w) || 0;
    var weight = weightFn(e);
    var edgeWeight = prevWeight + weight;
    fasGraph.setEdge(e.v, e.w, edgeWeight);
    maxOut = Math.max(maxOut, fasGraph.node(e.v).out += weight);
    maxIn = Math.max(maxIn, fasGraph.node(e.w)["in"] += weight);
  });
  var buckets = range(maxOut + maxIn + 3).map(function () {
    return new List();
  });
  var zeroIdx = maxIn + 1;
  fasGraph.nodes().forEach(function (v) {
    assignBucket(buckets, zeroIdx, fasGraph.node(v));
  });
  return {
    graph: fasGraph,
    buckets: buckets,
    zeroIdx: zeroIdx
  };
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
function range(limit) {
  var range = [];
  for (var i = 0; i < limit; i++) {
    range.push(i);
  }
  return range;
}

/***/ }),
/* 30 */
/***/ (function(module, exports) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * Simple doubly linked list implementation derived from Cormen, et al.,
 * "Introduction to Algorithms".
 */
var List = /*#__PURE__*/function () {
  function List() {
    _classCallCheck(this, List);
    var sentinel = {};
    sentinel._next = sentinel._prev = sentinel;
    this._sentinel = sentinel;
  }
  _createClass(List, [{
    key: "dequeue",
    value: function dequeue() {
      var sentinel = this._sentinel;
      var entry = sentinel._prev;
      if (entry !== sentinel) {
        unlink(entry);
        return entry;
      }
    }
  }, {
    key: "enqueue",
    value: function enqueue(entry) {
      var sentinel = this._sentinel;
      if (entry._prev && entry._next) {
        unlink(entry);
      }
      entry._next = sentinel._next;
      sentinel._next._prev = entry;
      sentinel._next = entry;
      entry._prev = sentinel;
    }
  }, {
    key: "toString",
    value: function toString() {
      var strs = [];
      var sentinel = this._sentinel;
      var curr = sentinel._prev;
      while (curr !== sentinel) {
        strs.push(JSON.stringify(curr, filterOutLinks));
        curr = curr._prev;
      }
      return "[" + strs.join(", ") + "]";
    }
  }]);
  return List;
}();
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
module.exports = List;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(0);
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
  g.edges().forEach(function (edge) {
    return normalizeEdge(g, edge);
  });
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
      width: 0,
      height: 0,
      edgeLabel: edgeLabel,
      edgeObj: e,
      rank: vRank
    };
    dummy = util.addDummyNode(g, "edge", attrs, "_d");
    if (vRank === labelRank) {
      attrs.width = edgeLabel.width;
      attrs.height = edgeLabel.height;
      attrs.dummy = "edge-label";
      attrs.labelpos = edgeLabel.labelpos;
    }
    g.setEdge(v, dummy, {
      weight: edgeLabel.weight
    }, name);
    if (i === 0) {
      g.graph().dummyChains.push(dummy);
    }
    v = dummy;
  }
  g.setEdge(v, w, {
    weight: edgeLabel.weight
  }, name);
}
function undo(g) {
  g.graph().dummyChains.forEach(function (v) {
    var node = g.node(v);
    var origLabel = node.edgeLabel;
    var w;
    g.setEdge(node.edgeObj, origLabel);
    while (node.dummy) {
      w = g.successors(v)[0];
      g.removeNode(v);
      origLabel.points.push({
        x: node.x,
        y: node.y
      });
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
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var rankUtil = __webpack_require__(2);
var longestPath = rankUtil.longestPath;
var feasibleTree = __webpack_require__(9);
var networkSimplex = __webpack_require__(33);
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
  switch (g.graph().ranker) {
    case "network-simplex":
      networkSimplexRanker(g);
      break;
    case "tight-tree":
      tightTreeRanker(g);
      break;
    case "longest-path":
      longestPathRanker(g);
      break;
    default:
      networkSimplexRanker(g);
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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var feasibleTree = __webpack_require__(9);
var slack = __webpack_require__(2).slack;
var initRank = __webpack_require__(2).longestPath;
var preorder = __webpack_require__(1).alg.preorder;
var postorder = __webpack_require__(1).alg.postorder;
var simplify = __webpack_require__(0).simplify;
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
  while (e = leaveEdge(t)) {
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
  vs.forEach(function (v) {
    return assignCutValue(t, g, v);
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
  g.nodeEdges(child).forEach(function (e) {
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
  tree.neighbors(v).forEach(function (w) {
    if (!visited.hasOwnProperty(w)) {
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
  return tree.edges().find(function (e) {
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
  var candidates = g.edges().filter(function (edge) {
    return flip === isDescendant(t, t.node(edge.v), tailLabel) && flip !== isDescendant(t, t.node(edge.w), tailLabel);
  });
  return candidates.reduce(function (acc, edge) {
    if (slack(g, edge) < slack(g, acc)) {
      return edge;
    }
    return acc;
  });
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
  var root = t.nodes().find(function (v) {
    return !g.node(v).parent;
  });
  var vs = preorder(t, root);
  vs = vs.slice(1);
  vs.forEach(function (v) {
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
/* 34 */
/***/ (function(module, exports) {

module.exports = parentDummyChains;
function parentDummyChains(g) {
  var postorderNums = postorder(g);
  g.graph().dummyChains.forEach(function (v) {
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
        while ((pathV = path[pathIdx]) !== lca && g.node(pathV).maxRank < node.rank) {
          pathIdx++;
        }
        if (pathV === lca) {
          ascending = false;
        }
      }
      if (!ascending) {
        while (pathIdx < path.length - 1 && g.node(pathV = path[pathIdx + 1]).minRank <= node.rank) {
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
  } while (parent && (postorderNums[parent].low > low || lim > postorderNums[parent].lim));
  lca = parent;

  // Traverse from w to LCA
  parent = w;
  while ((parent = g.parent(parent)) !== lca) {
    wPath.push(parent);
  }
  return {
    path: vPath.concat(wPath.reverse()),
    lca: lca
  };
}
function postorder(g) {
  var result = {};
  var lim = 0;
  function dfs(v) {
    var low = lim;
    g.children(v).forEach(dfs);
    result[v] = {
      low: low,
      lim: lim++
    };
  }
  g.children().forEach(dfs);
  return result;
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var util = __webpack_require__(0);
module.exports = {
  run: run,
  cleanup: cleanup
};

/*
 * A nesting graph creates dummy nodes for the tops and bottoms of subgraphs,
 * adds appropriate edges to ensure that all cluster nodes are placed between
 * these boundaries, and ensures that the graph is connected.
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
  var height = Math.max.apply(Math, _toConsumableArray(Object.values(depths))) - 1; // Note: depths is an Object not an array
  var nodeSep = 2 * height + 1;
  g.graph().nestingRoot = root;

  // Multiply minlen by nodeSep to align nodes on non-border ranks.
  g.edges().forEach(function (e) {
    return g.edge(e).minlen *= nodeSep;
  });

  // Calculate a weight that is sufficient to keep subgraphs vertically compact
  var weight = sumWeights(g) + 1;

  // Create border nodes and link them up
  g.children().forEach(function (child) {
    return dfs(g, root, nodeSep, weight, height, depths, child);
  });

  // Save the multiplier for node layers for later removal of empty border
  // layers.
  g.graph().nodeRankFactor = nodeSep;
}
function dfs(g, root, nodeSep, weight, height, depths, v) {
  var children = g.children(v);
  if (!children.length) {
    if (v !== root) {
      g.setEdge(root, v, {
        weight: 0,
        minlen: nodeSep
      });
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
  children.forEach(function (child) {
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
    g.setEdge(root, top, {
      weight: 0,
      minlen: height + depths[v]
    });
  }
}
function treeDepths(g) {
  var depths = {};
  function dfs(v, depth) {
    var children = g.children(v);
    if (children && children.length) {
      children.forEach(function (child) {
        return dfs(child, depth + 1);
      });
    }
    depths[v] = depth;
  }
  g.children().forEach(function (v) {
    return dfs(v, 1);
  });
  return depths;
}
function sumWeights(g) {
  return g.edges().reduce(function (acc, e) {
    return acc + g.edge(e).weight;
  }, 0);
}
function cleanup(g) {
  var graphLabel = g.graph();
  g.removeNode(graphLabel.nestingRoot);
  delete graphLabel.nestingRoot;
  g.edges().forEach(function (e) {
    var edge = g.edge(e);
    if (edge.nestingEdge) {
      g.removeEdge(e);
    }
  });
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(0);
module.exports = addBorderSegments;
function addBorderSegments(g) {
  function dfs(v) {
    var children = g.children(v);
    var node = g.node(v);
    if (children.length) {
      children.forEach(dfs);
    }
    if (node.hasOwnProperty("minRank")) {
      node.borderLeft = [];
      node.borderRight = [];
      for (var rank = node.minRank, maxRank = node.maxRank + 1; rank < maxRank; ++rank) {
        addBorderNode(g, "borderLeft", "_bl", v, node, rank);
        addBorderNode(g, "borderRight", "_br", v, node, rank);
      }
    }
  }
  g.children().forEach(dfs);
}
function addBorderNode(g, prop, prefix, sg, sgNode, rank) {
  var label = {
    width: 0,
    height: 0,
    rank: rank,
    borderType: prop
  };
  var prev = sgNode[prop][rank - 1];
  var curr = util.addDummyNode(g, "border", label, prefix);
  sgNode[prop][rank] = curr;
  g.setParent(curr, sg);
  if (prev) {
    g.setEdge(prev, curr, {
      weight: 1
    });
  }
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
  g.nodes().forEach(function (v) {
    return swapWidthHeightOne(g.node(v));
  });
  g.edges().forEach(function (e) {
    return swapWidthHeightOne(g.edge(e));
  });
}
function swapWidthHeightOne(attrs) {
  var w = attrs.width;
  attrs.width = attrs.height;
  attrs.height = w;
}
function reverseY(g) {
  g.nodes().forEach(function (v) {
    return reverseYOne(g.node(v));
  });
  g.edges().forEach(function (e) {
    var edge = g.edge(e);
    edge.points.forEach(reverseYOne);
    if (edge.hasOwnProperty("y")) {
      reverseYOne(edge);
    }
  });
}
function reverseYOne(attrs) {
  attrs.y = -attrs.y;
}
function swapXY(g) {
  g.nodes().forEach(function (v) {
    return swapXYOne(g.node(v));
  });
  g.edges().forEach(function (e) {
    var edge = g.edge(e);
    edge.points.forEach(swapXYOne);
    if (edge.hasOwnProperty("x")) {
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
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var initOrder = __webpack_require__(39);
var crossCount = __webpack_require__(40);
var sortSubgraph = __webpack_require__(41);
var buildLayerGraph = __webpack_require__(45);
var addSubgraphConstraints = __webpack_require__(46);
var Graph = __webpack_require__(1).Graph;
var util = __webpack_require__(0);
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
    downLayerGraphs = buildLayerGraphs(g, util.range(1, maxRank + 1), "inEdges"),
    upLayerGraphs = buildLayerGraphs(g, util.range(maxRank - 1, -1, -1), "outEdges");
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
      best = Object.assign({}, layering);
      bestCC = cc;
    }
  }
  assignOrder(g, best);
}
function buildLayerGraphs(g, ranks, relationship) {
  return ranks.map(function (rank) {
    return buildLayerGraph(g, rank, relationship);
  });
}
function sweepLayerGraphs(layerGraphs, biasRight) {
  var cg = new Graph();
  layerGraphs.forEach(function (lg) {
    var root = lg.graph().root;
    var sorted = sortSubgraph(lg, root, cg, biasRight);
    sorted.vs.forEach(function (v, i) {
      return lg.node(v).order = i;
    });
    addSubgraphConstraints(lg, cg, sorted.vs);
  });
}
function assignOrder(g, layering) {
  Object.values(layering).forEach(function (layer) {
    return layer.forEach(function (v, i) {
      return g.node(v).order = i;
    });
  });
}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var util = __webpack_require__(0);
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
  var simpleNodes = g.nodes().filter(function (v) {
    return !g.children(v).length;
  });
  var maxRank = Math.max.apply(Math, _toConsumableArray(simpleNodes.map(function (v) {
    return g.node(v).rank;
  })));
  var layers = util.range(maxRank + 1).map(function () {
    return [];
  });
  function dfs(v) {
    if (visited[v]) return;
    visited[v] = true;
    var node = g.node(v);
    layers[node.rank].push(v);
    g.successors(v).forEach(dfs);
  }
  var orderedVs = simpleNodes.sort(function (a, b) {
    return g.node(a).rank - g.node(b).rank;
  });
  orderedVs.forEach(dfs);
  return layers;
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var zipObject = __webpack_require__(0).zipObject;
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
    cc += twoLayerCrossCount(g, layering[i - 1], layering[i]);
  }
  return cc;
}
function twoLayerCrossCount(g, northLayer, southLayer) {
  // Sort all of the edges between the north and south layers by their position
  // in the north layer and then the south. Map these edges to the position of
  // their head in the south layer.
  var southPos = zipObject(southLayer, southLayer.map(function (v, i) {
    return i;
  }));
  var southEntries = northLayer.flatMap(function (v) {
    return g.outEdges(v).map(function (e) {
      return {
        pos: southPos[e.w],
        weight: g.edge(e).weight
      };
    }).sort(function (a, b) {
      return a.pos - b.pos;
    });
  });

  // Build the accumulator tree
  var firstIndex = 1;
  while (firstIndex < southLayer.length) {
    firstIndex <<= 1;
  }
  var treeSize = 2 * firstIndex - 1;
  firstIndex -= 1;
  var tree = new Array(treeSize).fill(0);

  // Calculate the weighted crossings
  var cc = 0;
  southEntries.forEach(function (entry) {
    var index = entry.pos + firstIndex;
    tree[index] += entry.weight;
    var weightSum = 0;
    while (index > 0) {
      if (index % 2) {
        weightSum += tree[index + 1];
      }
      index = index - 1 >> 1;
      tree[index] += entry.weight;
    }
    cc += entry.weight * weightSum;
  });
  return cc;
}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var barycenter = __webpack_require__(42);
var resolveConflicts = __webpack_require__(43);
var sort = __webpack_require__(44);
module.exports = sortSubgraph;
function sortSubgraph(g, v, cg, biasRight) {
  var movable = g.children(v);
  var node = g.node(v);
  var bl = node ? node.borderLeft : undefined;
  var br = node ? node.borderRight : undefined;
  var subgraphs = {};
  if (bl) {
    movable = movable.filter(function (w) {
      return w !== bl && w !== br;
    });
  }
  var barycenters = barycenter(g, movable);
  barycenters.forEach(function (entry) {
    if (g.children(entry.v).length) {
      var subgraphResult = sortSubgraph(g, entry.v, cg, biasRight);
      subgraphs[entry.v] = subgraphResult;
      if (subgraphResult.hasOwnProperty("barycenter")) {
        mergeBarycenters(entry, subgraphResult);
      }
    }
  });
  var entries = resolveConflicts(barycenters, cg);
  expandSubgraphs(entries, subgraphs);
  var result = sort(entries, biasRight);
  if (bl) {
    result.vs = [bl, result.vs, br].flat(true);
    if (g.predecessors(bl).length) {
      var blPred = g.node(g.predecessors(bl)[0]),
        brPred = g.node(g.predecessors(br)[0]);
      if (!result.hasOwnProperty("barycenter")) {
        result.barycenter = 0;
        result.weight = 0;
      }
      result.barycenter = (result.barycenter * result.weight + blPred.order + brPred.order) / (result.weight + 2);
      result.weight += 2;
    }
  }
  return result;
}
function expandSubgraphs(entries, subgraphs) {
  entries.forEach(function (entry) {
    entry.vs = entry.vs.flatMap(function (v) {
      if (subgraphs[v]) {
        return subgraphs[v].vs;
      }
      return v;
    });
  });
}
function mergeBarycenters(target, other) {
  if (target.barycenter !== undefined) {
    target.barycenter = (target.barycenter * target.weight + other.barycenter * other.weight) / (target.weight + other.weight);
    target.weight += other.weight;
  } else {
    target.barycenter = other.barycenter;
    target.weight = other.weight;
  }
}

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = barycenter;
function barycenter(g) {
  var movable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return movable.map(function (v) {
    var inV = g.inEdges(v);
    if (!inV.length) {
      return {
        v: v
      };
    } else {
      var result = inV.reduce(function (acc, e) {
        var edge = g.edge(e),
          nodeU = g.node(e.v);
        return {
          sum: acc.sum + edge.weight * nodeU.order,
          weight: acc.weight + edge.weight
        };
      }, {
        sum: 0,
        weight: 0
      });
      return {
        v: v,
        barycenter: result.sum / result.weight,
        weight: result.weight
      };
    }
  });
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(0);
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
  entries.forEach(function (entry, i) {
    var tmp = mappedEntries[entry.v] = {
      indegree: 0,
      "in": [],
      out: [],
      vs: [entry.v],
      i: i
    };
    if (entry.barycenter !== undefined) {
      tmp.barycenter = entry.barycenter;
      tmp.weight = entry.weight;
    }
  });
  cg.edges().forEach(function (e) {
    var entryV = mappedEntries[e.v];
    var entryW = mappedEntries[e.w];
    if (entryV !== undefined && entryW !== undefined) {
      entryW.indegree++;
      entryV.out.push(mappedEntries[e.w]);
    }
  });
  var sourceSet = Object.values(mappedEntries).filter(function (entry) {
    return !entry.indegree;
  });
  return doResolveConflicts(sourceSet);
}
function doResolveConflicts(sourceSet) {
  var entries = [];
  function handleIn(vEntry) {
    return function (uEntry) {
      if (uEntry.merged) {
        return;
      }
      if (uEntry.barycenter === undefined || vEntry.barycenter === undefined || uEntry.barycenter >= vEntry.barycenter) {
        mergeEntries(vEntry, uEntry);
      }
    };
  }
  function handleOut(vEntry) {
    return function (wEntry) {
      wEntry["in"].push(vEntry);
      if (--wEntry.indegree === 0) {
        sourceSet.push(wEntry);
      }
    };
  }
  while (sourceSet.length) {
    var entry = sourceSet.pop();
    entries.push(entry);
    entry["in"].reverse().forEach(handleIn(entry));
    entry.out.forEach(handleOut(entry));
  }
  return entries.filter(function (entry) {
    return !entry.merged;
  }).map(function (entry) {
    return util.pick(entry, ["vs", "i", "barycenter", "weight"]);
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
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(0);
module.exports = sort;
function sort(entries, biasRight) {
  var parts = util.partition(entries, function (entry) {
    return entry.hasOwnProperty("barycenter");
  });
  var sortable = parts.lhs,
    unsortable = parts.rhs.sort(function (a, b) {
      return b.i - a.i;
    }),
    vs = [],
    sum = 0,
    weight = 0,
    vsIndex = 0;
  sortable.sort(compareWithBias(!!biasRight));
  vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
  sortable.forEach(function (entry) {
    vsIndex += entry.vs.length;
    vs.push(entry.vs);
    sum += entry.barycenter * entry.weight;
    weight += entry.weight;
    vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
  });
  var result = {
    vs: vs.flat(true)
  };
  if (weight) {
    result.barycenter = sum / weight;
    result.weight = weight;
  }
  return result;
}
function consumeUnsortable(vs, unsortable, index) {
  var last;
  while (unsortable.length && (last = unsortable[unsortable.length - 1]).i <= index) {
    unsortable.pop();
    vs.push(last.vs);
    index++;
  }
  return index;
}
function compareWithBias(bias) {
  return function (entryV, entryW) {
    if (entryV.barycenter < entryW.barycenter) {
      return -1;
    } else if (entryV.barycenter > entryW.barycenter) {
      return 1;
    }
    return !bias ? entryV.i - entryW.i : entryW.i - entryV.i;
  };
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var Graph = __webpack_require__(1).Graph;
var util = __webpack_require__(0);
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
    result = new Graph({
      compound: true
    }).setGraph({
      root: root
    }).setDefaultNodeLabel(function (v) {
      return g.node(v);
    });
  g.nodes().forEach(function (v) {
    var node = g.node(v),
      parent = g.parent(v);
    if (node.rank === rank || node.minRank <= rank && rank <= node.maxRank) {
      result.setNode(v);
      result.setParent(v, parent || root);

      // This assumes we have only short edges!
      g[relationship](v).forEach(function (e) {
        var u = e.v === v ? e.w : e.v,
          edge = result.edge(u, v),
          weight = edge !== undefined ? edge.weight : 0;
        result.setEdge(u, v, {
          weight: g.edge(e).weight + weight
        });
      });
      if (node.hasOwnProperty("minRank")) {
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
  while (g.hasNode(v = util.uniqueId("_root"))) {
    ;
  }
  return v;
}

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = addSubgraphConstraints;
function addSubgraphConstraints(g, cg, vs) {
  var prev = {},
    rootPrev;
  vs.forEach(function (v) {
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
      children.forEach(function(child) {
        var childMin = dfs(child);
        if (g.children(child).length) {
          subgraphs.push({ v: child, order: childMin });
        }
        min = Math.min(min, childMin);
      });
      _.sortBy(subgraphs, "order").reduce(function(prev, curr) {
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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0) { ; } } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var util = __webpack_require__(0);
var positionX = __webpack_require__(48).positionX;
module.exports = position;
function position(g) {
  g = util.asNonCompoundGraph(g);
  positionY(g);
  Object.entries(positionX(g)).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      v = _ref2[0],
      x = _ref2[1];
    return g.node(v).x = x;
  });
}
function positionY(g) {
  var layering = util.buildLayerMatrix(g);
  var rankSep = g.graph().ranksep;
  var prevY = 0;
  layering.forEach(function (layer) {
    var maxHeight = layer.reduce(function (acc, v) {
      var height = g.node(v).height;
      if (acc > height) {
        return acc;
      } else {
        return height;
      }
    }, 0);
    layer.forEach(function (v) {
      return g.node(v).y = prevY + maxHeight / 2;
    });
    prevY += maxHeight + rankSep;
  });
}

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0) { ; } } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var Graph = __webpack_require__(1).Graph;
var util = __webpack_require__(0);

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
      lastNode = layer[layer.length - 1];
    layer.forEach(function (v, i) {
      var w = findOtherInnerSegmentNode(g, v),
        k1 = w ? g.node(w).order : prevLayerLength;
      if (w || v === lastNode) {
        layer.slice(scanPos, i + 1).forEach(function (scanNode) {
          g.predecessors(scanNode).forEach(function (u) {
            var uLabel = g.node(u),
              uPos = uLabel.order;
            if ((uPos < k0 || k1 < uPos) && !(uLabel.dummy && g.node(scanNode).dummy)) {
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
  layering.reduce(visitLayer);
  return conflicts;
}
function findType2Conflicts(g, layering) {
  var conflicts = {};
  function scan(south, southPos, southEnd, prevNorthBorder, nextNorthBorder) {
    var v;
    util.range(southPos, southEnd).forEach(function (i) {
      v = south[i];
      if (g.node(v).dummy) {
        g.predecessors(v).forEach(function (u) {
          var uNode = g.node(u);
          if (uNode.dummy && (uNode.order < prevNorthBorder || uNode.order > nextNorthBorder)) {
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
    south.forEach(function (v, southLookahead) {
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
  layering.reduce(visitLayer);
  return conflicts;
}
function findOtherInnerSegmentNode(g, v) {
  if (g.node(v).dummy) {
    return g.predecessors(v).find(function (u) {
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
  return !!conflicts[v] && conflicts[v].hasOwnProperty(w);
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
  layering.forEach(function (layer) {
    layer.forEach(function (v, order) {
      root[v] = v;
      align[v] = v;
      pos[v] = order;
    });
  });
  layering.forEach(function (layer) {
    var prevIdx = -1;
    layer.forEach(function (v) {
      var ws = neighborFn(v);
      if (ws.length) {
        ws = ws.sort(function (a, b) {
          return pos[a] - pos[b];
        });
        var mp = (ws.length - 1) / 2;
        for (var i = Math.floor(mp), il = Math.ceil(mp); i <= il; ++i) {
          var w = ws[i];
          if (align[v] === v && prevIdx < pos[w] && !hasConflict(conflicts, v, w)) {
            align[w] = v;
            align[v] = root[v] = root[w];
            prevIdx = pos[w];
          }
        }
      }
    });
  });
  return {
    root: root,
    align: align
  };
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
    xs[elem] = blockG.inEdges(elem).reduce(function (acc, e) {
      return Math.max(acc, xs[e.v] + blockG.edge(e));
    }, 0);
  }

  // Second pass, assign greatest coordinates
  function pass2(elem) {
    var min = blockG.outEdges(elem).reduce(function (acc, e) {
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
  Object.keys(align).forEach(function (v) {
    return xs[v] = xs[root[v]];
  });
  return xs;
}
function buildBlockGraph(g, layering, root, reverseSep) {
  var blockGraph = new Graph(),
    graphLabel = g.graph(),
    sepFn = sep(graphLabel.nodesep, graphLabel.edgesep, reverseSep);
  layering.forEach(function (layer) {
    var u;
    layer.forEach(function (v) {
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
  return Object.values(xss).reduce(function (currentMinAndXs, xs) {
    var max = Number.NEGATIVE_INFINITY;
    var min = Number.POSITIVE_INFINITY;
    Object.entries(xs).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        v = _ref2[0],
        x = _ref2[1];
      var halfWidth = width(g, v) / 2;
      max = Math.max(x + halfWidth, max);
      min = Math.min(x - halfWidth, min);
    });
    var newMin = max - min;
    if (newMin < currentMinAndXs[0]) {
      currentMinAndXs = [newMin, xs];
    }
    return currentMinAndXs;
  }, [Number.POSITIVE_INFINITY, null])[1];
}

/*
 * Align the coordinates of each of the layout alignments such that
 * left-biased alignments have their minimum coordinate at the same point as
 * the minimum coordinate of the smallest width alignment and right-biased
 * alignments have their maximum coordinate at the same point as the maximum
 * coordinate of the smallest width alignment.
 */
function alignCoordinates(xss, alignTo) {
  var alignToVals = Object.values(alignTo),
    alignToMin = Math.min.apply(Math, alignToVals),
    alignToMax = Math.max.apply(Math, alignToVals);
  ["u", "d"].forEach(function (vert) {
    ["l", "r"].forEach(function (horiz) {
      var alignment = vert + horiz,
        xs = xss[alignment];
      if (xs === alignTo) return;
      var xsVals = Object.values(xs);
      var delta = alignToMin - Math.min.apply(Math, xsVals);
      if (horiz !== "l") {
        delta = alignToMax - Math.max.apply(Math, xsVals);
      }
      if (delta) {
        xss[alignment] = util.mapValues(xs, function (x) {
          return x + delta;
        });
      }
    });
  });
}
function balance(xss, align) {
  return util.mapValues(xss.ul, function (num, v) {
    if (align) {
      return xss[align.toLowerCase()][v];
    } else {
      var xs = Object.values(xss).map(function (xs) {
        return xs[v];
      }).sort(function (a, b) {
        return a - b;
      });
      return (xs[1] + xs[2]) / 2;
    }
  });
}
function positionX(g) {
  var layering = util.buildLayerMatrix(g);
  var conflicts = Object.assign(findType1Conflicts(g, layering), findType2Conflicts(g, layering));
  var xss = {};
  var adjustedLayering;
  ["u", "d"].forEach(function (vert) {
    adjustedLayering = vert === "u" ? layering : Object.values(layering).reverse();
    ["l", "r"].forEach(function (horiz) {
      if (horiz === "r") {
        adjustedLayering = adjustedLayering.map(function (inner) {
          return Object.values(inner).reverse();
        });
      }
      var neighborFn = (vert === "u" ? g.predecessors : g.successors).bind(g);
      var align = verticalAlignment(g, adjustedLayering, conflicts, neighborFn);
      var xs = horizontalCompaction(g, adjustedLayering, align.root, align.align, horiz === "r");
      if (horiz === "r") {
        xs = util.mapValues(xs, function (x) {
          return -x;
        });
      }
      xss[vert + horiz] = xs;
    });
  });
  var smallestWidth = findSmallestWidthAlignment(g, xss);
  alignCoordinates(xss, smallestWidth);
  return balance(xss, g.graph().align);
}
function sep(nodeSep, edgeSep, reverseSep) {
  return function (g, v, w) {
    var vLabel = g.node(v);
    var wLabel = g.node(w);
    var sum = 0;
    var delta;
    sum += vLabel.width / 2;
    if (vLabel.hasOwnProperty("labelpos")) {
      switch (vLabel.labelpos.toLowerCase()) {
        case "l":
          delta = -vLabel.width / 2;
          break;
        case "r":
          delta = vLabel.width / 2;
          break;
      }
    }
    if (delta) {
      sum += reverseSep ? delta : -delta;
    }
    delta = 0;
    sum += (vLabel.dummy ? edgeSep : nodeSep) / 2;
    sum += (wLabel.dummy ? edgeSep : nodeSep) / 2;
    sum += wLabel.width / 2;
    if (wLabel.hasOwnProperty("labelpos")) {
      switch (wLabel.labelpos.toLowerCase()) {
        case "l":
          delta = wLabel.width / 2;
          break;
        case "r":
          delta = -wLabel.width / 2;
          break;
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
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(0);
var Graph = __webpack_require__(1).Graph;
module.exports = {
  debugOrdering: debugOrdering
};

/* istanbul ignore next */
function debugOrdering(g) {
  var layerMatrix = util.buildLayerMatrix(g);
  var h = new Graph({
    compound: true,
    multigraph: true
  }).setGraph({});
  g.nodes().forEach(function (v) {
    h.setNode(v, {
      label: v
    });
    h.setParent(v, "layer" + g.node(v).rank);
  });
  g.edges().forEach(function (e) {
    return h.setEdge(e.v, e.w, {}, e.name);
  });
  layerMatrix.forEach(function (layer, i) {
    var layerV = "layer" + i;
    h.setNode(layerV, {
      rank: "same"
    });
    layer.reduce(function (u, v) {
      h.setEdge(u, v, {
        style: "invis"
      });
      return v;
    });
  });
  return h;
}

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = "1.0.4";

/***/ })
/******/ ]);
});