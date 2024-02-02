"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = register;
var _layout = _interopRequireDefault(require("./layout.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// registers the extension on a cytoscape lib ref
function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('layout', 'dagre', _layout.default); // register with cytoscape.js
}
;

// This can never happen under the import model since scope is locked down
// However, it will survive the webpacking and still work!
if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}
module.exports = exports.default;