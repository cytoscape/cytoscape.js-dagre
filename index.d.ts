import cytoscape = require('cytoscape');

declare const cytoscapeDagre: cytoscape.Ext;
export = cytoscapeDagre;

declare namespace cytoscapeDagre {
  type DagreRankDir = 'TB' | 'BT' | 'LR' | 'RL';
  type DagreAlign = 'UL' | 'UR' | 'DL' | 'DR';
  type DagreAcyclicer = 'greedy';
  type DagreRanker = 'network-simplex' | 'tight-tree' | 'longest-path';

  interface DagreOrderConstraint {
    left: string;
    right: string;
  }

  /** Minimal node-ordering view of Dagre's internal graph, including dummy nodes. */
  interface DagreOrderingGraph {
    nodes(): string[];
    node(id: string): { rank?: number; order?: number; [key: string]: unknown } | undefined;
  }

  interface DagreLayoutConfig {
    constraints?: DagreOrderConstraint[];
    customOrder?: DagreCustomOrder;
    disableOptimalOrderHeuristic?: boolean;
  }

  type DagreCustomOrder = (
    graph: DagreOrderingGraph,
    builtInOrder: (graph: DagreOrderingGraph, options?: DagreLayoutConfig) => void
  ) => void;

  interface DagreAlgorithmOptions {
    [key: string]: any;
  }

  interface DagreAlgorithm {
    layout(graph: DagreAlgorithmOptions, options?: DagreAlgorithmOptions): void;
    graphlib?: DagreAlgorithmOptions;
  }

  interface DagreEdgeStyle {
    [key: string]: any;
  }

  interface DagreLayoutOptions extends cytoscape.BaseLayoutOptions, cytoscape.AnimatedLayoutOptions, cytoscape.LayoutDimensionOptions {
    name: 'dagre';
    nodeSep?: number;
    edgeSep?: number;
    rankSep?: number;
    rankDir?: DagreRankDir;
    align?: DagreAlign;
    acyclicer?: DagreAcyclicer;
    ranker?: DagreRanker;
    dagreOptions?: DagreLayoutConfig;
    minLen?: number | ((edge: cytoscape.EdgeSingular) => number);
    edgeWeight?: number | ((edge: cytoscape.EdgeSingular) => number);
    fit?: boolean;
    padding?: number;
    spacingFactor?: number;
    boundingBox?: cytoscape.BoundingBox12 | cytoscape.BoundingBoxWH;
    sort?: (a: cytoscape.SingularElementArgument, b: cytoscape.SingularElementArgument) => number;
    useDagreEdgeControlPoints?: boolean;
    automaticDagreEdgeStyle?: boolean;
    dagreEdgeStyle?: DagreEdgeStyle;
  }
}
