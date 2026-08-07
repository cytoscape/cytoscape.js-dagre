// Simple, internal Object.assign() polyfill for options objects etc.

const assign = Object.assign != null ? Object.assign.bind(Object) : function(tgt: any, ...srcs: any[]): any {
  srcs.forEach(src => {
    if (src != null) {
      Object.keys(src).forEach(k => {
        tgt[k] = src[k];
      });
    }
  });

  return tgt;
};

export default assign;