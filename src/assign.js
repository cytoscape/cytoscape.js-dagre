"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// Simple, internal Object.assign() polyfill for options objects etc.

let assign = Object.assign != null ? Object.assign.bind(Object) : function (tgt, ...srcs) {
  srcs.forEach(src => {
    Object.keys(src).forEach(k => tgt[k] = src[k]);
  });
  return tgt;
};
var _default = exports.default = assign;
module.exports = exports.default;