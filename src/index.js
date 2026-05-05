/*
copyright (c) 2016-2018, 2020, 2022, 2026 the cytoscape consortium.

permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “software”), to deal in
the software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the software, and to permit persons to whom the software is furnished to do
so, subject to the following conditions:

the above copyright notice and this permission notice shall be included in all
copies or substantial portions of the software.

the software is provided “as is”, without warranty of any kind, express or
implied, including but not limited to the warranties of merchantability,
fitness for a particular purpose and noninfringement. in no event shall the
authors or copyright holders be liable for any claim, damages or other
liability, whether in an action of contract, tort or otherwise, arising from,
out of or in connection with the software or the use or other dealings in the
software.
*/

const impl = require('./layout');

// registers the extension on a cytoscape lib ref
let register = function( cytoscape ){
  if( !cytoscape ){ return; } // can't register if cytoscape unspecified

  cytoscape( 'layout', 'dagre', impl ); // register with cytoscape.js
};

if( typeof cytoscape !== 'undefined' ){ // expose to global cytoscape (i.e. window.cytoscape)
  register( cytoscape );
}

module.exports = register;
