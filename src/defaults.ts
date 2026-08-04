export interface DagreLayoutOptions {
  nodeSep?: number;
  edgeSep?: number;
  rankSep?: number;
  rankDir?: 'TB' | 'BT' | 'LR' | 'RL';
  align?: 'UL' | 'UR' | 'DL' | 'DR';
  acyclicer?: 'greedy';
  ranker?: 'network-simplex' | 'tight-tree' | 'longest-path';
  minLen?: (edge: any) => number;
  edgeWeight?: (edge: any) => number;
  fit?: boolean;
  padding?: number;
  spacingFactor?: number;
  nodeDimensionsIncludeLabels?: boolean;
  useDagreEdgeControlPoints?: boolean;
  automaticDagreEdgeStyle?: boolean;
  dagreEdgeStyle?: Record<string, any>;
  animate?: boolean;
  animateFilter?: (node: any, i: number) => boolean;
  animationDuration?: number;
  animationEasing?: string;
  boundingBox?: any;
  transform?: (node: any, pos: { x: number; y: number }) => { x: number; y: number };
  ready?: (e?: any) => void;
  sort?: (a: any, b: any) => number;
  stop?: (e?: any) => void;
  [key: string]: any;
}

/** 
 * Dagre algorithmic options. The default value of dagre.js is used
 * when the option is left undefined here.
 */
const defaults: DagreLayoutOptions = {
  nodeSep: undefined, 
  edgeSep: undefined, 
  rankSep: undefined, 
  rankDir: undefined,
  align: undefined,  
  acyclicer: undefined, 
  ranker: undefined, 
  minLen: function( _edge: any ){ return 1; },
  edgeWeight: function( _edge: any ){ return 1; }, 

  /* general layout options */
  fit: true, 
  padding: 30, 
  spacingFactor: undefined, 
  nodeDimensionsIncludeLabels: false, 
  useDagreEdgeControlPoints: false, 
  automaticDagreEdgeStyle: false,
  dagreEdgeStyle: {
    'curve-style'             : 'unbundled-bezier',
    'control-point-weights'   : (ele: any) => ele.scratch('controlPointWeights'),
    'control-point-distances' : (ele: any) => ele.scratch('controlPointDistances'),
    'edge-distances'          : 'intersection',
    'edge-ends-overlap'       : false
  },
  animate: false, 
  animateFilter: function( _node: any, _i: number ){ return true; }, 
  animationDuration: 500, 
  animationEasing: undefined, 
  boundingBox: undefined, 
  transform: function( _node: any, pos: { x: number; y: number } ){ return pos; }, 
  ready: function(){}, 
  sort: undefined, 
  stop: function(){}, 
};

export default defaults;