/*!
 * cytoscape-dagre 3.0.0
 * https://github.com/cytoscape/cytoscape.js-dagre
 * License: MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.cytoscapeDagre = factory());
})(this, (function () { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _createForOfIteratorHelper(r, e) {
    var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (!t) {
      if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
        t && (r = t);
        var n = 0,
          F = function () {};
        return {
          s: F,
          n: function () {
            return n >= r.length ? {
              done: true
            } : {
              done: false,
              value: r[n++]
            };
          },
          e: function (r) {
            throw r;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o,
      a = true,
      u = false;
    return {
      s: function () {
        t = t.call(r);
      },
      n: function () {
        var r = t.next();
        return a = r.done, r;
      },
      e: function (r) {
        u = true, o = r;
      },
      f: function () {
        try {
          a || null == t.return || t.return();
        } finally {
          if (u) throw o;
        }
      }
    };
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  /** 
   * Dagre algorithmic options. The default value of dagre.js is used
   * when the option is left undefined here.
   */
  var defaults = {
    /**
     * the separation between adjacent nodes in the same rank
     */
    nodeSep: undefined,
    /**
     * The separation between adjacent edges in the same rank
     */
    edgeSep: undefined,
    /**
     * The separation between each rank in the layout
     */
    rankSep: undefined,
    /**
     * Direction in which ranks flow: `'TB'` for top to bottom flow, `'LR'` for left to right,
     */
    rankDir: undefined,
    /**
     * alignment for rank nodes. Can be `'UL'`, `'UR'`, `'DL'`, or `'DR'`, 
     * where `U` = up, `D` = down, `L` = left, and `R` = right
     */
    align: undefined,
    /**
     * If set to `'greedy'`, uses a greedy heuristic for finding a feedback arc set for a graph.
     * A feedback arc set is a set of edges that can be removed to make a graph acyclic.
     */
    acyclicer: undefined,
    /**
     * Type of algorithm to assigns a rank to each node in the input graph.
     * Possible values: 
     *    * `'network-simplex'`, 
     *    * `'tight-tree'` or
     *    * `'longest-path'`
     */
    ranker: undefined,
    /**
     * Number of ranks to keep between the source and target of the edge
     */
    minLen: function minLen(_edge) {
      return 1;
    },
    /**
     * Higher weight edges are generally made shorter and straighter than lower weight edges} _edge 
     */
    edgeWeight: function edgeWeight(_edge) {
      return 1;
    },
    /* general layout options */
    /**
     * whether to fit to viewport
     */
    fit: true,
    /**
     * Fit padding
     */
    padding: 30,
    /**
     * Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
     */
    spacingFactor: undefined,
    /**
     * Whether labels should be included in determining the space used by a node
     */
    nodeDimensionsIncludeLabels: false,
    /**
     * Enables bezier curves using dagre's edge control points
     */
    useDagreEdgeControlPoints: false,
    /**
     * Automatically adds edge class '.useDagreEdgeControlPoints' to all edges and configure it with this.dagreEdgeStyle.
     * If set to `false` and `useDagreEdgeControlPoints` is `true` then apply `this.dagreEdgeStyle` yourself.
     */
    automaticDagreEdgeStyle: false,
    /**
     * Defines the style for rendering dagre edge control points stored by the layout algorithm
     * if `useDagreEdgeControlPoints` is `true` and `automaticDagreEdgeStyle` is `true`
     */
    dagreEdgeStyle: {
      'curve-style': 'unbundled-bezier',
      'control-point-weights': function controlPointWeights(ele) {
        return ele.scratch('controlPointWeights');
      },
      'control-point-distances': function controlPointDistances(ele) {
        return ele.scratch('controlPointDistances');
      },
      'edge-distances': 'intersection',
      'edge-ends-overlap': false
    },
    /**
     * Whether to transition the node positions
     */
    animate: false,
    /**
     * Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
     */
    animateFilter: function animateFilter(_node, _i) {
      return true;
    },
    /**
     * Duration of animation in ms if enabled
     */
    animationDuration: 500,
    /**
     * Easing of animation, if enabled
     */
    animationEasing: undefined,
    /**
     * Constrain outermost layout bounds; `{ x1, y1, x2, y2 }` or `{ x1, y1, w, h }`
     */
    boundingBox: undefined,
    /**
     * A function that applies a transform to the final node position
     */
    transform: function transform(node, pos) {
      return pos;
    },
    /**
     * On layoutready execute this function
     */
    ready: function ready() {},
    /**
     * A sorting function to order the nodes and edges; e.g. `function(a, b){ return a.data('weight') - b.data('weight')`. }
     * Because cytoscape dagre creates a directed graph, and directed graphs use the node order as a tie breaker when
     * defining the topology of a graph, this sort function can help ensure the correct order of the nodes/edges.
     * This feature is most useful when adding and removing the same nodes and edges multiple times in a graph,
     * but it can also help avoid sprurious edge crossings between ranks.
     */
    sort: undefined,
    /**
     * on layoutstop, execute this function
     */
    stop: function stop() {}
  };

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

  var ge=Object.defineProperty;var hn=(e,n,t)=>n in e?ge(e,n,{enumerable:true,configurable:true,writable:true,value:t}):e[n]=t;var fn=(e,n)=>{for(var t in n)ge(e,t,{get:n[t],enumerable:true});};var pe=(e,n,t)=>hn(e,n+"",t);var z={};fn(z,{Graph:()=>p,alg:()=>R,json:()=>ye,version:()=>pn});var bn=Object.defineProperty,Le=(e,n)=>{for(var t in n)bn(e,t,{get:n[t],enumerable:true});},p=class{constructor(e){this._isDirected=true,this._isMultigraph=false,this._isCompound=false,this._nodes={},this._in={},this._preds={},this._out={},this._sucs={},this._edgeObjs={},this._edgeLabels={},this._nodeCount=0,this._edgeCount=0,this._defaultNodeLabelFn=()=>{},this._defaultEdgeLabelFn=()=>{},e&&(this._isDirected="directed"in e?e.directed:true,this._isMultigraph="multigraph"in e?e.multigraph:false,this._isCompound="compound"in e?e.compound:false),this._isCompound&&(this._parent={},this._children={},this._children["\0"]={});}isDirected(){return this._isDirected}isMultigraph(){return this._isMultigraph}isCompound(){return this._isCompound}setGraph(e){return this._label=e,this}graph(){return this._label}setDefaultNodeLabel(e){return typeof e!="function"?this._defaultNodeLabelFn=()=>e:this._defaultNodeLabelFn=e,this}nodeCount(){return this._nodeCount}nodes(){return Object.keys(this._nodes)}sources(){return this.nodes().filter(e=>Object.keys(this._in[e]).length===0)}sinks(){return this.nodes().filter(e=>Object.keys(this._out[e]).length===0)}setNodes(e,n){return e.forEach(t=>{n!==void 0?this.setNode(t,n):this.setNode(t);}),this}setNode(e,n){return e in this._nodes?(arguments.length>1&&(this._nodes[e]=n),this):(this._nodes[e]=arguments.length>1?n:this._defaultNodeLabelFn(e),this._isCompound&&(this._parent[e]="\0",this._children[e]={},this._children["\0"][e]=true),this._in[e]={},this._preds[e]={},this._out[e]={},this._sucs[e]={},++this._nodeCount,this)}node(e){return this._nodes[e]}hasNode(e){return e in this._nodes}removeNode(e){if(e in this._nodes){let n=t=>this.removeEdge(this._edgeObjs[t]);delete this._nodes[e],this._isCompound&&(this._removeFromParentsChildList(e),delete this._parent[e],this.children(e).forEach(t=>{this.setParent(t);}),delete this._children[e]),Object.keys(this._in[e]).forEach(n),delete this._in[e],delete this._preds[e],Object.keys(this._out[e]).forEach(n),delete this._out[e],delete this._sucs[e],--this._nodeCount;}return this}setParent(e,n){if(!this._isCompound)throw new Error("Cannot set parent in a non-compound graph");if(n===void 0)n="\0";else {n+="";for(let t=n;t!==void 0;t=this.parent(t))if(t===e)throw new Error("Setting "+n+" as parent of "+e+" would create a cycle");this.setNode(n);}return this.setNode(e),this._removeFromParentsChildList(e),this._parent[e]=n,this._children[n][e]=true,this}parent(e){if(this._isCompound){let n=this._parent[e];if(n!=="\0")return n}}children(e="\0"){if(this._isCompound){let n=this._children[e];if(n)return Object.keys(n)}else {if(e==="\0")return this.nodes();if(this.hasNode(e))return []}return []}predecessors(e){let n=this._preds[e];if(n)return Object.keys(n)}successors(e){let n=this._sucs[e];if(n)return Object.keys(n)}neighbors(e){let n=this.predecessors(e);if(n){let t=new Set(n);for(let r of this.successors(e))t.add(r);return Array.from(t.values())}}isLeaf(e){let n;return this.isDirected()?n=this.successors(e):n=this.neighbors(e),n.length===0}filterNodes(e){let n=new this.constructor({directed:this._isDirected,multigraph:this._isMultigraph,compound:this._isCompound});n.setGraph(this.graph()),Object.entries(this._nodes).forEach(([o,i])=>{e(o)&&n.setNode(o,i);}),Object.values(this._edgeObjs).forEach(o=>{n.hasNode(o.v)&&n.hasNode(o.w)&&n.setEdge(o,this.edge(o));});let t={},r=o=>{let i=this.parent(o);return !i||n.hasNode(i)?(t[o]=i!=null?i:void 0,i!=null?i:void 0):i in t?t[i]:r(i)};return this._isCompound&&n.nodes().forEach(o=>n.setParent(o,r(o))),n}setDefaultEdgeLabel(e){return typeof e!="function"?this._defaultEdgeLabelFn=()=>e:this._defaultEdgeLabelFn=e,this}edgeCount(){return this._edgeCount}edges(){return Object.values(this._edgeObjs)}setPath(e,n){return e.reduce((t,r)=>(n!==void 0?this.setEdge(t,r,n):this.setEdge(t,r),r)),this}setEdge(e,n,t,r){let o,i,s,a,d=false;typeof e=="object"&&e!==null&&"v"in e?(o=e.v,i=e.w,s=e.name,arguments.length===2&&(a=n,d=true)):(o=e,i=n,s=r,arguments.length>2&&(a=t,d=true)),o=""+o,i=""+i,s!==void 0&&(s=""+s);let l=C(this._isDirected,o,i,s);if(l in this._edgeLabels)return d&&(this._edgeLabels[l]=a),this;if(s!==void 0&&!this._isMultigraph)throw new Error("Cannot set a named edge when isMultigraph = false");this.setNode(o),this.setNode(i),this._edgeLabels[l]=d?a:this._defaultEdgeLabelFn(o,i,s);let u=gn(this._isDirected,o,i,s);return o=u.v,i=u.w,Object.freeze(u),this._edgeObjs[l]=u,me(this._preds[i],o),me(this._sucs[o],i),this._in[i][l]=u,this._out[o][l]=u,this._edgeCount++,this}edge(e,n,t){let r=arguments.length===1?Y(this._isDirected,e):C(this._isDirected,e,n,t);return this._edgeLabels[r]}edgeAsObj(e,n,t){let r=arguments.length===1?this.edge(e):this.edge(e,n,t);return typeof r!="object"?{label:r}:r}hasEdge(e,n,t){return (arguments.length===1?Y(this._isDirected,e):C(this._isDirected,e,n,t))in this._edgeLabels}removeEdge(e,n,t){let r=arguments.length===1?Y(this._isDirected,e):C(this._isDirected,e,n,t),o=this._edgeObjs[r];if(o){let i=o.v,s=o.w;delete this._edgeLabels[r],delete this._edgeObjs[r],Ee(this._preds[s],i),Ee(this._sucs[i],s),delete this._in[s][r],delete this._out[i][r],this._edgeCount--;}return this}inEdges(e,n){return this.isDirected()?this.filterEdges(this._in[e],e,n):this.nodeEdges(e,n)}outEdges(e,n){return this.isDirected()?this.filterEdges(this._out[e],e,n):this.nodeEdges(e,n)}nodeEdges(e,n){if(e in this._nodes)return this.filterEdges({...this._in[e],...this._out[e]},e,n)}_removeFromParentsChildList(e){delete this._children[this._parent[e]][e];}filterEdges(e,n,t){if(!e)return;let r=Object.values(e);return t?r.filter(o=>o.v===n&&o.w===t||o.v===t&&o.w===n):r}};function me(e,n){e[n]?e[n]++:e[n]=1;}function Ee(e,n){e[n]!==void 0&&!--e[n]&&delete e[n];}function C(e,n,t,r){let o=""+n,i=""+t;if(!e&&o>i){let s=o;o=i,i=s;}return o+""+i+""+(r===void 0?"\0":r)}function gn(e,n,t,r){let o=""+n,i=""+t;if(!e&&o>i){let a=o;o=i,i=a;}let s={v:o,w:i};return r&&(s.name=r),s}function Y(e,n){return C(e,n.v,n.w,n.name)}var pn="4.0.1",ye={};Le(ye,{read:()=>yn,write:()=>mn});function mn(e){let n={options:{directed:e.isDirected(),multigraph:e.isMultigraph(),compound:e.isCompound()},nodes:En(e),edges:Ln(e)},t=e.graph();return t!==void 0&&(n.value=structuredClone(t)),n}function En(e){return e.nodes().map(n=>{let t=e.node(n),r=e.parent(n),o={v:n};return t!==void 0&&(o.value=t),r!==void 0&&(o.parent=r),o})}function Ln(e){return e.edges().map(n=>{let t=e.edge(n),r={v:n.v,w:n.w};return n.name!==void 0&&(r.name=n.name),t!==void 0&&(r.value=t),r})}function yn(e){let n=new p(e.options);return e.value!==void 0&&n.setGraph(e.value),e.nodes.forEach(t=>{n.setNode(t.v,t.value),t.parent&&n.setParent(t.v,t.parent);}),e.edges.forEach(t=>{n.setEdge({v:t.v,w:t.w,name:t.name},t.value);}),n}var R={};Le(R,{CycleException:()=>D,bellmanFord:()=>we,components:()=>Gn,dijkstra:()=>F,dijkstraAll:()=>_n,findCycles:()=>xn,floydWarshall:()=>On,isAcyclic:()=>Cn,postorder:()=>Pn,preorder:()=>Mn,prim:()=>jn,shortestPaths:()=>Sn,tarjan:()=>Ge,topsort:()=>ke});var wn=()=>1;function we(e,n,t,r){return Nn(e,String(n),t||wn,r||function(o){return e.outEdges(o)})}function Nn(e,n,t,r){let o={},i,s=0,a=e.nodes(),d=function(c){let h=t(c);o[c.v].distance+h<o[c.w].distance&&(o[c.w]={distance:o[c.v].distance+h,predecessor:c.v},i=true);},l=function(){a.forEach(function(c){r(c).forEach(function(h){let f=h.v===c?h.v:h.w,g=f===h.v?h.w:h.v;d({v:f,w:g});});});};a.forEach(function(c){let h=c===n?0:Number.POSITIVE_INFINITY;o[c]={distance:h,predecessor:""};});let u=a.length;for(let c=1;c<u&&(i=false,s++,l(),!!i);c++);if(s===u-1&&(i=false,l(),i))throw new Error("The graph contains a negative weight cycle");return o}function Gn(e){let n={},t=[],r;function o(i){i in n||(n[i]=true,r.push(i),e.successors(i).forEach(o),e.predecessors(i).forEach(o));}return e.nodes().forEach(function(i){r=[],o(i),r.length&&t.push(r);}),t}var Ne=class{constructor(){this._arr=[],this._keyIndices={};}size(){return this._arr.length}keys(){return this._arr.map(e=>e.key)}has(e){return e in this._keyIndices}priority(e){let n=this._keyIndices[e];if(n!==void 0)return this._arr[n].priority}min(){if(this.size()===0)throw new Error("Queue underflow");return this._arr[0].key}add(e,n){let t=this._keyIndices,r=String(e);if(!(r in t)){let o=this._arr,i=o.length;return t[r]=i,o.push({key:r,priority:n}),this._decrease(i),true}return  false}removeMin(){this._swap(0,this._arr.length-1);let e=this._arr.pop();return delete this._keyIndices[e.key],this._heapify(0),e.key}decrease(e,n){let t=this._keyIndices[e];if(t===void 0)throw new Error(`Key not found: ${e}`);let r=this._arr[t].priority;if(n>r)throw new Error(`New priority is greater than current priority. Key: ${e} Old: ${r} New: ${n}`);this._arr[t].priority=n,this._decrease(t);}_heapify(e){let n=this._arr,t=2*e,r=t+1,o=e;t<n.length&&(o=n[t].priority<n[o].priority?t:o,r<n.length&&(o=n[r].priority<n[o].priority?r:o),o!==e&&(this._swap(e,o),this._heapify(o)));}_decrease(e){let n=this._arr,t=n[e].priority,r;for(;e!==0&&(r=e>>1,!(n[r].priority<t));)this._swap(e,r),e=r;}_swap(e,n){let t=this._arr,r=this._keyIndices,o=t[e],i=t[n];t[e]=i,t[n]=o,r[i.key]=e,r[o.key]=n;}},kn=()=>1;function F(e,n,t,r){let o=function(i){return e.outEdges(i)};return vn(e,String(n),t||kn,r||o)}function vn(e,n,t,r){let o={},i=new Ne,s,a,d=function(l){let u=l.v!==s?l.v:l.w,c=o[u],h=t(l),f=a.distance+h;if(h<0)throw new Error("dijkstra does not allow negative edge weights. Bad edge: "+l+" Weight: "+h);f<c.distance&&(c.distance=f,c.predecessor=s,i.decrease(u,f));};for(e.nodes().forEach(function(l){let u=l===n?0:Number.POSITIVE_INFINITY;o[l]={distance:u,predecessor:""},i.add(l,u);});i.size()>0&&(s=i.removeMin(),a=o[s],a.distance!==Number.POSITIVE_INFINITY);)r(s).forEach(d);return o}function _n(e,n,t){return e.nodes().reduce(function(r,o){return r[o]=F(e,o,n,t),r},{})}function Ge(e){let n=0,t=[],r={},o=[];function i(s){let a=r[s]={onStack:true,lowlink:n,index:n++};if(t.push(s),e.successors(s).forEach(function(d){d in r?r[d].onStack&&(a.lowlink=Math.min(a.lowlink,r[d].index)):(i(d),a.lowlink=Math.min(a.lowlink,r[d].lowlink));}),a.lowlink===a.index){let d=[],l;do l=t.pop(),r[l].onStack=false,d.push(l);while(s!==l);o.push(d);}}return e.nodes().forEach(function(s){s in r||i(s);}),o}function xn(e){return Ge(e).filter(function(n){return n.length>1||n.length===1&&e.hasEdge(n[0],n[0])})}var Tn=()=>1;function On(e,n,t){return In(e,n||Tn,t||function(r){return e.outEdges(r)})}function In(e,n,t){let r={},o=e.nodes();return o.forEach(function(i){r[i]={},r[i][i]={distance:0,predecessor:""},o.forEach(function(s){i!==s&&(r[i][s]={distance:Number.POSITIVE_INFINITY,predecessor:""});}),t(i).forEach(function(s){let a=s.v===i?s.w:s.v,d=n(s);r[i][a]={distance:d,predecessor:i};});}),o.forEach(function(i){let s=r[i];o.forEach(function(a){let d=r[a];o.forEach(function(l){let u=d[i],c=s[l],h=d[l],f=u.distance+c.distance;f<h.distance&&(h.distance=f,h.predecessor=c.predecessor);});});}),r}var D=class extends Error{constructor(...e){super(...e);}};function ke(e){let n={},t={},r=[];function o(i){if(i in t)throw new D;i in n||(t[i]=true,n[i]=true,e.predecessors(i).forEach(o),delete t[i],r.push(i));}if(e.sinks().forEach(o),Object.keys(n).length!==e.nodeCount())throw new D;return r}function Cn(e){try{ke(e);}catch(n){if(n instanceof D)return  false;throw n}return  true}function Rn(e,n,t,r,o){Array.isArray(n)||(n=[n]);let i=(a=>{var d;return (d=e.isDirected()?e.successors(a):e.neighbors(a))!=null?d:[]}),s={};return n.forEach(function(a){if(!e.hasNode(a))throw new Error("Graph does not have node: "+a);o=ve(e,a,t==="post",s,i,r,o);}),o}function ve(e,n,t,r,o,i,s){return n in r||(r[n]=true,t||(s=i(s,n)),o(n).forEach(function(a){s=ve(e,a,t,r,o,i,s);}),t&&(s=i(s,n))),s}function _e(e,n,t){return Rn(e,n,t,function(r,o){return r.push(o),r},[])}function Pn(e,n){return _e(e,n,"post")}function Mn(e,n){return _e(e,n,"pre")}function jn(e,n){let t=new p,r={},o=new Ne,i;function s(d){let l=d.v===i?d.w:d.v,u=o.priority(l);if(u!==void 0){let c=n(d);c<u&&(r[l]=i,o.decrease(l,c));}}if(e.nodeCount()===0)return t;e.nodes().forEach(function(d){o.add(d,Number.POSITIVE_INFINITY),t.setNode(d);}),o.decrease(e.nodes()[0],0);let a=false;for(;o.size()>0;){if(i=o.removeMin(),i in r)t.setEdge(i,r[i]);else {if(a)throw new Error("Input graph is not connected: "+e);a=true;}e.nodeEdges(i).forEach(s);}return t}function Sn(e,n,t,r){return Fn(e,n,t,r!=null?r:(o=>{let i=e.outEdges(o);return i!=null?i:[]}))}function Fn(e,n,t,r){if(t===void 0)return F(e,n,t,r);let o=false,i=e.nodes();for(let s=0;s<i.length;s++){let a=r(i[s]);for(let d=0;d<a.length;d++){let l=a[d],u=l.v===i[s]?l.v:l.w,c=u===l.v?l.w:l.v;t({v:u,w:c})<0&&(o=true);}if(o)return we(e,n,t,r)}return F(e,n,t,r)}function w(e,n,t,r){let o=r;for(;e.hasNode(o);)o=j(r);return t.dummy=n,e.setNode(o,t),o}function xe(e){let n=new p().setGraph(e.graph());return e.nodes().forEach(t=>n.setNode(t,e.node(t))),e.edges().forEach(t=>{let r=n.edge(t.v,t.w)||{weight:0,minlen:1},o=e.edge(t);n.setEdge(t.v,t.w,{weight:r.weight+o.weight,minlen:Math.max(r.minlen,o.minlen)});}),n}function A(e){let n=new p({multigraph:e.isMultigraph()}).setGraph(e.graph());return e.nodes().forEach(t=>{e.children(t).length||n.setNode(t,e.node(t));}),e.edges().forEach(t=>{n.setEdge(t,e.edge(t));}),n}function H(e,n){let t=e.x,r=e.y,o=n.x-t,i=n.y-r,s=e.width/2,a=e.height/2;if(!o&&!i)throw new Error("Not possible to find intersection inside of the rectangle");let d,l;return Math.abs(i)*s>Math.abs(o)*a?(i<0&&(a=-a),d=a*o/i,l=a):(o<0&&(s=-s),d=s,l=s*i/o),{x:t+d,y:r+l}}function N(e){let n=k(X(e)+1).map(()=>[]);return e.nodes().forEach(t=>{let r=e.node(t),o=r.rank;o!==void 0&&(n[o]||(n[o]=[]),n[o][r.order]=t);}),n}function Te(e){let n=e.nodes().map(r=>{let o=e.node(r).rank;return o===void 0?Number.MAX_VALUE:o}),t=L(Math.min,n);e.nodes().forEach(r=>{let o=e.node(r);Object.hasOwn(o,"rank")&&(o.rank-=t);});}function Oe(e){let n=e.nodes().map(s=>e.node(s).rank).filter(s=>s!==void 0),t=L(Math.min,n),r=[];e.nodes().forEach(s=>{let a=e.node(s).rank-t;r[a]||(r[a]=[]),r[a].push(s);});let o=0,i=e.graph().nodeRankFactor;Array.from(r).forEach((s,a)=>{s===void 0&&a%i!==0?--o:s!==void 0&&o&&s.forEach(d=>e.node(d).rank+=o);});}function q(e,n,t,r){let o={width:0,height:0};return arguments.length>=4&&(o.rank=t,o.order=r),w(e,"border",o,n)}function Dn(e,n=Ie){let t=[];for(let r=0;r<e.length;r+=n){let o=e.slice(r,r+n);t.push(o);}return t}var Ie=65535;function L(e,n){if(n.length>Ie){let t=Dn(n);return e(...t.map(r=>e(...r)))}else return e(...n)}function X(e){let t=e.nodes().map(r=>{let o=e.node(r).rank;return o===void 0?Number.MIN_VALUE:o});return L(Math.max,t)}function Ce(e,n){let t={lhs:[],rhs:[]};return e.forEach(r=>{n(r)?t.lhs.push(r):t.rhs.push(r);}),t}function P(e,n){let t=Date.now();try{return n()}finally{console.log(e+" time: "+(Date.now()-t)+"ms");}}function M(e,n){return n()}var An=0;function j(e){let n=++An;return e+(""+n)}function k(e,n,t=1){n==null&&(n=e,e=0);let r=i=>i<n;t<0&&(r=i=>n<i);let o=[];for(let i=e;r(i);i+=t)o.push(i);return o}function T(e,n){let t={};for(let r of n)e[r]!==void 0&&(t[r]=e[r]);return t}function O(e,n){let t;return typeof n=="string"?t=r=>r[n]:t=n,Object.entries(e).reduce((r,[o,i])=>(r[o]=t(i,o),r),{})}function Re(e,n){return e.reduce((t,r,o)=>(t[r]=n[o],t),{})}var _="\0";var U="3.0.0";var K=class{constructor(){pe(this,"_sentinel");let n={};n._next=n._prev=n,this._sentinel=n;}dequeue(){let n=this._sentinel,t=n._prev;if(t!==n)return Pe(t),t}enqueue(n){let t=this._sentinel;n._prev&&n._next&&Pe(n),n._next=t._next,t._next._prev=n,t._next=n,n._prev=t;}toString(){let n=[],t=this._sentinel,r=t._prev;for(;r!==t;)n.push(JSON.stringify(r,Vn)),r=r._prev;return "["+n.join(", ")+"]"}};function Pe(e){e._prev._next=e._next,e._next._prev=e._prev,delete e._next,delete e._prev;}function Vn(e,n){if(e!=="_next"&&e!=="_prev")return n}var Me=K;var Wn=()=>1;function Q(e,n){if(e.nodeCount()<=1)return [];let t=Yn(e,n||Wn);return Bn(t.graph,t.buckets,t.zeroIdx).flatMap(o=>e.outEdges(o.v,o.w)||[])}function Bn(e,n,t){var a;let r=[],o=n[n.length-1],i=n[0],s;for(;e.nodeCount();){for(;s=i.dequeue();)$(e,n,t,s);for(;s=o.dequeue();)$(e,n,t,s);if(e.nodeCount()){for(let d=n.length-2;d>0;--d)if(s=(a=n[d])==null?void 0:a.dequeue(),s){r=r.concat($(e,n,t,s,true)||[]);break}}}return r}function $(e,n,t,r,o){let i=[],s=o?i:void 0;return (e.inEdges(r.v)||[]).forEach(a=>{let d=e.edge(a),l=e.node(a.v);o&&i.push({v:a.v,w:a.w}),l.out-=d,J(n,t,l);}),(e.outEdges(r.v)||[]).forEach(a=>{let d=e.edge(a),l=a.w,u=e.node(l);u.in-=d,J(n,t,u);}),e.removeNode(r.v),s}function Yn(e,n){let t=new p,r=0,o=0;e.nodes().forEach(a=>{t.setNode(a,{v:a,in:0,out:0});}),e.edges().forEach(a=>{let d=t.edge(a.v,a.w)||0,l=n(a),u=d+l;t.setEdge(a.v,a.w,u);let c=t.node(a.v),h=t.node(a.w);o=Math.max(o,c.out+=l),r=Math.max(r,h.in+=l);});let i=zn(o+r+3).map(()=>new Me),s=r+1;return t.nodes().forEach(a=>{J(i,s,t.node(a));}),{graph:t,buckets:i,zeroIdx:s}}function J(e,n,t){var r,o,i;t.out?t.in?(i=e[t.out-t.in+n])==null||i.enqueue(t):(o=e[e.length-1])==null||o.enqueue(t):(r=e[0])==null||r.enqueue(t);}function zn(e){let n=[];for(let t=0;t<e;t++)n.push(t);return n}function je(e){(e.graph().acyclicer==="greedy"?Q(e,t(e)):Hn(e)).forEach(r=>{let o=e.edge(r);e.removeEdge(r),o.forwardName=r.name,o.reversed=true,e.setEdge(r.w,r.v,o,j("rev"));});function t(r){return o=>r.edge(o).weight}}function Hn(e){let n=[],t={},r={};function o(i){Object.hasOwn(r,i)||(r[i]=true,t[i]=true,e.outEdges(i).forEach(s=>{Object.hasOwn(t,s.w)?n.push(s):o(s.w);}),delete t[i]);}return e.nodes().forEach(o),n}function Se(e){e.edges().forEach(n=>{let t=e.edge(n);if(t.reversed){e.removeEdge(n);let r=t.forwardName;delete t.reversed,delete t.forwardName,e.setEdge(n.w,n.v,t,r);}});}function Fe(e){e.graph().dummyChains=[],e.edges().forEach(n=>Xn(e,n));}function Xn(e,n){let t=n.v,r=e.node(t).rank,o=n.w,i=e.node(o).rank,s=n.name,a=e.edge(n),d=a.labelRank;if(i===r+1)return;e.removeEdge(n);let l,u,c;for(c=0,++r;r<i;++c,++r)a.points=[],u={width:0,height:0,edgeLabel:a,edgeObj:n,rank:r},l=w(e,"edge",u,"_d"),r===d&&(u.width=a.width,u.height=a.height,u.dummy="edge-label",u.labelpos=a.labelpos),e.setEdge(t,l,{weight:a.weight},s),c===0&&e.graph().dummyChains.push(l),t=l;e.setEdge(t,o,{weight:a.weight},s);}function De(e){e.graph().dummyChains.forEach(n=>{let t=e.node(n),r=t.edgeLabel,o;for(e.setEdge(t.edgeObj,r);t.dummy;)o=e.successors(n)[0],e.removeNode(n),r.points.push({x:t.x,y:t.y}),t.dummy==="edge-label"&&(r.x=t.x,r.y=t.y,r.width=t.width,r.height=t.height),n=o,t=e.node(n);});}function S(e){let n={};function t(r){let o=e.node(r);if(Object.hasOwn(n,r))return o.rank;n[r]=true;let i=e.outEdges(r),s=i?i.map(d=>d==null?Number.POSITIVE_INFINITY:t(d.w)-e.edge(d).minlen):[],a=L(Math.min,s);return a===Number.POSITIVE_INFINITY&&(a=0),o.rank=a}e.sources().forEach(t);}function v(e,n){return e.node(n.w).rank-e.node(n.v).rank-e.edge(n).minlen}var V=Kn;function Kn(e){let n=new p({directed:false}),t=e.nodes();if(t.length===0)throw new Error("Graph must have at least one node");let r=t[0],o=e.nodeCount();n.setNode(r,{});let i,s;for(;$n(n,e)<o&&(i=Jn(n,e),!!i);)s=n.hasNode(i.v)?v(e,i):-v(e,i),Qn(n,e,s);return n}function $n(e,n){function t(r){let o=n.nodeEdges(r);o&&o.forEach(i=>{let s=i.v,a=r===s?i.w:s;!e.hasNode(a)&&!v(n,i)&&(e.setNode(a,{}),e.setEdge(r,a,{}),t(a));});}return e.nodes().forEach(t),e.nodeCount()}function Jn(e,n){return n.edges().reduce((r,o)=>{let i=Number.POSITIVE_INFINITY;return e.hasNode(o.v)!==e.hasNode(o.w)&&(i=v(n,o)),i<r[0]?[i,o]:r},[Number.POSITIVE_INFINITY,null])[1]}function Qn(e,n,t){e.nodes().forEach(r=>n.node(r).rank+=t);}var{preorder:Zn,postorder:et}=R,Ve=x;x.initLowLimValues=ee;x.initCutValues=Z;x.calcCutValue=We;x.leaveEdge=Ye;x.enterEdge=ze;x.exchangeEdges=He;function x(e){e=xe(e),S(e);let n=V(e);ee(n),Z(n,e);let t,r;for(;t=Ye(n);)r=ze(n,e,t),He(n,e,t,r);}function Z(e,n){let t=et(e,e.nodes());t=t.slice(0,t.length-1),t.forEach(r=>nt(e,n,r));}function nt(e,n,t){let o=e.node(t).parent,i=e.edge(t,o);i.cutvalue=We(e,n,t);}function We(e,n,t){let o=e.node(t).parent,i=true,s=n.edge(t,o),a=0;s||(i=false,s=n.edge(o,t)),a=s.weight;let d=n.nodeEdges(t);return d&&d.forEach(l=>{let u=l.v===t,c=u?l.w:l.v;if(c!==o){let h=u===i,f=n.edge(l).weight;if(a+=h?f:-f,rt(e,t,c)){let b=e.edge(t,c).cutvalue;a+=h?-b:b;}}}),a}function ee(e,n){arguments.length<2&&(n=e.nodes()[0]),Be(e,{},1,n);}function Be(e,n,t,r,o){let i=t,s=e.node(r);n[r]=true;let a=e.neighbors(r);return a&&a.forEach(d=>{Object.hasOwn(n,d)||(t=Be(e,n,t,d,r));}),s.low=i,s.lim=t++,o?s.parent=o:delete s.parent,t}function Ye(e){return e.edges().find(n=>e.edge(n).cutvalue<0)}function ze(e,n,t){let r=t.v,o=t.w;n.hasEdge(r,o)||(r=t.w,o=t.v);let i=e.node(r),s=e.node(o),a=i,d=false;return i.lim>s.lim&&(a=s,d=true),n.edges().filter(u=>d===Ae(e,e.node(u.v),a)&&d!==Ae(e,e.node(u.w),a)).reduce((u,c)=>v(n,c)<v(n,u)?c:u)}function He(e,n,t,r){let o=t.v,i=t.w;e.removeEdge(o,i),e.setEdge(r.v,r.w,{}),ee(e),Z(e,n),tt(e,n);}function tt(e,n){let t=e.nodes().find(o=>!e.node(o).parent);if(!t)return;let r=Zn(e,[t]);r=r.slice(1),r.forEach(o=>{let s=e.node(o).parent,a=n.edge(o,s),d=false;a||(a=n.edge(s,o),d=true),n.node(o).rank=n.node(s).rank+(d?a.minlen:-a.minlen);});}function rt(e,n,t){return e.hasEdge(n,t)}function Ae(e,n,t){return t.low<=n.lim&&n.lim<=t.lim}var Xe=ot;function ot(e){let n=e.graph().ranker;if(typeof n=="function")return n(e);switch(n){case "network-simplex":qe(e);break;case "tight-tree":st(e);break;case "longest-path":it(e);break;case "none":break;default:qe(e);}}var it=S;function st(e){S(e),V(e);}function qe(e){Ve(e);}var Ue=at;function at(e){let n=lt(e);e.graph().dummyChains.forEach(t=>{let r=e.node(t),o=r.edgeObj,i=dt(e,n,o.v,o.w),s=i.path,a=i.lca,d=0,l=s[d],u=true;for(;t!==o.w;){if(r=e.node(t),u){for(;(l=s[d])!==a&&e.node(l).maxRank<r.rank;)d++;l===a&&(u=false);}if(!u){for(;d<s.length-1&&e.node(s[d+1]).minRank<=r.rank;)d++;l=s[d];}l!==void 0&&e.setParent(t,l),t=e.successors(t)[0];}});}function dt(e,n,t,r){let o=[],i=[],s=Math.min(n[t].low,n[r].low),a=Math.max(n[t].lim,n[r].lim),d;d=t;do d=e.parent(d),o.push(d);while(d&&(n[d].low>s||a>n[d].lim));let l=d,u=r;for(;(u=e.parent(u))!==l;)i.push(u);return {path:o.concat(i.reverse()),lca:l}}function lt(e){let n={},t=0;function r(o){let i=t;e.children(o).forEach(r),n[o]={low:i,lim:t++};}return e.children(_).forEach(r),n}function Ke(e){let n=w(e,"root",{},"_root"),t=ut(e),r=Object.values(t),o=L(Math.max,r)-1,i=2*o+1;e.graph().nestingRoot=n,e.edges().forEach(a=>e.edge(a).minlen*=i);let s=ct(e)+1;e.children(_).forEach(a=>$e(e,n,i,s,o,t,a)),e.graph().nodeRankFactor=i;}function $e(e,n,t,r,o,i,s){var c;let a=e.children(s);if(!a.length){s!==n&&e.setEdge(n,s,{weight:0,minlen:t});return}let d=q(e,"_bt"),l=q(e,"_bb"),u=e.node(s);e.setParent(d,s),u.borderTop=d,e.setParent(l,s),u.borderBottom=l,a.forEach(h=>{var y;$e(e,n,t,r,o,i,h);let f=e.node(h),g=f.borderTop?f.borderTop:h,b=f.borderBottom?f.borderBottom:h,m=f.borderTop?r:2*r,E=g!==b?1:o-((y=i[s])!=null?y:0)+1;e.setEdge(d,g,{weight:m,minlen:E,nestingEdge:true}),e.setEdge(b,l,{weight:m,minlen:E,nestingEdge:true});}),e.parent(s)||e.setEdge(n,d,{weight:0,minlen:o+((c=i[s])!=null?c:0)});}function ut(e){let n={};function t(r,o){let i=e.children(r);i&&i.length&&i.forEach(s=>t(s,o+1)),n[r]=o;}return e.children(_).forEach(r=>t(r,1)),n}function ct(e){return e.edges().reduce((n,t)=>n+e.edge(t).weight,0)}function Je(e){let n=e.graph();e.removeNode(n.nestingRoot),delete n.nestingRoot,e.edges().forEach(t=>{e.edge(t).nestingEdge&&e.removeEdge(t);});}var Ze=ft;function ft(e){function n(t){let r=e.children(t),o=e.node(t);if(r.length&&r.forEach(n),Object.hasOwn(o,"minRank")){o.borderLeft=[],o.borderRight=[];for(let i=o.minRank,s=o.maxRank+1;i<s;++i)Qe(e,"borderLeft","_bl",t,o,i),Qe(e,"borderRight","_br",t,o,i);}}e.children(_).forEach(n);}function Qe(e,n,t,r,o,i){let s={width:0,height:0,rank:i,borderType:n},a=o[n][i-1],d=w(e,"border",s,t);o[n][i]=d,e.setParent(d,r),a&&e.setEdge(a,d,{weight:1});}function nn(e){var t;let n=(t=e.graph().rankdir)==null?void 0:t.toLowerCase();(n==="lr"||n==="rl")&&rn(e);}function tn(e){var t;let n=(t=e.graph().rankdir)==null?void 0:t.toLowerCase();(n==="bt"||n==="rl")&&bt(e),(n==="lr"||n==="rl")&&(gt(e),rn(e));}function rn(e){e.nodes().forEach(n=>en(e.node(n))),e.edges().forEach(n=>en(e.edge(n)));}function en(e){let n=e.width;e.width=e.height,e.height=n;}function bt(e){e.nodes().forEach(n=>ne(e.node(n))),e.edges().forEach(n=>{var r;let t=e.edge(n);(r=t.points)==null||r.forEach(ne),Object.hasOwn(t,"y")&&ne(t);});}function ne(e){e.y=-e.y;}function gt(e){e.nodes().forEach(n=>te(e.node(n))),e.edges().forEach(n=>{var r;let t=e.edge(n);(r=t.points)==null||r.forEach(te),Object.hasOwn(t,"x")&&te(t);});}function te(e){let n=e.x;e.x=e.y,e.y=n;}function re(e){let n={},t=e.nodes().filter(d=>!e.children(d).length),r=t.map(d=>e.node(d).rank),o=L(Math.max,r),i=k(o+1).map(()=>[]);function s(d){if(n[d])return;n[d]=true;let l=e.node(d);i[l.rank].push(d);let u=e.successors(d);u&&u.forEach(s);}return t.sort((d,l)=>e.node(d).rank-e.node(l).rank).forEach(s),i}function oe(e,n){let t=0;for(let r=1;r<n.length;++r)t+=mt(e,n[r-1],n[r]);return t}function mt(e,n,t){let r=Re(t,t.map((l,u)=>u)),o=n.flatMap(l=>{let u=e.outEdges(l);return u?u.map(c=>({pos:r[c.w],weight:e.edge(c).weight})).sort((c,h)=>c.pos-h.pos):[]}),i=1;for(;i<t.length;)i<<=1;let s=2*i-1;i-=1;let a=new Array(s).fill(0),d=0;return o.forEach(l=>{let u=l.pos+i;a[u]+=l.weight;let c=0;for(;u>0;)u%2&&(c+=a[u+1]),u=u-1>>1,a[u]+=l.weight;d+=l.weight*c;}),d}function ie(e,n=[]){return n.map(t=>{let r=e.inEdges(t);if(!r||!r.length)return {v:t};{let o=r.reduce((i,s)=>{let a=e.edge(s),d=e.node(s.v);return {sum:i.sum+a.weight*d.order,weight:i.weight+a.weight}},{sum:0,weight:0});return {v:t,barycenter:o.sum/o.weight,weight:o.weight}}})}function se(e,n){let t={};e.forEach((o,i)=>{let s={indegree:0,in:[],out:[],vs:[o.v],i};o.barycenter!==void 0&&(s.barycenter=o.barycenter,s.weight=o.weight),t[o.v]=s;}),n.edges().forEach(o=>{let i=t[o.v],s=t[o.w];i!==void 0&&s!==void 0&&(s.indegree++,i.out.push(s));});let r=Object.values(t).filter(o=>!o.indegree);return Et(r)}function Et(e){let n=[];function t(o){return i=>{i.merged||(i.barycenter===void 0||o.barycenter===void 0||i.barycenter>=o.barycenter)&&Lt(o,i);}}function r(o){return i=>{i.in.push(o),--i.indegree===0&&e.push(i);}}for(;e.length;){let o=e.pop();n.push(o),o.in.reverse().forEach(t(o)),o.out.forEach(r(o));}return n.filter(o=>!o.merged).map(o=>T(o,["vs","i","barycenter","weight"]))}function Lt(e,n){let t=0,r=0;e.weight&&(t+=e.barycenter*e.weight,r+=e.weight),n.weight&&(t+=n.barycenter*n.weight,r+=n.weight),e.vs=n.vs.concat(e.vs),e.barycenter=t/r,e.weight=r,e.i=Math.min(n.i,e.i),n.merged=true;}function ae(e,n){let t=Ce(e,u=>Object.hasOwn(u,"barycenter")),r=t.lhs,o=t.rhs.sort((u,c)=>c.i-u.i),i=[],s=0,a=0,d=0;r.sort(yt(!!n)),d=on(i,o,d),r.forEach(u=>{d+=u.vs.length,i.push(u.vs),s+=u.barycenter*u.weight,a+=u.weight,d=on(i,o,d);});let l={vs:i.flat(1)};return a&&(l.barycenter=s/a,l.weight=a),l}function on(e,n,t){let r;for(;n.length&&(r=n[n.length-1]).i<=t;)n.pop(),e.push(r.vs),t++;return t}function yt(e){return (n,t)=>n.barycenter<t.barycenter?-1:n.barycenter>t.barycenter?1:e?t.i-n.i:n.i-t.i}function W(e,n,t,r){let o=e.children(n),i=e.node(n),s=i?i.borderLeft:void 0,a=i?i.borderRight:void 0,d={};s&&(o=o.filter(h=>h!==s&&h!==a));let l=ie(e,o);l.forEach(h=>{if(e.children(h.v).length){let f=W(e,h.v,t,r);d[h.v]=f,Object.hasOwn(f,"barycenter")&&Nt(h,f);}});let u=se(l,t);wt(u,d);let c=ae(u,r);if(s&&a){c.vs=[s,c.vs,a].flat(1);let h=e.predecessors(s);if(h&&h.length){let f=e.node(h[0]),g=e.predecessors(a),b=e.node(g[0]);Object.hasOwn(c,"barycenter")||(c.barycenter=0,c.weight=0),c.barycenter=(c.barycenter*c.weight+f.order+b.order)/(c.weight+2),c.weight+=2;}}return c}function wt(e,n){e.forEach(t=>{t.vs=t.vs.flatMap(r=>n[r]?n[r].vs:r);});}function Nt(e,n){e.barycenter!==void 0?(e.barycenter=(e.barycenter*e.weight+n.barycenter*n.weight)/(e.weight+n.weight),e.weight+=n.weight):(e.barycenter=n.barycenter,e.weight=n.weight);}function de(e,n,t,r){r||(r=e.nodes());let o=Gt(e),i=new p({compound:true}).setGraph({root:o}).setDefaultNodeLabel(s=>e.node(s));return r.forEach(s=>{let a=e.node(s),d=e.parent(s);if(a.rank===n||a.minRank<=n&&n<=a.maxRank){i.setNode(s),i.setParent(s,d||o);let l=e[t](s);l&&l.forEach(u=>{let c=u.v===s?u.w:u.v,h=i.edge(c,s),f=h!==void 0?h.weight:0;i.setEdge(c,s,{weight:e.edge(u).weight+f});}),Object.hasOwn(a,"minRank")&&i.setNode(s,{borderLeft:a.borderLeft[n],borderRight:a.borderRight[n]});}}),i}function Gt(e){let n;for(;e.hasNode(n=j("_root")););return n}function le(e,n,t){let r={},o;t.forEach(i=>{let s=e.parent(i),a,d;for(;s;){if(a=e.parent(s),a?(d=r[a],r[a]=s):(d=o,o=s),d&&d!==s){n.setEdge(d,s);return}s=a;}});}function B(e,n={}){if(typeof n.customOrder=="function"){n.customOrder(e,B);return}let t=X(e),r=sn(e,k(1,t+1),"inEdges"),o=sn(e,k(t-1,-1,-1),"outEdges"),i=re(e);if(an(e,i),n.disableOptimalOrderHeuristic)return;let s=Number.POSITIVE_INFINITY,a,d=n.constraints||[];for(let l=0,u=0;u<4;++l,++u){kt(l%2?r:o,l%4>=2,d),i=N(e);let c=oe(e,i);c<s?(u=0,a=Object.assign({},i),s=c):c===s&&(a=structuredClone(i));}an(e,a);}function sn(e,n,t){let r=new Map,o=(i,s)=>{r.has(i)||r.set(i,[]),r.get(i).push(s);};for(let i of e.nodes()){let s=e.node(i);if(typeof s.rank=="number"&&o(s.rank,i),typeof s.minRank=="number"&&typeof s.maxRank=="number")for(let a=s.minRank;a<=s.maxRank;a++)a!==s.rank&&o(a,i);}return n.map(function(i){return de(e,i,t,r.get(i)||[])})}function kt(e,n,t){let r=new p;e.forEach(function(o){t.forEach(a=>r.setEdge(a.left,a.right));let i=o.graph().root,s=W(o,i,r,n);s.vs.forEach((a,d)=>o.node(a).order=d),le(o,r,s.vs);});}function an(e,n){Object.values(n).forEach(t=>t.forEach((r,o)=>e.node(r).order=o));}function vt(e,n){let t={};function r(o,i){let s=0,a=0,d=o.length,l=i[i.length-1];return i.forEach((u,c)=>{let h=xt(e,u),f=h?e.node(h).order:d;(h||u===l)&&(i.slice(a,c+1).forEach(g=>{let b=e.predecessors(g);b&&b.forEach(m=>{let E=e.node(m),y=E.order;(y<s||f<y)&&!(E.dummy&&e.node(g).dummy)&&dn(t,m,g);});}),a=c+1,s=f);}),i}return n.length&&n.reduce(r),t}function _t(e,n){let t={};function r(i,s,a,d,l){k(s,a).forEach(u=>{let c=i[u];if(c!==void 0&&e.node(c).dummy){let h=e.predecessors(c);h&&h.forEach(f=>{if(f===void 0)return;let g=e.node(f);g.dummy&&(g.order<d||g.order>l)&&dn(t,f,c);});}});}function o(i,s){let a=-1,d=-1,l=0;return s.forEach((u,c)=>{if(e.node(u).dummy==="border"){let h=e.predecessors(u);if(h&&h.length){let f=h[0];if(f===void 0)return;d=e.node(f).order,r(s,l,c,a,d),l=c,a=d;}}r(s,l,s.length,d,i.length);}),s}return n.length&&n.reduce(o),t}function xt(e,n){if(e.node(n).dummy){let t=e.predecessors(n);if(t)return t.find(r=>e.node(r).dummy)}}function dn(e,n,t){if(n>t){let o=n;n=t,t=o;}let r=e[n];r||(e[n]=r={}),r[t]=true;}function Tt(e,n,t){if(n>t){let o=n;n=t,t=o;}let r=e[n];return r!==void 0&&Object.hasOwn(r,t)}function Ot(e,n,t,r){let o={},i={},s={};return n.forEach(a=>{a.forEach((d,l)=>{o[d]=d,i[d]=d,s[d]=l;});}),n.forEach(a=>{let d=-1;a.forEach(l=>{let u=r(l);if(u&&u.length){let c=u.sort((f,g)=>{let b=s[f],m=s[g];return (b!==void 0?b:0)-(m!==void 0?m:0)}),h=(c.length-1)/2;for(let f=Math.floor(h),g=Math.ceil(h);f<=g;++f){let b=c[f];if(b===void 0)continue;let m=s[b];if(m!==void 0&&i[l]===l&&d<m&&!Tt(t,l,b)){let E=o[b];E!==void 0&&(i[b]=l,i[l]=o[l]=E,d=m);}}}});}),{root:o,align:i}}function It(e,n,t,r,o=false){let i={},s=Ct(e,n,t,o),a=o?"borderLeft":"borderRight";function d(f,g){let b=s.nodes().slice(),m={},E=b.pop();for(;E;){if(m[E])f(E);else {m[E]=true,b.push(E);for(let y of g(E))b.push(y);}E=b.pop();}}function l(f){let g=s.inEdges(f);g?i[f]=g.reduce((b,m)=>{var I;let E=(I=i[m.v])!=null?I:0,y=s.edge(m);return Math.max(b,E+(y!==void 0?y:0))},0):i[f]=0;}function u(f){let g=s.outEdges(f),b=Number.POSITIVE_INFINITY;g&&(b=g.reduce((E,y)=>{let I=i[y.w],be=s.edge(y);return Math.min(E,(I!==void 0?I:0)-(be!==void 0?be:0))},Number.POSITIVE_INFINITY));let m=e.node(f);b!==Number.POSITIVE_INFINITY&&m.borderType!==a&&(i[f]=Math.max(i[f]!==void 0?i[f]:0,b));}function c(f){return s.predecessors(f)||[]}function h(f){return s.successors(f)||[]}return d(l,c),d(u,h),Object.keys(r).forEach(f=>{var b;let g=t[f];g!==void 0&&(i[f]=(b=i[g])!=null?b:0);}),i}function Ct(e,n,t,r){let o=new p,i=e.graph(),s=jt(i.nodesep,i.edgesep,r);return n.forEach(a=>{let d;a.forEach(l=>{let u=t[l];if(u!==void 0){if(o.setNode(u),d!==void 0){let c=t[d];if(c!==void 0){let h=o.edge(c,u);o.setEdge(c,u,Math.max(s(e,l,d),h||0));}}d=l;}});}),o}function Rt(e,n){return Object.values(n).reduce((t,r)=>{let o=Number.NEGATIVE_INFINITY,i=Number.POSITIVE_INFINITY;Object.entries(r).forEach(([a,d])=>{let l=St(e,a)/2;o=Math.max(d+l,o),i=Math.min(d-l,i);});let s=o-i;return s<t[0]&&(t=[s,r]),t},[Number.POSITIVE_INFINITY,null])[1]}function Pt(e,n){let t=Object.values(n),r=L(Math.min,t),o=L(Math.max,t);["u","d"].forEach(i=>{["l","r"].forEach(s=>{let a=i+s,d=e[a];if(!d||d===n)return;let l=Object.values(d),u=r-L(Math.min,l);s!=="l"&&(u=o-L(Math.max,l)),u&&(e[a]=O(d,c=>c+u));});});}function Mt(e,n=void 0){let t=e.ul;return t?O(t,(r,o)=>{var s,a;if(n){let d=n.toLowerCase(),l=e[d];if(l&&l[o]!==void 0)return l[o]}let i=Object.values(e).map(d=>{let l=d[o];return l!==void 0?l:0}).sort((d,l)=>d-l);return (((s=i[1])!=null?s:0)+((a=i[2])!=null?a:0))/2}):{}}function ln(e){let n=N(e),t=Object.assign(vt(e,n),_t(e,n)),r={},o;["u","d"].forEach(s=>{o=s==="u"?n:Object.values(n).reverse(),["l","r"].forEach(a=>{a==="r"&&(o=o.map(c=>Object.values(c).reverse()));let l=Ot(e,o,t,c=>(s==="u"?e.predecessors(c):e.successors(c))||[]),u=It(e,o,l.root,l.align,a==="r");a==="r"&&(u=O(u,c=>-c)),r[s+a]=u;});});let i=Rt(e,r);return Pt(r,i),Mt(r,e.graph().align)}function jt(e,n,t){return (r,o,i)=>{let s=r.node(o),a=r.node(i),d=0,l;if(d+=s.width/2,Object.hasOwn(s,"labelpos"))switch(s.labelpos.toLowerCase()){case "l":l=-s.width/2;break;case "r":l=s.width/2;break}if(l&&(d+=t?l:-l),l=void 0,d+=(s.dummy?n:e)/2,d+=(a.dummy?n:e)/2,d+=a.width/2,Object.hasOwn(a,"labelpos"))switch(a.labelpos.toLowerCase()){case "l":l=a.width/2;break;case "r":l=-a.width/2;break}return l&&(d+=t?l:-l),d}}function St(e,n){return e.node(n).width}function un(e){e=A(e),Ft(e),Object.entries(ln(e)).forEach(([n,t])=>e.node(n).x=t);}function Ft(e){let n=N(e),t=e.graph(),r=t.ranksep,o=t.rankalign,i=0;n.forEach(s=>{let a=s.reduce((d,l)=>{var c;let u=(c=e.node(l).height)!=null?c:0;return d>u?d:u},0);s.forEach(d=>{let l=e.node(d);o==="top"?l.y=i+l.height/2:o==="bottom"?l.y=i+a-l.height/2:l.y=i+a/2;}),i+=a+r;});}function he(e,n={}){let t=n.debugTiming?P:M;return t("layout",()=>{let r=t("  buildLayoutGraph",()=>Xt(e));return t("  runLayout",()=>Dt(r,t,n)),t("  updateInputGraph",()=>At(e,r)),r})}function Dt(e,n,t){n("    makeSpaceForEdgeLabels",()=>Ut(e)),n("    removeSelfEdges",()=>rr(e)),n("    acyclic",()=>je(e)),n("    nestingGraph.run",()=>Ke(e)),n("    rank",()=>Xe(A(e))),n("    injectEdgeLabelProxies",()=>Kt(e)),n("    removeEmptyRanks",()=>Oe(e)),n("    nestingGraph.cleanup",()=>Je(e)),n("    normalizeRanks",()=>Te(e)),n("    assignRankMinMax",()=>$t(e)),n("    removeEdgeLabelProxies",()=>Jt(e)),n("    normalize.run",()=>Fe(e)),n("    parentDummyChains",()=>Ue(e)),n("    addBorderSegments",()=>Ze(e)),n("    order",()=>B(e,t)),n("    insertSelfEdges",()=>or(e)),n("    adjustCoordinateSystem",()=>nn(e)),n("    position",()=>un(e)),n("    positionSelfEdges",()=>ir(e)),n("    removeBorderNodes",()=>tr(e)),n("    normalize.undo",()=>De(e)),n("    fixupEdgeLabelCoords",()=>er(e)),n("    undoCoordinateSystem",()=>tn(e)),n("    translateGraph",()=>Qt(e)),n("    assignNodeIntersects",()=>Zt(e)),n("    reversePoints",()=>nr(e)),n("    acyclic.undo",()=>Se(e));}function At(e,n){e.nodes().forEach(t=>{let r=e.node(t),o=n.node(t);r&&(r.x=o.x,r.y=o.y,r.order=o.order,r.rank=o.rank,n.children(t).length&&(r.width=o.width,r.height=o.height));}),e.edges().forEach(t=>{let r=e.edge(t),o=n.edge(t);r.points=o.points,Object.hasOwn(o,"x")&&(r.x=o.x,r.y=o.y);}),e.graph().width=n.graph().width,e.graph().height=n.graph().height;}var Vt=["nodesep","edgesep","ranksep","marginx","marginy"],Wt={ranksep:50,edgesep:20,nodesep:50,rankdir:"TB",rankalign:"center"},Bt=["acyclicer","ranker","rankdir","align","rankalign"],Yt=["width","height","rank"],cn={width:0,height:0},zt=["minlen","weight","width","height","labeloffset"],Ht={minlen:1,weight:1,width:0,height:0,labeloffset:10,labelpos:"r"},qt=["labelpos"];function Xt(e){let n=new p({multigraph:true,compound:true}),t=ce(e.graph());return n.setGraph(Object.assign({},Wt,ue(t,Vt),T(t,Bt))),e.nodes().forEach(r=>{let o=ce(e.node(r)),i=ue(o,Yt);Object.keys(cn).forEach(a=>{i[a]===void 0&&(i[a]=cn[a]);}),n.setNode(r,i);let s=e.parent(r);s!==void 0&&n.setParent(r,s);}),e.edges().forEach(r=>{let o=ce(e.edge(r));n.setEdge(r,Object.assign({},Ht,ue(o,zt),T(o,qt)));}),n}function Ut(e){let n=e.graph();n.ranksep/=2,e.edges().forEach(t=>{let r=e.edge(t);r.minlen*=2,r.labelpos.toLowerCase()!=="c"&&(n.rankdir==="TB"||n.rankdir==="BT"?r.width+=r.labeloffset:r.height+=r.labeloffset);});}function Kt(e){e.edges().forEach(n=>{let t=e.edge(n);if(t.width&&t.height){let r=e.node(n.v),i={rank:(e.node(n.w).rank-r.rank)/2+r.rank,e:n};w(e,"edge-proxy",i,"_ep");}});}function $t(e){let n=0;e.nodes().forEach(t=>{let r=e.node(t);r.borderTop&&(r.minRank=e.node(r.borderTop).rank,r.maxRank=e.node(r.borderBottom).rank,n=Math.max(n,r.maxRank));}),e.graph().maxRank=n;}function Jt(e){e.nodes().forEach(n=>{let t=e.node(n);if(t.dummy==="edge-proxy"){let r=t;e.edge(r.e).labelRank=t.rank,e.removeNode(n);}});}function Qt(e){let n=Number.POSITIVE_INFINITY,t=0,r=Number.POSITIVE_INFINITY,o=0,i=e.graph(),s=i.marginx||0,a=i.marginy||0;function d(l){let u=l.x,c=l.y,h=l.width,f=l.height;n=Math.min(n,u-h/2),t=Math.max(t,u+h/2),r=Math.min(r,c-f/2),o=Math.max(o,c+f/2);}e.nodes().forEach(l=>d(e.node(l))),e.edges().forEach(l=>{let u=e.edge(l);Object.hasOwn(u,"x")&&d(u);}),n-=s,r-=a,e.nodes().forEach(l=>{let u=e.node(l);u.x-=n,u.y-=r;}),e.edges().forEach(l=>{let u=e.edge(l);u.points.forEach(c=>{c.x-=n,c.y-=r;}),Object.hasOwn(u,"x")&&(u.x-=n),Object.hasOwn(u,"y")&&(u.y-=r);}),i.width=t-n+s,i.height=o-r+a;}function Zt(e){e.edges().forEach(n=>{let t=e.edge(n),r=e.node(n.v),o=e.node(n.w),i,s;t.points?(i=t.points[0],s=t.points[t.points.length-1]):(t.points=[],i=o,s=r),t.points.unshift(H(r,i)),t.points.push(H(o,s));});}function er(e){e.edges().forEach(n=>{let t=e.edge(n);if(Object.hasOwn(t,"x"))switch((t.labelpos==="l"||t.labelpos==="r")&&(t.width-=t.labeloffset),t.labelpos){case "l":t.x-=t.width/2+t.labeloffset;break;case "r":t.x+=t.width/2+t.labeloffset;break}});}function nr(e){e.edges().forEach(n=>{let t=e.edge(n);t.reversed&&t.points.reverse();});}function tr(e){e.nodes().forEach(n=>{if(e.children(n).length){let t=e.node(n),r=e.node(t.borderTop),o=e.node(t.borderBottom),i=e.node(t.borderLeft[t.borderLeft.length-1]),s=e.node(t.borderRight[t.borderRight.length-1]);t.width=Math.abs(s.x-i.x),t.height=Math.abs(o.y-r.y),t.x=i.x+t.width/2,t.y=r.y+t.height/2;}}),e.nodes().forEach(n=>{e.node(n).dummy==="border"&&e.removeNode(n);});}function rr(e){e.edges().forEach(n=>{if(n.v===n.w){let t=e.node(n.v);t.selfEdges||(t.selfEdges=[]),t.selfEdges.push({e:n,label:e.edge(n)}),e.removeEdge(n);}});}function or(e){N(e).forEach(t=>{let r=0;t.forEach((o,i)=>{let s=e.node(o);s.order=i+r,(s.selfEdges||[]).forEach(a=>{w(e,"selfedge",{width:a.label.width,height:a.label.height,rank:s.rank,order:i+ ++r,e:a.e,label:a.label},"_se");}),delete s.selfEdges;});});}function ir(e){e.nodes().forEach(n=>{let t=e.node(n);if(t.dummy==="selfedge"){let r=t,o=e.node(r.e.v),i=o.x+o.width/2,s=o.y,a=t.x-i,d=o.height/2;e.setEdge(r.e,r.label),e.removeNode(n),r.label.points=[{x:i+2*a/3,y:s-d},{x:i+5*a/6,y:s-d},{x:i+a,y:s},{x:i+5*a/6,y:s+d},{x:i+2*a/3,y:s+d}],r.label.x=t.x,r.label.y=t.y;}});}function ue(e,n){return O(T(e,n),Number)}function ce(e){let n={};return e&&Object.entries(e).forEach(([t,r])=>{typeof t=="string"&&(t=t.toLowerCase()),n[t]=r;}),n}function fe(e){let n=N(e),t=new p({compound:true,multigraph:true}).setGraph({});return e.nodes().forEach(r=>{t.setNode(r,{label:r}),t.setParent(r,"layer"+e.node(r).rank);}),e.edges().forEach(r=>t.setEdge(r.v,r.w,{},r.name)),n.forEach((r,o)=>{let i="layer"+o;t.setNode(i,{rank:"same"}),r.reduce((s,a)=>(t.setEdge(s,a,{style:"invis"}),a));}),t}var sr={graphlib:z,version:U,layout:he,debug:fe,util:{time:P,notime:M}},To=sr;/*! For license information please see dagre.esm.js.LEGAL.txt */

  var isFunction = function isFunction(o) {
    return typeof o === 'function';
  };
  var EPSILON = 0.001; // what does it mean to be too close to 0?

  // constructor
  // options : object containing layout options
  function DagreLayout(options) {
    this.options = assign({}, defaults, options);
  }
  function subtract(a, b) {
    return {
      x: noZero(a.x - b.x),
      y: noZero(a.y - b.y)
    };
  }
  function product(a, b) {
    return noZero(a.x * b.x) + noZero(a.y * b.y);
  }
  function norm(v) {
    var len = Math.hypot(v.x, v.y) || 1;
    return {
      x: v.x / len,
      y: v.y / len,
      len: len
    };
  }
  function perp(v) {
    return {
      x: -v.y,
      y: v.x
    };
  }

  /* provides the context for mapping from dagre's x, y coordinate system
   * for control points to cytoscapes coordinate system for control points
   * which is relative to the straight vector from source to target node
   */
  function buildEdgeFrame(src, tgt) {
    var d = subtract(tgt, src);
    var _norm = norm(d),
      x = _norm.x,
      y = _norm.y,
      len = _norm.len;
    var dir = {
      x: x,
      y: y
    };
    var normal = perp(dir);
    return {
      src: src,
      tgt: tgt,
      dir: dir,
      normal: normal,
      len: len
    };
  }
  function noZero(x) {
    if (Math.abs(x) < EPSILON) {
      return x < 0 ? -EPSILON : EPSILON;
    }
    return x;
  }
  function toEdgeCoordinates(P, frame) {
    var vector = subtract(P, frame.src);
    var weight = noZero(product(vector, frame.dir) / frame.len);
    var distance = noZero(product(vector, frame.normal));
    return {
      weight: weight,
      distance: distance
    };
  }
  function normalizeWeight(coords) {
    var min = Infinity;
    var max = -Infinity;
    var _iterator = _createForOfIteratorHelper(coords),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var p = _step.value;
        if (p.weight < min) {
          min = p.weight;
        }
        if (p.weight > max) {
          max = p.weight;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var range = max - min || 1;
    return coords.map(function (p) {
      return {
        distance: p.distance,
        weight: (p.weight - min) / range
      };
    });
  }

  /* First introduce new control points to bridge between the dagre list of 
   * points and the centres of cytoscape nodes.
   * Then we sanitize any empty or non-existing or degenerate control points
   * And finally we map the Dagre coordinates to the Cytoscape coordinated which
   * are relative to the original direction vector from source to target.
   * These final coordinates are stored pairwise in two arrays cpw and cpd
   * which are picked up by the Bezier construction code in cytoscape.
   */
  function dagreEdgeToCytoscapeEdge(dEdge, cEdge) {
    var fromNode = cEdge.source().position();
    var toNode = cEdge.target().position();
    var frame = buildEdgeFrame(fromNode, toNode);
    var coords = normalizeWeight(dEdge.points.map(function (p) {
      return toEdgeCoordinates(p, frame);
    }));
    var controlPointWeights = coords.slice(1, -1).map(function (c) {
      return c.weight;
    });
    var controlPointDistances = coords.slice(1, -1).map(function (c) {
      return c.distance;
    });
    var result = {
      controlPointWeights: controlPointWeights,
      controlPointDistances: controlPointDistances
    };
    return result;
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
    var g = new To.graphlib.Graph({
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
        shape: 'ellipse',
        name: node.id()
      });
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
    }
    To.layout(g);
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
    if (options.useDagreEdgeControlPoints) {
      if (options.automaticDagreEdgeStyle) {
        cy.edges().addClass('useDagreEdgeControlPoints');
        cy.style().selector('edge.useDagreEdgeControlPoints').style(options.dagreEdgeStyle).update();
      }
      g.edges().forEach(function (id) {
        var cyEdge = cy.getElementById(id.name);
        var dEdge = g.edge(id);
        if (dEdge && dEdge.points) {
          cyEdge.scratch(dagreEdgeToCytoscapeEdge(dEdge, cyEdge));
        }
      });
    }
    return this; // chaining
  };

  // registers the extension on a cytoscape lib ref
  var register = function register(cytoscape) {
    if (!cytoscape) {
      return;
    } // can't register if cytoscape unspecified

    cytoscape('layout', 'dagre', DagreLayout); // register with cytoscape.js
  };
  if (typeof window !== 'undefined' && typeof window.cytoscape !== 'undefined') {
    // expose to global cytoscape (i.e. window.cytoscape)
    register(window.cytoscape);
  }

  return register;

}));
//# sourceMappingURL=cytoscape-dagre.js.map
