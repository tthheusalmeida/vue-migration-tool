'use strict';

const REGEX = {
  TRANSFORMER: {
    DESTROYED: /@hook:destroyed/g,
    BEFORE_DESTROY: /@hook:beforeDestroy/g,
    HOOK: /@hook/g,
    V_ON: /v-on/g,
    DIGIT: /\d+/g,
  },
  COMPILER: {
    RENDER: {
      LINE_SEPARETOR: /[\r\n]/gm,
      FILTER_FUNCTION_COMPLETE: /_f\(".*?"\)|\(.*?\)/g,
      FILTER_FUNCTION: /_f\(".*?"\)/,
      FILTER: /_f\(/,
      OPEN_BRACKETS: /\(/gm,
      CLOSE_BRACKETS: /\)/gm,
      DOUBLE_QUOTE: /\"/gm,
    }
  }
};



module.exports = {
  REGEX
}