export interface DagreOptions {
  name: string;
  nodeSep?: number;
  edgeSep?: number;
  rankSep?: number;
  rankDir?: 'TB' | 'BT' | 'LR' | 'RL';
  align?: 'UL' | 'UR' | 'DL' | 'DR' | undefined;
  acyclicer?: 'greedy' | undefined;
  ranker?: 'network-simplex' | 'longest-path' | 'tight-tree';
  minLen?: (edge: any) => number;
  edgeWeight?: (edge: any) => number;
  width?: (node: any) => number;
  height?: (node: any) => number;
  fit?: boolean;
  padding?: number | [number, number, number, number];
  spacingFactor?: number;
  nodeDimensionsIncludeLabels?: boolean;
  useDagreEdgeControlPoints?: boolean;
  automaticDagreEdgeStyle?: boolean;
  dagreEdgeStyle?: Record<string, any>;
  animate?: boolean;
  animateFilter?: (node: any, i: number) => boolean;
  animationDuration?: number;
  animationEasing?: string;
  boundingBox?: {
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    w?: number;
    h?: number;
  };
  transform?: (node: any, pos: { x: number; y: number }) => { x: number; y: number };
  ready?: () => void;
  sort?: (a: any, b: any) => number;
  stop?: () => void;
}