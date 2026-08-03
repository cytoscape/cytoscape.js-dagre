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
    transform?: (node: any, pos: {
        x: number;
        y: number;
    }) => {
        x: number;
        y: number;
    };
    ready?: (e?: any) => void;
    sort?: (a: any, b: any) => number;
    stop?: (e?: any) => void;
    [key: string]: any;
}
/**
 * Dagre algorithmic options. The default value of dagre.js is used
 * when the option is left undefined here.
 */
declare const defaults: DagreLayoutOptions;
export default defaults;
