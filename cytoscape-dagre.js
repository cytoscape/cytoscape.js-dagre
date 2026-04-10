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

var p=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var A=p((ni,D)=>{var q=class{constructor(){let t={};t._next=t._prev=t,this._sentinel=t}dequeue(){let t=this._sentinel,r=t._prev;if(r!==t)return B(r),r}enqueue(t){let r=this._sentinel;t._prev&&t._next&&B(t),t._next=r._next,r._next._prev=t,r._next=t,t._prev=r}toString(){let t=[],r=this._sentinel,n=r._prev;for(;n!==r;)t.push(JSON.stringify(n,vt)),n=n._prev;return"["+t.join(", ")+"]"}};function B(e){e._prev._next=e._next,e._next._prev=e._prev,delete e._next,delete e._prev}function vt(e,t){if(e!=="_next"&&e!=="_prev")return t}D.exports=q});var W=p((ii,Y)=>{var Nt=(__webpack_require__(413).Graph),Ot=A();Y.exports=qt;var It=()=>1;function qt(e,t){if(e.nodeCount()<=1)return[];let r=Rt(e,t||It);return Lt(r.graph,r.buckets,r.zeroIdx).flatMap(i=>e.outEdges(i.v,i.w))}function Lt(e,t,r){let n=[],i=t[t.length-1],a=t[0],o;for(;e.nodeCount();){for(;o=a.dequeue();)L(e,t,r,o);for(;o=i.dequeue();)L(e,t,r,o);if(e.nodeCount()){for(let l=t.length-2;l>0;--l)if(o=t[l].dequeue(),o){n=n.concat(L(e,t,r,o,!0));break}}}return n}function L(e,t,r,n,i){let a=i?[]:void 0;return e.inEdges(n.v).forEach(o=>{let l=e.edge(o),s=e.node(o.v);i&&a.push({v:o.v,w:o.w}),s.out-=l,R(t,r,s)}),e.outEdges(n.v).forEach(o=>{let l=e.edge(o),s=o.w,d=e.node(s);d.in-=l,R(t,r,d)}),e.removeNode(n.v),a}function Rt(e,t){let r=new Nt,n=0,i=0;e.nodes().forEach(l=>{r.setNode(l,{v:l,in:0,out:0})}),e.edges().forEach(l=>{let s=r.edge(l.v,l.w)||0,d=t(l),u=s+d;r.setEdge(l.v,l.w,u),i=Math.max(i,r.node(l.v).out+=d),n=Math.max(n,r.node(l.w).in+=d)});let a=Ct(i+n+3).map(()=>new Ot),o=n+1;return r.nodes().forEach(l=>{R(a,o,r.node(l))}),{graph:r,buckets:a,zeroIdx:o}}function R(e,t,r){r.out?r.in?e[r.out-r.in+t].enqueue(r):e[e.length-1].enqueue(r):e[0].enqueue(r)}function Ct(e){let t=[];for(let r=0;r<e;r++)t.push(r);return t}});var m=p((oi,Q)=>{"use strict";var z=(__webpack_require__(413).Graph);Q.exports={addBorderNode:Ft,addDummyNode:X,applyWithChunking:v,asNonCompoundGraph:Tt,buildLayerMatrix:Pt,intersectRect:St,mapValues:Xt,maxRank:U,normalizeRanks:Gt,notime:Yt,partition:Dt,pick:zt,predecessorWeights:_t,range:K,removeEmptyRanks:Vt,simplify:Mt,successorWeights:jt,time:At,uniqueId:J,zipObject:C};function X(e,t,r,n){for(var i=n;e.hasNode(i);)i=J(n);return r.dummy=t,e.setNode(i,r),i}function Mt(e){let t=new z().setGraph(e.graph());return e.nodes().forEach(r=>t.setNode(r,e.node(r))),e.edges().forEach(r=>{let n=t.edge(r.v,r.w)||{weight:0,minlen:1},i=e.edge(r);t.setEdge(r.v,r.w,{weight:n.weight+i.weight,minlen:Math.max(n.minlen,i.minlen)})}),t}function Tt(e){let t=new z({multigraph:e.isMultigraph()}).setGraph(e.graph());return e.nodes().forEach(r=>{e.children(r).length||t.setNode(r,e.node(r))}),e.edges().forEach(r=>{t.setEdge(r,e.edge(r))}),t}function jt(e){let t=e.nodes().map(r=>{let n={};return e.outEdges(r).forEach(i=>{n[i.w]=(n[i.w]||0)+e.edge(i).weight}),n});return C(e.nodes(),t)}function _t(e){let t=e.nodes().map(r=>{let n={};return e.inEdges(r).forEach(i=>{n[i.v]=(n[i.v]||0)+e.edge(i).weight}),n});return C(e.nodes(),t)}function St(e,t){let r=e.x,n=e.y,i=t.x-r,a=t.y-n,o=e.width/2,l=e.height/2;if(!i&&!a)throw new Error("Not possible to find intersection inside of the rectangle");let s,d;return Math.abs(a)*o>Math.abs(i)*l?(a<0&&(l=-l),s=l*i/a,d=l):(i<0&&(o=-o),s=o,d=o*a/i),{x:r+s,y:n+d}}function Pt(e){let t=K(U(e)+1).map(()=>[]);return e.nodes().forEach(r=>{let n=e.node(r),i=n.rank;i!==void 0&&(t[i][n.order]=r)}),t}function Gt(e){let t=e.nodes().map(n=>{let i=e.node(n).rank;return i===void 0?Number.MAX_VALUE:i}),r=v(Math.min,t);e.nodes().forEach(n=>{let i=e.node(n);Object.hasOwn(i,"rank")&&(i.rank-=r)})}function Vt(e){let t=e.nodes().map(o=>e.node(o).rank).filter(o=>o!==void 0),r=v(Math.min,t),n=[];e.nodes().forEach(o=>{let l=e.node(o).rank-r;n[l]||(n[l]=[]),n[l].push(o)});let i=0,a=e.graph().nodeRankFactor;Array.from(n).forEach((o,l)=>{o===void 0&&l%a!==0?--i:o!==void 0&&i&&o.forEach(s=>e.node(s).rank+=i)})}function Ft(e,t,r,n){let i={width:0,height:0};return arguments.length>=4&&(i.rank=r,i.order=n),X(e,"border",i,t)}function Bt(e,t=H){let r=[];for(let n=0;n<e.length;n+=t){let i=e.slice(n,n+t);r.push(i)}return r}var H=65535;function v(e,t){if(t.length>H){let r=Bt(t);return e.apply(null,r.map(n=>e.apply(null,n)))}else return e.apply(null,t)}function U(e){let r=e.nodes().map(n=>{let i=e.node(n).rank;return i===void 0?Number.MIN_VALUE:i});return v(Math.max,r)}function Dt(e,t){let r={lhs:[],rhs:[]};return e.forEach(n=>{t(n)?r.lhs.push(n):r.rhs.push(n)}),r}function At(e,t){let r=Date.now();try{return t()}finally{console.log(e+" time: "+(Date.now()-r)+"ms")}}function Yt(e,t){return t()}var Wt=0;function J(e){var t=++Wt;return e+(""+t)}function K(e,t,r=1){t==null&&(t=e,e=0);let n=a=>a<t;r<0&&(n=a=>t<a);let i=[];for(let a=e;n(a);a+=r)i.push(a);return i}function zt(e,t){let r={};for(let n of t)e[n]!==void 0&&(r[n]=e[n]);return r}function Xt(e,t){let r=t;return typeof t=="string"&&(r=n=>n[t]),Object.entries(e).reduce((n,[i,a])=>(n[i]=r(a,i),n),{})}function C(e,t){return e.reduce((r,n,i)=>(r[n]=t[i],r),{})}});var $=p((ai,Z)=>{"use strict";var Ht=W(),Ut=m().uniqueId;Z.exports={run:Jt,undo:Qt};function Jt(e){(e.graph().acyclicer==="greedy"?Ht(e,r(e)):Kt(e)).forEach(n=>{let i=e.edge(n);e.removeEdge(n),i.forwardName=n.name,i.reversed=!0,e.setEdge(n.w,n.v,i,Ut("rev"))});function r(n){return i=>n.edge(i).weight}}function Kt(e){let t=[],r={},n={};function i(a){Object.hasOwn(n,a)||(n[a]=!0,r[a]=!0,e.outEdges(a).forEach(o=>{Object.hasOwn(r,o.w)?t.push(o):i(o.w)}),delete r[a])}return e.nodes().forEach(i),t}function Qt(e){e.edges().forEach(t=>{let r=e.edge(t);if(r.reversed){e.removeEdge(t);let n=r.forwardName;delete r.reversed,delete r.forwardName,e.setEdge(t.w,t.v,r,n)}})}});var te=p((li,ee)=>{"use strict";var Zt=m();ee.exports={run:$t,undo:tr};function $t(e){e.graph().dummyChains=[],e.edges().forEach(t=>er(e,t))}function er(e,t){let r=t.v,n=e.node(r).rank,i=t.w,a=e.node(i).rank,o=t.name,l=e.edge(t),s=l.labelRank;if(a===n+1)return;e.removeEdge(t);let d,u,h;for(h=0,++n;n<a;++h,++n)l.points=[],u={width:0,height:0,edgeLabel:l,edgeObj:t,rank:n},d=Zt.addDummyNode(e,"edge",u,"_d"),n===s&&(u.width=l.width,u.height=l.height,u.dummy="edge-label",u.labelpos=l.labelpos),e.setEdge(r,d,{weight:l.weight},o),h===0&&e.graph().dummyChains.push(d),r=d;e.setEdge(r,i,{weight:l.weight},o)}function tr(e){e.graph().dummyChains.forEach(t=>{let r=e.node(t),n=r.edgeLabel,i;for(e.setEdge(r.edgeObj,n);r.dummy;)i=e.successors(t)[0],e.removeNode(t),n.points.push({x:r.x,y:r.y}),r.dummy==="edge-label"&&(n.x=r.x,n.y=r.y,n.width=r.width,n.height=r.height),t=i,r=e.node(t)})}});var y=p((si,re)=>{"use strict";var{applyWithChunking:rr}=m();re.exports={longestPath:nr,slack:ir};function nr(e){var t={};function r(n){var i=e.node(n);if(Object.hasOwn(t,n))return i.rank;t[n]=!0;let a=e.outEdges(n).map(l=>l==null?Number.POSITIVE_INFINITY:r(l.w)-e.edge(l).minlen);var o=rr(Math.min,a);return o===Number.POSITIVE_INFINITY&&(o=0),i.rank=o}e.sources().forEach(r)}function ir(e,t){return e.node(t.w).rank-e.node(t.v).rank-e.edge(t).minlen}});var M=p((di,ne)=>{"use strict";var or=(__webpack_require__(413).Graph),N=y().slack;ne.exports=ar;function ar(e){var t=new or({directed:!1}),r=e.nodes()[0],n=e.nodeCount();t.setNode(r,{});for(var i,a;lr(t,e)<n;)i=sr(t,e),a=t.hasNode(i.v)?N(e,i):-N(e,i),dr(t,e,a);return t}function lr(e,t){function r(n){t.nodeEdges(n).forEach(i=>{var a=i.v,o=n===a?i.w:a;!e.hasNode(o)&&!N(t,i)&&(e.setNode(o,{}),e.setEdge(n,o,{}),r(o))})}return e.nodes().forEach(r),e.nodeCount()}function sr(e,t){return t.edges().reduce((n,i)=>{let a=Number.POSITIVE_INFINITY;return e.hasNode(i.v)!==e.hasNode(i.w)&&(a=N(t,i)),a<n[0]?[a,i]:n},[Number.POSITIVE_INFINITY,null])[1]}function dr(e,t,r){e.nodes().forEach(n=>t.node(n).rank+=r)}});var fe=p((ui,he)=>{"use strict";var ur=M(),ie=y().slack,hr=y().longestPath,fr=(__webpack_require__(413).alg).preorder,cr=(__webpack_require__(413).alg).postorder,pr=m().simplify;he.exports=x;x.initLowLimValues=j;x.initCutValues=T;x.calcCutValue=ae;x.leaveEdge=se;x.enterEdge=de;x.exchangeEdges=ue;function x(e){e=pr(e),hr(e);var t=ur(e);j(t),T(t,e);for(var r,n;r=se(t);)n=de(t,e,r),ue(t,e,r,n)}function T(e,t){var r=cr(e,e.nodes());r=r.slice(0,r.length-1),r.forEach(n=>mr(e,t,n))}function mr(e,t,r){var n=e.node(r),i=n.parent;e.edge(r,i).cutvalue=ae(e,t,r)}function ae(e,t,r){var n=e.node(r),i=n.parent,a=!0,o=t.edge(r,i),l=0;return o||(a=!1,o=t.edge(i,r)),l=o.weight,t.nodeEdges(r).forEach(s=>{var d=s.v===r,u=d?s.w:s.v;if(u!==i){var h=d===a,f=t.edge(s).weight;if(l+=h?f:-f,wr(e,r,u)){var c=e.edge(r,u).cutvalue;l+=h?-c:c}}}),l}function j(e,t){arguments.length<2&&(t=e.nodes()[0]),le(e,{},1,t)}function le(e,t,r,n,i){var a=r,o=e.node(n);return t[n]=!0,e.neighbors(n).forEach(l=>{Object.hasOwn(t,l)||(r=le(e,t,r,l,n))}),o.low=a,o.lim=r++,i?o.parent=i:delete o.parent,r}function se(e){return e.edges().find(t=>e.edge(t).cutvalue<0)}function de(e,t,r){var n=r.v,i=r.w;t.hasEdge(n,i)||(n=r.w,i=r.v);var a=e.node(n),o=e.node(i),l=a,s=!1;a.lim>o.lim&&(l=o,s=!0);var d=t.edges().filter(u=>s===oe(e,e.node(u.v),l)&&s!==oe(e,e.node(u.w),l));return d.reduce((u,h)=>ie(t,h)<ie(t,u)?h:u)}function ue(e,t,r,n){var i=r.v,a=r.w;e.removeEdge(i,a),e.setEdge(n.v,n.w,{}),j(e),T(e,t),br(e,t)}function br(e,t){var r=e.nodes().find(i=>!t.node(i).parent),n=fr(e,r);n=n.slice(1),n.forEach(i=>{var a=e.node(i).parent,o=t.edge(i,a),l=!1;o||(o=t.edge(a,i),l=!0),t.node(i).rank=t.node(a).rank+(l?o.minlen:-o.minlen)})}function wr(e,t,r){return e.hasEdge(t,r)}function oe(e,t,r){return r.low<=t.lim&&t.lim<=r.lim}});var be=p((hi,me)=>{"use strict";var Er=y(),pe=Er.longestPath,gr=M(),kr=fe();me.exports=xr;function xr(e){var t=e.graph().ranker;if(t instanceof Function)return t(e);switch(e.graph().ranker){case"network-simplex":ce(e);break;case"tight-tree":vr(e);break;case"longest-path":yr(e);break;case"none":break;default:ce(e)}}var yr=pe;function vr(e){pe(e),gr(e)}function ce(e){kr(e)}});var Ee=p((fi,we)=>{we.exports=Nr;function Nr(e){let t=Ir(e);e.graph().dummyChains.forEach(r=>{let n=e.node(r),i=n.edgeObj,a=Or(e,t,i.v,i.w),o=a.path,l=a.lca,s=0,d=o[s],u=!0;for(;r!==i.w;){if(n=e.node(r),u){for(;(d=o[s])!==l&&e.node(d).maxRank<n.rank;)s++;d===l&&(u=!1)}if(!u){for(;s<o.length-1&&e.node(d=o[s+1]).minRank<=n.rank;)s++;d=o[s]}e.setParent(r,d),r=e.successors(r)[0]}})}function Or(e,t,r,n){let i=[],a=[],o=Math.min(t[r].low,t[n].low),l=Math.max(t[r].lim,t[n].lim),s,d;s=r;do s=e.parent(s),i.push(s);while(s&&(t[s].low>o||l>t[s].lim));for(d=s,s=n;(s=e.parent(s))!==d;)a.push(s);return{path:i.concat(a.reverse()),lca:d}}function Ir(e){let t={},r=0;function n(i){let a=r;e.children(i).forEach(n),t[i]={low:a,lim:r++}}return e.children().forEach(n),t}});var xe=p((ci,ke)=>{var O=m();ke.exports={run:qr,cleanup:Cr};function qr(e){let t=O.addDummyNode(e,"root",{},"_root"),r=Lr(e),n=Object.values(r),i=O.applyWithChunking(Math.max,n)-1,a=2*i+1;e.graph().nestingRoot=t,e.edges().forEach(l=>e.edge(l).minlen*=a);let o=Rr(e)+1;e.children().forEach(l=>ge(e,t,a,o,i,r,l)),e.graph().nodeRankFactor=a}function ge(e,t,r,n,i,a,o){let l=e.children(o);if(!l.length){o!==t&&e.setEdge(t,o,{weight:0,minlen:r});return}let s=O.addBorderNode(e,"_bt"),d=O.addBorderNode(e,"_bb"),u=e.node(o);e.setParent(s,o),u.borderTop=s,e.setParent(d,o),u.borderBottom=d,l.forEach(h=>{ge(e,t,r,n,i,a,h);let f=e.node(h),c=f.borderTop?f.borderTop:h,b=f.borderBottom?f.borderBottom:h,w=f.borderTop?n:2*n,k=c!==b?1:i-a[o]+1;e.setEdge(s,c,{weight:w,minlen:k,nestingEdge:!0}),e.setEdge(b,d,{weight:w,minlen:k,nestingEdge:!0})}),e.parent(o)||e.setEdge(t,s,{weight:0,minlen:i+a[o]})}function Lr(e){var t={};function r(n,i){var a=e.children(n);a&&a.length&&a.forEach(o=>r(o,i+1)),t[n]=i}return e.children().forEach(n=>r(n,1)),t}function Rr(e){return e.edges().reduce((t,r)=>t+e.edge(r).weight,0)}function Cr(e){var t=e.graph();e.removeNode(t.nestingRoot),delete t.nestingRoot,e.edges().forEach(r=>{var n=e.edge(r);n.nestingEdge&&e.removeEdge(r)})}});var Ne=p((pi,ve)=>{var Mr=m();ve.exports=Tr;function Tr(e){function t(r){let n=e.children(r),i=e.node(r);if(n.length&&n.forEach(t),Object.hasOwn(i,"minRank")){i.borderLeft=[],i.borderRight=[];for(let a=i.minRank,o=i.maxRank+1;a<o;++a)ye(e,"borderLeft","_bl",r,i,a),ye(e,"borderRight","_br",r,i,a)}}e.children().forEach(t)}function ye(e,t,r,n,i,a){let o={width:0,height:0,rank:a,borderType:t},l=i[t][a-1],s=Mr.addDummyNode(e,"border",o,r);i[t][a]=s,e.setParent(s,n),l&&e.setEdge(l,s,{weight:1})}});var Le=p((mi,qe)=>{"use strict";qe.exports={adjust:jr,undo:_r};function jr(e){let t=e.graph().rankdir.toLowerCase();(t==="lr"||t==="rl")&&Ie(e)}function _r(e){let t=e.graph().rankdir.toLowerCase();(t==="bt"||t==="rl")&&Sr(e),(t==="lr"||t==="rl")&&(Pr(e),Ie(e))}function Ie(e){e.nodes().forEach(t=>Oe(e.node(t))),e.edges().forEach(t=>Oe(e.edge(t)))}function Oe(e){let t=e.width;e.width=e.height,e.height=t}function Sr(e){e.nodes().forEach(t=>_(e.node(t))),e.edges().forEach(t=>{let r=e.edge(t);r.points.forEach(_),Object.hasOwn(r,"y")&&_(r)})}function _(e){e.y=-e.y}function Pr(e){e.nodes().forEach(t=>S(e.node(t))),e.edges().forEach(t=>{let r=e.edge(t);r.points.forEach(S),Object.hasOwn(r,"x")&&S(r)})}function S(e){let t=e.x;e.x=e.y,e.y=t}});var Me=p((bi,Ce)=>{"use strict";var Re=m();Ce.exports=Gr;function Gr(e){let t={},r=e.nodes().filter(s=>!e.children(s).length),n=r.map(s=>e.node(s).rank),i=Re.applyWithChunking(Math.max,n),a=Re.range(i+1).map(()=>[]);function o(s){if(t[s])return;t[s]=!0;let d=e.node(s);a[d.rank].push(s),e.successors(s).forEach(o)}return r.sort((s,d)=>e.node(s).rank-e.node(d).rank).forEach(o),a}});var je=p((wi,Te)=>{"use strict";var Vr=m().zipObject;Te.exports=Fr;function Fr(e,t){let r=0;for(let n=1;n<t.length;++n)r+=Br(e,t[n-1],t[n]);return r}function Br(e,t,r){let n=Vr(r,r.map((d,u)=>u)),i=t.flatMap(d=>e.outEdges(d).map(u=>({pos:n[u.w],weight:e.edge(u).weight})).sort((u,h)=>u.pos-h.pos)),a=1;for(;a<r.length;)a<<=1;let o=2*a-1;a-=1;let l=new Array(o).fill(0),s=0;return i.forEach(d=>{let u=d.pos+a;l[u]+=d.weight;let h=0;for(;u>0;)u%2&&(h+=l[u+1]),u=u-1>>1,l[u]+=d.weight;s+=d.weight*h}),s}});var Se=p((Ei,_e)=>{_e.exports=Dr;function Dr(e,t=[]){return t.map(r=>{let n=e.inEdges(r);if(n.length){let i=n.reduce((a,o)=>{let l=e.edge(o),s=e.node(o.v);return{sum:a.sum+l.weight*s.order,weight:a.weight+l.weight}},{sum:0,weight:0});return{v:r,barycenter:i.sum/i.weight,weight:i.weight}}else return{v:r}})}});var Ge=p((gi,Pe)=>{"use strict";var Ar=m();Pe.exports=Yr;function Yr(e,t){let r={};e.forEach((i,a)=>{let o=r[i.v]={indegree:0,in:[],out:[],vs:[i.v],i:a};i.barycenter!==void 0&&(o.barycenter=i.barycenter,o.weight=i.weight)}),t.edges().forEach(i=>{let a=r[i.v],o=r[i.w];a!==void 0&&o!==void 0&&(o.indegree++,a.out.push(r[i.w]))});let n=Object.values(r).filter(i=>!i.indegree);return Wr(n)}function Wr(e){let t=[];function r(i){return a=>{a.merged||(a.barycenter===void 0||i.barycenter===void 0||a.barycenter>=i.barycenter)&&zr(i,a)}}function n(i){return a=>{a.in.push(i),--a.indegree===0&&e.push(a)}}for(;e.length;){let i=e.pop();t.push(i),i.in.reverse().forEach(r(i)),i.out.forEach(n(i))}return t.filter(i=>!i.merged).map(i=>Ar.pick(i,["vs","i","barycenter","weight"]))}function zr(e,t){let r=0,n=0;e.weight&&(r+=e.barycenter*e.weight,n+=e.weight),t.weight&&(r+=t.barycenter*t.weight,n+=t.weight),e.vs=t.vs.concat(e.vs),e.barycenter=r/n,e.weight=n,e.i=Math.min(t.i,e.i),t.merged=!0}});var Be=p((ki,Fe)=>{var Xr=m();Fe.exports=Hr;function Hr(e,t){let r=Xr.partition(e,u=>Object.hasOwn(u,"barycenter")),n=r.lhs,i=r.rhs.sort((u,h)=>h.i-u.i),a=[],o=0,l=0,s=0;n.sort(Ur(!!t)),s=Ve(a,i,s),n.forEach(u=>{s+=u.vs.length,a.push(u.vs),o+=u.barycenter*u.weight,l+=u.weight,s=Ve(a,i,s)});let d={vs:a.flat(!0)};return l&&(d.barycenter=o/l,d.weight=l),d}function Ve(e,t,r){let n;for(;t.length&&(n=t[t.length-1]).i<=r;)t.pop(),e.push(n.vs),r++;return r}function Ur(e){return(t,r)=>t.barycenter<r.barycenter?-1:t.barycenter>r.barycenter?1:e?r.i-t.i:t.i-r.i}});var Ye=p((xi,Ae)=>{var Jr=Se(),Kr=Ge(),Qr=Be();Ae.exports=De;function De(e,t,r,n){let i=e.children(t),a=e.node(t),o=a?a.borderLeft:void 0,l=a?a.borderRight:void 0,s={};o&&(i=i.filter(f=>f!==o&&f!==l));let d=Jr(e,i);d.forEach(f=>{if(e.children(f.v).length){let c=De(e,f.v,r,n);s[f.v]=c,Object.hasOwn(c,"barycenter")&&$r(f,c)}});let u=Kr(d,r);Zr(u,s);let h=Qr(u,n);if(o&&(h.vs=[o,h.vs,l].flat(!0),e.predecessors(o).length)){let f=e.node(e.predecessors(o)[0]),c=e.node(e.predecessors(l)[0]);Object.hasOwn(h,"barycenter")||(h.barycenter=0,h.weight=0),h.barycenter=(h.barycenter*h.weight+f.order+c.order)/(h.weight+2),h.weight+=2}return h}function Zr(e,t){e.forEach(r=>{r.vs=r.vs.flatMap(n=>t[n]?t[n].vs:n)})}function $r(e,t){e.barycenter!==void 0?(e.barycenter=(e.barycenter*e.weight+t.barycenter*t.weight)/(e.weight+t.weight),e.weight+=t.weight):(e.barycenter=t.barycenter,e.weight=t.weight)}});var ze=p((yi,We)=>{var en=(__webpack_require__(413).Graph),tn=m();We.exports=rn;function rn(e,t,r,n){n||(n=e.nodes());let i=nn(e),a=new en({compound:!0}).setGraph({root:i}).setDefaultNodeLabel(o=>e.node(o));return n.forEach(o=>{let l=e.node(o),s=e.parent(o);(l.rank===t||l.minRank<=t&&t<=l.maxRank)&&(a.setNode(o),a.setParent(o,s||i),e[r](o).forEach(d=>{let u=d.v===o?d.w:d.v,h=a.edge(u,o),f=h!==void 0?h.weight:0;a.setEdge(u,o,{weight:e.edge(d).weight+f})}),Object.hasOwn(l,"minRank")&&a.setNode(o,{borderLeft:l.borderLeft[t],borderRight:l.borderRight[t]}))}),a}function nn(e){for(var t;e.hasNode(t=tn.uniqueId("_root")););return t}});var He=p((vi,Xe)=>{Xe.exports=on;function on(e,t,r){let n={},i;r.forEach(a=>{let o=e.parent(a),l,s;for(;o;){if(l=e.parent(o),l?(s=n[l],n[l]=o):(s=i,i=o),s&&s!==o){t.setEdge(s,o);return}o=l}})}});var Ze=p((Ni,Qe)=>{"use strict";var an=Me(),ln=je(),sn=Ye(),dn=ze(),un=He(),hn=(__webpack_require__(413).Graph),I=m();Qe.exports=Ke;function Ke(e,t={}){if(typeof t.customOrder=="function"){t.customOrder(e,Ke);return}let r=I.maxRank(e),n=Ue(e,I.range(1,r+1),"inEdges"),i=Ue(e,I.range(r-1,-1,-1),"outEdges"),a=an(e);if(Je(e,a),t.disableOptimalOrderHeuristic)return;let o=Number.POSITIVE_INFINITY,l,s=t.constraints||[];for(let d=0,u=0;u<4;++d,++u){fn(d%2?n:i,d%4>=2,s),a=I.buildLayerMatrix(e);let h=ln(e,a);h<o?(u=0,l=Object.assign({},a),o=h):h===o&&(l=structuredClone(a))}Je(e,l)}function Ue(e,t,r){let n=new Map,i=(a,o)=>{n.has(a)||n.set(a,[]),n.get(a).push(o)};for(let a of e.nodes()){let o=e.node(a);if(typeof o.rank=="number"&&i(o.rank,a),typeof o.minRank=="number"&&typeof o.maxRank=="number")for(let l=o.minRank;l<=o.maxRank;l++)l!==o.rank&&i(l,a)}return t.map(function(a){return dn(e,a,r,n.get(a)||[])})}function fn(e,t,r){let n=new hn;e.forEach(function(i){r.forEach(l=>n.setEdge(l.left,l.right));let a=i.graph().root,o=sn(i,a,n,t);o.vs.forEach((l,s)=>i.node(l).order=s),un(i,n,o.vs)})}function Je(e,t){Object.values(t).forEach(r=>r.forEach((n,i)=>e.node(n).order=i))}});var st=p((Oi,lt)=>{"use strict";var cn=(__webpack_require__(413).Graph),g=m();lt.exports={positionX:bn,findType1Conflicts:$e,findType2Conflicts:et,addConflict:P,hasConflict:tt,verticalAlignment:rt,horizontalCompaction:nt,alignCoordinates:ot,findSmallestWidthAlignment:it,balance:at};function $e(e,t){let r={};function n(i,a){let o=0,l=0,s=i.length,d=a[a.length-1];return a.forEach((u,h)=>{let f=pn(e,u),c=f?e.node(f).order:s;(f||u===d)&&(a.slice(l,h+1).forEach(b=>{e.predecessors(b).forEach(w=>{let k=e.node(w),F=k.order;(F<o||c<F)&&!(k.dummy&&e.node(b).dummy)&&P(r,w,b)})}),l=h+1,o=c)}),a}return t.length&&t.reduce(n),r}function et(e,t){let r={};function n(a,o,l,s,d){let u;g.range(o,l).forEach(h=>{u=a[h],e.node(u).dummy&&e.predecessors(u).forEach(f=>{let c=e.node(f);c.dummy&&(c.order<s||c.order>d)&&P(r,f,u)})})}function i(a,o){let l=-1,s,d=0;return o.forEach((u,h)=>{if(e.node(u).dummy==="border"){let f=e.predecessors(u);f.length&&(s=e.node(f[0]).order,n(o,d,h,l,s),d=h,l=s)}n(o,d,o.length,s,a.length)}),o}return t.length&&t.reduce(i),r}function pn(e,t){if(e.node(t).dummy)return e.predecessors(t).find(r=>e.node(r).dummy)}function P(e,t,r){if(t>r){let i=t;t=r,r=i}let n=e[t];n||(e[t]=n={}),n[r]=!0}function tt(e,t,r){if(t>r){let n=t;t=r,r=n}return!!e[t]&&Object.hasOwn(e[t],r)}function rt(e,t,r,n){let i={},a={},o={};return t.forEach(l=>{l.forEach((s,d)=>{i[s]=s,a[s]=s,o[s]=d})}),t.forEach(l=>{let s=-1;l.forEach(d=>{let u=n(d);if(u.length){u=u.sort((f,c)=>o[f]-o[c]);let h=(u.length-1)/2;for(let f=Math.floor(h),c=Math.ceil(h);f<=c;++f){let b=u[f];a[d]===d&&s<o[b]&&!tt(r,d,b)&&(a[b]=d,a[d]=i[d]=i[b],s=o[b])}}})}),{root:i,align:a}}function nt(e,t,r,n,i){let a={},o=mn(e,t,r,i),l=i?"borderLeft":"borderRight";function s(h,f){let c=o.nodes().slice(),b={},w=c.pop();for(;w;){if(b[w])h(w);else{b[w]=!0,c.push(w);for(let k of f(w))c.push(k)}w=c.pop()}}function d(h){a[h]=o.inEdges(h).reduce((f,c)=>Math.max(f,a[c.v]+o.edge(c)),0)}function u(h){let f=o.outEdges(h).reduce((b,w)=>Math.min(b,a[w.w]-o.edge(w)),Number.POSITIVE_INFINITY),c=e.node(h);f!==Number.POSITIVE_INFINITY&&c.borderType!==l&&(a[h]=Math.max(a[h],f))}return s(d,o.predecessors.bind(o)),s(u,o.successors.bind(o)),Object.keys(n).forEach(h=>a[h]=a[r[h]]),a}function mn(e,t,r,n){let i=new cn,a=e.graph(),o=wn(a.nodesep,a.edgesep,n);return t.forEach(l=>{let s;l.forEach(d=>{let u=r[d];if(i.setNode(u),s){var h=r[s],f=i.edge(h,u);i.setEdge(h,u,Math.max(o(e,d,s),f||0))}s=d})}),i}function it(e,t){return Object.values(t).reduce((r,n)=>{let i=Number.NEGATIVE_INFINITY,a=Number.POSITIVE_INFINITY;Object.entries(n).forEach(([l,s])=>{let d=En(e,l)/2;i=Math.max(s+d,i),a=Math.min(s-d,a)});let o=i-a;return o<r[0]&&(r=[o,n]),r},[Number.POSITIVE_INFINITY,null])[1]}function ot(e,t){let r=Object.values(t),n=g.applyWithChunking(Math.min,r),i=g.applyWithChunking(Math.max,r);["u","d"].forEach(a=>{["l","r"].forEach(o=>{let l=a+o,s=e[l];if(s===t)return;let d=Object.values(s),u=n-g.applyWithChunking(Math.min,d);o!=="l"&&(u=i-g.applyWithChunking(Math.max,d)),u&&(e[l]=g.mapValues(s,h=>h+u))})})}function at(e,t){return g.mapValues(e.ul,(r,n)=>{if(t)return e[t.toLowerCase()][n];{let i=Object.values(e).map(a=>a[n]).sort((a,o)=>a-o);return(i[1]+i[2])/2}})}function bn(e){let t=g.buildLayerMatrix(e),r=Object.assign($e(e,t),et(e,t)),n={},i;["u","d"].forEach(o=>{i=o==="u"?t:Object.values(t).reverse(),["l","r"].forEach(l=>{l==="r"&&(i=i.map(h=>Object.values(h).reverse()));let s=(o==="u"?e.predecessors:e.successors).bind(e),d=rt(e,i,r,s),u=nt(e,i,d.root,d.align,l==="r");l==="r"&&(u=g.mapValues(u,h=>-h)),n[o+l]=u})});let a=it(e,n);return ot(n,a),at(n,e.graph().align)}function wn(e,t,r){return(n,i,a)=>{let o=n.node(i),l=n.node(a),s=0,d;if(s+=o.width/2,Object.hasOwn(o,"labelpos"))switch(o.labelpos.toLowerCase()){case"l":d=-o.width/2;break;case"r":d=o.width/2;break}if(d&&(s+=r?d:-d),d=0,s+=(o.dummy?t:e)/2,s+=(l.dummy?t:e)/2,s+=l.width/2,Object.hasOwn(l,"labelpos"))switch(l.labelpos.toLowerCase()){case"l":d=l.width/2;break;case"r":d=-l.width/2;break}return d&&(s+=r?d:-d),d=0,s}}function En(e,t){return e.node(t).width}});var ht=p((Ii,ut)=>{"use strict";var dt=m(),gn=st().positionX;ut.exports=kn;function kn(e){e=dt.asNonCompoundGraph(e),xn(e),Object.entries(gn(e)).forEach(([t,r])=>e.node(t).x=r)}function xn(e){let t=dt.buildLayerMatrix(e),r=e.graph().ranksep,n=e.graph().rankalign,i=0;t.forEach(a=>{let o=a.reduce((l,s)=>{let d=e.node(s).height;return l>d?l:d},0);a.forEach(l=>{let s=e.node(l);n==="top"?s.y=i+s.height/2:n==="bottom"?s.y=i+o-s.height/2:s.y=i+o/2}),i+=o+r})}});var Et=p((qi,wt)=>{"use strict";var ft=$(),ct=te(),yn=be(),vn=m().normalizeRanks,Nn=Ee(),On=m().removeEmptyRanks,pt=xe(),In=Ne(),mt=Le(),qn=Ze(),Ln=ht(),E=m(),Rn=(__webpack_require__(413).Graph);wt.exports=Cn;function Cn(e,t={}){let r=t.debugTiming?E.time:E.notime;return r("layout",()=>{let n=r("  buildLayoutGraph",()=>Bn(e));return r("  runLayout",()=>Mn(n,r,t)),r("  updateInputGraph",()=>Tn(e,n)),n})}function Mn(e,t,r){t("    makeSpaceForEdgeLabels",()=>Dn(e)),t("    removeSelfEdges",()=>Kn(e)),t("    acyclic",()=>ft.run(e)),t("    nestingGraph.run",()=>pt.run(e)),t("    rank",()=>yn(E.asNonCompoundGraph(e))),t("    injectEdgeLabelProxies",()=>An(e)),t("    removeEmptyRanks",()=>On(e)),t("    nestingGraph.cleanup",()=>pt.cleanup(e)),t("    normalizeRanks",()=>vn(e)),t("    assignRankMinMax",()=>Yn(e)),t("    removeEdgeLabelProxies",()=>Wn(e)),t("    normalize.run",()=>ct.run(e)),t("    parentDummyChains",()=>Nn(e)),t("    addBorderSegments",()=>In(e)),t("    order",()=>qn(e,r)),t("    insertSelfEdges",()=>Qn(e)),t("    adjustCoordinateSystem",()=>mt.adjust(e)),t("    position",()=>Ln(e)),t("    positionSelfEdges",()=>Zn(e)),t("    removeBorderNodes",()=>Jn(e)),t("    normalize.undo",()=>ct.undo(e)),t("    fixupEdgeLabelCoords",()=>Hn(e)),t("    undoCoordinateSystem",()=>mt.undo(e)),t("    translateGraph",()=>zn(e)),t("    assignNodeIntersects",()=>Xn(e)),t("    reversePoints",()=>Un(e)),t("    acyclic.undo",()=>ft.undo(e))}function Tn(e,t){e.nodes().forEach(r=>{let n=e.node(r),i=t.node(r);n&&(n.x=i.x,n.y=i.y,n.order=i.order,n.rank=i.rank,t.children(r).length&&(n.width=i.width,n.height=i.height))}),e.edges().forEach(r=>{let n=e.edge(r),i=t.edge(r);n.points=i.points,Object.hasOwn(i,"x")&&(n.x=i.x,n.y=i.y)}),e.graph().width=t.graph().width,e.graph().height=t.graph().height}var jn=["nodesep","edgesep","ranksep","marginx","marginy"],_n={ranksep:50,edgesep:20,nodesep:50,rankdir:"tb",rankalign:"center"},Sn=["acyclicer","ranker","rankdir","align","rankalign"],Pn=["width","height","rank"],bt={width:0,height:0},Gn=["minlen","weight","width","height","labeloffset"],Vn={minlen:1,weight:1,width:0,height:0,labeloffset:10,labelpos:"r"},Fn=["labelpos"];function Bn(e){let t=new Rn({multigraph:!0,compound:!0}),r=V(e.graph());return t.setGraph(Object.assign({},_n,G(r,jn),E.pick(r,Sn))),e.nodes().forEach(n=>{let i=V(e.node(n)),a=G(i,Pn);Object.keys(bt).forEach(o=>{a[o]===void 0&&(a[o]=bt[o])}),t.setNode(n,a),t.setParent(n,e.parent(n))}),e.edges().forEach(n=>{let i=V(e.edge(n));t.setEdge(n,Object.assign({},Vn,G(i,Gn),E.pick(i,Fn)))}),t}function Dn(e){let t=e.graph();t.ranksep/=2,e.edges().forEach(r=>{let n=e.edge(r);n.minlen*=2,n.labelpos.toLowerCase()!=="c"&&(t.rankdir==="TB"||t.rankdir==="BT"?n.width+=n.labeloffset:n.height+=n.labeloffset)})}function An(e){e.edges().forEach(t=>{let r=e.edge(t);if(r.width&&r.height){let n=e.node(t.v),a={rank:(e.node(t.w).rank-n.rank)/2+n.rank,e:t};E.addDummyNode(e,"edge-proxy",a,"_ep")}})}function Yn(e){let t=0;e.nodes().forEach(r=>{let n=e.node(r);n.borderTop&&(n.minRank=e.node(n.borderTop).rank,n.maxRank=e.node(n.borderBottom).rank,t=Math.max(t,n.maxRank))}),e.graph().maxRank=t}function Wn(e){e.nodes().forEach(t=>{let r=e.node(t);r.dummy==="edge-proxy"&&(e.edge(r.e).labelRank=r.rank,e.removeNode(t))})}function zn(e){let t=Number.POSITIVE_INFINITY,r=0,n=Number.POSITIVE_INFINITY,i=0,a=e.graph(),o=a.marginx||0,l=a.marginy||0;function s(d){let u=d.x,h=d.y,f=d.width,c=d.height;t=Math.min(t,u-f/2),r=Math.max(r,u+f/2),n=Math.min(n,h-c/2),i=Math.max(i,h+c/2)}e.nodes().forEach(d=>s(e.node(d))),e.edges().forEach(d=>{let u=e.edge(d);Object.hasOwn(u,"x")&&s(u)}),t-=o,n-=l,e.nodes().forEach(d=>{let u=e.node(d);u.x-=t,u.y-=n}),e.edges().forEach(d=>{let u=e.edge(d);u.points.forEach(h=>{h.x-=t,h.y-=n}),Object.hasOwn(u,"x")&&(u.x-=t),Object.hasOwn(u,"y")&&(u.y-=n)}),a.width=r-t+o,a.height=i-n+l}function Xn(e){e.edges().forEach(t=>{let r=e.edge(t),n=e.node(t.v),i=e.node(t.w),a,o;r.points?(a=r.points[0],o=r.points[r.points.length-1]):(r.points=[],a=i,o=n),r.points.unshift(E.intersectRect(n,a)),r.points.push(E.intersectRect(i,o))})}function Hn(e){e.edges().forEach(t=>{let r=e.edge(t);if(Object.hasOwn(r,"x"))switch((r.labelpos==="l"||r.labelpos==="r")&&(r.width-=r.labeloffset),r.labelpos){case"l":r.x-=r.width/2+r.labeloffset;break;case"r":r.x+=r.width/2+r.labeloffset;break}})}function Un(e){e.edges().forEach(t=>{let r=e.edge(t);r.reversed&&r.points.reverse()})}function Jn(e){e.nodes().forEach(t=>{if(e.children(t).length){let r=e.node(t),n=e.node(r.borderTop),i=e.node(r.borderBottom),a=e.node(r.borderLeft[r.borderLeft.length-1]),o=e.node(r.borderRight[r.borderRight.length-1]);r.width=Math.abs(o.x-a.x),r.height=Math.abs(i.y-n.y),r.x=a.x+r.width/2,r.y=n.y+r.height/2}}),e.nodes().forEach(t=>{e.node(t).dummy==="border"&&e.removeNode(t)})}function Kn(e){e.edges().forEach(t=>{if(t.v===t.w){var r=e.node(t.v);r.selfEdges||(r.selfEdges=[]),r.selfEdges.push({e:t,label:e.edge(t)}),e.removeEdge(t)}})}function Qn(e){var t=E.buildLayerMatrix(e);t.forEach(r=>{var n=0;r.forEach((i,a)=>{var o=e.node(i);o.order=a+n,(o.selfEdges||[]).forEach(l=>{E.addDummyNode(e,"selfedge",{width:l.label.width,height:l.label.height,rank:o.rank,order:a+ ++n,e:l.e,label:l.label},"_se")}),delete o.selfEdges})})}function Zn(e){e.nodes().forEach(t=>{var r=e.node(t);if(r.dummy==="selfedge"){var n=e.node(r.e.v),i=n.x+n.width/2,a=n.y,o=r.x-i,l=n.height/2;e.setEdge(r.e,r.label),e.removeNode(t),r.label.points=[{x:i+2*o/3,y:a-l},{x:i+5*o/6,y:a-l},{x:i+o,y:a},{x:i+5*o/6,y:a+l},{x:i+2*o/3,y:a+l}],r.label.x=r.x,r.label.y=r.y}})}function G(e,t){return E.mapValues(E.pick(e,t),Number)}function V(e){var t={};return e&&Object.entries(e).forEach(([r,n])=>{typeof r=="string"&&(r=r.toLowerCase()),t[r]=n}),t}});var kt=p((Li,gt)=>{var $n=m(),ei=(__webpack_require__(413).Graph);gt.exports={debugOrdering:ti};function ti(e){let t=$n.buildLayerMatrix(e),r=new ei({compound:!0,multigraph:!0}).setGraph({});return e.nodes().forEach(n=>{r.setNode(n,{label:n}),r.setParent(n,"layer"+e.node(n).rank)}),e.edges().forEach(n=>r.setEdge(n.v,n.w,{},n.name)),t.forEach((n,i)=>{let a="layer"+i;r.setNode(a,{rank:"same"}),n.reduce((o,l)=>(r.setEdge(o,l,{style:"invis"}),l))}),r}});var yt=p((Ri,xt)=>{xt.exports="2.0.4"});module.exports={graphlib:__webpack_require__(413),layout:Et(),debug:kt(),util:{time:m().time,notime:m().notime},version:yt()};
/*! For license information please see dagre.cjs.js.LEGAL.txt */
//# sourceMappingURL=dagre.cjs.js.map


