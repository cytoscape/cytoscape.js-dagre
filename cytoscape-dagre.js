(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeDagre"] = factory();
	else
		root["cytoscapeDagre"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 155
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
var Ze=Object.create;var M=Object.defineProperty;var $e=Object.getOwnPropertyDescriptor;var en=Object.getOwnPropertyNames;var nn=Object.getPrototypeOf,tn=Object.prototype.hasOwnProperty;var rn=(e,n,t)=>n in e?M(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t;var on=(e,n)=>{for(var t in n)M(e,t,{get:n[t],enumerable:!0})},ue=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of en(n))!tn.call(e,o)&&o!==t&&M(e,o,{get:()=>n[o],enumerable:!(r=$e(n,o))||r.enumerable});return e};var an=(e,n,t)=>(t=e!=null?Ze(nn(e)):{},ue(n||!e||!e.__esModule?M(t,"default",{value:e,enumerable:!0}):t,e)),sn=e=>ue(M({},"__esModule",{value:!0}),e);var ce=(e,n,t)=>rn(e,typeof n!="symbol"?n+"":n,t);var It={};on(It,{Graph:()=>Qe.Graph,debug:()=>D,default:()=>St,graphlib:()=>Je,layout:()=>B,util:()=>Pt,version:()=>F});module.exports=sn(It);var Je=an(__webpack_require__(413));var p=__webpack_require__(413);function N(e,n,t,r){let o=r;for(;e.hasNode(o);)o=C(r);return t.dummy=n,e.setNode(o,t),o}function be(e){let n=new p.Graph().setGraph(e.graph());return e.nodes().forEach(t=>n.setNode(t,e.node(t))),e.edges().forEach(t=>{let r=n.edge(t.v,t.w)||{weight:0,minlen:1},o=e.edge(t);n.setEdge(t.v,t.w,{weight:r.weight+o.weight,minlen:Math.max(r.minlen,o.minlen)})}),n}function _(e){let n=new p.Graph({multigraph:e.isMultigraph()}).setGraph(e.graph());return e.nodes().forEach(t=>{e.children(t).length||n.setNode(t,e.node(t))}),e.edges().forEach(t=>{n.setEdge(t,e.edge(t))}),n}function Y(e,n){let t=e.x,r=e.y,o=n.x-t,i=n.y-r,a=e.width/2,s=e.height/2;if(!o&&!i)throw new Error("Not possible to find intersection inside of the rectangle");let d,l;return Math.abs(i)*a>Math.abs(o)*s?(i<0&&(s=-s),d=s*o/i,l=s):(o<0&&(a=-a),d=a,l=a*i/o),{x:t+d,y:r+l}}function G(e){let n=k(q(e)+1).map(()=>[]);return e.nodes().forEach(t=>{let r=e.node(t),o=r.rank;o!==void 0&&(n[o]||(n[o]=[]),n[o][r.order]=t)}),n}function fe(e){let n=e.nodes().map(r=>{let o=e.node(r).rank;return o===void 0?Number.MAX_VALUE:o}),t=E(Math.min,n);e.nodes().forEach(r=>{let o=e.node(r);Object.hasOwn(o,"rank")&&(o.rank-=t)})}function he(e){let n=e.nodes().map(a=>e.node(a).rank).filter(a=>a!==void 0),t=E(Math.min,n),r=[];e.nodes().forEach(a=>{let s=e.node(a).rank-t;r[s]||(r[s]=[]),r[s].push(a)});let o=0,i=e.graph().nodeRankFactor;Array.from(r).forEach((a,s)=>{a===void 0&&s%i!==0?--o:a!==void 0&&o&&a.forEach(d=>e.node(d).rank+=o)})}function H(e,n,t,r){let o={width:0,height:0};return arguments.length>=4&&(o.rank=t,o.order=r),N(e,"border",o,n)}function dn(e,n=ge){let t=[];for(let r=0;r<e.length;r+=n){let o=e.slice(r,r+n);t.push(o)}return t}var ge=65535;function E(e,n){if(n.length>ge){let t=dn(n);return e(...t.map(r=>e(...r)))}else return e(...n)}function q(e){let t=e.nodes().map(r=>{let o=e.node(r).rank;return o===void 0?Number.MIN_VALUE:o});return E(Math.max,t)}function pe(e,n){let t={lhs:[],rhs:[]};return e.forEach(r=>{n(r)?t.lhs.push(r):t.rhs.push(r)}),t}function S(e,n){let t=Date.now();try{return n()}finally{console.log(e+" time: "+(Date.now()-t)+"ms")}}function I(e,n){return n()}var ln=0;function C(e){let n=++ln;return e+(""+n)}function k(e,n,t=1){n==null&&(n=e,e=0);let r=i=>i<n;t<0&&(r=i=>n<i);let o=[];for(let i=e;r(i);i+=t)o.push(i);return o}function O(e,n){let t={};for(let r of n)e[r]!==void 0&&(t[r]=e[r]);return t}function R(e,n){let t;return typeof n=="string"?t=r=>r[n]:t=n,Object.entries(e).reduce((r,[o,i])=>(r[o]=t(i,o),r),{})}function me(e,n){return e.reduce((t,r,o)=>(t[r]=n[o],t),{})}var v="\0";var F="3.0.0";var z=class{constructor(){ce(this,"_sentinel");let n={};n._next=n._prev=n,this._sentinel=n}dequeue(){let n=this._sentinel,t=n._prev;if(t!==n)return Le(t),t}enqueue(n){let t=this._sentinel;n._prev&&n._next&&Le(n),n._next=t._next,t._next._prev=n,t._next=n,n._prev=t}toString(){let n=[],t=this._sentinel,r=t._prev;for(;r!==t;)n.push(JSON.stringify(r,un)),r=r._prev;return"["+n.join(", ")+"]"}};function Le(e){e._prev._next=e._next,e._next._prev=e._prev,delete e._next,delete e._prev}function un(e,n){if(e!=="_next"&&e!=="_prev")return n}var Ee=z;var cn=()=>1;function K(e,n){if(e.nodeCount()<=1)return[];let t=fn(e,n||cn);return bn(t.graph,t.buckets,t.zeroIdx).flatMap(o=>e.outEdges(o.v,o.w)||[])}function bn(e,n,t){var s;let r=[],o=n[n.length-1],i=n[0],a;for(;e.nodeCount();){for(;a=i.dequeue();)X(e,n,t,a);for(;a=o.dequeue();)X(e,n,t,a);if(e.nodeCount()){for(let d=n.length-2;d>0;--d)if(a=(s=n[d])==null?void 0:s.dequeue(),a){r=r.concat(X(e,n,t,a,!0)||[]);break}}}return r}function X(e,n,t,r,o){let i=[],a=o?i:void 0;return(e.inEdges(r.v)||[]).forEach(s=>{let d=e.edge(s),l=e.node(s.v);o&&i.push({v:s.v,w:s.w}),l.out-=d,U(n,t,l)}),(e.outEdges(r.v)||[]).forEach(s=>{let d=e.edge(s),l=s.w,u=e.node(l);u.in-=d,U(n,t,u)}),e.removeNode(r.v),a}function fn(e,n){let t=new p.Graph,r=0,o=0;e.nodes().forEach(s=>{t.setNode(s,{v:s,in:0,out:0})}),e.edges().forEach(s=>{let d=t.edge(s.v,s.w)||0,l=n(s),u=d+l;t.setEdge(s.v,s.w,u);let c=t.node(s.v),f=t.node(s.w);o=Math.max(o,c.out+=l),r=Math.max(r,f.in+=l)});let i=hn(o+r+3).map(()=>new Ee),a=r+1;return t.nodes().forEach(s=>{U(i,a,t.node(s))}),{graph:t,buckets:i,zeroIdx:a}}function U(e,n,t){var r,o,i;t.out?t.in?(i=e[t.out-t.in+n])==null||i.enqueue(t):(o=e[e.length-1])==null||o.enqueue(t):(r=e[0])==null||r.enqueue(t)}function hn(e){let n=[];for(let t=0;t<e;t++)n.push(t);return n}function ye(e){(e.graph().acyclicer==="greedy"?K(e,t(e)):gn(e)).forEach(r=>{let o=e.edge(r);e.removeEdge(r),o.forwardName=r.name,o.reversed=!0,e.setEdge(r.w,r.v,o,C("rev"))});function t(r){return o=>r.edge(o).weight}}function gn(e){let n=[],t={},r={};function o(i){Object.hasOwn(r,i)||(r[i]=!0,t[i]=!0,e.outEdges(i).forEach(a=>{Object.hasOwn(t,a.w)?n.push(a):o(a.w)}),delete t[i])}return e.nodes().forEach(o),n}function Ne(e){e.edges().forEach(n=>{let t=e.edge(n);if(t.reversed){e.removeEdge(n);let r=t.forwardName;delete t.reversed,delete t.forwardName,e.setEdge(n.w,n.v,t,r)}})}function Ge(e){e.graph().dummyChains=[],e.edges().forEach(n=>mn(e,n))}function mn(e,n){let t=n.v,r=e.node(t).rank,o=n.w,i=e.node(o).rank,a=n.name,s=e.edge(n),d=s.labelRank;if(i===r+1)return;e.removeEdge(n);let l,u,c;for(c=0,++r;r<i;++c,++r)s.points=[],u={width:0,height:0,edgeLabel:s,edgeObj:n,rank:r},l=N(e,"edge",u,"_d"),r===d&&(u.width=s.width,u.height=s.height,u.dummy="edge-label",u.labelpos=s.labelpos),e.setEdge(t,l,{weight:s.weight},a),c===0&&e.graph().dummyChains.push(l),t=l;e.setEdge(t,o,{weight:s.weight},a)}function we(e){e.graph().dummyChains.forEach(n=>{let t=e.node(n),r=t.edgeLabel,o;for(e.setEdge(t.edgeObj,r);t.dummy;)o=e.successors(n)[0],e.removeNode(n),r.points.push({x:t.x,y:t.y}),t.dummy==="edge-label"&&(r.x=t.x,r.y=t.y,r.width=t.width,r.height=t.height),n=o,t=e.node(n)})}function j(e){let n={};function t(r){let o=e.node(r);if(Object.hasOwn(n,r))return o.rank;n[r]=!0;let i=e.outEdges(r),a=i?i.map(d=>d==null?Number.POSITIVE_INFINITY:t(d.w)-e.edge(d).minlen):[],s=E(Math.min,a);return s===Number.POSITIVE_INFINITY&&(s=0),o.rank=s}e.sources().forEach(t)}function x(e,n){return e.node(n.w).rank-e.node(n.v).rank-e.edge(n).minlen}var A=En;function En(e){let n=new p.Graph({directed:!1}),t=e.nodes();if(t.length===0)throw new Error("Graph must have at least one node");let r=t[0],o=e.nodeCount();n.setNode(r,{});let i,a;for(;yn(n,e)<o&&(i=Nn(n,e),!!i);)a=n.hasNode(i.v)?x(e,i):-x(e,i),Gn(n,e,a);return n}function yn(e,n){function t(r){let o=n.nodeEdges(r);o&&o.forEach(i=>{let a=i.v,s=r===a?i.w:a;!e.hasNode(s)&&!x(n,i)&&(e.setNode(s,{}),e.setEdge(r,s,{}),t(s))})}return e.nodes().forEach(t),e.nodeCount()}function Nn(e,n){return n.edges().reduce((r,o)=>{let i=Number.POSITIVE_INFINITY;return e.hasNode(o.v)!==e.hasNode(o.w)&&(i=x(n,o)),i<r[0]?[i,o]:r},[Number.POSITIVE_INFINITY,null])[1]}function Gn(e,n,t){e.nodes().forEach(r=>n.node(r).rank+=t)}var{preorder:wn,postorder:kn}=p.alg,xe=T;T.initLowLimValues=Q;T.initCutValues=J;T.calcCutValue=ve;T.leaveEdge=Oe;T.enterEdge=Re;T.exchangeEdges=Pe;function T(e){e=be(e),j(e);let n=A(e);Q(n),J(n,e);let t,r;for(;t=Oe(n);)r=Re(n,e,t),Pe(n,e,t,r)}function J(e,n){let t=kn(e,e.nodes());t=t.slice(0,t.length-1),t.forEach(r=>xn(e,n,r))}function xn(e,n,t){let o=e.node(t).parent,i=e.edge(t,o);i.cutvalue=ve(e,n,t)}function ve(e,n,t){let o=e.node(t).parent,i=!0,a=n.edge(t,o),s=0;a||(i=!1,a=n.edge(o,t)),s=a.weight;let d=n.nodeEdges(t);return d&&d.forEach(l=>{let u=l.v===t,c=u?l.w:l.v;if(c!==o){let f=u===i,b=n.edge(l).weight;if(s+=f?b:-b,Tn(e,t,c)){let h=e.edge(t,c).cutvalue;s+=f?-h:h}}}),s}function Q(e,n){arguments.length<2&&(n=e.nodes()[0]),Te(e,{},1,n)}function Te(e,n,t,r,o){let i=t,a=e.node(r);n[r]=!0;let s=e.neighbors(r);return s&&s.forEach(d=>{Object.hasOwn(n,d)||(t=Te(e,n,t,d,r))}),a.low=i,a.lim=t++,o?a.parent=o:delete a.parent,t}function Oe(e){return e.edges().find(n=>e.edge(n).cutvalue<0)}function Re(e,n,t){let r=t.v,o=t.w;n.hasEdge(r,o)||(r=t.w,o=t.v);let i=e.node(r),a=e.node(o),s=i,d=!1;return i.lim>a.lim&&(s=a,d=!0),n.edges().filter(u=>d===ke(e,e.node(u.v),s)&&d!==ke(e,e.node(u.w),s)).reduce((u,c)=>x(n,c)<x(n,u)?c:u)}function Pe(e,n,t,r){let o=t.v,i=t.w;e.removeEdge(o,i),e.setEdge(r.v,r.w,{}),Q(e),J(e,n),vn(e,n)}function vn(e,n){let t=e.nodes().find(o=>!e.node(o).parent);if(!t)return;let r=wn(e,[t]);r=r.slice(1),r.forEach(o=>{let a=e.node(o).parent,s=n.edge(o,a),d=!1;s||(s=n.edge(a,o),d=!0),n.node(o).rank=n.node(a).rank+(d?s.minlen:-s.minlen)})}function Tn(e,n,t){return e.hasEdge(n,t)}function ke(e,n,t){return t.low<=n.lim&&n.lim<=t.lim}var Se=On;function On(e){let n=e.graph().ranker;if(typeof n=="function")return n(e);switch(n){case"network-simplex":Me(e);break;case"tight-tree":Pn(e);break;case"longest-path":Rn(e);break;case"none":break;default:Me(e)}}var Rn=j;function Pn(e){j(e),A(e)}function Me(e){xe(e)}var Ie=Mn;function Mn(e){let n=In(e);e.graph().dummyChains.forEach(t=>{let r=e.node(t),o=r.edgeObj,i=Sn(e,n,o.v,o.w),a=i.path,s=i.lca,d=0,l=a[d],u=!0;for(;t!==o.w;){if(r=e.node(t),u){for(;(l=a[d])!==s&&e.node(l).maxRank<r.rank;)d++;l===s&&(u=!1)}if(!u){for(;d<a.length-1&&e.node(a[d+1]).minRank<=r.rank;)d++;l=a[d]}l!==void 0&&e.setParent(t,l),t=e.successors(t)[0]}})}function Sn(e,n,t,r){let o=[],i=[],a=Math.min(n[t].low,n[r].low),s=Math.max(n[t].lim,n[r].lim),d;d=t;do d=e.parent(d),o.push(d);while(d&&(n[d].low>a||s>n[d].lim));let l=d,u=r;for(;(u=e.parent(u))!==l;)i.push(u);return{path:o.concat(i.reverse()),lca:l}}function In(e){let n={},t=0;function r(o){let i=t;e.children(o).forEach(r),n[o]={low:i,lim:t++}}return e.children(v).forEach(r),n}function Ce(e){let n=N(e,"root",{},"_root"),t=Cn(e),r=Object.values(t),o=E(Math.max,r)-1,i=2*o+1;e.graph().nestingRoot=n,e.edges().forEach(s=>e.edge(s).minlen*=i);let a=jn(e)+1;e.children(v).forEach(s=>je(e,n,i,a,o,t,s)),e.graph().nodeRankFactor=i}function je(e,n,t,r,o,i,a){var c;let s=e.children(a);if(!s.length){a!==n&&e.setEdge(n,a,{weight:0,minlen:t});return}let d=H(e,"_bt"),l=H(e,"_bb"),u=e.node(a);e.setParent(d,a),u.borderTop=d,e.setParent(l,a),u.borderBottom=l,s.forEach(f=>{var y;je(e,n,t,r,o,i,f);let b=e.node(f),g=b.borderTop?b.borderTop:f,h=b.borderBottom?b.borderBottom:f,m=b.borderTop?r:2*r,L=g!==h?1:o-((y=i[a])!=null?y:0)+1;e.setEdge(d,g,{weight:m,minlen:L,nestingEdge:!0}),e.setEdge(h,l,{weight:m,minlen:L,nestingEdge:!0})}),e.parent(a)||e.setEdge(n,d,{weight:0,minlen:o+((c=i[a])!=null?c:0)})}function Cn(e){let n={};function t(r,o){let i=e.children(r);i&&i.length&&i.forEach(a=>t(a,o+1)),n[r]=o}return e.children(v).forEach(r=>t(r,1)),n}function jn(e){return e.edges().reduce((n,t)=>n+e.edge(t).weight,0)}function _e(e){let n=e.graph();e.removeNode(n.nestingRoot),delete n.nestingRoot,e.edges().forEach(t=>{e.edge(t).nestingEdge&&e.removeEdge(t)})}var Ae=Fn;function Fn(e){function n(t){let r=e.children(t),o=e.node(t);if(r.length&&r.forEach(n),Object.hasOwn(o,"minRank")){o.borderLeft=[],o.borderRight=[];for(let i=o.minRank,a=o.maxRank+1;i<a;++i)Fe(e,"borderLeft","_bl",t,o,i),Fe(e,"borderRight","_br",t,o,i)}}e.children(v).forEach(n)}function Fe(e,n,t,r,o,i){let a={width:0,height:0,rank:i,borderType:n},s=o[n][i-1],d=N(e,"border",a,t);o[n][i]=d,e.setParent(d,r),s&&e.setEdge(s,d,{weight:1})}function We(e){var t;let n=(t=e.graph().rankdir)==null?void 0:t.toLowerCase();(n==="lr"||n==="rl")&&De(e)}function Be(e){var t;let n=(t=e.graph().rankdir)==null?void 0:t.toLowerCase();(n==="bt"||n==="rl")&&An(e),(n==="lr"||n==="rl")&&(Vn(e),De(e))}function De(e){e.nodes().forEach(n=>Ve(e.node(n))),e.edges().forEach(n=>Ve(e.edge(n)))}function Ve(e){let n=e.width;e.width=e.height,e.height=n}function An(e){e.nodes().forEach(n=>Z(e.node(n))),e.edges().forEach(n=>{var r;let t=e.edge(n);(r=t.points)==null||r.forEach(Z),Object.hasOwn(t,"y")&&Z(t)})}function Z(e){e.y=-e.y}function Vn(e){e.nodes().forEach(n=>$(e.node(n))),e.edges().forEach(n=>{var r;let t=e.edge(n);(r=t.points)==null||r.forEach($),Object.hasOwn(t,"x")&&$(t)})}function $(e){let n=e.x;e.x=e.y,e.y=n}function ee(e){let n={},t=e.nodes().filter(d=>!e.children(d).length),r=t.map(d=>e.node(d).rank),o=E(Math.max,r),i=k(o+1).map(()=>[]);function a(d){if(n[d])return;n[d]=!0;let l=e.node(d);i[l.rank].push(d);let u=e.successors(d);u&&u.forEach(a)}return t.sort((d,l)=>e.node(d).rank-e.node(l).rank).forEach(a),i}function ne(e,n){let t=0;for(let r=1;r<n.length;++r)t+=Bn(e,n[r-1],n[r]);return t}function Bn(e,n,t){let r=me(t,t.map((l,u)=>u)),o=n.flatMap(l=>{let u=e.outEdges(l);return u?u.map(c=>({pos:r[c.w],weight:e.edge(c).weight})).sort((c,f)=>c.pos-f.pos):[]}),i=1;for(;i<t.length;)i<<=1;let a=2*i-1;i-=1;let s=new Array(a).fill(0),d=0;return o.forEach(l=>{let u=l.pos+i;s[u]+=l.weight;let c=0;for(;u>0;)u%2&&(c+=s[u+1]),u=u-1>>1,s[u]+=l.weight;d+=l.weight*c}),d}function te(e,n=[]){return n.map(t=>{let r=e.inEdges(t);if(!r||!r.length)return{v:t};{let o=r.reduce((i,a)=>{let s=e.edge(a),d=e.node(a.v);return{sum:i.sum+s.weight*d.order,weight:i.weight+s.weight}},{sum:0,weight:0});return{v:t,barycenter:o.sum/o.weight,weight:o.weight}}})}function re(e,n){let t={};e.forEach((o,i)=>{let a={indegree:0,in:[],out:[],vs:[o.v],i};o.barycenter!==void 0&&(a.barycenter=o.barycenter,a.weight=o.weight),t[o.v]=a}),n.edges().forEach(o=>{let i=t[o.v],a=t[o.w];i!==void 0&&a!==void 0&&(a.indegree++,i.out.push(a))});let r=Object.values(t).filter(o=>!o.indegree);return Dn(r)}function Dn(e){let n=[];function t(o){return i=>{i.merged||(i.barycenter===void 0||o.barycenter===void 0||i.barycenter>=o.barycenter)&&Yn(o,i)}}function r(o){return i=>{i.in.push(o),--i.indegree===0&&e.push(i)}}for(;e.length;){let o=e.pop();n.push(o),o.in.reverse().forEach(t(o)),o.out.forEach(r(o))}return n.filter(o=>!o.merged).map(o=>O(o,["vs","i","barycenter","weight"]))}function Yn(e,n){let t=0,r=0;e.weight&&(t+=e.barycenter*e.weight,r+=e.weight),n.weight&&(t+=n.barycenter*n.weight,r+=n.weight),e.vs=n.vs.concat(e.vs),e.barycenter=t/r,e.weight=r,e.i=Math.min(n.i,e.i),n.merged=!0}function oe(e,n){let t=pe(e,u=>Object.hasOwn(u,"barycenter")),r=t.lhs,o=t.rhs.sort((u,c)=>c.i-u.i),i=[],a=0,s=0,d=0;r.sort(Hn(!!n)),d=Ye(i,o,d),r.forEach(u=>{d+=u.vs.length,i.push(u.vs),a+=u.barycenter*u.weight,s+=u.weight,d=Ye(i,o,d)});let l={vs:i.flat(1)};return s&&(l.barycenter=a/s,l.weight=s),l}function Ye(e,n,t){let r;for(;n.length&&(r=n[n.length-1]).i<=t;)n.pop(),e.push(r.vs),t++;return t}function Hn(e){return(n,t)=>n.barycenter<t.barycenter?-1:n.barycenter>t.barycenter?1:e?t.i-n.i:n.i-t.i}function V(e,n,t,r){let o=e.children(n),i=e.node(n),a=i?i.borderLeft:void 0,s=i?i.borderRight:void 0,d={};a&&(o=o.filter(f=>f!==a&&f!==s));let l=te(e,o);l.forEach(f=>{if(e.children(f.v).length){let b=V(e,f.v,t,r);d[f.v]=b,Object.hasOwn(b,"barycenter")&&zn(f,b)}});let u=re(l,t);qn(u,d);let c=oe(u,r);if(a&&s){c.vs=[a,c.vs,s].flat(1);let f=e.predecessors(a);if(f&&f.length){let b=e.node(f[0]),g=e.predecessors(s),h=e.node(g[0]);Object.hasOwn(c,"barycenter")||(c.barycenter=0,c.weight=0),c.barycenter=(c.barycenter*c.weight+b.order+h.order)/(c.weight+2),c.weight+=2}}return c}function qn(e,n){e.forEach(t=>{t.vs=t.vs.flatMap(r=>n[r]?n[r].vs:r)})}function zn(e,n){e.barycenter!==void 0?(e.barycenter=(e.barycenter*e.weight+n.barycenter*n.weight)/(e.weight+n.weight),e.weight+=n.weight):(e.barycenter=n.barycenter,e.weight=n.weight)}function ie(e,n,t,r){r||(r=e.nodes());let o=Xn(e),i=new p.Graph({compound:!0}).setGraph({root:o}).setDefaultNodeLabel(a=>e.node(a));return r.forEach(a=>{let s=e.node(a),d=e.parent(a);if(s.rank===n||s.minRank<=n&&n<=s.maxRank){i.setNode(a),i.setParent(a,d||o);let l=e[t](a);l&&l.forEach(u=>{let c=u.v===a?u.w:u.v,f=i.edge(c,a),b=f!==void 0?f.weight:0;i.setEdge(c,a,{weight:e.edge(u).weight+b})}),Object.hasOwn(s,"minRank")&&i.setNode(a,{borderLeft:s.borderLeft[n],borderRight:s.borderRight[n]})}}),i}function Xn(e){let n;for(;e.hasNode(n=C("_root")););return n}function ae(e,n,t){let r={},o;t.forEach(i=>{let a=e.parent(i),s,d;for(;a;){if(s=e.parent(a),s?(d=r[s],r[s]=a):(d=o,o=a),d&&d!==a){n.setEdge(d,a);return}a=s}})}function W(e,n={}){if(typeof n.customOrder=="function"){n.customOrder(e,W);return}let t=q(e),r=He(e,k(1,t+1),"inEdges"),o=He(e,k(t-1,-1,-1),"outEdges"),i=ee(e);if(qe(e,i),n.disableOptimalOrderHeuristic)return;let a=Number.POSITIVE_INFINITY,s,d=n.constraints||[];for(let l=0,u=0;u<4;++l,++u){Un(l%2?r:o,l%4>=2,d),i=G(e);let c=ne(e,i);c<a?(u=0,s=Object.assign({},i),a=c):c===a&&(s=structuredClone(i))}qe(e,s)}function He(e,n,t){let r=new Map,o=(i,a)=>{r.has(i)||r.set(i,[]),r.get(i).push(a)};for(let i of e.nodes()){let a=e.node(i);if(typeof a.rank=="number"&&o(a.rank,i),typeof a.minRank=="number"&&typeof a.maxRank=="number")for(let s=a.minRank;s<=a.maxRank;s++)s!==a.rank&&o(s,i)}return n.map(function(i){return ie(e,i,t,r.get(i)||[])})}function Un(e,n,t){let r=new p.Graph;e.forEach(function(o){t.forEach(s=>r.setEdge(s.left,s.right));let i=o.graph().root,a=V(o,i,r,n);a.vs.forEach((s,d)=>o.node(s).order=d),ae(o,r,a.vs)})}function qe(e,n){Object.values(n).forEach(t=>t.forEach((r,o)=>e.node(r).order=o))}function Kn(e,n){let t={};function r(o,i){let a=0,s=0,d=o.length,l=i[i.length-1];return i.forEach((u,c)=>{let f=Qn(e,u),b=f?e.node(f).order:d;(f||u===l)&&(i.slice(s,c+1).forEach(g=>{let h=e.predecessors(g);h&&h.forEach(m=>{let L=e.node(m),y=L.order;(y<a||b<y)&&!(L.dummy&&e.node(g).dummy)&&ze(t,m,g)})}),s=c+1,a=b)}),i}return n.length&&n.reduce(r),t}function Jn(e,n){let t={};function r(i,a,s,d,l){k(a,s).forEach(u=>{let c=i[u];if(c!==void 0&&e.node(c).dummy){let f=e.predecessors(c);f&&f.forEach(b=>{if(b===void 0)return;let g=e.node(b);g.dummy&&(g.order<d||g.order>l)&&ze(t,b,c)})}})}function o(i,a){let s=-1,d=-1,l=0;return a.forEach((u,c)=>{if(e.node(u).dummy==="border"){let f=e.predecessors(u);if(f&&f.length){let b=f[0];if(b===void 0)return;d=e.node(b).order,r(a,l,c,s,d),l=c,s=d}}r(a,l,a.length,d,i.length)}),a}return n.length&&n.reduce(o),t}function Qn(e,n){if(e.node(n).dummy){let t=e.predecessors(n);if(t)return t.find(r=>e.node(r).dummy)}}function ze(e,n,t){if(n>t){let o=n;n=t,t=o}let r=e[n];r||(e[n]=r={}),r[t]=!0}function Zn(e,n,t){if(n>t){let o=n;n=t,t=o}let r=e[n];return r!==void 0&&Object.hasOwn(r,t)}function $n(e,n,t,r){let o={},i={},a={};return n.forEach(s=>{s.forEach((d,l)=>{o[d]=d,i[d]=d,a[d]=l})}),n.forEach(s=>{let d=-1;s.forEach(l=>{let u=r(l);if(u&&u.length){let c=u.sort((b,g)=>{let h=a[b],m=a[g];return(h!==void 0?h:0)-(m!==void 0?m:0)}),f=(c.length-1)/2;for(let b=Math.floor(f),g=Math.ceil(f);b<=g;++b){let h=c[b];if(h===void 0)continue;let m=a[h];if(m!==void 0&&i[l]===l&&d<m&&!Zn(t,l,h)){let L=o[h];L!==void 0&&(i[h]=l,i[l]=o[l]=L,d=m)}}}})}),{root:o,align:i}}function et(e,n,t,r,o=!1){let i={},a=nt(e,n,t,o),s=o?"borderLeft":"borderRight";function d(b,g){let h=a.nodes().slice(),m={},L=h.pop();for(;L;){if(m[L])b(L);else{m[L]=!0,h.push(L);for(let y of g(L))h.push(y)}L=h.pop()}}function l(b){let g=a.inEdges(b);g?i[b]=g.reduce((h,m)=>{var P;let L=(P=i[m.v])!=null?P:0,y=a.edge(m);return Math.max(h,L+(y!==void 0?y:0))},0):i[b]=0}function u(b){let g=a.outEdges(b),h=Number.POSITIVE_INFINITY;g&&(h=g.reduce((L,y)=>{let P=i[y.w],le=a.edge(y);return Math.min(L,(P!==void 0?P:0)-(le!==void 0?le:0))},Number.POSITIVE_INFINITY));let m=e.node(b);h!==Number.POSITIVE_INFINITY&&m.borderType!==s&&(i[b]=Math.max(i[b]!==void 0?i[b]:0,h))}function c(b){return a.predecessors(b)||[]}function f(b){return a.successors(b)||[]}return d(l,c),d(u,f),Object.keys(r).forEach(b=>{var h;let g=t[b];g!==void 0&&(i[b]=(h=i[g])!=null?h:0)}),i}function nt(e,n,t,r){let o=new p.Graph,i=e.graph(),a=it(i.nodesep,i.edgesep,r);return n.forEach(s=>{let d;s.forEach(l=>{let u=t[l];if(u!==void 0){if(o.setNode(u),d!==void 0){let c=t[d];if(c!==void 0){let f=o.edge(c,u);o.setEdge(c,u,Math.max(a(e,l,d),f||0))}}d=l}})}),o}function tt(e,n){return Object.values(n).reduce((t,r)=>{let o=Number.NEGATIVE_INFINITY,i=Number.POSITIVE_INFINITY;Object.entries(r).forEach(([s,d])=>{let l=at(e,s)/2;o=Math.max(d+l,o),i=Math.min(d-l,i)});let a=o-i;return a<t[0]&&(t=[a,r]),t},[Number.POSITIVE_INFINITY,null])[1]}function rt(e,n){let t=Object.values(n),r=E(Math.min,t),o=E(Math.max,t);["u","d"].forEach(i=>{["l","r"].forEach(a=>{let s=i+a,d=e[s];if(!d||d===n)return;let l=Object.values(d),u=r-E(Math.min,l);a!=="l"&&(u=o-E(Math.max,l)),u&&(e[s]=R(d,c=>c+u))})})}function ot(e,n=void 0){let t=e.ul;return t?R(t,(r,o)=>{var a,s;if(n){let d=n.toLowerCase(),l=e[d];if(l&&l[o]!==void 0)return l[o]}let i=Object.values(e).map(d=>{let l=d[o];return l!==void 0?l:0}).sort((d,l)=>d-l);return(((a=i[1])!=null?a:0)+((s=i[2])!=null?s:0))/2}):{}}function Xe(e){let n=G(e),t=Object.assign(Kn(e,n),Jn(e,n)),r={},o;["u","d"].forEach(a=>{o=a==="u"?n:Object.values(n).reverse(),["l","r"].forEach(s=>{s==="r"&&(o=o.map(c=>Object.values(c).reverse()));let l=$n(e,o,t,c=>(a==="u"?e.predecessors(c):e.successors(c))||[]),u=et(e,o,l.root,l.align,s==="r");s==="r"&&(u=R(u,c=>-c)),r[a+s]=u})});let i=tt(e,r);return rt(r,i),ot(r,e.graph().align)}function it(e,n,t){return(r,o,i)=>{let a=r.node(o),s=r.node(i),d=0,l;if(d+=a.width/2,Object.hasOwn(a,"labelpos"))switch(a.labelpos.toLowerCase()){case"l":l=-a.width/2;break;case"r":l=a.width/2;break}if(l&&(d+=t?l:-l),l=void 0,d+=(a.dummy?n:e)/2,d+=(s.dummy?n:e)/2,d+=s.width/2,Object.hasOwn(s,"labelpos"))switch(s.labelpos.toLowerCase()){case"l":l=s.width/2;break;case"r":l=-s.width/2;break}return l&&(d+=t?l:-l),d}}function at(e,n){return e.node(n).width}function Ue(e){e=_(e),st(e),Object.entries(Xe(e)).forEach(([n,t])=>e.node(n).x=t)}function st(e){let n=G(e),t=e.graph(),r=t.ranksep,o=t.rankalign,i=0;n.forEach(a=>{let s=a.reduce((d,l)=>{var c;let u=(c=e.node(l).height)!=null?c:0;return d>u?d:u},0);a.forEach(d=>{let l=e.node(d);o==="top"?l.y=i+l.height/2:o==="bottom"?l.y=i+s-l.height/2:l.y=i+s/2}),i+=s+r})}function B(e,n={}){let t=n.debugTiming?S:I;return t("layout",()=>{let r=t("  buildLayoutGraph",()=>mt(e));return t("  runLayout",()=>dt(r,t,n)),t("  updateInputGraph",()=>lt(e,r)),r})}function dt(e,n,t){n("    makeSpaceForEdgeLabels",()=>Lt(e)),n("    removeSelfEdges",()=>Tt(e)),n("    acyclic",()=>ye(e)),n("    nestingGraph.run",()=>Ce(e)),n("    rank",()=>Se(_(e))),n("    injectEdgeLabelProxies",()=>Et(e)),n("    removeEmptyRanks",()=>he(e)),n("    nestingGraph.cleanup",()=>_e(e)),n("    normalizeRanks",()=>fe(e)),n("    assignRankMinMax",()=>yt(e)),n("    removeEdgeLabelProxies",()=>Nt(e)),n("    normalize.run",()=>Ge(e)),n("    parentDummyChains",()=>Ie(e)),n("    addBorderSegments",()=>Ae(e)),n("    order",()=>W(e,t)),n("    insertSelfEdges",()=>Ot(e)),n("    adjustCoordinateSystem",()=>We(e)),n("    position",()=>Ue(e)),n("    positionSelfEdges",()=>Rt(e)),n("    removeBorderNodes",()=>vt(e)),n("    normalize.undo",()=>we(e)),n("    fixupEdgeLabelCoords",()=>kt(e)),n("    undoCoordinateSystem",()=>Be(e)),n("    translateGraph",()=>Gt(e)),n("    assignNodeIntersects",()=>wt(e)),n("    reversePoints",()=>xt(e)),n("    acyclic.undo",()=>Ne(e))}function lt(e,n){e.nodes().forEach(t=>{let r=e.node(t),o=n.node(t);r&&(r.x=o.x,r.y=o.y,r.order=o.order,r.rank=o.rank,n.children(t).length&&(r.width=o.width,r.height=o.height))}),e.edges().forEach(t=>{let r=e.edge(t),o=n.edge(t);r.points=o.points,Object.hasOwn(o,"x")&&(r.x=o.x,r.y=o.y)}),e.graph().width=n.graph().width,e.graph().height=n.graph().height}var ut=["nodesep","edgesep","ranksep","marginx","marginy"],ct={ranksep:50,edgesep:20,nodesep:50,rankdir:"TB",rankalign:"center"},bt=["acyclicer","ranker","rankdir","align","rankalign"],ft=["width","height","rank"],Ke={width:0,height:0},ht=["minlen","weight","width","height","labeloffset"],gt={minlen:1,weight:1,width:0,height:0,labeloffset:10,labelpos:"r"},pt=["labelpos"];function mt(e){let n=new p.Graph({multigraph:!0,compound:!0}),t=de(e.graph());return n.setGraph(Object.assign({},ct,se(t,ut),O(t,bt))),e.nodes().forEach(r=>{let o=de(e.node(r)),i=se(o,ft);Object.keys(Ke).forEach(s=>{i[s]===void 0&&(i[s]=Ke[s])}),n.setNode(r,i);let a=e.parent(r);a!==void 0&&n.setParent(r,a)}),e.edges().forEach(r=>{let o=de(e.edge(r));n.setEdge(r,Object.assign({},gt,se(o,ht),O(o,pt)))}),n}function Lt(e){let n=e.graph();n.ranksep/=2,e.edges().forEach(t=>{let r=e.edge(t);r.minlen*=2,r.labelpos.toLowerCase()!=="c"&&(n.rankdir==="TB"||n.rankdir==="BT"?r.width+=r.labeloffset:r.height+=r.labeloffset)})}function Et(e){e.edges().forEach(n=>{let t=e.edge(n);if(t.width&&t.height){let r=e.node(n.v),i={rank:(e.node(n.w).rank-r.rank)/2+r.rank,e:n};N(e,"edge-proxy",i,"_ep")}})}function yt(e){let n=0;e.nodes().forEach(t=>{let r=e.node(t);r.borderTop&&(r.minRank=e.node(r.borderTop).rank,r.maxRank=e.node(r.borderBottom).rank,n=Math.max(n,r.maxRank))}),e.graph().maxRank=n}function Nt(e){e.nodes().forEach(n=>{let t=e.node(n);if(t.dummy==="edge-proxy"){let r=t;e.edge(r.e).labelRank=t.rank,e.removeNode(n)}})}function Gt(e){let n=Number.POSITIVE_INFINITY,t=0,r=Number.POSITIVE_INFINITY,o=0,i=e.graph(),a=i.marginx||0,s=i.marginy||0;function d(l){let u=l.x,c=l.y,f=l.width,b=l.height;n=Math.min(n,u-f/2),t=Math.max(t,u+f/2),r=Math.min(r,c-b/2),o=Math.max(o,c+b/2)}e.nodes().forEach(l=>d(e.node(l))),e.edges().forEach(l=>{let u=e.edge(l);Object.hasOwn(u,"x")&&d(u)}),n-=a,r-=s,e.nodes().forEach(l=>{let u=e.node(l);u.x-=n,u.y-=r}),e.edges().forEach(l=>{let u=e.edge(l);u.points.forEach(c=>{c.x-=n,c.y-=r}),Object.hasOwn(u,"x")&&(u.x-=n),Object.hasOwn(u,"y")&&(u.y-=r)}),i.width=t-n+a,i.height=o-r+s}function wt(e){e.edges().forEach(n=>{let t=e.edge(n),r=e.node(n.v),o=e.node(n.w),i,a;t.points?(i=t.points[0],a=t.points[t.points.length-1]):(t.points=[],i=o,a=r),t.points.unshift(Y(r,i)),t.points.push(Y(o,a))})}function kt(e){e.edges().forEach(n=>{let t=e.edge(n);if(Object.hasOwn(t,"x"))switch((t.labelpos==="l"||t.labelpos==="r")&&(t.width-=t.labeloffset),t.labelpos){case"l":t.x-=t.width/2+t.labeloffset;break;case"r":t.x+=t.width/2+t.labeloffset;break}})}function xt(e){e.edges().forEach(n=>{let t=e.edge(n);t.reversed&&t.points.reverse()})}function vt(e){e.nodes().forEach(n=>{if(e.children(n).length){let t=e.node(n),r=e.node(t.borderTop),o=e.node(t.borderBottom),i=e.node(t.borderLeft[t.borderLeft.length-1]),a=e.node(t.borderRight[t.borderRight.length-1]);t.width=Math.abs(a.x-i.x),t.height=Math.abs(o.y-r.y),t.x=i.x+t.width/2,t.y=r.y+t.height/2}}),e.nodes().forEach(n=>{e.node(n).dummy==="border"&&e.removeNode(n)})}function Tt(e){e.edges().forEach(n=>{if(n.v===n.w){let t=e.node(n.v);t.selfEdges||(t.selfEdges=[]),t.selfEdges.push({e:n,label:e.edge(n)}),e.removeEdge(n)}})}function Ot(e){G(e).forEach(t=>{let r=0;t.forEach((o,i)=>{let a=e.node(o);a.order=i+r,(a.selfEdges||[]).forEach(s=>{N(e,"selfedge",{width:s.label.width,height:s.label.height,rank:a.rank,order:i+ ++r,e:s.e,label:s.label},"_se")}),delete a.selfEdges})})}function Rt(e){e.nodes().forEach(n=>{let t=e.node(n);if(t.dummy==="selfedge"){let r=t,o=e.node(r.e.v),i=o.x+o.width/2,a=o.y,s=t.x-i,d=o.height/2;e.setEdge(r.e,r.label),e.removeNode(n),r.label.points=[{x:i+2*s/3,y:a-d},{x:i+5*s/6,y:a-d},{x:i+s,y:a},{x:i+5*s/6,y:a+d},{x:i+2*s/3,y:a+d}],r.label.x=t.x,r.label.y=t.y}})}function se(e,n){return R(O(e,n),Number)}function de(e){let n={};return e&&Object.entries(e).forEach(([t,r])=>{typeof t=="string"&&(t=t.toLowerCase()),n[t]=r}),n}function D(e){let n=G(e),t=new p.Graph({compound:!0,multigraph:!0}).setGraph({});return e.nodes().forEach(r=>{t.setNode(r,{label:r}),t.setParent(r,"layer"+e.node(r).rank)}),e.edges().forEach(r=>t.setEdge(r.v,r.w,{},r.name)),n.forEach((r,o)=>{let i="layer"+o;t.setNode(i,{rank:"same"}),r.reduce((a,s)=>(t.setEdge(a,s,{style:"invis"}),s))}),t}var Qe=__webpack_require__(413);var Pt={time:S,notime:I},Mt={graphlib:Je,version:F,layout:B,debug:D,util:{time:S,notime:I}},St=Mt;0&&(0);
/*! For license information please see dagre.cjs.js.LEGAL.txt */
//# sourceMappingURL=dagre.cjs.js.map


/***/ },

