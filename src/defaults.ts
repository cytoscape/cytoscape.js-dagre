const defaults = {
  name: 'dagre',
  nodeSep: undefined,
  edgeSep: undefined,
  rankSep: undefined,
  rankDir: undefined,
  align: undefined,
  acyclicer: undefined,
  ranker: undefined,
  minLen: function(edge: any) { return 1; },
  edgeWeight: function(edge: any) { return 1; },
  fit: true,
  padding: 30,
  spacingFactor: 1,
  nodeDimensionsIncludeLabels: false,
  useDagreEdgeControlPoints: false,
  automaticDagreEdgeStyle: true,
  dagreEdgeStyle: {},
  animate: false,
  animationDuration: 500,
  animationEasing: undefined,
  boundingBox: undefined,
  transform: function(node: any, pos: { x: number; y: number }) { return pos; },
  ready: function() {},
  sort: undefined,
  stop: function() {}
};

export default defaults;