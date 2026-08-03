//#region node_modules/@dagrejs/dagre/dist/dagre.esm.js
var Re = Object.defineProperty;
var Sn = (e, n, t) => n in e ? Re(e, n, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : e[n] = t;
var Mn = (e, n) => {
	for (var t in n) Re(e, t, {
		get: n[t],
		enumerable: !0
	});
};
var je = (e, n, t) => Sn(e, typeof n != "symbol" ? n + "" : n, t);
var oe = {};
Mn(oe, {
	Graph: () => x,
	alg: () => X,
	json: () => Pe,
	version: () => An
});
var Pn = Object.defineProperty;
var Me = (e, n) => {
	for (var t in n) Pn(e, t, {
		get: n[t],
		enumerable: !0
	});
};
var x = class {
	constructor(e) {
		this._isDirected = !0, this._isMultigraph = !1, this._isCompound = !1, this._nodes = {}, this._in = {}, this._preds = {}, this._out = {}, this._sucs = {}, this._edgeObjs = {}, this._edgeLabels = {}, this._nodeCount = 0, this._edgeCount = 0, this._defaultNodeLabelFn = () => {}, this._defaultEdgeLabelFn = () => {}, e && (this._isDirected = "directed" in e ? e.directed : !0, this._isMultigraph = "multigraph" in e ? e.multigraph : !1, this._isCompound = "compound" in e ? e.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children["\0"] = {});
	}
	isDirected() {
		return this._isDirected;
	}
	isMultigraph() {
		return this._isMultigraph;
	}
	isCompound() {
		return this._isCompound;
	}
	setGraph(e) {
		return this._label = e, this;
	}
	graph() {
		return this._label;
	}
	setDefaultNodeLabel(e) {
		return typeof e != "function" ? this._defaultNodeLabelFn = () => e : this._defaultNodeLabelFn = e, this;
	}
	nodeCount() {
		return this._nodeCount;
	}
	nodes() {
		return Object.keys(this._nodes);
	}
	sources() {
		return this.nodes().filter((e) => Object.keys(this._in[e]).length === 0);
	}
	sinks() {
		return this.nodes().filter((e) => Object.keys(this._out[e]).length === 0);
	}
	setNodes(e, n) {
		return e.forEach((t) => {
			n !== void 0 ? this.setNode(t, n) : this.setNode(t);
		}), this;
	}
	setNode(e, n) {
		return e in this._nodes ? (arguments.length > 1 && (this._nodes[e] = n), this) : (this._nodes[e] = arguments.length > 1 ? n : this._defaultNodeLabelFn(e), this._isCompound && (this._parent[e] = "\0", this._children[e] = {}, this._children["\0"][e] = !0), this._in[e] = {}, this._preds[e] = {}, this._out[e] = {}, this._sucs[e] = {}, ++this._nodeCount, this);
	}
	node(e) {
		return this._nodes[e];
	}
	hasNode(e) {
		return e in this._nodes;
	}
	removeNode(e) {
		if (e in this._nodes) {
			let n = (t) => this.removeEdge(this._edgeObjs[t]);
			delete this._nodes[e], this._isCompound && (this._removeFromParentsChildList(e), delete this._parent[e], this.children(e).forEach((t) => {
				this.setParent(t);
			}), delete this._children[e]), Object.keys(this._in[e]).forEach(n), delete this._in[e], delete this._preds[e], Object.keys(this._out[e]).forEach(n), delete this._out[e], delete this._sucs[e], --this._nodeCount;
		}
		return this;
	}
	setParent(e, n) {
		if (!this._isCompound) throw new Error("Cannot set parent in a non-compound graph");
		if (n === void 0) n = "\0";
		else {
			n += "";
			for (let t = n; t !== void 0; t = this.parent(t)) if (t === e) throw new Error("Setting " + n + " as parent of " + e + " would create a cycle");
			this.setNode(n);
		}
		return this.setNode(e), this._removeFromParentsChildList(e), this._parent[e] = n, this._children[n][e] = !0, this;
	}
	parent(e) {
		if (this._isCompound) {
			let n = this._parent[e];
			if (n !== "\0") return n;
		}
	}
	children(e = "\0") {
		if (this._isCompound) {
			let n = this._children[e];
			if (n) return Object.keys(n);
		} else {
			if (e === "\0") return this.nodes();
			if (this.hasNode(e)) return [];
		}
		return [];
	}
	predecessors(e) {
		let n = this._preds[e];
		if (n) return Object.keys(n);
	}
	successors(e) {
		let n = this._sucs[e];
		if (n) return Object.keys(n);
	}
	neighbors(e) {
		let n = this.predecessors(e);
		if (n) {
			let t = new Set(n);
			for (let r of this.successors(e)) t.add(r);
			return Array.from(t.values());
		}
	}
	isLeaf(e) {
		let n;
		return this.isDirected() ? n = this.successors(e) : n = this.neighbors(e), n.length === 0;
	}
	filterNodes(e) {
		let n = new this.constructor({
			directed: this._isDirected,
			multigraph: this._isMultigraph,
			compound: this._isCompound
		});
		n.setGraph(this.graph()), Object.entries(this._nodes).forEach(([o, i]) => {
			e(o) && n.setNode(o, i);
		}), Object.values(this._edgeObjs).forEach((o) => {
			n.hasNode(o.v) && n.hasNode(o.w) && n.setEdge(o, this.edge(o));
		});
		let t = {}, r = (o) => {
			let i = this.parent(o);
			return !i || n.hasNode(i) ? (t[o] = i != null ? i : void 0, i != null ? i : void 0) : i in t ? t[i] : r(i);
		};
		return this._isCompound && n.nodes().forEach((o) => n.setParent(o, r(o))), n;
	}
	setDefaultEdgeLabel(e) {
		return typeof e != "function" ? this._defaultEdgeLabelFn = () => e : this._defaultEdgeLabelFn = e, this;
	}
	edgeCount() {
		return this._edgeCount;
	}
	edges() {
		return Object.values(this._edgeObjs);
	}
	setPath(e, n) {
		return e.reduce((t, r) => (n !== void 0 ? this.setEdge(t, r, n) : this.setEdge(t, r), r)), this;
	}
	setEdge(e, n, t, r) {
		let o, i, s, a, d = !1;
		typeof e == "object" && e !== null && "v" in e ? (o = e.v, i = e.w, s = e.name, arguments.length === 2 && (a = n, d = !0)) : (o = e, i = n, s = r, arguments.length > 2 && (a = t, d = !0)), o = "" + o, i = "" + i, s !== void 0 && (s = "" + s);
		let l = B(this._isDirected, o, i, s);
		if (l in this._edgeLabels) return d && (this._edgeLabels[l] = a), this;
		if (s !== void 0 && !this._isMultigraph) throw new Error("Cannot set a named edge when isMultigraph = false");
		this.setNode(o), this.setNode(i), this._edgeLabels[l] = d ? a : this._defaultEdgeLabelFn(o, i, s);
		let u = Fn(this._isDirected, o, i, s);
		return o = u.v, i = u.w, Object.freeze(u), this._edgeObjs[l] = u, Ie(this._preds[i], o), Ie(this._sucs[o], i), this._in[i][l] = u, this._out[o][l] = u, this._edgeCount++, this;
	}
	edge(e, n, t) {
		let r = arguments.length === 1 ? re(this._isDirected, e) : B(this._isDirected, e, n, t);
		return this._edgeLabels[r];
	}
	edgeAsObj(e, n, t) {
		let r = arguments.length === 1 ? this.edge(e) : this.edge(e, n, t);
		return typeof r != "object" ? { label: r } : r;
	}
	hasEdge(e, n, t) {
		return (arguments.length === 1 ? re(this._isDirected, e) : B(this._isDirected, e, n, t)) in this._edgeLabels;
	}
	removeEdge(e, n, t) {
		let r = arguments.length === 1 ? re(this._isDirected, e) : B(this._isDirected, e, n, t), o = this._edgeObjs[r];
		if (o) {
			let i = o.v, s = o.w;
			delete this._edgeLabels[r], delete this._edgeObjs[r], Se(this._preds[s], i), Se(this._sucs[i], s), delete this._in[s][r], delete this._out[i][r], this._edgeCount--;
		}
		return this;
	}
	inEdges(e, n) {
		return this.isDirected() ? this.filterEdges(this._in[e], e, n) : this.nodeEdges(e, n);
	}
	outEdges(e, n) {
		return this.isDirected() ? this.filterEdges(this._out[e], e, n) : this.nodeEdges(e, n);
	}
	nodeEdges(e, n) {
		if (e in this._nodes) return this.filterEdges({
			...this._in[e],
			...this._out[e]
		}, e, n);
	}
	_removeFromParentsChildList(e) {
		delete this._children[this._parent[e]][e];
	}
	filterEdges(e, n, t) {
		if (!e) return;
		let r = Object.values(e);
		return t ? r.filter((o) => o.v === n && o.w === t || o.v === t && o.w === n) : r;
	}
};
function Ie(e, n) {
	e[n] ? e[n]++ : e[n] = 1;
}
function Se(e, n) {
	e[n] !== void 0 && !--e[n] && delete e[n];
}
function B(e, n, t, r) {
	let o = "" + n, i = "" + t;
	if (!e && o > i) {
		let s = o;
		o = i, i = s;
	}
	return o + "" + i + "" + (r === void 0 ? "\0" : r);
}
function Fn(e, n, t, r) {
	let o = "" + n, i = "" + t;
	if (!e && o > i) {
		let a = o;
		o = i, i = a;
	}
	let s = {
		v: o,
		w: i
	};
	return r && (s.name = r), s;
}
function re(e, n) {
	return B(e, n.v, n.w, n.name);
}
var An = "4.0.1";
var Pe = {};
Me(Pe, {
	read: () => Wn,
	write: () => Vn
});
function Vn(e) {
	let n = {
		options: {
			directed: e.isDirected(),
			multigraph: e.isMultigraph(),
			compound: e.isCompound()
		},
		nodes: Dn(e),
		edges: Yn(e)
	}, t = e.graph();
	return t !== void 0 && (n.value = structuredClone(t)), n;
}
function Dn(e) {
	return e.nodes().map((n) => {
		let t = e.node(n), r = e.parent(n), o = { v: n };
		return t !== void 0 && (o.value = t), r !== void 0 && (o.parent = r), o;
	});
}
function Yn(e) {
	return e.edges().map((n) => {
		let t = e.edge(n), r = {
			v: n.v,
			w: n.w
		};
		return n.name !== void 0 && (r.name = n.name), t !== void 0 && (r.value = t), r;
	});
}
function Wn(e) {
	let n = new x(e.options);
	return e.value !== void 0 && n.setGraph(e.value), e.nodes.forEach((t) => {
		n.setNode(t.v, t.value), t.parent && n.setParent(t.v, t.parent);
	}), e.edges.forEach((t) => {
		n.setEdge({
			v: t.v,
			w: t.w,
			name: t.name
		}, t.value);
	}), n;
}
var X = {};
Me(X, {
	CycleException: () => J,
	bellmanFord: () => Fe,
	components: () => zn,
	dijkstra: () => U,
	dijkstraAll: () => $n,
	findCycles: () => Un,
	floydWarshall: () => Kn,
	isAcyclic: () => Zn,
	postorder: () => nt,
	preorder: () => tt,
	prim: () => rt,
	shortestPaths: () => ot,
	tarjan: () => Ve,
	topsort: () => De
});
var Bn = () => 1;
function Fe(e, n, t, r) {
	return Xn(e, String(n), t || Bn, r || function(o) {
		return e.outEdges(o);
	});
}
function Xn(e, n, t, r) {
	let o = {}, i, s = 0, a = e.nodes(), d = function(c) {
		let f = t(c);
		o[c.v].distance + f < o[c.w].distance && (o[c.w] = {
			distance: o[c.v].distance + f,
			predecessor: c.v
		}, i = !0);
	}, l = function() {
		a.forEach(function(c) {
			r(c).forEach(function(f) {
				let b = f.v === c ? f.v : f.w, m = b === f.v ? f.w : f.v;
				d({
					v: b,
					w: m
				});
			});
		});
	};
	a.forEach(function(c) {
		let f = c === n ? 0 : Number.POSITIVE_INFINITY;
		o[c] = {
			distance: f,
			predecessor: ""
		};
	});
	let u = a.length;
	for (let c = 1; c < u && (i = !1, s++, l(), !!i); c++);
	if (s === u - 1 && (i = !1, l(), i)) throw new Error("The graph contains a negative weight cycle");
	return o;
}
function zn(e) {
	let n = {}, t = [], r;
	function o(i) {
		i in n || (n[i] = !0, r.push(i), e.successors(i).forEach(o), e.predecessors(i).forEach(o));
	}
	return e.nodes().forEach(function(i) {
		r = [], o(i), r.length && t.push(r);
	}), t;
}
var Ae = class {
	constructor() {
		this._arr = [], this._keyIndices = {};
	}
	size() {
		return this._arr.length;
	}
	keys() {
		return this._arr.map((e) => e.key);
	}
	has(e) {
		return e in this._keyIndices;
	}
	priority(e) {
		let n = this._keyIndices[e];
		if (n !== void 0) return this._arr[n].priority;
	}
	min() {
		if (this.size() === 0) throw new Error("Queue underflow");
		return this._arr[0].key;
	}
	add(e, n) {
		let t = this._keyIndices, r = String(e);
		if (!(r in t)) {
			let o = this._arr, i = o.length;
			return t[r] = i, o.push({
				key: r,
				priority: n
			}), this._decrease(i), !0;
		}
		return !1;
	}
	removeMin() {
		this._swap(0, this._arr.length - 1);
		let e = this._arr.pop();
		return delete this._keyIndices[e.key], this._heapify(0), e.key;
	}
	decrease(e, n) {
		let t = this._keyIndices[e];
		if (t === void 0) throw new Error(`Key not found: ${e}`);
		let r = this._arr[t].priority;
		if (n > r) throw new Error(`New priority is greater than current priority. Key: ${e} Old: ${r} New: ${n}`);
		this._arr[t].priority = n, this._decrease(t);
	}
	_heapify(e) {
		let n = this._arr, t = 2 * e, r = t + 1, o = e;
		t < n.length && (o = n[t].priority < n[o].priority ? t : o, r < n.length && (o = n[r].priority < n[o].priority ? r : o), o !== e && (this._swap(e, o), this._heapify(o)));
	}
	_decrease(e) {
		let n = this._arr, t = n[e].priority, r;
		for (; e !== 0 && (r = e >> 1, !(n[r].priority < t));) this._swap(e, r), e = r;
	}
	_swap(e, n) {
		let t = this._arr, r = this._keyIndices, o = t[e], i = t[n];
		t[e] = i, t[n] = o, r[i.key] = e, r[o.key] = n;
	}
};
var Hn = () => 1;
function U(e, n, t, r) {
	let o = function(i) {
		return e.outEdges(i);
	};
	return qn(e, String(n), t || Hn, r || o);
}
function qn(e, n, t, r) {
	let o = {}, i = new Ae(), s, a, d = function(l) {
		let u = l.v !== s ? l.v : l.w, c = o[u], f = t(l), b = a.distance + f;
		if (f < 0) throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + l + " Weight: " + f);
		b < c.distance && (c.distance = b, c.predecessor = s, i.decrease(u, b));
	};
	for (e.nodes().forEach(function(l) {
		let u = l === n ? 0 : Number.POSITIVE_INFINITY;
		o[l] = {
			distance: u,
			predecessor: ""
		}, i.add(l, u);
	}); i.size() > 0 && (s = i.removeMin(), a = o[s], a.distance !== Number.POSITIVE_INFINITY);) r(s).forEach(d);
	return o;
}
function $n(e, n, t) {
	return e.nodes().reduce(function(r, o) {
		return r[o] = U(e, o, n, t), r;
	}, {});
}
function Ve(e) {
	let n = 0, t = [], r = {}, o = [];
	function i(s) {
		let a = r[s] = {
			onStack: !0,
			lowlink: n,
			index: n++
		};
		if (t.push(s), e.successors(s).forEach(function(d) {
			d in r ? r[d].onStack && (a.lowlink = Math.min(a.lowlink, r[d].index)) : (i(d), a.lowlink = Math.min(a.lowlink, r[d].lowlink));
		}), a.lowlink === a.index) {
			let d = [], l;
			do
				l = t.pop(), r[l].onStack = !1, d.push(l);
			while (s !== l);
			o.push(d);
		}
	}
	return e.nodes().forEach(function(s) {
		s in r || i(s);
	}), o;
}
function Un(e) {
	return Ve(e).filter(function(n) {
		return n.length > 1 || n.length === 1 && e.hasEdge(n[0], n[0]);
	});
}
var Jn = () => 1;
function Kn(e, n, t) {
	return Qn(e, n || Jn, t || function(r) {
		return e.outEdges(r);
	});
}
function Qn(e, n, t) {
	let r = {}, o = e.nodes();
	return o.forEach(function(i) {
		r[i] = {}, r[i][i] = {
			distance: 0,
			predecessor: ""
		}, o.forEach(function(s) {
			i !== s && (r[i][s] = {
				distance: Number.POSITIVE_INFINITY,
				predecessor: ""
			});
		}), t(i).forEach(function(s) {
			let a = s.v === i ? s.w : s.v, d = n(s);
			r[i][a] = {
				distance: d,
				predecessor: i
			};
		});
	}), o.forEach(function(i) {
		let s = r[i];
		o.forEach(function(a) {
			let d = r[a];
			o.forEach(function(l) {
				let u = d[i], c = s[l], f = d[l], b = u.distance + c.distance;
				b < f.distance && (f.distance = b, f.predecessor = c.predecessor);
			});
		});
	}), r;
}
var J = class extends Error {
	constructor(...e) {
		super(...e);
	}
};
function De(e) {
	let n = {}, t = {}, r = [];
	function o(i) {
		if (i in t) throw new J();
		i in n || (t[i] = !0, n[i] = !0, e.predecessors(i).forEach(o), delete t[i], r.push(i));
	}
	if (e.sinks().forEach(o), Object.keys(n).length !== e.nodeCount()) throw new J();
	return r;
}
function Zn(e) {
	try {
		De(e);
	} catch (n) {
		if (n instanceof J) return !1;
		throw n;
	}
	return !0;
}
function et(e, n, t, r, o) {
	Array.isArray(n) || (n = [n]);
	let i = ((a) => {
		var d;
		return (d = e.isDirected() ? e.successors(a) : e.neighbors(a)) != null ? d : [];
	}), s = {};
	return n.forEach(function(a) {
		if (!e.hasNode(a)) throw new Error("Graph does not have node: " + a);
		o = Ye(e, a, t === "post", s, i, r, o);
	}), o;
}
function Ye(e, n, t, r, o, i, s) {
	return n in r || (r[n] = !0, t || (s = i(s, n)), o(n).forEach(function(a) {
		s = Ye(e, a, t, r, o, i, s);
	}), t && (s = i(s, n))), s;
}
function We(e, n, t) {
	return et(e, n, t, function(r, o) {
		return r.push(o), r;
	}, []);
}
function nt(e, n) {
	return We(e, n, "post");
}
function tt(e, n) {
	return We(e, n, "pre");
}
function rt(e, n) {
	let t = new x(), r = {}, o = new Ae(), i;
	function s(d) {
		let l = d.v === i ? d.w : d.v, u = o.priority(l);
		if (u !== void 0) {
			let c = n(d);
			c < u && (r[l] = i, o.decrease(l, c));
		}
	}
	if (e.nodeCount() === 0) return t;
	e.nodes().forEach(function(d) {
		o.add(d, Number.POSITIVE_INFINITY), t.setNode(d);
	}), o.decrease(e.nodes()[0], 0);
	let a = !1;
	for (; o.size() > 0;) {
		if (i = o.removeMin(), i in r) t.setEdge(i, r[i]);
		else {
			if (a) throw new Error("Input graph is not connected: " + e);
			a = !0;
		}
		e.nodeEdges(i).forEach(s);
	}
	return t;
}
function ot(e, n, t, r) {
	return it(e, n, t, r != null ? r : ((o) => {
		let i = e.outEdges(o);
		return i != null ? i : [];
	}));
}
function it(e, n, t, r) {
	if (t === void 0) return U(e, n, t, r);
	let o = !1, i = e.nodes();
	for (let s = 0; s < i.length; s++) {
		let a = r(i[s]);
		for (let d = 0; d < a.length; d++) {
			let l = a[d], u = l.v === i[s] ? l.v : l.w;
			t({
				v: u,
				w: u === l.v ? l.w : l.v
			}) < 0 && (o = !0);
		}
		if (o) return Fe(e, n, t, r);
	}
	return U(e, n, t, r);
}
function I(e, n, t, r) {
	let o = r;
	for (; e.hasNode(o);) o = H(r);
	return t.dummy = n, e.setNode(o, t), o;
}
function Be(e) {
	let n = new x().setGraph(e.graph());
	return e.nodes().forEach((t) => n.setNode(t, e.node(t))), e.edges().forEach((t) => {
		let r = n.edge(t.v, t.w) || {
			weight: 0,
			minlen: 1
		}, o = e.edge(t);
		n.setEdge(t.v, t.w, {
			weight: r.weight + o.weight,
			minlen: Math.max(r.minlen, o.minlen)
		});
	}), n;
}
function K(e) {
	let n = new x({ multigraph: e.isMultigraph() }).setGraph(e.graph());
	return e.nodes().forEach((t) => {
		e.children(t).length || n.setNode(t, e.node(t));
	}), e.edges().forEach((t) => {
		n.setEdge(t, e.edge(t));
	}), n;
}
function ie(e, n) {
	let t = e.x, r = e.y, o = n.x - t, i = n.y - r, s = e.width / 2, a = e.height / 2;
	if (!o && !i) throw new Error("Not possible to find intersection inside of the rectangle");
	let d, l;
	return Math.abs(i) * s > Math.abs(o) * a ? (i < 0 && (a = -a), d = a * o / i, l = a) : (o < 0 && (s = -s), d = s, l = s * i / o), {
		x: t + d,
		y: r + l
	};
}
function S(e) {
	let n = P(ae(e) + 1).map(() => []);
	return e.nodes().forEach((t) => {
		let r = e.node(t), o = r.rank;
		o !== void 0 && (n[o] || (n[o] = []), n[o][r.order] = t);
	}), n;
}
function Xe(e) {
	let n = e.nodes().map((r) => {
		let o = e.node(r).rank;
		return o === void 0 ? Number.MAX_VALUE : o;
	}), t = O(Math.min, n);
	e.nodes().forEach((r) => {
		let o = e.node(r);
		Object.hasOwn(o, "rank") && (o.rank -= t);
	});
}
function ze(e) {
	let n = e.nodes().map((s) => e.node(s).rank).filter((s) => s !== void 0), t = O(Math.min, n), r = [];
	e.nodes().forEach((s) => {
		let a = e.node(s).rank - t;
		r[a] || (r[a] = []), r[a].push(s);
	});
	let o = 0, i = e.graph().nodeRankFactor;
	Array.from(r).forEach((s, a) => {
		s === void 0 && a % i !== 0 ? --o : s !== void 0 && o && s.forEach((d) => e.node(d).rank += o);
	});
}
function se(e, n, t, r) {
	let o = {
		width: 0,
		height: 0
	};
	return arguments.length >= 4 && (o.rank = t, o.order = r), I(e, "border", o, n);
}
function st(e, n = He) {
	let t = [];
	for (let r = 0; r < e.length; r += n) {
		let o = e.slice(r, r + n);
		t.push(o);
	}
	return t;
}
var He = 65535;
function O(e, n) {
	if (n.length > He) return e(...st(n).map((r) => e(...r)));
	else return e(...n);
}
function ae(e) {
	let t = e.nodes().map((r) => {
		let o = e.node(r).rank;
		return o === void 0 ? Number.MIN_VALUE : o;
	});
	return O(Math.max, t);
}
function qe(e, n) {
	let t = {
		lhs: [],
		rhs: []
	};
	return e.forEach((r) => {
		n(r) ? t.lhs.push(r) : t.rhs.push(r);
	}), t;
}
function de(e, n) {
	let t = Date.now();
	try {
		return n();
	} finally {
		console.log(e + " time: " + (Date.now() - t) + "ms");
	}
}
function z(e, n) {
	return n();
}
var at = 0;
function H(e) {
	return e + ("" + ++at);
}
function P(e, n, t = 1) {
	n ?? (n = e, e = 0);
	let r = (i) => i < n;
	t < 0 && (r = (i) => n < i);
	let o = [];
	for (let i = e; r(i); i += t) o.push(i);
	return o;
}
function Y(e, n) {
	let t = {};
	for (let r of n) e[r] !== void 0 && (t[r] = e[r]);
	return t;
}
function W(e, n) {
	let t;
	return typeof n == "string" ? t = (r) => r[n] : t = n, Object.entries(e).reduce((r, [o, i]) => (r[o] = t(i, o), r), {});
}
function $e(e, n) {
	return e.reduce((t, r, o) => (t[r] = n[o], t), {});
}
var V = "\0";
function Q(e, n, t) {
	var l, u, c, f, b, m;
	if (!(e && n && t && n.dummy === "edge" && t.dummy === "edge" && n.edgeObj && t.edgeObj && e[n.edgeObj.v] && e[t.edgeObj.v] && e[n.edgeObj.w] && e[t.edgeObj.w])) return 0;
	let r = !0;
	n.edgeObj.w === t.edgeObj.w && (r = !1);
	let o = r ? (u = (l = e[n.edgeObj.v]) == null ? void 0 : l.rank) != null ? u : NaN : (f = (c = e[n.edgeObj.w]) == null ? void 0 : c.rank) != null ? f : NaN, i = Object.entries(e).find((E) => {
		var h, g;
		return ((h = E[1].edgeObj) == null ? void 0 : h.v) === n.edgeObj.v && ((g = E[1].edgeObj) == null ? void 0 : g.w) === n.edgeObj.w && E[1].rank === o;
	}), s = Object.entries(e).find((E) => {
		var h, g;
		return ((h = E[1].edgeObj) == null ? void 0 : h.v) === t.edgeObj.v && ((g = E[1].edgeObj) == null ? void 0 : g.w) === t.edgeObj.w && E[1].rank === o;
	});
	if (!i || !s) return 0;
	let a = (b = i[1].order) != null ? b : NaN, d = (m = s[1].order) != null ? m : NaN;
	return isNaN(a - d) ? 0 : a - d;
}
var le = "3.1.0";
var ue = class {
	constructor() {
		je(this, "_sentinel");
		let n = {};
		n._next = n._prev = n, this._sentinel = n;
	}
	dequeue() {
		let n = this._sentinel, t = n._prev;
		if (t !== n) return Ue(t), t;
	}
	enqueue(n) {
		let t = this._sentinel;
		n._prev && n._next && Ue(n), n._next = t._next, t._next._prev = n, t._next = n, n._prev = t;
	}
	toString() {
		let n = [], t = this._sentinel, r = t._prev;
		for (; r !== t;) n.push(JSON.stringify(r, dt)), r = r._prev;
		return "[" + n.join(", ") + "]";
	}
};
function Ue(e) {
	e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function dt(e, n) {
	if (e !== "_next" && e !== "_prev") return n;
}
var Je = ue;
var lt = () => 1;
function be(e, n) {
	if (e.nodeCount() <= 1) return [];
	let t = ct(e, n || lt);
	return ut(t.graph, t.buckets, t.zeroIdx).flatMap((o) => e.outEdges(o.v, o.w) || []);
}
function ut(e, n, t) {
	var a;
	let r = [], o = n[n.length - 1], i = n[0], s;
	for (; e.nodeCount();) {
		for (; s = i.dequeue();) ce(e, n, t, s);
		for (; s = o.dequeue();) ce(e, n, t, s);
		if (e.nodeCount()) {
			for (let d = n.length - 2; d > 0; --d) if (s = (a = n[d]) == null ? void 0 : a.dequeue(), s) {
				r = r.concat(ce(e, n, t, s, !0) || []);
				break;
			}
		}
	}
	return r;
}
function ce(e, n, t, r, o) {
	let i = [], s = o ? i : void 0;
	return (e.inEdges(r.v) || []).forEach((a) => {
		let d = e.edge(a), l = e.node(a.v);
		o && i.push({
			v: a.v,
			w: a.w
		}), l.out -= d, fe(n, t, l);
	}), (e.outEdges(r.v) || []).forEach((a) => {
		let d = e.edge(a), l = a.w, u = e.node(l);
		u.in -= d, fe(n, t, u);
	}), e.removeNode(r.v), s;
}
function ct(e, n) {
	let t = new x(), r = 0, o = 0;
	e.nodes().forEach((a) => {
		t.setNode(a, {
			v: a,
			in: 0,
			out: 0
		});
	}), e.edges().forEach((a) => {
		let d = t.edge(a.v, a.w) || 0, l = n(a), u = d + l;
		t.setEdge(a.v, a.w, u);
		let c = t.node(a.v), f = t.node(a.w);
		o = Math.max(o, c.out += l), r = Math.max(r, f.in += l);
	});
	let i = ft(o + r + 3).map(() => new Je()), s = r + 1;
	return t.nodes().forEach((a) => {
		fe(i, s, t.node(a));
	}), {
		graph: t,
		buckets: i,
		zeroIdx: s
	};
}
function fe(e, n, t) {
	var r, o, i;
	t.out ? t.in ? (i = e[t.out - t.in + n]) == null || i.enqueue(t) : (o = e[e.length - 1]) == null || o.enqueue(t) : (r = e[0]) == null || r.enqueue(t);
}
function ft(e) {
	let n = [];
	for (let t = 0; t < e; t++) n.push(t);
	return n;
}
function Ke(e, n) {
	(e.graph().acyclicer === "greedy" ? be(e, r(e)) : bt(e, n != null ? n : null)).forEach((o) => {
		let i = e.edge(o);
		e.removeEdge(o), i.forwardName = o.name, i.reversed = !0, e.setEdge(o.w, o.v, i, H("rev"));
	});
	function r(o) {
		return (i) => o.edge(i).weight;
	}
}
function bt(e, n) {
	let t = [], r = {}, o = {};
	function i(d) {
		Object.hasOwn(o, d) || (o[d] = !0, r[d] = !0, e.outEdges(d).forEach((l) => {
			Object.hasOwn(r, l.w) ? t.push(l) : i(l.w);
		}), delete r[d]);
	}
	function s(d) {
		var l;
		Object.hasOwn(o, d) || (o[d] = !0, r[d] = !0, (l = e.outEdges(d)) == null || l.forEach((u) => {
			var c, f;
			Object.hasOwn(r, u.w) || ((c = n.node(d)) == null ? void 0 : c.rank) > ((f = n.node(u.w)) == null ? void 0 : f.rank) && ht(e, u.w, u) ? t.push(u) : s(u.w);
		}), delete r[d]);
	}
	let a = i;
	return n && typeof n.node == "function" && (a = s), e.sources().forEach(a), e.nodes().forEach(a), t;
}
function Qe(e) {
	e.edges().forEach((n) => {
		let t = e.edge(n);
		if (t.reversed) {
			e.removeEdge(n);
			let r = t.forwardName;
			delete t.reversed, delete t.forwardName, e.setEdge(n.w, n.v, t, r);
		}
	});
}
function ht(e, n, t) {
	let r = /* @__PURE__ */ new Set();
	function o(i) {
		var s;
		if (e.sources().includes(i)) return !0;
		r.add(i);
		for (let a of (s = e.inEdges(i)) != null ? s : []) if (!(a.v === t.v && a.w === t.w) && !r.has(a.v) && o(a.v)) return !0;
		return !1;
	}
	return o(n);
}
function Ze(e) {
	e.graph().dummyChains = [], e.edges().forEach((n) => pt(e, n));
}
function pt(e, n) {
	let t = n.v, r = e.node(t).rank, o = n.w, i = e.node(o).rank, s = n.name, a = e.edge(n), d = a.labelRank;
	if (i === r + 1) return;
	e.removeEdge(n);
	let l, u, c;
	for (c = 0, ++r; r < i; ++c, ++r) a.points = [], u = {
		width: 0,
		height: 0,
		edgeLabel: a,
		edgeObj: n,
		rank: r
	}, l = I(e, "edge", u, "_d"), r === d && (u.width = a.width, u.height = a.height, u.dummy = "edge-label", u.labelpos = a.labelpos), e.setEdge(t, l, { weight: a.weight }, s), c === 0 && e.graph().dummyChains.push(l), t = l;
	e.setEdge(t, o, { weight: a.weight }, s);
}
function en(e) {
	e.graph().dummyChains.forEach((n) => {
		let t = e.node(n), r = t.edgeLabel, o;
		for (e.setEdge(t.edgeObj, r); t.dummy;) o = e.successors(n)[0], e.removeNode(n), r.points.push({
			x: t.x,
			y: t.y
		}), t.dummy === "edge-label" && (r.x = t.x, r.y = t.y, r.width = t.width, r.height = t.height), n = o, t = e.node(n);
	});
}
function q(e) {
	let n = {};
	function t(r) {
		let o = e.node(r);
		if (Object.hasOwn(n, r)) return o.rank;
		n[r] = !0;
		let i = e.outEdges(r), s = i ? i.map((d) => d == null ? Number.POSITIVE_INFINITY : t(d.w) - e.edge(d).minlen) : [], a = O(Math.min, s);
		return a === Number.POSITIVE_INFINITY && (a = 0), o.rank = a;
	}
	e.sources().forEach(t);
}
function F(e, n) {
	return e.node(n.w).rank - e.node(n.v).rank - e.edge(n).minlen;
}
var Z = Et;
function Et(e) {
	let n = new x({ directed: !1 }), t = e.nodes();
	if (t.length === 0) throw new Error("Graph must have at least one node");
	let r = t[0], o = e.nodeCount();
	n.setNode(r, {});
	let i, s;
	for (; Lt(n, e) < o && (i = yt(n, e), !!i);) s = n.hasNode(i.v) ? F(e, i) : -F(e, i), wt(n, e, s);
	return n;
}
function Lt(e, n) {
	function t(r) {
		let o = n.nodeEdges(r);
		o && o.forEach((i) => {
			let s = i.v, a = r === s ? i.w : s;
			!e.hasNode(a) && !F(n, i) && (e.setNode(a, {}), e.setEdge(r, a, {}), t(a));
		});
	}
	return e.nodes().forEach(t), e.nodeCount();
}
function yt(e, n) {
	return n.edges().reduce((r, o) => {
		let i = Number.POSITIVE_INFINITY;
		return e.hasNode(o.v) !== e.hasNode(o.w) && (i = F(n, o)), i < r[0] ? [i, o] : r;
	}, [Number.POSITIVE_INFINITY, null])[1];
}
function wt(e, n, t) {
	e.nodes().forEach((r) => n.node(r).rank += t);
}
var { preorder: Nt, postorder: Gt } = X, tn = D;
D.initLowLimValues = ge;
D.initCutValues = he;
D.calcCutValue = rn;
D.leaveEdge = sn;
D.enterEdge = an;
D.exchangeEdges = dn;
function D(e) {
	e = Be(e), q(e);
	let n = Z(e);
	ge(n), he(n, e);
	let t, r;
	for (; t = sn(n);) r = an(n, e, t), dn(n, e, t, r);
}
function he(e, n) {
	let t = Gt(e, e.nodes());
	t = t.slice(0, t.length - 1), t.forEach((r) => vt(e, n, r));
}
function vt(e, n, t) {
	let o = e.node(t).parent, i = e.edge(t, o);
	i.cutvalue = rn(e, n, t);
}
function rn(e, n, t) {
	let o = e.node(t).parent, i = !0, s = n.edge(t, o), a = 0;
	s || (i = !1, s = n.edge(o, t)), a = s.weight;
	let d = n.nodeEdges(t);
	return d && d.forEach((l) => {
		let u = l.v === t, c = u ? l.w : l.v;
		if (c !== o) {
			let f = u === i, b = n.edge(l).weight;
			if (a += f ? b : -b, xt(e, t, c)) {
				let E = e.edge(t, c).cutvalue;
				a += f ? -E : E;
			}
		}
	}), a;
}
function ge(e, n) {
	arguments.length < 2 && (n = e.nodes()[0]), on(e, {}, 1, n);
}
function on(e, n, t, r, o) {
	let i = t, s = e.node(r);
	n[r] = !0;
	let a = e.neighbors(r);
	return a && a.forEach((d) => {
		Object.hasOwn(n, d) || (t = on(e, n, t, d, r));
	}), s.low = i, s.lim = t++, o ? s.parent = o : delete s.parent, t;
}
function sn(e) {
	return e.edges().find((n) => e.edge(n).cutvalue < 0);
}
function an(e, n, t) {
	let r = t.v, o = t.w;
	n.hasEdge(r, o) || (r = t.w, o = t.v);
	let i = e.node(r), s = e.node(o), a = i, d = !1;
	return i.lim > s.lim && (a = s, d = !0), n.edges().filter((u) => d === nn(e, e.node(u.v), a) && d !== nn(e, e.node(u.w), a)).reduce((u, c) => F(n, c) < F(n, u) ? c : u);
}
function dn(e, n, t, r) {
	let o = t.v, i = t.w;
	e.removeEdge(o, i), e.setEdge(r.v, r.w, {}), ge(e), he(e, n), kt(e, n);
}
function kt(e, n) {
	let t = e.nodes().find((o) => !e.node(o).parent);
	if (!t) return;
	let r = Nt(e, [t]);
	r = r.slice(1), r.forEach((o) => {
		let s = e.node(o).parent, a = n.edge(o, s), d = !1;
		a || (a = n.edge(s, o), d = !0), n.node(o).rank = n.node(s).rank + (d ? a.minlen : -a.minlen);
	});
}
function xt(e, n, t) {
	return e.hasEdge(n, t);
}
function nn(e, n, t) {
	return t.low <= n.lim && n.lim <= t.lim;
}
var un = _t;
function _t(e) {
	let n = e.graph().ranker;
	if (typeof n == "function") return n(e);
	switch (n) {
		case "network-simplex":
			ln(e);
			break;
		case "tight-tree":
			Ct(e);
			break;
		case "longest-path":
			Ot(e);
			break;
		case "none": break;
		default: ln(e);
	}
}
var Ot = q;
function Ct(e) {
	q(e), Z(e);
}
function ln(e) {
	tn(e);
}
var cn = Tt;
function Tt(e) {
	let n = jt(e), t = e.graph();
	if (!Array.isArray(t.dummyChains)) return;
	t.dummyChains.forEach((o) => {
		let i = e.node(o), s = i.edgeObj, a = Rt(e, n, s.v, s.w), d = a.path, l = a.lca, u = 0, c = d[u], f = !0;
		for (; o !== s.w;) {
			if (i = e.node(o), f) {
				for (; (c = d[u]) !== l && e.node(c).maxRank < i.rank;) u++;
				c === l && (f = !1);
			}
			if (!f) {
				for (; u < d.length - 1 && e.node(d[u + 1]).minRank <= i.rank;) u++;
				c = d[u];
			}
			c !== void 0 && e.setParent(o, c), o = e.successors(o)[0];
		}
	});
}
function Rt(e, n, t, r) {
	let o = [], i = [], s = Math.min(n[t].low, n[r].low), a = Math.max(n[t].lim, n[r].lim), d;
	d = t;
	do
		d = e.parent(d), o.push(d);
	while (d && (n[d].low > s || a > n[d].lim));
	let l = d, u = r;
	for (; (u = e.parent(u)) !== l;) i.push(u);
	return {
		path: o.concat(i.reverse()),
		lca: l
	};
}
function jt(e) {
	let n = {}, t = 0;
	function r(o) {
		let i = t;
		e.children(o).forEach(r), n[o] = {
			low: i,
			lim: t++
		};
	}
	return e.children(V).forEach(r), n;
}
function fn(e) {
	let n = I(e, "root", {}, "_root"), t = It(e), r = Object.values(t), o = O(Math.max, r) - 1, i = 2 * o + 1;
	e.graph().nestingRoot = n, e.edges().forEach((a) => e.edge(a).minlen *= i);
	let s = St(e) + 1;
	e.children(V).forEach((a) => {
		bn(e, n, i, s, o, t, a);
	}), e.graph().nodeRankFactor = i;
}
function bn(e, n, t, r, o, i, s) {
	var c;
	let a = e.children(s);
	if (!a.length) {
		s !== n && e.setEdge(n, s, {
			weight: 0,
			minlen: t
		});
		return;
	}
	let d = se(e, "_bt"), l = se(e, "_bb"), u = e.node(s);
	e.setParent(d, s), u.borderTop = d, e.setParent(l, s), u.borderBottom = l, a.forEach((f) => {
		var p;
		bn(e, n, t, r, o, i, f);
		let b = e.node(f), m = b.borderTop ? b.borderTop : f, E = b.borderBottom ? b.borderBottom : f, h = b.borderTop ? r : 2 * r, g = m !== E ? 1 : o - ((p = i[s]) != null ? p : 0) + 1;
		e.setEdge(d, m, {
			weight: h,
			minlen: g,
			nestingEdge: !0
		}), e.setEdge(E, l, {
			weight: h,
			minlen: g,
			nestingEdge: !0
		});
	}), e.parent(s) || e.setEdge(n, d, {
		weight: 0,
		minlen: o + ((c = i[s]) != null ? c : 0)
	});
}
function It(e) {
	let n = {};
	function t(r, o) {
		let i = e.children(r);
		i && i.length && i.forEach((s) => t(s, o + 1)), n[r] = o;
	}
	return e.children(V).forEach((r) => t(r, 1)), n;
}
function St(e) {
	return e.edges().reduce((n, t) => n + e.edge(t).weight, 0);
}
function hn(e) {
	let n = e.graph();
	e.removeNode(n.nestingRoot), delete n.nestingRoot, e.edges().forEach((t) => {
		e.edge(t).nestingEdge && e.removeEdge(t);
	});
}
var pn = Pt;
function Pt(e) {
	function n(t) {
		let r = e.children(t), o = e.node(t);
		if (r.length && r.forEach(n), o && Object.hasOwn(o, "minRank")) {
			o.borderLeft = [], o.borderRight = [];
			for (let i = o.minRank, s = o.maxRank + 1; i < s; ++i) gn(e, "borderLeft", "_bl", t, o, i), gn(e, "borderRight", "_br", t, o, i);
		}
	}
	e.children(V).forEach(n);
}
function gn(e, n, t, r, o, i) {
	let s = {
		width: 0,
		height: 0,
		rank: i,
		borderType: n
	}, a = o[n][i - 1], d = I(e, "border", s, t);
	o[n][i] = d, e.setParent(d, r), a && e.setEdge(a, d, { weight: 1 });
}
function En(e) {
	var t;
	let n = (t = e.graph().rankdir) == null ? void 0 : t.toLowerCase();
	(n === "lr" || n === "rl") && yn(e);
}
function Ln(e) {
	var t;
	let n = (t = e.graph().rankdir) == null ? void 0 : t.toLowerCase();
	(n === "bt" || n === "rl") && Ft(e), (n === "lr" || n === "rl") && (At(e), yn(e));
}
function yn(e) {
	e.nodes().forEach((n) => mn(e.node(n))), e.edges().forEach((n) => mn(e.edge(n)));
}
function mn(e) {
	let n = e.width;
	e.width = e.height, e.height = n;
}
function Ft(e) {
	e.nodes().forEach((n) => pe(e.node(n))), e.edges().forEach((n) => {
		var r;
		let t = e.edge(n);
		(r = t.points) == null || r.forEach(pe), Object.hasOwn(t, "y") && pe(t);
	});
}
function pe(e) {
	e.y = -e.y;
}
function At(e) {
	e.nodes().forEach((n) => me(e.node(n))), e.edges().forEach((n) => {
		var r;
		let t = e.edge(n);
		(r = t.points) == null || r.forEach(me), Object.hasOwn(t, "x") && me(t);
	});
}
function me(e) {
	let n = e.x;
	e.x = e.y, e.y = n;
}
function Ee(e, n = null) {
	let t = {}, r = e.nodes().filter((u) => !e.children(u).length), o = r.map((u) => e.node(u).rank), s = P(O(Math.max, o) + 1).map(() => []);
	function a(u) {
		if (t[u]) return;
		t[u] = !0;
		let c = e.node(u);
		s[c.rank].push(u);
		let f = e.successors(u);
		f && [...f].sort((m, E) => l(m, E)).forEach(a);
	}
	r.sort((u, c) => e.node(u).rank - e.node(c).rank).forEach(a);
	function l(u, c) {
		return Q(n, e.node(u), e.node(c));
	}
	return s;
}
function Le(e, n) {
	let t = 0;
	for (let r = 1; r < n.length; ++r) t += Dt(e, n[r - 1], n[r]);
	return t;
}
function Dt(e, n, t) {
	let r = $e(t, t.map((l, u) => u)), o = n.flatMap((l) => {
		let u = e.outEdges(l);
		return u ? u.map((c) => ({
			pos: r[c.w],
			weight: e.edge(c).weight
		})).sort((c, f) => c.pos - f.pos) : [];
	}), i = 1;
	for (; i < t.length;) i <<= 1;
	let s = 2 * i - 1;
	i -= 1;
	let a = new Array(s).fill(0), d = 0;
	return o.forEach((l) => {
		let u = l.pos + i;
		a[u] += l.weight;
		let c = 0;
		for (; u > 0;) u % 2 && (c += a[u + 1]), u = u - 1 >> 1, a[u] += l.weight;
		d += l.weight * c;
	}), d;
}
function ye(e, n = []) {
	return n.map((t) => {
		let r = e.inEdges(t);
		if (!r || !r.length) return { v: t };
		{
			let o = r.reduce((i, s) => {
				let a = e.edge(s), d = e.node(s.v);
				return {
					sum: i.sum + a.weight * d.order,
					weight: i.weight + a.weight
				};
			}, {
				sum: 0,
				weight: 0
			});
			return {
				v: t,
				barycenter: o.sum / o.weight,
				weight: o.weight
			};
		}
	});
}
function we(e, n) {
	let t = {};
	e.forEach((o, i) => {
		let s = {
			indegree: 0,
			in: [],
			out: [],
			vs: [o.v],
			i
		};
		o.barycenter !== void 0 && (s.barycenter = o.barycenter, s.weight = o.weight), t[o.v] = s;
	}), n.edges().forEach((o) => {
		let i = t[o.v], s = t[o.w];
		i !== void 0 && s !== void 0 && (s.indegree++, i.out.push(s));
	});
	return Yt(Object.values(t).filter((o) => !o.indegree));
}
function Yt(e) {
	let n = [];
	function t(o) {
		return (i) => {
			i.merged || (i.barycenter === void 0 || o.barycenter === void 0 || i.barycenter >= o.barycenter) && Wt(o, i);
		};
	}
	function r(o) {
		return (i) => {
			i.in.push(o), --i.indegree === 0 && e.push(i);
		};
	}
	for (; e.length;) {
		let o = e.pop();
		n.push(o), o.in.reverse().forEach(t(o)), o.out.forEach(r(o));
	}
	return n.filter((o) => !o.merged).map((o) => Y(o, [
		"vs",
		"i",
		"barycenter",
		"weight"
	]));
}
function Wt(e, n) {
	let t = 0, r = 0;
	e.weight && (t += e.barycenter * e.weight, r += e.weight), n.weight && (t += n.barycenter * n.weight, r += n.weight), e.vs = n.vs.concat(e.vs), e.barycenter = t / r, e.weight = r, e.i = Math.min(n.i, e.i), n.merged = !0;
}
function Ne(e, n, t, r, o) {
	let i = {}, s = null, a = null, d = o;
	typeof n == "boolean" ? (d = n, i = {}) : n && (i = n, s = t != null ? t : null, a = r != null ? r : null);
	let l = qe(e, (g) => Object.hasOwn(g, "barycenter")), u = l.lhs, c = l.rhs.sort((g, p) => p.i - g.i), f = [], b = 0, m = 0, E = 0;
	u.sort(Bt(a, s, !!d));
	for (let [g, p] of Object.entries(i)) {
		let w = u.findIndex((v) => v.vs[0] === g);
		u.splice(w + 1, 0, p);
	}
	E = wn(f, c, E), u.forEach((g) => {
		E += g.vs.length, f.push(g.vs), b += g.barycenter * g.weight, m += g.weight, E = wn(f, c, E);
	});
	let h = { vs: f.flat(1) };
	return m && (h.barycenter = b / m, h.weight = m), h;
}
function wn(e, n, t) {
	let r;
	for (; n.length && (r = n[n.length - 1]).i <= t;) n.pop(), e.push(r.vs), t++;
	return t;
}
function Bt(e, n, t) {
	return (r, o) => {
		if (r.barycenter < o.barycenter) return -1;
		if (r.barycenter > o.barycenter) return 1;
		if (e && (typeof r.vs[0] == "string" || typeof o.vs[0] == "string")) {
			let a = Q(n, e.node(r.vs[0]), e.node(o.vs[0]));
			if (a !== 0) return a;
		}
		return t ? o.i - r.i : r.i - o.i;
	};
}
function ee(e, n, t, r, o) {
	var g, p, w, v, N, G, _, C, T, j, R;
	let i = null, s = o;
	typeof r == "boolean" ? (s = r, i = null) : r !== void 0 && (i = r);
	let a = e.children(n), d = e.node(n), l = d ? d.borderLeft : void 0, u = d ? d.borderRight : void 0, c = {};
	l && (a = a.filter((y) => y !== l && y !== u));
	let f = ye(e, a);
	f.forEach((y) => {
		if (e.children(y.v).length) {
			let { result: L } = ee(e, y.v, t, i, s);
			c[y.v] = L, Object.hasOwn(L, "barycenter") && zt(y, L);
		}
	});
	let b = we(f, t);
	Xt(b, c);
	let m = {}, E = !1;
	for (let y = 0; y < b.length; y++) for (let L = y + 1; L < b.length; L++) if (!(!b[y] || !b[L] || !((g = b[y]) != null && g.barycenter) || !((p = b[L]) != null && p.barycenter)) && ((w = b[y]) == null ? void 0 : w.barycenter) === b[L].barycenter) {
		let k = (N = (v = b[y]) == null ? void 0 : v.vs[0]) != null ? N : "", A = (_ = (G = b[L]) == null ? void 0 : G.vs[0]) != null ? _ : "", $ = e.node(k), te = e.node(A);
		if ($.dummy === "edge" && te.dummy === "edge" && ((C = $.edgeObj) == null ? void 0 : C.v) === ((T = te.edgeObj) == null ? void 0 : T.v) && ((j = $.edgeObj) == null ? void 0 : j.w) === ((R = te.edgeObj) == null ? void 0 : R.w)) if ($.edgeLabel.reversed) {
			m[A] = b[y], b.splice(y, 1), y--;
			break;
		} else m[k] = b[L], b.splice(L, 1), L--;
		else E = !0;
	}
	let h = Ne(b, m, i, e, s);
	if (l && u) {
		h.vs = [
			l,
			h.vs,
			u
		].flat(1);
		let y = e.predecessors(l);
		if (y && y.length) {
			let L = e.node(y[0]), k = e.predecessors(u), A = e.node(k[0]);
			Object.hasOwn(h, "barycenter") || (h.barycenter = 0, h.weight = 0), h.barycenter = (h.barycenter * h.weight + L.order + A.order) / (h.weight + 2), h.weight += 2;
		}
	}
	return Object.defineProperty(h, "result", {
		value: h,
		enumerable: !1,
		configurable: !0,
		writable: !0
	}), Object.defineProperty(h, "usedBias", {
		value: E,
		enumerable: !1,
		configurable: !0,
		writable: !0
	}), h;
}
function Xt(e, n) {
	e.forEach((t) => {
		t.vs = t.vs.flatMap((r) => n[r] ? n[r].vs : r);
	});
}
function zt(e, n) {
	e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + n.barycenter * n.weight) / (e.weight + n.weight), e.weight += n.weight) : (e.barycenter = n.barycenter, e.weight = n.weight);
}
function Ge(e, n, t, r) {
	r || (r = e.nodes());
	let o = Ht(e), i = new x({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((s) => e.node(s));
	return r.forEach((s) => {
		let a = e.node(s), d = e.parent(s);
		if (a.rank === n || a.minRank <= n && n <= a.maxRank) {
			i.setNode(s), i.setParent(s, d || o);
			let l = e[t](s);
			l && l.forEach((u) => {
				let c = u.v === s ? u.w : u.v, f = i.edge(c, s), b = f !== void 0 ? f.weight : 0;
				i.setEdge(c, s, { weight: e.edge(u).weight + b });
			}), Object.hasOwn(a, "minRank") && i.setNode(s, {
				borderLeft: a.borderLeft[n],
				borderRight: a.borderRight[n]
			});
		}
	}), i;
}
function Ht(e) {
	let n;
	for (; e.hasNode(n = H("_root")););
	return n;
}
function ve(e, n, t) {
	let r = {}, o;
	t.forEach((i) => {
		let s = e.parent(i), a, d;
		for (; s;) {
			if (a = e.parent(s), a ? (d = r[a], r[a] = s) : (d = o, o = s), d && d !== s) {
				n.setEdge(d, s);
				return;
			}
			s = a;
		}
	});
}
function ne(e, n = {}, t = null) {
	if (typeof n.customOrder == "function") {
		n.customOrder(e, ne);
		return;
	}
	let r = ae(e), o = Nn(e, P(1, r + 1), "inEdges"), i = Nn(e, P(r - 1, -1, -1), "outEdges"), s = Ee(e, t);
	if (Gn(e, s), n.disableOptimalOrderHeuristic) return;
	let a = Number.POSITIVE_INFINITY, d, l = n.constraints || [];
	for (let u = 0, c = 0; c < 4; ++u, ++c) {
		qt(u % 2 ? o : i, u % 4 >= 2, l, t), s = S(e);
		let f = Le(e, s);
		f < a ? (c = 0, d = Object.assign({}, s), a = f) : f === a && (d = structuredClone(s));
	}
	Gn(e, d);
}
function Nn(e, n, t) {
	let r = /* @__PURE__ */ new Map(), o = (i, s) => {
		r.has(i) || r.set(i, []), r.get(i).push(s);
	};
	for (let i of e.nodes()) {
		let s = e.node(i);
		if (typeof s.rank == "number" && o(s.rank, i), typeof s.minRank == "number" && typeof s.maxRank == "number") for (let a = s.minRank; a <= s.maxRank; a++) a !== s.rank && o(a, i);
	}
	return n.map(function(i) {
		return Ge(e, i, t, r.get(i) || []);
	});
}
function qt(e, n, t, r) {
	let o = !0, i = new x();
	e.forEach(function(s) {
		t.forEach((u) => i.setEdge(u.left, u.right));
		let a = s.graph().root, { result: d, usedBias: l } = ee(s, a, i, r, o);
		n && l && (o = !o), d.vs.forEach((u, c) => s.node(u).order = c), ve(s, i, d.vs);
	});
}
function Gn(e, n) {
	Object.values(n).forEach((t) => t.forEach((r, o) => e.node(r).order = o));
}
function $t(e, n) {
	let t = {};
	function r(o, i) {
		let s = 0, a = 0, d = o.length, l = i[i.length - 1];
		return i.forEach((u, c) => {
			let f = Jt(e, u), b = f ? e.node(f).order : d;
			(f || u === l) && (i.slice(a, c + 1).forEach((m) => {
				let E = e.predecessors(m);
				E && E.forEach((h) => {
					let g = e.node(h), p = g.order;
					(p < s || b < p) && !(g.dummy && e.node(m).dummy) && kn(t, h, m);
				});
			}), a = c + 1, s = b);
		}), i;
	}
	return n.length && n.reduce(r), t;
}
function Ut(e, n) {
	let t = {};
	function r(i, s, a, d, l) {
		P(s, a).forEach((u) => {
			let c = i[u];
			if (c !== void 0 && e.node(c).dummy) {
				let f = e.predecessors(c);
				f && f.forEach((b) => {
					if (b === void 0) return;
					let m = e.node(b);
					m.dummy && (m.order < d || m.order > l) && kn(t, b, c);
				});
			}
		});
	}
	function o(i, s) {
		let a = -1, d = -1, l = 0;
		return s.forEach((u, c) => {
			if (e.node(u).dummy === "border") {
				let f = e.predecessors(u);
				if (f && f.length) {
					let b = f[0];
					if (b === void 0) return;
					d = e.node(b).order, r(s, l, c, a, d), l = c, a = d;
				}
			}
			r(s, l, s.length, d, i.length);
		}), s;
	}
	return n.length && n.reduce(o), t;
}
function Jt(e, n) {
	if (e.node(n).dummy) {
		let t = e.predecessors(n);
		if (t) return t.find((r) => e.node(r).dummy);
	}
}
function kn(e, n, t) {
	if (n > t) {
		let o = n;
		n = t, t = o;
	}
	let r = e[n];
	r || (e[n] = r = {}), r[t] = !0;
}
function Kt(e, n, t) {
	if (n > t) {
		let o = n;
		n = t, t = o;
	}
	let r = e[n];
	return r !== void 0 && Object.hasOwn(r, t);
}
function Qt(e, n, t, r, o) {
	let i = {}, s = {}, a = {};
	return n.forEach((d) => {
		d.forEach((l, u) => {
			i[l] = l, s[l] = l, a[l] = u;
		});
	}), n.forEach((d) => {
		let l = -1, u = -1, c = !1, f = d, b = d.findIndex((m) => (o == null ? void 0 : o.includes(m)) || vn(m, e, o));
		b > 0 && (f = [
			d[b],
			...d.slice(0, b),
			...d.slice(b + 1)
		], c = !0), f.forEach((m) => {
			var h;
			let E = r(m);
			if (E && E.length) {
				o != null && o.includes(m) && (E = E.filter((w) => vn(w, e, o)));
				let g = E.sort((w, v) => {
					let N = a[w], G = a[v];
					return (N !== void 0 ? N : 0) - (G !== void 0 ? G : 0);
				}), p = (g.length - 1) / 2;
				for (let w = Math.floor(p), v = Math.ceil(p); w <= v; ++w) {
					let N = g[w];
					if (N === void 0) continue;
					let G = a[N];
					if (G !== void 0 && s[m] === m && l < G && a[N] !== u && !Kt(t, m, N)) {
						let _ = i[N];
						_ !== void 0 && (s[N] = m, s[m] = i[m] = _, l = G, c && (l = -1, u = (h = a[N]) != null ? h : -1, c = !1));
					}
				}
			}
		});
	}), {
		root: i,
		align: s
	};
}
function Zt(e, n, t, r, o = !1) {
	let i = {}, s = er(e, n, t, o), a = o ? "borderLeft" : "borderRight";
	function d(b, m) {
		let E = s.nodes().slice(), h = {}, g = E.pop();
		for (; g;) {
			if (h[g]) b(g);
			else {
				h[g] = !0, E.push(g);
				for (let p of m(g)) E.push(p);
			}
			g = E.pop();
		}
	}
	function l(b) {
		let m = s.inEdges(b);
		m ? i[b] = m.reduce((E, h) => {
			var w;
			let g = (w = i[h.v]) != null ? w : 0, p = s.edge(h);
			return Math.max(E, g + (p !== void 0 ? p : 0));
		}, 0) : i[b] = 0;
	}
	function u(b) {
		let m = s.outEdges(b), E = Number.POSITIVE_INFINITY;
		m && (E = m.reduce((g, p) => {
			let w = i[p.w], v = s.edge(p);
			return Math.min(g, (w !== void 0 ? w : 0) - (v !== void 0 ? v : 0));
		}, Number.POSITIVE_INFINITY));
		let h = e.node(b);
		E !== Number.POSITIVE_INFINITY && h.borderType !== a && (i[b] = Math.max(i[b] !== void 0 ? i[b] : 0, E));
	}
	function c(b) {
		return s.predecessors(b) || [];
	}
	function f(b) {
		return s.successors(b) || [];
	}
	return d(l, c), d(u, f), Object.keys(r).forEach((b) => {
		var E;
		let m = t[b];
		m !== void 0 && (i[b] = (E = i[m]) != null ? E : 0);
	}), i;
}
function er(e, n, t, r) {
	let o = new x(), i = e.graph(), s = or(i.nodesep, i.edgesep, r);
	return n.forEach((a) => {
		let d;
		a.forEach((l) => {
			let u = t[l];
			if (u !== void 0) {
				if (o.setNode(u), d !== void 0) {
					let c = t[d];
					if (c !== void 0) {
						let f = o.edge(c, u);
						o.setEdge(c, u, Math.max(s(e, l, d), f || 0));
					}
				}
				d = l;
			}
		});
	}), o;
}
function nr(e, n) {
	return Object.values(n).reduce((t, r) => {
		let o = Number.NEGATIVE_INFINITY, i = Number.POSITIVE_INFINITY;
		Object.entries(r).forEach(([a, d]) => {
			let l = ir(e, a) / 2;
			o = Math.max(d + l, o), i = Math.min(d - l, i);
		});
		let s = o - i;
		return s < t[0] && (t = [s, r]), t;
	}, [Number.POSITIVE_INFINITY, null])[1];
}
function tr(e, n) {
	let t = Object.values(n), r = O(Math.min, t), o = O(Math.max, t);
	["u", "d"].forEach((i) => {
		["l", "r"].forEach((s) => {
			let a = i + s, d = e[a];
			if (!d || d === n) return;
			let l = Object.values(d), u = r - O(Math.min, l);
			s !== "l" && (u = o - O(Math.max, l)), u && (e[a] = W(d, (c) => c + u));
		});
	});
}
function rr(e, n = void 0) {
	let t = e.ul;
	return t ? W(t, (r, o) => {
		var s, a;
		if (n) {
			let l = e[n.toLowerCase()];
			if (l && l[o] !== void 0) return l[o];
		}
		let i = Object.values(e).map((d) => {
			let l = d[o];
			return l !== void 0 ? l : 0;
		}).sort((d, l) => d - l);
		return (((s = i[1]) != null ? s : 0) + ((a = i[2]) != null ? a : 0)) / 2;
	}) : {};
}
function xn(e, n) {
	let t = S(e), r = Object.assign($t(e, t), Ut(e, t)), o = {}, i;
	["u", "d"].forEach((a) => {
		i = a === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((d) => {
			d === "r" && (i = i.map((f) => Object.values(f).reverse()));
			let u = Qt(e, i, r, (f) => (a === "u" ? e.predecessors(f) : e.successors(f)) || [], n), c = Zt(e, i, u.root, u.align, d === "r");
			d === "r" && (c = W(c, (f) => -f)), o[a + d] = c;
		});
	});
	return tr(o, nr(e, o)), rr(o, e.graph().align);
}
function or(e, n, t) {
	return (r, o, i) => {
		let s = r.node(o), a = r.node(i), d = 0, l;
		if (d += s.width / 2, Object.hasOwn(s, "labelpos")) switch (s.labelpos.toLowerCase()) {
			case "l":
				l = -s.width / 2;
				break;
			case "r":
				l = s.width / 2;
				break;
		}
		if (l && (d += t ? l : -l), l = void 0, d += (s.dummy ? n : e) / 2, d += (a.dummy ? n : e) / 2, d += a.width / 2, Object.hasOwn(a, "labelpos")) switch (a.labelpos.toLowerCase()) {
			case "l":
				l = a.width / 2;
				break;
			case "r":
				l = -a.width / 2;
				break;
		}
		return l && (d += t ? l : -l), d;
	};
}
function ir(e, n) {
	return e.node(n).width;
}
function vn(e, n, t) {
	var s;
	if (!t) return !1;
	let r = (s = n.node(e)) == null ? void 0 : s.edgeObj;
	if (!r || n.node(e).edgeLabel.reversed) return !1;
	let o = t.indexOf(r == null ? void 0 : r.v), i = t.indexOf(r == null ? void 0 : r.w);
	return o !== -1 && i !== -1 && o === (i + 1) % t.length || o === (i - 1) % t.length;
}
function _n(e, n) {
	e = K(e), sr(e), Object.entries(xn(e, n)).forEach(([t, r]) => e.node(t).x = r);
}
function sr(e) {
	let n = S(e), t = e.graph(), r = t.ranksep, o = t.rankalign, i = 0;
	n.forEach((s) => {
		let a = s.reduce((d, l) => {
			var c;
			let u = (c = e.node(l).height) != null ? c : 0;
			return d > u ? d : u;
		}, 0);
		s.forEach((d) => {
			let l = e.node(d);
			o === "top" ? l.y = i + l.height / 2 : o === "bottom" ? l.y = i + a - l.height / 2 : l.y = i + a / 2;
		}), i += a + r;
	});
}
var ke = null;
var xe = null;
function Ce(e, n = {}) {
	return In(e, z, n), e;
}
function On(e, n, t) {
	let r = n;
	for (; r !== void 0;) {
		let o = e.parent(r);
		if (o === t) return r;
		r = o;
	}
}
function In(e, n, t) {
	let r = e.nodes().filter((h) => e.children(h).length), o = {};
	r.forEach((h) => {
		let g = e.node(h);
		if (g && g.rankdir) {
			let p = new x({
				multigraph: !0,
				compound: !0
			});
			p.setGraph({ rankdir: g.rankdir });
			let w = e.children(h);
			w.forEach((y) => {
				let L = { ...e.node(y) };
				p.setNode(y, L);
				let k = e.parent(y);
				k && k !== h && w.includes(k) && p.setParent(y, k);
			});
			let v = /* @__PURE__ */ new Set();
			e.edges().forEach((y) => {
				let L = On(e, y.v, h), k = On(e, y.w, h);
				if (L && k && L !== k) {
					let A = `${L}\0${k}`;
					v.has(A) || (v.add(A), p.setEdge(L, k, { ...e.edge(y) }));
				}
			}), In(p, n, t);
			let N = jn(p);
			Cn(N, n, t), Tn(p, N);
			let G = Infinity, _ = Infinity, C = -Infinity, T = -Infinity;
			p.nodes().forEach((y) => {
				if (y === h) return;
				let L = p.node(y);
				L && typeof L.x == "number" && typeof L.y == "number" && typeof L.width == "number" && typeof L.height == "number" && (G = Math.min(G, L.x - L.width / 2), C = Math.max(C, L.x + L.width / 2), _ = Math.min(_, L.y - L.height / 2), T = Math.max(T, L.y + L.height / 2));
			}), (!isFinite(G) || !isFinite(_) || !isFinite(C) || !isFinite(T)) && (G = _ = 0, C = T = 0);
			let j = C - G, R = T - _;
			o[h] = {
				minX: G,
				minY: _,
				maxX: C,
				maxY: T,
				width: j,
				height: R,
				offsetX: G,
				offsetY: _
			}, g._dagreClusterSubgraph = p;
		}
	});
	let i = [], s = (h) => {
		let g = [], p = (e.children(h) || []).filter((w) => w !== h);
		for (; p.length > 0;) {
			let w = p.shift();
			g.push(w), (e.children(w) || []).filter((v) => v !== w).forEach((v) => p.push(v));
		}
		return g;
	}, a = /* @__PURE__ */ new Map();
	r.forEach((h) => {
		let g = e.node(h);
		g && g.rankdir && o[h] && a.set(h, (e.children(h) || []).filter((p) => p !== h));
	});
	let d = new Set([...a.values()].flat()), l = /* @__PURE__ */ new Map();
	a.forEach((h, g) => {
		d.has(g) || l.set(g, s(g));
	});
	let u = new Set([...l.values()].flat()), c = (h) => {
		for (let [g, p] of l) if (p.includes(h)) return g;
		return h;
	}, f = [];
	e.edges().forEach((h) => {
		(u.has(h.v) || u.has(h.w)) && f.push({
			edge: h,
			label: e.edge(h)
		});
	});
	let b = /* @__PURE__ */ new Map();
	u.forEach((h) => {
		let g = e.parent(h);
		b.set(h, typeof g == "string" ? g : void 0);
	}), l.forEach((h, g) => {
		let p = e.node(g), w = [];
		h.forEach((G) => {
			let _ = e.node(G);
			_ && (w.push({
				id: G,
				node: _,
				parent: b.get(G)
			}), e.removeNode(G));
		});
		let v = f.filter(({ edge: G }) => h.includes(G.v) || h.includes(G.w)), N = o[g];
		p && (i.push({
			clusterId: g,
			subgraph: p._dagreClusterSubgraph,
			bounds: N,
			children: h,
			removedNodes: w,
			removedEdges: v
		}), p.width = N.width, p.height = N.height);
	});
	let m = /* @__PURE__ */ new Set();
	f.forEach(({ edge: h, label: g }) => {
		let p = c(h.v), w = c(h.w);
		if (p !== w && e.hasNode(p) && e.hasNode(w)) {
			let v = `${p}\0${w}`;
			m.has(v) || (m.add(v), e.setEdge(p, w, {
				...g,
				width: 0,
				height: 0
			}));
		}
	});
	let E = jn(e);
	Cn(E, n, t), Tn(e, E), m.forEach((h) => {
		let g = h.indexOf("\0"), p = h.slice(0, g), w = h.slice(g + 1);
		e.hasEdge(p, w) && e.removeEdge(p, w);
	}), i.forEach(({ clusterId: h, subgraph: g, bounds: p, removedNodes: w, removedEdges: v }) => {
		var j, R;
		let N = e.node(h), G = (j = N == null ? void 0 : N.x) != null ? j : 0, _ = (R = N == null ? void 0 : N.y) != null ? R : 0, C = (p.minX + p.maxX) / 2, T = (p.minY + p.maxY) / 2;
		w.forEach(({ id: y, node: L, parent: k }) => {
			e.setNode(y, L), k !== void 0 && e.setParent(y, k);
		}), v.forEach(({ edge: y, label: L }) => {
			e.setEdge(y, L);
		}), g.nodes().forEach((y) => {
			if (y === h) return;
			let L = g.node(y), k = e.node(y);
			k && L && typeof L.x == "number" && typeof L.y == "number" && (k.x = G + (L.x - C), k.y = _ + (L.y - T));
		}), delete N._dagreClusterSubgraph;
	}), r.forEach((h) => {
		var w, v;
		let g = e.node(h), p = o[h];
		if (g && g.rankdir && g._dagreClusterSubgraph && p) {
			let N = g._dagreClusterSubgraph, G = (w = g.x) != null ? w : 0, _ = (v = g.y) != null ? v : 0, C = (p.minX + p.maxX) / 2, T = (p.minY + p.maxY) / 2;
			N.nodes().forEach((j) => {
				if (j === h) return;
				let R = N.node(j), y = e.node(j);
				if (y && R && typeof R.x == "number" && typeof R.y == "number") {
					let L = R.x - C, k = R.y - T;
					y.x = G + L, y.y = _ + k;
				}
			}), delete g._dagreClusterSubgraph;
		}
	});
}
function Cn(e, n, t) {
	(t == null ? void 0 : t.useDynamic) === !1 && (ke = null, xe = null), n("    makeSpaceForEdgeLabels", () => hr(e)), n("    removeSelfEdges", () => Gr(e)), n("    acyclic", () => Ke(e, ke)), n("    nestingGraph.run", () => fn(e)), n("    rank", () => un(K(e))), n("    injectEdgeLabelProxies", () => gr(e)), n("    removeEmptyRanks", () => ze(e)), n("    nestingGraph.cleanup", () => hn(e)), n("    normalizeRanks", () => Xe(e)), n("    assignRankMinMax", () => pr(e)), n("    removeEdgeLabelProxies", () => mr(e)), n("    normalize.run", () => Ze(e)), n("    parentDummyChains", () => cn(e)), n("    addBorderSegments", () => pn(e)), n("    order", () => ne(e, t, xe)), n("    insertSelfEdges", () => vr(e)), n("    adjustCoordinateSystem", () => En(e)), n("    position", () => _n(e, t.corePath)), n("    positionSelfEdges", () => kr(e)), xe = JSON.parse(JSON.stringify(e._nodes)), n("    removeBorderNodes", () => Nr(e)), n("    normalize.undo", () => en(e)), n("    fixupEdgeLabelCoords", () => yr(e)), n("    undoCoordinateSystem", () => Ln(e)), n("    translateGraph", () => Er(e)), n("    assignNodeIntersects", () => Lr(e)), n("    reversePoints", () => wr(e)), n("    acyclic.undo", () => Qe(e)), ke = e;
}
function Tn(e, n) {
	e.nodes().forEach((t) => {
		let r = e.node(t), o = n.node(t);
		r && (r.x = o.x, r.y = o.y, r.order = o.order, r.rank = o.rank, n.children(t).length && (r.width = o.width, r.height = o.height));
	}), e.edges().forEach((t) => {
		let r = e.edge(t), o = n.edge(t);
		r.points = o.points, Object.hasOwn(o, "x") && (r.x = o.x, r.y = o.y);
	}), e.graph().width = n.graph().width, e.graph().height = n.graph().height;
}
var ar = [
	"nodesep",
	"edgesep",
	"ranksep",
	"marginx",
	"marginy"
];
var dr = {
	ranksep: 50,
	edgesep: 20,
	nodesep: 50,
	rankdir: "TB",
	rankalign: "center"
};
var lr = [
	"acyclicer",
	"ranker",
	"rankdir",
	"align",
	"rankalign"
];
var ur = [
	"width",
	"height",
	"rank"
];
var Rn = {
	width: 0,
	height: 0
};
var cr = [
	"minlen",
	"weight",
	"width",
	"height",
	"labeloffset"
];
var fr = {
	minlen: 1,
	weight: 1,
	width: 0,
	height: 0,
	labeloffset: 10,
	labelpos: "r"
};
var br = ["labelpos"];
function jn(e) {
	let n = new x({
		multigraph: !0,
		compound: !0
	}), t = Oe(e.graph());
	return n.setGraph(Object.assign({}, dr, _e(t, ar), Y(t, lr))), e.nodes().forEach((r) => {
		let i = _e(Oe(e.node(r)), ur);
		Object.keys(Rn).forEach((a) => {
			i[a] === void 0 && (i[a] = Rn[a]);
		}), n.setNode(r, i);
		let s = e.parent(r);
		s !== void 0 && n.setParent(r, s);
	}), e.edges().forEach((r) => {
		let o = Oe(e.edge(r));
		n.setEdge(r, Object.assign({}, fr, _e(o, cr), Y(o, br)));
	}), n;
}
function hr(e) {
	let n = e.graph();
	n.ranksep /= 2, e.edges().forEach((t) => {
		var o;
		let r = e.edge(t);
		r.minlen *= 2, ((o = r.labelpos) != null ? o : "r").toLowerCase() !== "c" && (n.rankdir === "TB" || n.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
	});
}
function gr(e) {
	e.edges().forEach((n) => {
		let t = e.edge(n);
		if (t.width && t.height) {
			let r = e.node(n.v);
			I(e, "edge-proxy", {
				rank: (e.node(n.w).rank - r.rank) / 2 + r.rank,
				e: n
			}, "_ep");
		}
	});
}
function pr(e) {
	let n = 0;
	e.nodes().forEach((t) => {
		let r = e.node(t);
		r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, n = Math.max(n, r.maxRank));
	}), e.graph().maxRank = n;
}
function mr(e) {
	e.nodes().forEach((n) => {
		let t = e.node(n);
		if (t.dummy === "edge-proxy") {
			let r = t;
			e.edge(r.e).labelRank = t.rank, e.removeNode(n);
		}
	});
}
function Er(e) {
	let n = Number.POSITIVE_INFINITY, t = 0, r = Number.POSITIVE_INFINITY, o = 0, i = e.graph(), s = i.marginx || 0, a = i.marginy || 0;
	function d(l) {
		let u = l.x, c = l.y, f = l.width, b = l.height;
		n = Math.min(n, u - f / 2), t = Math.max(t, u + f / 2), r = Math.min(r, c - b / 2), o = Math.max(o, c + b / 2);
	}
	e.nodes().forEach((l) => d(e.node(l))), e.edges().forEach((l) => {
		let u = e.edge(l);
		Object.hasOwn(u, "x") && d(u);
	}), n -= s, r -= a, e.nodes().forEach((l) => {
		let u = e.node(l);
		u.x -= n, u.y -= r;
	}), e.edges().forEach((l) => {
		let u = e.edge(l);
		u.points.forEach((c) => {
			c.x -= n, c.y -= r;
		}), Object.hasOwn(u, "x") && (u.x -= n), Object.hasOwn(u, "y") && (u.y -= r);
	}), i.width = t - n + s, i.height = o - r + a;
}
function Lr(e) {
	e.edges().forEach((n) => {
		if (n.v === n.w) return;
		let t = e.edge(n), r = e.node(n.v), o = e.node(n.w), i, s;
		t.points ? (i = t.points[0], s = t.points[t.points.length - 1]) : (t.points = [], i = o, s = r), t.points.unshift(ie(r, i)), t.points.push(ie(o, s));
	});
}
function yr(e) {
	e.edges().forEach((n) => {
		let t = e.edge(n);
		if (Object.hasOwn(t, "x")) switch ((t.labelpos === "l" || t.labelpos === "r") && (t.width -= t.labeloffset), t.labelpos) {
			case "l":
				t.x -= t.width / 2 + t.labeloffset;
				break;
			case "r":
				t.x += t.width / 2 + t.labeloffset;
				break;
		}
	});
}
function wr(e) {
	e.edges().forEach((n) => {
		let t = e.edge(n);
		t.reversed && t.points.reverse();
	});
}
function Nr(e) {
	e.nodes().forEach((n) => {
		if (e.children(n).length) {
			let t = e.node(n), r = e.node(t.borderTop), o = e.node(t.borderBottom), i = e.node(t.borderLeft[t.borderLeft.length - 1]), s = e.node(t.borderRight[t.borderRight.length - 1]);
			t.width = Math.abs(s.x - i.x), t.height = Math.abs(o.y - r.y), t.x = i.x + t.width / 2, t.y = r.y + t.height / 2;
		}
	}), e.nodes().forEach((n) => {
		e.node(n).dummy === "border" && e.removeNode(n);
	});
}
function Gr(e) {
	e.edges().forEach((n) => {
		if (n.v === n.w) {
			let t = e.node(n.v);
			t.selfEdges || (t.selfEdges = []), t.selfEdges.push({
				e: n,
				label: e.edge(n)
			}), e.removeEdge(n);
		}
	});
}
function vr(e) {
	S(e).forEach((t) => {
		let r = 0;
		t.forEach((o, i) => {
			let s = e.node(o);
			typeof s.rank != "number" && (s.rank = 0), s.order = i + r, (s.selfEdges || []).forEach((a) => {
				I(e, "selfedge", {
					width: a.label.width,
					height: a.label.height,
					rank: s.rank,
					order: i + ++r,
					e: a.e,
					edgeLabel: a.label
				}, "_se"), (!Array.isArray(a.label.points) || a.label.points.length !== 7) && (a.label.points = [
					{
						x: 0,
						y: -10
					},
					{
						x: 0,
						y: -10
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 0,
						y: 10
					},
					{
						x: 0,
						y: 10
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 0,
						y: 0
					}
				]);
			}), delete s.selfEdges;
		});
	});
}
function kr(e) {
	e.nodes().forEach((n) => {
		let t = e.node(n), r = (o) => typeof o == "number" && isFinite(o);
		if (t.dummy === "selfedge") {
			let o = t, i = e.node(o.e.v), s = r(i == null ? void 0 : i.x) ? i.x : 0, a = r(i == null ? void 0 : i.y) ? i.y : 0, d = r(i == null ? void 0 : i.width) ? i.width : 0, l = r(i == null ? void 0 : i.height) ? i.height : 0, u = r(t.x) ? t.x : s, c = r(t.y) ? t.y : a, f = d / 2, b = l / 2;
			o.edgeLabel.points = [
				{
					x: u + f,
					y: c - b
				},
				{
					x: u + f,
					y: c - b
				},
				{
					x: u,
					y: c
				},
				{
					x: u - f,
					y: c + b
				},
				{
					x: u - f,
					y: c + b
				},
				{
					x: u,
					y: c
				},
				{
					x: u,
					y: c
				}
			], o.edgeLabel.x = u, o.edgeLabel.y = c, e.setEdge(o.e, o.edgeLabel), e.removeNode(n);
		} else t && Array.isArray(t.selfEdges) && t.selfEdges.forEach((o) => {
			if (!Array.isArray(o.label.points) || o.label.points.length !== 7) {
				let i = r(t.x) ? t.x : 0, s = r(t.y) ? t.y : 0, a = r(t.width) ? t.width : 0, d = r(t.height) ? t.height : 0, l = a / 2, u = d / 2;
				o.label.points = [
					{
						x: i + l,
						y: s - u
					},
					{
						x: i + l,
						y: s - u
					},
					{
						x: i,
						y: s
					},
					{
						x: i - l,
						y: s + u
					},
					{
						x: i - l,
						y: s + u
					},
					{
						x: i,
						y: s
					},
					{
						x: i,
						y: s
					}
				];
			}
		});
	});
}
function _e(e, n) {
	return W(Y(e, n), Number);
}
function Oe(e) {
	let n = {};
	return e && Object.entries(e).forEach(([t, r]) => {
		typeof t == "string" && (t = t.toLowerCase()), n[t] = r;
	}), n;
}
function Te(e) {
	let n = S(e), t = new x({
		compound: !0,
		multigraph: !0
	}).setGraph({});
	return e.nodes().forEach((r) => {
		t.setNode(r, { label: r }), t.setParent(r, "layer" + e.node(r).rank);
	}), e.edges().forEach((r) => t.setEdge(r.v, r.w, {}, r.name)), n.forEach((r, o) => {
		let i = "layer" + o;
		t.setNode(i, { rank: "same" }), r.reduce((s, a) => (t.setEdge(s, a, { style: "invis" }), a));
	}), t;
}
var Uo = {
	graphlib: oe,
	version: le,
	layout: Ce,
	debug: Te,
	util: {
		time: de,
		notime: z
	}
};
/*! For license information please see dagre.esm.js.LEGAL.txt */
//#endregion
//#region src/defaults.ts
/** 
* Dagre algorithmic options. The default value of dagre.js is used
* when the option is left undefined here.
*/
const defaults = {
	nodeSep: void 0,
	edgeSep: void 0,
	rankSep: void 0,
	rankDir: void 0,
	align: void 0,
	acyclicer: void 0,
	ranker: void 0,
	minLen: function(_edge) {
		return 1;
	},
	edgeWeight: function(_edge) {
		return 1;
	},
	fit: true,
	padding: 30,
	spacingFactor: void 0,
	nodeDimensionsIncludeLabels: false,
	useDagreEdgeControlPoints: false,
	automaticDagreEdgeStyle: false,
	dagreEdgeStyle: {
		"curve-style": "unbundled-bezier",
		"control-point-weights": (ele) => ele.scratch("controlPointWeights"),
		"control-point-distances": (ele) => ele.scratch("controlPointDistances"),
		"edge-distances": "intersection",
		"edge-ends-overlap": false
	},
	animate: false,
	animateFilter: function(_node, _i) {
		return true;
	},
	animationDuration: 500,
	animationEasing: void 0,
	boundingBox: void 0,
	transform: function(_node, pos) {
		return pos;
	},
	ready: function() {},
	sort: void 0,
	stop: function() {}
};
//#endregion
//#region src/assign.ts
const assign = Object.assign != null ? Object.assign.bind(Object) : function(tgt, ...srcs) {
	srcs.forEach((src) => {
		if (src != null) Object.keys(src).forEach((k) => {
			tgt[k] = src[k];
		});
	});
	return tgt;
};
//#endregion
//#region src/layout.ts
const isFunction = (o) => typeof o === "function";
const EPSILON = .001;
function getDagreNode(ele) {
	if (ele.isParent()) {
		const children = ele.children();
		if (children.length > 0) return getDagreNode(children[0]);
	}
	return ele;
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
	const len = Math.hypot(v.x, v.y) || 1;
	return {
		x: v.x / len,
		y: v.y / len,
		len
	};
}
function perp(v) {
	return {
		x: -v.y,
		y: v.x
	};
}
function buildEdgeFrame(src, tgt) {
	const { x, y, len } = norm(subtract(tgt, src));
	const dir = {
		x,
		y
	};
	return {
		src,
		tgt,
		dir,
		normal: perp(dir),
		len
	};
}
function noZero(x) {
	if (Math.abs(x) < EPSILON) return x < 0 ? -.001 : EPSILON;
	return x;
}
function toEdgeCoordinates(P, frame) {
	const vector = subtract(P, frame.src);
	return {
		weight: noZero(product(vector, frame.dir) / frame.len),
		distance: noZero(product(vector, frame.normal))
	};
}
function normalizeWeight(coords) {
	let min = Infinity;
	let max = -Infinity;
	for (const p of coords) {
		if (p.weight < min) min = p.weight;
		if (p.weight > max) max = p.weight;
	}
	const range = max - min || 1;
	return coords.map((p) => ({
		distance: p.distance,
		weight: (p.weight - min) / range
	}));
}
function dagreEdgeToCytoscapeEdge(dEdge, cEdge) {
	const frame = buildEdgeFrame(cEdge.source().position(), cEdge.target().position());
	const coords = normalizeWeight(dEdge.points.map((p) => toEdgeCoordinates(p, frame)));
	return {
		controlPointWeights: coords.slice(1, -1).map((c) => c.weight),
		controlPointDistances: coords.slice(1, -1).map((c) => c.distance)
	};
}
function DagreLayout(options) {
	this.options = assign({}, defaults, options);
}
DagreLayout.prototype.run = function() {
	const options = this.options;
	const cy = options.cy;
	const eles = options.eles;
	const getVal = (ele, val) => isFunction(val) ? val.apply(ele, [ele]) : val;
	let bb = options.boundingBox || {
		x1: 0,
		y1: 0,
		w: cy.width(),
		h: cy.height()
	};
	if (bb.x2 === void 0) bb.x2 = bb.x1 + bb.w;
	if (bb.w === void 0) bb.w = bb.x2 - bb.x1;
	if (bb.y2 === void 0) bb.y2 = bb.y1 + bb.h;
	if (bb.h === void 0) bb.h = bb.y2 - bb.y1;
	const g = new Uo.graphlib.Graph({
		multigraph: true,
		compound: true
	});
	const gObj = {};
	const setGObj = (name, val) => {
		if (val != null) gObj[name] = val;
	};
	setGObj("nodesep", options.nodeSep);
	setGObj("edgesep", options.edgeSep);
	setGObj("ranksep", options.rankSep);
	setGObj("rankdir", options.rankDir);
	setGObj("align", options.align);
	setGObj("ranker", options.ranker);
	setGObj("acyclicer", options.acyclicer);
	g.setGraph(gObj);
	g.setDefaultEdgeLabel(() => ({}));
	g.setDefaultNodeLabel(() => ({}));
	let nodes = eles.nodes();
	if (isFunction(options.sort)) nodes = nodes.sort(options.sort);
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		const nbb = node.layoutDimensions(options);
		g.setNode(node.id(), {
			width: nbb.w,
			height: nbb.h,
			shape: "ellipse",
			name: node.id()
		});
	}
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (node.isChild()) g.setParent(node.id(), node.parent().id());
	}
	let edges = eles.edges();
	if (isFunction(options.sort)) edges = edges.sort(options.sort);
	for (let i = 0; i < edges.length; i++) {
		const edge = edges[i];
		const sourceNode = getDagreNode(edge.source());
		const targetNode = getDagreNode(edge.target());
		g.setEdge(sourceNode.id(), targetNode.id(), {
			minlen: getVal(edge, options.minLen),
			weight: getVal(edge, options.edgeWeight),
			name: edge.id()
		}, edge.id());
	}
	Uo.layout(g);
	const gNodeIds = g.nodes();
	for (let i = 0; i < gNodeIds.length; i++) {
		const id = gNodeIds[i];
		const n = g.node(id);
		cy.getElementById(id).scratch().dagre = n;
	}
	let dagreBB;
	if (options.boundingBox) {
		dagreBB = {
			x1: Infinity,
			x2: -Infinity,
			y1: Infinity,
			y2: -Infinity
		};
		nodes.forEach((node) => {
			const dModel = node.scratch().dagre;
			dagreBB.x1 = Math.min(dagreBB.x1, dModel.x);
			dagreBB.x2 = Math.max(dagreBB.x2, dModel.x);
			dagreBB.y1 = Math.min(dagreBB.y1, dModel.y);
			dagreBB.y2 = Math.max(dagreBB.y2, dModel.y);
		});
		dagreBB.w = dagreBB.x2 - dagreBB.x1;
		dagreBB.h = dagreBB.y2 - dagreBB.y1;
	} else dagreBB = bb;
	const constrainPos = (p) => {
		if (options.boundingBox) {
			const xPct = dagreBB.w === 0 ? 0 : (p.x - dagreBB.x1) / dagreBB.w;
			const yPct = dagreBB.h === 0 ? 0 : (p.y - dagreBB.y1) / dagreBB.h;
			return {
				x: bb.x1 + xPct * bb.w,
				y: bb.y1 + yPct * bb.h
			};
		} else return p;
	};
	nodes.layoutPositions(this, options, (ele) => {
		const dModel = ele.scratch().dagre;
		return constrainPos({
			x: dModel.x,
			y: dModel.y
		});
	});
	if (options.useDagreEdgeControlPoints) {
		if (options.automaticDagreEdgeStyle) {
			cy.edges().addClass("useDagreEdgeControlPoints");
			cy.style().selector("edge.useDagreEdgeControlPoints").style(options.dagreEdgeStyle).update();
		}
		g.edges().forEach((id) => {
			const cyEdge = cy.getElementById(id.name);
			const dEdge = g.edge(id);
			if (dEdge && dEdge.points) cyEdge.scratch(dagreEdgeToCytoscapeEdge(dEdge, cyEdge));
		});
	}
	return this;
};
//#endregion
//#region src/index.ts
/**
* Registers the Dagre layout extension on a Cytoscape library reference.
*/
const register = function(cy) {
	if (!cy) return;
	cy("layout", "dagre", DagreLayout);
};
if (typeof window !== "undefined" && window.cytoscape) register(window.cytoscape);
//#endregion
export { register as default };

//# sourceMappingURL=cytoscape-dagre.mjs.map