/***/ 413
(module) {

"use strict";
var v=Object.defineProperty;var H=Object.getOwnPropertyDescriptor;var U=Object.getOwnPropertyNames;var Y=Object.prototype.hasOwnProperty;var F=(s,e)=>{for(var t in e)v(s,t,{get:e[t],enumerable:!0})},K=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of U(e))!Y.call(s,i)&&i!==t&&v(s,i,{get:()=>e[i],enumerable:!(r=H(e,i))||r.enumerable});return s};var z=s=>K(v({},"__esModule",{value:!0}),s);var oe={};F(oe,{Graph:()=>l,alg:()=>G,json:()=>m,version:()=>P});module.exports=z(oe);var l=class{constructor(e){this._isDirected=!0;this._isMultigraph=!1;this._isCompound=!1;this._nodes={};this._in={};this._preds={};this._out={};this._sucs={};this._edgeObjs={};this._edgeLabels={};this._nodeCount=0;this._edgeCount=0;this._defaultNodeLabelFn=()=>{};this._defaultEdgeLabelFn=()=>{};e&&(this._isDirected="directed"in e?e.directed:!0,this._isMultigraph="multigraph"in e?e.multigraph:!1,this._isCompound="compound"in e?e.compound:!1),this._isCompound&&(this._parent={},this._children={},this._children["\0"]={})}isDirected(){return this._isDirected}isMultigraph(){return this._isMultigraph}isCompound(){return this._isCompound}setGraph(e){return this._label=e,this}graph(){return this._label}setDefaultNodeLabel(e){return typeof e!="function"?this._defaultNodeLabelFn=()=>e:this._defaultNodeLabelFn=e,this}nodeCount(){return this._nodeCount}nodes(){return Object.keys(this._nodes)}sources(){return this.nodes().filter(e=>Object.keys(this._in[e]).length===0)}sinks(){return this.nodes().filter(e=>Object.keys(this._out[e]).length===0)}setNodes(e,t){return e.forEach(r=>{t!==void 0?this.setNode(r,t):this.setNode(r)}),this}setNode(e,t){return e in this._nodes?(arguments.length>1&&(this._nodes[e]=t),this):(this._nodes[e]=arguments.length>1?t:this._defaultNodeLabelFn(e),this._isCompound&&(this._parent[e]="\0",this._children[e]={},this._children["\0"][e]=!0),this._in[e]={},this._preds[e]={},this._out[e]={},this._sucs[e]={},++this._nodeCount,this)}node(e){return this._nodes[e]}hasNode(e){return e in this._nodes}removeNode(e){if(e in this._nodes){let t=r=>this.removeEdge(this._edgeObjs[r]);delete this._nodes[e],this._isCompound&&(this._removeFromParentsChildList(e),delete this._parent[e],this.children(e).forEach(r=>{this.setParent(r)}),delete this._children[e]),Object.keys(this._in[e]).forEach(t),delete this._in[e],delete this._preds[e],Object.keys(this._out[e]).forEach(t),delete this._out[e],delete this._sucs[e],--this._nodeCount}return this}setParent(e,t){if(!this._isCompound)throw new Error("Cannot set parent in a non-compound graph");if(t===void 0)t="\0";else{t+="";for(let r=t;r!==void 0;r=this.parent(r))if(r===e)throw new Error("Setting "+t+" as parent of "+e+" would create a cycle");this.setNode(t)}return this.setNode(e),this._removeFromParentsChildList(e),this._parent[e]=t,this._children[t][e]=!0,this}parent(e){if(this._isCompound){let t=this._parent[e];if(t!=="\0")return t}}children(e="\0"){if(this._isCompound){let t=this._children[e];if(t)return Object.keys(t)}else{if(e==="\0")return this.nodes();if(this.hasNode(e))return[]}return[]}predecessors(e){let t=this._preds[e];if(t)return Object.keys(t)}successors(e){let t=this._sucs[e];if(t)return Object.keys(t)}neighbors(e){let t=this.predecessors(e);if(t){let r=new Set(t);for(let i of this.successors(e))r.add(i);return Array.from(r.values())}}isLeaf(e){let t;return this.isDirected()?t=this.successors(e):t=this.neighbors(e),t.length===0}filterNodes(e){let t=new this.constructor({directed:this._isDirected,multigraph:this._isMultigraph,compound:this._isCompound});t.setGraph(this.graph()),Object.entries(this._nodes).forEach(([n,o])=>{e(n)&&t.setNode(n,o)}),Object.values(this._edgeObjs).forEach(n=>{t.hasNode(n.v)&&t.hasNode(n.w)&&t.setEdge(n,this.edge(n))});let r={},i=n=>{let o=this.parent(n);return!o||t.hasNode(o)?(r[n]=o!=null?o:void 0,o!=null?o:void 0):o in r?r[o]:i(o)};return this._isCompound&&t.nodes().forEach(n=>t.setParent(n,i(n))),t}setDefaultEdgeLabel(e){return typeof e!="function"?this._defaultEdgeLabelFn=()=>e:this._defaultEdgeLabelFn=e,this}edgeCount(){return this._edgeCount}edges(){return Object.values(this._edgeObjs)}setPath(e,t){return e.reduce((r,i)=>(t!==void 0?this.setEdge(r,i,t):this.setEdge(r,i),i)),this}setEdge(e,t,r,i){let n,o,d,a,c=!1;typeof e=="object"&&e!==null&&"v"in e?(n=e.v,o=e.w,d=e.name,arguments.length===2&&(a=t,c=!0)):(n=e,o=t,d=i,arguments.length>2&&(a=r,c=!0)),n=""+n,o=""+o,d!==void 0&&(d=""+d);let h=b(this._isDirected,n,o,d);if(h in this._edgeLabels)return c&&(this._edgeLabels[h]=a),this;if(d!==void 0&&!this._isMultigraph)throw new Error("Cannot set a named edge when isMultigraph = false");this.setNode(n),this.setNode(o),this._edgeLabels[h]=c?a:this._defaultEdgeLabelFn(n,o,d);let u=Q(this._isDirected,n,o,d);return n=u.v,o=u.w,Object.freeze(u),this._edgeObjs[h]=u,x(this._preds[o],n),x(this._sucs[n],o),this._in[o][h]=u,this._out[n][h]=u,this._edgeCount++,this}edge(e,t,r){let i=arguments.length===1?k(this._isDirected,e):b(this._isDirected,e,t,r);return this._edgeLabels[i]}edgeAsObj(e,t,r){let i=arguments.length===1?this.edge(e):this.edge(e,t,r);return typeof i!="object"?{label:i}:i}hasEdge(e,t,r){return(arguments.length===1?k(this._isDirected,e):b(this._isDirected,e,t,r))in this._edgeLabels}removeEdge(e,t,r){let i=arguments.length===1?k(this._isDirected,e):b(this._isDirected,e,t,r),n=this._edgeObjs[i];if(n){let o=n.v,d=n.w;delete this._edgeLabels[i],delete this._edgeObjs[i],R(this._preds[d],o),R(this._sucs[o],d),delete this._in[d][i],delete this._out[o][i],this._edgeCount--}return this}inEdges(e,t){return this.isDirected()?this.filterEdges(this._in[e],e,t):this.nodeEdges(e,t)}outEdges(e,t){return this.isDirected()?this.filterEdges(this._out[e],e,t):this.nodeEdges(e,t)}nodeEdges(e,t){if(e in this._nodes)return this.filterEdges({...this._in[e],...this._out[e]},e,t)}_removeFromParentsChildList(e){delete this._children[this._parent[e]][e]}filterEdges(e,t,r){if(!e)return;let i=Object.values(e);return r?i.filter(n=>n.v===t&&n.w===r||n.v===r&&n.w===t):i}};function x(s,e){s[e]?s[e]++:s[e]=1}function R(s,e){s[e]!==void 0&&!--s[e]&&delete s[e]}function b(s,e,t,r){let i=""+e,n=""+t;if(!s&&i>n){let o=i;i=n,n=o}return i+""+n+""+(r===void 0?"\0":r)}function Q(s,e,t,r){let i=""+e,n=""+t;if(!s&&i>n){let d=i;i=n,n=d}let o={v:i,w:n};return r&&(o.name=r),o}function k(s,e){return b(s,e.v,e.w,e.name)}var P="4.0.1";var m={};F(m,{read:()=>X,write:()=>$});function $(s){let e={options:{directed:s.isDirected(),multigraph:s.isMultigraph(),compound:s.isCompound()},nodes:q(s),edges:B(s)},t=s.graph();return t!==void 0&&(e.value=structuredClone(t)),e}function q(s){return s.nodes().map(e=>{let t=s.node(e),r=s.parent(e),i={v:e};return t!==void 0&&(i.value=t),r!==void 0&&(i.parent=r),i})}function B(s){return s.edges().map(e=>{let t=s.edge(e),r={v:e.v,w:e.w};return e.name!==void 0&&(r.name=e.name),t!==void 0&&(r.value=t),r})}function X(s){let e=new l(s.options);return s.value!==void 0&&e.setGraph(s.value),s.nodes.forEach(t=>{e.setNode(t.v,t.value),t.parent&&e.setParent(t.v,t.parent)}),s.edges.forEach(t=>{e.setEdge({v:t.v,w:t.w,name:t.name},t.value)}),e}var G={};F(G,{CycleException:()=>p,bellmanFord:()=>y,components:()=>I,dijkstra:()=>E,dijkstraAll:()=>D,findCycles:()=>O,floydWarshall:()=>j,isAcyclic:()=>C,postorder:()=>W,preorder:()=>S,prim:()=>M,shortestPaths:()=>V,tarjan:()=>L,topsort:()=>w});var Z=()=>1;function y(s,e,t,r){return ee(s,String(e),t||Z,r||function(i){return s.outEdges(i)})}function ee(s,e,t,r){let i={},n,o=0,d=s.nodes(),a=function(u){let g=t(u);i[u.v].distance+g<i[u.w].distance&&(i[u.w]={distance:i[u.v].distance+g,predecessor:u.v},n=!0)},c=function(){d.forEach(function(u){r(u).forEach(function(g){let f=g.v===u?g.v:g.w,J=f===g.v?g.w:g.v;a({v:f,w:J})})})};d.forEach(function(u){let g=u===e?0:Number.POSITIVE_INFINITY;i[u]={distance:g,predecessor:""}});let h=d.length;for(let u=1;u<h&&(n=!1,o++,c(),!!n);u++);if(o===h-1&&(n=!1,c(),n))throw new Error("The graph contains a negative weight cycle");return i}function I(s){let e={},t=[],r;function i(n){n in e||(e[n]=!0,r.push(n),s.successors(n).forEach(i),s.predecessors(n).forEach(i))}return s.nodes().forEach(function(n){r=[],i(n),r.length&&t.push(r)}),t}var _=class{constructor(){this._arr=[];this._keyIndices={}}size(){return this._arr.length}keys(){return this._arr.map(e=>e.key)}has(e){return e in this._keyIndices}priority(e){let t=this._keyIndices[e];if(t!==void 0)return this._arr[t].priority}min(){if(this.size()===0)throw new Error("Queue underflow");return this._arr[0].key}add(e,t){let r=this._keyIndices,i=String(e);if(!(i in r)){let n=this._arr,o=n.length;return r[i]=o,n.push({key:i,priority:t}),this._decrease(o),!0}return!1}removeMin(){this._swap(0,this._arr.length-1);let e=this._arr.pop();return delete this._keyIndices[e.key],this._heapify(0),e.key}decrease(e,t){let r=this._keyIndices[e];if(r===void 0)throw new Error(`Key not found: ${e}`);let i=this._arr[r].priority;if(t>i)throw new Error(`New priority is greater than current priority. Key: ${e} Old: ${i} New: ${t}`);this._arr[r].priority=t,this._decrease(r)}_heapify(e){let t=this._arr,r=2*e,i=r+1,n=e;r<t.length&&(n=t[r].priority<t[n].priority?r:n,i<t.length&&(n=t[i].priority<t[n].priority?i:n),n!==e&&(this._swap(e,n),this._heapify(n)))}_decrease(e){let t=this._arr,r=t[e].priority,i;for(;e!==0&&(i=e>>1,!(t[i].priority<r));)this._swap(e,i),e=i}_swap(e,t){let r=this._arr,i=this._keyIndices,n=r[e],o=r[t];r[e]=o,r[t]=n,i[o.key]=e,i[n.key]=t}};var te=()=>1;function E(s,e,t,r){let i=function(n){return s.outEdges(n)};return re(s,String(e),t||te,r||i)}function re(s,e,t,r){let i={},n=new _,o,d,a=function(c){let h=c.v!==o?c.v:c.w,u=i[h],g=t(c),f=d.distance+g;if(g<0)throw new Error("dijkstra does not allow negative edge weights. Bad edge: "+c+" Weight: "+g);f<u.distance&&(u.distance=f,u.predecessor=o,n.decrease(h,f))};for(s.nodes().forEach(function(c){let h=c===e?0:Number.POSITIVE_INFINITY;i[c]={distance:h,predecessor:""},n.add(c,h)});n.size()>0&&(o=n.removeMin(),d=i[o],d.distance!==Number.POSITIVE_INFINITY);)r(o).forEach(a);return i}function D(s,e,t){return s.nodes().reduce(function(r,i){return r[i]=E(s,i,e,t),r},{})}function L(s){let e=0,t=[],r={},i=[];function n(o){let d=r[o]={onStack:!0,lowlink:e,index:e++};if(t.push(o),s.successors(o).forEach(function(a){a in r?r[a].onStack&&(d.lowlink=Math.min(d.lowlink,r[a].index)):(n(a),d.lowlink=Math.min(d.lowlink,r[a].lowlink))}),d.lowlink===d.index){let a=[],c;do c=t.pop(),r[c].onStack=!1,a.push(c);while(o!==c);i.push(a)}}return s.nodes().forEach(function(o){o in r||n(o)}),i}function O(s){return L(s).filter(function(e){return e.length>1||e.length===1&&s.hasEdge(e[0],e[0])})}var ne=()=>1;function j(s,e,t){return ie(s,e||ne,t||function(r){return s.outEdges(r)})}function ie(s,e,t){let r={},i=s.nodes();return i.forEach(function(n){r[n]={},r[n][n]={distance:0,predecessor:""},i.forEach(function(o){n!==o&&(r[n][o]={distance:Number.POSITIVE_INFINITY,predecessor:""})}),t(n).forEach(function(o){let d=o.v===n?o.w:o.v,a=e(o);r[n][d]={distance:a,predecessor:n}})}),i.forEach(function(n){let o=r[n];i.forEach(function(d){let a=r[d];i.forEach(function(c){let h=a[n],u=o[c],g=a[c],f=h.distance+u.distance;f<g.distance&&(g.distance=f,g.predecessor=u.predecessor)})})}),r}var p=class extends Error{constructor(...e){super(...e)}};function w(s){let e={},t={},r=[];function i(n){if(n in t)throw new p;n in e||(t[n]=!0,e[n]=!0,s.predecessors(n).forEach(i),delete t[n],r.push(n))}if(s.sinks().forEach(i),Object.keys(e).length!==s.nodeCount())throw new p;return r}function C(s){try{w(s)}catch(e){if(e instanceof p)return!1;throw e}return!0}function T(s,e,t,r,i){Array.isArray(e)||(e=[e]);let n=(d=>{var a;return(a=s.isDirected()?s.successors(d):s.neighbors(d))!=null?a:[]}),o={};return e.forEach(function(d){if(!s.hasNode(d))throw new Error("Graph does not have node: "+d);i=A(s,d,t==="post",o,n,r,i)}),i}function A(s,e,t,r,i,n,o){return e in r||(r[e]=!0,t||(o=n(o,e)),i(e).forEach(function(d){o=A(s,d,t,r,i,n,o)}),t&&(o=n(o,e))),o}function N(s,e,t){return T(s,e,t,function(r,i){return r.push(i),r},[])}function W(s,e){return N(s,e,"post")}function S(s,e){return N(s,e,"pre")}function M(s,e){let t=new l,r={},i=new _,n;function o(a){let c=a.v===n?a.w:a.v,h=i.priority(c);if(h!==void 0){let u=e(a);u<h&&(r[c]=n,i.decrease(c,u))}}if(s.nodeCount()===0)return t;s.nodes().forEach(function(a){i.add(a,Number.POSITIVE_INFINITY),t.setNode(a)}),i.decrease(s.nodes()[0],0);let d=!1;for(;i.size()>0;){if(n=i.removeMin(),n in r)t.setEdge(n,r[n]);else{if(d)throw new Error("Input graph is not connected: "+s);d=!0}s.nodeEdges(n).forEach(o)}return t}function V(s,e,t,r){return se(s,e,t,r!=null?r:(i=>{let n=s.outEdges(i);return n!=null?n:[]}))}function se(s,e,t,r){if(t===void 0)return E(s,e,t,r);let i=!1,n=s.nodes();for(let o=0;o<n.length;o++){let d=r(n[o]);for(let a=0;a<d.length;a++){let c=d[a],h=c.v===n[o]?c.v:c.w,u=h===c.v?c.w:c.v;t({v:h,w:u})<0&&(i=!0)}if(i)return y(s,e,t,r)}return E(s,e,t,r)}0&&(0);
//# sourceMappingURL=graphlib.cjs.js.map


