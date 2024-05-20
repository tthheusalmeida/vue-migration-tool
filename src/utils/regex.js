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
      VUE_COMPONENT_NAME_PASCAL_CASE: /^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/,
      VUE_COMPONENT_NAME_KEBAB_CASE: /^[a-z]+(-[a-z]+)+$/,
      VUE_ITEM_IN_ARRAY: /\(?([\w\s,]+)\)?\s*in\s*([\w\s]+)/,
    }
  }
};



module.exports = {
  REGEX
}