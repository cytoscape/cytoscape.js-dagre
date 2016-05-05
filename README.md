cytoscape-dagre
================================================================================


## Description

The Dagre layout for DAGs and trees for Cytoscape.js

The `dagre` layout organises the graph using a DAG (directed acyclic graph) system, written by [Chris Pettitt](https://www.linkedin.com/in/chrismpettitt).  It is especially suitable for DAGs and trees.  For more information, please refer to its [Dagre's documentation](https://github.com/cpettitt/dagre).



## Dependencies

 * Cytoscape.js ^2.4.0
 * Dagre ~0.7.4


## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-dagre`,
 * via bower: `bower install cytoscape-dagre`, or
 * via direct download in the repository (probably from a tag).

`require()` the library as appropriate for your project:

CommonJS:
```js
var cytoscape = require('cytoscape');
var cydagre = require('cytoscape-dagre');
var dagre = require('dagre');

cydagre( cytoscape, dagre ); // register extension
```

AMD:
```js
require(['cytoscape', 'cytoscape-dagre'], function( cytoscape, cydagre, dagre ){
  cydagre( cytoscape, dagre ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.


## API

Call the layout, e.g. `cy.layout({ name: 'dagre', ... })`, with options:

```js
var defaults = {
  // dagre algo options, uses default value on undefined
  nodeSep: undefined, // the separation between adjacent nodes in the same rank
  edgeSep: undefined, // the separation between adjacent edges in the same rank
  rankSep: undefined, // the separation between adjacent nodes in the same rank
  rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right
  minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
  edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

  // general layout options
  fit: true, // whether to fit to viewport
  padding: 30, // fit padding
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  ready: function(){}, // on layoutready
  stop: function(){} // on layoutstop
};
```


## Publishing instructions

This project is set up to automatically be published to npm and bower.  To publish:

1. Set the version number environment variable: `export VERSION=1.2.3`
1. Publish: `gulp publish`
1. If publishing to bower for the first time, you'll need to run `bower register cytoscape-dagre https://github.com/cytoscape/cytoscape.js-dagre.git`
