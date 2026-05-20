// Simple, internal Object.assign() polyfill for options objects etc.

const assign = Object.assign != null ? Object.assign.bind( Object ) : function( tgt, ...srcs ){
  srcs.forEach( src => {
    Object.keys( src ).forEach( k => tgt[k] = src[k] );
  } );

  return tgt;
};

export default assign;
