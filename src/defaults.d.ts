/**
 * Dagre algorithmic options. The default value of dagre.js is used
 * when the option is left undefined here.
 */
declare const defaults: {
    /**
     * The separation between adjacent nodes in the same rank
     */
    nodeSep: undefined;
    /**
     * The separation between adjacent edges in the same rank
     */
    edgeSep: undefined;
    /**
     * The separation between each rank in the layout
     */
    rankSep: undefined;
    /**
     * Direction in which ranks flow: 'TB' for top to bottom flow,
     * 'LR' for left to right.
     */
    rankDir: undefined;
    /**
     * Alignment for rank nodes. Can be 'UL', 'UR', 'DL', or 'DR',
     * where U = up, D = down, L = left, and R = right.
     */
    align: undefined;
    /**
     * If set to 'greedy', uses a greedy heuristic for finding a
     * feedback arc set for a graph.
     *
     * A feedback arc set is a set of edges that can be removed
     * to make a graph acyclic.
     */
    acyclicer: undefined;
    /**
     * Type of algorithm that assigns a rank to each node in the
     * input graph.
     *
     * Possible values:
     * - 'network-simplex'
     * - 'tight-tree'
     * - 'longest-path'
     */
    ranker: undefined;
    /**
     * Number of ranks to keep between the source and target of the edge.
     */
    minLen: (_edge: unknown) => number;
    /**
     * Higher weight edges are generally made shorter and straighter
     * than lower weight edges.
     */
    edgeWeight: (_edge: unknown) => number;
    /**
     * General layout options
     */
    /**
     * Whether to fit to viewport.
     */
    fit: boolean;
    /**
     * Fit padding.
     */
    padding: number;
    /**
     * Applies a multiplicative factor (>0) to expand or compress
     * the overall area that the nodes take up.
     */
    spacingFactor: undefined;
    /**
     * Whether labels should be included in determining the space
     * used by a node.
     */
    nodeDimensionsIncludeLabels: boolean;
    /**
     * Enables bezier curves using dagre's edge control points.
     */
    useDagreEdgeControlPoints: boolean;
    /**
     * Automatically adds edge class '.useDagreEdgeControlPoints'
     * to all edges and configures it with this.dagreEdgeStyle.
     *
     * If set to false and useDagreEdgeControlPoints is true,
     * then apply this.dagreEdgeStyle yourself.
     */
    automaticDagreEdgeStyle: boolean;
    /**
     * Defines the style for rendering dagre edge control points
     * stored by the layout algorithm if useDagreEdgeControlPoints
     * and automaticDagreEdgeStyle are both true.
     */
    dagreEdgeStyle: {
        'curve-style': string;
        'control-point-weights': (ele: any) => any;
        'control-point-distances': (ele: any) => any;
        'edge-distances': string;
        'edge-ends-overlap': boolean;
    };
    /**
     * Whether to transition the node positions.
     */
    animate: boolean;
    /**
     * Whether to animate specific nodes when animation is on;
     * non-animated nodes immediately go to their final positions.
     */
    animateFilter: (_node: unknown, _i: number) => boolean;
    /**
     * Duration of animation in ms if enabled.
     */
    animationDuration: number;
    /**
     * Easing of animation, if enabled.
     */
    animationEasing: undefined;
    /**
     * Constrain outermost layout bounds;
     * { x1, y1, x2, y2 } or { x1, y1, w, h }.
     */
    boundingBox: undefined;
    /**
     * A function that applies a transform to the final node position.
     */
    transform: (_node: unknown, pos: {
        x: number;
        y: number;
    }) => {
        x: number;
        y: number;
    };
    /**
     * On layoutready execute this function.
     */
    ready: () => void;
    /**
     * A sorting function to order the nodes and edges;
     * e.g. function(a, b){ return a.data('weight') - b.data('weight') }.
     *
     * Because cytoscape dagre creates a directed graph, and directed
     * graphs use the node order as a tie breaker when defining the
     * topology of a graph, this sort function can help ensure the
     * correct order of the nodes/edges.
     *
     * This feature is most useful when adding and removing the same
     * nodes and edges multiple times in a graph, but it can also help
     * avoid spurious edge crossings between ranks.
     */
    sort: undefined;
    /**
     * On layoutstop, execute this function.
     */
    stop: () => void;
};
export default defaults;
