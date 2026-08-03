// Simple, internal Object.assign() polyfill for options objects etc.

const assign =
  Object.assign != null
    ? Object.assign.bind(Object)
    : function <T extends Record<string, any>>(tgt: T, ...srcs: Array<Record<string, any>>): T {
        srcs.forEach((src) => {
          if (src != null) {
            Object.keys(src).forEach((k) => {
              (tgt as Record<string, any>)[k] = src[k];
            });
          }
        });

        return tgt;
      };

export default assign;