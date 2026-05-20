/** 
 * Dagre algorithmic options. The default value of dagre.js is used
 * when the option is left undefined here.
 */
const defaults = {
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
  ranker:  undefined, 
  /**
   * Number of ranks to keep between the source and target of the edge
   */
  minLen: function( _edge ){ return 1; },
  /**
   * Higher weight edges are generally made shorter and straighter than lower weight edges} _edge 
   */
  edgeWeight: function( _edge ){ return 1; }, 

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
    'curve-style'             : 'unbundled-bezier',
    'control-point-weights'   : ele => ele.scratch('controlPointWeights'),
    'control-point-distances' : ele => ele.scratch('controlPointDistances'),
    'edge-distances'          : 'intersection',
    'edge-ends-overlap'       : false
  },
  /**
   * Whether to transition the node positions
   */
  animate: false, 
  /**
   * Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
   */
  animateFilter: function( _node, _i ){ return true; }, 
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
  transform: function( node, pos ){ return pos; }, 
  /**
   * On layoutready execute this function
   */
  ready: function(){}, 
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
  stop: function(){}, 
};

export default defaults;
