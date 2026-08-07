import cytoscape from 'cytoscape';
import defaults from './defaults.js';
import assign from './assign.js';
import dagre from '@dagrejs/dagre';
/**
 * Checks whether a value is a function.
 */
const isFunction = function (value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
};

/**
 * Small epsilon used to prevent values from becoming exactly zero.
 */
const EPSILON = 0.001;

/**
 * A two-dimensional point.
 */
type Point = {
  x: number;
  y: number;
};

/**
 * Frame used to translate Dagre control points into
 * Cytoscape control-point coordinates.
 */
type EdgeFrame = {
  src: Point;
  tgt: Point;
  dir: Point;
  normal: Point;
  len: number;
};

/**
 * Coordinates of a Dagre control point relative to an edge.
 */
type EdgeCoordinates = {
  weight: number;
  distance: number;
};

/**
 * Control-point data stored in Cytoscape scratch data.
 */
type ControlPoints = {
  controlPointWeights: number[];
  controlPointDistances: number[];
};

/**
 * Dagre node model stored in Cytoscape scratch data.
 *
 * Dagre provides additional properties at runtime, so only the
 * properties used by this extension are represented here.
 */
type DagreNode = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  [key: string]: unknown;
};

/**
 * Dagre edge model used by the extension.
 */
type DagreEdge = {
  points?: Point[];
  [key: string]: unknown;
};

/**
 * Helper to resolve parent nodes to actual child nodes
 * for Dagre ranking.
 *
 * If the supplied element is a compound parent, recursively find
 * the first leaf child inside it.
 */
function getDagreNode(
  ele: cytoscape.NodeSingular
): cytoscape.NodeSingular {
  if (ele.isParent()) {
    const children = ele.children();

    if (children.length > 0) {
      return getDagreNode(children[0]);
    }
  }

  return ele;
}

/**
 * Constructor for the Dagre layout.
 *
 * Cytoscape supplies the layout options when the layout is created.
 */
function DagreLayout(this: any, options: any) {
  this.options = assign({}, defaults, options);
}

/**
 * Subtracts two points.
 */
function subtract(a: Point, b: Point): Point {
  return {
    x: noZero(a.x - b.x),
    y: noZero(a.y - b.y),
  };
}

/**
 * Calculates the dot product of two vectors.
 */
function product(a: Point, b: Point): number {
  return noZero(a.x * b.x) + noZero(a.y * b.y);
}

/**
 * Normalises a vector.
 */
function norm(v: Point): Point & { len: number } {
  const len = Math.hypot(v.x, v.y) || 1;

  return {
    x: v.x / len,
    y: v.y / len,
    len,
  };
}

/**
 * Returns a perpendicular vector.
 */
function perp(v: Point): Point {
  return {
    x: -v.y,
    y: v.x,
  };
}

/**
 * Provides the context for mapping from Dagre's x/y coordinate
 * system for control points to Cytoscape's coordinate system.
 *
 * Cytoscape control-point coordinates are relative to the
 * straight vector from source to target.
 */
function buildEdgeFrame(src: Point, tgt: Point): EdgeFrame {
  const d = subtract(tgt, src);

  const { x, y, len } = norm(d);

  const dir = { x, y };
  const normal = perp(dir);

  return {
    src,
    tgt,
    dir,
    normal,
    len,
  };
}

/**
 * Prevents values that are too close to zero from becoming zero.
 */
function noZero(x: number): number {
  if (Math.abs(x) < EPSILON) {
    return x < 0 ? -EPSILON : EPSILON;
  }

  return x;
}

/**
 * Converts a point into coordinates relative to an edge frame.
 */
function toEdgeCoordinates(
  P: Point,
  frame: EdgeFrame
): EdgeCoordinates {
  const vector = subtract(P, frame.src);

  const weight = noZero(
    product(vector, frame.dir) / frame.len
  );

  const distance = noZero(
    product(vector, frame.normal)
  );

  return {
    weight,
    distance,
  };
}

/**
 * Normalises control-point weights to the range [0, 1].
 */
function normalizeWeight(
  coords: EdgeCoordinates[]
): EdgeCoordinates[] {
  let min = Infinity;
  let max = -Infinity;

  for (const point of coords) {
    if (point.weight < min) {
      min = point.weight;
    }

    if (point.weight > max) {
      max = point.weight;
    }
  }

  const range = max - min || 1;

  return coords.map((point) => ({
    distance: point.distance,
    weight: (point.weight - min) / range,
  }));
}

/**
 * Introduces new control points to bridge between Dagre's list
 * of points and the centres of Cytoscape nodes.
 *
 * Empty, non-existing, and degenerate control points are sanitised.
 *
 * The final coordinates are stored pairwise in two arrays:
 *
 * - controlPointWeights
 * - controlPointDistances
 *
 * Cytoscape's Bezier construction code consumes these arrays.
 */
function dagreEdgeToCytoscapeEdge(
  dEdge: DagreEdge,
  cEdge: cytoscape.EdgeSingular
): ControlPoints {
  const fromNode = cEdge.source().position();
  const toNode = cEdge.target().position();

  const frame = buildEdgeFrame(fromNode, toNode);

  const points = dEdge.points || [];

  const coords = normalizeWeight(
    points.map((point) =>
      toEdgeCoordinates(point, frame)
    )
  );

  const controlPointWeights = coords
    .slice(1, -1)
    .map((coordinate) => coordinate.weight);

  const controlPointDistances = coords
    .slice(1, -1)
    .map((coordinate) => coordinate.distance);

  return {
    controlPointWeights,
    controlPointDistances,
  };
}

/**
 * Runs the Dagre layout.
 */