/***/ },

/***/ 432
(module) {

// Simple, internal Object.assign() polyfill for options objects etc.

module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt) {
  for (var _len = arguments.length, srcs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    srcs[_key - 1] = arguments[_key];
  }
  srcs.forEach(function (src) {
    Object.keys(src).forEach(function (k) {
      return tgt[k] = src[k];
    });
  });
  return tgt;
};

/***/ },

/***/ 299
(module) {

/** 
 * Dagre algorithmic options. The default value of dagre.js is used
 * when the option is left undefined here.
 */
var defaults = {
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
  ranker: undefined,
  /**
   * Number of ranks to keep between the source and target of the edge
   */
  minLen: function minLen(_edge) {
    return 1;
  },
  /**
   * Higher weight edges are generally made shorter and straighter than lower weight edges} _edge 
   */
  edgeWeight: function edgeWeight(_edge) {
    return 1;
  },
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
  automaticDagreEdgeStyle: this.useDagreEdgeControlPoints,
  /**
   * Defines the style for rendering dagre edge control points stored by the layout algorithm
   * if `useDagreEdgeControlPoints` is `true` and `automaticDagreEdgeStyle` is `true`
   */
  dagreEdgeStyle: {
    'curve-style': 'unbundled-bezier',
    'control-point-weights': function controlPointWeights(ele) {
      return ele.scratch('controlPointWeights');
    },
    'control-point-distances': function controlPointDistances(ele) {
      return ele.scratch('controlPointDistances');
    },
    'edge-distances': 'intersection',
    'edge-ends-overlap': false
  },
  /**
   * Whether to transition the node positions
   */
  animate: false,
  /**
   * Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
   */
  animateFilter: function animateFilter(_node, i) {
    return true;
  },
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
  transform: function transform(node, pos) {
    return pos;
  },
  /**
   * On layoutready execute this function
   */
  ready: function ready() {},
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
  stop: function stop() {}
};
module.exports = defaults;

/***/ },

