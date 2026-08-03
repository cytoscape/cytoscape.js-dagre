import dagre from '@dagrejs/dagre';
import defaults from './defaults.js';
import assign from './assign.js';

interface Point {
  x: number;
  y: number;
}

interface Frame {
  src: Point;
  tgt: Point;
  dir: Point;
  normal: Point;
  len: number;
}

interface DagreEdge {
  points: Point[];
}

const isFunction = (o: any): o is Function => typeof o === 'function';
const EPSILON = 0.001;

function getDagreNode(ele: any): any {
  if (ele.isParent()) {
    const children = ele.children();
    if (children.length > 0) {
      return getDagreNode(children[0]);
    }
  }
  return ele;
}

function subtract(a: Point, b: Point): Point {
  return { x: noZero(a.x - b.x), y: noZero(a.y - b.y) };
}

function product(a: Point, b: Point): number {
  return noZero(a.x * b.x) + noZero(a.y * b.y);
}

function norm(v: Point): Point & { len: number } {
  const len = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / len, y: v.y / len, len };
}

function perp(v: Point): Point {
  return { x: -v.y, y: v.x };
}

function buildEdgeFrame(src: Point, tgt: Point): Frame {
  const d = subtract(tgt, src);
  const { x, y, len } = norm(d);

  const dir = { x, y };
  const normal = perp(dir);

  return { src, tgt, dir, normal, len };
}

function noZero(x: number): number {
  if (Math.abs(x) < EPSILON) {
    return x < 0 ? -EPSILON : EPSILON;
  }
  return x;
}

function toEdgeCoordinates(P: Point, frame: Frame): { weight: number; distance: number } {
  const vector = subtract(P, frame.src);
  const weight = noZero(product(vector, frame.dir) / frame.len);
  const distance = noZero(product(vector, frame.normal));

  return { weight, distance };
}

function normalizeWeight(coords: Array<{ weight: number; distance: number }>) {
  let min = Infinity;
  let max = -Infinity;

  for (const p of coords) {
    if (p.weight < min) min = p.weight;
    if (p.weight > max) max = p.weight;
  }

  const range = max - min || 1;

  return coords.map(p => ({
    distance: p.distance,
    weight: (p.weight - min) / range
  }));
}

function dagreEdgeToCytoscapeEdge(dEdge: DagreEdge, cEdge: any) {
  const fromNode = cEdge.source().position();
  const toNode = cEdge.target().position();
  const frame = buildEdgeFrame(fromNode, toNode);
  const coords = normalizeWeight(dEdge.points.map(p => toEdgeCoordinates(p, frame)));

  const controlPointWeights = coords.slice(1, -1).map(c => c.weight);
  const controlPointDistances = coords.slice(1, -1).map(c => c.distance);

  return { controlPointWeights, controlPointDistances };
}

export function DagreLayout(this: any, options: any): void {
  this.options = assign({}, defaults, options);
}

DagreLayout.prototype.run = function (this: any): any {
  const options = this.options;

  const cy = options.cy;
  const eles = options.eles;

  const getVal = (ele: any, val: any) => (isFunction(val) ? val.apply(ele, [ele]) : val);

  let bb = options.boundingBox || { x1: 0, y1: 0, w: cy.width(), h: cy.height() };
  if (bb.x2 === undefined) { bb.x2 = bb.x1 + bb.w; }
  if (bb.w === undefined) { bb.w = bb.x2 - bb.x1; }
  if (bb.y2 === undefined) { bb.y2 = bb.y1 + bb.h; }
  if (bb.h === undefined) { bb.h = bb.y2 - bb.y1; }

  const g = new dagre.graphlib.Graph({
    multigraph: true,
    compound: true
  });

  const gObj: Record<string, any> = {};
  const setGObj = (name: string, val: any) => {
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

  g.setDefaultEdgeLabel(() => ({}));
  g.setDefaultNodeLabel(() => ({}));

  // Add nodes to dagre
  let nodes = eles.nodes();

  if (isFunction(options.sort)) {
    nodes = nodes.sort(options.sort);
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const nbb = node.layoutDimensions(options);

    g.setNode(node.id(), {
      width: nbb.w,
      height: nbb.h,
      shape: 'ellipse',
      name: node.id()
    });
  }

  // Set compound parents
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.isChild()) {
      g.setParent(node.id(), node.parent().id());
    }
  }

  // Add edges to dagre
  let edges = eles.edges();

  if (isFunction(options.sort)) {
    edges = edges.sort(options.sort);
  }

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];

    const sourceNode = getDagreNode(edge.source());
    const targetNode = getDagreNode(edge.target());

    g.setEdge(
      sourceNode.id(),
      targetNode.id(),
      {
        minlen: getVal(edge, options.minLen),
        weight: getVal(edge, options.edgeWeight),
        name: edge.id()
      },
      edge.id()
    );
  }

  dagre.layout(g);

  const gNodeIds = g.nodes();
  for (let i = 0; i < gNodeIds.length; i++) {
    const id = gNodeIds[i];
    const n = g.node(id);

    cy.getElementById(id).scratch().dagre = n;
  }

  let dagreBB: any;

  if (options.boundingBox) {
    dagreBB = { x1: Infinity, x2: -Infinity, y1: Infinity, y2: -Infinity };
    nodes.forEach((node: any) => {
      const dModel = node.scratch().dagre;

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

  const constrainPos = (p: Point) => {
    if (options.boundingBox) {
      const xPct = dagreBB.w === 0 ? 0 : (p.x - dagreBB.x1) / dagreBB.w;
      const yPct = dagreBB.h === 0 ? 0 : (p.y - dagreBB.y1) / dagreBB.h;

      return {
        x: bb.x1 + xPct * bb.w,
        y: bb.y1 + yPct * bb.h
      };
    } else {
      return p;
    }
  };

  nodes.layoutPositions(this, options, (ele: any) => {
    const dModel = ele.scratch().dagre;

    return constrainPos({
      x: dModel.x,
      y: dModel.y
    });
  });

  if (options.useDagreEdgeControlPoints) {
    if (options.automaticDagreEdgeStyle) {
      cy.edges().addClass('useDagreEdgeControlPoints');
      cy.style()
        .selector('edge.useDagreEdgeControlPoints')
        .style(options.dagreEdgeStyle)
        .update();
    }

    g.edges().forEach((id: any) => {
      const cyEdge = cy.getElementById(id.name);
      const dEdge = g.edge(id);

      if (dEdge && dEdge.points) {
        cyEdge.scratch(dagreEdgeToCytoscapeEdge(dEdge, cyEdge));
      }
    });
  }

  return this;
};

export default DagreLayout;