/***/ },

/***/ 413
(module) {

var Oe=Object.defineProperty;var ye=(s,e,r)=>e in s?Oe(s,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):s[e]=r;var f=(s,e)=>()=>(e||s((e={exports:{}}).exports,e),e.exports);var c=(s,e,r)=>ye(s,typeof e!="symbol"?e+"":e,r);var w=f((dr,T)=>{"use strict";var Ne="\0",v="\0",D="",O=class{constructor(e){c(this,"_isDirected",!0);c(this,"_isMultigraph",!1);c(this,"_isCompound",!1);c(this,"_label");c(this,"_defaultNodeLabelFn",()=>{});c(this,"_defaultEdgeLabelFn",()=>{});c(this,"_nodes",{});c(this,"_in",{});c(this,"_preds",{});c(this,"_out",{});c(this,"_sucs",{});c(this,"_edgeObjs",{});c(this,"_edgeLabels",{});c(this,"_nodeCount",0);c(this,"_edgeCount",0);c(this,"_parent");c(this,"_children");e&&(this._isDirected=Object.hasOwn(e,"directed")?e.directed:!0,this._isMultigraph=Object.hasOwn(e,"multigraph")?e.multigraph:!1,this._isCompound=Object.hasOwn(e,"compound")?e.compound:!1),this._isCompound&&(this._parent={},this._children={},this._children[v]={})}isDirected(){return this._isDirected}isMultigraph(){return this._isMultigraph}isCompound(){return this._isCompound}setGraph(e){return this._label=e,this}graph(){return this._label}setDefaultNodeLabel(e){return this._defaultNodeLabelFn=e,typeof e!="function"&&(this._defaultNodeLabelFn=()=>e),this}nodeCount(){return this._nodeCount}nodes(){return Object.keys(this._nodes)}sources(){var e=this;return this.nodes().filter(r=>Object.keys(e._in[r]).length===0)}sinks(){var e=this;return this.nodes().filter(r=>Object.keys(e._out[r]).length===0)}setNodes(e,r){var t=arguments,i=this;return e.forEach(function(n){t.length>1?i.setNode(n,r):i.setNode(n)}),this}setNode(e,r){return Object.hasOwn(this._nodes,e)?(arguments.length>1&&(this._nodes[e]=r),this):(this._nodes[e]=arguments.length>1?r:this._defaultNodeLabelFn(e),this._isCompound&&(this._parent[e]=v,this._children[e]={},this._children[v][e]=!0),this._in[e]={},this._preds[e]={},this._out[e]={},this._sucs[e]={},++this._nodeCount,this)}node(e){return this._nodes[e]}hasNode(e){return Object.hasOwn(this._nodes,e)}removeNode(e){var r=this;if(Object.hasOwn(this._nodes,e)){var t=i=>r.removeEdge(r._edgeObjs[i]);delete this._nodes[e],this._isCompound&&(this._removeFromParentsChildList(e),delete this._parent[e],this.children(e).forEach(function(i){r.setParent(i)}),delete this._children[e]),Object.keys(this._in[e]).forEach(t),delete this._in[e],delete this._preds[e],Object.keys(this._out[e]).forEach(t),delete this._out[e],delete this._sucs[e],--this._nodeCount}return this}setParent(e,r){if(!this._isCompound)throw new Error("Cannot set parent in a non-compound graph");if(r===void 0)r=v;else{r+="";for(var t=r;t!==void 0;t=this.parent(t))if(t===e)throw new Error("Setting "+r+" as parent of "+e+" would create a cycle");this.setNode(r)}return this.setNode(e),this._removeFromParentsChildList(e),this._parent[e]=r,this._children[r][e]=!0,this}_removeFromParentsChildList(e){delete this._children[this._parent[e]][e]}parent(e){if(this._isCompound){var r=this._parent[e];if(r!==v)return r}}children(e=v){if(this._isCompound){var r=this._children[e];if(r)return Object.keys(r)}else{if(e===v)return this.nodes();if(this.hasNode(e))return[]}}predecessors(e){var r=this._preds[e];if(r)return Object.keys(r)}successors(e){var r=this._sucs[e];if(r)return Object.keys(r)}neighbors(e){var r=this.predecessors(e);if(r){let i=new Set(r);for(var t of this.successors(e))i.add(t);return Array.from(i.values())}}isLeaf(e){var r;return this.isDirected()?r=this.successors(e):r=this.neighbors(e),r.length===0}filterNodes(e){var r=new this.constructor({directed:this._isDirected,multigraph:this._isMultigraph,compound:this._isCompound});r.setGraph(this.graph());var t=this;Object.entries(this._nodes).forEach(function([a,o]){e(a)&&r.setNode(a,o)}),Object.values(this._edgeObjs).forEach(function(a){r.hasNode(a.v)&&r.hasNode(a.w)&&r.setEdge(a,t.edge(a))});var i={};function n(a){var o=t.parent(a);return o===void 0||r.hasNode(o)?(i[a]=o,o):o in i?i[o]:n(o)}return this._isCompound&&r.nodes().forEach(a=>r.setParent(a,n(a))),r}setDefaultEdgeLabel(e){return this._defaultEdgeLabelFn=e,typeof e!="function"&&(this._defaultEdgeLabelFn=()=>e),this}edgeCount(){return this._edgeCount}edges(){return Object.values(this._edgeObjs)}setPath(e,r){var t=this,i=arguments;return e.reduce(function(n,a){return i.length>1?t.setEdge(n,a,r):t.setEdge(n,a),a}),this}setEdge(){var e,r,t,i,n=!1,a=arguments[0];typeof a=="object"&&a!==null&&"v"in a?(e=a.v,r=a.w,t=a.name,arguments.length===2&&(i=arguments[1],n=!0)):(e=a,r=arguments[1],t=arguments[3],arguments.length>2&&(i=arguments[2],n=!0)),e=""+e,r=""+r,t!==void 0&&(t=""+t);var o=E(this._isDirected,e,r,t);if(Object.hasOwn(this._edgeLabels,o))return n&&(this._edgeLabels[o]=i),this;if(t!==void 0&&!this._isMultigraph)throw new Error("Cannot set a named edge when isMultigraph = false");this.setNode(e),this.setNode(r),this._edgeLabels[o]=n?i:this._defaultEdgeLabelFn(e,r,t);var h=je(this._isDirected,e,r,t);return e=h.v,r=h.w,Object.freeze(h),this._edgeObjs[o]=h,L(this._preds[r],e),L(this._sucs[e],r),this._in[r][o]=h,this._out[e][o]=h,this._edgeCount++,this}edge(e,r,t){var i=arguments.length===1?m(this._isDirected,arguments[0]):E(this._isDirected,e,r,t);return this._edgeLabels[i]}edgeAsObj(){let e=this.edge(...arguments);return typeof e!="object"?{label:e}:e}hasEdge(e,r,t){var i=arguments.length===1?m(this._isDirected,arguments[0]):E(this._isDirected,e,r,t);return Object.hasOwn(this._edgeLabels,i)}removeEdge(e,r,t){var i=arguments.length===1?m(this._isDirected,arguments[0]):E(this._isDirected,e,r,t),n=this._edgeObjs[i];return n&&(e=n.v,r=n.w,delete this._edgeLabels[i],delete this._edgeObjs[i],F(this._preds[r],e),F(this._sucs[e],r),delete this._in[r][i],delete this._out[e][i],this._edgeCount--),this}inEdges(e,r){return this.isDirected()?this.filterEdges(this._in[e],e,r):this.nodeEdges(e,r)}outEdges(e,r){return this.isDirected()?this.filterEdges(this._out[e],e,r):this.nodeEdges(e,r)}nodeEdges(e,r){if(e in this._nodes)return this.filterEdges({...this._in[e],...this._out[e]},e,r)}filterEdges(e,r,t){if(e){var i=Object.values(e);return t?i.filter(function(n){return n.v===r&&n.w===t||n.v===t&&n.w===r}):i}}};function L(s,e){s[e]?s[e]++:s[e]=1}function F(s,e){--s[e]||delete s[e]}function E(s,e,r,t){var i=""+e,n=""+r;if(!s&&i>n){var a=i;i=n,n=a}return i+D+n+D+(t===void 0?Ne:t)}function je(s,e,r,t){var i=""+e,n=""+r;if(!s&&i>n){var a=i;i=n,n=a}var o={v:i,w:n};return t&&(o.name=t),o}function m(s,e){return E(s,e.v,e.w,e.name)}T.exports=O});var P=f((cr,A)=>{A.exports="3.0.4"});var S=f((lr,M)=>{M.exports={Graph:w(),version:P()}});var V=f((_r,G)=>{var Ie=w();G.exports={write:ke,read:qe};function ke(s){var e={options:{directed:s.isDirected(),multigraph:s.isMultigraph(),compound:s.isCompound()},nodes:xe(s),edges:Ce(s)};return s.graph()!==void 0&&(e.value=structuredClone(s.graph())),e}function xe(s){return s.nodes().map(function(e){var r=s.node(e),t=s.parent(e),i={v:e};return r!==void 0&&(i.value=r),t!==void 0&&(i.parent=t),i})}function Ce(s){return s.edges().map(function(e){var r=s.edge(e),t={v:e.v,w:e.w};return e.name!==void 0&&(t.name=e.name),r!==void 0&&(t.value=r),t})}function qe(s){var e=new Ie(s.options).setGraph(s.value);return s.nodes.forEach(function(r){e.setNode(r.v,r.value),r.parent&&e.setParent(r.v,r.parent)}),s.edges.forEach(function(r){e.setEdge({v:r.v,w:r.w,name:r.name},r.value)}),e}});var y=f((pr,U)=>{U.exports=Le;var De=()=>1;function Le(s,e,r,t){return Fe(s,String(e),r||De,t||function(i){return s.outEdges(i)})}function Fe(s,e,r,t){var i={},n=!0,a=0,o=s.nodes(),h=function(l){var _=r(l);i[l.v].distance+_<i[l.w].distance&&(i[l.w]={distance:i[l.v].distance+_,predecessor:l.v},n=!0)},u=function(){o.forEach(function(l){t(l).forEach(function(_){var q=_.v===l?_.v:_.w,me=q===_.v?_.w:_.v;h({v:q,w:me})})})};o.forEach(function(l){var _=l===e?0:Number.POSITIVE_INFINITY;i[l]={distance:_}});for(var d=o.length,p=1;p<d&&(n=!1,a++,u(),!!n);p++);if(a===d-1&&(n=!1,u(),n))throw new Error("The graph contains a negative weight cycle");return i}});var Y=f((vr,W)=>{W.exports=Te;function Te(s){var e={},r=[],t;function i(n){Object.hasOwn(e,n)||(e[n]=!0,t.push(n),s.successors(n).forEach(i),s.predecessors(n).forEach(i))}return s.nodes().forEach(function(n){t=[],i(n),t.length&&r.push(t)}),r}});var j=f((Er,z)=>{var N=class{constructor(){c(this,"_arr",[]);c(this,"_keyIndices",{})}size(){return this._arr.length}keys(){return this._arr.map(function(e){return e.key})}has(e){return Object.hasOwn(this._keyIndices,e)}priority(e){var r=this._keyIndices[e];if(r!==void 0)return this._arr[r].priority}min(){if(this.size()===0)throw new Error("Queue underflow");return this._arr[0].key}add(e,r){var t=this._keyIndices;if(e=String(e),!Object.hasOwn(t,e)){var i=this._arr,n=i.length;return t[e]=n,i.push({key:e,priority:r}),this._decrease(n),!0}return!1}removeMin(){this._swap(0,this._arr.length-1);var e=this._arr.pop();return delete this._keyIndices[e.key],this._heapify(0),e.key}decrease(e,r){var t=this._keyIndices[e];if(r>this._arr[t].priority)throw new Error("New priority is greater than current priority. Key: "+e+" Old: "+this._arr[t].priority+" New: "+r);this._arr[t].priority=r,this._decrease(t)}_heapify(e){var r=this._arr,t=2*e,i=t+1,n=e;t<r.length&&(n=r[t].priority<r[n].priority?t:n,i<r.length&&(n=r[i].priority<r[n].priority?i:n),n!==e&&(this._swap(e,n),this._heapify(n)))}_decrease(e){for(var r=this._arr,t=r[e].priority,i;e!==0&&(i=e>>1,!(r[i].priority<t));)this._swap(e,i),e=i}_swap(e,r){var t=this._arr,i=this._keyIndices,n=t[e],a=t[r];t[e]=a,t[r]=n,i[a.key]=e,i[n.key]=r}};z.exports=N});var b=f((wr,H)=>{var Ae=j();H.exports=Me;var Pe=()=>1;function Me(s,e,r,t){var i=function(n){return s.outEdges(n)};return Se(s,String(e),r||Pe,t||i)}function Se(s,e,r,t){var i={},n=new Ae,a,o,h=function(u){var d=u.v!==a?u.v:u.w,p=i[d],l=r(u),_=o.distance+l;if(l<0)throw new Error("dijkstra does not allow negative edge weights. Bad edge: "+u+" Weight: "+l);_<p.distance&&(p.distance=_,p.predecessor=a,n.decrease(d,_))};for(s.nodes().forEach(function(u){var d=u===e?0:Number.POSITIVE_INFINITY;i[u]={distance:d},n.add(u,d)});n.size()>0&&(a=n.removeMin(),o=i[a],o.distance!==Number.POSITIVE_INFINITY);)t(a).forEach(h);return i}});var R=f((br,K)=>{var Ge=b();K.exports=Ve;function Ve(s,e,r){return s.nodes().reduce(function(t,i){return t[i]=Ge(s,i,e,r),t},{})}});var Q=f((mr,B)=>{B.exports=Ue;function Ue(s,e,r){if(s[e].predecessor!==void 0)throw new Error("Invalid source vertex");if(s[r].predecessor===void 0&&r!==e)throw new Error("Invalid destination vertex");return{weight:s[r].distance,path:We(s,e,r)}}function We(s,e,r){for(var t=[],i=r;i!==e;)t.push(i),i=s[i].predecessor;return t.push(e),t.reverse()}});var I=f((Or,J)=>{J.exports=Ye;function Ye(s){var e=0,r=[],t={},i=[];function n(a){var o=t[a]={onStack:!0,lowlink:e,index:e++};if(r.push(a),s.successors(a).forEach(function(d){Object.hasOwn(t,d)?t[d].onStack&&(o.lowlink=Math.min(o.lowlink,t[d].index)):(n(d),o.lowlink=Math.min(o.lowlink,t[d].lowlink))}),o.lowlink===o.index){var h=[],u;do u=r.pop(),t[u].onStack=!1,h.push(u);while(a!==u);i.push(h)}}return s.nodes().forEach(function(a){Object.hasOwn(t,a)||n(a)}),i}});var Z=f((yr,X)=>{var ze=I();X.exports=He;function He(s){return ze(s).filter(function(e){return e.length>1||e.length===1&&s.hasEdge(e[0],e[0])})}});var ee=f((Nr,$)=>{$.exports=Re;var Ke=()=>1;function Re(s,e,r){return Be(s,e||Ke,r||function(t){return s.outEdges(t)})}function Be(s,e,r){var t={},i=s.nodes();return i.forEach(function(n){t[n]={},t[n][n]={distance:0},i.forEach(function(a){n!==a&&(t[n][a]={distance:Number.POSITIVE_INFINITY})}),r(n).forEach(function(a){var o=a.v===n?a.w:a.v,h=e(a);t[n][o]={distance:h,predecessor:n}})}),i.forEach(function(n){var a=t[n];i.forEach(function(o){var h=t[o];i.forEach(function(u){var d=h[n],p=a[u],l=h[u],_=d.distance+p.distance;_<l.distance&&(l.distance=_,l.predecessor=p.predecessor)})})}),t}});var k=f((jr,te)=>{function re(s){var e={},r={},t=[];function i(n){if(Object.hasOwn(r,n))throw new g;Object.hasOwn(e,n)||(r[n]=!0,e[n]=!0,s.predecessors(n).forEach(i),delete r[n],t.push(n))}if(s.sinks().forEach(i),Object.keys(e).length!==s.nodeCount())throw new g;return t}var g=class extends Error{constructor(){super(...arguments)}};te.exports=re;re.CycleException=g});var ne=f((Ir,se)=>{var ie=k();se.exports=Qe;function Qe(s){try{ie(s)}catch(e){if(e instanceof ie.CycleException)return!1;throw e}return!0}});var x=f((kr,oe)=>{oe.exports=Je;function Je(s,e,r,t,i){Array.isArray(e)||(e=[e]);var n=(s.isDirected()?s.successors:s.neighbors).bind(s),a={};return e.forEach(function(o){if(!s.hasNode(o))throw new Error("Graph does not have node: "+o);i=ae(s,o,r==="post",a,n,t,i)}),i}function ae(s,e,r,t,i,n,a){return Object.hasOwn(t,e)||(t[e]=!0,r||(a=n(a,e)),i(e).forEach(function(o){a=ae(s,o,r,t,i,n,a)}),r&&(a=n(a,e))),a}});var C=f((xr,ue)=>{var Xe=x();ue.exports=Ze;function Ze(s,e,r){return Xe(s,e,r,function(t,i){return t.push(i),t},[])}});var de=f((Cr,he)=>{var $e=C();he.exports=er;function er(s,e){return $e(s,e,"post")}});var ce=f((qr,fe)=>{var rr=C();fe.exports=tr;function tr(s,e){return rr(s,e,"pre")}});var _e=f((Dr,le)=>{var ir=w(),sr=j();le.exports=nr;function nr(s,e){var r=new ir,t={},i=new sr,n;function a(h){var u=h.v===n?h.w:h.v,d=i.priority(u);if(d!==void 0){var p=e(h);p<d&&(t[u]=n,i.decrease(u,p))}}if(s.nodeCount()===0)return r;s.nodes().forEach(function(h){i.add(h,Number.POSITIVE_INFINITY),r.setNode(h)}),i.decrease(s.nodes()[0],0);for(var o=!1;i.size()>0;){if(n=i.removeMin(),Object.hasOwn(t,n))r.setEdge(n,t[n]);else{if(o)throw new Error("Input graph is not connected: "+s);o=!0}s.nodeEdges(n).forEach(a)}return r}});var Ee=f((Lr,ve)=>{var pe=b(),ar=y();ve.exports=or;function or(s,e,r,t){return ur(s,e,r,t||function(i){return s.outEdges(i)})}function ur(s,e,r,t){if(r===void 0)return pe(s,e,r,t);for(var i=!1,n=s.nodes(),a=0;a<n.length;a++){for(var o=t(n[a]),h=0;h<o.length;h++){var u=o[h],d=u.v===n[a]?u.v:u.w,p=d===u.v?u.w:u.v;r({v:d,w:p})<0&&(i=!0)}if(i)return ar(s,e,r,t)}return pe(s,e,r,t)}});var we=f((Fr,ge)=>{ge.exports={bellmanFord:y(),components:Y(),dijkstra:b(),dijkstraAll:R(),extractPath:Q(),findCycles:Z(),floydWarshall:ee(),isAcyclic:ne(),postorder:de(),preorder:ce(),prim:_e(),shortestPaths:Ee(),reduce:x(),tarjan:I(),topsort:k()}});var be=S();module.exports={Graph:be.Graph,json:V(),alg:we(),version:be.version};
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

var defaults = {
  // dagre algo options, uses default value on undefined
  nodeSep: undefined,
  // the separation between adjacent nodes in the same rank
  edgeSep: undefined,
  // the separation between adjacent edges in the same rank
  rankSep: undefined,
  // the separation between adjacent nodes in the same rank
  rankDir: undefined,
  // 'TB' for top to bottom flow, 'LR' for left to right,
  align: undefined,
  // alignment for rank nodes. Can be 'UL', 'UR', 'DL', or 'DR', where U = up, D = down, L = left, and R = right
  acyclicer: undefined,
  // If set to 'greedy', uses a greedy heuristic for finding a feedback arc set for a graph.
  // A feedback arc set is a set of edges that can be removed to make a graph acyclic.
  ranker: undefined,
  // Type of algorithm to assigns a rank to each node in the input graph.
  // Possible values: network-simplex, tight-tree or longest-path
  minLen: function minLen() {
    return 1;
  },
  // number of ranks to keep between the source and target of the edge
  edgeWeight: function edgeWeight() {
    return 1;
  },
  // higher weight edges are generally made shorter and straighter than lower weight edges

  // general layout options
  fit: true,
  // whether to fit to viewport
  padding: 30,
  // fit padding
  spacingFactor: undefined,
  // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  nodeDimensionsIncludeLabels: false,
  // whether labels should be included in determining the space used by a node
  animate: false,
  // whether to transition the node positions
  animateFilter: function animateFilter() {
    return true;
  },
  // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
  animationDuration: 500,
  // duration of animation in ms if enabled
  animationEasing: undefined,
  // easing of animation if enabled
  boundingBox: undefined,
  // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  transform: function transform(node, pos) {
    return pos;
  },
  // a function that applies a transform to the final node position
  ready: function ready() {},
  // on layoutready
  sort: undefined,
  // a sorting function to order the nodes and edges; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  // because cytoscape dagre creates a directed graph, and directed graphs use the node order as a tie breaker when
  // defining the topology of a graph, this sort function can help ensure the correct order of the nodes/edges.
  // this feature is most useful when adding and removing the same nodes and edges multiple times in a graph.
  stop: function stop() {} // on layoutstop
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
var isFunction = function isFunction(o) {
  return typeof o === 'function';
};
var defaults = __webpack_require__(299);
var assign = __webpack_require__(432);
var dagre = __webpack_require__(155);

// constructor
// options : object containing layout options
function DagreLayout(options) {
  this.options = assign({}, defaults, options);
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
      name: node.id()
    });

    // console.log( g.node(node.id()) );
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

    // console.log( g.edge(edge.source().id(), edge.target().id(), edge.id()) );
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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