/***/ 497
(module, __unused_webpack_exports, __webpack_require__) {

var impl = __webpack_require__(539);

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('layout', 'dagre', impl); // register with cytoscape.js
};
if (typeof window !== 'undefined' && typeof window.cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(window.cytoscape);
}
module.exports = register;

/***/ },

/***/ 539
(module, __unused_webpack_exports, __webpack_require__) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var isFunction = function isFunction(o) {
  return typeof o === 'function';
};
var defaults = __webpack_require__(299);
var assign = __webpack_require__(432);
var dagre = __webpack_require__(155);
var EPSILON = 0.001; // what does it mean to be too close to 0?

// constructor
// options : object containing layout options
function DagreLayout(options) {
  this.options = assign({}, defaults, options);
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
  var len = Math.hypot(v.x, v.y) || 1;
  return {
    x: v.x / len,
    y: v.y / len,
    len: len
  };
}
function perp(v) {
  return {
    x: -v.y,
    y: v.x
  };
}

/* provides the context for mapping from dagre's x, y coordinate system
 * for control points to cytoscapes coordinate system for control points
 * which is relative to the straight vector from source to target node
 */
function buildEdgeFrame(src, tgt) {
  var d = subtract(tgt, src);
  var _norm = norm(d),
    x = _norm.x,
    y = _norm.y,
    len = _norm.len;
  var dir = {
    x: x,
    y: y
  };
  var normal = perp(dir);
  return {
    src: src,
    tgt: tgt,
    dir: dir,
    normal: normal,
    len: len
  };
}
function noZero(x) {
  if (Math.abs(x) < EPSILON) {
    return x < 0 ? -EPSILON : EPSILON;
  }
  return x;
}
function toEdgeCoordinates(P, frame) {
  var vector = subtract(P, frame.src);
  var weight = noZero(product(vector, frame.dir) / frame.len);
  var distance = noZero(product(vector, frame.normal));
  return {
    weight: weight,
    distance: distance
  };
}
function normalizeWeight(coords) {
  var min = Infinity;
  var max = -Infinity;
  var _iterator = _createForOfIteratorHelper(coords),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var p = _step.value;
      if (p.weight < min) {
        min = p.weight;
      }
      if (p.weight > max) {
        max = p.weight;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var range = max - min || 1;
  return coords.map(function (p) {
    return {
      distance: p.distance,
      weight: (p.weight - min) / range
    };
  });
}

/* First introduce new control points to bridge between the dagre list of 
 * points and the centres of cytoscape nodes.
 * Then we sanitize any empty or non-existing or degenerate control points
 * And finally we map the Dagre coordinates to the Cytoscape coordinated which
 * are relative to the original direction vector from source to target.
 * These final coordinates are stored pairwise in two arrays cpw and cpd
 * which are picked up by the Bezier construction code in cytoscape.
 */
function dagreEdgeToCytoscapeEdge(dEdge, cEdge) {
  var fromNode = cEdge.source().position();
  var toNode = cEdge.target().position();
  var frame = buildEdgeFrame(fromNode, toNode);
  var coords = normalizeWeight(dEdge.points.map(function (p) {
    return toEdgeCoordinates(p, frame);
  }));
  var controlPointWeights = coords.slice(1, -1).map(function (c) {
    return c.weight;
  });
  var controlPointDistances = coords.slice(1, -1).map(function (c) {
    return c.distance;
  });
  var result = {
    controlPointWeights: controlPointWeights,
    controlPointDistances: controlPointDistances
  };
  return result;
}

// runs the layout
DagreLayout.prototype.run = function () {
  var options = this.options;
  var layout = this;
  var cy = options.cy; // cy is automatically populated for us in the constructor
  var eles = options.eles;
  var getVal = function getVal(ele, val) {
    return isFunction(val) ? val.apply(ele, [ele]) : val;
  };
  var bb = options.boundingBox || {
    x1: 0,
    y1: 0,
    w: cy.width(),
    h: cy.height()
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
  var g = new dagre.graphlib.Graph({
    multigraph: true,
    compound: true
  });
  var gObj = {};
  var setGObj = function setGObj(name, val) {
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

  // add nodes to dagre
  var nodes = eles.nodes();
  if (isFunction(options.sort)) {
    nodes = nodes.sort(options.sort);
  }
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var nbb = node.layoutDimensions(options);
    g.setNode(node.id(), {
      width: nbb.w,
      height: nbb.h,
      shape: 'ellipse',
      name: node.id()
    });
  }

  // set compound parents
  for (var _i = 0; _i < nodes.length; _i++) {
    var _node = nodes[_i];
    if (_node.isChild()) {
      g.setParent(_node.id(), _node.parent().id());
    }
  }

  // add edges to dagre
  var edges = eles.edges().stdFilter(function (edge) {
    return !edge.source().isParent() && !edge.target().isParent(); // dagre can't handle edges on compound nodes
  });
  if (isFunction(options.sort)) {
    edges = edges.sort(options.sort);
  }
  for (var _i2 = 0; _i2 < edges.length; _i2++) {
    var edge = edges[_i2];
    g.setEdge(edge.source().id(), edge.target().id(), {
      minlen: getVal(edge, options.minLen),
      weight: getVal(edge, options.edgeWeight),
      name: edge.id()
    }, edge.id());
  }
  dagre.layout(g);
  var gNodeIds = g.nodes();
  for (var _i3 = 0; _i3 < gNodeIds.length; _i3++) {
    var id = gNodeIds[_i3];
    var n = g.node(id);
    cy.getElementById(id).scratch().dagre = n;
  }
  var dagreBB;
  if (options.boundingBox) {
    dagreBB = {
      x1: Infinity,
      x2: -Infinity,
      y1: Infinity,
      y2: -Infinity
    };
    nodes.forEach(function (node) {
      var dModel = node.scratch().dagre;
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
  var constrainPos = function constrainPos(p) {
    if (options.boundingBox) {
      var xPct = dagreBB.w === 0 ? 0 : (p.x - dagreBB.x1) / dagreBB.w;
      var yPct = dagreBB.h === 0 ? 0 : (p.y - dagreBB.y1) / dagreBB.h;
      return {
        x: bb.x1 + xPct * bb.w,
        y: bb.y1 + yPct * bb.h
      };
    } else {
      return p;
    }
  };
  nodes.layoutPositions(layout, options, function (ele) {
    ele = _typeof(ele) === "object" ? ele : this;
    var dModel = ele.scratch().dagre;
    return constrainPos({
      x: dModel.x,
      y: dModel.y
    });
  });
  if (options.useDagreEdgeControlPoints) {
    if (options.automaticDagreEdgeStyle) {
      cy.edges().addClass('useDagreEdgeControlPoints');
      cy.style().selector('edge.useDagreEdgeControlPoints').style(options.dagreEdgeStyle).update();
    }
    g.edges().forEach(function (id) {
      var cyEdge = cy.getElementById(id.name);
      var dEdge = g.edge(id);
      if (dEdge && dEdge.points) {
        cyEdge.scratch(dagreEdgeToCytoscapeEdge(dEdge, cyEdge));
      }
    });
  }
  return this; // chaining
};
module.exports = DagreLayout;

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(497);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});