DagreLayout.prototype.run = function (): any {
  const options = this.options;
  const layout = this;

  // Cytoscape automatically populates these values for us.
  const cy = options.cy;
  const eles = options.eles;

  /**
   * Resolves a layout option that may either be a value or
   * a function evaluated against an element.
   */
  const getVal = function (
    ele: cytoscape.SingularElementArgument,
    val: unknown
  ): unknown {
    return isFunction(val)
      ? val.apply(ele, [ele])
      : val;
  };

  /**
   * Resolve the layout bounding box.
   */
  const bb = options.boundingBox || {
    x1: 0,
    y1: 0,
    w: cy.width(),
    h: cy.height(),
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

  /**
   * Create the Dagre graph.
   */
  const g = new dagre.graphlib.Graph({
    multigraph: true,
    compound: true,
  });

  const gObj: Record<string, unknown> = {};

  const setGObj = function (
    name: string,
    val: unknown
  ): void {
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

  /**
   * Add Cytoscape nodes to Dagre.
   */
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
      name: node.id(),
    });
  }

  /**
   * Set compound-node parent relationships.
   */
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.isChild()) {
      g.setParent(
        node.id(),
        node.parent().id()
      );
    }
  }

  /**
   * Add Cytoscape edges to Dagre.
   *
   * Edges connected directly to compound parent nodes are
   * filtered before evaluating per-edge options such as
   * minLen and edgeWeight.
   */
  let edges = eles.edges();

  if (isFunction(options.sort)) {
    edges = edges.sort(options.sort);
  }

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];

    /**
     * Do not pass edges connected directly to compound
     * parents to Dagre or invoke their edge option callbacks.
     */
    if (
      edge.source().isParent() ||
      edge.target().isParent()
    ) {
      continue;
    }

    /**
     * Resolve source and target to non-parent leaf nodes
     * when necessary.
     */
    const sourceNode = getDagreNode(edge.source());
    const targetNode = getDagreNode(edge.target());

    g.setEdge(
      sourceNode.id(),
      targetNode.id(),
      {
        minlen: getVal(edge, options.minLen),
        weight: getVal(edge, options.edgeWeight),
        name: edge.id(),
      },
      edge.id()
    );
  }

  /**
   * Run the Dagre layout algorithm.
   */
  dagre.layout(g);

  /**
   * Store Dagre node models in Cytoscape scratch data.
   */
  const gNodeIds = g.nodes();

  for (let i = 0; i < gNodeIds.length; i++) {
    const id = gNodeIds[i];

    const n = g.node(id) as DagreNode;

    cy.getElementById(id)
      .scratch()
      .dagre = n;
  }

  let dagreBB: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    w: number;
    h: number;
  };

  /**
   * Calculate the Dagre bounding box when the user supplied
   * a Cytoscape bounding box.
   */
  if (options.boundingBox) {
    dagreBB = {
      x1: Infinity,
      x2: -Infinity,
      y1: Infinity,
      y2: -Infinity,
      w: 0,
      h: 0,
    };

    nodes.forEach(function (node: cytoscape.NodeSingular) {
      const dModel = node.scratch().dagre as DagreNode;

      dagreBB.x1 = Math.min(
        dagreBB.x1,
        dModel.x
      );

      dagreBB.x2 = Math.max(
        dagreBB.x2,
        dModel.x
      );

      dagreBB.y1 = Math.min(
        dagreBB.y1,
        dModel.y
      );

      dagreBB.y2 = Math.max(
        dagreBB.y2,
        dModel.y
      );
    });

    dagreBB.w = dagreBB.x2 - dagreBB.x1;
    dagreBB.h = dagreBB.y2 - dagreBB.y1;
  } else {
    dagreBB = bb;
  }

  /**
   * Convert Dagre coordinates into Cytoscape coordinates
   * when a bounding box was supplied.
   */
  const constrainPos = function (
    p: Point
  ): Point {
    if (options.boundingBox) {
      const xPct =
        dagreBB.w === 0
          ? 0
          : (p.x - dagreBB.x1) / dagreBB.w;

      const yPct =
        dagreBB.h === 0
          ? 0
          : (p.y - dagreBB.y1) / dagreBB.h;

      return {
        x: bb.x1 + xPct * bb.w,
        y: bb.y1 + yPct * bb.h,
      };
    }

    return p;
  };

  /**
   * Apply the calculated positions to Cytoscape nodes.
   *
   * Cytoscape's current declaration for layoutPositions() is
   * incomplete for the function-style layout API, so this call
   * is intentionally kept at the runtime boundary.
   */
  nodes.layoutPositions(
    layout,
    options,
    function (ele: cytoscape.NodeSingular): Point {
      const dModel =
        ele.scratch().dagre as DagreNode;

      return constrainPos({
        x: dModel.x,
        y: dModel.y,
      });
    }
  );

  /**
   * Configure Dagre edge control points when requested.
   */
  if (options.useDagreEdgeControlPoints) {
    if (options.automaticDagreEdgeStyle) {
      cy.edges().addClass(
        'useDagreEdgeControlPoints'
      );

      cy.style()
        .selector(
          'edge.useDagreEdgeControlPoints'
        )
        .style(options.dagreEdgeStyle)
        .update();
    }

    g.edges().forEach((id) => {
      const cyEdge = cy.getElementById(
        id.name
      );

      const dEdge = g.edge(id) as DagreEdge;

      if (dEdge && dEdge.points) {
        cyEdge.scratch(
          dagreEdgeToCytoscapeEdge(
            dEdge,
            cyEdge
          )
        );
      }
    });
  }

  // Return the layout instance for Cytoscape chaining.
  return this;
};

export default DagreLayout;

